import React, { useState, useCallback } from "react";
import {
  View, Text, ScrollView, StyleSheet, Pressable,
  ActivityIndicator, RefreshControl,
} from "react-native";
import type { User } from "../types";

interface Props {
  user: User;
  onLogout: () => void;
}

const P = "#7c3aed";
const PINK = "#ec4899";
const V = "#a78bfa";

const PARTNER_TABS = [
  { key: "dashboard", label: "Dashboard", icon: "📊" },
  { key: "bookings",  label: "My Bookings", icon: "📅" },
  { key: "earnings",  label: "Earnings", icon: "💰" },
  { key: "profile",   label: "Profile", icon: "👤" },
];

export function PartnerDashboardScreen({ user, onLogout }: Props) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.headerGreet}>Partner Portal</Text>
          <Text style={s.headerName}>Welcome, {user.name.split(" ")[0]}! 👋</Text>
        </View>
        <View style={s.headerRight}>
          <View style={s.kycBadge}>
            <Text style={s.kycText}>{user.kycStatus === "verified" ? "✅ KYC" : "⏳ Pending KYC"}</Text>
          </View>
        </View>
      </View>

      {/* Tab bar */}
      <View style={s.tabBar}>
        {PARTNER_TABS.map(t => (
          <Pressable key={t.key} style={[s.tabItem, activeTab === t.key && s.tabItemOn]}
            onPress={() => setActiveTab(t.key)}>
            <Text style={s.tabIcon}>{t.icon}</Text>
            <Text style={[s.tabLabel, activeTab === t.key && s.tabLabelOn]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={s.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={P} />}>

        {activeTab === "dashboard" && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Your Stats</Text>
            <View style={s.statsGrid}>
              {[
                { label: "Completed", value: "0", icon: "✅", color: "#10b981" },
                { label: "Upcoming",  value: "0", icon: "📅", color: P },
                { label: "Rating",    value: user.role === "partner" ? "5.0★" : "—", icon: "⭐", color: "#f59e0b" },
                { label: "Earnings",  value: "₹0", icon: "💰", color: "#06b6d4" },
              ].map((stat, i) => (
                <View key={i} style={[s.statCard, { borderTopColor: stat.color }]}>
                  <Text style={s.statIcon}>{stat.icon}</Text>
                  <Text style={[s.statValue, { color: stat.color }]}>{stat.value}</Text>
                  <Text style={s.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            <View style={s.infoCard}>
              <Text style={s.infoTitle}>🛡️ Platonic Code of Conduct</Text>
              <Text style={s.infoText}>
                All sessions must be strictly platonic. Maintain professional boundaries at all times.
                Violations result in immediate account suspension.
              </Text>
            </View>

            <View style={s.infoCard}>
              <Text style={s.infoTitle}>📋 Getting Started</Text>
              {[
                "Complete KYC verification to go live",
                "Set your availability & hourly rate",
                "Add your services & cities you serve",
                "Maintain a 4.5+ rating for top placement",
              ].map((step, i) => (
                <View key={i} style={s.stepRow}>
                  <Text style={s.stepNum}>{i + 1}</Text>
                  <Text style={s.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "bookings" && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>My Bookings</Text>
            <View style={s.emptyBox}>
              <Text style={s.emptyIcon}>📅</Text>
              <Text style={s.emptyTitle}>No Bookings Yet</Text>
              <Text style={s.emptyText}>
                Complete your KYC and set your availability to start receiving booking requests.
              </Text>
            </View>
          </View>
        )}

        {activeTab === "earnings" && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Earnings Overview</Text>
            <View style={s.earningsCard}>
              <Text style={s.earningsLabel}>Total Earned</Text>
              <Text style={s.earningsValue}>₹0</Text>
              <Text style={s.earningsSub}>No completed sessions yet</Text>
            </View>
            <View style={s.infoCard}>
              <Text style={s.infoTitle}>💡 How Earnings Work</Text>
              <Text style={s.infoText}>
                You keep 80% of the booking amount. PartnerOnRent retains 20% as the platform fee.
                Payouts are processed weekly to your registered bank account.
              </Text>
            </View>
          </View>
        )}

        {activeTab === "profile" && (
          <View style={s.section}>
            <View style={s.profileCard}>
              <View style={s.avatar}>
                <Text style={s.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
              </View>
              <Text style={s.profileName}>{user.name}</Text>
              <Text style={s.profileEmail}>{user.email}</Text>
              <View style={s.roleBadge}>
                <Text style={s.roleBadgeText}>PARTNER</Text>
              </View>
            </View>

            {[
              { label: "📞 Phone",  value: user.phone || "Not set" },
              { label: "🏙️ City",   value: user.city || "Not set" },
              { label: "💰 Wallet", value: "₹" + (user.walletBalance ?? 0) },
              { label: "🆔 KYC",   value: user.kycStatus || "not_submitted" },
            ].map((row, i) => (
              <View key={i} style={s.profileRow}>
                <Text style={s.profileRowLabel}>{row.label}</Text>
                <Text style={s.profileRowValue}>{row.value}</Text>
              </View>
            ))}

            <Pressable style={s.logoutBtn} onPress={onLogout}>
              <Text style={s.logoutText}>Sign Out</Text>
            </Pressable>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:            { flex: 1, backgroundColor: "#0f172a" },
  header:          { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14, backgroundColor: "#0f172a", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.07)" },
  headerGreet:     { fontSize: 10, fontWeight: "700", letterSpacing: 1.5, color: V, marginBottom: 2 },
  headerName:      { fontSize: 18, fontWeight: "900", color: "#f8fafc" },
  headerRight:     { alignItems: "flex-end" },
  kycBadge:        { backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  kycText:         { fontSize: 11, color: "#94a3b8", fontWeight: "700" },
  tabBar:          { flexDirection: "row", backgroundColor: "#111827", borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)" },
  tabItem:         { flex: 1, alignItems: "center", paddingVertical: 10 },
  tabItemOn:       { borderBottomWidth: 2, borderBottomColor: P },
  tabIcon:         { fontSize: 16, marginBottom: 2 },
  tabLabel:        { fontSize: 9, fontWeight: "700", color: "#475569", letterSpacing: 0.3 },
  tabLabelOn:      { color: V },
  content:         { flex: 1 },
  section:         { padding: 20 },
  sectionTitle:    { fontSize: 16, fontWeight: "900", color: "#f8fafc", marginBottom: 16 },
  statsGrid:       { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 },
  statCard:        { flex: 1, minWidth: "44%", backgroundColor: "#1e293b", borderRadius: 14, padding: 16, borderTopWidth: 3, alignItems: "center" },
  statIcon:        { fontSize: 20, marginBottom: 6 },
  statValue:       { fontSize: 22, fontWeight: "900", marginBottom: 2 },
  statLabel:       { fontSize: 11, color: "#64748b", fontWeight: "700" },
  infoCard:        { backgroundColor: "#1e293b", borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  infoTitle:       { fontSize: 13, fontWeight: "800", color: "#f8fafc", marginBottom: 8 },
  infoText:        { fontSize: 12, color: "#64748b", lineHeight: 18 },
  stepRow:         { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 8 },
  stepNum:         { width: 20, height: 20, borderRadius: 10, backgroundColor: P, color: "#fff", fontSize: 11, fontWeight: "800", textAlign: "center", lineHeight: 20 },
  stepText:        { fontSize: 12, color: "#94a3b8", flex: 1, lineHeight: 17 },
  emptyBox:        { backgroundColor: "#1e293b", borderRadius: 20, padding: 36, alignItems: "center" },
  emptyIcon:       { fontSize: 40, marginBottom: 12 },
  emptyTitle:      { fontSize: 16, fontWeight: "800", color: "#f8fafc", marginBottom: 6 },
  emptyText:       { fontSize: 12, color: "#64748b", textAlign: "center", lineHeight: 18 },
  earningsCard:    { backgroundColor: "#1e293b", borderRadius: 20, padding: 28, alignItems: "center", marginBottom: 16, borderWidth: 1, borderColor: "rgba(124,58,237,0.2)" },
  earningsLabel:   { fontSize: 12, color: "#64748b", fontWeight: "700", marginBottom: 6 },
  earningsValue:   { fontSize: 40, fontWeight: "900", color: "#f8fafc", marginBottom: 4 },
  earningsSub:     { fontSize: 12, color: "#475569" },
  profileCard:     { backgroundColor: "#1e293b", borderRadius: 20, padding: 24, alignItems: "center", marginBottom: 16 },
  avatar:          { width: 72, height: 72, borderRadius: 36, backgroundColor: P, alignItems: "center", justifyContent: "center", marginBottom: 12, shadowColor: P, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 },
  avatarText:      { fontSize: 32, fontWeight: "900", color: "#fff" },
  profileName:     { fontSize: 20, fontWeight: "900", color: "#f8fafc", marginBottom: 4 },
  profileEmail:    { fontSize: 13, color: "#64748b", marginBottom: 10 },
  roleBadge:       { backgroundColor: "rgba(124,58,237,0.2)", borderWidth: 1, borderColor: "rgba(124,58,237,0.3)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4 },
  roleBadgeText:   { fontSize: 10, fontWeight: "800", color: V, letterSpacing: 1.5 },
  profileRow:      { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1e293b", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13, marginBottom: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  profileRowLabel: { fontSize: 13, color: "#64748b", fontWeight: "700" },
  profileRowValue: { fontSize: 13, color: "#f8fafc", fontWeight: "600" },
  logoutBtn:       { backgroundColor: "rgba(239,68,68,0.15)", borderWidth: 1, borderColor: "rgba(239,68,68,0.3)", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 8 },
  logoutText:      { fontSize: 14, fontWeight: "800", color: "#f87171" },
});
