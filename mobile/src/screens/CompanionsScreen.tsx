import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  Modal,
} from 'react-native';
import { colors } from '../theme';
import type { Partner, User } from '../types';

interface CompanionsScreenProps {
  user: User | null;
  partners: Partner[];
  onOpenBookingModal: (partner: Partner) => void;
  onRefresh: () => void;
}

const CITIES = ['All Cities', 'Delhi NCR', 'Mumbai', 'Bengaluru', 'Pune', 'Hyderabad'];
const GENDERS = ['All', 'Female', 'Male'];

export function CompanionsScreen({
  user,
  partners,
  onOpenBookingModal,
  onRefresh,
}: CompanionsScreenProps) {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedGender, setSelectedGender] = useState('All');
  const [detailPartner, setDetailPartner] = useState<Partner | null>(null);

  const filteredPartners = useMemo(() => {
    return partners.filter((p) => {
      if (selectedCity !== 'All Cities' && p.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }
      if (selectedGender !== 'All' && p.gender && p.gender.toLowerCase() !== selectedGender.toLowerCase()) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCity = p.city.toLowerCase().includes(q);
        const matchesBio = (p.bio || '').toLowerCase().includes(q);
        const matchesTag = (p.tagline || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesBio && !matchesTag) {
          return false;
        }
      }
      return true;
    });
  }, [partners, search, selectedCity, selectedGender]);

  return (
    <View style={styles.container}>
      {/* ── Search Bar ── */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search by companion name, city, bio…"
            placeholderTextColor={colors.muted}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          {Boolean(search) && (
            <Pressable onPress={() => setSearch('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* City Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {CITIES.map((city) => (
            <Pressable
              key={city}
              onPress={() => setSelectedCity(city)}
              style={[
                styles.chip,
                selectedCity === city && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCity === city && styles.chipTextActive,
                ]}
              >
                {city}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* ── Partners List ── */}
      <ScrollView contentContainerStyle={styles.listContent}>
        <View style={styles.resultsBar}>
          <Text style={styles.resultsCount}>
            {filteredPartners.length} {filteredPartners.length === 1 ? 'companion' : 'companions'} available
          </Text>
          <Pressable onPress={onRefresh}>
            <Text style={styles.refreshText}>🔄 Refresh</Text>
          </Pressable>
        </View>

        {filteredPartners.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>No companions found</Text>
            <Text style={styles.emptySub}>
              Try adjusting your city filter or search query.
            </Text>
          </View>
        ) : (
          filteredPartners.map((partner) => (
            <View key={partner.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.avatarWrapper}>
                  {partner.avatar && partner.avatar.startsWith('http') ? (
                    <Image source={{ uri: partner.avatar }} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatarFallback}>
                      <Text style={styles.avatarInitial}>{partner.name.charAt(0)}</Text>
                    </View>
                  )}
                  <View
                    style={[
                      styles.onlineBadge,
                      partner.isOnline ? styles.badgeOnline : styles.badgeOffline,
                    ]}
                  />
                </View>

                <View style={styles.metaCol}>
                  <View style={styles.nameRow}>
                    <Text style={styles.partnerName}>{partner.name}</Text>
                    {partner.kycStatus === 'verified' && (
                      <View style={styles.verifiedTag}>
                        <Text style={styles.verifiedTagText}>✓ Verified</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.cityText}>
                    📍 {partner.city} {partner.age ? `• ${partner.age} yrs` : ''}
                  </Text>

                  {Boolean(partner.tagline) && (
                    <Text style={styles.taglineText} numberOfLines={1}>
                      “{partner.tagline}”
                    </Text>
                  )}
                </View>
              </View>

              {Boolean(partner.bio) && (
                <Text style={styles.bioText} numberOfLines={2}>
                  {partner.bio}
                </Text>
              )}

              {/* Card Footer: Rate & Action Buttons */}
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.rateLabel}>Hourly Rate</Text>
                  <Text style={styles.rateValue}>
                    ₹{partner.hourlyRate.toLocaleString('en-IN')}{' '}
                    <Text style={styles.rateUnit}>/ hr</Text>
                  </Text>
                </View>

                <View style={styles.btnRow}>
                  <Pressable
                    style={styles.detailBtn}
                    onPress={() => setDetailPartner(partner)}
                  >
                    <Text style={styles.detailBtnText}>View Bio</Text>
                  </Pressable>

                  <Pressable
                    style={styles.bookBtn}
                    onPress={() => onOpenBookingModal(partner)}
                  >
                    <Text style={styles.bookBtnText}>Book Now</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* ── Companion Detail Sheet Modal ── */}
      <Modal
        visible={Boolean(detailPartner)}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailPartner(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Companion Profile</Text>
              <Pressable onPress={() => setDetailPartner(null)}>
                <Text style={styles.modalClose}>✕</Text>
              </Pressable>
            </View>

            {detailPartner && (
              <ScrollView contentContainerStyle={styles.modalBody}>
                <View style={styles.modalAvatarRow}>
                  {detailPartner.avatar && detailPartner.avatar.startsWith('http') ? (
                    <Image source={{ uri: detailPartner.avatar }} style={styles.largeAvatar} />
                  ) : (
                    <View style={styles.largeAvatarFallback}>
                      <Text style={styles.largeAvatarText}>{detailPartner.name.charAt(0)}</Text>
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalName}>{detailPartner.name}</Text>
                    <Text style={styles.modalCity}>
                      📍 {detailPartner.city} {detailPartner.age ? `• ${detailPartner.age} yrs` : ''}
                    </Text>
                    <View style={styles.modalStatusRow}>
                      <View style={styles.badgePill}>
                        <Text style={styles.badgePillText}>
                          {detailPartner.isOnline ? '🟢 Available Online' : '⚪ Offline'}
                        </Text>
                      </View>
                      <View style={styles.badgePill}>
                        <Text style={styles.badgePillText}>🛡️ KYC Verified</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.sectionLabel}>About Me</Text>
                  <Text style={styles.modalBio}>
                    {detailPartner.bio || 'Compassionate and friendly companion ready for meaningful, respectful conversations and events.'}
                  </Text>
                </View>

                {detailPartner.tagline && (
                  <View style={styles.modalSection}>
                    <Text style={styles.sectionLabel}>Personal Motto</Text>
                    <Text style={styles.modalTagline}>"{detailPartner.tagline}"</Text>
                  </View>
                )}

                <View style={styles.modalSection}>
                  <Text style={styles.sectionLabel}>Pricing</Text>
                  <Text style={styles.modalPrice}>
                    ₹{detailPartner.hourlyRate.toLocaleString('en-IN')} / hour
                  </Text>
                  <Text style={styles.modalPriceNote}>
                    Transparent billing with 15% concierge platform fee and 18% GST.
                  </Text>
                </View>

                <View style={styles.platonicBox}>
                  <Text style={styles.platonicBoxTitle}>🤝 100% Platonic Policy</Text>
                  <Text style={styles.platonicBoxText}>
                    All companion sessions are purely social and non-romantic. Meetings are verified with a 4-digit start OTP.
                  </Text>
                </View>

                <Pressable
                  style={styles.modalBookBtn}
                  onPress={() => {
                    const p = detailPartner;
                    setDetailPartner(null);
                    onOpenBookingModal(p);
                  }}
                >
                  <Text style={styles.modalBookBtnText}>Proceed to Book Session</Text>
                </Pressable>
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
  searchSection: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.ink,
    padding: 0,
  },
  clearSearch: {
    fontSize: 14,
    color: colors.muted,
    paddingHorizontal: 6,
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.background,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.muted,
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
  },
  refreshText: {
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
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.white,
  },
  badgeOnline: {
    backgroundColor: colors.success,
  },
  badgeOffline: {
    backgroundColor: colors.mutedLight,
  },
  metaCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  verifiedTag: {
    backgroundColor: colors.successLight,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  verifiedTagText: {
    color: colors.successDark,
    fontSize: 9,
    fontWeight: '800',
  },
  cityText: {
    fontSize: 11,
    color: colors.muted,
    marginBottom: 3,
  },
  taglineText: {
    fontSize: 11,
    color: colors.inkLight,
    fontStyle: 'italic',
  },
  bioText: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rateLabel: {
    fontSize: 10,
    color: colors.muted,
  },
  rateValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  rateUnit: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: '500',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  detailBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderDark,
    backgroundColor: colors.background,
  },
  detailBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.inkLight,
  },
  bookBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  bookBtnText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  modalClose: {
    fontSize: 18,
    color: colors.muted,
    padding: 4,
  },
  modalBody: {
    padding: 20,
    paddingBottom: 30,
  },
  modalAvatarRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    marginBottom: 18,
  },
  largeAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  largeAvatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeAvatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  modalName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 2,
  },
  modalCity: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 6,
  },
  modalStatusRow: {
    flexDirection: 'row',
    gap: 6,
  },
  badgePill: {
    backgroundColor: colors.background,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.inkLight,
  },
  modalSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  modalBio: {
    fontSize: 13,
    color: colors.inkLight,
    lineHeight: 19,
  },
  modalTagline: {
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.muted,
  },
  modalPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.ink,
  },
  modalPriceNote: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },
  platonicBox: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#EFE2CC',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  platonicBoxTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 4,
  },
  platonicBoxText: {
    fontSize: 11,
    color: colors.muted,
    lineHeight: 16,
  },
  modalBookBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalBookBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
});
