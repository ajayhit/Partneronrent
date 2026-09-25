import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert,
  User
} from 'lucide-react';
import { formatDateTime } from '../../../utils/helpers';

export default function ComplaintsTab({
  complaints = [],
  subFilter = 'all',
  setSubFilter,
  onSelectDispute
}) {
  const [search, setSearch] = useState('');

  const filteredComplaints = complaints.filter(c => {
    if (subFilter === 'investigating' && c.status !== 'investigating' && c.status !== 'new') return false;
    if (subFilter === 'resolved' && c.status !== 'resolved') return false;
    if (subFilter === 'rejected' && c.status !== 'rejected') return false;

    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return (
        c.id?.toLowerCase().includes(q) ||
        c.bookingId?.toLowerCase().includes(q) ||
        c.complainantName?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      {/* Header Tabs */}
      <div className="admin-card-header">
        <div className="admin-filter-tabs">
          <button
            className={`admin-filter-btn ${subFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSubFilter('all')}
          >
            All Complaints ({complaints.length})
          </button>
          <button
            className={`admin-filter-btn ${subFilter === 'investigating' ? 'active' : ''}`}
            onClick={() => setSubFilter('investigating')}
          >
            Under Investigation ({complaints.filter(c => c.status === 'investigating' || c.status === 'new').length})
          </button>
          <button
            className={`admin-filter-btn ${subFilter === 'resolved' ? 'active' : ''}`}
            onClick={() => setSubFilter('resolved')}
          >
            Resolved ({complaints.filter(c => c.status === 'resolved').length})
          </button>
          <button
            className={`admin-filter-btn ${subFilter === 'rejected' ? 'active' : ''}`}
            onClick={() => setSubFilter('rejected')}
          >
            Dismissed / Rejected ({complaints.filter(c => c.status === 'rejected').length})
          </button>
        </div>

        <div className="admin-search-box">
          <Search size={15} color="#64748b" />
          <input
            type="text"
            placeholder="Search complaint ID, category, parties..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Complaints List Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Dispute ID</th>
              <th>Category</th>
              <th>Complainant</th>
              <th>Associated Booking</th>
              <th>Date Filed</th>
              <th>Description Preview</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No complaints currently logged.
                </td>
              </tr>
            ) : (
              filteredComplaints.map(c => (
                <tr key={c.id}>
                  <td>
                    <span style={{ fontWeight: 800, fontFamily: 'monospace', color: '#38bdf8' }}>{c.id}</span>
                  </td>
                  <td>
                    <span className="admin-badge admin-badge-purple">
                      {c.category}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.complainantName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'capitalize' }}>Role: {c.complainantRole}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{c.bookingId}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{formatDateTime(c.date)}</span>
                  </td>
                  <td style={{ maxWidth: '240px' }}>
                    <div style={{ fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#cbd5e1' }}>
                      {c.description}
                    </div>
                  </td>
                  <td>
                    <span className={`admin-badge ${
                      c.status === 'resolved' ? 'admin-badge-emerald' :
                      c.status === 'rejected' ? 'admin-badge-rose' : 'admin-badge-amber'
                    }`}>
                      {c.status?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => onSelectDispute(c)}
                      className="btn-admin-action btn-admin-primary"
                    >
                      <ExternalLink size={13} /> Investigate
                    </button>
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
