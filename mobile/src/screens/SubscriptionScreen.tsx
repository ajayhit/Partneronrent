import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../theme';
import { subscribeUser } from '../api';
import type { User } from '../types';

interface SubscriptionScreenProps {
  user: User | null;
  onSubscriptionSuccess: (updatedUser: User) => void;
  onRefreshUser: () => void;
}

export function SubscriptionScreen({
  user,
  onSubscriptionSuccess,
  onRefreshUser,
}: SubscriptionScreenProps) {
  const expiresAt = user?.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt) : null;
  const now = new Date();
  const isActive = Boolean(user?.isSubscribed && expiresAt && expiresAt > now);
  const isExpired = Boolean(user?.isSubscribed && expiresAt && expiresAt <= now);
  const daysRemaining =
    isActive && expiresAt
      ? Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'wallet'>('upi');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [lastInvoice, setLastInvoice] = useState<any>(null);

  const walletBalance = user?.walletBalance || 0;
  const planFee = 249;
  const basePrice = 211.02;
  const gstAmount = 37.98;

  const handleSubscribe = async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please log in to activate your membership pass.');
      return;
    }

    if (paymentMethod === 'wallet' && walletBalance < planFee) {
      Alert.alert('Insufficient Wallet Balance', `Available balance is ₹${walletBalance}. Please select UPI or Card.`);
      return;
    }

    if (paymentMethod === 'upi' && upiId.trim() && !upiId.includes('@')) {
      Alert.alert('Invalid UPI ID', 'Please enter a valid UPI ID (e.g. name@okhdfcbank)');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await subscribeUser(user.id, user.role || 'client', paymentMethod);
      if (res.success) {
        const invoiceData = {
          invoiceNumber: res.invoiceNumber || `INV-POR-${Date.now().toString().slice(-6)}`,
          date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          userName: user.name,
          paymentMethod: paymentMethod === 'wallet' ? 'PartnerOnRent Wallet' : paymentMethod === 'upi' ? `UPI (${upiId || 'Instant'})` : 'Credit/Debit Card',
          amount: planFee,
          basePrice,
          gstAmount,
          expiresAt: res.subscription?.subscriptionExpiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        };

        setLastInvoice(invoiceData);
        setPaymentModalOpen(false);
        setInvoiceModalOpen(true);

        const updated: User = {
          ...user,
          isSubscribed: true,
          subscriptionPlan: 'annual_249',
          subscriptionExpiresAt: res.subscription?.subscriptionExpiresAt,
          subscribedAt: res.subscription?.subscribedAt,
          walletBalance: res.user?.walletBalance ?? (paymentMethod === 'wallet' ? walletBalance - planFee : walletBalance),
        };
        onSubscriptionSuccess(updated);
      } else {
        Alert.alert('Payment Error', 'Unable to process subscription. Please try again.');
      }
    } catch (err: any) {
      Alert.alert('Subscription Failed', err.message || 'Payment error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ── Status Card ── */}
      <View
        style={[
          styles.statusCard,
          isActive ? styles.statusActive : isExpired ? styles.statusExpired : styles.statusInactive,
        ]}
      >
        <View style={styles.statusHeader}>
          <View style={styles.statusIconWrap}>
            <Text style={styles.statusIconEmoji}>{isActive ? '👑' : isExpired ? '⚠️' : '⚡'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.pill,
                  isActive ? styles.pillActive : isExpired ? styles.pillExpired : styles.pillInactive,
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    isActive ? styles.pillTextActive : isExpired ? styles.pillTextExpired : styles.pillTextInactive,
                  ]}
                >
                  {isActive ? 'PASS ACTIVE' : isExpired ? 'EXPIRED' : 'NOT SUBSCRIBED'}
                </Text>
              </View>
            </View>
            <Text style={styles.statusTitle}>
              {isActive ? 'Prime Membership Pass' : 'Annual Pass Needed'}
            </Text>
            <Text style={styles.statusSub}>
              {isActive
                ? `${daysRemaining} days remaining (Expires ${expiresAt?.toLocaleDateString('en-IN')})`
                : isExpired
                ? 'Your 1-year pass has expired. Renew to continue booking.'
                : 'Subscribe to unlock all verified companions & bookings.'}
            </Text>
          </View>
        </View>

        {isActive ? (
          <Pressable
            style={styles.viewInvoiceBtn}
            onPress={() => setInvoiceModalOpen(true)}
          >
            <Text style={styles.viewInvoiceBtnText}>📄 View Membership Invoice</Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.activateBtn}
            onPress={() => setPaymentModalOpen(true)}
          >
            <Text style={styles.activateBtnText}>
              {isExpired ? 'Renew Annual Pass — ₹249/yr' : 'Activate Annual Pass — ₹249/yr'}
            </Text>
          </Pressable>
        )}
      </View>

      {/* ── Plan Pricing Card ── */}
      <View style={styles.planCard}>
        <View style={styles.planBadge}>
          <Text style={styles.planBadgeText}>POPULAR • TRANSPARENT</Text>
        </View>
        <Text style={styles.planName}>Annual Prime Membership</Text>
        <View style={styles.priceRow}>
          <Text style={styles.planPrice}>₹249</Text>
          <Text style={styles.planPeriod}> / 1 Full Year (365 Days)</Text>
        </View>
        <Text style={styles.perDayText}>Equivalent to just ₹0.68 / day</Text>

        <View style={styles.divider} />

        <Text style={styles.benefitsTitle}>Everything Included in Your Pass:</Text>
        <View style={styles.benefitItem}>
          <Text style={styles.checkIcon}>✓</Text>
          <Text style={styles.benefitText}>Unlimited Companion Bookings across all cities</Text>
        </View>
        <View style={styles.benefitItem}>
          <Text style={styles.checkIcon}>✓</Text>
          <Text style={styles.benefitText}>Direct companion phone & location coordination</Text>
        </View>
        <View style={styles.benefitItem}>
          <Text style={styles.checkIcon}>✓</Text>
          <Text style={styles.benefitText}>24x7 Safety Protocol & Emergency SOS assistance</Text>
        </View>
        <View style={styles.benefitItem}>
          <Text style={styles.checkIcon}>✓</Text>
          <Text style={styles.benefitText}>Strict KYC Identity verification guarantee</Text>
        </View>
        <View style={styles.benefitItem}>
          <Text style={styles.checkIcon}>✓</Text>
          <Text style={styles.benefitText}>100% Platonic Code of Conduct protection</Text>
        </View>
        <View style={styles.benefitItem}>
          <Text style={styles.checkIcon}>✓</Text>
          <Text style={styles.benefitText}>GST Tax Invoice with formal compliance</Text>
        </View>

        {!isActive && (
          <Pressable
            style={styles.subscribeLargeBtn}
            onPress={() => setPaymentModalOpen(true)}
          >
            <Text style={styles.subscribeLargeBtnText}>Get Annual Pass for ₹249</Text>
          </Pressable>
        )}
      </View>

      {/* ── Tax Breakdown ── */}
      <View style={styles.taxCard}>
        <Text style={styles.taxTitle}>Transparent Price Breakdown</Text>
        <View style={styles.taxRow}>
          <Text style={styles.taxLabel}>Base Membership Fee (1 Year)</Text>
          <Text style={styles.taxValue}>₹211.02</Text>
        </View>
        <View style={styles.taxRow}>
          <Text style={styles.taxLabel}>GST (18%)</Text>
          <Text style={styles.taxValue}>₹37.98</Text>
        </View>
        <View style={[styles.taxRow, styles.taxTotalRow]}>
          <Text style={styles.taxTotalLabel}>Total Payable</Text>
          <Text style={styles.taxTotalValue}>₹249.00</Text>
        </View>
      </View>

      {/* ── Payment Modal ── */}
      <Modal
        visible={paymentModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setPaymentModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeading}>Checkout: Annual Pass</Text>
              <Pressable onPress={() => setPaymentModalOpen(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.checkoutSummary}>
              <Text style={styles.checkoutPlan}>PartnerOnRent Prime (Hirer Pass)</Text>
              <Text style={styles.checkoutAmount}>₹249.00</Text>
            </View>

            <Text style={styles.methodHeader}>Select Payment Method:</Text>

            {/* UPI Option */}
            <Pressable
              style={[
                styles.methodOption,
                paymentMethod === 'upi' && styles.methodOptionActive,
              ]}
              onPress={() => setPaymentMethod('upi')}
            >
              <Text style={styles.methodEmoji}>📱</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.methodTitle}>Instant UPI (GPay / PhonePe / Paytm)</Text>
                <Text style={styles.methodSub}>Zero convenience charges</Text>
              </View>
              <Text style={styles.radio}>{paymentMethod === 'upi' ? '●' : '○'}</Text>
            </Pressable>

            {paymentMethod === 'upi' && (
              <TextInput
                style={styles.upiInput}
                placeholder="Enter UPI ID (e.g. mobile@upi)"
                placeholderTextColor={colors.muted}
                value={upiId}
                onChangeText={setUpiId}
              />
            )}

            {/* Card Option */}
            <Pressable
              style={[
                styles.methodOption,
                paymentMethod === 'card' && styles.methodOptionActive,
              ]}
              onPress={() => setPaymentMethod('card')}
            >
              <Text style={styles.methodEmoji}>💳</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.methodTitle}>Credit / Debit Card</Text>
                <Text style={styles.methodSub}>Visa, Mastercard, RuPay</Text>
              </View>
              <Text style={styles.radio}>{paymentMethod === 'card' ? '●' : '○'}</Text>
            </Pressable>

            {/* Wallet Option */}
            <Pressable
              style={[
                styles.methodOption,
                paymentMethod === 'wallet' && styles.methodOptionActive,
              ]}
              onPress={() => setPaymentMethod('wallet')}
            >
              <Text style={styles.methodEmoji}>💼</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.methodTitle}>PartnerOnRent Wallet</Text>
                <Text style={styles.methodSub}>Available balance: ₹{walletBalance}</Text>
              </View>
              <Text style={styles.radio}>{paymentMethod === 'wallet' ? '●' : '○'}</Text>
            </Pressable>

            <Pressable
              style={[styles.payNowBtn, isProcessing && styles.payDisabled]}
              onPress={handleSubscribe}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.payNowBtnText}>Complete Payment • ₹249</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ── Invoice Modal ── */}
      <Modal
        visible={invoiceModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setInvoiceModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.invoiceModal}>
            <View style={styles.invoiceHeader}>
              <View>
                <Text style={styles.invoiceBrand}>PARTNERONRENT</Text>
                <Text style={styles.invoiceTitle}>GST Tax Invoice</Text>
              </View>
              <Pressable onPress={() => setInvoiceModalOpen(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.invoiceBody}>
              <View style={styles.invoicePill}>
                <Text style={styles.invoicePillText}>✓ PAYMENT CONFIRMED & ACTIVE</Text>
              </View>

              <View style={styles.invoiceMetaGrid}>
                <View style={styles.metaCell}>
                  <Text style={styles.metaKey}>Invoice No.</Text>
                  <Text style={styles.metaVal}>{lastInvoice?.invoiceNumber || 'INV-POR-581024'}</Text>
                </View>
                <View style={styles.metaCell}>
                  <Text style={styles.metaKey}>Date</Text>
                  <Text style={styles.metaVal}>{lastInvoice?.date || now.toLocaleDateString('en-IN')}</Text>
                </View>
              </View>

              <View style={styles.invoiceMetaGrid}>
                <View style={styles.metaCell}>
                  <Text style={styles.metaKey}>Customer</Text>
                  <Text style={styles.metaVal}>{user?.name || 'Hirer Member'}</Text>
                </View>
                <View style={styles.metaCell}>
                  <Text style={styles.metaKey}>Plan</Text>
                  <Text style={styles.metaVal}>1 Year Pass (₹249)</Text>
                </View>
              </View>

              <View style={styles.invoiceBreakdown}>
                <View style={styles.invRow}>
                  <Text style={styles.invKey}>Annual Membership (Base)</Text>
                  <Text style={styles.invVal}>₹211.02</Text>
                </View>
                <View style={styles.invRow}>
                  <Text style={styles.invKey}>CGST (9%)</Text>
                  <Text style={styles.invVal}>₹18.99</Text>
                </View>
                <View style={styles.invRow}>
                  <Text style={styles.invKey}>SGST (9%)</Text>
                  <Text style={styles.invVal}>₹18.99</Text>
                </View>
                <View style={[styles.invRow, styles.invTotalRow]}>
                  <Text style={styles.invTotalKey}>Total Amount Paid</Text>
                  <Text style={styles.invTotalVal}>₹249.00</Text>
                </View>
              </View>

              <Text style={styles.invoiceFooterText}>
                PartnerOnRent Technologies Pvt Ltd • 24x7 Support: support@partneronrent.in
              </Text>
            </ScrollView>

            <Pressable
              style={styles.doneBtn}
              onPress={() => setInvoiceModalOpen(false)}
            >
              <Text style={styles.doneBtnText}>Close Receipt</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  statusCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1.5,
  },
  statusActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  statusExpired: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  statusInactive: {
    backgroundColor: '#FFFDF0',
    borderColor: '#FDE047',
  },
  statusHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  statusIconEmoji: {
    fontSize: 24,
  },
  badgeRow: {
    marginBottom: 4,
  },
  pill: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  pillActive: {
    backgroundColor: '#DCFCE7',
  },
  pillExpired: {
    backgroundColor: '#FEE2E2',
  },
  pillInactive: {
    backgroundColor: '#FEF3C7',
  },
  pillText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  pillTextActive: {
    color: '#15803D',
  },
  pillTextExpired: {
    color: '#B91C1C',
  },
  pillTextInactive: {
    color: '#B45309',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 2,
  },
  statusSub: {
    fontSize: 11,
    color: colors.muted,
    lineHeight: 15,
  },
  viewInvoiceBtn: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewInvoiceBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  activateBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
  },
  activateBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
  planCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  planBadge: {
    backgroundColor: colors.goldLight,
    borderColor: '#E8D497',
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  planBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.goldDark,
  },
  planName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primary,
  },
  planPeriod: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
  },
  perDayText: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },
  benefitsTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  checkIcon: {
    color: colors.success,
    fontWeight: '800',
    fontSize: 14,
  },
  benefitText: {
    fontSize: 12,
    color: colors.inkLight,
    flex: 1,
    lineHeight: 16,
  },
  subscribeLargeBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  subscribeLargeBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  taxCard: {
    backgroundColor: '#F5EFEA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7DDD4',
  },
  taxTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 8,
  },
  taxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  taxLabel: {
    fontSize: 11,
    color: colors.muted,
  },
  taxValue: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.ink,
  },
  taxTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#DECFC3',
    paddingTop: 6,
    marginTop: 4,
  },
  taxTotalLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.ink,
  },
  taxTotalValue: {
    fontSize: 13,
    fontWeight: '900',
    color: colors.primary,
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
    padding: 20,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.ink,
  },
  closeIcon: {
    fontSize: 18,
    color: colors.muted,
    padding: 4,
  },
  checkoutSummary: {
    backgroundColor: colors.primaryLight,
    padding: 14,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkoutPlan: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  checkoutAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primary,
  },
  methodHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
    marginBottom: 10,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 10,
    backgroundColor: colors.background,
  },
  methodOptionActive: {
    borderColor: colors.primary,
    backgroundColor: '#FAF0F2',
  },
  methodEmoji: {
    fontSize: 20,
  },
  methodTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
  },
  methodSub: {
    fontSize: 10,
    color: colors.muted,
  },
  radio: {
    fontSize: 16,
    color: colors.primary,
  },
  upiInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.ink,
    marginBottom: 10,
  },
  payNowBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  payDisabled: {
    opacity: 0.6,
  },
  payNowBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  invoiceModal: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    margin: 20,
    maxHeight: '80%',
    padding: 20,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
    marginBottom: 12,
  },
  invoiceBrand: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: colors.primary,
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  invoiceBody: {
    paddingBottom: 14,
  },
  invoicePill: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 14,
  },
  invoicePillText: {
    color: '#15803D',
    fontSize: 10,
    fontWeight: '800',
  },
  invoiceMetaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metaCell: {
    flex: 1,
  },
  metaKey: {
    fontSize: 10,
    color: colors.muted,
  },
  metaVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ink,
  },
  invoiceBreakdown: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
  },
  invRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  invKey: {
    fontSize: 11,
    color: colors.muted,
  },
  invVal: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.ink,
  },
  invTotalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    marginTop: 4,
  },
  invTotalKey: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.ink,
  },
  invTotalVal: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.primary,
  },
  invoiceFooterText: {
    fontSize: 9,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 8,
  },
  doneBtn: {
    backgroundColor: colors.ink,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 8,
  },
  doneBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
});
