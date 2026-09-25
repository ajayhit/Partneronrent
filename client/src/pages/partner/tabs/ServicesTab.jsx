import React, { useState } from 'react';
import { formatCurrency } from '../../../utils/helpers';
import {
  Film,
  Coffee,
  UtensilsCrossed,
  ShoppingBag,
  Compass,
  Sparkles,
  Stethoscope,
  HeartHandshake,
  MessageSquare,
  MapPin,
  Check,
  Save,
  Sliders,
  Percent
} from 'lucide-react';

const COMPANION_SERVICES_CONFIG = [
  {
    id: 'movie-companion',
    name: 'Movie Companion',
    icon: Film,
    emoji: '🎬',
    defaultRate: 500,
    defaultMinHours: 2,
    defaultMaxHours: 6,
    defaultArea: 'All City Theatres & Malls',
    defaultDesc: 'Watch latest premiere releases, discuss film plots, and share movie popcorn at public cinema multiplexes.'
  },
  {
    id: 'cafe-companion',
    name: 'Cafe / Coffee Companion',
    icon: Coffee,
    emoji: '☕',
    defaultRate: 400,
    defaultMinHours: 1,
    defaultMaxHours: 4,
    defaultArea: 'Central Cafes & Roasteries',
    defaultDesc: 'Unwind over espresso, artisanal coffee, or casual conversation in vibrant, public cafe atmospheres.'
  },
  {
    id: 'restaurant-companion',
    name: 'Restaurant Companion',
    icon: UtensilsCrossed,
    emoji: '🍽️',
    defaultRate: 600,
    defaultMinHours: 2,
    defaultMaxHours: 4,
    defaultArea: 'Dining Hubs & Fine Dine',
    defaultDesc: 'Pleasant dining company for new cuisine tastings, buffets, dinners, and culinary exploration.'
  },
  {
    id: 'shopping-companion',
    name: 'Shopping Companion',
    icon: ShoppingBag,
    emoji: '🛍️',
    defaultRate: 450,
    defaultMinHours: 2,
    defaultMaxHours: 5,
    defaultArea: 'Shopping Malls & Markets',
    defaultDesc: 'Honest styling feedback, festive shopping accompaniment, and enthusiastic retail therapy buddy.'
  },
  {
    id: 'city-exploration',
    name: 'City Exploration',
    icon: Compass,
    emoji: '🚶',
    defaultRate: 700,
    defaultMinHours: 2,
    defaultMaxHours: 8,
    defaultArea: 'Heritage Zones & City Walkways',
    defaultDesc: 'Discover city monuments, street food tours, photography walks, and hidden cultural gems.'
  },
  {
    id: 'event-companion',
    name: 'Event Companion',
    icon: Sparkles,
    emoji: '🎭',
    defaultRate: 800,
    defaultMinHours: 3,
    defaultMaxHours: 6,
    defaultArea: 'Auditoriums & Public Venues',
    defaultDesc: 'Reliable, well-mannered plus-one for concerts, standup comedy shows, exhibitions, and social mixers.'
  },
  {
    id: 'clinic-companion',
    name: 'Clinic/Hospital Companion',
    icon: Stethoscope,
    emoji: '🏥',
    defaultRate: 500,
    defaultMinHours: 2,
    defaultMaxHours: 6,
    defaultArea: 'All City Hospitals & Diagnostic Clinics',
    defaultDesc: 'Supportive, reassuring presence for waiting room companion, doctor consultation queue, and checkups.'
  },
  {
    id: 'senior-companion',
    name: 'Senior Citizen Companion',
    icon: HeartHandshake,
    emoji: '👴',
    defaultRate: 400,
    defaultMinHours: 2,
    defaultMaxHours: 6,
    defaultArea: 'Residential Parks & Quiet Cafes',
    defaultDesc: 'Gentle, patient companion for elderly walks, reading newspapers, board games, and friendly chatting.'
  },
  {
    id: 'conversation-companion',
    name: 'Conversation / Company',
    icon: MessageSquare,
    emoji: '💬',
    defaultRate: 500,
    defaultMinHours: 1,
    defaultMaxHours: 4,
    defaultArea: 'Public Parks, Libraries & Cafes',
    defaultDesc: 'Empathetic, active listener for stress decompression, sharing thoughts, and platonic emotional company.'
  },
  {
    id: 'local-assistance',
    name: 'Local Assistance',
    icon: MapPin,
    emoji: '📍',
    defaultRate: 550,
    defaultMinHours: 2,
    defaultMaxHours: 6,
    defaultArea: 'City Transit & Commercial Hubs',
    defaultDesc: 'Local insider help for navigating a new city, metro transit guidance, and finding local specialty shops.'
  }
];

export default function ServicesTab({ partner, onUpdateServices, showToast }) {
  // Initialize services state from partner services or defaults
  const [servicesState, setServicesState] = useState(() => {
    const existing = partner?.services || [];
    return COMPANION_SERVICES_CONFIG.map(svc => {
      const found = existing.find(e => e.serviceId === svc.id);
      return {
        serviceId: svc.id,
        name: svc.name,
        emoji: svc.emoji,
        enabled: found ? true : (svc.id === 'movie-companion' || svc.id === 'cafe-companion' || svc.id === 'city-exploration'),
        hourlyRate: found?.ratePerHour || svc.defaultRate,
        minHours: found?.minHours || svc.defaultMinHours,
        maxHours: found?.maxHours || svc.defaultMaxHours,
        serviceArea: found?.serviceArea || svc.defaultArea,
        description: found?.description || svc.defaultDesc
      };
    });
  });

  const [saving, setSaving] = useState(false);

  const handleToggle = (serviceId) => {
    setServicesState(prev =>
      prev.map(s => s.serviceId === serviceId ? { ...s, enabled: !s.enabled } : s)
    );
  };

  const handleFieldChange = (serviceId, field, value) => {
    setServicesState(prev =>
      prev.map(s => s.serviceId === serviceId ? { ...s, [field]: value } : s)
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const activeServices = servicesState
        .filter(s => s.enabled)
        .map(s => ({
          serviceId: s.serviceId,
          ratePerHour: Number(s.hourlyRate),
          minHours: Number(s.minHours),
          maxHours: Number(s.maxHours),
          serviceArea: s.serviceArea,
          description: s.description
        }));

      await onUpdateServices(activeServices);
      showToast('Companion services updated and published successfully!');
    } catch (err) {
      showToast('Failed to save companion services', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const enabledCount = servicesState.filter(s => s.enabled).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            🎬 My Companion Services
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Choose which platonic companionship services you offer, set custom hourly pricing, and define duration limits.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="partner-badge partner-badge-emerald">
            {enabledCount} of 10 Services Active
          </span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Services'}
          </button>
        </div>
      </div>

      {/* 80/20 Payout Explainer Card */}
      <div style={{
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: '12px',
        padding: '14px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px'
      }}>
        <Percent size={24} color="#34d399" />
        <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
          <strong style={{ color: '#fff' }}>Transparent 80% Partner Take-Home:</strong> You receive 80% of your hourly rate on every completed booking. For example, if you set <strong>₹500 / hr</strong>, your take-home is <strong>₹400 / hr</strong>.
        </div>
      </div>

      {/* List of 10 Services with Config */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '30px' }}>
        {servicesState.map(svc => {
          const config = COMPANION_SERVICES_CONFIG.find(c => c.id === svc.serviceId);
          const Icon = config?.icon || Sparkles;

          return (
            <div
              key={svc.serviceId}
              className={`partner-service-card ${svc.enabled ? 'enabled' : ''}`}
            >
              {/* Header Row: Emoji, Name, Toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: svc.enabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem'
                  }}>
                    {svc.emoji}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
                      {svc.name}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: svc.enabled ? '#34d399' : '#64748b' }}>
                      {svc.enabled ? 'Active on public directory' : 'Disabled (not accepting requests)'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle(svc.serviceId)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    background: svc.enabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                    border: svc.enabled ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: svc.enabled ? '#34d399' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {svc.enabled ? <Check size={14} /> : null}
                  {svc.enabled ? 'Service Enabled' : 'Click to Enable'}
                </button>
              </div>

              {/* Editable Fields (Active only when enabled) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '14px',
                opacity: svc.enabled ? 1 : 0.45,
                pointerEvents: svc.enabled ? 'auto' : 'none'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Hourly Rate (₹/Hour)
                  </label>
                  <input
                    type="number"
                    min="300"
                    max="5000"
                    step="50"
                    value={svc.hourlyRate}
                    onChange={e => handleFieldChange(svc.serviceId, 'hourlyRate', e.target.value)}
                    style={{ width: '100%', fontSize: '0.95rem', fontWeight: 700, color: '#34d399' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    You take home: {formatCurrency(Math.round(svc.hourlyRate * 0.8))}
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Minimum Hours
                  </label>
                  <select
                    value={svc.minHours}
                    onChange={e => handleFieldChange(svc.serviceId, 'minHours', e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="1">1 Hour Minimum</option>
                    <option value="2">2 Hours Minimum</option>
                    <option value="3">3 Hours Minimum</option>
                    <option value="4">4 Hours Minimum</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Maximum Hours
                  </label>
                  <select
                    value={svc.maxHours}
                    onChange={e => handleFieldChange(svc.serviceId, 'maxHours', e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option value="4">Up to 4 Hours</option>
                    <option value="6">Up to 6 Hours</option>
                    <option value="8">Up to 8 Hours (Full Shift)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Preferred Service Area / Venue
                  </label>
                  <input
                    type="text"
                    value={svc.serviceArea}
                    onChange={e => handleFieldChange(svc.serviceId, 'serviceArea', e.target.value)}
                    placeholder="e.g. South Delhi, Cyber Hub"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Service Description / Experience */}
              <div style={{ marginTop: '12px', opacity: svc.enabled ? 1 : 0.45, pointerEvents: svc.enabled ? 'auto' : 'none' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                  Custom Description / Companion Approach
                </label>
                <input
                  type="text"
                  value={svc.description}
                  onChange={e => handleFieldChange(svc.serviceId, 'description', e.target.value)}
                  style={{ width: '100%', fontSize: '0.86rem' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Save Button */}
      <div style={{
        position: 'sticky',
        bottom: '20px',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        zIndex: 20
      }}>
        <span style={{ fontSize: '0.86rem', color: '#94a3b8' }}>
          {enabledCount} companion services will be active for hirer discovery.
        </span>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 28px',
            fontSize: '0.95rem'
          }}
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save Services & Rates'}
        </button>
      </div>
    </div>
  );
}
