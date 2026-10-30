import React from 'react';
import { usePortal } from './context/PortalContext';
import AuthGate from './components/common/AuthGate';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import EstateModal from './components/common/EstateModal';
import AdminLoginModal from './components/common/AdminLoginModal';

// Pages
import PbiDashboard from './pages/PbiDashboard';
import SatelliteMap from './pages/SatelliteMap';
import EstatesTop10 from './pages/EstatesTop10';
import Estates177Census from './pages/Estates177Census';
import SmallTeaGrowers from './pages/SmallTeaGrowers';
import TeaJourney from './pages/TeaJourney';
import AuctionsGtac from './pages/AuctionsGtac';
import GlobalExports from './pages/GlobalExports';
import InterstateTrade from './pages/InterstateTrade';
import ProductionRegistry from './pages/ProductionRegistry';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  const { authRole, activePage } = usePortal();

  if (!authRole) {
    return <AuthGate />;
  }

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'pbi-dashboard':
      case 'dashboard':
        return <PbiDashboard />;
      case 'map-section':
      case 'satellite_map':
        return <SatelliteMap />;
      case 'top-10-estates':
      case 'estates_top10':
        return <EstatesTop10 />;
      case 'estates-177':
      case 'estates_177':
        return <Estates177Census />;
      case 'stg-analytics':
      case 'small_growers':
        return <SmallTeaGrowers />;
      case 'scrolly-journey':
      case 'tea_journey':
        return <TeaJourney />;
      case 'auctions':
      case 'auctions_gtac':
        return <AuctionsGtac />;
      case 'exports':
      case 'global_exports':
        return <GlobalExports />;
      case 'domestic':
      case 'interstate_trade':
        return <InterstateTrade />;
      case 'records':
      case 'production_registry':
        return <ProductionRegistry />;
      case 'admin-panel':
      case 'admin_panel':
        return <AdminPanel />;
      default:
        return <PbiDashboard />;
    }
  };

  return (
    <div className="portal-app">
      <Navbar />
      <div className="app-container">
        <Sidebar />
        <main className="content-area">
          {renderCurrentPage()}
        </main>
      </div>

      <EstateModal />
      <AdminLoginModal />
    </div>
  );
}
