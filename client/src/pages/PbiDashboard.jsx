import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Doughnut, Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Filler 
} from 'chart.js';
import { TrendingUp, Award, DollarSign, Activity, Calendar, Download, RefreshCw } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler);

export default function PbiDashboard() {
  const { currentMetrics, selectedYear, setSelectedYear, estates, refreshData } = usePortal();
  const [downloadMsg, setDownloadMsg] = useState('');

  const m = currentMetrics;

  const donutData = {
    labels: ['Organized Corporate Estates', 'Registered Small Tea Growers'],
    datasets: [{
      data: [m.organizedPct, m.stgPct],
      backgroundColor: ['rgba(21, 128, 61, 0.85)', 'rgba(132, 204, 22, 0.85)'],
      borderColor: ['#15803d', '#84cc16'],
      borderWidth: 2,
      hoverOffset: 6
    }]
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 14, font: { family: 'Public Sans', size: 12 } } },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.raw}% share of district output`
        }
      }
    },
    cutout: '68%'
  };

  const lineData = {
    labels: ['2023', '2024', '2025', '2026 (P)'],
    datasets: [
      {
        label: 'Dibrugarh Orthodox / Special Grade (₹/kg)',
        data: [292, 314, 338, 362],
        borderColor: '#15803d',
        backgroundColor: 'rgba(21, 128, 61, 0.08)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#15803d',
        pointRadius: 5
      },
      {
        label: 'GTAC CTC District Average (₹/kg)',
        data: [194, 208, 222, 241],
        borderColor: '#d97706',
        backgroundColor: 'rgba(217, 119, 6, 0.08)',
        fill: true,
        tension: 0.35,
        pointBackgroundColor: '#d97706',
        pointRadius: 5
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { boxWidth: 14, font: { family: 'Public Sans', size: 12 } } }
    },
    scales: {
      y: {
        min: 160,
        max: 400,
        ticks: { callback: (v) => '₹' + v }
      }
    }
  };

  const handleExportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + [
      ['Metric', 'Year', 'Value'],
      ['Annual Made-Tea Production (M.Kg)', selectedYear, m.production],
      ['GTAC Benchmark Price (INR/kg)', selectedYear, m.avgPrice],
      ['Total Plantation Area (Hectares)', selectedYear, m.hectares],
      ['Total Tea Workforce Registered', selectedYear, m.workforce],
      ['Corporate Sector Share (%)', selectedYear, m.organizedPct],
      ['Smallholder STG Share (%)', selectedYear, m.stgPct]
    ].map(e => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dibrugarh_tea_kpi_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadMsg(`Downloaded KPI dataset for ${selectedYear}`);
    setTimeout(() => setDownloadMsg(''), 4000);
  };

  return (
    <div className="dashboard-page">
      <div className="header-bar">
        <div>
          <h2>Executive Tea Intelligence Matrix</h2>
          <p>Real-time agronomic, auction, and production benchmarks across Dibrugarh District, Assam</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="slicer-group">
            <Calendar size={15} color="#15803d" />
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>Crop Year:</span>
            {['2026', '2025', '2024', '2023'].map(year => (
              <button
                key={year}
                className={`slicer-pill ${selectedYear === year ? 'active' : ''}`}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </button>
            ))}
          </div>

          <button className="btn-secondary" onClick={refreshData} title="Refresh from Server">
            <RefreshCw size={15} /> Refresh
          </button>
          <button className="btn-primary" onClick={handleExportCSV}>
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {downloadMsg && (
        <div className="alert alert-success" style={{ marginBottom: '16px' }}>
          {downloadMsg}
        </div>
      )}

      {/* KPI 4-Card Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span>Annual Made-Tea Output</span>
            <div className="kpi-icon"><Activity size={18} /></div>
          </div>
          <div className="kpi-value">{m.production} <span className="kpi-unit">M.Kg</span></div>
          <div className="kpi-meta">
            <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{m.trend}</span> vs prior baseline
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span>GTAC Realization Price</span>
            <div className="kpi-icon"><DollarSign size={18} /></div>
          </div>
          <div className="kpi-value">₹{m.avgPrice} <span className="kpi-unit">/ kg</span></div>
          <div className="kpi-meta">
            <span style={{ color: 'var(--primary)', fontWeight: '700' }}>+4.2%</span> orthodox auction premium
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span>Registered Acreage</span>
            <div className="kpi-icon"><Award size={18} /></div>
          </div>
          <div className="kpi-value">{m.hectares} <span className="kpi-unit">Ha</span></div>
          <div className="kpi-meta">
            177 corporate grants + 29,771 STG plots
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span>Tea Workforce Enumerated</span>
            <div className="kpi-icon"><TrendingUp size={18} /></div>
          </div>
          <div className="kpi-value">{m.workforce} <span className="kpi-unit">Workers</span></div>
          <div className="kpi-meta">
            100% statutory PLA coverage in 2026
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Sector Yield Composition ({selectedYear})</span>
            <span className="badge badge-green">Production Split</span>
          </div>
          <div style={{ height: '280px', position: 'relative' }}>
            <Doughnut data={donutData} options={donutOptions} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--line)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>Corporate Hectares</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary-deep)' }}>52,480 Ha</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>Smallholder Hectares</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--lime)' }}>31,220 Ha</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Auction Price Trajectory (2023 - 2026)</span>
            <span className="badge badge-gold">GTAC Guwahati Series</span>
          </div>
          <div style={{ height: '280px', position: 'relative' }}>
            <Line data={lineData} options={lineOptions} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--line)', fontSize: '12px', color: 'var(--ink-soft)' }}>
            <span>⭐ Manohari Gold Speciality Lot hit <b>₹1,15,000/kg</b> (World Record)</span>
            <span className="badge badge-green">Orthodox Growth: +24%</span>
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <span className="card-title">Top Landmark Estates Benchmark Snapshot</span>
          <span className="badge badge-green">Verified 2026 Operational Status</span>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Estate Name</th>
                <th>Subdivision / Circle</th>
                <th>Planted Area (Ha)</th>
                <th>2026 Output (Kg)</th>
                <th>Primary Specialty</th>
                <th>GTAC Peak Realization</th>
                <th>Operational Status</th>
              </tr>
            </thead>
            <tbody>
              {estates.slice(0, 6).map(e => (
                <tr key={e.id}>
                  <td style={{ fontWeight: '700', color: 'var(--primary-deep)' }}>{e.name}</td>
                  <td>{e.circle}</td>
                  <td>{e.areaHectares} Ha</td>
                  <td>{Number(e.annualOutputKg).toLocaleString()} kg</td>
                  <td><span className="badge badge-lime">{e.specialty}</span></td>
                  <td style={{ fontWeight: '700', color: 'var(--gold)' }}>₹{e.peakPriceInr} / kg</td>
                  <td><span className="badge badge-green">Operational (Active)</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
