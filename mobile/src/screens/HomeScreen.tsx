import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { colors } from '../theme';
import type { Booking, Partner, Service, User } from '../types';

interface HomeScreenProps {
  user: User | null;
  partners: Partner[];
  services: Service[];
  bookings: Booking[];
  onNavigateTab: (tab: any) => void;
  onSelectPartner: (partner: Partner) => void;
  onOpenBookingModal: (partner: Partner) => void;
}

export function HomeScreen({
  user,
  partners,
  services,
  bookings,
  onNavigateTab,
  onSelectPartner,
  onOpenBookingModal,
}: HomeScreenProps) {
  const isSubscribed = Boolean(
    user?.isSubscribed &&
    user?.subscriptionExpiresAt &&
    new Date(user.subscriptionExpiresAt) > new Date()
  );

  const kycStatus = user?.kycStatus || 'not_submitted';
  const isKycVerified = kycStatus === 'verified';
  const activeBookings = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'in-progress' || b.status === 'pending'
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ── Welcome Banner ── */}
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeTextGroup}>
          <Text style={styles.welcomeEyebrow}>HIRER DASHBOARD</Text>
          <Text style={styles.welcomeName}>
            Welcome, {user?.name ? user.name.split(' ')[0] : 'Hirer'}
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Verified companions for family gatherings, social outings, shopping & events.
          </Text>
        </View>

        <Pressable
          style={styles.findCompanionBtn}
          onPress={() => onNavigateTab('companions')}
        >
          <Text style={styles.findCompanionBtnText}>Find Companion ›</Text>
        </Pressable>
      </View>

      {/* ── Gate 1: Subscription Banner ── */}
      {!isSubscribed ? (
        <Pressable
          style={styles.promoCard}
          onPress={() => onNavigateTab('subscription')}
        >
          <View style={styles.promoHeader}>
            <View style={styles.crownCircle}>
              <Text style={styles.crownIcon}>👑</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.promoBadge}>MANDATORY TO BOOK</Text>
              <Text style={styles.promoTitle}>Annual Prime Membership</Text>
              <Text style={styles.promoSubtitle}>
                Unlock complete platform access for ₹249 / 1 Full Year (₹0.68/day)
              </Text>
            </View>
          </View>
          <View style={styles.promoCtaRow}>
            <Text style={styles.promoPrice}>₹249 <Text style={styles.promoPerYear}>/year</Text></Text>
            <View style={styles.promoActionBtn}>
              <Text style={styles.promoActionText}>Subscribe Now →</Text>
            </View>
          </View>
        </Pressable>
      ) : (
        <View style={styles.subscribedCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontSize: 24 }}>✨</Text>
            <View>
              <Text style={styles.subActiveTitle}>Prime Membership Active</Text>
              <Text style={styles.subActiveSub}>
                Unlimited booking access unlocked
              </Text>
            </View>
          </View>
          <Pressable onPress={() => onNavigateTab('subscription')}>
            <Text style={styles.viewInvoiceLink}>View Pass ›</Text>
          </Pressable>
        </View>
      )}

      {/* ── Gate 2: KYC Banner ── */}
      {!isKycVerified && (
        <Pressable
          style={[
            styles.kycNoticeCard,
            kycStatus === 'rejected' ? styles.kycRejectedBorder : styles.kycPendingBorder,
          ]}
          onPress={() => onNavigateTab('kyc')}
        >
          <Text style={styles.kycNoticeIcon}>
            {kycStatus === 'rejected' ? '⚠️' : '🛡️'}
          </Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.kycNoticeTitle}>
              {kycStatus === 'pending' || kycStatus === 'under_review'
                ? 'Identity Verification In Review'
                : kycStatus === 'rejected'
                ? 'KYC Needs Correction'
                : 'Complete Hirer KYC Verification'}
            </Text>
            <Text style={styles.kycNoticeSub}>
              {kycStatus === 'pending' || kycStatus === 'under_review'
                ? 'Government documents submitted. Admin team reviewing.'
                : kycStatus === 'rejected'
                ? 'Click to view rejection reason and resubmit.'
                : 'Upload Aadhaar / PAN for safe, trusted meetings.'}
            </Text>
          </View>
          <Text style={styles.kycNoticeArrow}>›</Text>
        </Pressable>
      )}

      {/* ── Quick Stats Grid ── */}
      <View style={styles.statsRow}>
        <Pressable
          style={styles.statBox}
          onPress={() => onNavigateTab('bookings')}
        >
          <Text style={styles.statNumber}>{activeBookings.length}</Text>
          <Text style={styles.statLabel}>Active Bookings</Text>
        </Pressable>

        <Pressable
          style={styles.statBox}
          onPress={() => onNavigateTab('profile')}
        >
          <Text style={styles.statNumber}>₹{user?.walletBalance || 0}</Text>
          <Text style={styles.statLabel}>Wallet Balance</Text>
        </Pressable>

        <Pressable
          style={styles.statBox}
          onPress={() => onNavigateTab('subscription')}
        >
          <Text style={[styles.statNumber, { color: isSubscribed ? colors.success : colors.primary }]}>
            {isSubscribed ? 'Active' : 'Get Pass'}
          </Text>
          <Text style={styles.statLabel}>Membership</Text>
        </Pressable>
      </View>

      {/* ── Featured Companions Section ── */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Featured Companions</Text>
          <Text style={styles.sectionSubtitle}>Verified platonic companionship</Text>
        </View>
        <Pressable onPress={() => onNavigateTab('companions')}>
          <Text style={styles.seeAllText}>View All ({partners.length}) ›</Text>
        </Pressable>
      </View>

      {partners.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Loading verified companions…</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
          {partners.slice(0, 5).map((partner) => (
            <View key={partner.id} style={styles.featuredCard}>
              <View style={styles.featuredAvatarWrapper}>
                {partner.avatar && partner.avatar.startsWith('http') ? (
                  <Image source={{ uri: partner.avatar }} style={styles.featuredAvatar} />
                ) : (
                  <View style={styles.featuredAvatarFallback}>
                    <Text style={styles.featuredAvatarInitial}>
                      {partner.name.charAt(0)}
                    </Text>
                  </View>
                )}
                <View
                  style={[
                    styles.onlineDot,
                    partner.isOnline ? styles.onlineGreen : styles.onlineGrey,
                  ]}
                />
              </View>

              <Text style={styles.featuredName} numberOfLines={1}>
                {partner.name}
              </Text>
              <Text style={styles.featuredCity} numberOfLines={1}>
                📍 {partner.city}
              </Text>
              <Text style={styles.featuredRate}>
                ₹{partner.hourlyRate.toLocaleString('en-IN')}/hr
              </Text>

              <Pressable
                style={styles.bookSmallBtn}
                onPress={() => onOpenBookingModal(partner)}
              >
                <Text style={styles.bookSmallBtnText}>Book Now</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}

      {/* ── Platonic Safety Guarantee ── */}
      <View style={styles.safetyCard}>
        <View style={styles.safetyHeader}>
          <Text style={styles.safetyIcon}>🛡️</Text>
          <Text style={styles.safetyTitle}>100% Platonic & Safe</Text>
        </View>
        <Text style={styles.safetyBody}>
          PartnerOnRent enforces strict verified KYC protocols, SOS support, and platonic-only terms.
          Romantic, sexual, or indecent solicitations are strictly prohibited and result in permanent ban.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  welcomeCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeTextGroup: {
    marginBottom: 16,
  },
  welcomeEyebrow: {
    color: '#F9D5DF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 6,
  },
  welcomeName: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  welcomeSubtitle: {
    color: '#F4E3E7',
    fontSize: 13,
    lineHeight: 18,
  },
  findCompanionBtn: {
    backgroundColor: colors.white,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  findCompanionBtnText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 13,
  },
  promoCard: {
    backgroundColor: '#FFFDF9',
    borderColor: '#E8D497',
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  promoHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  crownCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3E5AB',
  },
  crownIcon: {
    fontSize: 22,
  },
  promoBadge: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: colors.goldDark,
    marginBottom: 2,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  promoSubtitle: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 16,
  },
  promoCtaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3EEDB',
  },
  promoPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.ink,
  },
  promoPerYear: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.muted,
  },
  promoActionBtn: {
    backgroundColor: colors.goldDark,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  promoActionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  subscribedCard: {
    backgroundColor: colors.successLight,
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subActiveTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.successDark,
  },
  subActiveSub: {
    fontSize: 11,
    color: '#065F46',
  },
  viewInvoiceLink: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.successDark,
  },
  kycNoticeCard: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  kycPendingBorder: {
    borderColor: '#FDE68A',
  },
  kycRejectedBorder: {
    borderColor: '#FECACA',
  },
  kycNoticeIcon: {
    fontSize: 22,
  },
  kycNoticeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 2,
  },
  kycNoticeSub: {
    fontSize: 11,
    color: colors.muted,
    lineHeight: 15,
  },
  kycNoticeArrow: {
    fontSize: 22,
    color: colors.muted,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: colors.muted,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: colors.muted,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  hScroll: {
    marginBottom: 20,
  },
  featuredCard: {
    width: 140,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    marginRight: 10,
    alignItems: 'center',
  },
  featuredAvatarWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  featuredAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  featuredAvatarFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredAvatarInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.white,
  },
  onlineGreen: {
    backgroundColor: colors.success,
  },
  onlineGrey: {
    backgroundColor: colors.mutedLight,
  },
  featuredName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 2,
  },
  featuredCity: {
    fontSize: 10,
    color: colors.muted,
    marginBottom: 4,
  },
  featuredRate: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 8,
  },
  bookSmallBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  bookSmallBtnText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 12,
  },
  safetyCard: {
    backgroundColor: '#F7F4EF',
    borderColor: '#E6DDD4',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  safetyIcon: {
    fontSize: 18,
  },
  safetyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
  },
  safetyBody: {
    fontSize: 11,
    lineHeight: 16,
    color: colors.muted,
  },
});
