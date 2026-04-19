const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issue_category: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
  admin_reply: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
