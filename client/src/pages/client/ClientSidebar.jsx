import React, { useState } from 'react';
import {
  LayoutDashboard,
  Search,
  Heart,
  Calendar,
  CreditCard,
  Tag,
  MessageCircle,
  Star,
  Shield,
  AlertTriangle,
  Bell,
  User,
  MapPin,
  Wallet,
  HelpCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

const NAV_GROUPS = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'notifications', label: 'Notifications', icon: Bell, badge: 5 }
    ]
  },
  {
    title: 'Discovery & Saved',
    items: [
      { id: 'find-companion', label: 'Find a Companion', icon: Search, highlight: true },
      { id: 'favorites', label: 'My Favorites', icon: Heart }
    ]
  },
  {
    title: 'Bookings & Messages',
    items: [
      { id: 'bookings', label: 'My Bookings', icon: Calendar },
      { id: 'messages', label: 'Messages', icon: MessageCircle, badge: 2 },
      { id: 'reviews', label: 'My Reviews', icon: Star }
    ]
  },
  {
    title: 'Payments & Rewards',
    items: [
      { id: 'payments', label: 'Payments', icon: CreditCard },
      { id: 'wallet', label: 'Wallet & Credits', icon: Wallet },
      { id: 'coupons', label: 'Coupons & Offers', icon: Tag }
    ]
  },
  {
    title: 'Safety & Support',
    items: [
      { id: 'safety-center', label: 'Safety Center', icon: Shield },
      { id: 'complaints', label: 'Complaints & Disputes', icon: AlertTriangle },
      { id: 'help-support', label: 'Help & Support', icon: HelpCircle }
    ]
  },
  {
    title: 'Account',
    items: [
      { id: 'profile', label: 'My Profile', icon: User },
      { id: 'saved-locations', label: 'Saved Locations', icon: MapPin },
      { id: 'settings', label: 'Settings', icon: Settings }
    ]
  }
];

export default function ClientSidebar({ activeTab, onTabChange, client, onLogout, collapsed, onToggleCollapse }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <>
      {/* Sidebar Header */}
      <div className="client-sidebar-header">
        <div className="client-profile-chip">
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={client?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(client?.name || 'User')}&background=ec4899&color=fff&size=40`}
              alt={client?.name}
              style={{
                width: collapsed ? '36px' : '40px',
                height: collapsed ? '36px' : '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgba(236,72,153,0.4)',
                transition: 'width 0.3s, height 0.3s'
              }}
            />
            <span style={{
              position: 'absolute',
              bottom: 0, right: 0,
              width: '10px', height: '10px',
              background: '#10b981',
              border: '2px solid #121828',
              borderRadius: '50%'
            }} />
          </div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontWeight: 700,
                fontSize: '0.9rem',
                color: '#f1f5f9',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {client?.name || 'Guest User'}
              </div>
              <div style={{
                fontSize: '0.72rem',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '2px'
              }}>
                <ShieldCheck size={11} color="#10b981" />
                Verified Hirer
              </div>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={onToggleCollapse}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '4px',
                cursor: 'pointer',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0
              }}
            >
              <ChevronLeft size={14} />
            </button>
          )}
        </div>
        {collapsed && (
          <button
            onClick={onToggleCollapse}
            style={{
              marginTop: '8px',
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <nav style={{ flex: 1, overflowY: 'auto', paddingBottom: '12px' }}>
        {NAV_GROUPS.map(group => (
          <div key={group.title}>
            {!collapsed && (
              <div className="client-nav-group-title">{group.title}</div>
            )}
            {collapsed && <div style={{ height: '8px' }} />}

            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`client-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileOpen(false);
                  }}
                  title={collapsed ? item.label : undefined}
                  style={{
                    width: 'calc(100% - 20px)',
                    background: item.highlight && !isActive
                      ? 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(168,85,247,0.12))'
                      : undefined,
                    border: item.highlight && !isActive
                      ? '1px solid rgba(236,72,153,0.2)'
                      : undefined,
                    justifyContent: collapsed ? 'center' : undefined,
                    padding: collapsed ? '10px' : undefined,
                    margin: collapsed ? '2px auto' : undefined
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : '10px' }}>
                    <Icon
                      size={17}
                      color={isActive ? '#ec4899' : item.highlight ? '#ec4899' : '#94a3b8'}
                    />
                    {!collapsed && (
                      <span style={{ color: isActive ? '#f1f5f9' : item.highlight ? '#ec4899' : '#94a3b8' }}>
                        {item.label}
                      </span>
                    )}
                  </div>
                  {!collapsed && item.badge && (
                    <span style={{
                      background: 'linear-gradient(90deg,#ec4899,#a855f7)',
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      borderRadius: '10px',
                      padding: '2px 7px',
                      minWidth: '18px',
                      textAlign: 'center'
                    }}>
                      {item.badge}
                    </span>
                  )}
                  {collapsed && item.badge && (
                    <span style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      background: '#ec4899',
                      color: '#fff',
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      borderRadius: '50%',
                      width: '14px',
                      height: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <button
          onClick={onLogout}
          className="client-nav-item"
          style={{
            width: '100%',
            color: '#ef4444',
            justifyContent: collapsed ? 'center' : undefined,
            padding: collapsed ? '10px' : undefined
          }}
          title={collapsed ? 'Logout' : undefined}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : '10px' }}>
            <LogOut size={17} color="#ef4444" />
            {!collapsed && <span style={{ color: '#ef4444' }}>Logout</span>}
          </div>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="client-sidebar"
        style={{ width: collapsed ? '70px' : '280px', display: 'flex', flexDirection: 'column' }}
      >
        <NavContent />
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="client-mobile-menu-btn"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 200,
          background: 'linear-gradient(135deg,#ec4899,#a855f7)',
          border: 'none',
          borderRadius: '50%',
          width: '52px',
          height: '52px',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(236,72,153,0.4)'
        }}
      >
        <Menu size={22} color="#fff" />
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 500,
          display: 'flex'
        }}>
          <div
            style={{ flex: 1, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setMobileOpen(false)}
          />
          <div style={{
            width: '280px',
            background: 'rgba(18,24,40,0.98)',
            backdropFilter: 'blur(16px)',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflowY: 'auto'
          }}>
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'rgba(255,255,255,0.08)', border: 'none',
                borderRadius: '50%', width: '30px', height: '30px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#94a3b8'
              }}
            >
              <X size={16} />
            </button>
            <NavContent />
          </div>
        </div>
      )}
    </>
  );
}
