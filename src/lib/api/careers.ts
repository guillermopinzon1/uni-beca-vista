import { API_BASE } from './config';

// ==================== TIPOS ====================

export interface CareerListItem {
  id: number;
  code: string;
  name: string;
  faculty: string;
  area: string;
  description?: string;
  duration?: string;
  modality?: string;
  is_active?: boolean;
}

export interface CareerDetail extends CareerListItem {
  profile?: string;
  job_field?: string;
}

export interface ListarCareersParams {
  q?: string;
  faculty?: string;
  area?: string;
  page?: number;
  limit?: number;
  incluir_inactivas?: boolean;
}

/** Respuesta actual del backend para listado (data array + paginación en raíz) */
export interface ListarCareersResponse {
  data: CareerListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CrearCarreraBody {
  name: string;
  faculty: string;
  code?: string;
  area?: string;
  description?: string;
  profile?: string;
  job_field?: string;
  duration?: string;
  modality?: string;
}

export interface ActualizarCarreraBody extends Partial<CrearCarreraBody> {
  is_active?: boolean;
}

// ==================== FUNCIONES ====================

function getAuthHeaders(accessToken: string): HeadersInit {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  };
}

export async function listarCareers(
  accessToken: string | null,
  params?: ListarCareersParams
): Promise<ListarCareersResponse> {
  const searchParams = new URLSearchParams();
  if (params?.q) searchParams.set('q', params.q);
  if (params?.faculty) searchParams.set('faculty', params.faculty);
  if (params?.area) searchParams.set('area', params.area);
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.incluir_inactivas && accessToken) searchParams.set('incluir_inactivas', '1');

  const url = `${API_BASE}/careers${searchParams.toString() ? `?${searchParams}` : ''}`;
  const headers: HeadersInit = accessToken
    ? getAuthHeaders(accessToken)
    : { Accept: 'application/json' };

  const res = await fetch(url, { method: 'GET', headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data?.message as string) || `Error ${res.status} al listar carreras`);
  }
  return data as ListarCareersResponse;
}

export async function obtenerCareer(
  accessToken: string | null,
  id: number | string
): Promise<CareerDetail> {
  const url = `${API_BASE}/careers/${id}`;
  const headers: HeadersInit = accessToken
    ? getAuthHeaders(accessToken)
    : { Accept: 'application/json' };

  const res = await fetch(url, { method: 'GET', headers });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((payload?.message as string) || `Error ${res.status} al obtener carrera`);
  }
  return payload as CareerDetail;
}

export async function crearCareer(
  accessToken: string,
  body: CrearCarreraBody
): Promise<{ success: boolean; message?: string; data: CareerListItem }> {
  const res = await fetch(`${API_BASE}/careers`, {
    method: 'POST',
    headers: getAuthHeaders(accessToken),
    body: JSON.stringify(body),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = payload?.message || payload?.details?.validationErrors?.map((e: { message?: string }) => e.message).filter(Boolean).join('. ') || `Error ${res.status}`;
    throw new Error(msg as string);
  }
  return payload as { success: boolean; message?: string; data: CareerListItem };
}

export async function actualizarCareer(
  accessToken: string,
  id: number | string,
  body: ActualizarCarreraBody
): Promise<{ success?: boolean; data?: CareerDetail } & CareerDetail> {
  const res = await fetch(`${API_BASE}/careers/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(accessToken),
    body: JSON.stringify(body),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((payload?.message as string) || `Error ${res.status} al actualizar carrera`);
  }
  return payload;
}

export async function desactivarCareer(
  accessToken: string,
  id: number | string
): Promise<{ success?: boolean; message?: string }> {
  const res = await fetch(`${API_BASE}/careers/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(accessToken),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((payload?.message as string) || `Error ${res.status} al desactivar carrera`);
  }
  return payload as { success?: boolean; message?: string };
}
