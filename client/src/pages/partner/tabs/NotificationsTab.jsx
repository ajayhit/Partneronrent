import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  CheckCircle2,
  XCircle,
  DollarSign,
  Wallet,
  ShieldCheck,
  MessageCircle,
  Star,
  AlertTriangle,
  Check,
  Trash2
} from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'new_booking',
    title: 'New Booking Request Received',
    text: 'Sneha Roy booked you for Shopping Companion on Sep 28 at Select Citywalk (₹1,080 take-home).',
    time: '10 mins ago',
    read: false,
    icon: Calendar,
    color: '#38bdf8'
  },
  {
    id: 2,
    type: 'customer_message',
    title: 'New Hirer Message',
    text: 'Rahul Verma sent you a message regarding meeting location for BK-1084.',
    time: '45 mins ago',
    read: false,
    icon: MessageCircle,
    color: '#34d399'
  },
  {
    id: 3,
    type: 'payment_received',
    title: 'Session Earnings Credited',
    text: '₹3,600 has been credited to your withdrawable wallet balance for completed session BK-1082.',
    time: '2 hours ago',
    read: false,
    icon: DollarSign,
    color: '#10b981'
  },
  {
    id: 4,
    type: 'payout_processed',
    title: 'Bank Payout Processed',
    text: 'Your withdrawal request for ₹10,000 has been settled to your HDFC Bank account (UTR: 202409158912).',
    time: 'Yesterday',
    read: true,
    icon: Wallet,
    color: '#a78bfa'
  },
  {
    id: 5,
    type: 'review_received',
    title: 'New 5-Star Review Received',
    text: '"Aanya is an exceptionally warm and thoughtful listener." - Rahul Verma left a 5-star rating.',
    time: '2 days ago',
    read: true,
    icon: Star,
    color: '#fbbf24'
  },
  {
    id: 6,
    type: 'safety_notification',
    title: 'Important Safety Reminder',
    text: 'Remember: Sessions must occur only in public venues. Never enter private hotel rooms or residences.',
    time: '3 days ago',
    read: true,
    icon: AlertTriangle,
    color: '#f87171'
  },
  {
    id: 7,
    type: 'kyc_update',
    title: 'KYC Document Verified',
    text: 'Your Aadhaar and Police background check has been verified through 2029.',
    time: '1 week ago',
    read: true,
    icon: ShieldCheck,
    color: '#10b981'
  },
  {
    id: 8,
    type: 'booking_accepted',
    title: 'Booking Accepted Confirmed',
    text: 'You accepted booking BK-1084. Hirer has been sent confirmation and your meeting instructions.',
    time: '1 week ago',
    read: true,
    icon: CheckCircle2,
    color: '#38bdf8'
  },
  {
    id: 9,
    type: 'booking_cancelled',
    title: 'Booking Cancellation Notice',
    text: 'Booking BK-1033 was cancelled by hirer 24h in advance. Zero penalty recorded.',
    time: '2 weeks ago',
    read: true,
    icon: XCircle,
    color: '#94a3b8'
  }
];

export default function NotificationsTab({ showToast }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filterType, setFilterType] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = filterType === 'all'
    ? notifications
    : filterType === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filterType);

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  const handleClearAll = () => {
    setNotifications([]);
    showToast('Notification inbox cleared.');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            🔔 Notifications & Activity Feed
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Real-time updates regarding new hire requests, session confirmations, wallet payouts, and safety advisories.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Check size={14} /> Mark All Read
            </button>
          )}
          <button
            onClick={handleClearAll}
            className="btn-secondary btn-sm"
            style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Trash2 size={14} /> Clear All
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'new_booking', label: 'Bookings' },
          { id: 'payment_received', label: 'Payments & Payouts' },
          { id: 'safety_notification', label: 'Safety' },
          { id: 'review_received', label: 'Reviews' }
        ].map(chip => (
          <button
            key={chip.id}
            onClick={() => setFilterType(chip.id)}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: filterType === chip.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(15, 23, 42, 0.6)',
              border: filterType === chip.id ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
              color: filterType === chip.id ? '#34d399' : '#94a3b8',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.length === 0 ? (
          <div className="partner-panel" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
            <Bell size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
            <div>No notifications found.</div>
          </div>
        ) : (
          filtered.map(item => {
            const Icon = item.icon || Bell;
            return (
              <div
                key={item.id}
                onClick={() => handleMarkAsRead(item.id)}
                style={{
                  background: item.read ? 'rgba(15, 23, 42, 0.4)' : 'rgba(16, 185, 129, 0.05)',
                  border: item.read ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: `${item.color}20`,
                    border: `1px solid ${item.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={18} color={item.color} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ color: '#ffffff', fontSize: '0.94rem' }}>{item.title}</strong>
                      {!item.read && (
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                      )}
                    </div>
                    <p style={{ color: '#cbd5e1', fontSize: '0.84rem', margin: '4px 0 0', lineHeight: '1.4' }}>
                      {item.text}
                    </p>
                  </div>
                </div>

                <span style={{ fontSize: '0.74rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                  {item.time}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
