import React from 'react';
import { formatCurrency } from '../../../utils/helpers';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Wallet,
  TrendingUp,
  Star,
  AlertCircle,
  ShieldCheck,
  Power,
  Play,
  Square,
  MessageCircle,
  AlertTriangle,
  ArrowUpRight,
  MapPin,
  ChevronRight,
  UserCheck,
  XCircle
} from 'lucide-react';

export default function DashboardTab({
  partner,
  bookings,
  onToggleOnline,
  onTabChange,
  onAcceptBooking,
  onDeclineBooking,
  onStartSession,
  onEndSession,
  otpInputs,
  setOtpInputs,
  verifyingOtp,
  openChat,
  openSOS
}) {
  const isOnline = partner?.isOnline;
  const kycStatus = partner?.kycStatus || 'pending';
  const isVerified = kycStatus === 'verified';

  // Metrics computation
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.date === todayStr);
  const upcomingBookings = bookings.filter(b => b.status === 'confirmed');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const pendingRequests = bookings.filter(b => b.status === 'pending');
  const activeSessions = bookings.filter(b => b.status === 'in-progress');

  const earningsToday = todayBookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + (b.partnerShare || 0), 0);

  const pendingEarnings = pendingRequests.reduce((sum, b) => sum + (b.partnerShare || 0), 0) +
    upcomingBookings.reduce((sum, b) => sum + (b.partnerShare || 0), 0) +
    activeSessions.reduce((sum, b) => sum + (b.partnerShare || 0), 0);

  const totalEarnings = partner?.totalEarnings || 94000;
  const walletBalance = partner?.walletBalance || 18400;
  const rating = partner?.rating || 4.95;
  const reviewCount = partner?.reviewCount || 42;
  const cancellationRate = partner?.cancellationRate || '1.8%';

  return (
    <div>
      {/* Top Banner / Hero Bar */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '16px',
        padding: '24px 28px',
        marginBottom: '26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={partner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={partner?.name}
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #10b981'
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: 2,
                right: 2,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: isOnline ? '#10b981' : '#64748b',
                border: '2px solid #0f172a'
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className={`partner-badge ${isVerified ? 'partner-badge-emerald' : 'partner-badge-amber'}`}>
                {isVerified ? '✓ Verified Companion' : '⏳ KYC Under Review'}
              </span>
              <span style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
                📍 {partner?.city || 'Delhi NCR'}
              </span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Welcome back, {partner?.name || 'Partner'}!
            </h1>
            <p style={{ fontSize: '0.86rem', color: '#cbd5e1', margin: '3px 0 0' }}>
              Keep your status online during active hours to receive instant booking requests from verified hirers.
            </p>
          </div>
        </div>

        {/* Online / Offline Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={onToggleOnline}
            style={{
              padding: '12px 24px',
              borderRadius: '9999px',
              background: isOnline ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(100, 116, 139, 0.25)',
              border: isOnline ? '1px solid #34d399' : '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: isOnline ? '0 0 20px rgba(16, 185, 129, 0.4)' : 'none',
              cursor: 'pointer'
            }}
          >
            <Power size={18} />
            <span>{isOnline ? 'ONLINE & ACCEPTING' : 'OFFLINE (Shift Ended)'}</span>
          </button>

          <button
            className="btn-secondary"
            onClick={() => onTabChange('payouts')}
            style={{ padding: '12px 20px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Wallet size={16} /> Withdraw
          </button>
        </div>
      </div>

      {/* 10 Required KPI Cards Grid */}
      <div className="partner-stats-grid">
        {/* 1. Today's Bookings */}
        <div className="partner-stat-card">
          <div>
            <div className="partner-stat-label">Today's Bookings</div>
            <div className="partner-stat-value">{todayBookings.length}</div>
            <div className="partner-stat-subtext">Scheduled for today</div>
          </div>
          <div className="partner-stat-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            <Calendar size={22} />
          </div>
        </div>

        {/* 2. Upcoming Bookings */}
        <div className="partner-stat-card">
          <div>
            <div className="partner-stat-label">Upcoming Bookings</div>
            <div className="partner-stat-value">{upcomingBookings.length}</div>
            <div className="partner-stat-subtext">Confirmed sessions</div>
          </div>
          <div className="partner-stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
            <Clock size={22} />
          </div>
        </div>

        {/* 3. Completed Bookings */}
        <div className="partner-stat-card">
          <div>
            <div className="partner-stat-label">Completed Bookings</div>
            <div className="partner-stat-value">{completedBookings.length}</div>
            <div className="partner-stat-subtext">{partner?.completedHours || 128} Total Hours</div>
          </div>
          <div className="partner-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* 4. Earnings Today */}
        <div className="partner-stat-card">
          <div>
            <div className="partner-stat-label">Earnings Today</div>
            <div className="partner-stat-value" style={{ color: '#34d399' }}>
              {formatCurrency(earningsToday)}
            </div>
            <div className="partner-stat-subtext">Net 80% earned today</div>
          </div>
          <div className="partner-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <TrendingUp size={22} />
          </div>
        </div>

        {/* 5. Total Earnings */}
        <div className="partner-stat-card">
          <div>
            <div className="partner-stat-label">Total Earnings</div>
            <div className="partner-stat-value">
              {formatCurrency(totalEarnings)}
            </div>
            <div className="partner-stat-subtext">All-time companionship payout</div>
          </div>
          <div className="partner-stat-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
            <Wallet size={22} />
          </div>
        </div>

        {/* 6. Pending Earnings */}
        <div className="partner-stat-card">
          <div>
            <div className="partner-stat-label">Pending Earnings</div>
            <div className="partner-stat-value" style={{ color: '#fbbf24' }}>
              {formatCurrency(pendingEarnings)}
            </div>
            <div className="partner-stat-subtext">Locked in active & scheduled</div>
          </div>
          <div className="partner-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Clock size={22} />
          </div>
        </div>

        {/* 7. Available Balance */}
        <div className="partner-stat-card">
          <div>
            <div className="partner-stat-label">Available Balance</div>
            <div className="partner-stat-value" style={{ color: '#34d399' }}>
              {formatCurrency(walletBalance)}
            </div>
            <div className="partner-stat-subtext">Ready for withdrawal</div>
          </div>
          <div className="partner-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <Wallet size={22} />
          </div>
        </div>

        {/* 8. Rating */}
        <div className="partner-stat-card">
          <div>
            <div className="partner-stat-label">Rating</div>
            <div className="partner-stat-value" style={{ color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={22} fill="#fbbf24" /> {rating}
            </div>
            <div className="partner-stat-subtext">From {reviewCount} reviews</div>
          </div>
          <div className="partner-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Star size={22} />
          </div>
        </div>

        {/* 9. Cancellation Rate */}
        <div className="partner-stat-card">
          <div>
            <div className="partner-stat-label">Cancellation Rate</div>
            <div className="partner-stat-value" style={{ color: '#38bdf8' }}>
              {cancellationRate}
            </div>
            <div className="partner-stat-subtext">Excellent safety rating (under 5%)</div>
          </div>
          <div className="partner-stat-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8' }}>
            <AlertCircle size={22} />
          </div>
        </div>

        {/* 10. Profile Verification Status */}
        <div className="partner-stat-card" onClick={() => onTabChange('kyc')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="partner-stat-label">Verification Status</div>
            <div className="partner-stat-value" style={{ fontSize: '1.25rem', color: isVerified ? '#34d399' : '#fbbf24' }}>
              {isVerified ? 'VERIFIED' : 'PENDING'}
            </div>
            <div className="partner-stat-subtext">
              {isVerified ? 'Aadhaar & Police Check Clear' : 'Click to submit documents'}
            </div>
          </div>
          <div className="partner-stat-icon" style={{ background: isVerified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: isVerified ? '#34d399' : '#fbbf24' }}>
            <ShieldCheck size={22} />
          </div>
        </div>
      </div>

      {/* Ongoing Active Sessions Banner */}
      {activeSessions.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#f59e0b',
              boxShadow: '0 0 10px #f59e0b'
            }} />
            <h2 style={{ fontSize: '1.25rem', color: '#fbbf24', margin: 0 }}>
              Live Ongoing Companion Session ({activeSessions.length})
            </h2>
          </div>

          {activeSessions.map(session => (
            <div
              key={session.id}
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)',
                border: '2px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
                boxShadow: '0 8px 30px rgba(245, 158, 11, 0.15)',
                marginBottom: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="partner-badge partner-badge-amber">Session Active & Timer Running</span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>#{session.id}</span>
                </div>
                <h3 style={{ fontSize: '1.3rem', color: '#ffffff', margin: '4px 0' }}>
                  Client: {session.clientName} ({session.clientPhone})
                </h3>
                <div style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '6px' }}>
                  Activity: <strong style={{ color: '#fff' }}>{session.serviceName}</strong> • {session.durationHours} Hours Duration
                </div>
                <div style={{ fontSize: '0.84rem', color: '#94a3b8', marginTop: '4px' }}>
                  <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  {session.meetingLocation}
                </div>
                <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#34d399', marginTop: '8px' }}>
                  Your 80% Earnings Upon Completion: {formatCurrency(session.partnerShare)}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  className="btn-secondary"
                  onClick={() => openChat(session)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <MessageCircle size={16} /> Chat Hirer
                </button>
                <button
                  className="btn-danger"
                  onClick={() => openSOS(session)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <AlertTriangle size={16} /> Emergency SOS
                </button>
                <button
                  className="btn-primary"
                  onClick={() => onEndSession(session.id)}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Square size={16} /> Complete & Credit {formatCurrency(session.partnerShare)}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pending Incoming Requests Quick Card */}
      {pendingRequests.length > 0 && (
        <div className="partner-panel" style={{ border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <div className="partner-panel-header">
            <div className="partner-panel-title">
              <span>Incoming Hire Requests</span>
              <span className="partner-badge partner-badge-amber">{pendingRequests.length} Action Required</span>
            </div>
            <button
              className="partner-subtab-btn"
              onClick={() => onTabChange('bookings')}
            >
              View All in Bookings <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingRequests.slice(0, 3).map(req => (
              <div
                key={req.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ffffff' }}>
                    {req.clientName} booked you for <span style={{ color: '#38bdf8' }}>{req.serviceName}</span>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#94a3b8', marginTop: '4px' }}>
                    📅 {req.date} at {req.startTime} ({req.durationHours} hrs) • 📍 {req.meetingLocation}
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
                    Your Earnings: {formatCurrency(req.partnerShare)} (80% take-home)
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="btn-secondary btn-sm"
                    onClick={() => onDeclineBooking(req.id)}
                    style={{ color: '#f87171' }}
                  >
                    <XCircle size={15} /> Decline
                  </button>
                  <button
                    className="btn-primary btn-sm"
                    onClick={() => onAcceptBooking(req.id)}
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                  >
                    <CheckCircle2 size={15} /> Accept Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmed Upcoming Bookings Quick Preview */}
      <div className="partner-panel">
        <div className="partner-panel-header">
          <div className="partner-panel-title">
            <Calendar size={20} color="#34d399" />
            <span>Upcoming Confirmed Sessions</span>
          </div>
          <button
            className="partner-subtab-btn"
            onClick={() => onTabChange('bookings')}
          >
            Manage Bookings <ChevronRight size={14} />
          </button>
        </div>

        {upcomingBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 0', color: '#64748b', fontSize: '0.92rem' }}>
            No upcoming confirmed sessions. Stay online to receive new client bookings!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {upcomingBookings.slice(0, 3).map(bk => (
              <div
                key={bk.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span className="partner-badge partner-badge-emerald">Confirmed</span>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>#{bk.id}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ffffff' }}>
                    {bk.clientName} • {bk.serviceName}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginTop: '4px' }}>
                    📅 {bk.date} at {bk.startTime} ({bk.durationHours} hrs) • 📍 {bk.meetingLocation}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#34d399', fontWeight: 700, marginTop: '4px' }}>
                    Payout upon completion: {formatCurrency(bk.partnerShare)}
                  </div>
                </div>

                {/* OTP Start form */}
                <div style={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#cbd5e1', textTransform: 'uppercase', fontWeight: 700 }}>
                      Ask Hirer for OTP
                    </div>
                    <input
                      type="text"
                      maxLength="4"
                      placeholder="4-digit OTP"
                      value={otpInputs[bk.id] || ''}
                      onChange={e => setOtpInputs({ ...otpInputs, [bk.id]: e.target.value })}
                      style={{ width: '100px', textAlign: 'center', fontSize: '1rem', fontWeight: 800, padding: '6px' }}
                    />
                  </div>
                  <button
                    className="btn-primary btn-sm"
                    onClick={() => onStartSession(bk.id)}
                    disabled={verifyingOtp}
                    style={{ height: '38px', marginTop: '14px' }}
                  >
                    <Play size={14} /> Start
                  </button>
                  <button
                    className="btn-secondary btn-sm"
                    onClick={() => openChat(bk)}
                    style={{ height: '38px', marginTop: '14px' }}
                    title="Chat with client"
                  >
                    <MessageCircle size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div
          onClick={() => onTabChange('profile')}
          className="partner-panel"
          style={{ padding: '18px 20px', cursor: 'pointer', marginBottom: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, color: '#fff' }}>👤 My Profile</span>
            <ArrowUpRight size={16} color="#34d399" />
          </div>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
            Update bio, languages, service areas, and preview your public profile.
          </p>
        </div>

        <div
          onClick={() => onTabChange('services')}
          className="partner-panel"
          style={{ padding: '18px 20px', cursor: 'pointer', marginBottom: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, color: '#fff' }}>🎬 My Services & Pricing</span>
            <ArrowUpRight size={16} color="#38bdf8" />
          </div>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
            Select companion services you offer and set custom hourly rates.
          </p>
        </div>

        <div
          onClick={() => onTabChange('availability')}
          className="partner-panel"
          style={{ padding: '18px 20px', cursor: 'pointer', marginBottom: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, color: '#fff' }}>📅 Availability & Vacation</span>
            <ArrowUpRight size={16} color="#fbbf24" />
          </div>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
            Configure weekly working hours, block personal dates, or enable vacation mode.
          </p>
        </div>

        <div
          onClick={() => onTabChange('safety')}
          className="partner-panel"
          style={{ padding: '18px 20px', cursor: 'pointer', marginBottom: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, color: '#fff' }}>🛡️ Safety Center</span>
            <ArrowUpRight size={16} color="#f87171" />
          </div>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
            Emergency contacts, report inappropriate behavior, and read platonic guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
