import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// ─── Mock User Store ────────────────────────────────────────────────────────
// Pre-seeded demo accounts
const MOCK_USERS_KEY = 'por_mock_users';

const DEFAULT_USERS = [
  {
    id: 'client-1',
    name: 'Rahul Verma',
    role: 'client',
    email: 'rahul@example.com',
    phone: '+91 98765 43210',
    password: 'demo1234',
    city: 'Delhi NCR',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    walletBalance: 4500
  },
  {
    id: 'partner-p1',
    name: 'Aanya Sharma',
    role: 'partner',
    email: 'aanya@example.com',
    phone: '+91 91234 56789',
    password: 'demo1234',
    city: 'Delhi NCR',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    hourlyRate: 1500,
    walletBalance: 18400,
    totalEarnings: 94000
  },
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

function getMockUsers() {
  try {
    const stored = localStorage.getItem(MOCK_USERS_KEY);
    let users = stored ? JSON.parse(stored) : DEFAULT_USERS;
    
    // Ensure admin user has latest credentials
    const adminIdx = users.findIndex(u => u.role === 'admin');
    if (adminIdx !== -1) {
      if (!users[adminIdx].password || users[adminIdx].password === 'admin2024') {
        users[adminIdx].password = 'Admin@12345';
        users[adminIdx].email = 'admin@partneronrent.in';
        users[adminIdx].name = 'Super Administrator';
        saveMockUsers(users);
      }
    } else {
      users.push(DEFAULT_USERS[2]);
      saveMockUsers(users);
    }
    return users;
  } catch {
    return DEFAULT_USERS;
  }
}

function saveMockUsers(users) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

// ─── Session persistence key ─────────────────────────────────────────────────
const SESSION_KEY = 'por_session';

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
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
  const activeUser = session?.role === 'client' || session?.role === 'admin' ? session : null;
  const activePartner = session?.role === 'partner' ? session : null;

  // Persist session changes
  useEffect(() => {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      localStorage.setItem('por_role', session.role);
    } else {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem('por_role');
    }
  }, [session]);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async (email, password, role) => {
    const normEmail = (email || '').trim().toLowerCase();

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
    } catch {
      // Backend unavailable or network error, fallback to local store below
    }

    // 2. Local fallback verification
    const users = getMockUsers();
    const user = users.find(u => {
      const uEmail = (u.email || '').toLowerCase();
      const roleMatches = !role || u.role === role;
      const emailMatches =
        uEmail === normEmail ||
        (u.role === 'admin' && (normEmail === 'admin@partneronrent.in' || normEmail === 'admin@partneronrent.com'));

      return roleMatches && emailMatches && u.password === password;
    });

    if (!user) {
      return { success: false, message: 'Invalid email or password. Please check your credentials.' };
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
  const register = (formData, role) => {
    const users = getMockUsers();
    const existing = users.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser = {
      id: `${role}-${Date.now()}`,
      role,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '',
      password: formData.password,
      city: formData.city || 'India',
      avatar: role === 'partner'
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      walletBalance: 0,
      ...(role === 'partner' ? { hourlyRate: 1000, totalEarnings: 0 } : {})
    };
    const updatedUsers = [...users, newUser];
    saveMockUsers(updatedUsers);
    const { password: _pw, ...safeUser } = newUser;
    setSession(safeUser);
    return { success: true, user: safeUser };
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    setSession(null);
  };

  // ── Update session user (e.g. wallet balance) ──────────────────────────────
  const updateSession = (updates) => {
    setSession(prev => prev ? { ...prev, ...updates } : prev);
  };

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
