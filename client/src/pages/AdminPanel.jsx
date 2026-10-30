import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  FileText, 
  MapPin, 
  Users, 
  BarChart2, 
  Palette, 
  Code, 
  Plus, 
  Trash2, 
  Save, 
  Play, 
  CheckCircle, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { api } from '../api/client';

export default function AdminPanel() {
  const { 
    currentUser, 
    estates, 
    growers, 
    cmsPages, 
    branding, 
    portalState, 
    updateEstate, 
    createEstate, 
    deleteEstate,
    addGrower, 
    saveCmsPage, 
    saveBranding, 
    savePortalState,
    refreshData 
  } = usePortal();

  const [activeTab, setActiveTab] = useState('cms_pages');
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

  // 1. CMS Pages State
  const [selectedPageKey, setSelectedPageKey] = useState('dashboard');
  const [pageHeadline, setPageHeadline] = useState(cmsPages.dashboard?.headline || '');
  const [pageStory, setPageStory] = useState(cmsPages.dashboard?.story || '');
  const [pageBullet1, setPageBullet1] = useState(cmsPages.dashboard?.bulletPoints?.[0] || '');
  const [pageBullet2, setPageBullet2] = useState(cmsPages.dashboard?.bulletPoints?.[1] || '');

  // 2. Estates Edit State
  const [editingEstateId, setEditingEstateId] = useState(estates[0]?.id || 'manohari');
  const currentEstate = estates.find(e => e.id === editingEstateId) || estates[0] || {};
  const [estateForm, setEstateForm] = useState({ ...currentEstate });

  // 3. New Estate Form
  const [showNewEstateModal, setShowNewEstateModal] = useState(false);
  const [newEstateData, setNewEstateData] = useState({
    id: '',
    name: '',
    circle: 'Dibrugarh West',
    established: '1900',
    areaHectares: 400,
    annualOutputKg: 750000,
    peakPriceInr: 600,
    specialty: 'Orthodox Special',
    description: '',
    soilType: 'Alluvial Loam',
    rainfallMm: 2800,
    elevationM: 108
  });

  // 4. Macro State
  const [macroForm, setMacroForm] = useState({
    production: portalState.production2026?.production || 103.0,
    avgPrice: portalState.production2026?.avgPrice || 241,
    hectares: portalState.production2026?.hectares || 83700,
    workforce: portalState.production2026?.workforce || 214500,
    organizedPct: portalState.production2026?.organizedPct || 48.8,
    stgPct: portalState.production2026?.stgPct || 51.2
  });

  // 5. Branding Form
  const [brandForm, setBrandForm] = useState({
    siteTitle: branding.siteTitle || 'Dibrugarh Tea Information & Analytics System',
    tagline: branding.tagline || 'Directorate of Tea & Assam Agricultural Intelligence Division',
    primaryColor: branding.primaryColor || '#15803d',
    secondaryColor: branding.secondaryColor || '#84cc16',
    goldColor: branding.goldColor || '#d97706'
  });

  // 6. Code Console
  const [codeSnippet, setCodeSnippet] = useState('// JavaScript execution engine\nconst data = { year: 2026, status: "Active" };\nreturn { message: "System online", data };');
  const [codeOutput, setCodeOutput] = useState('');
  const [codeLoading, setCodeLoading] = useState(false);

  const showStatus = (text, type = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg({ text: '', type: '' }), 4000);
  };

  // Handlers
  const handlePageSelect = (key) => {
    setSelectedPageKey(key);
    const p = cmsPages[key] || {};
    setPageHeadline(p.headline || '');
    setPageStory(p.story || '');
    setPageBullet1(p.bulletPoints?.[0] || '');
    setPageBullet2(p.bulletPoints?.[1] || '');
  };

  const handleSavePageContent = async (e) => {
    e.preventDefault();
    const payload = {
      headline: pageHeadline,
      story: pageStory,
      bulletPoints: [pageBullet1, pageBullet2].filter(Boolean)
    };
    const res = await saveCmsPage(selectedPageKey, payload);
    if (res.success) {
      showStatus(`Page content for "${selectedPageKey}" saved successfully!`);
    } else {
      showStatus('Failed to save page: ' + res.error, 'danger');
    }
  };

  const handleSelectEstateToEdit = (e) => {
    const id = e.target.value;
    setEditingEstateId(id);
    const found = estates.find(x => x.id === id);
    if (found) setEstateForm({ ...found });
  };

  const handleSaveEstate = async (e) => {
    e.preventDefault();
    const res = await updateEstate(editingEstateId, estateForm);
    if (res.success) {
      showStatus(`Estate "${estateForm.name}" updated successfully!`);
    } else {
      showStatus('Failed to update estate: ' + res.error, 'danger');
    }
  };

  const handleCreateEstate = async (e) => {
    e.preventDefault();
    if (!newEstateData.id || !newEstateData.name) {
      alert('Please fill estate ID and Name');
      return;
    }
    const res = await createEstate(newEstateData);
    if (res.success) {
      setShowNewEstateModal(false);
      showStatus(`New estate "${newEstateData.name}" added to database!`);
    } else {
      showStatus('Error adding estate: ' + res.error, 'danger');
    }
  };

  const handleDeleteEstate = async () => {
    if (window.confirm(`Are you sure you want to delete ${estateForm.name}?`)) {
      const res = await deleteEstate(editingEstateId);
      if (res.success) {
        showStatus('Estate deleted from database');
      } else {
        showStatus('Failed to delete: ' + res.error, 'danger');
      }
    }
  };

  const handleSaveMacro = async (e) => {
    e.preventDefault();
    const res = await savePortalState({
      ...portalState,
      production2026: {
        ...portalState.production2026,
        production: Number(macroForm.production),
        avgPrice: Number(macroForm.avgPrice),
        hectares: Number(macroForm.hectares),
        workforce: Number(macroForm.workforce),
        organizedPct: Number(macroForm.organizedPct),
        stgPct: Number(macroForm.stgPct)
      }
    });
    if (res.success) {
      showStatus('2026 District KPI targets updated!');
    } else {
      showStatus('Failed to save targets: ' + res.error, 'danger');
    }
  };

  const handleSaveBranding = async (e) => {
    e.preventDefault();
    const res = await saveBranding(brandForm);
    if (res.success) {
      showStatus('Theme & Portal branding saved!');
    } else {
      showStatus('Failed to save branding: ' + res.error, 'danger');
    }
  };

  const handleRunCode = async () => {
    setCodeLoading(true);
    try {
      const res = await api.runCode(codeSnippet);
      setCodeOutput(JSON.stringify(res, null, 2));
    } catch (err) {
      setCodeOutput('Execution Error: ' + err.message);
    } finally {
      setCodeLoading(false);
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="card" style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }}>
        <AlertTriangle size={48} color="#d97706" style={{ margin: '0 auto 16px' }} />
        <h2 style={{ color: 'var(--primary-deep)' }}>Administrator Clearance Required</h2>
        <p style={{ color: 'var(--ink-soft)', lineHeight: '1.6' }}>
          You are currently logged in with standard Operator privileges. To access the Content Management Studio, Estate Editor, and Code Runner, please switch to Administrator mode.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-studio-page">
      <div className="header-bar">
        <div>
          <h2>Master Content Management Studio & System Admin</h2>
          <p>Direct live editing of website sections, estate database, macroeconomic variables, and developer tools</p>
        </div>
        <div className="badge badge-green" style={{ padding: '6px 14px' }}>
          🛡️ Authenticated Master Admin ({currentUser.username})
        </div>
      </div>

      {statusMsg.text && (
        <div className={`alert alert-${statusMsg.type}`} style={{ marginBottom: '16px' }}>
          {statusMsg.text}
        </div>
      )}

      {/* Admin Module Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab-btn ${activeTab === 'cms_pages' ? 'active' : ''}`}
          onClick={() => setActiveTab('cms_pages')}
        >
          <FileText size={15} /> 1. Page Content Editor
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'estates' ? 'active' : ''}`}
          onClick={() => setActiveTab('estates')}
        >
          <MapPin size={15} /> 2. Estates Database Editor
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'macro' ? 'active' : ''}`}
          onClick={() => setActiveTab('macro')}
        >
          <BarChart2 size={15} /> 3. 2026 Macro Targets
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'branding' ? 'active' : ''}`}
          onClick={() => setActiveTab('branding')}
        >
          <Palette size={15} /> 4. Theme & Branding
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'code_runner' ? 'active' : ''}`}
          onClick={() => setActiveTab('code_runner')}
        >
          <Code size={15} /> 5. Live Code Console
        </button>
      </div>

      {/* MODULE 1: CMS Pages */}
      {activeTab === 'cms_pages' && (
        <div className="card" style={{ padding: '24px' }}>
          <div className="card-header" style={{ marginBottom: '20px' }}>
            <span className="card-title">Live Text & Content Editor for All Portal Sections</span>
            <span className="badge badge-green">Immediate Hot-Reload</span>
          </div>

          <form onSubmit={handleSavePageContent}>
            <div style={{ marginBottom: '16px' }}>
              <label className="field-label">Select Page Section to Edit</label>
              <select
                value={selectedPageKey}
                onChange={(e) => handlePageSelect(e.target.value)}
                style={{ maxWidth: '350px' }}
              >
                <option value="dashboard">Executive Dashboard (Overview)</option>
                <option value="satellite_map">Satellite GIS Map</option>
                <option value="estates_top10">Top 10 Landmark Estates</option>
                <option value="estates_177">177 Concessions Census</option>
                <option value="small_growers">Small Tea Growers (STG)</option>
                <option value="tea_journey">Tea Journey (Bush to Cup)</option>
                <option value="auctions_gtac">Guwahati Auctions (GTAC)</option>
                <option value="global_exports">Global Exports Logistics</option>
                <option value="interstate_trade">Interstate Trade Network</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="field-label">Page Headline / Banner Title</label>
              <input
                type="text"
                required
                value={pageHeadline}
                onChange={e => setPageHeadline(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="field-label">Executive Lead Story & Narrative</label>
              <textarea
                rows="4"
                required
                value={pageStory}
                onChange={e => setPageStory(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label className="field-label">Key Highlight Bullet 1</label>
                <input
                  type="text"
                  value={pageBullet1}
                  onChange={e => setPageBullet1(e.target.value)}
                />
              </div>
              <div>
                <label className="field-label">Key Highlight Bullet 2</label>
                <input
                  type="text"
                  value={pageBullet2}
                  onChange={e => setPageBullet2(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              <Save size={15} /> Save & Publish Page Content
            </button>
          </form>
        </div>
      )}

      {/* MODULE 2: Estates Database */}
      {activeTab === 'estates' && (
        <div className="card" style={{ padding: '24px' }}>
          <div className="card-header" style={{ marginBottom: '20px' }}>
            <span className="card-title">Estate Dossier & Geospatial Concession Records</span>
            <button className="btn-secondary" onClick={() => setShowNewEstateModal(true)}>
              <Plus size={15} /> Add New Concession
            </button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="field-label">Select Concession to Modify</label>
            <select
              value={editingEstateId}
              onChange={handleSelectEstateToEdit}
              style={{ maxWidth: '400px' }}
            >
              {estates.map(est => (
                <option key={est.id} value={est.id}>
                  {est.name} ({est.circle}) - ₹{est.peakPriceInr}/kg
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleSaveEstate}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label className="field-label">Estate Name</label>
                <input
                  type="text"
                  required
                  value={estateForm.name || ''}
                  onChange={e => setEstateForm({ ...estateForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="field-label">Revenue Circle</label>
                <select
                  value={estateForm.circle || 'Dibrugarh West'}
                  onChange={e => setEstateForm({ ...estateForm, circle: e.target.value })}
                >
                  <option value="Dibrugarh West">Dibrugarh West</option>
                  <option value="Dibrugarh East">Dibrugarh East</option>
                  <option value="Chabua">Chabua</option>
                  <option value="Tingkhong">Tingkhong</option>
                  <option value="Moran">Moran</option>
                  <option value="Naharkatia">Naharkatia</option>
                </select>
              </div>

              <div>
                <label className="field-label">Planted Area (Hectares)</label>
                <input
                  type="number"
                  required
                  value={estateForm.areaHectares || ''}
                  onChange={e => setEstateForm({ ...estateForm, areaHectares: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="field-label">Annual Output (Kg)</label>
                <input
                  type="number"
                  required
                  value={estateForm.annualOutputKg || ''}
                  onChange={e => setEstateForm({ ...estateForm, annualOutputKg: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="field-label">GTAC Peak Price (₹/kg)</label>
                <input
                  type="number"
                  required
                  value={estateForm.peakPriceInr || ''}
                  onChange={e => setEstateForm({ ...estateForm, peakPriceInr: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="field-label">Specialty Grade</label>
                <input
                  type="text"
                  required
                  value={estateForm.specialty || ''}
                  onChange={e => setEstateForm({ ...estateForm, specialty: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="field-label">Agronomic & Heritage Description</label>
              <textarea
                rows="4"
                value={estateForm.description || ''}
                onChange={e => setEstateForm({ ...estateForm, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn-primary">
                <Save size={15} /> Update Estate in Database
              </button>
              <button type="button" className="btn-secondary" style={{ color: '#ef4444' }} onClick={handleDeleteEstate}>
                <Trash2 size={15} /> Delete Concession
              </button>
            </div>
          </form>

          {/* Add Estate Modal */}
          {showNewEstateModal && (
            <div className="modal-overlay" onClick={() => setShowNewEstateModal(false)}>
              <div className="modal-content" style={{ maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Register New Concession Garden</h3>
                  <button className="modal-close" onClick={() => setShowNewEstateModal(false)}>×</button>
                </div>
                <form onSubmit={handleCreateEstate}>
                  <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label className="field-label">Unique Slug ID (e.g. panitola)</label>
                      <input
                        type="text"
                        required
                        value={newEstateData.id}
                        onChange={e => setNewEstateData({ ...newEstateData, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      />
                    </div>
                    <div>
                      <label className="field-label">Estate Name</label>
                      <input
                        type="text"
                        required
                        value={newEstateData.name}
                        onChange={e => setNewEstateData({ ...newEstateData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="field-label">Circle</label>
                      <select
                        value={newEstateData.circle}
                        onChange={e => setNewEstateData({ ...newEstateData, circle: e.target.value })}
                      >
                        <option value="Dibrugarh West">Dibrugarh West</option>
                        <option value="Dibrugarh East">Dibrugarh East</option>
                        <option value="Chabua">Chabua</option>
                        <option value="Tingkhong">Tingkhong</option>
                        <option value="Moran">Moran</option>
                        <option value="Naharkatia">Naharkatia</option>
                      </select>
                    </div>
                    <div>
                      <label className="field-label">Planted Area (Ha)</label>
                      <input
                        type="number"
                        value={newEstateData.areaHectares}
                        onChange={e => setNewEstateData({ ...newEstateData, areaHectares: Number(e.target.value) })}
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label className="field-label">Description</label>
                      <textarea
                        rows="3"
                        value={newEstateData.description}
                        onChange={e => setNewEstateData({ ...newEstateData, description: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                    <button type="button" className="btn-secondary" onClick={() => setShowNewEstateModal(false)}>Cancel</button>
                    <button type="submit" className="btn-primary">Create Concession</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODULE 3: 2026 Macro Targets */}
      {activeTab === 'macro' && (
        <div className="card" style={{ padding: '24px' }}>
          <div className="card-header" style={{ marginBottom: '20px' }}>
            <span className="card-title">2026 Crop Target Projections (Executive Dashboard Baseline)</span>
            <span className="badge badge-gold">Directorate Slicer Variables</span>
          </div>

          <form onSubmit={handleSaveMacro}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label className="field-label">Annual Made-Tea Output Target (M.Kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={macroForm.production}
                  onChange={e => setMacroForm({ ...macroForm, production: e.target.value })}
                />
              </div>

              <div>
                <label className="field-label">GTAC Realization Benchmark (₹/kg)</label>
                <input
                  type="number"
                  required
                  value={macroForm.avgPrice}
                  onChange={e => setMacroForm({ ...macroForm, avgPrice: e.target.value })}
                />
              </div>

              <div>
                <label className="field-label">Total Concession Acreage (Hectares)</label>
                <input
                  type="number"
                  required
                  value={macroForm.hectares}
                  onChange={e => setMacroForm({ ...macroForm, hectares: e.target.value })}
                />
              </div>

              <div>
                <label className="field-label">Total Registered Tea Workforce</label>
                <input
                  type="number"
                  required
                  value={macroForm.workforce}
                  onChange={e => setMacroForm({ ...macroForm, workforce: e.target.value })}
                />
              </div>

              <div>
                <label className="field-label">Corporate Sector Output Share (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={macroForm.organizedPct}
                  onChange={e => setMacroForm({ ...macroForm, organizedPct: e.target.value })}
                />
              </div>

              <div>
                <label className="field-label">Smallholder (STG) Sector Share (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={macroForm.stgPct}
                  onChange={e => setMacroForm({ ...macroForm, stgPct: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              <Save size={15} /> Save Macroeconomic Targets
            </button>
          </form>
        </div>
      )}

      {/* MODULE 4: Theme & Branding */}
      {activeTab === 'branding' && (
        <div className="card" style={{ padding: '24px' }}>
          <div className="card-header" style={{ marginBottom: '20px' }}>
            <span className="card-title">Portal Branding & Botanical Color Palette</span>
            <span className="badge badge-green">CSS Variable Sync</span>
          </div>

          <form onSubmit={handleSaveBranding}>
            <div style={{ marginBottom: '16px' }}>
              <label className="field-label">Portal Header Title</label>
              <input
                type="text"
                required
                value={brandForm.siteTitle}
                onChange={e => setBrandForm({ ...brandForm, siteTitle: e.target.value })}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="field-label">Department Subtitle / Tagline</label>
              <input
                type="text"
                required
                value={brandForm.tagline}
                onChange={e => setBrandForm({ ...brandForm, tagline: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label className="field-label">Primary Forest Green</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="color"
                    value={brandForm.primaryColor}
                    onChange={e => setBrandForm({ ...brandForm, primaryColor: e.target.value })}
                    style={{ width: '45px', height: '38px', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={brandForm.primaryColor}
                    onChange={e => setBrandForm({ ...brandForm, primaryColor: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Secondary Lime Accent</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="color"
                    value={brandForm.secondaryColor}
                    onChange={e => setBrandForm({ ...brandForm, secondaryColor: e.target.value })}
                    style={{ width: '45px', height: '38px', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={brandForm.secondaryColor}
                    onChange={e => setBrandForm({ ...brandForm, secondaryColor: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Highlight Gold</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="color"
                    value={brandForm.goldColor}
                    onChange={e => setBrandForm({ ...brandForm, goldColor: e.target.value })}
                    style={{ width: '45px', height: '38px', padding: 0 }}
                  />
                  <input
                    type="text"
                    value={brandForm.goldColor}
                    onChange={e => setBrandForm({ ...brandForm, goldColor: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary">
              <Save size={15} /> Save Theme Configuration
            </button>
          </form>
        </div>
      )}

      {/* MODULE 5: Live Code Console */}
      {activeTab === 'code_runner' && (
        <div className="card" style={{ padding: '24px' }}>
          <div className="card-header" style={{ marginBottom: '16px' }}>
            <span className="card-title">Live Express Server VM & JavaScript Scripting Terminal</span>
            <span className="badge badge-gold">Sandboxed Execution</span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--ink-soft)', marginBottom: '16px' }}>
            Directly execute JavaScript algorithms and batch transformations on the Node.js backend.
          </p>

          <textarea
            rows="6"
            value={codeSnippet}
            onChange={e => setCodeSnippet(e.target.value)}
            style={{ fontFamily: 'monospace', fontSize: '13px', width: '100%', marginBottom: '14px' }}
          />

          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <button className="btn-primary" onClick={handleRunCode} disabled={codeLoading}>
              <Play size={15} /> {codeLoading ? 'Executing in Node VM...' : 'Execute Script'}
            </button>
          </div>

          {codeOutput && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--ink-soft)', marginBottom: '6px' }}>Terminal Output:</div>
              <pre style={{
                background: '#082210',
                color: '#84cc16',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'monospace',
                overflowX: 'auto',
                maxHeight: '260px'
              }}>
                {codeOutput}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
