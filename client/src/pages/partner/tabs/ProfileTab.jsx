import React, { useState } from 'react';
import {
  User,
  Camera,
  MapPin,
  Languages,
  Sparkles,
  Phone,
  Mail,
  ShieldCheck,
  Eye,
  Check,
  Plus,
  X,
  Save
} from 'lucide-react';

const ALL_LANGUAGES = [
  'English', 'Hindi', 'Bengali', 'Marathi', 'Telugu', 'Tamil', 'Kannada', 'Gujarati', 'Punjabi', 'Malayalam'
];

const POPULAR_INTERESTS = [
  'Coffee Tasting', 'Art Galleries', 'Indie Cinema', 'Bookstores', 'Live Concerts',
  'Street Food Tours', 'Museum Walks', 'Board Games', 'Gym & Fitness', 'Tech & Startups',
  'Yoga & Mindfulness', 'Fashion Shopping', 'Standup Comedy', 'Heritage Walks'
];

export default function ProfileTab({ partner, onUpdateProfile, showToast }) {
  const [formData, setFormData] = useState({
    name: partner?.name || '',
    tagline: partner?.tagline || '',
    bio: partner?.bio || '',
    age: partner?.age || 24,
    gender: partner?.gender || 'Female',
    city: partner?.city || 'Delhi NCR',
    avatar: partner?.avatar || '',
    coverPhoto: partner?.coverPhoto || '',
    phone: partner?.phone || '+91 91234 56789',
    email: partner?.email || 'aanya@example.com',
    languages: partner?.languages || ['English', 'Hindi'],
    areas: partner?.areas || ['Connaught Place', 'Hauz Khas', 'Saket', 'Cyber Hub Gurgaon'],
    interests: partner?.interests || ['Coffee Tasting', 'Indie Cinema', 'Bookstores', 'Museum Walks']
  });

  const [newArea, setNewArea] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleToggleLang = (lang) => {
    setFormData(prev => {
      const exists = prev.languages.includes(lang);
      return {
        ...prev,
        languages: exists ? prev.languages.filter(l => l !== lang) : [...prev.languages, lang]
      };
    });
  };

  const handleToggleInterest = (interest) => {
    setFormData(prev => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists ? prev.interests.filter(i => i !== interest) : [...prev.interests, interest]
      };
    });
  };

  const handleAddArea = (e) => {
    e.preventDefault();
    if (!newArea.trim()) return;
    if (formData.areas.includes(newArea.trim())) return;
    setFormData(prev => ({
      ...prev,
      areas: [...prev.areas, newArea.trim()]
    }));
    setNewArea('');
  };

  const handleRemoveArea = (areaToRemove) => {
    setFormData(prev => ({
      ...prev,
      areas: prev.areas.filter(a => a !== areaToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdateProfile(formData);
      showToast('Profile information successfully saved!');
    } catch (err) {
      showToast('Failed to update profile', 'danger');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            👤 Companion Profile Management
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Ensure your profile details are accurate and inviting. Clear photos and hobbies attract genuine hirers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setPreviewOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Eye size={16} /> Profile Preview
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Photos & Media Card */}
        <div className="partner-panel">
          <div className="partner-panel-title" style={{ marginBottom: '16px' }}>
            <Camera size={18} color="#34d399" />
            <span>Profile Photo & Cover Banner</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <img
                src={formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt="Avatar Preview"
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #10b981'
                }}
              />
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                  Avatar Photo URL
                </label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  style={{ width: '100%', fontSize: '0.88rem' }}
                />
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  High-resolution headshot with a friendly smile recommended.
                </span>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                Cover Banner Photo URL
              </label>
              <input
                type="url"
                value={formData.coverPhoto}
                onChange={e => setFormData({ ...formData, coverPhoto: e.target.value })}
                placeholder="https://images.unsplash.com/cover..."
                style={{ width: '100%', fontSize: '0.88rem' }}
              />
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Displays at the top of your public profile card.
              </span>
            </div>
          </div>
        </div>

        {/* Basic Personal Information */}
        <div className="partner-panel">
          <div className="partner-panel-title" style={{ marginBottom: '16px' }}>
            <User size={18} color="#38bdf8" />
            <span>Profile Information</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                Full Display Name
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
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                Tagline / Professional Headline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="e.g. Psychology Grad • Coffee & Art Enthusiast"
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                Age
              </label>
              <input
                type="number"
                min="18"
                max="75"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                style={{ width: '100%' }}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                Primary Operating City
              </label>
              <select
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                style={{ width: '100%' }}
              >
                <option>Delhi NCR</option>
                <option>Mumbai</option>
                <option>Bangalore</option>
                <option>Pune</option>
                <option>Hyderabad</option>
                <option>Chennai</option>
                <option>Kolkata</option>
                <option>Jaipur</option>
                <option>Chandigarh</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
              About Me / Bio
            </label>
            <textarea
              rows="4"
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell clients about your personality, your conversation style, favorite hangout spots, and platonic values..."
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>
        </div>

        {/* Languages & Service Areas */}
        <div className="partner-panel">
          <div className="partner-panel-title" style={{ marginBottom: '16px' }}>
            <Languages size={18} color="#c084fc" />
            <span>Languages & Service Localities</span>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>
              Spoken Languages (Select all that apply)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {ALL_LANGUAGES.map(lang => {
                const selected = formData.languages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleToggleLang(lang)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      background: selected ? 'rgba(168, 85, 247, 0.25)' : 'rgba(15, 23, 42, 0.6)',
                      border: selected ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: selected ? '#ffffff' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    {selected && <Check size={12} />} {lang}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>
              Service Areas / Localities Covered
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {formData.areas.map(area => (
                <span
                  key={area}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <MapPin size={12} /> {area}
                  <button
                    type="button"
                    onClick={() => handleRemoveArea(area)}
                    style={{ color: '#f87171', padding: 0, display: 'flex' }}
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', maxWidth: '420px' }}>
              <input
                type="text"
                placeholder="Add locality (e.g. Indiranagar, Bandra West)..."
                value={newArea}
                onChange={e => setNewArea(e.target.value)}
                style={{ flex: 1, fontSize: '0.88rem' }}
              />
              <button
                type="button"
                onClick={handleAddArea}
                className="btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Interests & Hobbies */}
        <div className="partner-panel">
          <div className="partner-panel-title" style={{ marginBottom: '16px' }}>
            <Sparkles size={18} color="#fbbf24" />
            <span>Interests & Hangout Preferences</span>
          </div>

          <p style={{ fontSize: '0.84rem', color: '#94a3b8', marginBottom: '12px' }}>
            Clients love connecting with companions who share their interests. Select your favorite activities:
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {POPULAR_INTERESTS.map(interest => {
              const selected = formData.interests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleToggleInterest(interest)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    background: selected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                    border: selected ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                    color: selected ? '#ffffff' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {selected && <Check size={12} />} {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contact & Verification Information */}
        <div className="partner-panel">
          <div className="partner-panel-title" style={{ marginBottom: '16px' }}>
            <ShieldCheck size={18} color="#10b981" />
            <span>Contact & Verification Information</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                <Phone size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Registered Phone Number
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Only shared with confirmed hirers.</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                <Mail size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Contact Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Used for notifications and payout alerts.</span>
            </div>
          </div>
        </div>

        {/* Save button floating bar */}
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
            Changes will be reflected immediately in search directory.
          </span>
          <button
            type="submit"
            className="btn-primary"
            disabled={saving}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 28px',
              fontSize: '0.95rem'
            }}
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>

      {/* Profile Preview Modal */}
      {previewOpen && (
        <div className="partner-modal-backdrop" onClick={() => setPreviewOpen(false)}>
          <div className="partner-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="partner-modal-header">
              <div style={{ fontWeight: 700, color: '#fff' }}>Public Directory Preview</div>
              <button onClick={() => setPreviewOpen(false)} style={{ color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>

            <div className="partner-modal-body" style={{ padding: 0 }}>
              {/* Cover */}
              <div style={{
                height: '140px',
                backgroundImage: `url(${formData.coverPhoto || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(15,23,42,0.9))'
                }} />
              </div>

              {/* Card content */}
              <div style={{ padding: '0 24px 24px', marginTop: '-45px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '14px' }}>
                  <img
                    src={formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt="Preview"
                    style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #10b981',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.5)'
                    }}
                  />
                  <span className="partner-badge partner-badge-emerald">
                    ✓ Verified Companion
                  </span>
                </div>

                <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: '0 0 4px' }}>{formData.name}</h3>
                <div style={{ fontSize: '0.85rem', color: '#c084fc', marginBottom: '8px' }}>{formData.tagline}</div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <span>📍 {formData.city}</span>
                  <span>🎂 {formData.age} yrs • {formData.gender}</span>
                </div>

                <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '14px' }}>
                  "{formData.bio}"
                </p>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                    Languages
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {formData.languages.map(l => (
                      <span key={l} style={{ fontSize: '0.74rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: '#fff' }}>
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                    Service Areas
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {formData.areas.map(a => (
                      <span key={a} style={{ fontSize: '0.74rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(56,189,248,0.12)', color: '#38bdf8' }}>
                        📍 {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="partner-modal-footer">
              <button className="btn-secondary btn-sm" onClick={() => setPreviewOpen(false)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
