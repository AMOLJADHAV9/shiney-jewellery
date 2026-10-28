import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'register' | 'forgot'

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('shiney_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('shiney_user');
      }
    } catch (e) {
      console.error('Error saving user to localStorage', e);
    }
  }, [user]);

  const login = (usernameOrEmail, password) => {
    // Prototype login verification
    const patronName = usernameOrEmail.includes('@')
      ? usernameOrEmail.split('@')[0].replace('.', ' ').replace(/^./, (str) => str.toUpperCase())
      : usernameOrEmail;

    const loggedInUser = {
      name: patronName || 'Valued Patron',
      email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@atelier-patron.com`,
      tier: 'Gold Atelier Patron',
      joinedDate: 'October 2026'
    };

    setUser(loggedInUser);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const register = (name, email, password) => {
    const newUser = {
      name: name || 'Valued Patron',
      email: email,
      tier: 'Privilege Salon Member',
      joinedDate: 'October 2026'
    };

    setUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
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
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal
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
