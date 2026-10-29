import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('shiney_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Error loading user from localStorage', e);
      return null;
    }
  });

  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register' | 'forgot'

  // Rehydrate session from backend on mount
  useEffect(() => {
    const rehydrate = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const profile = await api.auth.getMe();
          const mappedUser = {
            id: profile.id,
            name: `${profile.firstName} ${profile.lastName}`.trim() || 'Valued Patron',
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            role: profile.role,
            tier: profile.role === 'admin' ? 'Salon Director & Admin' : 'Privilege Salon Member',
            joinedDate: new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            addresses: profile.addresses || [],
          };
          setUser(mappedUser);
          localStorage.setItem('shiney_user', JSON.stringify(mappedUser));
        } catch (err) {
          console.warn('Session expired or rehydration failed:', err.message);
          api.auth.logout();
          setUser(null);
          localStorage.removeItem('shiney_user');
        }
      }
      setLoading(false);
    };

    rehydrate();
  }, []);

  const login = async (usernameOrEmail, password) => {
    try {
      const res = await api.auth.login(usernameOrEmail, password);
      const profile = res.user;
      const loggedInUser = {
        id: profile.id,
        name: `${profile.firstName} ${profile.lastName}`.trim() || 'Valued Patron',
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        role: profile.role,
        tier: profile.role === 'admin' ? 'Salon Director & Admin' : 'Privilege Salon Member',
        joinedDate: new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      };

      setUser(loggedInUser);
      localStorage.setItem('shiney_user', JSON.stringify(loggedInUser));
      setIsAuthModalOpen(false);
      return { success: true, user: loggedInUser };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const parts = (name || '').trim().split(' ');
      const firstName = parts[0] || 'Valued';
      const lastName = parts.slice(1).join(' ') || 'Patron';

      const res = await api.auth.register({
        email,
        password,
        firstName,
        lastName,
      });

      const profile = res.user;
      const newUser = {
        id: profile.id,
        name: `${profile.firstName} ${profile.lastName}`.trim() || 'Valued Patron',
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        role: profile.role,
        tier: 'Privilege Salon Member',
        joinedDate: new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      };

      setUser(newUser);
      localStorage.setItem('shiney_user', JSON.stringify(newUser));
      setIsAuthModalOpen(false);
      return { success: true, user: newUser };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    api.auth.logout();
    setUser(null);
    localStorage.removeItem('shiney_user');
  };

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
        login,
        register,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
