import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Download, Plus, Filter, Database, FileSpreadsheet } from 'lucide-react';

export default function ProductionRegistry() {
  const { currentMetrics, selectedYear, setSelectedYear } = usePortal();

  // 5-year series dataset
  const timeSeries = [
    { year: '2026 (Projected)', totalMkg: 103.0, corporateMkg: 50.3, stgMkg: 52.7, avgInr: 241, greenLeafDmc: 24.80, totalAreaHa: 83700, workers: 214500 },
    { year: '2025', totalMkg: 98.4, corporateMkg: 49.0, stgMkg: 49.4, avgInr: 222, greenLeafDmc: 23.50, totalAreaHa: 83100, workers: 211000 },
    { year: '2024', totalMkg: 94.2, corporateMkg: 48.2, stgMkg: 46.0, avgInr: 208, greenLeafDmc: 22.10, totalAreaHa: 82400, workers: 208500 },
    { year: '2023', totalMkg: 91.8, corporateMkg: 47.9, stgMkg: 43.9, avgInr: 194, greenLeafDmc: 20.80, totalAreaHa: 81800, workers: 205000 },
    { year: '2022', totalMkg: 89.5, corporateMkg: 47.5, stgMkg: 42.0, avgInr: 186, greenLeafDmc: 19.50, totalAreaHa: 81200, workers: 202000 }
  ];

  const exportRegistryCSV = () => {
    const headers = ['Year', 'Total Output (M.Kg)', 'Corporate (M.Kg)', 'STG (M.Kg)', 'GTAC Avg (INR/kg)', 'DMC Leaf Price (INR/kg)', 'Area (Ha)', 'Workforce'];
    const rows = timeSeries.map(r => [
      r.year, r.totalMkg, r.corporateMkg, r.stgMkg, r.avgInr, r.greenLeafDmc, r.totalAreaHa, r.workers
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map(e => e.join(',')).join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = 'dibrugarh_district_tea_production_registry_2022_2026.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="registry-page">
      <div className="header-bar">
        <div>
          <h2>District Production & Statistical Registry</h2>
          <p>Chronological statistical archive of Dibrugarh tea economy (2022 - 2026 Projections)</p>
        </div>
        <button className="btn-primary" onClick={exportRegistryCSV}>
          <FileSpreadsheet size={15} /> Download Full Master Register (CSV)
        </button>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <span className="card-title">Historical & Forecast Production Balance Sheet</span>
          <span className="badge badge-green">Tea Board District Registry</span>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Crop Year</th>
                <th>Total Made-Tea (M.Kg)</th>
                <th>Corporate Yield</th>
                <th>Smallholder Yield</th>
                <th>GTAC Realization (₹/kg)</th>
                <th>DMC Green Leaf (₹/kg)</th>
                <th>Plantation Acreage</th>
                <th>Registered Workforce</th>
              </tr>
            </thead>
            <tbody>
              {timeSeries.map(r => (
                <tr key={r.year} style={r.year.includes('2026') ? { background: 'var(--primary-light)' } : {}}>
                  <td style={{ fontWeight: '800', color: 'var(--primary-deep)' }}>{r.year}</td>
                  <td style={{ fontWeight: '800', color: 'var(--primary)' }}>{r.totalMkg} M.Kg</td>
                  <td>{r.corporateMkg} M.Kg ({(r.corporateMkg / r.totalMkg * 100).toFixed(1)}%)</td>
                  <td>{r.stgMkg} M.Kg ({(r.stgMkg / r.totalMkg * 100).toFixed(1)}%)</td>
                  <td style={{ fontWeight: '700', color: 'var(--gold)' }}>₹{r.avgInr} / kg</td>
                  <td>₹{r.greenLeafDmc.toFixed(2)} / kg</td>
                  <td>{r.totalAreaHa.toLocaleString()} Ha</td>
                  <td>{r.workers.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary-deep)', marginBottom: '8px' }}>
          Agronomic Note on District Expansion Dynamics
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: '1.6', margin: 0 }}>
          Over the past five cycles (2022 to 2026), the Small Tea Growers (STG) sector in Dibrugarh has expanded its contribution from 46.9% to 51.2% of total green leaf intake. Corporate concessions maintain superior realizations through orthodox re-tooling (Manohari, Maijan, Chabua), while 64 Bought Leaf Factories (BLFs) have modernized with automated withering and rolling gear to ensure export compliance under Plant Protection Code (PPC) guidelines.
        </p>
      </div>
    </div>
  );
}
