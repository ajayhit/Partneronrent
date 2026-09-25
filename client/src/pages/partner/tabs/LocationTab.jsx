import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertTriangle,
  Calendar,
  Clock,
  User,
  Compass,
  CheckCircle2,
  ExternalLink,
  Info
} from 'lucide-react';

export default function LocationTab({ bookings = [], showToast }) {
  // Accepted or in-progress bookings
  const relevantBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'in-progress' || b.status === 'pending');
  const [selectedBookingId, setSelectedBookingId] = useState(relevantBookings[0]?.id || '');

  const activeBooking = relevantBookings.find(b => b.id === selectedBookingId) || relevantBookings[0];
  const [privacyRevealed, setPrivacyRevealed] = useState(false);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
          📍 Booking Meeting Location & Privacy Gate
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
          Real-time venue coordinates, public transit directions, meeting instructions, and privacy-shielded customer contact details.
        </p>
      </div>

      {relevantBookings.length === 0 ? (
        <div className="partner-panel" style={{ textAlign: 'center', padding: '50px 20px', color: '#64748b' }}>
          <MapPin size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <h4 style={{ color: '#94a3b8', fontSize: '1.05rem', margin: '0 0 6px' }}>No active bookings with location</h4>
          <p style={{ fontSize: '0.85rem', margin: 0 }}>
            Once you accept a booking, the meeting venue, public safety checklist, and transit directions will appear here.
          </p>
        </div>
      ) : (
        <div>
          {/* Booking Selector Pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
            {relevantBookings.map(b => (
              <button
                key={b.id}
                onClick={() => { setSelectedBookingId(b.id); setPrivacyRevealed(false); }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  background: activeBooking?.id === b.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                  border: activeBooking?.id === b.id ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: activeBooking?.id === b.id ? '#34d399' : '#94a3b8',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                #{b.id} • {b.clientName} ({b.date})
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* Left: Meeting Details & Privacy Gate */}
            <div className="partner-panel" style={{ marginBottom: 0 }}>
              <div className="partner-panel-title" style={{ marginBottom: '16px' }}>
                <MapPin size={18} color="#38bdf8" />
                <span>Venue & Meeting Logistics</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Designated Public Venue
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
                    {activeBooking?.meetingLocation || 'Cyber Hub, DLF Phase 2, Gurgaon'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#38bdf8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Navigation size={13} /> Near Sector 29 / Cyber City Metro Gate 3
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: 'rgba(15, 23, 42, 0.4)', padding: '12px', borderRadius: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Session Date</span>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{activeBooking?.date}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Meeting Time</span>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{activeBooking?.startTime} ({activeBooking?.durationHours} hrs)</div>
                  </div>
                </div>

                {/* Privacy & Safety Gate Card */}
                <div style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ShieldCheck size={18} color="#10b981" />
                      <strong style={{ fontSize: '0.88rem', color: '#fff' }}>Stage-Gated Hirer Details</strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPrivacyRevealed(!privacyRevealed)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.76rem',
                        fontWeight: 600,
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: '#cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {privacyRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                      {privacyRevealed ? 'Hide Details' : 'Reveal Contact'}
                    </button>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                    <div>Hirer Name: <strong style={{ color: '#fff' }}>{activeBooking?.clientName}</strong></div>
                    <div>
                      Phone: <strong style={{ color: '#38bdf8' }}>
                        {privacyRevealed ? (activeBooking?.clientPhone || '+91 98765 43210') : '+91 98765 ••••• (Click Reveal)'}
                      </strong>
                    </div>
                    <div>
                      Emergency Contact: <span style={{ color: '#94a3b8' }}>
                        {privacyRevealed ? (activeBooking?.emergencyContact || '+91 98111 22334 (Brother)') : 'Protected until check-in'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specific Meeting Instructions */}
                <div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                    Meeting Instructions & Landmark
                  </div>
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    fontSize: '0.84rem',
                    color: '#cbd5e1',
                    borderLeft: '3px solid #38bdf8'
                  }}>
                    {activeBooking?.clientNotes ? (
                      `"${activeBooking.clientNotes}" • Please wait near the main Starbucks outdoor seating area.`
                    ) : (
                      'Meet directly at the public lobby entrance or main cafe counter. Look for the companion photo before approaching.'
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Simulated Map View & Safety Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Visual Map Mockup */}
              <div className="partner-panel" style={{ marginBottom: 0, padding: 0, overflow: 'hidden' }}>
                <div style={{
                  height: '220px',
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  {/* Grid Lines Pattern */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.15) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }} />

                  {/* Marker Pin */}
                  <div style={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    animation: 'bounce 2s infinite'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.25)',
                      border: '2px solid #10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 20px #10b981',
                      margin: '0 auto 6px'
                    }}>
                      <MapPin size={24} color="#10b981" />
                    </div>
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.9)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid #10b981',
                      color: '#ffffff',
                      fontSize: '0.78rem',
                      fontWeight: 700
                    }}>
                      {activeBooking?.meetingLocation || 'Meeting Landmark'}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    Geo-coordinates verified as public commercial zone.
                  </span>
                  <button
                    className="btn-secondary btn-sm"
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(activeBooking?.meetingLocation || 'Delhi')}`, '_blank')}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    Open in Google Maps <ExternalLink size={13} />
                  </button>
                </div>
              </div>

              {/* Public Place Safety Checklist */}
              <div className="partner-panel" style={{ marginBottom: 0 }}>
                <div className="partner-panel-title" style={{ marginBottom: '12px' }}>
                  <ShieldCheck size={18} color="#10b981" />
                  <span>Mandatory Public Place Checklist</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="#10b981" />
                    <span>Venue must be a public cafe, cinema, restaurant, or mall lobby.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="#10b981" />
                    <span>Strictly forbidden to enter private residences or private hotel suites.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="#10b981" />
                    <span>Verify client's 4-digit OTP before starting the companionship timer.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="#10b981" />
                    <span>In case of any discomfort, use the Emergency SOS button immediately.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
