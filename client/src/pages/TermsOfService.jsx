import React, { useState } from 'react';
import PolicyNav from '../components/PolicyNav';
import { 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  DollarSign, 
  Scale, 
  Clock, 
  MapPin, 
  ChevronRight,
  Printer
} from 'lucide-react';

export default function TermsOfService({ setActivePage }) {
  const [activeSection, setActiveSection] = useState('acceptance');

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sections = [
    { id: 'acceptance', title: '1. Acceptance of Terms' },
    { id: 'platonic-nature', title: '2. Strictly Platonic Nature (Crucial)' },
    { id: 'eligibility', title: '3. Eligibility & User Identity' },
    { id: 'public-venues', title: '4. Public Venues Requirement' },
    { id: 'booking-otp', title: '5. Bookings, OTP & Escrow' },
    { id: 'pricing-cancellation', title: '6. Pricing, Payments & Cancellations' },
    { id: 'prohibited-conduct', title: '7. Prohibited Conduct & Penalties' },
    { id: 'disclaimer', title: '8. Disclaimer & Relationship' },
    { id: 'termination', title: '9. Account Suspension & Ban' },
    { id: 'jurisdiction', title: '10. Governing Law & Dispute Resolution' }
  ];

  return (
    <div className="container" style={{ padding: '30px 16px 80px', maxWidth: '1200px' }}>
      {/* Policy switcher bar */}
      <PolicyNav activePage="terms" setActivePage={setActivePage} />

      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(30, 41, 59, 0.8) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(124, 58, 237, 0.2)', padding: '6px 14px', borderRadius: '20px', color: '#c084fc', fontSize: '0.82rem', fontWeight: 600, marginBottom: '12px' }}>
            <FileText size={15} /> Legal Binding Agreement
          </div>
          <h1 style={{ fontSize: '2.4rem', color: '#ffffff', marginBottom: '12px', lineHeight: 1.2 }}>
            Terms of Service
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.02rem', lineHeight: 1.6, margin: 0 }}>
            Welcome to <strong style={{ color: '#ffffff' }}>PartnerOnRent</strong>. By registering an account, booking a companion, or listing your companionship profile, you enter into a legally binding contract under the laws of India.
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
            <Printer size={16} /> Print Terms
          </button>
          <div style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
            Last Revision: Sept 2026
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 280px) 1fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Sticky Table of Contents sidebar */}
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
            Table of Contents
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
                  color: activeSection === sec.id ? '#c084fc' : '#94a3b8',
                  background: activeSection === sec.id ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
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
              Questions about these terms?
            </div>
            <a
              href="mailto:legal@partneronrent.in"
              style={{ color: '#38bdf8', fontSize: '0.82rem', fontWeight: 600, display: 'inline-block' }}
            >
              legal@partneronrent.in
            </a>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Section 1 */}
          <div id="acceptance" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Scale size={22} color="#8b5cf6" />
              1. Acceptance of Terms
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '14px' }}>
              These Terms of Service ("Terms") govern your access to and use of the website, mobile web, services, and applications provided by <strong>PartnerOnRent India Pvt. Ltd.</strong> ("PartnerOnRent", "we", "us", or "our").
            </p>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '0' }}>
              By tapping "Register", "Sign In", "Book Partner", or by continuing to navigate our platform, you explicitly acknowledge that you have read, understood, and agreed to be bound by these Terms, along with our <span style={{ color: '#38bdf8', cursor: 'pointer' }} onClick={() => setActivePage('privacy')}>Privacy Policy</span> and <span style={{ color: '#f43f5e', cursor: 'pointer' }} onClick={() => setActivePage('safety')}>Safety Guidelines</span>. If you do not agree to any part of these Terms, you must discontinue using the platform immediately.
            </p>
          </div>

          {/* Section 2: Platonic Nature */}
          <div id="platonic-nature" className="policy-card" style={{ background: 'rgba(236, 72, 153, 0.06)', border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(236, 72, 153, 0.2)', padding: '4px 12px', borderRadius: '14px', color: '#f472b6', fontSize: '0.78rem', fontWeight: 700, marginBottom: '12px' }}>
              CORE PLATFORM FOUNDATION
            </div>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={22} color="#ec4899" />
              2. Strictly Platonic Nature & Anti-Solicitation Covenant
            </h2>
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid #ec4899', marginBottom: '16px' }}>
              <strong style={{ color: '#f472b6', display: 'block', marginBottom: '6px' }}>
                ZERO-TOLERANCE PLATONIC MANDATE:
              </strong>
              <p style={{ color: '#f1f5f9', margin: 0, fontSize: '0.94rem', lineHeight: '1.6' }}>
                PartnerOnRent is solely an emotional wellness, social companionship, and professional accompaniment platform designed to combat loneliness, provide company for social activities, and assist with errands. <strong>Under no circumstances is PartnerOnRent an escort agency, adult dating portal, or sexual matchmaking service.</strong>
              </p>
            </div>
            <ul style={{ color: '#cbd5e1', lineHeight: '1.7', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <strong>No Physical Intimacy:</strong> Any form of sexual contact, romantic proposition, nudity, kissing, or illicit touch is strictly prohibited. Handshakes and respectful non-intrusive greetings are permissible if mutually consented to.
              </li>
              <li>
                <strong>Compliance with Indian Law:</strong> Both users (Hirers) and companions (Partners) must strictly comply with the Immoral Traffic (Prevention) Act, 1956 (ITPA), Information Technology Act, 2000, and Bharatiya Nyaya Sanhita (BNS) / Indian Penal Code.
              </li>
              <li>
                <strong>Immediate Legal Reporting:</strong> Any solicitation of prostitution or commercial sexual favors will result in immediate termination of the account, permanent blacklisting of Government KYC documents, forfeiture of deposits, and forwarding of chat logs/identity to local law enforcement authorities.
              </li>
            </ul>
          </div>

          {/* Section 3: Eligibility */}
          <div id="eligibility" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={22} color="#10b981" />
              3. Eligibility & User Identity
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '14px' }}>
              To access or use PartnerOnRent, you warrant and represent that:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '4px' }}>Age 18+ Only</strong>
                You are at least 18 years of age. Minors are strictly prohibited from creating accounts, hiring companions, or acting as partners.
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '4px' }}>Mandatory Govt ID KYC</strong>
                All partners must submit verified Indian identity documents (Aadhaar Card, PAN Card, Voter ID, or Passport) prior to receiving bookings.
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '4px' }}>Authentic Information</strong>
                All profile photos and personal bios must truthfully depict the actual registered individual. Impersonation is a punishable cyber offense.
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '4px' }}>Single Account Policy</strong>
                Each user or companion is restricted to one verified account linked to their authenticated phone number and PAN.
              </div>
            </div>
          </div>

          {/* Section 4: Public Venues */}
          <div id="public-venues" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={22} color="#f59e0b" />
              4. Mandatory Public Venues Requirement
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '14px' }}>
              For the mutual safety and integrity of both clients and companions, <strong>all in-person sessions must occur solely in open, public, commercially accessible venues</strong>.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 700, marginBottom: '8px' }}>
                  <CheckCircle2 size={18} /> Permitted Locations
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '0.88rem', lineHeight: '1.6' }}>
                  <li>Cafes, Coffee Shops & Bakeries</li>
                  <li>Shopping Malls & Public Arcades</li>
                  <li>Multiplex Movie Theatres</li>
                  <li>Public Parks, Promenades & Museums</li>
                  <li>Restaurants & Food Courts</li>
                  <li>Hospitals & Medical Clinics (for visits)</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: 700, marginBottom: '8px' }}>
                  <XCircle size={18} /> Strictly Prohibited Locations
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '0.88rem', lineHeight: '1.6' }}>
                  <li>Private Residences & Apartments</li>
                  <li>Hotel Rooms, Guest Houses & OYO Stays</li>
                  <li>Private Farmhouses & Isolated Villas</li>
                  <li>Private Vehicle Enclosures / Tinted Cars</li>
                  <li>Nightclub VIP Lounges with locked doors</li>
                  <li>Any secluded or inaccessible zones</li>
                </ul>
              </div>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.86rem', margin: 0 }}>
              Companions are empowered and required to immediately decline any booking or relocate/exit if requested to enter a non-public venue, with full payment protection.
            </p>
          </div>

          {/* Section 5: Booking, OTP & Escrow */}
          <div id="booking-otp" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={22} color="#06b6d4" />
              5. Bookings, Session OTP & Escrow Protocol
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '12px' }}>
              All appointments must be initiated, scheduled, and recorded exclusively through the PartnerOnRent platform.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#cbd5e1', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ background: '#7c3aed', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem', fontWeight: 700 }}>1</div>
                <div>
                  <strong>Session Start OTP Verification:</strong> Upon booking confirmation, a confidential 4-digit One-Time Password (OTP) is generated for the Hirer. The session timer will NOT start and payments will not clear until the Hirer physically meets the Partner at the public venue and provides this OTP.
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ background: '#7c3aed', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem', fontWeight: 700 }}>2</div>
                <div>
                  <strong>Platform Escrow:</strong> Client funds are securely debited and held in platform escrow. Funds are only disbursed to the partner's wallet upon verified completion of the agreed hours without safety violations.
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ background: '#7c3aed', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem', fontWeight: 700 }}>3</div>
                <div>
                  <strong>Off-Platform Contact Prohibition:</strong> Requesting personal WhatsApp, direct phone calls, or bypassing platform escrow before booking constitutes a breach of contract resulting in immediate account termination.
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Pricing & Cancellations */}
          <div id="pricing-cancellation" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <DollarSign size={22} color="#10b981" />
              6. Pricing, Payments & Cancellation Rules
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '14px' }}>
              All transactions on PartnerOnRent are processed in Indian Rupees (INR) through authorized RBI-compliant payment gateways.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '6px' }}>Hourly Fee Calculation</strong>
                Rates are billed on an hourly basis as displayed on the companion's profile. Extension beyond agreed hours requires an in-app extension booking.
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '6px' }}>Client Cancellation Policy</strong>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <li>&gt; 2 hours before session: 100% refund.</li>
                  <li>&lt; 2 hours before session: 50% cancellation fee.</li>
                  <li>No-Show after 15 mins: 100% forfeiture.</li>
                </ul>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '6px' }}>Partner Cancellation</strong>
                If a partner cancels or fails to arrive, the client receives an instantaneous 100% refund to their in-app wallet or original payment source.
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '6px' }}>Ancillary Expenses</strong>
                Movie tickets, cafe beverages, meals, and parking during the session are the financial responsibility of the Hirer unless mutually agreed in advance.
              </div>
            </div>
          </div>

          {/* Section 7: Prohibited Conduct */}
          <div id="prohibited-conduct" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={22} color="#f43f5e" />
              7. Prohibited Conduct & Penalties
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '14px' }}>
              Users agree not to engage in any of the following restricted activities:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
              {[
                'Intoxication or consumption of alcohol/drugs during sessions',
                'Harassment, stalking, persistent texting or psychological coercion',
                'Soliciting loans, investments, donations or gifts',
                'Recording video, taking unauthorized photos or live streaming',
                'Entering private quarters or vehicle backseats',
                'Offering or demanding cash offline to bypass platform fees',
                'Using hateful, abusive, casteist, or defamatory language',
                'Filing fraudulent SOS distress reports or fake chargebacks'
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(244, 63, 94, 0.08)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(244, 63, 94, 0.2)', fontSize: '0.85rem', color: '#fecdd3' }}>
                  <XCircle size={16} color="#f43f5e" style={{ flexShrink: 0 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 8: Disclaimer */}
          <div id="disclaimer" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <HelpCircle size={22} color="#94a3b8" />
              8. Independent Contractor Relationship & Liability Disclaimer
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '12px' }}>
              <strong>Platform as Intermediary:</strong> PartnerOnRent operates solely as an electronic intermediary connecting independent companions with clients under Section 79 of the Information Technology Act, 2000. Companions listed on the platform are independent service providers, not employees, agents, or joint venturers of PartnerOnRent.
            </p>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '0' }}>
              While PartnerOnRent executes KYC checks and provides real-time SOS monitoring, PartnerOnRent is not responsible for the independent personal actions, verbal statements, or conduct of any user outside our prescribed safety guidelines.
            </p>
          </div>

          {/* Section 9: Termination */}
          <div id="termination" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <XCircle size={22} color="#ef4444" />
              9. Account Suspension & Ban
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '12px' }}>
              PartnerOnRent reserves the unilateral right to suspend, terminate, or permanently ban any account with immediate effect if:
            </p>
            <ul style={{ color: '#cbd5e1', lineHeight: '1.7', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>A user violates the Platonic Mandate or Safety Guidelines.</li>
              <li>A companion receives consecutive ratings below 3.5 stars or multiple safety flags.</li>
              <li>Any fraudulent KYC or payment chargeback is detected.</li>
              <li>A safety complaint or SOS dispatch investigation reveals misconduct.</li>
            </ul>
          </div>

          {/* Section 10: Jurisdiction */}
          <div id="jurisdiction" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Scale size={22} color="#8b5cf6" />
              10. Governing Law & Dispute Resolution
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '12px' }}>
              These Terms shall be governed by, construed, and enforced in accordance with the laws of the Republic of India.
            </p>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '0' }}>
              Any legal action, suit, or proceeding arising out of or related to these Terms or the platform shall be instituted exclusively in the competent courts located in <strong>New Delhi, India</strong>, and each party irrevocably submits to the exclusive personal jurisdiction of such courts.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
