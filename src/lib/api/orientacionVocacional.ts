import { API_BASE } from './config';

// ==================== TIPOS E INTERFACES ====================

export type TipoTest = 'Holland_RIASEC' | 'Kuder';

export interface Pregunta {
  id: string;
  codigo: string;
  texto: string;
  tipoPregunta: string; // 'directa', 'comparativa', 'situacional'
  peso?: string; // 'alta', 'media', 'baja'
  dimensionPrincipal?: string;
  dimensionSecundaria?: string[];
  opcionesRespuesta?: string[] | null;
}

export interface RespuestaPregunta {
  preguntaId: string;
  respuesta: string | boolean;
  tiempoRespuesta?: number; // segundos
  nivelSeguridad?: 'seguro' | 'no_seguro';
}

export interface IniciarTestResponse {
  success: boolean;
  message: string;
  data: {
    sesionId: string;
    tipoTest: TipoTest;
    estado: string;
    fechaInicio: string;
    preguntas: Pregunta[];
  };
}

export interface GuardarRespuestasRonda1Response {
  success: boolean;
  data: {
    sesionId: string;
    estado: string; // 'ronda_1_completada'
    puntuacionesRonda1: Record<string, number>;
    ambiguedades?: Array<{
      dimension: string;
      puntuacion: number;
      razon: string;
    }>;
    discrepancias?: any[];
    preguntasRonda2: Pregunta[];
  };
}

export interface GuardarRespuestasRonda2Response {
  success: boolean;
  data: {
    sesionId: string;
    estado: string; // 'ronda_2_completada'
    puntuacionesFinales: Record<string, number>;
    resultado: {
      id: string;
      codigoHolland: string;
      perfilDominante: string;
      perfilSecundario: string;
      nivelConfianza: number;
      recomendacionesCarreras: Array<{
        id: number;
        name: string;
        razon: string;
      }>;
      perfilVocacional: {
        fortalezas: string[];
        debilidades: string[];
        oportunidades: string[];
      };
      areasDesarrollo: string[];
      sugerenciasAcompanamiento: string[];
      planDesarrollo: {
        cortoPlazo: string[];
        medianoPlazo: string[];
        largoPlazo: string[];
      };
    };
  };
}

export interface SesionResponse {
  success: boolean;
  data: {
    id: string;
    tipoTest: TipoTest;
    estado: string; // 'iniciada', 'ronda_1_completada', 'ronda_2_completada', 'finalizada'
    fechaInicio: string;
    fechaRonda1?: string;
    fechaRonda2?: string;
    puntuacionesRonda1?: Record<string, number>;
    puntuacionesRonda2?: Record<string, number>;
    preguntasRonda2?: Pregunta[];
  };
}

export interface ResultadosResponse {
  success: boolean;
  data: {
    sesionId: string;
    resultado: {
      id: string;
      codigoHolland: string;
      perfilDominante: string;
      perfilSecundario: string;
      nivelConfianza: number;
      recomendacionesCarreras: Array<{
        id: number;
        name: string;
        razon: string;
      }>;
      perfilVocacional: {
        fortalezas: string[];
        debilidades: string[];
        oportunidades: string[];
      };
      areasDesarrollo: string[];
      sugerenciasAcompanamiento: string[];
      planDesarrollo: {
        cortoPlazo: string[];
        medianoPlazo: string[];
        largoPlazo: string[];
      };
    };
    puntuacionesFinales: Record<string, number>;
  };
}

export interface PerfilVocacionalResponse {
  success: boolean;
  data: {
    resultadoActual: ResultadosResponse['data'];
    trayectoriaAcademica?: any;
    historial: Array<{
      id: string;
      tipoTest: TipoTest;
      estado: string;
      fechaInicio: string;
      fechaFin?: string;
      perfilDominante?: string;
    }>;
  };
}

export interface HistorialResponse {
  success: boolean;
  data: Array<{
    id: string;
    tipoTest: TipoTest;
    estado: string;
    fechaInicio: string;
    fechaFin?: string;
    perfilDominante?: string;
  }>;
}

// ==================== FUNCIONES API ====================

/**
 * Iniciar un nuevo test de orientación vocacional
 */
export async function iniciarTest(
  accessToken: string,
  tipoTest: TipoTest
): Promise<IniciarTestResponse> {
  const response = await fetch(`${API_BASE}/v1/orientacion/iniciar-test`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tipoTest }),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    let message = payload?.message || `Error al iniciar el test (${response.status})`;
    
    if (response.status === 401) {
      message = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
    } else if (response.status === 403) {
      message = 'No tienes permisos para realizar este test. Contacta al administrador.';
    }
    
    const error = new Error(message);
    (error as any).status = response.status;
    (error as any).payload = payload;
    throw error;
  }

  return payload as IniciarTestResponse;
}

/**
 * Guardar respuestas de Ronda 1 y obtener preguntas de Ronda 2
 */
export async function guardarRespuestasRonda1(
  accessToken: string,
  sesionId: string,
  respuestas: RespuestaPregunta[]
): Promise<GuardarRespuestasRonda1Response> {
  const response = await fetch(`${API_BASE}/v1/orientacion/guardar-respuestas-ronda-1`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sesionId,
      respuestas,
    }),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    let message = payload?.message || `Error al guardar respuestas (${response.status})`;
    
    if (payload?.errors) {
      message = payload.errors.map((e: any) => e.message || e).join(', ') || message;
    }
    
    const error = new Error(message);
    (error as any).status = response.status;
    (error as any).payload = payload;
    throw error;
  }

  return payload as GuardarRespuestasRonda1Response;
}

/**
 * Guardar respuestas de Ronda 2 y completar el test
 */
export async function guardarRespuestasRonda2(
  accessToken: string,
  sesionId: string,
  respuestas: RespuestaPregunta[]
): Promise<GuardarRespuestasRonda2Response> {
  const response = await fetch(`${API_BASE}/v1/orientacion/guardar-respuestas-ronda-2`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sesionId,
      respuestas,
    }),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    let message = payload?.message || `Error al completar el test (${response.status})`;
    
    if (payload?.errors) {
      message = payload.errors.map((e: any) => e.message || e).join(', ') || message;
    }
    
    const error = new Error(message);
    (error as any).status = response.status;
    (error as any).payload = payload;
    throw error;
  }

  return payload as GuardarRespuestasRonda2Response;
}

/**
 * Obtener información de una sesión
 */
export async function obtenerSesion(
  accessToken: string,
  sesionId: string
): Promise<SesionResponse> {
  const response = await fetch(`${API_BASE}/v1/orientacion/sesion/${sesionId}`, {
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
    const message = payload?.message || `Error al obtener sesión (${response.status})`;
    throw new Error(message);
  }

  return payload as SesionResponse;
}

/**
 * Obtener resultados completos de una sesión
 */
export async function obtenerResultados(
  accessToken: string,
  sesionId: string
): Promise<ResultadosResponse> {
  const response = await fetch(`${API_BASE}/v1/orientacion/resultados/${sesionId}`, {
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
    const message = payload?.message || `Error al obtener resultados (${response.status})`;
    throw new Error(message);
  }

  return payload as ResultadosResponse;
}

/**
 * Obtener perfil vocacional consolidado del usuario
 */
export async function obtenerPerfilVocacional(
  accessToken: string
): Promise<PerfilVocacionalResponse> {
  const response = await fetch(`${API_BASE}/v1/orientacion/mi-perfil-vocacional`, {
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
    const message = payload?.message || `Error al obtener perfil vocacional (${response.status})`;
    throw new Error(message);
  }

  return payload as PerfilVocacionalResponse;
}

/**
 * Obtener historial de tests realizados
 */
export async function obtenerHistorial(
  accessToken: string
): Promise<HistorialResponse> {
  const response = await fetch(`${API_BASE}/v1/orientacion/historial`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  console.log('📥 [Frontend] Respuesta del backend - Status:', response.status);
  console.log('📥 [Frontend] Respuesta del backend - Payload completo:', JSON.stringify(payload, null, 2));
  console.log('📥 [Frontend] payload.data:', payload?.data);
  console.log('📥 [Frontend] Tipo de payload.data:', typeof payload?.data);
  console.log('📥 [Frontend] Es array?', Array.isArray(payload?.data));

  if (!response.ok) {
    let message = payload?.message || `Error al obtener historial (${response.status})`;
    
    // Manejar errores específicos del backend
    if (response.status === 500) {
      if (message.includes('usuarioId') || message.includes('columna')) {
        message = 'Error en la base de datos del servidor. Por favor contacta al administrador.';
      } else {
        message = 'Error interno del servidor. Por favor intenta más tarde.';
      }
    }
    
    const error = new Error(message);
    (error as any).status = response.status;
    (error as any).payload = payload;
    throw error;
  }

  // Asegurarse de que la respuesta tenga la estructura correcta
  if (!payload) {
    throw new Error('El servidor no devolvió datos');
  }

  // Si el backend devuelve directamente un array en lugar de { success, data }
  if (Array.isArray(payload)) {
    console.log('⚠️ [Frontend] El backend devolvió un array directamente, ajustando estructura');
    return {
      success: true,
      data: payload
    } as HistorialResponse;
  }

  // Si tiene la estructura { success, data }
  if (payload.success !== undefined && payload.data !== undefined) {
    console.log('✅ [Frontend] Estructura correcta con success y data');
    return payload as HistorialResponse;
  }

  // Si solo tiene data
  if (payload.data) {
    console.log('✅ [Frontend] Estructura con solo data, ajustando');
    return {
      success: true,
      data: Array.isArray(payload.data) ? payload.data : []
    } as HistorialResponse;
  }

  // Si es un array directamente en el payload
  if (Array.isArray(payload)) {
    console.log('✅ [Frontend] Payload es un array directamente');
    return {
      success: true,
      data: payload
    } as HistorialResponse;
  }

  console.warn('⚠️ [Frontend] Estructura inesperada, devolviendo array vacío');
  return {
    success: true,
    data: []
  } as HistorialResponse;
}
