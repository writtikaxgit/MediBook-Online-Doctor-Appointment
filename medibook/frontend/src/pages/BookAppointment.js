import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';

const SLOT_TIMES = [
  '09:00 AM','09:30 AM','10:00 AM','10:30 AM',
  '11:00 AM','11:30 AM','12:00 PM','12:30 PM',
  '02:00 PM','02:30 PM','03:00 PM','03:30 PM',
  '04:00 PM','04:30 PM','05:00 PM','05:30 PM',
];

export default function BookAppointment() {
  const { id }     = useParams();
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [doctor, setDoctor]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSub]  = useState(false);
  const [error, setError]     = useState('');

  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    date: today,
    time: '',
    reason: '',
    patientPhone: user?.phone || '',
  });

  useEffect(() => {
    api.get(`/doctors/${id}`)
      .then(r => setDoctor(r.data))
      .catch(() => { toast.error('Doctor not found'); navigate('/doctors'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleBook = async e => {
    e.preventDefault();
    setError('');
    if (!form.time) { setError('Please select a time slot'); return; }

    setSub(true);
    try {
      await api.post('/appointments', {
        doctorId: id,
        date:     form.date,
        time:     form.time,
        reason:   form.reason,
        patientPhone: form.patientPhone,
      });
      toast.success('Appointment booked! Awaiting doctor confirmation. 🎉');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Try another slot.');
    } finally {
      setSub(false);
    }
  };

  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!doctor) return null;

  const docName  = doctor.userId?.name || 'Doctor';
  const initials = docName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const photoSrc = doctor.photo || null;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth:680 }}>

        {/* Back */}
        <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom:20 }}>
          ← Back
        </button>

        <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:20 }}>

          {/* Doctor info card */}
          <div className="card">
            <div style={{ display:'flex', gap:16, alignItems:'center', flexWrap:'wrap' }}>
              {/* Portrait photo or initials fallback */}
              {photoSrc ? (
                <img
                  src={photoSrc}
                  alt={docName}
                  style={{
                    width:72, height:72, borderRadius:'50%',
                    objectFit:'cover', objectPosition:'top center',
                    flexShrink:0, border:'3px solid var(--teal-100)',
                    boxShadow:'0 2px 10px rgba(13,148,136,0.2)',
                  }}
                  onError={e => { e.currentTarget.style.display='none'; }}
                />
              ) : (
                <div style={{
                  width:72, height:72, borderRadius:'50%',
                  background:'var(--teal-100)', color:'var(--teal-800)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:24, fontWeight:700, flexShrink:0,
                  border:'3px solid var(--teal-200)',
                }}>
                  {initials}
                </div>
              )}
              <div style={{ flex:1 }}>
                <h2 style={{ marginBottom:3, fontSize:'1.2rem' }}>{docName}</h2>
                <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
                  <span className="badge badge-teal">{doctor.specialization}</span>
                  <span style={{ fontSize:13, color:'var(--gray-500)' }}>🏥 {doctor.hospital || 'Private Practice'}</span>
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:22, fontWeight:700, color:'var(--teal-600)', fontFamily:'var(--font-display)' }}>
                  ₹{doctor.fees?.toLocaleString()}
                </div>
                <div style={{ fontSize:11, color:'var(--gray-400)', fontWeight:600 }}>per visit</div>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display:'flex', gap:16, marginTop:18, paddingTop:18, borderTop:'1px solid var(--border)', flexWrap:'wrap' }}>
              {[
                { icon:'⭐', label:`${Number(doctor.rating||4.5).toFixed(1)} Rating` },
                { icon:'🕐', label:`${doctor.experience} yrs experience` },
                { icon:'👥', label:`${doctor.totalRatings||0} patients` },
              ].map(({ icon, label }) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'var(--gray-600)', fontWeight:500 }}>
                  <span>{icon}</span> {label}
                </div>
              ))}
            </div>

            {doctor.bio && (
              <p style={{ marginTop:14, fontSize:13.5, color:'var(--gray-600)', lineHeight:1.65, paddingTop:14, borderTop:'1px solid var(--border)' }}>
                {doctor.bio}
              </p>
            )}
          </div>

          {/* Booking form */}
          <div className="card">
            <h3 style={{ marginBottom:20, fontFamily:'var(--font-display)', fontSize:'1.1rem' }}>
              📅 Select date & time
            </h3>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleBook}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Appointment date</label>
                  <input className="form-control" type="date"
                    value={form.date} min={today}
                    onChange={set('date')} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Your phone</label>
                  <input className="form-control" type="tel" placeholder="+91 98765 43210"
                    value={form.patientPhone} onChange={set('patientPhone')} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Select time slot</label>
                <div className="time-grid">
                  {SLOT_TIMES.map(t => (
                    <button type="button" key={t}
                      className={`time-slot ${form.time === t ? 'selected' : ''}`}
                      onClick={() => setForm(p => ({ ...p, time: t }))}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Reason for visit</label>
                <textarea className="form-control" rows={3}
                  placeholder="Briefly describe your symptoms or reason…"
                  value={form.reason} onChange={set('reason')} />
              </div>

              {/* Summary */}
              {form.time && (
                <div style={{
                  background:'var(--teal-50)', border:'1px solid var(--teal-200)',
                  borderRadius:'var(--radius-sm)', padding:'14px 16px', marginBottom:18,
                  fontSize:13.5, color:'var(--teal-800)',
                }}>
                  <strong>Booking summary:</strong> {docName} · {form.date} · {form.time}<br />
                  <span style={{ color:'var(--gray-500)', fontSize:12.5 }}>Consultation fee: ₹{doctor.fees?.toLocaleString()}</span>
                </div>
              )}

              <button className="btn btn-primary btn-full btn-lg" type="submit" disabled={submitting || !form.time}>
                {submitting ? 'Confirming…' : '✓ Confirm Appointment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
