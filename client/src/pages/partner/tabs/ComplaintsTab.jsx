import React, { useState } from 'react';
import {
  AlertTriangle,
  FileText,
  Upload,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  X,
  MessageSquare,
  Shield,
  HelpCircle
} from 'lucide-react';

const INITIAL_DISPUTES = [
  {
    id: 'DSP-2041',
    bookingId: 'BK-1082',
    clientName: 'Vikram Malhotra',
    category: 'Client Late Arrival & Extension Refusal',
    createdAt: '2024-09-14',
    status: 'Resolved', // 'Open', 'Under Review', 'Waiting for Response', 'Resolved', 'Closed'
    partnerNotes: 'Client arrived 45 minutes late and demanded session extend past midnight. I had to leave for safety.',
    resolutionNotes: 'Admin upheld partner rights. Full 80% compensation disbursed to partner wallet. Client warned.'
  },
  {
    id: 'DSP-2035',
    bookingId: 'BK-1051',
    clientName: 'Karan Johar',
    category: 'Unpleasant & Disrespectful Demeanor',
    createdAt: '2024-08-28',
    status: 'Closed',
    partnerNotes: 'Client attempted to solicit personal Instagram and private phone number repeatedly.',
    resolutionNotes: 'Client account permanently banned by trust & safety compliance.'
  }
];

const DISPUTE_STAGES = [
  'Open',
  'Under Review',
  'Waiting for Response',
  'Resolved',
  'Closed'
];

export default function ComplaintsTab({ partner, bookings = [], showToast }) {
  const [disputes, setDisputes] = useState(INITIAL_DISPUTES);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(bookings[0]?.id || 'BK-1084');
  const [category, setCategory] = useState('Client Tardiness / No-Show');
  const [explanation, setExplanation] = useState('');
  const [evidenceUploaded, setEvidenceUploaded] = useState(false);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return <span className="partner-badge partner-badge-cyan">Open</span>;
      case 'Under Review':
        return <span className="partner-badge partner-badge-amber">Under Review</span>;
      case 'Waiting for Response':
        return <span className="partner-badge partner-badge-purple">Waiting for Response</span>;
      case 'Resolved':
        return <span className="partner-badge partner-badge-emerald">Resolved</span>;
      case 'Closed':
        return <span className="partner-badge partner-badge-gray">Closed</span>;
      default:
        return <span className="partner-badge partner-badge-gray">{status}</span>;
    }
  };

  const handleRaiseDispute = (e) => {
    e.preventDefault();
    if (!explanation.trim()) return;

    const newDisp = {
      id: `DSP-${Date.now().toString().slice(-4)}`,
      bookingId: selectedBookingId,
      clientName: bookings.find(b => b.id === selectedBookingId)?.clientName || 'Hirer',
      category,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'Open',
      partnerNotes: explanation.trim(),
      resolutionNotes: null
    };

    setDisputes([newDisp, ...disputes]);
    setModalOpen(false);
    setExplanation('');
    showToast(`Dispute #${newDisp.id} submitted! Support team assigned to mediate within 6 hours.`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            ⚠️ Complaints & Dispute Resolution Center
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Fair and transparent mediation for session discrepancies, client no-shows, or payment questions.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Plus size={16} /> Raise New Dispute
        </button>
      </div>

      {/* Dispute Workflow Stages Visual */}
      <div className="partner-panel" style={{ marginBottom: '24px' }}>
        <div className="partner-panel-title" style={{ marginBottom: '14px' }}>
          <Shield size={18} color="#38bdf8" />
          <span>Platform Resolution Lifecycle</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          {DISPUTE_STAGES.map((stg, i) => (
            <div key={stg} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#cbd5e1'
              }}>
                <span style={{ color: '#38bdf8', marginRight: '6px' }}>{i + 1}.</span>
                {stg}
              </div>
              {i < DISPUTE_STAGES.length - 1 && <span style={{ color: '#64748b' }}>→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Disputes Table / Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {disputes.map(disp => (
          <div key={disp.id} className="partner-panel" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  {getStatusBadge(disp.status)}
                  <strong style={{ color: '#38bdf8', fontSize: '0.95rem' }}>{disp.id}</strong>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Linked to Booking #{disp.bookingId} • Client: {disp.clientName}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: '4px 0' }}>
                  {disp.category}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Filed on {disp.createdAt}</span>
              </div>
            </div>

            {/* Partner explanation */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.5)',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: '#cbd5e1',
              marginBottom: '12px'
            }}>
              <strong style={{ color: '#fff' }}>Your Submission:</strong> {disp.partnerNotes}
            </div>

            {/* Resolution outcome if available */}
            {disp.resolutionNotes ? (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: '#cbd5e1'
              }}>
                <div style={{ fontWeight: 700, color: '#34d399', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={15} /> Admin Resolution Ruling
                </div>
                <div>{disp.resolutionNotes}</div>
              </div>
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> Under active mediation. Both parties' GPS timestamps & in-app chat logs are being verified.
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Raise Dispute Modal */}
      {modalOpen && (
        <div className="partner-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="partner-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="partner-modal-header">
              <div style={{ fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="#fbbf24" />
                <span>Raise Booking Dispute</span>
              </div>
              <button onClick={() => setModalOpen(false)} style={{ color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRaiseDispute}>
              <div className="partner-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Select Associated Booking
                  </label>
                  <select
                    value={selectedBookingId}
                    onChange={e => setSelectedBookingId(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    {bookings.map(b => (
                      <option key={b.id} value={b.id}>
                        #{b.id} • {b.clientName} ({b.serviceName} on {b.date})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Dispute Reason Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option>Client Tardiness / No-Show</option>
                    <option>Client Refused to Provide Starting OTP</option>
                    <option>Unacceptable Venue / Secluded Location</option>
                    <option>Discrepancy in Duration or Settlement</option>
                    <option>Rude Demeanor or Boundary Incursion</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Detailed Statement of Facts
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Provide an objective chronology of what happened, time of arrival, and messages exchanged..."
                    value={explanation}
                    onChange={e => setExplanation(e.target.value)}
                    style={{ width: '100%', fontSize: '0.84rem' }}
                    required
                  />
                </div>

                {/* Evidence Upload */}
                <div
                  onClick={() => setEvidenceUploaded(true)}
                  style={{
                    border: '1px dashed rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '14px',
                    textAlign: 'center',
                    background: 'rgba(15, 23, 42, 0.4)',
                    cursor: 'pointer'
                  }}
                >
                  <Upload size={18} color="#38bdf8" style={{ margin: '0 auto 4px' }} />
                  <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>
                    Upload Screenshots / Location Evidence
                  </div>
                  <div style={{ fontSize: '0.72rem', color: evidenceUploaded ? '#10b981' : '#94a3b8' }}>
                    {evidenceUploaded ? '✓ Screenshot attached (chat_proof.png)' : 'Optional: Attach chat proof or call log'}
                  </div>
                </div>
              </div>

              <div className="partner-modal-footer">
                <button type="button" className="btn-secondary btn-sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  Submit Dispute for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
