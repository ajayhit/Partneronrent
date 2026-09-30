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

const INITIAL_HIRER_NOTIFICATIONS = [];

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
