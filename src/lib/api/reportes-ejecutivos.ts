import { API_BASE } from './config';

/**
 * Interfaces para Reportes Ejecutivos
 */

export interface InformeEjecutivo {
  periodo: string;
  resumenEjecutivo: {
    kpis: {
      totalPostulaciones: number;
      totalBecarios: number;
      tasaAceptacion: number;
      presupuestoTotal: number;
      presupuestoEjecutado: number;
      tasaEjecucion: number;
    };
    insights: string[];
  };
  postulaciones: {
    porEstado: { [key: string]: number };
    porTipoBeca: { [key: string]: number };
    tendencias: any[];
  };
  becarios: {
    activos: number;
    porCarrera: { [key: string]: number };
    rendimientoAcademico: {
      promedioGeneral: number;
      distribucion: { [key: string]: number };
    };
  };
  ayudantias: {
    total: number;
    porDepartamento: { [key: string]: number };
    cumplimiento: {
      reportesAlDia: number;
      evaluacionesPendientes: number;
    };
  };
  analisisFinanciero: {
    distribucionPresupuesto: { [key: string]: number };
    gastosDetallados: { [key: string]: number };
    proyeccionProximoPeriodo: { [key: string]: number };
  };
  recomendaciones: string[];
}

export interface ReporteOperativo {
  periodo: string;
  cargaTrabajo: {
    supervisores: Array<{
      supervisor: {
        id: string;
        nombre: string;
      };
      departamento: string;
      ayudantesAsignados: number;
      horasSemanales: number;
      reportesPendientes: number;
      nivelCarga: 'baja' | 'media' | 'alta';
    }>;
    promedioCarga: number;
    distribucionCarga: { [key: string]: number };
  };
  estudiantesRiesgo: Array<{
    estudiante: {
      id: string;
      nombre: string;
    };
    factoresRiesgo: string[];
    nivelRiesgo: 'bajo' | 'medio' | 'alto' | 'critico';
    accionesRecomendadas: string[];
  }>;
  reportesPendientes: {
    total: number;
    porDepartamento: { [key: string]: number };
    masAtrasados: any[];
  };
  analisisPlazas: {
    ocupadas: number;
    disponibles: number;
    tasaOcupacion: number;
    necesidadPlazas: number;
  };
  recomendaciones: string[];
}

export interface DashboardCumplimiento {
  periodo: string;
  timestamp: string;
  metricas: {
    cumplimientoReportes: number;
    promedioRendimiento: number;
    tasaRetencion: number;
    cumplimientoHoras: number;
  };
  alertas: {
    criticas: number;
    altas: number;
    medias: number;
    lista: Array<{
      tipo: 'critica' | 'alta' | 'media' | 'baja';
      titulo: string;
      afectados: number;
      accionRequerida: string;
    }>;
  };
  rankings: {
    mejoresDesempenos: Array<{
      becario: {
        id: string;
        nombre: string;
      };
      promedio: number;
      cumplimiento: number;
    }>;
    necesitanApoyo: Array<{
      becario: {
        id: string;
        nombre: string;
      };
      promedio: number;
      factoresRiesgo: string[];
    }>;
  };
  tendencias: {
    ultimosSeisMeses: any[];
    proyeccion: any;
  };
  saludSistema: {
    procesosActivos: number;
    tiempoRespuesta: number;
    disponibilidad: number;
  };
}

export interface AnalisisPredictivo {
  configuracion: {
    periodosHistoricos: number;
    escenarios: string[];
    incluirSimulacion: boolean;
  };
  tendenciasHistoricas: {
    postulaciones: {
      datos: Array<{ periodo: string; valor: number }>;
      tendencia: 'creciente' | 'estable' | 'decreciente';
      tasaCrecimiento: number;
    };
    becarios: {
      datos: Array<{ periodo: string; valor: number }>;
      tendencia: 'creciente' | 'estable' | 'decreciente';
      tasaCrecimiento: number;
    };
    presupuesto: {
      datos: Array<{ periodo: string; valor: number }>;
      tendencia: 'creciente' | 'estable' | 'decreciente';
      tasaCrecimiento: number;
    };
  };
  proyecciones: {
    proximoPeriodo: {
      postulaciones: {
        optimista: number;
        base: number;
        pesimista: number;
        intervaloConfianza: [number, number];
      };
      presupuestoNecesario: {
        optimista: number;
        base: number;
        pesimista: number;
      };
    };
    proximosDosPeriodos: any;
    tendenciaLargoPlazo: any;
  };
  analisisPresupuesto: {
    historialEjecucion: any[];
    eficienciaGasto: number;
    proyeccionNecesidades: any;
    recomendacionesOptimizacion: string[];
  };
  planificacionCapacidad: {
    plazasRequeridas: {
      optimista: number;
      base: number;
      pesimista: number;
    };
    supervisoresNecesarios: {
      optimista: number;
      base: number;
      pesimista: number;
    };
    departamentosCriticos: string[];
  };
  simulacionMonteCarlo?: {
    iteraciones: number;
    resultados: {
      postulaciones: {
        promedio: number;
        desviacionEstandar: number;
        percentil5: number;
        percentil95: number;
      };
    };
    probabilidades: {
      superarCapacidad: number;
      necesitarMasPresupuesto: number;
    };
  };
  recomendacionesEstrategicas: Array<{
    categoria: string;
    prioridad: 'alta' | 'media' | 'baja';
    recomendacion: string;
    impactoEsperado: string;
    accionesConcretas: string[];
  }>;
  factoresRiesgo: Array<{
    factor: string;
    probabilidad: number;
    impacto: 'alto' | 'medio' | 'bajo';
    mitigacion: string;
  }>;
}

/**
 * Funciones para obtener reportes ejecutivos
 */

async function fetchConAuth<T>(endpoint: string, accessToken: string, params?: Record<string, any>): Promise<T> {
  const url = new URL(`${API_BASE}${endpoint}`);

  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        if (Array.isArray(params[key])) {
          params[key].forEach((val: any) => url.searchParams.append(`${key}[]`, val));
        } else {
          url.searchParams.append(key, params[key].toString());
        }
      }
    });
  }

  const response = await fetch(url.toString(), {
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

/**
 * 1. Informe Ejecutivo de Período Académico
 */
export async function getInformeEjecutivo(
  accessToken: string,
  params?: {
    periodo?: string;
    incluirGraficos?: boolean;
    incluirProyecciones?: boolean;
  }
): Promise<InformeEjecutivo> {
  return fetchConAuth('/v1/reportes-ejecutivos/informe-ejecutivo', accessToken, {
    ...params,
    formato: 'json'
  });
}

/**
 * 2. Reporte Operativo de Supervisión
 */
export async function getReporteOperativo(
  accessToken: string,
  params?: {
    periodo?: string;
    supervisorId?: string;
    departamento?: string;
  }
): Promise<ReporteOperativo> {
  return fetchConAuth('/v1/reportes-ejecutivos/operativo-supervision', accessToken, {
    ...params,
    formato: 'json'
  });
}

/**
 * 3. Dashboard de Cumplimiento y Rendimiento
 */
export async function getDashboardCumplimiento(
  accessToken: string,
  params?: {
    periodo?: string;
    tipoBeca?: string;
    departamento?: string;
    nivelRiesgo?: 'critico' | 'alto' | 'medio' | 'bajo';
  }
): Promise<DashboardCumplimiento> {
  return fetchConAuth('/v1/reportes-ejecutivos/dashboard-cumplimiento', accessToken, {
    ...params,
    formato: 'json'
  });
}

/**
 * 4. Análisis Predictivo y Planificación Estratégica
 */
export async function getAnalisisPredictivo(
  accessToken: string,
  params?: {
    periodosHistoricos?: number;
    incluirSimulacion?: boolean;
    escenarios?: string[];
  }
): Promise<AnalisisPredictivo> {
  return fetchConAuth('/v1/reportes-ejecutivos/analisis-predictivo', accessToken, {
    ...params,
    formato: 'json'
  });
}

/**
 * Funciones para descargar reportes en PDF/Excel
 */

export async function descargarReporteEjecutivo(
  endpoint: string,
  accessToken: string,
  nombreArchivo: string,
  params?: Record<string, any>
): Promise<void> {
  try {
    const url = new URL(`${API_BASE}${endpoint}`);

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          if (Array.isArray(params[key])) {
            params[key].forEach((val: any) => url.searchParams.append(`${key}[]`, val));
          } else {
            url.searchParams.append(key, params[key].toString());
          }
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Error al descargar: ${response.status}`);
    }

    const blob = await response.blob();
    const urlBlob = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(urlBlob);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error descargando reporte:', error);
    throw error;
  }
}

/**
 * Helper para descargar Informe Ejecutivo
 */
export async function descargarInformeEjecutivo(
  accessToken: string,
  formato: 'pdf' | 'excel',
  params?: {
    periodo?: string;
    incluirGraficos?: boolean;
    incluirProyecciones?: boolean;
  }
): Promise<void> {
  const periodo = params?.periodo || new Date().toISOString().split('T')[0];
  const extension = formato === 'excel' ? 'xlsx' : 'pdf';
  const nombreArchivo = `informe-ejecutivo-${periodo}.${extension}`;

  return descargarReporteEjecutivo(
    '/v1/reportes-ejecutivos/informe-ejecutivo',
    accessToken,
    nombreArchivo,
    { ...params, formato }
  );
}

/**
 * Helper para descargar Reporte Operativo
 */
export async function descargarReporteOperativo(
  accessToken: string,
  formato: 'pdf' | 'excel',
  params?: {
    periodo?: string;
    supervisorId?: string;
    departamento?: string;
  }
): Promise<void> {
  const periodo = params?.periodo || new Date().toISOString().split('T')[0];
  const extension = formato === 'excel' ? 'xlsx' : 'pdf';
  const nombreArchivo = `reporte-operativo-${periodo}.${extension}`;

  return descargarReporteEjecutivo(
    '/v1/reportes-ejecutivos/operativo-supervision',
    accessToken,
    nombreArchivo,
    { ...params, formato }
  );
}

/**
 * Helper para descargar Dashboard Cumplimiento
 */
export async function descargarDashboardCumplimiento(
  accessToken: string,
  formato: 'pdf' | 'excel',
  params?: {
    periodo?: string;
    tipoBeca?: string;
    departamento?: string;
    nivelRiesgo?: 'critico' | 'alto' | 'medio' | 'bajo';
  }
): Promise<void> {
  const periodo = params?.periodo || new Date().toISOString().split('T')[0];
  const extension = formato === 'excel' ? 'xlsx' : 'pdf';
  const nombreArchivo = `dashboard-cumplimiento-${periodo}.${extension}`;

  return descargarReporteEjecutivo(
    '/v1/reportes-ejecutivos/dashboard-cumplimiento',
    accessToken,
    nombreArchivo,
    { ...params, formato }
  );
}

/**
 * Helper para descargar Análisis Predictivo
 */
export async function descargarAnalisisPredictivo(
  accessToken: string,
  formato: 'pdf' | 'excel',
  params?: {
    periodosHistoricos?: number;
    incluirSimulacion?: boolean;
    escenarios?: string[];
  }
): Promise<void> {
  const fecha = new Date().toISOString().split('T')[0];
  const extension = formato === 'excel' ? 'xlsx' : 'pdf';
  const nombreArchivo = `analisis-predictivo-${fecha}.${extension}`;

  return descargarReporteEjecutivo(
    '/v1/reportes-ejecutivos/analisis-predictivo',
    accessToken,
    nombreArchivo,
    { ...params, formato }
  );
}
