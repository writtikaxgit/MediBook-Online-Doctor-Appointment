const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
    doctorId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date:           { type: String, required: true },  // "YYYY-MM-DD"
    time:           { type: String, required: true },  // "HH:MM AM/PM"
    reason:         { type: String, default: '' },
    status:         { type: String, enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'], default: 'pending' },
    fees:           { type: Number, required: true },
    notes:          { type: String, default: '' },     // doctor notes on rejection/approval
    patientName:    { type: String, required: true },
    patientEmail:   { type: String, required: true },
    patientPhone:   { type: String, default: '' },
    doctorName:     { type: String, required: true },
    specialization: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
