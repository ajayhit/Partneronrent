import React from 'react';
import { formatCurrency } from '../../../utils/helpers';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Wallet,
  Heart,
  Star,
  Bell,
  Search,
  MessageCircle,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  MapPin,
  KeyRound,
  Eye,
  TrendingUp,
  CreditCard
} from 'lucide-react';

export default function DashboardTab({
  client,
  bookings = [],
  favorites = [],
  reviews = [],
  notifications = [],
  onTabChange,
  onSelectBooking,
  openChat,
  openSOS,
  openReview,
  onFindCompanion
}) {
  const todayStr = new Date().toISOString().split('T')[0];

  // Specific booking classifications
  const activeBooking = bookings.find(b => b.status === 'in-progress');
  const todayBooking = bookings.find(b => b.date === todayStr && b.status !== 'completed' && b.status !== 'cancelled');
  const upcomingBooking = bookings.find(b => b.status === 'confirmed');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const totalBookings = bookings.length;

  const totalSpent = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0) +
    (activeBooking ? (activeBooking.totalAmount || 0) : 0);

  const pendingPayment = bookings
    .filter(b => b.status === 'pending' || b.paymentStatus === 'pending')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div>
      {/* Top Welcome / Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%)',
        border: '1px solid rgba(236, 72, 153, 0.3)',
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
          <img
            src={client?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'}
            alt={client?.name}
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #ec4899'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="client-badge client-badge-pink">✓ Verified Hirer</span>
              <span style={{ fontSize: '0.84rem', color: '#94a3b8' }}>📍 {client?.city || 'Delhi NCR'}</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Welcome back, {client?.name?.split(' ')[0] || 'Rahul'}!
            </h1>
            <p style={{ fontSize: '0.86rem', color: '#cbd5e1', margin: '3px 0 0' }}>
              Find safe, platonic companions for cinema, cafes, dining, and city exploration.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onTabChange('find')}
            className="btn-primary"
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              fontSize: '0.95rem'
            }}
          >
            <Search size={17} /> Find a Companion
          </button>
          <button
            onClick={() => onTabChange('wallet')}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Wallet size={16} /> Wallet: {formatCurrency(client?.walletBalance || 4500)}
          </button>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="client-stats-grid">
        {/* 1. Upcoming Booking */}
        <div className="client-stat-card" onClick={() => onTabChange('bookings')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="client-stat-label">Upcoming Booking</div>
            <div className="client-stat-value" style={{ fontSize: '1.35rem', color: '#38bdf8' }}>
              {upcomingBooking ? upcomingBooking.partnerName : 'None Scheduled'}
            </div>
            <div className="client-stat-subtext">
              {upcomingBooking ? `${upcomingBooking.date} • ${upcomingBooking.startTime}` : 'Hire a companion today'}
            </div>
          </div>
          <div className="client-stat-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            <Calendar size={22} />
          </div>
        </div>

        {/* 2. Today's Booking */}
        <div className="client-stat-card">
          <div>
            <div className="client-stat-label">Today's Booking</div>
            <div className="client-stat-value" style={{ color: todayBooking ? '#f472b6' : '#cbd5e1' }}>
              {todayBooking ? '1 Scheduled' : 'None Today'}
            </div>
            <div className="client-stat-subtext">
              {todayBooking ? `${todayBooking.serviceName} at ${todayBooking.startTime}` : 'No sessions today'}
            </div>
          </div>
          <div className="client-stat-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
            <Clock size={22} />
          </div>
        </div>

        {/* 3. Active Booking */}
        <div className="client-stat-card">
          <div>
            <div className="client-stat-label">Active Booking</div>
            <div className="client-stat-value" style={{ color: activeBooking ? '#fbbf24' : '#cbd5e1' }}>
              {activeBooking ? 'Session Running' : 'None Active'}
            </div>
            <div className="client-stat-subtext">
              {activeBooking ? `${activeBooking.partnerName} (${activeBooking.serviceName})` : 'Timer starts with OTP'}
            </div>
          </div>
          <div className="client-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <ShieldCheck size={22} />
          </div>
        </div>

        {/* 4. Completed Bookings */}
        <div className="client-stat-card">
          <div>
            <div className="client-stat-label">Completed Bookings</div>
            <div className="client-stat-value" style={{ color: '#34d399' }}>
              {completedBookings.length}
            </div>
            <div className="client-stat-subtext">Verified safe sessions</div>
          </div>
          <div className="client-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* 5. Total Bookings */}
        <div className="client-stat-card">
          <div>
            <div className="client-stat-label">Total Bookings</div>
            <div className="client-stat-value">
              {totalBookings}
            </div>
            <div className="client-stat-subtext">Lifetime companionship hires</div>
          </div>
          <div className="client-stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
            <Calendar size={22} />
          </div>
        </div>

        {/* 6. Total Spent */}
        <div className="client-stat-card">
          <div>
            <div className="client-stat-label">Total Spent</div>
            <div className="client-stat-value" style={{ color: '#f472b6' }}>
              {formatCurrency(totalSpent)}
            </div>
            <div className="client-stat-subtext">Includes all companion sessions</div>
          </div>
          <div className="client-stat-icon" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' }}>
            <TrendingUp size={22} />
          </div>
        </div>

        {/* 7. Pending Payment */}
        <div className="client-stat-card">
          <div>
            <div className="client-stat-label">Pending Payment</div>
            <div className="client-stat-value" style={{ color: pendingPayment > 0 ? '#fbbf24' : '#34d399' }}>
              {formatCurrency(pendingPayment)}
            </div>
            <div className="client-stat-subtext">
              {pendingPayment > 0 ? 'Due upon booking confirmation' : 'All accounts settled'}
            </div>
          </div>
          <div className="client-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <CreditCard size={22} />
          </div>
        </div>

        {/* 8. Favorite Partners */}
        <div className="client-stat-card" onClick={() => onTabChange('favorites')} style={{ cursor: 'pointer' }}>
          <div>
            <div className="client-stat-label">Favorite Partners</div>
            <div className="client-stat-value" style={{ color: '#f43f5e' }}>
              {favorites.length || 3}
            </div>
            <div className="client-stat-subtext">Click to view saved companions</div>
          </div>
          <div className="client-stat-icon" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e' }}>
            <Heart size={22} />
          </div>
        </div>
      </div>

      {/* Highlighted Upcoming Booking Card (as specifically detailed in user prompt!) */}
      {upcomingBooking && (
        <div className="client-panel" style={{ border: '1px solid rgba(56, 189, 248, 0.4)', background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(20, 28, 46, 0.9) 100%)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="client-badge client-badge-cyan">Upcoming Booking</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>#{upcomingBooking.id}</span>
            </div>
            <button
              className="client-subtab-btn"
              onClick={() => onSelectBooking(upcomingBooking)}
            >
              View Full Details →
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img
                src={upcomingBooking.partnerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={upcomingBooking.partnerName}
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #38bdf8' }}
              />
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                  Partner: {upcomingBooking.partnerName}
                </div>
                <div style={{ fontSize: '0.88rem', color: '#38bdf8', fontWeight: 600 }}>
                  Service: {upcomingBooking.serviceName}
                </div>
                <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginTop: '4px' }}>
                  Date: <strong>{upcomingBooking.date}</strong> • Time: <strong>{upcomingBooking.startTime}</strong> ({upcomingBooking.durationHours} Hours Duration)
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
                  📍 {upcomingBooking.meetingLocation}
                </div>
              </div>
            </div>

            {/* OTP and quick action */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '14px 20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#cbd5e1', textTransform: 'uppercase', fontWeight: 700 }}>
                Your Starting Session OTP
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399', letterSpacing: '0.15em', margin: '2px 0' }}>
                {upcomingBooking.startOtp || '4921'}
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                Share with companion at venue to start
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Ongoing Session (if any) */}
      {activeBooking && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(20, 28, 46, 0.9) 100%)',
          border: '2px solid rgba(245, 158, 11, 0.5)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '26px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="client-badge client-badge-amber">● Ongoing Active Session</span>
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>#{activeBooking.id}</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: '2px 0' }}>
              Companion: {activeBooking.partnerName} • {activeBooking.serviceName}
            </h3>
            <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginTop: '4px' }}>
              📍 {activeBooking.meetingLocation}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              className="btn-secondary"
              onClick={() => openChat(activeBooking)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <MessageCircle size={16} /> Chat Companion
            </button>
            <button
              className="btn-danger"
              onClick={() => openSOS(activeBooking)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <AlertTriangle size={16} /> SOS Help
            </button>
          </div>
        </div>
      )}

      {/* Two-Column Grid: Favorite Partners & Recent Reviews */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '26px' }}>
        
        {/* Favorite Partners Widget */}
        <div className="client-panel" style={{ marginBottom: 0 }}>
          <div className="client-panel-header">
            <div className="client-panel-title">
              <Heart size={18} color="#f43f5e" />
              <span>Favorite Companions</span>
            </div>
            <button
              className="client-subtab-btn"
              onClick={() => onTabChange('favorites')}
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(favorites.length > 0 ? favorites : [
              { id: 'partner-p1', name: 'Aanya Sharma', city: 'Delhi NCR', rating: 4.95, rate: 500, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', services: '🎬 Movie • ☕ Cafe' },
              { id: 'partner-p2', name: 'Kabir Mathur', city: 'Mumbai', rating: 4.88, rate: 600, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', services: '🚶 Exploration • 🛍️ Shopping' }
            ]).map(fav => (
              <div
                key={fav.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: 'rgba(15, 22, 38, 0.6)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={fav.avatar}
                    alt={fav.name}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <strong style={{ color: '#fff', fontSize: '0.92rem' }}>{fav.name}</strong>
                    <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                      ⭐ {fav.rating} • {fav.city}
                    </div>
                  </div>
                </div>

                <button
                  className="btn-primary btn-sm"
                  onClick={() => onFindCompanion(fav)}
                  style={{ background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)' }}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews Widget */}
        <div className="client-panel" style={{ marginBottom: 0 }}>
          <div className="client-panel-header">
            <div className="client-panel-title">
              <Star size={18} color="#fbbf24" />
              <span>Your Recent Reviews</span>
            </div>
            <button
              className="client-subtab-btn"
              onClick={() => onTabChange('reviews')}
            >
              Manage Reviews <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { id: 1, partner: 'Aanya Sharma', service: 'Cafe & Conversation', rating: 5, date: '18 Sep 2026', comment: 'Aanya was a wonderful listener! Discussed cinema and art. Highly recommended.' },
              { id: 2, partner: 'Kabir Mathur', service: 'City Exploration', rating: 5, date: '04 Sep 2026', comment: 'Punctual, energetic, and knew all the great heritage photo spots in Bandra.' }
            ].map(rev => (
              <div
                key={rev.id}
                style={{
                  padding: '12px 14px',
                  background: 'rgba(15, 22, 38, 0.6)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ color: '#fff', fontSize: '0.88rem' }}>{rev.partner}</strong>
                  <div style={{ display: 'flex', gap: '2px', color: '#fbbf24' }}>
                    {[...Array(rev.rating)].map((_, i) => <Star key={i} size={12} fill="#fbbf24" />)}
                  </div>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#38bdf8' }}>{rev.service} • {rev.date}</div>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: '4px 0 0', fontStyle: 'italic' }}>
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Notifications Stream Preview */}
      <div className="client-panel">
        <div className="client-panel-header">
          <div className="client-panel-title">
            <Bell size={18} color="#38bdf8" />
            <span>Recent Activity & Notifications</span>
          </div>
          <button
            className="client-subtab-btn"
            onClick={() => onTabChange('notifications')}
          >
            All Notifications <ArrowUpRight size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: 1, title: 'Booking Confirmed', text: 'Booking BK-10025 with Rahul has been confirmed for 28 Sep 2026 at 06:00 PM.', time: '2 hours ago', icon: Calendar, color: '#38bdf8' },
            { id: 2, title: 'Payment Successful', text: '₹1,500 was successfully paid from your wallet for booking BK-10025.', time: '2 hours ago', icon: Wallet, color: '#10b981' },
            { id: 3, title: 'Coupons Available', text: 'Use code WELCOME100 for ₹100 off on your next cinema companionship session!', time: '1 day ago', icon: Star, color: '#f472b6' }
          ].map(notif => (
            <div
              key={notif.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'rgba(15, 22, 38, 0.4)',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${notif.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <notif.icon size={16} color={notif.color} />
                </div>
                <div>
                  <strong style={{ color: '#fff', fontSize: '0.86rem' }}>{notif.title}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{notif.text}</div>
                </div>
              </div>
              <span style={{ fontSize: '0.74rem', color: '#64748b', whiteSpace: 'nowrap' }}>{notif.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
