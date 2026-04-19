const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. B.Tech Computer Science
  duration_years: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
