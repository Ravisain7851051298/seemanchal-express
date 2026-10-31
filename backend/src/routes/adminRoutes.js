const express = require('express');
const router = express.Router();
const User = require('../models/User');
const News = require('../models/News');
const { protect, authorize } = require('../middleware/auth');

// All routes here require Admin role
router.use(protect, authorize('admin'));

// @route   GET /api/admin/stats
// @desc    Get dashboard metrics & counters
router.get('/stats', async (req, res) => {
  try {
    const totalMembers = await User.countDocuments({ role: 'member', status: 'approved' });
    const totalReporters = await User.countDocuments({ role: 'reporter', status: 'approved' });
    const pendingMembers = await User.countDocuments({ role: 'member', status: 'pending' });
    const pendingReporters = await User.countDocuments({ role: 'reporter', status: 'pending' });
    const totalNewsPublished = await News.countDocuments({ status: 'published' });
    const pendingNewsReview = await News.countDocuments({ status: 'pending' });
    
    // Aggregation for total views
    const viewsAgg = await News.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } },
    ]);
    const totalViews = viewsAgg.length > 0 ? viewsAgg[0].totalViews : 0;

    res.json({
      success: true,
      stats: {
        totalMembers,
        totalReporters,
        pendingMembers,
        pendingReporters,
        totalPendingApplications: pendingMembers + pendingReporters,
        totalNewsPublished,
        pendingNewsReview,
        totalViews,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/admin/applications
// @desc    Get applications list with filters
router.get('/applications', async (req, res) => {
  try {
    const { role, status = 'pending', search } = req.query;
    const query = {};

    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const applications = await User.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: applications.length, applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/admin/applications/:id/approve
// @desc    Approve application, assign designation, level, location and generate ID/Appointment
router.post('/applications/:id/approve', async (req, res) => {
  try {
    const {
      assignedDesignation,
      committeeLevel,
      assignedLocation,
      showOnTeamPage = true,
      validYears = 2,
    } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Application user not found' });
    }

    if (!assignedDesignation) {
      return res.status(400).json({ success: false, message: 'Please select an assigned designation/position' });
    }

    // Generate unique ID card number if not existing
    const prefix = user.role === 'reporter' ? 'SE-REP' : 'SE-MEM';
    const year = new Date().getFullYear();
    const count = await User.countDocuments({ role: user.role, status: 'approved' }) + 1;
    const seq = String(count).padStart(4, '0');
    const idCardNumber = user.idCardNumber || `${prefix}-${year}-${seq}`;

    // Validity date
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + (Number(validYears) || 2));

    // Reference number
    const appointmentRef = `SE/APPT/${year}/${seq}`;

    user.status = 'approved';
    user.assignedDesignation = assignedDesignation;
    
    // Validate and sanitize committeeLevel safely
    const validLevels = ['National', 'State', 'District', 'Block', 'Panchayat', 'Ward', 'Press', 'General', 'None'];
    let chosenLevel = committeeLevel || user.committeeLevel;
    if (!chosenLevel || !validLevels.includes(chosenLevel)) {
      chosenLevel = user.role === 'reporter' ? 'Press' : 'District';
    }
    user.committeeLevel = chosenLevel;

    user.assignedLocation = assignedLocation || user.assignedLocation || (user.role === 'reporter' ? 'Field Bureau' : 'Seemanchal Region');
    user.idCardNumber = idCardNumber;
    user.idCardValidUntil = validUntil;
    user.appointmentLetterDate = new Date();
    user.appointmentReferenceNo = appointmentRef;
    user.showOnTeamPage = Boolean(showOnTeamPage);
    user.rejectionReason = '';

    await user.save();

    res.json({
      success: true,
      message: `Application approved! Assigned as ${assignedDesignation} (${committeeLevel} level). ID: ${idCardNumber}`,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   POST /api/admin/applications/:id/reject
// @desc    Reject application with optional reason
router.post('/applications/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.status = 'rejected';
    user.rejectionReason = reason || 'Your application did not meet our current requirements.';
    user.showOnTeamPage = false;
    await user.save();

    res.json({ success: true, message: 'Application has been rejected', user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users (members, reporters, admins)
router.get('/users', async (req, res) => {
  try {
    const { role, status, search, level } = req.query;
    const query = {};

    if (role) query.role = role;
    if (status) query.status = status;
    if (level) query.committeeLevel = level;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { idCardNumber: { $regex: search, $options: 'i' } },
        { assignedDesignation: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user details, designation, team visibility, status
router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const allowedFields = [
      'name', 'phone', 'role', 'status', 'assignedDesignation',
      'committeeLevel', 'assignedLocation', 'showOnTeamPage', 'bio',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();
    res.json({ success: true, message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.role === 'admin' && user.email === 'admin@seemanchalexpress.in') {
      return res.status(400).json({ success: false, message: 'Cannot delete primary admin account' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   GET /api/admin/news
// @desc    Get all news (including drafts, pending reviews, published)
router.get('/news', async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { authorName: { $regex: search, $options: 'i' } },
      ];
    }

    const news = await News.find(query)
      .populate('category', 'name nameHindi slug')
      .populate('author', 'name email phone role photo assignedDesignation assignedLocation committeeLevel bio idCardNumber')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: news.length, news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route   PUT /api/admin/news/:id/status
// @desc    Approve or reject reporter news
router.put('/news/:id/status', async (req, res) => {
  try {
    const { status, rejectionReason, isBreaking, isFeatured, isTrending } = req.body;
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: 'News not found' });

    if (status) {
      news.status = status;
      if (status === 'published' && !news.publishedAt) {
        news.publishedAt = new Date();
      }
    }

    if (rejectionReason !== undefined) news.rejectionReason = rejectionReason;
    if (isBreaking !== undefined) news.isBreaking = Boolean(isBreaking);
    if (isFeatured !== undefined) news.isFeatured = Boolean(isFeatured);
    if (isTrending !== undefined) news.isTrending = Boolean(isTrending);

    await news.save();
    res.json({ success: true, message: `News status changed to ${status}`, news });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
