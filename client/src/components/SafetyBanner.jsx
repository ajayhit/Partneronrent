import React from 'react';
import { ShieldCheck, MapPin, KeyRound, AlertTriangle } from 'lucide-react';

export default function SafetyBanner() {
  return (
    <div style={{
      background: 'linear-gradient(90deg, rgba(124, 58, 237, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: 'var(--radius-md)',
      padding: '16px 20px',
      margin: '24px 0',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: '#7c3aed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <ShieldCheck size={20} color="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
            Safe & Platonic Verification Standard
          </div>
          <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
            All companions undergo ID verification. All in-person sessions must occur in public venues only.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#c084fc' }}>
          <KeyRound size={15} />
          <span>Session Start OTP</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#38bdf8' }}>
          <MapPin size={15} />
          <span>Public Venues Only</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#f87171' }}>
          <AlertTriangle size={15} />
          <span>1-Tap SOS Dispatch</span>
        </div>
      </div>
    </div>
  );
}
