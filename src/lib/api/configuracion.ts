import { API_BASE } from './config';

// ==================== TIPOS Y ENUMS ====================

export enum TipoBeca {
  EXCELENCIA = 'Excelencia',
  AYUDANTIA = 'Ayudantía',
  IMPACTO = 'Impacto',
  EXONERACION = 'Exoneración de Pago',
  FORMACION_DOCENTE = 'Formación Docente'
}

export enum SubtipoExcelencia {
  ACADEMICA = 'Académica',
  DEPORTIVA = 'Deportiva',
  ARTISTICA = 'Artística',
  EMPRENDIMIENTO = 'Emprendimiento',
  CIVICO = 'Cívico'
}

// ==================== INTERFACES ====================

// Períodos Académicos
export interface PeriodoAcademico {
  id: string;
  periodoAcademico: string;
  semanaActual: number;
  semanasHabilitadas: number[];
  fechaInicio: string;
  fechaFin: string;
  descripcion?: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConfiguracionPeriodoActivo {
  periodoAcademico: string;
  semanaActual: number;
  semanasHabilitadas: number[];
  totalSemanasHabilitadas: number;
  fechaInicio: string;
  fechaFin: string;
}

export interface CreatePeriodoRequest {
  periodoAcademico: string;
  semanaActual: number;
  semanasHabilitadas: number[];
  fechaInicio: string;
  fechaFin: string;
  descripcion?: string;
  activo?: boolean;
}

// Semanas
export interface SemanaVerificacion {
  semana: number;
  periodoAcademico: string;
  habilitada: boolean;
}

export interface CambiarSemanaRequest {
  semana: number;
}

export interface HabilitarSemanaRequest {
  semana: number;
  periodoId?: string;
}

// Configuración de Becas
export interface ConfiguracionBeca {
  id: string;
  tipoBeca: TipoBeca;
  subtipoExcelencia?: SubtipoExcelencia;
  cuposDisponibles: number;
  duracionMeses: number;
  promedioMinimo: number;
  semestreMinimo: number;
  semestreMaximo: number;
  edadMaxima: number;
  requisitosEspeciales?: string;
  documentosRequeridos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrUpdateConfiguracionBecaRequest {
  tipoBeca: TipoBeca;
  subtipoExcelencia?: SubtipoExcelencia;
  cuposDisponibles: number;
  duracionMeses: number;
  promedioMinimo: number;
  semestreMinimo: number;
  semestreMaximo: number;
  edadMaxima: number;
  requisitosEspeciales?: string;
  documentosRequeridos: string[];
}

// Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  timestamp?: string;
  data: T;
}

export interface PeriodosResponse {
  periodos?: PeriodoAcademico[];
}

export interface ConfiguracionesBecasResponse {
  total: number;
  configuraciones: ConfiguracionBeca[];
}

export interface DocumentosRequeridosResponse {
  documentosRequeridos: string[];
}

// ==================== PERÍODOS ACADÉMICOS ====================

/**
 * Obtener configuración del período académico activo
 */
export async function fetchPeriodoActivo(accessToken: string): Promise<ApiResponse<ConfiguracionPeriodoActivo>> {
  const response = await fetch(`${API_BASE}/v1/configuracion/periodo-actual`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error obteniendo período activo');
  }

  return data;
}

/**
 * Listar todos los períodos académicos
 */
export async function fetchPeriodos(accessToken: string): Promise<ApiResponse<PeriodosResponse>> {
  const response = await fetch(`${API_BASE}/v1/configuracion/periodos`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error obteniendo períodos académicos');
  }

  return data;
}

/**
 * Crear un nuevo período académico
 */
export async function createPeriodo(
  accessToken: string,
  periodoData: CreatePeriodoRequest
): Promise<ApiResponse<PeriodoAcademico>> {
  const response = await fetch(`${API_BASE}/v1/configuracion/periodos`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(periodoData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error creando período académico');
  }

  return data;
}

/**
 * Obtener un período específico por ID
 */
export async function fetchPeriodoById(
  accessToken: string,
  periodoId: string
): Promise<ApiResponse<PeriodoAcademico>> {
  const response = await fetch(`${API_BASE}/v1/configuracion/periodos/${periodoId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error obteniendo período académico');
  }

  return data;
}

/**
 * Actualizar un período académico
 */
export async function updatePeriodo(
  accessToken: string,
  periodoId: string,
  periodoData: CreatePeriodoRequest
): Promise<ApiResponse<PeriodoAcademico>> {
  const response = await fetch(`${API_BASE}/v1/configuracion/periodos/${periodoId}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(periodoData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error actualizando período académico');
  }

  return data;
}

/**
 * Eliminar un período académico (no se puede eliminar el activo)
 */
export async function deletePeriodo(accessToken: string, periodoId: string): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_BASE}/v1/configuracion/periodos/${periodoId}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error eliminando período académico');
  }

  return data;
}

/**
 * Activar un período académico (desactiva automáticamente los demás)
 */
export async function activarPeriodo(accessToken: string, periodoId: string): Promise<ApiResponse<PeriodoAcademico>> {
  const response = await fetch(`${API_BASE}/v1/configuracion/periodos/${periodoId}/activar`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error activando período académico');
  }

  return data;
}

// ==================== GESTIÓN DE SEMANAS ====================

/**
 * Obtener semanas habilitadas del período activo
 */
export async function fetchSemanasHabilitadas(
  accessToken: string
): Promise<ApiResponse<{ semanasHabilitadas: number[]; semanaActual: number }>> {
  const response = await fetch(`${API_BASE}/v1/configuracion/semanas-habilitadas`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error obteniendo semanas habilitadas');
  }

  return data;
}

/**
 * Verificar si una semana está habilitada
 */
export async function verificarSemana(
  accessToken: string,
  semana: number,
  periodoAcademico?: string
): Promise<ApiResponse<SemanaVerificacion>> {
  const params = new URLSearchParams({ semana: semana.toString() });
  if (periodoAcademico) {
    params.append('periodoAcademico', periodoAcademico);
  }

  const response = await fetch(`${API_BASE}/v1/configuracion/verificar-semana?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error verificando semana');
  }

  return data;
}

/**
 * Cambiar la semana actual del período activo
 */
export async function cambiarSemanaActual(
  accessToken: string,
  semana: number
): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_BASE}/v1/configuracion/semana-actual`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ semana }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error cambiando semana actual');
  }

  return data;
}

/**
 * Habilitar una semana para reportes (desbloquea automáticamente todos los reportes)
 */
export async function habilitarSemana(
  accessToken: string,
  semana: number,
  periodoId?: string
): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_BASE}/v1/configuracion/habilitar-semana`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ semana, periodoId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error habilitando semana');
  }

  return data;
}

/**
 * Deshabilitar una semana para reportes (bloquea automáticamente todos los reportes)
 */
export async function deshabilitarSemana(
  accessToken: string,
  semana: number,
  periodoId?: string
): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_BASE}/v1/configuracion/deshabilitar-semana`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ semana, periodoId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error deshabilitando semana');
  }

  return data;
}

/**
 * Bloquear masivamente todos los reportes de una semana
 */
export async function bloquearReportesSemana(
  accessToken: string,
  semana: number,
  periodoId?: string
): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_BASE}/v1/configuracion/bloquear-reportes-semana`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ semana, periodoId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error bloqueando reportes de semana');
  }

  return data;
}

/**
 * Desbloquear masivamente todos los reportes de una semana
 */
export async function desbloquearReportesSemana(
  accessToken: string,
  semana: number,
  periodoId?: string
): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_BASE}/v1/configuracion/desbloquear-reportes-semana`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ semana, periodoId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error desbloqueando reportes de semana');
  }

  return data;
}

// ==================== CONFIGURACIÓN DE BECAS ====================

/**
 * Listar configuraciones de becas con filtros opcionales
 */
export async function fetchConfiguracionesBecas(
  accessToken: string,
  tipoBeca?: TipoBeca,
  subtipoExcelencia?: SubtipoExcelencia
): Promise<ApiResponse<ConfiguracionesBecasResponse>> {
  const params = new URLSearchParams();
  if (tipoBeca) params.append('tipoBeca', tipoBeca);
  if (subtipoExcelencia) params.append('subtipoExcelencia', subtipoExcelencia);

  const queryString = params.toString();
  const url = `${API_BASE}/v1/configuracion/becas${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error obteniendo configuraciones de becas');
  }

  return data;
}

/**
 * Crear o actualizar configuración de beca (upsert basado en tipoBeca + subtipoExcelencia)
 */
export async function createOrUpdateConfiguracionBeca(
  accessToken: string,
  configuracion: CreateOrUpdateConfiguracionBecaRequest
): Promise<ApiResponse<ConfiguracionBeca>> {
  const response = await fetch(`${API_BASE}/v1/configuracion/becas`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(configuracion),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error guardando configuración de beca');
  }

  return data;
}

/**
 * Obtener documentos requeridos para una beca específica
 */
export async function fetchDocumentosRequeridos(
  accessToken: string,
  tipoBeca: TipoBeca,
  subtipoExcelencia?: SubtipoExcelencia
): Promise<ApiResponse<DocumentosRequeridosResponse>> {
  const params = new URLSearchParams({ tipoBeca });
  if (subtipoExcelencia) params.append('subtipoExcelencia', subtipoExcelencia);

  const response = await fetch(`${API_BASE}/v1/configuracion/becas/documentos?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error obteniendo documentos requeridos');
  }

  return data;
}
