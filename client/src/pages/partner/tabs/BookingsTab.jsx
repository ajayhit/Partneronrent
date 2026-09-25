import React, { useState } from 'react';
import { formatCurrency } from '../../../utils/helpers';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Play,
  Square,
  MessageCircle,
  AlertTriangle,
  Search,
  Filter,
  User,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

const STATUS_TABS = [
  { id: 'all', label: 'All Bookings' },
  { id: 'pending', label: 'New Requests' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'confirmed', label: 'Accepted' },
  { id: 'in-progress', label: 'Ongoing' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'declined', label: 'Rejected' },
  { id: 'disputed', label: 'Disputed' }
];

export default function BookingsTab({
  bookings = [],
  onAcceptBooking,
  onDeclineBooking,
  onStartSession,
  onEndSession,
  onCancelBooking,
  otpInputs,
  setOtpInputs,
  verifyingOtp,
  openChat,
  openSOS,
  showToast
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState(null);

  // Filter bookings
  const filteredBookings = bookings.filter(b => {
    // Tab filter
    if (activeTab === 'pending' && b.status !== 'pending') return false;
    if (activeTab === 'upcoming' && b.status !== 'confirmed') return false;
    if (activeTab === 'confirmed' && b.status !== 'confirmed') return false;
    if (activeTab === 'in-progress' && b.status !== 'in-progress') return false;
    if (activeTab === 'completed' && b.status !== 'completed') return false;
    if (activeTab === 'cancelled' && b.status !== 'cancelled') return false;
    if (activeTab === 'declined' && b.status !== 'declined') return false;
    if (activeTab === 'disputed' && b.status !== 'disputed') return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.clientName?.toLowerCase().includes(q);
      const matchId = b.id?.toLowerCase().includes(q);
      const matchService = b.serviceName?.toLowerCase().includes(q);
      const matchLoc = b.meetingLocation?.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchService && !matchLoc) return false;
    }

    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'in-progress':
        return <span className="partner-badge partner-badge-amber">Live In Progress</span>;
      case 'confirmed':
        return <span className="partner-badge partner-badge-cyan">Accepted / Upcoming</span>;
      case 'completed':
        return <span className="partner-badge partner-badge-emerald">Completed</span>;
      case 'pending':
        return <span className="partner-badge partner-badge-amber">New Request</span>;
      case 'cancelled':
        return <span className="partner-badge partner-badge-rose">Cancelled</span>;
      case 'declined':
        return <span className="partner-badge partner-badge-rose">Rejected</span>;
      case 'disputed':
        return <span className="partner-badge partner-badge-purple">Disputed</span>;
      default:
        return <span className="partner-badge partner-badge-gray">{status}</span>;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            📅 Companion Booking Requests & Sessions
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Manage client hire requests, start sessions with OTP verification, and track completion earnings.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by client, ID, location..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '38px', fontSize: '0.86rem' }}
          />
        </div>
      </div>

      {/* Booking Status Tabs Row */}
      <div className="partner-tabs-row">
        {STATUS_TABS.map(tab => {
          let count = 0;
          if (tab.id === 'all') count = bookings.length;
          else if (tab.id === 'upcoming') count = bookings.filter(b => b.status === 'confirmed').length;
          else count = bookings.filter(b => b.status === tab.id).length;

          return (
            <button
              key={tab.id}
              className={`partner-subtab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.label}</span>
              <span style={{
                fontSize: '0.72rem',
                background: activeTab === tab.id ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                padding: '1px 6px',
                borderRadius: '8px',
                fontWeight: 700
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bookings List Cards */}
      {filteredBookings.length === 0 ? (
        <div className="partner-panel" style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
          <Calendar size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <h4 style={{ color: '#94a3b8', fontSize: '1.05rem', margin: '0 0 6px' }}>No bookings found</h4>
          <p style={{ fontSize: '0.85rem', margin: 0 }}>
            No bookings match the filter "{STATUS_TABS.find(t => t.id === activeTab)?.label}".
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredBookings.map(bk => (
            <div
              key={bk.id}
              className="partner-panel"
              style={{
                marginBottom: 0,
                borderLeft: bk.status === 'in-progress'
                  ? '4px solid #f59e0b'
                  : bk.status === 'confirmed'
                  ? '4px solid #10b981'
                  : bk.status === 'pending'
                  ? '4px solid #38bdf8'
                  : '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    {getStatusBadge(bk.status)}
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8' }}>#{bk.id}</span>
                    <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Created: {new Date(bk.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: '#ffffff', margin: '2px 0 6px' }}>
                    {bk.clientName} • <span style={{ color: '#38bdf8' }}>{bk.serviceName}</span>
                  </h3>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.84rem', color: '#cbd5e1' }}>
                    <span>📅 <strong>{bk.date}</strong></span>
                    <span>⏰ <strong>{bk.startTime}</strong> ({bk.durationHours} Hours Duration)</span>
                    <span>📍 {bk.meetingLocation}</span>
                  </div>

                  {bk.clientNotes && (
                    <div style={{ fontSize: '0.8rem', color: '#c084fc', marginTop: '6px' }}>
                      Hirer Note: "{bk.clientNotes}"
                    </div>
                  )}
                </div>

                {/* Amount & Partner Take-Home */}
                <div style={{ textAlign: 'right', minWidth: '150px' }}>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Your Earnings (80%)
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>
                    {formatCurrency(bk.partnerShare || Math.round((bk.totalAmount || 3000) * 0.8))}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    Total Client Fare: {formatCurrency(bk.totalAmount || 3000)}
                  </div>
                </div>
              </div>

              {/* Action Buttons based on Booking Status */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                paddingTop: '14px'
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn-secondary btn-sm"
                    onClick={() => openChat(bk)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <MessageCircle size={14} /> Chat Hirer
                  </button>
                  <button
                    className="btn-secondary btn-sm"
                    onClick={() => openSOS(bk)}
                    style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <AlertTriangle size={14} /> SOS
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {/* PENDING REQUEST: Accept or Decline */}
                  {bk.status === 'pending' && (
                    <>
                      <button
                        className="btn-secondary btn-sm"
                        onClick={() => onDeclineBooking(bk.id)}
                        style={{ color: '#f87171' }}
                      >
                        <XCircle size={15} /> Decline
                      </button>
                      <button
                        className="btn-primary btn-sm"
                        onClick={() => onAcceptBooking(bk.id)}
                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                      >
                        <CheckCircle2 size={15} /> Accept Request
                      </button>
                    </>
                  )}

                  {/* CONFIRMED: OTP Form to Start Session */}
                  {bk.status === 'confirmed' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="text"
                        maxLength="4"
                        placeholder="Client 4-digit OTP"
                        value={otpInputs[bk.id] || ''}
                        onChange={e => setOtpInputs({ ...otpInputs, [bk.id]: e.target.value })}
                        style={{ width: '130px', textAlign: 'center', fontWeight: 800, fontSize: '0.9rem', padding: '6px' }}
                      />
                      <button
                        className="btn-primary btn-sm"
                        onClick={() => onStartSession(bk.id)}
                        disabled={verifyingOtp}
                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                      >
                        <Play size={14} /> Start Session
                      </button>
                      {onCancelBooking && (
                        <button
                          className="btn-secondary btn-sm"
                          onClick={() => onCancelBooking(bk.id)}
                          style={{ color: '#f87171' }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  )}

                  {/* IN PROGRESS: End session & release payout */}
                  {bk.status === 'in-progress' && (
                    <button
                      className="btn-primary btn-sm"
                      onClick={() => onEndSession(bk.id)}
                      style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                    >
                      <Square size={14} /> End Session & Release {formatCurrency(bk.partnerShare)}
                    </button>
                  )}

                  {/* COMPLETED */}
                  {bk.status === 'completed' && (
                    <span style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} /> Credited to Wallet
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
