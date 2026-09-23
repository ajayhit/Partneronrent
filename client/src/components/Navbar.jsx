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
  ChevronDown
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const { isAuthenticated, currentRole, session, activeUser, activePartner, logout } = useAuth();
  const { openSOS } = useApp();
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
          onClick={() => setActivePage('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(124, 58, 237, 0.5)'
          }}>
            <HeartHandshake size={24} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Partner<span style={{ color: '#ec4899' }}>OnRent</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>
              Emotional Wellness & Companionship
            </div>
          </div>
        </div>

        {/* Center Nav Links */}
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

          {/* Role-specific portal link — only when logged in */}
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

          {isAuthenticated && currentRole === 'admin' && (
            <button
              onClick={() => setActivePage('admin-dashboard')}
              style={{
                color: activePage.startsWith('admin-') ? '#38bdf8' : '#94a3b8',
                fontWeight: 600, fontSize: '0.92rem',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              <LayoutDashboard size={16} /> Admin Portal
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

          {/* Wallet / Earnings chip — only when logged in */}
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

          {/* Emergency SOS Button */}
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

          {/* ── Authenticated: avatar + profile dropdown ──────── */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileMenuOpen(o => !o)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '5px 10px 5px 5px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer'
                }}
              >
                <img
                  src={displayUser?.avatar}
                  alt={displayUser?.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #7c3aed' }}
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
                    minWidth: '200px',
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
                      {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
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
                      <DropdownItem icon={<LayoutDashboard size={14} />} onClick={() => { setActivePage('admin-dashboard'); setProfileMenuOpen(false); }}>Admin Panel</DropdownItem>
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
          padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px'
        }}>
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
          {isAuthenticated && currentRole === 'admin' && (
            <button onClick={() => { setActivePage('admin-dashboard'); setMobileMenuOpen(false); }} style={{ color: '#fff', textAlign: 'left', fontWeight: 600 }}>Admin Panel</button>
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
