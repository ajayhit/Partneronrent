import React, { useState } from 'react';
import {
  FileText,
  Shield,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Lock,
  DollarSign,
  Scale
} from 'lucide-react';

const GUIDELINE_SECTIONS = [
  {
    id: 'partner_guidelines',
    title: 'Partner Operational Guidelines',
    icon: FileText,
    content: `
1. Punctuality & Respect: Always arrive at least 5 minutes prior to the designated public venue meeting time.
2. Verified Hirers Only: Never accept offline bookings outside the platform. All sessions must have an active booking ID.
3. Dress Code: Neat, casual, and culturally respectful attire suitable for public dining or city walks.
4. Professional Demeanor: Maintain friendly, attentive, and respectful conversation at all times.
    `
  },
  {
    id: 'code_of_conduct',
    title: 'Platonic Code of Conduct',
    icon: Scale,
    content: `
1. Strictly Platonic: PartnerOnRent facilitates emotional wellness, urban company, and social companionship. Physical intimacy or romantic solicitations are strictly prohibited and result in permanent legal action and account deactivation.
2. Mutual Respect: You have the right to be treated with absolute courtesy. Any boundary transgression should be reported immediately.
3. No Off-Platform Solicitations: Never ask for or accept private cash transfers, gifts, or off-platform repeat engagements.
    `
  },
  {
    id: 'safety_rules',
    title: 'Safety Rules & Venue Regulations',
    icon: Shield,
    content: `
1. Public Venues Exclusively: Companionship is permitted only in well-lit, public commercial spaces (cafes, malls, public monuments, cinemas, public parks).
2. Never Enter Private Spaces: Companions are strictly forbidden from entering private residences, hotel rooms, or secluded vehicles.
3. Live Session Verification: Ensure the hirer provides their 4-digit start OTP before commencing the session timer.
4. Emergency SOS: If you feel uncomfortable, terminate the session immediately and press the in-app SOS button.
    `
  },
  {
    id: 'cancellation_policy',
    title: 'Cancellation & Tardiness Policy',
    icon: AlertCircle,
    content: `
1. Hirer Cancellations: If a client cancels with less than 2 hours notice, partner receives 50% compensation fee.
2. Hirer No-Show: If client does not arrive within 30 minutes of scheduled time, partner receives full 80% earnings payout upon raising a dispute.
3. Partner Cancellations: Please give at least 12 hours notice if you must cancel due to emergency. Repeated late partner cancellations impact directory visibility.
    `
  },
  {
    id: 'payment_policy',
    title: 'Payment & Payout Policy (80/20 Split)',
    icon: DollarSign,
    content: `
1. Transparent 80% Share: You retain 80% of all hourly booking fees. The platform retains 20% for insurance coverage, safety response, and technology infrastructure.
2. Instant Credit: Funds are credited to your withdrawable wallet balance the moment the session ends.
3. Payout Processing: UPI withdrawals are settled within 1 to 4 hours. NEFT/IMPS bank transfers are processed daily on banking days.
    `
  },
  {
    id: 'terms_privacy',
    title: 'Privacy Policy & Terms of Service',
    icon: Lock,
    content: `
1. Identity Shielding: Your sensitive identification details (Aadhaar number, PAN, residential address) are encrypted and never shown to hirers.
2. Photo Rights: Your public avatar and display name are shown solely on the verified discovery portal.
3. Confidentiality: Any personal stories, work discussions, or thoughts shared by hirers during platonic sessions must remain confidential.
    `
  }
];

export default function GuidelinesTab() {
  const [openSections, setOpenSections] = useState({ partner_guidelines: true, code_of_conduct: true });

  const toggleSection = (id) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
          📄 Partner Guidelines & Operational Policies
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
          Official rules, companion safety charter, cancellation frameworks, and operational guidelines.
        </p>
      </div>

      {/* Guidelines Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
        {GUIDELINE_SECTIONS.map(sec => {
          const Icon = sec.icon || FileText;
          const isOpen = openSections[sec.id];

          return (
            <div key={sec.id} className="partner-panel" style={{ padding: 0, overflow: 'hidden', marginBottom: 0 }}>
              <div
                onClick={() => toggleSection(sec.id)}
                style={{
                  padding: '18px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: isOpen ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={20} color="#34d399" />
                  <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ffffff' }}>
                    {sec.title}
                  </span>
                </div>
                {isOpen ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
              </div>

              {isOpen && (
                <div style={{
                  padding: '0 24px 20px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  color: '#cbd5e1',
                  fontSize: '0.86rem',
                  lineHeight: '1.7',
                  whiteSpace: 'pre-line'
                }}>
                  {sec.content.trim()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
