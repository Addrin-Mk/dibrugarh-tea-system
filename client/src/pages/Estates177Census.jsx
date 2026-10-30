import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Search, Filter, Download, Building, Users, Activity, CheckCircle } from 'lucide-react';

export default function Estates177Census() {
  const { estates177, portalState } = usePortal();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCircle, setSelectedCircle] = useState('ALL');

  const circles = ['ALL', 'Dibrugarh West', 'Dibrugarh East', 'Chabua', 'Tingkhong', 'Moran', 'Naharkatia'];

  const filtered = estates177.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.registrationNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCircle = selectedCircle === 'ALL' || item.circle === selectedCircle;
    return matchesSearch && matchesCircle;
  });

  const exportCensusCSV = () => {
    const headers = ['Reg No', 'Estate Name', 'Owner / Managing Agency', 'Circle', 'Grant Area (Ha)', 'Cultivated (Ha)', 'Workforce', 'Factory Type', 'Status'];
    const rows = filtered.map(e => [
      e.registrationNo,
      `"${e.name}"`,
      `"${e.owner}"`,
      e.circle,
      e.grantAreaHectares,
      e.cultivatedHectares,
      e.workforce,
      e.hasFactory ? 'Captive Processing' : 'BLF Dependent',
      e.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map(r => r.join(',')).join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = 'dibrugarh_177_tea_estates_census.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="census-page">
      <div className="header-bar">
        <div>
          <h2>Corporate Tea Estates Census (177 Registered Concessions)</h2>
          <p>Official Tea Board of India and Assam Directorate of Tea concessionary land ledger & operational enumeration</p>
        </div>
        <button className="btn-primary" onClick={exportCensusCSV}>
          <Download size={15} /> Export Census Register (CSV)
        </button>
      </div>

      {/* Summary KPI Ribbon */}
      <div className="kpi-grid" style={{ marginBottom: '24px' }}>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Corporate Grants</span>
            <div className="kpi-icon"><Building size={18} /></div>
          </div>
          <div className="kpi-value">177 <span className="kpi-unit">Estates</span></div>
          <div className="kpi-meta">100% geo-fenced statutory concessions</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Total Grant Area</span>
            <div className="kpi-icon"><Activity size={18} /></div>
          </div>
          <div className="kpi-value">52,480 <span className="kpi-unit">Ha</span></div>
          <div className="kpi-meta">44,120 Ha under active plucking</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Corporate Labor Force</span>
            <div className="kpi-icon"><Users size={18} /></div>
          </div>
          <div className="kpi-value">1,48,200 <span className="kpi-unit">Workers</span></div>
          <div className="kpi-meta">Enrolled in Provident Fund (APATBF)</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Captive Factories</span>
            <div className="kpi-icon"><CheckCircle size={18} /></div>
          </div>
          <div className="kpi-value">138 <span className="kpi-unit">Units</span></div>
          <div className="kpi-meta">Equipped with dual CTC & Orthodox lines</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1', minWidth: '260px', position: 'relative' }}>
            <Search size={16} color="var(--ink-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              placeholder="Search by Estate Name, Managing Agency, or Reg Number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '38px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Filter size={15} color="var(--primary)" />
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--ink-soft)' }}>Circle:</span>
            {circles.map(c => (
              <button
                key={c}
                className={`slicer-pill ${selectedCircle === c ? 'active' : ''}`}
                onClick={() => setSelectedCircle(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Census Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Corporate Land Records & Operational Profile ({filtered.length} matching)</span>
          <span className="badge badge-green">Showing verified census rows</span>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Registration No</th>
                <th>Estate Name</th>
                <th>Managing Company / Agency</th>
                <th>Revenue Circle</th>
                <th>Grant Area (Ha)</th>
                <th>Cultivated Area</th>
                <th>Workforce</th>
                <th>Factory Status</th>
                <th>Operating Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.registrationNo}>
                  <td style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: '600', color: 'var(--ink-soft)' }}>
                    {row.registrationNo}
                  </td>
                  <td style={{ fontWeight: '800', color: 'var(--primary-deep)' }}>{row.name}</td>
                  <td>{row.owner}</td>
                  <td><span className="badge badge-lime">{row.circle}</span></td>
                  <td>{row.grantAreaHectares} Ha</td>
                  <td style={{ fontWeight: '700', color: 'var(--primary)' }}>{row.cultivatedHectares} Ha</td>
                  <td>{Number(row.workforce).toLocaleString()}</td>
                  <td>
                    {row.hasFactory ? (
                      <span className="badge badge-green">Captive Factory</span>
                    ) : (
                      <span className="badge badge-gold">Leaf Supplying (BLF)</span>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-green">{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
