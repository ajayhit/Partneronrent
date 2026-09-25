import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  HeartHandshake, 
  ShieldCheck, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  AlertTriangle,
  FileText
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../../utils/helpers';

export default function BookingDetailModal({
  booking,
  onClose,
  onUpdateStatus,
  onRefund
}) {
  if (!booking) return null;

  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (status) => {
    const reason = prompt(`Enter reason for updating status to ${status}:`, 'Operational status correction');
    if (!reason) return;
    setLoading(true);
    await onUpdateStatus(booking.id, status, reason);
    setLoading(false);
  };

  const handleRefund = async () => {
    const amountStr = prompt(`Enter refund amount to return to customer wallet:`, String(booking.totalAmount));
    if (!amountStr) return;
    const reason = prompt(`Enter reason for refund:`, 'Mutual cancellation or service dispute settlement');
    if (!reason) return;

    setLoading(true);
    await onRefund(booking.id, Number(amountStr), reason);
    setLoading(false);
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-content" style={{ maxWidth: '640px', padding: '24px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Booking {booking.id}</h2>
              <span className={`admin-badge ${
                booking.status === 'completed' ? 'admin-badge-emerald' :
                booking.status === 'in-progress' ? 'admin-badge-cyan' :
                booking.status === 'confirmed' ? 'admin-badge-purple' :
                booking.status === 'cancelled' ? 'admin-badge-rose' : 'admin-badge-amber'
              }`}>
                {booking.status?.toUpperCase()}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
              Created: {formatDateTime(booking.createdAt)} • Session OTP: <span style={{ fontFamily: 'monospace', color: '#38bdf8', fontWeight: 700 }}>{booking.startOtp || 'N/A'}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ color: '#94a3b8' }}><X size={20} /></button>
        </div>

        {/* Customer & Partner Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: '12px',
            padding: '14px'
          }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
              Customer
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{booking.clientName}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{booking.clientPhone || '+91 98765 43210'}</div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: '12px',
            padding: '14px'
          }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
              Companion Partner
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#38bdf8' }}>{booking.partnerName}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Rate: ₹{booking.hourlyRate}/hr</div>
          </div>
        </div>

        {/* Schedule & Venue Details */}
        <div className="admin-card" style={{ padding: '16px', margin: '0 0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '0.84rem', marginBottom: '14px' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.74rem' }}>Service:</span>
              <div style={{ fontWeight: 600 }}>{booking.serviceName}</div>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.74rem' }}>Date & Time:</span>
              <div style={{ fontWeight: 600 }}>{booking.date} at {booking.startTime}</div>
            </div>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.74rem' }}>Duration:</span>
              <div style={{ fontWeight: 600 }}>{booking.durationHours || 2} Hours</div>
            </div>
          </div>

          <div>
            <span style={{ color: '#64748b', fontSize: '0.74rem' }}>Meeting Venue (Public):</span>
            <div style={{ fontWeight: 600, fontSize: '0.86rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <MapPin size={14} color="#38bdf8" /> {booking.meetingLocation}
            </div>
          </div>

          {booking.clientNotes && (
            <div style={{ marginTop: '10px', fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic' }}>
              " {booking.clientNotes} "
            </div>
          )}
        </div>

        {/* Financial Breakdown Card */}
        <div className="admin-card" style={{ padding: '16px', margin: '0 0 20px', background: 'rgba(10, 15, 26, 0.6)' }}>
          <h4 style={{ fontSize: '0.86rem', color: '#94a3b8', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Financial Breakdown
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#cbd5e1' }}>Base Companion Hours Rate</span>
              <span>{formatCurrency(booking.baseAmount || (booking.hourlyRate * (booking.durationHours || 2)))}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#cbd5e1' }}>Platform Convenience Fee</span>
              <span style={{ color: '#38bdf8' }}>+{formatCurrency(booking.platformFee || 300)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#cbd5e1' }}>GST (Govt 5-18%)</span>
              <span style={{ color: '#64748b' }}>+{formatCurrency(booking.gstAmount || 165)}</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem' }}>
              <span>Total Client Paid</span>
              <span style={{ color: '#34d399' }}>{formatCurrency(booking.totalAmount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', paddingTop: '4px' }}>
              <span>Partner Share Disbursable: {formatCurrency(booking.partnerShare || booking.totalAmount * 0.8)}</span>
              <span>Platform Net Margin: {formatCurrency(booking.platformRevenue || booking.totalAmount * 0.2)}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {booking.status !== 'completed' && (
            <button
              onClick={() => handleStatusChange('completed')}
              disabled={loading}
              className="btn-admin-action btn-admin-success"
            >
              <CheckCircle2 size={14} /> Mark Completed
            </button>
          )}
          {booking.status !== 'cancelled' && (
            <button
              onClick={() => handleStatusChange('cancelled')}
              disabled={loading}
              className="btn-admin-action btn-admin-danger"
            >
              <XCircle size={14} /> Cancel Booking
            </button>
          )}
          <button
            onClick={handleRefund}
            disabled={loading}
            className="btn-admin-action btn-admin-secondary"
            style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.4)' }}
          >
            <RotateCcw size={14} /> Process Refund to Wallet
          </button>
        </div>
      </div>
    </div>
  );
}
