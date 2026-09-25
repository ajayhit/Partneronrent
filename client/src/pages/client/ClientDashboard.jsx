import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { fetchBookings, fetchPartners } from '../../utils/api';
import './client.css';

// Sidebar
import ClientSidebar from './ClientSidebar';

// Tabs
import DashboardTab from './tabs/DashboardTab';
import FindCompanionTab from './tabs/FindCompanionTab';
import FavoritesTab from './tabs/FavoritesTab';
import BookingsTab from './tabs/BookingsTab';
import PaymentsTab from './tabs/PaymentsTab';
import CouponsTab from './tabs/CouponsTab';
import MessagesTab from './tabs/MessagesTab';
import ReviewsTab from './tabs/ReviewsTab';
import SafetyCenterTab from './tabs/SafetyCenterTab';
import ComplaintsTab from './tabs/ComplaintsTab';
import NotificationsTab from './tabs/NotificationsTab';
import ProfileTab from './tabs/ProfileTab';
import SavedLocationsTab from './tabs/SavedLocationsTab';
import WalletTab from './tabs/WalletTab';
import HelpSupportTab from './tabs/HelpSupportTab';
import SettingsTab from './tabs/SettingsTab';

// Modals
import PartnerDetailModal from './modals/PartnerDetailModal';
import BookingDetailModal from './modals/BookingDetailModal';

export default function ClientDashboard({ initialTab = 'dashboard', setActivePage }) {
  const { activeUser, logout } = useAuth();
  const { openChat, openSOS, openReview, showToast } = useApp();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Data state
  const [bookings, setBookings] = useState([]);
  const [partners, setPartners] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [activeUser?.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingsData, partnersData] = await Promise.all([
        fetchBookings({ clientId: activeUser?.id || 'client-1' }),
        fetchPartners()
      ]);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setPartners(Array.isArray(partnersData) ? partnersData : []);
    } catch (err) {
      console.error('Failed to load client data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (partnerId) => {
    setFavorites(prev => {
      const exists = prev.includes(partnerId);
      if (exists) {
        showToast && showToast('Removed from favorites');
        return prev.filter(id => id !== partnerId);
      } else {
        showToast && showToast('Added to favorites');
        return [...prev, partnerId];
      }
    });
  };

  const handleViewPartnerProfile = (partner) => {
    setSelectedPartner(partner);
  };

  const handleBookPartner = (partner) => {
    setSelectedPartner(null);
    // Open the global booking modal from AppContext
    if (showToast) showToast(`Opening booking for ${partner.name}...`, 'info');
  };

  const handleSelectBooking = (booking) => {
    setSelectedBooking(booking);
  };

  const handleLogout = () => {
    logout();
    if (setActivePage) setActivePage('home');
  };

  // Client info (fallback to defaults)
  const clientInfo = {
    id: activeUser?.id || 'client-1',
    name: activeUser?.name || 'Arjun Mehta',
    email: activeUser?.email || 'arjun.mehta@email.com',
    phone: activeUser?.phone || '+91 98765 43210',
    avatar: activeUser?.avatar || null,
    walletBalance: activeUser?.walletBalance || 4500,
    city: activeUser?.city || 'Jaipur',
    verified: true
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardTab
            client={clientInfo}
            bookings={bookings}
            favorites={favorites}
            reviews={[]}
            notifications={[]}
            onTabChange={setActiveTab}
            onSelectBooking={handleSelectBooking}
            openChat={openChat}
            openSOS={openSOS}
            openReview={openReview}
            onFindCompanion={() => setActiveTab('find-companion')}
          />
        );

      case 'find-companion':
        return (
          <FindCompanionTab
            partners={partners}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onViewProfile={handleViewPartnerProfile}
            onBookPartner={handleBookPartner}
            showToast={showToast}
          />
        );

      case 'favorites':
        return (
          <FavoritesTab
            favorites={partners.filter(p => favorites.includes(p.id))}
            recentlyViewed={[]}
            onRemoveFavorite={(p) => handleToggleFavorite(p.id || p)}
            onViewProfile={handleViewPartnerProfile}
            onBookPartner={handleBookPartner}
            onTabChange={setActiveTab}
          />
        );

      case 'bookings':
        return (
          <BookingsTab
            bookings={bookings}
            onSelectBooking={handleSelectBooking}
            openChat={openChat}
            openSOS={openSOS}
            openReview={openReview}
            showToast={showToast}
          />
        );

      case 'payments':
        return (
          <PaymentsTab
            client={clientInfo}
            showToast={showToast}
          />
        );

      case 'coupons':
        return (
          <CouponsTab showToast={showToast} />
        );

      case 'messages':
        return (
          <MessagesTab
            client={clientInfo}
            showToast={showToast}
          />
        );

      case 'reviews':
        return (
          <ReviewsTab
            bookings={bookings}
            client={clientInfo}
            showToast={showToast}
          />
        );

      case 'safety-center':
        return (
          <SafetyCenterTab
            activeBooking={bookings.find(b => b.status === 'in-progress') || null}
            showToast={showToast}
          />
        );

      case 'complaints':
        return (
          <ComplaintsTab
            bookings={bookings}
            client={clientInfo}
            showToast={showToast}
          />
        );

      case 'notifications':
        return (
          <NotificationsTab showToast={showToast} />
        );

      case 'profile':
        return (
          <ProfileTab
            client={clientInfo}
            showToast={showToast}
          />
        );

      case 'saved-locations':
        return (
          <SavedLocationsTab showToast={showToast} />
        );

      case 'wallet':
        return (
          <WalletTab
            client={clientInfo}
            showToast={showToast}
          />
        );

      case 'help-support':
        return (
          <HelpSupportTab showToast={showToast} />
        );

      case 'settings':
        return (
          <SettingsTab
            client={clientInfo}
            onLogout={handleLogout}
          />
        );

      default:
        return (
          <DashboardTab
            client={clientInfo}
            bookings={bookings}
            favorites={favorites}
            reviews={[]}
            notifications={[]}
            onTabChange={setActiveTab}
            onSelectBooking={handleSelectBooking}
            openChat={openChat}
            openSOS={openSOS}
            openReview={openReview}
            onFindCompanion={() => setActiveTab('find-companion')}
          />
        );
    }
  };

  return (
    <div className="client-layout">
      {/* Sidebar */}
      <ClientSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        client={clientInfo}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
      />

      {/* Main Content */}
      <main
        className="client-main"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '28px 32px',
          minWidth: 0
        }}
      >
        {loading && activeTab === 'dashboard' ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: '16px',
            color: '#64748b'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '3px solid rgba(236,72,153,0.3)',
              borderTop: '3px solid #ec4899',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
            <span style={{ fontSize: '0.9rem' }}>Loading your dashboard...</span>
          </div>
        ) : (
          renderTab()
        )}
      </main>

      {/* Partner Detail Modal */}
      {selectedPartner && (
        <PartnerDetailModal
          partner={selectedPartner}
          isOpen={true}
          isFavorite={favorites.includes(selectedPartner.id)}
          onToggleFavorite={() => handleToggleFavorite(selectedPartner.id)}
          onBookNow={() => handleBookPartner(selectedPartner)}
          onClose={() => setSelectedPartner(null)}
          onReport={() => {
            showToast && showToast('Report submitted. Thank you.');
            setSelectedPartner(null);
          }}
        />
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          isOpen={true}
          onClose={() => setSelectedBooking(null)}
          onCancelBooking={() => {
            showToast && showToast('Booking cancelled');
            setSelectedBooking(null);
          }}
          openChat={openChat}
          openSOS={openSOS}
          openReview={openReview}
          onRaiseDispute={() => {
            setSelectedBooking(null);
            setActiveTab('complaints');
          }}
        />
      )}
    </div>
  );
}
