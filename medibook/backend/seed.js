/**
 * Seed script — run with:  node seed.js
 * Creates admin + 6 sample doctors (with portrait photos) + 1 patient
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('./models/User');
const Doctor   = require('./models/Doctor');

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/medibook';

const DOCTORS_DATA = [
  {
    name:           'Dr. Sarah Chen',
    email:          'sarah@medibook.com',
    specialization: 'Cardiology',
    experience:     12,
    fees:           800,
    hospital:       'City Heart Center',
    bio:            'Specialist in interventional cardiology with 12+ years of experience treating complex heart conditions.',
    photo:          'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=85&auto=format&fit=crop&crop=face',
  },
  {
    name:           'Dr. James Okafor',
    email:          'james@medibook.com',
    specialization: 'Neurology',
    experience:     9,
    fees:           900,
    hospital:       'NeuroHealth Institute',
    bio:            'Expert neurologist treating complex neurological conditions including epilepsy and movement disorders.',
    photo:          'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=85&auto=format&fit=crop&crop=face',
  },
  {
    name:           'Dr. Priya Sharma',
    email:          'priya@medibook.com',
    specialization: 'Dermatology',
    experience:     7,
    fees:           600,
    hospital:       'SkinCare Clinic',
    bio:            'Experienced dermatologist specialising in skin health, acne treatment and cosmetic dermatology.',
    photo:          'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=85&auto=format&fit=crop&crop=face',
  },
  {
    name:           'Dr. Marco Rossi',
    email:          'marco@medibook.com',
    specialization: 'Orthopedics',
    experience:     15,
    fees:           1000,
    hospital:       'BoneJoint Hospital',
    bio:            'Senior orthopedic surgeon with expertise in joint replacement, sports injuries and spine surgery.',
    photo:          'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=85&auto=format&fit=crop&crop=face',
  },
  {
    name:           'Dr. Aisha Patel',
    email:          'aisha@medibook.com',
    specialization: 'General Practice',
    experience:     5,
    fees:           400,
    hospital:       'Community Health Hub',
    bio:            'Compassionate general practitioner focused on preventive care, wellness and family health.',
    photo:          'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400&q=85&auto=format&fit=crop&crop=face',
  },
  {
    name:           'Dr. Lucas Müller',
    email:          'lucas@medibook.com',
    specialization: 'Cardiology',
    experience:     18,
    fees:           1200,
    hospital:       'Premium Heart Clinic',
    bio:            'Highly experienced cardiologist and department head specialising in cardiac surgery and rehabilitation.',
    photo:          'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=85&auto=format&fit=crop&crop=face',
  },
];

async function seed() {
  await mongoose.connect(MONGO);
  console.log('✅ Connected to MongoDB');

  await User.deleteMany({});
  await Doctor.deleteMany({});
  console.log('🗑  Cleared existing data');

  // Admin
  await User.create({
    name: 'Super Admin', email: 'admin@medibook.com',
    password: 'Admin@123', role: 'admin',
  });
  console.log('👤 Admin:   admin@medibook.com   / Admin@123');

  // Patient
  await User.create({
    name: 'John Patient', email: 'patient@medibook.com',
    password: 'Patient@123', role: 'patient', phone: '9876543210',
  });
  console.log('👤 Patient: patient@medibook.com / Patient@123');

  // Doctors
  for (const d of DOCTORS_DATA) {
    const user = await User.create({
      name: d.name, email: d.email,
      password: 'Doctor@123', role: 'doctor',
    });
    await Doctor.create({
      userId:         user._id,
      specialization: d.specialization,
      experience:     d.experience,
      fees:           d.fees,
      hospital:       d.hospital,
      bio:            d.bio,
      photo:          d.photo,
      isApproved:     true,
      rating:         parseFloat((4.5 + Math.random() * 0.5).toFixed(1)),
      totalRatings:   Math.floor(50 + Math.random() * 200),
    });
    console.log(`👨‍⚕️ Doctor:  ${d.email} / Doctor@123`);
  }

  console.log('\n🎉 Seed complete! All accounts ready.');
  process.exit(0);
}

seed().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
