import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ShieldCheck, 
  KeyRound, 
  CreditCard, 
  AlertTriangle, 
  Sparkles,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    category: 'Platonic & Rules',
    q: 'Is PartnerOnRent a dating app or escort service?',
    a: 'No, absolutely not. PartnerOnRent is strictly an emotional wellness, social accompaniment, and hourly assistance platform. We operate with a strict zero-tolerance policy against physical intimacy, sexual solicitations, and adult services. All meetings must happen in public commercial spaces.'
  },
  {
    category: 'Platonic & Rules',
    q: 'Can I invite a companion to my apartment or hotel room?',
    a: 'Never. In-person companionship is strictly confined to verifiable, open public venues (cafes, restaurants, shopping malls, multiplex movie theaters, and public parks). Meeting in private residences, hotel rooms, or secluded vehicles is an immediate ground for permanent account termination.'
  },
  {
    category: 'Booking & OTP',
    q: 'How does the 4-digit Session Start OTP work?',
    a: 'When your booking is confirmed, a confidential 4-digit OTP is generated inside your Hirer Dashboard. When you physically meet your companion at the designated public venue, share this OTP with them. The companion enters it in their app to verify physical presence and start the session timer.'
  },
  {
    category: 'Booking & OTP',
    q: 'Can I book a companion for my elderly parents or relatives?',
    a: 'Yes! Senior citizen accompaniment (errands, walks in community parks, hospital and clinic appointments, social companionship) is one of our most popular and valued services. You can book on their behalf and specify meeting details in the notes.'
  },
  {
    category: 'Safety & SOS',
    q: 'What safety measures protect clients and companions?',
    a: 'All companions undergo mandatory Government ID (Aadhaar/PAN/Passport) verification. Every session is protected by GPS public venue check-ins, a 24/7 Safety Command Center, and a 1-tap SOS distress button that dispatches alerts to emergency contacts and connects directly with local police (112).'
  },
  {
    category: 'Safety & SOS',
    q: 'What happens if a client or companion behaves inappropriately?',
    a: 'Either party has the unconditional right to immediately terminate the session and walk away to safety. Triggering an in-app report will immediately freeze the offender\'s account pending formal investigation within 2 hours. Companions retain 100% of their earnings in cases of client misconduct.'
  },
  {
    category: 'Payments & Cancellations',
    q: 'How does payment work? Can I pay cash to the companion?',
    a: 'No offline cash is allowed. All payments are securely processed through RBI-compliant in-app payment gateways (UPI, Cards, Net Banking) and held in platform escrow until session completion. Paying cash offline forfeits your platform safety guarantees and will lead to an immediate ban.'
  },
  {
    category: 'Payments & Cancellations',
    q: 'What is the cancellation and refund policy?',
    a: 'If you cancel more than 2 hours before the scheduled session start, you receive a 100% instant refund. Cancellations within 2 hours incur a 50% fee to compensate the companion for their reserved time. If a companion fails to show up, you receive an immediate 100% refund.'
  },
  {
    category: 'For Partners',
    q: 'How can I become a verified companion on PartnerOnRent?',
    a: 'Click "Sign Up", select "Companion Partner", fill out your profile details (languages, interests, hourly rates), and submit your Government ID for verification. Our safety team reviews KYC applications within 24–48 hours.'
  },
  {
    category: 'For Partners',
    q: 'How and when do companions receive their earnings?',
    a: 'Companions keep 80% of the session booking fee (with 20% platform maintenance and 24/7 safety desk fee). Earnings reflect instantly in your Partner Wallet upon session completion and can be withdrawn directly to your verified Indian bank account or UPI ID with 24-hour settlement.'
  }
];

export default function FAQ({ setActivePage }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState(0);

  const categories = ['All', 'Platonic & Rules', 'Booking & OTP', 'Safety & SOS', 'Payments & Cancellations', 'For Partners'];

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.q.toLowerCase().includes(searchTerm.toLowerCase()) || item.a.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container" style={{ padding: '30px 16px 80px', maxWidth: '1000px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(56, 189, 248, 0.15)', padding: '6px 16px', borderRadius: '20px', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, marginBottom: '14px' }}>
          <HelpCircle size={16} /> 24/7 Knowledge & Support Hub
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', color: '#ffffff', marginBottom: '14px', lineHeight: 1.2 }}>
          Frequently Asked Questions
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto 28px', lineHeight: 1.6 }}>
          Everything you need to know about our platonic companionship services, public venue rules, safety OTP, and billing.
        </p>

        {/* Search input */}
        <div style={{ position: 'relative', maxWidth: '580px', margin: '0 auto' }}>
          <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search questions (e.g. OTP, public venues, refund, KYC)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 18px 14px 48px',
              fontSize: '1rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(30, 41, 59, 0.85)',
              border: '1px solid var(--border-active)',
              boxShadow: 'var(--shadow-md)'
            }}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.86rem',
              fontWeight: activeCategory === cat ? 700 : 500,
              background: activeCategory === cat ? 'linear-gradient(135deg, #7c3aed, #ec4899)' : 'rgba(30, 41, 59, 0.6)',
              color: activeCategory === cat ? '#ffffff' : '#94a3b8',
              border: activeCategory === cat ? 'none' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion FAQ List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '50px' }}>
        {filteredFaqs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            No questions found matching your search. Please reach out to our 24/7 support desk below.
          </div>
        ) : (
          filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                style={{
                  background: 'var(--bg-card)',
                  border: isOpen ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    gap: '16px',
                    color: isOpen ? '#c084fc' : '#ffffff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    background: isOpen ? 'rgba(124, 58, 237, 0.08)' : 'transparent'
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={20}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0,
                      color: isOpen ? '#c084fc' : '#64748b'
                    }}
                  />
                </button>

                {isOpen && (
                  <div style={{ padding: '0 24px 22px', color: '#cbd5e1', fontSize: '0.94rem', lineHeight: '1.7', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '16px' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still need help? Box */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95))',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '1.35rem', color: '#fff', marginBottom: '8px' }}>
          Still have unanswered questions?
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '22px' }}>
          Our Indian safety & customer experience specialists are available 24/7 to assist you.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <a
            href="tel:+919810535398"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: '#34d399',
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.88rem',
              fontWeight: 700
            }}
          >
            <Phone size={16} /> +91-98105-35398
          </a>
          <a
            href="mailto:support@partneronrent.in"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              color: '#38bdf8',
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.88rem',
              fontWeight: 700
            }}
          >
            <Mail size={16} /> support@partneronrent.in
          </a>
          <button
            onClick={() => setActivePage('contact')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(124, 58, 237, 0.2)',
              border: '1px solid rgba(124, 58, 237, 0.4)',
              color: '#c084fc',
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <MessageCircle size={16} /> Contact Us Page
          </button>
        </div>
      </div>

    </div>
  );
}
