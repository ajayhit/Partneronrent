import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Roles: 'client', 'partner', 'admin', 'guest'
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('por_role') || 'client';
  });

  const [activeUser, setActiveUser] = useState({
    id: 'client-1',
    name: 'Rahul Verma',
    role: 'client',
    phone: '+91 98765 43210',
    email: 'rahul.verma@example.com',
    city: 'Delhi NCR',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    walletBalance: 4500
  });

  const [activePartner, setActivePartner] = useState({
    id: 'partner-p1',
    name: 'Aanya Sharma',
    city: 'Delhi NCR',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    hourlyRate: 1500,
    walletBalance: 18400,
    totalEarnings: 94000
  });

  useEffect(() => {
    localStorage.setItem('por_role', currentRole);
  }, [currentRole]);

  const switchRole = (newRole) => {
    setCurrentRole(newRole);
    if (newRole === 'client') {
      setActiveUser({
        id: 'client-1',
        name: 'Rahul Verma',
        role: 'client',
        phone: '+91 98765 43210',
        email: 'rahul.verma@example.com',
        city: 'Delhi NCR',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
        walletBalance: 4500
      });
    } else if (newRole === 'partner') {
      setActivePartner({
        id: 'partner-p1',
        name: 'Aanya Sharma',
        city: 'Delhi NCR',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        hourlyRate: 1500,
        walletBalance: 18400,
        totalEarnings: 94000
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        switchRole,
        activeUser,
        setActiveUser,
        activePartner,
        setActivePartner
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
