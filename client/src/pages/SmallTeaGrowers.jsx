import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Search, Plus, Filter, Download, Users, TrendingUp, DollarSign, Layers } from 'lucide-react';

export default function SmallTeaGrowers() {
  const { growers, addGrower } = usePortal();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    growerName: '',
    holdingAreaHa: '',
    circle: 'Dibrugarh West',
    village: '',
    registrationId: '',
    teaBoardCardNo: '',
    annualProductionKg: '',
    variety: 'TV-1 / Clone 26',
    soldToFactory: 'Borboruah Bought Leaf Factory'
  });

  const filtered = growers.filter(g => 
    g.growerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.registrationId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.growerName || !formData.holdingAreaHa) {
      alert('Please fill grower name and acreage');
      return;
    }
    const res = await addGrower(formData);
    if (res.success) {
      setShowAddModal(false);
      setFormData({
        growerName: '',
        holdingAreaHa: '',
        circle: 'Dibrugarh West',
        village: '',
        registrationId: '',
        teaBoardCardNo: '',
        annualProductionKg: '',
        variety: 'TV-1 / Clone 26',
        soldToFactory: 'Borboruah Bought Leaf Factory'
      });
    } else {
      alert('Error creating grower: ' + res.error);
    }
  };

  return (
    <div className="stg-page">
      <div className="header-bar">
        <div>
          <h2>Small Tea Growers Directory (29,771 Registered Cultivators)</h2>
          <p>Micro-plantation landholdings, District Monitoring Committee (DMC) benchmark green leaf pricing, and Borboruah block roster</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Register New Smallholder
        </button>
      </div>

      {/* STG KPI Stat Ribbon */}
      <div className="kpi-grid" style={{ marginBottom: '24px' }}>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Total STG Cultivators</span>
            <div className="kpi-icon"><Users size={18} /></div>
          </div>
          <div className="kpi-value">29,771 <span className="kpi-unit">Growers</span></div>
          <div className="kpi-meta">51.2% of district leaf volume</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Cumulative Smallholder Acreage</span>
            <div className="kpi-icon"><Layers size={18} /></div>
          </div>
          <div className="kpi-value">31,220 <span className="kpi-unit">Ha</span></div>
          <div className="kpi-meta">Average parcel size: 1.05 Hectares</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>DMC Floor Green Leaf Price</span>
            <div className="kpi-icon"><DollarSign size={18} /></div>
          </div>
          <div className="kpi-value">₹24.80 <span className="kpi-unit">/ kg</span></div>
          <div className="kpi-meta">Mandated by Tea Board DMC (2026)</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Bought Leaf Factories (BLFs)</span>
            <div className="kpi-icon"><TrendingUp size={18} /></div>
          </div>
          <div className="kpi-value">64 <span className="kpi-unit">Factories</span></div>
          <div className="kpi-meta">Dedicated processing hubs in Dibrugarh</div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} color="var(--ink-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            placeholder="Search smallholders by name, village, or Tea Board Registration ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '38px' }}
          />
        </div>
      </div>

      {/* STG Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Borboruah & Panitola Block Sample Roster ({filtered.length} Growers Displayed)</span>
          <span className="badge badge-green">Live Database Record</span>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Registration ID</th>
                <th>Grower Name</th>
                <th>Revenue Circle & Village</th>
                <th>Holding Area</th>
                <th>Annual Harvest (Kg)</th>
                <th>Plantation Variety</th>
                <th>Offtake Factory / BLF</th>
                <th>Biometric Card</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(g => (
                <tr key={g.registrationId}>
                  <td style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: '700', color: 'var(--primary)' }}>
                    {g.registrationId}
                  </td>
                  <td style={{ fontWeight: '800', color: 'var(--primary-deep)' }}>{g.growerName}</td>
                  <td>
                    <b>{g.circle}</b><br />
                    <span style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>{g.village}</span>
                  </td>
                  <td>{g.holdingAreaHa} Ha</td>
                  <td style={{ fontWeight: '700' }}>{Number(g.annualProductionKg).toLocaleString()} kg</td>
                  <td><span className="badge badge-lime">{g.variety}</span></td>
                  <td>{g.soldToFactory}</td>
                  <td>
                    <span className="badge badge-green">{g.teaBoardCardNo ? 'Verified' : 'Pending'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Grower Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Register New Small Tea Grower</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label className="field-label">Grower Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.growerName}
                    onChange={e => setFormData({ ...formData, growerName: e.target.value })}
                    placeholder="e.g. Pronob Jyoti Gogoi"
                  />
                </div>

                <div>
                  <label className="field-label">Holding Acreage (Hectares)</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={formData.holdingAreaHa}
                    onChange={e => setFormData({ ...formData, holdingAreaHa: e.target.value })}
                    placeholder="e.g. 1.25"
                  />
                </div>

                <div>
                  <label className="field-label">Revenue Circle</label>
                  <select
                    value={formData.circle}
                    onChange={e => setFormData({ ...formData, circle: e.target.value })}
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
                  <label className="field-label">Village / Mouza</label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={e => setFormData({ ...formData, village: e.target.value })}
                    placeholder="e.g. Borboruah Gaon"
                  />
                </div>

                <div>
                  <label className="field-label">Est. Annual Green Leaf (Kg)</label>
                  <input
                    type="number"
                    value={formData.annualProductionKg}
                    onChange={e => setFormData({ ...formData, annualProductionKg: e.target.value })}
                    placeholder="e.g. 9800"
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label className="field-label">Associated Bought Leaf Factory (BLF)</label>
                  <input
                    type="text"
                    value={formData.soldToFactory}
                    onChange={e => setFormData({ ...formData, soldToFactory: e.target.value })}
                    placeholder="e.g. Borboruah BLF & Co-operative Society"
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Smallholder to Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
