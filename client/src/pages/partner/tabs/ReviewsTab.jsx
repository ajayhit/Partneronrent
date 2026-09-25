import React, { useState } from 'react';
import {
  Star,
  MessageSquare,
  Flag,
  ThumbsUp,
  CornerDownRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Send,
  AlertTriangle
} from 'lucide-react';

const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    bookingId: 'BK-1084',
    clientName: 'Rahul Verma',
    clientAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    service: 'Cafe & Conversation',
    rating: 5,
    date: '2024-09-18',
    comment: 'Aanya is an exceptionally warm and thoughtful listener. We met at Blue Tokai Cafe and discussed work stress and indie cinema. Completely respectful and platonic. Highly recommended!',
    partnerReply: 'Thank you so much Rahul! It was a pleasure chatting with you. Wishing you the very best with your new project!'
  },
  {
    id: 'rev-2',
    bookingId: 'BK-1065',
    clientName: 'Sneha Roy',
    clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    service: 'Shopping Companion',
    rating: 5,
    date: '2024-09-12',
    comment: 'Had the best shopping day at Select Citywalk! Aanya gave amazing honest styling advice and kept the vibe super positive throughout the 3 hours. Will definitely hire again.',
    partnerReply: null
  },
  {
    id: 'rev-3',
    bookingId: 'BK-1042',
    clientName: 'Vikram Malhotra',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    service: 'City Exploration',
    rating: 4.8,
    date: '2024-08-30',
    comment: 'Very polite, punctual, and knew all the great heritage photo spots around Hauz Khas village. Great walking companion.',
    partnerReply: 'Thanks Vikram! Loved exploring the heritage monuments with you.'
  }
];

export default function ReviewsTab({ partner, showToast }) {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [replyInputs, setReplyInputs] = useState({});
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReviewForReport, setSelectedReviewForReport] = useState(null);
  const [reportReason, setReportReason] = useState('Offensive / Inappropriate Language');
  const [reportDetails, setReportDetails] = useState('');

  const overallRating = partner?.rating || 4.95;
  const totalReviews = partner?.reviewCount || 42;

  const handleSendReply = (reviewId) => {
    const text = replyInputs[reviewId];
    if (!text || !text.trim()) return;

    setReviews(prev =>
      prev.map(r => r.id === reviewId ? { ...r, partnerReply: text.trim() } : r)
    );
    setReplyInputs(prev => ({ ...prev, [reviewId]: '' }));
    showToast('Your response to the review has been published!');
  };

  const handleOpenReport = (review) => {
    setSelectedReviewForReport(review);
    setReportReason('Offensive / Inappropriate Language');
    setReportDetails('');
    setReportModalOpen(true);
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    showToast(`Review report submitted to Trust & Safety moderation team for review.`);
    setReportModalOpen(false);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
          ⭐ Hirer Reviews & Ratings
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
          Genuine feedback from hirers after verified session completion. Maintain high ratings for top directory visibility.
        </p>
      </div>

      {/* Ratings Breakdown Summary Card */}
      <div className="partner-panel" style={{ marginBottom: '26px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '28px', alignItems: 'center' }}>
          
          {/* Big Rating Number */}
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ fontSize: '3.6rem', fontWeight: 800, color: '#fbbf24', lineHeight: 1, letterSpacing: '-0.03em' }}>
              {overallRating}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', margin: '8px 0' }}>
              {[1, 2, 3, 4, 5].map(st => (
                <Star key={st} size={20} fill="#fbbf24" color="#fbbf24" />
              ))}
            </div>
            <div style={{ fontSize: '0.86rem', color: '#cbd5e1', fontWeight: 600 }}>
              Based on {totalReviews} verified hirer reviews
            </div>
            <span className="partner-badge partner-badge-emerald" style={{ marginTop: '8px', display: 'inline-block' }}>
              Top 1% Rated Companion
            </span>
          </div>

          {/* Star Distribution Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { stars: 5, pct: 90, count: 38 },
              { stars: 4, pct: 8, count: 3 },
              { stars: 3, pct: 2, count: 1 },
              { stars: 2, pct: 0, count: 0 },
              { stars: 1, pct: 0, count: 0 }
            ].map(row => (
              <div key={row.stars} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem' }}>
                <span style={{ minWidth: '40px', color: '#cbd5e1', fontWeight: 600 }}>
                  {row.stars} ★
                </span>
                <div style={{ flex: 1, height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${row.pct}%`, height: '100%', background: '#fbbf24', borderRadius: '9999px' }} />
                </div>
                <span style={{ minWidth: '35px', textAlign: 'right', color: '#94a3b8' }}>
                  {row.count}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Reviews Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {reviews.map(rev => (
          <div key={rev.id} className="partner-panel" style={{ marginBottom: 0 }}>
            
            {/* Header: Client Avatar, Name, Rating, Date */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={rev.clientAvatar}
                  alt={rev.clientName}
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.96rem' }}>
                    {rev.clientName}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#38bdf8' }}>
                    Booking #{rev.bookingId} • {rev.service}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontWeight: 700, fontSize: '0.9rem' }}>
                  <Star size={16} fill="#fbbf24" /> {rev.rating}
                </div>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{rev.date}</span>
                <button
                  type="button"
                  onClick={() => handleOpenReport(rev)}
                  title="Report inappropriate review"
                  style={{ color: '#64748b', padding: '4px', cursor: 'pointer' }}
                >
                  <Flag size={14} />
                </button>
              </div>
            </div>

            {/* Comment Text */}
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.5', margin: '0 0 14px' }}>
              "{rev.comment}"
            </p>

            {/* Partner Reply Display */}
            {rev.partnerReply && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                borderLeft: '3px solid #10b981',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '0.82rem',
                color: '#cbd5e1',
                marginBottom: '10px',
                display: 'flex',
                gap: '8px'
              }}>
                <CornerDownRight size={14} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#34d399' }}>Your Public Response:</strong> {rev.partnerReply}
                </div>
              </div>
            )}

            {/* Reply Input Form if no reply yet */}
            {!rev.partnerReply && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <input
                  type="text"
                  placeholder="Post a polite public reply to this review..."
                  value={replyInputs[rev.id] || ''}
                  onChange={e => setReplyInputs({ ...replyInputs, [rev.id]: e.target.value })}
                  style={{ flex: 1, fontSize: '0.84rem', padding: '8px 12px' }}
                />
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => handleSendReply(rev.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Send size={13} /> Reply
                </button>
              </div>
            )}

          </div>
        ))}
      </div>

      {/* Report Inappropriate Review Modal */}
      {reportModalOpen && (
        <div className="partner-modal-backdrop" onClick={() => setReportModalOpen(false)}>
          <div className="partner-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="partner-modal-header">
              <div style={{ fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="#f87171" />
                <span>Report Review for Moderation</span>
              </div>
              <button onClick={() => setReportModalOpen(false)} style={{ color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitReport}>
              <div className="partner-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
                  Reporting review by <strong>{selectedReviewForReport?.clientName}</strong> on booking #{selectedReviewForReport?.bookingId}.
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                    Reason for Dispute
                  </label>
                  <select
                    value={reportReason}
                    onChange={e => setReportReason(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option>Offensive / Inappropriate Language</option>
                    <option>False Claims / Retaliatory Review</option>
                    <option>Session Did Not Occur</option>
                    <option>Violates Platonic Guidelines</option>
                    <option>Contains Personal Contact / Doxxing Info</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                    Explanation & Evidence Notes
                  </label>
                  <textarea
                    rows="3"
                    value={reportDetails}
                    onChange={e => setReportDetails(e.target.value)}
                    placeholder="Provide details on why this review violates platform terms..."
                    style={{ width: '100%', fontSize: '0.84rem' }}
                    required
                  />
                </div>
              </div>

              <div className="partner-modal-footer">
                <button type="button" className="btn-secondary btn-sm" onClick={() => setReportModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-danger btn-sm">
                  Submit Report to Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
