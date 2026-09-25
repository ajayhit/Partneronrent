import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import './partner.css';

// API utilities
import {
  fetchBookings,
  fetchPartnerById,
  togglePartnerOnline,
  updatePartnerProfile,
  submitPartnerKYC,
  updateBookingStatus,
  startSessionWithOTP,
  endSession,
  fetchPayouts,
  requestPayout
} from '../../utils/api';

// Components & Tabs
import PartnerSidebar from './PartnerSidebar';
import DashboardTab from './tabs/DashboardTab';
import ProfileTab from './tabs/ProfileTab';
import KycTab from './tabs/KycTab';
import ServicesTab from './tabs/ServicesTab';
import PricingTab from './tabs/PricingTab';
import AvailabilityTab from './tabs/AvailabilityTab';
import BookingsTab from './tabs/BookingsTab';
import LocationTab from './tabs/LocationTab';
import EarningsTab from './tabs/EarningsTab';
import BankDetailsTab from './tabs/BankDetailsTab';
import ReviewsTab from './tabs/ReviewsTab';
import MessagesTab from './tabs/MessagesTab';
import SafetyCenterTab from './tabs/SafetyCenterTab';
import ComplaintsTab from './tabs/ComplaintsTab';
import NotificationsTab from './tabs/NotificationsTab';
import GuidelinesTab from './tabs/GuidelinesTab';
import SettingsTab from './tabs/SettingsTab';

// Icons
import {
  Menu,
  Bell,
  Power,
  AlertTriangle,
  RefreshCw,
  Wallet
} from 'lucide-react';

export default function PartnerDashboard({ initialTab = 'dashboard', setActivePage }) {
  const { activePartner, logout } = useAuth();
  const { openChat, openSOS, showToast } = useApp();

  // Navigation State
  const [activeTab, setActiveTab] = useState(initialTab);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Partner & Bookings Data State
  const [partner, setPartner] = useState(activePartner || null);
  const [bookings, setBookings] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // OTP inputs for starting sessions
  const [otpInputs, setOtpInputs] = useState({});
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 8000);
    return () => clearInterval(interval);
  }, [activePartner?.id]);

  const loadAllData = async () => {
    const partnerId = activePartner?.id || 'partner-p1';
    try {
      const [partnerData, bookingList, payoutList] = await Promise.all([
        fetchPartnerById(partnerId),
        fetchBookings({ partnerId }),
        fetchPayouts({ partnerId })
      ]);
      if (partnerData) setPartner(partnerData);
      if (bookingList) setBookings(bookingList);
      if (payoutList) setPayouts(payoutList);
    } catch (err) {
      console.error('Error loading partner dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Online / Offline toggle
  const handleToggleOnline = async () => {
    try {
      const res = await togglePartnerOnline(partner?.id || 'partner-p1');
      setPartner(prev => ({ ...prev, isOnline: res.isOnline }));
      showToast(res.isOnline ? 'You are now ONLINE & accepting hire requests!' : 'You are now OFFLINE (Shift Ended).');
    } catch (err) {
      showToast('Failed to toggle online status', 'danger');
    }
  };

  // 2. Profile update
  const handleUpdateProfile = async (profileData) => {
    const updated = await updatePartnerProfile(partner?.id || 'partner-p1', profileData);
    setPartner(prev => ({ ...prev, ...updated }));
    return updated;
  };

  // 3. KYC submission
  const handleSubmitKYC = async (kycData) => {
    const res = await submitPartnerKYC(partner?.id || 'partner-p1', kycData);
    if (res.partner) setPartner(res.partner);
    loadAllData();
  };

  // 4. Update services & pricing
  const handleUpdateServices = async (servicesList) => {
    const updated = await updatePartnerProfile(partner?.id || 'partner-p1', { services: servicesList });
    setPartner(prev => ({ ...prev, services: servicesList }));
  };

  // 5. Update availability
  const handleUpdateAvailability = async (availabilityData) => {
    const updated = await updatePartnerProfile(partner?.id || 'partner-p1', availabilityData);
    setPartner(prev => ({ ...prev, ...availabilityData }));
  };

  // 6. Update bank details
  const handleUpdateBankDetails = async (bankDetails) => {
    const updated = await updatePartnerProfile(partner?.id || 'partner-p1', { bankDetails });
    setPartner(prev => ({ ...prev, bankDetails }));
  };

  // 7. Booking actions
  const handleAcceptBooking = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, 'confirmed');
      showToast('Booking request accepted! Client has been notified.');
      loadAllData();
    } catch (err) {
      showToast('Failed to accept booking', 'danger');
    }
  };

  const handleDeclineBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to decline this booking request?')) return;
    try {
      await updateBookingStatus(bookingId, 'declined');
      showToast('Booking request declined.', 'warning');
      loadAllData();
    } catch (err) {
      showToast('Failed to decline booking', 'danger');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this confirmed booking? Please give hirer sufficient notice.')) return;
    try {
      await updateBookingStatus(bookingId, 'cancelled');
      showToast('Booking cancelled.', 'warning');
      loadAllData();
    } catch (err) {
      showToast('Failed to cancel booking', 'danger');
    }
  };

  const handleStartSession = async (bookingId) => {
    const otp = otpInputs[bookingId];
    if (!otp || otp.trim().length !== 4) {
      alert('Please ask the client for their 4-digit session OTP.');
      return;
    }

    setVerifyingOtp(true);
    try {
      await startSessionWithOTP(bookingId, otp);
      showToast('Session verified & started! Timer is now active.');
      setOtpInputs(prev => ({ ...prev, [bookingId]: '' }));
      loadAllData();
    } catch (err) {
      alert(err.message || 'Invalid OTP code. Please ask hirer to verify.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleEndSession = async (bookingId) => {
    if (!confirm('Confirm session completion? Your 80% earnings will be immediately released to your wallet.')) return;
    try {
      await endSession(bookingId);
      showToast('Session completed! 80% earnings credited to your wallet.');
      loadAllData();
    } catch (err) {
      showToast('Failed to complete session', 'danger');
    }
  };

  // 8. Payout request
  const handleRequestPayout = async (payoutPayload) => {
    await requestPayout(payoutPayload);
    loadAllData();
  };

  const handleLogout = () => {
    logout();
    if (setActivePage) setActivePage('home');
  };

  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <div className="partner-layout">
      {/* Sidebar Navigation */}
      <PartnerSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        partner={partner}
        isOnline={partner?.isOnline}
        onToggleOnline={handleToggleOnline}
        pendingBookingsCount={pendingCount}
        unreadNotificationsCount={3}
        onLogout={handleLogout}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="partner-main">
        {/* Top bar */}
        <div className="partner-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              style={{
                display: 'none',
                padding: '8px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#fff'
              }}
              className="mobile-hamburger"
            >
              <Menu size={20} />
            </button>

            <div className="partner-title-area">
              <h1 style={{ textTransform: 'capitalize' }}>
                {activeTab.replace('-', ' ')}
              </h1>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Quick Online Switch */}
            <button
              onClick={handleToggleOnline}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '9999px',
                background: partner?.isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: partner?.isOnline ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                color: partner?.isOnline ? '#34d399' : '#94a3b8',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Power size={14} />
              <span>{partner?.isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </button>

            {/* Quick SOS Trigger */}
            <button
              onClick={() => openSOS({ id: 'EMERGENCY', clientName: 'Partner Distress Trigger' })}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #ef4444',
                color: '#f87171',
                padding: '8px 14px',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <AlertTriangle size={14} />
              <span>SOS</span>
            </button>

            {/* Notifications Shortcut */}
            <button
              onClick={() => setActiveTab('notifications')}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              <Bell size={16} />
              <span style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#38bdf8'
              }} />
            </button>

            {/* Refresh Data */}
            <button
              onClick={loadAllData}
              title="Refresh data"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Dynamic Tab Content Rendering */}
        {activeTab === 'dashboard' && (
          <DashboardTab
            partner={partner}
            bookings={bookings}
            onToggleOnline={handleToggleOnline}
            onTabChange={setActiveTab}
            onAcceptBooking={handleAcceptBooking}
            onDeclineBooking={handleDeclineBooking}
            onStartSession={handleStartSession}
            onEndSession={handleEndSession}
            otpInputs={otpInputs}
            setOtpInputs={setOtpInputs}
            verifyingOtp={verifyingOtp}
            openChat={openChat}
            openSOS={openSOS}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileTab
            partner={partner}
            onUpdateProfile={handleUpdateProfile}
            showToast={showToast}
          />
        )}

        {activeTab === 'kyc' && (
          <KycTab
            partner={partner}
            onSubmitKYC={handleSubmitKYC}
            showToast={showToast}
          />
        )}

        {activeTab === 'services' && (
          <ServicesTab
            partner={partner}
            onUpdateServices={handleUpdateServices}
            showToast={showToast}
          />
        )}

        {activeTab === 'pricing' && (
          <PricingTab
            partner={partner}
            onTabChange={setActiveTab}
            showToast={showToast}
          />
        )}

        {activeTab === 'availability' && (
          <AvailabilityTab
            partner={partner}
            onUpdateAvailability={handleUpdateAvailability}
            showToast={showToast}
          />
        )}

        {activeTab === 'bookings' && (
          <BookingsTab
            bookings={bookings}
            onAcceptBooking={handleAcceptBooking}
            onDeclineBooking={handleDeclineBooking}
            onStartSession={handleStartSession}
            onEndSession={handleEndSession}
            onCancelBooking={handleCancelBooking}
            otpInputs={otpInputs}
            setOtpInputs={setOtpInputs}
            verifyingOtp={verifyingOtp}
            openChat={openChat}
            openSOS={openSOS}
            showToast={showToast}
          />
        )}

        {activeTab === 'location' && (
          <LocationTab
            bookings={bookings}
            showToast={showToast}
          />
        )}

        {activeTab === 'earnings' && (
          <EarningsTab
            partner={partner}
            payouts={payouts}
            bookings={bookings}
            onTabChange={setActiveTab}
            showToast={showToast}
          />
        )}

        {activeTab === 'payouts' && (
          <BankDetailsTab
            partner={partner}
            payouts={payouts}
            onRequestPayout={handleRequestPayout}
            onUpdateBankDetails={handleUpdateBankDetails}
            showToast={showToast}
          />
        )}

        {activeTab === 'reviews' && (
          <ReviewsTab
            partner={partner}
            showToast={showToast}
          />
        )}

        {activeTab === 'messages' && (
          <MessagesTab
            partner={partner}
            showToast={showToast}
          />
        )}

        {activeTab === 'safety' && (
          <SafetyCenterTab
            partner={partner}
            showToast={showToast}
          />
        )}

        {activeTab === 'disputes' && (
          <ComplaintsTab
            partner={partner}
            bookings={bookings}
            showToast={showToast}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationsTab
            showToast={showToast}
          />
        )}

        {activeTab === 'guidelines' && (
          <GuidelinesTab />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            partner={partner}
            onLogout={handleLogout}
            showToast={showToast}
          />
        )}
      </main>
    </div>
  );
}
