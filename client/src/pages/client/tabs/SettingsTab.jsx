import React, { useState } from 'react';
import {
  Settings, Lock, Bell, Shield, Globe, Trash2, LogOut,
  Eye, EyeOff, ChevronRight, CheckCircle2, AlertTriangle,
  Smartphone, Mail, MessageSquare, Volume2, Moon, Sun,
  User, CreditCard, MapPin, X
} from 'lucide-react';

const Toggle = ({ value, onChange, label, description, disabled }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)'
  }}>
    <div>
      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9' }}>{label}</div>
      {description && <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>{description}</div>}
    </div>
    <button
      onClick={() => !disabled && onChange(!value)}
      style={{
        width: '46px',
        height: '26px',
        borderRadius: '13px',
        border: 'none',
        background: value ? 'linear-gradient(90deg,#ec4899,#a855f7)' : 'rgba(100,116,139,0.3)',
        position: 'relative',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.25s',
        flexShrink: 0
      }}
    >
      <span style={{
        position: 'absolute',
        top: '3px',
        left: value ? '23px' : '3px',
        width: '20px',
        height: '20px',
        background: '#fff',
        borderRadius: '50%',
        transition: 'left 0.25s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.4)'
      }} />
    </button>
  </div>
);

const SectionCard = ({ icon: Icon, title, children }) => (
  <div style={{
    background: 'rgba(15,23,42,0.7)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '16px',
    overflow: 'hidden',
    marginBottom: '20px'
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px 22px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(255,255,255,0.02)'
    }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px',
        background: 'rgba(236,72,153,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon size={18} color="#ec4899" />
      </div>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>{title}</h3>
    </div>
    <div style={{ padding: '6px 22px 14px' }}>{children}</div>
  </div>
);

export default function SettingsTab({ client, onLogout }) {
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [pwdForm, setPwdForm] = useState({ old: '', new: '', confirm: '' });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(false);

  // Notification toggles
  const [notif, setNotif] = useState({
    bookingUpdates: true,
    promotions: false,
    messages: true,
    safetyAlerts: true,
    reminderEmail: true,
    reminderSMS: true,
    reminderWhatsApp: false,
    reminderPush: true,
    reviewReminders: false,
    paymentAlerts: true
  });

  // Privacy toggles
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showOnlineStatus: true,
    shareLocation: false,
    allowDataAnalytics: true,
    twoFactorAuth: false
  });

  const [language, setLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const updateNotif = (key) => (val) => setNotif(p => ({ ...p, [key]: val }));
  const updatePrivacy = (key) => (val) => setPrivacy(p => ({ ...p, [key]: val }));

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwdForm.new !== pwdForm.confirm) {
      alert('New passwords do not match.');
      return;
    }
    if (pwdForm.new.length < 8) {
      alert('Password must be at least 8 characters.');
      return;
    }
    setPwdSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setPwdSaving(false);
    setPwdSuccess(true);
    setPwdForm({ old: '', new: '', confirm: '' });
    setTimeout(() => setPwdSuccess(false), 3000);
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
    { code: 'bn', label: 'বাংলা (Bengali)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' }
  ];

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Settings</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
          Manage your account preferences, security, and privacy settings.
        </p>
      </div>

      {/* Account Settings */}
      <SectionCard icon={User} title="Account Settings">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingTop: '8px' }}>
          {[
            { label: 'Edit Profile Information', sub: 'Name, photo, bio, city', tab: 'profile' },
            { label: 'Saved Locations', sub: 'Manage home, office & other locations', tab: 'saved-locations' },
            { label: 'Verification / KYC', sub: 'Identity & phone verification status', tab: 'profile' },
            { label: 'Emergency Contact', sub: 'Add or update your emergency contact', tab: 'profile' }
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '13px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              cursor: 'pointer',
              borderRadius: '8px'
            }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9' }}>{item.label}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>{item.sub}</div>
              </div>
              <ChevronRight size={16} color="#64748b" />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Change Password */}
      <SectionCard icon={Lock} title="Change Password">
        {pwdSuccess && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16,185,129,0.15)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '10px',
            padding: '10px 14px',
            marginTop: '10px',
            marginBottom: '4px',
            color: '#10b981',
            fontSize: '0.88rem',
            fontWeight: 600
          }}>
            <CheckCircle2 size={16} /> Password changed successfully!
          </div>
        )}
        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '10px' }}>
          {[
            { key: 'old', label: 'Current Password', show: showOldPwd, toggle: setShowOldPwd },
            { key: 'new', label: 'New Password', show: showNewPwd, toggle: setShowNewPwd },
            { key: 'confirm', label: 'Confirm New Password', show: showConfirmPwd, toggle: setShowConfirmPwd }
          ].map(field => (
            <div key={field.key}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', fontWeight: 600 }}>
                {field.label}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={field.show ? 'text' : 'password'}
                  value={pwdForm[field.key]}
                  onChange={e => setPwdForm(p => ({ ...p, [field.key]: e.target.value }))}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    padding: '10px 40px 10px 14px',
                    color: '#f1f5f9',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => field.toggle(!field.show)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#64748b',
                    padding: 0
                  }}
                >
                  {field.show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
            <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: pwdForm.new.length >= 8 ? '#10b981' : pwdForm.new.length >= 4 ? '#f59e0b' : 'rgba(255,255,255,0.1)' }} />
            <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: pwdForm.new.length >= 10 ? '#10b981' : pwdForm.new.length >= 6 ? '#f59e0b' : 'rgba(255,255,255,0.1)' }} />
            <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: pwdForm.new.length >= 12 ? '#10b981' : 'rgba(255,255,255,0.1)' }} />
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
            Use 8+ characters with a mix of letters, numbers, and symbols.
          </div>

          <button
            type="submit"
            disabled={pwdSaving}
            style={{
              background: 'linear-gradient(135deg,#ec4899,#a855f7)',
              border: 'none',
              borderRadius: '10px',
              padding: '11px 22px',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: pwdSaving ? 'wait' : 'pointer',
              alignSelf: 'flex-start',
              opacity: pwdSaving ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {pwdSaving ? 'Saving...' : <><Lock size={14} /> Update Password</>}
          </button>
        </form>
      </SectionCard>

      {/* Notification Preferences */}
      <SectionCard icon={Bell} title="Notification Preferences">
        <div style={{ paddingTop: '4px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px', marginTop: '8px' }}>
            📱 Channels
          </div>
          <Toggle value={notif.reminderEmail} onChange={updateNotif('reminderEmail')} label="Email Notifications" description="Booking updates, receipts, and reminders via email" />
          <Toggle value={notif.reminderSMS} onChange={updateNotif('reminderSMS')} label="SMS Notifications" description="Critical alerts and OTPs via SMS" />
          <Toggle value={notif.reminderWhatsApp} onChange={updateNotif('reminderWhatsApp')} label="WhatsApp Notifications" description="Booking confirmations and partner messages on WhatsApp" />
          <Toggle value={notif.reminderPush} onChange={updateNotif('reminderPush')} label="Push Notifications" description="Real-time alerts in the browser or app" />

          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px', marginTop: '14px' }}>
            🔔 Notification Types
          </div>
          <Toggle value={notif.bookingUpdates} onChange={updateNotif('bookingUpdates')} label="Booking Updates" description="Accepted, rejected, confirmed, cancelled" />
          <Toggle value={notif.messages} onChange={updateNotif('messages')} label="New Messages" description="From partners and support team" />
          <Toggle value={notif.paymentAlerts} onChange={updateNotif('paymentAlerts')} label="Payment Alerts" description="Successful payments and refund updates" />
          <Toggle value={notif.safetyAlerts} onChange={updateNotif('safetyAlerts')} label="Safety Alerts" description="Emergency and safety-related notifications" />
          <Toggle value={notif.reviewReminders} onChange={updateNotif('reviewReminders')} label="Review Reminders" description="Remind me to review after a completed booking" />
          <Toggle value={notif.promotions} onChange={updateNotif('promotions')} label="Promotions & Offers" description="Coupons, discounts, and new companion offers" />
        </div>
      </SectionCard>

      {/* Privacy Settings */}
      <SectionCard icon={Shield} title="Privacy & Security">
        <div style={{ paddingTop: '4px' }}>
          <Toggle value={privacy.profileVisible} onChange={updatePrivacy('profileVisible')} label="Profile Visibility" description="Allow partners to view your basic profile information" />
          <Toggle value={privacy.showOnlineStatus} onChange={updatePrivacy('showOnlineStatus')} label="Online Status" description="Show when you are active on the platform" />
          <Toggle value={privacy.shareLocation} onChange={updatePrivacy('shareLocation')} label="Share Precise Location" description="Allow location sharing during active bookings" />
          <Toggle value={privacy.allowDataAnalytics} onChange={updatePrivacy('allowDataAnalytics')} label="Analytics & Personalization" description="Help us improve recommendations for you" />
          <Toggle
            value={privacy.twoFactorAuth}
            onChange={updatePrivacy('twoFactorAuth')}
            label="Two-Factor Authentication (2FA)"
            description="Add an extra layer of security to your account"
          />
        </div>

        <div style={{
          background: 'rgba(168,85,247,0.08)',
          border: '1px solid rgba(168,85,247,0.2)',
          borderRadius: '10px',
          padding: '12px 16px',
          marginTop: '12px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px'
        }}>
          <Shield size={16} color="#a855f7" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
            Your data is encrypted and stored securely. We never share your personal information with third parties without your consent. Read our <span style={{ color: '#ec4899', cursor: 'pointer' }}>Privacy Policy</span>.
          </div>
        </div>
      </SectionCard>

      {/* Payment Settings */}
      <SectionCard icon={CreditCard} title="Payment Settings">
        {[
          { label: 'Manage Payment Methods', sub: 'Add or remove cards, UPI, bank accounts', action: 'Manage' },
          { label: 'Saved Cards', sub: '2 cards saved', action: 'View' },
          { label: 'Billing Address', sub: 'Jaipur, Rajasthan', action: 'Edit' },
          { label: 'Payment History', sub: 'View all transactions', action: 'View' }
        ].map(item => (
          <div key={item.label} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '13px 0',
            borderBottom: '1px solid rgba(255,255,255,0.04)'
          }}>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9' }}>{item.label}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.sub}</div>
            </div>
            <button style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '5px 12px',
              color: '#94a3b8',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}>{item.action}</button>
          </div>
        ))}
      </SectionCard>

      {/* Language */}
      <SectionCard icon={Globe} title="Language">
        <div style={{ paddingTop: '10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px' }}>
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: language === lang.code ? '1px solid #ec4899' : '1px solid rgba(255,255,255,0.08)',
                  background: language === lang.code ? 'rgba(236,72,153,0.12)' : 'rgba(255,255,255,0.03)',
                  color: language === lang.code ? '#ec4899' : '#94a3b8',
                  fontWeight: language === lang.code ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {language === lang.code && <CheckCircle2 size={14} />}
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Danger Zone */}
      <div style={{
        background: 'rgba(239,68,68,0.05)',
        border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: '16px',
        padding: '20px 22px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <AlertTriangle size={18} color="#ef4444" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ef4444' }}>Danger Zone</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '10px'
          }}>
            <div>
              <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.9rem' }}>Logout</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>Sign out from your current session</div>
            </div>
            <button
              onClick={onLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(239,68,68,0.12)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '8px',
                padding: '8px 16px',
                color: '#ef4444',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <LogOut size={15} /> Logout
            </button>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '10px'
          }}>
            <div>
              <div style={{ fontWeight: 600, color: '#f87171', fontSize: '0.9rem' }}>Delete Account</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>Permanently delete your account and all data. This cannot be undone.</div>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.4)',
                borderRadius: '8px',
                padding: '8px 16px',
                color: '#ef4444',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <Trash2 size={15} /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9999, padding: '20px'
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '440px',
            width: '100%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertTriangle size={22} color="#ef4444" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ef4444' }}>Delete Account</h3>
              </div>
              <button onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '14px', marginBottom: '20px' }}>
              <p style={{ fontSize: '0.88rem', color: '#fca5a5', lineHeight: 1.6 }}>
                ⚠️ This action is <strong>permanent and irreversible</strong>. All your bookings, payment history, reviews, messages, and personal data will be deleted immediately.
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px' }}>
                Type <strong style={{ color: '#ef4444' }}>DELETE</strong> to confirm:
              </label>
              <input
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                style={{
                  width: '100%',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#f1f5f9',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); }}
                style={{
                  flex: 1, padding: '11px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8', fontWeight: 600, cursor: 'pointer'
                }}
              >Cancel</button>
              <button
                disabled={deleteConfirm !== 'DELETE'}
                style={{
                  flex: 1, padding: '11px', borderRadius: '10px',
                  background: deleteConfirm === 'DELETE' ? '#ef4444' : 'rgba(239,68,68,0.2)',
                  border: 'none',
                  color: deleteConfirm === 'DELETE' ? '#fff' : '#64748b',
                  fontWeight: 700, cursor: deleteConfirm === 'DELETE' ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}
              >
                <Trash2 size={15} /> Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
