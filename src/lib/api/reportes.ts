import { API_BASE } from './config';

/**
 * Funciones para Reportes de Exportación
 * Endpoints: /v1/reportes/exportar/*
 */

/**
 * Helper para construir URL con parámetros
 */
function buildUrlWithParams(endpoint: string, params?: Record<string, any>): string {
  const url = new URL(`${API_BASE}${endpoint}`);

  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        url.searchParams.append(key, params[key].toString());
      }
    });
  }

  return url.toString();
}

/**
 * Helper para realizar fetch con autenticación
 */
async function fetchConAuth<T>(endpoint: string, accessToken: string, params?: Record<string, any>): Promise<T> {
  const url = buildUrlWithParams(endpoint, params);

  const response = await fetch(url, {
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
 * Helper para descargar archivos (Excel/PDF)
 */
async function descargarArchivo(
  endpoint: string,
  accessToken: string,
  nombreArchivo: string,
  params?: Record<string, any>
): Promise<void> {
  try {
    const url = buildUrlWithParams(endpoint, params);

    const response = await fetch(url, {
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
    console.error('Error descargando archivo:', error);
    throw error;
  }
}

/**
 * 1. Exportar lista completa de becarios
 * GET /v1/reportes/exportar/becarios
 */
export async function exportarBecarios(
  accessToken: string,
  params?: {
    formato?: 'json' | 'excel' | 'pdf';
    estado?: string;
    tipoBeca?: string;
    periodoInicio?: string;
  }
): Promise<any> {
  const formato = params?.formato || 'json';

  if (formato === 'json') {
    return fetchConAuth('/v1/reportes/exportar/becarios', accessToken, params);
  } else {
    const extension = formato === 'excel' ? 'xlsx' : 'pdf';
    const nombreArchivo = `becarios-${new Date().toISOString().split('T')[0]}.${extension}`;
    return descargarArchivo(
      '/v1/reportes/exportar/becarios',
      accessToken,
      nombreArchivo,
      params
    );
  }
}

/**
 * 2. Exportar información de plazas
 * GET /v1/reportes/exportar/plazas
 */
export async function exportarPlazas(
  accessToken: string,
  params?: {
    formato?: 'json' | 'excel' | 'pdf';
    estado?: string;
    tipoAyudantia?: string;
  }
): Promise<any> {
  const formato = params?.formato || 'json';

  if (formato === 'json') {
    return fetchConAuth('/v1/reportes/exportar/plazas', accessToken, params);
  } else {
    const extension = formato === 'excel' ? 'xlsx' : 'pdf';
    const nombreArchivo = `plazas-${new Date().toISOString().split('T')[0]}.${extension}`;
    return descargarArchivo(
      '/v1/reportes/exportar/plazas',
      accessToken,
      nombreArchivo,
      params
    );
  }
}

/**
 * 3. Exportar información de supervisores
 * GET /v1/reportes/exportar/supervisores
 */
export async function exportarSupervisores(
  accessToken: string,
  params?: {
    formato?: 'json' | 'excel' | 'pdf';
    departamento?: string;
    activo?: boolean;
  }
): Promise<any> {
  const formato = params?.formato || 'json';

  if (formato === 'json') {
    return fetchConAuth('/v1/reportes/exportar/supervisores', accessToken, params);
  } else {
    const extension = formato === 'excel' ? 'xlsx' : 'pdf';
    const nombreArchivo = `supervisores-${new Date().toISOString().split('T')[0]}.${extension}`;
    return descargarArchivo(
      '/v1/reportes/exportar/supervisores',
      accessToken,
      nombreArchivo,
      params
    );
  }
}

/**
 * 4. Exportar estadísticas de reportes de actividades
 * GET /v1/reportes/exportar/actividades
 */
export async function exportarActividades(
  accessToken: string,
  params?: {
    formato?: 'json' | 'excel' | 'pdf';
    periodo?: string;
    tipoBeca?: string;
    supervisorId?: string;
  }
): Promise<any> {
  const formato = params?.formato || 'json';

  if (formato === 'json') {
    return fetchConAuth('/v1/reportes/exportar/actividades', accessToken, params);
  } else {
    const extension = formato === 'excel' ? 'xlsx' : 'pdf';
    const nombreArchivo = `actividades-${params?.periodo || new Date().toISOString().split('T')[0]}.${extension}`;
    return descargarArchivo(
      '/v1/reportes/exportar/actividades',
      accessToken,
      nombreArchivo,
      params
    );
  }
}

/**
 * 5. Exportar distribución por tipo de beca
 * GET /v1/reportes/exportar/distribucion-becas
 */
export async function exportarDistribucionBecas(
  accessToken: string,
  params?: {
    formato?: 'json' | 'excel' | 'pdf';
    periodo?: string;
  }
): Promise<any> {
  const formato = params?.formato || 'json';

  if (formato === 'json') {
    return fetchConAuth('/v1/reportes/exportar/distribucion-becas', accessToken, params);
  } else {
    const extension = formato === 'excel' ? 'xlsx' : 'pdf';
    const nombreArchivo = `distribucion-becas-${params?.periodo || new Date().toISOString().split('T')[0]}.${extension}`;
    return descargarArchivo(
      '/v1/reportes/exportar/distribucion-becas',
      accessToken,
      nombreArchivo,
      params
    );
  }
}

/**
 * 6. Exportar distribución por tipo de postulante
 * GET /v1/reportes/exportar/distribucion-postulantes
 */
export async function exportarDistribucionPostulantes(
  accessToken: string,
  params?: {
    formato?: 'json' | 'excel' | 'pdf';
    periodo?: string;
    tipoBeca?: string;
  }
): Promise<any> {
  const formato = params?.formato || 'json';

  if (formato === 'json') {
    return fetchConAuth('/v1/reportes/exportar/distribucion-postulantes', accessToken, params);
  } else {
    const extension = formato === 'excel' ? 'xlsx' : 'pdf';
    const nombreArchivo = `distribucion-postulantes-${params?.periodo || new Date().toISOString().split('T')[0]}.${extension}`;
    return descargarArchivo(
      '/v1/reportes/exportar/distribucion-postulantes',
      accessToken,
      nombreArchivo,
      params
    );
  }
}

/**
 * 7. Exportar dashboard completo
 * GET /v1/reportes/exportar/dashboard
 */
export async function exportarDashboard(
  accessToken: string,
  params?: {
    formato?: 'json' | 'excel' | 'pdf';
    periodo?: string;
  }
): Promise<any> {
  const formato = params?.formato || 'json';

  if (formato === 'json') {
    return fetchConAuth('/v1/reportes/exportar/dashboard', accessToken, params);
  } else {
    const extension = formato === 'excel' ? 'xlsx' : 'pdf';
    const nombreArchivo = `dashboard-completo-${params?.periodo || new Date().toISOString().split('T')[0]}.${extension}`;
    return descargarArchivo(
      '/v1/reportes/exportar/dashboard',
      accessToken,
      nombreArchivo,
      params
    );
  }
}
