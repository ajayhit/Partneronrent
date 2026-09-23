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
  Briefcase,
  LayoutDashboard,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  ChevronRight,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

// ─── Demo credentials ──────────────────────────────────────────────────────
const DEMO_CREDENTIALS = {
  client: { email: 'rahul@example.com', password: 'demo1234' },
  partner: { email: 'aanya@example.com', password: 'demo1234' },
  admin: { email: 'admin@partneronrent.in', password: 'Admin@12345' }
};

const CITIES = [
  'Delhi NCR', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai',
  'Pune', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Lucknow'
];

// ─── Role Config ──────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  client: {
    label: 'Hirer',
    icon: <User size={16} />,
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #7c3aed, #ec4899)',
    glow: 'rgba(236, 72, 153, 0.3)',
    border: 'rgba(236, 72, 153, 0.4)',
    tagline: 'Find your perfect companion',
    perks: ['Access top-rated partners', 'Secure booking & payments', 'SOS safety feature']
  },
  partner: {
    label: 'Partner',
    icon: <Briefcase size={16} />,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    glow: 'rgba(16, 185, 129, 0.3)',
    border: 'rgba(16, 185, 129, 0.4)',
    tagline: 'Earn on your own terms',
    perks: ['Set your own schedule', 'Get paid securely', 'Build your reputation']
  },
  admin: {
    label: 'Admin',
    icon: <LayoutDashboard size={16} />,
    color: '#38bdf8',
    gradient: 'linear-gradient(135deg, #0284c7, #0369a1)',
    glow: 'rgba(56, 189, 248, 0.3)',
    border: 'rgba(56, 189, 248, 0.4)',
    tagline: 'Platform management portal',
    perks: ['Full platform oversight', 'Manage all users', 'Analytics & reports']
  }
};

export default function SignIn({ setActivePage }) {
  const { login, register } = useAuth();

  const [tab, setTab] = useState('signin');       // 'signin' | 'signup'
  const [role, setRole] = useState('client');     // 'client' | 'partner' | 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Sign in form state
  const [signInForm, setSignInForm] = useState({ email: '', password: '', remember: false });

  // Sign up form state
  const [signUpForm, setSignUpForm] = useState({
    name: '', email: '', phone: '', password: '', confirm: '', city: 'Delhi NCR'
  });

  const rc = ROLE_CONFIG[role];

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleDemoFill = () => {
    const creds = DEMO_CREDENTIALS[role];
    setSignInForm(f => ({ ...f, email: creds.email, password: creds.password }));
    setError('');
  };

  const handleQuickAdminLogin = async () => {
    const creds = DEMO_CREDENTIALS.admin;
    setSignInForm(f => ({ ...f, email: creds.email, password: creds.password, remember: true }));
    setLoading(true);
    setError('');
    setSuccess('');
    await new Promise(r => setTimeout(r, 400));
    const result = await login(creds.email, creds.password, 'admin');
    setLoading(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setSuccess('Admin credentials verified! Entering operations dashboard…');
    setTimeout(() => {
      setActivePage('admin-dashboard');
    }, 600);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!signInForm.email || !signInForm.password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500)); // simulate network
    const result = await login(signInForm.email, signInForm.password, role);
    setLoading(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setSuccess('Welcome back! Redirecting…');
    setTimeout(() => {
      if (role === 'client') setActivePage('client-dashboard');
      else if (role === 'partner') setActivePage('partner-dashboard');
      else setActivePage('admin-dashboard');
    }, 700);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const { name, email, phone, password, confirm, city } = signUpForm;
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
    if (role === 'admin') {
      setError('Admin accounts cannot be self-registered.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const result = register({ name, email, phone, password, city }, role);
    setLoading(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setSuccess('Account created! Redirecting to your portal…');
    setTimeout(() => {
      if (role === 'client') setActivePage('client-dashboard');
      else setActivePage('partner-dashboard');
    }, 900);
  };

  const switchTab = (newTab) => {
    setTab(newTab);
    setError('');
    setSuccess('');
  };

  const switchRole = (newRole) => {
    setRole(newRole);
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
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden'
      }}>
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
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .auth-card {
          animation: slideUp 0.5s ease both;
        }
        .role-tab:hover {
          transform: translateY(-1px);
        }
        .auth-input:focus {
          border-color: var(--focus-color) !important;
          box-shadow: 0 0 0 3px var(--focus-glow) !important;
        }
        .demo-btn:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px var(--btn-glow) !important;
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .perk-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: #94a3b8;
        }
      `}</style>

      {/* ─── Two-column layout ──────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0',
        maxWidth: '960px',
        width: '100%',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        border: '1px solid rgba(255,255,255,0.07)',
        position: 'relative',
        zIndex: 1
      }} className="auth-card">

        {/* ── LEFT PANEL — Branding ─────────────────────────────────────── */}
        <div style={{
          background: `linear-gradient(145deg, #0f172a 0%, #1a0a2e 50%, #0f172a 100%)`,
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
            width: '200px', height: '200px', borderRadius: '50%',
            background: `radial-gradient(circle, ${rc.glow} 0%, transparent 70%)`,
            transition: 'all 0.4s ease'
          }} />

          {/* Logo */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(124,58,237,0.5)'
              }}>
                <HeartHandshake size={26} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
                  Partner<span style={{ color: '#ec4899' }}>OnRent</span>
                </div>
                <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                  Emotional Wellness Platform
                </div>
              </div>
            </div>

            {/* Tagline */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: rc.color, fontWeight: 700, marginBottom: '10px' }}>
                {rc.label.toUpperCase()} PORTAL
              </div>
              <h2 style={{ fontSize: '1.9rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '12px' }}>
                {rc.tagline}
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {tab === 'signin'
                  ? 'Welcome back. Sign in to access your personalized portal.'
                  : 'Join thousands of users on India\'s most trusted companion platform.'}
              </p>
            </div>

            {/* Perks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {rc.perks.map((perk, i) => (
                <div key={i} className="perk-item">
                  <CheckCircle2 size={15} color={rc.color} />
                  {perk}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom trust badges */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '40px', flexWrap: 'wrap' }}>
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
                <span style={{ color: rc.color }}>{badge.icon}</span>
                {badge.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL — Form ────────────────────────────────────────── */}
        <div style={{
          background: '#111827',
          padding: '48px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>

          {/* ── Role Tabs ─────────────────────────────────── */}
          <div>
            <div style={{ fontSize: '0.72rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: '10px' }}>
              I am a
            </div>
            <div style={{
              display: 'flex', gap: '6px',
              background: 'rgba(15,23,42,0.8)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '12px', padding: '4px'
            }}>
              {['client', 'partner', 'admin'].map(r => {
                const cfg = ROLE_CONFIG[r];
                const isActive = role === r;
                return (
                  <button
                    key={r}
                    className="role-tab"
                    onClick={() => switchRole(r)}
                    style={{
                      flex: 1, padding: '8px 4px',
                      borderRadius: '9px',
                      fontSize: '0.82rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                      background: isActive ? cfg.gradient : 'transparent',
                      color: isActive ? '#fff' : '#475569',
                      transition: 'all 0.25s ease',
                      border: isActive ? `1px solid ${cfg.border}` : '1px solid transparent',
                      boxShadow: isActive ? `0 4px 14px ${cfg.glow}` : 'none'
                    }}
                  >
                    {cfg.icon} {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Sign In / Sign Up Tab ───────────────────────── */}
          <div style={{
            display: 'flex', gap: '0',
            background: 'rgba(15,23,42,0.6)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px', padding: '4px'
          }}>
            {['signin', 'signup'].map(t => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                style={{
                  flex: 1, padding: '9px 0',
                  borderRadius: '7px',
                  fontSize: '0.88rem', fontWeight: 700,
                  background: tab === t ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: tab === t ? '#f8fafc' : '#475569',
                  border: tab === t ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                {t === 'signin' ? 'Sign In' : 'Sign Up'}
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
              
              {/* Highlighted Admin Credentials Banner */}
              {role === 'admin' && (
                <div style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8' }}>
                      <ShieldCheck size={16} /> Super Admin Credentials
                    </div>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.2)', color: '#bae6fd', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                      Operations
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem' }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Admin Email</div>
                      <div style={{ color: '#fff', fontWeight: 600, wordBreak: 'break-all' }}>admin@partneronrent.in</div>
                    </div>
                    <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Default Password</div>
                      <div style={{ color: '#38bdf8', fontWeight: 700 }}>Admin@12345</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleQuickAdminLogin}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                      color: '#fff',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 10px rgba(2, 132, 199, 0.3)'
                    }}
                  >
                    ⚡ 1-Click Direct Admin Sign In
                  </button>
                </div>
              )}

              <InputField
                label="Email Address"
                type="email"
                icon={<Mail size={15} />}
                value={signInForm.email}
                onChange={v => setSignInForm(f => ({ ...f, email: v }))}
                placeholder={role === 'admin' ? "admin@partneronrent.in" : "your@email.com"}
                accentColor={rc.color}
                accentGlow={rc.glow}
              />
              <PasswordField
                label="Password"
                show={showPassword}
                onToggle={() => setShowPassword(s => !s)}
                value={signInForm.password}
                onChange={v => setSignInForm(f => ({ ...f, password: v }))}
                placeholder={role === 'admin' ? "Admin@12345" : "Enter your password"}
                accentColor={rc.color}
                accentGlow={rc.glow}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', fontSize: '0.82rem', color: '#64748b' }}>
                  <input
                    type="checkbox"
                    checked={signInForm.remember}
                    onChange={e => setSignInForm(f => ({ ...f, remember: e.target.checked }))}
                    style={{ width: '14px', height: '14px', accentColor: rc.color }}
                  />
                  Remember me
                </label>
                <span style={{ fontSize: '0.82rem', color: rc.color, cursor: 'pointer', fontWeight: 600 }}>
                  Forgot password?
                </span>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
                style={{
                  '--btn-glow': rc.glow,
                  width: '100%', padding: '13px',
                  borderRadius: '12px',
                  background: rc.gradient,
                  color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: `0 4px 18px ${rc.glow}`,
                  transition: 'all 0.25s ease',
                  border: 'none', cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LoadingSpinner /> Signing in…
                  </span>
                ) : (
                  <><ArrowRight size={16} /> Sign In as {rc.label}</>
                )}
              </button>

              {/* Demo fill */}
              <button
                type="button"
                className="demo-btn"
                onClick={handleDemoFill}
                style={{
                  width: '100%', padding: '10px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px dashed ${rc.border}`,
                  color: rc.color,
                  fontSize: '0.82rem', fontWeight: 600,
                  transition: 'all 0.2s ease', cursor: 'pointer'
                }}
              >
                ⚡ Quick fill credentials ({rc.label}: {DEMO_CREDENTIALS[role].email})
              </button>

              {role === 'admin' ? (
                <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#64748b' }}>
                  Admin privileges are restricted to platform operations personnel.
                </p>
              ) : (
                <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#475569' }}>
                  Don't have an account?{' '}
                  <span
                    onClick={() => switchTab('signup')}
                    style={{ color: rc.color, fontWeight: 700, cursor: 'pointer' }}
                  >
                    Sign up free
                  </span>
                </p>
              )}
            </form>
          )}

          {/* ── SIGN UP FORM ─────────────────────────────────── */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {role === 'admin' && (
                <div style={{
                  padding: '12px 14px',
                  background: 'rgba(56,189,248,0.08)',
                  border: '1px solid rgba(56,189,248,0.2)',
                  borderRadius: '10px',
                  fontSize: '0.83rem', color: '#7dd3fc'
                }}>
                  Admin accounts require manual provisioning. Please use Sign In with your provided credentials.
                </div>
              )}
              {role !== 'admin' && (
                <>
                  <InputField
                    label="Full Name *"
                    type="text"
                    icon={<User size={15} />}
                    value={signUpForm.name}
                    onChange={v => setSignUpForm(f => ({ ...f, name: v }))}
                    placeholder="Your full name"
                    accentColor={rc.color}
                    accentGlow={rc.glow}
                  />
                  <InputField
                    label="Email Address *"
                    type="email"
                    icon={<Mail size={15} />}
                    value={signUpForm.email}
                    onChange={v => setSignUpForm(f => ({ ...f, email: v }))}
                    placeholder="your@email.com"
                    accentColor={rc.color}
                    accentGlow={rc.glow}
                  />
                  <InputField
                    label="Phone Number"
                    type="tel"
                    icon={<Phone size={15} />}
                    value={signUpForm.phone}
                    onChange={v => setSignUpForm(f => ({ ...f, phone: v }))}
                    placeholder="+91 98765 43210"
                    accentColor={rc.color}
                    accentGlow={rc.glow}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <PasswordField
                      label="Password *"
                      show={showPassword}
                      onToggle={() => setShowPassword(s => !s)}
                      value={signUpForm.password}
                      onChange={v => setSignUpForm(f => ({ ...f, password: v }))}
                      placeholder="Min 6 chars"
                      accentColor={rc.color}
                      accentGlow={rc.glow}
                    />
                    <PasswordField
                      label="Confirm *"
                      show={showConfirm}
                      onToggle={() => setShowConfirm(s => !s)}
                      value={signUpForm.confirm}
                      onChange={v => setSignUpForm(f => ({ ...f, confirm: v }))}
                      placeholder="Repeat password"
                      accentColor={rc.color}
                      accentGlow={rc.glow}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={13} /> City
                    </label>
                    <select
                      value={signUpForm.city}
                      onChange={e => setSignUpForm(f => ({ ...f, city: e.target.value }))}
                      style={{
                        width: '100%', padding: '11px 14px',
                        background: 'rgba(15,23,42,0.7)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        color: '#f8fafc', fontSize: '0.92rem'
                      }}
                    >
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                    style={{
                      '--btn-glow': rc.glow,
                      width: '100%', padding: '13px',
                      borderRadius: '12px',
                      background: rc.gradient,
                      color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      boxShadow: `0 4px 18px ${rc.glow}`,
                      transition: 'all 0.25s ease',
                      border: 'none', cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LoadingSpinner /> Creating account…
                      </span>
                    ) : (
                      <><Sparkles size={16} /> Create {rc.label} Account</>
                    )}
                  </button>

                  <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#334155', lineHeight: 1.5 }}>
                    By creating an account, you agree to our{' '}
                    <span style={{ color: rc.color, cursor: 'pointer' }}>Terms of Service</span>
                    {' '}and{' '}
                    <span style={{ color: rc.color, cursor: 'pointer' }}>Privacy Policy</span>.
                  </p>
                </>
              )}

              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#475569' }}>
                Already have an account?{' '}
                <span
                  onClick={() => switchTab('signin')}
                  style={{ color: rc.color, fontWeight: 700, cursor: 'pointer' }}
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
function InputField({ label, type, icon, value, onChange, placeholder, accentColor, accentGlow }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ color: accentColor }}>{icon}</span> {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="auth-input"
          style={{
            '--focus-color': accentColor,
            '--focus-glow': accentGlow,
            width: '100%', padding: '11px 14px',
            background: 'rgba(15,23,42,0.7)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px', fontSize: '0.92rem'
          }}
        />
      </div>
    </div>
  );
}

function PasswordField({ label, show, onToggle, value, onChange, placeholder, accentColor, accentGlow }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ color: accentColor }}><Lock size={13} /></span> {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="auth-input"
          style={{
            '--focus-color': accentColor,
            '--focus-glow': accentGlow,
            width: '100%', padding: '11px 40px 11px 14px',
            background: 'rgba(15,23,42,0.7)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px', fontSize: '0.92rem'
          }}
        />
        <button
          type="button"
          onClick={onToggle}
          style={{
            position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
            color: '#475569', background: 'none', border: 'none', cursor: 'pointer', padding: '2px'
          }}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      <path d="M8 2 A6 6 0 0 1 14 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
