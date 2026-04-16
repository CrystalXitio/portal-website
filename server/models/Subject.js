const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. Computer Vision
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  credits: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
