import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';
import {
  HeartHandshake,
  ShieldCheck,
  Search,
  User,
  Briefcase,
  LayoutDashboard,
  Wallet,
  AlertTriangle,
  Menu,
  X,
  Sparkles,
  LogIn,
  LogOut,
  ChevronDown,
  Calendar,
  Lock,
  Sliders,
  Users
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const { isAuthenticated, currentRole, session, activeUser, activePartner, logout } = useAuth();
  const { openSOS, adminActiveTab, setAdminActiveTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    setActivePage('home');
  };

  // The display user for the avatar chip
  const displayUser = session;

  return (
    <nav className="glass-nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: '72px' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>

        {/* Logo */}
        <div
          onClick={() => {
            if (currentRole === 'admin') {
              setActivePage('admin-dashboard');
              setAdminActiveTab('overview');
            } else {
              setActivePage('home');
            }
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: currentRole === 'admin'
              ? 'linear-gradient(135deg, #0284c7, #0369a1)'
              : 'linear-gradient(135deg, #7c3aed, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: currentRole === 'admin'
              ? '0 0 16px rgba(2, 132, 199, 0.5)'
              : '0 0 16px rgba(124, 58, 237, 0.5)'
          }}>
            {currentRole === 'admin' ? <LayoutDashboard size={24} color="#fff" /> : <HeartHandshake size={24} color="#fff" />}
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Partner<span style={{ color: currentRole === 'admin' ? '#38bdf8' : '#ec4899' }}>OnRent</span>
              {currentRole === 'admin' && (
                <span style={{
                  fontSize: '0.62rem',
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  padding: '2px 7px',
                  borderRadius: '6px',
                  fontWeight: 800,
                  letterSpacing: '0.05em'
                }}>
                  ADMIN PANEL
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>
              {currentRole === 'admin' ? 'Operations & Governance Console' : 'Emotional Wellness & Companionship'}
            </div>
          </div>
        </div>

        {/* Center Nav Links */}
        {currentRole === 'admin' ? (
          /* ── ADMIN NAV LINKS: ONLY ADMIN-RELATED OPTIONS (NO FIND OPTION) ── */
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="desktop-links">
            <button
              onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('overview'); }}
              style={{
                color: activePage === 'admin-dashboard' && adminActiveTab === 'overview' ? '#38bdf8' : '#94a3b8',
                fontWeight: 600, fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 10px', borderRadius: '8px',
                background: activePage === 'admin-dashboard' && adminActiveTab === 'overview' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                border: activePage === 'admin-dashboard' && adminActiveTab === 'overview' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent'
              }}
            >
              <LayoutDashboard size={14} /> Dashboard
            </button>

            <button
              onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('kyc'); }}
              style={{
                color: activePage === 'admin-dashboard' && adminActiveTab === 'kyc' ? '#38bdf8' : '#94a3b8',
                fontWeight: 600, fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 10px', borderRadius: '8px',
                background: activePage === 'admin-dashboard' && adminActiveTab === 'kyc' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                border: activePage === 'admin-dashboard' && adminActiveTab === 'kyc' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent'
              }}
            >
              <ShieldCheck size={14} /> KYC
            </button>

            <button
              onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('payouts'); }}
              style={{
                color: activePage === 'admin-dashboard' && adminActiveTab === 'payouts' ? '#38bdf8' : '#94a3b8',
                fontWeight: 600, fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 10px', borderRadius: '8px',
                background: activePage === 'admin-dashboard' && adminActiveTab === 'payouts' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                border: activePage === 'admin-dashboard' && adminActiveTab === 'payouts' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent'
              }}
            >
              <Wallet size={14} /> Payouts
            </button>

            <button
              onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('bookings'); }}
              style={{
                color: activePage === 'admin-dashboard' && adminActiveTab === 'bookings' ? '#38bdf8' : '#94a3b8',
                fontWeight: 600, fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 10px', borderRadius: '8px',
                background: activePage === 'admin-dashboard' && adminActiveTab === 'bookings' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                border: activePage === 'admin-dashboard' && adminActiveTab === 'bookings' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent'
              }}
            >
              <Calendar size={14} /> Bookings
            </button>

            <button
              onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('sos'); }}
              style={{
                color: activePage === 'admin-dashboard' && adminActiveTab === 'sos' ? '#f87171' : '#94a3b8',
                fontWeight: 600, fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 10px', borderRadius: '8px',
                background: activePage === 'admin-dashboard' && adminActiveTab === 'sos' ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                border: activePage === 'admin-dashboard' && adminActiveTab === 'sos' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid transparent'
              }}
            >
              <AlertTriangle size={14} /> SOS Alerts
            </button>

            <button
              onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('partners'); }}
              style={{
                color: activePage === 'admin-dashboard' && adminActiveTab === 'partners' ? '#38bdf8' : '#94a3b8',
                fontWeight: 600, fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 10px', borderRadius: '8px',
                background: activePage === 'admin-dashboard' && adminActiveTab === 'partners' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                border: activePage === 'admin-dashboard' && adminActiveTab === 'partners' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent'
              }}
            >
              <Users size={14} /> Partners
            </button>

            <button
              onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('users'); }}
              style={{
                color: activePage === 'admin-dashboard' && adminActiveTab === 'users' ? '#38bdf8' : '#94a3b8',
                fontWeight: 600, fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 10px', borderRadius: '8px',
                background: activePage === 'admin-dashboard' && adminActiveTab === 'users' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                border: activePage === 'admin-dashboard' && adminActiveTab === 'users' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent'
              }}
            >
              <User size={14} /> Hirers
            </button>

            <button
              onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('settings'); }}
              style={{
                color: activePage === 'admin-dashboard' && adminActiveTab === 'settings' ? '#38bdf8' : '#94a3b8',
                fontWeight: 600, fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 10px', borderRadius: '8px',
                background: activePage === 'admin-dashboard' && adminActiveTab === 'settings' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                border: activePage === 'admin-dashboard' && adminActiveTab === 'settings' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent'
              }}
            >
              <Sliders size={14} /> Settings
            </button>

            <button
              onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('security'); }}
              style={{
                color: activePage === 'admin-dashboard' && adminActiveTab === 'security' ? '#38bdf8' : '#94a3b8',
                fontWeight: 600, fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '5px',
                padding: '6px 10px', borderRadius: '8px',
                background: activePage === 'admin-dashboard' && adminActiveTab === 'security' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                border: activePage === 'admin-dashboard' && adminActiveTab === 'security' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid transparent'
              }}
            >
              <Lock size={14} /> Security
            </button>
          </div>
        ) : (
          /* ── PUBLIC & HIRER/PARTNER NAV LINKS ── */
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className="desktop-links">
            <button
              onClick={() => setActivePage('home')}
              style={{
                color: activePage === 'home' ? '#c084fc' : '#94a3b8',
                fontWeight: 600, fontSize: '0.92rem'
              }}
            >
              Home
            </button>

            <button
              onClick={() => setActivePage('directory')}
              style={{
                color: activePage === 'directory' ? '#c084fc' : '#94a3b8',
                fontWeight: 600, fontSize: '0.92rem',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              <Search size={16} /> Find Partner
            </button>

            {isAuthenticated && currentRole === 'client' && (
              <button
                onClick={() => setActivePage('client-dashboard')}
                style={{
                  color: activePage.startsWith('client-') ? '#ec4899' : '#94a3b8',
                  fontWeight: 600, fontSize: '0.92rem',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <User size={16} /> Hirer Portal
              </button>
            )}

            {isAuthenticated && currentRole === 'partner' && (
              <button
                onClick={() => setActivePage('partner-dashboard')}
                style={{
                  color: activePage.startsWith('partner-') ? '#10b981' : '#94a3b8',
                  fontWeight: 600, fontSize: '0.92rem',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <Briefcase size={16} /> Partner Portal
              </button>
            )}
          </div>
        )}

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

          {/* Admin Operations Badge */}
          {isAuthenticated && currentRole === 'admin' && (
            <div
              onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('overview'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8'
              }}
              title="Super Administrator Clearance"
            >
              <ShieldCheck size={14} />
              <span>Master Admin</span>
            </div>
          )}

          {/* Wallet / Earnings chip — only for client / partner */}
          {isAuthenticated && currentRole === 'client' && (
            <div
              onClick={() => setActivePage('client-wallet')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px',
                background: 'rgba(236, 72, 153, 0.12)',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, color: '#f472b6'
              }}
              title="Client Wallet Balance"
            >
              <Wallet size={14} />
              <span>{formatCurrency(displayUser?.walletBalance || 0)}</span>
            </div>
          )}

          {isAuthenticated && currentRole === 'partner' && (
            <div
              onClick={() => setActivePage('partner-earnings')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, color: '#34d399'
              }}
              title="Partner Wallet Balance"
            >
              <Wallet size={14} />
              <span>{formatCurrency(displayUser?.walletBalance || 0)}</span>
            </div>
          )}

          {/* Emergency SOS Button — ONLY FOR NON-ADMIN USERS (HIRERS & COMPANIONS) */}
          {currentRole !== 'admin' && (
            <button
              onClick={() => openSOS({ id: 'GENERAL', location: 'Active User Session' })}
              style={{
                padding: '6px 12px', borderRadius: 'var(--radius-full)',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171', fontSize: '0.78rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: '5px'
              }}
              title="Instant 24x7 Safety Dispatch SOS"
            >
              <AlertTriangle size={14} />
              <span>SOS</span>
            </button>
          )}

          {/* ── Authenticated: avatar + profile dropdown ──────── */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileMenuOpen(o => !o)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '5px 10px 5px 5px',
                  background: 'rgba(255,255,255,0.06)',
                  border: currentRole === 'admin' ? '1px solid rgba(56, 189, 248, 0.3)' : '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer'
                }}
              >
                <img
                  src={displayUser?.avatar}
                  alt={displayUser?.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: currentRole === 'admin' ? '2px solid #38bdf8' : '2px solid #7c3aed' }}
                />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {displayUser?.name?.split(' ')[0]}
                </span>
                <ChevronDown size={14} color="#64748b" />
              </button>

              {/* Profile dropdown */}
              {profileMenuOpen && (
                <div
                  style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                    minWidth: '220px',
                    background: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '14px',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                    overflow: 'hidden',
                    zIndex: 200
                  }}
                  onMouseLeave={() => setProfileMenuOpen(false)}
                >
                  {/* User info header */}
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>{displayUser?.name}</div>
                    <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>{displayUser?.email}</div>
                    <div style={{
                      marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '5px',
                      padding: '3px 8px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700,
                      background: currentRole === 'client'
                        ? 'rgba(236,72,153,0.15)' : currentRole === 'partner'
                        ? 'rgba(16,185,129,0.15)' : 'rgba(56,189,248,0.15)',
                      color: currentRole === 'client' ? '#f472b6' : currentRole === 'partner' ? '#34d399' : '#7dd3fc'
                    }}>
                      {currentRole === 'client' ? <User size={11} /> : currentRole === 'partner' ? <Briefcase size={11} /> : <LayoutDashboard size={11} />}
                      {currentRole === 'admin' ? 'Root Administrator' : currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
                    </div>
                  </div>

                  {/* Menu items */}
                  <div style={{ padding: '8px' }}>
                    {currentRole === 'client' && (
                      <>
                        <DropdownItem icon={<User size={14} />} onClick={() => { setActivePage('client-dashboard'); setProfileMenuOpen(false); }}>My Dashboard</DropdownItem>
                        <DropdownItem icon={<Wallet size={14} />} onClick={() => { setActivePage('client-wallet'); setProfileMenuOpen(false); }}>Wallet</DropdownItem>
                      </>
                    )}
                    {currentRole === 'partner' && (
                      <>
                        <DropdownItem icon={<Briefcase size={14} />} onClick={() => { setActivePage('partner-dashboard'); setProfileMenuOpen(false); }}>My Dashboard</DropdownItem>
                        <DropdownItem icon={<Wallet size={14} />} onClick={() => { setActivePage('partner-earnings'); setProfileMenuOpen(false); }}>Earnings</DropdownItem>
                        <DropdownItem icon={<ShieldCheck size={14} />} onClick={() => { setActivePage('partner-kyc'); setProfileMenuOpen(false); }}>KYC Status</DropdownItem>
                      </>
                    )}
                    {currentRole === 'admin' && (
                      <>
                        <DropdownItem icon={<LayoutDashboard size={14} />} onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('overview'); setProfileMenuOpen(false); }}>Operations Dashboard</DropdownItem>
                        <DropdownItem icon={<ShieldCheck size={14} />} onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('kyc'); setProfileMenuOpen(false); }}>Partner KYC Queue</DropdownItem>
                        <DropdownItem icon={<Wallet size={14} />} onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('payouts'); setProfileMenuOpen(false); }}>Payout Approvals</DropdownItem>
                        <DropdownItem icon={<Calendar size={14} />} onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('bookings'); setProfileMenuOpen(false); }}>Bookings Oversight</DropdownItem>
                        <DropdownItem icon={<AlertTriangle size={14} />} onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('sos'); setProfileMenuOpen(false); }}>Safety SOS Monitor</DropdownItem>
                        <DropdownItem icon={<Users size={14} />} onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('partners'); setProfileMenuOpen(false); }}>Partners Directory</DropdownItem>
                        <DropdownItem icon={<User size={14} />} onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('users'); setProfileMenuOpen(false); }}>Hirers Registry</DropdownItem>
                        <DropdownItem icon={<Sliders size={14} />} onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('settings'); setProfileMenuOpen(false); }}>Platform Settings</DropdownItem>
                        <DropdownItem icon={<Lock size={14} />} onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('security'); setProfileMenuOpen(false); }}>Security & Password</DropdownItem>
                      </>
                    )}
                  </div>

                  <div style={{ padding: '8px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%', padding: '9px 12px',
                        borderRadius: '8px',
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        color: '#f87171', fontSize: '0.85rem', fontWeight: 600,
                        display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                      }}
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Not authenticated: Sign In button ─────────── */
            <button
              onClick={() => setActivePage('auth')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                color: '#fff', fontSize: '0.88rem', fontWeight: 700,
                boxShadow: '0 4px 14px rgba(124,58,237,0.4)',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <LogIn size={15} /> Sign In
            </button>
          )}

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: '#fff', display: 'none' }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute', top: '72px', left: 0, right: 0,
          background: '#0f172a', borderBottom: '1px solid var(--border-subtle)',
          padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px',
          maxHeight: 'calc(100vh - 72px)', overflowY: 'auto'
        }}>
          {currentRole === 'admin' ? (
            /* Admin Mobile Drawer: Only Admin Options, NO Find Option */
            <>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', paddingBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                Admin Operations
              </div>
              <button onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('overview'); setMobileMenuOpen(false); }} style={{ color: '#fff', textAlign: 'left', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LayoutDashboard size={16} color="#38bdf8" /> Operations Dashboard
              </button>
              <button onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('kyc'); setMobileMenuOpen(false); }} style={{ color: '#fff', textAlign: 'left', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="#38bdf8" /> Partner KYC Applications
              </button>
              <button onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('payouts'); setMobileMenuOpen(false); }} style={{ color: '#fff', textAlign: 'left', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wallet size={16} color="#38bdf8" /> Payout Approvals
              </button>
              <button onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('bookings'); setMobileMenuOpen(false); }} style={{ color: '#fff', textAlign: 'left', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} color="#38bdf8" /> All Bookings Oversight
              </button>
              <button onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('sos'); setMobileMenuOpen(false); }} style={{ color: '#f87171', textAlign: 'left', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={16} color="#f87171" /> Safety SOS Incidents
              </button>
              <button onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('partners'); setMobileMenuOpen(false); }} style={{ color: '#fff', textAlign: 'left', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} color="#38bdf8" /> Partners Registry
              </button>
              <button onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('users'); setMobileMenuOpen(false); }} style={{ color: '#fff', textAlign: 'left', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} color="#38bdf8" /> Hirers & Clients Registry
              </button>
              <button onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('settings'); setMobileMenuOpen(false); }} style={{ color: '#fff', textAlign: 'left', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={16} color="#38bdf8" /> Platform Settings
              </button>
              <button onClick={() => { setActivePage('admin-dashboard'); setAdminActiveTab('security'); setMobileMenuOpen(false); }} style={{ color: '#fff', textAlign: 'left', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={16} color="#38bdf8" /> Security & Password
              </button>
            </>
          ) : (
            /* Non-Admin Mobile Drawer */
            <>
              <button onClick={() => { setActivePage('home'); setMobileMenuOpen(false); }} style={{ color: '#fff', textAlign: 'left', fontWeight: 600 }}>Home</button>
              <button onClick={() => { setActivePage('directory'); setMobileMenuOpen(false); }} style={{ color: '#fff', textAlign: 'left', fontWeight: 600 }}>Find Partner</button>
              {isAuthenticated && currentRole === 'client' && (
                <>
                  <button onClick={() => { setActivePage('client-dashboard'); setMobileMenuOpen(false); }} style={{ color: '#fff', textAlign: 'left', fontWeight: 600 }}>Hirer Portal</button>
                  <button onClick={() => { setActivePage('client-wallet'); setMobileMenuOpen(false); }} style={{ color: '#fff', textAlign: 'left', fontWeight: 600 }}>Wallet</button>
                </>
              )}
              {isAuthenticated && currentRole === 'partner' && (
                <>
                  <button onClick={() => { setActivePage('partner-dashboard'); setMobileMenuOpen(false); }} style={{ color: '#fff', textAlign: 'left', fontWeight: 600 }}>Partner Portal</button>
                  <button onClick={() => { setActivePage('partner-earnings'); setMobileMenuOpen(false); }} style={{ color: '#fff', textAlign: 'left', fontWeight: 600 }}>Earnings</button>
                </>
              )}
            </>
          )}
          {isAuthenticated ? (
            <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} style={{ color: '#f87171', textAlign: 'left', fontWeight: 600 }}>Sign Out</button>
          ) : (
            <button onClick={() => { setActivePage('auth'); setMobileMenuOpen(false); }} style={{ color: '#c084fc', textAlign: 'left', fontWeight: 600 }}>Sign In / Sign Up</button>
          )}
        </div>
      )}
    </nav>
  );
}

// Small helper component for dropdown items
function DropdownItem({ icon, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', padding: '9px 12px',
        borderRadius: '8px', background: 'transparent',
        border: 'none', color: '#94a3b8',
        fontSize: '0.85rem', fontWeight: 600,
        display: 'flex', alignItems: 'center', gap: '8px',
        cursor: 'pointer', textAlign: 'left',
        transition: 'all 0.15s'
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {icon} {children}
    </button>
  );
}
