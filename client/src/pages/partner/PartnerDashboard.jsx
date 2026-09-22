import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  fetchBookings, 
  fetchPartnerById, 
  togglePartnerOnline, 
  updateBookingStatus, 
  startSessionWithOTP, 
  endSession 
} from '../../utils/api';
import { formatCurrency, getStatusBadge } from '../../utils/helpers';
import SafetyBanner from '../../components/SafetyBanner';
import { 
  Briefcase, 
  Power, 
  ShieldCheck, 
  Wallet, 
  Clock, 
  Star, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Square, 
  MessageCircle, 
  AlertTriangle, 
  KeyRound,
  MapPin,
  TrendingUp,
  FileCheck
} from 'lucide-react';

export default function PartnerDashboard({ setActivePage }) {
  const { activePartner, setActivePartner } = useAuth();
  const { openChat, openSOS, showToast } = useApp();
  const [partnerData, setPartnerData] = useState(activePartner || null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [otpInputs, setOtpInputs] = useState({});
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [activePartner?.id]);

  const loadData = async () => {
    try {
      const [partner, bData] = await Promise.all([
        fetchPartnerById(activePartner?.id || 'partner-p1'),
        fetchBookings({ partnerId: activePartner?.id || 'partner-p1' })
      ]);
      if (partner) setPartnerData(partner);
      if (bData) setBookings(bData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOnline = async () => {
    try {
      const res = await togglePartnerOnline(activePartner?.id || 'partner-p1');
      setPartnerData(prev => ({ ...prev, isOnline: res.isOnline }));
      showToast(res.isOnline ? 'You are now ONLINE & accepting hire requests!' : 'You are now OFFLINE.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, 'confirmed');
      showToast('Booking request accepted! Client has been notified.');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeclineBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to decline this booking request?')) return;
    try {
      await updateBookingStatus(bookingId, 'declined');
      showToast('Booking request declined.', 'warning');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartSession = async (bookingId) => {
    const otp = otpInputs[bookingId];
    if (!otp || otp.trim().length !== 4) {
      alert('Please enter the 4-digit OTP provided by the client.');
      return;
    }

    setVerifyingOtp(true);
    try {
      await startSessionWithOTP(bookingId, otp);
      showToast('Session verified & started! Timer is now active.');
      setOtpInputs(prev => ({ ...prev, [bookingId]: '' }));
      loadData();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Invalid OTP code.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleEndSession = async (bookingId) => {
    if (!confirm('Confirm session completion? Your 80% earnings will be immediately released to your wallet.')) return;
    try {
      await endSession(bookingId);
      showToast('Session completed! Earnings credited to your wallet.');
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to end session');
    }
  };

  const incomingRequests = bookings.filter(b => b.status === 'pending');
  const activeSessions = bookings.filter(b => b.status === 'in-progress');
  const confirmedUpcoming = bookings.filter(b => b.status === 'confirmed');

  return (
    <div className="container" style={{ paddingBottom: '70px' }}>
      
      {/* Partner Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 0 10px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img 
            src={partnerData?.avatar || activePartner?.avatar} 
            alt={partnerData?.name}
            style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #10b981' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-verified">
                <ShieldCheck size={13} /> {partnerData?.kycStatus === 'verified' ? 'Verified Partner' : 'KYC Under Review'}
              </span>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{partnerData?.city}</span>
            </div>
            <h1 style={{ fontSize: '2rem' }}>{partnerData?.name}</h1>
          </div>
        </div>

        {/* Online / Offline Toggle Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button 
            onClick={handleToggleOnline}
            style={{
              padding: '10px 20px',
              borderRadius: 'var(--radius-full)',
              background: partnerData?.isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.2)',
              border: partnerData?.isOnline ? '1px solid #10b981' : '1px solid var(--border-subtle)',
              color: partnerData?.isOnline ? '#34d399' : '#94a3b8',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Power size={18} color={partnerData?.isOnline ? '#34d399' : '#94a3b8'} />
            <span>{partnerData?.isOnline ? 'ONLINE & ACCEPTING' : 'OFFLINE (Shift Ended)'}</span>
          </button>

          <button 
            className="btn-secondary"
            onClick={() => setActivePage('partner-earnings')}
          >
            <Wallet size={16} /> Earnings & Payouts
          </button>
        </div>
      </div>

      <SafetyBanner />

      {/* KPI Stats Grid */}
      <div className="grid-4" style={{ marginBottom: '30px' }}>
        
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
            Available Wallet
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginBottom: '4px' }}>
            {formatCurrency(partnerData?.walletBalance || 0)}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
            Ready for instant UPI/Bank withdrawal
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
            Total Lifetime Earned (80%)
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            {formatCurrency(partnerData?.totalEarnings || 0)}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#a78bfa' }}>
            Keep 80% of all hourly fees
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
            Completed Companionship
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
            {partnerData?.completedHours || 0} Hours
          </div>
          <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
            {bookings.filter(b => b.status === 'completed').length} completed sessions
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
            Client Rating
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Star size={24} fill="#fbbf24" /> {partnerData?.rating || '5.0'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
            Based on {partnerData?.reviewCount || 0} reviews
          </div>
        </div>

      </div>

      {/* 1. Live Active Sessions */}
      {activeSessions.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.3rem', color: '#f59e0b', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-online" style={{ background: '#f59e0b', boxShadow: '0 0 10px #f59e0b' }} />
            Active Ongoing Session
          </h2>

          {activeSessions.map(session => (
            <div 
              key={session.id}
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(30, 41, 59, 0.9) 100%)',
                border: '2px solid rgba(245, 158, 11, 0.5)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
                boxShadow: '0 4px 20px rgba(245, 158, 11, 0.2)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="badge badge-warning">Session In Progress</span>
                  <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Booking #{session.id}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>
                  Hirer: {session.clientName} ({session.clientPhone})
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
                  Activity: <strong>{session.serviceName}</strong> • {session.durationHours} hours
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
                  <MapPin size={13} style={{ display: 'inline' }} /> {session.meetingLocation}
                </div>
                <div style={{ fontSize: '0.92rem', color: '#34d399', fontWeight: 700, marginTop: '8px' }}>
                  Your 80% Earnings Upon Completion: {formatCurrency(session.partnerShare)}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                >
                  <AlertTriangle size={16} /> SOS
                </button>

                <button 
                  className="btn-primary"
                  onClick={() => handleEndSession(session.id)}
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                >
                  <Square size={16} /> End Session & Release {formatCurrency(session.partnerShare)}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Incoming Hire Requests (Need Acceptance) */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Incoming Hire Requests</span>
            {incomingRequests.length > 0 && (
              <span className="badge badge-warning">{incomingRequests.length} Pending</span>
            )}
          </h2>
          <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Review venue and time before accepting
          </span>
        </div>

        {incomingRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b', fontSize: '0.9rem' }}>
            No pending hire requests right now. Keep your toggle ONLINE to receive new client bookings.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {incomingRequests.map(req => (
              <div 
                key={req.id}
                style={{
                  padding: '18px',
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
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '4px' }}>
                    {req.clientName} hired you for {req.serviceName}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    <span>📅 {req.date} at {req.startTime} ({req.durationHours} hrs)</span>
                    <span>📍 {req.meetingLocation}</span>
                  </div>
                  {req.clientNotes && (
                    <div style={{ fontSize: '0.8rem', color: '#c084fc', marginTop: '4px' }}>
                      Note: "{req.clientNotes}"
                    </div>
                  )}
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#34d399', marginTop: '6px' }}>
                    Your Earnings: {formatCurrency(req.partnerShare)} (80% share)
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className="btn-secondary btn-sm"
                    onClick={() => handleDeclineBooking(req.id)}
                    style={{ color: '#f87171' }}
                  >
                    <XCircle size={16} /> Decline
                  </button>
                  <button 
                    className="btn-primary btn-sm"
                    onClick={() => handleAcceptBooking(req.id)}
                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                  >
                    <CheckCircle2 size={16} /> Accept Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Confirmed Upcoming Sessions & OTP Verification */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>Confirmed Upcoming Sessions</h2>

        {confirmedUpcoming.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b', fontSize: '0.9rem' }}>
            No confirmed upcoming sessions scheduled.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {confirmedUpcoming.map(bk => (
              <div 
                key={bk.id}
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
                    <span className="badge badge-verified">Confirmed</span>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>#{bk.id}</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>
                    {bk.clientName} • {bk.serviceName}
                  </h4>
                  <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginTop: '4px' }}>
                    📅 {bk.date} at {bk.startTime} ({bk.durationHours} hrs) • 📍 {bk.meetingLocation}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#34d399', fontWeight: 700, marginTop: '4px' }}>
                    Payout upon completion: {formatCurrency(bk.partnerShare)}
                  </div>
                </div>

                {/* OTP Entry to Start Session */}
                <div style={{
                  background: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid var(--border-active)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#cbd5e1', textTransform: 'uppercase', fontWeight: 700 }}>
                      Ask Client for OTP
                    </div>
                    <input 
                      type="text"
                      maxLength="4"
                      placeholder="4-digit OTP"
                      value={otpInputs[bk.id] || ''}
                      onChange={e => setOtpInputs({ ...otpInputs, [bk.id]: e.target.value })}
                      style={{ width: '110px', textAlign: 'center', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.15em' }}
                    />
                  </div>

                  <button 
                    className="btn-primary btn-sm"
                    onClick={() => handleStartSession(bk.id)}
                    disabled={verifyingOtp}
                    style={{ height: '42px', marginTop: '16px' }}
                  >
                    <Play size={16} /> Start Session
                  </button>
                  <button 
                    className="btn-secondary btn-sm"
                    onClick={() => openChat(bk)}
                    style={{ height: '42px', marginTop: '16px' }}
                  >
                    <MessageCircle size={16} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
