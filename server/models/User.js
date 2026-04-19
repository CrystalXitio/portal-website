const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    required: true,
  },
  // Profile specific fields
  dob: {
    type: Date,
  },
  sap_id: {
    type: String,
  },
  roll_no: {
    type: String,
  },
  faculty_id: {
    type: String,
  },
  admin_id: {
    type: String,
  },
  blood_group: {
    type: String,
  },
  contact_number: {
    type: String,
  },
  address: {
    type: String,
  },
  profile_photo: {
    type: String,
    default: 'https://via.placeholder.com/150', // Replace placeholder with a default avatar later
  },
  // For teachers and students
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  taught_subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
  }],
  // Forgot Password feature
  resetOtp: {
    type: String,
  },
  resetOtpExpiry: {
    type: Date,
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
