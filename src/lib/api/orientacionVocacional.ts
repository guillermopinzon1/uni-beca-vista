import { API_BASE } from './config';

// ==================== TIPOS E INTERFACES ====================

export type TipoTest = 'Holland_RIASEC' | 'Kuder';

export interface Pregunta {
  id: string;
  texto: string; // El backend usa "texto" no "texto_pregunta"
  opciones?: string[] | null; // El backend usa "opciones" no "opciones_respuesta"
  tipo?: string; // directa, comparativa, situacional
  instrucciones?: string | null;
  dimension?: string;
}

export interface RespuestaPregunta {
  preguntaId: string;
  respuesta: string | boolean;
  tiempoSegundos?: number;
  nivelSeguridad?: 'muy_seguro' | 'seguro' | 'indeciso' | 'muy_indeciso';
}

export interface IniciarTestResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    sesionId: string;
    tipoTest: TipoTest;
    estado: string;
    fechaInicio?: string;
    preguntas: Pregunta[];
  };
}

export interface GuardarRespuestasResponse {
  success: boolean;
  message: string;
  data: {
    preguntas?: Pregunta[]; // Para Ronda 2
    sesionId: string;
    estado: string;
  };
}

export interface SesionResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    usuarioId: string;
    tipoTest: TipoTest;
    estado: string;
    fechaInicio: string;
    fechaFin?: string;
    respuestasRonda1?: RespuestaPregunta[];
    respuestasRonda2?: RespuestaPregunta[];
    preguntasRonda2?: Pregunta[]; // Preguntas de Ronda 2 si están disponibles
  };
}

export interface ResultadosResponse {
  success: boolean;
  message: string;
  data: {
    sesionId: string;
    perfil_dominante: string;
    nivel_confianza: number;
    perfiles_secundarios?: string[];
    puntuaciones: Record<string, number>;
    recomendaciones_carreras: Array<{
      id: string;
      nombre: string;
      descripcion: string;
      match_score: number;
    }>;
    recomendaciones_actividades: string[];
    analisis_llm?: {
      resumen: string;
      fortalezas: string[];
      areas_mejora: string[];
    };
    discrepancias_detectadas?: Array<{
      tipo: string;
      descripcion: string;
    }>;
  };
}

export interface PerfilVocacionalResponse {
  success: boolean;
  message: string;
  data: {
    perfil_dominante: string;
    nivel_confianza: number;
    perfiles_secundarios?: string[];
    puntuaciones: Record<string, number>;
    recomendaciones_carreras: Array<{
      id: string;
      nombre: string;
      descripcion: string;
      match_score: number;
    }>;
    recomendaciones_actividades: string[];
    ultima_sesion_id: string;
    total_sesiones: number;
  };
}

export interface HistorialResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    tipoTest: TipoTest;
    estado: string;
    fecha_inicio: string;
    fecha_fin?: string;
    perfil_dominante?: string;
  }>;
}

export interface RecomendacionesContinuasResponse {
  success: boolean;
  message: string;
  data: {
    recomendaciones_carreras: Array<{
      id: string;
      nombre: string;
      descripcion: string;
      match_score: number;
    }>;
    recomendaciones_actividades: string[];
    analisis_actualizado: string;
  };
}

export interface AnalizarCambioCarreraResponse {
  success: boolean;
  message: string;
  data: {
    viabilidad: 'alta' | 'media' | 'baja';
    match_score: number;
    recomendaciones: string[];
    preocupaciones_abordadas: string[];
    plan_transicion?: string[];
  };
}

// ==================== FUNCIONES API ====================

/**
 * Iniciar un nuevo test de orientación vocacional
 */
export async function iniciarTest(
  accessToken: string,
  tipoTest: TipoTest
): Promise<IniciarTestResponse> {
  const url = `${API_BASE}/v1/orientacion/iniciar-test`;
  const body = JSON.stringify({ tipoTest });
  
  console.log('📡 Iniciando test - URL:', url);
  console.log('📡 Iniciando test - Body:', body);
  console.log('📡 Iniciando test - Token presente:', !!accessToken);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: body,
  });

  console.log('📥 Respuesta del servidor - Status:', response.status);
  console.log('📥 Respuesta del servidor - StatusText:', response.statusText);

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  console.log('📥 Respuesta del servidor - Payload:', payload);

  if (!response.ok) {
    let message = payload?.message || `Error al iniciar el test (${response.status})`;
    
    // Manejo específico de errores de autenticación y permisos
    if (response.status === 401) {
      message = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
      console.error('❌ Error 401: Sesión expirada');
    } else if (response.status === 403) {
      const apiMessage = payload?.message || '';
      console.error('❌ Error 403: Sin permisos');
      console.error('❌ Mensaje del servidor:', apiMessage);
      console.error('❌ Payload completo:', payload);
      
      if (apiMessage.toLowerCase().includes('permiso') || 
          apiMessage.toLowerCase().includes('permission') ||
          apiMessage.toLowerCase().includes('rol') ||
          apiMessage.toLowerCase().includes('role')) {
        message = 'No tienes permisos para realizar este test. Contacta al administrador si crees que esto es un error.';
      } else {
        message = apiMessage || 'No tienes permisos para realizar este test.';
      }
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
): Promise<GuardarRespuestasResponse> {
  const url = `${API_BASE}/v1/orientacion/guardar-respuestas-ronda-1`;
  const body = JSON.stringify({
    sesionId,
    respuestas,
  });
  
  console.log('📡 Guardando respuestas Ronda 1 - URL:', url);
  console.log('📡 Guardando respuestas Ronda 1 - Body:', body);
  console.log('📡 Guardando respuestas Ronda 1 - SesionId:', sesionId);
  console.log('📡 Guardando respuestas Ronda 1 - Total respuestas:', respuestas.length);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: body,
  });

  console.log('📥 Respuesta del servidor - Status:', response.status);
  console.log('📥 Respuesta del servidor - StatusText:', response.statusText);

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  console.log('📥 Respuesta del servidor - Payload:', payload);

  if (!response.ok) {
    let message = payload?.message || `Error al guardar respuestas (${response.status})`;
    
    // Log detallado del error
    if (payload) {
      console.error('❌ Error completo del servidor:', payload);
      if (payload.errors) {
        console.error('❌ Errores de validación:', payload.errors);
        message = payload.errors.map((e: any) => e.message || e).join(', ') || message;
      }
      
      // Manejo específico de errores de sesión
      if (message.toLowerCase().includes('sesión') || 
          message.toLowerCase().includes('session') ||
          message.toLowerCase().includes('estado')) {
        const error = new Error(message);
        (error as any).status = response.status;
        (error as any).payload = payload;
        (error as any).isSessionError = true;
        throw error;
      }
    }
    
    const error = new Error(message);
    (error as any).status = response.status;
    (error as any).payload = payload;
    throw error;
  }

  return payload as GuardarRespuestasResponse;
}

/**
 * Guardar respuestas de Ronda 2 y completar el test
 */
export async function guardarRespuestasRonda2(
  accessToken: string,
  sesionId: string,
  respuestas: RespuestaPregunta[]
): Promise<GuardarRespuestasResponse> {
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
    const message = payload?.message || `Error al completar el test (${response.status})`;
    throw new Error(message);
  }

  return payload as GuardarRespuestasResponse;
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

  if (!response.ok) {
    const message = payload?.message || `Error al obtener historial (${response.status})`;
    throw new Error(message);
  }

  return payload as HistorialResponse;
}

/**
 * Generar recomendaciones continuas actualizadas
 */
export async function generarRecomendacionesContinuas(
  accessToken: string,
  contextoAdicional: string = ''
): Promise<RecomendacionesContinuasResponse> {
  const response = await fetch(`${API_BASE}/v1/orientacion/recomendaciones-continuas`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contextoAdicional,
    }),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error al generar recomendaciones (${response.status})`;
    throw new Error(message);
  }

  return payload as RecomendacionesContinuasResponse;
}

/**
 * Analizar cambio de carrera
 */
export async function analizarCambioCarrera(
  accessToken: string,
  carreraDestinoId: string,
  razones: string = '',
  preocupaciones: string = ''
): Promise<AnalizarCambioCarreraResponse> {
  const response = await fetch(`${API_BASE}/v1/orientacion/analizar-cambio-carrera`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      carreraDestinoId,
      razones,
      preocupaciones,
    }),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error al analizar cambio de carrera (${response.status})`;
    throw new Error(message);
  }

  return payload as AnalizarCambioCarreraResponse;
}
