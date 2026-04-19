const express     = require('express');
const router      = express.Router();
const Appointment = require('../models/Appointment');
const Doctor      = require('../models/Doctor');
const { protect, doctorOnly } = require('../middleware/auth');

// POST /api/appointments  — patient books
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role === 'doctor' || req.user.role === 'admin')
      return res.status(403).json({ message: 'Only patients can book appointments' });

    const { doctorId, date, time, reason, patientPhone } = req.body;
    if (!doctorId || !date || !time)
      return res.status(400).json({ message: 'Doctor, date and time are required' });

    const doctor = await Doctor.findById(doctorId).populate('userId', 'name');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    if (!doctor.isApproved) return res.status(400).json({ message: 'Doctor is not available' });

    // Prevent double-booking same slot
    const conflict = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: { $in: ['pending', 'approved'] },
    });
    if (conflict) return res.status(400).json({ message: 'This time slot is already booked' });

    const appt = await Appointment.create({
      patientId:      req.user._id,
      doctorId,
      date,
      time,
      reason:         reason || '',
      fees:           doctor.fees,
      patientName:    req.user.name,
      patientEmail:   req.user.email,
      patientPhone:   patientPhone || req.user.phone || '',
      doctorName:     doctor.userId?.name || 'Doctor',
      specialization: doctor.specialization,
    });

    res.status(201).json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/appointments/patient  — patient's own bookings
router.get('/patient', protect, async (req, res) => {
  try {
    const list = await Appointment.find({ patientId: req.user._id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/appointments/doctor  — doctor's incoming bookings
router.get('/doctor', protect, doctorOnly, async (req, res) => {
  try {
    const doc = await Doctor.findOne({ userId: req.user._id });
    if (!doc) return res.status(404).json({ message: 'Doctor profile not found' });

    const list = await Appointment.find({ doctorId: doc._id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/appointments/:id/status  — doctor approves / rejects / completes
router.put('/:id/status', protect, doctorOnly, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const allowed = ['approved', 'rejected', 'completed'];
    if (!allowed.includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });

    // Verify ownership (unless admin)
    if (req.user.role !== 'admin') {
      const doc = await Doctor.findOne({ userId: req.user._id });
      if (!doc || appt.doctorId.toString() !== doc._id.toString())
        return res.status(403).json({ message: 'Not authorised' });
    }

    appt.status = status;
    if (notes) appt.notes = notes;
    await appt.save();
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/appointments/:id/cancel  — patient cancels
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });

    if (appt.patientId.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorised' });

    if (['completed', 'cancelled'].includes(appt.status))
      return res.status(400).json({ message: 'Cannot cancel this appointment' });

    appt.status = 'cancelled';
    await appt.save();
    res.json(appt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
