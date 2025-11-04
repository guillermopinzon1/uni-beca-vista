import { API_BASE } from './config';

/**
 * Obtiene las plazas compatibles con el horario del estudiante becario autenticado
 * @param accessToken - Token de autenticación
 * @param filtros - Filtros opcionales (tipoAyudantia, periodoAcademico)
 */
export const getPlazasCompatibles = async (
  accessToken: string,
  filtros?: {
    tipoAyudantia?: string;
    periodoAcademico?: string;
  }
) => {
  const params = new URLSearchParams();
  if (filtros?.tipoAyudantia) params.append('tipoAyudantia', filtros.tipoAyudantia);
  if (filtros?.periodoAcademico) params.append('periodoAcademico', filtros.periodoAcademico);

  const url = `${API_BASE}/v1/becarios/me/plazas-compatibles${params.toString() ? `?${params.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener plazas compatibles' }));
    throw new Error(error.message || `Error ${response.status}`);
  }

  return response.json();
};

/**
 * Crear una postulación a una plaza (con aprobación administrativa)
 * @param accessToken - Token de autenticación
 * @param plazaId - ID de la plaza a la que se postula
 */
export const postularAPlaza = async (accessToken: string, plazaId: string) => {
  const response = await fetch(`${API_BASE}/v1/becarios/me/postular-plaza`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ plazaId }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al postular a la plaza' }));
    throw new Error(error.message || `Error ${response.status}`);
  }

  return response.json();
};

/**
 * Obtiene todas las postulaciones del estudiante becario autenticado
 * @param accessToken - Token de autenticación
 */
export const getMisPostulaciones = async (accessToken: string) => {
  const response = await fetch(`${API_BASE}/v1/becarios/me/postulaciones-plazas`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener postulaciones' }));
    throw new Error(error.message || `Error ${response.status}`);
  }

  return response.json();
};

/**
 * Obtiene todas las postulaciones (solo admin)
 * @param accessToken - Token de autenticación
 * @param filtros - Filtros opcionales
 */
export const getAllPostulaciones = async (
  accessToken: string,
  filtros?: {
    estado?: string;
    plazaId?: string;
    estudianteBecarioId?: string;
    limit?: number;
    offset?: number;
  }
) => {
  const params = new URLSearchParams();
  if (filtros?.estado) params.append('estado', filtros.estado);
  if (filtros?.plazaId) params.append('plazaId', filtros.plazaId);
  if (filtros?.estudianteBecarioId) params.append('estudianteBecarioId', filtros.estudianteBecarioId);
  if (filtros?.limit) params.append('limit', filtros.limit.toString());
  if (filtros?.offset) params.append('offset', filtros.offset.toString());

  const url = `${API_BASE}/v1/postulaciones-plazas${params.toString() ? `?${params.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener postulaciones' }));
    throw new Error(error.message || `Error ${response.status}`);
  }

  return response.json();
};

/**
 * Obtiene el detalle de una postulación específica (admin)
 * @param accessToken - Token de autenticación
 * @param postulacionId - ID de la postulación
 */
export const getPostulacionById = async (accessToken: string, postulacionId: string) => {
  const response = await fetch(`${API_BASE}/v1/postulaciones-plazas/${postulacionId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al obtener postulación' }));
    throw new Error(error.message || `Error ${response.status}`);
  }

  return response.json();
};

/**
 * Aprobar una postulación y asignar plaza al becario (admin)
 * @param accessToken - Token de autenticación
 * @param postulacionId - ID de la postulación
 * @param observaciones - Observaciones opcionales
 */
export const aprobarPostulacion = async (
  accessToken: string,
  postulacionId: string,
  observaciones?: string
) => {
  const response = await fetch(`${API_BASE}/v1/postulaciones-plazas/${postulacionId}/aprobar`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ observaciones }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al aprobar postulación' }));
    throw new Error(error.message || `Error ${response.status}`);
  }

  return response.json();
};

/**
 * Rechazar una postulación (admin)
 * @param accessToken - Token de autenticación
 * @param postulacionId - ID de la postulación
 * @param motivoRechazo - Motivo del rechazo (requerido)
 * @param observaciones - Observaciones opcionales
 */
export const rechazarPostulacion = async (
  accessToken: string,
  postulacionId: string,
  motivoRechazo: string,
  observaciones?: string
) => {
  const response = await fetch(`${API_BASE}/v1/postulaciones-plazas/${postulacionId}/rechazar`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ motivoRechazo, observaciones }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al rechazar postulación' }));
    throw new Error(error.message || `Error ${response.status}`);
  }

  return response.json();
};
