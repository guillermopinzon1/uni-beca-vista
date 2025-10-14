import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
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
  logout: (navigate?: () => void) => void;
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
        // Intentar diferentes URLs posibles
        const possibleUrls = [
          import.meta.env.VITE_API_BASE_URL,
          'https://srodriguez.intelcondev.org',
          'http://localhost:3000',
          'http://localhost:3001', 
          'http://localhost:5000',
          'http://localhost:8000',
          'http://127.0.0.1:3000',
          'http://127.0.0.1:3001'
        ].filter(Boolean);
        
        // Si no hay VITE_API_BASE_URL configurada, usar la URL de producción por defecto
        if (!import.meta.env.VITE_API_BASE_URL) {
          possibleUrls.unshift('https://srodriguez.intelcondev.org');
        }
        
        console.log('🚪 [LOGOUT] Enviando petición de logout al servidor...');
        console.log('🚪 [LOGOUT] VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
        console.log('🚪 [LOGOUT] URLs posibles a probar:', possibleUrls);
        
        let response = null;
        let lastError = null;
        
        for (const baseUrl of possibleUrls) {
          try {
            const apiUrl = `${baseUrl}/api/v1/auth/logout`;
            console.log('🚪 [LOGOUT] Probando URL:', apiUrl);
            response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${tokens.accessToken}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            });
            console.log('🚪 [LOGOUT] Respuesta del servidor:', response.status, response.statusText);
            
            if (response.ok) {
              console.log('✅ [LOGOUT] Logout del servidor completado exitosamente');
              break; // Salir del bucle si funciona
            } else {
              console.warn('⚠️ [LOGOUT] El servidor respondió con error:', response.status);
              lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
          } catch (error) {
            console.warn('❌ [LOGOUT] Error con URL', apiUrl, ':', error.message);
            lastError = error;
            response = null;
          }
        }
        
        if (!response) {
          console.warn('❌ [LOGOUT] No se pudo conectar con ninguna URL. Último error:', lastError?.message);
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
    <AuthContext.Provider value={{ isLoggedIn, user, tokens, loginSuccess, logout }}>
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