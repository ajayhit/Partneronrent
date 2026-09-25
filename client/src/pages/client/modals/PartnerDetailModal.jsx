import React from 'react';
import { formatCurrency } from '../../../utils/helpers';
import {
  X,
  Star,
  ShieldCheck,
  Heart,
  MapPin,
  Languages,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flag,
  ArrowRight
} from 'lucide-react';

export default function PartnerDetailModal({
  partner,
  isOpen,
  onClose,
  isFavorite = false,
  onToggleFavorite,
  onBookNow,
  onReport
}) {
  if (!isOpen || !partner) return null;

  const rate = partner.hourlyRate || 500;
  const rating = partner.rating || 4.8;
  const reviewCount = partner.reviewCount || 126;
  const completedHours = partner.completedHours || 128;

  return (
    <div className="client-modal-backdrop" onClick={onClose}>
      <div className="client-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px', padding: 0, overflow: 'hidden' }}>
        
        {/* Cover Photo & Header */}
        <div style={{
          height: '180px',
          backgroundImage: `url(${partner.coverPhoto || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(20, 28, 46, 0.95) 100%)'
          }} />

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile Header Details */}
        <div style={{ padding: '0 28px', marginTop: '-55px', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
              <img
                src={partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={partner.name}
                style={{
                  width: '94px',
                  height: '94px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid #141c2e',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                }}
              />
              <div style={{ paddingBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    {partner.name}
                  </h2>
                  {partner.kycStatus === 'verified' && (
                    <span className="client-badge client-badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <ShieldCheck size={12} /> Verified
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.84rem', color: '#f472b6', fontWeight: 600, marginTop: '2px' }}>
                  {partner.tagline || 'Companionship Specialist • Warm Listener'}
                </div>
              </div>
            </div>

            {/* Price & Rating Capsule */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>
                {formatCurrency(rate)} <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>/ hour</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 700, justifyContent: 'flex-end', marginTop: '2px' }}>
                <Star size={14} fill="#fbbf24" /> {rating} ({reviewCount} reviews)
              </div>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '10px',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            marginBottom: '18px',
            fontSize: '0.8rem'
          }}>
            <div>
              <span style={{ color: '#94a3b8', display: 'block' }}>Location</span>
              <strong style={{ color: '#fff' }}>📍 {partner.city || 'Jaipur'}</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8', display: 'block' }}>Min Booking</span>
              <strong style={{ color: '#fff' }}>⏱️ 2 Hours</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8', display: 'block' }}>Completed</span>
              <strong style={{ color: '#fff' }}>🤝 {completedHours} Hours</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8', display: 'block' }}>Availability</span>
              <strong style={{ color: '#34d399' }}>● Available Today</strong>
            </div>
          </div>

          {/* About Bio */}
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '6px' }}>About Me</h4>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6', margin: 0 }}>
              {partner.bio || 'Hi! I am a warm, polite and attentive listener. I believe in meaningful companionship and exploring cities together. Looking forward to our safe platonic session!'}
            </p>
          </div>

          {/* Languages Spoken */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Languages size={15} color="#c084fc" /> Languages Spoken
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {(partner.languages || ['English', 'Hindi']).map(lang => (
                <span key={lang} style={{ fontSize: '0.76rem', padding: '3px 10px', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Services Provided */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff', marginBottom: '6px' }}>Services Provided</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['🎬 Movie Companion', '☕ Cafe / Coffee Companion', '🍽️ Restaurant Companion', '🛍️ Shopping Companion', '🚶 City Exploration'].map(s => (
                <span key={s} style={{ fontSize: '0.76rem', padding: '4px 10px', borderRadius: '6px', background: 'rgba(236, 72, 153, 0.12)', color: '#f472b6', fontWeight: 600 }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Service Areas */}
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={15} color="#38bdf8" /> Service Localities Covered
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {(partner.areas || ['Bandra West', 'Juhu', 'Colaba', 'Cyber Hub', 'Connaught Place']).map(a => (
                <span key={a} style={{ fontSize: '0.76rem', padding: '3px 10px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8' }}>
                  📍 {a}
                </span>
              ))}
            </div>
          </div>

          {/* Safety Information Box */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '0.8rem',
            color: '#cbd5e1',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <ShieldCheck size={22} color="#10b981" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ color: '#fff' }}>Verified Platonic Escrow:</strong> Aadhaar ID verified, police check clear, and protected under PartnerOnRent strict public safety policy.
            </div>
          </div>
        </div>

        {/* Modal Footer Actions: Book Now | Favorite | Report */}
        <div className="client-modal-footer" style={{ padding: '16px 28px', background: 'rgba(15, 22, 38, 0.8)', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => onToggleFavorite(partner)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isFavorite ? '#f43f5e' : '#cbd5e1' }}
            >
              <Heart size={15} fill={isFavorite ? '#f43f5e' : 'none'} />
              <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
            </button>

            <button
              type="button"
              className="btn-secondary btn-sm"
              onClick={() => onReport(partner)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f87171' }}
            >
              <Flag size={14} /> Report
            </button>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              onClose();
              onBookNow(partner);
            }}
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)',
              padding: '10px 24px',
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Book Now <ArrowRight size={15} />
          </button>
        </div>

      </div>
    </div>
  );
}
