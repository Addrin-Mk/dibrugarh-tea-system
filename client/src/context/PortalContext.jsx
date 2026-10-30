import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api/client';

const PortalContext = createContext();

export function PortalProvider({ children }) {
  // Navigation: activePage matches sidebar items and App.jsx switch
  const [activePage, setActivePage] = useState('pbi-dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authentication: 'operator' | 'admin' | null
  const [authRole, setAuthRole] = useState(() => {
    return sessionStorage.getItem('tea_portal_role') || null;
  });
  const [authToken, setAuthToken] = useState(() => {
    return sessionStorage.getItem('tea_portal_token') || null;
  });
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Slicer Year: '2026' | '2025' | '2024' | '2023'
  const [activeYear, setActiveYear] = useState('2026');

  // Estates dataset
  const [estates, setEstates] = useState([]);
  const [census177, setCensus177] = useState([]);
  const [selectedEstateModal, setSelectedEstateModal] = useState(null);

  // Small Tea Growers dataset
  const [growers, setGrowers] = useState([]);
  const [growerSearchQuery, setGrowerSearchQuery] = useState('');

  // CMS Pages data
  const [cmsPages, setCmsPages] = useState({});

  // Branding & Theme
  const [branding, setBranding] = useState({
    siteTitle: 'Dibrugarh — Tea Capital of India',
    siteSub: 'Interactive Power BI & Trade Analytics',
    tagline: 'Directorate of Tea & Assam Agricultural Intelligence Division',
    noticeText: 'Dibrugarh Tea Information & Power BI Analytics System • 2026 Edition | Updated to 2026 Horizon',
    footerDesc: 'A comprehensive interactive digital twin of Dibrugarh’s tea economy, bridging official statistical archives, smallholder surveys, auction price indices, and global trade realizations.',
    footerCopy: '© 2026 Dibrugarh Tea Information System & Power BI Analytics Engine.',
    primaryColor: '#15803d',
    secondaryColor: '#84cc16',
    goldColor: '#d97706',
    bgColor: '#f8faf7'
  });

  // Macro State
  const [portalState, setPortalState] = useState({
    green_leaf_mkg: 235.0,
    made_tea_mkg: 74.7,
    p_gtac: 232.50,
    p_orthodox: 298.50,
    p_ctc: 218.40,
    p_dust: 178.20,
    p_stg_leaf: 32.50,
    outturn_ratio: 0.318,
    area_total_ha: 55303.18,
    area_corporate_ha: 33019.90,
    area_stg_ha: 22283.28,
    estates_count: 177,
    stg_count: 29771,
    workers_total: 121671,
    workers_factory: 18995,
    wages_annual_cr: 790.03,
    leaf_gvo_cr: 661.45
  });

  // Year multipliers for dynamic slicer calculation
  const yearMultipliers = {
    '2026': { factor: 1.0, label: '2026 (Projected)', trend: '+4.7%' },
    '2025': { factor: 0.955, label: '2025 Actual', trend: '+4.4%' },
    '2024': { factor: 0.915, label: '2024 Actual', trend: '+2.6%' },
    '2023': { factor: 0.891, label: '2023 Baseline', trend: 'Base Year' }
  };

  const curr = yearMultipliers[activeYear] || yearMultipliers['2026'];
  const currentMetrics = {
    year: activeYear,
    production: (103.0 * curr.factor).toFixed(1),
    avgPrice: Math.round(241 * curr.factor),
    hectares: (83700 * curr.factor).toFixed(0),
    workforce: (214500 * curr.factor).toFixed(0),
    organizedPct: 48.8,
    stgPct: 51.2,
    trend: curr.trend
  };

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    try {
      const [estRes, growRes, cmsRes, brandRes, stateRes] = await Promise.all([
        api.fetchEstatesApi(),
        api.fetchGrowersApi(),
        api.fetchCmsPagesApi(),
        api.fetchBrandingApi(),
        api.fetchStateApi()
      ]);

      if (estRes && estRes.top10) {
        setEstates(estRes.top10);
        setCensus177(estRes.census || []);
      }
      if (growRes && growRes.data) setGrowers(growRes.data);
      if (cmsRes && cmsRes.pages) setCmsPages(cmsRes.pages);
      if (brandRes && brandRes.branding) {
        setBranding(brandRes.branding);
        applyThemeColorsToDom(brandRes.branding);
      }
      if (stateRes && stateRes.state) setPortalState(stateRes.state);
    } catch (err) {
      console.warn('Initial server fetch error:', err);
    }
  }

  function applyThemeColorsToDom(b) {
    if (!b) return;
    if (b.primaryColor) document.documentElement.style.setProperty('--primary', b.primaryColor);
    if (b.goldColor) document.documentElement.style.setProperty('--gold', b.goldColor);
    if (b.bgColor) document.documentElement.style.setProperty('--bg', b.bgColor);
  }

  async function handleLogin(username, password) {
    const res = await api.loginApi(username, password);
    if (res.success) {
      setAuthRole(res.role);
      setAuthToken(res.token);
      sessionStorage.setItem('tea_portal_role', res.role);
      sessionStorage.setItem('tea_portal_token', res.token);
      if (res.role === 'admin') {
        setActivePage('admin-panel');
      } else {
        setActivePage('pbi-dashboard');
      }
      return { success: true };
    }
    return { success: false, message: res.message };
  }

  function handleLogout() {
    setAuthRole(null);
    setAuthToken(null);
    sessionStorage.removeItem('tea_portal_role');
    sessionStorage.removeItem('tea_portal_token');
    setActivePage('pbi-dashboard');
  }

  async function saveEstate(estate) {
    const res = await api.saveEstateApi(estate);
    if (res.success && res.estates) {
      setEstates(res.estates);
    }
    return res;
  }

  async function deleteEstate(rank) {
    const res = await api.deleteEstateApi(rank);
    if (res.success && res.estates) {
      setEstates(res.estates);
    }
    return res;
  }

  async function addGrower(grower) {
    const res = await api.saveGrowerApi(grower);
    if (res.success && res.growers) {
      setGrowers(res.growers);
    }
    return res;
  }

  async function deleteGrower(code) {
    const res = await api.deleteGrowerApi(code);
    if (res.success && res.growers) {
      setGrowers(res.growers);
    }
    return res;
  }

  async function updateCmsPage(pageKey, data) {
    const res = await api.saveCmsPageApi(pageKey, data);
    if (res.success && res.pages) {
      setCmsPages(res.pages);
    }
    return res;
  }

  async function updateBranding(newBranding) {
    const res = await api.saveBrandingApi(newBranding);
    if (res.success && res.branding) {
      setBranding(res.branding);
      applyThemeColorsToDom(res.branding);
    }
    return res;
  }

  async function updatePortalState(newState) {
    const res = await api.saveStateApi(newState);
    if (res.success && res.state) {
      setPortalState(res.state);
    }
    return res;
  }

  // Alias helpers for pages
  const setSelectedEstateId = (estateIdOrRank) => {
    const found = estates.find(e => String(e.rank) === String(estateIdOrRank) || e.name.toLowerCase().includes(String(estateIdOrRank).toLowerCase()));
    if (found) setSelectedEstateModal(found);
    else if (estates.length > 0) setSelectedEstateModal(estates[0]);
  };

  const value = {
    activePage,
    setActivePage,
    activeTab: activePage,
    setActiveTab: setActivePage,
    sidebarOpen,
    setSidebarOpen,
    authRole,
    currentUser: authRole ? { role: authRole, username: authRole === 'admin' ? 'Admin' : 'ABCD' } : null,
    isAuthenticated: !!authRole,
    isAdmin: authRole === 'admin',
    adminModalOpen,
    setAdminModalOpen,
    handleLogin,
    handleLogout,
    activeYear,
    selectedYear: activeYear,
    setActiveYear,
    setSelectedYear: setActiveYear,
    currentMetrics,
    estates,
    estates177: census177,
    census177,
    selectedEstateModal,
    setSelectedEstateModal,
    setSelectedEstateId,
    saveEstate,
    createEstate: saveEstate,
    updateEstate: saveEstate,
    deleteEstate,
    growers,
    growerSearchQuery,
    setGrowerSearchQuery,
    addGrower,
    deleteGrower,
    cmsPages,
    updateCmsPage,
    saveCmsPage: updateCmsPage,
    branding,
    updateBranding,
    saveBranding: updateBranding,
    portalState,
    updatePortalState,
    savePortalState: updatePortalState,
    refreshData: loadAllData
  };

  return (
    <PortalContext.Provider value={value}>
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  return useContext(PortalContext);
}
