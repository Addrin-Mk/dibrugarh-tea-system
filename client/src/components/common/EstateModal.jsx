import React from 'react';
import { usePortal } from '../../context/PortalContext';
import { X, Award, MapPin, Building, Calendar, Factory } from 'lucide-react';

export default function EstateModal() {
  const { selectedEstateModal, setSelectedEstateModal } = usePortal();

  if (!selectedEstateModal) return null;
  const e = selectedEstateModal;

  return (
    <div className="modal-backdrop" onClick={() => setSelectedEstateModal(null)}>
      <div className="modal-dialog" onClick={ev => ev.stopPropagation()}>
        <button 
          type="button" 
          className="modal-close" 
          onClick={() => setSelectedEstateModal(null)}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
          <img 
            src={`/assets/${e.img || 'estate_manohari.jpg'}`} 
            alt={e.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(8,34,16,0.1) 0%, rgba(8,34,16,0.92) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span style={{ background: '#d97706', color: '#fff', fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '4px' }}>
                RANK #{e.rank} PRESTIGE
              </span>
              <span style={{ background: '#15803d', color: '#fff', fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '4px' }}>
                FOUNDED {e.year || 1904}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px' }}>
                {e.circle}
              </span>
            </div>
            <h2 style={{ color: '#fff', margin: 0, fontSize: '24px' }}>{e.name}</h2>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px' }}>{e.owner}</div>
          </div>
        </div>

        <div style={{ padding: '20px' }}>
          {e.caption && (
            <div style={{ fontSize: '12.5px', fontStyle: 'italic', color: 'var(--ink-soft)', marginBottom: '16px', background: 'var(--primary-light)', padding: '10px 14px', borderRadius: '6px', borderLeft: '3px solid var(--primary)' }}>
              📷 <strong>Cultivation Scene:</strong> {e.caption}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
            <div style={{ background: 'var(--bg)', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', textAlign: 'center' }}>
              <div style={{ fontWeight: '800', color: 'var(--primary-deep)', fontSize: '15px' }}>{e.capacity}</div>
              <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>Annual Cap.</div>
            </div>
            <div style={{ background: 'var(--bg)', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', textAlign: 'center' }}>
              <div style={{ fontWeight: '800', color: 'var(--primary-deep)', fontSize: '15px' }}>{e.area} ha</div>
              <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>Planted Area</div>
            </div>
            <div style={{ background: 'var(--bg)', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', textAlign: 'center' }}>
              <div style={{ fontWeight: '800', color: 'var(--primary-deep)', fontSize: '15px' }}>{e.yield ? e.yield.toLocaleString() : '8,450'} kg/ha</div>
              <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>Yield Efficiency</div>
            </div>
          </div>

          <div style={{ background: 'var(--primary-light)', padding: '10px 14px', borderRadius: '6px', borderLeft: '4px solid var(--primary)', marginBottom: '12px', fontSize: '13px' }}>
            <strong>📍 Location:</strong> {e.location} &nbsp;•&nbsp; <strong>🏛 Registry:</strong> {e.registry}
          </div>

          <div style={{ background: '#fef3c7', padding: '10px 14px', borderRadius: '6px', borderLeft: '4px solid #d97706', marginBottom: '16px', fontSize: '13px', color: '#92400e' }}>
            <strong>🏆 Landmark Distinction:</strong> {e.accolade}
          </div>

          <p style={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: '1.6', margin: 0 }}>
            {e.desc}
          </p>
        </div>
      </div>
    </div>
  );
}
