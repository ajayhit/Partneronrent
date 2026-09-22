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
  Sparkles
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const { currentRole, switchRole, activeUser, activePartner } = useAuth();
  const { openSOS } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="glass-nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: '72px' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
        
        {/* Logo */}
        <div 
          onClick={() => setActivePage('home')} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
              fontWeight: 600, 
              fontSize: '0.92rem' 
            }}
          >
            Home
          </button>
          
          <button 
            onClick={() => setActivePage('directory')}
            style={{ 
              color: activePage === 'directory' ? '#c084fc' : '#94a3b8', 
              fontWeight: 600, 
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Search size={16} /> Find Partner
          </button>

          {/* Role specific link */}
          {currentRole === 'client' && (
            <button 
              onClick={() => setActivePage('client-dashboard')}
              style={{ 
                color: activePage.startsWith('client-') ? '#ec4899' : '#94a3b8', 
                fontWeight: 600, 
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <User size={16} /> Hirer Portal
            </button>
          )}

          {currentRole === 'partner' && (
            <button 
              onClick={() => setActivePage('partner-dashboard')}
              style={{ 
                color: activePage.startsWith('partner-') ? '#10b981' : '#94a3b8', 
                fontWeight: 600, 
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Briefcase size={16} /> Partner Portal
            </button>
          )}

          {currentRole === 'admin' && (
            <button 
              onClick={() => setActivePage('admin-dashboard')}
              style={{ 
                color: activePage.startsWith('admin-') ? '#38bdf8' : '#94a3b8', 
                fontWeight: 600, 
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LayoutDashboard size={16} /> Admin Portal
            </button>
          )}
        </div>

        {/* Right Action: Quick Role Switcher Pill & SOS & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Quick Role Switcher Selector */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-active)',
            borderRadius: 'var(--radius-full)',
            padding: '3px',
            display: 'flex',
            alignItems: 'center',
            gap: '2px'
          }}>
            <button 
              onClick={() => { switchRole('client'); setActivePage('client-dashboard'); }}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700,
                background: currentRole === 'client' ? 'linear-gradient(135deg, #7c3aed, #ec4899)' : 'transparent',
                color: currentRole === 'client' ? '#fff' : '#94a3b8'
              }}
            >
              Hirer
            </button>
            <button 
              onClick={() => { switchRole('partner'); setActivePage('partner-dashboard'); }}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700,
                background: currentRole === 'partner' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
                color: currentRole === 'partner' ? '#fff' : '#94a3b8'
              }}
            >
              Partner
            </button>
            <button 
              onClick={() => { switchRole('admin'); setActivePage('admin-dashboard'); }}
              style={{
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 700,
                background: currentRole === 'admin' ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'transparent',
                color: currentRole === 'admin' ? '#fff' : '#94a3b8'
              }}
            >
              Admin
            </button>
          </div>

          {/* Quick Wallet/Earnings chip */}
          {currentRole === 'client' && (
            <div 
              onClick={() => setActivePage('client-wallet')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: 'rgba(236, 72, 153, 0.12)',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#f472b6'
              }}
              title="Client Wallet Balance"
            >
              <Wallet size={14} />
              <span>{formatCurrency(activeUser?.walletBalance || 4500)}</span>
            </div>
          )}

          {currentRole === 'partner' && (
            <div 
              onClick={() => setActivePage('partner-earnings')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#34d399'
              }}
              title="Partner Wallet Balance"
            >
              <Wallet size={14} />
              <span>{formatCurrency(activePartner?.walletBalance || 18400)}</span>
            </div>
          )}

          {/* Emergency SOS Button */}
          <button 
            onClick={() => openSOS({ id: 'GENERAL', location: 'Active User Session' })}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            title="Instant 24x7 Safety Dispatch SOS"
          >
            <AlertTriangle size={14} />
            <span>SOS</span>
          </button>

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
          position: 'absolute',
          top: '72px',
          left: 0,
          right: 0,
          background: '#0f172a',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <button onClick={() => { setActivePage('home'); setMobileMenuOpen(false); }} style={{ color: '#fff', textAlign: 'left', fontWeight: 600 }}>Home</button>
          <button onClick={() => { setActivePage('directory'); setMobileMenuOpen(false); }} style={{ color: '#fff', textAlign: 'left', fontWeight: 600 }}>Find Partner</button>
          <button onClick={() => { setActivePage('client-dashboard'); setMobileMenuOpen(false); }} style={{ color: '#fff', textAlign: 'left', fontWeight: 600 }}>Hirer Portal</button>
          <button onClick={() => { setActivePage('partner-dashboard'); setMobileMenuOpen(false); }} style={{ color: '#fff', textAlign: 'left', fontWeight: 600 }}>Partner Portal</button>
          <button onClick={() => { setActivePage('admin-dashboard'); setMobileMenuOpen(false); }} style={{ color: '#fff', textAlign: 'left', fontWeight: 600 }}>Admin Portal</button>
        </div>
      )}
    </nav>
  );
}
