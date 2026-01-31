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
      
      const data = (respuesta as HistorialResponse).data;
      if (Array.isArray(data)) {
        historialData = data;
      } else if (data && typeof data === 'object') {
        const dataObj = data as Record<string, unknown>;
        if (Array.isArray(dataObj.data)) {
          historialData = dataObj.data;
        } else {
          const keys = Object.keys(dataObj);
          if (keys.length > 0 && Array.isArray(dataObj[keys[0]])) {
            historialData = dataObj[keys[0]] as any[];
          }
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

  const verResultados = (sesionId: string, tipoTest?: string) => {
    if (tipoTest === 'ICO') {
      navigate('/orientacion/resultados-ico', { state: { sesionId } });
    } else {
      navigate(`/orientacion/resultados/${sesionId}`);
    }
  };

  const isSesionCompletada = (estado: string, tipoTest?: string) => {
    const e = estado.toLowerCase();
    if (tipoTest === 'ICO') return e === 'finalizada' || e === 'completada';
    return e === 'finalizada' || e === 'ronda_2_completada';
  };

  const getEstadoIcon = (estado: string, tipoTest?: string) => {
    const e = estado.toLowerCase();
    if (tipoTest === 'ICO') {
      if (e === 'finalizada' || e === 'completada') return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      return <Clock className="h-5 w-5 text-yellow-500" />;
    }
    switch (e) {
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

  const getEstadoColor = (estado: string, tipoTest?: string) => {
    const e = estado.toLowerCase();
    if (tipoTest === 'ICO') {
      if (e === 'finalizada' || e === 'completada') return 'bg-green-100 text-green-700 border-green-200';
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
    switch (e) {
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

  const getEstadoTexto = (estado: string, tipoTest?: string) => {
    const e = estado.toLowerCase();
    if (tipoTest === 'ICO') {
      if (e === 'finalizada' || e === 'completada') return 'Completado';
      return 'En curso';
    }
    switch (e) {
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
    return tipoTest === 'Holland_RIASEC' ? 'Holland RIASEC' : 'ICO';
  };

  // Solo mostrar tests completados
  const historialCompletados = historial.filter((s: any) =>
    isSesionCompletada(s.estado ?? s.estado, s.tipoTest ?? s.tipo_test)
  );

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
                {historialCompletados.length === 0 
                  ? "No hay tests completados" 
                  : `${historialCompletados.length} test${historialCompletados.length > 1 ? 's' : ''} completado${historialCompletados.length > 1 ? 's' : ''}`
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

          {historialCompletados.length === 0 ? (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No hay tests completados
                </h3>
                <p className="text-gray-600 mb-6">
                  Completa un test de orientación vocacional para ver tus resultados aquí.
                </p>
                <Button
                  onClick={() => navigate('/orientacion/seleccionar-test')}
                  className="bg-[#F37021] hover:bg-orange-600 text-white"
                >
                  Realizar Test
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {historialCompletados.map((sesion: any) => {
                const tipoTest = sesion.tipoTest ?? sesion.tipo_test;
                const fecha = sesion.fechaFin ?? sesion.fecha_fin ?? sesion.fechaInicio ?? sesion.fecha_inicio;
                const perfil = sesion.perfilDominante ?? sesion.perfil_dominante;
                const id = sesion.id ?? sesion.sesion_id;
                return (
                  <Card
                    key={id}
                    className="border-none shadow-sm rounded-xl hover:shadow-md transition-all cursor-pointer"
                    onClick={() => verResultados(id, tipoTest)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {getTipoTestTexto(tipoTest)}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                            {fecha && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 shrink-0" />
                                {format(new Date(fecha), "dd/MM/yyyy")}
                              </span>
                            )}
                            {perfil && (
                              <span className="flex items-center gap-1 font-medium text-gray-900">
                                <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                                {perfil}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            verResultados(id, tipoTest);
                          }}
                        >
                          Ver Resultados
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

    </div>
  );
};

export default Historial;
