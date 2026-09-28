import React, { useState } from 'react';
import PolicyNav from '../components/PolicyNav';
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  UserCheck, 
  Trash2, 
  FileCheck, 
  Mail, 
  ChevronRight,
  Server,
  MapPin,
  Clock,
  Printer
} from 'lucide-react';

export default function PrivacyPolicy({ setActivePage }) {
  const [activeSection, setActiveSection] = useState('overview');

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sections = [
    { id: 'overview', title: '1. Privacy Overview & DPDP Compliance' },
    { id: 'data-collected', title: '2. Information We Collect' },
    { id: 'kyc-data', title: '3. Partner KYC & Govt ID Protection' },
    { id: 'location-safety', title: '4. Location Data & SOS Tracking' },
    { id: 'data-usage', title: '5. How We Use Information' },
    { id: 'data-sharing', title: '6. Data Sharing & Disclosures' },
    { id: 'data-security', title: '7. Data Security & Storage in India' },
    { id: 'user-rights', title: '8. Your Rights (Access & Erasure)' },
    { id: 'cookies', title: '9. Cookies & Local Storage' },
    { id: 'grievance', title: '10. Grievance Officer & Contact' }
  ];

  return (
    <div className="container" style={{ padding: '30px 16px 80px', maxWidth: '1200px' }}>
      {/* Policy switcher bar */}
      <PolicyNav activePage="privacy" setActivePage={setActivePage} />

      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(30, 41, 59, 0.8) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.3)',
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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(6, 182, 212, 0.2)', padding: '6px 14px', borderRadius: '20px', color: '#38bdf8', fontSize: '0.82rem', fontWeight: 600, marginBottom: '12px' }}>
            <Shield size={15} /> DPDP Act (2023) & IT Act Compliant
          </div>
          <h1 style={{ fontSize: '2.4rem', color: '#ffffff', marginBottom: '12px', lineHeight: 1.2 }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.02rem', lineHeight: 1.6, margin: 0 }}>
            At <strong style={{ color: '#ffffff' }}>PartnerOnRent</strong>, we respect your privacy. We are committed to safeguarding your personal data, KYC documents, and geolocation with banking-grade security and transparency.
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
            <Printer size={16} /> Print Policy
          </button>
          <div style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
            Effective: September 2026
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
            Privacy Sections
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
                  color: activeSection === sec.id ? '#38bdf8' : '#94a3b8',
                  background: activeSection === sec.id ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
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
              Data Protection Desk
            </div>
            <a
              href="mailto:privacy@partneronrent.in"
              style={{ color: '#38bdf8', fontSize: '0.82rem', fontWeight: 600, display: 'inline-block' }}
            >
              privacy@partneronrent.in
            </a>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Section 1 */}
          <div id="overview" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={22} color="#06b6d4" />
              1. Privacy Overview & DPDP Compliance
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '12px' }}>
              PartnerOnRent ("Platform", "we", "us") values your trust. This Privacy Policy outlines our standards for collecting, using, safeguarding, and disclosing personal data across all Indian states and Union Territories.
            </p>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '0' }}>
              This document is prepared in strict conformity with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>, the <strong>Information Technology Act, 2000 (IT Act)</strong>, and the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>.
            </p>
          </div>

          {/* Section 2 */}
          <div id="data-collected" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Database size={22} color="#8b5cf6" />
              2. Information We Collect
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '14px' }}>
              We collect information directly provided by you, as well as data automatically gathered during your usage:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: '#c084fc', display: 'block', marginBottom: '6px' }}>Profile Information</strong>
                Full legal name, phone number, email address, gender, profile portrait photos, language proficiencies, bio, and hobbies.
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: '#c084fc', display: 'block', marginBottom: '6px' }}>Transaction & Wallet Data</strong>
                Payment IDs, UPI VPA handles, bank account details for companion payouts, wallet ledger records, and billing receipts.
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: '#c084fc', display: 'block', marginBottom: '6px' }}>Communications & Chat Logs</strong>
                In-app text chats, scheduling timestamps, and reviews. In-app chats are monitored solely for safety, harassment detection, and spam prevention.
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: '#c084fc', display: 'block', marginBottom: '6px' }}>Technical & Device Data</strong>
                IP address, browser type, device operating system, network connection type, and crash diagnostics.
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div id="kyc-data" className="policy-card" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserCheck size={22} color="#10b981" />
              3. Partner KYC & Govt ID Protection
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '14px' }}>
              To ensure unmatched platform safety, all registered companions must undergo mandatory KYC verification.
            </p>
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid #10b981', marginBottom: '14px' }}>
              <div style={{ color: '#34d399', fontWeight: 700, marginBottom: '6px' }}>How your identity documents are protected:</div>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6' }}>
                <li>Aadhaar numbers are masked (only last 4 digits stored in logs).</li>
                <li>Uploaded ID proofs (PAN, Voter ID, Passport) are stored in encrypted, non-public cloud vaults (AES-256).</li>
                <li>Your Government ID documents are NEVER visible to clients or the public. Clients only see your verified badge, first name, and validated bio.</li>
                <li>KYC verification is conducted strictly through licensed verification providers.</li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div id="location-safety" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={22} color="#ec4899" />
              4. Location Data & SOS Tracking
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '12px' }}>
              <strong>Public Venue Verification:</strong> With your permission, we collect precise GPS location coordinates during active companion sessions to ensure meetings happen in verified public venues (cafes, malls, parks).
            </p>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '0' }}>
              <strong>Emergency SOS Broadcast:</strong> If you trigger the SOS Distress button or send an emergency alert, your live GPS location is immediately transmitted to our 24/7 Safety Desk and dispatched to your pre-saved emergency contacts and police authorities if necessary.
            </p>
          </div>

          {/* Section 5 */}
          <div id="data-usage" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Eye size={22} color="#f59e0b" />
              5. How We Use Information
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '14px' }}>
              We use personal data strictly for legitimate operational purposes:
            </p>
            <ul style={{ color: '#cbd5e1', lineHeight: '1.7', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>Facilitating platonic companionship search, scheduling, and hourly bookings.</li>
              <li>Validating identity via 4-digit session OTP and public venue matching.</li>
              <li>Processing escrow payments, wallet top-ups, and automated bank payouts.</li>
              <li>Monitoring platform safety, investigating harassment reports, and enforcing zero-tolerance policies.</li>
              <li>Complying with statutory audits, taxation (TDS/GST), and anti-money laundering (AML) guidelines.</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div id="data-sharing" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileCheck size={22} color="#38bdf8" />
              6. Data Sharing & Third-Party Disclosures
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '12px' }}>
              <strong>We DO NOT sell, rent, or trade your personal data to advertisers or third-party marketing companies. Ever.</strong>
            </p>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '10px' }}>
              We disclose information only in the following limited scenarios:
            </p>
            <ul style={{ color: '#cbd5e1', lineHeight: '1.7', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><strong>Law Enforcement Requests:</strong> When required by a valid court order, warrant, or statutory request from Indian police authorities under the Bharatiya Nagarik Suraksha Sanhita (BNSS) or IT Act.</li>
              <li><strong>Emergency First Responders:</strong> To emergency contacts or ambulance/police services during active SOS distress situations.</li>
              <li><strong>Trusted Infrastructure Partners:</strong> Cloud hosting providers and RBI-licensed payment gateways bound by strict data processing confidentiality agreements.</li>
            </ul>
          </div>

          {/* Section 7 */}
          <div id="data-security" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Server size={22} color="#8b5cf6" />
              7. Data Security & Storage Within India
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '12px' }}>
              In compliance with Government of India data localization guidelines, all primary databases, server backups, and KYC vaults are located within certified data centers situated within the territory of India (Mumbai & Delhi NCR clusters).
            </p>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '0' }}>
              We utilize TLS 1.3 encryption for data in transit, AES-256 for data at rest, role-based access control (RBAC), and automated vulnerability assessments to defend against unauthorized intrusion.
            </p>
          </div>

          {/* Section 8 */}
          <div id="user-rights" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Trash2 size={22} color="#10b981" />
              8. Your Rights as a Data Principal
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '12px' }}>
              Under the DPDP Act 2023, you have clear and enforceable rights over your personal data:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>Right to Access</strong>
                Request a copy of your stored profile, booking history, and wallet ledgers.
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>Right to Correction</strong>
                Update inaccurate or outdated information in your profile settings.
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>Right to Erasure</strong>
                Request account closure and deletion of non-statutory records.
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>Right to Nominate</strong>
                Nominate an individual to manage rights in case of death or incapacity.
              </div>
            </div>
          </div>

          {/* Section 9 */}
          <div id="cookies" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock size={22} color="#06b6d4" />
              9. Cookies & Browser Storage
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '0' }}>
              We use secure cookies and browser LocalStorage strictly for session authentication, maintaining your sign-in state, remembering filter preferences, and caching public companion profiles to reduce latency. We do not use third-party tracking cookies across external websites.
            </p>
          </div>

          {/* Section 10 */}
          <div id="grievance" className="policy-card" style={{ background: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={22} color="#8b5cf6" />
              10. Grievance Redressal Officer
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '14px' }}>
              In accordance with Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, and the DPDP Act 2023, the details of our designated Grievance Officer are:
            </p>
            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.8rem' }}>Name of Officer:</span>
                  <strong style={{ color: '#fff' }}>Adv. Raghav Malhotra</strong>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.8rem' }}>Designation:</span>
                  <strong style={{ color: '#fff' }}>Chief Data Protection & Grievance Officer</strong>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.8rem' }}>Email Address:</span>
                  <a href="mailto:grievance@partneronrent.in" style={{ color: '#38bdf8', fontWeight: 600 }}>grievance@partneronrent.in</a>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.8rem' }}>Address:</span>
                  <span style={{ color: '#cbd5e1' }}>PartnerOnRent Corporate Tower, Connaught Place, New Delhi - 110001</span>
                </div>
              </div>
              <div style={{ marginTop: '14px', fontSize: '0.82rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> Grievances are formally acknowledged within 24 hours and resolved within 15 working days.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
