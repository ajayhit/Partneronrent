import React from 'react';
import { FileText, Shield, AlertTriangle, Scale, ArrowLeft } from 'lucide-react';

export default function PolicyNav({ activePage, setActivePage }) {
  const tabs = [
    { id: 'terms', label: 'Terms of Service', icon: FileText, color: '#8b5cf6' },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield, color: '#38bdf8' },
    { id: 'safety', label: 'Safety Guidelines', icon: AlertTriangle, color: '#f43f5e' },
    { id: 'conduct', label: 'Partner Code of Conduct', icon: Scale, color: '#10b981' }
  ];

  return (
    <div style={{ marginBottom: '32px' }}>
      {/* Back button & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={() => setActivePage('home')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#94a3b8',
            fontSize: '0.88rem',
            padding: '8px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(30, 41, 59, 0.6)',
            border: '1px solid var(--border-subtle)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
        >
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </button>

        <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
          PartnerOnRent Trust & Legal Governance Center • Updated September 2026
        </div>
      </div>

      {/* 4 Tabs switcher */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px',
        background: 'rgba(15, 23, 42, 0.7)',
        padding: '8px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activePage === tab.id || activePage === `${tab.id}-of-service` || activePage === `${tab.id}-policy` || activePage === `${tab.id}-guidelines`;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePage(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                fontWeight: isSelected ? 700 : 500,
                color: isSelected ? '#ffffff' : '#94a3b8',
                background: isSelected ? `linear-gradient(135deg, ${tab.color}22, rgba(30, 41, 59, 0.8))` : 'transparent',
                border: isSelected ? `1px solid ${tab.color}88` : '1px solid transparent',
                boxShadow: isSelected ? `0 4px 16px ${tab.color}22` : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={18} color={isSelected ? tab.color : '#64748b'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
