import React from 'react';
import { formatCurrency } from '../../../utils/helpers';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  MessageCircle,
  AlertTriangle,
  Star,
  CheckCircle2,
  XCircle,
  FileText,
  Navigation,
  KeyRound,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export default function BookingDetailModal({
  booking,
  isOpen,
  onClose,
  onCancelBooking,
  openChat,
  openSOS,
  openReview,
  onRaiseDispute
}) {
  if (!isOpen || !booking) return null;

  const basePrice = booking.baseAmount || (booking.hourlyRate ? booking.hourlyRate * (booking.durationHours || 2) : 1200);
  const platformFee = booking.platformFee || 150;
  const discount = booking.discountAmount || 0;
  const total = booking.totalAmount || 1500;

  return (
    <div className="client-modal-backdrop" onClick={onClose}>
      <div className="client-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        
        {/* Modal Header */}
        <div className="client-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
              Booking #{booking.id}
            </span>
            <span className={`client-badge ${booking.status === 'completed' ? 'client-badge-emerald' : booking.status === 'in-progress' ? 'client-badge-amber' : 'client-badge-cyan'}`}>
              {booking.status?.toUpperCase()}
            </span>
          </div>

          <button onClick={onClose} style={{ color: '#94a3b8' }}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="client-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Partner & Service Card */}
          <div style={{
            background: 'rgba(15, 22, 38, 0.6)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img
                src={booking.partnerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={booking.partnerName}
                style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ec4899' }}
              />
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                  {booking.partnerName}
                </div>
                <div style={{ fontSize: '0.84rem', color: '#f472b6', fontWeight: 600 }}>
                  {booking.serviceName}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Aadhaar & Police Verified Companion
                </div>
              </div>
            </div>

            {/* Starting OTP Pill */}
            {booking.status === 'confirmed' && (
              <div style={{
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid #38bdf8',
                borderRadius: '8px',
                padding: '8px 14px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.68rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 800 }}>
                  Start Session OTP
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', letterSpacing: '0.15em' }}>
                  {booking.startOtp || '4921'}
                </div>
              </div>
            )}
          </div>

          {/* Date, Time & Logistics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '10px',
            background: 'rgba(15, 22, 38, 0.4)',
            padding: '14px',
            borderRadius: '10px'
          }}>
            <div>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Session Date</span>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{booking.date}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Session Time</span>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{booking.startTime}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Duration</span>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{booking.durationHours} Hours</div>
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Payment Status</span>
              <div style={{ fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>Paid (Escrow)</div>
            </div>
          </div>

          {/* Meeting Location */}
          <div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
              Designated Meeting Venue
            </div>
            <div style={{
              background: 'rgba(15, 22, 38, 0.6)',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} color="#ec4899" />
                <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>
                  {booking.meetingLocation || 'Cyber Hub, DLF Phase 2, Gurgaon'}
                </span>
              </div>
              <button
                type="button"
                className="btn-secondary btn-sm"
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(booking.meetingLocation || 'Delhi')}`, '_blank')}
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                Maps <ExternalLink size={12} />
              </button>
            </div>
          </div>

          {/* Price Breakdown */}
          <div style={{
            background: 'rgba(15, 22, 38, 0.6)',
            borderRadius: '10px',
            padding: '14px 18px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
              Financial Breakdown
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span>Companion Base Rate ({booking.durationHours || 2} hrs):</span>
                <span>{formatCurrency(basePrice)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span>Platform Safety & Tech Fee (10%):</span>
                <span>{formatCurrency(platformFee)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
                  <span>Coupon Discount Applied:</span>
                  <span>- {formatCurrency(discount)}</span>
                </div>
              )}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1.05rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '8px',
                marginTop: '4px'
              }}>
                <span>Total Amount Paid:</span>
                <span style={{ color: '#34d399' }}>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Cancellation Policy Note */}
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: '1.5' }}>
            <strong>Cancellation Policy:</strong> Free cancellation up to 4 hours before session start time. Cancellations with less than 2 hours notice are subject to a 50% companion compensation fee.
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="client-modal-footer" style={{ flexWrap: 'wrap', gap: '8px' }}>
          {/* Contact Partner */}
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={() => { onClose(); openChat(booking); }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <MessageCircle size={14} /> Contact Partner
          </button>

          {/* Report Issue */}
          <button
            type="button"
            className="btn-secondary btn-sm"
            onClick={() => { onClose(); onRaiseDispute(booking); }}
            style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <AlertTriangle size={14} /> Report Issue
          </button>

          {/* Give Review if completed */}
          {booking.status === 'completed' && (
            <button
              type="button"
              className="btn-primary btn-sm"
              onClick={() => { onClose(); openReview(booking); }}
              style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', color: '#000', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Star size={14} /> Give Review
            </button>
          )}

          {/* Cancel Booking if confirmed/pending */}
          {(booking.status === 'confirmed' || booking.status === 'pending') && (
            <button
              type="button"
              className="btn-danger btn-sm"
              onClick={() => onCancelBooking(booking.id)}
            >
              Cancel Booking
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
