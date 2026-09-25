import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../../../utils/helpers';

export default function CalendarTab({
  bookings = [],
  partners = [],
  onSelectBooking
}) {
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedPartner, setSelectedPartner] = useState('All');
  const [selectedDate, setSelectedDate] = useState('2026-09-24');

  const cities = ['All', 'Delhi NCR', 'Mumbai', 'Bangalore', 'Jaipur', 'Pune', 'Hyderabad'];

  const filteredBookings = bookings.filter(b => {
    if (selectedCity !== 'All' && !b.meetingLocation?.toLowerCase().includes(selectedCity.toLowerCase())) return false;
    if (selectedPartner !== 'All' && b.partnerId !== selectedPartner && b.partnerName !== selectedPartner) return false;
    return true;
  });

  return (
    <div>
      {/* Top Controls & Filter Bar */}
      <div className="admin-card" style={{ padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Filter by City
            </label>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              style={{ fontSize: '0.85rem', padding: '6px 12px' }}
            >
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Filter by Partner
            </label>
            <select
              value={selectedPartner}
              onChange={e => setSelectedPartner(e.target.value)}
              style={{ fontSize: '0.85rem', padding: '6px 12px' }}
            >
              <option value="All">All Partners</option>
              {partners.map(p => <option key={p.id} value={p.name}>{p.name} ({p.city})</option>)}
            </select>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              Showing {filteredBookings.length} scheduled session slots
            </span>
          </div>
        </div>
      </div>

      {/* Visual Timeline & Schedule Slots Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {['Mon 22 Sep', 'Tue 23 Sep', 'Wed 24 Sep (Today)', 'Thu 25 Sep', 'Fri 26 Sep', 'Sat 27 Sep', 'Sun 28 Sep'].map((dayHeader, idx) => (
          <div key={idx} style={{
            background: idx === 2 ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)',
            border: idx === 2 ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '12px',
            padding: '12px 10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: idx === 2 ? '#38bdf8' : '#cbd5e1' }}>
              {dayHeader}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
              {idx === 2 ? '3 Sessions Active' : idx > 2 ? 'Scheduled' : 'Concluded'}
            </div>
          </div>
        ))}
      </div>

      {/* Bookings Schedule List */}
      <div className="admin-card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarIcon size={18} color="#38bdf8" /> Scheduled & Upcoming Companion Engagements
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredBookings.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
              No scheduled events match current city and partner filters.
            </div>
          ) : (
            filteredBookings.map(b => (
              <div
                key={b.id}
                onClick={() => onSelectBooking(b)}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8',
                    fontWeight: 800,
                    fontSize: '0.85rem'
                  }}>
                    {b.startTime?.split(' ')[0] || '4:00'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                      {b.serviceName} • {b.partnerName} with {b.clientName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '3px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={12} /> {b.date} ({b.durationHours || 2} Hours)
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <MapPin size={12} color="#38bdf8" /> {b.meetingLocation}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: '#34d399' }}>{formatCurrency(b.totalAmount)}</div>
                  <span className={`admin-badge ${b.status === 'completed' ? 'admin-badge-emerald' : b.status === 'in-progress' ? 'admin-badge-cyan' : 'admin-badge-purple'}`}>
                    {b.status?.toUpperCase()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
