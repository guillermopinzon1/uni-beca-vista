import { API_BASE } from './config';

// ============================================
// INTERFACES - Gestión de Ayudantes
// ============================================

export interface Supervisor {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  role: string;
  departamento: string;
  cargo: string;
  activo: boolean;
  cantidadAyudantes: number;
  estudiantesSupervisionados: EstudianteBecarioDetallado[];
}

export interface EstudianteBecarioDetallado {
  id: string;
  usuarioId: string;
  supervisorId: string | null;
  plazaAsignada: string | null;
  tipoBeca: 'Ayudantía' | 'Impacto' | 'Excelencia' | 'Exoneración de Pago';
  estado: 'Activa' | 'Suspendida' | 'Culminada' | 'Cancelada';
  periodoInicio: string;
  periodoFin: string | null;
  horasRequeridas: number;
  horasCompletadas: number;
  descuentoAplicado: number;
  usuario: {
    id: string;
    nombre: string;
    apellido: string;
    cedula: string;
    email: string;
    telefono: string;
    carrera: string;
    trimestre: number;
  };
  plaza: {
    id: string;
    materia: string;
    codigo: string;
    departamento: string;
    ubicacion: string;
    tipoAyudantia: 'academica' | 'administrativa' | 'investigacion';
    horasSemana: number;
  } | null;
}

export interface ReporteSemanal {
  id: string;
  estudianteId: string;
  estudianteBecarioId: string;
  supervisorId: string | null;
  tipoBeca: string;
  semana: number;
  periodoAcademico: string;
  fecha: string | null;
  horasTrabajadas: number;
  objetivosPeriodo: string | null;
  metasEspecificas: string | null;
  actividadesProgramadas: string | null;
  actividadesRealizadas: string | null;
  descripcionActividades: string | null;
  observaciones: string | null;
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'En Revisión';
  bloqueado: boolean;
  fechaAprobacion: string | null;
  observacionesSupervisor: string | null;
  motivoRechazo: string | null;
  estudiante: {
    nombre: string;
    apellido: string;
    email: string;
  };
  supervisor: {
    nombre: string;
    apellido: string;
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// RESPONSES
// ============================================

export interface ListarSupervisoresResponse {
  success: true;
  message: string;
  timestamp: string;
  data: {
    supervisores: Supervisor[];
    total: number;
    totalSupervisores: number;
    limit: number;
    offset: number;
    estadisticas: {
      totalSupervisores: number;
      totalAyudantes: number;
      promedioAyudantesPorSupervisor: string;
    };
  };
}

export interface ObtenerAyudantesResponse {
  success: true;
  message: string;
  timestamp: string;
  data: {
    supervisor: {
      id: string;
      nombre: string;
      apellido: string;
      email: string;
      role: string;
    };
    ayudantes: EstudianteBecarioDetallado[];
    total: number;
  };
}

export interface ActualizarSupervisorResponse {
  success: true;
  message: string;
  timestamp: string;
  data: {
    estudianteBecario: EstudianteBecarioDetallado;
    mensaje: string;
  };
}

export interface AsignarAyudantesResponse {
  success: true;
  message: string;
  timestamp: string;
  data: {
    asignados: EstudianteBecarioDetallado[];
    errores: Array<{
      id: string;
      nombre: string;
      motivo: string;
    }>;
    totalAsignados: number;
    totalErrores: number;
    supervisor: {
      id: string;
      nombre: string;
      email: string;
    };
  };
}

export interface DesasignarAyudantesResponse {
  success: true;
  message: string;
  timestamp: string;
  data: {
    desasignados: Array<{
      id: string;
      supervisorId: null;
      tipoBeca: string;
      estado: string;
      usuario: {
        nombre: string;
        apellido: string;
      };
    }>;
    errores: Array<{
      id: string;
      nombre: string;
      motivo: string;
    }>;
    totalDesasignados: number;
    totalErrores: number;
    supervisor: {
      id: string;
      nombre: string;
      email: string;
    };
  };
}

export interface AprobarReporteResponse {
  success: true;
  message: string;
  timestamp: string;
  data: {
    reporte: {
      id: string;
      semana: number;
      horasTrabajadas: number;
      estado: 'Aprobada';
      fechaAprobacion: string;
      observacionesSupervisor: string | null;
    };
  };
}

export interface RechazarReporteResponse {
  success: true;
  message: string;
  timestamp: string;
  data: {
    reporte: {
      id: string;
      semana: number;
      estado: 'Rechazada';
      fechaAprobacion: string;
      motivoRechazo: string;
    };
  };
}

export interface ListarReportesResponse {
  success: true;
  message: string;
  timestamp: string;
  data: {
    reportes: ReporteSemanal[];
    total: number;
    limit: number;
    offset: number;
  };
}

export interface ObtenerReporteResponse {
  success: true;
  message: string;
  data: {
    reporte: ReporteSemanal;
  };
}

// ============================================
// REQUEST PARAMS
// ============================================

export interface ListarSupervisoresParams {
  activo?: boolean;
  limit?: number;
  offset?: number;
  conAyudantes?: boolean;
}

export interface ActualizarSupervisorRequest {
  supervisorId: string;
}

export interface AsignarAyudantesRequest {
  estudiantesBecarios: string[];
  permitirReasignacion?: boolean;
}

export interface DesasignarAyudantesRequest {
  estudiantesBecarios: string[];
}

export interface AprobarReporteRequest {
  observaciones?: string;
}

export interface RechazarReporteRequest {
  motivo: string;
}

export interface ListarReportesParams {
  periodoAcademico?: string;
  estado?: 'Pendiente' | 'Aprobada' | 'Rechazada' | 'En Revisión';
  limit?: number;
  offset?: number;
}

// ============================================
// API FUNCTIONS - Gestión de Ayudantes
// ============================================

/**
 * 1. Listar Todos los Supervisores con Ayudantes
 * GET /api/v1/supervisores/ayudantes/all
 */
export async function listarSupervisoresConAyudantes(
  accessToken: string,
  params?: ListarSupervisoresParams
): Promise<ListarSupervisoresResponse> {
  const searchParams = new URLSearchParams();

  if (params?.activo !== undefined) searchParams.append('activo', params.activo.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.offset) searchParams.append('offset', params.offset.toString());
  if (params?.conAyudantes !== undefined) searchParams.append('conAyudantes', params.conAyudantes.toString());

  const url = `${API_BASE}/v1/supervisores/ayudantes/all${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error obteniendo supervisores (${response.status})`;
    throw new Error(message);
  }

  return payload as ListarSupervisoresResponse;
}

/**
 * 2. Obtener Ayudantes de un Supervisor Específico
 * GET /api/v1/supervisores/{id}/ayudantes
 */
export async function obtenerAyudantesDeSupervisor(
  accessToken: string,
  supervisorId: string
): Promise<ObtenerAyudantesResponse> {
  const url = `${API_BASE}/v1/supervisores/${supervisorId}/ayudantes`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error obteniendo ayudantes (${response.status})`;
    throw new Error(message);
  }

  return payload as ObtenerAyudantesResponse;
}

/**
 * 3. Actualizar Supervisor de un Ayudante
 * PUT /api/v1/supervisores/ayudantes/{id}
 */
export async function actualizarSupervisorDeAyudante(
  accessToken: string,
  estudianteBecarioId: string,
  data: ActualizarSupervisorRequest
): Promise<ActualizarSupervisorResponse> {
  const url = `${API_BASE}/v1/supervisores/ayudantes/${estudianteBecarioId}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error actualizando supervisor (${response.status})`;
    throw new Error(message);
  }

  return payload as ActualizarSupervisorResponse;
}

/**
 * 4. Asignar Múltiples Ayudantes (Batch)
 * POST /api/v1/supervisores/{supervisorId}/ayudantes/asignar
 */
export async function asignarAyudantesASupervisor(
  accessToken: string,
  supervisorId: string,
  data: AsignarAyudantesRequest
): Promise<AsignarAyudantesResponse> {
  const url = `${API_BASE}/v1/supervisores/${supervisorId}/ayudantes/asignar`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error asignando ayudantes (${response.status})`;
    throw new Error(message);
  }

  return payload as AsignarAyudantesResponse;
}

/**
 * 5. Desasignar Múltiples Ayudantes (Batch)
 * POST /api/v1/supervisores/{supervisorId}/ayudantes/desasignar
 */
export async function desasignarAyudantesDeSupervisor(
  accessToken: string,
  supervisorId: string,
  data: DesasignarAyudantesRequest
): Promise<DesasignarAyudantesResponse> {
  const url = `${API_BASE}/v1/supervisores/${supervisorId}/ayudantes/desasignar`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error desasignando ayudantes (${response.status})`;
    throw new Error(message);
  }

  return payload as DesasignarAyudantesResponse;
}

// ============================================
// API FUNCTIONS - Gestión de Reportes
// ============================================

/**
 * 6. Aprobar Reporte de Horas
 * PATCH /api/v1/ayudantias/{id}/reportes/{reporteId}/aprobar
 */
export async function aprobarReporteDeHoras(
  accessToken: string,
  estudianteBecarioId: string,
  reporteId: string,
  data?: AprobarReporteRequest
): Promise<AprobarReporteResponse> {
  const url = `${API_BASE}/v1/ayudantias/${estudianteBecarioId}/reportes/${reporteId}/aprobar`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error aprobando reporte (${response.status})`;
    throw new Error(message);
  }

  return payload as AprobarReporteResponse;
}

/**
 * 7. Rechazar Reporte de Horas
 * PATCH /api/v1/ayudantias/{id}/reportes/{reporteId}/rechazar
 */
export async function rechazarReporteDeHoras(
  accessToken: string,
  estudianteBecarioId: string,
  reporteId: string,
  data: RechazarReporteRequest
): Promise<RechazarReporteResponse> {
  const url = `${API_BASE}/v1/ayudantias/${estudianteBecarioId}/reportes/${reporteId}/rechazar`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error rechazando reporte (${response.status})`;
    throw new Error(message);
  }

  return payload as RechazarReporteResponse;
}

/**
 * 8. Listar Reportes de un Ayudante
 * GET /api/v1/ayudantias/{id}/reportes
 */
export async function listarReportesDeAyudante(
  accessToken: string,
  estudianteBecarioId: string,
  params?: ListarReportesParams
): Promise<ListarReportesResponse> {
  const searchParams = new URLSearchParams();

  if (params?.periodoAcademico) searchParams.append('periodoAcademico', params.periodoAcademico);
  if (params?.estado) searchParams.append('estado', params.estado);
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.offset) searchParams.append('offset', params.offset.toString());

  const url = `${API_BASE}/v1/ayudantias/${estudianteBecarioId}/reportes${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error obteniendo reportes (${response.status})`;
    throw new Error(message);
  }

  return payload as ListarReportesResponse;
}

/**
 * 9. Obtener Reporte Específico
 * GET /api/v1/ayudantias/{id}/reportes/{reporteId}
 */
export async function obtenerReporteEspecifico(
  accessToken: string,
  estudianteBecarioId: string,
  reporteId: string
): Promise<ObtenerReporteResponse> {
  const url = `${API_BASE}/v1/ayudantias/${estudianteBecarioId}/reportes/${reporteId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error obteniendo reporte (${response.status})`;
    throw new Error(message);
  }

  return payload as ObtenerReporteResponse;
}

// ============================================
// API FUNCTIONS - Mis Ayudantes (Supervisor)
// ============================================

export interface MisAyudantesParams {
  estado?: 'Activa' | 'Suspendida' | 'Culminada' | 'Cancelada';
  limit?: number;
  offset?: number;
}

export interface MisAyudantesResponse {
  success: true;
  message: string;
  timestamp: string;
  data: {
    ayudantes: EstudianteBecarioDetallado[];
    total: number;
    limit: number;
    offset: number;
  };
}

/**
 * Obtener mis ayudantes asignados (para supervisor logueado)
 * GET /api/v1/becarios/supervisor/mis-ayudantes
 */
export async function obtenerMisAyudantes(
  accessToken: string,
  params?: MisAyudantesParams
): Promise<MisAyudantesResponse> {
  const searchParams = new URLSearchParams();

  if (params?.estado) searchParams.append('estado', params.estado);
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.offset) searchParams.append('offset', params.offset.toString());

  const url = `${API_BASE}/v1/becarios/supervisor/mis-ayudantes${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error obteniendo ayudantes (${response.status})`;
    throw new Error(message);
  }

  return payload as MisAyudantesResponse;
}

/**
 * Obtener detalles de un becario específico
 * GET /api/v1/becarios/{becarioId}
 */
export interface BecarioDetalleResponse {
  success: true;
  message: string;
  data: EstudianteBecarioDetallado;
}

export async function obtenerDetalleBecario(
  accessToken: string,
  becarioId: string
): Promise<BecarioDetalleResponse> {
  const url = `${API_BASE}/v1/becarios/${becarioId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error obteniendo detalle del becario (${response.status})`;
    throw new Error(message);
  }

  return payload as BecarioDetalleResponse;
}

// ============================================
// API FUNCTIONS - Supervisor Detail with Plazas
// ============================================

export interface PlazaAsignada {
  id: string;
  materia: string;
  codigo: string;
  departamento: string;
  ubicacion: string;
  tipoAyudantia: 'academica' | 'administrativa' | 'investigacion';
  horasSemana: number;
  activa: boolean;
  supervisorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupervisorEstadisticas {
  totalPlazas: number;
  plazasActivas: number;
  totalAyudantes: number;
  ayudantesActivos: number;
  ayudantesSuspendidos: number;
  ayudantesCulminados: number;
  totalHorasCompletadas: number;
  totalHorasRequeridas: number;
  porcentajeProgresoHoras: number;
}

export interface SupervisorCompleto {
  id: string;
  email: string;
  role: string;
  nombre: string;
  apellido: string;
  telefono: string;
  cedula: string;
  departamento: string | null;
  cargo: string | null;
  carrera: string | null;
  trimestre: number | null;
  iaa: number | null;
  asignaturasAprobadas: number | null;
  emailVerified: boolean;
  firstLogin: boolean;
  fotocopiaCedulaId: string | null;
  flujogramaCarreraId: string | null;
  historicoNotasId: string | null;
  planCarreraAvaladoId: string | null;
  curriculumDeportivoId: string | null;
  activo: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  plazasAsignadas: PlazaAsignada[];
  estudiantesSupervisionados: EstudianteBecarioDetallado[];
  estadisticas: SupervisorEstadisticas;
}

export interface ObtenerSupervisorCompletoResponse {
  success: true;
  message: string;
  timestamp: string;
  data: SupervisorCompleto;
}

/**
 * Obtener supervisor por ID con ayudantes y estadísticas
 * GET /api/v1/supervisores/{id}
 */
export async function obtenerSupervisorCompleto(
  accessToken: string,
  supervisorId: string
): Promise<ObtenerSupervisorCompletoResponse> {
  const url = `${API_BASE}/v1/supervisores/${supervisorId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error obteniendo supervisor completo (${response.status})`;
    throw new Error(message);
  }

  return payload as ObtenerSupervisorCompletoResponse;
}
