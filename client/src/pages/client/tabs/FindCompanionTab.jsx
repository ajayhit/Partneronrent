import React, { useState } from 'react';
import { formatCurrency } from '../../../utils/helpers';
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Filter,
  Star,
  ShieldCheck,
  Heart,
  Eye,
  Sliders,
  Sparkles,
  User,
  Check,
  ArrowRight
} from 'lucide-react';

const CITIES = [
  'All Cities', 'Delhi NCR', 'Jaipur', 'Mumbai', 'Bangalore', 'Pune', 'Hyderabad', 'Kolkata', 'Chennai', 'Chandigarh'
];

const COMPANION_SERVICES = [
  { id: 'all', name: 'All Companion Services', emoji: '✨' },
  { id: 'movie-companion', name: 'Movie Companion', emoji: '🎬' },
  { id: 'cafe-companion', name: 'Cafe / Coffee Companion', emoji: '☕' },
  { id: 'restaurant-companion', name: 'Restaurant Companion', emoji: '🍽️' },
  { id: 'shopping-companion', name: 'Shopping Companion', emoji: '🛍️' },
  { id: 'city-exploration', name: 'City Exploration', emoji: '🚶' },
  { id: 'event-companion', name: 'Event Companion', emoji: '🎭' },
  { id: 'clinic-companion', name: 'Clinic/Hospital Companion', emoji: '🏥' },
  { id: 'senior-companion', name: 'Senior Citizen Companion', emoji: '👴' },
  { id: 'conversation-companion', name: 'Conversation / Company', emoji: '💬' },
  { id: 'local-assistance', name: 'Local Assistance', emoji: '📍' }
];

export default function FindCompanionTab({
  partners = [],
  favorites = [],
  onToggleFavorite,
  onViewProfile,
  onBookPartner,
  showToast
}) {
  // Search and filter criteria
  const [city, setCity] = useState('All Cities');
  const [area, setArea] = useState('');
  const [selectedService, setSelectedService] = useState('all');
  const [date, setDate] = useState('2026-09-28');
  const [time, setTime] = useState('06:00 PM');
  const [duration, setDuration] = useState('3 Hours');
  const [maxPrice, setMaxPrice] = useState(2500);
  const [gender, setGender] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [onlyVerified, setOnlyVerified] = useState(true);
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filter partners
  const filteredPartners = partners.filter(p => {
    // City filter
    if (city !== 'All Cities' && p.city?.toLowerCase() !== city.toLowerCase()) return false;

    // Area filter
    if (area.trim() && !p.areas?.some(a => a.toLowerCase().includes(area.toLowerCase()))) return false;

    // Service filter
    if (selectedService !== 'all') {
      const hasService = p.services?.some(s => s.serviceId === selectedService) ||
        (selectedService === 'movie-companion' && p.hourlyRate) ||
        (selectedService === 'cafe-companion');
      if (!hasService) return false;
    }

    // Max Price
    if (p.hourlyRate && p.hourlyRate > maxPrice) return false;

    // Gender
    if (gender !== 'all' && p.gender?.toLowerCase() !== gender.toLowerCase()) return false;

    // Language
    if (selectedLanguage !== 'all' && !p.languages?.includes(selectedLanguage)) return false;

    // Rating
    if (minRating > 0 && (p.rating || 5) < minRating) return false;

    // Verified
    if (onlyVerified && p.kycStatus !== 'verified') return false;

    // Online
    if (onlyOnline && !p.isOnline) return false;

    // Search Keyword
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchBio = p.bio?.toLowerCase().includes(q);
      const matchTag = p.tagline?.toLowerCase().includes(q);
      const matchAreas = p.areas?.some(a => a.toLowerCase().includes(q));
      if (!matchName && !matchBio && !matchTag && !matchAreas) return false;
    }

    return true;
  });

  return (
    <div>
      <div style={{ marginBottom: '22px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
          🔎 Find Your Ideal Companion
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
          Browse verified companions across India for movies, dining, coffee chats, and city tours.
        </p>
      </div>

      {/* Main Search Panel (Exact layout requested in user prompt!) */}
      <div className="client-panel" style={{
        background: 'linear-gradient(135deg, rgba(20, 28, 46, 0.9) 0%, rgba(15, 22, 38, 0.95) 100%)',
        border: '1px solid rgba(236, 72, 153, 0.3)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
        marginBottom: '26px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', alignItems: 'flex-end' }}>
          {/* City */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
              City
            </label>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              style={{ width: '100%', fontSize: '0.9rem' }}
            >
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Service */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
              Service
            </label>
            <select
              value={selectedService}
              onChange={e => setSelectedService(e.target.value)}
              style={{ width: '100%', fontSize: '0.9rem' }}
            >
              {COMPANION_SERVICES.map(s => (
                <option key={s.id} value={s.id}>{s.emoji} {s.name}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{ width: '100%', fontSize: '0.9rem' }}
            />
          </div>

          {/* Time */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
              Time
            </label>
            <select
              value={time}
              onChange={e => setTime(e.target.value)}
              style={{ width: '100%', fontSize: '0.9rem' }}
            >
              <option>10:00 AM</option>
              <option>12:00 PM</option>
              <option>02:00 PM</option>
              <option>04:00 PM</option>
              <option>06:00 PM</option>
              <option>08:00 PM</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
              Duration
            </label>
            <select
              value={duration}
              onChange={e => setDuration(e.target.value)}
              style={{ width: '100%', fontSize: '0.9rem' }}
            >
              <option>1 Hour</option>
              <option>2 Hours</option>
              <option>3 Hours</option>
              <option>4 Hours</option>
              <option>6 Hours</option>
            </select>
          </div>

          {/* Search Trigger Button */}
          <div>
            <button
              type="button"
              className="btn-primary"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                height: '42px'
              }}
            >
              <Search size={16} /> Search Companions
            </button>
          </div>
        </div>

        {/* Toggle Advanced Filters */}
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            style={{
              color: '#38bdf8',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Sliders size={14} />
            <span>{showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters (Price, Area, Gender, Rating)'}</span>
          </button>

          <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Showing <strong>{filteredPartners.length}</strong> available companion profiles
          </span>
        </div>

        {/* Advanced Filters Expandable Section */}
        {showAdvancedFilters && (
          <div style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {/* Area */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                Locality / Area
              </label>
              <input
                type="text"
                placeholder="e.g. Cyber Hub, Bandra, C-Scheme"
                value={area}
                onChange={e => setArea(e.target.value)}
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>

            {/* Max Price Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600 }}>Max Hourly Rate:</span>
                <strong style={{ color: '#34d399' }}>{formatCurrency(maxPrice)}/hr</strong>
              </div>
              <input
                type="range"
                min="400"
                max="3000"
                step="100"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ec4899' }}
              />
            </div>

            {/* Gender */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                Gender
              </label>
              <select value={gender} onChange={e => setGender(e.target.value)} style={{ width: '100%' }}>
                <option value="all">Any Gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>

            {/* Minimum Rating */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>
                Minimum Rating
              </label>
              <select value={minRating} onChange={e => setMinRating(Number(e.target.value))} style={{ width: '100%' }}>
                <option value="0">All Ratings</option>
                <option value="4.5">4.5★ and above</option>
                <option value="4.8">4.8★ Top Rated</option>
              </select>
            </div>

            {/* Verified and Online checkboxes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#cbd5e1' }}>
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={e => setOnlyVerified(e.target.checked)}
                  style={{ accentColor: '#10b981' }}
                />
                <span>✓ Verified Partners Only</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: '#cbd5e1' }}>
                <input
                  type="checkbox"
                  checked={onlyOnline}
                  onChange={e => setOnlyOnline(e.target.checked)}
                  style={{ accentColor: '#38bdf8' }}
                />
                <span>Online & Available Now</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Companion Results Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {filteredPartners.length === 0 ? (
          <div className="client-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
            <Search size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <h4 style={{ color: '#94a3b8', fontSize: '1.05rem', margin: '0 0 6px' }}>No companions match your search</h4>
            <p style={{ fontSize: '0.85rem', margin: 0 }}>
              Try adjusting your city, service, or price filters to see more verified companions.
            </p>
          </div>
        ) : (
          filteredPartners.map(partner => {
            const isFav = favorites.some(f => f.id === partner.id);
            const rate = partner.hourlyRate || 500;
            const rating = partner.rating || 4.8;
            const reviewCount = partner.reviewCount || 126;

            return (
              <div key={partner.id} className="companion-card">
                {/* Image & Badges Container */}
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img
                    src={partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={partner.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Gradient shadow overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(13, 17, 29, 0.95) 0%, transparent 60%)'
                  }} />

                  {/* Verified Badge */}
                  {partner.kycStatus === 'verified' && (
                    <div style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: 'rgba(16, 185, 129, 0.9)',
                      color: '#ffffff',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <ShieldCheck size={12} /> Verified
                    </div>
                  )}

                  {/* Favorite Heart Button */}
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(partner)}
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: isFav ? '#f43f5e' : '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                    }}
                  >
                    <Heart size={16} fill={isFav ? '#f43f5e' : 'none'} />
                  </button>

                  {/* Bottom Image Overlay Info */}
                  <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                          {partner.name}
                        </h3>
                        <div style={{ fontSize: '0.78rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <MapPin size={12} /> {partner.city || 'Jaipur'}
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(0, 0, 0, 0.6)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        color: '#fbbf24',
                        fontWeight: 700,
                        fontSize: '0.8rem'
                      }}>
                        <Star size={13} fill="#fbbf24" /> {rating} ({reviewCount})
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    {/* Services Chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                      <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(236, 72, 153, 0.12)', color: '#f472b6', fontWeight: 600 }}>
                        🎬 Movie
                      </span>
                      <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', fontWeight: 600 }}>
                        ☕ Cafe
                      </span>
                      <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(168, 85, 247, 0.12)', color: '#c084fc', fontWeight: 600 }}>
                        🛍️ Shop
                      </span>
                      {partner.services?.length > 3 && (
                        <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8' }}>
                          +{partner.services.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Tagline / Bio preview */}
                    <p style={{
                      fontSize: '0.8rem',
                      color: '#cbd5e1',
                      margin: '0 0 14px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: '1.4'
                    }}>
                      {partner.tagline || partner.bio || 'Warm listener, coffee enthusiast, and respectful platonic companion.'}
                    </p>
                  </div>

                  <div>
                    {/* Hourly Price */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '10px' }}>
                      <span style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                        Hourly Rate
                      </span>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>
                        {formatCurrency(rate)} <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>/ hour</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn-secondary btn-sm"
                        onClick={() => onViewProfile(partner)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                      >
                        <Eye size={13} /> View Profile
                      </button>
                      <button
                        type="button"
                        className="btn-primary btn-sm"
                        onClick={() => onBookPartner(partner)}
                        style={{
                          background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        Book Now <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
