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
import { obtenerHistorial, obtenerSesion, obtenerPreguntasIco, type HistorialItem } from "@/lib/api/orientacionVocacional";
import { format } from "date-fns";

const formatearFechaSegura = (fecha: string | undefined | null): string => {
  if (fecha == null || String(fecha).trim() === "") return "—";
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return "Sin completar";
  return format(d, "dd/MM/yyyy");
};

const Historial = () => {
  const navigate = useNavigate();
  const { tokens, logout } = useAuth();
  const { toast } = useToast();
  
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [sesionesEnProgreso, setSesionesEnProgreso] = useState<HistorialItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const [continuandoId, setContinuandoId] = useState<string | null>(null);

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
      const data = respuesta.data;
      setHistorial(data.historial ?? []);
      setSesionesEnProgreso(data.sesionesEnProgreso ?? []);
    } catch (error: any) {
      console.error('Error al cargar historial:', error);
      console.error('Error completo:', JSON.stringify(error, null, 2));
      setHistorial([]);
      setSesionesEnProgreso([]);
      
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

  const continuarTest = async (sesion: any) => {
    const id = sesion.id ?? sesion.sesion_id;
    const tipoTest = sesion.tipoTest ?? sesion.tipo_test;
    const estado = (sesion.estado ?? sesion.estado ?? "").toString().toLowerCase();
    if (!accessToken || !id) return;

    setContinuandoId(id);
    try {
      localStorage.setItem("sesionId", id);
      localStorage.setItem("tipoTest", tipoTest ?? "Holland_RIASEC");
      localStorage.setItem("estadoSesion", sesion.estado ?? sesion.estado ?? "iniciada");

      if (tipoTest === "ICO") {
        const res = await obtenerPreguntasIco(accessToken, id);
        const preguntas = res?.data?.preguntas ?? res?.preguntas ?? [];
        localStorage.setItem("preguntasIco", JSON.stringify(preguntas));
        navigate("/orientacion/test-ico");
        return;
      }

      if (tipoTest === "Holland_RIASEC") {
        if (estado === "ronda_1_completada" || estado === "ronda_2") {
          const sesionInfo = await obtenerSesion(accessToken, id);
          let preguntasR2 = sesionInfo?.data?.preguntasRonda2 ?? [];
          if (preguntasR2.length === 0) {
            const local = localStorage.getItem("preguntasRonda2");
            if (local) {
              try {
                const arr = JSON.parse(local);
                preguntasR2 = Array.isArray(arr) ? arr : (arr?.preguntas ?? []);
              } catch (_) {}
            }
          }
          if (preguntasR2.length > 0) {
            localStorage.setItem("preguntasRonda2", JSON.stringify(preguntasR2));
            localStorage.setItem("estadoSesion", estado === "ronda_2" ? "ronda_2" : "ronda_1_completada");
            navigate("/orientacion/ronda-2");
            return;
          }
        }
        navigate("/orientacion/ronda-1");
      }
    } catch (err: any) {
      toast({
        title: "Error al continuar",
        description: err?.message ?? "No se pudo cargar el test. Intenta desde Seleccionar test.",
        variant: "destructive",
      });
    } finally {
      setContinuandoId(null);
    }
  };

  const localSesionId = typeof window !== "undefined" ? localStorage.getItem("sesionId") : null;
  const localEstado = (typeof window !== "undefined" ? localStorage.getItem("estadoSesion") : null) || "";
  const esRonda2EnProgresoEnLocal = localSesionId && localEstado.toLowerCase() === "ronda_2";

  const historialCompletados = historial.filter((s: any) => {
    const id = s.id ?? s.sesion_id;
    if (esRonda2EnProgresoEnLocal && id === localSesionId) return false;
    return isSesionCompletada(s.estado ?? s.estado, s.tipoTest ?? s.tipo_test);
  });

  let historialEnProgreso = [...sesionesEnProgreso];
  if (esRonda2EnProgresoEnLocal && localSesionId) {
    const idsEnProgreso = new Set(historialEnProgreso.map((s: any) => s.id ?? s.sesion_id));
    if (!idsEnProgreso.has(localSesionId)) {
      const enCompletadosPeroRonda2Local = historial.filter(
        (s: any) => (s.id ?? s.sesion_id) === localSesionId && isSesionCompletada(s.estado ?? s.estado, s.tipoTest ?? s.tipo_test)
      );
      if (enCompletadosPeroRonda2Local.length > 0) {
        historialEnProgreso = [
          ...historialEnProgreso,
          ...enCompletadosPeroRonda2Local.map((s: any) => ({ ...s, estado: "ronda_2" })),
        ];
      }
    }
  }

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
                {historialCompletados.length === 0 && historialEnProgreso.length === 0
                  ? "No hay tests"
                  : historialEnProgreso.length > 0
                    ? `${historialEnProgreso.length} en progreso, ${historialCompletados.length} completado${historialCompletados.length !== 1 ? "s" : ""}`
                    : `${historialCompletados.length} test${historialCompletados.length > 1 ? "s" : ""} completado${historialCompletados.length > 1 ? "s" : ""}`
                }
              </p>
            </div>
            <Button
              onClick={() => navigate("/orientacion/seleccionar-test")}
              className="bg-[#F37021] hover:bg-orange-600 text-white"
            >
              Realizar Nuevo Test
            </Button>
          </div>

          {historialEnProgreso.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Tests en progreso
              </h3>
              <div className="space-y-3">
                {historialEnProgreso.map((sesion: any) => {
                  const tipoTest = sesion.tipoTest ?? sesion.tipo_test;
                  const fecha = sesion.fechaInicio ?? sesion.fecha_inicio;
                  const id = sesion.id ?? sesion.sesion_id;
                  const estado = sesion.estado ?? sesion.estado;
                  const isLoading = continuandoId === id;
                  return (
                    <Card
                      key={id}
                      className="border-none shadow-sm rounded-xl border-l-4 border-l-amber-500 bg-amber-50/50 hover:bg-amber-50 transition-all"
                    >
                      <CardContent className="p-5 flex flex-wrap items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {getTipoTestTexto(tipoTest)}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 shrink-0" />
                              {formatearFechaSegura(fecha)}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getEstadoColor(estado, tipoTest)}`}>
                              {getEstadoTexto(estado, tipoTest)}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => continuarTest(sesion)}
                          disabled={isLoading}
                          className="bg-[#F37021] hover:bg-orange-600 text-white shrink-0"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Cargando...
                            </>
                          ) : (
                            "Continuar"
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

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
                const fecha = sesion.fechaCompletada ?? sesion.fecha_completada ?? sesion.fechaFin ?? sesion.fecha_fin ?? sesion.fechaInicio ?? sesion.fecha_inicio;
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
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 shrink-0" />
                              {formatearFechaSegura(fecha)}
                            </span>
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
