import React, { useState } from 'react';
import PolicyNav from '../components/PolicyNav';
import { 
  AlertTriangle, 
  ShieldCheck, 
  PhoneCall, 
  MapPin, 
  KeyRound, 
  Eye, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Radio, 
  ChevronRight,
  LifeBuoy,
  Smartphone,
  Navigation
} from 'lucide-react';

export default function SafetyGuidelines({ setActivePage }) {
  const [activeSection, setActiveSection] = useState('five-rules');

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sections = [
    { id: 'five-rules', title: '1. The 5 Golden Safety Commandments' },
    { id: 'hirer-rules', title: '2. Safety Manual for Hirers' },
    { id: 'partner-rules', title: '3. Safety Manual for Companions' },
    { id: 'sos-protocol', title: '4. One-Tap SOS Distress Protocol' },
    { id: 'emergency-contacts', title: '5. 24x7 India Emergency Hotlines' },
    { id: 'red-flags', title: '6. Recognizing Red Flags & Danger Signs' },
    { id: 'incident-reporting', title: '7. How to Report an Incident' }
  ];

  return (
    <div className="container" style={{ padding: '30px 16px 80px', maxWidth: '1200px' }}>
      {/* Policy switcher bar */}
      <PolicyNav activePage="safety" setActivePage={setActivePage} />

      {/* Hero Header with SOS Emergency quick notice */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.22) 0%, rgba(30, 41, 59, 0.85) 100%)',
        border: '1px solid rgba(244, 63, 94, 0.35)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px 32px',
        marginBottom: '36px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px'
      }}>
        <div style={{ maxWidth: '750px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(244, 63, 94, 0.25)', padding: '6px 14px', borderRadius: '20px', color: '#fca5a5', fontSize: '0.82rem', fontWeight: 700, marginBottom: '12px' }}>
            <Radio size={15} color="#f43f5e" className="pulse-dot" /> 24x7 Rapid Safety Response Stack
          </div>
          <h1 style={{ fontSize: '2.4rem', color: '#ffffff', marginBottom: '12px', lineHeight: 1.2 }}>
            Safety Guidelines & Platonic Protocol
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.02rem', lineHeight: 1.6, margin: 0 }}>
            Safety is not a feature at <strong style={{ color: '#ffffff' }}>PartnerOnRent</strong>; it is our foundation. These mandatory guidelines ensure every companion session is safe, dignified, consensual, and completely platonic.
          </p>
        </div>

        {/* Emergency Quick Box */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          minWidth: '260px',
          boxShadow: '0 8px 24px rgba(244, 63, 94, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: 700, fontSize: '0.9rem', marginBottom: '10px' }}>
            <AlertTriangle size={18} /> Safety Desk (India)
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
            +91-98105-35398
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px' }}>
            Live Operator Support • 24/7 Available
          </div>
          <a
            href="tel:112"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: '#ef4444',
              color: '#ffffff',
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.84rem',
              fontWeight: 700
            }}
          >
            <PhoneCall size={14} /> Dial National 112
          </a>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 280px) 1fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Table of Contents */}
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
            Safety Navigation
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
                  color: activeSection === sec.id ? '#f43f5e' : '#94a3b8',
                  background: activeSection === sec.id ? 'rgba(244, 63, 94, 0.15)' : 'transparent',
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
              Instant Safety Report
            </div>
            <a
              href="mailto:safety@partneronrent.in"
              style={{ color: '#f43f5e', fontSize: '0.82rem', fontWeight: 600, display: 'inline-block' }}
            >
              safety@partneronrent.in
            </a>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Section 1: The 5 Golden Safety Commandments */}
          <div id="five-rules" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={22} color="#10b981" />
              1. The 5 Golden Safety Commandments
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '20px' }}>
              Every interaction on PartnerOnRent is bound by five non-negotiable pillars of safety:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                {
                  num: '01',
                  title: '100% Public Venues Exclusively',
                  desc: 'All in-person sessions must occur in high-visibility public spaces (malls, cafes, parks, cinemas, restaurants). Never meet in private residences, hotel rooms, or secluded back-alleys.',
                  color: '#8b5cf6',
                  icon: MapPin
                },
                {
                  num: '02',
                  title: 'Strictly Platonic Boundaries',
                  desc: 'Physical intimacy, kissing, fondling, or sexual conduct of any kind is prohibited. We foster friendly conversations and companionship only.',
                  color: '#ec4899',
                  icon: AlertCircle
                },
                {
                  num: '03',
                  title: 'Mandatory 4-Digit Session OTP',
                  desc: 'Hirers receive an OTP in their dashboard. The companion must ask for this OTP in person before beginning the session timer to verify attendance.',
                  color: '#06b6d4',
                  icon: KeyRound
                },
                {
                  num: '04',
                  title: 'Zero Cash / In-App Payments Only',
                  desc: 'Never hand over cash or accept off-platform transfers. All payments are escrowed within the platform wallet to protect both sides against fraud and dispute.',
                  color: '#10b981',
                  icon: ShieldCheck
                },
                {
                  num: '05',
                  title: 'Sobriety & Zero Intoxicants',
                  desc: 'Neither client nor partner may be under the influence of alcohol, narcotics, or prohibited psychoactive substances during an active booking.',
                  color: '#f59e0b',
                  icon: AlertTriangle
                }
              ].map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <div key={cmd.num} style={{ display: 'flex', gap: '16px', background: 'rgba(15, 23, 42, 0.6)', border: `1px solid ${cmd.color}33`, borderRadius: 'var(--radius-sm)', padding: '16px' }}>
                    <div style={{ background: `${cmd.color}22`, border: `1px solid ${cmd.color}55`, color: cmd.color, width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 800, fontSize: '0.95rem' }}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>
                        {cmd.num}. {cmd.title}
                      </div>
                      <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0, lineHeight: '1.6' }}>
                        {cmd.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Manual for Hirers */}
          <div id="hirer-rules" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={22} color="#06b6d4" />
              2. Safety Manual for Hirers (Clients)
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '18px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.95rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> What You Should Do
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>Meet companions inside well-lit, populated public commercial spaces.</li>
                  <li>Verify the partner matches their profile portrait photo before providing the 4-digit OTP.</li>
                  <li>Respect personal physical space and maintain dignified polite conversation.</li>
                  <li>Pay for your companion’s food/drinks during meals or cinema tickets.</li>
                  <li>Report any suspicious behavior immediately via the in-app safety tool.</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '18px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ color: '#f87171', fontWeight: 700, fontSize: '0.95rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <XCircle size={16} /> What is Strictly Forbidden
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>Never request companionship at private homes, Airbnbs, or hotel rooms.</li>
                  <li>Never make romantic, sexual, or intimate propositions.</li>
                  <li>Never ask for personal contact numbers, private Instagram, or home address.</li>
                  <li>Never offer cash bonuses or propose meeting outside the app.</li>
                  <li>Never record videos or snap unauthorized photographs of your companion.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Manual for Companions */}
          <div id="partner-rules" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={22} color="#10b981" />
              3. Safety Manual for Companions (Partners)
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '6px' }}>Pre-Session Checklist</strong>
                Ensure your smartphone is charged at least 60%, mobile GPS/location is enabled, and your emergency contact is aware of your booking location.
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '6px' }}>Venue Verification</strong>
                If a client changes the meeting place to a private residence, motel, or unpopulated area, refuse immediately and trigger a safety alert.
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '6px' }}>Right to Exit (No Penalties)</strong>
                You retain an absolute right to immediately leave any session if a client behaves inappropriately or makes you uncomfortable. Full payment is protected.
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '6px' }}>Zero Offline Transactions</strong>
                Never accept cash or agree to take bookings offline. Doing so forfeits your safety insurance and results in instant platform de-registration.
              </div>
            </div>
          </div>

          {/* Section 4: SOS Distress Protocol */}
          <div id="sos-protocol" className="policy-card" style={{ background: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={22} color="#ef4444" />
              4. One-Tap SOS Distress Protocol
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '14px' }}>
              The red SOS Emergency button is visible at all times in the header of the app and inside active booking drawers. Here is exactly what happens when you press it:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: 'var(--radius-sm)', borderTop: '3px solid #ef4444' }}>
                <div style={{ color: '#f87171', fontWeight: 800, fontSize: '0.85rem', marginBottom: '6px' }}>STEP 1: INSTANT ALERT</div>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0, lineHeight: '1.5' }}>
                  A high-priority emergency ticket flashes on our 24/7 Safety Command Center screens with an audible siren.
                </p>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: 'var(--radius-sm)', borderTop: '3px solid #ef4444' }}>
                <div style={{ color: '#f87171', fontWeight: 800, fontSize: '0.85rem', marginBottom: '6px' }}>STEP 2: LIVE GPS BEACON</div>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0, lineHeight: '1.5' }}>
                  Your live latitude and longitude are recorded and shared with emergency dispatchers to locate you instantly.
                </p>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: 'var(--radius-sm)', borderTop: '3px solid #ef4444' }}>
                <div style={{ color: '#f87171', fontWeight: 800, fontSize: '0.85rem', marginBottom: '6px' }}>STEP 3: SMS DISPATCH</div>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0, lineHeight: '1.5' }}>
                  An automated SOS SMS with a live Google Maps tracking link is fired to your pre-saved emergency contact number.
                </p>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '16px', borderRadius: 'var(--radius-sm)', borderTop: '3px solid #ef4444' }}>
                <div style={{ color: '#f87171', fontWeight: 800, fontSize: '0.85rem', marginBottom: '6px' }}>STEP 4: POLICE ESCALATION</div>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0, lineHeight: '1.5' }}>
                  If contact cannot be established within 120 seconds, our desk escalates directly to nearest Police PCR (112).
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Emergency Hotlines */}
          <div id="emergency-contacts" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PhoneCall size={22} color="#38bdf8" />
              5. 24x7 India Emergency Hotlines
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '16px' }}>
              If you or anyone around you is in immediate danger, you can dial these national emergency services directly:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              {[
                { name: 'National Emergency Helpline', number: '112', desc: 'Police, Fire & Ambulance Integration', color: '#ef4444' },
                { name: 'Women in Distress (National)', number: '1091', desc: 'NCW 24/7 Safety Cell', color: '#ec4899' },
                { name: 'Women Helpline (UP & Delhi)', number: '1090', desc: 'Women Power Line', color: '#a855f7' },
                { name: 'Child Helpline (POCSO)', number: '1098', desc: 'Child Protection Assistance', color: '#38bdf8' },
                { name: 'Senior Citizen Helpline', number: '14567', desc: 'Elder Abuse & Assistance Line', color: '#10b981' },
                { name: 'PartnerOnRent Safety Desk', number: '+91 98105 35398', desc: 'In-House Rapid Incident Team', color: '#f59e0b' }
              ].map((hl) => (
                <div key={hl.number} style={{ background: 'rgba(15, 23, 42, 0.6)', border: `1px solid ${hl.color}44`, padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>{hl.name}</div>
                  <a href={`tel:${hl.number.replace(/\s+/g, '')}`} style={{ fontSize: '1.25rem', fontWeight: 800, color: hl.color, display: 'block', marginBottom: '4px' }}>
                    {hl.number} 📞
                  </a>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>{hl.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Red Flags */}
          <div id="red-flags" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Eye size={22} color="#f59e0b" />
              6. Recognizing Red Flags & Danger Signs
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { title: 'Pressure to shift to a private vehicle or isolated spot', detail: 'Never agree to enter a personal car or leave a public mall/cafe to go elsewhere.' },
                { title: 'Asking for personal social handles or phone number prior to meeting', detail: 'All communication must remain in-app to maintain audit trails for safety.' },
                { title: 'Offers to pay extra cash for non-platonic favors', detail: 'This is a strict platform violation. Refuse immediately and report the user.' },
                { title: 'Refusing to share or enter the 4-digit session OTP', detail: 'The OTP protects you against fake claims. Do not proceed without entering the OTP.' },
                { title: 'Aggressive, manipulative, or emotionally guilt-tripping behavior', detail: 'You are entitled to exit the conversation and block the individual instantly.' }
              ].map((rf, idx) => (
                <div key={idx} style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '14px 16px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <AlertTriangle size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ color: '#fef3c7', fontWeight: 600, fontSize: '0.9rem' }}>{rf.title}</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{rf.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: Incident Reporting */}
          <div id="incident-reporting" className="policy-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '28px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LifeBuoy size={22} color="#8b5cf6" />
              7. How to File an Incident Report
            </h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.7', marginBottom: '14px' }}>
              If you experience any unpleasant behavior, safety breach, or policy violation:
            </p>
            <ol style={{ color: '#cbd5e1', lineHeight: '1.8', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.92rem' }}>
              <li>Open your <strong>Client or Partner Dashboard</strong> &gt; navigate to the <strong>Safety Center</strong> tab.</li>
              <li>Tap <strong>"File Incident Report"</strong> and select the booking ID and nature of grievance.</li>
              <li>Upload screenshots of chats or describe the incident in detail.</li>
              <li>Our dedicated Safety Escalations Team will freeze the accused party’s account pending formal investigation within 2 hours.</li>
            </ol>
          </div>

        </div>
      </div>
    </div>
  );
}
