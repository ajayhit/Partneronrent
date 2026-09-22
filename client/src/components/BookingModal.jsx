import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { createBooking } from '../utils/api';
import { formatCurrency } from '../utils/helpers';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Shield, 
  Phone, 
  CheckCircle2, 
  Wallet, 
  CreditCard,
  AlertCircle
} from 'lucide-react';

export default function BookingModal({ onBookingCreated }) {
  const { bookingModal, closeBookingModal, services, showToast } = useApp();
  const { activeUser } = useAuth();
  const partner = bookingModal?.partner;

  // Selected service
  const [selectedServiceId, setSelectedServiceId] = useState(
    bookingModal?.preselectedService || partner?.services?.[0]?.serviceId || 'in-person-hangout'
  );
  const [durationHours, setDurationHours] = useState(2);
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState('04:00 PM');
  const [meetingLocation, setMeetingLocation] = useState('Starbucks Cafe, Select Citywalk Mall, Saket, Delhi');
  const [clientNotes, setClientNotes] = useState('Looking forward to a calm conversation and relaxing coffee.');
  const [emergencyContact, setEmergencyContact] = useState(activeUser?.emergencyContact || '+91 98111 22334 (Family)');
  const [paymentMethod, setPaymentMethod] = useState('wallet'); // 'wallet' or 'upi'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  if (!bookingModal.isOpen || !partner) return null;

  // Find hourly rate for selected service
  const serviceObj = partner.services?.find(s => s.serviceId === selectedServiceId);
  const hourlyRate = serviceObj ? serviceObj.ratePerHour : partner.hourlyRate;
  const baseAmount = hourlyRate * durationHours;
  const platformFee = Math.round(baseAmount * 0.10);
  const gstAmount = Math.round((baseAmount + platformFee) * 0.05);
  const totalAmount = baseAmount + platformFee + gstAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!meetingLocation.trim()) {
      alert('Please specify a public meeting location (cafe, mall, etc.).');
      return;
    }

    if (paymentMethod === 'wallet' && (activeUser?.walletBalance || 0) < totalAmount) {
      alert(`Insufficient wallet balance. Total is ${formatCurrency(totalAmount)}, your balance is ${formatCurrency(activeUser?.walletBalance || 0)}. Please switch to UPI or top-up your wallet.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        clientId: activeUser?.id || 'client-1',
        clientName: activeUser?.name || 'Rahul Verma',
        clientPhone: activeUser?.phone || '+91 98765 43210',
        partnerId: partner.id,
        serviceId: selectedServiceId,
        date: bookingDate,
        startTime: bookingTime,
        durationHours,
        meetingLocation,
        clientNotes,
        emergencyContact,
        payViaWallet: paymentMethod === 'wallet'
      };

      const result = await createBooking(payload);
      setBookingSuccess(result);
      showToast(`Booking request submitted for ${partner.name}! OTP generated.`);
      if (onBookingCreated) onBookingCreated(result);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Booking submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeBookingModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '2px' }}>
              {bookingSuccess ? 'Booking Confirmed!' : `Hire ${partner.name}`}
            </h3>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              {bookingSuccess ? 'Your companion session is secured' : `Verified Partner in ${partner.city} • Platonic Session`}
            </div>
          </div>
          <button 
            onClick={closeBookingModal}
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

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          
          {bookingSuccess ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '2px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <CheckCircle2 size={36} color="#10b981" />
              </div>

              <h4 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '8px' }}>
                Booking Request Sent!
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 20px' }}>
                Your request has been delivered to <strong>{partner.name}</strong>. Share the 4-digit OTP below with your companion upon meeting in person.
              </p>

              {/* Start Session OTP Box */}
              <div style={{
                background: 'rgba(124, 58, 237, 0.15)',
                border: '1px dashed var(--primary-light)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                maxWidth: '320px',
                margin: '0 auto 24px'
              }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#c084fc', marginBottom: '6px' }}>
                  Session Start Security OTP
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '0.2em', color: '#fff' }}>
                  {bookingSuccess.startOtp}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                  Partner will enter this code to verify your arrival
                </div>
              </div>

              <div style={{
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                textAlign: 'left',
                marginBottom: '24px',
                fontSize: '0.85rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>Service:</span>
                  <strong>{bookingSuccess.serviceName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>Date & Duration:</span>
                  <strong>{bookingSuccess.date} at {bookingSuccess.startTime} ({bookingSuccess.durationHours} hrs)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>Meeting Venue:</span>
                  <span style={{ textAlign: 'right', maxWidth: '280px' }}>{bookingSuccess.meetingLocation}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: '#94a3b8' }}>Total Paid:</span>
                  <strong style={{ color: '#ec4899', fontSize: '1.05rem' }}>{formatCurrency(bookingSuccess.totalAmount)}</strong>
                </div>
              </div>

              <button 
                className="btn-primary"
                onClick={closeBookingModal}
                style={{ width: '100%', padding: '12px' }}
              >
                Done & View in Hirer Portal
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Partner Quick Mini Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px',
                background: 'rgba(15, 23, 42, 0.5)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <img 
                  src={partner.avatar} 
                  alt={partner.name}
                  style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {partner.name}
                    <span className="badge badge-verified">ID Verified</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    ⭐ {partner.rating} ({partner.reviewCount} sessions) • {partner.city}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Hourly Rate</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ec4899' }}>
                    {formatCurrency(hourlyRate)}<span style={{ fontSize: '0.75rem', fontWeight: 400 }}>/hr</span>
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
                  Select Companionship Activity
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {partner.services?.map(s => {
                    const svcInfo = services.find(x => x.id === s.serviceId);
                    const isSelected = selectedServiceId === s.serviceId;
                    return (
                      <div
                        key={s.serviceId}
                        onClick={() => setSelectedServiceId(s.serviceId)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-sm)',
                          border: isSelected ? '1px solid #c084fc' : '1px solid var(--border-subtle)',
                          background: isSelected ? 'rgba(124, 58, 237, 0.2)' : 'rgba(15, 23, 42, 0.4)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '4px'
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: '0.88rem', color: isSelected ? '#fff' : '#cbd5e1' }}>
                          {svcInfo?.name || s.serviceId}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#ec4899', fontWeight: 700 }}>
                          {formatCurrency(s.ratePerHour)}/hr
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Duration & Timing */}
              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
                    Duration (Hours)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map(hrs => (
                      <button
                        type="button"
                        key={hrs}
                        onClick={() => setDurationHours(hrs)}
                        style={{
                          flex: 1,
                          padding: '8px 0',
                          borderRadius: 'var(--radius-sm)',
                          background: durationHours === hrs ? 'linear-gradient(135deg, #7c3aed, #ec4899)' : 'rgba(15, 23, 42, 0.6)',
                          border: durationHours === hrs ? 'none' : '1px solid var(--border-subtle)',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '0.9rem'
                        }}
                      >
                        {hrs}h
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
                    Start Time
                  </label>
                  <select 
                    value={bookingTime} 
                    onChange={e => setBookingTime(e.target.value)}
                    style={{ width: '100%' }}
                  >
                    <option>11:00 AM</option>
                    <option>01:00 PM</option>
                    <option>03:00 PM</option>
                    <option>04:00 PM</option>
                    <option>05:30 PM</option>
                    <option>07:00 PM</option>
                    <option>08:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
                  Booking Date
                </label>
                <input 
                  type="date" 
                  value={bookingDate}
                  onChange={e => setBookingDate(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Meeting Venue */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' }}>
                    Public Meeting Venue
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                    Strictly Public Venues Only
                  </span>
                </div>
                <input 
                  type="text" 
                  value={meetingLocation}
                  onChange={e => setMeetingLocation(e.target.value)}
                  placeholder="e.g., Starbucks Cafe, Select Citywalk Mall, Saket"
                  style={{ width: '100%' }}
                  required
                />
              </div>

              {/* Notes & Emergency Contact */}
              <div className="grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Emergency Contact No.
                  </label>
                  <input 
                    type="text" 
                    value={emergencyContact}
                    onChange={e => setEmergencyContact(e.target.value)}
                    placeholder="+91 98XXX XXXXX (Family/Friend)"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Special Preferences / Note
                  </label>
                  <input 
                    type="text" 
                    value={clientNotes}
                    onChange={e => setClientNotes(e.target.value)}
                    placeholder="e.g., Prefers outdoor cafe seating"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '0.85rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Companion Fee ({durationHours} hrs × {formatCurrency(hourlyRate)})</span>
                  <span style={{ color: '#fff' }}>{formatCurrency(baseAmount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>Platform Safety & Support Fee (10%)</span>
                  <span style={{ color: '#fff' }}>{formatCurrency(platformFee)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>GST (5%)</span>
                  <span style={{ color: '#fff' }}>{formatCurrency(gstAmount)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--border-subtle)',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: '#fff'
                }}>
                  <span>Total Amount Payable</span>
                  <span style={{ color: '#ec4899', fontSize: '1.2rem' }}>{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>
                  Choose Payment Method
                </label>
                <div className="grid-2">
                  <div
                    onClick={() => setPaymentMethod('wallet')}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      border: paymentMethod === 'wallet' ? '1px solid #ec4899' : '1px solid var(--border-subtle)',
                      background: paymentMethod === 'wallet' ? 'rgba(236, 72, 153, 0.15)' : 'rgba(15, 23, 42, 0.4)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <Wallet size={20} color="#f472b6" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff' }}>Hirer Wallet</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        Balance: {formatCurrency(activeUser?.walletBalance || 0)}
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('upi')}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      border: paymentMethod === 'upi' ? '1px solid #c084fc' : '1px solid var(--border-subtle)',
                      background: paymentMethod === 'upi' ? 'rgba(124, 58, 237, 0.15)' : 'rgba(15, 23, 42, 0.4)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <CreditCard size={20} color="#c084fc" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#fff' }}>Instant UPI / Card</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>GPay, PhonePe, Cards</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button 
                type="submit" 
                className="btn-primary" 
                disabled={isSubmitting}
                style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '4px' }}
              >
                {isSubmitting ? 'Securing Booking...' : `Confirm & Hire for ${formatCurrency(totalAmount)}`}
              </button>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
