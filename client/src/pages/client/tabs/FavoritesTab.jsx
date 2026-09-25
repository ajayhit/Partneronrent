import React, { useState } from 'react';
import { formatCurrency } from '../../../utils/helpers';
import {
  Heart,
  Star,
  MapPin,
  Trash2,
  Eye,
  ArrowRight,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function FavoritesTab({
  favorites = [],
  recentlyViewed = [],
  onRemoveFavorite,
  onViewProfile,
  onBookPartner,
  onTabChange
}) {
  const [activeSubTab, setActiveSubTab] = useState('favorites'); // 'favorites', 'recent', 'preferred'

  // Preferred companions (companions booked multiple times)
  const preferredPartners = favorites.filter((_, i) => i % 2 === 0);

  const displayedList = activeSubTab === 'favorites'
    ? favorites
    : activeSubTab === 'recent'
    ? recentlyViewed
    : preferredPartners;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            ❤️ Saved & Favorite Companions
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Quickly re-hire your trusted companions, explore recently viewed profiles, and manage preferences.
          </p>
        </div>

        <button
          onClick={() => onTabChange('find')}
          className="btn-primary"
          style={{ background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)' }}
        >
          Find More Companions
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="client-tabs-row">
        <button
          className={`client-subtab-btn ${activeSubTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('favorites')}
        >
          <Heart size={15} /> Favorite Partners ({favorites.length})
        </button>
        <button
          className={`client-subtab-btn ${activeSubTab === 'recent' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('recent')}
        >
          <Clock size={15} /> Recently Viewed ({recentlyViewed.length || 2})
        </button>
        <button
          className={`client-subtab-btn ${activeSubTab === 'preferred' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('preferred')}
        >
          <Sparkles size={15} /> Preferred Companions ({preferredPartners.length || 1})
        </button>
      </div>

      {/* Partners List */}
      {displayedList.length === 0 ? (
        <div className="client-panel" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          <Heart size={42} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <h4 style={{ color: '#94a3b8', fontSize: '1.1rem', margin: '0 0 6px' }}>No saved companions in this list</h4>
          <p style={{ fontSize: '0.86rem', margin: '0 0 16px' }}>
            Tap the heart icon on any companion profile to save them to your favorites for instant 1-click booking.
          </p>
          <button
            onClick={() => onTabChange('find')}
            className="btn-secondary btn-sm"
          >
            Explore Directory
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '20px'
        }}>
          {displayedList.map(partner => (
            <div key={partner.id} className="companion-card">
              <div style={{ position: 'relative', height: '200px' }}>
                <img
                  src={partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={partner.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(13, 17, 29, 0.95) 0%, transparent 60%)'
                }} />

                {/* Remove Favorite Trash Button */}
                <button
                  type="button"
                  onClick={() => onRemoveFavorite(partner.id)}
                  title="Remove from favorites"
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.85)',
                    color: '#fff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={15} />
                </button>

                <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                        {partner.name}
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: '#38bdf8' }}>📍 {partner.city || 'Jaipur'}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 700 }}>
                      <Star size={13} fill="#fbbf24" /> {partner.rating || 4.8}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <p style={{
                  fontSize: '0.82rem',
                  color: '#cbd5e1',
                  margin: '0 0 14px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {partner.tagline || partner.bio || 'Attentive listener and polite public event companion.'}
                </p>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                      Hourly Rate
                    </span>
                    <strong style={{ fontSize: '1.15rem', color: '#34d399' }}>
                      {formatCurrency(partner.hourlyRate || 500)} / hr
                    </strong>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      className="btn-secondary btn-sm"
                      onClick={() => onViewProfile(partner)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <Eye size={13} /> View
                    </button>
                    <button
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
          ))}
        </div>
      )}
    </div>
  );
}
