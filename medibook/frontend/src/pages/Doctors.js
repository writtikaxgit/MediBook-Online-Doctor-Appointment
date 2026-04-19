import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../context/AuthContext';
import DoctorCard from '../components/DoctorCard';

export default function Doctors() {
  const [searchParams]          = useSearchParams();
  const [doctors, setDoctors]   = useState([]);
  const [specs, setSpecs]       = useState(['All']);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [activeSpec, setSpec]   = useState(searchParams.get('spec') || 'All');
  const [sort, setSort]         = useState('rating');

  // Fetch specializations once
  useEffect(() => {
    api.get('/doctors/specializations').then(r => setSpecs(r.data)).catch(() => {});
  }, []);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sort });
      if (activeSpec !== 'All') params.append('specialization', activeSpec);
      if (search.trim())        params.append('search', search.trim());
      const { data } = await api.get(`/doctors?${params}`);
      setDoctors(data);
    } catch {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [activeSpec, sort, search]);

  useEffect(() => {
    const id = setTimeout(fetchDoctors, 250);
    return () => clearTimeout(id);
  }, [fetchDoctors]);

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom:28 }}>
          <h1 className="page-title">Find a Doctor</h1>
          <p className="page-subtitle">Browse {doctors.length} verified specialists</p>
        </div>

        {/* Search + Sort bar */}
        <div style={{ display:'flex', gap:12, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
          <div className="search-wrap" style={{ flex:1, minWidth:220 }}>
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder="Search by name, specialty or hospital…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="form-control"
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{ width:'auto', borderRadius:'var(--radius-full)', minWidth:160 }}
          >
            <option value="rating">Top Rated</option>
            <option value="fees_asc">Price: Low → High</option>
            <option value="fees_desc">Price: High → Low</option>
            <option value="-createdAt">Newest</option>
          </select>
        </div>

        {/* Specialty filter chips */}
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:28 }}>
          {specs.map(s => (
            <button
              key={s}
              className={`filter-chip ${activeSpec === s ? 'active' : ''}`}
              onClick={() => setSpec(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : doctors.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No doctors found</h3>
            <p>Try adjusting your search or filters</p>
            <button className="btn btn-outline btn-sm" style={{ marginTop:14 }}
              onClick={() => { setSearch(''); setSpec('All'); }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {doctors.map(doc => <DoctorCard key={doc._id} doctor={doc} />)}
          </div>
        )}
      </div>
    </div>
  );
}
