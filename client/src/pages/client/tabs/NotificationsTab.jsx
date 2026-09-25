import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Wallet,
  RotateCcw,
  MessageCircle,
  Star,
  Tag,
  AlertTriangle,
  Check,
  Trash2
} from 'lucide-react';

const INITIAL_HIRER_NOTIFICATIONS = [
  {
    id: 1,
    type: 'booking_accepted',
    title: 'Booking Accepted by Companion',
    text: 'Rahul Sharma accepted your Movie Companion hire request for 28 Sep 2026 at 06:00 PM.',
    time: '2 hours ago',
    read: false,
    icon: CheckCircle2,
    color: '#34d399'
  },
  {
    id: 2,
    type: 'payment_successful',
    title: 'Payment Successful (₹1,500)',
    text: 'Escrow payment confirmed for Booking #BK-10025 via Hirer Wallet.',
    time: '2 hours ago',
    read: false,
    icon: Wallet,
    color: '#10b981'
  },
  {
    id: 3,
    type: 'new_message',
    title: 'New Message from Companion',
    text: 'Rahul sent you a message: "I will reach the cinema main lobby by 5:50 PM."',
    time: '3 hours ago',
    read: false,
    icon: MessageCircle,
    color: '#38bdf8'
  },
  {
    id: 4,
    type: 'booking_reminder',
    title: 'Session Reminder: Today at 6 PM',
    text: 'Your Movie Companion session starts in 4 hours. Meet at PVR Director Cut with your 4-digit OTP.',
    time: '4 hours ago',
    read: true,
    icon: Clock,
    color: '#fbbf24'
  },
  {
    id: 5,
    type: 'refund_processed',
    title: 'Refund Processed: ₹1,800 Credited',
    text: 'Refund for dispute #CMP-8012 has been successfully credited back to your wallet.',
    time: '2 days ago',
    read: true,
    icon: RotateCcw,
    color: '#c084fc'
  },
  {
    id: 6,
    type: 'review_reminder',
    title: 'Rate Your Experience with Aanya',
    text: 'How was your Cafe Companion session? Share feedback to support top-rated companions.',
    time: '3 days ago',
    read: true,
    icon: Star,
    color: '#fbbf24'
  },
  {
    id: 7,
    type: 'promotional_offers',
    title: 'Exclusive Offer: ₹100 OFF Cinema',
    text: 'Use promo code WELCOME100 for ₹100 off on your next premiere movie companionship booking.',
    time: '4 days ago',
    read: true,
    icon: Tag,
    color: '#f472b6'
  },
  {
    id: 8,
    type: 'safety_alerts',
    title: 'Important Safety Reminder',
    text: 'Always meet companions in public venues. Never invite companions into private residences.',
    time: '1 week ago',
    read: true,
    icon: AlertTriangle,
    color: '#f87171'
  },
  {
    id: 9,
    type: 'partner_cancelled',
    title: 'Partner Cancellation Notice',
    text: 'Booking #BK-09812 was cancelled by partner due to medical emergency. Full refund was auto-processed.',
    time: '2 weeks ago',
    read: true,
    icon: XCircle,
    color: '#94a3b8'
  },
  {
    id: 10,
    type: 'booking_request',
    title: 'Booking Request Submitted',
    text: 'Your request for Shopping Companion on 18 Sep was sent to Aanya Sharma.',
    time: '2 weeks ago',
    read: true,
    icon: Calendar,
    color: '#38bdf8'
  }
];

export default function NotificationsTab({ showToast }) {
  const [notifications, setNotifications] = useState(INITIAL_HIRER_NOTIFICATIONS);
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
    showToast('Notification feed cleared.');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            🔔 Notifications & Activity Alerts
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Real-time updates on companion confirmations, payment receipts, refund credits, and safety advisories.
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
          { id: 'booking_accepted', label: 'Bookings' },
          { id: 'payment_successful', label: 'Payments & Refunds' },
          { id: 'promotional_offers', label: 'Offers' },
          { id: 'safety_alerts', label: 'Safety' }
        ].map(chip => (
          <button
            key={chip.id}
            onClick={() => setFilterType(chip.id)}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: filterType === chip.id ? 'rgba(236, 72, 153, 0.2)' : 'rgba(15, 22, 38, 0.6)',
              border: filterType === chip.id ? '1px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.08)',
              color: filterType === chip.id ? '#f472b6' : '#94a3b8',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Notification Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.length === 0 ? (
          <div className="client-panel" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            <Bell size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
            <div>No notifications found under this filter.</div>
          </div>
        ) : (
          filtered.map(item => {
            const Icon = item.icon || Bell;
            return (
              <div
                key={item.id}
                onClick={() => handleMarkAsRead(item.id)}
                style={{
                  background: item.read ? 'rgba(15, 22, 38, 0.4)' : 'rgba(236, 72, 153, 0.06)',
                  border: item.read ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(236, 72, 153, 0.3)',
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
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899' }} />
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
