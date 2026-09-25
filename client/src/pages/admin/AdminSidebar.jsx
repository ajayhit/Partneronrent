import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  ShieldCheck,
  Calendar,
  CalendarDays,
  MapPin,
  Sparkles,
  CreditCard,
  Wallet,
  TrendingUp,
  Star,
  AlertTriangle,
  ShieldAlert,
  Tag,
  Bell,
  FileText,
  BarChart2,
  UserCheck,
  Key,
  ClipboardList,
  Settings,
  ChevronDown,
  ChevronRight,
  Search
} from 'lucide-react';

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  subFilter,
  setSubFilter,
  stats
}) {
  const [menuSearch, setMenuSearch] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const toggleGroup = (groupId) => {
    setCollapsedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const navSections = [
    {
      group: 'Core Command',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: <LayoutDashboard size={18} />
        }
      ]
    },
    {
      group: 'People & Trust',
      items: [
        {
          id: 'customers',
          label: 'Customers',
          icon: <Users size={18} />,
          badge: stats?.totalCustomers,
          subItems: [
            { id: 'all', label: 'All Customers' },
            { id: 'active', label: 'Active Customers' },
            { id: 'suspended', label: 'Suspended Customers' },
            { id: 'blocked', label: 'Blocked Customers' }
          ]
        },
        {
          id: 'partners',
          label: 'Partners',
          icon: <HeartHandshake size={18} />,
          badge: stats?.totalPartners,
          subItems: [
            { id: 'all', label: 'All Partners' },
            { id: 'new', label: 'New Applications' },
            { id: 'verified', label: 'Verified Partners' },
            { id: 'suspended', label: 'Suspended Partners' },
            { id: 'blocked', label: 'Blocked Partners' }
          ]
        },
        {
          id: 'kyc',
          label: 'KYC & Verification',
          icon: <ShieldCheck size={18} />,
          badge: stats?.pendingKYC > 0 ? stats.pendingKYC : null,
          badgeColor: 'amber',
          subItems: [
            { id: 'pending', label: 'Pending Review' },
            { id: 'verified', label: 'Verified KYC' },
            { id: 'rejected', label: 'Rejected Applications' },
            { id: 'history', label: 'Verification History' }
          ]
        },
        {
          id: 'safety',
          label: 'Safety Center',
          icon: <ShieldAlert size={18} />,
          badge: stats?.safetyAlertsCount > 0 ? stats.safetyAlertsCount : null,
          badgeColor: 'rose',
          subItems: [
            { id: 'all', label: 'Incident Reports' },
            { id: 'sos', label: 'Emergency SOS Alerts' },
            { id: 'suspicious', label: 'Suspicious Accounts' }
          ]
        },
        {
          id: 'complaints',
          label: 'Complaints & Disputes',
          icon: <AlertTriangle size={18} />,
          badge: stats?.openDisputes > 0 ? stats.openDisputes : null,
          badgeColor: 'amber',
          subItems: [
            { id: 'all', label: 'All Disputes' },
            { id: 'investigating', label: 'Under Investigation' },
            { id: 'resolved', label: 'Resolved' }
          ]
        },
        {
          id: 'reviews',
          label: 'Reviews & Ratings',
          icon: <Star size={18} />
        }
      ]
    },
    {
      group: 'Operations & Fulfillment',
      items: [
        {
          id: 'bookings',
          label: 'Bookings',
          icon: <Calendar size={18} />,
          badge: stats?.totalBookings,
          subItems: [
            { id: 'all', label: 'All Bookings' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'ongoing', label: 'Ongoing' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
            { id: 'disputed', label: 'Disputed' }
          ]
        },
        {
          id: 'calendar',
          label: 'Calendar & Schedule',
          icon: <CalendarDays size={18} />
        },
        {
          id: 'locations',
          label: 'Cities & Locations',
          icon: <MapPin size={18} />,
          subItems: [
            { id: 'all', label: 'States & Cities' },
            { id: 'areas', label: 'Service Areas' }
          ]
        },
        {
          id: 'services',
          label: 'Services & Catalog',
          icon: <Sparkles size={18} />
        },
        {
          id: 'cancellation',
          label: 'Cancellation Rules',
          icon: <ClipboardList size={18} />
        }
      ]
    },
    {
      group: 'Finance & Growth',
      items: [
        {
          id: 'payments',
          label: 'Payments & Gateway',
          icon: <CreditCard size={18} />,
          subItems: [
            { id: 'all', label: 'Transactions' },
            { id: 'refunds', label: 'Refunds' },
            { id: 'gateway', label: 'Gateway Logs' }
          ]
        },
        {
          id: 'payouts',
          label: 'Partner Payouts',
          icon: <Wallet size={18} />,
          badge: stats?.pendingPayouts > 0 ? stats.pendingPayouts : null,
          badgeColor: 'amber',
          subItems: [
            { id: 'pending', label: 'Pending Approval' },
            { id: 'completed', label: 'Settled Disbursals' },
            { id: 'failed', label: 'Failed Payouts' }
          ]
        },
        {
          id: 'commissions',
          label: 'Commission Rules',
          icon: <TrendingUp size={18} />
        },
        {
          id: 'coupons',
          label: 'Coupons & Promos',
          icon: <Tag size={18} />
        },
        {
          id: 'reports',
          label: 'Reports & Analytics',
          icon: <BarChart2 size={18} />,
          subItems: [
            { id: 'revenue', label: 'Revenue Trends' },
            { id: 'bookings', label: 'Bookings Volume' },
            { id: 'partners', label: 'Partner Metrics' },
            { id: 'cities', label: 'City Breakdown' }
          ]
        }
      ]
    },
    {
      group: 'Administration & System',
      items: [
        {
          id: 'notifications',
          label: 'Notifications & Broadcasts',
          icon: <Bell size={18} />
        },
        {
          id: 'cms',
          label: 'Content Management (CMS)',
          icon: <FileText size={18} />,
          subItems: [
            { id: 'pages', label: 'Pages & Content' },
            { id: 'faqs', label: 'FAQs' },
            { id: 'banners', label: 'Banners' }
          ]
        },
        {
          id: 'admin-users',
          label: 'Admin Users & Team',
          icon: <UserCheck size={18} />
        },
        {
          id: 'roles',
          label: 'Roles & Permissions',
          icon: <Key size={18} />
        },
        {
          id: 'audit-logs',
          label: 'Audit Logs',
          icon: <ClipboardList size={18} />
        },
        {
          id: 'settings',
          label: 'Platform Settings',
          icon: <Settings size={18} />
        }
      ]
    }
  ];

  const filteredSections = navSections.map(sec => ({
    ...sec,
    items: sec.items.filter(item =>
      menuSearch === '' ||
      item.label.toLowerCase().includes(menuSearch.toLowerCase()) ||
      (item.subItems && item.subItems.some(sub => sub.label.toLowerCase().includes(menuSearch.toLowerCase())))
    )
  })).filter(sec => sec.items.length > 0);

  return (
    <aside className="admin-sidebar">
      {/* Sidebar Header */}
      <div className="admin-sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 10px #10b981'
            }} />
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Operations Desk Live
            </span>
          </div>
          <span style={{
            fontSize: '0.65rem',
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: 700
          }}>
            V2.4 PRO
          </span>
        </div>

        {/* Quick Menu Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '8px',
          padding: '6px 10px'
        }}>
          <Search size={14} color="#64748b" />
          <input
            type="text"
            placeholder="Search console..."
            value={menuSearch}
            onChange={(e) => setMenuSearch(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              fontSize: '0.8rem',
              color: '#f8fafc',
              width: '100%',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Navigation Sections */}
      <div style={{ paddingBottom: '20px' }}>
        {filteredSections.map((sec, sIdx) => (
          <div key={sIdx}>
            <div
              className="admin-nav-group-title"
              style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}
              onClick={() => toggleGroup(sec.group)}
            >
              <span>{sec.group}</span>
              {collapsedGroups[sec.group] ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
            </div>

            {!collapsedGroups[sec.group] && (
              <div>
                {sec.items.map(item => {
                  const isActive = activeTab === item.id;
                  const hasSub = item.subItems && item.subItems.length > 0;

                  return (
                    <div key={item.id}>
                      <button
                        className={`admin-nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => {
                          setActiveTab(item.id);
                          if (item.subItems && item.subItems[0]) {
                            setSubFilter(item.subItems[0].id);
                          } else {
                            setSubFilter('all');
                          }
                        }}
                      >
                        <div className="admin-nav-item-left">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {item.badge !== undefined && item.badge !== null && (
                            <span className={`admin-badge admin-badge-${item.badgeColor || 'cyan'}`}>
                              {item.badge}
                            </span>
                          )}
                          {hasSub && (
                            <ChevronDown
                              size={12}
                              style={{
                                transform: isActive ? 'rotate(0deg)' : 'rotate(-90deg)',
                                transition: 'transform 0.2s ease',
                                opacity: 0.6
                              }}
                            />
                          )}
                        </div>
                      </button>

                      {/* Sub-item pills when parent is active */}
                      {isActive && hasSub && (
                        <div style={{
                          margin: '2px 14px 8px 38px',
                          paddingLeft: '12px',
                          borderLeft: '1px dashed rgba(56, 189, 248, 0.35)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px'
                        }}>
                          {item.subItems.map(sub => {
                            const isSubActive = subFilter === sub.id;
                            return (
                              <button
                                key={sub.id}
                                onClick={() => setSubFilter(sub.id)}
                                style={{
                                  textAlign: 'left',
                                  padding: '5px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.78rem',
                                  fontWeight: isSubActive ? 700 : 500,
                                  color: isSubActive ? '#38bdf8' : '#94a3b8',
                                  background: isSubActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                                  border: 'none',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                • {sub.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
