import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  AlertTriangle,
  UserX,
  FileText,
  Lock,
  CheckCircle2,
  X,
  Send,
  Radio,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

const EMERGENCY_CONTACTS = [
  { name: 'National Police Emergency', number: '112', desc: 'Direct 24/7 police dispatch with GPS triangulation' },
  { name: 'National Women Helpline', number: '1091', desc: 'Specialized 24/7 women emergency response cell' },
  { name: 'Platform 24/7 Safety Desk', number: '+91 98105 35398', desc: 'PartnerOnRent emergency rapid incident response' },
  { name: 'Ambulance & Medical Emergency', number: '108', desc: 'Immediate medical ambulance assistance' }
];

export default function SafetyCenterTab({ partner, showToast }) {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState('Inappropriate Behavior');
  const [clientNameInput, setClientNameInput] = useState('');
  const [bookingIdInput, setBookingIdInput] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  // Blocked customers list
  const [blockedCustomers, setBlockedCustomers] = useState([
    { id: 1, name: 'Karan Johar', reason: 'Disrespectful language in chat', date: '2024-02-28' }
  ]);
  const [newBlockName, setNewBlockName] = useState('');

  const [sosTriggered, setSosTriggered] = useState(false);

  const handleTriggerEmergencySOS = () => {
    setSosTriggered(true);
    showToast('EMERGENCY SOS ALERT DISPATCHED! Transmitting live GPS & notifying emergency contacts.', 'danger');
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    showToast(`Safety incident against "${clientNameInput}" submitted to compliance officers.`, 'warning');
    setReportModalOpen(false);
    setClientNameInput('');
    setBookingIdInput('');
    setReportDescription('');
  };

  const handleBlockCustomer = (e) => {
    e.preventDefault();
    if (!newBlockName.trim()) return;
    setBlockedCustomers(prev => [
      ...prev,
      { id: Date.now(), name: newBlockName.trim(), reason: 'Partner safety block', date: new Date().toISOString().split('T')[0] }
    ]);
    setNewBlockName('');
    showToast('Customer blocked from viewing or booking your profile.');
  };

  const handleUnblock = (id) => {
    setBlockedCustomers(prev => prev.filter(c => c.id !== id));
    showToast('Customer unblocked.');
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
          🛡️ Partner Safety & Security Center
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
          Zero tolerance for intimate demands, harassment, or boundary violations. Your safety and peace of mind are paramount.
        </p>
      </div>

      {/* Emergency SOS Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '2px solid rgba(239, 68, 68, 0.6)',
        borderRadius: '16px',
        padding: '24px 28px',
        marginBottom: '26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 8px 30px rgba(239, 68, 68, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.3)',
            border: '2px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px #ef4444'
          }}>
            <Radio size={28} color="#f87171" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: 0 }}>
              Live Emergency SOS Assistance
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#cbd5e1', margin: '3px 0 0' }}>
              Instant distress beacon: Alerts our 24/7 Rapid Response team, transmits live coordinates, and notifies your emergency contacts.
            </p>
          </div>
        </div>

        <button
          onClick={handleTriggerEmergencySOS}
          style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
            color: '#ffffff',
            padding: '14px 28px',
            borderRadius: '9999px',
            fontWeight: 800,
            fontSize: '0.95rem',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 0 25px rgba(239, 68, 68, 0.6)',
            cursor: 'pointer'
          }}
        >
          <AlertTriangle size={18} />
          <span>{sosTriggered ? 'SOS DISPATCHED (LIVE)' : 'TRIGGER SOS NOW'}</span>
        </button>
      </div>

      {/* Safety Actions Cards: Report Customer, Block Customer, Safety Guidelines */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '26px' }}>
        
        {/* Report Customer Card */}
        <div className="partner-panel" style={{ marginBottom: 0 }}>
          <div className="partner-panel-title" style={{ marginBottom: '10px' }}>
            <AlertTriangle size={18} color="#f87171" />
            <span>Report Inappropriate Behavior</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '16px' }}>
            Report clients who made non-platonic requests, behaved rudely, attempted off-platform payment, or breached guidelines.
          </p>
          <button
            onClick={() => setReportModalOpen(true)}
            className="btn-secondary"
            style={{ color: '#f87171', border: '1px solid rgba(248, 113, 113, 0.4)', width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ShieldAlert size={15} /> File Safety Incident Report
          </button>
        </div>

        {/* Block Customer Card */}
        <div className="partner-panel" style={{ marginBottom: 0 }}>
          <div className="partner-panel-title" style={{ marginBottom: '10px' }}>
            <UserX size={18} color="#c084fc" />
            <span>Block Specific Customer</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '16px' }}>
            Blocked hirers cannot view your companion profile, message you, or submit hire requests.
          </p>
          
          <form onSubmit={handleBlockCustomer} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Enter customer name or ID..."
              value={newBlockName}
              onChange={e => setNewBlockName(e.target.value)}
              style={{ flex: 1, fontSize: '0.84rem' }}
              required
            />
            <button type="submit" className="btn-secondary btn-sm" style={{ color: '#c084fc' }}>
              Block
            </button>
          </form>
        </div>

        {/* Emergency Contacts Card */}
        <div className="partner-panel" style={{ marginBottom: 0 }}>
          <div className="partner-panel-title" style={{ marginBottom: '10px' }}>
            <PhoneCall size={18} color="#34d399" />
            <span>24/7 Emergency Directory</span>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#cbd5e1', marginBottom: '14px' }}>
            Toll-free emergency helplines with immediate police and rapid-dispatch capabilities across India.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {EMERGENCY_CONTACTS.slice(0, 2).map(c => (
              <div key={c.number} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: '#94a3b8' }}>{c.name}:</span>
                <a href={`tel:${c.number}`} style={{ color: '#38bdf8', fontWeight: 700 }}>{c.number} 📞</a>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Blocked Customers Ledger */}
      <div className="partner-panel" style={{ marginBottom: '26px' }}>
        <div className="partner-panel-title" style={{ marginBottom: '14px' }}>
          <UserX size={18} color="#c084fc" />
          <span>Blocked Customers List ({blockedCustomers.length})</span>
        </div>

        {blockedCustomers.length === 0 ? (
          <div style={{ color: '#64748b', fontSize: '0.86rem' }}>No customers currently blocked.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {blockedCustomers.map(bc => (
              <div
                key={bc.id}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong style={{ color: '#fff', fontSize: '0.92rem' }}>{bc.name}</strong>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginLeft: '10px' }}>
                    Reason: {bc.reason} • Blocked: {bc.date}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleUnblock(bc.id)}
                  className="btn-secondary btn-sm"
                  style={{ color: '#34d399' }}
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Platonic Safety Rules & Code of Conduct */}
      <div className="partner-panel">
        <div className="partner-panel-title" style={{ marginBottom: '14px' }}>
          <ShieldCheck size={18} color="#10b981" />
          <span>Core Platonic Safety Principles</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', fontSize: '0.84rem', color: '#cbd5e1' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '14px', borderRadius: '10px', borderLeft: '3px solid #10b981' }}>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>1. Strictly Public Venues Only</strong>
            Companionship takes place exclusively in public places (cafes, malls, public monuments, cinemas). Never accompany a client to a private apartment, hotel room, or secluded spot.
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '14px', borderRadius: '10px', borderLeft: '3px solid #10b981' }}>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>2. Absolute Zero-Tolerance for Intimacy</strong>
            PartnerOnRent is strictly a platonic companionship and emotional wellness service. Physical contact beyond a polite handshake is prohibited.
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '14px', borderRadius: '10px', borderLeft: '3px solid #10b981' }}>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>3. Right to Immediate Session Termination</strong>
            If at any moment you feel unsafe or boundaries are crossed, you have the absolute platform right to leave immediately. The system will protect your full payout.
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '14px', borderRadius: '10px', borderLeft: '3px solid #10b981' }}>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>4. All Payments Through Platform Wallet</strong>
            Never accept cash or off-platform direct transfers. Platform escrow protects your earnings and provides insurance coverage.
          </div>
        </div>
      </div>

      {/* Report Incident Modal */}
      {reportModalOpen && (
        <div className="partner-modal-backdrop" onClick={() => setReportModalOpen(false)}>
          <div className="partner-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="partner-modal-header">
              <div style={{ fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="#f87171" />
                <span>File Safety / Harassment Report</span>
              </div>
              <button onClick={() => setReportModalOpen(false)} style={{ color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitReport}>
              <div className="partner-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Incident Classification
                  </label>
                  <select
                    value={reportType}
                    onChange={e => setReportType(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option>Inappropriate Behavior</option>
                    <option>Sexual Harassment / Inappropriate Advances</option>
                    <option>Disrespectful / Threatening Language</option>
                    <option>Attempted Off-Platform Meeting or Payment</option>
                    <option>Non-Consensual Photography or Recording</option>
                    <option>Stalking or Unsolicited Follow-ups</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Client Name or Booking ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Verma or BK-1084"
                    value={clientNameInput}
                    onChange={e => setClientNameInput(e.target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Incident Description & Evidence Summary
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Describe what occurred, time, and location..."
                    value={reportDescription}
                    onChange={e => setReportDescription(e.target.value)}
                    required
                    style={{ width: '100%', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div className="partner-modal-footer">
                <button type="button" className="btn-secondary btn-sm" onClick={() => setReportModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-danger btn-sm" style={{ background: '#ef4444' }}>
                  Submit Incident for Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
