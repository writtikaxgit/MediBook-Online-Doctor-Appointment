const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'medibook_fallback_secret';

// Protect: verify JWT and attach user to req
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorised — no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Role guards
const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403).json({ message: 'Admin access only' });
};

const doctorOnly = (req, res, next) => {
  if (req.user?.role === 'doctor' || req.user?.role === 'admin') return next();
  res.status(403).json({ message: 'Doctor access only' });
};

const generateToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });

module.exports = { protect, adminOnly, doctorOnly, generateToken };
