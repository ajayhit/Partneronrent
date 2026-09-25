import React, { useState } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Users, 
  HeartHandshake, 
  MapPin,
  ArrowUpRight
} from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';

export default function ReportsTab({
  stats,
  partners = [],
  bookings = []
}) {
  const [reportView, setReportView] = useState('revenue');

  const topPartnersByEarnings = [...partners].sort((a, b) => (b.totalEarnings || 0) - (a.totalEarnings || 0)).slice(0, 5);

  const avgBookingValue = stats?.gmv && stats?.totalBookings ? Math.round(stats.gmv / stats.totalBookings) : 3400;

  return (
    <div>
      {/* Header Tabs */}
      <div className="admin-card-header">
        <div className="admin-filter-tabs">
          <button
            className={`admin-filter-btn ${reportView === 'revenue' ? 'active' : ''}`}
            onClick={() => setReportView('revenue')}
          >
            Business & Revenue Reports
          </button>
          <button
            className={`admin-filter-btn ${reportView === 'partners' ? 'active' : ''}`}
            onClick={() => setReportView('partners')}
          >
            Partner Performance Reports
          </button>
          <button
            className={`admin-filter-btn ${reportView === 'customers' ? 'active' : ''}`}
            onClick={() => setReportView('customers')}
          >
            Customer Analytics
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Average Booking Value (AOV)</div>
          <div className="admin-stat-value" style={{ color: '#38bdf8' }}>
            {formatCurrency(avgBookingValue)}
          </div>
          <div className="admin-stat-footer" style={{ color: '#34d399' }}>
            +12.5% festive season surge
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-label">Net Platform Margin</div>
          <div className="admin-stat-value" style={{ color: '#c084fc' }}>
            18.2%
          </div>
          <div className="admin-stat-footer" style={{ color: '#94a3b8' }}>
            After payment gateway fees
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-label">Repeat Hirer Rate</div>
          <div className="admin-stat-value" style={{ color: '#34d399' }}>
            44.8%
          </div>
          <div className="admin-stat-footer" style={{ color: '#34d399' }}>
            Strong loyalty in Delhi NCR & Mumbai
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-label">Dispute Resolution Rate</div>
          <div className="admin-stat-value" style={{ color: '#fbbf24' }}>
            98.5%
          </div>
          <div className="admin-stat-footer" style={{ color: '#94a3b8' }}>
            Avg resolution time 2.4 hrs
          </div>
        </div>
      </div>

      {/* Main Report View */}
      {reportView === 'revenue' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
          <div className="admin-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', color: '#fff' }}>
              Monthly Gross Merchandise Volume (GMV)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(stats?.charts?.monthlyRevenue || [
                { month: 'April 2026', revenue: 180000 },
                { month: 'May 2026', revenue: 240000 },
                { month: 'June 2026', revenue: 310000 },
                { month: 'July 2026', revenue: 395000 },
                { month: 'August 2026', revenue: 470000 },
                { month: 'September 2026', revenue: 585000 }
              ]).map((m, mIdx) => (
                <div key={mIdx} style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <strong style={{ color: '#fff' }}>{m.month}</strong>
                  <span style={{ fontWeight: 800, color: '#34d399' }}>{formatCurrency(m.revenue)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', color: '#fff' }}>
              City Revenue Contribution
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { city: 'Delhi NCR', share: '42%', rev: '₹2,84,000' },
                { city: 'Mumbai', share: '31%', rev: '₹2,15,000' },
                { city: 'Bangalore', share: '18%', rev: '₹1,72,000' },
                { city: 'Jaipur & Rajasthan', share: '9%', rev: '₹98,000' }
              ].map((c, cIdx) => (
                <div key={cIdx} style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '10px',
                  padding: '12px 14px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, color: '#fff' }}>{c.city}</span>
                    <span style={{ fontWeight: 700, color: '#38bdf8' }}>{c.rev} ({c.share})</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: c.share, height: '100%', background: '#38bdf8' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {reportView === 'partners' && (
        <div className="admin-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', color: '#fff' }}>
            Top Performing Partners by Earnings & Ratings
          </h3>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Rank & Partner</th>
                  <th>City</th>
                  <th>Lifetime Earnings</th>
                  <th>Hours Completed</th>
                  <th>Rating</th>
                  <th>Cancellation Rate</th>
                  <th>No-Show Rate</th>
                </tr>
              </thead>
              <tbody>
                {topPartnersByEarnings.map((p, pIdx) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 800, color: '#38bdf8' }}>#{pIdx + 1}</span>
                        <img src={p.avatar} alt={p.name} style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover' }} />
                        <strong>{p.name}</strong>
                      </div>
                    </td>
                    <td>{p.city}</td>
                    <td><strong style={{ color: '#34d399' }}>{formatCurrency(p.totalEarnings || 0)}</strong></td>
                    <td>{p.completedHours || 0}h</td>
                    <td><strong style={{ color: '#fbbf24' }}>★ {p.rating || 5.0}</strong></td>
                    <td>{p.cancellationRate || '1.5%'}</td>
                    <td>0% (Flawless)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportView === 'customers' && (
        <div className="admin-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', color: '#fff' }}>
            Customer Booking Demographics & Retention
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>NEW CUSTOMERS (THIS MONTH)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', margin: '4px 0' }}>148 Hirers</div>
              <div style={{ fontSize: '0.76rem', color: '#34d399' }}>+24% month-on-month</div>
            </div>
            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>REPEAT Hirers</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#c084fc', margin: '4px 0' }}>68 Hirers</div>
              <div style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>Avg 3.2 bookings per user</div>
            </div>
            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>TOP BOOKED SERVICE</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fbbf24', margin: '4px 0' }}>Cafe & Conversation</div>
              <div style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>46% of total session hours</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
