import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  fetchAdminStats, 
  fetchPartners, 
  fetchBookings, 
  fetchPayouts, 
  fetchAdminSOSAlerts,
  updatePartnerKYCAdmin,
  updatePayoutStatus,
  resolveAdminSOSAlert,
} from '../../utils/api';
import { formatCurrency, formatDateTime, getStatusBadge } from '../../utils/helpers';
import SafetyBanner from '../../components/SafetyBanner';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Wallet, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Sliders, 
  TrendingUp,
  Lock,
  Key,
  Eye,
  EyeOff,
  User,
  MapPin,
  Star,
  Activity,
  DollarSign,
  BarChart2,
  Settings,
  RefreshCw,
  Phone,
  Mail
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { showToast, adminActiveTab, setAdminActiveTab } = useApp();
  const [stats, setStats] = useState(null);
  
  const [partners, setPartners] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { session, updateAdminPassword } = useAuth();
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState({ current: false, next: false });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState({ text: '', type: '' });

  // Settings edit state
  const { settings, setSettings } = useApp();
  const [settingsForm, setSettingsForm] = useState(null);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Settlement ref inputs
  const [txnRefs, setTxnRefs] = useState({});

  // Partner / user search
  const [partnerSearch, setPartnerSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    loadAllAdminData();
  }, []);

  // Sync settings form from context
  useEffect(() => {
    if (settings && !settingsForm) {
      setSettingsForm({ ...settings });
    }
  }, [settings]);

  // Sync active tab from Navbar via context
  const activeTab = adminActiveTab || 'overview';

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [st, pts, bks, pays, alerts] = await Promise.all([
        fetchAdminStats(),
        fetchPartners(),
        fetchBookings(),
        fetchPayouts(),
        fetchAdminSOSAlerts()
      ]);
      setStats(st);
      setPartners(pts);
      setBookings(bks);
      setPayouts(pays);
      setSosAlerts(alerts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveKYC = async (partnerId) => {
    try {
      await updatePartnerKYCAdmin(partnerId, 'verified', 'Approved by Operations Admin Team');
      showToast('Partner verified & activated on directory!');
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectKYC = async (partnerId) => {
    const reason = prompt('Enter rejection reason for applicant:', 'Document details mismatch or blurred image');
    if (!reason) return;
    try {
      await updatePartnerKYCAdmin(partnerId, 'rejected', reason);
      showToast('Partner KYC rejected.', 'warning');
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprovePayout = async (payoutId) => {
    const ref = txnRefs[payoutId] || `CMS${Date.now().toString().slice(-8)}`;
    try {
      await updatePayoutStatus(payoutId, 'completed', ref);
      showToast(`Payout ${payoutId} approved and marked settled!`);
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveSOS = async (alertId) => {
    const notes = prompt('Enter resolution notes:', 'Spoke with both parties, safely dispersed.');
    if (!notes) return;
    try {
      await resolveAdminSOSAlert(alertId, notes);
      showToast('Emergency SOS alert resolved!');
      loadAllAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdMessage({ text: '', type: '' });

    if (!pwdForm.currentPassword || !pwdForm.newPassword) {
      setPwdMessage({ text: 'Please fill in both current and new password.', type: 'error' });
      return;
    }
    if (pwdForm.newPassword.length < 6) {
      setPwdMessage({ text: 'New password must be at least 6 characters.', type: 'error' });
      return;
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setPwdMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    setPwdLoading(true);
    try {
      const res = await updateAdminPassword(pwdForm.currentPassword, pwdForm.newPassword);
      if (res.success) {
        setPwdMessage({ text: 'Admin password updated successfully!', type: 'success' });
        showToast('Admin password updated successfully!');
        setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPwdMessage({ text: res.message || 'Failed to update password.', type: 'error' });
      }
    } catch {
      setPwdMessage({ text: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setPwdLoading(false);
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    if (settingsForm) {
      setSettings(settingsForm);
      setSettingsSaved(true);
      showToast('Platform settings updated successfully!');
      setTimeout(() => setSettingsSaved(false), 3000);
    }
  };

  const pendingKYCPartners = partners.filter(p => p.kycStatus === 'pending');
  const verifiedPartners = partners.filter(p => p.kycStatus === 'verified');
  const activeSOSAlerts = sosAlerts.filter(a => a.status === 'active');

  const filteredPartners = partners.filter(p =>
    partnerSearch === '' ||
    p.name?.toLowerCase().includes(partnerSearch.toLowerCase()) ||
    p.city?.toLowerCase().includes(partnerSearch.toLowerCase())
  );

  // Mock hirer/client list (from bookings unique clients)
  const clientsFromBookings = Array.from(
    new Map(bookings.map(b => [b.clientName, { name: b.clientName, id: b.clientId, city: b.meetingLocation?.split(',')[0] || 'N/A', bookingCount: 1 }])).values()
  );
  const filteredUsers = clientsFromBookings.filter(u =>
    userSearch === '' ||
    u.name?.toLowerCase().includes(userSearch.toLowerCase())
  );

  // ── TAB buttons config ───────────────────────────────────────────────────
  const TAB_CONFIG = [
    { key: 'overview', label: 'Overview', icon: <LayoutDashboard size={15} /> },
    { key: 'kyc', label: `KYC (${pendingKYCPartners.length})`, icon: <ShieldCheck size={15} /> },
    { key: 'payouts', label: `Payouts (${payouts.filter(p => p.status === 'pending').length})`, icon: <Wallet size={15} /> },
    { key: 'bookings', label: `Bookings (${bookings.length})`, icon: <Calendar size={15} /> },
    { key: 'sos', label: `SOS (${activeSOSAlerts.length})`, icon: <AlertTriangle size={15} />, danger: true },
    { key: 'partners', label: 'Partners', icon: <Users size={15} /> },
    { key: 'users', label: 'Hirers', icon: <User size={15} /> },
    { key: 'settings', label: 'Settings', icon: <Sliders size={15} /> },
    { key: 'security', label: 'Security', icon: <Lock size={15} /> },
  ];

  return (
    <div className="container" style={{ paddingBottom: '70px' }}>
      
      {/* Admin Title */}
      <div style={{ padding: '24px 0 10px' }}>
        <div style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Operations & Governance Console
        </div>
        <h1 style={{ fontSize: '2.4rem' }}>PartnerOnRent Admin Panel</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Live platform health metrics, KYC approval queue, partner payouts, bookings oversight, and safety alerts.
        </p>
      </div>

      <SafetyBanner />

      {/* KPI Cards Grid */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
            Platform GMV
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            {formatCurrency(stats?.gmv || 0)}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#34d399' }}>
            Across {stats?.totalBookings || 0} total bookings
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
            Net Platform Revenue
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ec4899', marginBottom: '4px' }}>
            {formatCurrency(stats?.platformRevenue || 0)}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
            From 20% platform commission & fees
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
            Pending KYC Approvals
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: stats?.pendingKYC > 0 ? '#fbbf24' : '#34d399', marginBottom: '4px' }}>
            {stats?.pendingKYC || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
            {stats?.verifiedPartners || 0} verified active partners
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
            Pending Payouts
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: stats?.pendingPayouts > 0 ? '#38bdf8' : '#34d399', marginBottom: '4px' }}>
            {stats?.pendingPayouts || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
            {formatCurrency(stats?.partnerPayoutsDisbursed || 0)} already disbursed
          </div>
        </div>

      </div>

      {/* Admin Operations Panel */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        
        {/* Navigation Tab Bar */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '16px',
          marginBottom: '24px',
          gap: '6px',
          overflowX: 'auto',
          flexWrap: 'wrap'
        }}>
          {TAB_CONFIG.map(tab => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setAdminActiveTab(tab.key)}
              style={tab.danger && activeTab === tab.key ? { color: '#f87171', borderColor: 'rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.12)' } : {}}
            >
              {tab.icon}
              <span style={{ marginLeft: '5px' }}>{tab.label}</span>
            </button>
          ))}

          {/* Refresh button */}
          <button
            onClick={loadAllAdminData}
            disabled={loading}
            style={{
              marginLeft: 'auto',
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '6px 12px', borderRadius: '8px',
              background: 'rgba(56,189,248,0.1)',
              border: '1px solid rgba(56,189,248,0.3)',
              color: '#38bdf8', fontSize: '0.82rem', fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1
            }}
          >
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: Overview Dashboard */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LayoutDashboard size={20} color="#38bdf8" /> Platform Operations Overview
              </h3>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Real-time platform health dashboard
              </span>
            </div>

            {/* Summary Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Total Partners', value: partners.length, sub: `${verifiedPartners.length} verified`, icon: <Users size={20} />, color: '#38bdf8' },
                { label: 'Total Bookings', value: bookings.length, sub: `${bookings.filter(b => b.status === 'active').length} active`, icon: <Calendar size={20} />, color: '#ec4899' },
                { label: 'Active SOS', value: activeSOSAlerts.length, sub: activeSOSAlerts.length > 0 ? 'Requires attention!' : 'All clear', icon: <AlertTriangle size={20} />, color: activeSOSAlerts.length > 0 ? '#f87171' : '#34d399' },
                { label: 'Platform Revenue', value: formatCurrency(stats?.platformRevenue || 0), sub: '20% commission rate', icon: <TrendingUp size={20} />, color: '#a78bfa' },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  background: `rgba(15, 23, 42, 0.6)`,
                  border: `1px solid ${item.color}30`,
                  display: 'flex', alignItems: 'center', gap: '16px'
                }}>
                  <div style={{ color: item.color, flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>{item.label}</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: item.color, lineHeight: 1.1 }}>{item.value}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Action Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {[
                { key: 'kyc', label: 'Review KYC Queue', count: pendingKYCPartners.length, desc: 'Pending partner verifications', color: '#fbbf24', icon: <ShieldCheck size={18} /> },
                { key: 'payouts', label: 'Process Payouts', count: payouts.filter(p => p.status === 'pending').length, desc: 'Partner withdrawal requests', color: '#38bdf8', icon: <Wallet size={18} /> },
                { key: 'sos', label: 'SOS Monitor', count: activeSOSAlerts.length, desc: 'Active emergency alerts', color: '#f87171', icon: <AlertTriangle size={18} /> },
                { key: 'bookings', label: 'All Bookings', count: bookings.length, desc: 'Full platform booking feed', color: '#a78bfa', icon: <Calendar size={18} /> },
                { key: 'partners', label: 'Partners Registry', count: partners.length, desc: 'View all companion profiles', color: '#34d399', icon: <Users size={18} /> },
                { key: 'security', label: 'Admin Security', count: null, desc: 'Manage credentials & access', color: '#94a3b8', icon: <Lock size={18} /> },
              ].map(card => (
                <button
                  key={card.key}
                  onClick={() => setAdminActiveTab(card.key)}
                  style={{
                    padding: '18px', borderRadius: 'var(--radius-md)',
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: `1px solid ${card.color}25`,
                    textAlign: 'left', cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex', gap: '14px', alignItems: 'flex-start'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${card.color}12`; e.currentTarget.style.borderColor = `${card.color}50`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(15,23,42,0.5)'; e.currentTarget.style.borderColor = `${card.color}25`; }}
                >
                  <div style={{ color: card.color, marginTop: '2px', flexShrink: 0 }}>{card.icon}</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{card.label}</span>
                      {card.count !== null && (
                        <span style={{
                          fontSize: '0.7rem', fontWeight: 800, padding: '2px 7px',
                          borderRadius: '999px', background: `${card.color}20`, color: card.color
                        }}>{card.count}</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '3px' }}>{card.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Recent Bookings (last 5) */}
            {bookings.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <h4 style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '12px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                  Recent Bookings
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {bookings.slice(0, 5).map(bk => {
                    const badge = getStatusBadge(bk.status);
                    return (
                      <div key={bk.id} style={{
                        padding: '12px 16px', borderRadius: '10px',
                        background: 'rgba(15,23,42,0.5)', border: '1px solid var(--border-subtle)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px'
                      }}>
                        <div>
                          <span className={`badge ${badge.className}`} style={{ marginRight: '8px' }}>{badge.label}</span>
                          <span style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>
                            {bk.clientName} ➔ {bk.partnerName}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: '#64748b', marginLeft: '8px' }}>{bk.serviceName}</span>
                        </div>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ec4899' }}>
                          {formatCurrency(bk.totalAmount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: Partner KYC Review */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'kyc' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Partner Background & Document Verification</h3>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Review government documents before enabling booking eligibility
              </span>
            </div>

            {pendingKYCPartners.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 10px' }} />
                <div style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '4px' }}>All KYC applications are up to date</div>
                <p style={{ fontSize: '0.85rem' }}>No pending partner submissions in queue.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {pendingKYCPartners.map(p => (
                  <div 
                    key={p.id}
                    style={{
                      padding: '20px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid var(--border-active)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img 
                        src={p.avatar} 
                        alt={p.name}
                        style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>{p.name} ({p.gender}, {p.age})</div>
                        <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>City: {p.city} • Rate: {formatCurrency(p.hourlyRate)}/hr</div>
                        <div style={{ fontSize: '0.8rem', color: '#38bdf8', marginTop: '4px' }}>
                          ID Type: <strong>{p.kycDocuments?.idType}</strong> • Number: <strong>{p.kycDocuments?.idNumber}</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        className="btn-secondary btn-sm"
                        onClick={() => handleRejectKYC(p.id)}
                        style={{ color: '#f87171' }}
                      >
                        <XCircle size={16} /> Reject
                      </button>
                      <button 
                        className="btn-primary btn-sm"
                        onClick={() => handleApproveKYC(p.id)}
                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                      >
                        <CheckCircle2 size={16} /> Approve & Verify
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Verified Partners Summary */}
            {verifiedPartners.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#34d399', marginBottom: '12px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                  ✓ {verifiedPartners.length} Verified Partners
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {verifiedPartners.map(p => (
                    <div key={p.id} style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '6px 12px', borderRadius: '999px',
                      background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)'
                    }}>
                      <img src={p.avatar} alt={p.name} style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} />
                      <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: Payout Approvals */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'payouts' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Partner Withdrawal Requests Queue</h3>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Verify bank/UPI settlements & enter bank reference UTR
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {payouts.map(p => (
                <div 
                  key={p.id}
                  style={{
                    padding: '18px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <strong style={{ color: '#fff', fontSize: '1.15rem' }}>{formatCurrency(p.amount)}</strong>
                      <span className={`badge ${p.status === 'completed' ? 'badge-verified' : 'badge-warning'}`}>
                        {p.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>
                      Partner: <strong>{p.partnerName}</strong> ({p.partnerId})
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                      Method: {p.method} • To: {p.destination} • Requested: {formatDateTime(p.requestedAt)}
                    </div>
                    {p.transactionRef && (
                      <div style={{ fontSize: '0.78rem', color: '#38bdf8', marginTop: '4px' }}>
                        Ref UTR: {p.transactionRef}
                      </div>
                    )}
                  </div>

                  {p.status === 'pending' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input 
                        type="text"
                        placeholder="UTR / Ref ID"
                        value={txnRefs[p.id] || ''}
                        onChange={e => setTxnRefs({ ...txnRefs, [p.id]: e.target.value })}
                        style={{ width: '150px', fontSize: '0.85rem' }}
                      />
                      <button 
                        className="btn-primary btn-sm"
                        onClick={() => handleApprovePayout(p.id)}
                        style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                      >
                        Approve & Mark Paid
                      </button>
                    </div>
                  ) : (
                    <div style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 600 }}>
                      ✓ Settled to Partner
                    </div>
                  )}
                </div>
              ))}
              {payouts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No payout requests found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: All Bookings Feed */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'bookings' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>All Platform Bookings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {bookings.map(bk => {
                const badge = getStatusBadge(bk.status);
                return (
                  <div 
                    key={bk.id}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(15, 23, 42, 0.5)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '14px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className={`badge ${badge.className}`}>{badge.label}</span>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>#{bk.id}</span>
                        <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>OTP: <strong>{bk.startOtp}</strong></span>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                        Hirer: {bk.clientName} ➔ Companion: {bk.partnerName} ({bk.serviceName})
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                        {bk.date} ({bk.durationHours} hrs) • Venue: {bk.meetingLocation}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ec4899' }}>
                        {formatCurrency(bk.totalAmount)}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        Partner (80%): {formatCurrency(bk.partnerShare)} | Admin (20%): {formatCurrency(bk.platformRevenue)}
                      </div>
                    </div>
                  </div>
                );
              })}
              {bookings.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No bookings found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: SOS Safety Alert Monitor */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'sos' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} color="#f87171" /> Emergency Safety Incident Monitor
              </h3>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Real-time incident dispatch queue
              </span>
            </div>

            {sosAlerts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 10px' }} />
                <div style={{ color: '#34d399', fontWeight: 600 }}>No active SOS emergency alerts. All active meetups normal.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {sosAlerts.map(alert => (
                  <div 
                    key={alert.id}
                    style={{
                      padding: '18px',
                      borderRadius: 'var(--radius-md)',
                      background: alert.status === 'active' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                      border: alert.status === 'active' ? '2px solid #ef4444' : '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '14px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className={`badge ${alert.status === 'active' ? 'badge-danger' : 'badge-verified'}`}>
                          {alert.status === 'active' ? 'EMERGENCY ACTIVE' : 'Resolved'}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>#{alert.id} • Booking #{alert.bookingId}</span>
                      </div>
                      <h4 style={{ fontSize: '1.05rem', color: '#fff' }}>
                        Triggered by {alert.userName} ({alert.userRole})
                      </h4>
                      <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginTop: '2px' }}>
                        Location: <strong>{alert.location}</strong>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#fca5a5', marginTop: '2px' }}>
                        Reason: "{alert.reason}"
                      </div>
                      {alert.resolutionNotes && (
                        <div style={{ fontSize: '0.78rem', color: '#34d399', marginTop: '4px' }}>
                          Resolution: {alert.resolutionNotes}
                        </div>
                      )}
                    </div>

                    {alert.status === 'active' && (
                      <button 
                        className="btn-danger btn-sm"
                        onClick={() => handleResolveSOS(alert.id)}
                      >
                        Confirm Safe & Resolve Alert
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: Partners Directory */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'partners' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} color="#38bdf8" /> All Partners Directory
              </h3>
              <input
                type="text"
                placeholder="Search by name or city…"
                value={partnerSearch}
                onChange={e => setPartnerSearch(e.target.value)}
                style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '0.88rem', width: '220px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {filteredPartners.map(p => (
                <div key={p.id} style={{
                  padding: '18px', borderRadius: 'var(--radius-md)',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: `1px solid ${p.kycStatus === 'verified' ? 'rgba(16,185,129,0.3)' : p.kycStatus === 'rejected' ? 'rgba(239,68,68,0.3)' : 'var(--border-subtle)'}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <img src={p.avatar} alt={p.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8' }} />
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{p.gender} • {p.age} yrs</div>
                    </div>
                    <span className={`badge ${p.kycStatus === 'verified' ? 'badge-verified' : p.kycStatus === 'rejected' ? 'badge-danger' : 'badge-warning'}`} style={{ marginLeft: 'auto', flexShrink: 0 }}>
                      {p.kycStatus}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: '#94a3b8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={12} /> {p.city}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <DollarSign size={12} /> {formatCurrency(p.hourlyRate)}/hr
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Star size={12} color="#fbbf24" /> {p.rating || 'N/A'} ({p.reviewCount || 0} reviews)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Activity size={12} /> {p.totalBookings || 0} bookings completed
                    </div>
                  </div>
                </div>
              ))}
              {filteredPartners.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No partners found matching "{partnerSearch}"
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: Hirers / Users Registry */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'users' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={20} color="#ec4899" /> Hirers & Clients Registry
              </h3>
              <input
                type="text"
                placeholder="Search hirers…"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '0.88rem', width: '220px' }}
              />
            </div>

            {filteredUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                {userSearch ? `No hirers found matching "${userSearch}"` : 'No hirer data available from bookings yet.'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredUsers.map((u, idx) => (
                  <div key={idx} style={{
                    padding: '14px 18px', borderRadius: 'var(--radius-md)',
                    background: 'rgba(15,23,42,0.5)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1rem', fontWeight: 800, color: '#fff', flexShrink: 0
                      }}>
                        {u.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#fff' }}>{u.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Hirer ID: {u.id || 'N/A'} • {u.city}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px',
                        borderRadius: '999px', background: 'rgba(236,72,153,0.15)', color: '#f472b6'
                      }}>
                        {u.bookingCount} booking(s)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{
              marginTop: '20px', padding: '14px', borderRadius: '10px',
              background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
              fontSize: '0.8rem', color: '#a78bfa'
            }}>
              ℹ️ Hirer data is derived from platform bookings. A full user management panel with direct account access requires backend integration.
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: Platform Settings */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'settings' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={20} color="#38bdf8" /> Platform Configuration Settings
              </h3>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Manage global platform parameters</span>
            </div>

            {settingsForm ? (
              <form onSubmit={handleSaveSettings}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

                  {/* General Settings */}
                  <div style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '22px' }}>
                    <h4 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <BarChart2 size={16} /> General Settings
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {[
                        { label: 'Platform Name', field: 'platformName', type: 'text' },
                        { label: 'Commission Rate (%)', field: 'commissionRate', type: 'number' },
                        { label: 'GST Rate (%)', field: 'gstRate', type: 'number' },
                      ].map(f => (
                        <div key={f.field}>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '5px', fontWeight: 600 }}>
                            {f.label}
                          </label>
                          <input
                            type={f.type}
                            value={settingsForm[f.field] || ''}
                            onChange={e => setSettingsForm({ ...settingsForm, [f.field]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.9rem' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Settings */}
                  <div style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '22px' }}>
                    <h4 style={{ fontSize: '1rem', color: '#ec4899', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={16} /> Contact & Support
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {[
                        { label: 'Support Phone', field: 'supportPhone', icon: <Phone size={12} /> },
                        { label: 'Support Email', field: 'supportEmail', icon: <Mail size={12} /> },
                      ].map(f => (
                        <div key={f.field}>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '5px', fontWeight: 600 }}>
                            {f.label}
                          </label>
                          <input
                            type="text"
                            value={settingsForm[f.field] || ''}
                            onChange={e => setSettingsForm({ ...settingsForm, [f.field]: e.target.value })}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.9rem' }}
                          />
                        </div>
                      ))}

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '5px', fontWeight: 600 }}>
                          Active Service Cities (comma-separated)
                        </label>
                        <textarea
                          value={(settingsForm.cities || []).join(', ')}
                          onChange={e => setSettingsForm({ ...settingsForm, cities: e.target.value.split(',').map(c => c.trim()).filter(Boolean) })}
                          rows={3}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '0.85rem', resize: 'vertical' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {settingsSaved && (
                  <div style={{
                    marginTop: '16px', padding: '10px 16px', borderRadius: '8px',
                    background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981',
                    color: '#34d399', fontSize: '0.88rem', fontWeight: 600
                  }}>
                    ✓ Settings saved successfully!
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ marginTop: '18px', padding: '12px 28px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}
                >
                  <Settings size={16} /> Save Platform Settings
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading settings…</div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TAB: Admin Security & Password Management */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {activeTab === 'security' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock size={20} color="#38bdf8" /> Admin Security & Credentials Console
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Manage platform operations access, administrator email, and password credentials
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              
              {/* Left Column: Admin Identity & Status */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <h4 style={{ fontSize: '1.05rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} /> Current Administrator Account
                </h4>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <img
                    src={session?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80"}
                    alt="Admin Avatar"
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>
                      {session?.name || "Super Administrator"}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>
                      Operations & Platform Master Admin
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Official Admin Email:</span>
                    <strong style={{ color: '#fff' }}>{session?.email || 'admin@partneronrent.in'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Support Phone:</span>
                    <strong style={{ color: '#fff' }}>+91 98105 35398</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Role Level:</span>
                    <span className="badge badge-verified" style={{ background: 'rgba(56,189,248,0.2)', color: '#38bdf8' }}>Level 3 (Root Admin)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Default Credentials:</span>
                    <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.78rem' }}>
                      admin@partneronrent.in / Admin@12345
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Database Persistence:</span>
                    <strong style={{ color: '#34d399' }}>Active (db.json)</strong>
                  </div>
                </div>

                <div style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  fontSize: '0.78rem',
                  color: '#7dd3fc',
                  lineHeight: '1.5'
                }}>
                  🔒 <strong>Security Policy:</strong> Any updates made to the admin password are saved directly to the database and will take effect immediately across all sessions.
                </div>
              </div>

              {/* Right Column: Change Password Form */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '24px'
              }}>
                <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Key size={18} color="#ec4899" /> Change Admin Password
                </h4>

                {pwdMessage.text && (
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontSize: '0.85rem',
                    background: pwdMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    border: pwdMessage.type === 'success' ? '1px solid #10b981' : '1px solid #ef4444',
                    color: pwdMessage.type === 'success' ? '#34d399' : '#f87171'
                  }}>
                    {pwdMessage.text}
                  </div>
                )}

                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                      Current Password *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPwd.current ? "text" : "password"}
                        value={pwdForm.currentPassword}
                        onChange={e => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
                        placeholder="Enter current password (default: Admin@12345)"
                        style={{
                          width: '100%',
                          padding: '10px 40px 10px 12px',
                          background: 'rgba(15, 23, 42, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '0.9rem'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd({ ...showPwd, current: !showPwd.current })}
                        style={{
                          position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', color: '#64748b', cursor: 'pointer'
                        }}
                      >
                        {showPwd.current ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                      New Admin Password * (minimum 6 chars)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPwd.next ? "text" : "password"}
                        value={pwdForm.newPassword}
                        onChange={e => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                        placeholder="Enter your strong new password"
                        style={{
                          width: '100%',
                          padding: '10px 40px 10px 12px',
                          background: 'rgba(15, 23, 42, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '0.9rem'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd({ ...showPwd, next: !showPwd.next })}
                        style={{
                          position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', color: '#64748b', cursor: 'pointer'
                        }}
                      >
                        {showPwd.next ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      value={pwdForm.confirmPassword}
                      onChange={e => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                      placeholder="Repeat new password"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={pwdLoading}
                    className="btn-primary"
                    style={{
                      marginTop: '8px', padding: '12px', borderRadius: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '8px', fontWeight: 700
                    }}
                  >
                    <Lock size={16} />
                    {pwdLoading ? 'Updating Password…' : 'Save & Update Admin Password'}
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
