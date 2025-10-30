import { API_BASE } from './config';

/**
 * Interfaces para los datos de estadísticas
 */

// Interfaces basadas en las respuestas reales del backend

export interface EstadisticasSolicitudes {
  resumen: {
    totalPostulaciones: number;
    periodoAnalizado: {
      inicio: string;
      fin: string;
    };
  };
  distribucion: {
    porEstado: Array<{ estado: string; cantidad: string }>;
    porTipoBeca: Array<{ tipoBeca: string; cantidad: string; aprobadas: string; rechazadas: string }>;
    porTipoPostulante: Array<{ tipoPostulante: string; cantidad: string; iaaPromedio: string }>;
  };
  tasasAprobacion: {
    general: string;
    aprobadas: number;
    rechazadas: number;
    tasaRechazo: string;
  };
  tiemposEvaluacion: {
    promedioDias: string;
    minDias: number;
    maxDias: number;
  };
  evaluadores: Array<{
    evaluadoPor: string;
    totalEvaluadas: string;
    aprobadas: string;
    rechazadas: string;
    evaluador?: {
      nombre: string;
      apellido: string;
    };
  }>;
  motivosRechazo: Array<any>;
  tendenciaTemporal: Array<{ fecha: string; cantidad: string }>;
}

export interface EstadisticasBeneficiarios {
  total_beneficiarios: number;
  por_facultad?: any[];
  por_programa?: any[];
  por_tipo_beneficio?: any[];
  activos: number;
  inactivos: number;
}

export interface EstadisticasProductividad {
  evaluaciones_completadas: number;
  tiempo_promedio_evaluacion: number;
  evaluaciones_pendientes: number;
  por_evaluador?: any[];
  eficiencia_semanal?: any[];
}

export interface EstadisticasHoras {
  resumen: {
    totalHorasRegistradas: number;
    promedioHorasSemanales: string;
    estudiantesEnRiesgo: number;
    periodo: string;
  };
  distribucionPorSemana: Array<{
    semana: number;
    horasTotal: string;
    horasPromedio: string;
    reportes: string;
  }>;
  cumplimientoPorPlaza: Array<{
    plazaAsignada: string;
    porcentajeCumplimiento: number;
    totalEstudiantes: string;
    plaza?: {
      codigo: string;
      materia: string;
      departamento: string;
    };
  }>;
  estudiantesEnRiesgo: Array<{
    id: string;
    estudiante: string;
    horasCompletadas: string;
    horasRequeridas: number;
    porcentajeCompletado: string;
    horasRestantes: number;
    semanasRestantes: number;
    horasSemanalesRequeridas: string;
  }>;
  proyeccionCumplimiento: {
    proyeccionCumpliran: number;
    proyeccionNoCumpliran: number;
    semanaActual: number;
    semanasRestantes: number;
  };
  topEstudiantes: Array<{
    estudianteId: string;
    totalHoras: string;
    estudiante?: {
      nombre: string;
      apellido: string;
      cedula: string;
    };
  }>;
}

export interface ResumenGeneral {
  periodo: string;
  metricas: {
    postulaciones: {
      total: number;
      enRevision: number;
      pendientes: number;
    };
    beneficiarios: {
      activos: number;
      suspendidos: number;
      culminados: number;
    };
    horas: {
      totalRegistradas: number;
      promedioSemanal: string;
    };
    reportes: {
      pendientesRevision: number;
    };
  };
  estadisticasBecas: Array<{
    tipoBeca: string;
    total: string;
    activos: string;
    exitosos: string;
  }>;
}

export interface Tendencias {
  periodo_actual: string;
  periodo_anterior: string;
  comparacion: {
    solicitudes: {
      actual: number;
      anterior: number;
      variacion: number;
    };
    beneficiarios: {
      actual: number;
      anterior: number;
      variacion: number;
    };
  };
  tendencia_mensual?: any[];
}

export interface Alerta {
  id: number;
  tipo: string;
  prioridad: 'alta' | 'media' | 'baja';
  mensaje: string;
  fecha: string;
}

export interface Alertas {
  total_alertas: number;
  criticas: number;
  advertencias: number;
  alertas: Alerta[];
}

export interface EstudianteCumplimiento {
  id: number;
  nombre: string;
  porcentaje_cumplimiento: number;
  horas_cumplidas: number;
  horas_requeridas: number;
  estado: 'cumple' | 'incumple' | 'en_riesgo';
}

export interface ReporteCumplimiento {
  total_estudiantes: number;
  cumplimiento_global: number;
  estudiantes: EstudianteCumplimiento[];
  incumplimientos?: any[];
}

/**
 * Interfaces para reportes de actividades globales
 */

export interface ReporteActividad {
  id: string;
  estudianteBecarioId: string;
  semana: number;
  periodoAcademico: string;
  horasTrabajadas: number | string; // Puede venir como string o number desde el backend
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'En Revisión';
  bloqueado: boolean;
  objetivosPeriodo?: string;
  metasEspecificas?: string;
  actividadesProgramadas?: string;
  actividadesRealizadas?: string;
  descripcionActividades?: string;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
  estudiante?: {
    nombre: string;
    apellido: string;
    cedula: string;
    email: string;
  };
  beca?: {
    tipoBeca: string;
    codigo: string;
  };
  supervisor?: {
    nombre: string;
    apellido: string;
  };
}

export interface ReportesActividadesGlobales {
  reportes: ReporteActividad[];
  total: number;
  estadisticas: {
    porEstado: {
      Pendiente: number;
      Aprobada: number;
      Rechazada: number;
      'En Revisión': number;
    };
    horasTotalesAprobadas: number | string; // Puede venir como string o number desde el backend
    estudiantesUnicos: number;
  };
  limit: number;
  offset: number;
  totalPages: number;
}

/**
 * Funciones para obtener estadísticas
 */

async function fetchConAuth<T>(endpoint: string, accessToken: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || `Error al obtener datos (${response.status})`);
  }

  const data = await response.json();
  return data.data || data;
}

export async function getEstadisticasSolicitudes(accessToken: string): Promise<EstadisticasSolicitudes> {
  return fetchConAuth('/v1/reportes/estadisticas/solicitudes', accessToken);
}

export async function getEstadisticasBeneficiarios(accessToken: string): Promise<EstadisticasBeneficiarios> {
  return fetchConAuth('/v1/reportes/estadisticas/beneficiarios', accessToken);
}

export async function getEstadisticasProductividad(accessToken: string): Promise<EstadisticasProductividad> {
  return fetchConAuth('/v1/reportes/estadisticas/productividad', accessToken);
}

export async function getEstadisticasHoras(accessToken: string): Promise<EstadisticasHoras> {
  return fetchConAuth('/v1/reportes/estadisticas/horas', accessToken);
}

export async function getResumenGeneral(accessToken: string): Promise<ResumenGeneral> {
  return fetchConAuth('/v1/reportes/estadisticas/resumen-general', accessToken);
}

export async function getTendencias(accessToken: string): Promise<Tendencias> {
  return fetchConAuth('/v1/reportes/estadisticas/tendencias', accessToken);
}

export async function getAlertas(accessToken: string): Promise<Alertas> {
  return fetchConAuth('/v1/reportes/estadisticas/alertas', accessToken);
}

export async function getReporteCumplimiento(accessToken: string): Promise<ReporteCumplimiento> {
  return fetchConAuth('/v1/reportes/estadisticas/cumplimiento', accessToken);
}

/**
 * Obtener reportes de actividades globales (todos los estudiantes)
 * Para administradores, supervisores y capital humano
 */
export async function getReportesActividadesGlobales(
  accessToken: string,
  params?: {
    periodoAcademico?: string;
    estado?: string;
    tipoBeca?: string;
    supervisorId?: string;
    estudianteId?: string;
    limit?: number;
    offset?: number;
  }
): Promise<ReportesActividadesGlobales> {
  const queryParams = new URLSearchParams();

  if (params?.periodoAcademico) queryParams.append('periodoAcademico', params.periodoAcademico);
  if (params?.estado) queryParams.append('estado', params.estado);
  if (params?.tipoBeca) queryParams.append('tipoBeca', params.tipoBeca);
  if (params?.supervisorId) queryParams.append('supervisorId', params.supervisorId);
  if (params?.estudianteId) queryParams.append('estudianteId', params.estudianteId);
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.offset) queryParams.append('offset', params.offset.toString());

  const endpoint = `/v1/reportes/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || `Error al obtener reportes (${response.status})`);
  }

  const data = await response.json();
  return data.data || data;
}

/**
 * Funciones de exportación
 */

export function exportarExcel(
  accessToken: string,
  tipo?: string,
  fechaInicio?: string,
  fechaFin?: string
): void {
  const params = new URLSearchParams();
  if (tipo) params.append('tipo', tipo);
  if (fechaInicio) params.append('fecha_inicio', fechaInicio);
  if (fechaFin) params.append('fecha_fin', fechaFin);

  const url = `${API_BASE}/v1/reportes/estadisticas/export/excel?${params.toString()}`;

  // Crear un enlace temporal para descargar con autenticación
  window.open(url, '_blank');
}

export function exportarCSV(
  accessToken: string,
  tipo?: string,
  fechaInicio?: string,
  fechaFin?: string
): void {
  const params = new URLSearchParams();
  if (tipo) params.append('tipo', tipo);
  if (fechaInicio) params.append('fecha_inicio', fechaInicio);
  if (fechaFin) params.append('fecha_fin', fechaFin);

  const url = `${API_BASE}/v1/reportes/estadisticas/export/csv?${params.toString()}`;

  window.open(url, '_blank');
}

/**
 * Helper para descargar archivos con autenticación
 */
export async function descargarReporteConAuth(
  endpoint: string,
  accessToken: string,
  nombreArchivo: string
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Error al descargar: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error descargando reporte:', error);
    throw error;
  }
}
