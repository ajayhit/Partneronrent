import React, { useEffect, useState } from 'react';
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
  Save,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';

const POPULAR_LANGUAGES = [
  'English', 'Hindi', 'Bengali', 'Marathi', 'Tamil', 'Telugu', 'Gujarati', 'Punjabi', 'Kannada', 'Malayalam'
];

const POPULAR_INTERESTS = [
  'Coffee Tasting', 'Art Galleries', 'Indie Cinema', 'Bookstores', 'Live Concerts',
  'Street Food Tours', 'Museum Walks', 'Board Games', 'Gym & Fitness', 'Tech & Startups',
  'Yoga & Mindfulness', 'Fashion Shopping', 'Standup Comedy', 'Heritage Walks'
];

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80';

function getProfileAvatar(partner) {
  if (partner?.avatar && partner.avatar !== '/default-avatar.jpg') return partner.avatar;
  return partner?.kycDocuments?.selfieDoc || partner?.avatar || DEFAULT_AVATAR;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`Unable to read ${file.name}`));
    reader.readAsDataURL(file);
  });
}

function calculateAge(dobString) {
  if (!dobString) return '';
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return '';
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : '';
}

export default function ProfileTab({ partner, onUpdateProfile, onTabChange, showToast }) {
  const [formData, setFormData] = useState({
    name: partner?.name || '',
    avatar: getProfileAvatar(partner),
    coverPhoto: partner?.coverPhoto || '',
    mobile: partner?.phone || partner?.mobile || '',
    email: partner?.email || '',
    dob: partner?.dob || '',
    age: partner?.age || calculateAge(partner?.dob) || '',
    gender: partner?.gender || 'Female',
    city: partner?.city || 'Delhi NCR',
    address: partner?.address || '',
    emergencyContact: partner?.emergencyContact || '',
    preferredLanguages: partner?.preferredLanguages || partner?.languages || ['English', 'Hindi'],
    tagline: partner?.tagline || '',
    bio: partner?.bio || '',
    areas: partner?.areas || [],
    interests: partner?.interests || []
  });

  const [newArea, setNewArea] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!partner?.id) return;
    setFormData(prev => ({
      name: prev.name || partner?.name || '',
      avatar: prev.avatar || getProfileAvatar(partner),
      coverPhoto: prev.coverPhoto || partner?.coverPhoto || '',
      mobile: prev.mobile || partner?.phone || partner?.mobile || '',
      email: prev.email || partner?.email || '',
      dob: prev.dob || partner?.dob || '',
      age: prev.age || partner?.age || calculateAge(partner?.dob) || '',
      gender: prev.gender || partner?.gender || 'Female',
      city: prev.city || partner?.city || 'Delhi NCR',
      address: prev.address || partner?.address || '',
      emergencyContact: prev.emergencyContact || partner?.emergencyContact || '',
      preferredLanguages: prev.preferredLanguages?.length ? prev.preferredLanguages : (partner?.preferredLanguages || partner?.languages || ['English', 'Hindi']),
      tagline: prev.tagline || partner?.tagline || '',
      bio: prev.bio || partner?.bio || '',
      areas: prev.areas?.length ? prev.areas : (partner?.areas || []),
      interests: prev.interests?.length ? prev.interests : (partner?.interests || [])
    }));
  }, [partner?.id]);

  const toggleLanguage = (lang) => {
    setFormData(prev => {
      const exists = prev.preferredLanguages.includes(lang);
      const updated = exists ? prev.preferredLanguages.filter(l => l !== lang) : [...prev.preferredLanguages, lang];
      return {
        ...prev,
        preferredLanguages: updated
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

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Choose an image file for your profile photo.', 'warning');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Profile photos must be 5 MB or smaller.', 'warning');
      event.target.value = '';
      return;
    }

    try {
      const avatar = await fileToDataUrl(file);
      setFormData(prev => ({ ...prev, avatar }));
    } catch (error) {
      console.error('Failed to load profile photo:', error);
      showToast(error.message, 'danger');
    }
  };

  const handleCoverChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Choose an image file for your cover banner.', 'warning');
      event.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Cover photo must be 5 MB or smaller.', 'warning');
      event.target.value = '';
      return;
    }

    try {
      const coverPhoto = await fileToDataUrl(file);
      setFormData(prev => ({ ...prev, coverPhoto }));
    } catch (error) {
      console.error('Failed to load cover banner:', error);
      showToast(error.message, 'danger');
    }
  };

  const handleDobChange = (e) => {
    const newDob = e.target.value;
    const computedAge = calculateAge(newDob);
    setFormData(prev => ({
      ...prev,
      dob: newDob,
      age: computedAge !== '' ? computedAge : prev.age
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (!onUpdateProfile) throw new Error('Profile saving is unavailable. Please try again later.');
      await onUpdateProfile({
        name: formData.name.trim(),
        avatar: formData.avatar,
        coverPhoto: formData.coverPhoto,
        phone: formData.mobile.trim(),
        mobile: formData.mobile.trim(),
        dob: formData.dob,
        age: formData.age || calculateAge(formData.dob),
        gender: formData.gender,
        city: formData.city,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        preferredLanguages: formData.preferredLanguages,
        languages: formData.preferredLanguages,
        tagline: formData.tagline?.trim(),
        bio: formData.bio?.trim(),
        areas: formData.areas,
        interests: formData.interests
      });
      showToast('Profile information successfully saved!');
    } catch (error) {
      console.error('Failed to save companion profile:', error);
      showToast(error.message || 'Failed to save profile. Please try again.', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const isVerified = partner?.kycStatus === 'verified';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            👤 My Personal Profile & Verification
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Keep your contact information up to date for booking confirmations and emergency safety alerts.
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

      {/* KYC Rejection Notice */}
      {partner?.kycStatus === 'rejected' && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid #ef4444',
          borderRadius: '14px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <div>
            <div style={{ fontWeight: 800, color: '#f87171', fontSize: '0.96rem' }}>
              ⚠️ Verification Application Rejected by Administrator
            </div>
            <div style={{ color: '#cbd5e1', fontSize: '0.84rem', marginTop: '4px' }}>
              Reason: <strong style={{ color: '#fff' }}>"{partner?.kycRejectionReason || partner?.kycDocuments?.rejectionReason || 'Please review your documents and profile details.'}"</strong>
            </div>
          </div>
          {onTabChange && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => onTabChange('kyc')}
              style={{ background: '#ef4444', padding: '8px 18px', fontSize: '0.82rem', fontWeight: 700 }}
            >
              Update &amp; Re-Submit Application →
            </button>
          )}
        </div>
      )}

      {/* Verification Status Banner (Hirer-Style) */}
      {isVerified ? (
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
                Account Verification: VERIFIED COMPANION
              </div>
              <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                Aadhaar e-KYC and background verification cleared. Active for hirer bookings across all partner cities.
              </div>
            </div>
          </div>
          <span className="partner-badge partner-badge-emerald">Tier 1 Companion Clearance</span>
        </div>
      ) : partner?.kycStatus !== 'rejected' && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid #f59e0b',
          borderRadius: '14px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={28} color="#f59e0b" />
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.96rem' }}>
                Account Verification: PENDING VERIFICATION
              </div>
              <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                Complete your profile details and submit government KYC documents to activate priority booking.
              </div>
            </div>
          </div>
          {onTabChange && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onTabChange('kyc')}
              style={{ padding: '6px 14px', fontSize: '0.82rem', fontWeight: 700 }}
            >
              Go to KYC Verification →
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Profile Photo & Avatar Card (Identical file upload to Hirer) */}
        <div className="partner-panel" style={{ marginBottom: '20px' }}>
          <div className="partner-panel-title" style={{ marginBottom: '16px' }}>
            <Camera size={18} color="#ec4899" />
            <span>Profile Photo & Avatar</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <img
              src={formData.avatar}
              alt={formData.name || 'Partner Avatar'}
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #ec4899',
                boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
              }}
            />
            <div style={{ flex: 1, minWidth: '240px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                Upload a new profile photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ width: '100%', fontSize: '0.86rem' }}
              />
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                A clear face photo helps your hirer recognize you. Maximum file size: 5 MB.
              </span>
            </div>
          </div>
        </div>

        {/* Personal Details Grid (Identical fields & layout to Hirer) */}
        <div className="partner-panel" style={{ marginBottom: '20px' }}>
          <div className="partner-panel-title" style={{ marginBottom: '16px' }}>
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
                readOnly
                required
                style={{ width: '100%', opacity: 0.7, cursor: 'not-allowed', background: 'rgba(255,255,255,0.04)' }}
              />
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Your registered account email cannot be changed here.</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dob}
                onChange={handleDobChange}
                max={new Date().toISOString().slice(0, 10)}
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
                <option value="Female">Female</option>
                <option value="Male">Male</option>
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
                <option>Chennai</option>
                <option>Kolkata</option>
                <option>Chandigarh</option>
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
              placeholder="e.g. Flat 402, Sunrise Towers, Indiranagar..."
              style={{ width: '100%', fontSize: '0.85rem' }}
            />
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Used only for KYC compliance. Never shared with hirers.</span>
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

        {/* Preferred Communication Languages (Hirer-Style Pills) */}
        <div className="partner-panel" style={{ marginBottom: '20px' }}>
          <div className="partner-panel-title" style={{ marginBottom: '14px' }}>
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

        {/* Companion Public Showcase Card */}
        <div className="partner-panel" style={{ marginBottom: '24px' }}>
          <div className="partner-panel-title" style={{ marginBottom: '16px' }}>
            <Sparkles size={18} color="#fbbf24" />
            <span>Public Companion Showcase & Hangout Preferences</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                Tagline / Professional Headline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="e.g. Psychology Grad • Coffee & Art Enthusiast"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                Cover Banner Photo
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  style={{ flex: 1, fontSize: '0.86rem' }}
                />
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Appears at the top of your public profile directory card.</span>
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
              About Me / Bio
            </label>
            <textarea
              rows="3"
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell hirers about your personality, your conversation style, favorite hangout spots, and platonic values..."
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>

          {/* Service Areas */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>
              Service Areas / Localities Covered
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
              {formData.areas.map(area => (
                <span
                  key={area}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '8px',
                    background: 'rgba(56, 189, 248, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    fontSize: '0.82rem',
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
                placeholder="Add locality (e.g. Indiranagar, Connaught Place)..."
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

          {/* Interests & Hangout Preferences */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>
              Interests &amp; Hangout Preferences
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {POPULAR_INTERESTS.map(interest => {
                const selected = formData.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleToggleInterest(interest)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      background: selected ? 'rgba(245, 158, 11, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                      border: selected ? '1px solid #fbbf24' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: selected ? '#ffffff' : '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {selected && <Check size={12} />} {interest}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Save button matching Hirer */}
        <div style={{ textAlign: 'right', marginBottom: '30px' }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={saving}
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)',
              padding: '12px 32px',
              fontSize: '0.95rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Save size={16} /> {saving ? 'Saving Profile...' : 'Save Profile Changes'}
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
                    src={formData.avatar}
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
                  <span className={`partner-badge ${isVerified ? 'partner-badge-emerald' : 'partner-badge-amber'}`}>
                    {isVerified ? '✓ Verified Companion' : 'Pending Verification'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: '0 0 4px' }}>{formData.name || 'Your Name'}</h3>
                {formData.tagline && (
                  <div style={{ fontSize: '0.85rem', color: '#c084fc', marginBottom: '8px' }}>{formData.tagline}</div>
                )}
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span>📍 {formData.city}</span>
                  <span>🎂 {formData.age || calculateAge(formData.dob) || '24'} yrs • {formData.gender}</span>
                </div>

                {formData.bio && (
                  <p style={{ fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '14px' }}>
                    "{formData.bio}"
                  </p>
                )}

                {formData.preferredLanguages.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                      Languages
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {formData.preferredLanguages.map(l => (
                        <span key={l} style={{ fontSize: '0.74rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: '#fff' }}>
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {formData.areas.length > 0 && (
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
                )}
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
