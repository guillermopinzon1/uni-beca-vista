import { API_BASE } from './config';

// ==================== TIPOS E INTERFACES ====================

export type TipoTest = 'Holland_RIASEC' | 'ICO';

/** Elemento enriquecido de recomendaciones_carreras (completar test, resultados por sesión, mi perfil vocacional, etc.) */
export interface RecomendacionCarrera {
  id: number;
  name: string;
  razon: string;
  faculty?: string;
  facultad?: string; // snake_case desde el back
  area: string;
}

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
      recomendacionesCarreras: RecomendacionCarrera[];
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
      recomendacionesCarreras: RecomendacionCarrera[];
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

/** Objeto "resultado" interno (perfilDominante, recomendacionesCarreras, etc.) para usar en PerfilVocacional */
export type ResultadoVocacional = ResultadosResponse['data']['resultado'];

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
    tieneResultado?: boolean;
  }>;
}

/** Ítem del historial para especialista: puede incluir desglose por tipo de test (Holland e ICO) */
export interface HistorialEspecialistaItem {
  estudiante: {
    id: string;
    nombre: string;
    email: string;
  };
  perfilDominante: string;
  codigoHolland: string;
  recomendacionesCarreras: RecomendacionCarrera[];
  /** Total de tests completados (Holland + ICO) */
  totalSesiones: number;
  /** Fecha del último test completado (cualquier tipo) */
  ultimaFechaTest: string;
  /** Opcional: cantidad de tests Holland RIASEC completados (backend puede enviar total_sesiones_holland / sesionesHolland) */
  sesionesHolland?: number;
  /** Opcional: cantidad de tests ICO completados (backend puede enviar total_sesiones_ico / sesionesIco) */
  sesionesIco?: number;
  /** Opcional: fecha último test Holland (ultima_fecha_holland / ultimaFechaHolland) */
  ultimaFechaHolland?: string;
  /** Opcional: fecha último test ICO (ultima_fecha_ico / ultimaFechaIco) */
  ultimaFechaIco?: string;
  /** Opcional: tipo del último test completado ('Holland_RIASEC' | 'ICO') para mostrar en UI */
  ultimoTipoTest?: TipoTest;
}

export interface HistorialEspecialistaResponse {
  success: boolean;
  message: string;
  timestamp?: string;
  data: HistorialEspecialistaItem[];
}

// ==================== TIPOS Y RESPUESTAS TEST ICO ====================

/** Respuesta al iniciar sesión ICO (una sola ronda) */
export interface IniciarTestIcoResponse {
  success: boolean;
  message: string;
  timestamp?: string;
  data: {
    sesionId: string;
    tipoTest: 'ICO';
    estado: string;
    fechaInicio: string;
  };
}

/** Preguntas del test ICO (GET sesion-ico/:sesionId/preguntas) */
export interface PreguntasIcoResponse {
  success: boolean;
  message: string;
  timestamp?: string;
  data: {
    preguntas: Pregunta[];
  };
}

/** Elemento de respuestas para guardar-respuestas-ico (snake_case en body) */
export interface RespuestaIcoBody {
  pregunta_id: string;
  respuesta: boolean; // true = Sí, false = No
  tiempo_respuesta?: number;
  nivel_seguridad?: 'seguro' | 'no_seguro';
}

/** Respuesta al enviar respuestas ICO (incluye puntuaciones + análisis LLM) */
export interface GuardarRespuestasIcoResponse {
  success: boolean;
  message: string;
  timestamp?: string;
  data: {
    resultadoId: string;
    puntuaciones: Record<string, number>;
    codigoHolland: string;
    perfilDominante: string;
    perfilSecundario: string;
    analisisLlm?: {
      perfilVocacional?: {
        resumen?: string;
        fortalezas?: string[];
        areasExplorar?: string[];
      };
      carrerasRecomendadas?: Array<{ nombre?: string; name?: string; razon: string; facultad?: string; area?: string }>;
      sugerenciasAcompanamiento?: string[];
    };
    /** Cada ítem: nombre, name, razon, facultad, area. Título = nombre + facultad; cuerpo = razon. */
    recomendacionesCarreras?: Array<{ nombre?: string; name?: string; razon: string; facultad?: string; area?: string }>;
  };
}

/** Resultado ICO guardado (GET resultados-ico/:sesionId) - snake_case desde back */
export interface ResultadosIcoResponse {
  success: boolean;
  message: string;
  timestamp?: string;
  data: {
    id: string;
    sesion_id: string;
    usuario_id: string;
    tipo_test: string;
    puntuaciones_finales?: Record<string, number>;
    codigo_holland?: string;
    perfil_dominante?: string;
    perfil_secundario?: string;
    analisis_llm?: GuardarRespuestasIcoResponse['data']['analisisLlm'];
    recomendaciones_carreras?: Array<{ nombre?: string; name?: string; razon: string; facultad?: string; area?: string }>;
    perfil_vocacional?: any;
    fecha_generacion?: string;
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
      message = payload?.message || 'Ya completaste el test Holland. Solo puedes realizar un test Holland.';
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

// ==================== API TEST ICO (una sola ronda) ====================

/**
 * Iniciar sesión del test ICO (sin body).
 */
export async function iniciarTestIco(accessToken: string): Promise<IniciarTestIcoResponse> {
  const response = await fetch(`${API_BASE}/v1/orientacion/iniciar-test-ico`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    let message = payload?.message || `Error al iniciar test ICO (${response.status})`;
    if (response.status === 401) {
      message = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
    } else if (response.status === 403) {
      message = payload?.message || 'Ya completaste el test ICO. Solo puedes realizar un test ICO.';
    }
    const error = new Error(message);
    (error as any).status = response.status;
    (error as any).payload = payload;
    throw error;
  }

  return payload as IniciarTestIcoResponse;
}

/**
 * Obtener todas las preguntas del test ICO.
 */
export async function obtenerPreguntasIco(
  accessToken: string,
  sesionId: string
): Promise<PreguntasIcoResponse> {
  const response = await fetch(`${API_BASE}/v1/orientacion/sesion-ico/${sesionId}/preguntas`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error al obtener preguntas ICO (${response.status})`;
    const error = new Error(message);
    (error as any).status = response.status;
    (error as any).payload = payload;
    throw error;
  }

  return payload as PreguntasIcoResponse;
}

/**
 * Enviar respuestas del test ICO y obtener resultado (puntuaciones + recomendaciones LLM).
 */
export async function guardarRespuestasIco(
  accessToken: string,
  sesionId: string,
  respuestas: RespuestaIcoBody[]
): Promise<GuardarRespuestasIcoResponse> {
  const response = await fetch(`${API_BASE}/v1/orientacion/guardar-respuestas-ico`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sesionId, respuestas }),
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error al guardar respuestas ICO (${response.status})`;
    const error = new Error(message);
    (error as any).status = response.status;
    (error as any).payload = payload;
    throw error;
  }

  return payload as GuardarRespuestasIcoResponse;
}

/**
 * Obtener resultado ICO guardado (opcional, si el usuario vuelve después).
 */
export async function obtenerResultadosIco(
  accessToken: string,
  sesionId: string
): Promise<ResultadosIcoResponse> {
  const response = await fetch(`${API_BASE}/v1/orientacion/resultados-ico/${sesionId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error al obtener resultados ICO (${response.status})`;
    const error = new Error(message);
    (error as any).status = response.status;
    (error as any).payload = payload;
    throw error;
  }

  return payload as ResultadosIcoResponse;
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

  // Normalizar data a array (backend puede enviar data como array o como { historial: [...] } / { sesiones: [...] })
  function toHistorialArray(d: unknown): unknown[] {
    if (Array.isArray(d)) return d;
    if (d && typeof d === 'object') {
      const obj = d as Record<string, unknown>;
      if (Array.isArray(obj.historial)) return obj.historial;
      if (Array.isArray(obj.sesiones)) return obj.sesiones;
      if (Array.isArray(obj.data)) return obj.data;
      const firstArrayKey = Object.keys(obj).find((k) => Array.isArray(obj[k]));
      if (firstArrayKey && Array.isArray(obj[firstArrayKey])) return obj[firstArrayKey] as unknown[];
    }
    return [];
  }

  if (payload.data !== undefined) {
    const arr = toHistorialArray(payload.data);
    return { success: true, data: arr } as HistorialResponse;
  }

  console.warn('⚠️ [Frontend] Estructura inesperada, devolviendo array vacío');
  return {
    success: true,
    data: []
  } as HistorialResponse;
}

/**
 * Obtener historial de tests para especialista
 */
export async function obtenerHistorialEspecialista(
  accessToken: string
): Promise<HistorialEspecialistaResponse> {
  const response = await fetch(`${API_BASE}/v1/orientacion/historial-especialista`, {
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
    let message = payload?.message || `Error al obtener historial del especialista (${response.status})`;
    
    if (response.status === 401) {
      message = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
    } else if (response.status === 403) {
      message = 'No tienes permisos para acceder a esta información.';
    }
    
    const error = new Error(message);
    (error as any).status = response.status;
    (error as any).payload = payload;
    throw error;
  }

  return payload as HistorialEspecialistaResponse;
}

// ==================== TRAYECTORIA ACADÉMICA (BACHILLERATO) ====================

/** Materia con nota (por año/lapso) */
export interface MateriaNota {
  materia: string;
  nota: number;
}

/** Materia con nota (por área, para graduados) */
export interface MateriaNotaArea {
  nombre: string;
  nota: number;
}

/** Área con materias (para graduados) */
export interface MateriasPorAreaItem {
  area: string;
  materias: MateriaNotaArea[];
}

/** materiasPorAnoLapso: año "1".."5" → lapso "1"|"2"|"3"|"anual" → MateriaNota[] */
export type MateriasPorAnoLapsoType = Record<string, Record<string, MateriaNota[]>>;

/** Body para crear/actualizar trayectoria (camelCase, enviar al back) */
export interface TrayectoriaBody {
  promediosPorAno?: Record<string, number>;
  promedioGeneral?: number;
  gradoActual?: string;
  materiasDestacadas?: string[];
  actividadesExtracurriculares?: string[];
  proyectosRealizados?: string[];
  materiasPorAnoLapso?: MateriasPorAnoLapsoType;
  materiasPorArea?: MateriasPorAreaItem[];
}

/** Respuesta del back (puede venir en snake_case) */
export interface TrayectoriaResponse {
  success: boolean;
  message?: string;
  data?: {
    id?: string;
    promedio_general_acumulado?: number;
    promedioGeneral?: number;
    grado_actual?: string;
    gradoActual?: string;
    promedios_por_ano?: Record<string, number>;
    promediosPorAno?: Record<string, number>;
    materias_destacadas?: string[];
    materiasDestacadas?: string[];
    actividades_extracurriculares?: string[];
    actividadesExtracurriculares?: string[];
    proyectos_realizados?: string[];
    proyectosRealizados?: string[];
    materias_por_ano_lapso?: MateriasPorAnoLapsoType;
    materiasPorAnoLapso?: MateriasPorAnoLapsoType;
    materias_por_area?: MateriasPorAreaItem[];
    materiasPorArea?: MateriasPorAreaItem[];
  };
}

/** Normaliza datos de trayectoria (snake_case → camelCase para el front) */
export function normalizarTrayectoria(data: TrayectoriaResponse['data']): TrayectoriaBody | null {
  if (!data) return null;
  return {
    promediosPorAno: data.promediosPorAno ?? data.promedios_por_ano ?? undefined,
    promedioGeneral: data.promedioGeneral ?? data.promedio_general_acumulado ?? undefined,
    gradoActual: data.gradoActual ?? data.grado_actual ?? undefined,
    materiasDestacadas: data.materiasDestacadas ?? data.materias_destacadas ?? undefined,
    actividadesExtracurriculares: data.actividadesExtracurriculares ?? data.actividades_extracurriculares ?? undefined,
    proyectosRealizados: data.proyectosRealizados ?? data.proyectos_realizados ?? undefined,
    materiasPorAnoLapso: data.materiasPorAnoLapso ?? data.materias_por_ano_lapso ?? undefined,
    materiasPorArea: data.materiasPorArea ?? data.materias_por_area ?? undefined,
  };
}

/**
 * Obtener trayectoria académica (bachillerato)
 */
export async function obtenerMiTrayectoria(accessToken: string): Promise<TrayectoriaResponse> {
  const response = await fetch(`${API_BASE}/v1/orientacion/trayectoria-academica`, {
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
    if (response.status === 404) {
      return { success: true, data: undefined };
    }
    const message = payload?.message || `Error al obtener trayectoria (${response.status})`;
    const error = new Error(message);
    (error as any).status = response.status;
    (error as any).payload = payload;
    throw error;
  }

  return payload as TrayectoriaResponse;
}

/**
 * Crear o actualizar mi trayectoria académica (PUT/PATCH).
 * Body en camelCase según especificación.
 */
export async function actualizarMiTrayectoria(
  accessToken: string,
  body: TrayectoriaBody
): Promise<TrayectoriaResponse> {
  const response = await fetch(`${API_BASE}/v1/orientacion/trayectoria-academica`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error al guardar trayectoria (${response.status})`;
    const error = new Error(message);
    (error as any).status = response.status;
    (error as any).payload = payload;
    throw error;
  }

  return payload as TrayectoriaResponse;
}
