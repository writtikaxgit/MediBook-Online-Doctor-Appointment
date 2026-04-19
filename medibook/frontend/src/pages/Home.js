import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../context/AuthContext';
import DoctorCard from '../components/DoctorCard';

/* ─── Unsplash HD image URLs — verified working ─── */
const SPECIALTY_IMAGES = {
  'Cardiology':       'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=500&q=85&auto=format&fit=crop&crop=center',
  'Neurology':        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&q=85&auto=format&fit=crop&crop=center',
  'Dentistry':        'https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?w=500&q=85&auto=format&fit=crop&crop=center',
  'Dermatology':      'https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=500&q=85&auto=format&fit=crop&crop=center',
  'Orthopedics':      'https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=500&q=85&auto=format&fit=crop&crop=center',
  'Ophthalmology':    'https://images.unsplash.com/photo-1580281657702-257584239a55?w=500&q=85&auto=format&fit=crop&crop=center',
  'General Practice': 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=500&q=85&auto=format&fit=crop&crop=center',
  'Pulmonology':      'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=85&auto=format&fit=crop&crop=center',
};

const SPECIALTIES = [
  { icon:'🫀', name:'Cardiology' },
  { icon:'🧠', name:'Neurology' },
  { icon:'🦷', name:'Dentistry' },
  { icon:'🧪', name:'Dermatology' },
  { icon:'🦴', name:'Orthopedics' },
  { icon:'👁', name:'Ophthalmology' },
  { icon:'🩺', name:'General Practice' },
  { icon:'🫁', name:'Pulmonology' },
];

const HOW_STEPS = [
  {
    n: '01', icon: '🔍', title: 'Find Your Doctor',
    desc: 'Search by specialty, name or hospital. Read profiles, ratings and availability.',
    img: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=600&q=80&auto=format&fit=crop',
  },
  {
    n: '02', icon: '📅', title: 'Pick a Time Slot',
    desc: 'Select the date and time that fits your schedule from real-time availability.',
    img: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&q=80&auto=format&fit=crop',
  },
  {
    n: '03', icon: '✅', title: 'Get Confirmed',
    desc: 'Your doctor reviews and confirms. Receive instant notification of your booking.',
    img: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&q=80&auto=format&fit=crop',
  },
];

const TESTIMONIALS = [
  {
    text: 'MediBook made it incredibly easy to find a cardiologist on short notice. The booking was confirmed within minutes. Highly recommend!',
    name: 'Priya Menon', role: 'Patient · Cardiology',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80&auto=format&fit=crop&crop=face',
  },
  {
    text: 'As a busy professional, I love how quickly I can book and reschedule. The doctor profiles are detailed and trustworthy.',
    name: 'Rahul Sharma', role: 'Patient · General Practice',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80&auto=format&fit=crop&crop=face',
  },
  {
    text: 'The platform is beautiful and intuitive. Managing my appointments has never been this smooth. Excellent experience overall.',
    name: 'Anita Krishnan', role: 'Patient · Dermatology',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80&auto=format&fit=crop&crop=face',
  },
];

const HERO_STATS = [
  { num: '50+',   label: 'Specialists' },
  { num: '4.9★',  label: 'Avg Rating' },
  { num: '2k+',   label: 'Patients' },
];

export default function Home() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/doctors?sort=rating')
      .then(r => setDoctors(r.data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page" style={{ padding: '32px 0 80px' }}>
      <div className="container">

        {/* ── HERO ── */}
        <section className="hero-section">
          <div className="hero-bg-image" />
          <div className="hero-bg-overlay" />
          <div className="hero-content">
            <div className="hero-pill">
              <span className="hero-pill-dot" />
              Trusted by 2,000+ patients
            </div>
            <h1>
              Healthcare that <br />
              <em>fits your life</em>
            </h1>
            <p>
              Book appointments with verified specialists in seconds. Same-day availability,
              transparent pricing — care on your terms.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/doctors')}>
                Find a Doctor →
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => navigate('/register')}>
                Get Started Free
              </button>
            </div>
          </div>

          {/* Floating stats bar */}
          <div className="hero-floatbar">
            {HERO_STATS.map(({ num, label }) => (
              <div key={label} className="hero-floatbar-stat">
                <div className="hero-floatbar-num">{num}</div>
                <div className="hero-floatbar-label">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURE STRIP ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16, marginBottom: 64,
        }}>
          {[
            { icon: '⚡', title: 'Instant Booking',    desc: 'Confirm your slot in under 60 seconds',   color: 'var(--teal-100)',   tc: 'var(--teal-700)' },
            { icon: '🔒', title: 'Verified Doctors',   desc: 'Every specialist is admin-approved',        color: 'var(--violet-100)', tc: 'var(--violet-600)' },
            { icon: '💳', title: 'Transparent Fees',   desc: 'See full pricing before you book',          color: 'var(--amber-100)',  tc: 'var(--amber-600)' },
            { icon: '📱', title: 'Easy Management',    desc: 'Track, reschedule or cancel anytime',       color: 'var(--sage-100)',   tc: 'var(--sage-600)' },
          ].map(({ icon, title, desc, color, tc }) => (
            <div key={title} className="card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '20px 22px' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>
                {icon}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: 'var(--gray-800)' }}>{title}</div>
                <div style={{ fontSize: 12.5, color: 'var(--gray-500)', lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── SPECIALTIES WITH IMAGES ── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h2 className="page-title" style={{ marginBottom: 6 }}>Browse by Specialty</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>Find the right expert for every need</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/doctors')}>View all doctors →</button>
          </div>
          <div className="specialty-grid">
            {SPECIALTIES.map(({ icon, name }) => (
              <button key={name} className="specialty-card" onClick={() => navigate(`/doctors?spec=${name}`)}>
                <img
                  className="specialty-card-img"
                  src={SPECIALTY_IMAGES[name] || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&q=85&auto=format&fit=crop&crop=center'}
                  alt={name}
                  loading="lazy"
                  onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.style.background = 'linear-gradient(135deg,#0d9488,#0f766e)'; }}
                />
                <div className="specialty-card-overlay" />
                <div className="specialty-card-label">
                  <span className="specialty-card-icon">{icon}</span>
                  {name}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── TOP DOCTORS ── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h2 className="page-title" style={{ marginBottom: 6 }}>Top Rated Doctors</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>Handpicked specialists with outstanding reviews</p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/doctors')}>See all →</button>
          </div>
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : doctors.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>👨‍⚕️</div>
              <p style={{ color: 'var(--text-muted)' }}>
                No doctors yet — run <code style={{ background: 'var(--gray-100)', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>node seed.js</code> in the backend to add demo data.
              </p>
            </div>
          ) : (
            <div className="grid-3">
              {doctors.map(doc => <DoctorCard key={doc._id} doctor={doc} />)}
            </div>
          )}
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 className="page-title">How MediBook Works</h2>
            <p style={{ fontSize: 14.5, color: 'var(--text-muted)', maxWidth: 420, margin: '8px auto 0' }}>
              Three simple steps to your appointment
            </p>
          </div>
          <div className="grid-3">
            {HOW_STEPS.map(({ n, title, desc, img }) => (
              <div key={n} className="how-card">
                <img className="how-card-img" src={img} alt={title} loading="lazy" />
                <div className="how-card-overlay" />
                <div className="how-card-body">
                  <div className="how-step-badge">{n}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 className="page-title">What Patients Say</h2>
            <p style={{ fontSize: 14.5, color: 'var(--text-muted)', maxWidth: 380, margin: '8px auto 0' }}>
              Real experiences from real patients
            </p>
          </div>
          <div className="grid-3">
            {TESTIMONIALS.map(({ text, name, role, avatar }) => (
              <div key={name} className="testimonial-card">
                <div className="stars-row">★★★★★</div>
                <p className="testimonial-text">{text}</p>
                <div className="testimonial-author">
                  <img className="testimonial-avatar" src={avatar} alt={name} loading="lazy" />
                  <div>
                    <div className="testimonial-name">{name}</div>
                    <div className="testimonial-role">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TRUST / CTA BANNER ── */}
        <section className="trust-banner">
          <div className="trust-banner-bg" />
          <div className="trust-banner-text">
            <h2>Ready to take control of your health?</h2>
            <p>Join thousands of patients who've made their healthcare journey simpler with MediBook.</p>
          </div>
          <div className="trust-banner-actions">
            <button className="btn btn-ghost btn-lg" onClick={() => navigate('/register')}>
              Create Free Account
            </button>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/doctors')}>
              Browse Doctors →
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
