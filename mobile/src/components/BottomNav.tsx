import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { colors } from '../theme';

export type TabKey = 'home' | 'companions' | 'bookings' | 'subscription' | 'kyc' | 'profile';

interface BottomNavProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  bookingCount?: number;
}

export function BottomNav({ activeTab, onSelectTab, bookingCount = 0 }: BottomNavProps) {
  const tabs: { key: TabKey; label: string; icon: string; badge?: number }[] = [
    { key: 'home', label: 'Home', icon: '🏠' },
    { key: 'companions', label: 'Companions', icon: '👥' },
    { key: 'bookings', label: 'Bookings', icon: '📅', badge: bookingCount },
    { key: 'subscription', label: 'Pass ₹249', icon: '👑' },
    { key: 'kyc', label: 'KYC', icon: '🛡️' },
    { key: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onSelectTab(tab.key)}
            style={[styles.tabButton, isActive && styles.activeTabButton]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <View style={styles.iconWrapper}>
              <Text style={[styles.tabIcon, isActive && styles.activeTabIcon]}>{tab.icon}</Text>
              {Boolean(tab.badge && tab.badge > 0) && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{tab.badge}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 12,
    minWidth: 54,
  },
  activeTabButton: {
    backgroundColor: colors.primaryLight,
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
    opacity: 0.65,
  },
  activeTabIcon: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.muted,
  },
  activeTabLabel: {
    color: colors.primary,
    fontWeight: '800',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: colors.primary,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
});
