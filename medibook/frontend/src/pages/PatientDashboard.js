import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function PatientDashboard() {
  const { user }      = useAuth();
  const navigate      = useNavigate();
  const [appts, setAppts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');

  const fetchAppts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/appointments/patient');
      setAppts(data);
    } catch { toast.error('Failed to load appointments'); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { fetchAppts(); }, [fetchAppts]);

  const cancelAppt = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await api.put(`/appointments/${id}/cancel`);
      toast.success('Appointment cancelled');
      fetchAppts();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to cancel'); }
  };

  const filtered = filter === 'all' ? appts : appts.filter(a => a.status === filter);

  const stats = {
    total:     appts.length,
    approved:  appts.filter(a => a.status === 'approved').length,
    pending:   appts.filter(a => a.status === 'pending').length,
    completed: appts.filter(a => a.status === 'completed').length,
  };

  return (
    <div className="page">
      <div className="container">
        {/* Greeting */}
        <div style={{ marginBottom:28 }}>
          <h1 className="page-title">Hello, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="page-subtitle">Manage your appointments and health journey</p>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom:32 }}>
          {[
            { icon:'📅', num:stats.total,     label:'Total Bookings',     color:'var(--teal-600)' },
            { icon:'✅', num:stats.approved,   label:'Confirmed',          color:'var(--sage-600)' },
            { icon:'⏳', num:stats.pending,    label:'Awaiting Response',  color:'#d49520' },
            { icon:'🏅', num:stats.completed,  label:'Completed Visits',   color:'var(--sky-600)' },
          ].map(({ icon, num, label, color }) => (
            <div key={label} className="card stat-card">
              <div className="stat-icon">{icon}</div>
              <div className="stat-num" style={{ color }}>{num}</div>
              <div className="stat-lbl">{label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div style={{ display:'flex', gap:12, marginBottom:28, flexWrap:'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/doctors')}>
            + Book New Appointment
          </button>
        </div>

        {/* Appointments list */}
        <div className="card" style={{ padding:0 }}>
          <div style={{ padding:'18px 22px', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.05rem' }}>My Appointments</h3>
            {/* Filter tabs */}
            <div style={{ display:'flex', gap:6 }}>
              {['all','pending','approved','completed','cancelled'].map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`filter-chip ${filter === s ? 'active' : ''}`}
                  style={{ padding:'5px 13px', fontSize:12 }}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No appointments {filter !== 'all' ? `(${filter})` : 'yet'}</h3>
              <p>Book your first consultation to get started</p>
              <button className="btn btn-primary btn-sm" style={{ marginTop:14 }}
                onClick={() => navigate('/doctors')}>
                Find a Doctor
              </button>
            </div>
          ) : (
            <div>
              {filtered.map(appt => (
                <ApptRow key={appt._id} appt={appt} onCancel={cancelAppt} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ApptRow({ appt, onCancel }) {
  const dateObj  = new Date(appt.date + 'T00:00:00');
  const day      = dateObj.getDate();
  const month    = dateObj.toLocaleString('en', { month:'short' });

  return (
    <div style={{ padding:'16px 22px', borderBottom:'1px solid var(--gray-100)', display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
      {/* Date badge */}
      <div className="appt-date-badge">
        <div className="appt-date-day">{day}</div>
        <div className="appt-date-month">{month}</div>
      </div>

      {/* Doctor info */}
      <div style={{ flex:1, minWidth:160 }}>
        <div style={{ fontWeight:700, fontSize:14, marginBottom:2 }}>{appt.doctorName}</div>
        <div style={{ fontSize:12, color:'var(--text-muted)' }}>{appt.specialization}</div>
        {appt.reason && <div style={{ fontSize:11.5, color:'var(--gray-400)', marginTop:2 }}>{appt.reason}</div>}
      </div>

      {/* Time + fee */}
      <div style={{ minWidth:100, textAlign:'center' }}>
        <div style={{ fontWeight:600, fontSize:13, color:'var(--teal-700)' }}>🕐 {appt.time}</div>
        <div style={{ fontSize:12, color:'var(--gray-400)', marginTop:2 }}>₹{appt.fees?.toLocaleString()}</div>
      </div>

      {/* Status */}
      <span className={`badge ${STATUS_BADGE[appt.status] || 'badge-teal'}`}>
        {appt.status}
      </span>

      {/* Notes */}
      {appt.notes && (
        <div style={{ fontSize:12, color:'var(--gray-500)', fontStyle:'italic', maxWidth:180 }}>
          "{appt.notes}"
        </div>
      )}

      {/* Actions */}
      {['pending','approved'].includes(appt.status) && (
        <button className="btn btn-rose btn-sm" onClick={() => onCancel(appt._id)}>
          Cancel
        </button>
      )}
    </div>
  );
}
