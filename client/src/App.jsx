import React, { useState } from 'react';
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
import ClientDashboard from './pages/client/ClientDashboard';
import ClientWallet from './pages/client/ClientWallet';
import PartnerDashboard from './pages/partner/PartnerDashboard';
import PartnerEarnings from './pages/partner/PartnerEarnings';
import PartnerKYC from './pages/partner/PartnerKYC';
import AdminDashboard from './pages/admin/AdminDashboard';

function MainLayout() {
  const [activePage, setActivePage] = useState('home');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const { currentRole } = useAuth();
  const { toast } = useApp();

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
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content Area */}
      <main className="main-content">
        {activePage === 'home' && (
          <Home 
            setActivePage={setActivePage} 
            onSelectPartner={(partner) => {
              setSelectedPartner(partner);
              setActivePage('partner-detail');
            }} 
          />
        )}

        {activePage === 'directory' && (
          <PartnerDirectory 
            setActivePage={setActivePage}
            onSelectPartner={(partner) => {
              setSelectedPartner(partner);
              setActivePage('partner-detail');
            }}
          />
        )}

        {activePage === 'partner-detail' && (
          <PartnerProfile 
            partnerId={selectedPartner?.id}
            partnerObj={selectedPartner}
            onBack={() => setActivePage('directory')}
            setActivePage={setActivePage}
          />
        )}

        {/* Client Portal Pages */}
        {activePage === 'client-dashboard' && (
          <ClientDashboard 
            setActivePage={setActivePage}
            onSelectPartner={(partner) => {
              setSelectedPartner(partner);
              setActivePage('partner-detail');
            }}
          />
        )}

        {activePage === 'client-wallet' && (
          <ClientWallet />
        )}

        {/* Partner Portal Pages */}
        {activePage === 'partner-dashboard' && (
          <PartnerDashboard setActivePage={setActivePage} />
        )}

        {activePage === 'partner-earnings' && (
          <PartnerEarnings />
        )}

        {activePage === 'partner-kyc' && (
          <PartnerKYC />
        )}

        {/* Admin Portal Pages */}
        {activePage === 'admin-dashboard' && (
          <AdminDashboard />
        )}
      </main>

      {/* Global Modals */}
      <BookingModal onBookingCreated={() => setActivePage('client-dashboard')} />
      <ChatDrawer />
      <SOSModal />
      <ReviewModal onReviewSubmitted={() => {}} />

      {/* Footer */}
      <Footer setActivePage={setActivePage} />
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
