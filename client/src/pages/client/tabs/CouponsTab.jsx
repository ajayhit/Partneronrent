import React from 'react';
import { Tag } from 'lucide-react';

export default function CouponsTab() {
  return (
    <div>
      <div style={{ marginBottom: '22px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
          Coupons & Offers
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
          Available offers will appear here.
        </p>
      </div>

      <div className="client-panel" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
        <Tag size={36} style={{ margin: '0 auto 12px', opacity: 0.45 }} />
        <h3 style={{ color: '#cbd5e1', fontSize: '1.05rem', margin: '0 0 8px' }}>
          No coupons or offers available
        </h3>
        <p style={{ fontSize: '0.86rem', margin: 0 }}>
          Check back later for new offers.
        </p>
      </div>
    </div>
  );
}
