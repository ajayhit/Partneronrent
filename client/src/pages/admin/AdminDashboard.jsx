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
  updateBookingStatus
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
  ArrowDownToLine, 
  Calendar, 
  Sliders, 
  FileText,
  MapPin,
  TrendingUp,
  Percent
} from 'lucide-react';

export default function AdminDashboard() {
  const { showToast } = useApp();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('kyc'); // 'kyc', 'payouts', 'bookings', 'sos', 'settings'
  
  const [partners, setPartners] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Settlement ref inputs
  const [txnRefs, setTxnRefs] = useState({});

  useEffect(() => {
    loadAllAdminData();
  }, []);

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

  const pendingKYCPartners = partners.filter(p => p.kycStatus === 'pending');

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

      {/* Admin Operations Tabs */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        
        {/* Navigation Tab Bar */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '16px',
          marginBottom: '24px',
          gap: '8px',
          overflowX: 'auto'
        }}>
          <button 
            className={`tab-btn ${activeTab === 'kyc' ? 'active' : ''}`}
            onClick={() => setActiveTab('kyc')}
          >
            <ShieldCheck size={16} style={{ display: 'inline', marginRight: '6px' }} />
            Partner KYC Applications ({pendingKYCPartners.length})
          </button>

          <button 
            className={`tab-btn ${activeTab === 'payouts' ? 'active' : ''}`}
            onClick={() => setActiveTab('payouts')}
          >
            <Wallet size={16} style={{ display: 'inline', marginRight: '6px' }} />
            Payout Approvals ({payouts.filter(p => p.status === 'pending').length})
          </button>

          <button 
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <Calendar size={16} style={{ display: 'inline', marginRight: '6px' }} />
            All Bookings ({bookings.length})
          </button>

          <button 
            className={`tab-btn ${activeTab === 'sos' ? 'active' : ''}`}
            onClick={() => setActiveTab('sos')}
          >
            <AlertTriangle size={16} style={{ display: 'inline', marginRight: '6px' }} />
            SOS & Safety Monitor ({sosAlerts.filter(a => a.status === 'active').length})
          </button>
        </div>

        {/* TAB 1: Partner KYC Review */}
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
          </div>
        )}

        {/* TAB 2: Payout Approvals */}
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
            </div>
          </div>
        )}

        {/* TAB 3: All Bookings Feed */}
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
            </div>
          </div>
        )}

        {/* TAB 4: SOS Safety Alert Monitor */}
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
                No active SOS emergency alerts. All active meetups normal.
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

      </div>

    </div>
  );
}
