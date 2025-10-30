import { API_BASE } from './config';

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LoginSuccessResponse {
  success: true;
  message: string;
  timestamp: string;
  data: {
    user: {
      id: string;
      email: string;
      nombre: string;
      apellido?: string;
      role: string;
      activo: boolean;
      emailVerified?: boolean;
      firstLogin?: boolean;
      cedula?: string;
      telefono?: string;
      carrera?: string;
      trimestre?: number;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: string;
    };
  };
}

export async function loginUser(body: LoginRequestBody): Promise<LoginSuccessResponse> {
  const response = await fetch(`${API_BASE}/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    let message = payload?.message || `Error de autenticación (${response.status})`;
    if (response.status === 400) {
      message = payload?.message || 'Solicitud inválida';
    } else if (response.status === 401) {
      message = payload?.message || 'Email o contraseña incorrectos';
    } else if (response.status === 403) {
      // Diferenciar entre cuenta pendiente de aprobación y usuario inactivo
      const apiMessage = payload?.message || '';
      if (apiMessage.toLowerCase().includes('pendiente de aprobación') ||
          apiMessage.toLowerCase().includes('pendiente')) {
        message = 'Tu cuenta está pendiente de aprobación por un administrador. Recibirás un correo cuando sea aprobada.';
      } else if (apiMessage.toLowerCase().includes('inactivo') ||
                 apiMessage.toLowerCase().includes('deshabilitada')) {
        message = 'Tu cuenta ha sido deshabilitada. Contacta al administrador.';
      } else {
        message = payload?.message || 'No tienes permisos para iniciar sesión';
      }
    }
    throw new Error(message);
  }

  return payload as LoginSuccessResponse;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: true;
  message: string;
  timestamp: string;
}

export async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
  const response = await fetch(`${API_BASE}/v1/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error solicitando recuperación (${response.status})`;
    throw new Error(message);
  }

  return payload as ForgotPasswordResponse;
}

export interface ResetPasswordRequest {
  token: string;
  nuevaPassword: string;
}

export interface ResetPasswordResponse {
  success: true;
  message: string;
  timestamp: string;
}

export async function resetPassword(token: string, nuevaPassword: string): Promise<ResetPasswordResponse> {
  const response = await fetch(`${API_BASE}/v1/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, nuevaPassword }),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = payload?.message || `Error restableciendo contraseña (${response.status})`;
    throw new Error(message);
  }

  return payload as ResetPasswordResponse;
}

export interface RegisterUserRequest {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  role: string;
  carrera?: string;
  trimestre?: number;
  departamento?: string;
  cargo?: string;
}

export interface RegisterUserResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: {
    user: {
      id: string;
      email: string;
      nombre: string;
      apellido: string;
      role: string;
      emailVerified: boolean;
      activo: boolean;
    };
  };
}

export async function registerUser(body: RegisterUserRequest): Promise<RegisterUserResponse> {
  const response = await fetch(`${API_BASE}/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    let message = payload?.message || `Error en el registro (${response.status})`;
    
    if (response.status === 409) {
      message = payload?.message || 'Este email o cédula ya está registrado';
    } else if (response.status === 400) {
      // Para errores de validación, incluir los detalles completos
      if (payload?.details?.validationErrors) {
        const errorWithDetails = {
          message: payload.message || 'Datos de registro inválidos',
          details: payload.details
        };
        throw new Error(JSON.stringify(errorWithDetails));
      }
      message = payload?.message || 'Datos de registro inválidos';
    }
    
    throw new Error(message);
  }

  return payload as RegisterUserResponse;
}

export interface ApproveUserResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
    role: string;
    emailVerified: boolean;
    activo: boolean;
  };
  timestamp: string;
}

export async function approveUser(userId: string, accessToken: string): Promise<ApproveUserResponse> {
  const response = await fetch(`${API_BASE}/v1/auth/approve/${userId}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    let message = payload?.message || `Error aprobando usuario (${response.status})`;
    if (response.status === 400) {
      message = payload?.message || 'Este usuario ya ha sido aprobado';
    } else if (response.status === 403) {
      message = 'No tienes permisos para realizar esta acción';
    } else if (response.status === 404) {
      message = 'Usuario no encontrado';
    }
    throw new Error(message);
  }

  return payload as ApproveUserResponse;
}

export interface ChangePasswordRequest {
  passwordActual: string;
  nuevaPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data: {
    message: string;
  };
}

export async function changePassword(body: ChangePasswordRequest, accessToken: string): Promise<ChangePasswordResponse> {
  const response = await fetch(`${API_BASE}/v1/auth/change-password`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    let message = payload?.message || `Error al cambiar contraseña (${response.status})`;
    if (response.status === 400) {
      message = payload?.message || 'Datos inválidos';
    } else if (response.status === 401) {
      message = payload?.message || 'Contraseña actual incorrecta';
    } else if (response.status === 403) {
      message = payload?.message || 'No autorizado';
    }
    throw new Error(message);
  }

  return payload as ChangePasswordResponse;
}


