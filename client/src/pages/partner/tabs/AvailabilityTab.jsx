import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Palmtree,
  Power,
  Shield,
  Plus,
  Trash2,
  Check,
  Save,
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export default function AvailabilityTab({ partner, onUpdateAvailability, showToast }) {
  // Weekly Schedule
  const [weeklySchedule, setWeeklySchedule] = useState({
    Monday: { enabled: true, start: '09:00 AM', end: '06:00 PM' },
    Tuesday: { enabled: true, start: '09:00 AM', end: '06:00 PM' },
    Wednesday: { enabled: false, start: '09:00 AM', end: '06:00 PM' }, // Wednesday OFF as requested in prompt!
    Thursday: { enabled: true, start: '09:00 AM', end: '06:00 PM' },
    Friday: { enabled: true, start: '10:00 AM', end: '08:00 PM' },
    Saturday: { enabled: true, start: '11:00 AM', end: '09:00 PM' },
    Sunday: { enabled: true, start: '11:00 AM', end: '08:00 PM' }
  });

  // Vacation Mode
  const [vacationMode, setVacationMode] = useState(false);
  const [vacationStart, setVacationStart] = useState('2024-11-01');
  const [vacationEnd, setVacationEnd] = useState('2024-11-07');
  const [vacationReason, setVacationReason] = useState('Family travel / exams');

  // Blocked Dates List
  const [blockedDates, setBlockedDates] = useState([
    { id: 1, date: '2024-10-15', reason: 'Personal appointment' },
    { id: 2, date: '2024-10-24', reason: 'Festival holiday' }
  ]);
  const [newBlockDate, setNewBlockDate] = useState('');
  const [newBlockReason, setNewBlockReason] = useState('');

  // Blocked Time Slots
  const [blockedSlots, setBlockedSlots] = useState([
    { id: 1, day: 'Friday', time: '02:00 PM - 04:00 PM', reason: 'Gym & Fitness' }
  ]);
  const [newSlotDay, setNewSlotDay] = useState('Monday');
  const [newSlotTime, setNewSlotTime] = useState('02:00 PM - 04:00 PM');
  const [newSlotReason, setNewSlotReason] = useState('');

  // Recurring rules
  const [bufferTimeMins, setBufferTimeMins] = useState(45);
  const [maxHoursPerDay, setMaxHoursPerDay] = useState(6);
  const [autoAcceptBookings, setAutoAcceptBookings] = useState(false);

  const [saving, setSaving] = useState(false);

  const toggleDayEnabled = (day) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled }
    }));
  };

  const handleTimeChange = (day, field, val) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: val }
    }));
  };

  const handleAddBlockedDate = (e) => {
    e.preventDefault();
    if (!newBlockDate) return;
    setBlockedDates(prev => [
      ...prev,
      { id: Date.now(), date: newBlockDate, reason: newBlockReason || 'Blocked Date' }
    ]);
    setNewBlockDate('');
    setNewBlockReason('');
    showToast('Date blocked on your calendar');
  };

  const handleRemoveBlockedDate = (id) => {
    setBlockedDates(prev => prev.filter(b => b.id !== id));
  };

  const handleAddBlockedSlot = (e) => {
    e.preventDefault();
    setBlockedSlots(prev => [
      ...prev,
      { id: Date.now(), day: newSlotDay, time: newSlotTime, reason: newSlotReason || 'Blocked Slot' }
    ]);
    setNewSlotReason('');
    showToast('Time slot blocked');
  };

  const handleRemoveBlockedSlot = (id) => {
    setBlockedSlots(prev => prev.filter(b => b.id !== id));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const activeDays = Object.keys(weeklySchedule).filter(d => weeklySchedule[d].enabled);
      const hoursStr = `${weeklySchedule.Monday.start} - ${weeklySchedule.Monday.end}`;
      await onUpdateAvailability({
        availableDays: activeDays,
        availableHours: hoursStr,
        vacationMode: {
          isActive: vacationMode,
          startDate: vacationStart,
          endDate: vacationEnd,
          reason: vacationReason
        },
        blockedDates,
        blockedSlots,
        bufferTimeMins,
        maxHoursPerDay,
        autoAcceptBookings
      });
      showToast('Availability schedules and rules saved!');
    } catch (err) {
      showToast('Failed to save availability settings', 'danger');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            📅 Availability & Schedule Management
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
            Define weekly working hours, set OFF days, block dates/slots, or activate vacation mode.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="btn-primary"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Save size={16} /> {saving ? 'Saving...' : 'Save Availability'}
        </button>
      </div>

      {/* Vacation Mode Banner */}
      <div style={{
        background: vacationMode ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)' : 'rgba(15, 23, 42, 0.6)',
        border: `1px solid ${vacationMode ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)'}`,
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Palmtree size={28} color={vacationMode ? '#fbbf24' : '#94a3b8'} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
              Vacation Mode {vacationMode ? '(ACTIVE)' : '(Disabled)'}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
              When enabled, your profile is temporarily hidden from booking searches without losing reviews or verification rank.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {vacationMode && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="date"
                value={vacationStart}
                onChange={e => setVacationStart(e.target.value)}
                style={{ fontSize: '0.8rem', padding: '6px 10px' }}
              />
              <span style={{ color: '#94a3b8' }}>to</span>
              <input
                type="date"
                value={vacationEnd}
                onChange={e => setVacationEnd(e.target.value)}
                style={{ fontSize: '0.8rem', padding: '6px 10px' }}
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setVacationMode(!vacationMode);
              showToast(vacationMode ? 'Vacation mode disabled' : 'Vacation mode enabled');
            }}
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              background: vacationMode ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)',
              color: vacationMode ? '#000' : '#fff',
              fontWeight: 700,
              fontSize: '0.84rem'
            }}
          >
            {vacationMode ? 'Disable Vacation Mode' : 'Enable Vacation Mode'}
          </button>
        </div>
      </div>

      {/* Weekly Recurring Availability (Monday - Sunday) */}
      <div className="partner-panel">
        <div className="partner-panel-title" style={{ marginBottom: '16px' }}>
          <Clock size={18} color="#34d399" />
          <span>Weekly Recurring Schedule</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {DAYS_OF_WEEK.map(day => {
            const sched = weeklySchedule[day];
            const isOff = !sched.enabled;

            return (
              <div
                key={day}
                className={`availability-day-card ${isOff ? 'off-day' : 'active-day'}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '150px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: isOff ? 'rgba(255, 255, 255, 0.05)' : 'rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isOff ? '#64748b' : '#34d399',
                    fontWeight: 700,
                    fontSize: '0.8rem'
                  }}>
                    {day.slice(0, 3)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.96rem' }}>{day}</div>
                    <div style={{ fontSize: '0.76rem', color: isOff ? '#f87171' : '#34d399', fontWeight: 600 }}>
                      {isOff ? 'OFF (Unavailable)' : 'Open for Bookings'}
                    </div>
                  </div>
                </div>

                {!isOff ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>From:</span>
                      <select
                        value={sched.start}
                        onChange={e => handleTimeChange(day, 'start', e.target.value)}
                        style={{ fontSize: '0.85rem', padding: '6px 10px' }}
                      >
                        <option>08:00 AM</option>
                        <option>09:00 AM</option>
                        <option>10:00 AM</option>
                        <option>11:00 AM</option>
                        <option>12:00 PM</option>
                        <option>01:00 PM</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>To:</span>
                      <select
                        value={sched.end}
                        onChange={e => handleTimeChange(day, 'end', e.target.value)}
                        style={{ fontSize: '0.85rem', padding: '6px 10px' }}
                      >
                        <option>05:00 PM</option>
                        <option>06:00 PM</option>
                        <option>07:00 PM</option>
                        <option>08:00 PM</option>
                        <option>09:00 PM</option>
                        <option>10:00 PM</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.84rem', color: '#64748b', fontStyle: 'italic' }}>
                    No bookings will be received on {day}s.
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => toggleDayEnabled(day)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    background: isOff ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                    color: isOff ? '#34d399' : '#f87171',
                    border: `1px solid ${isOff ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`
                  }}
                >
                  {isOff ? 'Set Available' : 'Set as OFF'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Block Specific Dates & Block Specific Time Slots */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        
        {/* Block a Date */}
        <div className="partner-panel" style={{ marginBottom: 0 }}>
          <div className="partner-panel-title" style={{ marginBottom: '14px' }}>
            <Calendar size={18} color="#38bdf8" />
            <span>Block a Specific Date</span>
          </div>

          <form onSubmit={handleAddBlockedDate} style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <input
              type="date"
              value={newBlockDate}
              onChange={e => setNewBlockDate(e.target.value)}
              required
              style={{ flex: 1, minWidth: '130px' }}
            />
            <input
              type="text"
              placeholder="Reason (e.g. Doctor, Family)"
              value={newBlockReason}
              onChange={e => setNewBlockReason(e.target.value)}
              style={{ flex: 1, minWidth: '130px' }}
            />
            <button type="submit" className="btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Plus size={14} /> Block
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {blockedDates.length === 0 ? (
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>No dates blocked.</span>
            ) : (
              blockedDates.map(b => (
                <div
                  key={b.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div>
                    <strong style={{ color: '#fff', fontSize: '0.85rem' }}>{b.date}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginLeft: '8px' }}>({b.reason})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBlockedDate(b.id)}
                    style={{ color: '#f87171', padding: 0 }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Block a Time Slot */}
        <div className="partner-panel" style={{ marginBottom: 0 }}>
          <div className="partner-panel-title" style={{ marginBottom: '14px' }}>
            <Clock size={18} color="#c084fc" />
            <span>Block Specific Time Window</span>
          </div>

          <form onSubmit={handleAddBlockedSlot} style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <select value={newSlotDay} onChange={e => setNewSlotDay(e.target.value)} style={{ width: '100px' }}>
              {DAYS_OF_WEEK.map(d => <option key={d}>{d}</option>)}
            </select>
            <input
              type="text"
              placeholder="e.g. 02:00 PM - 04:00 PM"
              value={newSlotTime}
              onChange={e => setNewSlotTime(e.target.value)}
              style={{ flex: 1, minWidth: '140px' }}
              required
            />
            <button type="submit" className="btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Plus size={14} /> Block
            </button>
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {blockedSlots.length === 0 ? (
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>No specific time slots blocked.</span>
            ) : (
              blockedSlots.map(s => (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div>
                    <strong style={{ color: '#fff', fontSize: '0.85rem' }}>{s.day}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#38bdf8', marginLeft: '6px' }}>{s.time}</span>
                    {s.reason && <span style={{ fontSize: '0.74rem', color: '#94a3b8', marginLeft: '6px' }}>({s.reason})</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBlockedSlot(s.id)}
                    style={{ color: '#f87171', padding: 0 }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recurring Availability Rules & Safety Buffers */}
      <div className="partner-panel">
        <div className="partner-panel-title" style={{ marginBottom: '16px' }}>
          <Shield size={18} color="#10b981" />
          <span>Rest & Transit Buffer Settings</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
              Travel Buffer Between Sessions
            </label>
            <select
              value={bufferTimeMins}
              onChange={e => setBufferTimeMins(Number(e.target.value))}
              style={{ width: '100%' }}
            >
              <option value="30">30 Minutes Buffer</option>
              <option value="45">45 Minutes (Recommended for Metro transit)</option>
              <option value="60">60 Minutes Buffer</option>
              <option value="90">90 Minutes Buffer</option>
            </select>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
              System automatically blocks bookings that don't allow sufficient transit time.
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
              Maximum Companionship Hours / Day
            </label>
            <select
              value={maxHoursPerDay}
              onChange={e => setMaxHoursPerDay(Number(e.target.value))}
              style={{ width: '100%' }}
            >
              <option value="4">Max 4 Hours / Day (Light Schedule)</option>
              <option value="6">Max 6 Hours / Day (Standard)</option>
              <option value="8">Max 8 Hours / Day (Full Day Limit)</option>
            </select>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
              Protects you from mental fatigue and maintains energetic, empathetic company.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
