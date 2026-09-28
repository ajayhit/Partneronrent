import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { fetchPartners } from '../utils/api';
import { formatCurrency } from '../utils/helpers';
import SafetyBanner from '../components/SafetyBanner';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  Star, 
  Heart, 
  CheckCircle2, 
  ChevronRight,
  Film,
  Coffee,
  ShoppingBag,
  Compass,
  HeartHandshake,
  Stethoscope,
  Smile,
  ArrowRight,
  Calculator,
  UserPlus,
  MessageSquare
} from 'lucide-react';

export default function Home({ setActivePage, onSelectPartner }) {
  const { isAuthenticated } = useAuth();
  const { services, settings, openBookingModal } = useApp();
  const [featuredPartners, setFeaturedPartners] = useState([]);
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedService, setSelectedService] = useState('all');

  // Interactive Earnings Calculator states
  const [calcHours, setCalcHours] = useState(12);
  const [calcRate, setCalcRate] = useState(1500);

  // Partner keeps 80% of total
  const partnerMonthlyEarnings = Math.round(calcHours * calcRate * 4.33 * 0.80);

  useEffect(() => {
    loadFeatured();
  }, []);

  const loadFeatured = async () => {
    try {
      const data = await fetchPartners();
      setFeaturedPartners(data.slice(0, 4));
    } catch (err) {
      console.error(err);
    }
  };

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case 'Film': return <Film size={22} color="#ec4899" />;
      case 'Coffee': return <Coffee size={22} color="#f59e0b" />;
      case 'ShoppingBag': return <ShoppingBag size={22} color="#06b6d4" />;
      case 'Compass': return <Compass size={22} color="#10b981" />;
      case 'HeartHandshake': return <HeartHandshake size={22} color="#a855f7" />;
      case 'Stethoscope': return <Stethoscope size={22} color="#3b82f6" />;
      default: return <Smile size={22} color="#ec4899" />;
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setActivePage('auth');
    } else {
      setActivePage('directory');
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      
      {/* Hero Section */}
      <section style={{
        padding: '50px 0 40px',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Subtle decorative glow orb */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '450px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.25) 0%, rgba(236, 72, 153, 0.1) 60%, transparent 80%)',
          filter: 'blur(50px)',
          zIndex: -1,
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(124, 58, 237, 0.15)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: 'var(--radius-full)',
          padding: '6px 18px',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: '#c084fc',
          marginBottom: '20px'
        }}>
          <Sparkles size={16} /> India's Most Trusted Platonic Companionship Platform
        </div>

        <h1 style={{
          fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
          lineHeight: '1.15',
          maxWidth: '860px',
          margin: '0 auto 20px',
          fontWeight: 800
        }}>
          Rent a Verified <span className="gradient-text">Companion</span> Hourly for Movies, Cafes & Life
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: '#94a3b8',
          maxWidth: '680px',
          margin: '0 auto 36px',
          lineHeight: '1.6'
        }}>
          Need someone to watch the latest film with, explore specialty coffee, or accompany your parents to a clinic? Safe, strictly platonic, consent-first companionship across 20+ Indian cities.
        </p>

        {/* Hero Search Bar */}
        <form 
          onSubmit={handleSearchSubmit}
          style={{
            background: 'rgba(30, 41, 59, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-active)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            maxWidth: '860px',
            margin: '0 auto 30px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {/* City select */}
          <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
              City / Location
            </label>
            <select 
              value={selectedCity} 
              onChange={e => setSelectedCity(e.target.value)}
              style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-subtle)', color: '#fff' }}
            >
              <option>All Cities</option>
              {settings.cities?.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Service select */}
          <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', fontWeight: 700, marginBottom: '4px' }}>
              Companion Activity
            </label>
            <select 
              value={selectedService} 
              onChange={e => setSelectedService(e.target.value)}
              style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-subtle)', color: '#fff' }}
            >
              <option value="all">All Activities & Services</option>
              {services?.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Search CTA */}
          <div style={{ flex: '1 1 180px', display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%', height: '46px', fontSize: '0.95rem' }}>
              <Search size={18} /> Find Companion
            </button>
          </div>
        </form>

        {/* Quick Trust Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', color: '#cbd5e1', fontSize: '0.85rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="#10b981" /> 100% ID & Police Background Checked
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="#10b981" /> Strictly Platonic Boundaries
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="#10b981" /> 24x7 Safety Dispatch SOS
          </span>
        </div>

      </section>

      {/* Safety Guarantee Bar */}
      <SafetyBanner setActivePage={setActivePage} />

      {/* Popular Companion Services */}
      <section style={{ margin: '60px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '4px' }}>
              What We Offer
            </div>
            <h2 style={{ fontSize: '2rem' }}>Companionship for Every Moment</h2>
          </div>
          <button 
            onClick={() => setActivePage('directory')} 
            style={{ color: '#ec4899', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem' }}
          >
            Browse All Services <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid-4">
          {services?.map(service => (
            <div 
              key={service.id}
              className="glass-panel"
              style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                cursor: 'pointer'
              }}
              onClick={() => setActivePage('directory')}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
            >
              <div>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  {getServiceIcon(service.icon)}
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>{service.name}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.84rem', lineHeight: '1.5', marginBottom: '16px' }}>
                  {service.tagline}
                </p>
              </div>

              <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#ec4899', fontWeight: 700 }}>✓</span> Login to view rates
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Verified Partners */}
      <section style={{ margin: '70px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '4px' }}>
              Verified Companions
            </div>
            <h2 style={{ fontSize: '2rem' }}>Meet Top-Rated Partners</h2>
          </div>
          <button 
            onClick={() => {
              if (!isAuthenticated) {
                setActivePage('auth');
              } else {
                setActivePage('directory');
              }
            }} 
            className="btn-outline"
            style={{ fontSize: '0.9rem' }}
          >
            {isAuthenticated ? `View All Verified Profiles (${featuredPartners.length}+)` : 'Sign In to View All Profiles'}
          </button>
        </div>

        <div className="grid-4">
          {featuredPartners.map(partner => (
            <div 
              key={partner.id}
              className="glass-panel"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }}
              onClick={() => {
                if (!isAuthenticated) {
                  setActivePage('auth');
                  return;
                }
                if (onSelectPartner) onSelectPartner(partner);
                setActivePage('partner-detail');
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {/* Avatar & badges (no photo) */}
              <div style={{
                padding: '24px 20px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(236,72,153,0.08) 100%)'
              }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem', fontWeight: 800, color: '#fff',
                  flexShrink: 0,
                  boxShadow: '0 0 18px rgba(124,58,237,0.4)'
                }}>
                  {partner.name?.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {partner.name}, {partner.age}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '0.78rem', marginBottom: '8px' }}>
                    <MapPin size={12} /> {partner.city}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}><ShieldCheck size={11} /> Verified</span>
                    {partner.isOnline && (
                      <span className="badge" style={{ background: 'rgba(16,185,129,0.9)', color: '#fff', fontSize: '0.7rem' }}>
                        <span className="badge-online" style={{ background: '#fff', width: '6px', height: '6px', display: 'inline-block', borderRadius: '50%', marginRight: '4px' }}></span>Online
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{
                  color: '#94a3b8',
                  fontSize: '0.82rem',
                  lineHeight: '1.5',
                  marginBottom: '14px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {partner.bio}
                </p>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '0.82rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontWeight: 700 }}>
                      <Star size={14} fill="#fbbf24" /> {partner.rating} ({partner.reviewCount})
                    </span>
                    <span style={{ color: '#94a3b8' }}>
                      {partner.completedHours}h completed
                    </span>
                  </div>

                  <button 
                    className="btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isAuthenticated) {
                        setActivePage('auth');
                        return;
                      }
                      openBookingModal(partner);
                    }}
                    style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }}
                  >
                    Hire Hourly
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Partner Earnings Calculator (KoPartner Model: Earn upto ₹1.5L/mo at 80% split) */}
      <section style={{
        margin: '80px 0',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid var(--border-active)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
          
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#34d399',
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px'
            }}>
              <TrendingUp size={16} /> Earn Flexible Income
            </div>

            <h2 style={{ fontSize: '2.2rem', lineHeight: '1.2', marginBottom: '16px' }}>
              Become a Partner & Earn Upto <span className="gradient-text">₹1,50,000</span> / Month
            </h2>

            <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '24px' }}>
              Work when you want, choose the activities you enjoy, and keep <strong>80% of every rupee you earn</strong>. Annual verification membership is just ₹1,000.
            </p>

            {/* Benefit Checkmarks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
                <CheckCircle2 size={18} color="#10b981" /> 100% Flexible hours - accept or decline sessions anytime
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
                <CheckCircle2 size={18} color="#10b981" /> Direct weekly UPI & Bank account withdrawals
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
                <CheckCircle2 size={18} color="#10b981" /> Strict platonic safety boundaries & emergency monitoring
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={() => {
                // Redirect to auth to sign up as a partner
                setActivePage('auth');
              }}
              style={{ padding: '14px 28px', fontSize: '1rem' }}
            >
              <UserPlus size={18} /> Register as Partner & Earn Part-Time
            </button>
          </div>

          {/* Calculator Interactive Box */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '28px',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Calculator size={22} color="#c084fc" />
              <h3 style={{ fontSize: '1.25rem' }}>Earnings Calculator</h3>
            </div>

            {/* Slider 1: Hours per week */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Hours committed per week:</span>
                <strong style={{ color: '#fff', fontSize: '1rem' }}>{calcHours} Hours / wk</strong>
              </div>
              <input 
                type="range" 
                min="4" 
                max="35" 
                value={calcHours}
                onChange={e => setCalcHours(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ec4899', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                <span>4 hrs (Part-time)</span>
                <span>20 hrs (Regular)</span>
                <span>35 hrs (Full-time)</span>
              </div>
            </div>

            {/* Slider 2: Average Rate */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Your Hourly Rate:</span>
                <strong style={{ color: '#ec4899', fontSize: '1rem' }}>{formatCurrency(calcRate)} / hr</strong>
              </div>
              <input 
                type="range" 
                min="1000" 
                max="2500" 
                step="100"
                value={calcRate}
                onChange={e => setCalcRate(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#7c3aed', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                <span>₹1,000/hr (Base)</span>
                <span>₹1,800/hr (Popular)</span>
                <span>₹2,500/hr (Premium)</span>
              </div>
            </div>

            {/* Result Box */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
              border: '1px solid var(--border-active)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#cbd5e1', marginBottom: '4px' }}>
                Estimated Monthly Take-Home (80% Share)
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#34d399', letterSpacing: '-0.02em' }}>
                {formatCurrency(partnerMonthlyEarnings)}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '6px' }}>
                ≈ {formatCurrency(Math.round(partnerMonthlyEarnings / 4.33))} / week • Direct payout to your bank/UPI
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* How It Works */}
      <section style={{ margin: '80px 0', textAlign: 'center' }}>
        <div style={{ fontSize: '0.85rem', color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '6px' }}>
          Simple 3-Step Process
        </div>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '40px' }}>How PartnerOnRent Works</h2>

        <div className="grid-3" style={{ textAlign: 'left' }}>
          
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
              color: '#fff',
              marginBottom: '16px'
            }}>
              1
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Select City & Browse</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6' }}>
              Choose your city, explore verified partner profiles, read real client feedback, and pick the companion suited for your plan.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
              color: '#fff',
              marginBottom: '16px'
            }}>
              2
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Book & Generate OTP</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6' }}>
              Select duration, pick a public venue (cafe, cinema, mall), and confirm. A 4-digit security OTP is generated for session start.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
              color: '#fff',
              marginBottom: '16px'
            }}>
              3
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Meet & Decompress</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6' }}>
              Meet your verified companion at the public venue, share the OTP, enjoy great conversation and support, and leave feedback.
            </p>
          </div>

        </div>
      </section>

      {/* Community Stories & Client Feedback Section */}
      <section style={{ margin: '80px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#f472b6', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} /> Verified Experiences
            </div>
            <h2 style={{ fontSize: '2.2rem', margin: 0 }}>Community Stories & Feedback</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', margin: '6px 0 0' }}>
              4.9/5 Average Rating across 1,480+ Platonic Companion Sessions in 20+ Cities
            </p>
          </div>

          <button
            onClick={() => setActivePage('feedback')}
            className="btn-outline"
            style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span>View All Reviews & Leave Feedback</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid-3">
          <div className="glass-panel" style={{ padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={15} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <span style={{ fontSize: '0.74rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '3px 8px', borderRadius: '12px', fontWeight: 600 }}>
                  Cafe & Conversation
                </span>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}>
                "Booked Priya for a 2-hour coffee conversation after moving to Delhi for my new job. She was incredibly polite, well-read, and respectful of boundaries. The OTP verification at Starbucks made me feel completely secure."
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#7c3aed', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                A
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem' }}>Aarav M. (Hirer)</div>
                <div style={{ color: '#64748b', fontSize: '0.76rem' }}>Connaught Place, New Delhi</div>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={15} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <span style={{ fontSize: '0.74rem', background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', padding: '3px 8px', borderRadius: '12px', fontWeight: 600 }}>
                  Movie Companion
                </span>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}>
                "I really wanted to watch the late evening IMAX screening but didn't want to go alone. Booked Rohan — he arrived 10 mins early, entered the OTP, and was great company during intermission. Completely platonic and zero awkwardness."
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ec4899', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                M
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem' }}>Meera S. (Hirer)</div>
                <div style={{ color: '#64748b', fontSize: '0.76rem' }}>Bandra West, Mumbai</div>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={15} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <span style={{ fontSize: '0.74rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '3px 8px', borderRadius: '12px', fontWeight: 600 }}>
                  Elder Care Support
                </span>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px' }}>
                "Needed a companion to accompany my 72-year-old mother for her routine cardiology checkup while I was traveling on work. Sunita was an angel — patient, attentive, and sent updates throughout. Truly an emotional relief."
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                S
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem' }}>Siddharth V. (Hirer)</div>
                <div style={{ color: '#64748b', fontSize: '0.76rem' }}>Koramangala, Bengaluru</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section style={{ margin: '80px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontSize: '0.85rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '6px' }}>
            Got Questions?
          </div>
          <h2 style={{ fontSize: '2.2rem' }}>Frequently Asked Questions</h2>
        </div>

        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div className="glass-panel" style={{ padding: '20px 24px' }}>
            <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '8px' }}>
              Is PartnerOnRent a dating or matrimonial service?
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
              <strong>No, strictly not.</strong> PartnerOnRent is an emotional wellness and professional companionship service designed for emotional support, stress relief, and companionship during daily public activities (movies, shopping, cafe visits, clinic accompaniment). All interactions are strictly platonic and consent-first.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '20px 24px' }}>
            <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '8px' }}>
              How are companions verified?
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
              Every companion must undergo mandatory government photo ID verification (Aadhaar, Passport, or Driving License), selfie validation, and background screening reviewed and approved by our Operations Admin team before their profile goes live.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '20px 24px' }}>
            <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '8px' }}>
              How do session payments and partner payouts work?
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
              Hirers pay hourly based on the service selected. Hirers can pay via their secure platform wallet or instant UPI. Partners keep 80% of all hourly fees, which can be withdrawn directly to their bank account or UPI ID with 24-hour turnaround.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '20px 24px' }}>
            <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '8px' }}>
              What safety measures are in place during meetups?
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
              1) All sessions must take place in public venues (cafes, malls, theaters). 2) Session start OTP prevents unauthorized meetings. 3) Both parties have a 1-tap Emergency SOS button that immediately alerts local emergency contacts and our 24x7 Safety Dispatch Desk.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
