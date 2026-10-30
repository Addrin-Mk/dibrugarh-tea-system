import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { Menu, Lock, LogOut } from 'lucide-react';

export default function Navbar() {
  const { 
    activePage, 
    setActivePage, 
    setSidebarOpen, 
    branding, 
    authRole, 
    handleLogout, 
    setAdminModalOpen 
  } = usePortal();

  return (
    <header className="app-topbar">
      <div className="topbar-left">
        <button 
          type="button" 
          className="btn btn-ghost" 
          onClick={() => setSidebarOpen(prev => !prev)}
          style={{ padding: '6px 10px', display: 'flex', alignItems: 'center' }}
          aria-label="Toggle menu"
        >
          <Menu size={18} />
        </button>

        <div className="topbar-crumb">
          <span>🌿 Dibrugarh Portal</span>
          <span>&gt;</span>
          <span style={{ color: 'var(--primary)', textTransform: 'capitalize' }}>
            {activePage.replace('-', ' ')}
          </span>
        </div>

        <span className="topbar-notice-pill">
          {branding.noticeText ? branding.noticeText.substring(0, 50) + '...' : 'Live 2026 Engine'}
        </span>
      </div>

      <div className="topbar-right">
        {authRole === 'admin' ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#d97706', background: '#fef3c7', padding: '3px 8px', borderRadius: '12px' }}>
              🛡️ Master Admin
            </span>
            <button 
              type="button" 
              className="btn btn-ghost" 
              onClick={handleLogout}
              style={{ color: '#b91c1c' }}
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        ) : (
          <button 
            type="button" 
            className="btn btn-gold" 
            onClick={() => setAdminModalOpen(true)}
          >
            <Lock size={14} /> Admin Login
          </button>
        )}
      </div>
    </header>
  );
}
