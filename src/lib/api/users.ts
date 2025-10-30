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
  emailVerified?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function fetchUsers(accessToken: string, params?: FetchUsersParams): Promise<UsersResponse> {
  const searchParams = new URLSearchParams();

  if (params?.role) searchParams.append('role', params.role);
  if (params?.activo !== undefined) searchParams.append('activo', params.activo.toString());
  if (params?.emailVerified !== undefined) searchParams.append('emailVerified', params.emailVerified.toString());
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

export interface BecarioResponse {
  success: true;
  message: string;
  data: {
    id: string;
    usuarioId: string;
    tipoBeca: string;
    estado: string;
    periodoInicio: string;
    horasRequeridas: number;
    horasCompletadas: string;
    supervisorId: string | null;
    plazaAsignada: string | null;
    [key: string]: any;
  };
}

/**
 * Obtener información del becario por usuario ID
 * Busca en todos los becarios y filtra por usuarioId
 */
export async function fetchBecarioByUsuarioId(accessToken: string, usuarioId: string): Promise<BecarioResponse | null> {
  try {
    const response = await fetch(`${API_BASE}/v1/becarios?limit=100`, {
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
      return null;
    }

    // Buscar el becario con el usuarioId correspondiente
    const becarios = payload?.data?.becarios || [];
    const becario = becarios.find((b: any) => b.usuarioId === usuarioId);

    if (!becario) {
      return null;
    }

    return {
      success: true,
      message: "Becario encontrado",
      data: becario
    };
  } catch (error) {
    console.error('Error fetching becario:', error);
    return null;
  }
}

// ============================================
// UPDATE, DELETE, TOGGLE STATUS
// ============================================

export interface UpdateUserRequest {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  carnet?: string;
  departamento?: string;
  cargo?: string;
  carrera?: string;
  trimestre?: number;
  iaa?: number;
  asignaturasAprobadas?: number;
  fotocopiaCedulaId?: string;
  flujogramaCarreraId?: string;
  historicoNotasId?: string;
  planCarreraAvaladoId?: string;
  curriculumDeportivoId?: string;
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: any;
}

export async function updateUser(
  accessToken: string,
  userId: string,
  data: UpdateUserRequest
): Promise<UpdateUserResponse> {
  const url = `${API_BASE}/v1/users/${userId}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error al actualizar usuario (${response.status})`;
    throw new Error(message);
  }

  return payload as UpdateUserResponse;
}

export async function deleteUser(accessToken: string, userId: string): Promise<UpdateUserResponse> {
  const url = `${API_BASE}/v1/users/${userId}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error al eliminar usuario (${response.status})`;
    throw new Error(message);
  }

  return payload as UpdateUserResponse;
}

export async function toggleUserStatus(accessToken: string, userId: string): Promise<UpdateUserResponse> {
  const url = `${API_BASE}/v1/users/${userId}/toggle-status`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error al cambiar estado del usuario (${response.status})`;
    throw new Error(message);
  }

  return payload as UpdateUserResponse;
}
