import React, { useState } from 'react';
import {
  User,
  Camera,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Languages,
  ShieldCheck,
  Save,
  Check
} from 'lucide-react';

const POPULAR_LANGUAGES = ['English', 'Hindi', 'Bengali', 'Marathi', 'Tamil', 'Telugu', 'Gujarati', 'Punjabi'];

export default function ProfileTab({ client, onUpdateProfile, showToast }) {
  const [formData, setFormData] = useState({
    name: client?.name || 'Rahul Verma',
    avatar: client?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    mobile: client?.phone || '+91 98765 43210',
    email: client?.email || 'rahul.verma@example.com',
    dob: client?.dob || '1996-05-14',
    gender: client?.gender || 'Male',
    city: client?.city || 'Delhi NCR',
    address: client?.address || 'B-12, Greater Kailash Part 1, New Delhi 110048',
    emergencyContact: client?.emergencyContact || '+91 98111 22334 (Brother - Amit Verma)',
    preferredLanguages: client?.preferredLanguages || ['English', 'Hindi']
  });

  const [saving, setSaving] = useState(false);

  const toggleLanguage = (lang) => {
    setFormData(prev => {
      const exists = prev.preferredLanguages.includes(lang);
      return {
        ...prev,
        preferredLanguages: exists ? prev.preferredLanguages.filter(l => l !== lang) : [...prev.preferredLanguages, lang]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Profile information successfully saved!');
    }, 400);
  };

  return (
    <div>
      <div style={{ marginBottom: '22px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
          👤 My Personal Profile & Verification
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
          Keep your contact information up to date for booking confirmations and emergency safety alerts.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Verification Status Banner */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '14px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={28} color="#10b981" />
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.96rem' }}>
                Account Verification: VERIFIED HIRER
              </div>
              <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                Aadhaar e-KYC and mobile OTP verified. Unlocks priority booking across all partner cities.
              </div>
            </div>
          </div>
          <span className="client-badge client-badge-emerald">Tier 1 Hirer Clearance</span>
        </div>

        {/* Profile Photo & Basic Info */}
        <div className="client-panel">
          <div className="client-panel-title" style={{ marginBottom: '16px' }}>
            <Camera size={18} color="#ec4899" />
            <span>Profile Photo & Avatar</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <img
              src={formData.avatar}
              alt={formData.name}
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #ec4899'
              }}
            />
            <div style={{ flex: 1, minWidth: '240px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                Profile Photo URL
              </label>
              <input
                type="url"
                value={formData.avatar}
                onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://..."
                style={{ width: '100%', fontSize: '0.86rem' }}
              />
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                A clear face photo helps your companion recognize you at public venues.
              </span>
            </div>
          </div>
        </div>

        {/* Personal Details Grid */}
        <div className="client-panel">
          <div className="client-panel-title" style={{ marginBottom: '16px' }}>
            <User size={18} color="#38bdf8" />
            <span>Personal Information</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                Mobile Number
              </label>
              <input
                type="text"
                value={formData.mobile}
                onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dob}
                onChange={e => setFormData({ ...formData, dob: e.target.value })}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                City
              </label>
              <select
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                style={{ width: '100%' }}
              >
                <option>Delhi NCR</option>
                <option>Jaipur</option>
                <option>Mumbai</option>
                <option>Bangalore</option>
                <option>Pune</option>
                <option>Hyderabad</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
              Residential Address
            </label>
            <textarea
              rows="2"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
              style={{ width: '100%', fontSize: '0.85rem' }}
            />
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Used only for KYC compliance. Never shared with companions.</span>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
              Designated Emergency Contact Person
            </label>
            <input
              type="text"
              value={formData.emergencyContact}
              onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })}
              placeholder="e.g. +91 98111 22334 (Brother - Amit Verma)"
              style={{ width: '100%' }}
              required
            />
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Notified immediately during emergency SOS alerts.</span>
          </div>
        </div>

        {/* Preferred Languages */}
        <div className="client-panel">
          <div className="client-panel-title" style={{ marginBottom: '14px' }}>
            <Languages size={18} color="#c084fc" />
            <span>Preferred Communication Languages</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {POPULAR_LANGUAGES.map(lang => {
              const sel = formData.preferredLanguages.includes(lang);
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    background: sel ? 'rgba(236, 72, 153, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: sel ? '1px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: sel ? '#f472b6' : '#cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {sel && <Check size={12} />} {lang}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ textAlign: 'right', marginBottom: '30px' }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={saving}
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)',
              padding: '12px 32px',
              fontSize: '0.95rem',
              fontWeight: 700
            }}
          >
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
