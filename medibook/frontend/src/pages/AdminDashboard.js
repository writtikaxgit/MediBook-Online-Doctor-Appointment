import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../context/AuthContext';
import { toast } from '../components/Toast';

const STATUS_BADGE = {
  pending:   'badge-pending',
  approved:  'badge-approved',
  rejected:  'badge-rejected',
  completed: 'badge-completed',
  cancelled: 'badge-cancelled',
};

export default function AdminDashboard() {
  const [tab, setTab]      = useState('overview');
  const [stats, setStats]  = useState(null);
  const [doctors, setDoctors]   = useState([]);
  const [users, setUsers]       = useState([]);
  const [appts, setAppts]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [apptFilter, setApptFilter] = useState('all');

  const fetchStats = useCallback(async () => {
    try { const { data } = await api.get('/admin/stats'); setStats(data); } catch {}
  }, []);

  const fetchDoctors = useCallback(async () => {
    try { const { data } = await api.get('/admin/doctors'); setDoctors(data); } catch {}
  }, []);

  const fetchUsers = useCallback(async () => {
    try { const { data } = await api.get('/admin/users'); setUsers(data); } catch {}
  }, []);

  const fetchAppts = useCallback(async () => {
    try { const { data } = await api.get(`/admin/appointments?status=${apptFilter}`); setAppts(data); } catch {}
  }, [apptFilter]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchStats(), fetchDoctors(), fetchUsers()]).finally(() => setLoading(false));
  }, [fetchStats, fetchDoctors, fetchUsers]);

  useEffect(() => { if (tab === 'appointments') fetchAppts(); }, [tab, fetchAppts]);

  const toggleApprove = async (id, current) => {
    try {
      await api.put(`/admin/doctors/${id}/approve`, { isApproved: !current });
      toast.success(current ? 'Doctor unapproved' : 'Doctor approved ✓');
      fetchDoctors(); fetchStats();
    } catch { toast.error('Failed'); }
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm('Delete this doctor and their account?')) return;
    try {
      await api.delete(`/admin/doctors/${id}`);
      toast.success('Doctor deleted');
      fetchDoctors(); fetchStats();
    } catch { toast.error('Delete failed'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers(); fetchStats();
    } catch { toast.error('Delete failed'); }
  };

  const tabs = [
    { key:'overview',     icon:'📊', label:'Overview' },
    { key:'doctors',      icon:'👨‍⚕️', label:'Doctors' },
    { key:'users',        icon:'👥', label:'Patients' },
    { key:'appointments', icon:'📅', label:'Appointments' },
  ];

  return (
    <div className="page">
      <div className="container">
        <div className="dash-layout">
          {/* Sidebar */}
          <aside className="dash-sidebar">
            <div className="card" style={{ marginBottom:14, padding:'18px 16px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:42, height:42, borderRadius:'50%', background:'var(--lavender-100,#e4dffe)', color:'var(--lavender-600,#6450d4)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:16 }}>A</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:14 }}>Super Admin</div>
                  <span className="badge" style={{ background:'#e4dffe', color:'#4a3890', marginTop:3 }}>admin</span>
                </div>
              </div>
            </div>
            <div className="card">
              {tabs.map(({ key, icon, label }) => (
                <button key={key} className={`dash-nav-item ${tab===key?'active':''}`} onClick={() => setTab(key)}>
                  <span className="dash-nav-icon">{icon}</span>
                  {label}
                  {key === 'doctors' && stats?.pendingDoctors > 0 && (
                    <span style={{ marginLeft:'auto', background:'var(--rose-400)', color:'#fff', borderRadius:'var(--radius-full)', padding:'1px 8px', fontSize:11, fontWeight:700 }}>
                      {stats.pendingDoctors}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </aside>

          {/* Main */}
          <main>
            {loading ? (
              <div className="spinner-wrap"><div className="spinner" /></div>
            ) : (

              /* ─── OVERVIEW ─── */
              tab === 'overview' ? (
                <>
                  <div style={{ marginBottom:22 }}>
                    <h2 style={{ marginBottom:4 }}>Admin Overview</h2>
                    <p style={{ fontSize:13, color:'var(--text-muted)' }}>Platform statistics at a glance</p>
                  </div>
                  <div className="grid-4" style={{ marginBottom:28 }}>
                    {[
                      { icon:'👥', num:stats?.patients||0,      label:'Patients',         color:'var(--teal-600)' },
                      { icon:'👨‍⚕️', num:stats?.doctors||0,       label:'Active Doctors',   color:'var(--sage-600)' },
                      { icon:'📅', num:stats?.appointments||0,   label:'Appointments',     color:'var(--sky-600)' },
                      { icon:'⏳', num:stats?.pendingDoctors||0, label:'Pending Approvals',color:'#d49520' },
                    ].map(({ icon, num, label, color }) => (
                      <div key={label} className="card stat-card">
                        <div className="stat-icon">{icon}</div>
                        <div className="stat-num" style={{ color }}>{num}</div>
                        <div className="stat-lbl">{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Pending doctor approvals */}
                  {stats?.recentDoctors?.length > 0 && (
                    <div className="card" style={{ marginBottom:24 }}>
                      <h3 style={{ fontFamily:'var(--font-display)', marginBottom:16, fontSize:'1rem' }}>
                        ⚠️ Awaiting Doctor Approvals
                      </h3>
                      {stats.recentDoctors.map(doc => (
                        <div key={doc._id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid var(--gray-100)', flexWrap:'wrap' }}>
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:600, fontSize:13 }}>{doc.userId?.name}</div>
                            <div style={{ fontSize:12, color:'var(--text-muted)' }}>{doc.specialization} · {doc.userId?.email}</div>
                          </div>
                          <button className="btn btn-sage btn-sm"
                            onClick={() => toggleApprove(doc._id, false)}>
                            ✓ Approve
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Recent appointments */}
                  {stats?.recentAppointments?.length > 0 && (
                    <div className="card">
                      <h3 style={{ fontFamily:'var(--font-display)', marginBottom:16, fontSize:'1rem' }}>Recent Appointments</h3>
                      {stats.recentAppointments.map(a => (
                        <div key={a._id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid var(--gray-100)', flexWrap:'wrap' }}>
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:600, fontSize:13 }}>{a.patientName} → {a.doctorName}</div>
                            <div style={{ fontSize:12, color:'var(--text-muted)' }}>{a.date} · {a.time}</div>
                          </div>
                          <span className={`badge ${STATUS_BADGE[a.status]||'badge-teal'}`}>{a.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>

              /* ─── DOCTORS ─── */
              ) : tab === 'doctors' ? (
                <>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:20, flexWrap:'wrap', gap:10 }}>
                    <div>
                      <h2 style={{ marginBottom:4 }}>Manage Doctors</h2>
                      <p style={{ fontSize:13, color:'var(--text-muted)' }}>{doctors.length} total · {doctors.filter(d=>!d.isApproved).length} pending approval</p>
                    </div>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Doctor</th>
                          <th>Specialization</th>
                          <th>Experience</th>
                          <th>Fees</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {doctors.length === 0 ? (
                          <tr><td colSpan={6} style={{ textAlign:'center', padding:'40px', color:'var(--text-muted)' }}>No doctors yet</td></tr>
                        ) : doctors.map(doc => (
                          <tr key={doc._id}>
                            <td>
                              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                {doc.photo ? (
                                  <img src={doc.photo} alt={doc.userId?.name}
                                    style={{ width:36, height:36, borderRadius:'50%', objectFit:'cover', objectPosition:'top center', flexShrink:0, border:'2px solid var(--teal-100)' }}
                                    onError={e => { e.currentTarget.style.display='none'; e.currentTarget.nextSibling.style.display='flex'; }}
                                  />
                                ) : null}
                                <div style={{
                                  width:36, height:36, borderRadius:'50%',
                                  background:'var(--teal-100)', color:'var(--teal-700)',
                                  display: doc.photo ? 'none' : 'flex',
                                  alignItems:'center', justifyContent:'center',
                                  fontSize:13, fontWeight:700, flexShrink:0,
                                }}>
                                  {doc.userId?.name?.charAt(0)}
                                </div>
                                <div>
                                  <div style={{ fontWeight:600, fontSize:13 }}>{doc.userId?.name}</div>
                                  <div style={{ fontSize:11, color:'var(--text-muted)' }}>{doc.userId?.email}</div>
                                </div>
                              </div>
                            </td>
                            <td><span className="badge badge-teal">{doc.specialization}</span></td>
                            <td style={{ fontSize:13 }}>{doc.experience} yrs</td>
                            <td style={{ fontSize:13 }}>₹{doc.fees?.toLocaleString()}</td>
                            <td>
                              <span className={`badge ${doc.isApproved ? 'badge-approved' : 'badge-pending'}`}>
                                {doc.isApproved ? '✓ Approved' : '⏳ Pending'}
                              </span>
                            </td>
                            <td>
                              <div style={{ display:'flex', gap:6 }}>
                                <button className={`btn btn-sm ${doc.isApproved ? 'btn-secondary' : 'btn-sage'}`}
                                  onClick={() => toggleApprove(doc._id, doc.isApproved)}>
                                  {doc.isApproved ? 'Revoke' : 'Approve'}
                                </button>
                                <button className="btn btn-rose btn-sm" onClick={() => deleteDoctor(doc._id)}>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>

              /* ─── USERS ─── */
              ) : tab === 'users' ? (
                <>
                  <div style={{ marginBottom:20 }}>
                    <h2 style={{ marginBottom:4 }}>Manage Patients</h2>
                    <p style={{ fontSize:13, color:'var(--text-muted)' }}>{users.length} registered patients</p>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Joined</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.length === 0 ? (
                          <tr><td colSpan={5} style={{ textAlign:'center', padding:'40px', color:'var(--text-muted)' }}>No patients yet</td></tr>
                        ) : users.map(u => (
                          <tr key={u._id}>
                            <td style={{ fontWeight:600, fontSize:13 }}>{u.name}</td>
                            <td style={{ fontSize:13, color:'var(--text-muted)' }}>{u.email}</td>
                            <td style={{ fontSize:13 }}>{u.phone || '—'}</td>
                            <td style={{ fontSize:12, color:'var(--text-muted)' }}>
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td>
                              <button className="btn btn-rose btn-sm" onClick={() => deleteUser(u._id)}>
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>

              /* ─── APPOINTMENTS ─── */
              ) : (
                <>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:10 }}>
                    <div>
                      <h2 style={{ marginBottom:4 }}>All Appointments</h2>
                      <p style={{ fontSize:13, color:'var(--text-muted)' }}>{appts.length} records</p>
                    </div>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                      {['all','pending','approved','rejected','completed','cancelled'].map(s => (
                        <button key={s} onClick={() => setApptFilter(s)}
                          className={`filter-chip ${apptFilter===s?'active':''}`}
                          style={{ padding:'5px 12px', fontSize:11.5 }}>
                          {s === 'all' ? 'All' : s.charAt(0).toUpperCase()+s.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Patient</th>
                          <th>Doctor</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Fees</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appts.length === 0 ? (
                          <tr><td colSpan={6} style={{ textAlign:'center', padding:'40px', color:'var(--text-muted)' }}>No appointments found</td></tr>
                        ) : appts.map(a => (
                          <tr key={a._id}>
                            <td>
                              <div style={{ fontWeight:600, fontSize:13 }}>{a.patientName}</div>
                              <div style={{ fontSize:11, color:'var(--text-muted)' }}>{a.patientEmail}</div>
                            </td>
                            <td>
                              <div style={{ fontWeight:600, fontSize:13 }}>{a.doctorName}</div>
                              <div style={{ fontSize:11, color:'var(--text-muted)' }}>{a.specialization}</div>
                            </td>
                            <td style={{ fontSize:13 }}>{a.date}</td>
                            <td style={{ fontSize:13 }}>{a.time}</td>
                            <td style={{ fontSize:13 }}>₹{a.fees?.toLocaleString()}</td>
                            <td><span className={`badge ${STATUS_BADGE[a.status]||'badge-teal'}`}>{a.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
