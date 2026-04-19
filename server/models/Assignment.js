const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  question_file_url: { type: String }, // Cloudinary URL
  due_date: { type: Date },
  submissions: [{
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    answer_file_url: { type: String }, // Cloudinary URL
    submitted_at: { type: Date, default: Date.now },
  }]
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
