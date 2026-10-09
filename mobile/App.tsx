import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import { colors } from './src/theme';
import type { Booking, Partner, Service, User } from './src/types';
import {
  fetchBookings,
  fetchPartners,
  fetchServices,
} from './src/api';
import { TopHeader } from './src/components/TopHeader';
import { BottomNav, type TabKey } from './src/components/BottomNav';
import { AuthScreen } from './src/screens/AuthScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { CompanionsScreen } from './src/screens/CompanionsScreen';
import { BookingsScreen } from './src/screens/BookingsScreen';
import { SubscriptionScreen } from './src/screens/SubscriptionScreen';
import { KycScreen } from './src/screens/KycScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { BookingModal } from './src/screens/BookingModal';
import { PartnerDashboardScreen } from './src/screens/PartnerDashboardScreen';

export default function App() {
  // Authentication state: starts as null so user sees Login / Sign Up screen first
  const [user, setUser] = useState<User | null>(null);

  // App navigation state
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Booking Modal
  const [bookingPartner, setBookingPartner] = useState<Partner | null>(null);

  // Load app data for authenticated user
  const loadUserData = useCallback(async (clientId: string, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [partnersData, servicesData, bookingsData] = await Promise.all([
        fetchPartners({ includeOffline: true }).catch(() => [] as Partner[]),
        fetchServices().catch(() => [] as Service[]),
        fetchBookings(clientId).catch(() => [] as Booking[]),
      ]);

      setPartners(partnersData);
      setServices(servicesData);
      setBookings(bookingsData);
    } catch (err: any) {
      console.warn('Data load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleLoginSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setActiveTab('home');
    void loadUserData(authenticatedUser.id);
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleSubscriptionSuccess = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleKycSubmitted = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    setUser(null);
    setBookings([]);
    setPartners([]);
    setActiveTab('home');
    Alert.alert('Signed Out', 'You have been signed out. Please sign in again.');
  };

  // ── First Screen: Show Login & Sign Up page if user is not authenticated ──
  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" backgroundColor="#0f172a" />
        <AuthScreen onLoginSuccess={handleLoginSuccess} />
      </SafeAreaView>
    );
  }

  // ── Partner Portal: Show Partner Dashboard if user is a partner (not hirer) ──
  if (user.role === 'partner') {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: '#0f172a' }]}>
        <StatusBar style="light" backgroundColor="#0f172a" />
        <PartnerDashboardScreen user={user} onLogout={handleLogout} />
      </SafeAreaView>
    );
  }

  // ── Authenticated: Show Hirer Dashboard & Navigation ──
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Top Brand & Status Header */}
      <TopHeader
        user={user}
        onOpenProfile={() => setActiveTab('profile')}
        onOpenSubscription={() => setActiveTab('subscription')}
        onOpenKyc={() => setActiveTab('kyc')}
      />

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <View style={styles.screenContainer}>
          {activeTab === 'home' && (
            <HomeScreen
              user={user}
              partners={partners}
              services={services}
              bookings={bookings}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onSelectPartner={(partner) => setBookingPartner(partner)}
              onOpenBookingModal={(partner) => setBookingPartner(partner)}
            />
          )}

          {activeTab === 'companions' && (
            <CompanionsScreen
              user={user}
              partners={partners}
              onOpenBookingModal={(partner) => setBookingPartner(partner)}
              onRefresh={() => void loadUserData(user.id, true)}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingsScreen
              user={user}
              bookings={bookings}
              onRefresh={() => void loadUserData(user.id, true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'subscription' && (
            <SubscriptionScreen
              user={user}
              onSubscriptionSuccess={handleSubscriptionSuccess}
              onRefreshUser={() => void loadUserData(user.id, true)}
            />
          )}

          {activeTab === 'kyc' && (
            <KycScreen
              user={user}
              onKycSubmitted={handleKycSubmitted}
              onRefresh={() => void loadUserData(user.id, true)}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileScreen
              user={user}
              onUpdateUser={(updated) => setUser(updated)}
              onLogout={handleLogout}
              onOpenAuth={handleLogout}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}
        </View>
      )}

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        bookingCount={
          bookings.filter(
            (b) => b.status === 'confirmed' || b.status === 'in-progress' || b.status === 'pending'
          ).length
        }
      />

      {/* Create Booking Sheet Modal */}
      <BookingModal
        visible={Boolean(bookingPartner)}
        partner={bookingPartner}
        user={user}
        onClose={() => setBookingPartner(null)}
        onBookingSuccess={handleBookingSuccess}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
});
