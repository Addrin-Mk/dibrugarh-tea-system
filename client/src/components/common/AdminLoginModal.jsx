import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Lock, X, ShieldAlert } from 'lucide-react';

export default function AdminLoginModal() {
  const { adminModalOpen, setAdminModalOpen, handleLogin } = usePortal();
  const [username, setUsername] = useState('Admin');
  const [password, setPassword] = useState('123');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  if (!adminModalOpen) return null;

  async function onSubmit(ev) {
    ev.preventDefault();
    setLoading(true);
    setErr('');
    const res = await handleLogin(username, password);
    setLoading(false);
    if (res.success) {
      setAdminModalOpen(false);
    } else {
      setErr(res.message || 'Authentication failed. Please verify credentials.');
    }
  }

  return (
    <div className="modal-backdrop" onClick={() => setAdminModalOpen(false)}>
      <div 
        className="modal-dialog" 
        style={{ maxWidth: '440px', padding: '28px' }} 
        onClick={ev => ev.stopPropagation()}
      >
        <button 
          type="button" 
          className="modal-close" 
          onClick={() => setAdminModalOpen(false)}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <Lock size={24} />
          </div>
          <h3 style={{ margin: '0 0 6px', fontSize: '20px' }}>Master Management Login</h3>
          <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--ink-soft)' }}>
            Enter your credentials to unlock website CMS controls &amp; direct editing.
          </p>
        </div>

        {err && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '12.5px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={16} />
            <span>{err}</span>
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="admin-form-group">
            <label>Username</label>
            <input 
              type="text" 
              className="admin-input" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              placeholder="e.g. Admin or ABCD"
              required 
            />
          </div>

          <div className="admin-form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="admin-input" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>

          <div style={{ background: 'var(--bg)', padding: '10px 12px', borderRadius: '6px', fontSize: '11.5px', color: 'var(--ink-soft)', lineHeight: '1.4' }}>
            💡 <strong>Roles:</strong><br />
            • <b>Master Admin:</b> <code>Admin</code> / <code>123</code> (Unlocks Full CMS)<br />
            • <b>Operator:</b> <code>ABCD</code> / <code>11111</code> (Analytics)
          </div>

          <button 
            type="submit" 
            className="btn btn-gold" 
            style={{ width: '100%', padding: '10px', fontSize: '14px', marginTop: '6px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Unlock Management Panel'}
          </button>
        </form>
      </div>
    </div>
  );
}
