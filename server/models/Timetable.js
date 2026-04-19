const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' }, // If default class timetable
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // If specific teacher
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required: true },
  start_time: { type: String, required: true }, // e.g. "09:00"
  end_time: { type: String, required: true }, // e.g. "10:00"
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
