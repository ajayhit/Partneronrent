import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  Building2,
  Headphones
} from 'lucide-react';

export default function ContactUs({ setActivePage }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div className="container" style={{ padding: '30px 16px 80px', maxWidth: '1200px' }}>
      
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(30, 41, 59, 0.8) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px 32px',
        marginBottom: '40px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px'
      }}>
        <div style={{ maxWidth: '720px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(56, 189, 248, 0.2)', padding: '6px 14px', borderRadius: '20px', color: '#38bdf8', fontSize: '0.82rem', fontWeight: 700, marginBottom: '12px' }}>
            <Headphones size={15} /> 24x7 Customer Care & Rapid Support
          </div>
          <h1 style={{ fontSize: '2.4rem', color: '#ffffff', marginBottom: '12px', lineHeight: 1.2 }}>
            Contact Us & Operations Center
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.02rem', lineHeight: 1.6, margin: 0 }}>
            Have a question about booking, companion KYC, or need immediate assistance? Our dedicated customer happiness and rapid safety response team is here to support you around the clock.
          </p>
        </div>

        <div style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(244, 63, 94, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '20px 24px',
          minWidth: '240px'
        }}>
          <div style={{ color: '#f87171', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={15} /> 24/7 Safety Desk
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
            +91-98105-35398
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            Instant Emergency Escalation
          </div>
        </div>
      </div>

      {/* Grid: Contact Info Cards (Left) & Inquiry Form (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '36px', alignItems: 'start' }}>
        
        {/* Left Column: Direct Contacts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#38bdf8', fontWeight: 700, marginBottom: '12px' }}>
              <Mail size={20} />
              <span style={{ fontSize: '1.05rem', color: '#fff' }}>Email Contacts</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.78rem' }}>General Support & Bookings:</span>
                <a href="mailto:support@partneronrent.in" style={{ color: '#38bdf8', fontWeight: 600 }}>support@partneronrent.in</a>
              </div>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.78rem' }}>Safety & Emergency Team:</span>
                <a href="mailto:safety@partneronrent.in" style={{ color: '#f43f5e', fontWeight: 600 }}>safety@partneronrent.in</a>
              </div>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.78rem' }}>Partner Onboarding & KYC:</span>
                <a href="mailto:partners@partneronrent.in" style={{ color: '#10b981', fontWeight: 600 }}>partners@partneronrent.in</a>
              </div>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.78rem' }}>Statutory Grievance Officer:</span>
                <a href="mailto:grievance@partneronrent.in" style={{ color: '#c084fc', fontWeight: 600 }}>grievance@partneronrent.in</a>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', fontWeight: 700, marginBottom: '12px' }}>
              <Building2 size={20} />
              <span style={{ fontSize: '1.05rem', color: '#fff' }}>Corporate Office (India)</span>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6', margin: '0 0 10px' }}>
              <strong>PartnerOnRent India Platform Operations</strong><br />
              Tower B, 7th Floor, Statesman House, Barakhamba Road, Connaught Place, New Delhi – 110001, India.
            </p>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="#34d399" />
              <span>Office Hours: 09:30 AM – 06:30 PM IST (Mon–Sat)</span>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#c084fc', fontWeight: 700, marginBottom: '10px' }}>
              <MapPin size={20} />
              <span style={{ fontSize: '1.05rem', color: '#fff' }}>Regional Operational Hubs</span>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.86rem', lineHeight: '1.6', margin: 0 }}>
              • <strong>Mumbai:</strong> BKC Platinum Enclave, Bandra East<br />
              • <strong>Bengaluru:</strong> 100ft Road, Indiranagar, Bengaluru<br />
              • <strong>Hyderabad:</strong> Hitec City Cyber Towers, Madhapur
            </p>
          </div>

        </div>

        {/* Right Column: Inquiry Form */}
        <div style={{
          background: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '32px',
          backdropFilter: 'blur(16px)'
        }}>
          <h2 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '8px' }}>Send Us a Message</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '24px' }}>
            Fill in the details below. Our customer concierge responds within 60 minutes during active hours.
          </p>

          {submitted && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10b981',
              borderRadius: 'var(--radius-sm)',
              padding: '16px',
              color: '#34d399',
              fontSize: '0.92rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <CheckCircle2 size={20} />
              <span>Thank you! Your message has been received. Ticket ID: #POR-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ananya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="e.g. ananya@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Department / Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)' }}
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Booking & Wallet Assistance">Booking & Wallet Assistance</option>
                  <option value="Companion KYC & Onboarding">Companion KYC & Onboarding</option>
                  <option value="Safety & Grievance Report">Safety & Grievance Report</option>
                  <option value="Media & Partnership">Media & Partnership</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                Message / Details *
              </label>
              <textarea
                rows={5}
                placeholder="How can we help you? If this is about an existing booking, please provide the Booking ID..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontWeight: 700,
                fontSize: '0.96rem'
              }}
            >
              <Send size={18} /> Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
