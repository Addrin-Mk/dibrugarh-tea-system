import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AuthGate() {
  const { handleLogin } = usePortal();
  const [username, setUsername] = useState('ABCD');
  const [password, setPassword] = useState('11111');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function onLogin(e) {
    e.preventDefault();
    setLoading(true);
    setErr('');
    const res = await handleLogin(username, password);
    setLoading(false);
    if (!res.success) {
      setErr(res.message);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #082210 0%, #166534 50%, #064e3b 100%)',
      padding: '20px',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        background: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        padding: '36px 32px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <Lock size={28} />
        </div>

        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', margin: '0 0 6px', color: 'var(--primary-deep)' }}>
          Dibrugarh Tea Information System
        </h2>
        <div style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
          Official 2026 Horizon Analytics Portal
        </div>
        <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: '1.5', margin: '0 0 24px' }}>
          Please authenticate with your district credentials to access interactive harvest metrics, satellite GIS mapping, and trade models.
        </p>

        {err && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '12.5px', marginBottom: '16px' }}>
            {err}
          </div>
        )}

        <form onSubmit={onLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
          <div className="admin-form-group">
            <label>Username</label>
            <input 
              type="text" 
              className="admin-input" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              placeholder="ABCD or Admin"
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

          <div style={{ background: 'var(--bg)', padding: '10px 14px', borderRadius: '8px', fontSize: '11.5px', color: 'var(--ink-soft)', lineHeight: '1.4' }}>
            🔑 <strong>Authorized Portals:</strong><br />
            • <b>Operator:</b> <code>ABCD</code> / <code>11111</code> (Analytics)<br />
            • <b>Administrator:</b> <code>Admin</code> / <code>123</code> (Full CMS)
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ padding: '12px', fontSize: '14px', marginTop: '8px', borderRadius: '10px', width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Enter Analytics Portal'} <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
