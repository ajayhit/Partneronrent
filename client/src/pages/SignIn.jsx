import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  HeartHandshake,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  LogIn
} from 'lucide-react';

const CITIES = [
  'Delhi NCR', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai',
  'Pune', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Lucknow'
];

const REGISTER_AS_OPTIONS = [
  { value: 'client', label: 'Hirer — I want to find a companion' },
  { value: 'partner', label: 'Partner — I want to offer companionship' },
  { value: 'both', label: 'Both — I am both a hirer and a partner' }
];

export default function SignIn({ setActivePage }) {
  const { login, register } = useAuth();

  const [tab, setTab] = useState('signin');        // 'signin' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Sign in form state — single form, role detected by backend
  const [signInForm, setSignInForm] = useState({ email: '', password: '', remember: false });

  // Sign up form state — user picks their role via dropdown
  const [signUpForm, setSignUpForm] = useState({
    name: '', email: '', phone: '', password: '', confirm: '',
    city: 'Delhi NCR', registerAs: 'client'
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!signInForm.email || !signInForm.password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    // Try without role (auto-detect), then fallback to each role
    let result = await login(signInForm.email, signInForm.password, null);
    if (!result.success) {
      // Try with known roles in sequence
      for (const role of ['client', 'partner', 'admin']) {
        result = await login(signInForm.email, signInForm.password, role);
        if (result.success) break;
      }
    }
    setLoading(false);
    if (!result.success) {
      setError('Invalid email or password. Please try again.');
      return;
    }
    setSuccess('Welcome back! Redirecting to your dashboard…');
    setTimeout(() => {
      const r = result.user?.role;
      if (r === 'client' || r === 'both') setActivePage('client-dashboard');
      else if (r === 'partner') setActivePage('partner-dashboard');
      else if (r === 'admin') setActivePage('admin-dashboard');
      else setActivePage('home');
    }, 700);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const { name, email, phone, password, confirm, city, registerAs } = signUpForm;
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const result = register({ name, email, phone, password, city }, registerAs);
    setLoading(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setSuccess('Account created! Redirecting to your portal…');
    setTimeout(() => {
      if (registerAs === 'partner') setActivePage('partner-dashboard');
      else setActivePage('client-dashboard');
    }, 900);
  };

  const switchTab = (newTab) => {
    setTab(newTab);
    setError('');
    setSuccess('');
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: '100px 20px 60px'
    }}>

      {/* Animated background blobs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
          animation: 'floatBlob1 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', right: '-10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
          animation: 'floatBlob2 10s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '20%',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)',
          animation: 'floatBlob1 12s ease-in-out infinite reverse'
        }} />
      </div>

      <style>{`
        @keyframes floatBlob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.05); }
        }
        @keyframes floatBlob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, 20px) scale(1.08); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .auth-card { animation: slideUp 0.5s ease both; }
        .auth-input:focus {
          border-color: #7c3aed !important;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.2) !important;
          outline: none;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(124,58,237,0.45) !important;
        }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .tab-btn:hover { color: #c084fc !important; }
        .perk-item { display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #94a3b8; }
        .auth-select {
          width: 100%; padding: 11px 14px;
          background: rgba(15,23,42,0.7);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: #f8fafc; font-size: 0.92rem;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 36px;
        }
        .auth-select:focus {
          border-color: #7c3aed !important;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.2) !important;
          outline: none;
        }
        .auth-select option { background: #1e293b; color: #f8fafc; }
      `}</style>

      {/* ── Card ─────────────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0',
        maxWidth: '920px',
        width: '100%',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        border: '1px solid rgba(255,255,255,0.07)',
        position: 'relative',
        zIndex: 1
      }} className="auth-card">

        {/* ── LEFT PANEL — Branding ────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(145deg, #0f172a 0%, #1a0a2e 50%, #0f172a 100%)',
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative glow */}
          <div style={{
            position: 'absolute', top: '-30px', right: '-30px',
            width: '220px', height: '220px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)'
          }} />
          <div style={{
            position: 'absolute', bottom: '-40px', left: '-20px',
            width: '180px', height: '180px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%)'
          }} />

          {/* Logo */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 24px rgba(124,58,237,0.55)'
              }}>
                <HeartHandshake size={28} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
                  Partner<span style={{ color: '#ec4899' }}>OnRent</span>
                </div>
                <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  Emotional Wellness Platform
                </div>
              </div>
            </div>

            {/* Tagline */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a78bfa', fontWeight: 700, marginBottom: '10px' }}>
                {tab === 'signin' ? 'WELCOME BACK' : 'JOIN US TODAY'}
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '12px' }}>
                {tab === 'signin'
                  ? 'Sign in to your account'
                  : 'Create your free account'}
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {tab === 'signin'
                  ? 'Access your personalized portal and continue where you left off.'
                  : "Join thousands of users on India's most trusted companion platform."}
              </p>
            </div>

            {/* Feature Perks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                'Find verified, background-checked companions',
                'Secure payments with full money protection',
                'Built-in SOS & 24x7 safety monitoring',
                'Platonic companionship — 100% professional'
              ].map((perk, i) => (
                <div key={i} className="perk-item">
                  <CheckCircle2 size={15} color="#a78bfa" />
                  {perk}
                </div>
              ))}
            </div>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '40px', flexWrap: 'wrap' }}>
            {[
              { icon: <ShieldCheck size={13} />, label: 'Verified & Safe' },
              { icon: <Star size={13} />, label: '4.9★ Rated' },
              { icon: <Sparkles size={13} />, label: '50K+ Users' }
            ].map((badge, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '5px 10px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '999px',
                fontSize: '0.72rem', color: '#64748b', fontWeight: 600
              }}>
                <span style={{ color: '#a78bfa' }}>{badge.icon}</span>
                {badge.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL — Form ───────────────────────────────────────── */}
        <div style={{
          background: '#111827',
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '22px'
        }}>

          {/* ── Sign In / Sign Up Tabs ─────────────────────── */}
          <div style={{
            display: 'flex', gap: '0',
            background: 'rgba(15,23,42,0.6)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px', padding: '4px'
          }}>
            {['signin', 'signup'].map(t => (
              <button
                key={t}
                className="tab-btn"
                onClick={() => switchTab(t)}
                style={{
                  flex: 1, padding: '10px 0',
                  borderRadius: '7px',
                  fontSize: '0.9rem', fontWeight: 700,
                  background: tab === t
                    ? 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.2))'
                    : 'transparent',
                  color: tab === t ? '#e2d9f3' : '#475569',
                  border: tab === t ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
              >
                {t === 'signin' ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <LogIn size={14} /> Sign In
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <Sparkles size={14} /> Sign Up
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Alert messages ─────────────────────────────── */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 14px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '10px',
              fontSize: '0.85rem', color: '#f87171'
            }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}
          {success && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 14px',
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '10px',
              fontSize: '0.85rem', color: '#34d399'
            }}>
              <CheckCircle2 size={16} /> {success}
            </div>
          )}

          {/* ── SIGN IN FORM ─────────────────────────────────── */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <InputField
                label="Email Address"
                type="email"
                icon={<Mail size={15} />}
                value={signInForm.email}
                onChange={v => setSignInForm(f => ({ ...f, email: v }))}
                placeholder="your@email.com"
              />
              <PasswordField
                label="Password"
                show={showPassword}
                onToggle={() => setShowPassword(s => !s)}
                value={signInForm.password}
                onChange={v => setSignInForm(f => ({ ...f, password: v }))}
                placeholder="Enter your password"
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', fontSize: '0.82rem', color: '#64748b' }}>
                  <input
                    type="checkbox"
                    checked={signInForm.remember}
                    onChange={e => setSignInForm(f => ({ ...f, remember: e.target.checked }))}
                    style={{ width: '14px', height: '14px', accentColor: '#7c3aed' }}
                  />
                  Remember me
                </label>
                <span style={{ fontSize: '0.82rem', color: '#a78bfa', cursor: 'pointer', fontWeight: 600 }}>
                  Forgot password?
                </span>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
                style={{
                  width: '100%', padding: '14px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                  color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 4px 18px rgba(124,58,237,0.35)',
                  transition: 'all 0.25s ease',
                  border: 'none', cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LoadingSpinner /> Signing in…
                  </span>
                ) : (
                  <><ArrowRight size={16} /> Sign In</>
                )}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#475569' }}>
                Don't have an account?{' '}
                <span
                  onClick={() => switchTab('signup')}
                  style={{ color: '#a78bfa', fontWeight: 700, cursor: 'pointer' }}
                >
                  Create one free
                </span>
              </p>
            </form>
          )}

          {/* ── SIGN UP FORM ─────────────────────────────────── */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Register as dropdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ color: '#a78bfa' }}><User size={13} /></span> I want to register as *
                </label>
                <select
                  value={signUpForm.registerAs}
                  onChange={e => setSignUpForm(f => ({ ...f, registerAs: e.target.value }))}
                  className="auth-select"
                >
                  {REGISTER_AS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {signUpForm.registerAs === 'both' && (
                  <div style={{
                    fontSize: '0.75rem', color: '#64748b',
                    background: 'rgba(124,58,237,0.08)',
                    border: '1px solid rgba(124,58,237,0.2)',
                    borderRadius: '8px', padding: '8px 10px'
                  }}>
                    You can switch between Hirer and Partner modes from your profile settings after signing up.
                  </div>
                )}
              </div>

              <InputField
                label="Full Name *"
                type="text"
                icon={<User size={15} />}
                value={signUpForm.name}
                onChange={v => setSignUpForm(f => ({ ...f, name: v }))}
                placeholder="Your full name"
              />
              <InputField
                label="Email Address *"
                type="email"
                icon={<Mail size={15} />}
                value={signUpForm.email}
                onChange={v => setSignUpForm(f => ({ ...f, email: v }))}
                placeholder="your@email.com"
              />
              <InputField
                label="Phone Number"
                type="tel"
                icon={<Phone size={15} />}
                value={signUpForm.phone}
                onChange={v => setSignUpForm(f => ({ ...f, phone: v }))}
                placeholder="+91 98765 43210"
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <PasswordField
                  label="Password *"
                  show={showPassword}
                  onToggle={() => setShowPassword(s => !s)}
                  value={signUpForm.password}
                  onChange={v => setSignUpForm(f => ({ ...f, password: v }))}
                  placeholder="Min 6 chars"
                />
                <PasswordField
                  label="Confirm *"
                  show={showConfirm}
                  onToggle={() => setShowConfirm(s => !s)}
                  value={signUpForm.confirm}
                  onChange={v => setSignUpForm(f => ({ ...f, confirm: v }))}
                  placeholder="Repeat password"
                />
              </div>

              {/* City */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ color: '#a78bfa' }}><MapPin size={13} /></span> City
                </label>
                <select
                  value={signUpForm.city}
                  onChange={e => setSignUpForm(f => ({ ...f, city: e.target.value }))}
                  className="auth-select"
                >
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
                style={{
                  width: '100%', padding: '14px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                  color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 4px 18px rgba(124,58,237,0.35)',
                  transition: 'all 0.25s ease',
                  border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '4px'
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LoadingSpinner /> Creating account…
                  </span>
                ) : (
                  <><Sparkles size={16} /> Create Account</>
                )}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#334155', lineHeight: 1.6 }}>
                By creating an account, you agree to our{' '}
                <span
                  onClick={() => setActivePage('terms')}
                  style={{ color: '#a78bfa', cursor: 'pointer' }}
                >
                  Terms of Service
                </span>
                {' '}and{' '}
                <span
                  onClick={() => setActivePage('privacy')}
                  style={{ color: '#a78bfa', cursor: 'pointer' }}
                >
                  Privacy Policy
                </span>.
              </p>

              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#475569', marginTop: '-6px' }}>
                Already have an account?{' '}
                <span
                  onClick={() => switchTab('signin')}
                  style={{ color: '#a78bfa', fontWeight: 700, cursor: 'pointer' }}
                >
                  Sign in
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────
function InputField({ label, type, icon, value, onChange, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ color: '#a78bfa' }}>{icon}</span> {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="auth-input"
        style={{
          width: '100%', padding: '11px 14px',
          background: 'rgba(15,23,42,0.7)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '10px', fontSize: '0.92rem',
          color: '#f8fafc',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
}

function PasswordField({ label, show, onToggle, value, onChange, placeholder }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ color: '#a78bfa' }}><Lock size={13} /></span> {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="auth-input"
          style={{
            width: '100%', padding: '11px 40px 11px 14px',
            background: 'rgba(15,23,42,0.7)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px', fontSize: '0.92rem',
            color: '#f8fafc',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            boxSizing: 'border-box'
          }}
        />
        <button
          type="button"
          onClick={onToggle}
          style={{
            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
            color: '#475569', background: 'none', border: 'none', cursor: 'pointer', padding: '4px'
          }}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
