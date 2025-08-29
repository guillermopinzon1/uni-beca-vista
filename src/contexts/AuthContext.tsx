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
    try {
      if (location.pathname === '/modules') {
        if (isLoggedIn) {
          console.log('Auto logout triggered on /modules route');
          logout();
        }
      }
    } catch (error) {
      console.error('Error in modules logout effect:', error);
    }
  }, [location.pathname, isLoggedIn]);

  // Auto logout when leaving ayudantías module (simplified logic)
  useEffect(() => {
    try {
      const currentPath = location.pathname;
      
      // Only trigger logout logic if user is actually logged in
      if (!isLoggedIn) return;
      
      const isInAyudantiasModule = currentPath.includes('/ayudantias') || 
                                  currentPath.includes('/login-ayudantias') ||
                                  currentPath.includes('/register-ayudantias');
      
      const isInBecasModules = currentPath.includes('/excelencia') || 
                              currentPath.includes('/impacto') || 
                              currentPath.includes('/formacion-docente') ||
                              currentPath.includes('/postulaciones-becas');
      
      // If user is logged in but not in any protected module, logout
      if (!isInAyudantiasModule && !isInBecasModules) {
        const shouldLogout = currentPath === '/' || 
                            currentPath === '/modules' || 
                            currentPath === '/scholarship-programs' ||
                            currentPath.includes('/login') ||
                            currentPath.includes('/register');
        
        if (shouldLogout) {
          console.log('Auto logout triggered for path:', currentPath);
          logout();
        }
      }
    } catch (error) {
      console.error('Error in ayudantias logout effect:', error);
    }
  }, [location.pathname, isLoggedIn]);

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