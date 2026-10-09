import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../theme';
import { createBooking } from '../api';
import type { Booking, CreateBookingPayload, Partner, User } from '../types';

interface BookingModalProps {
  visible: boolean;
  partner: Partner | null;
  user: User | null;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
  onNavigateTab: (tab: any) => void;
}

export function BookingModal({
  visible,
  partner,
  user,
  onClose,
  onBookingSuccess,
  onNavigateTab,
}: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [durationHours, setDurationHours] = useState(2);
  const [meetingLocation, setMeetingLocation] = useState('Cafe / Public Plaza, ' + (partner?.city || 'Delhi NCR'));
  const [clientNotes, setClientNotes] = useState('');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergencyContact || '+91 99999 11111');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!partner) return null;

  const isSubscribed = Boolean(
    user?.isSubscribed &&
    user?.subscriptionExpiresAt &&
    new Date(user.subscriptionExpiresAt) > new Date()
  );

  const hourlyRate = partner.hourlyRate || 1000;
  const baseAmount = hourlyRate * durationHours;
  const platformFee = Math.round(baseAmount * 0.15);
  const gstAmount = Math.round((baseAmount + platformFee) * 0.18);
  const totalAmount = baseAmount + platformFee + gstAmount;

  const handleConfirmBooking = async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please log in as a Hirer to complete your booking.');
      return;
    }

    if (!isSubscribed) {
      Alert.alert(
        'Annual Membership Required',
        'An active Annual Membership Pass (₹249/yr) is required to book companion sessions. Would you like to get your pass now?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Get Pass (₹249)',
            onPress: () => {
              onClose();
              onNavigateTab('subscription');
            },
          },
        ]
      );
      return;
    }

    if (user.kycStatus !== 'verified') {
      Alert.alert(
        'KYC Verification Needed',
        'Hirer identity verification must be completed for verified meetings. Would you like to check your KYC status?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Go to KYC',
            onPress: () => {
              onClose();
              onNavigateTab('kyc');
            },
          },
        ]
      );
      return;
    }

    if (!meetingLocation.trim()) {
      Alert.alert('Meeting Location Required', 'Please enter a public venue or meeting point.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: CreateBookingPayload = {
        clientId: user.id,
        clientName: user.name,
        clientPhone: user.phone || '+91 98765 43210',
        partnerId: partner.id,
        serviceId: 'srv-1',
        date: selectedDate,
        startTime: selectedTime,
        durationHours,
        meetingLocation: meetingLocation.trim(),
        clientNotes: clientNotes.trim(),
        emergencyContact: emergencyContact.trim(),
      };

      const newBooking = await createBooking(payload);
      Alert.alert(
        '🎉 Booking Confirmed!',
        `Your session with ${partner.name} has been requested.\n\nStart Session OTP: ${newBooking.startOtp || '1234'}\n\nPlease share this OTP with your companion when you meet.`
      );
      onBookingSuccess(newBooking);
      onClose();
      onNavigateTab('bookings');
    } catch (err: any) {
      Alert.alert('Booking Failed', err.message || 'Unable to submit booking request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>BOOK COMPANION</Text>
              <Text style={styles.title}>Session with {partner.name}</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.body}>
            {/* Gate Banners */}
            {!isSubscribed && (
              <View style={styles.gateAlert}>
                <Text style={styles.gateAlertIcon}>👑</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.gateAlertTitle}>Annual Pass Required (₹249/yr)</Text>
                  <Text style={styles.gateAlertSub}>You will be prompted to subscribe before finalizing.</Text>
                </View>
              </View>
            )}

            {/* Companion snippet */}
            <View style={styles.partnerSnippet}>
              <View style={styles.partnerInitCircle}>
                <Text style={styles.partnerInitText}>{partner.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.pName}>{partner.name}</Text>
                <Text style={styles.pCity}>📍 {partner.city}</Text>
              </View>
              <Text style={styles.pRate}>₹{hourlyRate.toLocaleString('en-IN')}/hr</Text>
            </View>

            {/* Schedule Section */}
            <Text style={styles.secHeading}>Select Date</Text>
            <TextInput
              style={styles.input}
              value={selectedDate}
              onChangeText={setSelectedDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.muted}
            />

            <Text style={styles.secHeading}>Select Start Time</Text>
            <View style={styles.timePillsRow}>
              {['10:00 AM', '12:00 PM', '03:00 PM', '06:00 PM'].map((t) => (
                <Pressable
                  key={t}
                  style={[styles.pill, selectedTime === t && styles.pillActive]}
                  onPress={() => setSelectedTime(t)}
                >
                  <Text style={[styles.pillText, selectedTime === t && styles.pillTextActive]}>
                    {t}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.secHeading}>Duration (Hours)</Text>
            <View style={styles.hoursRow}>
              {[1, 2, 3, 4, 6].map((hrs) => (
                <Pressable
                  key={hrs}
                  style={[styles.hourPill, durationHours === hrs && styles.hourPillActive]}
                  onPress={() => setDurationHours(hrs)}
                >
                  <Text style={[styles.hourText, durationHours === hrs && styles.hourTextActive]}>
                    {hrs} {hrs === 1 ? 'hr' : 'hrs'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.secHeading}>Meeting Location / Venue *</Text>
            <TextInput
              style={styles.input}
              value={meetingLocation}
              onChangeText={setMeetingLocation}
              placeholder="e.g. Starbucks, Connaught Place, New Delhi"
              placeholderTextColor={colors.muted}
            />

            <Text style={styles.secHeading}>Emergency Contact Number *</Text>
            <TextInput
              style={styles.input}
              value={emergencyContact}
              onChangeText={setEmergencyContact}
              placeholder="+91 99999 00000"
              placeholderTextColor={colors.muted}
              keyboardType="phone-pad"
            />

            <Text style={styles.secHeading}>Notes / Specific Request</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={clientNotes}
              onChangeText={setClientNotes}
              placeholder="e.g. Attending a corporate exhibition, need companion for social networking"
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={3}
            />

            {/* Price Breakdown */}
            <View style={styles.priceSummary}>
              <Text style={styles.priceSummaryTitle}>Transparent Pricing</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceKey}>
                  Base Companion Fee ({durationHours}h × ₹{hourlyRate})
                </Text>
                <Text style={styles.priceVal}>₹{baseAmount.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceKey}>Concierge Platform Fee (15%)</Text>
                <Text style={styles.priceVal}>₹{platformFee.toLocaleString('en-IN')}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceKey}>GST (18%)</Text>
                <Text style={styles.priceVal}>₹{gstAmount.toLocaleString('en-IN')}</Text>
              </View>
              <View style={[styles.priceRow, styles.priceTotalRow]}>
                <Text style={styles.priceTotalKey}>Total Amount</Text>
                <Text style={styles.priceTotalVal}>₹{totalAmount.toLocaleString('en-IN')}</Text>
              </View>
            </View>

            {/* Platonic reminder */}
            <Text style={styles.platonicReminder}>
              🤝 Always Platonic. You will receive a 4-digit OTP to verify when the meeting starts.
            </Text>

            {/* Submit Button */}
            <Pressable
              style={[styles.confirmBtn, isSubmitting && styles.confirmDisabled]}
              onPress={handleConfirmBooking}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.confirmBtnText}>
                  Confirm & Request Session • ₹{totalAmount.toLocaleString('en-IN')}
                </Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: colors.primary,
    marginBottom: 2,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.ink,
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontSize: 18,
    color: colors.muted,
  },
  body: {
    padding: 18,
    paddingBottom: 36,
  },
  gateAlert: {
    backgroundColor: '#FEF9E7',
    borderColor: '#F3E5AB',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  gateAlertIcon: {
    fontSize: 20,
  },
  gateAlertTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  gateAlertSub: {
    fontSize: 11,
    color: '#B45309',
  },
  partnerSnippet: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    gap: 12,
  },
  partnerInitCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerInitText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  pName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
  },
  pCity: {
    fontSize: 11,
    color: colors.muted,
  },
  pRate: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  secHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.ink,
    letterSpacing: 0.3,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.ink,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  timePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.muted,
  },
  pillTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  hoursRow: {
    flexDirection: 'row',
    gap: 8,
  },
  hourPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  hourPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  hourText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.muted,
  },
  hourTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  priceSummary: {
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priceSummaryTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  priceKey: {
    fontSize: 11,
    color: colors.muted,
  },
  priceVal: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.ink,
  },
  priceTotalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.borderDark,
    paddingTop: 8,
    marginTop: 6,
  },
  priceTotalKey: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.ink,
  },
  priceTotalVal: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primary,
  },
  platonicReminder: {
    fontSize: 10,
    color: colors.muted,
    textAlign: 'center',
    marginVertical: 12,
    lineHeight: 14,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmDisabled: {
    opacity: 0.6,
  },
  confirmBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
});
