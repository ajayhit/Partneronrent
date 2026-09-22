import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { fetchBookings, fetchWallet } from '../../utils/api';
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/helpers';
import SafetyBanner from '../../components/SafetyBanner';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  MessageCircle, 
  AlertTriangle, 
  Star, 
  Wallet, 
  Plus, 
  KeyRound, 
  Search,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export default function ClientDashboard({ setActivePage, onSelectPartner }) {
  const { activeUser } = useAuth();
  const { openChat, openSOS, openReview, showToast } = useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'active', 'upcoming', 'completed'

  useEffect(() => {
    loadData();
  }, [activeUser?.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchBookings({ clientId: activeUser?.id || 'client-1' });
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filterTab === 'active') return b.status === 'in-progress';
    if (filterTab === 'upcoming') return b.status === 'confirmed' || b.status === 'pending';
    if (filterTab === 'completed') return b.status === 'completed';
    return true;
  });

  const activeSession = bookings.find(b => b.status === 'in-progress');

  return (
    <div className="container" style={{ paddingBottom: '70px' }}>
      
      {/* Client Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 0 10px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: '#ec4899', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Hirer Portal
          </div>
          <h1 style={{ fontSize: '2.2rem' }}>Welcome back, {activeUser?.name || 'Rahul'}</h1>
          <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            Manage your companion bookings, live sessions, safety OTPs, and wallet.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Wallet summary card */}
          <div 
            onClick={() => setActivePage('client-wallet')}
            style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid var(--border-active)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(236, 72, 153, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Wallet size={18} color="#ec4899" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Wallet Balance</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                {formatCurrency(activeUser?.walletBalance || 4500)}
              </div>
            </div>
          </div>

          <button 
            className="btn-primary"
            onClick={() => setActivePage('directory')}
          >
            <Search size={16} /> Hire New Partner
          </button>
        </div>
      </div>

      <SafetyBanner />

      {/* Live Active Session Banner (if any) */}
      {activeSession && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(236, 72, 153, 0.18) 100%)',
          border: '2px solid rgba(245, 158, 11, 0.5)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: '0 0 25px rgba(245, 158, 11, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <img 
                src={activeSession.partnerAvatar} 
                alt={activeSession.partnerName}
                style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f59e0b' }}
              />
              <span className="badge-online" style={{ position: 'absolute', bottom: '2px', right: '2px', width: '14px', height: '14px' }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge badge-warning">● Live Session In-Progress</span>
                <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Booking #{activeSession.id}</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#fff' }}>
                Companion: {activeSession.partnerName} ({activeSession.serviceName})
              </h3>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
                <span><MapPin size={13} style={{ display: 'inline' }} /> {activeSession.meetingLocation}</span>
                <span>• Duration: {activeSession.durationHours} hrs</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              className="btn-secondary"
              onClick={() => openChat(activeSession)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <MessageCircle size={16} /> Chat Companion
            </button>

            <button 
              className="btn-danger"
              onClick={() => openSOS(activeSession)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <AlertTriangle size={16} /> Emergency SOS
            </button>
          </div>
        </div>
      )}

      {/* Bookings Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        
        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '16px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <h2 style={{ fontSize: '1.35rem' }}>Your Companion Sessions</h2>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button 
              className={`tab-btn ${filterTab === 'all' ? 'active' : ''}`}
              onClick={() => setFilterTab('all')}
            >
              All ({bookings.length})
            </button>
            <button 
              className={`tab-btn ${filterTab === 'active' ? 'active' : ''}`}
              onClick={() => setFilterTab('active')}
            >
              Active
            </button>
            <button 
              className={`tab-btn ${filterTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilterTab('upcoming')}
            >
              Upcoming
            </button>
            <button 
              className={`tab-btn ${filterTab === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterTab('completed')}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
            Loading your bookings...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#94a3b8' }}>
            <Calendar size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <div style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '6px' }}>No bookings found</div>
            <p style={{ fontSize: '0.85rem', marginBottom: '16px' }}>You don't have any bookings matching this category.</p>
            <button className="btn-primary btn-sm" onClick={() => setActivePage('directory')}>
              Hire a Companion Now
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredBookings.map(item => {
              const badge = getStatusBadge(item.status);
              return (
                <div 
                  key={item.id}
                  style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: item.status === 'in-progress' ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '20px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '260px' }}>
                    <img 
                      src={item.partnerAvatar} 
                      alt={item.partnerName}
                      style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className={`badge ${badge.className}`}>{badge.label}</span>
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>#{item.id}</span>
                      </div>
                      <h4 style={{ fontSize: '1.1rem', color: '#fff' }}>
                        {item.partnerName}
                      </h4>
                      <div style={{ fontSize: '0.85rem', color: '#c084fc', fontWeight: 600 }}>
                        {item.serviceName}
                      </div>
                    </div>
                  </div>

                  {/* Date, Time & Venue */}
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="#ec4899" /> {item.date} at {item.startTime} ({item.durationHours} hrs)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', maxWidth: '280px' }}>
                      <MapPin size={14} color="#38bdf8" />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.meetingLocation}
                      </span>
                    </div>
                    <div>
                      Total Paid: <strong style={{ color: '#fff' }}>{formatCurrency(item.totalAmount)}</strong>
                    </div>
                  </div>

                  {/* OTP & Action controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {/* Security Start OTP */}
                    {(item.status === 'confirmed' || item.status === 'pending') && (
                      <div style={{
                        background: 'rgba(124, 58, 237, 0.15)',
                        border: '1px dashed #a78bfa',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 14px',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#a78bfa', fontWeight: 700 }}>
                          Session Start OTP
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '0.1em' }}>
                          {item.startOtp}
                        </div>
                      </div>
                    )}

                    <button 
                      className="btn-secondary btn-sm"
                      onClick={() => openChat(item)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <MessageCircle size={15} /> Chat
                    </button>

                    {item.status === 'completed' && !item.rating && (
                      <button 
                        className="btn-primary btn-sm"
                        onClick={() => openReview(item)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Star size={15} /> Rate Session
                      </button>
                    )}

                    {item.status === 'completed' && item.rating && (
                      <div style={{ fontSize: '0.82rem', color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={14} fill="#fbbf24" /> Rated {item.rating}★
                      </div>
                    )}

                    {item.status === 'in-progress' && (
                      <button 
                        className="btn-danger btn-sm"
                        onClick={() => openSOS(item)}
                      >
                        <AlertTriangle size={15} /> SOS
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
