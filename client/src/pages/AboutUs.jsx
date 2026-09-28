import React from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  MapPin, 
  Users, 
  Target, 
  Sparkles, 
  KeyRound, 
  Award, 
  ArrowRight,
  Coffee,
  Film,
  Building2,
  PhoneCall
} from 'lucide-react';

export default function AboutUs({ setActivePage }) {
  return (
    <div className="container" style={{ padding: '30px 16px 80px', maxWidth: '1200px' }}>
      
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(236, 72, 153, 0.2) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '50px 36px',
        marginBottom: '48px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(124, 58, 237, 0.25)', padding: '6px 16px', borderRadius: '20px', color: '#c084fc', fontSize: '0.85rem', fontWeight: 700, marginBottom: '16px' }}>
          <Sparkles size={16} /> Fighting Loneliness With Verified Human Warmth
        </div>
        <h1 style={{ fontSize: 'clamp(2.4rem, 4vw, 3.4rem)', color: '#ffffff', marginBottom: '18px', lineHeight: 1.2, fontWeight: 800 }}>
          About <span className="gradient-text">PartnerOnRent</span>
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '1.1rem', maxWidth: '780px', margin: '0 auto 28px', lineHeight: 1.7 }}>
          PartnerOnRent is India’s premier platonic companionship and emotional wellness platform. We connect everyday individuals with verified, empathetic companions for movies, coffee conversations, shopping, travel, elder care, and clinic visits.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActivePage('safety')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              color: '#fff',
              padding: '12px 22px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.92rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <ShieldCheck size={18} color="#34d399" />
            Our Safety Standards
          </button>
          <button
            onClick={() => setActivePage('feedback')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              border: 'none',
              color: '#fff',
              padding: '12px 22px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.35)'
            }}
          >
            Read Community Reviews <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Core Mission & Why We Exist */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', marginBottom: '50px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '32px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(124, 58, 237, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
            <Target size={24} color="#8b5cf6" />
          </div>
          <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '12px' }}>Our Mission</h2>
          <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: 0, fontSize: '0.95rem' }}>
            In high-paced urban cities, millions experience loneliness, relocation blues, or simply lack someone to share a simple dinner or cinema outing with. We aim to normalize hiring dignified, verified companions for emotional wellness — without dating pressures, expectations, or pretense.
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '32px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
            <HeartHandshake size={24} color="#ec4899" />
          </div>
          <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '12px' }}>100% Strictly Platonic</h2>
          <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: 0, fontSize: '0.95rem' }}>
            We are unequivocally NOT an adult dating service or escort portal. Every interaction is strictly platonic, respectful, and consensual. We operate within full legal bounds under Indian law, protecting companions and clients equally with 24/7 SOS surveillance.
          </p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '32px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
            <Award size={24} color="#10b981" />
          </div>
          <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '12px' }}>Economic Dignity</h2>
          <p style={{ color: '#cbd5e1', lineHeight: '1.7', margin: 0, fontSize: '0.95rem' }}>
            We empower students, conversationalists, tour enthusiasts, and caregivers to earn meaningful hourly income (₹1,000 to ₹3,500/hr) on flexible shifts, with prompt bank payouts and comprehensive physical safety protocols.
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" style={{
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px 32px',
        marginBottom: '50px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 36px' }}>
          <div style={{ color: '#c084fc', fontSize: '0.84rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Seamless & Safe
          </div>
          <h2 style={{ fontSize: '2rem', color: '#fff', margin: 0 }}>How PartnerOnRent Works</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ background: '#7c3aed', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '14px' }}>1</div>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '8px' }}>Browse Verified Profiles</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
              Filter companions by city, language, and activity (movies, cafes, shopping, clinic support). Review transparent hourly rates and background ratings.
            </p>
          </div>

          <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ background: '#ec4899', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '14px' }}>2</div>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '8px' }}>Book & Escrow In-App</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
              Schedule your desired hours. Payment is safely held in platform escrow and only disbursed after the session is successfully concluded.
            </p>
          </div>

          <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ background: '#06b6d4', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '14px' }}>3</div>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '8px' }}>Meet & Enter 4-Digit OTP</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
              Meet at your designated public venue (Starbucks, mall, cineplex). Provide the confidential 4-digit OTP to start the session timer.
            </p>
          </div>

          <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ background: '#10b981', color: '#fff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '14px' }}>4</div>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '8px' }}>Safe & Enjoyable Time</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
              Enjoy great conversation and meaningful accompaniment backed by 1-tap SOS distress protection. Rate your companion after completion.
            </p>
          </div>
        </div>
      </div>

      {/* Trust & Presence Stats */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.95))',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '36px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#38bdf8', marginBottom: '4px' }}>20+</div>
          <div style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 600 }}>Active Indian Cities</div>
        </div>
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f472b6', marginBottom: '4px' }}>100%</div>
          <div style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 600 }}>Govt ID KYC Checked</div>
        </div>
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#34d399', marginBottom: '4px' }}>4.9★</div>
          <div style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 600 }}>Average Companion Rating</div>
        </div>
        <div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fbbf24', marginBottom: '4px' }}>24/7</div>
          <div style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 600 }}>Emergency SOS Desk</div>
        </div>
      </div>

    </div>
  );
}
