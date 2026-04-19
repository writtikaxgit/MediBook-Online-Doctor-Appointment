import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';

const STATUS_BADGE = {
  pending:   'badge-pending',
  approved:  'badge-approved',
  rejected:  'badge-rejected',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
};

export default function DoctorDashboard() {
  const { user }       = useAuth();
  const [tab, setTab]  = useState('bookings');
  const [appts, setAppts]   = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('pending');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [apptRes, profRes] = await Promise.all([
        api.get('/appointments/doctor'),
        api.get('/doctors/me'),
      ]);
      setAppts(apptRes.data);
      setProfile(profRes.data);
    } catch { toast.error('Failed to load data'); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStatus = async (id, status) => {
    const note = status === 'rejected' ? window.prompt('Reason for rejection (optional):') : null;
    try {
      await api.put(`/appointments/${id}/status`, { status, notes: note || '' });
      toast.success(`Appointment ${status}!`);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const filtered = filter === 'all' ? appts : appts.filter(a => a.status === filter);

  const stats = {
    total:    appts.length,
    pending:  appts.filter(a => a.status === 'pending').length,
    approved: appts.filter(a => a.status === 'approved').length,
    completed:appts.filter(a => a.status === 'completed').length,
  };

  return (
    <div className="page">
      <div className="container">
        <div className="dash-layout">
          {/* Sidebar */}
          <aside className="dash-sidebar">
            <div className="card" style={{ marginBottom:14, textAlign:'center', padding:'22px 16px' }}>
              {profile?.photo ? (
                <img
                  src={profile.photo}
                  alt={user?.name}
                  style={{
                    width:64, height:64, borderRadius:'50%',
                    objectFit:'cover', objectPosition:'top center',
                    margin:'0 auto 10px', display:'block',
                    border:'3px solid var(--teal-100)',
                    boxShadow:'0 2px 8px rgba(13,148,136,0.2)',
                  }}
                  onError={e => { e.currentTarget.style.display='none'; e.currentTarget.nextSibling.style.display='flex'; }}
                />
              ) : null}
              <div style={{
                width:56, height:56, borderRadius:'50%',
                background:'var(--teal-100)', color:'var(--teal-800)',
                display: profile?.photo ? 'none' : 'flex',
                alignItems:'center', justifyContent:'center',
                fontSize:20, fontWeight:700, margin:'0 auto 10px',
              }}>
                {user?.name?.charAt(0)}
              </div>
              <div style={{ fontWeight:700, fontSize:14 }}>{user?.name}</div>
              <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{profile?.specialization || '—'}</div>
              <span className="badge badge-teal" style={{ marginTop:8 }}>
                {profile?.isApproved ? '✓ Approved' : '⏳ Pending Approval'}
              </span>
            </div>

            <div className="card">
              {[
                { key:'bookings', icon:'📋', label:'Appointments' },
                { key:'profile',  icon:'👤', label:'My Profile' },
              ].map(({ key, icon, label }) => (
                <button key={key} className={`dash-nav-item ${tab===key?'active':''}`} onClick={() => setTab(key)}>
                  <span className="dash-nav-icon">{icon}</span> {label}
                </button>
              ))}
            </div>
          </aside>

          {/* Main */}
          <main>
            {loading ? (
              <div className="spinner-wrap"><div className="spinner" /></div>
            ) : tab === 'bookings' ? (
              <>
                {/* Stats */}
                <div className="grid-4" style={{ marginBottom:24 }}>
                  {[
                    { icon:'📅', num:stats.total,     label:'Total',     color:'var(--teal-600)' },
                    { icon:'⏳', num:stats.pending,    label:'Pending',   color:'#d49520' },
                    { icon:'✅', num:stats.approved,   label:'Approved',  color:'var(--sage-600)' },
                    { icon:'🏅', num:stats.completed,  label:'Completed', color:'var(--sky-600)' },
                  ].map(({ icon, num, label, color }) => (
                    <div key={label} className="card stat-card" style={{ padding:'16px 12px' }}>
                      <div style={{ fontSize:20, marginBottom:6 }}>{icon}</div>
                      <div style={{ fontFamily:'var(--font-display)', fontSize:'1.6rem', color }}>{num}</div>
                      <div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.3px' }}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* Appointments list */}
                <div className="card" style={{ padding:0 }}>
                  <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
                    <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1rem' }}>Patient Bookings</h3>
                    <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                      {['pending','all','approved','rejected','completed'].map(s => (
                        <button key={s} onClick={() => setFilter(s)}
                          className={`filter-chip ${filter===s?'active':''}`}
                          style={{ padding:'4px 12px', fontSize:11.5 }}>
                          {s === 'all' ? 'All' : s.charAt(0).toUpperCase()+s.slice(1)}
                          {s === 'pending' && stats.pending > 0 && (
                            <span style={{ marginLeft:5, background:'var(--rose-400)', color:'#fff', borderRadius:'var(--radius-full)', padding:'1px 7px', fontSize:10 }}>
                              {stats.pending}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  {filtered.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon">📋</div>
                      <h3>No {filter !== 'all' ? filter : ''} appointments</h3>
                    </div>
                  ) : filtered.map(appt => (
                    <DoctorApptRow key={appt._id} appt={appt} onUpdate={updateStatus} />
                  ))}
                </div>
              </>
            ) : (
              <DoctorProfilePanel profile={profile} onRefresh={fetchData} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function DoctorApptRow({ appt, onUpdate }) {
  const dateObj = new Date(appt.date + 'T00:00:00');
  const day     = dateObj.getDate();
  const month   = dateObj.toLocaleString('en', { month:'short' });

  return (
    <div style={{ padding:'15px 20px', borderBottom:'1px solid var(--gray-100)', display:'flex', alignItems:'flex-start', gap:14, flexWrap:'wrap' }}>
      <div className="appt-date-badge" style={{ minWidth:56 }}>
        <div className="appt-date-day">{day}</div>
        <div className="appt-date-month">{month}</div>
      </div>
      <div style={{ flex:1, minWidth:160 }}>
        <div style={{ fontWeight:700, fontSize:14 }}>{appt.patientName}</div>
        <div style={{ fontSize:12, color:'var(--text-muted)' }}>{appt.patientEmail}</div>
        {appt.patientPhone && <div style={{ fontSize:11.5, color:'var(--gray-400)' }}>📞 {appt.patientPhone}</div>}
        {appt.reason && <div style={{ fontSize:12, color:'var(--gray-500)', marginTop:4, fontStyle:'italic' }}>"{appt.reason}"</div>}
      </div>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontWeight:600, fontSize:13, color:'var(--teal-700)' }}>🕐 {appt.time}</div>
        <div style={{ fontSize:11, color:'var(--gray-400)' }}>₹{appt.fees?.toLocaleString()}</div>
      </div>
      <span className={`badge ${STATUS_BADGE[appt.status]||'badge-teal'}`} style={{ alignSelf:'center' }}>
        {appt.status}
      </span>
      {appt.status === 'pending' && (
        <div style={{ display:'flex', gap:6, alignSelf:'center' }}>
          <button className="btn btn-sage btn-sm" onClick={() => onUpdate(appt._id, 'approved')}>Accept</button>
          <button className="btn btn-rose btn-sm" onClick={() => onUpdate(appt._id, 'rejected')}>Reject</button>
        </div>
      )}
      {appt.status === 'approved' && (
        <button className="btn btn-secondary btn-sm" style={{ alignSelf:'center' }}
          onClick={() => onUpdate(appt._id, 'completed')}>
          Mark Done
        </button>
      )}
    </div>
  );
}

function DoctorProfilePanel({ profile, onRefresh }) {
  const [form, setForm]   = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setForm({
      specialization: profile.specialization,
      experience:     profile.experience,
      fees:           profile.fees,
      hospital:       profile.hospital || '',
      bio:            profile.bio || '',
      phone:          profile.phone || '',
      address:        profile.address || '',
    });
  }, [profile]);

  if (!form) return <div className="spinner-wrap"><div className="spinner" /></div>;

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/doctors/me', form);
      toast.success('Profile updated!');
      onRefresh();
    } catch { toast.error('Failed to update profile'); }
    finally  { setSaving(false); }
  };

  return (
    <div className="card">
      <h3 style={{ fontFamily:'var(--font-display)', marginBottom:22 }}>My Profile</h3>
      {!profile?.isApproved && (
        <div className="alert alert-warning" style={{ marginBottom:18 }}>
          ⏳ Your profile is pending admin approval. You can update your details while waiting.
        </div>
      )}
      <form onSubmit={handleSave}>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Specialization</label>
            <input className="form-control" value={form.specialization} onChange={set('specialization')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Experience (years)</label>
            <input className="form-control" type="number" value={form.experience} onChange={set('experience')} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Consultation fee (₹)</label>
            <input className="form-control" type="number" value={form.fees} onChange={set('fees')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-control" value={form.phone} onChange={set('phone')} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Hospital / Clinic</label>
          <input className="form-control" value={form.hospital} onChange={set('hospital')} />
        </div>
        <div className="form-group">
          <label className="form-label">Address</label>
          <input className="form-control" value={form.address} onChange={set('address')} />
        </div>
        <div className="form-group">
          <label className="form-label">Bio</label>
          <textarea className="form-control" rows={4} value={form.bio} onChange={set('bio')} />
        </div>
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving…' : '💾 Save Changes'}
        </button>
      </form>
    </div>
  );
}
