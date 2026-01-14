import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  GraduationCap, LogOut, Compass, ChevronLeft, 
  ChevronRight, Loader2 
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  guardarRespuestasRonda2,
  obtenerSesion,
  Pregunta, 
  RespuestaPregunta 
} from "@/lib/api/orientacionVocacional";

const Ronda2 = () => {
  const navigate = useNavigate();
  const { tokens, logout } = useAuth();
  const { toast } = useToast();
  
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, RespuestaPregunta>>({});
  const [tiempos, setTiempos] = useState<Record<string, number>>({});
  const [inicioTiempo, setInicioTiempo] = useState<number | null>(null);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [cargandoPreguntas, setCargandoPreguntas] = useState(true);

  const accessToken = tokens?.accessToken || 
    JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;

  useEffect(() => {
    const cargarPreguntas = async () => {
      // Primero intentar cargar de localStorage
      const preguntasGuardadas = localStorage.getItem('preguntasRonda2');
      
      if (preguntasGuardadas) {
        try {
          const preguntasData = JSON.parse(preguntasGuardadas);
          const listaPreguntas = Array.isArray(preguntasData) ? preguntasData : (preguntasData.preguntas || []);
          
          if (listaPreguntas.length > 0) {
            setPreguntas(listaPreguntas);
            
            const tiemposIniciales: Record<string, number> = {};
            listaPreguntas.forEach((preg: Pregunta) => {
              tiemposIniciales[preg.id] = 0;
            });
            setTiempos(tiemposIniciales);
            setInicioTiempo(Date.now());
            
            const respuestasGuardadas = localStorage.getItem('respuestasRonda2');
            if (respuestasGuardadas) {
              setRespuestas(JSON.parse(respuestasGuardadas));
            }
            setCargandoPreguntas(false);
            return;
          }
        } catch (error) {
          console.error('Error al parsear preguntas guardadas:', error);
        }
      }
      
      // Si no hay preguntas en localStorage, intentar obtenerlas del backend
      if (!accessToken) {
        toast({
          title: "Sesión expirada",
          description: "Por favor inicia sesión nuevamente",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const sesionId = localStorage.getItem('sesionId');
      if (!sesionId) {
        toast({
          title: "Error",
          description: "No se encontró la sesión. Por favor inicia un nuevo test.",
          variant: "destructive",
        });
        navigate('/orientacion/seleccionar-test');
        return;
      }

      // Intentar obtener las preguntas del backend
      // El backend genera las preguntas después de guardar Ronda 1
      console.log('📡 Intentando obtener preguntas de Ronda 2 del backend...');
      
      // Esperar un poco para que el backend genere las preguntas
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        const sesionInfo = await obtenerSesion(accessToken, sesionId);
        console.log('📋 Información completa de la sesión:', JSON.stringify(sesionInfo, null, 2));
        console.log('📋 Estado de la sesión:', sesionInfo.data.estado);
        
        // Verificar si la sesión está en ronda_2
        if (sesionInfo.data.estado === 'ronda_2' || sesionInfo.data.estado === 'completado') {
          // La sesión está en ronda_2
          // Las preguntas pueden estar en la respuesta de guardar-respuestas-ronda-1
          // o pueden necesitar ser obtenidas de otra forma
          // Por ahora, mostrar mensaje y permitir reintento manual
          setCargandoPreguntas(false);
          toast({
            title: "Preguntas en generación",
            description: "Las preguntas de Ronda 2 se están generando. Haz clic en 'Cargar Preguntas' cuando estén listas.",
          });
        } else {
          toast({
            title: "Error",
            description: "La sesión no está lista para Ronda 2. Por favor completa la Ronda 1 primero.",
            variant: "destructive",
          });
          navigate('/orientacion/ronda-1');
          setCargandoPreguntas(false);
        }
      } catch (error: any) {
        console.error('Error al obtener información de la sesión:', error);
        setCargandoPreguntas(false);
        toast({
          title: "Error",
          description: "No se pudo verificar el estado de la sesión. Puedes intentar cargar las preguntas manualmente.",
          variant: "destructive",
        });
      }
    };

    cargarPreguntas();
  }, [navigate, toast, accessToken]);

  const calcularNivelSeguridad = (tiempoSegundos: number): 'muy_seguro' | 'seguro' | 'indeciso' | 'muy_indeciso' => {
    // Lógica basada en tiempo de respuesta:
    // - Muy rápido (< 5s) = muy_seguro (respuesta muy rápida, alta confianza)
    // - Rápido (5-15s) = seguro (buena confianza)
    // - Medio (15-30s) = indeciso (dudando)
    // - Lento (> 30s) = muy_indeciso (mucha duda)
    if (tiempoSegundos < 5) return 'muy_seguro';
    if (tiempoSegundos < 15) return 'seguro';
    if (tiempoSegundos < 30) return 'indeciso';
    return 'muy_indeciso';
  };

  const responderPregunta = (preguntaId: string, respuesta: string | boolean) => {
    if (!inicioTiempo) return;

    const tiempoTranscurrido = Math.floor((Date.now() - inicioTiempo) / 1000);
    
    const nuevaRespuesta: RespuestaPregunta = {
      preguntaId,
      respuesta,
      tiempoSegundos: tiempoTranscurrido,
      nivelSeguridad: calcularNivelSeguridad(tiempoTranscurrido),
    };

    const nuevasRespuestas = {
      ...respuestas,
      [preguntaId]: nuevaRespuesta,
    };
    
    setRespuestas(nuevasRespuestas);
    setTiempos({
      ...tiempos,
      [preguntaId]: tiempoTranscurrido,
    });

    localStorage.setItem('respuestasRonda2', JSON.stringify(nuevasRespuestas));

    if (preguntaActual === preguntas.length - 1) {
      enviarRespuestasRonda2(nuevasRespuestas);
    } else {
      setPreguntaActual(preguntaActual + 1);
      setInicioTiempo(Date.now());
      setRespuestaSeleccionada(null);
    }
  };

  const enviarRespuestasRonda2 = async (respuestasParaEnviar: Record<string, RespuestaPregunta>) => {
    if (!accessToken) {
      toast({
        title: "Sesión expirada",
        description: "Por favor inicia sesión nuevamente",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const sesionId = localStorage.getItem('sesionId');
    if (!sesionId) {
      toast({
        title: "Error",
        description: "No se encontró la sesión. Por favor inicia un nuevo test.",
        variant: "destructive",
      });
      navigate('/orientacion/seleccionar-test');
      return;
    }

    setCargando(true);

    try {
      const respuestasArray = Object.values(respuestasParaEnviar);
      await guardarRespuestasRonda2(accessToken, sesionId, respuestasArray);
      
      localStorage.setItem('estadoSesion', 'completado');
      localStorage.removeItem('respuestasRonda1');
      localStorage.removeItem('respuestasRonda2');
      localStorage.removeItem('preguntasRonda1');
      localStorage.removeItem('preguntasRonda2');
      
      toast({
        title: "Test completado",
        description: "Tus respuestas han sido procesadas. Generando resultados...",
      });

      navigate(`/orientacion/resultados/${sesionId}`);
      
    } catch (error: any) {
      console.error('Error al completar test:', error);
      toast({
        title: "Error",
        description: error.message || "Error al completar el test. Por favor intenta nuevamente.",
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

  const pregunta = preguntas[preguntaActual];
  const porcentajeProgreso = preguntas.length > 0 
    ? ((preguntaActual + 1) / preguntas.length) * 100 
    : 0;

  const recargarPreguntas = async () => {
    if (!accessToken) {
      toast({
        title: "Sesión expirada",
        description: "Por favor inicia sesión nuevamente",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const sesionId = localStorage.getItem('sesionId');
    if (!sesionId) {
      toast({
        title: "Error",
        description: "No se encontró la sesión.",
        variant: "destructive",
      });
      return;
    }

    setCargandoPreguntas(true);

    try {
      // Revisar localStorage primero
      const preguntasGuardadas = localStorage.getItem('preguntasRonda2');
      if (preguntasGuardadas) {
        const preguntasData = JSON.parse(preguntasGuardadas);
        const listaPreguntas = Array.isArray(preguntasData) ? preguntasData : (preguntasData.preguntas || []);
        
        if (listaPreguntas.length > 0) {
          setPreguntas(listaPreguntas);
          const tiemposIniciales: Record<string, number> = {};
          listaPreguntas.forEach((preg: Pregunta) => {
            tiemposIniciales[preg.id] = 0;
          });
          setTiempos(tiemposIniciales);
          setInicioTiempo(Date.now());
          setCargandoPreguntas(false);
          toast({
            title: "Preguntas cargadas",
            description: `Se encontraron ${listaPreguntas.length} preguntas.`,
          });
          return;
        }
      }

      // Si no hay en localStorage, verificar sesión
      const sesionInfo = await obtenerSesion(accessToken, sesionId);
      console.log('📋 Sesión actualizada:', sesionInfo);
      
      if (sesionInfo.data.estado === 'ronda_2' || sesionInfo.data.estado === 'completado') {
        toast({
          title: "Esperando preguntas",
          description: "Las preguntas se están generando. Intenta nuevamente en unos segundos.",
        });
      } else {
        toast({
          title: "Error",
          description: "La sesión no está en estado ronda_2.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error al recargar preguntas:', error);
      toast({
        title: "Error",
        description: error.message || "Error al cargar preguntas.",
        variant: "destructive",
      });
    } finally {
      setCargandoPreguntas(false);
    }
  };

  if (preguntas.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <header className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/orientacion/ronda-1")}
                className="flex items-center gap-1 text-orange-500 font-medium hover:underline text-sm"
              >
                <ChevronLeft className="h-4 w-4" /> Volver
              </button>
              <div className="flex flex-col">
                <h1 className="text-[#F37021] text-xl font-bold leading-tight">
                  Universidad Metropolitana
                </h1>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-tight">
                  Orientación Vocacional - Ronda 2
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-12">
                {cargandoPreguntas ? (
                  <>
                    <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Cargando preguntas...
                    </h2>
                    <p className="text-gray-600">
                      Las preguntas de Ronda 2 se están generando. Por favor espera.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Esperando preguntas de Ronda 2
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Las preguntas se están generando en el servidor. Haz clic en el botón para intentar cargarlas nuevamente.
                    </p>
                    <Button
                      onClick={recargarPreguntas}
                      disabled={cargandoPreguntas}
                      className="bg-[#F37021] hover:bg-orange-600 text-white"
                    >
                      {cargandoPreguntas ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Cargando...
                        </>
                      ) : (
                        "Cargar Preguntas de Ronda 2"
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/orientacion/ronda-1")}
              className="flex items-center gap-1 text-orange-500 font-medium hover:underline text-sm"
            >
              <ChevronLeft className="h-4 w-4" /> Volver
            </button>
            <div className="flex flex-col">
              <h1 className="text-[#F37021] text-xl font-bold leading-tight">
                Universidad Metropolitana
              </h1>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-tight">
                Orientación Vocacional - Ronda 2
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
          <span className="font-bold text-gray-900">Ronda 2</span>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Pregunta {preguntaActual + 1} de {preguntas.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(porcentajeProgreso)}%
              </span>
            </div>
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-orange-500 transition-all duration-500"
                initial={{ width: 0 }}
                animate={{ width: `${porcentajeProgreso}%` }}
              />
            </div>
          </div>

          <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white">
            <CardContent className="p-8 md:p-12">
              <span className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-2 block">
                Ronda 2 - Preguntas Adaptativas
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 leading-tight">
                {pregunta?.texto}
              </h3>

              {pregunta?.opciones && pregunta.opciones.length > 0 ? (
                <RadioGroup 
                  value={respuestaSeleccionada || ""} 
                  onValueChange={setRespuestaSeleccionada}
                  className="space-y-4"
                >
                  {pregunta.opciones.map((opcion, index) => (
                    <div 
                      key={index}
                      className={`flex items-center space-x-3 p-5 rounded-lg border transition-all cursor-pointer ${
                        respuestaSeleccionada === opcion
                          ? 'border-orange-500 bg-orange-50 shadow-sm' 
                          : 'border-gray-100 hover:border-gray-300'
                      }`}
                      onClick={() => setRespuestaSeleccionada(opcion)}
                    >
                      <RadioGroupItem value={opcion} id={`opcion-${index}`} />
                      <Label 
                        htmlFor={`opcion-${index}`} 
                        className="flex-1 cursor-pointer font-medium text-lg text-gray-700"
                      >
                        {opcion}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="space-y-4">
                  <Button
                    onClick={() => responderPregunta(pregunta.id, true)}
                    className="w-full h-16 text-lg font-medium bg-green-50 hover:bg-green-100 text-green-700 border-2 border-green-200"
                  >
                    Sí
                  </Button>
                  <Button
                    onClick={() => responderPregunta(pregunta.id, false)}
                    className="w-full h-16 text-lg font-medium bg-red-50 hover:bg-red-100 text-red-700 border-2 border-red-200"
                  >
                    No
                  </Button>
                </div>
              )}

              {pregunta?.opciones && pregunta.opciones.length > 0 && (
                <div className="mt-10 flex justify-end">
                  <Button 
                    onClick={() => respuestaSeleccionada && responderPregunta(pregunta.id, respuestaSeleccionada)}
                    disabled={!respuestaSeleccionada || cargando}
                    className="bg-gray-900 hover:bg-black text-white px-8 h-12 rounded-md font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cargando ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Completando test...
                      </>
                    ) : preguntaActual === preguntas.length - 1 ? (
                      "Finalizar Test"
                    ) : (
                      <>
                        Siguiente
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
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

export default Ronda2;
