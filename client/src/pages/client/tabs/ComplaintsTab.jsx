import React, { useState } from 'react';
import {
  AlertTriangle,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  RotateCcw,
  Plus,
  X,
  Shield,
  HelpCircle
} from 'lucide-react';

const INITIAL_HIRER_COMPLAINTS = [
  {
    id: 'CMP-8012',
    bookingId: 'BK-09941',
    partnerName: 'Kabir Mathur',
    category: 'Partner No-Show',
    requestedRefund: true,
    amount: 1800,
    status: 'Resolved', // 'Open', 'Under Review', 'Waiting for Response', 'Resolved', 'Closed'
    date: '2026-09-02',
    description: 'Waited at Starbucks Bandra for 40 minutes. Companion was unreachable by phone.',
    resolution: 'Full refund of ₹1,800 credited to Hirer Wallet. Companion penalized.'
  },
  {
    id: 'CMP-7940',
    bookingId: 'BK-09812',
    partnerName: 'Vikram M.',
    category: 'Partner Late Arrival',
    requestedRefund: false,
    amount: 0,
    status: 'Closed',
    date: '2026-08-14',
    description: 'Companion arrived 25 minutes late for cinema premiere.',
    resolution: 'Dispute closed with warning issued to companion.'
  }
];

export default function ComplaintsTab({ bookings = [], showToast }) {
  const [complaints, setComplaints] = useState(INITIAL_HIRER_COMPLAINTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(bookings[0]?.id || 'BK-10025');
  const [category, setCategory] = useState('Partner No-show');
  const [requestRefund, setRequestRefund] = useState(true);
  const [description, setDescription] = useState('');
  const [evidenceUploaded, setEvidenceUploaded] = useState(false);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return <span className="client-badge client-badge-cyan">Open</span>;
      case 'Under Review':
        return <span className="client-badge client-badge-amber">Under Review</span>;
      case 'Waiting for Response':
        return <span className="client-badge client-badge-purple">Waiting for Response</span>;
      case 'Resolved':
        return <span className="client-badge client-badge-emerald">Resolved</span>;
      case 'Closed':
        return <span className="client-badge client-badge-gray">Closed</span>;
      default:
        return <span className="client-badge client-badge-gray">{status}</span>;
    }
  };

  const handleRaiseComplaint = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    const matchedBk = bookings.find(b => b.id === selectedBooking) || { partnerName: 'Companion', totalAmount: 1500 };

    const newCmp = {
      id: `CMP-${Date.now().toString().slice(-4)}`,
      bookingId: selectedBooking,
      partnerName: matchedBk.partnerName,
      category,
      requestedRefund,
      amount: matchedBk.totalAmount || 1500,
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
      description: description.trim(),
      resolution: null
    };

    setComplaints([newCmp, ...complaints]);
    setModalOpen(false);
    setDescription('');
    showToast(`Complaint #${newCmp.id} filed! Trust & Support team assigned to mediate.`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            ⚠️ Complaints & Refund Disputes
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Protected escrow mediation for partner no-shows, cancellation disputes, and full refund claims.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary"
          style={{
            background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Plus size={16} /> File New Complaint
        </button>
      </div>

      {/* Dispute Status Lifecycle Bar */}
      <div className="client-panel" style={{ marginBottom: '24px' }}>
        <div className="client-panel-title" style={{ marginBottom: '14px' }}>
          <Shield size={18} color="#ec4899" />
          <span>Refund & Dispute Lifecycle</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          {['Open', 'Under Review', 'Waiting for Response', 'Resolved', 'Closed'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(15, 22, 38, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#cbd5e1'
              }}>
                <span style={{ color: '#ec4899', marginRight: '6px' }}>{i + 1}.</span> {s}
              </div>
              {i < 4 && <span style={{ color: '#64748b' }}>→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Complaints List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {complaints.map(c => (
          <div key={c.id} className="client-panel" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  {getStatusBadge(c.status)}
                  <strong style={{ color: '#38bdf8', fontSize: '0.94rem' }}>{c.id}</strong>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Linked to Booking #{c.bookingId} • Partner: {c.partnerName}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: '4px 0' }}>
                  {c.category}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Submitted on {c.date}</span>
              </div>

              {c.requestedRefund && (
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Claimed Refund
                  </span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>
                    ₹{c.amount}
                  </div>
                </div>
              )}
            </div>

            <div style={{
              background: 'rgba(15, 22, 38, 0.5)',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              color: '#cbd5e1',
              marginBottom: '10px'
            }}>
              <strong style={{ color: '#fff' }}>Your Statement:</strong> {c.description}
            </div>

            {c.resolution ? (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: '#cbd5e1'
              }}>
                <div style={{ fontWeight: 700, color: '#34d399', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={15} /> Support Resolution Decision
                </div>
                <div>{c.resolution}</div>
              </div>
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> Case is under active compliance mediation. Partner has been asked for attendance verification.
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Raise Complaint Modal */}
      {modalOpen && (
        <div className="client-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="client-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="client-modal-header">
              <div style={{ fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="#ec4899" />
                <span>Raise Complaint & Refund Dispute</span>
              </div>
              <button onClick={() => setModalOpen(false)} style={{ color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRaiseComplaint}>
              <div className="client-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Select Associated Booking
                  </label>
                  <select
                    value={selectedBooking}
                    onChange={e => setSelectedBooking(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    {bookings.map(b => (
                      <option key={b.id} value={b.id}>
                        #{b.id} • {b.partnerName} ({b.serviceName} on {b.date})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Complaint Classification
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option>Partner No-show</option>
                    <option>Payment Dispute</option>
                    <option>Partner Cancellation</option>
                    <option>Service Issue / Quality</option>
                    <option>Inappropriate Behavior</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    id="refundReq"
                    checked={requestRefund}
                    onChange={e => setRequestRefund(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#ec4899' }}
                  />
                  <label htmlFor="refundReq" style={{ fontSize: '0.84rem', color: '#cbd5e1', cursor: 'pointer' }}>
                    Request immediate refund back to Hirer Wallet
                  </label>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Incident Statement
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Provide details of venue arrival, waiting time, and companion response..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                    style={{ width: '100%', fontSize: '0.84rem' }}
                  />
                </div>

                {/* Upload Evidence */}
                <div
                  onClick={() => setEvidenceUploaded(true)}
                  style={{
                    border: '1px dashed rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '14px',
                    textAlign: 'center',
                    background: 'rgba(15, 22, 38, 0.4)',
                    cursor: 'pointer'
                  }}
                >
                  <Upload size={18} color="#ec4899" style={{ margin: '0 auto 4px' }} />
                  <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>
                    Upload Chat Screenshots / Location Proof
                  </div>
                  <div style={{ fontSize: '0.72rem', color: evidenceUploaded ? '#34d399' : '#94a3b8' }}>
                    {evidenceUploaded ? '✓ Evidence attached (screenshot.png)' : 'Optional: Attach call log or venue photo'}
                  </div>
                </div>
              </div>

              <div className="client-modal-footer">
                <button type="button" className="btn-secondary btn-sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)' }}>
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
