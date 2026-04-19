const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    specialization: { type: String, required: true },
    experience:     { type: Number, required: true, min: 0 },
    fees:           { type: Number, required: true, min: 0 },
    phone:          { type: String, default: '' },
    address:        { type: String, default: '' },
    bio:            { type: String, default: '' },
    hospital:       { type: String, default: '' },
    timings: {
      start: { type: String, default: '09:00' },
      end:   { type: String, default: '17:00' },
    },
    availableDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    photo:      { type: String, default: '' },
    isApproved: { type: Boolean, default: false },
    isActive:   { type: Boolean, default: true },
    rating:     { type: Number, default: 4.5, min: 1, max: 5 },
    totalRatings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Virtual to populate user name/email
doctorSchema.virtual('user', {
  ref:          'User',
  localField:   'userId',
  foreignField: '_id',
  justOne:      true,
});

doctorSchema.set('toJSON',   { virtuals: true });
doctorSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Doctor', doctorSchema);
