import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// ─── User Store ──────────────────────────────────────────────────────────────
const MOCK_USERS_KEY = 'por_mock_users';

const DEFAULT_USERS = [
  {
    id: 'admin-1',
    name: 'Super Administrator',
    role: 'admin',
    email: 'admin@partneronrent.in',
    phone: '+91 98105 35398',
    password: 'Admin@12345',
    city: 'Delhi NCR',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
    walletBalance: 0
  }
];

// Default avatar shown when no photo is uploaded
const DEFAULT_AVATAR = '/default-avatar.jpg';

// Old placeholder avatar URLs that should be replaced with the default avatar
const PLACEHOLDER_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'
];

function getMockUsers() {
  try {
    const stored = localStorage.getItem(MOCK_USERS_KEY);
    let users = stored ? JSON.parse(stored) : DEFAULT_USERS;
    
    // Purge old dummy accounts from localStorage
    users = users.filter(u => u.id !== 'client-1' && u.id !== 'partner-p1' && u.email !== 'rahul@example.com' && u.email !== 'aanya@example.com');
    
    // Ensure admin user exists with latest credentials
    const adminIdx = users.findIndex(u => u.role === 'admin');
    if (adminIdx !== -1) {
      if (!users[adminIdx].password || users[adminIdx].password === 'admin2024') {
        users[adminIdx].password = 'Admin@12345';
        users[adminIdx].email = 'admin@partneronrent.in';
        users[adminIdx].name = 'Super Administrator';
      }
    } else {
      users.push(DEFAULT_USERS[0]);
    }

    // Replace old placeholder avatars with the default avatar
    users = users.map(u =>
      PLACEHOLDER_AVATARS.includes(u.avatar) || !u.avatar ? { ...u, avatar: DEFAULT_AVATAR } : u
    );

    saveMockUsers(users);
    return users;
  } catch {
    return DEFAULT_USERS;
  }
}

function saveMockUsers(users) {
  try {
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.warn('Could not save mock users to localStorage (quota exceeded):', err);
  }
}

// ─── Session persistence key ─────────────────────────────────────────────────
const SESSION_KEY = 'por_user_session';

function sanitizeSessionForStorage(sess) {
  if (!sess) return null;
  const copy = { ...sess };
  // Never store base64 document files or massive strings in localStorage
  if (copy.kycDocuments) {
    const { idFrontDoc, idBackDoc, panDoc, selfieDoc, addressDoc, ...safeKyc } = copy.kycDocuments;
    copy.kycDocuments = safeKyc;
  }
  // Strip large base64 data URLs from avatar/coverPhoto to prevent exceeding localStorage quota
  if (typeof copy.avatar === 'string' && copy.avatar.startsWith('data:')) {
    copy.avatar = DEFAULT_AVATAR;
  }
  if (typeof copy.coverPhoto === 'string' && copy.coverPhoto.startsWith('data:')) {
    copy.coverPhoto = '';
  }
  return copy;
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    let session = raw ? JSON.parse(raw) : null;
    // Don't restore dummy demo sessions
    if (session && (session.id === 'client-1' || session.id === 'partner-p1' || session.email === 'rahul@example.com' || session.email === 'aanya@example.com')) {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem('por_role');
      return null;
    }
    // Clean up oversized data from legacy stored sessions
    if (session) {
      session = sanitizeSessionForStorage(session);
      try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      } catch {
        // ignore
      }
    }
    // Replace old placeholder avatars with the default avatar in the restored session
    if (session && (PLACEHOLDER_AVATARS.includes(session.avatar) || !session.avatar)) {
      session = { ...session, avatar: DEFAULT_AVATAR };
    }
    return session;
  } catch {
    return null;
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);

  // Derived state
  const isAuthenticated = !!session;
  const currentRole = session?.role || 'guest';
  const activeUser = session?.role === 'client' || session?.role === 'both' || session?.role === 'admin' ? session : null;
  const activePartner = session?.role === 'partner' || session?.role === 'both' ? session : null;

  // Persist session changes safely without exceeding localStorage quota
  useEffect(() => {
    if (session) {
      try {
        const safeSession = sanitizeSessionForStorage(session);
        localStorage.setItem(SESSION_KEY, JSON.stringify(safeSession));
        localStorage.setItem('por_role', session.role || 'guest');
      } catch (err) {
        console.warn('LocalStorage quota exceeded when storing session, falling back to minimal session:', err);
        try {
          const minimal = {
            id: session.id,
            name: session.name,
            email: session.email,
            role: session.role || 'guest',
            city: session.city,
            avatar: DEFAULT_AVATAR,
            kycStatus: session.kycStatus,
            kycRejectionReason: session.kycRejectionReason
          };
          localStorage.setItem(SESSION_KEY, JSON.stringify(minimal));
          localStorage.setItem('por_role', session.role || 'guest');
        } catch (innerErr) {
          console.warn('Unable to persist even minimal session to localStorage:', innerErr);
        }
      }
    } else {
      try {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem('por_role');
        localStorage.removeItem('por_active_page');
      } catch {}
    }
  }, [session]);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async (email, password, role) => {
    const normEmail = (email || '').trim().toLowerCase();
    let serverRejectedLogin = false;

    // 1. Try server-side authentication first
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normEmail, password, role })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setSession(data.user);
          return { success: true, user: data.user };
        }
      }
      serverRejectedLogin = res.status === 401;
    } catch {
      // Backend unavailable or network error, fallback to local store below
    }

    // 2. Local fallback verification
    const users = getMockUsers();
    const user = users.find(u => {
      const uEmail = (u.email || '').toLowerCase().trim();
      const uPhone = (u.phone || '').replace(/[\s\-\+\(\)]/g, '');
      const cleanInput = normEmail.replace(/[\s\-\+\(\)]/g, '');
      // role=null means auto-detect (single login screen — match any role)
      const roleMatches = !role || u.role === role;
      const emailMatches =
        uEmail === normEmail ||
        (cleanInput && uPhone.length >= 6 && uPhone.includes(cleanInput)) ||
        (u.role === 'admin' && (normEmail === 'admin@partneronrent.in' || normEmail === 'admin@partneronrent.com'));

      return roleMatches && emailMatches && u.password === password;
    });

    if (!user) {
      return { success: false, message: 'Invalid email or password. Please check your credentials.' };
    }

    if (serverRejectedLogin && ['client', 'partner', 'both'].includes(user.role)) {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            phone: user.phone,
            password: user.password,
            role: user.role,
            city: user.city || 'Delhi NCR'
          })
        });
        const data = await res.json();
        if (res.ok && data.success && data.user) {
          const syncedUser = { ...data.user, password: user.password };
          saveMockUsers(users.map(account =>
            account.email.toLowerCase() === user.email.toLowerCase() ? syncedUser : account
          ));
          setSession(data.user);
          return { success: true, user: data.user };
        }
        if (res.status !== 400) {
          console.error('Failed to sync local account with the server:', data.message || res.statusText);
        }
      } catch (error) {
        console.error('Failed to sync local account with the server:', error);
      }
    }

    const { password: _pw, ...safeUser } = user;
    setSession(safeUser);
    return { success: true, user: safeUser };
  };

  // ── Change Admin Password ──────────────────────────────────────────────────
  const updateAdminPassword = async (currentPassword, newPassword) => {
    // 1. Try server update
    try {
      const res = await fetch('/api/auth/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || 'Failed to update password on server.' };
      }
    } catch {
      // If server unreachable, proceed with local update
    }

    // 2. Update local mock user store
    const users = getMockUsers();
    const adminIdx = users.findIndex(u => u.role === 'admin');
    if (adminIdx !== -1) {
      if (users[adminIdx].password !== currentPassword && users[adminIdx].password) {
        return { success: false, message: 'Current password does not match.' };
      }
      users[adminIdx].password = newPassword;
      saveMockUsers(users);
    }

    return { success: true, message: 'Admin password updated successfully!' };
  };

  // ── Register ───────────────────────────────────────────────────────────────
  const register = async (formData, role) => {
    const users = getMockUsers();
    const existing = users.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    let response;
    let data;
    try {
      response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role,
          city: formData.city || 'Delhi NCR'
        })
      });
      data = await response.json();
    } catch (error) {
      console.error('Failed to register account with the server:', error);
      return { success: false, message: 'Could not create your account because the server is unavailable. Please try again.' };
    }

    if (!response.ok || !data.success || !data.user) {
      return { success: false, message: data.message || 'Could not create your account. Please try again.' };
    }

    const newUser = { ...data.user, password: formData.password };
    saveMockUsers([...users, newUser]);

    const { password: _pw, ...safeUser } = data.user;
    setSession(safeUser);
    return { success: true, user: safeUser };
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    setSession(null);
  };

  // ── Update session user (e.g. wallet balance) ──────────────────────────────
  const updateSession = (updates) => {
    setSession(prev => {
      if (!prev) return prev;
      const nextUpdates = typeof updates === 'function' ? updates(prev) : updates;
      const nextSession = { ...prev, ...nextUpdates };
      try {
        const safe = sanitizeSessionForStorage(nextSession);
        localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
      } catch (err) {
        console.warn('Could not persist updated session to localStorage:', err);
      }
      return nextSession;
    });
  };

  // ── Sync latest session data & wallet balance from server ────────────────────
  const refreshSession = async () => {
    if (!session?.id) return;
    try {
      const res = await fetch(`/api/wallet/${session.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.balance === 'number') {
          updateSession({ walletBalance: data.balance });
        }
      }
    } catch {
      // Ignore background refresh errors
    }
  };

  useEffect(() => {
    if (!session?.id) return;
    refreshSession();

    const handleFocus = () => refreshSession();
    window.addEventListener('focus', handleFocus);
    const interval = setInterval(refreshSession, 15000); // 15s polling to catch admin credits

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, [session?.id]);

  return (
    <AuthContext.Provider
      value={{
        // State
        isAuthenticated,
        currentRole,
        session,
        activeUser,
        activePartner,
        // Actions
        login,
        logout,
        register,
        updateSession,
        refreshSession,
        updateAdminPassword,
        // Legacy compat
        setActiveUser: updateSession,
        setActivePartner: updateSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
