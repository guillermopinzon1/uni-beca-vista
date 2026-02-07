import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireEmailVerification?: boolean;
}

/**
 * ProtectedRoute - Protege rutas que requieren autenticación
 *
 * @param children - Componente a renderizar si el usuario está autenticado
 * @param allowedRoles - Array de roles permitidos (opcional)
 * @param requireEmailVerification - Si se require email verificado (opcional)
 */
export const ProtectedRoute = ({
  children,
  allowedRoles,
  requireEmailVerification = false
}: ProtectedRouteProps) => {
  const { isLoggedIn, isLoading, user } = useAuth();
  const location = useLocation();

  // Mostrar loader mientras el AuthContext está inicializándose
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isLoggedIn || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar email si es requerido
  if (requireEmailVerification && !user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // Verificar rol si se especificó
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      // Redirigir al dashboard apropiado según el rol del usuario
      const roleRedirects: Record<string, string> = {
        'estudiante': '/modules',
        'supervisor': '/ayudantias-dashboard',
        'supervisor-laboral': '/supervisor-laboral-dashboard',
        'mentor': '/mentor-dashboard',
        'admin': '/admin-dashboard',
        'director-area': '/director-area-dashboard',
        'capital-humano': '/capital-humano-dashboard',
        'aspirante': '/dashboard-aspirante',
        'especialista': '/dashboard-especialista',
      };

      const redirectPath = roleRedirects[user.role] || '/';
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <>{children}</>;
};

/**
 * PublicRoute - Para rutas que solo deben ser accesibles cuando NO estás autenticado
 * Ej: Login, Register
 */
export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isLoading, user } = useAuth();

  // Esperar a que termine de cargar
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  // Si está autenticado, redirigir al dashboard apropiado
  if (isLoggedIn && user) {
    const roleRedirects: Record<string, string> = {
      'estudiante': '/modules',
      'supervisor': '/ayudantias-dashboard',
      'supervisor-laboral': '/supervisor-laboral-dashboard',
      'mentor': '/mentor-dashboard',
      'admin': '/admin-dashboard',
      'director-area': '/director-area-dashboard',
      'capital-humano': '/capital-humano-dashboard',
      'aspirante': '/dashboard-aspirante',
      'especialista': '/dashboard-especialista',
    };

    const redirectPath = roleRedirects[user.role] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
