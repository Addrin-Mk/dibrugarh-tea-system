import React from 'react';
import { usePortal } from '../context/PortalContext';
import { Pie, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Globe, Plane, Anchor, TrendingUp, DollarSign } from 'lucide-react';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function GlobalExports() {
  const pieData = {
    labels: ['Russian Federation & CIS', 'Iran & Middle East', 'United Kingdom & EU', 'United States / Canada', 'Japan & SE Asia'],
    datasets: [{
      data: [32, 26, 21, 13, 8],
      backgroundColor: [
        'rgba(21, 128, 61, 0.85)',
        'rgba(217, 119, 6, 0.85)',
        'rgba(132, 204, 22, 0.85)',
        'rgba(2, 132, 199, 0.85)',
        'rgba(168, 85, 247, 0.85)'
      ],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 14, font: { family: 'Public Sans', size: 12 } } },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.raw}% destination share`
        }
      }
    }
  };

  return (
    <div className="exports-page">
      <div className="header-bar">
        <div>
          <h2>Global Maritime & Aviation Export Logistics</h2>
          <p>International shipments of Dibrugarh orthodox and CTC bulk lots to global consumer markets</p>
        </div>
        <div className="badge badge-green" style={{ padding: '6px 14px' }}>
          Total Annual Exports: 24.5 M.Kg (FOB Value: ₹890 Cr)
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: '24px' }}>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Direct Overseas Shipments</span>
            <div className="kpi-icon"><Globe size={18} /></div>
          </div>
          <div className="kpi-value">24.5 <span className="kpi-unit">M.Kg</span></div>
          <div className="kpi-meta">23.8% of district net output</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Average FOB Export Price</span>
            <div className="kpi-icon"><DollarSign size={18} /></div>
          </div>
          <div className="kpi-value">₹363 <span className="kpi-unit">/ kg</span></div>
          <div className="kpi-meta">Export premium over domestic auction</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Lead Port Gateway</span>
            <div className="kpi-icon"><Anchor size={18} /></div>
          </div>
          <div className="kpi-value">Kolkata <span className="kpi-unit">& Haldia</span></div>
          <div className="kpi-meta">78% dispatched via Syama Prasad Mookerjee Port</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Air Cargo Specialty</span>
            <div className="kpi-icon"><Plane size={18} /></div>
          </div>
          <div className="kpi-value">340 <span className="kpi-unit">Tons</span></div>
          <div className="kpi-meta">First Flush tippy lots via Mohanbari Airport</div>
        </div>
      </div>

      <div className="charts-grid" style={{ marginBottom: '24px' }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Destination Market Distribution (%)</span>
            <span className="badge badge-green">Consignments 2025-2026</span>
          </div>
          <div style={{ height: '300px' }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Multimodal Logistics Corridors</span>
            <span className="badge badge-gold">Supply Chain Network</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
            <div style={{ padding: '12px', background: 'var(--card-tint)', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
              <div style={{ fontWeight: '800', color: 'var(--primary-deep)', fontSize: '14px' }}>Rail Freight Corridor (ICD Amingaon)</div>
              <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginTop: '4px' }}>
                Dedicated containerized rake movement from Dibrugarh Freight Depot down to Amingaon Inland Container Depot, directly connected to Kolkata Maritime Terminals. Transit time: 48-60 hours.
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--lime-soft)', borderRadius: '8px', borderLeft: '4px solid var(--lime)' }}>
              <div style={{ fontWeight: '800', color: 'var(--primary-deep)', fontSize: '14px' }}>Riverine Waterway (NW-2 Pandu Port)</div>
              <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginTop: '4px' }}>
                Brahmaputra National Waterway 2 trial cargo movements connecting Dibrugarh river docks to Pandu port, offering 35% lower carbon footprint for export packaging.
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--gold-soft)', borderRadius: '8px', borderLeft: '4px solid var(--gold)' }}>
              <div style={{ fontWeight: '800', color: 'var(--primary-deep)', fontSize: '14px' }}>Air Cargo Hub (Mohanbari Airport - DIB)</div>
              <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginTop: '4px' }}>
                Chartered express handling for May-June prime Second Flush tippy teas and bespoke organic golden needles directly routed to Frankfurt, London Heathrow, and Tokyo Haneda.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
