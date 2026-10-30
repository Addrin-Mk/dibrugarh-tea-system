import React from 'react';
import { usePortal } from '../context/PortalContext';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Truck, MapPin, TrendingUp, Layers } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function InterstateTrade() {
  const barData = {
    labels: ['Maharashtra & Gujarat (Western Hub)', 'Delhi NCR & UP (Northern Belt)', 'West Bengal (Eastern Transit)', 'Punjab & Haryana (High Per Capita)', 'Southern States (AP, TS, TN, KA)'],
    datasets: [{
      label: 'Annual Consumption Outflow (M.Kg)',
      data: [28.4, 24.1, 14.6, 9.8, 5.2],
      backgroundColor: 'rgba(21, 128, 61, 0.85)',
      borderColor: '#15803d',
      borderWidth: 1.5,
      borderRadius: 6
    }]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { boxWidth: 14, font: { family: 'Public Sans', size: 12 } } },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.raw} M.Kg volume`
        }
      }
    },
    scales: {
      y: {
        ticks: { callback: v => v + ' M.Kg' }
      }
    }
  };

  return (
    <div className="trade-page">
      <div className="header-bar">
        <div>
          <h2>Domestic Interstate Distribution & Rail Logistics</h2>
          <p>Pan-India movement of Dibrugarh CTC blends and supermarket packaging flows</p>
        </div>
        <div className="badge badge-green" style={{ padding: '6px 14px' }}>
          Domestic Offtake: 78.5 M.Kg (76.2% of Total District Output)
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: '24px' }}>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Domestic Freight Outflow</span>
            <div className="kpi-icon"><Truck size={18} /></div>
          </div>
          <div className="kpi-value">78.5 <span className="kpi-unit">M.Kg</span></div>
          <div className="kpi-meta">Supplied to consumer state hubs</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Top Consuming Zone</span>
            <div className="kpi-icon"><MapPin size={18} /></div>
          </div>
          <div className="kpi-value">Western <span className="kpi-unit">India</span></div>
          <div className="kpi-meta">36.1% absorbed by Mumbai, Pune, Ahmedabad</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Corporate Packaged Blends</span>
            <div className="kpi-icon"><Layers size={18} /></div>
          </div>
          <div className="kpi-value">58.2 <span className="kpi-unit">M.Kg</span></div>
          <div className="kpi-meta">Offtake by Tata, HUL, Wagh Bakri</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Highway Express Transit</span>
            <div className="kpi-icon"><TrendingUp size={18} /></div>
          </div>
          <div className="kpi-value">4.5 <span className="kpi-unit">Days</span></div>
          <div className="kpi-meta">Average transit time via NH-27 East-West corridor</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <span className="card-title">Interstate Ingestion Hubs (2025-2026 Volume Breakdown)</span>
          <span className="badge badge-green">Consignment Tollway Audits</span>
        </div>
        <div style={{ height: '340px' }}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* Seasonal Flush Cycle */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Seasonal Harvest Flush Distribution</span>
          <span className="badge badge-gold">Annual Agronomic Cycle</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '8px' }}>
          <div style={{ padding: '16px', background: 'var(--card-tint)', borderRadius: '10px' }}>
            <span className="badge badge-lime">First Flush (March - April)</span>
            <h4 style={{ margin: '10px 0 6px', color: 'var(--primary-deep)' }}>12% of Annual Crop</h4>
            <p style={{ fontSize: '12px', color: 'var(--ink-soft)', margin: 0, lineHeight: '1.4' }}>
              Light, fresh liquor with brisk notes. Prized by connoisseurs and air-freighted for boutique collections.
            </p>
          </div>

          <div style={{ padding: '16px', background: 'var(--gold-soft)', borderRadius: '10px' }}>
            <span className="badge badge-gold">Second Flush (May - June)</span>
            <h4 style={{ margin: '10px 0 6px', color: 'var(--primary-deep)' }}>34% of Annual Crop</h4>
            <p style={{ fontSize: '12px', color: 'var(--ink-soft)', margin: 0, lineHeight: '1.4' }}>
              The golden window. Thick body, rich muscatel aroma, tippy orthodox leaf with maximum market hammer prices.
            </p>
          </div>

          <div style={{ padding: '16px', background: 'var(--lime-soft)', borderRadius: '10px' }}>
            <span className="badge badge-green">Monsoon Flush (July - Sept)</span>
            <h4 style={{ margin: '10px 0 6px', color: 'var(--primary-deep)' }}>42% of Annual Crop</h4>
            <p style={{ fontSize: '12px', color: 'var(--ink-soft)', margin: 0, lineHeight: '1.4' }}>
              Peak volume yield. Robust color and strong liquor, supplying majority CTC domestic household chai blends.
            </p>
          </div>

          <div style={{ padding: '16px', background: 'var(--primary-light)', borderRadius: '10px' }}>
            <span className="badge badge-lime">Autumnal Flush (Oct - Dec)</span>
            <h4 style={{ margin: '10px 0 6px', color: 'var(--primary-deep)' }}>12% of Annual Crop</h4>
            <p style={{ fontSize: '12px', color: 'var(--ink-soft)', margin: 0, lineHeight: '1.4' }}>
              Coppery red infusion with sweet finish. Final pluck before winter dormancy and deep botanical bush pruning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
