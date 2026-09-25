import React, { useState } from 'react';
import {
  Settings,
  Lock,
  Bell,
  Globe,
  User,
  PauseCircle,
  LogOut,
  Save,
  Check,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

export default function SettingsTab({ partner, onLogout, showToast }) {
  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification toggles
  const [notifSms, setNotifSms] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifWhatsApp, setNotifWhatsApp] = useState(true);
  const [notifPush, setNotifPush] = useState(true);

  // Availability preferences
  const [autoAccept, setAutoAccept] = useState(false);
  const [instantAlerts, setInstantAlerts] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  // Account details
  const [email, setEmail] = useState(partner?.email || 'aanya@example.com');
  const [phone, setPhone] = useState(partner?.phone || '+91 91234 56789');
  const [emergencyContact, setEmergencyContact] = useState('+91 98111 22334 (Brother - Rohit Sharma)');

  // Pause profile state
  const [profilePaused, setProfilePaused] = useState(false);

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'danger');
      return;
    }
    showToast('Password successfully changed!');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    showToast('Notification preferences updated!');
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    showToast('Account contact details updated successfully!');
  };

  const handleTogglePause = () => {
    setProfilePaused(!profilePaused);
    showToast(profilePaused ? 'Profile unpaused! You are now visible in search.' : 'Profile paused. Hidden from directory discovery.');
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
          ⚙️ Account & Profile Settings
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '4px 0 0' }}>
          Configure security, alerts, notification channels, account emergency contact, and profile visibility.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '26px' }}>
        
        {/* 1. Change Password / Security */}
        <div className="partner-panel" style={{ marginBottom: 0 }}>
          <div className="partner-panel-title" style={{ marginBottom: '14px' }}>
            <Lock size={18} color="#38bdf8" />
            <span>Change Account Password</span>
          </div>

          <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                Current Password
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>

            <button type="submit" className="btn-secondary" style={{ marginTop: '6px' }}>
              Update Password
            </button>
          </form>
        </div>

        {/* 2. Notification Preferences */}
        <div className="partner-panel" style={{ marginBottom: 0 }}>
          <div className="partner-panel-title" style={{ marginBottom: '14px' }}>
            <Bell size={18} color="#fbbf24" />
            <span>Notification Channels</span>
          </div>

          <form onSubmit={handleSaveNotifications} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'SMS Booking Alerts', checked: notifSms, set: setNotifSms, desc: 'Instant text when client books you' },
              { label: 'WhatsApp Real-Time Updates', checked: notifWhatsApp, set: setNotifWhatsApp, desc: 'Direct message for bookings & payouts' },
              { label: 'Email Confirmations & Invoices', checked: notifEmail, set: setNotifEmail, desc: 'Weekly statements and tax invoices' },
              { label: 'Web Push Notifications', checked: notifPush, set: setNotifPush, desc: 'Browser banner for incoming requests' }
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#ffffff' }}>{item.label}</div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{item.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={e => item.set(e.target.checked)}
                  style={{ width: '20px', height: '20px', accentColor: '#10b981', cursor: 'pointer' }}
                />
              </div>
            ))}

            <button type="submit" className="btn-secondary" style={{ marginTop: '8px' }}>
              Save Notification Preferences
            </button>
          </form>
        </div>

        {/* 3. Language & Regional Settings */}
        <div className="partner-panel" style={{ marginBottom: 0 }}>
          <div className="partner-panel-title" style={{ marginBottom: '14px' }}>
            <Globe size={18} color="#c084fc" />
            <span>Preferred Interface Language</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                Portal Display Language
              </label>
              <select
                value={selectedLanguage}
                onChange={e => {
                  setSelectedLanguage(e.target.value);
                  showToast(`Language set to ${e.target.value}`);
                }}
                style={{ width: '100%' }}
              >
                <option value="English">English</option>
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="Bengali">বাংলা (Bengali)</option>
                <option value="Marathi">मराठी (Marathi)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
              </select>
            </div>

            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#fff' }}>Auto-Accept Booking Requests</div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', margin: '2px 0 8px' }}>
                Automatically confirm bookings when requested within your open working hours.
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={autoAccept}
                  onChange={e => setAutoAccept(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#10b981' }}
                />
                <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>Enable Auto-Accept</span>
              </label>
            </div>
          </div>
        </div>

        {/* 4. Account Details & Emergency Contact */}
        <div className="partner-panel" style={{ marginBottom: 0 }}>
          <div className="partner-panel-title" style={{ marginBottom: '14px' }}>
            <User size={18} color="#10b981" />
            <span>Account Contacts & Emergency Person</span>
          </div>

          <form onSubmit={handleSaveAccount} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                Account Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                Account Mobile Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                Designated Emergency Contact Person
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={e => setEmergencyContact(e.target.value)}
                required
                style={{ width: '100%' }}
              />
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Notified automatically during SOS distress trigger.</span>
            </div>

            <button type="submit" className="btn-secondary" style={{ marginTop: '6px' }}>
              Save Account Details
            </button>
          </form>
        </div>

      </div>

      {/* Pause Profile & Logout Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        {/* Pause Profile */}
        <div className="partner-panel" style={{
          background: profilePaused ? 'rgba(245, 158, 11, 0.1)' : 'rgba(15, 23, 42, 0.6)',
          border: profilePaused ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <PauseCircle size={20} color={profilePaused ? '#fbbf24' : '#94a3b8'} />
            <strong style={{ color: '#fff', fontSize: '1rem' }}>
              {profilePaused ? 'Profile Currently Paused' : 'Temporarily Pause Profile'}
            </strong>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '14px' }}>
            Take an extended break without losing your verification status, reviews, or earnings ledger.
          </p>
          <button
            onClick={handleTogglePause}
            className="btn-secondary btn-sm"
            style={{ color: profilePaused ? '#34d399' : '#fbbf24' }}
          >
            {profilePaused ? 'Resume Profile Visibility' : 'Pause My Companion Profile'}
          </button>
        </div>

        {/* Logout */}
        <div className="partner-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <LogOut size={20} color="#f87171" />
              <strong style={{ color: '#fff', fontSize: '1rem' }}>Sign Out of Companion Console</strong>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: 0 }}>
              Safely logs you out of the Partner Portal session on this device.
            </p>
          </div>
          <button
            onClick={onLogout}
            className="btn-danger btn-sm"
            style={{ width: 'fit-content', marginTop: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>

      </div>
    </div>
  );
}
