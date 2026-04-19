const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  file_url: { type: String, required: true }, // Cloudinary URL
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
