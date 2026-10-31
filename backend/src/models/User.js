const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'reporter', 'member'],
    default: 'member',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'active', 'suspended'],
    default: 'pending',
  },
  photo: {
    type: String,
    default: '/uploads/default-avatar.png',
  },
  idProof: {
    type: String, // Path or URL to Aadhaar / Voter ID / Press Card scan
    default: '',
  },
  idProofNumber: {
    type: String,
    default: '',
  },
  address: {
    street: { type: String, default: '' },
    villageOrWard: { type: String, default: '' },
    panchayatOrBlock: { type: String, default: '' },
    district: { type: String, default: '' },
    state: { type: String, default: 'Bihar' },
    pincode: { type: String, default: '' },
  },
  // Administrative Assignment Details
  committeeLevel: {
    type: String,
    enum: ['National', 'State', 'District', 'Block', 'Panchayat', 'Ward', 'Press', 'General', 'None'],
    default: 'General',
  },
  assignedDesignation: {
    type: String,
    default: '',
  },
  assignedLocation: {
    type: String,
    default: '',
  },
  idCardNumber: {
    type: String,
    default: '',
  },
  idCardValidUntil: {
    type: Date,
  },
  showOnTeamPage: {
    type: Boolean,
    default: false,
  },
  appointmentLetterDate: {
    type: Date,
  },
  appointmentReferenceNo: {
    type: String,
    default: '',
  },
  // Reporter specific fields
  reportingBeats: [{
    type: String,
  }],
  reportingAreaPreference: {
    type: String,
    default: '',
  },
  pressExperienceYears: {
    type: Number,
    default: 0,
  },
  // Member specific fields
  bloodGroup: {
    type: String,
    default: '',
  },
  qualifications: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  rejectionReason: {
    type: String,
    default: '',
  },
  refreshToken: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
