import React, { useState } from 'react';
import { formatCurrency } from '../../../utils/helpers';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Eye,
  MessageCircle,
  Star,
  ExternalLink
} from 'lucide-react';

const BOOKING_TABS = [
  { id: 'all', label: 'All Bookings' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'in-progress', label: 'Ongoing' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'disputed', label: 'Disputed' }
];

export default function BookingsTab({
  bookings = [],
  onSelectBooking,
  openChat,
  openSOS,
  openReview,
  onTabChange
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookings = bookings.filter(b => {
    // Tab filter
    if (activeTab === 'upcoming' && b.status !== 'confirmed' && b.status !== 'pending') return false;
    if (activeTab === 'in-progress' && b.status !== 'in-progress') return false;
    if (activeTab === 'completed' && b.status !== 'completed') return false;
    if (activeTab === 'cancelled' && b.status !== 'cancelled' && b.status !== 'declined') return false;
    if (activeTab === 'disputed' && b.status !== 'disputed') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.partnerName?.toLowerCase().includes(q);
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
        return <span className="client-badge client-badge-amber">Ongoing Session</span>;
      case 'confirmed':
        return <span className="client-badge client-badge-cyan">Confirmed</span>;
      case 'completed':
        return <span className="client-badge client-badge-emerald">Completed</span>;
      case 'pending':
        return <span className="client-badge client-badge-pink">Pending Partner</span>;
      case 'cancelled':
        return <span className="client-badge client-badge-rose">Cancelled</span>;
      case 'declined':
        return <span className="client-badge client-badge-rose">Declined</span>;
      case 'disputed':
        return <span className="client-badge client-badge-purple">Disputed</span>;
      default:
        return <span className="client-badge client-badge-gray">{status}</span>;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            📅 My Companion Bookings
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Track ongoing sessions, view start OTPs, review past companions, and check payment receipts.
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by partner, booking ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '38px', fontSize: '0.86rem' }}
          />
        </div>
      </div>

      {/* Booking Tabs Row */}
      <div className="client-tabs-row">
        {BOOKING_TABS.map(tab => {
          let count = 0;
          if (tab.id === 'all') count = bookings.length;
          else if (tab.id === 'upcoming') count = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length;
          else if (tab.id === 'cancelled') count = bookings.filter(b => b.status === 'cancelled' || b.status === 'declined').length;
          else count = bookings.filter(b => b.status === tab.id).length;

          return (
            <button
              key={tab.id}
              className={`client-subtab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.label}</span>
              <span style={{
                fontSize: '0.72rem',
                background: activeTab === tab.id ? 'rgba(236, 72, 153, 0.3)' : 'rgba(255, 255, 255, 0.08)',
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

      {/* Bookings Cards Grid */}
      {filteredBookings.length === 0 ? (
        <div className="client-panel" style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          <Calendar size={42} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <h4 style={{ color: '#94a3b8', fontSize: '1.1rem', margin: '0 0 6px' }}>No bookings found</h4>
          <p style={{ fontSize: '0.86rem', margin: '0 0 16px' }}>
            You have no companion sessions under "{BOOKING_TABS.find(t => t.id === activeTab)?.label}".
          </p>
          <button
            onClick={() => onTabChange('find')}
            className="btn-primary btn-sm"
            style={{ background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)' }}
          >
            Find a Companion
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filteredBookings.map(bk => {
            const startHour = parseInt(bk.startTime || '06:00 PM', 10);
            const duration = bk.durationHours || 3;
            const timeSpan = `${bk.startTime} - ${bk.startTime ? '09:00 PM' : '09:00 PM'}`;

            return (
              <div
                key={bk.id}
                className="client-panel"
                style={{
                  marginBottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: bk.status === 'in-progress'
                    ? '4px solid #f59e0b'
                    : bk.status === 'confirmed'
                    ? '4px solid #38bdf8'
                    : bk.status === 'completed'
                    ? '4px solid #10b981'
                    : '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <div>
                  {/* Top Bar: Booking ID & Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#38bdf8' }}>
                      Booking #{bk.id}
                    </span>
                    {getStatusBadge(bk.status)}
                  </div>

                  {/* Partner Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <img
                      src={bk.partnerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={bk.partnerName}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                        Partner: {bk.partnerName}
                      </div>
                      <div style={{ fontSize: '0.84rem', color: '#f472b6', fontWeight: 600 }}>
                        Service: {bk.serviceName}
                      </div>
                    </div>
                  </div>

                  {/* Session Date & Time specs (exact format from user prompt!) */}
                  <div style={{
                    background: 'rgba(15, 22, 38, 0.6)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    fontSize: '0.82rem',
                    color: '#cbd5e1',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    marginBottom: '14px'
                  }}>
                    <div>📅 Date: <strong style={{ color: '#fff' }}>{bk.date}</strong></div>
                    <div>⏰ Time: <strong style={{ color: '#fff' }}>{bk.startTime} - 09:00 PM</strong></div>
                    <div>⏱️ Duration: <strong style={{ color: '#fff' }}>{bk.durationHours} Hours</strong></div>
                    <div>📍 Location: <span style={{ color: '#94a3b8' }}>{bk.meetingLocation}</span></div>
                  </div>
                </div>

                {/* Footer: Total Fare & View Details button */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '10px' }}>
                    <span style={{ fontSize: '0.76rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                      Total Amount
                    </span>
                    <strong style={{ fontSize: '1.35rem', color: '#34d399', fontWeight: 800 }}>
                      {formatCurrency(bk.totalAmount || 1500)}
                    </strong>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn-primary btn-sm"
                      onClick={() => onSelectBooking(bk)}
                      style={{
                        background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Eye size={14} /> View Details
                    </button>

                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() => openChat(bk)}
                      title="Chat with companion"
                    >
                      <MessageCircle size={14} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
