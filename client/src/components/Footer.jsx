import React from 'react';
import { 
  ShieldCheck, 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  Sparkles, 
  HelpCircle, 
  MessageSquare, 
  AlertTriangle, 
  Building2, 
  Scale, 
  Lock,
  ArrowRight
} from 'lucide-react';

export default function Footer({ setActivePage }) {
  const cities = [
    'Delhi NCR', 'Mumbai', 'Bengaluru', 'Pune', 'Hyderabad', 
    'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Chandigarh', 'Lucknow', 'Kochi'
  ];

  return (
    <footer style={{
      background: '#090d16',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '60px 0 28px',
      marginTop: '80px',
      fontSize: '0.9rem',
      color: '#94a3b8'
    }}>
      <div className="container">
        
        {/* Platonic Trust & Safety Guarantee Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px 28px',
          marginBottom: '50px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '780px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldCheck size={30} color="#34d399" />
            </div>
            <div>
              <div style={{ fontSize: '1.08rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                Strictly Platonic & Consent-First Emotional Wellness Platform
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0, lineHeight: '1.6' }}>
                PartnerOnRent is NOT a dating or escort service. We are an emotional wellness and hourly companionship platform designed to combat loneliness, provide assistance for daily activities, and foster healthy social connection exclusively in public commercial spaces.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActivePage('safety')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                color: '#f87171',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <AlertTriangle size={15} /> 24/7 Safety Protocol
            </button>
            <button
              onClick={() => setActivePage('conduct')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                color: '#34d399',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Scale size={15} /> Partner Code
            </button>
          </div>
        </div>

        {/* 4 Professional Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '36px',
          marginBottom: '50px'
        }}>
          
          {/* Col 1: Brand & Identity */}
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Partner<span style={{ color: '#ec4899' }}>OnRent</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.86rem', lineHeight: '1.65', marginBottom: '18px' }}>
              India's verified hourly companionship platform. Rent friendly companions for movies, cafe conversations, shopping, travel, elder care, and medical visits.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
                <ShieldCheck size={16} color="#10b981" />
                <span>100% Aadhaar / PAN KYC Checked</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
                <MapPin size={16} color="#38bdf8" />
                <span>Public Commercial Venues Only</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
                <Lock size={16} color="#c084fc" />
                <span>DPDP Act (2023) Data Protection</span>
              </div>
            </div>
          </div>

          {/* Col 2: Companionship Activities */}
          <div>
            <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
              Hourly Companionship
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
              <li style={{ color: '#cbd5e1' }}>🎬 Movie Companion</li>
              <li style={{ color: '#cbd5e1' }}>☕ Cafe & Conversation</li>
              <li style={{ color: '#cbd5e1' }}>🛍️ Shopping Buddy</li>
              <li style={{ color: '#cbd5e1' }}>✈️ Travel & City Guide</li>
              <li style={{ color: '#cbd5e1' }}>👵 Senior Citizen Companion</li>
              <li style={{ color: '#cbd5e1' }}>🏥 Medical Clinic Accompaniment</li>
            </ul>
          </div>

          {/* Col 3: Company & Community */}
          <div>
            <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
              Company & Community
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
              <li>
                <span
                  onClick={() => setActivePage('about')}
                  style={{ cursor: 'pointer', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
                >
                  About PartnerOnRent
                </span>
              </li>
              <li>
                <span
                  onClick={() => setActivePage('feedback')}
                  style={{ cursor: 'pointer', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#f472b6'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
                >
                  <MessageSquare size={14} color="#f472b6" /> Client & Partner Feedback
                </span>
              </li>
              <li>
                <span
                  onClick={() => setActivePage('faq')}
                  style={{ cursor: 'pointer', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#38bdf8'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
                >
                  <HelpCircle size={14} color="#38bdf8" /> Frequently Asked Questions
                </span>
              </li>
              <li>
                <span
                  onClick={() => setActivePage('contact')}
                  style={{ cursor: 'pointer', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
                >
                  Contact & Corporate Office
                </span>
              </li>
              <li>
                <span
                  onClick={() => setActivePage('auth')}
                  style={{ cursor: 'pointer', transition: 'color 0.2s', color: '#10b981', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#34d399'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#10b981'; }}
                >
                  Join as a Companion Partner &rarr;
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Safety & Emergency Hotlines */}
          <div>
            <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>
              Safety Desk & Hotlines (24x7)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.86rem' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px 14px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#fca5a5', fontWeight: 700, marginBottom: '2px' }}>
                  24/7 RAPID SAFETY DESK
                </div>
                <a href="tel:+919810535398" style={{ color: '#fff', fontWeight: 800, fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={15} color="#ef4444" /> +91-98105-35398
                </a>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>National Police Emergency:</span>
                <a href="tel:112" style={{ color: '#38bdf8', fontWeight: 700 }}>112 (National SOS Dispatch)</a>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Women In Distress Line:</span>
                <a href="tel:1091" style={{ color: '#ec4899', fontWeight: 700 }}>1091 / 1090 (24x7 Help)</a>
              </div>

              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.78rem' }}>Official Safety Inquiries:</span>
                <a href="mailto:safety@partneronrent.in" style={{ color: '#a78bfa' }}>safety@partneronrent.in</a>
              </div>
            </div>
          </div>

        </div>

        {/* Active Cities Pill Ticker */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '20px',
          paddingBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <span style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 700 }}>
            Available in 20+ Cities:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {cities.map((city) => (
              <span
                key={city}
                style={{
                  fontSize: '0.76rem',
                  background: 'rgba(30, 41, 59, 0.6)',
                  color: '#94a3b8',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                {city}
              </span>
            ))}
            <span style={{ fontSize: '0.76rem', color: '#38bdf8', padding: '3px 8px' }}>
              + more expanding
            </span>
          </div>
        </div>

        {/* Bottom copyright and legal nav */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '22px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#64748b',
          fontSize: '0.82rem',
          gap: '16px'
        }}>
          <div>
            © {new Date().getFullYear()} PartnerOnRent Platform (India). Strictly Platonic Emotional Wellness Architecture.
          </div>

          <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span
              onClick={() => setActivePage('terms')}
              style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#c084fc'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; }}
            >
              Terms of Service
            </span>
            <span
              onClick={() => setActivePage('privacy')}
              style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#38bdf8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; }}
            >
              Privacy Policy
            </span>
            <span
              onClick={() => setActivePage('safety')}
              style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#f43f5e'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; }}
            >
              Safety Guidelines
            </span>
            <span
              onClick={() => setActivePage('conduct')}
              style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#34d399'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; }}
            >
              Code of Conduct
            </span>
            <span
              onClick={() => setActivePage('feedback')}
              style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#f472b6'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; }}
            >
              Feedback
            </span>

          </div>
        </div>

      </div>
    </footer>
  );
}
