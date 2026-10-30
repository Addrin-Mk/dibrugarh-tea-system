import React from 'react';
import { usePortal } from '../context/PortalContext';
import { Award, MapPin, DollarSign, Calendar, Eye, Layers } from 'lucide-react';

export default function EstatesTop10() {
  const { estates, setSelectedEstateId } = usePortal();

  return (
    <div className="top10-page">
      <div className="header-bar">
        <div>
          <h2>Top 10 Landmark Tea Estates of Dibrugarh</h2>
          <p>World-renowned heritage tea plantations, highest GTAC auction realizations, and orthodox specialty gardens</p>
        </div>
        <div className="badge badge-gold" style={{ fontSize: '13px', padding: '6px 14px' }}>
          ⭐ World Record Holder: Manohari Estate (₹1,15,000/kg)
        </div>
      </div>

      <div className="estate-grid">
        {estates.map((est, idx) => (
          <div key={est.id} className="estate-card" onClick={() => setSelectedEstateId(est.id)}>
            <div className="estate-img-container">
              <img
                src={est.image || `/assets/estate_${est.id}.jpg`}
                alt={est.name}
                className="estate-card-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/dibrugarh_satellite_map.jpg';
                }}
              />
              <div className="estate-rank-badge">#{idx + 1} Landmark</div>
              <div className="estate-specialty-badge">{est.specialty}</div>
            </div>

            <div className="estate-card-body">
              <h3 className="estate-card-name">{est.name}</h3>
              <div className="estate-card-circle">
                <MapPin size={13} color="var(--primary)" />
                <span>{est.circle} Revenue Circle</span>
              </div>

              <div className="estate-metric-grid">
                <div className="estate-metric-item">
                  <div className="label">Planted Area</div>
                  <div className="value">{est.areaHectares} <span style={{ fontSize: '11px' }}>Ha</span></div>
                </div>
                <div className="estate-metric-item">
                  <div className="label">Annual Yield</div>
                  <div className="value">{Number(est.annualOutputKg).toLocaleString()} <span style={{ fontSize: '11px' }}>kg</span></div>
                </div>
                <div className="estate-metric-item">
                  <div className="label">GTAC Peak</div>
                  <div className="value" style={{ color: 'var(--gold)' }}>₹{est.peakPriceInr} <span style={{ fontSize: '11px' }}>/kg</span></div>
                </div>
                <div className="estate-metric-item">
                  <div className="label">Established</div>
                  <div className="value">{est.established}</div>
                </div>
              </div>

              <p className="estate-card-desc">
                {est.description}
              </p>

              <button
                className="btn-primary"
                style={{ width: '100%', marginTop: '12px', fontSize: '13px', padding: '8px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEstateId(est.id);
                }}
              >
                <Eye size={14} /> Open Estate Dossier
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
