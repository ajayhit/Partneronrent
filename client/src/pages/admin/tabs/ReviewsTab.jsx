import React, { useState } from 'react';
import { 
  Star, 
  Search, 
  Eye, 
  EyeOff, 
  Flag, 
  CheckCircle2, 
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import { formatDateTime } from '../../../utils/helpers';

export default function ReviewsTab({
  reviews = [],
  onModerateReview
}) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredReviews = reviews.filter(r => {
    if (filter === 'flagged' && r.status !== 'flagged') return false;
    if (filter === 'hidden' && r.status !== 'hidden') return false;

    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return (
        r.clientName?.toLowerCase().includes(q) ||
        r.comment?.toLowerCase().includes(q) ||
        r.service?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="admin-card-header">
        <div className="admin-filter-tabs">
          <button
            className={`admin-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            className={`admin-filter-btn ${filter === 'flagged' ? 'active' : ''}`}
            onClick={() => setFilter('flagged')}
          >
            Reported / Flagged ({reviews.filter(r => r.status === 'flagged').length})
          </button>
          <button
            className={`admin-filter-btn ${filter === 'hidden' ? 'active' : ''}`}
            onClick={() => setFilter('hidden')}
          >
            Hidden from Public ({reviews.filter(r => r.status === 'hidden').length})
          </button>
        </div>

        <div className="admin-search-box">
          <Search size={15} color="#64748b" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Reviews Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {filteredReviews.length === 0 ? (
          <div className="admin-card" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '40px', color: '#64748b' }}>
            No reviews matching this view.
          </div>
        ) : (
          filteredReviews.map(r => (
            <div key={r.id} className="admin-card" style={{ padding: '18px', margin: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{r.clientName}</span>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{r.date} • {r.service || 'Companion Session'}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#fbbf24', fontWeight: 800 }}>
                    <Star size={14} fill="#fbbf24" /> {r.rating}.0
                  </div>
                </div>

                <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: '1.5', margin: '10px 0 14px' }}>
                  "{r.comment}"
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '10px' }}>
                <span className={`admin-badge ${r.status === 'hidden' ? 'admin-badge-rose' : r.status === 'flagged' ? 'admin-badge-amber' : 'admin-badge-emerald'}`}>
                  {r.status ? r.status.toUpperCase() : 'VISIBLE ON DIRECTORY'}
                </span>

                <div style={{ display: 'flex', gap: '6px' }}>
                  {r.status === 'hidden' ? (
                    <button
                      onClick={() => onModerateReview(r.id, 'visible')}
                      className="btn-admin-action btn-admin-success"
                      style={{ fontSize: '0.76rem' }}
                    >
                      <Eye size={12} /> Restore
                    </button>
                  ) : (
                    <button
                      onClick={() => onModerateReview(r.id, 'hidden')}
                      className="btn-admin-action btn-admin-danger"
                      style={{ fontSize: '0.76rem' }}
                    >
                      <EyeOff size={12} /> Hide
                    </button>
                  )}
                  {r.status !== 'flagged' && (
                    <button
                      onClick={() => onModerateReview(r.id, 'flagged')}
                      className="btn-admin-action btn-admin-secondary"
                      style={{ fontSize: '0.76rem' }}
                    >
                      <Flag size={12} /> Flag
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
