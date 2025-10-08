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

export interface FetchUsersParams {
  role?: string;
  activo?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function fetchUsers(accessToken: string, params?: FetchUsersParams): Promise<UsersResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.role) searchParams.append('role', params.role);
  if (params?.activo !== undefined) searchParams.append('activo', params.activo.toString());
  if (params?.search) searchParams.append('search', params.search);
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.offset) searchParams.append('offset', params.offset.toString());

  const url = `${API_BASE}/v1/users${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
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


