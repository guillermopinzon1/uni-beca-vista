import { API_BASE } from './config';

// ==================== TIPOS ====================

export type TipoTestPregunta = 'Kuder' | 'Holland_RIASEC' | 'Personalizado' | 'ICO';
export type DimensionRIASEC = 'Realista' | 'Investigador' | 'Artístico' | 'Social' | 'Emprendedor' | 'Convencional';
export type TipoPregunta = 'directa' | 'comparativa' | 'situacional' | 'proyectiva';
export type PesoPregunta = 'alta' | 'media' | 'baja';

export interface PreguntaItem {
  id: string;
  codigo_pregunta: string;
  tipo_test: TipoTestPregunta;
  dimension_principal: DimensionRIASEC;
  dimension_secundaria: string[];
  texto__pregunta: string;
  tipo_pregunta: TipoPregunta;
  peso_pregunta: PesoPregunta;
  instrucciones_pregunta: string | null;
  instrucciones_respuesta: string[];
  carreras_relacionadas: string[];
  correlaciones_academicas: Record<string, unknown>;
  activa: boolean;
  veces_usada: number;
  veces_efectiva: number;
  efectividad_historica: number;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface ListarPreguntasParams {
  tipo_test?: TipoTestPregunta;
  dimension_principal?: DimensionRIASEC;
  activa?: boolean;
  page?: number;
  limit?: number;
}

export interface ListarPreguntasResponse {
  success: boolean;
  message: string;
  data: {
    items: PreguntaItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface CrearPreguntaBody {
  codigo_pregunta: string;
  tipo_test: TipoTestPregunta;
  dimension_principal: DimensionRIASEC;
  texto__pregunta: string;
  tipo_pregunta?: TipoPregunta;
  peso_pregunta?: PesoPregunta;
  dimension_secundaria?: string[];
  instrucciones_pregunta?: string;
  instrucciones_respuesta?: string[];
  carreras_relacionadas?: string[];
  correlaciones_academicas?: Record<string, unknown>;
  activa?: boolean;
}

export interface ActualizarPreguntaBody extends Partial<CrearPreguntaBody> {}

// ==================== FUNCIONES ====================

function getAuthHeaders(accessToken: string): HeadersInit {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  };
}

export async function listarPreguntas(
  accessToken: string,
  params?: ListarPreguntasParams
): Promise<ListarPreguntasResponse> {
  const searchParams = new URLSearchParams();
  if (params?.tipo_test) searchParams.set('tipo_test', params.tipo_test);
  if (params?.dimension_principal) searchParams.set('dimension_principal', params.dimension_principal);
  if (params?.activa !== undefined) searchParams.set('activa', String(params.activa));
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.limit) searchParams.set('limit', String(params.limit));

  const url = `${API_BASE}/v1/orientacion/preguntas${searchParams.toString() ? `?${searchParams}` : ''}`;
  const res = await fetch(url, { method: 'GET', headers: getAuthHeaders(accessToken) });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data?.message as string) || `Error ${res.status} al listar preguntas`);
  }
  return data as ListarPreguntasResponse;
}

export async function obtenerPregunta(
  accessToken: string,
  id: string
): Promise<{ success: boolean; data: PreguntaItem }> {
  const res = await fetch(`${API_BASE}/v1/orientacion/preguntas/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(accessToken),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((payload?.message as string) || `Error ${res.status} al obtener pregunta`);
  }
  return payload as { success: boolean; data: PreguntaItem };
}

export async function crearPregunta(
  accessToken: string,
  body: CrearPreguntaBody
): Promise<{ success: boolean; message: string; data: PreguntaItem }> {
  const res = await fetch(`${API_BASE}/v1/orientacion/preguntas`, {
    method: 'POST',
    headers: getAuthHeaders(accessToken),
    body: JSON.stringify(body),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 409) {
      throw new Error(
        (payload?.message as string) ||
          `Ya existe una pregunta con el código "${body.codigo_pregunta}" para el tipo de test ${body.tipo_test}.`
      );
    }
    const msg =
      payload?.message ||
      payload?.details?.validationErrors?.map((e: { message?: string }) => e.message).filter(Boolean).join('. ') ||
      `Error ${res.status}`;
    throw new Error(msg as string);
  }
  return payload as { success: boolean; message: string; data: PreguntaItem };
}

/** Verifica si ya existe una pregunta con el mismo código para el tipo de test (para validación en front). */
export async function existeCodigoPregunta(
  accessToken: string,
  tipoTest: TipoTestPregunta,
  codigoPregunta: string,
  excluirId?: string
): Promise<boolean> {
  const codigo = codigoPregunta.trim();
  if (!codigo) return false;
  const res = await listarPreguntas(accessToken, {
    tipo_test: tipoTest,
    limit: 500,
    page: 1,
  });
  return res.data.items.some(
    (p) => p.codigo_pregunta === codigo && (!excluirId || p.id !== excluirId)
  );
}

export async function actualizarPregunta(
  accessToken: string,
  id: string,
  body: ActualizarPreguntaBody
): Promise<{ success: boolean; data: PreguntaItem }> {
  const res = await fetch(`${API_BASE}/v1/orientacion/preguntas/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(accessToken),
    body: JSON.stringify(body),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((payload?.message as string) || `Error ${res.status} al actualizar pregunta`);
  }
  return payload as { success: boolean; data: PreguntaItem };
}

export async function desactivarPregunta(
  accessToken: string,
  id: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/v1/orientacion/preguntas/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(accessToken),
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((payload?.message as string) || `Error ${res.status} al desactivar pregunta`);
  }
  return payload as { success: boolean; message: string };
}
