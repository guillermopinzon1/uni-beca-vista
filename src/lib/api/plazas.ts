import { API_BASE } from './config';

export interface PlazaResponse {
  success: true;
  message: string;
  data: {
    plazas: Array<{
      id: string;
      materia: string;
      codigo: string;
      departamento: string;
      ubicacion: string;
      profesor: string;
      capacidad: number;
      ocupadas: number;
      horario: Array<{
        dia: string;
        horaInicio: string;
        horaFin: string;
      }>;
      estado: string;
      tipoAyudantia: string;
      descripcionActividades: string;
      requisitosEspeciales: string[];
      horasSemana: number;
      periodoAcademico: string;
      fechaInicio: string;
      fechaFin: string;
      supervisorResponsable: string;
      supervisor: {
        id: string;
        nombre: string;
        apellido: string;
        email: string;
        departamento: string;
      };
      observaciones: string;
      disponibilidad: string;
      plazasDisponibles: number;
      porcentajeOcupacion: number;
      estudiantesAsignados: Array<{
        id: string;
        usuarioId: string;
        estado: string;
        horasRequeridas: number;
        horasCompletadas: number;
        periodoInicio: string;
        fechaAsignacion: string;
        usuario: {
          nombre: string;
          apellido: string;
          email: string;
          carrera: string;
          trimestre: number;
        };
      }>;
      createdAt: string;
      updatedAt: string;
    }>;
    total: number;
    limit: number;
    offset: number;
    totalPages: number;
  };
}

export interface FetchPlazasParams {
  departamento?: string;
  estado?: string;
  tipoAyudantia?: string;
  periodoAcademico?: string;
  disponibles?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function fetchPlazas(accessToken: string, params?: FetchPlazasParams): Promise<PlazaResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.departamento) searchParams.append('departamento', params.departamento);
  if (params?.estado) searchParams.append('estado', params.estado);
  if (params?.tipoAyudantia) searchParams.append('tipoAyudantia', params.tipoAyudantia);
  if (params?.periodoAcademico) searchParams.append('periodoAcademico', params.periodoAcademico);
  if (params?.disponibles !== undefined) searchParams.append('disponibles', params.disponibles.toString());
  if (params?.search) searchParams.append('search', params.search);
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.offset) searchParams.append('offset', params.offset.toString());

  const url = `${API_BASE}/v1/plazas${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
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
    const message = payload?.message || `Error obteniendo plazas (${response.status})`;
    throw new Error(message);
  }

  return payload as PlazaResponse;
}

export interface CreatePlazaRequest {
  materia: string;
  codigo: string;
  departamento: string;
  ubicacion: string;
  profesor: string;
  capacidad: number;
  ocupadas: number;
  horario: Array<{
    dia: string;
    horaInicio: string;
    horaFin: string;
  }>;
  estado: string;
  tipoAyudantia: string;
  descripcionActividades: string;
  requisitosEspeciales: string[];
  horasSemana: number;
  periodoAcademico: string;
  fechaInicio: string;
  fechaFin: string;
  supervisorResponsable: string;
  observaciones: string;
}

export interface CreatePlazaResponse {
  success: true;
  message: string;
  data: {
    id: string;
    materia: string;
    codigo: string;
    departamento: string;
    ubicacion: string;
    profesor: string;
    capacidad: number;
    ocupadas: number;
    horario: Array<{
      dia: string;
      horaInicio: string;
      horaFin: string;
    }>;
    estado: string;
    tipoAyudantia: string;
    descripcionActividades: string;
    requisitosEspeciales: string[];
    horasSemana: number;
    periodoAcademico: string;
    fechaInicio: string;
    fechaFin: string;
    supervisorResponsable: string;
    observaciones: string;
    createdAt: string;
    updatedAt: string;
  };
}

export async function createPlaza(accessToken: string, plazaData: CreatePlazaRequest): Promise<CreatePlazaResponse> {
  const response = await fetch(`${API_BASE}/v1/plazas`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(plazaData),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    // Adjuntar detalles de validación si existen
    if (payload?.errors && Array.isArray(payload.errors)) {
      const errorWithDetails = {
        message: payload?.message || `Error creando plaza (${response.status})`,
        errors: payload.errors,
      };
      throw new Error(JSON.stringify(errorWithDetails));
    }
    const message = payload?.message || `Error creando plaza (${response.status})`;
    throw new Error(message);
  }

  return payload as CreatePlazaResponse;
}

export interface UpdatePlazaRequest {
  materia: string;
  codigo: string;
  departamento: string;
  ubicacion: string;
  profesor: string;
  capacidad: number;
  ocupadas: number;
  horario: Array<{
    dia: string;
    horaInicio: string;
    horaFin: string;
  }>;
  estado: string;
  tipoAyudantia: string;
  descripcionActividades: string;
  requisitosEspeciales: string[];
  horasSemana: number;
  periodoAcademico: string;
  fechaInicio: string;
  fechaFin: string;
  supervisorResponsable: string;
  observaciones: string;
}

export interface UpdatePlazaResponse {
  success: true;
  message: string;
  data: {
    id: string;
    materia: string;
    codigo: string;
    departamento: string;
    ubicacion: string;
    profesor: string;
    capacidad: number;
    ocupadas: number;
    horario: Array<{
      dia: string;
      horaInicio: string;
      horaFin: string;
    }>;
    estado: string;
    tipoAyudantia: string;
    descripcionActividades: string;
    requisitosEspeciales: string[];
    horasSemana: number;
    periodoAcademico: string;
    fechaInicio: string;
    fechaFin: string;
    supervisorResponsable: string;
    observaciones: string;
    updatedAt: string;
  };
}

export async function updatePlaza(accessToken: string, plazaId: string, plazaData: UpdatePlazaRequest): Promise<UpdatePlazaResponse> {
  const response = await fetch(`${API_BASE}/v1/plazas/${plazaId}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(plazaData),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error actualizando plaza (${response.status})`;
    throw new Error(message);
  }

  return payload as UpdatePlazaResponse;
}

export interface BecarioResponse {
  success: true;
  message: string;
  data: {
    becarios: Array<{
      id: string;
      usuarioId: string;
      programaBeca: string;
      estado: string;
      horasRequeridas: number;
      horasCompletadas: number;
      periodoInicio: string;
      usuario: {
        id: string;
        nombre: string;
        apellido: string;
        email: string;
        carrera?: string;
        trimestre?: number;
      };
    }>;
    total: number;
    limit: number;
    offset: number;
    totalPages: number;
  };
}

export interface FetchBecariosParams {
  estado?: string;
  programaBeca?: string;
  search?: string;
  limit?: number;
  offset?: number;
  disponible?: boolean;
  sinSupervisor?: boolean;
  sinPlaza?: boolean;
  tipoBeca?: string;
  periodoInicio?: string;
}

export async function fetchBecarios(accessToken: string, params?: FetchBecariosParams): Promise<BecarioResponse> {
  const searchParams = new URLSearchParams();

  if (params?.estado) searchParams.append('estado', params.estado);
  if (params?.programaBeca) searchParams.append('programaBeca', params.programaBeca);
  if (params?.search) searchParams.append('search', params.search);
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.offset) searchParams.append('offset', params.offset.toString());
  if (params?.disponible !== undefined) searchParams.append('disponible', params.disponible.toString());
  if (params?.sinSupervisor !== undefined) searchParams.append('sinSupervisor', params.sinSupervisor.toString());
  if (params?.sinPlaza !== undefined) searchParams.append('sinPlaza', params.sinPlaza.toString());
  if (params?.tipoBeca) searchParams.append('tipoBeca', params.tipoBeca);
  if (params?.periodoInicio) searchParams.append('periodoInicio', params.periodoInicio);

  const url = `${API_BASE}/v1/becarios${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

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
    const message = payload?.message || `Error obteniendo becarios (${response.status})`;
    throw new Error(message);
  }

  return payload as BecarioResponse;
}

export interface AssignBecarioRequest {
  plazaId: string;
}

export interface AssignBecarioResponse {
  success: true;
  message: string;
  timestamp: string;
  data: {
    id: string;
    usuarioId: string;
    supervisorId: string;
    plazaAsignada: string;
    tipoBeca: string;
    estado: string;
    horasRequeridas: number;
    horasCompletadas: number;
    usuario: {
      id: string;
      nombre: string;
      apellido: string;
      email: string;
      cedula: string;
    };
    supervisor?: {
      id: string;
      nombre: string;
      apellido: string;
      email: string;
    };
    plaza: {
      id: string;
      materia: string;
      codigo: string;
      departamento: string;
      profesor: string;
      tipoAyudantia: string;
      horasSemana: number;
      capacidad: number;
      ocupadas: number;
      estado: string;
    };
  };
}

export async function assignBecarioToPlaza(accessToken: string, becarioId: string, data: AssignBecarioRequest): Promise<AssignBecarioResponse> {
  console.log('[assignBecarioToPlaza] Iniciando asignación:', { becarioId, plazaId: data.plazaId });

  const url = `${API_BASE}/v1/becarios/${becarioId}/asignar-plaza`;
  console.log('[assignBecarioToPlaza] URL:', url);
  console.log('[assignBecarioToPlaza] Body:', JSON.stringify(data));

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos timeout

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('[assignBecarioToPlaza] Response status:', response.status);
    console.log('[assignBecarioToPlaza] Response headers:', Object.fromEntries(response.headers.entries()));

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    let payload = null;
    if (isJson) {
      const text = await response.text();
      console.log('[assignBecarioToPlaza] Response text:', text);
      try {
        payload = JSON.parse(text);
      } catch (e) {
        console.error('[assignBecarioToPlaza] Error parsing JSON:', e);
        throw new Error('Respuesta inválida del servidor');
      }
    }

    if (!response.ok) {
      const message = payload?.message || `Error asignando becario a plaza (${response.status})`;
      console.error('[assignBecarioToPlaza] Error:', message, payload);
      throw new Error(message);
    }

    console.log('[assignBecarioToPlaza] Success:', payload);
    return payload as AssignBecarioResponse;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('[assignBecarioToPlaza] Timeout después de 30 segundos');
      throw new Error('La solicitud tardó demasiado tiempo. Por favor, intenta nuevamente.');
    }
    console.error('[assignBecarioToPlaza] Error en fetch:', error);
    throw error;
  }
}

// Interfaces para asignar supervisor a plaza
export interface AssignSupervisorRequest {
  supervisorResponsable: string;
}

export interface AssignSupervisorResponse {
  success: true;
  message: string;
  timestamp: string;
  data: {
    id: string;
    nombre: string;
    departamento: string;
    ubicacion: string;
    supervisorResponsable: string;
    supervisor?: {
      id: string;
      nombre: string;
      apellido: string;
      email: string;
    };
    estado: string;
    capacidadMaxima: number;
    ayudantesActuales: number;
  };
}

export async function assignSupervisorToPlaza(accessToken: string, plazaId: string, data: AssignSupervisorRequest): Promise<AssignSupervisorResponse> {
  console.log('[assignSupervisorToPlaza] Iniciando asignación:', { plazaId, supervisorId: data.supervisorResponsable });

  const url = `${API_BASE}/v1/plazas/${plazaId}`;
  console.log('[assignSupervisorToPlaza] URL:', url);
  console.log('[assignSupervisorToPlaza] Body:', JSON.stringify(data));

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('[assignSupervisorToPlaza] Response status:', response.status);

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');

    let payload = null;
    if (isJson) {
      const text = await response.text();
      console.log('[assignSupervisorToPlaza] Response text:', text);
      try {
        payload = JSON.parse(text);
      } catch (e) {
        console.error('[assignSupervisorToPlaza] Error parsing JSON:', e);
        throw new Error('Respuesta inválida del servidor');
      }
    }

    if (!response.ok) {
      const message = payload?.message || `Error asignando supervisor a plaza (${response.status})`;
      console.error('[assignSupervisorToPlaza] Error:', message, payload);
      throw new Error(message);
    }

    console.log('[assignSupervisorToPlaza] Success:', payload);
    return payload as AssignSupervisorResponse;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('La asignación tardó demasiado. Intenta nuevamente.');
    }
    console.error('[assignSupervisorToPlaza] Error:', error);
    throw error;
  }
}

export interface UnassignBecarioResponse {
  success: true;
  message: string;
}

export async function unassignBecarioFromPlaza(accessToken: string, plazaId: string, becarioId: string): Promise<UnassignBecarioResponse> {
  const response = await fetch(`${API_BASE}/v1/plazas/${plazaId}/desasignar/${becarioId}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error desasignando becario de plaza (${response.status})`;
    throw new Error(message);
  }

  return payload as UnassignBecarioResponse;
}

export interface PlazaDetailResponse {
  success: true;
  message: string;
  data: {
    id: string;
    materia: string;
    codigo: string;
    departamento: string;
    ubicacion: string;
    profesor: string;
    capacidad: number;
    ocupadas: number;
    horario: Array<{
      dia: string;
      horaInicio: string;
      horaFin: string;
    }>;
    estado: string;
    tipoAyudantia: string;
    descripcionActividades: string;
    requisitosEspeciales: string[];
    horasSemana: number;
    periodoAcademico: string;
    fechaInicio: string;
    fechaFin: string;
    supervisorResponsable: string;
    supervisor: {
      id: string;
      nombre: string;
      apellido: string;
      email: string;
      departamento: string;
    };
    observaciones: string;
    disponibilidad: string;
    plazasDisponibles: number;
    porcentajeOcupacion: number;
    estudiantesAsignados: Array<{
      id: string;
      usuarioId: string;
      estado: string;
      horasRequeridas: number;
      horasCompletadas: number;
      periodoInicio: string;
      fechaAsignacion: string;
      usuario: {
        nombre: string;
        apellido: string;
        email: string;
        carrera: string;
        trimestre: number;
      };
    }>;
    createdAt: string;
    updatedAt: string;
  };
}

export async function fetchPlazaById(accessToken: string, plazaId: string): Promise<PlazaDetailResponse> {
  const response = await fetch(`${API_BASE}/v1/plazas/${plazaId}`, {
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
    const message = payload?.message || `Error obteniendo detalles de plaza (${response.status})`;
    throw new Error(message);
  }

  return payload as PlazaDetailResponse;
}

export interface DisponibilidadResponse {
  success: true;
  message: string;
  data: {
    disponibilidad: Array<{
      id: string;
      usuarioId: string;
      dia: string;
      horaInicio: string;
      horaFin: string;
      createdAt: string;
      updatedAt: string;
    }>;
  };
}

export async function fetchDisponibilidadByUsuario(accessToken: string, usuarioId: string): Promise<DisponibilidadResponse> {
  const response = await fetch(`${API_BASE}/v1/disponibilidad/${usuarioId}`, {
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
    const message = payload?.message || `Error obteniendo disponibilidad (${response.status})`;
    throw new Error(message);
  }

  return payload as DisponibilidadResponse;
}

/**
 * Verifica si un estudiante tiene disponibilidad compatible con el horario de una plaza
 * Esta función obtiene la disponibilidad del estudiante y la compara localmente
 * con los horarios requeridos por la plaza.
 */
export async function verificarCompatibilidadHorario(
  accessToken: string,
  usuarioId: string,
  horariosRequeridos: Array<{ dia: string; horaInicio: string; horaFin: string }>
): Promise<{
  disponible: boolean;
  conflictos: Array<{ dia: string; horarioRequerido: string; motivo: string }>;
}> {
  try {
    // Obtener la disponibilidad del estudiante
    const disponibilidadRes = await fetchDisponibilidadByUsuario(accessToken, usuarioId);
    const disponibilidad = disponibilidadRes.data.disponibilidad;

    if (disponibilidad.length === 0) {
      return {
        disponible: false,
        conflictos: [{
          dia: 'Todos',
          horarioRequerido: 'N/A',
          motivo: 'El estudiante no ha registrado su disponibilidad'
        }]
      };
    }

    // Verificar cada horario requerido
    const conflictos: Array<{ dia: string; horarioRequerido: string; motivo: string }> = [];

    for (const horarioRequerido of horariosRequeridos) {
      // Buscar si el estudiante tiene disponibilidad para este día
      const disponibilidadesDia = disponibilidad.filter(d => d.dia === horarioRequerido.dia);

      if (disponibilidadesDia.length === 0) {
        conflictos.push({
          dia: horarioRequerido.dia,
          horarioRequerido: `${horarioRequerido.horaInicio} - ${horarioRequerido.horaFin}`,
          motivo: `No tiene disponibilidad registrada para ${horarioRequerido.dia}`
        });
        continue;
      }

      // Verificar si alguna de las disponibilidades del día cubre el horario requerido
      const tieneDisponibilidad = disponibilidadesDia.some(d => {
        // Convertir horas a minutos para comparación más fácil
        const toMinutes = (hora: string) => {
          const [h, m] = hora.split(':').map(Number);
          return h * 60 + m;
        };

        const dispInicio = toMinutes(d.horaInicio);
        const dispFin = toMinutes(d.horaFin);
        const reqInicio = toMinutes(horarioRequerido.horaInicio);
        const reqFin = toMinutes(horarioRequerido.horaFin);

        // El horario requerido debe estar completamente dentro de la disponibilidad
        return dispInicio <= reqInicio && dispFin >= reqFin;
      });

      if (!tieneDisponibilidad) {
        conflictos.push({
          dia: horarioRequerido.dia,
          horarioRequerido: `${horarioRequerido.horaInicio} - ${horarioRequerido.horaFin}`,
          motivo: `Disponibilidad registrada no cubre el horario requerido`
        });
      }
    }

    return {
      disponible: conflictos.length === 0,
      conflictos
    };
  } catch (error: any) {
    // Si hay un error 404, significa que el estudiante no tiene disponibilidad registrada
    if (error.message.includes('404')) {
      return {
        disponible: false,
        conflictos: [{
          dia: 'Todos',
          horarioRequerido: 'N/A',
          motivo: 'El estudiante no ha registrado su disponibilidad'
        }]
      };
    }

    // Para otros errores, propagarlos
    throw error;
  }
}
