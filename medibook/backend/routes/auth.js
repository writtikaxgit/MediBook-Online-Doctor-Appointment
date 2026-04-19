const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const Doctor  = require('../models/Doctor');
const { protect, generateToken } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const {
      name, email, password, role,
      phone, gender,
      // Doctor-specific
      specialization, experience, fees, address, bio, hospital,
    } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });

    const assignedRole = role === 'doctor' ? 'doctor' : 'patient';

    const user = await User.create({
      name, email, password,
      role: assignedRole,
      phone:  phone  || '',
      gender: gender || '',
    });

    // Create doctor profile if registering as doctor
    if (assignedRole === 'doctor') {
      if (!specialization || experience === undefined || fees === undefined)
        return res.status(400).json({ message: 'Specialization, experience and fees are required for doctors' });

      await Doctor.create({
        userId: user._id,
        specialization,
        experience: Number(experience),
        fees:       Number(fees),
        phone:    phone    || '',
        address:  address  || '',
        bio:      bio      || '',
        hospital: hospital || '',
        isApproved: false,
      });
    }

    res.status(201).json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    if (!user.isActive)
      return res.status(403).json({ message: 'Your account has been deactivated' });

    res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/profile  (protected)
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/auth/profile  (protected)
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, gender, address, password } = req.body;
    const user = await User.findById(req.user._id);

    if (name)    user.name    = name;
    if (phone)   user.phone   = phone;
    if (gender)  user.gender  = gender;
    if (address) user.address = address;
    if (password) user.password = password;

    const updated = await user.save();
    res.json({ _id: updated._id, name: updated.name, email: updated.email, role: updated.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/seed-admin  (dev only — creates default admin)
router.post('/seed-admin', async (req, res) => {
  try {
    const existing = await User.findOne({ role: 'admin' });
    if (existing)
      return res.json({ message: 'Admin already exists', email: existing.email });

    const admin = await User.create({
      name:     'Super Admin',
      email:    'admin@medibook.com',
      password: 'Admin@123',
      role:     'admin',
    });

    res.status(201).json({
      message:  'Admin created',
      email:    admin.email,
      password: 'Admin@123',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
