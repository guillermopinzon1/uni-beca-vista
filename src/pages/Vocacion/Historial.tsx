import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, LogOut, Compass, ChevronLeft, 
  Loader2, Clock, CheckCircle2, XCircle, FileText 
} from "lucide-react";
import { obtenerHistorial, HistorialResponse } from "@/lib/api/orientacionVocacional";
import { format } from "date-fns";

const Historial = () => {
  const navigate = useNavigate();
  const { tokens, logout } = useAuth();
  const { toast } = useToast();
  
  const [historial, setHistorial] = useState<HistorialResponse['data']>([]);
  const [cargando, setCargando] = useState(true);

  const accessToken = tokens?.accessToken || 
    JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    if (!accessToken) {
      toast({
        title: "Sesión expirada",
        description: "Por favor inicia sesión nuevamente",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setCargando(true);

    try {
      const respuesta = await obtenerHistorial(accessToken);
      // Asegurarse de que data sea un array
      const historialData = Array.isArray(respuesta.data) ? respuesta.data : [];
      setHistorial(historialData);
      console.log('📋 Historial cargado:', historialData.length, 'tests');
    } catch (error: any) {
      console.error('Error al cargar historial:', error);
      console.error('Error completo:', JSON.stringify(error, null, 2));
      setHistorial([]); // Asegurar que siempre sea un array
      
      // Mensaje más amigable según el tipo de error
      let mensajeError = error.message || "Error al cargar el historial";
      
      if (error.status === 500) {
        if (mensajeError.includes('usuarioId') || mensajeError.includes('columna')) {
          mensajeError = 'Error en la configuración del servidor. Por favor contacta al administrador del sistema.';
        } else {
          mensajeError = 'Error interno del servidor. Por favor intenta más tarde o contacta al administrador.';
        }
      } else if (error.status === 401) {
        mensajeError = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
        setTimeout(() => navigate("/login"), 2000);
      } else if (error.status === 403) {
        mensajeError = 'No tienes permisos para ver el historial.';
      }
      
      toast({
        title: "Error",
        description: mensajeError,
        variant: "destructive",
      });
    } finally {
      setCargando(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const verResultados = (sesionId: string) => {
    navigate(`/orientacion/resultados/${sesionId}`);
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'finalizada':
      case 'ronda_2_completada':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'ronda_1_completada':
      case 'ronda_2':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'finalizada':
      case 'ronda_2_completada':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'ronda_1_completada':
      case 'ronda_2':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'finalizada':
      case 'ronda_2_completada':
        return 'Completado';
      case 'ronda_1_completada':
        return 'Ronda 1 Completada';
      case 'ronda_2':
        return 'En Ronda 2';
      default:
        return estado;
    }
  };

  const getTipoTestTexto = (tipoTest: string) => {
    return tipoTest === 'Holland_RIASEC' ? 'Holland RIASEC' : 'Kuder';
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/modules")}
              className="flex items-center gap-1 text-orange-500 font-medium hover:underline text-sm"
            >
              <ChevronLeft className="h-4 w-4" /> Volver
            </button>
            <div className="flex flex-col">
              <h1 className="text-[#F37021] text-xl font-bold leading-tight">
                Universidad Metropolitana
              </h1>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-tight">
                Historial de Tests
              </p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm border border-gray-200 rounded-md px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="bg-white border-b border-gray-100 px-6 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center gap-2 text-sm text-gray-600">
          <Compass className="h-4 w-4" />
          <button 
            onClick={() => navigate("/modules")}
            className="hover:text-orange-500 transition-colors"
          >
            Inicio
          </button>
          <span className="text-gray-300">/</span>
          <span className="font-bold text-gray-900">Historial</span>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Historial de Tests</h2>
              <p className="text-gray-600">
                {historial.length === 0 
                  ? "No has realizado ningún test aún" 
                  : `${historial.length} test${historial.length > 1 ? 's' : ''} realizado${historial.length > 1 ? 's' : ''}`
                }
              </p>
            </div>
            <Button
              onClick={() => navigate('/orientacion/seleccionar-test')}
              className="bg-[#F37021] hover:bg-orange-600 text-white"
            >
              Realizar Nuevo Test
            </Button>
          </div>

          {historial.length === 0 ? (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No hay tests realizados
                </h3>
                <p className="text-gray-600 mb-6">
                  Completa tu primer test de orientación vocacional para ver tus resultados aquí.
                </p>
                <Button
                  onClick={() => navigate('/orientacion/seleccionar-test')}
                  className="bg-[#F37021] hover:bg-orange-600 text-white"
                >
                  Realizar Primer Test
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {historial.map((sesion) => (
                <Card
                  key={sesion.id}
                  className={`border-none shadow-sm rounded-xl hover:shadow-md transition-all ${
                    sesion.estado.toLowerCase() === 'finalizada' || sesion.estado.toLowerCase() === 'ronda_2_completada'
                      ? 'cursor-pointer' 
                      : ''
                  }`}
                  onClick={() => {
                    if (sesion.estado.toLowerCase() === 'finalizada' || sesion.estado.toLowerCase() === 'ronda_2_completada') {
                      verResultados(sesion.id);
                    }
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-900">
                            {getTipoTestTexto(sesion.tipoTest)}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getEstadoColor(sesion.estado)}`}>
                            {getEstadoIcon(sesion.estado)}
                            {getEstadoTexto(sesion.estado)}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              Iniciado: {format(new Date(sesion.fechaInicio), "dd/MM/yyyy 'a las' HH:mm")}
                            </span>
                          </div>
                          {sesion.fechaFin && (
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>
                                Completado: {format(new Date(sesion.fechaFin), "dd/MM/yyyy 'a las' HH:mm")}
                              </span>
                            </div>
                          )}
                          {sesion.perfilDominante && (
                            <div className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4" />
                              <span className="font-medium text-gray-900">
                                Perfil: {sesion.perfilDominante}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      {(sesion.estado.toLowerCase() === 'finalizada' || sesion.estado.toLowerCase() === 'ronda_2_completada') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            verResultados(sesion.id);
                          }}
                        >
                          Ver Resultados
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-8 px-4 text-center mt-auto">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <GraduationCap className="h-5 w-5 text-orange-500" /> Universidad Metropolitana
          </div>
          <p className="text-gray-400 text-xs">© 2025 Universidad Metropolitana. Sistema Multiplataforma.</p>
        </div>
      </footer>
    </div>
  );
};

export default Historial;
