import { API_BASE } from './config';

/**
 * Interfaz para documentos
 */
export interface Documento {
  id: string;
  tipoDocumento: string;
  nombreOriginal: string;
  tamano: string;
  fechaSubida: string;
  url: string;
  postulacionId?: string;
  usuarioId?: string;
}

/**
 * Obtiene los documentos asociados a una postulación
 * Usa el endpoint público que consulta directamente la tabla de documentos
 *
 * @param postulacionId - ID de la postulación
 * @returns Promise con los documentos asociados
 */
export async function getDocumentosByPostulacion(postulacionId: string): Promise<Documento[]> {
  try {
    const response = await fetch(`${API_BASE}/v1/documents/public/postulacion/${postulacionId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || `Error al obtener documentos (${response.status})`);
    }

    const data = await response.json();
    return data.data?.documentos || [];
  } catch (error) {
    console.error('Error obteniendo documentos de postulación:', error);
    throw error;
  }
}

/**
 * Sube un documento asociado a una postulación
 *
 * @param file - Archivo a subir
 * @param tipoDocumento - Tipo de documento (cedula, historico_notas, etc.)
 * @param postulacionId - ID de la postulación a asociar
 * @returns Promise con los datos del documento subido
 */
export async function uploadDocumento(
  file: File,
  tipoDocumento: string,
  postulacionId: string
): Promise<Documento> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tipoDocumento', tipoDocumento);
    formData.append('postulacionId', postulacionId);

    const response = await fetch(`${API_BASE}/v1/documents/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || `Error al subir documento (${response.status})`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error subiendo documento:', error);
    throw error;
  }
}
