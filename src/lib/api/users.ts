import { API_BASE } from './config';

export interface UsersResponse {
  success: true;
  message: string;
  data: {
    usuarios: Array<{
      id: string;
      email: string;
      nombre: string;
      apellido?: string;
      cedula?: string;
      telefono?: string;
      carrera?: string;
      semestre?: number;
      role?: string;
      activo?: boolean;
    }>;
    total: number;
    limit: number;
    offset: number;
    totalPages: number;
  };
}

export async function fetchUsers(accessToken: string): Promise<UsersResponse> {
  const response = await fetch(`${API_BASE}/v1/users`, {
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
    const message = payload?.message || `Error obteniendo usuarios (${response.status})`;
    throw new Error(message);
  }

  return payload as UsersResponse;
}

export interface UserByIdResponse {
  success: true;
  data: {
    id: string;
    email: string;
    nombre: string;
    apellido?: string;
    cedula?: string;
    telefono?: string;
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

export async function fetchUserById(accessToken: string, userId: string): Promise<UserByIdResponse> {
  const response = await fetch(`${API_BASE}/v1/users/${userId}`, {
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
    const message = payload?.message || `Error obteniendo usuario (${response.status})`;
    throw new Error(message);
  }

  return payload as UserByIdResponse;
}


