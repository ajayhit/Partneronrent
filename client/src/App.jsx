import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import ChatDrawer from './components/ChatDrawer';
import SOSModal from './components/SOSModal';
import ReviewModal from './components/ReviewModal';

// Pages
import Home from './pages/Home';
import PartnerDirectory from './pages/PartnerDirectory';
import PartnerProfile from './pages/PartnerProfile';
import SignIn from './pages/SignIn';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientWallet from './pages/client/ClientWallet';
import PartnerDashboard from './pages/partner/PartnerDashboard';
import PartnerEarnings from './pages/partner/PartnerEarnings';
import PartnerKYC from './pages/partner/PartnerKYC';
import AdminDashboard from './pages/admin/AdminDashboard';

// Pages that require the user to be logged in
const PROTECTED_PAGES = new Set([
  'client-dashboard',
  'client-wallet',
  'partner-dashboard',
  'partner-earnings',
  'partner-kyc',
  'admin-dashboard'
]);

// Map: which role can access which pages
const ROLE_PAGES = {
  client: new Set(['client-dashboard', 'client-wallet']),
  partner: new Set(['partner-dashboard', 'partner-earnings', 'partner-kyc']),
  admin: new Set(['admin-dashboard'])
};

function MainLayout() {
  const [activePage, setActivePage] = useState('home');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const { isAuthenticated, currentRole, logout } = useAuth();
  const { toast } = useApp();

  // ── Route guard: redirect to auth when accessing protected pages ──────────
  const safeguardedSetPage = (page) => {
    if (PROTECTED_PAGES.has(page)) {
      if (!isAuthenticated) {
        setActivePage('auth');
        return;
      }
      // Role mismatch: redirect to correct dashboard
      const allowed = ROLE_PAGES[currentRole];
      if (allowed && !allowed.has(page)) {
        if (currentRole === 'client') { setActivePage('client-dashboard'); return; }
        if (currentRole === 'partner') { setActivePage('partner-dashboard'); return; }
        if (currentRole === 'admin') { setActivePage('admin-dashboard'); return; }
      }
    }
    setActivePage(page);
  };

  // ── On auth state change, bounce out of protected pages if logged out ─────
  useEffect(() => {
    if (!isAuthenticated && PROTECTED_PAGES.has(activePage)) {
      setActivePage('auth');
    }
  }, [isAuthenticated]);

  return (
    <div className="app-container">
      {/* Toast Notification Banner */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          zIndex: 9999,
          background: toast.type === 'danger' ? '#ef4444' : toast.type === 'warning' ? '#f59e0b' : '#10b981',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.3s ease'
        }}>
          {toast.message}
        </div>
      )}

      {/* Top Navigation */}
      <Navbar activePage={activePage} setActivePage={safeguardedSetPage} />

      {/* Main Content Area */}
      <main className="main-content">
        {/* ── Auth Page ─────────────────────────────────────────── */}
        {activePage === 'auth' && (
          <SignIn setActivePage={safeguardedSetPage} />
        )}

        {/* ── Public Pages ──────────────────────────────────────── */}
        {activePage === 'home' && (
          <Home
            setActivePage={safeguardedSetPage}
            onSelectPartner={(partner) => {
              setSelectedPartner(partner);
              safeguardedSetPage('partner-detail');
            }}
          />
        )}

        {activePage === 'directory' && (
          <PartnerDirectory
            setActivePage={safeguardedSetPage}
            onSelectPartner={(partner) => {
              setSelectedPartner(partner);
              safeguardedSetPage('partner-detail');
            }}
          />
        )}

        {activePage === 'partner-detail' && (
          <PartnerProfile
            partnerId={selectedPartner?.id}
            partnerObj={selectedPartner}
            onBack={() => safeguardedSetPage('directory')}
            setActivePage={safeguardedSetPage}
          />
        )}

        {/* ── Client Portal Pages ────────────────────────────────── */}
        {activePage === 'client-dashboard' && isAuthenticated && currentRole === 'client' && (
          <ClientDashboard
            setActivePage={safeguardedSetPage}
            onSelectPartner={(partner) => {
              setSelectedPartner(partner);
              safeguardedSetPage('partner-detail');
            }}
          />
        )}

        {activePage === 'client-wallet' && isAuthenticated && currentRole === 'client' && (
          <ClientWallet />
        )}

        {/* ── Partner Portal Pages ───────────────────────────────── */}
        {activePage === 'partner-dashboard' && isAuthenticated && currentRole === 'partner' && (
          <PartnerDashboard setActivePage={safeguardedSetPage} />
        )}

        {activePage === 'partner-earnings' && isAuthenticated && currentRole === 'partner' && (
          <PartnerEarnings />
        )}

        {activePage === 'partner-kyc' && isAuthenticated && currentRole === 'partner' && (
          <PartnerKYC />
        )}

        {/* ── Admin Portal Pages ─────────────────────────────────── */}
        {activePage === 'admin-dashboard' && isAuthenticated && currentRole === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Global Modals */}
      <BookingModal onBookingCreated={() => safeguardedSetPage('client-dashboard')} />
      <ChatDrawer />
      <SOSModal />
      <ReviewModal onReviewSubmitted={() => {}} />

      {/* Footer */}
      <Footer setActivePage={safeguardedSetPage} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}
