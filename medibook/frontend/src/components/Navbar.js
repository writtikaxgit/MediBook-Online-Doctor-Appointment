import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_COLORS = {
  patient: { bg: '#d4f0ee', text: '#1a6460' },
  doctor:  { bg: '#ffd9e2', text: '#a0243e' },
  admin:   { bg: '#e4dffe', text: '#4a3890' },
};
const AVATAR_COLORS = ['#4cb8b2','#f06b8a','#5ab56a','#5aabf0','#8b75f0','#f7b731'];
const avatarColor = (name = '') => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location         = useLocation();
  const navigate         = useNavigate();
  const [open, setOpen]  = useState(false);

  const isActive = path => location.pathname === path;
  const go = path => { navigate(path); setOpen(false); };

  const handleLogout = () => { logout(); navigate('/'); setOpen(false); };

  const navLinks = [
    { path: '/',        label: 'Home' },
    { path: '/doctors', label: 'Find Doctors' },
    ...(user ? [{ path: '/dashboard', label: 'Dashboard' }] : []),
  ];

  return (
    <>
      <div className="nav-wrap">
        <div className="container">
          <div className="nav-inner">
            {/* Logo */}
            <Link to="/" className="nav-logo" onClick={() => setOpen(false)}>
              <span className="nav-logo-mark">⚕</span>
              MediBook
            </Link>

            {/* Desktop links */}
            <nav className="nav-links">
              {navLinks.map(({ path, label }) => (
                <Link key={path} to={path} className={`nav-link ${isActive(path) ? 'active' : ''}`}>
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right section */}
            <div className="nav-right">
              {user ? (
                <>
                  <div className="nav-user-chip">
                    <div className="nav-avatar" style={{ background: avatarColor(user.name) }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="nav-user-name">{user.name.split(' ')[0]}</span>
                    <span className="nav-role-pill" style={ROLE_COLORS[user.role] || {}}>
                      {user.role}
                    </span>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button className="btn btn-secondary btn-sm">Login</button>
                  </Link>
                  <Link to="/register">
                    <button className="btn btn-primary btn-sm">Sign Up</button>
                  </Link>
                </>
              )}

              {/* Hamburger */}
              <button className="hamburger" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
                <span style={{ transform: open ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
                <span style={{ opacity: open ? 0 : 1 }} />
                <span style={{ transform: open ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{
          background: '#fff', borderBottom: '1px solid var(--border)',
          padding: '12px 24px 20px', position:'sticky', top:68, zIndex:190,
        }}>
          {navLinks.map(({ path, label }) => (
            <button key={path} onClick={() => go(path)} style={{
              display:'block', width:'100%', textAlign:'left',
              padding:'10px 0', background:'none', border:'none',
              fontSize:15, fontWeight:600,
              color: isActive(path) ? 'var(--teal-600)' : 'var(--gray-600)',
              cursor:'pointer', borderBottom:'1px solid var(--gray-100)',
            }}>
              {label}
            </button>
          ))}
          {!user && (
            <div style={{ display:'flex', gap:10, marginTop:14 }}>
              <button className="btn btn-secondary btn-sm" style={{flex:1}} onClick={() => go('/login')}>Login</button>
              <button className="btn btn-primary btn-sm"   style={{flex:1}} onClick={() => go('/register')}>Sign Up</button>
            </div>
          )}
          {user && (
            <button className="btn btn-secondary btn-sm" style={{width:'100%', marginTop:14, justifyContent:'center'}} onClick={handleLogout}>
              Sign out
            </button>
          )}
        </div>
      )}
    </>
  );
}
