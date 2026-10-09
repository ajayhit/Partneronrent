import React from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { colors } from '../theme';
import type { User } from '../types';

interface TopHeaderProps {
  user: User | null;
  onOpenProfile: () => void;
  onOpenSubscription: () => void;
  onOpenKyc: () => void;
}

export function TopHeader({
  user,
  onOpenProfile,
  onOpenSubscription,
  onOpenKyc,
}: TopHeaderProps) {
  const isSubscribed = Boolean(
    user?.isSubscribed &&
    user?.subscriptionExpiresAt &&
    new Date(user.subscriptionExpiresAt) > new Date()
  );
  const isKycVerified = user?.kycStatus === 'verified';

  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>P</Text>
        </View>
        <View>
          <Text style={styles.brandSubtitle}>PARTNERONRENT</Text>
          <Text style={styles.brandTitle}>Hirer Companion Hub</Text>
        </View>
      </View>

      <View style={styles.badgesRow}>
        {/* Subscription status badge */}
        <Pressable
          onPress={onOpenSubscription}
          style={[
            styles.statusPill,
            isSubscribed ? styles.subActivePill : styles.subInactivePill,
          ]}
        >
          <Text style={styles.pillIcon}>{isSubscribed ? '👑' : '⚡'}</Text>
          <Text
            style={[
              styles.pillText,
              isSubscribed ? styles.subActiveText : styles.subInactiveText,
            ]}
          >
            {isSubscribed ? 'Prime Active' : 'Get Pass ₹249'}
          </Text>
        </Pressable>

        {/* KYC Badge */}
        <Pressable
          onPress={onOpenKyc}
          style={[
            styles.statusPill,
            isKycVerified ? styles.kycVerifiedPill : styles.kycPendingPill,
          ]}
        >
          <Text style={styles.pillIcon}>{isKycVerified ? '🛡️' : '⏳'}</Text>
          <Text
            style={[
              styles.pillText,
              isKycVerified ? styles.kycVerifiedText : styles.kycPendingText,
            ]}
          >
            {isKycVerified ? 'KYC Verified' : 'KYC Pending'}
          </Text>
        </Pressable>

        {/* User avatar / profile trigger */}
        <Pressable onPress={onOpenProfile} style={styles.avatarButton}>
          {user?.avatar && user.avatar.startsWith('http') ? (
            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'H'}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },
  brandMarkText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.8,
    color: colors.primary,
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: -0.3,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  subActivePill: {
    backgroundColor: colors.goldLight,
    borderColor: '#E8D497',
  },
  subInactivePill: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primarySoft,
  },
  subActiveText: {
    color: colors.goldDark,
    fontSize: 11,
    fontWeight: '700',
  },
  subInactiveText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  kycVerifiedPill: {
    backgroundColor: colors.successLight,
    borderColor: '#A7F3D0',
  },
  kycPendingPill: {
    backgroundColor: colors.warningLight,
    borderColor: '#FDE68A',
  },
  kycVerifiedText: {
    color: colors.successDark,
    fontSize: 11,
    fontWeight: '700',
  },
  kycPendingText: {
    color: colors.warningDark,
    fontSize: 11,
    fontWeight: '700',
  },
  pillIcon: {
    fontSize: 12,
  },
  pillText: {
    fontSize: 11,
  },
  avatarButton: {
    marginLeft: 'auto',
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  avatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  avatarText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});
