import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  Modal,
} from 'react-native';
import { colors } from '../theme';
import type { Booking, User } from '../types';

interface BookingsScreenProps {
  user: User | null;
  bookings: Booking[];
  onRefresh: () => void;
  onNavigateTab: (tab: any) => void;
}

export function BookingsScreen({
  user,
  bookings,
  onRefresh,
  onNavigateTab,
}: BookingsScreenProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'completed'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return b.status === 'pending';
    if (filter === 'active') return b.status === 'confirmed' || b.status === 'in-progress';
    if (filter === 'completed') return b.status === 'completed';
    return true;
  });

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return { label: 'Confirmed', bg: '#DCFCE7', text: '#15803D' };
      case 'in-progress':
        return { label: 'In Progress', bg: '#EFF6FF', text: '#1D4ED8' };
      case 'completed':
        return { label: 'Completed', bg: '#F1F5F9', text: '#475569' };
      case 'declined':
      case 'cancelled':
        return { label: 'Cancelled', bg: '#FEE2E2', text: '#B91C1C' };
      default:
        return { label: 'Pending Acceptance', bg: '#FEF3C7', text: '#B45309' };
    }
  };

  return (
    <View style={styles.container}>
      {/* ── Filter Tabs ── */}
      <View style={styles.filterBar}>
        {[
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending' },
          { key: 'active', label: 'Active' },
          { key: 'completed', label: 'Completed' },
        ].map((tab) => (
          <Pressable
            key={tab.key}
            style={[styles.filterTab, filter === tab.key && styles.filterTabActive]}
            onPress={() => setFilter(tab.key as any)}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === tab.key && styles.filterTabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        <View style={styles.topInfoRow}>
          <Text style={styles.countText}>
            {filteredBookings.length} {filteredBookings.length === 1 ? 'Booking' : 'Bookings'}
          </Text>
          <Pressable onPress={onRefresh}>
            <Text style={styles.refreshBtn}>🔄 Refresh</Text>
          </Pressable>
        </View>

        {filteredBookings.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No bookings found</Text>
            <Text style={styles.emptySub}>
              {filter === 'all'
                ? "You haven't booked any companion sessions yet."
                : `No bookings in '${filter}' status.`}
            </Text>
            <Pressable
              style={styles.bookCtaBtn}
              onPress={() => onNavigateTab('companions')}
            >
              <Text style={styles.bookCtaBtnText}>Browse Companions</Text>
            </Pressable>
          </View>
        ) : (
          filteredBookings.map((booking) => {
            const badge = getStatusBadge(booking.status);
            return (
              <View key={booking.id} style={styles.card}>
                {/* Header: Status & Booking ID */}
                <View style={styles.cardHeader}>
                  <Text style={styles.bookingId}>{booking.id}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                      {badge.label}
                    </Text>
                  </View>
                </View>

                {/* Companion info */}
                <View style={styles.companionRow}>
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarText}>
                      {booking.partnerName ? booking.partnerName.charAt(0) : 'C'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.partnerName}>{booking.partnerName}</Text>
                    <Text style={styles.serviceName}>
                      {booking.serviceName || 'Companion Session'}
                    </Text>
                  </View>
                  <Text style={styles.totalPrice}>
                    ₹{booking.totalAmount?.toLocaleString('en-IN') || 0}
                  </Text>
                </View>

                {/* Details row */}
                <View style={styles.detailsGrid}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Date & Time</Text>
                    <Text style={styles.detailVal}>
                      {booking.date} at {booking.startTime}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Duration</Text>
                    <Text style={styles.detailVal}>{booking.durationHours} Hours</Text>
                  </View>
                </View>

                <View style={styles.locationRow}>
                  <Text style={styles.detailLabel}>Meeting Location:</Text>
                  <Text style={styles.locationVal} numberOfLines={1}>
                    📍 {booking.meetingLocation}
                  </Text>
                </View>

                {/* ── Start Session OTP Box ── */}
                {booking.startOtp && (booking.status === 'confirmed' || booking.status === 'pending') && (
                  <View style={styles.otpCard}>
                    <View style={styles.otpHeaderRow}>
                      <Text style={styles.otpLabel}>START SESSION OTP CODE</Text>
                      <Text style={styles.otpHelp}>Share at meet-up</Text>
                    </View>
                    <View style={styles.otpDisplayRow}>
                      <Text style={styles.otpCode}>{booking.startOtp}</Text>
                    </View>
                    <Text style={styles.otpNotice}>
                      Give this 4-digit code to your companion in-person when meeting to verify and start session safely.
                    </Text>
                  </View>
                )}

                <Pressable
                  style={styles.viewDetailBtn}
                  onPress={() => setSelectedBooking(booking)}
                >
                  <Text style={styles.viewDetailBtnText}>View Booking Receipt & Details ›</Text>
                </Pressable>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* ── Detail Sheet Modal ── */}
      <Modal
        visible={Boolean(selectedBooking)}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedBooking(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Booking Receipt</Text>
              <Pressable onPress={() => setSelectedBooking(null)}>
                <Text style={styles.closeIcon}>✕</Text>
              </Pressable>
            </View>

            {selectedBooking && (
              <ScrollView contentContainerStyle={styles.modalBody}>
                <View style={styles.modalSection}>
                  <Text style={styles.modalSecTitle}>Companion Partner</Text>
                  <Text style={styles.modalSecValue}>{selectedBooking.partnerName}</Text>
                  <Text style={styles.modalSecSub}>{selectedBooking.serviceName || 'Companion Session'}</Text>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalSecTitle}>Session Schedule</Text>
                  <Text style={styles.modalSecValue}>
                    {selectedBooking.date} • {selectedBooking.startTime} ({selectedBooking.durationHours} Hours)
                  </Text>
                  <Text style={styles.modalSecSub}>📍 {selectedBooking.meetingLocation}</Text>
                </View>

                {selectedBooking.startOtp && (
                  <View style={styles.modalOtpBox}>
                    <Text style={styles.modalOtpLabel}>Session Verification OTP</Text>
                    <Text style={styles.modalOtpNumber}>{selectedBooking.startOtp}</Text>
                  </View>
                )}

                <View style={styles.modalPriceBox}>
                  <Text style={styles.modalPriceHead}>Financial Summary</Text>
                  <View style={styles.modalPriceRow}>
                    <Text style={styles.modalPKey}>Base Companion Fee</Text>
                    <Text style={styles.modalPVal}>₹{selectedBooking.baseAmount || 0}</Text>
                  </View>
                  <View style={styles.modalPriceRow}>
                    <Text style={styles.modalPKey}>Concierge Platform Fee (15%)</Text>
                    <Text style={styles.modalPVal}>₹{selectedBooking.platformFee || 0}</Text>
                  </View>
                  <View style={styles.modalPriceRow}>
                    <Text style={styles.modalPKey}>GST (18%)</Text>
                    <Text style={styles.modalPVal}>₹{selectedBooking.gstAmount || 0}</Text>
                  </View>
                  <View style={[styles.modalPriceRow, styles.modalTotalRow]}>
                    <Text style={styles.modalTotalKey}>Total Amount</Text>
                    <Text style={styles.modalTotalVal}>₹{selectedBooking.totalAmount || 0}</Text>
                  </View>
                </View>

                <Text style={styles.emergencyNote}>
                  Emergency Contact on File: {selectedBooking.emergencyContact || '+91 99999 11111'}
                </Text>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    justifyContent: 'space-around',
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
  },
  filterTabTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  topInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
  },
  refreshBtn: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingId: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  companionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  partnerName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  serviceName: {
    fontSize: 11,
    color: colors.muted,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primary,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: colors.muted,
    marginBottom: 2,
  },
  detailVal: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.ink,
  },
  locationRow: {
    marginBottom: 12,
  },
  locationVal: {
    fontSize: 11,
    color: colors.inkLight,
    fontWeight: '500',
  },
  otpCard: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  otpHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  otpLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#92400E',
  },
  otpHelp: {
    fontSize: 10,
    color: '#B45309',
    fontWeight: '600',
  },
  otpDisplayRow: {
    alignItems: 'center',
    marginVertical: 4,
  },
  otpCode: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 8,
    color: colors.ink,
  },
  otpNotice: {
    fontSize: 10,
    color: '#78350F',
    textAlign: 'center',
    lineHeight: 14,
  },
  viewDetailBtn: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  viewDetailBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 16,
  },
  bookCtaBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  bookCtaBtnText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  closeIcon: {
    fontSize: 18,
    color: colors.muted,
    padding: 4,
  },
  modalBody: {
    paddingBottom: 24,
  },
  modalSection: {
    marginBottom: 14,
  },
  modalSecTitle: {
    fontSize: 11,
    color: colors.muted,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 2,
  },
  modalSecValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
  modalSecSub: {
    fontSize: 12,
    color: colors.muted,
  },
  modalOtpBox: {
    backgroundColor: '#FEF9E7',
    borderColor: '#F3E5AB',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  modalOtpLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
    marginBottom: 4,
  },
  modalOtpNumber: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 6,
    color: colors.ink,
  },
  modalPriceBox: {
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
  },
  modalPriceHead: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 8,
  },
  modalPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  modalPKey: {
    fontSize: 11,
    color: colors.muted,
  },
  modalPVal: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.ink,
  },
  modalTotalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 6,
    marginTop: 4,
  },
  modalTotalKey: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.ink,
  },
  modalTotalVal: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.primary,
  },
  emergencyNote: {
    fontSize: 10,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 12,
  },
});
