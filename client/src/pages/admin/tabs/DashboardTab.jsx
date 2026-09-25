import React from 'react';
import { 
  Users, 
  HeartHandshake, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  ShieldAlert,
  ArrowUpRight,
  MapPin
} from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';

export default function DashboardTab({ stats, onNavigate }) {
  const dailyData = stats?.charts?.dailyRevenue || [
    { day: 'Mon', revenue: 14500, bookings: 4 },
    { day: 'Tue', revenue: 18200, bookings: 6 },
    { day: 'Wed', revenue: 22400, bookings: 7 },
    { day: 'Thu', revenue: 19800, bookings: 5 },
    { day: 'Fri', revenue: 34500, bookings: 11 },
    { day: 'Sat', revenue: 48900, bookings: 16 },
    { day: 'Sun', revenue: 52100, bookings: 18 }
  ];

  const maxRevenue = Math.max(...dailyData.map(d => d.revenue), 60000);

  return (
    <div>
      {/* ── ROW 1: CORE REVENUE & GMV ────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        <div className="admin-stat-card">
          <div className="admin-stat-label">
            <span>Today's Revenue</span>
            <DollarSign size={14} color="#34d399" />
          </div>
          <div className="admin-stat-value" style={{ color: '#34d399' }}>
            {formatCurrency(stats?.todayRevenue || 12450)}
          </div>
          <div className="admin-stat-footer" style={{ color: '#34d399' }}>
            <TrendingUp size={12} /> +18.4% vs yesterday
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-label">
            <span>Total Platform GMV</span>
            <TrendingUp size={14} color="#38bdf8" />
          </div>
          <div className="admin-stat-value">
            {formatCurrency(stats?.gmv || 0)}
          </div>
          <div className="admin-stat-footer" style={{ color: '#94a3b8' }}>
            Across {stats?.totalBookings || 0} total sessions
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-label">
            <span>Platform Commission</span>
            <span style={{ fontSize: '0.7rem', color: '#c084fc', background: 'rgba(192, 132, 252, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
              NET PROFIT
            </span>
          </div>
          <div className="admin-stat-value" style={{ color: '#c084fc' }}>
            {formatCurrency(stats?.platformRevenue || 0)}
          </div>
          <div className="admin-stat-footer" style={{ color: '#94a3b8' }}>
            Avg margin 18.5% across services
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-label">
            <span>Partner Earnings</span>
            <HeartHandshake size={14} color="#f472b6" />
          </div>
          <div className="admin-stat-value" style={{ color: '#f472b6' }}>
            {formatCurrency(stats?.partnerEarnings || 0)}
          </div>
          <div className="admin-stat-footer" style={{ color: '#94a3b8' }}>
            Disbursed: {formatCurrency(stats?.partnerPayoutsDisbursed || 0)}
          </div>
        </div>
      </div>

      {/* ── ROW 2: BOOKINGS VELOCITY ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="admin-stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('bookings', 'all')}>
          <div className="admin-stat-label">
            <span>Today's Bookings</span>
            <Calendar size={14} color="#38bdf8" />
          </div>
          <div className="admin-stat-value">{stats?.todayBookings || 3}</div>
          <div className="admin-stat-footer" style={{ color: '#38bdf8' }}>
            <span>Live check-ins today</span>
          </div>
        </div>

        <div className="admin-stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('bookings', 'upcoming')}>
          <div className="admin-stat-label">
            <span>Upcoming Bookings</span>
            <Clock size={14} color="#fbbf24" />
          </div>
          <div className="admin-stat-value" style={{ color: '#fbbf24' }}>
            {stats?.upcomingBookingsCount || 0}
          </div>
          <div className="admin-stat-footer" style={{ color: '#94a3b8' }}>
            Next 48 hours pipeline
          </div>
        </div>

        <div className="admin-stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('bookings', 'completed')}>
          <div className="admin-stat-label">
            <span>Completed Bookings</span>
            <CheckCircle2 size={14} color="#34d399" />
          </div>
          <div className="admin-stat-value" style={{ color: '#34d399' }}>
            {stats?.completedBookingsCount || 0}
          </div>
          <div className="admin-stat-footer" style={{ color: '#34d399' }}>
            99.2% positive ratings
          </div>
        </div>

        <div className="admin-stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('bookings', 'cancelled')}>
          <div className="admin-stat-label">
            <span>Cancelled Bookings</span>
            <XCircle size={14} color="#f87171" />
          </div>
          <div className="admin-stat-value" style={{ color: '#f87171' }}>
            {stats?.cancelledBookingsCount || 0}
          </div>
          <div className="admin-stat-footer" style={{ color: '#94a3b8' }}>
            Refunds: {formatCurrency(stats?.totalRefunds || 0)}
          </div>
        </div>
      </div>

      {/* ── ROW 3: PEOPLE, TRUST & SAFETY PIPELINE ───────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="admin-stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('customers', 'all')}>
          <div className="admin-stat-label">
            <span>Total Customers</span>
            <Users size={14} color="#38bdf8" />
          </div>
          <div className="admin-stat-value">{stats?.totalCustomers || 0}</div>
          <div className="admin-stat-footer" style={{ color: '#34d399' }}>
            Active verified hirers
          </div>
        </div>

        <div className="admin-stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('partners', 'all')}>
          <div className="admin-stat-label">
            <span>Active Partners</span>
            <HeartHandshake size={14} color="#34d399" />
          </div>
          <div className="admin-stat-value" style={{ color: '#34d399' }}>
            {stats?.activePartners || 0} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>/ {stats?.totalPartners || 0}</span>
          </div>
          <div className="admin-stat-footer" style={{ color: '#94a3b8' }}>
            Online & available now
          </div>
        </div>

        <div className="admin-stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('kyc', 'pending')}>
          <div className="admin-stat-label">
            <span>Pending Partner KYC</span>
            <ShieldCheck size={14} color="#fbbf24" />
          </div>
          <div className="admin-stat-value" style={{ color: '#fbbf24' }}>
            {stats?.pendingKYC || 0}
          </div>
          <div className="admin-stat-footer" style={{ color: stats?.pendingKYC > 0 ? '#fbbf24' : '#94a3b8' }}>
            Awaiting ID verification
          </div>
        </div>

        <div className="admin-stat-card" style={{ cursor: 'pointer' }} onClick={() => onNavigate('safety', 'all')}>
          <div className="admin-stat-label">
            <span>Safety Alerts & SOS</span>
            <ShieldAlert size={14} color="#f87171" />
          </div>
          <div className="admin-stat-value" style={{ color: stats?.safetyAlertsCount > 0 ? '#f87171' : '#34d399' }}>
            {stats?.safetyAlertsCount || 0}
          </div>
          <div className="admin-stat-footer" style={{ color: stats?.safetyAlertsCount > 0 ? '#f87171' : '#34d399' }}>
            {stats?.activeSOS > 0 ? `🚨 ${stats.activeSOS} Active Emergency SOS` : 'Zero active emergencies'}
          </div>
        </div>
      </div>

      {/* ── CHARTS & CITY-WISE STATISTICS ────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Interactive Revenue & Bookings Weekly Chart */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <div className="admin-card-title">
                <TrendingUp size={18} color="#38bdf8" /> Weekly Revenue & Session Volume
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Daily booking gross transaction volume across top metro tiers
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#38bdf8' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#38bdf8' }} /> Revenue (₹)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#a855f7' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#a855f7' }} /> Bookings
              </span>
            </div>
          </div>

          {/* SVG Bar & Sparkline Graphic */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', padding: '10px 0 20px', gap: '12px' }}>
            {dailyData.map((item, idx) => {
              const heightPct = Math.round((item.revenue / maxRevenue) * 100);
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>
                    ₹{(item.revenue / 1000).toFixed(1)}k
                  </div>
                  <div style={{
                    width: '100%',
                    maxWidth: '42px',
                    height: `${heightPct}%`,
                    background: 'linear-gradient(180deg, #38bdf8 0%, rgba(2, 132, 199, 0.4) 100%)',
                    borderRadius: '8px 8px 3px 3px',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(56, 189, 248, 0.2)'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-18px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: '#c084fc'
                    }}>
                      {item.bookings}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '10px', fontWeight: 600 }}>
                    {item.day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* City-wise Booking Statistics */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">
              <MapPin size={18} color="#fbbf24" /> Top City Performance
            </div>
            <button
              onClick={() => onNavigate('locations', 'all')}
              style={{ fontSize: '0.76rem', color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}
            >
              All 20+ Cities <ArrowUpRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(stats?.cityStats || [
              { city: 'Delhi NCR', bookings: 84, revenue: 284000 },
              { city: 'Mumbai', bookings: 62, revenue: 215000 },
              { city: 'Bangalore', bookings: 49, revenue: 172000 },
              { city: 'Jaipur', bookings: 31, revenue: 98000 }
            ]).map((c, cIdx) => (
              <div key={cIdx} style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                padding: '10px 14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>{c.city}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#34d399' }}>{formatCurrency(c.revenue)}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#94a3b8' }}>
                  <span>{c.bookings} Bookings Fulfilled</span>
                  <span>Avg ₹{Math.round(c.revenue / (c.bookings || 1))}/session</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
