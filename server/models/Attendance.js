const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  date: { type: Date, required: true },
  period_time: { type: String }, // e.g. "09:00-10:00"
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  records: [{
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Late'], default: 'Present' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
