import { API_BASE } from './config';

export interface PostulacionPublicData {
  id: string;
  estado: string;
  fechaPostulacion: string;
  tipoBeca: string;
  nombre: string;
  carrera: string;
  trimestre: string;
}

export interface VerificarPostulacionesResponse {
  success: boolean;
  message: string;
  data: PostulacionPublicData[];
}

/**
 * Verificar postulaciones por email (endpoint público, sin autenticación)
 */
export async function verificarPostulacionesPorEmail(email: string): Promise<VerificarPostulacionesResponse> {
  const url = `${API_BASE}/v1/postulaciones/verificar?email=${encodeURIComponent(email)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  // Si el backend devuelve success: false o 404, verificar si es "no encontrado"
  if (!response.ok || payload?.success === false) {
    // Si es un error 404 o el mensaje indica que no hay postulaciones, devolver array vacío
    if (
      response.status === 404 ||
      payload?.message?.toLowerCase().includes('no se encontraron postulaciones') ||
      payload?.message?.toLowerCase().includes('no se encontraron') ||
      payload?.message?.toLowerCase().includes('no hay postulaciones')
    ) {
      return {
        success: true,
        message: 'No se encontraron postulaciones',
        data: []
      };
    }
    // Si es otro tipo de error, lanzarlo
    const message = payload?.message || `Error verificando postulaciones (${response.status})`;
    throw new Error(message);
  }

  return payload as VerificarPostulacionesResponse;
}
