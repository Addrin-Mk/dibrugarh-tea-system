import React from 'react';
import { usePortal } from '../context/PortalContext';
import { Check, ShieldCheck, Sun, Wind, Flame, Package, Award } from 'lucide-react';

export default function TeaJourney() {
  const steps = [
    {
      num: '01',
      title: 'Precision Plucking & Tender Leaf Harvest',
      duration: 'Morning 06:30 - 11:30',
      icon: Sun,
      desc: 'Selective harvesting of "two leaves and a bud" from Camellia sinensis var. assamica bush canopies. Hand plucking guarantees whole-leaf cellular integrity necessary for specialty tippy golden orthodox production.'
    },
    {
      num: '02',
      title: 'Trough Withering & Moisture Reduction',
      duration: '14 - 18 Hours Controlled Air Flow',
      icon: Wind,
      desc: 'Fresh succulent leaves are spread evenly over wire mesh withering troughs. Ambient and tempered forced air reduces leaf moisture content from 78% down to 64%, initiating enzymatic amino acid activation and delicate floral esters.'
    },
    {
      num: '03',
      title: 'Maceration & Rolling (Orthodox vs CTC Split)',
      duration: '45 - 60 Minutes Mechanical Rolling',
      icon: Flame,
      desc: 'Orthodox rolling uses Jackson & Rotorvane rollers that gently rupture leaf vacuole walls without shredding, yielding full-leaf twisted grades. CTC involves Crush-Tear-Curl high-speed rollers creating uniform granulated pellets for brisk liquor.'
    },
    {
      num: '04',
      title: 'Controlled Enzymatic Oxidation (Fermentation)',
      duration: '90 - 120 Minutes at 24°C - 27°C',
      icon: ShieldCheck,
      desc: 'The crucial transformation where polyphenols (catechins) convert into theaflavins (responsible for golden brightness) and thearubigins (providing hearty malty depth and coppery infusion color). Monitored under 95% relative humidity.'
    },
    {
      num: '05',
      title: 'Fluidized Bed Drier Firing',
      duration: '22 - 25 Minutes at 95°C - 105°C',
      icon: Flame,
      desc: 'Extreme hot air halts enzymatic oxidation immediately, reducing final moisture to 2.5% - 3.0%. This preserves the aroma profile, arrests bacterial activity, and locks in the distinctive Dibrugarh brisk character and prolonged shelf stability.'
    },
    {
      num: '06',
      title: 'Vibratory Grading & Electrostatic Sorting',
      duration: 'Continuous Mechanical Separation',
      icon: Award,
      desc: 'Vibratory mesh decks sort dried tea into primary orthodox grades: FTGFOP1 (Finest Tippy Golden Flowery Orange Pekoe), TGFOP, FBOP, down to BOPF and CTC grades like BP, PF, and Dust. Electrostatic rollers extract inert fiber.'
    },
    {
      num: '07',
      title: 'Hermetic Moisture-Barrier Packing & Warehousing',
      duration: 'Same-day Multiwall Vacuum Bags',
      icon: Package,
      desc: 'Bulk lots are packed in four-ply multiwall paper sacks lined with aluminum foil to prevent ambient humidity reabsorption. Transported down Assam Trunk Road to GTAC Guwahati and Inland Container Depot (ICD) Amingaon for global dispatch.'
    }
  ];

  return (
    <div className="tea-journey-page">
      <div className="header-bar">
        <div>
          <h2>The Dibrugarh Tea Journey: Bush to Cup</h2>
          <p>Scientific agronomic and processing lifecycle of Assam's prized botanical golden flush</p>
        </div>
        <div className="badge badge-green" style={{ padding: '6px 14px' }}>
          ISO 22000 & Rainforest Alliance Certified
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {steps.map((st, i) => {
          const IconComp = st.icon;
          return (
            <div key={st.num} className="card" style={{ marginBottom: '20px', padding: '24px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{
                background: 'var(--primary-light)',
                border: '2px solid var(--primary)',
                color: 'var(--primary)',
                fontSize: '22px',
                fontWeight: '900',
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {st.num}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary-deep)', margin: 0 }}>
                    {st.title}
                  </h3>
                  <span className="badge badge-lime" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <IconComp size={13} /> {st.duration}
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: '1.6', margin: 0 }}>
                  {st.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
