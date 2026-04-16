const mongoose = require('mongoose');

const icaSchema = new mongoose.Schema({
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  marks: {
    m1: { type: Number, default: 0 },
    m2: { type: Number, default: 0 },
    assessment: { type: Number, default: 0 },
  },
  total: { type: Number, default: 0 } // Must auto sum
}, { timestamps: true });

// Pre-save hook to auto calculate total
icaSchema.pre('save', function() {
  this.total = this.marks.m1 + this.marks.m2 + this.marks.assessment;
});

module.exports = mongoose.model('ICA', icaSchema);
