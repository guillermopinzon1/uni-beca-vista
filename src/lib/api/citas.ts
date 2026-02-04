import { API_BASE } from './config';

// ==================== TIPOS E INTERFACES ====================

export interface Cita {
  id: string;
  estudiante_id: string;
  especialista_id: string;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:MM
  modalidad: 'presencial' | 'virtual' | 'telefonica';
  motivo: string;
  notas?: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  notas_seguimiento?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  estudiante?: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
  };
  especialista?: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
  };
}

export interface AgendarCitaRequest {
  estudiante_id: string;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:MM
  modalidad?: 'presencial' | 'virtual' | 'telefonica';
  motivo: string;
  notas?: string;
}

export interface ActualizarCitaRequest {
  fecha?: string;
  hora?: string;
  modalidad?: 'presencial' | 'virtual' | 'telefonica';
  motivo?: string;
  notas?: string;
  estado?: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  notas_seguimiento?: string;
}

export interface AgendarCitaResponse {
  success: boolean;
  message: string;
  data: Cita;
}

export interface ObtenerCitasResponse {
  success: boolean;
  message: string;
  data: {
    total: number;
    citas: Cita[];
  };
}

export interface ObtenerCitaResponse {
  success: boolean;
  message: string;
  data: Cita;
}

// ==================== FUNCIONES API ====================

/**
 * Agenda una nueva cita de orientación
 */
export async function agendarCita(
  accessToken: string,
  datos: AgendarCitaRequest
): Promise<AgendarCitaResponse> {
  const response = await fetch(`${API_BASE}/v1/citas/agendar`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    let message = payload?.message || `Error al agendar la cita (${response.status})`;

    if (response.status === 401) {
      message = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
    } else if (response.status === 404) {
      message = 'El estudiante no existe.';
    } else if (payload?.errors) {
      message = payload.errors.map((e: any) => e.message || e).join(', ') || message;
    }

    const error = new Error(message);
    (error as any).status = response.status;
    (error as any).payload = payload;
    throw error;
  }

  return payload as AgendarCitaResponse;
}

/**
 * Obtiene las citas del especialista autenticado
 */
export async function obtenerMisCitas(
  accessToken: string,
  filtros?: {
    estado?: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
    fecha_desde?: string;
    fecha_hasta?: string;
  }
): Promise<ObtenerCitasResponse> {
  const params = new URLSearchParams();

  if (filtros?.estado) params.append('estado', filtros.estado);
  if (filtros?.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
  if (filtros?.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);

  const queryString = params.toString();
  const url = `${API_BASE}/v1/citas/mis-citas${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error al obtener las citas (${response.status})`;
    throw new Error(message);
  }

  return payload as ObtenerCitasResponse;
}

/**
 * Obtiene las citas de un estudiante específico
 */
export async function obtenerCitasEstudiante(
  accessToken: string,
  estudianteId: string
): Promise<ObtenerCitasResponse> {
  const response = await fetch(`${API_BASE}/v1/citas/estudiante/${estudianteId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error al obtener las citas del estudiante (${response.status})`;
    throw new Error(message);
  }

  return payload as ObtenerCitasResponse;
}

/**
 * Obtiene los detalles de una cita específica
 */
export async function obtenerCita(
  accessToken: string,
  citaId: string
): Promise<ObtenerCitaResponse> {
  const response = await fetch(`${API_BASE}/v1/citas/${citaId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error al obtener la cita (${response.status})`;
    throw new Error(message);
  }

  return payload as ObtenerCitaResponse;
}

/**
 * Actualiza una cita existente
 */
export async function actualizarCita(
  accessToken: string,
  citaId: string,
  datos: ActualizarCitaRequest
): Promise<ObtenerCitaResponse> {
  const response = await fetch(`${API_BASE}/v1/citas/${citaId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datos),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    let message = payload?.message || `Error al actualizar la cita (${response.status})`;

    if (response.status === 404) {
      message = 'Cita no encontrada o no tienes permiso para modificarla.';
    } else if (payload?.errors) {
      message = payload.errors.map((e: any) => e.message || e).join(', ') || message;
    }

    const error = new Error(message);
    (error as any).status = response.status;
    (error as any).payload = payload;
    throw error;
  }

  return payload as ObtenerCitaResponse;
}

/**
 * Cancela una cita
 */
export async function cancelarCita(
  accessToken: string,
  citaId: string
): Promise<ObtenerCitaResponse> {
  const response = await fetch(`${API_BASE}/v1/citas/${citaId}/cancelar`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error al cancelar la cita (${response.status})`;
    throw new Error(message);
  }

  return payload as ObtenerCitaResponse;
}
