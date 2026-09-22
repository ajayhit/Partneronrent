import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { submitReview } from '../utils/api';
import { Star, X, CheckCircle2 } from 'lucide-react';

export default function ReviewModal({ onReviewSubmitted }) {
  const { reviewModal, closeReview, showToast } = useApp();
  const booking = reviewModal?.booking;

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('Great companionship! Very polite, respectful, and punctual.');
  const [selectedTags, setSelectedTags] = useState(['Respectful Boundaries', 'Active Listener', 'Punctual']);
  const [submitting, setSubmitting] = useState(false);

  if (!reviewModal.isOpen || !booking) return null;

  const availableTags = [
    'Respectful Boundaries',
    'Active Listener',
    'Punctual',
    'Warm Energy',
    'Great Conversation',
    'Felt Very Safe',
    'Empathetic'
  ];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fullComment = selectedTags.length > 0 
        ? `${reviewText} [${selectedTags.join(', ')}]`
        : reviewText;

      const result = await submitReview(booking.id, {
        rating,
        reviewText: fullComment
      });

      showToast('Thank you! Your feedback has been recorded.');
      if (onReviewSubmitted) onReviewSubmitted(result);
      closeReview();
    } catch (err) {
      console.error(err);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeReview}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '2px' }}>
              Rate Session with {booking.partnerName}
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {booking.serviceName} • Booking #{booking.id}
            </div>
          </div>
          <button 
            onClick={closeReview}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Star selector */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '10px' }}>
              How was your experience?
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  style={{ transform: rating >= star ? 'scale(1.15)' : 'scale(1)', transition: 'transform 0.15s' }}
                >
                  <Star 
                    size={36} 
                    fill={rating >= star ? '#fbbf24' : 'none'} 
                    color={rating >= star ? '#fbbf24' : '#475569'} 
                  />
                </button>
              ))}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fbbf24', marginTop: '8px' }}>
              {rating === 5 && 'Outstanding & Respectful'}
              {rating === 4 && 'Very Good Session'}
              {rating === 3 && 'Average Experience'}
              {rating === 2 && 'Below Expectations'}
              {rating === 1 && 'Unsatisfactory'}
            </div>
          </div>

          {/* Quick tags */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
              Highlights
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {availableTags.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      background: isSelected ? 'rgba(124, 58, 237, 0.25)' : 'rgba(15, 23, 42, 0.5)',
                      border: isSelected ? '1px solid #c084fc' : '1px solid var(--border-subtle)',
                      color: isSelected ? '#fff' : '#94a3b8'
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Share Your Feedback
            </label>
            <textarea 
              rows={3}
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="Tell others how this companion helped your emotional wellness or daily activity..."
              style={{ width: '100%', resize: 'none' }}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={submitting}
            style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
          >
            {submitting ? 'Submitting...' : 'Post Review & Rating'}
          </button>

        </form>

      </div>
    </div>
  );
}
