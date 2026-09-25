import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  ExternalLink, 
  RotateCcw, 
  CheckCircle2, 
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../../utils/helpers';

export default function BookingsTab({
  bookings = [],
  subFilter = 'all',
  setSubFilter,
  onSelectBooking,
  onUpdateStatus,
  onRefund
}) {
  const [search, setSearch] = useState('');

  const filteredBookings = bookings.filter(b => {
    if (subFilter === 'upcoming' && b.status !== 'confirmed' && b.status !== 'pending') return false;
    if (subFilter === 'ongoing' && b.status !== 'in-progress') return false;
    if (subFilter === 'completed' && b.status !== 'completed') return false;
    if (subFilter === 'cancelled' && b.status !== 'cancelled' && b.status !== 'rejected') return false;
    if (subFilter === 'disputed' && b.status !== 'disputed') return false;

    if (search.trim() !== '') {
      const q = search.toLowerCase();
      const matchId = b.id?.toLowerCase().includes(q);
      const matchClient = b.clientName?.toLowerCase().includes(q);
      const matchPartner = b.partnerName?.toLowerCase().includes(q);
      const matchService = b.serviceName?.toLowerCase().includes(q);
      const matchLoc = b.meetingLocation?.toLowerCase().includes(q);
      return matchId || matchClient || matchPartner || matchService || matchLoc;
    }
    return true;
  });

  return (
    <div>
      {/* Header Controls */}
      <div className="admin-card-header">
        <div className="admin-filter-tabs">
          <button
            className={`admin-filter-btn ${subFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSubFilter('all')}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            className={`admin-filter-btn ${subFilter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setSubFilter('upcoming')}
          >
            Upcoming ({bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length})
          </button>
          <button
            className={`admin-filter-btn ${subFilter === 'ongoing' ? 'active' : ''}`}
            onClick={() => setSubFilter('ongoing')}
          >
            Ongoing ({bookings.filter(b => b.status === 'in-progress').length})
          </button>
          <button
            className={`admin-filter-btn ${subFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setSubFilter('completed')}
          >
            Completed ({bookings.filter(b => b.status === 'completed').length})
          </button>
          <button
            className={`admin-filter-btn ${subFilter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setSubFilter('cancelled')}
          >
            Cancelled ({bookings.filter(b => b.status === 'cancelled' || b.status === 'rejected').length})
          </button>
        </div>

        <div className="admin-search-box">
          <Search size={15} color="#64748b" />
          <input
            type="text"
            placeholder="Search booking ID, hirer, companion, city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Partner</th>
              <th>Service & Schedule</th>
              <th>Public Venue</th>
              <th>Fee Breakdown</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No bookings found matching this filter.
                </td>
              </tr>
            ) : (
              filteredBookings.map(b => (
                <tr key={b.id}>
                  <td>
                    <div style={{ fontWeight: 800, fontFamily: 'monospace', color: '#38bdf8' }}>{b.id}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>OTP: {b.startOtp || '****'}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{b.clientName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{b.clientPhone}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#e2e8f0' }}>{b.partnerName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>₹{b.hourlyRate}/hr</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{b.serviceName}</div>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} /> {b.date} • {b.startTime} ({b.durationHours || 2}h)
                    </div>
                  </td>
                  <td style={{ maxWidth: '200px' }}>
                    <div style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <MapPin size={11} color="#38bdf8" style={{ display: 'inline', marginRight: '4px' }} />
                      {b.meetingLocation}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#34d399' }}>{formatCurrency(b.totalAmount)}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      Partner: {formatCurrency(b.partnerShare || b.totalAmount * 0.8)}
                    </div>
                  </td>
                  <td>
                    <span className={`admin-badge ${
                      b.status === 'completed' ? 'admin-badge-emerald' :
                      b.status === 'in-progress' ? 'admin-badge-cyan' :
                      b.status === 'confirmed' ? 'admin-badge-purple' :
                      b.status === 'cancelled' ? 'admin-badge-rose' : 'admin-badge-amber'
                    }`}>
                      {b.status ? b.status.toUpperCase() : 'PENDING'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => onSelectBooking(b)}
                        className="btn-admin-action btn-admin-primary"
                        title="Inspect Booking & Timeline"
                      >
                        <ExternalLink size={13} /> View
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
