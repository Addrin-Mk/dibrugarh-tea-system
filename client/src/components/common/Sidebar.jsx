import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { 
  BarChart2, 
  MapPin, 
  Award, 
  Building2, 
  Users, 
  Compass, 
  Scale, 
  Globe, 
  Truck, 
  Database, 
  ShieldCheck 
} from 'lucide-react';

export default function Sidebar() {
  const { activePage, setActivePage, sidebarOpen, setSidebarOpen, branding, authRole, setAdminModalOpen } = usePortal();

  const navItems = [
    { id: 'pbi-dashboard', label: 'Power BI Dashboard', icon: BarChart2 },
    { id: 'map-section', label: 'Estates Satellite Map', icon: MapPin },
    { id: 'top-10-estates', label: 'Top 10 Landmark Estates', icon: Award },
    { id: 'estates-177', label: '177 Corporate Estates', icon: Building2 },
    { id: 'stg-analytics', label: 'Small Tea Growers', icon: Users },
    { id: 'scrolly-journey', label: 'The Tea Journey', icon: Compass },
    { id: 'auctions', label: 'Auctions & Realization', icon: Scale },
    { id: 'exports', label: 'Global Exports & Trade', icon: Globe },
    { id: 'domestic', label: 'Interstate Trade & Flushes', icon: Truck },
    { id: 'records', label: 'Production Registry', icon: Database }
  ];

  return (
    <>
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-brand-title">{branding.siteTitle || 'Dibrugarh Tea System'}</h2>
          <div className="sidebar-brand-subtitle">{branding.siteSub || 'Assam Agronomy & Trade'}</div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setActivePage(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            type="button"
            className={`sidebar-item sidebar-item-admin ${activePage === 'admin-panel' ? 'active' : ''}`}
            onClick={() => {
              if (authRole === 'admin') {
                setActivePage('admin-panel');
              } else {
                setAdminModalOpen(true);
              }
              setSidebarOpen(false);
            }}
          >
            <ShieldCheck size={16} />
            <span>🔐 Admin Panel (CMS)</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
