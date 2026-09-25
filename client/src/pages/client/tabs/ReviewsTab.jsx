import React, { useState } from 'react';
import {
  Star,
  MessageSquare,
  Edit3,
  Flag,
  CheckCircle2,
  Calendar,
  Send,
  X,
  AlertTriangle
} from 'lucide-react';

const INITIAL_HIRER_REVIEWS = [
  {
    id: 'rev-1',
    bookingId: 'BK-10018',
    partnerName: 'Aanya Sharma',
    partnerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    service: 'Cafe & Conversation',
    rating: 5,
    date: '18 Sep 2026',
    comment: 'Aanya is an exceptionally warm and thoughtful listener. We met at Blue Tokai Cafe and discussed work stress and indie cinema. Completely respectful and platonic. Highly recommended!',
    tags: ['Punctual', 'Polite', 'Great Listener', 'Safe Experience']
  },
  {
    id: 'rev-2',
    bookingId: 'BK-09941',
    partnerName: 'Kabir Mathur',
    partnerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    service: 'City Exploration',
    rating: 5,
    date: '02 Sep 2026',
    comment: 'Great companion for walking around Bandra and finding heritage spots. Punctual and very respectful.',
    tags: ['Energetic', 'Knowledgeable', 'Punctual']
  }
];

export default function ReviewsTab({ bookings = [], showToast }) {
  const [reviews, setReviews] = useState(INITIAL_HIRER_REVIEWS);
  const [activeSubTab, setActiveSubTab] = useState('write'); // 'write', 'submitted'

  // Write new review form state
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const [selectedBookingId, setSelectedBookingId] = useState(completedBookings[0]?.id || 'BK-10025');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState(['Punctual', 'Polite']);

  // Report modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportingReview, setReportingReview] = useState(null);

  const availableTags = ['Punctual', 'Polite', 'Great Listener', 'Well Dressed', 'Safe Experience', 'Engaging Conversation'];

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Please enter your review comments', 'warning');
      return;
    }

    const selectedBk = completedBookings.find(b => b.id === selectedBookingId) || {
      id: selectedBookingId,
      partnerName: 'Rahul Sharma',
      partnerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      serviceName: 'Movie Companion'
    };

    const newRev = {
      id: `rev-${Date.now()}`,
      bookingId: selectedBk.id,
      partnerName: selectedBk.partnerName,
      partnerAvatar: selectedBk.partnerAvatar,
      service: selectedBk.serviceName,
      rating,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      comment: comment.trim(),
      tags: selectedTags
    };

    setReviews([newRev, ...reviews]);
    setComment('');
    setActiveSubTab('submitted');
    showToast('Your companion review has been submitted!');
  };

  return (
    <div>
      <div style={{ marginBottom: '22px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
          ⭐ Companion Ratings & Reviews
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
          Share your honest experience to help other hirers discover trusted, polite companions.
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="client-tabs-row">
        <button
          className={`client-subtab-btn ${activeSubTab === 'write' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('write')}
        >
          <Edit3 size={15} /> Write a Review
        </button>
        <button
          className={`client-subtab-btn ${activeSubTab === 'submitted' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('submitted')}
        >
          <Star size={15} /> Submitted Reviews ({reviews.length})
        </button>
      </div>

      {/* 1. WRITE REVIEW (Exact format requested in prompt!) */}
      {activeSubTab === 'write' && (
        <div className="client-panel" style={{ maxWidth: '640px' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '4px' }}>
            How was your experience?
          </h3>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', marginBottom: '18px' }}>
            Rate your companion for punctuality, conversation quality, and respectful platonic conduct.
          </p>

          <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Booking Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                Select Completed Booking
              </label>
              <select
                value={selectedBookingId}
                onChange={e => setSelectedBookingId(e.target.value)}
                style={{ width: '100%', fontSize: '0.9rem' }}
              >
                {completedBookings.length > 0 ? (
                  completedBookings.map(b => (
                    <option key={b.id} value={b.id}>
                      #{b.id} • Partner: {b.partnerName} ({b.serviceName})
                    </option>
                  ))
                ) : (
                  <option value="BK-10025">#BK-10025 • Partner: Rahul Sharma (Movie Companion)</option>
                )}
              </select>
            </div>

            {/* Interactive Stars */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px' }}>
                Rating ({rating} of 5 Stars)
              </label>
              <div style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}>
                {[1, 2, 3, 4, 5].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setRating(st)}
                    style={{ background: 'transparent', border: 'none', padding: '2px', cursor: 'pointer' }}
                  >
                    <Star
                      size={28}
                      fill={st <= rating ? '#fbbf24' : 'transparent'}
                      color={st <= rating ? '#fbbf24' : '#64748b'}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Tags */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                Quick Experience Tags
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {availableTags.map(t => {
                  const isSel = selectedTags.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTag(t)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        background: isSel ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: isSel ? '1px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: isSel ? '#f472b6' : '#cbd5e1',
                        cursor: 'pointer'
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Review text box */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                Write your review
              </label>
              <textarea
                rows="4"
                placeholder="Share specific details about the companion's conversation, etiquette, and venue arrival..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                style={{ width: '100%', fontSize: '0.88rem' }}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #7c3aed 100%)',
                padding: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Send size={15} /> Submit Review
            </button>
          </form>
        </div>
      )}

      {/* 2. SUBMITTED REVIEWS */}
      {activeSubTab === 'submitted' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map(rev => (
            <div key={rev.id} className="client-panel" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={rev.partnerAvatar}
                    alt={rev.partnerName}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <strong style={{ color: '#fff', fontSize: '0.96rem' }}>{rev.partnerName}</strong>
                    <div style={{ fontSize: '0.78rem', color: '#f472b6' }}>
                      Booking #{rev.bookingId} • {rev.service}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '2px', color: '#fbbf24' }}>
                    {[...Array(rev.rating)].map((_, i) => <Star key={i} size={14} fill="#fbbf24" />)}
                  </div>
                  <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>{rev.date}</span>

                  <button
                    type="button"
                    onClick={() => { setReportingReview(rev); setReportModalOpen(true); }}
                    title="Report a review issue"
                    style={{ color: '#64748b', padding: '4px', cursor: 'pointer' }}
                  >
                    <Flag size={14} />
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: '1.5', margin: '0 0 10px' }}>
                "{rev.comment}"
              </p>

              {rev.tags?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {rev.tags.map(t => (
                    <span key={t} style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: '#94a3b8' }}>
                      ✓ {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Report Review Issue Modal */}
      {reportModalOpen && (
        <div className="client-modal-backdrop" onClick={() => setReportModalOpen(false)}>
          <div className="client-modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="client-modal-header">
              <div style={{ fontWeight: 700, color: '#fff' }}>Report Review Issue</div>
              <button onClick={() => setReportModalOpen(false)} style={{ color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>
            <div className="client-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '0.84rem', color: '#cbd5e1', margin: 0 }}>
                Request moderation on review for {reportingReview?.partnerName}. Our content moderation team reviews requests within 24 hours.
              </p>
              <textarea
                rows="3"
                placeholder="Reason for reporting or requesting review modification..."
                style={{ width: '100%', fontSize: '0.84rem' }}
              />
            </div>
            <div className="client-modal-footer">
              <button className="btn-secondary btn-sm" onClick={() => setReportModalOpen(false)}>
                Cancel
              </button>
              <button
                className="btn-danger btn-sm"
                onClick={() => {
                  setReportModalOpen(false);
                  showToast('Review issue reported to moderation.');
                }}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
