const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  // If target_subject_id is present, it's a specific message to subject. Else, global.
  target_subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
