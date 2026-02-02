import { API_BASE } from './config';

// ==================== TIPOS E INTERFACES ====================

export interface Notificacion {
  id: string;
  titulo: string;
  contenido: string;
  tipo: 'evento' | 'anuncio' | 'recordatorio' | 'campana' | 'mensaje';
  leida: boolean;
  fecha_lectura: string | null;
  metadata: {
    url?: string;
    cta?: string;
    icon?: string;
  } | null;
  fecha_creacion: string;
}

export interface ObtenerNotificacionesResponse {
  success: boolean;
  data: {
    total: number;
    no_leidas: number;
    notificaciones: Notificacion[];
  };
  message: string;
}

export interface ContadorNoLeidasResponse {
  success: boolean;
  data: {
    contador: number;
  };
  message: string;
}

export interface CrearNotificacionRequest {
  destinatarios: string[];
  titulo: string;
  contenido: string;
  tipo?: 'evento' | 'anuncio' | 'recordatorio' | 'campana' | 'mensaje';
  metadata?: {
    url?: string;
    cta?: string;
    icon?: string;
  };
}

// ==================== FUNCIONES API ====================

/**
 * Obtiene todas las notificaciones del usuario autenticado
 */
export async function obtenerMisNotificaciones(
  accessToken: string,
  limite?: number,
  soloNoLeidas?: boolean
): Promise<ObtenerNotificacionesResponse> {
  const params = new URLSearchParams();
  if (limite) params.append('limite', limite.toString());
  if (soloNoLeidas) params.append('solo_no_leidas', 'true');

  const response = await fetch(
    `${API_BASE}/v1/notificaciones/mis-notificaciones?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Error al obtener notificaciones'
    }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Obtiene el contador de notificaciones no leídas
 */
export async function obtenerContadorNoLeidas(
  accessToken: string
): Promise<ContadorNoLeidasResponse> {
  const response = await fetch(`${API_BASE}/v1/notificaciones/contador-no-leidas`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Error al obtener contador'
    }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Marca una notificación como leída
 */
export async function marcarComoLeida(
  accessToken: string,
  notificacionId: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(
    `${API_BASE}/v1/notificaciones/${notificacionId}/marcar-leida`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Error al marcar notificación como leída'
    }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Marca todas las notificaciones como leídas
 */
export async function marcarTodasComoLeidas(
  accessToken: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/v1/notificaciones/marcar-todas-leidas`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Error al marcar todas las notificaciones como leídas'
    }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Crea nuevas notificaciones (solo para especialistas/coordinadores)
 */
export async function crearNotificacion(
  accessToken: string,
  datos: CrearNotificacionRequest
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/v1/notificaciones/crear`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Error al crear notificaciones'
    }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Elimina una notificación
 */
export async function eliminarNotificacion(
  accessToken: string,
  notificacionId: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/v1/notificaciones/${notificacionId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Error al eliminar notificación'
    }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
