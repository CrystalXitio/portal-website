const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
  due_date: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);
