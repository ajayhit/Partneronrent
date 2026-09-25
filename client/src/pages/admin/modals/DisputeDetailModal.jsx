import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  Calendar, 
  User, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { formatDateTime } from '../../../utils/helpers';

export default function DisputeDetailModal({
  dispute,
  onClose,
  onResolve
}) {
  if (!dispute) return null;

  const [resolutionText, setResolutionText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResolve = async (status) => {
    if (!resolutionText.trim()) {
      alert('Please enter resolution notes before submitting.');
      return;
    }
    setLoading(true);
    await onResolve(dispute.id, {
      status,
      resolution: resolutionText.trim(),
      adminNotes: `Resolved by Operations Team on ${new Date().toISOString()}`
    });
    setLoading(false);
    onClose();
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-content" style={{ maxWidth: '620px', padding: '24px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Dispute {dispute.id}</h2>
              <span className={`admin-badge ${
                dispute.status === 'resolved' ? 'admin-badge-emerald' :
                dispute.status === 'investigating' ? 'admin-badge-amber' :
                dispute.status === 'rejected' ? 'admin-badge-rose' : 'admin-badge-cyan'
              }`}>
                {dispute.status?.toUpperCase()}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Reported: {formatDateTime(dispute.date || dispute.dateTime)} • Category: <strong style={{ color: '#fff' }}>{dispute.category}</strong>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#94a3b8' }}><X size={20} /></button>
        </div>

        {/* Dispute Details */}
        <div className="admin-card" style={{ padding: '16px', margin: '0 0 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.85rem', marginBottom: '12px' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.74rem' }}>Complainant:</span>
              <div style={{ fontWeight: 600 }}>{dispute.complainantName || dispute.reportedBy} ({dispute.complainantRole || dispute.reporterRole})</div>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.74rem' }}>Associated Booking:</span>
              <div style={{ fontWeight: 600, color: '#38bdf8' }}>{dispute.bookingId}</div>
            </div>
          </div>

          <div>
            <span style={{ color: '#64748b', fontSize: '0.74rem' }}>Description:</span>
            <div style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.5', marginTop: '3px' }}>
              {dispute.description}
            </div>
          </div>

          {dispute.evidence && (
            <div style={{ marginTop: '12px', padding: '8px 12px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px' }}>
              <span style={{ color: '#64748b', fontSize: '0.72rem' }}>Evidence / Logs:</span>
              <div style={{ fontSize: '0.8rem', color: '#38bdf8' }}>{dispute.evidence}</div>
            </div>
          )}
        </div>

        {/* Resolution Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
            Investigation Findings & Resolution Action
          </label>
          <textarea
            rows={3}
            placeholder="Document interview findings, policy application, or wallet compensation details..."
            value={resolutionText}
            onChange={e => setResolutionText(e.target.value)}
            style={{ width: '100%', resize: 'vertical' }}
          />
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleResolve('rejected')}
            disabled={loading}
            className="btn-admin-action btn-admin-danger"
          >
            <XCircle size={14} /> Reject / Dismiss Complaint
          </button>
          <button
            onClick={() => handleResolve('resolved')}
            disabled={loading}
            className="btn-admin-action btn-admin-success"
          >
            <CheckCircle2 size={14} /> Mark Resolved & Settle
          </button>
        </div>
      </div>
    </div>
  );
}
