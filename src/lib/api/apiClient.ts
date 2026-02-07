import { API_BASE } from './config';

/**
 * apiClient - Cliente HTTP con manejo global de errores
 *
 * Este cliente intercepta todas las respuestas de la API y maneja errores 401 automáticamente,
 * cerrando la sesión cuando el token expira o es inválido.
 */

interface FetchOptions extends RequestInit {
  skipAuthRedirect?: boolean;
}

let logoutCallback: (() => void) | null = null;

/**
 * Registra la función de logout que será llamada cuando se detecte un error 401
 */
export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

/**
 * Cliente fetch mejorado con interceptores
 */
export const apiFetch = async (url: string, options: FetchOptions = {}): Promise<Response> => {
  const { skipAuthRedirect, ...fetchOptions } = options;

  try {
    const response = await fetch(url, fetchOptions);

    // Interceptar respuestas 401 (No autorizado)
    if (response.status === 401 && !skipAuthRedirect) {
      console.warn('🔒 [API Client] Respuesta 401 detectada. Token inválido o expirado.');

      // Limpiar storage y redirigir al login
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_tokens');

      // Llamar al callback de logout si está registrado
      if (logoutCallback) {
        console.log('🔒 [API Client] Ejecutando logout callback...');
        logoutCallback();
      } else {
        console.warn('⚠️ [API Client] No hay logout callback registrado. Redirigiendo manualmente...');
        window.location.href = '/login';
      }
    }

    return response;
  } catch (error) {
    console.error('❌ [API Client] Error en la petición:', error);
    throw error;
  }
};

/**
 * Helper para obtener el token de acceso del localStorage
 */
export const getAccessToken = (): string | null => {
  try {
    const tokens = localStorage.getItem('auth_tokens');
    if (!tokens) return null;

    const parsed = JSON.parse(tokens);
    return parsed?.accessToken || null;
  } catch {
    return null;
  }
};

/**
 * Helper para construir headers con autenticación
 */
export const getAuthHeaders = (additionalHeaders: Record<string, string> = {}): Record<string, string> => {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };

  const token = getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Shortcut para GET requests con autenticación
 */
export const apiGet = async (endpoint: string, options: FetchOptions = {}) => {
  return apiFetch(`${API_BASE}${endpoint}`, {
    method: 'GET',
    headers: getAuthHeaders(),
    ...options,
  });
};

/**
 * Shortcut para POST requests con autenticación
 */
export const apiPost = async (endpoint: string, body?: any, options: FetchOptions = {}) => {
  return apiFetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });
};

/**
 * Shortcut para PUT requests con autenticación
 */
export const apiPut = async (endpoint: string, body?: any, options: FetchOptions = {}) => {
  return apiFetch(`${API_BASE}${endpoint}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });
};

/**
 * Shortcut para PATCH requests con autenticación
 */
export const apiPatch = async (endpoint: string, body?: any, options: FetchOptions = {}) => {
  return apiFetch(`${API_BASE}${endpoint}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });
};

/**
 * Shortcut para DELETE requests con autenticación
 */
export const apiDelete = async (endpoint: string, options: FetchOptions = {}) => {
  return apiFetch(`${API_BASE}${endpoint}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    ...options,
  });
};
