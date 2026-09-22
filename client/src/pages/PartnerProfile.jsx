import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { fetchPartnerById } from '../utils/api';
import { formatCurrency } from '../utils/helpers';
import SafetyBanner from '../components/SafetyBanner';
import { 
  MapPin, 
  ShieldCheck, 
  Star, 
  Calendar, 
  Clock, 
  Globe, 
  CheckCircle2, 
  ArrowLeft,
  Share2,
  Heart,
  MessageSquare
} from 'lucide-react';

export default function PartnerProfile({ partnerId, partnerObj, onBack, setActivePage }) {
  const { services, openBookingModal } = useApp();
  const [partner, setPartner] = useState(partnerObj || null);
  const [loading, setLoading] = useState(!partnerObj);

  useEffect(() => {
    if (partnerId && (!partnerObj || partnerObj.id !== partnerId)) {
      loadDetails();
    }
  }, [partnerId]);

  const loadDetails = async () => {
    setLoading(true);
    try {
      const data = await fetchPartnerById(partnerId);
      setPartner(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: '#94a3b8' }}>
        Loading verified companion profile...
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h3>Partner not found</h3>
        <button className="btn-secondary" onClick={onBack} style={{ marginTop: '16px' }}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '70px' }}>
      
      {/* Back button */}
      <div style={{ padding: '16px 0 20px' }}>
        <button 
          onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.9rem', fontWeight: 600 }}
        >
          <ArrowLeft size={18} /> Back to Directory
        </button>
      </div>

      {/* Hero Profile Banner */}
      <div className="glass-panel" style={{ overflow: 'hidden', marginBottom: '30px' }}>
        <div style={{
          height: '240px',
          backgroundImage: `url(${partner.coverPhoto || partner.avatar})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.95) 100%)' }} />
        </div>

        <div style={{ padding: '0 30px 30px', position: 'relative', marginTop: '-60px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px' }}>
            
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src={partner.avatar} 
                  alt={partner.name}
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '24px',
                    border: '4px solid #1e293b',
                    objectFit: 'cover',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                />
                {partner.isOnline && (
                  <span 
                    className="badge-online" 
                    style={{ position: 'absolute', bottom: '8px', right: '8px', width: '16px', height: '16px', border: '3px solid #1e293b' }}
                  />
                )}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '2rem' }}>{partner.name}, {partner.age}</h1>
                  <span className="badge badge-verified">
                    <ShieldCheck size={14} /> {partner.badge || 'Verified Partner'}
                  </span>
                  {partner.isOnline && (
                    <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                      Online Now
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#cbd5e1', fontSize: '0.88rem', marginTop: '4px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={15} color="#ec4899" /> {partner.city}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontWeight: 700 }}>
                    <Star size={15} fill="#fbbf24" /> {partner.rating} ({partner.reviewCount} reviews)
                  </span>
                  <span style={{ color: '#94a3b8' }}>
                    {partner.completedHours} hours completed
                  </span>
                </div>
              </div>
            </div>

            <button 
              className="btn-primary"
              onClick={() => openBookingModal(partner)}
              style={{ padding: '14px 28px', fontSize: '1rem' }}
            >
              Hire Hourly from {formatCurrency(partner.hourlyRate)}/hr
            </button>

          </div>
        </div>
      </div>

      <SafetyBanner />

      {/* Main Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }} className="profile-grid">
        
        {/* Left Column: Bio, Services, Areas, Reviews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
          
          {/* About & Bio */}
          <div className="glass-panel" style={{ padding: '26px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>About {partner.name}</h3>
            <p style={{ color: '#c084fc', fontWeight: 600, fontSize: '0.95rem', marginBottom: '12px' }}>
              "{partner.tagline}"
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
              {partner.bio}
            </p>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Languages</span>
                <strong style={{ fontSize: '0.9rem', color: '#fff' }}>{partner.languages?.join(', ')}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Preferred Hours</span>
                <strong style={{ fontSize: '0.9rem', color: '#fff' }}>{partner.availableHours || '10:00 AM - 08:00 PM'}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>Gender</span>
                <strong style={{ fontSize: '0.9rem', color: '#fff' }}>{partner.gender}</strong>
              </div>
            </div>
          </div>

          {/* Services Menu & Hourly Rates */}
          <div className="glass-panel" style={{ padding: '26px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Services & Hourly Rates</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {partner.services?.map(s => {
                const svcInfo = services.find(x => x.id === s.serviceId);
                return (
                  <div 
                    key={s.serviceId}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(15, 23, 42, 0.5)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '14px'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#fff', marginBottom: '4px' }}>
                        {svcInfo?.name || s.serviceId}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                        {svcInfo?.description || 'Platonic companion activity in safe public setting.'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ec4899' }}>
                        {formatCurrency(s.ratePerHour)}<span style={{ fontSize: '0.75rem', fontWeight: 400 }}>/hr</span>
                      </span>
                      <button 
                        className="btn-secondary btn-sm"
                        onClick={() => openBookingModal(partner, s.serviceId)}
                      >
                        Book
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Local Service Areas */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Coverage Areas in {partner.city}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {partner.areas?.map(area => (
                <span 
                  key={area}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(124, 58, 237, 0.15)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    color: '#c084fc',
                    fontSize: '0.84rem'
                  }}
                >
                  <MapPin size={13} style={{ display: 'inline', marginRight: '4px' }} /> {area}
                </span>
              ))}
            </div>
          </div>

          {/* Client Reviews Feed */}
          <div className="glass-panel" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Client Reviews & Experiences</h3>
              <span style={{ color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={16} fill="#fbbf24" /> {partner.rating} / 5.0
              </span>
            </div>

            {partner.reviews && partner.reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {partner.reviews.map(rev => (
                  <div 
                    key={rev.id}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(15, 23, 42, 0.5)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ color: '#fff', fontSize: '0.92rem' }}>{rev.clientName}</strong>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{rev.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />
                      ))}
                      <span style={{ fontSize: '0.78rem', color: '#c084fc', marginLeft: '6px' }}>
                        {rev.service}
                      </span>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                No reviews yet. Be the first to book a session with {partner.name}!
              </p>
            )}
          </div>

        </div>

        {/* Right Column: Verification Stamp & Instant Book Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Booking Card */}
          <div className="glass-panel" style={{ padding: '24px', position: 'sticky', top: '90px' }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
              Platonic Hourly Hire
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '14px' }}>
              {formatCurrency(partner.hourlyRate)}<span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 400 }}> / hour</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', fontSize: '0.84rem', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#10b981" /> No minimum lock-in (from 1 hr)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#10b981" /> 4-Digit Session Start OTP
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#10b981" /> Strictly Public Locations
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#10b981" /> 100% Refund if partner declines
              </div>
            </div>

            <button 
              className="btn-primary"
              onClick={() => openBookingModal(partner)}
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            >
              Hire {partner.name} Now
            </button>

            {/* Verification Document Info Badge */}
            <div style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.8rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 700, marginBottom: '6px' }}>
                <ShieldCheck size={16} /> Verified Credentials
              </div>
              <div style={{ color: '#94a3b8', lineHeight: '1.5' }}>
                {partner.kycDocuments?.idType} ({partner.kycDocuments?.idNumber}) verified. Background screening status: <em>{partner.kycDocuments?.backgroundCheck}</em>.
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
