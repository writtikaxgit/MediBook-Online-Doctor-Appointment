import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';

const SPECIALIZATIONS = ['Cardiology','Dermatology','General Practice','Neurology','Orthopedics',
  'Pediatrics','Psychiatry','Gynecology','Dentistry','Ophthalmology','ENT','Pulmonology','Oncology','Endocrinology','Urology'];

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [role, setRole]       = useState('patient');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name:'', email:'', password:'', confirmPassword:'', phone:'', gender:'',
    specialization:'', experience:'', fees:'', hospital:'', bio:'',
  });
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    const payload = { name:form.name, email:form.email, password:form.password, phone:form.phone, gender:form.gender, role,
      ...(role==='doctor' ? { specialization:form.specialization, experience:form.experience, fees:form.fees, hospital:form.hospital, bio:form.bio } : {}) };
    setLoading(true);
    try {
      await register(payload);
      toast.success(role==='doctor' ? 'Profile submitted! Awaiting admin approval.' : 'Account created! Welcome 🎉');
      navigate('/dashboard');
    } catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'calc(100vh - 72px)', display:'grid', gridTemplateColumns:'1fr 1fr' }}>
      {/* Left: image panel */}
      <div style={{ position:'relative', overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'48px' }}>
        <img
          src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=900&q=85&auto=format&fit=crop"
          alt="Healthcare"
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}
        />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg, rgba(7,52,48,0.35) 0%, rgba(5,35,30,0.88) 100%)' }} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{
            background:'rgba(255,255,255,0.1)', backdropFilter:'blur(12px)',
            border:'1px solid rgba(255,255,255,0.2)', borderRadius:20, padding:'26px 30px',
          }}>
            <div style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:20, color:'#fff', marginBottom:10 }}>
              Join MediBook today
            </div>
            <p style={{ color:'rgba(255,255,255,0.72)', fontSize:13.5, lineHeight:1.65, margin:0 }}>
              Register as a patient to book appointments, or as a doctor to grow your practice. Everything you need, in one place.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:18 }}>
              {['✓  Verified doctor profiles','✓  Real-time availability','✓  Secure & private','✓  Free to get started'].map(t=>(
                <div key={t} style={{ fontSize:12.5, color:'rgba(255,255,255,0.7)', fontWeight:500 }}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div style={{ overflowY:'auto', background:'#fafcfb', padding:'40px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
        <div style={{ maxWidth:440, margin:'0 auto', width:'100%' }}>
          <div style={{ marginBottom:24 }}>
            <h2 style={{ fontSize:'1.6rem', marginBottom:6 }}>Create your account</h2>
            <p style={{ fontSize:14, color:'var(--text-muted)', margin:0 }}>Join thousands using MediBook</p>
          </div>

          {/* Role toggle */}
          <div style={{ display:'flex', background:'var(--gray-100)', borderRadius:12, padding:4, marginBottom:24, gap:4 }}>
            {['patient','doctor'].map(r=>(
              <button key={r} onClick={()=>setRole(r)} style={{
                flex:1, padding:'10px 0', border:'none', borderRadius:10,
                fontFamily:'var(--font-body)', fontSize:14, fontWeight:600, cursor:'pointer',
                background: role===r ? '#fff' : 'transparent',
                color: role===r ? 'var(--gray-800)' : 'var(--gray-500)',
                boxShadow: role===r ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition:'all 0.18s',
              }}>
                {r==='patient' ? '👤 Register as Patient' : '👨‍⚕️ Register as Doctor'}
              </button>
            ))}
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input className="form-control" placeholder={role==='doctor' ? 'Dr. Jane Smith' : 'Your full name'} value={form.name} onChange={set('name')} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-control" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-control" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password</label>
                <input className="form-control" type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm password</label>
                <input className="form-control" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={set('confirmPassword')} required />
              </div>
            </div>

            {role === 'doctor' && (
              <>
                <div style={{ height:1, background:'var(--gray-200)', margin:'4px 0 20px' }} />
                <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.6px', color:'var(--teal-600)', marginBottom:16 }}>
                  Doctor Profile Details
                </div>
                <div className="form-group">
                  <label className="form-label">Specialization</label>
                  <select className="form-control" value={form.specialization} onChange={set('specialization')} required>
                    <option value="">Select specialization…</option>
                    {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Experience (years)</label>
                    <input className="form-control" type="number" min="0" max="60" placeholder="e.g. 8" value={form.experience} onChange={set('experience')} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Consultation fee (₹)</label>
                    <input className="form-control" type="number" min="0" placeholder="e.g. 700" value={form.fees} onChange={set('fees')} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Hospital / Clinic</label>
                  <input className="form-control" placeholder="City Medical Centre" value={form.hospital} onChange={set('hospital')} />
                </div>
                <div className="form-group">
                  <label className="form-label">Short bio</label>
                  <textarea className="form-control" rows={2} placeholder="Brief professional summary…" value={form.bio} onChange={set('bio')} />
                </div>
                <div className="alert alert-info" style={{ marginBottom:18 }}>
                  ℹ Your profile will be reviewed by an admin before going live.
                </div>
              </>
            )}

            <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : `Create ${role==='doctor'?'Doctor':'Patient'} Account →`}
            </button>
          </form>

          <p style={{ textAlign:'center', fontSize:13, color:'var(--text-muted)', marginTop:20 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'var(--teal-600)', fontWeight:700 }}>Sign in here</Link>
          </p>
        </div>
      </div>

      <style>{`@media(max-width:768px){.reg-split>div:first-child{display:none!important}}`}</style>
    </div>
  );
}
