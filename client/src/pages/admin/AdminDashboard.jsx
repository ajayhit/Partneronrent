import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import './admin.css';

// Admin API
import {
  fetchAdminStats,
  fetchAdminCustomers,
  updateCustomerStatusAdmin,
  addCustomerNoteAdmin,
  fetchAdminPartners,
  updatePartnerStatusAdmin,
  updatePartnerKYCAdmin,
  addPartnerNoteAdmin,
  fetchAdminBookings,
  updateBookingStatusAdmin,
  refundBookingAdmin,
  fetchAdminLocations,
  addCityAdmin,
  toggleCityActiveAdmin,
  fetchAdminServices,
  createServiceAdmin,
  updateServiceAdmin,
  fetchAdminCommissions,
  updateCommissionsAdmin,
  fetchAdminCancellationPolicy,
  updateCancellationPolicyAdmin,
  fetchAdminTransactions,
  fetchPayouts,
  updatePayoutStatus,
  fetchAdminReviews,
  moderateReviewAdmin,
  fetchAdminComplaints,
  resolveComplaintAdmin,
  fetchAdminSafetyIncidents,
  fetchAdminSOSAlerts,
  resolveAdminSOSAlert,
  fetchAdminCoupons,
  createCouponAdmin,
  toggleCouponStatusAdmin,
  fetchAdminNotifications,
  sendBroadcastAdmin,
  fetchAdminCMS,
  updateCMSPageAdmin,
  fetchAdminStaffUsers,
  createAdminStaffUser,
  fetchAdminAuditLogs,
  updatePlatformSettings
} from '../../utils/api';

// Components & Tabs
import AdminSidebar from './AdminSidebar';
import DashboardTab from './tabs/DashboardTab';
import CustomersTab from './tabs/CustomersTab';
import PartnersTab from './tabs/PartnersTab';
import KycTab from './tabs/KycTab';
import BookingsTab from './tabs/BookingsTab';
import CalendarTab from './tabs/CalendarTab';
import LocationsTab from './tabs/LocationsTab';
import ServicesTab from './tabs/ServicesTab';
import PaymentsTab from './tabs/PaymentsTab';
import PayoutsTab from './tabs/PayoutsTab';
import CommissionsTab from './tabs/CommissionsTab';
import ReviewsTab from './tabs/ReviewsTab';
import ComplaintsTab from './tabs/ComplaintsTab';
import SafetyTab from './tabs/SafetyTab';
import CancellationTab from './tabs/CancellationTab';
import CouponsTab from './tabs/CouponsTab';
import NotificationsTab from './tabs/NotificationsTab';
import CmsTab from './tabs/CmsTab';
import ReportsTab from './tabs/ReportsTab';
import AdminUsersTab from './tabs/AdminUsersTab';
import RolesTab from './tabs/RolesTab';
import AuditLogsTab from './tabs/AuditLogsTab';
import SettingsTab from './tabs/SettingsTab';

// Modals
import CustomerProfileModal from './modals/CustomerProfileModal';
import PartnerProfileModal from './modals/PartnerProfileModal';
import BookingDetailModal from './modals/BookingDetailModal';
import DisputeDetailModal from './modals/DisputeDetailModal';

// Icons
import {
  RefreshCw,
  Search,
  Bell,
  ShieldAlert,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Plus
} from 'lucide-react';

export default function AdminDashboard() {
  const { showToast, adminActiveTab, setAdminActiveTab, settings, setSettings } = useApp();
  const { session } = useAuth();

  // Navigation state
  const activeTab = adminActiveTab || 'dashboard';
  const [subFilter, setSubFilter] = useState('all');

  // Core Data
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [locations, setLocations] = useState([]);
  const [services, setServices] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [safetyIncidents, setSafetyIncidents] = useState([]);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [commissionRules, setCommissionRules] = useState({});
  const [cancellationPolicy, setCancellationPolicy] = useState({});
  const [coupons, setCoupons] = useState([]);
  const [notifications, setNotifications] = useState({ broadcasts: [], templates: [] });
  const [cms, setCms] = useState({ pages: [], banners: [] });
  const [adminUsers, setAdminUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Active Modals & Drawers
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDispute, setSelectedDispute] = useState(null);

  // Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [
        st, custs, pts, bks, locs, svcs, pays, txns, revs, cmps, safes, alerts, comms, cpol, cpns, notifs, cmsData, admStaff, logs
      ] = await Promise.all([
        fetchAdminStats().catch(() => null),
        fetchAdminCustomers().catch(() => []),
        fetchAdminPartners().catch(() => []),
        fetchAdminBookings().catch(() => []),
        fetchAdminLocations().catch(() => []),
        fetchAdminServices().catch(() => []),
        fetchPayouts().catch(() => []),
        fetchAdminTransactions().catch(() => []),
        fetchAdminReviews().catch(() => []),
        fetchAdminComplaints().catch(() => []),
        fetchAdminSafetyIncidents().catch(() => []),
        fetchAdminSOSAlerts().catch(() => []),
        fetchAdminCommissions().catch(() => ({})),
        fetchAdminCancellationPolicy().catch(() => ({})),
        fetchAdminCoupons().catch(() => []),
        fetchAdminNotifications().catch(() => ({ broadcasts: [], templates: [] })),
        fetchAdminCMS().catch(() => ({ pages: [], banners: [] })),
        fetchAdminStaffUsers().catch(() => []),
        fetchAdminAuditLogs().catch(() => [])
      ]);

      if (st) setStats(st);
      if (custs) setCustomers(custs);
      if (pts) setPartners(pts);
      if (bks) setBookings(bks);
      if (locs) setLocations(locs);
      if (svcs) setServices(svcs);
      if (pays) setPayouts(pays);
      if (txns) setTransactions(txns);
      if (revs) setReviews(revs);
      if (cmps) setComplaints(cmps);
      if (safes) setSafetyIncidents(safes);
      if (alerts) setSosAlerts(alerts);
      if (comms) setCommissionRules(comms);
      if (cpol) setCancellationPolicy(cpol);
      if (cpns) setCoupons(cpns);
      if (notifs) setNotifications(notifs);
      if (cmsData) setCms(cmsData);
      if (admStaff) setAdminUsers(admStaff);
      if (logs) setAuditLogs(logs);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Action Handlers ────────────────────────────────────────────────────────
  const handleUpdateCustomerStatus = async (id, status, reason) => {
    try {
      await updateCustomerStatusAdmin(id, status, reason, session?.name || 'Super Admin');
      showToast(`Customer status marked ${status}`);
      loadAllData();
      if (selectedCustomer && selectedCustomer.id === id) {
        setSelectedCustomer(prev => ({ ...prev, status }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCustomerNote = async (id, note) => {
    try {
      await addCustomerNoteAdmin(id, note);
      showToast('Admin note added to customer dossier');
      loadAllData();
      if (selectedCustomer && selectedCustomer.id === id) {
        setSelectedCustomer(prev => ({
          ...prev,
          adminNotes: [note, ...(prev.adminNotes || [])]
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePartnerStatus = async (id, status, reason) => {
    try {
      await updatePartnerStatusAdmin(id, status, reason, session?.name || 'Super Admin');
      showToast(`Partner status updated to ${status}`);
      loadAllData();
      if (selectedPartner && selectedPartner.id === id) {
        setSelectedPartner(prev => ({ ...prev, status }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateKYC = async (id, status, notes) => {
    try {
      await updatePartnerKYCAdmin(id, status, notes, session?.name || 'Super Admin');
      showToast(`Partner KYC marked ${status}`);
      loadAllData();
      if (selectedPartner && selectedPartner.id === id) {
        setSelectedPartner(prev => ({ ...prev, kycStatus: status }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPartnerNote = async (id, note) => {
    try {
      await addPartnerNoteAdmin(id, note);
      showToast('Admin note added to partner dossier');
      loadAllData();
      if (selectedPartner && selectedPartner.id === id) {
        setSelectedPartner(prev => ({
          ...prev,
          adminNotes: [note, ...(prev.adminNotes || [])]
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateBookingStatus = async (id, status, reason) => {
    try {
      await updateBookingStatusAdmin(id, status, reason, session?.name || 'Super Admin');
      showToast(`Booking ${id} marked ${status}`);
      loadAllData();
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(prev => ({ ...prev, status }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefundBooking = async (id, amount, reason) => {
    try {
      await refundBookingAdmin(id, amount, reason, session?.name || 'Super Admin');
      showToast(`Refund of ₹${amount} processed to customer wallet`);
      loadAllData();
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking(prev => ({ ...prev, status: 'cancelled', refundAmount: amount }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCity = async (stateName, cityName, areas) => {
    try {
      await addCityAdmin(stateName, cityName, areas, session?.name || 'Super Admin');
      showToast(`City ${cityName} added successfully!`);
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleCity = async (cityName) => {
    try {
      await toggleCityActiveAdmin(cityName);
      showToast(`City status updated`);
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddService = async (serviceData) => {
    try {
      await createServiceAdmin(serviceData, session?.name || 'Super Admin');
      showToast('Companion service added to catalog!');
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateService = async (id, serviceData) => {
    try {
      await updateServiceAdmin(id, serviceData, session?.name || 'Super Admin');
      showToast('Service config updated');
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprovePayout = async (payoutId, ref) => {
    try {
      await updatePayoutStatus(payoutId, 'completed', ref);
      showToast(`Payout ${payoutId} settled successfully!`);
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCommissions = async (rules, reason) => {
    try {
      await updateCommissionsAdmin(rules, session?.name || 'Super Admin', reason);
      showToast('Platform commission matrix saved live!');
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCancellationPolicy = async (policy) => {
    try {
      await updateCancellationPolicyAdmin(policy, session?.name || 'Super Admin');
      showToast('Cancellation policy rules saved live!');
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleModerateReview = async (id, status) => {
    try {
      await moderateReviewAdmin(id, status, 'Moderated from console', session?.name || 'Super Admin');
      showToast(`Review marked ${status}`);
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveDispute = async (id, data) => {
    try {
      await resolveComplaintAdmin(id, data, session?.name || 'Super Admin');
      showToast('Dispute record updated');
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveSOS = async (alertId) => {
    const notes = prompt('Enter emergency dispatch resolution notes:', 'Confirmed user safe, dispended safely.');
    if (!notes) return;
    try {
      await resolveAdminSOSAlert(alertId, notes);
      showToast('Emergency SOS alert resolved safe!');
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCoupon = async (couponData) => {
    try {
      await createCouponAdmin(couponData, session?.name || 'Super Admin');
      showToast(`Coupon ${couponData.code} published!`);
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleCoupon = async (id) => {
    try {
      await toggleCouponStatusAdmin(id);
      showToast('Coupon status updated');
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendBroadcast = async (data) => {
    try {
      await sendBroadcastAdmin(data, session?.name || 'Super Admin');
      showToast('Broadcast dispatched successfully!');
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCMSPage = async (slug, pageData) => {
    try {
      await updateCMSPageAdmin(slug, pageData, session?.name || 'Super Admin');
      showToast(`Page /${slug} published live!`);
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAdminUser = async (userData) => {
    try {
      await createAdminStaffUser(userData, session?.name || 'Super Admin');
      showToast(`Admin staff invited!`);
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePlatformSettings = async (settingsData) => {
    try {
      await updatePlatformSettings(settingsData);
      setSettings(settingsData);
      showToast('Platform settings updated successfully!');
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Helper for quick nav jumps from cards
  const navigateTo = (tab, sub = 'all') => {
    setAdminActiveTab(tab);
    setSubFilter(sub);
  };

  return (
    <div className="admin-layout">
      {/* ── Left Sidebar Navigation (All 22 Modules) ──────────────────── */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setAdminActiveTab}
        subFilter={subFilter}
        setSubFilter={setSubFilter}
        stats={stats}
      />

      {/* ── Main View Area ───────────────────────────────────────────── */}
      <main className="admin-main">
        {/* Top Bar with Breadcrumb and Controls */}
        <div className="admin-topbar">
          <div className="admin-title-area">
            <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Operations Console</span>
              <ChevronRight size={12} color="#64748b" />
              <span style={{ color: '#fff' }}>{activeTab.replace('-', ' ').toUpperCase()}</span>
              {subFilter && subFilter !== 'all' && (
                <>
                  <ChevronRight size={12} color="#64748b" />
                  <span style={{ color: '#94a3b8' }}>{subFilter.replace('_', ' ').toUpperCase()}</span>
                </>
              )}
            </div>
            <h1>
              {activeTab === 'dashboard' && 'Executive Operations Dashboard'}
              {activeTab === 'customers' && 'Customer Management & Dossiers'}
              {activeTab === 'partners' && 'Companion Fleet Administration'}
              {activeTab === 'kyc' && 'Partner Verification & KYC Desk'}
              {activeTab === 'bookings' && 'Booking Lifecycles & Oversight'}
              {activeTab === 'calendar' && 'Operational Calendar & Shift Schedule'}
              {activeTab === 'locations' && 'City & Geographic Territory Management'}
              {activeTab === 'services' && 'Companion Services & Pricing Catalog'}
              {activeTab === 'payments' && 'Financial Transactions & Gateway Audit'}
              {activeTab === 'payouts' && 'Partner Payouts & Disbursal Queue'}
              {activeTab === 'commissions' && 'Commission Matrix & Fee Architecture'}
              {activeTab === 'reviews' && 'Reviews & Reputation Moderation'}
              {activeTab === 'complaints' && 'Customer & Companion Dispute Resolution'}
              {activeTab === 'safety' && 'Safety Center & Emergency SOS Dispatch'}
              {activeTab === 'cancellation' && 'Cancellation Rules & Refund Parameters'}
              {activeTab === 'coupons' && 'Promotions, Coupons & Campaign Vouchers'}
              {activeTab === 'notifications' && 'Broadcast Notifications & Alerts'}
              {activeTab === 'cms' && 'Content Management (CMS) & Policies'}
              {activeTab === 'reports' && 'Business Analytics & Fleet Intelligence'}
              {activeTab === 'admin-users' && 'Administrative Team & Operators'}
              {activeTab === 'roles' && 'Role-Based Access Control (RBAC)'}
              {activeTab === 'audit-logs' && 'Forensic Governance Audit Trail'}
              {activeTab === 'settings' && 'Platform Governance & Security Settings'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={loadAllData}
              disabled={loading}
              className="btn-admin-action btn-admin-secondary"
              title="Refresh console data"
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '10px',
              padding: '6px 14px'
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8' }}>
                {session?.name || 'Super Admin'}
              </span>
            </div>
          </div>
        </div>

        {/* ── Active Module Tab Rendering ──────────────────────────────── */}
        {activeTab === 'dashboard' && (
          <DashboardTab stats={stats} onNavigate={navigateTo} />
        )}

        {activeTab === 'customers' && (
          <CustomersTab
            customers={customers}
            subFilter={subFilter}
            setSubFilter={setSubFilter}
            onSelectCustomer={setSelectedCustomer}
            onUpdateCustomerStatus={handleUpdateCustomerStatus}
          />
        )}

        {activeTab === 'partners' && (
          <PartnersTab
            partners={partners}
            subFilter={subFilter}
            setSubFilter={setSubFilter}
            onSelectPartner={setSelectedPartner}
            onUpdatePartnerStatus={handleUpdatePartnerStatus}
            onUpdateKYC={handleUpdateKYC}
          />
        )}

        {activeTab === 'kyc' && (
          <KycTab
            partners={partners}
            subFilter={subFilter}
            setSubFilter={setSubFilter}
            onSelectPartner={setSelectedPartner}
            onUpdateKYC={handleUpdateKYC}
          />
        )}

        {activeTab === 'bookings' && (
          <BookingsTab
            bookings={bookings}
            subFilter={subFilter}
            setSubFilter={setSubFilter}
            onSelectBooking={setSelectedBooking}
            onUpdateStatus={handleUpdateBookingStatus}
            onRefund={handleRefundBooking}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarTab
            bookings={bookings}
            partners={partners}
            onSelectBooking={setSelectedBooking}
          />
        )}

        {activeTab === 'locations' && (
          <LocationsTab
            locations={locations}
            onAddCity={handleAddCity}
            onToggleCity={handleToggleCity}
          />
        )}

        {activeTab === 'services' && (
          <ServicesTab
            services={services}
            onAddService={handleAddService}
            onUpdateService={handleUpdateService}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentsTab
            transactions={transactions}
            subFilter={subFilter}
            setSubFilter={setSubFilter}
          />
        )}

        {activeTab === 'payouts' && (
          <PayoutsTab
            payouts={payouts}
            partners={partners}
            subFilter={subFilter}
            setSubFilter={setSubFilter}
            onApprovePayout={handleApprovePayout}
          />
        )}

        {activeTab === 'commissions' && (
          <CommissionsTab
            commissionRules={commissionRules}
            onSaveCommissions={handleSaveCommissions}
          />
        )}

        {activeTab === 'reviews' && (
          <ReviewsTab
            reviews={reviews}
            onModerateReview={handleModerateReview}
          />
        )}

        {activeTab === 'complaints' && (
          <ComplaintsTab
            complaints={complaints}
            subFilter={subFilter}
            setSubFilter={setSubFilter}
            onSelectDispute={setSelectedDispute}
          />
        )}

        {activeTab === 'safety' && (
          <SafetyTab
            sosAlerts={sosAlerts}
            safetyIncidents={safetyIncidents}
            subFilter={subFilter}
            setSubFilter={setSubFilter}
            onResolveSOS={handleResolveSOS}
            onSelectIncident={setSelectedDispute}
          />
        )}

        {activeTab === 'cancellation' && (
          <CancellationTab
            cancellationPolicy={cancellationPolicy}
            onSavePolicy={handleSaveCancellationPolicy}
          />
        )}

        {activeTab === 'coupons' && (
          <CouponsTab
            coupons={coupons}
            onCreateCoupon={handleCreateCoupon}
            onToggleStatus={handleToggleCoupon}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationsTab
            notifications={notifications}
            onSendBroadcast={handleSendBroadcast}
          />
        )}

        {activeTab === 'cms' && (
          <CmsTab
            cms={cms}
            onUpdatePage={handleUpdateCMSPage}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsTab
            stats={stats}
            partners={partners}
            bookings={bookings}
          />
        )}

        {activeTab === 'admin-users' && (
          <AdminUsersTab
            adminUsers={adminUsers}
            onCreateAdminUser={handleCreateAdminUser}
          />
        )}

        {activeTab === 'roles' && (
          <RolesTab />
        )}

        {activeTab === 'audit-logs' && (
          <AuditLogsTab
            auditLogs={auditLogs}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            settings={settings}
            onSaveSettings={handleSavePlatformSettings}
          />
        )}
      </main>

      {/* ── Global Modals & Intelligence Dossiers ─────────────────────── */}
      {selectedCustomer && (
        <CustomerProfileModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onUpdateStatus={handleUpdateCustomerStatus}
          onAddNote={handleAddCustomerNote}
          bookings={bookings}
          transactions={transactions}
        />
      )}

      {selectedPartner && (
        <PartnerProfileModal
          partner={selectedPartner}
          onClose={() => setSelectedPartner(null)}
          onUpdateStatus={handleUpdatePartnerStatus}
          onUpdateKYC={handleUpdateKYC}
          onAddNote={handleAddPartnerNote}
          bookings={bookings}
          reviews={reviews}
        />
      )}

      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdateStatus={handleUpdateBookingStatus}
          onRefund={handleRefundBooking}
        />
      )}

      {selectedDispute && (
        <DisputeDetailModal
          dispute={selectedDispute}
          onClose={() => setSelectedDispute(null)}
          onResolve={handleResolveDispute}
        />
      )}
    </div>
  );
}
