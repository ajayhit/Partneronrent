import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Star, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  ThumbsUp, 
  Filter, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  User,
  Coffee,
  Film,
  Calendar,
  AlertCircle,
  LogIn
} from 'lucide-react';

const INITIAL_REVIEWS = [
  {
    id: 1,
    author: 'Aarav M.',
    role: 'Hirer',
    city: 'New Delhi (Connaught Place)',
    rating: 5,
    date: '2 days ago',
    service: 'Cafe & Conversation',
    comment: 'Booked Priya for a 2-hour coffee conversation after moving to Delhi for my new job. She was incredibly polite, well-read, and respectful of boundaries. The OTP verification at the Starbucks entrance made me feel completely secure.',
    tags: ['Safe & Verified', 'Great Listener', 'Punctual'],
    likes: 24
  },
  {
    id: 2,
    author: 'Meera S.',
    role: 'Hirer',
    city: 'Mumbai (Bandra)',
    rating: 5,
    date: '5 days ago',
    service: 'Movie Companion',
    comment: 'I really wanted to watch the late evening IMAX screening but didn’t want to go alone. Booked Rohan — he arrived 10 mins early, entered the OTP, and was great company during intermission. Completely platonic and zero awkwardness.',
    tags: ['Polite', 'Punctual', 'Movie Buff'],
    likes: 42
  },
  {
    id: 3,
    author: 'Siddharth V.',
    role: 'Hirer',
    city: 'Bengaluru (Koramangala)',
    rating: 5,
    date: '1 week ago',
    service: 'Elder Care Companion',
    comment: 'Needed a companion to accompany my 72-year-old mother for her routine cardiology checkup while I was traveling on work. Sunita was an angel — patient, attentive, and sent updates throughout. Truly an emotional relief.',
    tags: ['Elderly Care', 'Empathetic', 'Compassionate'],
    likes: 67
  },
  {
    id: 4,
    author: 'Kavita R.',
    role: 'Verified Partner',
    city: 'Pune (Koregaon Park)',
    rating: 5,
    date: '2 weeks ago',
    service: 'Partner Experience',
    comment: 'As a female companion on this platform for 8 months, the strict public venues rule and escrow payments give me complete peace of mind. The clients I have accompanied for shopping and art exhibitions have all been thorough gentlemen.',
    tags: ['Partner Perspective', 'Platform Safety', 'Instant Payout'],
    likes: 51
  },
  {
    id: 5,
    author: 'Vikram Joshi',
    role: 'Hirer',
    city: 'Hyderabad (Jubilee Hills)',
    rating: 5,
    date: '3 weeks ago',
    service: 'Travel & City Guide',
    comment: 'First time in Hyderabad. Hired Rahul for 4 hours to explore Golconda and try authentic Biryani spots. He knew all the history, had great humor, and made my solo weekend trip memorable. Highly recommend!',
    tags: ['City Guide', 'Respectful', 'Great Tour'],
    likes: 19
  }
];

export default function Feedback({ setActivePage }) {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [filterService, setFilterService] = useState('All');
  const [filterRating, setFilterRating] = useState('All');

  // Form State
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('Hirer');
  const [userCity, setUserCity] = useState('');
  const [selectedService, setSelectedService] = useState('Cafe & Conversation');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) return;

    const newRev = {
      id: Date.now(),
      author: userName.trim(),
      role: userRole,
      city: userCity.trim() || 'Verified City',
      rating,
      date: 'Just now',
      service: selectedService,
      comment: comment.trim(),
      tags: ['Community Feedback', 'Verified Submission'],
      likes: 1
    };

    setReviews([newRev, ...reviews]);
    setSubmitted(true);
    setUserName('');
    setUserCity('');
    setComment('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterService !== 'All' && r.service !== filterService) return false;
    if (filterRating !== 'All' && r.rating !== parseInt(filterRating)) return false;
    return true;
  });

  return (
    <div className="container" style={{ padding: '30px 16px 80px', maxWidth: '1200px' }}>
      
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(124, 58, 237, 0.2) 100%)',
        border: '1px solid rgba(236, 72, 153, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px 32px',
        marginBottom: '36px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px'
      }}>
        <div style={{ maxWidth: '720px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(236, 72, 153, 0.2)', padding: '6px 14px', borderRadius: '20px', color: '#f472b6', fontSize: '0.82rem', fontWeight: 700, marginBottom: '12px' }}>
            <Sparkles size={15} /> Real Voices & Community Reviews
          </div>
          <h1 style={{ fontSize: '2.5rem', color: '#ffffff', marginBottom: '12px', lineHeight: 1.2 }}>
            Client & Partner Feedback
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.02rem', lineHeight: 1.6, margin: 0 }}>
            Hear genuine stories from verified hirers and companions across India who have discovered safe, platonic connections, everyday assistance, and emotional wellness.
          </p>
        </div>

        {/* Rating summary badge */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '24px 30px',
          textAlign: 'center',
          minWidth: '220px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: '#f59e0b', lineHeight: 1, marginBottom: '6px' }}>
            4.9
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '8px' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={18} fill="#f59e0b" color="#f59e0b" />
            ))}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.84rem' }}>
            Based on 1,480+ Verified Sessions
          </div>
          <div style={{ color: '#10b981', fontSize: '0.78rem', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <ShieldCheck size={14} /> 100% Platonic Audited
          </div>
        </div>
      </div>

      {/* Main Grid: Feedback Form (Left — only when logged in) & Reviews Feed (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: isAuthenticated ? 'minmax(320px, 380px) 1fr' : '1fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Sticky Submit Feedback Panel — ONLY FOR LOGGED-IN USERS */}
        {isAuthenticated ? (
          <div style={{
            background: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '26px',
            backdropFilter: 'blur(16px)',
            position: 'sticky',
            top: '90px'
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <MessageSquare size={20} color="#ec4899" />
            <h2 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>Leave Your Feedback</h2>
          </div>

          {submitted && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              borderRadius: 'var(--radius-sm)',
              padding: '14px',
              color: '#34d399',
              fontSize: '0.88rem',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle2 size={18} />
              <span>Thank you! Your feedback has been published.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                Your Name / Alias
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  You are a:
                </label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)' }}
                >
                  <option value="Hirer">Hirer / Client</option>
                  <option value="Verified Partner">Companion Partner</option>
                  <option value="Visitor">Community Member</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Delhi NCR"
                  value={userCity}
                  onChange={(e) => setUserCity(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                Companionship Category
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)' }}
              >
                <option value="Cafe & Conversation">Cafe & Conversation</option>
                <option value="Movie Companion">Movie Companion</option>
                <option value="Shopping Buddy">Shopping Buddy</option>
                <option value="Travel & City Guide">Travel & City Guide</option>
                <option value="Elder Care Companion">Elder Care Companion</option>
                <option value="Medical Appointment Support">Medical Appointment Support</option>
                <option value="Partner Experience">Partner Experience / Gig Support</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                Rating
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    style={{ cursor: 'pointer', padding: '4px' }}
                  >
                    <Star
                      size={24}
                      fill={star <= rating ? '#f59e0b' : 'none'}
                      color={star <= rating ? '#f59e0b' : '#64748b'}
                    />
                  </button>
                ))}
                <span style={{ fontSize: '0.9rem', color: '#f59e0b', fontWeight: 700, marginLeft: '6px' }}>
                  {rating} of 5
                </span>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                Share your experience
              </label>
              <textarea
                rows={4}
                placeholder="Tell us about the punctuality, conversation quality, safety OTP, and overall experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 700,
                marginTop: '4px'
              }}
            >
              <Send size={16} /> Submit Feedback
            </button>
          </form>
        </div>
        ) : (
          /* Sign-in prompt shown instead of feedback form for guests */
          <div style={{
            background: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '36px 26px',
            backdropFilter: 'blur(16px)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.2))',
              border: '1px solid rgba(124,58,237,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <MessageSquare size={26} color="#c084fc" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '8px' }}>Share Your Experience</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Sign in to leave feedback and help others in the community make informed decisions.
              </p>
            </div>
            <button
              className="btn-primary"
              onClick={() => setActivePage('auth')}
              style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}
            >
              <LogIn size={16} /> Sign In to Leave Feedback
            </button>
          </div>
        )}

        {/* Reviews Feed */}
        <div>
          {/* Filters Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.88rem' }}>
              <Filter size={16} color="#c084fc" />
              <span>Filter Reviews:</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                style={{ fontSize: '0.82rem', padding: '6px 12px', background: 'rgba(30, 41, 59, 0.8)' }}
              >
                <option value="All">All Categories</option>
                <option value="Cafe & Conversation">Cafe & Conversation</option>
                <option value="Movie Companion">Movie Companion</option>
                <option value="Shopping Buddy">Shopping Buddy</option>
                <option value="Travel & City Guide">Travel & City Guide</option>
                <option value="Elder Care Companion">Elder Care</option>
                <option value="Partner Experience">Partner Feedback</option>
              </select>

              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                style={{ fontSize: '0.82rem', padding: '6px 12px', background: 'rgba(30, 41, 59, 0.8)' }}
              >
                <option value="All">All Ratings</option>
                <option value="5">5 Stars only</option>
                <option value="4">4 Stars</option>
              </select>
            </div>
          </div>

          {/* Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {filteredReviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: '#94a3b8' }}>
                No feedback matches your selected filters. Try changing filter criteria.
              </div>
            ) : (
              filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '22px',
                    transition: 'transform 0.2s, border-color 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1rem'
                      }}>
                        {rev.author.charAt(0)}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ color: '#fff', fontSize: '0.96rem' }}>{rev.author}</strong>
                          <span style={{
                            fontSize: '0.72rem',
                            background: rev.role === 'Verified Partner' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                            color: rev.role === 'Verified Partner' ? '#34d399' : '#38bdf8',
                            border: `1px solid ${rev.role === 'Verified Partner' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`,
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontWeight: 600
                          }}>
                            {rev.role}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                          {rev.city} • <span style={{ color: '#64748b' }}>{rev.date}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'inline-block', background: 'rgba(124, 58, 237, 0.12)', color: '#c084fc', border: '1px solid rgba(124, 58, 237, 0.25)', fontSize: '0.75rem', fontWeight: 600, padding: '3px 10px', borderRadius: '12px', marginBottom: '12px' }}>
                    {rev.service}
                  </div>

                  <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: '1.6', margin: '0 0 14px' }}>
                    "{rev.comment}"
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {rev.tags.map((tag, idx) => (
                        <span key={idx} style={{ fontSize: '0.74rem', background: 'rgba(15, 23, 42, 0.6)', color: '#94a3b8', padding: '3px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.8rem' }}>
                      <ThumbsUp size={13} />
                      <span>{rev.likes} found helpful</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
