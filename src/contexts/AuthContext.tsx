import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface AuthContextType {
  isLoggedIn: boolean;
  userType: 'student' | 'admin' | null;
  login: (type: 'student' | 'admin') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'student' | 'admin' | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const login = (type: 'student' | 'admin') => {
    setIsLoggedIn(true);
    setUserType(type);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
  };

  // Auto logout when visiting /modules
  useEffect(() => {
    if (location.pathname === '/modules') {
      logout();
    }
  }, [location.pathname]);

  // Auto logout when leaving ayudantías module
  useEffect(() => {
    const currentPath = location.pathname;
    const isInAyudantias = currentPath.includes('/ayudantias') || 
                          currentPath.includes('/login-ayudantias') ||
                          currentPath.includes('/register-ayudantias') ||
                          currentPath.includes('/pasante-ayudantias');

    // If user was logged in for ayudantías and is now leaving the module
    if (isLoggedIn && userType && !isInAyudantias && 
        !currentPath.includes('/excelencia') && 
        !currentPath.includes('/impacto') && 
        !currentPath.includes('/formacion-docente')) {
      
      // Check if we're going to a non-ayudantías route that should trigger logout
      const shouldLogout = currentPath === '/' || 
                          currentPath === '/modules' || 
                          currentPath === '/scholarship-programs' ||
                          currentPath.includes('/login') ||
                          currentPath.includes('/register');
      
      if (shouldLogout) {
        logout();
      }
    }
  }, [location.pathname, isLoggedIn, userType]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};