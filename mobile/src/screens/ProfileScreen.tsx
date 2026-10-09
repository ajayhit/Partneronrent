import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../theme';
import { updateClientProfile } from '../api';
import type { User } from '../types';

interface ProfileScreenProps {
  user: User | null;
  onUpdateUser: (updatedUser: User) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
  onNavigateTab: (tab: any) => void;
}

export function ProfileScreen({
  user,
  onUpdateUser,
  onLogout,
  onOpenAuth,
  onNavigateTab,
}: ProfileScreenProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || 'Delhi NCR');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergencyContact || '');
  const [isSaving, setIsSaving] = useState(false);

  const isSubscribed = Boolean(
    user?.isSubscribed &&
    user?.subscriptionExpiresAt &&
    new Date(user.subscriptionExpiresAt) > new Date()
  );
  const isKycVerified = user?.kycStatus === 'verified';

  const handleSaveProfile = async () => {
    if (!user) return;
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Full name is required.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateClientProfile(user.id, {
        name: name.trim(),
        phone: phone.trim(),
        city: city.trim(),
        emergencyContact: emergencyContact.trim(),
      });
      onUpdateUser(res.user);
      setEditModalOpen(false);
      Alert.alert('Profile Saved', 'Your profile information has been updated.');
    } catch (err: any) {
      Alert.alert('Save Failed', err.message || 'Unable to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ── User Header Card ── */}
      <View style={styles.profileHeaderCard}>
        <View style={styles.avatarBigWrap}>
          <Text style={styles.avatarBigText}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'H'}
          </Text>
        </View>

        <Text style={styles.userName}>{user?.name || 'Guest Hirer'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'Not signed in'}</Text>
        <View style={styles.roleTag}>
          <Text style={styles.roleTagText}>HIRER ACCOUNT</Text>
        </View>

        <View style={styles.statusPillsRow}>
          <Pressable
            style={[
              styles.pill,
              isSubscribed ? styles.pillSubActive : styles.pillSubInactive,
            ]}
            onPress={() => onNavigateTab('subscription')}
          >
            <Text style={styles.pillText}>
              {isSubscribed ? '👑 Prime Pass Active' : '⚡ Pass Inactive (₹249)'}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.pill,
              isKycVerified ? styles.pillKycActive : styles.pillKycInactive,
            ]}
            onPress={() => onNavigateTab('kyc')}
          >
            <Text style={styles.pillText}>
              {isKycVerified ? '🛡️ KYC Verified' : '⏳ KYC Pending'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* ── Wallet Card ── */}
      <View style={styles.walletCard}>
        <View>
          <Text style={styles.walletLabel}>PartnerOnRent Wallet</Text>
          <Text style={styles.walletAmount}>₹{user?.walletBalance || 0}</Text>
        </View>
        <Pressable
          style={styles.topUpBtn}
          onPress={() => Alert.alert('Wallet Balance', `Available balance: ₹${user?.walletBalance || 0}.\nYou can use wallet balance to pay for the Annual Pass or session bookings.`)}
        >
          <Text style={styles.topUpBtnText}>Details</Text>
        </Pressable>
      </View>

      {/* ── Profile Details Section ── */}
      <View style={styles.detailsCard}>
        <View style={styles.detailsHeader}>
          <Text style={styles.detailsTitle}>Personal Information</Text>
          {user && (
            <Pressable
              onPress={() => {
                setName(user.name);
                setPhone(user.phone || '');
                setCity(user.city || 'Delhi NCR');
                setEmergencyContact(user.emergencyContact || '');
                setEditModalOpen(true);
              }}
            >
              <Text style={styles.editBtn}>✏️ Edit</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.key}>Phone Number</Text>
          <Text style={styles.val}>{user?.phone || 'Not set'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.key}>City / Region</Text>
          <Text style={styles.val}>{user?.city || 'Delhi NCR'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.key}>Date of Birth</Text>
          <Text style={styles.val}>{user?.dob || 'Not provided'}</Text>
        </View>
        <View style={[styles.row, { borderBottomWidth: 0 }]}>
          <Text style={styles.key}>Emergency Contact</Text>
          <Text style={styles.val}>{user?.emergencyContact || '+91 99999 11111'}</Text>
        </View>
      </View>

      {/* ── Quick Links ── */}
      <View style={styles.linksCard}>
        <Pressable
          style={styles.linkItem}
          onPress={() => onNavigateTab('subscription')}
        >
          <Text style={styles.linkEmoji}>👑</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.linkTitle}>Annual Pass & Membership Invoice</Text>
            <Text style={styles.linkSub}>₹249/yr transparent membership pass</Text>
          </View>
          <Text style={styles.linkArrow}>›</Text>
        </Pressable>

        <Pressable
          style={styles.linkItem}
          onPress={() => onNavigateTab('kyc')}
        >
          <Text style={styles.linkEmoji}>🛡️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.linkTitle}>Hirer KYC Verification</Text>
            <Text style={styles.linkSub}>Government ID compliance & status</Text>
          </View>
          <Text style={styles.linkArrow}>›</Text>
        </Pressable>

        <Pressable
          style={styles.linkItem}
          onPress={() => onNavigateTab('bookings')}
        >
          <Text style={styles.linkEmoji}>📅</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.linkTitle}>My Companion Bookings</Text>
            <Text style={styles.linkSub}>Start session OTPs and receipts</Text>
          </View>
          <Text style={styles.linkArrow}>›</Text>
        </Pressable>
      </View>

      {/* ── Safety & Platonic Code ── */}
      <View style={styles.safetyCard}>
        <Text style={styles.safetyTitle}>🛡️ Platonic Code of Conduct</Text>
        <Text style={styles.safetyText}>
          PartnerOnRent is an exclusive platonic companionship platform. All sessions are monitored for safety.
          Any breach of conduct, non-platonic behavior, or harassment will lead to immediate profile termination and legal review.
        </Text>
      </View>

      {/* ── Auth / Account Actions ── */}
      <View style={styles.authButtonsRow}>
        <Pressable style={styles.switchAccountBtn} onPress={onOpenAuth}>
          <Text style={styles.switchAccountText}>🔑 Switch / Sign In Hirer</Text>
        </Pressable>

        {user && (
          <Pressable style={styles.logoutBtn} onPress={onLogout}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </Pressable>
        )}
      </View>

      {/* ── Edit Modal ── */}
      <Modal
        visible={editModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Hirer Profile</Text>
              <Pressable onPress={() => setEditModalOpen(false)}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.modalBody}>
              <Text style={styles.fieldLabel}>Full Legal Name *</Text>
              <TextInput
                style={styles.modalInput}
                value={name}
                onChangeText={setName}
                placeholder="Full Name"
                placeholderTextColor={colors.muted}
              />

              <Text style={styles.fieldLabel}>Phone Number</Text>
              <TextInput
                style={styles.modalInput}
                value={phone}
                onChangeText={setPhone}
                placeholder="+91 98765 00000"
                placeholderTextColor={colors.muted}
                keyboardType="phone-pad"
              />

              <Text style={styles.fieldLabel}>City / Location</Text>
              <TextInput
                style={styles.modalInput}
                value={city}
                onChangeText={setCity}
                placeholder="e.g. Delhi NCR"
                placeholderTextColor={colors.muted}
              />

              <Text style={styles.fieldLabel}>Emergency Contact</Text>
              <TextInput
                style={styles.modalInput}
                value={emergencyContact}
                onChangeText={setEmergencyContact}
                placeholder="+91 99999 11111"
                placeholderTextColor={colors.muted}
                keyboardType="phone-pad"
              />

              <Pressable
                style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
                onPress={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.saveBtnText}>Save Profile Updates</Text>
                )}
              </Pressable>
            </ScrollView>
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
  profileHeaderCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  avatarBigWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarBigText: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '800',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 8,
  },
  roleTag: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
  },
  statusPillsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  pillSubActive: {
    backgroundColor: '#FEF9E8',
    borderColor: '#E8D497',
  },
  pillSubInactive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primarySoft,
  },
  pillKycActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  pillKycInactive: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  pillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.ink,
  },
  walletCard: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  walletLabel: {
    color: '#F9D5DF',
    fontSize: 11,
    fontWeight: '700',
  },
  walletAmount: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 2,
  },
  topUpBtn: {
    backgroundColor: colors.white,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  topUpBtnText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  detailsCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
  },
  editBtn: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  key: {
    fontSize: 12,
    color: colors.muted,
  },
  val: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.ink,
  },
  linksCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 8,
    marginBottom: 16,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
  },
  linkEmoji: {
    fontSize: 20,
  },
  linkTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
  },
  linkSub: {
    fontSize: 10,
    color: colors.muted,
  },
  linkArrow: {
    fontSize: 20,
    color: colors.muted,
  },
  safetyCard: {
    backgroundColor: '#FAF5EE',
    borderColor: '#EFE2CC',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  safetyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 4,
  },
  safetyText: {
    fontSize: 11,
    color: colors.muted,
    lineHeight: 16,
  },
  authButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  switchAccountBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  switchAccountText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  logoutBtn: {
    backgroundColor: colors.background,
    borderColor: colors.borderDark,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: colors.dangerDark,
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
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  closeText: {
    fontSize: 18,
    color: colors.muted,
  },
  modalBody: {
    paddingBottom: 20,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: 6,
    marginTop: 10,
  },
  modalInput: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: colors.ink,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
});
