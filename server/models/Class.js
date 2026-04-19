const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. CSE-A
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  semester: { type: Number, required: true }, // e.g. 1st, 2nd..
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
