import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchPartners } from '../utils/api';
import { formatCurrency } from '../utils/helpers';
import SafetyBanner from '../components/SafetyBanner';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Filter, 
  Globe, 
  Heart, 
  Calendar,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';

export default function PartnerDirectory({ onSelectPartner, setActivePage }) {
  const { services, settings, openBookingModal } = useApp();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxRate, setMaxRate] = useState(2500);
  const [onlyOnline, setOnlyOnline] = useState(false);

  useEffect(() => {
    loadPartners();
  }, [cityFilter, serviceFilter, genderFilter, searchQuery, maxRate, onlyOnline]);

  const loadPartners = async () => {
    setLoading(true);
    try {
      const params = {};
      if (cityFilter !== 'All Cities') params.city = cityFilter;
      if (serviceFilter !== 'all') params.service = serviceFilter;
      if (genderFilter !== 'all') params.gender = genderFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (maxRate < 2500) params.maxRate = maxRate;
      if (onlyOnline) params.onlyOnline = 'true';

      const data = await fetchPartners(params);
      setPartners(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      
      {/* Page Title */}
      <div style={{ padding: '20px 0 10px' }}>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>
          Find a <span className="gradient-text">Verified Companion</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
          Browse trusted companions across 20+ cities in India for cafe visits, movies, shopping, and everyday activities.
        </p>
      </div>

      <SafetyBanner />

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <SlidersHorizontal size={18} color="#c084fc" />
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Filters & Search</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          
          {/* Keyword Search */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
              Search Name or Interest
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text"
                placeholder="e.g. Aanya, books, fitness..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', paddingLeft: '34px' }}
              />
              <Search size={16} color="#64748b" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* City */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
              City
            </label>
            <select 
              value={cityFilter}
              onChange={e => setCityFilter(e.target.value)}
              style={{ width: '100%' }}
            >
              <option>All Cities</option>
              {settings.cities?.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Service */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
              Service Activity
            </label>
            <select 
              value={serviceFilter}
              onChange={e => setServiceFilter(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="all">All Activities</option>
              {services?.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
              Companion Gender
            </label>
            <select 
              value={genderFilter}
              onChange={e => setGenderFilter(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="all">All Genders</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>

          {/* Max Rate Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
              <span>Max Budget:</span>
              <strong style={{ color: '#ec4899' }}>{formatCurrency(maxRate)}/hr</strong>
            </div>
            <input 
              type="range"
              min="1000"
              max="2500"
              step="100"
              value={maxRate}
              onChange={e => setMaxRate(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#ec4899', cursor: 'pointer', marginTop: '6px' }}
            />
          </div>

        </div>

        {/* Quick Toggles */}
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
            <input 
              type="checkbox"
              checked={onlyOnline}
              onChange={e => setOnlyOnline(e.target.checked)}
              style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
            />
            <span style={{ color: '#cbd5e1' }}>Available Online Right Now</span>
          </label>

          <span style={{ color: '#64748b', fontSize: '0.82rem' }}>
            Found {partners.length} verified companion{partners.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          Finding verified companions...
        </div>
      ) : partners.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No companions found</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 20px' }}>
            Try expanding your city, adjusting the hourly budget slider, or selecting "All Activities".
          </p>
          <button 
            className="btn-secondary"
            onClick={() => {
              setCityFilter('All Cities');
              setServiceFilter('all');
              setGenderFilter('all');
              setMaxRate(2500);
              setSearchQuery('');
              setOnlyOnline(false);
            }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {partners.map(partner => (
            <div 
              key={partner.id}
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
            >
              {/* Image Banner */}
              <div style={{ position: 'relative', height: '240px', width: '100%', overflow: 'hidden' }}>
                <img 
                  src={partner.avatar} 
                  alt={partner.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(15, 23, 42, 0.9) 100%)'
                }} />

                <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                  <span className="badge badge-verified">
                    <ShieldCheck size={13} /> {partner.badge || 'Verified'}
                  </span>
                </div>

                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  {partner.isOnline ? (
                    <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.9)', color: '#fff' }}>
                      <span className="badge-online" style={{ background: '#fff' }}></span> Online
                    </span>
                  ) : (
                    <span className="badge" style={{ background: 'rgba(100, 116, 139, 0.6)', color: '#cbd5e1' }}>
                      Offline
                    </span>
                  )}
                </div>

                <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}>
                      {partner.name}, {partner.age}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1', fontSize: '0.82rem' }}>
                      <MapPin size={13} color="#ec4899" /> {partner.city}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>Starting at</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ec4899' }}>
                      {formatCurrency(partner.hourlyRate)}<span style={{ fontSize: '0.75rem', fontWeight: 400 }}>/hr</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#c084fc', marginBottom: '8px' }}>
                    {partner.tagline}
                  </div>

                  <p style={{
                    color: '#94a3b8',
                    fontSize: '0.84rem',
                    lineHeight: '1.5',
                    marginBottom: '14px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {partner.bio}
                  </p>

                  {/* Languages & Areas */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {partner.languages?.map(lang => (
                      <span key={lang} style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-full)',
                        padding: '3px 8px',
                        fontSize: '0.72rem',
                        color: '#cbd5e1'
                      }}>
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Rating & completed stats */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderTop: '1px solid var(--border-subtle)',
                    marginBottom: '14px',
                    fontSize: '0.82rem'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontWeight: 700 }}>
                      <Star size={14} fill="#fbbf24" /> {partner.rating || 'New'} ({partner.reviewCount} reviews)
                    </span>
                    <span style={{ color: '#94a3b8' }}>
                      {partner.completedHours}h completed
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      className="btn-secondary"
                      onClick={() => {
                        if (onSelectPartner) onSelectPartner(partner);
                        setActivePage('partner-detail');
                      }}
                      style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                    >
                      View Profile
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={() => openBookingModal(partner)}
                      style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
                    >
                      Hire Hourly
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
