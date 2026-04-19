import React from 'react';
import { useNavigate } from 'react-router-dom';

/* Specialty fallback images (used when no doctor photo is set) */
const SPEC_IMAGES = {
  'Cardiology':       'https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=500&q=85&auto=format&fit=crop&crop=center',
  'Neurology':        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&q=85&auto=format&fit=crop&crop=center',
  'Dermatology':      'https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?w=500&q=85&auto=format&fit=crop&crop=center',
  'Orthopedics':      'https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=500&q=85&auto=format&fit=crop&crop=center',
  'Dentistry':        'https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?w=500&q=85&auto=format&fit=crop&crop=center',
  'General Practice': 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=500&q=85&auto=format&fit=crop&crop=center',
  'Ophthalmology':    'https://images.unsplash.com/photo-1580281657702-257584239a55?w=500&q=85&auto=format&fit=crop&crop=center',
  'Pulmonology':      'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&q=85&auto=format&fit=crop&crop=center',
  'Psychiatry':       'https://images.unsplash.com/photo-1601925228064-4c8f56c4f5f5?w=500&q=85&auto=format&fit=crop&crop=center',
  'Pediatrics':       'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=500&q=85&auto=format&fit=crop&crop=center',
  'Gynecology':       'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=500&q=85&auto=format&fit=crop&crop=center',
  'Oncology':         'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=500&q=85&auto=format&fit=crop&crop=center',
};
const FALLBACK = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&q=85&auto=format&fit=crop&crop=center';

const ACCENT_GRADIENTS = [
  'linear-gradient(135deg,#0d9488,#0f766e)',
  'linear-gradient(135deg,#e11d48,#9f1239)',
  'linear-gradient(135deg,#16a34a,#14532d)',
  'linear-gradient(135deg,#2563eb,#1e3a8a)',
  'linear-gradient(135deg,#7c3aed,#4c1d95)',
  'linear-gradient(135deg,#d97706,#92400e)',
];
const getGradient = (name = '') => ACCENT_GRADIENTS[name.charCodeAt(0) % ACCENT_GRADIENTS.length];

export default function DoctorCard({ doctor }) {
  const navigate = useNavigate();
  const name     = doctor.userId?.name || 'Doctor';
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const gradient = getGradient(name);
  const avail    = doctor.isApproved;

  /* Priority: doctor portrait photo → specialty image → fallback */
  const imgSrc = doctor.photo || SPEC_IMAGES[doctor.specialization] || FALLBACK;
  /* If it's a portrait, keep face in frame; specialty images crop to center */
  const objPos = doctor.photo ? 'top center' : 'center';

  const handleError = e => {
    if (e.currentTarget.src !== FALLBACK) {
      e.currentTarget.src = SPEC_IMAGES[doctor.specialization] || FALLBACK;
      e.currentTarget.style.objectPosition = 'center';
    } else {
      e.currentTarget.style.display = 'none';
      e.currentTarget.parentElement.style.background = gradient;
    }
  };

  return (
    <div
      className="card-hover"
      style={{
        background: '#fff', borderRadius: 20,
        overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
        cursor: 'pointer', display: 'flex', flexDirection: 'column',
      }}
      onClick={() => navigate(`/book/${doctor._id}`)}
    >
      {/* ── Photo header ── */}
      <div style={{ position: 'relative', height: 185, overflow: 'hidden', background: '#e1f5ee' }}>
        <img
          src={imgSrc}
          alt={name}
          loading="lazy"
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: objPos,
            display: 'block',
            transition: 'transform 0.5s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          onError={handleError}
        />

        {/* Bottom gradient fade */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.52) 100%)',
        }} />

        {/* Doctor name + spec overlay at bottom of photo */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '10px 16px 14px',
          zIndex: 2,
        }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 500, color: '#fff', marginBottom: 2, textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>{name}</div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.82)', fontWeight: 600, letterSpacing: '0.3px' }}>{doctor.specialization}</div>
        </div>

        {/* Availability pill — top right */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: avail ? 'rgba(22,163,74,0.88)' : 'rgba(220,38,38,0.82)',
          backdropFilter: 'blur(6px)',
          color: '#fff', fontSize: 10.5, fontWeight: 700,
          padding: '4px 10px', borderRadius: 20,
          letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.85)' }} />
          {avail ? 'Available' : 'Unavailable'}
        </div>
      </div>

      {/* ── Card body ── */}
      <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Hospital */}
        {doctor.hospital && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--gray-500)' }}>
            <span style={{ fontSize: 13 }}>🏥</span> {doctor.hospital}
          </div>
        )}

        {/* Stats chips */}
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 11.5, padding: '4px 11px', borderRadius: 20, fontWeight: 600,
            background: 'var(--teal-50)', color: 'var(--teal-700)',
          }}>
            {doctor.experience} yrs exp
          </span>
          <span style={{
            fontSize: 11.5, padding: '4px 11px', borderRadius: 20, fontWeight: 600,
            background: '#fff7ed', color: '#c2410c',
          }}>
            ₹{doctor.fees?.toLocaleString()}
          </span>
        </div>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12.5 }}>
          <span style={{ color: '#f59e0b', fontSize: 13 }}>★★★★★</span>
          <span style={{ fontWeight: 700, color: 'var(--gray-800)' }}>
            {Number(doctor.rating || 4.5).toFixed(1)}
          </span>
          <span style={{ color: 'var(--gray-400)', fontSize: 11 }}>
            ({doctor.totalRatings || 0} reviews)
          </span>
        </div>

        {/* Book button */}
        <button
          className="btn btn-primary btn-sm btn-full"
          onClick={e => { e.stopPropagation(); navigate(`/book/${doctor._id}`); }}
          disabled={!avail}
          style={{ marginTop: 2 }}
        >
          {avail ? 'Book Appointment →' : 'Currently Unavailable'}
        </button>
      </div>
    </div>
  );
}
