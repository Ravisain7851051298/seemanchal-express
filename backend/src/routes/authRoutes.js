const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Generate short-lived Access Token (15 mins)
const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'seemanchal_express_super_secret_jwt_key_2026_secured',
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '15m' }
  );
};

// Generate long-lived Refresh Token (30 days)
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'seemanchal_express_refresh_jwt_key_2026_secured',
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '30d' }
  );
};

// Send dual tokens: Access Token in JSON response, Refresh Token in HttpOnly cookie
const sendTokenResponse = async (user, statusCode, res, message = 'Success') => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Persist refresh token in database for rotation/invalidation
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Cookie options
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction, // HTTPS in production
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    message,
    accessToken,
    // backwards compatibility for any legacy callers
    token: accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      photo: user.photo,
      committeeLevel: user.committeeLevel,
      assignedDesignation: user.assignedDesignation,
      assignedLocation: user.assignedLocation,
      idCardNumber: user.idCardNumber,
      idCardValidUntil: user.idCardValidUntil,
      appointmentReferenceNo: user.appointmentReferenceNo,
      rejectionReason: user.rejectionReason,
    },
  });
};

// @route   POST /api/auth/register-member
// @desc    Register as a member (Application submission)
router.post('/register-member', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      idProofNumber,
      photo,
      idProof,
      address,
      bloodGroup,
      qualifications,
      bio,
    } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, phone, and password' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: 'member',
      status: 'pending',
      idProofNumber: idProofNumber || '',
      photo: photo || '/uploads/default-avatar.png',
      idProof: idProof || '',
      address: address || {},
      bloodGroup: bloodGroup || '',
      qualifications: qualifications || '',
      bio: bio || '',
    });

    return sendTokenResponse(
      user,
      201,
      res,
      'Member application submitted successfully. It is now pending admin review.'
    );
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/auth/register-reporter
// @desc    Register as a reporter (Application submission)
router.post('/register-reporter', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      idProofNumber,
      photo,
      idProof,
      address,
      reportingAreaPreference,
      reportingBeats,
      pressExperienceYears,
      bio,
    } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, phone, and password' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role: 'reporter',
      status: 'pending',
      idProofNumber: idProofNumber || '',
      photo: photo || '/uploads/default-avatar.png',
      idProof: idProof || '',
      address: address || {},
      reportingAreaPreference: reportingAreaPreference || '',
      reportingBeats: reportingBeats || [],
      pressExperienceYears: Number(pressExperienceYears) || 0,
      bio: bio || '',
    });

    return sendTokenResponse(
      user,
      201,
      res,
      'Reporter application submitted successfully. It is now pending admin review.'
    );
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get access token + refresh cookie
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    return sendTokenResponse(user, 200, res, 'Logged in successfully');
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/auth/refresh-token
// @desc    Get a new access token using httpOnly refreshToken cookie
router.post('/refresh-token', async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided in cookies',
      });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'seemanchal_express_refresh_jwt_key_2026_secured'
      );
    } catch (err) {
      // Clear invalid cookie
      res.clearCookie('refreshToken', { path: '/' });
      return res.status(401).json({
        success: false,
        message: 'Refresh token expired or invalid. Please login again.',
      });
    }

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      res.clearCookie('refreshToken', { path: '/' });
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id);

    return res.json({
      success: true,
      accessToken: newAccessToken,
      token: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        photo: user.photo,
        committeeLevel: user.committeeLevel,
        assignedDesignation: user.assignedDesignation,
        assignedLocation: user.assignedLocation,
        idCardNumber: user.idCardNumber,
        idCardValidUntil: user.idCardValidUntil,
        appointmentReferenceNo: user.appointmentReferenceNo,
        rejectionReason: user.rejectionReason,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/auth/logout
// @desc    Clear refresh token from DB and clear httpOnly cookie
router.post('/logout', async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET || 'seemanchal_express_refresh_jwt_key_2026_secured'
        );
        await User.findByIdAndUpdate(decoded.id, { refreshToken: '' });
      } catch (e) {
        // Token might already be expired, proceed to clear cookie
      }
    }

    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/',
    });

    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user details
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, phone, photo, bio, address } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (photo) user.photo = photo;
    if (bio) user.bio = bio;
    if (address) user.address = { ...user.address, ...address };

    await user.save();
    res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change password securely
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new passwords' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
