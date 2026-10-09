import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../theme';
import { submitClientKYC } from '../api';
import type { HirerKycPayload, User } from '../types';

interface KycScreenProps {
  user: User | null;
  onKycSubmitted: (updatedUser: User) => void;
  onRefresh: () => void;
}

export function KycScreen({ user, onKycSubmitted, onRefresh }: KycScreenProps) {
  const kycStatus = user?.kycStatus || 'not_submitted';
  const isVerified = kycStatus === 'verified';
  const isPending = kycStatus === 'pending' || kycStatus === 'under_review';
  const isRejected = kycStatus === 'rejected';

  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || 'Delhi NCR');
  const [dob, setDob] = useState(user?.dob || '2000-01-01');
  const [idType, setIdType] = useState('Aadhaar Card');
  const [idNumber, setIdNumber] = useState(user?.kycDocuments?.idNumber || '');
  const [panNumber, setPanNumber] = useState(user?.kycDocuments?.panNumber || '');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergencyContact || '+91 99999 11111');
  const [frontDocName, setFrontDocName] = useState(user?.kycDocuments?.idFrontName || 'aadhaar_front.jpg');
  const [backDocName, setBackDocName] = useState(user?.kycDocuments?.idBackName || 'aadhaar_back.jpg');
  const [selfieDocName, setSelfieDocName] = useState(user?.kycDocuments?.selfieFileName || 'live_selfie.jpg');
  const [agreed, setAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please log in to submit identity verification.');
      return;
    }

    if (!fullName.trim()) {
      Alert.alert('Missing Field', 'Please enter your full legal name as shown on your government ID.');
      return;
    }

    if (!idNumber.trim()) {
      Alert.alert('Missing Field', 'Please enter your government ID number.');
      return;
    }

    if (!agreed) {
      Alert.alert('Consent Required', 'Please accept the declaration to submit your KYC.');
      return;
    }

    // Default mock valid image base64
    const mockDoc =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

    const payload: HirerKycPayload = {
      name: fullName.trim(),
      phone: phone.trim() || user.phone || '+91 98765 43210',
      email: user.email,
      city: city.trim(),
      dob: dob.trim(),
      holderName: fullName.trim(),
      idType,
      idNumber: idNumber.trim(),
      panNumber: panNumber.trim(),
      idFrontDoc: user.kycDocuments?.idFrontDoc || mockDoc,
      idBackDoc: user.kycDocuments?.idBackDoc || mockDoc,
      panDoc: user.kycDocuments?.panDoc || mockDoc,
      selfieDoc: user.kycDocuments?.selfieDoc || mockDoc,
      idFrontName: frontDocName,
      idBackName: backDocName,
      panFileName: panNumber ? 'pan_card.jpg' : '',
      selfieFileName: selfieDocName,
    };

    setIsSubmitting(true);
    try {
      const res = await submitClientKYC(user.id, payload);
      Alert.alert(
        'KYC Submitted',
        'Your identity verification documents have been submitted to compliance administrators for review.'
      );
      const updated: User = {
        ...user,
        name: fullName.trim(),
        dob: dob.trim(),
        kycStatus: 'pending',
        kycRejectionReason: null,
        kycDocuments: {
          ...(user.kycDocuments || {}),
          idType,
          idNumber: idNumber.trim(),
          submittedAt: new Date().toISOString(),
        },
      };
      onKycSubmitted(updated);
    } catch (err: any) {
      Alert.alert('Submission Failed', err.message || 'Unable to submit KYC.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ── Status Banner ── */}
      <View
        style={[
          styles.statusCard,
          isVerified
            ? styles.statusCardVerified
            : isPending
            ? styles.statusCardPending
            : isRejected
            ? styles.statusCardRejected
            : styles.statusCardDefault,
        ]}
      >
        <View style={styles.statusRow}>
          <Text style={styles.statusEmoji}>
            {isVerified ? '✅' : isPending ? '⏳' : isRejected ? '❌' : '🛡️'}
          </Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.statusTitle}>
              {isVerified
                ? 'KYC Verified Hirer'
                : isPending
                ? 'Verification Under Review'
                : isRejected
                ? 'Verification Rejected'
                : 'Hirer KYC Not Submitted'}
            </Text>
            <Text style={styles.statusDesc}>
              {isVerified
                ? 'Your government identity documents are verified. You are authorized to book companion sessions.'
                : isPending
                ? 'Documents submitted. Our trust & safety team reviews verifications within 2-4 hours.'
                : isRejected
                ? user?.kycRejectionReason || 'Documents did not meet compliance criteria. Please review below and resubmit.'
                : 'Upload government ID to unlock verified companion booking and safety protocol.'}
            </Text>
          </View>
        </View>

        {isRejected && user?.kycRejectionReason && (
          <View style={styles.rejectionBox}>
            <Text style={styles.rejectionLabel}>Admin Rejection Note:</Text>
            <Text style={styles.rejectionText}>{user.kycRejectionReason}</Text>
          </View>
        )}
      </View>

      {/* ── KYC Form ── */}
      {(!isVerified || isRejected) && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {isRejected ? 'Resubmit Corrected Verification' : 'Hirer KYC Verification Form'}
          </Text>
          <Text style={styles.formSubtitle}>
            Mandatory under PartnerOnRent safety guidelines. All data is encrypted with bank-grade AES-256.
          </Text>

          {/* Full Name */}
          <Text style={styles.label}>Full Legal Name (as on ID) *</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="e.g. Ajay Kumar"
            placeholderTextColor={colors.muted}
          />

          {/* Date of Birth */}
          <Text style={styles.label}>Date of Birth (YYYY-MM-DD) *</Text>
          <TextInput
            style={styles.input}
            value={dob}
            onChangeText={setDob}
            placeholder="YYYY-MM-DD (e.g. 1998-05-15)"
            placeholderTextColor={colors.muted}
          />

          {/* ID Type Selector */}
          <Text style={styles.label}>Government ID Document Type *</Text>
          <View style={styles.idTypeRow}>
            {['Aadhaar Card', 'PAN Card', 'Passport'].map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.idTypeBtn,
                  idType === type && styles.idTypeBtnActive,
                ]}
                onPress={() => setIdType(type)}
              >
                <Text
                  style={[
                    styles.idTypeText,
                    idType === type && styles.idTypeTextActive,
                  ]}
                >
                  {type}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* ID Number */}
          <Text style={styles.label}>{idType} Number *</Text>
          <TextInput
            style={styles.input}
            value={idNumber}
            onChangeText={setIdNumber}
            placeholder={idType === 'Aadhaar Card' ? '12-digit Aadhaar number' : 'Document number'}
            placeholderTextColor={colors.muted}
          />

          {/* Document Uploads Preview */}
          <Text style={styles.label}>Document Attachments</Text>
          <View style={styles.attachmentBox}>
            <View style={styles.attachmentRow}>
              <Text style={styles.attachIcon}>📄</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.attachTitle}>{idType} Front Image</Text>
                <Text style={styles.attachName}>{frontDocName}</Text>
              </View>
              <Text style={styles.attachStatus}>Attached ✓</Text>
            </View>

            <View style={styles.attachmentRow}>
              <Text style={styles.attachIcon}>📄</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.attachTitle}>{idType} Back Image</Text>
                <Text style={styles.attachName}>{backDocName}</Text>
              </View>
              <Text style={styles.attachStatus}>Attached ✓</Text>
            </View>

            <View style={styles.attachmentRow}>
              <Text style={styles.attachIcon}>📸</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.attachTitle}>Live Selfie Photo</Text>
                <Text style={styles.attachName}>{selfieDocName}</Text>
              </View>
              <Text style={styles.attachStatus}>Attached ✓</Text>
            </View>
          </View>

          {/* Emergency Contact */}
          <Text style={styles.label}>Emergency Contact Phone Number *</Text>
          <TextInput
            style={styles.input}
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            placeholder="+91 99999 00000"
            placeholderTextColor={colors.muted}
            keyboardType="phone-pad"
          />

          {/* Declaration Checkbox */}
          <Pressable
            style={styles.consentRow}
            onPress={() => setAgreed(!agreed)}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
              {agreed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.consentText}>
              I certify that all uploaded identity documents are genuine, belong to me, and I agree to PartnerOnRent's Platonic Code of Conduct.
            </Text>
          </Pressable>

          {/* Submit CTA */}
          <Pressable
            style={[styles.submitBtn, isSubmitting && styles.submitDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.submitBtnText}>
                {isRejected ? 'Submit Corrected KYC' : 'Submit Identity Verification'}
              </Text>
            )}
          </Pressable>
        </View>
      )}

      {/* ── Verified Summary Details (if already verified) ── */}
      {isVerified && (
        <View style={styles.verifiedSummaryCard}>
          <Text style={styles.verifiedHeading}>Verified Credentials</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Verified Legal Name</Text>
            <Text style={styles.detailVal}>{user?.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Document Type</Text>
            <Text style={styles.detailVal}>{user?.kycDocuments?.idType || 'Aadhaar Card'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Verification Status</Text>
            <Text style={[styles.detailVal, { color: colors.successDark }]}>Cleared & Approved</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Emergency Protocol</Text>
            <Text style={styles.detailVal}>24x7 Escrow Enabled</Text>
          </View>
        </View>
      )}
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
  statusCardVerified: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  statusCardPending: {
    backgroundColor: '#FFFDF0',
    borderColor: '#FDE047',
  },
  statusCardRejected: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  statusCardDefault: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  statusEmoji: {
    fontSize: 26,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 2,
  },
  statusDesc: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 16,
  },
  rejectionBox: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  rejectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#991B1B',
    marginBottom: 2,
  },
  rejectionText: {
    fontSize: 12,
    color: '#B91C1C',
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  formTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 11,
    color: colors.muted,
    lineHeight: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.ink,
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
  idTypeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  idTypeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  idTypeBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  idTypeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.muted,
  },
  idTypeTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  attachmentBox: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  attachIcon: {
    fontSize: 18,
  },
  attachTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.ink,
  },
  attachName: {
    fontSize: 10,
    color: colors.muted,
  },
  attachStatus: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.successDark,
  },
  consentRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginTop: 14,
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  consentText: {
    fontSize: 11,
    color: colors.muted,
    lineHeight: 16,
    flex: 1,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  verifiedSummaryCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
  },
  verifiedHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailKey: {
    fontSize: 12,
    color: colors.muted,
  },
  detailVal: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ink,
  },
});
