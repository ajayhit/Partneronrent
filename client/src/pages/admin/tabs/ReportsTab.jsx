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

  const avgBookingValue = stats?.gmv && stats?.totalBookings ? Math.round(stats.gmv / stats.totalBookings) : 0;
  const netMargin = stats?.gmv > 0 ? `${Math.round(((stats.platformRevenue || 0) / stats.gmv) * 100)}%` : '0%';
  const completionRate = stats?.totalBookings > 0 ? `${Math.round(((stats.completedBookingsCount || 0) / stats.totalBookings) * 100)}%` : '0%';
  const monthlyRevenue = stats?.charts?.monthlyRevenue || [];
  const cityStats = stats?.cityStats || [];
  const totalCityRev = cityStats.reduce((sum, c) => sum + (c.revenue || 0), 0);

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
          <div className="admin-stat-footer" style={{ color: stats?.totalBookings > 0 ? '#34d399' : '#94a3b8' }}>
            {stats?.totalBookings > 0 ? `Across ${stats.totalBookings} total sessions` : 'No bookings completed yet'}
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-label">Net Platform Margin</div>
          <div className="admin-stat-value" style={{ color: '#c084fc' }}>
            {netMargin}
          </div>
          <div className="admin-stat-footer" style={{ color: '#94a3b8' }}>
            Platform fee after gateway costs
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-label">Session Completion Rate</div>
          <div className="admin-stat-value" style={{ color: '#34d399' }}>
            {completionRate}
          </div>
          <div className="admin-stat-footer" style={{ color: '#34d399' }}>
            {stats?.completedBookingsCount || 0} successfully concluded
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-label">Dispute Resolution Rate</div>
          <div className="admin-stat-value" style={{ color: '#fbbf24' }}>
            {stats?.openDisputes === 0 ? '100%' : 'In Progress'}
          </div>
          <div className="admin-stat-footer" style={{ color: '#94a3b8' }}>
            {stats?.openDisputes > 0 ? `${stats.openDisputes} disputes pending` : 'Zero open disputes'}
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
              {monthlyRevenue.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                  No monthly GMV data available yet.
                </div>
              ) : (
                monthlyRevenue.map((m, mIdx) => (
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
                ))
              )}
            </div>
          </div>

          <div className="admin-card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '14px', color: '#fff' }}>
              City Revenue Contribution
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cityStats.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                  No city revenue recorded yet.
                </div>
              ) : (
                cityStats.map((c, cIdx) => {
                  const sharePct = totalCityRev > 0 ? Math.round((c.revenue / totalCityRev) * 100) : 0;
                  return (
                    <div key={cIdx} style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '10px',
                      padding: '12px 14px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, color: '#fff' }}>{c.city}</span>
                        <span style={{ fontWeight: 700, color: '#38bdf8' }}>{formatCurrency(c.revenue)} ({sharePct}%)</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${sharePct}%`, height: '100%', background: '#38bdf8' }} />
                      </div>
                    </div>
                  );
                })
              )}
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
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {topPartnersByEarnings.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                      No partner records found.
                    </td>
                  </tr>
                ) : (
                  topPartnersByEarnings.map((p, pIdx) => (
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
                      <td>{p.cancellationRate || '0%'}</td>
                      <td><span className="admin-badge admin-badge-emerald">{p.status || 'Active'}</span></td>
                    </tr>
                  ))
                )}
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
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>TOTAL REGISTERED CUSTOMERS</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', margin: '4px 0' }}>
                {stats?.totalCustomers || 0} Hirers
              </div>
              <div style={{ fontSize: '0.76rem', color: '#34d399' }}>Verified user profiles</div>
            </div>
            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>COMPLETED SESSIONS</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#c084fc', margin: '4px 0' }}>
                {stats?.completedBookingsCount || 0} Sessions
              </div>
              <div style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>Across all categories</div>
            </div>
            <div style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>ACTIVE VERIFIED PARTNERS</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24', margin: '4px 0' }}>
                {stats?.activePartners || 0} Partners
              </div>
              <div style={{ fontSize: '0.76rem', color: '#cbd5e1' }}>Ready to accept bookings</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
