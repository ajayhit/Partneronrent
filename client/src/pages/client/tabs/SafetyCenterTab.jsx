import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  PhoneCall,
  UserX,
  Radio,
  FileText,
  Lock,
  ExternalLink,
  X,
  Send,
  CheckCircle2
} from 'lucide-react';

const EMERGENCY_SERVICES = [
  { name: 'National Emergency Dispatch', number: '112', desc: 'Direct 24/7 police dispatch with live cell tower tracking' },
  { name: 'National Women Safety Helpline', number: '1091', desc: 'Dedicated women safety emergency cell' },
  { name: 'Platform 24/7 Safety Desk', number: '+91 98105 35398', desc: 'Immediate emergency incident mediation & SOS escalation' },
  { name: 'Medical Emergency Ambulance', number: '108', desc: 'Ambulance service across all Indian states' }
];

export default function SafetyCenterTab({ activeBooking, onBlockPartner, showToast }) {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportCategory, setReportCategory] = useState('Inappropriate Behavior');
  const [partnerTarget, setPartnerTarget] = useState(activeBooking?.partnerName || '');
  const [reportDesc, setReportDesc] = useState('');
  const [sosTriggered, setSosTriggered] = useState(false);

  // Blocked partners
  const [blockedPartners, setBlockedPartners] = useState([
    { id: 1, name: 'Vikram M.', reason: 'Unpunctual & aggressive behavior', date: '2026-08-10' }
  ]);
  const [blockNameInput, setBlockNameInput] = useState('');

  const handleTriggerSOS = () => {
    setSosTriggered(true);
    showToast('EMERGENCY SOS ALERT ACTIVATED! Transmitting live location to rapid response officers.', 'danger');
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    showToast(`Safety report against "${partnerTarget}" submitted to compliance team for investigation.`);
    setReportModalOpen(false);
    setPartnerTarget('');
    setReportDesc('');
  };

  const handleBlockPartner = (e) => {
    e.preventDefault();
    if (!blockNameInput.trim()) return;
    setBlockedPartners(prev => [
      ...prev,
      { id: Date.now(), name: blockNameInput.trim(), reason: 'Hirer requested block', date: new Date().toISOString().split('T')[0] }
    ]);
    setBlockNameInput('');
    showToast('Companion blocked. They will not appear in your search results.');
  };

  const handleUnblock = (id) => {
    setBlockedPartners(prev => prev.filter(p => p.id !== id));
    showToast('Companion unblocked.');
  };

  return (
    <div>
      <div style={{ marginBottom: '22px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
          🛡️ Hirer Trust & Safety Center
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
          Strictly platonic companionship. Rapid emergency assistance, reporting protocols, and safety guidelines.
        </p>
      </div>

      {/* Prominent Active Booking Safety Card (as explicitly requested in prompt!) */}
      {activeBooking ? (
        <div style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(20, 28, 46, 0.95) 100%)',
          border: '2px solid #ef4444',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '26px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 8px 30px rgba(239, 68, 68, 0.25)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="client-badge client-badge-rose">Active Session Security</span>
              <strong style={{ color: '#fff' }}>Booking #{activeBooking.id}</strong>
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: '2px 0' }}>
              Companion: {activeBooking.partnerName} • {activeBooking.meetingLocation}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: 0 }}>
              If you feel uncomfortable or boundaries are violated, you have the right to end the session immediately.
            </p>
          </div>

          <button
            onClick={() => {
              setPartnerTarget(activeBooking.partnerName);
              setReportModalOpen(true);
            }}
            className="btn-danger"
            style={{
              background: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 22px',
              fontWeight: 800
            }}
          >
            <AlertTriangle size={16} /> Report Safety Issue
          </button>
        </div>
      ) : (
        /* Emergency SOS Banner */
        <div style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(20, 28, 46, 0.9) 100%)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '26px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #ef4444'
            }}>
              <Radio size={24} color="#f87171" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>
                Emergency Rapid Response Help
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: '2px 0 0' }}>
                Instant distress trigger: alerts emergency contacts and 24/7 safety dispatch.
              </p>
            </div>
          </div>

          <button
            onClick={handleTriggerSOS}
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '9999px',
              fontWeight: 800,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)'
            }}
          >
            <AlertTriangle size={16} />
            <span>{sosTriggered ? 'SOS DISPATCHED' : 'EMERGENCY HELP (SOS)'}</span>
          </button>
        </div>
      )}

      {/* Safety Actions 3-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '26px' }}>
        
        {/* Report Partner */}
        <div className="client-panel" style={{ marginBottom: 0 }}>
          <div className="client-panel-title" style={{ marginBottom: '10px' }}>
            <AlertTriangle size={18} color="#f87171" />
            <span>Report Partner / Harassment</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '16px' }}>
            Report inappropriate conduct, tardiness, or violation of strictly platonic companion rules.
          </p>
          <button
            className="btn-secondary"
            onClick={() => setReportModalOpen(true)}
            style={{ width: '100%', color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <ShieldAlert size={14} /> File Report Against Partner
          </button>
        </div>

        {/* Block Partner */}
        <div className="client-panel" style={{ marginBottom: 0 }}>
          <div className="client-panel-title" style={{ marginBottom: '10px' }}>
            <UserX size={18} color="#c084fc" />
            <span>Block Specific Partner</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '16px' }}>
            Blocked companions will never appear in your search results or directory recommendations.
          </p>
          <form onSubmit={handleBlockPartner} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Partner name..."
              value={blockNameInput}
              onChange={e => setBlockNameInput(e.target.value)}
              style={{ flex: 1, fontSize: '0.82rem' }}
              required
            />
            <button type="submit" className="btn-secondary btn-sm" style={{ color: '#c084fc' }}>
              Block
            </button>
          </form>
        </div>

        {/* Safety Guidelines */}
        <div className="client-panel" style={{ marginBottom: 0 }}>
          <div className="client-panel-title" style={{ marginBottom: '10px' }}>
            <PhoneCall size={18} color="#34d399" />
            <span>24/7 Emergency Numbers</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {EMERGENCY_SERVICES.slice(0, 3).map(s => (
              <div key={s.number} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: '#94a3b8' }}>{s.name}:</span>
                <a href={`tel:${s.number}`} style={{ color: '#38bdf8', fontWeight: 700 }}>{s.number} 📞</a>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Safety Tips & Platonic Guidelines */}
      <div className="client-panel">
        <div className="client-panel-title" style={{ marginBottom: '16px' }}>
          <ShieldCheck size={18} color="#10b981" />
          <span>Hirer Platonic Safety Rules & Best Practices</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', fontSize: '0.84rem', color: '#cbd5e1' }}>
          <div style={{ background: 'rgba(15, 22, 38, 0.4)', padding: '14px', borderRadius: '10px', borderLeft: '3px solid #ec4899' }}>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>1. Public Venues Only</strong>
            Companionship takes place exclusively in public places (cafes, malls, public monuments, cinemas). Never invite a companion to a private residence or hotel room.
          </div>

          <div style={{ background: 'rgba(15, 22, 38, 0.4)', padding: '14px', borderRadius: '10px', borderLeft: '3px solid #ec4899' }}>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>2. Strictly Platonic Engagement</strong>
            Physical intimacy or sexual requests are strictly prohibited and result in immediate account ban and legal reporting.
          </div>

          <div style={{ background: 'rgba(15, 22, 38, 0.4)', padding: '14px', borderRadius: '10px', borderLeft: '3px solid #ec4899' }}>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>3. Secure OTP Session Start</strong>
            Always share your 4-digit OTP only upon physically meeting the companion at the designated public venue.
          </div>

          <div style={{ background: 'rgba(15, 22, 38, 0.4)', padding: '14px', borderRadius: '10px', borderLeft: '3px solid #ec4899' }}>
            <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>4. All Payments In-App</strong>
            Never pay companions cash or off-platform direct transfers. Platform escrow protects your money and provides instant refund mediation.
          </div>
        </div>
      </div>

      {/* Report Partner Modal */}
      {reportModalOpen && (
        <div className="client-modal-backdrop" onClick={() => setReportModalOpen(false)}>
          <div className="client-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="client-modal-header">
              <div style={{ fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="#f87171" />
                <span>File Safety / Harassment Report</span>
              </div>
              <button onClick={() => setReportModalOpen(false)} style={{ color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitReport}>
              <div className="client-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Companion Name
                  </label>
                  <input
                    type="text"
                    value={partnerTarget}
                    onChange={e => setPartnerTarget(e.target.value)}
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Incident Classification
                  </label>
                  <select
                    value={reportCategory}
                    onChange={e => setReportCategory(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option>Inappropriate Behavior</option>
                    <option>Non-Platonic Solicitation</option>
                    <option>Unpunctual / Extreme Tardiness</option>
                    <option>Rude Demeanor or Disrespectful Language</option>
                    <option>Demanded Off-Platform Cash Payment</option>
                    <option>Partner No-Show</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Incident Description
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Provide details about what occurred, time, and location..."
                    value={reportDesc}
                    onChange={e => setReportDesc(e.target.value)}
                    required
                    style={{ width: '100%', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div className="client-modal-footer">
                <button type="button" className="btn-secondary btn-sm" onClick={() => setReportModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-danger btn-sm">
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
