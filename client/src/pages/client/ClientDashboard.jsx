import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { getClientFavorites, saveClientFavorites } from '../../utils/clientFavorites';
import { fetchBookings, fetchClientById, fetchPartners, submitClientKYC, updateClientProfile } from '../../utils/api';
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
import HirerKycTab from './tabs/HirerKycTab';

// Modals
import PartnerDetailModal from './modals/PartnerDetailModal';
import BookingDetailModal from './modals/BookingDetailModal';

export default function ClientDashboard({ initialTab = 'dashboard', setActivePage }) {
  const { activeUser, logout, updateSession } = useAuth();
  const { openChat, openSOS, openReview, showToast } = useApp();

  const [activeTab, setActiveTab] = useState(() =>
    (activeUser?.kycStatus || 'not_submitted') === 'verified' ? initialTab : 'kyc'
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Data state
  const [bookings, setBookings] = useState([]);
  const [partners, setPartners] = useState([]);
  const [clientProfile, setClientProfile] = useState(activeUser || null);
  const [favorites, setFavorites] = useState(() => getClientFavorites(activeUser?.id));
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const isKycVerified = (clientProfile?.kycStatus || activeUser?.kycStatus || 'not_submitted') === 'verified';

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [activeUser?.id]);

  useEffect(() => {
    if (!isKycVerified && activeTab !== 'kyc') {
      setActiveTab('kyc');
    }
  }, [isKycVerified, activeTab]);

  useEffect(() => {
    try {
      saveClientFavorites(activeUser?.id, favorites);
    } catch (err) {
      console.error('Failed to save client favorites:', err);
      showToast('Could not save your favorites. Please try again.', 'danger');
    }
  }, [activeUser?.id, favorites]);

  const handleTabChange = (tabId) => {
    if (!isKycVerified && tabId !== 'kyc' && tabId !== 'settings') {
      showToast('Please complete hirer KYC verification to access the panel.', 'warning');
      setActiveTab('kyc');
      return;
    }
    if (tabId === 'find-companion') {
      setActivePage?.('directory');
      return;
    }
    setActiveTab(tabId);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingsData, partnersData, clientData] = await Promise.all([
        fetchBookings({ clientId: activeUser?.id }),
        fetchPartners(),
        activeUser?.id ? fetchClientById(activeUser.id) : Promise.resolve(null)
      ]);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setPartners(Array.isArray(partnersData) ? partnersData : []);
      if (clientData && !clientData.error) {
        setClientProfile(clientData);
        updateSession?.({ ...activeUser, ...clientData });
      }
    } catch (err) {
      console.error('Failed to load client data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (partnerId) => {
    const id = typeof partnerId === 'object' ? partnerId?.id : partnerId;
    if (id == null) return;

    setFavorites(prev => {
      const exists = prev.some(favorite => favorite === id);
      if (exists) {
        showToast && showToast('Removed from favorites');
        return prev.filter(favorite => favorite !== id);
      } else {
        showToast && showToast('Added to favorites');
        return [...prev, id];
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

  const handleSubmitKYC = async (kycData) => {
    const response = await submitClientKYC(activeUser?.id, kycData);
    if (response.error) throw new Error(response.error);
    if (!response.user) throw new Error('The server did not return the updated verification status.');
    setClientProfile(response.user);
    updateSession?.({ ...activeUser, ...response.user });
  };

  const handleUpdateProfile = async (profileData) => {
    const response = await updateClientProfile(activeUser?.id, profileData);
    if (!response.user) throw new Error('The server did not return the updated profile.');
    setClientProfile(response.user);
    updateSession?.({ ...activeUser, ...response.user });
  };

  // Client info
  const clientInfo = {
    ...(clientProfile || activeUser || {}),
    id: clientProfile?.id || activeUser?.id,
    name: clientProfile?.name || activeUser?.name || '',
    email: clientProfile?.email || activeUser?.email || '',
    phone: clientProfile?.phone || activeUser?.phone || '',
    avatar: clientProfile?.avatar || activeUser?.avatar || null,
    walletBalance: clientProfile?.walletBalance || activeUser?.walletBalance || 0,
    city: clientProfile?.city || activeUser?.city || '',
    verified: (clientProfile?.kycStatus || activeUser?.kycStatus) === 'verified',
    kycStatus: clientProfile?.kycStatus || activeUser?.kycStatus || 'not_submitted',
    kycDocuments: clientProfile?.kycDocuments || activeUser?.kycDocuments || {},
    kycRejectionReason: clientProfile?.kycRejectionReason || activeUser?.kycRejectionReason || null
  };
  const favoritePartners = partners.filter(partner => favorites.includes(partner.id));
  const completedBookingsByPartner = bookings.reduce((counts, booking) => {
    if (booking.status === 'completed' && booking.partnerId) {
      counts[booking.partnerId] = (counts[booking.partnerId] || 0) + 1;
    }
    return counts;
  }, {});
  const preferredPartners = partners.filter(partner => completedBookingsByPartner[partner.id] >= 2);

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardTab
            client={clientInfo}
            bookings={bookings}
            favorites={favoritePartners}
            reviews={[]}
            notifications={[]}
            onTabChange={handleTabChange}
            onSelectBooking={handleSelectBooking}
            openChat={openChat}
            openSOS={openSOS}
            openReview={openReview}
            onFindCompanion={() => handleTabChange('find-companion')}
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
            favorites={favoritePartners}
            recentlyViewed={[]}
            preferredPartners={preferredPartners}
            onRemoveFavorite={(p) => handleToggleFavorite(p.id || p)}
            onViewProfile={handleViewPartnerProfile}
            onBookPartner={handleBookPartner}
            onTabChange={handleTabChange}
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
        return <CouponsTab />;

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
            setActivePage={setActivePage}
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
            onUpdateProfile={handleUpdateProfile}
            showToast={showToast}
          />
        );

      case 'kyc':
        return (
          <HirerKycTab
            client={clientInfo}
            onSubmitKYC={handleSubmitKYC}
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
            favorites={favoritePartners}
            reviews={[]}
            notifications={[]}
            onTabChange={handleTabChange}
            onSelectBooking={handleSelectBooking}
            openChat={openChat}
            openSOS={openSOS}
            openReview={openReview}
            onFindCompanion={() => handleTabChange('find-companion')}
          />
        );
    }
  };

  return (
    <div className="client-layout">
      {/* Sidebar */}
      <ClientSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
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
            handleTabChange('complaints');
          }}
        />
      )}
    </div>
  );
}
