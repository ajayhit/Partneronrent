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
// ClientWallet is now integrated inside ClientDashboard (wallet tab)
import PartnerDashboard from './pages/partner/PartnerDashboard';
import PartnerEarnings from './pages/partner/PartnerEarnings';
import PartnerKYC from './pages/partner/PartnerKYC';
import AdminDashboard from './pages/admin/AdminDashboard';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import SafetyGuidelines from './pages/SafetyGuidelines';
import PartnerCodeOfConduct from './pages/PartnerCodeOfConduct';
import Feedback from './pages/Feedback';
import AboutUs from './pages/AboutUs';
import FAQ from './pages/FAQ';
import ContactUs from './pages/ContactUs';

// Pages that require the user to be logged in (Directory is strictly protected behind login)
const PROTECTED_PAGES = new Set([
  'directory',
  'partner-detail',
  'client-dashboard',
  'client-wallet',
  'client-bookings',
  'client-messages',
  'client-profile',
  'client-settings',
  'partner-dashboard',
  'partner-earnings',
  'partner-kyc',
  'admin-dashboard'
]);

// Map: which role can access which pages
const ROLE_PAGES = {
  client: new Set(['directory', 'partner-detail', 'client-dashboard', 'client-wallet', 'client-bookings', 'client-messages', 'client-profile', 'client-settings']),
  partner: new Set(['partner-dashboard', 'partner-earnings', 'partner-kyc']),
  admin: new Set(['admin-dashboard']),
  both: new Set(['directory', 'partner-detail', 'client-dashboard', 'client-wallet', 'client-bookings', 'client-messages', 'client-profile', 'client-settings', 'partner-dashboard', 'partner-earnings', 'partner-kyc'])
};

const POR_PAGE_KEY = 'por_active_page';

function getInitialPage() {
  try {
    const rawSession = localStorage.getItem('por_session');
    const session = rawSession ? JSON.parse(rawSession) : null;
    const savedPage = localStorage.getItem(POR_PAGE_KEY);

    if (session && session.role) {
      const role = session.role;
      const defaultDashboard =
        role === 'client' ? 'client-dashboard' :
        role === 'admin' ? 'admin-dashboard' :
        'partner-dashboard';

      if (savedPage && savedPage !== 'home' && savedPage !== 'auth') {
        const allowed = ROLE_PAGES[role];
        if (allowed && allowed.has(savedPage)) {
          return savedPage;
        }
      }
      return defaultDashboard;
    }

    if (savedPage && !PROTECTED_PAGES.has(savedPage) && savedPage !== 'auth') {
      return savedPage;
    }
  } catch (e) {
    console.error('Error determining initial page:', e);
  }
  return 'home';
}

function MainLayout() {
  const [activePage, setActivePage] = useState(getInitialPage);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const { isAuthenticated, currentRole, logout } = useAuth();
  const { toast } = useApp();

  // Keep a ref to the latest auth state so callbacks/timers in children never read stale closures
  const authRef = React.useRef({ isAuthenticated, currentRole });
  useEffect(() => {
    authRef.current = { isAuthenticated, currentRole };
  }, [isAuthenticated, currentRole]);

  // ── Sync active page to localStorage ───────────────────────────────────────
  useEffect(() => {
    if (activePage) {
      localStorage.setItem(POR_PAGE_KEY, activePage);
    }
  }, [activePage]);

  // ── Route guard: redirect to auth when accessing protected pages ──────────
  const safeguardedSetPage = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const { isAuthenticated: isAuth, currentRole: role } = authRef.current;

    // Prevent authenticated user from viewing the public home page — send to dashboard
    if (isAuth && page === 'home') {
      if (role === 'client') { setActivePage('client-dashboard'); return; }
      if (role === 'partner' || role === 'both') { setActivePage('partner-dashboard'); return; }
      if (role === 'admin') { setActivePage('admin-dashboard'); return; }
    }

    if (PROTECTED_PAGES.has(page)) {
      if (!isAuth) {
        setActivePage('auth');
        return;
      }
      // Role mismatch: redirect to correct dashboard
      const allowed = ROLE_PAGES[role];
      if (allowed && !allowed.has(page)) {
        if (role === 'client') { setActivePage('client-dashboard'); return; }
        if (role === 'partner' || role === 'both') { setActivePage('partner-dashboard'); return; }
        if (role === 'admin') { setActivePage('admin-dashboard'); return; }
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

  // ── If authenticated user lands on 'home' or 'auth', redirect to their dashboard ─
  useEffect(() => {
    if (isAuthenticated && (activePage === 'home' || activePage === 'auth')) {
      if (currentRole === 'client') {
        setActivePage('client-dashboard');
      } else if (currentRole === 'partner' || currentRole === 'both') {
        setActivePage('partner-dashboard');
      } else if (currentRole === 'admin') {
        setActivePage('admin-dashboard');
      }
    }
  }, [isAuthenticated, currentRole, activePage]);

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

        {/* ── Policy & Legal Governance Pages ───────────────────── */}
        {(activePage === 'terms' || activePage === 'terms-of-service') && (
          <TermsOfService setActivePage={safeguardedSetPage} />
        )}

        {(activePage === 'privacy' || activePage === 'privacy-policy') && (
          <PrivacyPolicy setActivePage={safeguardedSetPage} />
        )}

        {(activePage === 'safety' || activePage === 'safety-guidelines') && (
          <SafetyGuidelines setActivePage={safeguardedSetPage} />
        )}

        {(activePage === 'conduct' || activePage === 'partner-code-of-conduct') && (
          <PartnerCodeOfConduct setActivePage={safeguardedSetPage} />
        )}

        {/* ── Community, Company & Help Pages ────────────────────── */}
        {activePage === 'feedback' && (
          <Feedback setActivePage={safeguardedSetPage} />
        )}

        {activePage === 'about' && (
          <AboutUs setActivePage={safeguardedSetPage} />
        )}

        {activePage === 'faq' && (
          <FAQ setActivePage={safeguardedSetPage} />
        )}

        {activePage === 'contact' && (
          <ContactUs setActivePage={safeguardedSetPage} />
        )}

        {/* ── Client Portal Pages ────────────────────────────────── */}
        {activePage === 'client-dashboard' && isAuthenticated && currentRole === 'client' && (
          <ClientDashboard
            initialTab="dashboard"
            setActivePage={safeguardedSetPage}
          />
        )}

        {activePage === 'client-wallet' && isAuthenticated && currentRole === 'client' && (
          <ClientDashboard
            initialTab="wallet"
            setActivePage={safeguardedSetPage}
          />
        )}

        {activePage === 'client-bookings' && isAuthenticated && currentRole === 'client' && (
          <ClientDashboard
            initialTab="bookings"
            setActivePage={safeguardedSetPage}
          />
        )}

        {activePage === 'client-messages' && isAuthenticated && currentRole === 'client' && (
          <ClientDashboard
            initialTab="messages"
            setActivePage={safeguardedSetPage}
          />
        )}

        {activePage === 'client-profile' && isAuthenticated && currentRole === 'client' && (
          <ClientDashboard
            initialTab="profile"
            setActivePage={safeguardedSetPage}
          />
        )}

        {activePage === 'client-settings' && isAuthenticated && currentRole === 'client' && (
          <ClientDashboard
            initialTab="settings"
            setActivePage={safeguardedSetPage}
          />
        )}

        {/* ── Partner Portal Pages ───────────────────────────────── */}
        {activePage === 'partner-dashboard' && isAuthenticated && (currentRole === 'partner' || currentRole === 'both') && (
          <PartnerDashboard setActivePage={safeguardedSetPage} />
        )}

        {activePage === 'partner-earnings' && isAuthenticated && (currentRole === 'partner' || currentRole === 'both') && (
          <PartnerDashboard initialTab="earnings" setActivePage={safeguardedSetPage} />
        )}

        {activePage === 'partner-kyc' && isAuthenticated && (currentRole === 'partner' || currentRole === 'both') && (
          <PartnerDashboard initialTab="kyc" setActivePage={safeguardedSetPage} />
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

      {/* Footer (hidden in partner panel & admin console) */}
      {!activePage.startsWith('partner-') && activePage !== 'admin-dashboard' && (
        <Footer setActivePage={safeguardedSetPage} />
      )}
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
