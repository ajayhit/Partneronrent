import React, { useState } from 'react';
import { formatCurrency, formatDateTime } from '../../../utils/helpers';
import {
  Wallet,
  TrendingUp,
  Clock,
  ArrowDownToLine,
  Percent,
  CheckCircle2,
  Calendar,
  Building2,
  CreditCard,
  Download,
  Info
} from 'lucide-react';

export default function EarningsTab({ partner, payouts = [], bookings = [], onTabChange, showToast }) {
  const [filterPeriod, setFilterPeriod] = useState('All Time');

  // Exact figures from the user's prompt specifications:
  const totalEarnings = 45500;
  const pendingEarnings = 3500;
  const availableBalance = 12000;
  const withdrawn = 30000;
  const platformCommission = 5000;

  // Completed bookings for earnings list
  const completedBookings = bookings.filter(b => b.status === 'completed');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            💵 Earnings & Financial Performance
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Transparent 80% net take-home calculation, real-time balance tracking, and lifetime payout records.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn-primary"
            onClick={() => onTabChange('payouts')}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowDownToLine size={16} /> Request Withdrawal
          </button>
        </div>
      </div>

      {/* Main 5 Metric Cards from User Specification */}
      <div className="partner-stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '26px' }}>
        {/* Total Earnings: ₹45,500 */}
        <div className="partner-stat-card">
          <div>
            <div className="partner-stat-label">Total Earnings</div>
            <div className="partner-stat-value" style={{ color: '#ffffff' }}>
              {formatCurrency(totalEarnings)}
            </div>
            <div className="partner-stat-subtext">80% net partner share</div>
          </div>
          <div className="partner-stat-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            <TrendingUp size={22} />
          </div>
        </div>

        {/* Pending Earnings: ₹3,500 */}
        <div className="partner-stat-card">
          <div>
            <div className="partner-stat-label">Pending Earnings</div>
            <div className="partner-stat-value" style={{ color: '#fbbf24' }}>
              {formatCurrency(pendingEarnings)}
            </div>
            <div className="partner-stat-subtext">Locked in active sessions</div>
          </div>
          <div className="partner-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Clock size={22} />
          </div>
        </div>

        {/* Available Balance: ₹12,000 */}
        <div className="partner-stat-card" style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}>
          <div>
            <div className="partner-stat-label">Available Balance</div>
            <div className="partner-stat-value" style={{ color: '#34d399' }}>
              {formatCurrency(availableBalance)}
            </div>
            <div className="partner-stat-subtext">Ready for instant UPI transfer</div>
          </div>
          <div className="partner-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
            <Wallet size={22} />
          </div>
        </div>

        {/* Withdrawn: ₹30,000 */}
        <div className="partner-stat-card">
          <div>
            <div className="partner-stat-label">Withdrawn</div>
            <div className="partner-stat-value" style={{ color: '#cbd5e1' }}>
              {formatCurrency(withdrawn)}
            </div>
            <div className="partner-stat-subtext">Settled to your Bank/UPI</div>
          </div>
          <div className="partner-stat-icon" style={{ background: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8' }}>
            <ArrowDownToLine size={22} />
          </div>
        </div>

        {/* Platform Commission: ₹5,000 */}
        <div className="partner-stat-card">
          <div>
            <div className="partner-stat-label">Platform Commission</div>
            <div className="partner-stat-value" style={{ color: '#c084fc' }}>
              {formatCurrency(platformCommission)}
            </div>
            <div className="partner-stat-subtext">20% safety & tech retainer</div>
          </div>
          <div className="partner-stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc' }}>
            <Percent size={22} />
          </div>
        </div>
      </div>

      {/* 80/20 Breakdown explainer banner */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '20px 24px',
        marginBottom: '26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Percent size={24} color="#34d399" />
          <div>
            <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.96rem' }}>
              How You Get Paid (80% Partner Take-Home)
            </div>
            <div style={{ fontSize: '0.84rem', color: '#94a3b8', marginTop: '2px' }}>
              Example: 3-hour session at ₹1,500/hr = ₹4,500 base. You receive <strong>₹3,600 (80%)</strong>. Platform retains 20% for insurance, verification, and safety.
            </div>
          </div>
        </div>

        <button
          className="btn-secondary btn-sm"
          onClick={() => onTabChange('payouts')}
        >
          View Bank & Payouts →
        </button>
      </div>

      {/* Interactive Monthly Revenue Bar Visual */}
      <div className="partner-panel">
        <div className="partner-panel-header">
          <div className="partner-panel-title">
            <TrendingUp size={18} color="#34d399" />
            <span>Monthly Earnings Trajectory</span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['Last 3 Months', 'This Year', 'All Time'].map(p => (
              <button
                key={p}
                onClick={() => setFilterPeriod(p)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  background: filterPeriod === p ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: filterPeriod === p ? '1px solid #10b981' : '1px solid transparent',
                  color: filterPeriod === p ? '#34d399' : '#94a3b8'
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Chart Bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '20px', gap: '14px' }}>
          {[
            { month: 'Apr', earned: 8400, height: '40%' },
            { month: 'May', earned: 12600, height: '58%' },
            { month: 'Jun', earned: 15400, height: '70%' },
            { month: 'Jul', earned: 18200, height: '82%' },
            { month: 'Aug', earned: 21000, height: '94%' },
            { month: 'Sep', earned: 24500, height: '100%' }
          ].map(bar => (
            <div key={bar.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '0.74rem', color: '#34d399', fontWeight: 700, marginBottom: '6px' }}>
                {formatCurrency(bar.earned)}
              </span>
              <div style={{
                width: '100%',
                maxWidth: '48px',
                height: bar.height,
                background: 'linear-gradient(to top, #059669, #10b981)',
                borderRadius: '6px 6px 0 0',
                transition: 'height 0.3s ease'
              }} />
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '8px' }}>
                {bar.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Sessions Earnings Ledger */}
      <div className="partner-panel">
        <div className="partner-panel-title" style={{ marginBottom: '16px' }}>
          <Calendar size={18} color="#38bdf8" />
          <span>Completed Sessions Breakdown</span>
        </div>

        <div className="partner-table-container">
          <table className="partner-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Client</th>
                <th>Service & Hours</th>
                <th>Session Date</th>
                <th>Client Fare</th>
                <th>Your 80% Payout</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {completedBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    No completed sessions yet.
                  </td>
                </tr>
              ) : (
                completedBookings.map(bk => (
                  <tr key={bk.id}>
                    <td><strong style={{ color: '#38bdf8' }}>#{bk.id}</strong></td>
                    <td>{bk.clientName}</td>
                    <td>{bk.serviceName} ({bk.durationHours} hrs)</td>
                    <td>{bk.date}</td>
                    <td>{formatCurrency(bk.totalAmount || 3000)}</td>
                    <td>
                      <strong style={{ color: '#34d399' }}>
                        {formatCurrency(bk.partnerShare || Math.round((bk.totalAmount || 3000) * 0.8))}
                      </strong>
                    </td>
                    <td><span className="partner-badge partner-badge-emerald">Credited</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
