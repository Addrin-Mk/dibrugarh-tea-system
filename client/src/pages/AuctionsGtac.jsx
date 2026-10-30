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
import { Gavel, TrendingUp, DollarSign, Award, Calendar } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AuctionsGtac() {
  const barData = {
    labels: ['Orthodox Whole Leaf', 'Orthodox Broken', 'CTC Broken Pekoe', 'CTC Fannings', 'CTC Dust / Super', 'Specialty Golden Tips'],
    datasets: [
      {
        label: 'Sale 42 Peak Realization (₹/kg)',
        data: [420, 310, 245, 218, 195, 1250],
        backgroundColor: 'rgba(21, 128, 61, 0.85)',
        borderColor: '#15803d',
        borderWidth: 1.5,
        borderRadius: 6
      },
      {
        label: 'District Average Realization (₹/kg)',
        data: [340, 275, 212, 188, 172, 850],
        backgroundColor: 'rgba(217, 119, 6, 0.85)',
        borderColor: '#d97706',
        borderWidth: 1.5,
        borderRadius: 6
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { boxWidth: 14, font: { family: 'Public Sans', size: 12 } } },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ₹${ctx.raw}/kg`
        }
      }
    },
    scales: {
      y: {
        ticks: { callback: v => '₹' + v }
      }
    }
  };

  return (
    <div className="gtac-page">
      <div className="header-bar">
        <div>
          <h2>Guwahati Tea Auction Centre (GTAC) Market Discoveries</h2>
          <p>Official electronic trading, price discovery spreads, and lot sales for Dibrugarh marks</p>
        </div>
        <div className="badge badge-gold" style={{ padding: '6px 14px' }}>
          Sale No. 42 / Current Season Cloture
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: '24px' }}>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>GTAC Dibrugarh Offerings</span>
            <div className="kpi-icon"><Gavel size={18} /></div>
          </div>
          <div className="kpi-value">4.28 <span className="kpi-unit">M.Kg</span></div>
          <div className="kpi-meta">96.4% sale conversion rate</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Orthodox Average</span>
            <div className="kpi-icon"><Award size={18} /></div>
          </div>
          <div className="kpi-value">₹362 <span className="kpi-unit">/ kg</span></div>
          <div className="kpi-meta">+14.6% vs Kolkata exchange parity</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>CTC Average Realization</span>
            <div className="kpi-icon"><DollarSign size={18} /></div>
          </div>
          <div className="kpi-value">₹241 <span className="kpi-unit">/ kg</span></div>
          <div className="kpi-meta">+₹18/kg above Brahmaputra valley avg</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header">
            <span>World Record High Mark</span>
            <div className="kpi-icon"><TrendingUp size={18} /></div>
          </div>
          <div className="kpi-value">₹1,15,000 <span className="kpi-unit">/ kg</span></div>
          <div className="kpi-meta">Manohari Gold Tea at GTAC Pan-India</div>
        </div>
      </div>

      {/* GTAC Price Comparison Chart */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <span className="card-title">Grade-Wise Hammer Price Spread (Current Season)</span>
          <span className="badge badge-green">Electronic Trading System (e-Auction)</span>
        </div>
        <div style={{ height: '340px' }}>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* Recent Auction Lots Table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent High-Value Dibrugarh Catalog Lots</span>
          <span className="badge badge-gold">Guwahati e-Auction Portal</span>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Garden Mark</th>
                <th>Grade</th>
                <th>Pkgs (Bags)</th>
                <th>Net Weight</th>
                <th>Buyer Agency</th>
                <th>Hammer Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontFamily: 'monospace', fontWeight: '700' }}>INV-GTAC-9021</td>
                <td style={{ fontWeight: '800', color: 'var(--primary-deep)' }}>MANOHARI SPECIAL</td>
                <td><span className="badge badge-gold">GOLD TIPS</span></td>
                <td>2 Chests</td>
                <td>40.0 kg</td>
                <td>Saurabh Tea Traders, Ahmedabad</td>
                <td style={{ fontWeight: '800', color: 'var(--gold)' }}>₹1,15,000 / kg</td>
              </tr>
              <tr>
                <td style={{ fontFamily: 'monospace', fontWeight: '700' }}>INV-GTAC-8842</td>
                <td style={{ fontWeight: '800', color: 'var(--primary-deep)' }}>MAIJAN EXCLUSIVE</td>
                <td><span className="badge badge-lime">TGFOP1</span></td>
                <td>24 Pkgs</td>
                <td>840 kg</td>
                <td>Kolkata Tea Exporters Ltd</td>
                <td style={{ fontWeight: '800', color: 'var(--primary)' }}>₹540 / kg</td>
              </tr>
              <tr>
                <td style={{ fontFamily: 'monospace', fontWeight: '700' }}>INV-GTAC-8790</td>
                <td style={{ fontWeight: '800', color: 'var(--primary-deep)' }}>CHABUA HERITAGE</td>
                <td><span className="badge badge-green">BP (CTC)</span></td>
                <td>80 Pkgs</td>
                <td>2,800 kg</td>
                <td>Tata Consumer Products</td>
                <td style={{ fontWeight: '800', color: 'var(--primary)' }}>₹288 / kg</td>
              </tr>
              <tr>
                <td style={{ fontFamily: 'monospace', fontWeight: '700' }}>INV-GTAC-8641</td>
                <td style={{ fontWeight: '800', color: 'var(--primary-deep)' }}>ZALONI PREMIUM</td>
                <td><span className="badge badge-green">OF (CTC)</span></td>
                <td>120 Pkgs</td>
                <td>4,200 kg</td>
                <td>Hindustan Unilever Ltd</td>
                <td style={{ fontWeight: '800', color: 'var(--primary)' }}>₹272 / kg</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
