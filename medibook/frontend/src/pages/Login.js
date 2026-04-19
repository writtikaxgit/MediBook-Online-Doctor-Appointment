import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';

const DEMOS = [
  { role: 'Admin',   email: 'admin@medibook.com',   pass: 'Admin@123',   color: '#7c3aed', bg: '#ede9fe' },
  { role: 'Doctor',  email: 'sarah@medibook.com',   pass: 'Doctor@123',  color: '#0d9488', bg: '#ccfbf1' },
  { role: 'Patient', email: 'patient@medibook.com', pass: 'Patient@123', color: '#2563eb', bg: '#dbeafe' },
];

export default function Login() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const doLogin = async (email, password) => {
    setError(''); setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }}>
      {/* Left: HD image panel */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '48px',
      }}>
        <img
          src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=900&q=85&auto=format&fit=crop"
          alt="Medical care"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, rgba(7,52,48,0.4) 0%, rgba(5,35,30,0.85) 100%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 20, padding: '28px 32px',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, color: '#fff', marginBottom: 10 }}>
              "Healthcare made simple"
            </div>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.65, margin: 0 }}>
              Connect with top-rated specialists and book appointments in under a minute. Your health, your schedule.
            </p>
            <div style={{ display: 'flex', gap: 16, marginTop: 20 }}>
              {['50+ Doctors', '2k+ Patients', '4.9★ Rating'].map(s => (
                <div key={s} style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{s}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#fafcfb', padding: '48px 40px',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 26, color: 'var(--teal-700)', marginBottom: 8 }}>
              ⚕ MediBook
            </div>
            <h2 style={{ fontSize: '1.7rem', marginBottom: 6 }}>Welcome back</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>Sign in to manage your appointments</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={e => { e.preventDefault(); doLogin(form.email, form.password); }}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input className="form-control" type="email" placeholder="you@example.com"
                value={form.email} onChange={set('email')} required autoFocus />
            </div>
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">Password</label>
              <input className="form-control" type="password" placeholder="Your password"
                value={form.password} onChange={set('password')} required />
            </div>
            <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--gray-200)' }} />
            <span style={{ fontSize: 12, color: 'var(--gray-400)', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase' }}>Demo accounts</span>
            <div style={{ flex: 1, height: 1, background: 'var(--gray-200)' }} />
          </div>

          {/* Demo buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DEMOS.map(({ role, email, pass, color, bg }) => (
              <button key={role} onClick={() => doLogin(email, pass)} disabled={loading}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 16px', borderRadius: 12,
                  background: bg, border: `1px solid ${color}22`,
                  cursor: 'pointer', transition: 'all 0.18s', fontFamily: 'var(--font-body)',
                  textAlign: 'left',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: color, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, flexShrink: 0,
                }}>
                  {role[0]}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-800)' }}>{role}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--gray-500)' }}>{email}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: 11, color: color, fontWeight: 600 }}>Sign in →</div>
              </button>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 24 }}>
            No account?{' '}
            <Link to="/register" style={{ color: 'var(--teal-600)', fontWeight: 700 }}>Create one free</Link>
          </p>
        </div>
      </div>

      {/* Hide left panel on mobile */}
      <style>{`
        @media (max-width: 768px) {
          .login-split { grid-template-columns: 1fr !important; }
          .login-split > div:first-child { display: none !important; }
        }
      `}</style>
    </div>
  );
}
