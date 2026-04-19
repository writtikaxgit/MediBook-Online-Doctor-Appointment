const express = require('express');
const router  = express.Router();
const Doctor  = require('../models/Doctor');
const User    = require('../models/User');
const { protect, doctorOnly } = require('../middleware/auth');

// GET /api/doctors  — public, approved doctors only
router.get('/', async (req, res) => {
  try {
    const { specialization, search, sort } = req.query;
    const filter = { isApproved: true, isActive: true };

    if (specialization && specialization !== 'All')
      filter.specialization = specialization;

    let query = Doctor.find(filter).populate('userId', 'name email');

    if (sort === 'fees_asc')   query = query.sort({ fees: 1 });
    else if (sort === 'fees_desc') query = query.sort({ fees: -1 });
    else if (sort === 'rating')    query = query.sort({ rating: -1 });
    else                           query = query.sort({ createdAt: -1 });

    let doctors = await query;

    // Text search on populated name
    if (search) {
      const s = search.toLowerCase();
      doctors = doctors.filter(d =>
        d.userId?.name?.toLowerCase().includes(s) ||
        d.specialization.toLowerCase().includes(s) ||
        d.hospital?.toLowerCase().includes(s)
      );
    }

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/doctors/specializations  — distinct list
router.get('/specializations', async (req, res) => {
  try {
    const specs = await Doctor.distinct('specialization', { isApproved: true });
    res.json(['All', ...specs.sort()]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/doctors/me  — logged-in doctor's own profile
router.get('/me', protect, doctorOnly, async (req, res) => {
  try {
    const doc = await Doctor.findOne({ userId: req.user._id }).populate('userId', 'name email');
    if (!doc) return res.status(404).json({ message: 'Doctor profile not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/doctors/me  — update own profile
router.put('/me', protect, doctorOnly, async (req, res) => {
  try {
    const updates = (({ specialization, experience, fees, phone, address, bio, hospital, photo, timings, availableDays }) =>
      ({ specialization, experience, fees, phone, address, bio, hospital, photo, timings, availableDays }))(req.body);

    const doc = await Doctor.findOneAndUpdate(
      { userId: req.user._id },
      { $set: updates },
      { new: true }
    ).populate('userId', 'name email');

    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/doctors/:id  — single doctor (public)
router.get('/:id', async (req, res) => {
  try {
    const doc = await Doctor.findById(req.params.id).populate('userId', 'name email phone');
    if (!doc) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
