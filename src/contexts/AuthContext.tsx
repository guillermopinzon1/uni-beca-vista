import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setLogoutCallback } from '@/lib/api/apiClient';
import { API_BASE } from '@/lib/api/config';

interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  role: string;
  activo: boolean;
  emailVerified?: boolean;
  firstLogin?: boolean;
  cedula?: string;
  telefono?: string;
  carnet?: string;
  carrera?: string;
  trimestre?: number;
  iaa?: number;
  asignaturasAprobadas?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // Allow additional fields
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  tokens: AuthTokens | null;
  loginSuccess: (user: AuthUser, tokens: AuthTokens) => void;
  logout: (navigate?: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('auth_user');
        const storedTokens = localStorage.getItem('auth_tokens');

        if (storedUser && storedTokens) {
          const parsedTokens = JSON.parse(storedTokens);
          const parsedUser = JSON.parse(storedUser);

          // Validar token con el backend
          try {
            const response = await fetch(`${API_BASE}/v1/auth/verify-token`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${parsedTokens.accessToken}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            });

            if (response.ok) {
              // Token válido, restaurar sesión
              console.log('✅ [AUTH] Token válido, restaurando sesión');
              setUser(parsedUser);
              setTokens(parsedTokens);
              setIsLoggedIn(true);
            } else {
              // Token inválido o expirado, limpiar sesión
              console.warn('⚠️ [AUTH] Token inválido o expirado, limpiando sesión');
              localStorage.removeItem('auth_user');
              localStorage.removeItem('auth_tokens');
            }
          } catch (error) {
            // Error de red, restaurar sesión de todos modos (offline mode)
            console.warn('⚠️ [AUTH] Error validando token, restaurando sesión (modo offline):', error);
            setUser(parsedUser);
            setTokens(parsedTokens);
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        console.error('❌ [AUTH] Error inicializando autenticación:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Registrar el callback de logout para el apiClient
    setLogoutCallback(() => {
      setIsLoggedIn(false);
      setUser(null);
      setTokens(null);
      navigate('/login');
    });
  }, [navigate]);

  const loginSuccess = (nextUser: AuthUser, nextTokens: AuthTokens) => {
    setIsLoggedIn(true);
    setUser(nextUser);
    setTokens(nextTokens);
    try {
      localStorage.setItem('auth_user', JSON.stringify(nextUser));
      localStorage.setItem('auth_tokens', JSON.stringify(nextTokens));
    } catch {}
  };

  const logout = async (navigate?: () => void) => {
    console.log('🚪 [LOGOUT] Iniciando proceso de logout...');
    console.log('🚪 [LOGOUT] Estado actual - isLoggedIn:', isLoggedIn);
    console.log('🚪 [LOGOUT] Usuario actual:', user);
    
    try {
      // Llamar al endpoint de logout si hay token
      const tokens = JSON.parse(localStorage.getItem('auth_tokens') || 'null');
      console.log('🚪 [LOGOUT] Tokens encontrados:', !!tokens);
      console.log('🚪 [LOGOUT] Access token existe:', !!tokens?.accessToken);
      
      if (tokens?.accessToken) {
        const apiUrl = `${API_BASE}/v1/auth/logout`;
        console.log('🚪 [LOGOUT] Enviando petición de logout a:', apiUrl);

        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${tokens.accessToken}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            console.log('✅ [LOGOUT] Logout del servidor completado exitosamente');
          } else {
            console.warn('⚠️ [LOGOUT] El servidor respondió con error:', response.status);
          }
        } catch (error) {
          console.warn('❌ [LOGOUT] Error al conectar con el servidor:', error instanceof Error ? error.message : 'Error desconocido');
        }
      } else {
        console.log('ℹ️ [LOGOUT] No hay token de acceso, saltando logout del servidor');
      }
    } catch (error) {
      // Ignorar errores de logout del servidor, continuar con limpieza local
      console.warn('❌ [LOGOUT] Error al hacer logout en el servidor:', error);
    } finally {
      // Limpiar datos locales siempre
      console.log('🧹 [LOGOUT] Iniciando limpieza de datos locales...');
      console.log('🧹 [LOGOUT] Estado antes de limpiar - isLoggedIn:', isLoggedIn);
      
      setIsLoggedIn(false);
      setUser(null);
      setTokens(null);
      
      console.log('🧹 [LOGOUT] Estados limpiados - isLoggedIn:', false);
      
      try {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_tokens');
        console.log('🧹 [LOGOUT] Datos del localStorage eliminados');
        
        // Verificar que se eliminaron
        const remainingTokens = localStorage.getItem('auth_tokens');
        const remainingUser = localStorage.getItem('auth_user');
        console.log('🧹 [LOGOUT] Verificación - tokens restantes:', !!remainingTokens);
        console.log('🧹 [LOGOUT] Verificación - usuario restante:', !!remainingUser);
        
        console.log('🌐 [LOGOUT] Navegando al inicio (/)...');
        // Navegar al inicio después de limpiar
        if (navigate) {
          console.log('🌐 [LOGOUT] Usando función navigate proporcionada');
          navigate();
          console.log('🌐 [LOGOUT] Navegación con React Router completada');
        } else {
          console.log('🌐 [LOGOUT] Usando window.location.href como fallback');
          window.location.href = '/';
          console.log('🌐 [LOGOUT] Navegación con recarga de página');
        }
      } catch (error) {
        console.error('❌ [LOGOUT] Error al limpiar datos o navegar:', error);
      }
    }
  };

  // Nota: Se desactiva auto-logout en cambios de ruta para evitar cerrar sesión inesperadamente.
  // Si necesitas lógica específica de seguridad por ruta, agrégala aquí con condiciones explícitas.

  // Auto-logout por navegación deshabilitado.

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, user, tokens, loginSuccess, logout }}>
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