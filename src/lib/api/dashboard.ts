import { API_BASE } from './config';

// ==================== TIPOS E INTERFACES ====================

export interface KPIsBecas {
  totalBecarios: number;
  porTipoBeca: {
    Excelencia: number;
    Ayudantía: number;
    Impacto: number;
    "Exoneración de Pago": number;
    "Formación Docente": number;
  };
  sinPlaza: number;
  plazasActivas: number;
  plazasInactivas: number;
  plazasConCapacidad: number;
  postulacionesPendientes: number;
  reportesPendientes: number;
}

export interface KPIsOrientacionVocacional {
  testsCompletados: number;
  usuariosConTests: number;
  testsEnProgreso: number;
  testsAbandonados: number;
  tasaCompletitud: number;
  perfilesDominantes: Record<string, number>;
  testsPorTipo: {
    Holland_RIASEC: number;
    ICO: number;
    Kuder: number;
  };
}

export interface KPIsUsuarios {
  totalUsuarios: number;
  totalSupervisores: number;
  totalAspirantes: number;
  totalEstudiantes: number;
  estudiantesConBeca: number;
  aspirantesPendientes: number;
  aspirantesConvertidos: number;
  postulacionesAprobadas: number;
  tasaAprobacion: number;
}

export interface DashboardKPIsGeneralData {
  becas: KPIsBecas;
  orientacionVocacional: KPIsOrientacionVocacional;
  usuarios: KPIsUsuarios;
  metadata: {
    periodoAcademico: string;
    fechaGeneracion: string;
  };
}

export interface DashboardKPIsGeneralResponse {
  success: boolean;
  message: string;
  data: DashboardKPIsGeneralData;
}

// ==================== FUNCIONES API ====================

/**
 * Obtener KPIs generales del dashboard (becas + orientación vocacional + usuarios)
 */
export async function obtenerKPIsGeneral(
  accessToken: string,
  periodo?: string
): Promise<DashboardKPIsGeneralResponse> {
  const url = periodo
    ? `${API_BASE}/v1/dashboard/kpis-general?periodo=${periodo}`
    : `${API_BASE}/v1/dashboard/kpis-general`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    }
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message = payload?.message || `Error al cargar KPIs generales (${response.status})`;
    throw new Error(message);
  }

  return await response.json();
}
