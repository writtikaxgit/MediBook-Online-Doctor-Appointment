const express     = require('express');
const router      = express.Router();
const User        = require('../models/User');
const Doctor      = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [patients, doctors, pendingDoctors, appointments, pending, approved] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      Doctor.countDocuments({ isApproved: true }),
      Doctor.countDocuments({ isApproved: false }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      Appointment.countDocuments({ status: 'approved' }),
    ]);

    const recentAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentDoctors = await Doctor.find({ isApproved: false })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');

    res.json({
      patients,
      doctors,
      pendingDoctors,
      appointments,
      pendingAppointments:  pending,
      approvedAppointments: approved,
      recentAppointments,
      recentDoctors,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Also remove doctor profile if exists
    await Doctor.findOneAndDelete({ userId: req.params.id });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/doctors  (includes unapproved)
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name email phone');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/doctors/:id/approve
router.put('/doctors/:id/approve', async (req, res) => {
  try {
    const { isApproved } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    ).populate('userId', 'name email');

    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/doctors/:id
router.delete('/doctors/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    // Remove user account too
    await User.findByIdAndDelete(doctor.userId);
    res.json({ message: 'Doctor deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/appointments
router.get('/appointments', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== 'all' ? { status } : {};
    const appts = await Appointment.find(filter).sort({ createdAt: -1 });
    res.json(appts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
