import React from 'react';
import { formatCurrency } from '../../utils/helpers';
import {
  LayoutDashboard,
  User,
  ShieldCheck,
  Film,
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  Wallet,
  Building2,
  Star,
  MessageCircle,
  ShieldAlert,
  AlertTriangle,
  Bell,
  FileText,
  Settings,
  LogOut,
  Power,
  X
} from 'lucide-react';

export default function PartnerSidebar({
  activeTab,
  setActiveTab,
  partner,
  isOnline,
  onToggleOnline,
  pendingBookingsCount = 0,
  unreadNotificationsCount = 0,
  onLogout,
  isOpen = false,
  onClose
}) {
  const isVerified = partner?.kycStatus === 'verified';

  const navGroups = [
    {
      title: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'kyc', label: 'Verification / KYC', icon: ShieldCheck, badge: isVerified ? 'Verified' : 'Pending', badgeClass: isVerified ? 'partner-badge-emerald' : 'partner-badge-amber' }
      ]
    },
    {
      title: 'Services & Schedule',
      items: [
        { id: 'services', label: 'My Services', icon: Film },
        { id: 'pricing', label: 'My Pricing', icon: DollarSign },
        { id: 'availability', label: 'Availability', icon: Calendar }
      ]
    },
    {
      title: 'Bookings & Operations',
      items: [
        { id: 'bookings', label: 'My Bookings', icon: Clock, badge: pendingBookingsCount > 0 ? String(pendingBookingsCount) : null, badgeClass: 'partner-badge-amber' },
        { id: 'location', label: 'Booking Location', icon: MapPin },
        { id: 'messages', label: 'Messages', icon: MessageCircle }
      ]
    },
    {
      title: 'Financials',
      items: [
        { id: 'earnings', label: 'Earnings', icon: Wallet },
        { id: 'payouts', label: 'Bank / Payout Details', icon: Building2 }
      ]
    },
    {
      title: 'Trust & Safety',
      items: [
        { id: 'reviews', label: 'Reviews & Ratings', icon: Star },
        { id: 'safety', label: 'Safety Center', icon: ShieldAlert },
        { id: 'disputes', label: 'Complaints / Disputes', icon: AlertTriangle }
      ]
    },
    {
      title: 'Resources & System',
      items: [
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount > 0 ? String(unreadNotificationsCount) : null, badgeClass: 'partner-badge-cyan' },
        { id: 'guidelines', label: 'Guidelines & FAQ', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside className={`partner-sidebar ${isOpen ? 'open' : ''}`}>
      {/* Mobile close button */}
      <div style={{ display: 'none', justifyContent: 'flex-end', padding: '10px 16px' }} className="mobile-close">
        <button onClick={onClose} style={{ color: '#94a3b8' }}>
          <X size={20} />
        </button>
      </div>

      {/* Profile Chip Header */}
      <div className="partner-sidebar-header">
        <div className="partner-profile-chip">
          <div style={{ position: 'relative' }}>
            <img
              src={partner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={partner?.name}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: isOnline ? '2px solid #10b981' : '2px solid #64748b'
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: isOnline ? '#10b981' : '#64748b',
                border: '2px solid #0d1626'
              }}
            />
          </div>

          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {partner?.name || 'Aanya Sharma'}
            </div>
            <div style={{ fontSize: '0.72rem', color: isVerified ? '#34d399' : '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={11} /> {isVerified ? 'Verified Partner' : 'Under Review'}
            </div>
          </div>
        </div>

        {/* Live Online Toggle Pill */}
        <div style={{ marginTop: '12px' }}>
          <button
            onClick={onToggleOnline}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              background: isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: isOnline ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
              color: isOnline ? '#34d399' : '#94a3b8',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Power size={14} color={isOnline ? '#34d399' : '#94a3b8'} />
              <span>{isOnline ? 'ONLINE (Accepting)' : 'OFFLINE (Shift Off)'}</span>
            </div>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isOnline ? '#34d399' : '#64748b',
              boxShadow: isOnline ? '0 0 8px #34d399' : 'none'
            }} />
          </button>
        </div>
      </div>

      {/* Navigation Groups */}
      <div style={{ flex: 1, paddingBottom: '20px' }}>
        {navGroups.map(group => (
          <div key={group.title}>
            <div className="partner-nav-group-title">{group.title}</div>
            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`partner-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onClose) onClose();
                  }}
                >
                  <div className="partner-nav-item-left">
                    <Icon size={16} color={isActive ? '#34d399' : '#94a3b8'} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`partner-badge ${item.badgeClass || 'partner-badge-gray'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer: Wallet & Logout */}
      <div style={{
        padding: '16px 18px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        background: 'rgba(10, 16, 28, 0.8)'
      }}>
        <div
          onClick={() => { setActiveTab('payouts'); if (onClose) onClose(); }}
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '10px',
            padding: '10px 14px',
            cursor: 'pointer',
            marginBottom: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
              Available Wallet
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>
              {formatCurrency(partner?.walletBalance || 18400)}
            </div>
          </div>
          <Wallet size={18} color="#34d399" />
        </div>

        <button
          onClick={onLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#f87171',
            fontSize: '0.84rem',
            fontWeight: 600,
            padding: '8px 10px',
            borderRadius: '8px',
            cursor: 'pointer',
            background: 'rgba(239, 68, 68, 0.08)'
          }}
        >
          <LogOut size={15} /> Log Out
        </button>
      </div>
    </aside>
  );
}
