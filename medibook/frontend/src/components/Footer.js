import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#0f766e', marginTop: 0 }}>
      {/* Top image strip */}
      <div style={{ position: 'relative', height: 6, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, #5eead4, #2dd4bf, #0d9488, #5eead4)', backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite' }} />
      </div>

      <div className="container" style={{ padding: '52px 28px 36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: 40, marginBottom: 40, flexWrap: 'wrap' }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 24, color: '#fff', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚕</div>
              MediBook
            </div>
            <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: 240, margin: '0 0 20px' }}>
              Connecting patients with top-rated doctors for seamless, stress-free appointment booking.
            </p>
            {/* Mini stats */}
            <div style={{ display: 'flex', gap: 20 }}>
              {[['50+','Doctors'],['2k+','Patients'],['4.9★','Rating']].map(([n,l]) => (
                <div key={l}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#5eead4', fontFamily: 'var(--font-display)' }}>{n}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>Navigate</div>
            {[['/', 'Home'], ['/doctors', 'Find Doctors'], ['/login', 'Login'], ['/register', 'Sign Up']].map(([path, label]) => (
              <Link key={path} to={path} style={{ display: 'block', fontSize: 13.5, color: 'rgba(255,255,255,0.65)', marginBottom: 8, fontWeight: 500, transition: 'color 0.18s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#5eead4'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}>
                {label}
              </Link>
            ))}
          </div>

          {/* Specialties */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>Specialties</div>
            {['Cardiology','Neurology','Dermatology','Orthopedics','General Practice'].map(s => (
              <Link key={s} to={`/doctors?spec=${s}`} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 7, transition: 'color 0.18s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#5eead4'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                {s}
              </Link>
            ))}
          </div>

          {/* Demo accounts */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>Demo Accounts</div>
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
              {[
                { role: 'Admin',   email: 'admin@medibook.com',   pass: 'Admin@123' },
                { role: 'Doctor',  email: 'sarah@medibook.com',   pass: 'Doctor@123' },
                { role: 'Patient', email: 'patient@medibook.com', pass: 'Patient@123' },
              ].map(({ role, email, pass }) => (
                <div key={role} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#5eead4', marginBottom: 2 }}>{role}</div>
                  <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.55)' }}>{email}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>pw: {pass}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            © {new Date().getFullYear()} MediBook. Built with React + Node.js + MongoDB.
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            Photos by{' '}
            <a href="https://unsplash.com" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'underline' }}>Unsplash</a>
          </div>
        </div>
      </div>
      <style>{`@keyframes shimmer{0%{background-position:0 0}100%{background-position:200% 0}}`}</style>
    </footer>
  );
}
