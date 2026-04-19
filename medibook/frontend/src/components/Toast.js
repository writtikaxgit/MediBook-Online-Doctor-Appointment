import React, { useState, useEffect, useCallback } from 'react';

// Global toast event system
const listeners = [];
export const toast = {
  success: (msg) => listeners.forEach(fn => fn({ msg, type: 'success' })),
  error:   (msg) => listeners.forEach(fn => fn({ msg, type: 'error' })),
  info:    (msg) => listeners.forEach(fn => fn({ msg, type: 'info' })),
};

export default function Toast() {
  const [items, setItems] = useState([]);

  const add = useCallback(({ msg, type }) => {
    const id = Date.now() + Math.random();
    setItems(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setItems(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  useEffect(() => {
    listeners.push(add);
    return () => { const i = listeners.indexOf(add); if (i > -1) listeners.splice(i, 1); };
  }, [add]);

  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const colors = {
    success: { bg: '#e8f8f0', border: '#6bc99a', text: '#1f6b40', icon: '#3aaa6e' },
    error:   { bg: '#fff0f3', border: '#f09aae', text: '#a0243e', icon: '#e05070' },
    info:    { bg: '#eff7ff', border: '#90c4f8', text: '#1a5a9a', icon: '#4090e0' },
  };

  return (
    <div style={{ position:'fixed', bottom:24, right:24, zIndex:9999, display:'flex', flexDirection:'column', gap:10, maxWidth:320 }}>
      {items.map(({ id, msg, type }) => {
        const c = colors[type] || colors.info;
        return (
          <div key={id} style={{
            background: c.bg, border: `1px solid ${c.border}`,
            borderRadius: 12, padding: '12px 16px',
            display: 'flex', alignItems: 'flex-start', gap: 10,
            boxShadow: '0 4px 18px rgba(0,0,0,0.10)',
            animation: 'slideInRight 0.25s ease',
          }}>
            <span style={{ width:20, height:20, borderRadius:'50%', background:c.icon, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0, marginTop:1 }}>{icons[type]}</span>
            <span style={{ fontSize:13.5, color:c.text, fontWeight:500, lineHeight:1.45 }}>{msg}</span>
          </div>
        );
      })}
      <style>{`@keyframes slideInRight { from { transform:translateX(60px);opacity:0; } to { transform:none;opacity:1; } }`}</style>
    </div>
  );
}
