import { API_BASE } from './config';

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LoginSuccessResponse {
  success: true;
  message: string;
  timestamp: string;
  data: {
    user: {
      id: string;
      email: string;
      nombre: string;
      apellido?: string;
      role: string;
      activo: boolean;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: string;
    };
  };
}

export async function loginUser(body: LoginRequestBody): Promise<LoginSuccessResponse> {
  const response = await fetch(`${API_BASE}/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    let message = payload?.message || `Error de autenticación (${response.status})`;
    if (response.status === 400) message = payload?.message || 'Solicitud inválida';
    else if (response.status === 401) message = payload?.message || 'Email o contraseña incorrectos';
    else if (response.status === 403) message = payload?.message || 'Usuario inactivo. Contacta al administrador';
    throw new Error(message);
  }

  return payload as LoginSuccessResponse;
}

export async function logoutSession(accessToken: string): Promise<void> {
  const response = await fetch(`${API_BASE}/v1/auth/logout`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  // Backend puede responder 200/204; si falla, no bloqueamos la salida local
}

export interface ProfileResponse {
  success: true;
  data: {
    id: string;
    email: string;
    nombre: string;
    apellido?: string;
    telefono?: string;
    cedula?: string;
    role: string;
    departamento?: string | null;
    cargo?: string | null;
    carrera?: string | null;
    semestre?: number | null;
    activo: boolean;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export async function fetchProfile(accessToken: string): Promise<ProfileResponse> {
  const response = await fetch(`${API_BASE}/v1/auth/profile`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;
  if (!response.ok) {
    const message = payload?.message || `Error obteniendo perfil (${response.status})`;
    throw new Error(message);
  }
  return payload as ProfileResponse;
}


