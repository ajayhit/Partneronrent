import React, { useState } from 'react';
import { 
  Settings, 
  Lock, 
  Save, 
  Key, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function SettingsTab({
  settings = {},
  onSaveSettings
}) {
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Security password state
  const { updateAdminPassword } = useAuth();
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState({ current: false, next: false });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMessage, setPwdMessage] = useState({ text: '', type: '' });

  React.useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setForm(settings);
    }
  }, [settings]);

  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSaveSettings(form);
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwdMessage({ text: '', type: '' });

    if (!pwdForm.currentPassword || !pwdForm.newPassword) {
      setPwdMessage({ text: 'Please fill in both current and new password.', type: 'error' });
      return;
    }
    if (pwdForm.newPassword.length < 6) {
      setPwdMessage({ text: 'New password must be at least 6 characters.', type: 'error' });
      return;
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setPwdMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    setPwdLoading(true);
    try {
      const res = await updateAdminPassword(pwdForm.currentPassword, pwdForm.newPassword);
      if (res.success) {
        setPwdMessage({ text: 'Admin password updated successfully!', type: 'success' });
        setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPwdMessage({ text: res.message || 'Failed to update password.', type: 'error' });
      }
    } catch {
      setPwdMessage({ text: 'An unexpected error occurred.', type: 'error' });
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-card-header">
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={20} color="#38bdf8" /> Platform Governance & Security Configurations
          </h2>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            Brand parameters, emergency hotline contacts, tax parameters & root access credentials.
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Left: Platform Global Settings */}
        <div className="admin-card" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={16} color="#38bdf8" /> General Parameters
          </h3>

          <form onSubmit={handleGeneralSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Platform Brand Name</label>
              <input
                type="text"
                value={form.platformName || 'PartnerOnRent'}
                onChange={e => setForm({ ...form, platformName: e.target.value })}
                required
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Brand Mission Tagline</label>
              <input
                type="text"
                value={form.tagline || ''}
                onChange={e => setForm({ ...form, tagline: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Support & SOS Phone</label>
                <input
                  type="text"
                  value={form.supportPhone || '+91-98105-35398'}
                  onChange={e => setForm({ ...form, supportPhone: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Support & Safety Email</label>
                <input
                  type="email"
                  value={form.supportEmail || 'safety@partneronrent.in'}
                  onChange={e => setForm({ ...form, supportEmail: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>GST Tax Rate (%)</label>
                <input
                  type="number"
                  value={form.gstRate || 18}
                  onChange={e => setForm({ ...form, gstRate: Number(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Annual Membership Fee (₹)</label>
                <input
                  type="number"
                  value={form.annualMembershipFee || 1000}
                  onChange={e => setForm({ ...form, annualMembershipFee: Number(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-admin-action btn-admin-primary"
              style={{ justifyContent: 'center', padding: '10px', marginTop: '6px' }}
            >
              {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
              {saved ? 'Settings Saved Live!' : 'Save Platform Settings'}
            </button>
          </form>
        </div>

        {/* Right: Security & Admin Password */}
        <div className="admin-card" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={16} color="#fbbf24" /> Root Admin Security
          </h3>

          {pwdMessage.text && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '14px',
              fontSize: '0.84rem',
              background: pwdMessage.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: pwdMessage.type === 'error' ? '#f87171' : '#34d399',
              border: `1px solid ${pwdMessage.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
            }}>
              {pwdMessage.text}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Current Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd.current ? 'text' : 'password'}
                  placeholder="Enter current password"
                  value={pwdForm.currentPassword}
                  onChange={e => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
                  style={{ width: '100%', paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd({ ...showPwd, current: !showPwd.current })}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
                >
                  {showPwd.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>New Secure Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd.next ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={pwdForm.newPassword}
                  onChange={e => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                  style={{ width: '100%', paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd({ ...showPwd, next: !showPwd.next })}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
                >
                  {showPwd.next ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Confirm New Password</label>
              <input
                type="password"
                placeholder="Repeat new password"
                value={pwdForm.confirmPassword}
                onChange={e => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>

            <button
              type="submit"
              disabled={pwdLoading}
              className="btn-admin-action btn-admin-secondary"
              style={{ justifyContent: 'center', padding: '10px', marginTop: '6px', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.4)' }}
            >
              <Key size={14} /> Update Credentials
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
