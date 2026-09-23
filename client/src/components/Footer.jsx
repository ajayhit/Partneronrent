import React from 'react';
import { ShieldCheck, Heart, MapPin, Phone, Mail, FileText } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer style={{
      background: '#0a0f1d',
      borderTop: '1px solid var(--border-subtle)',
      padding: '50px 0 24px',
      marginTop: '80px',
      fontSize: '0.9rem'
    }}>
      <div className="container">
        
        {/* Platonic Trust Box */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.4)',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: '40px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '720px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldCheck size={28} color="#34d399" />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                Strictly Platonic & Consent-First Emotional Wellness Platform
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.84rem', margin: 0 }}>
                PartnerOnRent is NOT a dating or adult matchmaking service. We are an emotional wellness and professional companionship service designed to combat loneliness, provide assistance for daily activities, and foster healthy social connection in public spaces.
              </p>
            </div>
          </div>
          <div>
            <span className="badge badge-verified" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              100% ID Verified Companions
            </span>
          </div>
        </div>

        {/* Footer Grid */}
        <div className="grid-4" style={{ marginBottom: '40px' }}>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
              Partner<span style={{ color: '#ec4899' }}>OnRent</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '16px' }}>
              India's premier verified platform to rent companions hourly for movies, cafe conversations, shopping, travel, elder care, and clinic visits.
            </p>
            <div style={{ display: 'flex', gap: '8px', color: '#94a3b8', fontSize: '0.82rem' }}>
              <span className="badge badge-platonic">Govt ID Checked</span>
              <span className="badge badge-verified">Safe Public Venues</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
              Popular Companionship
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>
              <li>Movie Companion (₹2,000/hr)</li>
              <li>Cafe & Conversation (₹1,500/hr)</li>
              <li>Shopping Buddy (₹1,200/hr)</li>
              <li>Travel Partner (₹2,500/hr)</li>
              <li>Senior Citizen Companion (₹1,000/hr)</li>
              <li>Medical Appointment Support (₹1,500/hr)</li>
            </ul>
          </div>

          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
              Active Cities (India)
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.84rem', lineHeight: '1.7' }}>
              Delhi NCR, Mumbai, Bangalore, Pune, Hyderabad, Chennai, Kolkata, Ahmedabad, Jaipur, Chandigarh, Lucknow, Kochi.
            </p>
            <div style={{ marginTop: '12px', fontSize: '0.84rem', color: '#38bdf8' }}>
              Expanding to 15+ more Tier-1 & Tier-2 cities soon.
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
              Support & Safety Hotline
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: '#94a3b8', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={15} color="#ec4899" />
                <span>+91-98105-35398 (24x7 Safety Desk)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} color="#a78bfa" />
                <span>safety@partneronrent.in</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={15} color="#34d399" />
                <span>Zero Tolerance Harassment Policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#64748b',
          fontSize: '0.8rem'
        }}>
          <div>
            © {new Date().getFullYear()} PartnerOnRent Platform (India). Inspired by KoPartner emotional wellness architecture.
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Safety Guidelines</span>
            <span>Partner Code of Conduct</span>
            <span
              onClick={() => setActivePage('auth')}
              style={{ cursor: 'pointer', color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
              title="Super Admin Portal Login"
            >
              🔒 Admin Login
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
