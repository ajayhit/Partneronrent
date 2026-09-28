import React, { useState } from 'react';
import PolicyNav from '../components/PolicyNav';
import { 
  Scale, 
  Award, 
  Clock, 
  ShieldCheck, 
  Ban, 
  HeartHandshake, 
  DollarSign, 
  Lock, 
  Star, 
  ChevronRight,
  AlertOctagon,
  Printer
} from 'lucide-react';

export default function PartnerCodeOfConduct({ setActivePage }) {
  const [activeSection, setActiveSection] = useState('mission');

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sections = [
    { id: 'mission', title: '1. Professional Ethos & Dignity' },
    { id: 'platonic-boundary', title: '2. Platonic Boundaries & Integrity' },
    { id: 'punctuality', title: '3. Punctuality & Presentation' },
    { id: 'anti-circumvention', title: '4. Zero Off-Platform Transactions' },
    { id: 'substance-free', title: '5. Zero Alcohol & Narcotics Policy' },
    { id: 'client-confidentiality', title: '6. Strict Client Confidentiality' },
    { id: 'financial-integrity', title: '7. Financial Integrity & No Tips' },
    { id: 'performance-rating', title: '8. Performance Standards & 4.0+ Star' },
    { id: 'disciplinary', title: '9. Sanctions & Blacklisting' }
  ];

  return (
    <div className="container" style={{ padding: '30px 16px 80px', maxWidth: '1200px' }}>
      {/* Policy switcher bar */}
      <PolicyNav activePage="conduct" setActivePage={setActivePage} />

      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(30, 41, 59, 0.8) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px 32px',
        marginBottom: '36px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px'
      }}>
        <div style={{ maxWidth: '780px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.2)', padding: '6px 14px', borderRadius: '20px', color: '#34d399', fontSize: '0.82rem', fontWeight: 600, marginBottom: '12px' }}>
            <Award size={15} /> Partner Professional Excellence Standard
          </div>
          <h1 style={{ fontSize: '2.4rem', color: '#ffffff', marginBottom: '12px', lineHeight: 1.2 }}>
            Partner Code of Conduct
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.02rem', lineHeight: 1.6, margin: 0 }}>
            As a verified companion on <strong style={{ color: '#ffffff' }}>PartnerOnRent</strong>, you represent the highest standards of emotional intelligence, empathetic companionship, and personal integrity. This Code of Conduct outlines the ethical obligations every partner must uphold.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => window.print()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(30, 41, 59, 0.9)',
              border: '1px solid var(--border-subtle)',
              color: '#94a3b8',
              padding: '10px 18px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.86rem',
              cursor: 'pointer'
            }}
          >
            <Printer size={16} /> Print Manual
          </button>
          <div style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
            Mandatory for all KYC Verified Partners
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 280px) 1fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Sticky Table of Contents */}
        <div style={{
          position: 'sticky',
          top: '90px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          backdropFilter: 'blur(12px)'
        }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
            Conduct Code Index
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.84rem',
                  color: activeSection === sec.id ? '#34d399' : '#94a3b8',
                  background: activeSection === sec.id ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  fontWeight: activeSection === sec.id ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{sec.title}</span>
                <ChevronRight size={14} opacity={activeSection === sec.id ? 1 : 0.4} />
              </button>
            ))}
          </div>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '8px' }}>
              Partner Ethics Committee
            </div>
            <a
              href="mailto:partner-conduct@partneronrent.in"
              style={{ color: '#10b981', fontSize: '0.82rem', fontWeight: 600, display: 'inline-block' }}
            >
              partner-conduct@partneronrent.in
            </a>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Section 1 */}
          <div id="mission" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <HeartHandshake size={22} color="#10b981" />
              1. Professional Ethos & Dignity
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '14px' }}>
              PartnerOnRent was founded to alleviate urban loneliness, support emotional well-being, and provide cheerful, safe accompaniment for meaningful moments. As a Partner, you serve as an ambassador of human warmth and healthy companionship.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: '#34d399', display: 'block', marginBottom: '4px' }}>Active Empathy</strong>
                Listen attentively, show genuine interest in your client's conversations, and maintain an upbeat, respectful attitude.
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: '#34d399', display: 'block', marginBottom: '4px' }}>Inclusivity & Respect</strong>
                Never discriminate based on religion, caste, ethnicity, gender identity, age, or disability.
              </div>
            </div>
          </div>

          {/* Section 2: Platonic Boundaries */}
          <div id="platonic-boundary" className="policy-card" style={{ background: 'rgba(236, 72, 153, 0.06)', border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={22} color="#ec4899" />
              2. Platonic Boundaries & Integrity
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '14px' }}>
              You are required to uphold strict platonic boundaries at all times without exception:
            </p>
            <ul style={{ color: '#cbd5e1', lineHeight: '1.7', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Zero Physical Intimacy:</strong> Under no circumstance may you offer, accept, or suggest romantic physical touch, hugging beyond brief polite greetings, holding hands without mutual comfort, or sexual favors.</li>
              <li><strong>Clear Script for Inappropriate Requests:</strong> If a client makes an advance, politely state: <em>"PartnerOnRent is strictly a platonic companionship platform. I cannot engage in personal intimacy. Please respect platform rules."</em></li>
              <li><strong>Right of Immediate Exit:</strong> If the client persists, immediately terminate the session, walk toward public security or staff, and trigger your in-app SOS alert.</li>
            </ul>
          </div>

          {/* Section 3: Punctuality */}
          <div id="punctuality" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={22} color="#06b6d4" />
              3. Punctuality & Presentation Standards
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '4px' }}>Arrival 10 Minutes Early</strong>
                Arrive at the confirmed public venue at least 10 minutes prior to scheduled start time. Inform the client via in-app chat if facing traffic delays.
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '4px' }}>Appropriate Attire</strong>
                Dress neatly, professionally, and respectfully according to the occasion (e.g., smart casual for cafes, semi-formal for fine dining, comfortable for shopping/walks).
              </div>
            </div>
          </div>

          {/* Section 4: Anti-Circumvention */}
          <div id="anti-circumvention" className="policy-card" style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Ban size={22} color="#ef4444" />
              4. Zero Off-Platform Transactions (Anti-Circumvention)
            </h2>
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid #ef4444', marginBottom: '14px' }}>
              <strong style={{ color: '#f87171', display: 'block', marginBottom: '4px' }}>Strict Platform Escrow Mandate:</strong>
              <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.88rem', lineHeight: '1.6' }}>
                All payments, tips, extensions, and re-bookings must be conducted solely via the in-app wallet. Accepting direct cash, GPay/PhonePe direct QR transfers, or negotiating outside the platform is a material breach of contract.
              </p>
            </div>
            <ul style={{ color: '#cbd5e1', lineHeight: '1.7', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.88rem' }}>
              <li>Never exchange personal WhatsApp or mobile numbers prior to session completion.</li>
              <li>Circumvention leads to immediate forfeiture of pending wallet balance and permanent KYC de-registration.</li>
            </ul>
          </div>

          {/* Section 5: Substance-Free */}
          <div id="substance-free" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertOctagon size={22} color="#f59e0b" />
              5. Zero Alcohol & Narcotics Policy
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '12px' }}>
              Partners must remain 100% sober and alert throughout the entire duration of a companionship booking.
            </p>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '0' }}>
              Even if a client offers alcoholic beverages or visits a pub, partners are encouraged to order non-alcoholic beverages (mocktails, juices, soft drinks). The consumption of illegal drugs or illicit substances results in immediate police notification under the NDPS Act.
            </p>
          </div>

          {/* Section 6: Client Confidentiality */}
          <div id="client-confidentiality" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock size={22} color="#8b5cf6" />
              6. Strict Client Confidentiality
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '12px' }}>
              Clients frequently share personal stories, struggles, career dilemmas, and emotional thoughts. You are bound by a non-disclosure obligation:
            </p>
            <ul style={{ color: '#cbd5e1', lineHeight: '1.7', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Never reveal a client’s identity, company, or personal disclosures to friends, family, or online forums.</li>
              <li>Never take covert photographs, videos, or voice recordings during sessions.</li>
              <li>Never post about specific clients on Instagram Reels, YouTube vlogs, or Twitter/X.</li>
            </ul>
          </div>

          {/* Section 7: Financial Integrity */}
          <div id="financial-integrity" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <DollarSign size={22} color="#10b981" />
              7. Financial Integrity & No Solicitation of Loans
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '12px' }}>
              Partners are strictly forbidden from:
            </p>
            <ul style={{ color: '#cbd5e1', lineHeight: '1.7', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Asking clients for loans, financial investments, stock tips, or job referrals through coercion.</li>
              <li>Demanding tips or gratuities beyond agreed hourly rates.</li>
              <li>Selling personal goods, MLM schemes, or commercial insurance to clients.</li>
            </ul>
          </div>

          {/* Section 8: Performance Standards */}
          <div id="performance-rating" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Star size={22} color="#f59e0b" />
              8. Performance Standards & 4.0+ Star Threshold
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '14px' }}>
              To retain active status in the Partner Directory:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: '#f59e0b', display: 'block', marginBottom: '4px' }}>Minimum 4.0 Star Rating</strong>
                Partners falling below a 4.0 average over their last 10 sessions undergo mandatory re-training.
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: '#f59e0b', display: 'block', marginBottom: '4px' }}>Cancellation Rate &lt; 5%</strong>
                Repeated last-minute cancellations without valid medical proof will result in account demotion.
              </div>
            </div>
          </div>

          {/* Section 9: Sanctions */}
          <div id="disciplinary" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Scale size={22} color="#8b5cf6" />
              9. Sanctions & Permanent Blacklisting
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '12px' }}>
              Violations of this Code of Conduct will be reviewed by the Safety Committee. Depending on severity, penalties include:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fecdd3' }}>
                <strong>Tier 1 (Minor):</strong> Formal written warning and mandatory refresher training.
              </div>
              <div style={{ background: 'rgba(239, 68, 68, 0.12)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fecdd3' }}>
                <strong>Tier 2 (Moderate):</strong> 14-day booking suspension and forfeiture of bonus tiers.
              </div>
              <div style={{ background: 'rgba(239, 68, 68, 0.18)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fecdd3' }}>
                <strong>Tier 3 (Severe / Boundary Breach):</strong> Immediate permanent deactivation, blacklisting of PAN/Aadhaar from Indian partner registry, and legal handover to police authorities.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
