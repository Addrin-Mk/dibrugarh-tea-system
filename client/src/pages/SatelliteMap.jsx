import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { MapPin, Navigation, Eye, Filter, Info } from 'lucide-react';

export default function SatelliteMap() {
  const { estates, setSelectedEstateId } = usePortal();
  const [selectedCircle, setSelectedCircle] = useState('ALL');
  const [activeEstateHover, setActiveEstateHover] = useState(null);

  // Stationary positions on 1000x600 SVG map
  const mapCoordinates = {
    'manohari': { cx: 480, cy: 300, name: 'Manohari Tea Estate' },
    'mai-jan': { cx: 420, cy: 260, name: 'Maijan Tea Estate' },
    'chabua': { cx: 680, cy: 240, name: 'Chabua Tea Estate' },
    'zaloni': { cx: 580, cy: 370, name: 'Zaloni Tea Estate' },
    'rajgarh': { cx: 340, cy: 460, name: 'Rajgarh Tea Estate' },
    'leptekatta': { cx: 390, cy: 340, name: 'Lepetkatta Tea Estate' },
    'moran': { cx: 280, cy: 420, name: 'Moran Tea Estate' },
    'mankotta': { cx: 450, cy: 320, name: 'Mankotta Tea Estate' },
    'nahortoli': { cx: 720, cy: 280, name: 'Nahortoli Tea Estate' },
    'ghooronia': { cx: 510, cy: 350, name: 'Ghooronia Tea Estate' }
  };

  const circles = ['ALL', 'Dibrugarh West', 'Dibrugarh East', 'Chabua', 'Tingkhong', 'Moran', 'Naharkatia'];

  const filteredEstates = selectedCircle === 'ALL'
    ? estates
    : estates.filter(e => e.circle === selectedCircle);

  const handleSelectJump = (e) => {
    const val = e.target.value;
    if (val) {
      setSelectedEstateId(val);
    }
  };

  return (
    <div className="satellite-map-page">
      <div className="header-bar">
        <div>
          <h2>Cartographic & Satellite GIS Topography</h2>
          <p>Verified spatial distribution of Dibrugarh's 177 corporate tea concessions & 10 landmark benchmark gardens</p>
        </div>
        
        {/* Long, Multi-colored Jump Selector with stationary guarantee */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="estate-select-container">
            <label htmlFor="estateJumpSelect" className="estate-select-label">
              <span className="label-icon">🔍</span>
              <span className="label-tag">GIS LOCATOR</span>
              <span className="label-title">Check Estate Details:</span>
            </label>
            <select
              id="estateJumpSelect"
              className="estate-jump-select"
              onChange={handleSelectJump}
              defaultValue=""
            >
              <option value="" disabled>-- Select a Premier Tea Estate to View Dossier --</option>
              {estates.map(est => (
                <option key={est.id} value={est.id}>
                  {est.name} ({est.circle}) - ₹{est.peakPriceInr}/kg
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Circle Filter Pills */}
      <div className="filter-pill-row">
        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={14} /> Revenue Circle:
        </span>
        {circles.map(c => (
          <button
            key={c}
            className={`filter-pill ${selectedCircle === c ? 'active' : ''}`}
            onClick={() => setSelectedCircle(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* GIS Viewport Container */}
      <div className="map-viewport-card">
        <div className="map-svg-wrapper">
          <svg
            viewBox="0 0 1000 600"
            className="gis-svg"
            style={{ width: '100%', height: 'auto', display: 'block', background: '#eaf4eb' }}
          >
            <defs>
              <pattern id="teaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(21, 128, 61, 0.08)" strokeWidth="1" />
              </pattern>
              <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Background Grid */}
            <rect width="1000" height="600" fill="url(#teaGrid)" />

            {/* Brahmaputra River Channel */}
            <path
              d="M 50,40 Q 250,80 400,120 T 750,150 T 950,130 L 950,210 Q 750,230 400,180 T 50,110 Z"
              fill="url(#riverGrad)"
              stroke="#38bdf8"
              strokeWidth="2"
            />
            <text x="500" y="160" fill="#0369a1" fontSize="13" fontWeight="700" letterSpacing="3" textAnchor="middle">
              BRAHMAPUTRA RIVER WATERWAY (NATIONAL WATERWAY-2)
            </text>

            {/* District Boundary Contour */}
            <path
              d="M 120,130 C 250,100 480,120 780,140 C 920,200 960,360 880,520 C 720,570 420,560 220,510 C 140,430 90,260 120,130 Z"
              fill="rgba(240, 253, 244, 0.6)"
              stroke="#15803d"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />

            {/* Revenue Circle Boundaries */}
            <g opacity="0.6" stroke="#84cc16" strokeWidth="1.5" strokeDasharray="3 3">
              {/* Dibrugarh West */}
              <circle cx="360" cy="300" r="90" fill="none" />
              <text x="360" y="225" fill="#166534" fontSize="11" fontWeight="600" textAnchor="middle">DIBRUGARH WEST</text>

              {/* Dibrugarh East */}
              <circle cx="490" cy="310" r="85" fill="none" />
              <text x="490" y="240" fill="#166534" fontSize="11" fontWeight="600" textAnchor="middle">DIBRUGARH EAST</text>

              {/* Chabua */}
              <circle cx="710" cy="270" r="95" fill="none" />
              <text x="710" y="190" fill="#166534" fontSize="11" fontWeight="600" textAnchor="middle">CHABUA CIRCLE</text>

              {/* Tingkhong */}
              <circle cx="480" cy="460" r="90" fill="none" />
              <text x="480" y="540" fill="#166534" fontSize="11" fontWeight="600" textAnchor="middle">TINGKHONG</text>

              {/* Moran */}
              <circle cx="270" cy="450" r="80" fill="none" />
              <text x="270" y="520" fill="#166534" fontSize="11" fontWeight="600" textAnchor="middle">MORAN CIRCLE</text>
            </g>

            {/* Stationary Estate Pins */}
            {filteredEstates.map(est => {
              const coords = mapCoordinates[est.id];
              if (!coords) return null;
              const isHovered = activeEstateHover === est.id;

              return (
                <g
                  key={est.id}
                  className="stationary-pin-group"
                  onClick={() => setSelectedEstateId(est.id)}
                  onMouseEnter={() => setActiveEstateHover(est.id)}
                  onMouseLeave={() => setActiveEstateHover(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer pulse circle (stationary) */}
                  <circle
                    cx={coords.cx}
                    cy={coords.cy}
                    r={isHovered ? 16 : 11}
                    fill={isHovered ? 'rgba(217, 119, 6, 0.25)' : 'rgba(21, 128, 61, 0.2)'}
                    stroke={isHovered ? '#d97706' : '#15803d'}
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    style={{ transition: 'r 0.2s, fill 0.2s, stroke 0.2s' }}
                  />

                  {/* Core Pin Point (Stationary, never translates or shakes) */}
                  <circle
                    cx={coords.cx}
                    cy={coords.cy}
                    r="5"
                    fill={isHovered ? '#d97706' : '#15803d'}
                  />

                  {/* Label tag */}
                  <rect
                    x={coords.cx - 50}
                    y={coords.cy + 14}
                    width="100"
                    height="18"
                    rx="4"
                    fill={isHovered ? '#082210' : 'rgba(255, 255, 255, 0.92)'}
                    stroke={isHovered ? '#d97706' : '#cbd5e1'}
                    strokeWidth="1"
                  />
                  <text
                    x={coords.cx}
                    y={coords.cy + 27}
                    fill={isHovered ? '#ffffff' : '#0f172a'}
                    fontSize="9.5"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {est.name.replace(' Tea Estate', '')}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend bar */}
        <div className="map-legend-bar">
          <div className="legend-item">
            <span className="legend-color-dot" style={{ background: '#15803d' }}></span>
            <span>Corporate Concession Point (Stationary Pin)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color-dot" style={{ background: '#d97706' }}></span>
            <span>Selected / Active Landmark Garden</span>
          </div>
          <div className="legend-item">
            <span className="legend-color-dot" style={{ background: '#38bdf8' }}></span>
            <span>River Brahmaputra Fluvial Waterway</span>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--ink-muted)' }}>
            Total Verified Geospatial Concessions: <b>177 Plots</b>
          </div>
        </div>
      </div>

      {/* Mini Estate Cards Grid below map */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary-deep)', marginBottom: '16px' }}>
          Concession Index ({filteredEstates.length} Gardens in {selectedCircle})
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {filteredEstates.map(est => (
            <div key={est.id} className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '800', fontSize: '15px', color: 'var(--primary-deep)' }}>{est.name}</span>
                <span className="badge badge-gold">₹{est.peakPriceInr}/kg</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginTop: '4px' }}>
                📍 {est.circle} Circle • {est.areaHectares} Ha
              </div>
              <p style={{ fontSize: '12px', color: 'var(--ink-soft)', margin: '8px 0', lineHeight: '1.4' }}>
                {est.description.substring(0, 95)}...
              </p>
              <button
                className="btn-primary"
                style={{ width: '100%', fontSize: '12px', padding: '7px 12px', marginTop: '6px' }}
                onClick={() => setSelectedEstateId(est.id)}
              >
                <Eye size={13} /> View Comprehensive Dossier
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
