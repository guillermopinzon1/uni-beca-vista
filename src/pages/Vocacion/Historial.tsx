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
      console.log('📋 [Frontend] Respuesta completa de obtenerHistorial:', JSON.stringify(respuesta, null, 2));
      console.log('📋 [Frontend] respuesta.data:', respuesta.data);
      console.log('📋 [Frontend] Tipo de respuesta.data:', typeof respuesta.data);
      console.log('📋 [Frontend] Es array?', Array.isArray(respuesta.data));
      
      // Asegurarse de que data sea un array
      let historialData: any[] = [];
      
      if (Array.isArray(respuesta.data)) {
        historialData = respuesta.data;
      } else if (respuesta.data && Array.isArray(respuesta.data.data)) {
        historialData = respuesta.data.data;
      } else if (respuesta.data && typeof respuesta.data === 'object') {
        // Si data es un objeto, intentar extraer un array
        const keys = Object.keys(respuesta.data);
        if (keys.length > 0 && Array.isArray(respuesta.data[keys[0]])) {
          historialData = respuesta.data[keys[0]];
        }
      }
      
      console.log('📋 [Frontend] Historial procesado:', historialData.length, 'tests');
      console.log('📋 [Frontend] Datos del historial:', JSON.stringify(historialData, null, 2));
      
      setHistorial(historialData);
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
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
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

    </div>
  );
};

export default Historial;
