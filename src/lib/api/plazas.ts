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
