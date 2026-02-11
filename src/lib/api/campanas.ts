import { API_BASE } from './config';

// ==================== TIPOS E INTERFACES ====================

export interface Estudiante {
  id: string;
  nombre: string;
  email: string;
  perfilDominante: string;
  codigoHolland: string;
  carrerasInteres: string[];
  totalSesiones: number;
  ultimaFechaTest: string;
  nivelRiesgo: 'Alto' | 'Medio' | 'Bajo';
  estadoProceso: string;
}

export interface FiltrosSegmentacion {
  carreraInteres?: string;
  nivelRiesgo?: 'Alto' | 'Medio' | 'Bajo' | 'todos';
  estadoProceso?: string;
  perfilHolland?: string;
  grupo?: 'ingenieria' | 'artes' | 'ciencias_sociales';
}

export interface SegmentarEstudiantesResponse {
  success: boolean;
  data: {
    total: number;
    estudiantes: Estudiante[];
    filtrosAplicados: FiltrosSegmentacion;
  };
  message: string;
}

export interface EnviarCampanaRequest {
  destinatarios: string[]; // Array de IDs de estudiantes
  asunto: string;
  contenido: string;
  titulo?: string;
  ctaTexto?: string;
  ctaUrl?: string;
  usarTemplate?: boolean;
  templateId?: string;
}

export interface EnviarCampanaResponse {
  success: boolean;
  data: {
    total: number;
    exitosos: number;
    fallidos: number;
    tasaExito: string;
    detalles?: Array<{
      email: string;
      nombre: string;
      exito: boolean;
      messageId?: string;
      error?: string;
    }>;
  };
  message: string;
}

export interface EnviarGrupoPredefinidoRequest {
  grupo: 'ingenieria' | 'artes' | 'ciencias_sociales';
  asunto: string;
  contenido: string;
  titulo?: string;
  ctaTexto?: string;
  ctaUrl?: string;
  templateId?: string;
}

export interface EstadisticasResponse {
  success: boolean;
  data: {
    ingenieria: number;
    artes: number;
    cienciasSociales: number;
    otros: number;
    total: number;
  };
  message: string;
}

// ==================== FUNCIONES API ====================

/**
 * Segmenta estudiantes según filtros para preparar una campaña
 */
export async function segmentarEstudiantes(
  accessToken: string,
  filtros?: FiltrosSegmentacion
): Promise<SegmentarEstudiantesResponse> {
  const response = await fetch(`${API_BASE}/v1/campanas/segmentar-estudiantes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(filtros || {}),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Error al segmentar estudiantes'
    }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Envía una campaña masiva de correos
 */
export async function enviarCampana(
  accessToken: string,
  datos: EnviarCampanaRequest
): Promise<EnviarCampanaResponse> {
  const response = await fetch(`${API_BASE}/v1/campanas/enviar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Error al enviar campaña'
    }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Envía campaña a un grupo predefinido
 */
export async function enviarGrupoPredefinido(
  accessToken: string,
  datos: EnviarGrupoPredefinidoRequest
): Promise<EnviarCampanaResponse> {
  const response = await fetch(`${API_BASE}/v1/campanas/enviar-grupo-predefinido`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Error al enviar campaña al grupo'
    }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Obtiene estadísticas de los grupos predefinidos
 */
export async function obtenerEstadisticas(
  accessToken: string
): Promise<EstadisticasResponse> {
  const response = await fetch(`${API_BASE}/v1/campanas/estadisticas`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Error al obtener estadísticas'
    }));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
