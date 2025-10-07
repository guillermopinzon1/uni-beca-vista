import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logoutSession } from '@/lib/api';

interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  apellido?: string;
  role: string;
  activo: boolean;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: AuthUser | null;
  tokens: AuthTokens | null;
  loginSuccess: (user: AuthUser, tokens: AuthTokens) => void;
  logout: () => void;
  logoutAndNavigateHome: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('auth_user');
      const storedTokens = localStorage.getItem('auth_tokens');
      if (storedUser && storedTokens) {
        setUser(JSON.parse(storedUser));
        setTokens(JSON.parse(storedTokens));
        setIsLoggedIn(true);
      }
    } catch {}
  }, []);

  const loginSuccess = (nextUser: AuthUser, nextTokens: AuthTokens) => {
    setIsLoggedIn(true);
    setUser(nextUser);
    setTokens(nextTokens);
    try {
      localStorage.setItem('auth_user', JSON.stringify(nextUser));
      localStorage.setItem('auth_tokens', JSON.stringify(nextTokens));
    } catch {}
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setTokens(null);
    try {
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_tokens');
    } catch {}
  };

  const logoutAndNavigateHome = async () => {
    const stored = (() => { try { return JSON.parse(localStorage.getItem('auth_tokens') || 'null'); } catch { return null; } })();
    const accessToken = tokens?.accessToken || stored?.accessToken;
    try {
      if (accessToken) await logoutSession(accessToken);
    } catch {}
    logout();
    navigate('/');
  };

  // Nota: Se desactiva auto-logout en cambios de ruta para evitar cerrar sesión inesperadamente.
  // Si necesitas lógica específica de seguridad por ruta, agrégala aquí con condiciones explícitas.

  // Auto-logout por navegación deshabilitado.

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, tokens, loginSuccess, logout, logoutAndNavigateHome }}>
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