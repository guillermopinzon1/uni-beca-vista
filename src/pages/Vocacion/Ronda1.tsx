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
  guardarRespuestasRonda1,
  obtenerSesion,
  Pregunta, 
  RespuestaPregunta 
} from "@/lib/api/orientacionVocacional";

const Ronda1 = () => {
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

  const accessToken = tokens?.accessToken || 
    JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;

  useEffect(() => {
    // Cargar preguntas de localStorage
    const preguntasGuardadas = localStorage.getItem('preguntasRonda1');
    if (!preguntasGuardadas) {
      toast({
        title: "Error",
        description: "No se encontraron preguntas. Por favor inicia un nuevo test.",
        variant: "destructive",
      });
      navigate('/orientacion/seleccionar-test');
      return;
    }

    try {
      const preguntasData = JSON.parse(preguntasGuardadas);
      
      // Si el JSON guardado es el objeto completo del backend, extraer solo las preguntas
      const listaPreguntas = Array.isArray(preguntasData) ? preguntasData : (preguntasData.preguntas || []);
      setPreguntas(listaPreguntas);
      
      console.log('📋 Preguntas cargadas:', listaPreguntas.length);
      console.log('📋 IDs de preguntas:', listaPreguntas.map((p: Pregunta) => p.id));
      
      // Inicializar tiempos
      const tiemposIniciales: Record<string, number> = {};
      listaPreguntas.forEach((preg: Pregunta) => {
        tiemposIniciales[preg.id] = 0;
      });
      setTiempos(tiemposIniciales);
      
      // Iniciar timer para primera pregunta
      setInicioTiempo(Date.now());
      
      // Cargar respuestas guardadas si existen, pero solo las que corresponden a las preguntas actuales
      const respuestasGuardadas = localStorage.getItem('respuestasRonda1');
      if (respuestasGuardadas) {
        const respuestasParseadas = JSON.parse(respuestasGuardadas);
        // Filtrar solo las respuestas que corresponden a las preguntas actuales
        const idsPreguntasActuales = new Set(listaPreguntas.map((p: Pregunta) => p.id));
        const respuestasFiltradas: Record<string, RespuestaPregunta> = {};
        
        Object.keys(respuestasParseadas).forEach((preguntaId) => {
          if (idsPreguntasActuales.has(preguntaId)) {
            respuestasFiltradas[preguntaId] = respuestasParseadas[preguntaId];
          }
        });
        
        console.log('💾 Respuestas guardadas encontradas:', Object.keys(respuestasParseadas).length);
        console.log('✅ Respuestas válidas (filtradas):', Object.keys(respuestasFiltradas).length);
        
        setRespuestas(respuestasFiltradas);
        
        // Si hay respuestas guardadas, actualizar localStorage con las filtradas
        if (Object.keys(respuestasFiltradas).length > 0) {
          localStorage.setItem('respuestasRonda1', JSON.stringify(respuestasFiltradas));
        } else {
          // Si no hay respuestas válidas, limpiar el localStorage
          localStorage.removeItem('respuestasRonda1');
        }
      }
    } catch (error) {
      console.error('Error al cargar preguntas:', error);
      toast({
        title: "Error",
        description: "Error al cargar las preguntas. Por favor intenta nuevamente.",
        variant: "destructive",
      });
      navigate('/orientacion/seleccionar-test');
    }
  }, [navigate, toast]);

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

    // Calcular tiempo transcurrido
    const tiempoTranscurrido = Math.floor((Date.now() - inicioTiempo) / 1000);
    
    // Guardar respuesta
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

    // Guardar en localStorage para persistencia
    localStorage.setItem('respuestasRonda1', JSON.stringify(nuevasRespuestas));

    // Si es la última pregunta, enviar respuestas
    if (preguntaActual === preguntas.length - 1) {
      enviarRespuestasRonda1(nuevasRespuestas);
    } else {
      // Avanzar a siguiente pregunta
      setPreguntaActual(preguntaActual + 1);
      setInicioTiempo(Date.now());
      setRespuestaSeleccionada(null);
    }
  };

  const enviarRespuestasRonda1 = async (respuestasParaEnviar: Record<string, RespuestaPregunta>) => {
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
    const estadoSesion = localStorage.getItem('estadoSesion');
    
    if (!sesionId) {
      toast({
        title: "Error",
        description: "No se encontró la sesión. Por favor inicia un nuevo test.",
        variant: "destructive",
      });
      navigate('/orientacion/seleccionar-test');
      return;
    }

    // Verificar el estado real de la sesión en el backend antes de intentar guardar
    try {
      const sesionInfo = await obtenerSesion(accessToken, sesionId);
      console.log('📋 Estado actual de la sesión en el backend:', sesionInfo.data.estado);
      
      // Si la sesión ya está en ronda_2 o completado, redirigir directamente
      if (sesionInfo.data.estado === 'ronda_2' || sesionInfo.data.estado === 'completado') {
        const preguntasRonda2 = localStorage.getItem('preguntasRonda2');
        if (preguntasRonda2) {
          toast({
            title: "Información",
            description: "Ya completaste la Ronda 1. Continuando con la Ronda 2...",
          });
          navigate('/orientacion/ronda-2');
          return;
        } else {
          // La sesión está en ronda_2 pero no hay preguntas guardadas
          // Redirigir a Ronda 2 para que las obtenga
          toast({
            title: "Ronda 1 completada",
            description: "Continuando con la Ronda 2...",
          });
          localStorage.setItem('estadoSesion', 'ronda_2');
          navigate('/orientacion/ronda-2');
          return;
        }
      }
      
      // Si la sesión no está en "iniciada", no podemos guardar
      if (sesionInfo.data.estado !== 'iniciada') {
        toast({
          title: "Estado de sesión inválido",
          description: `La sesión está en estado "${sesionInfo.data.estado}". Por favor inicia un nuevo test.`,
          variant: "destructive",
        });
        // Limpiar y redirigir a seleccionar test
        localStorage.removeItem('sesionId');
        localStorage.removeItem('tipoTest');
        localStorage.removeItem('estadoSesion');
        localStorage.removeItem('preguntasRonda1');
        localStorage.removeItem('respuestasRonda1');
        setTimeout(() => {
          navigate('/orientacion/seleccionar-test');
        }, 2000);
        return;
      }
    } catch (error: any) {
      console.error('Error al verificar sesión:', error);
      // Continuar de todas formas, el backend manejará el error
    }

    setCargando(true);

    try {
      // Filtrar solo las respuestas que corresponden a las preguntas actuales
      const idsPreguntasActuales = new Set(preguntas.map(p => p.id));
      const respuestasFiltradas = Object.values(respuestasParaEnviar).filter(
        r => idsPreguntasActuales.has(r.preguntaId)
      );
      
      console.log('📤 Respuestas totales guardadas:', Object.keys(respuestasParaEnviar).length);
      console.log('📤 Respuestas filtradas (solo de preguntas actuales):', respuestasFiltradas.length);
      console.log('📤 Total de preguntas:', preguntas.length);
      console.log('📤 IDs de preguntas actuales:', Array.from(idsPreguntasActuales));
      console.log('📤 IDs de respuestas guardadas:', Object.keys(respuestasParaEnviar));
      
      // Verificar que todas las preguntas estén respondidas
      if (respuestasFiltradas.length !== preguntas.length) {
        const preguntasSinResponder = preguntas.filter(
          p => !respuestasFiltradas.find(r => r.preguntaId === p.id)
        );
        console.error('❌ Preguntas sin responder:', preguntasSinResponder.map(p => ({ id: p.id, texto: p.texto })));
        toast({
          title: "Error de validación",
          description: `Faltan ${preguntas.length - respuestasFiltradas.length} pregunta(s) por responder.`,
          variant: "destructive",
        });
        setCargando(false);
        return;
      }

      // Log del formato que se enviará
      console.log('📤 Formato de respuestas a enviar:', JSON.stringify(respuestasFiltradas, null, 2));
      
      const respuesta = await guardarRespuestasRonda1(accessToken, sesionId, respuestasFiltradas);
      
      // Hacer cast a any para verificar la estructura real de la respuesta
      const respuestaAny = respuesta as any;
      
      console.log('✅ Respuesta completa del servidor:', JSON.stringify(respuestaAny, null, 2));
      console.log('✅ respuesta.data:', respuestaAny.data);
      console.log('✅ respuesta.data.preguntas:', respuestaAny.data?.preguntas);
      
      // Verificar diferentes posibles estructuras de respuesta
      let preguntasRonda2: Pregunta[] | null = null;
      
      // Opción 1: preguntas directamente en data.preguntas
      if (respuestaAny.data?.preguntas && Array.isArray(respuestaAny.data.preguntas)) {
        preguntasRonda2 = respuestaAny.data.preguntas;
        console.log('✅ Preguntas encontradas en data.preguntas:', preguntasRonda2.length);
      }
      // Opción 2: preguntas en data (si data es un array)
      else if (Array.isArray(respuestaAny.data)) {
        preguntasRonda2 = respuestaAny.data;
        console.log('✅ Preguntas encontradas en data (array):', preguntasRonda2.length);
      }
      // Opción 3: preguntas en el nivel raíz
      else if (respuestaAny.preguntas && Array.isArray(respuestaAny.preguntas)) {
        preguntasRonda2 = respuestaAny.preguntas;
        console.log('✅ Preguntas encontradas en respuesta.preguntas:', preguntasRonda2.length);
      }
      
      if (preguntasRonda2 && preguntasRonda2.length > 0) {
        localStorage.setItem('preguntasRonda2', JSON.stringify(preguntasRonda2));
        localStorage.setItem('estadoSesion', 'ronda_2');
        
        toast({
          title: "Ronda 1 completada",
          description: "Ahora continuarás con la Ronda 2",
        });

        // Redirigir a Ronda 2
        navigate('/orientacion/ronda-2');
      } else {
        // Si no hay preguntas en la respuesta, el backend las está generando
        // Actualizar estado y redirigir a Ronda 2, que intentará obtenerlas
        console.warn('⚠️ No se encontraron preguntas de Ronda 2 en la respuesta inmediata');
        console.log('📋 El backend puede estar generando las preguntas de forma asíncrona');
        
        // Actualizar estado de sesión
        localStorage.setItem('estadoSesion', 'ronda_2');
        
        toast({
          title: "Ronda 1 completada",
          description: "Generando preguntas de Ronda 2...",
        });
        
        // Redirigir a Ronda 2, que intentará obtener las preguntas
        navigate('/orientacion/ronda-2');
      }
    } catch (error: any) {
      console.error('Error al guardar respuestas:', error);
      console.error('Error completo:', JSON.stringify(error, null, 2));
      
      // Manejo específico de errores de sesión - PERMITIR REINTENTOS
      const errorMessage = error.message || '';
      const errorPayload = error.payload || {};
      const isSessionStateError = 
        error.isSessionError || 
        errorMessage.toLowerCase().includes('sesión') ||
        errorMessage.toLowerCase().includes('session') ||
        errorMessage.toLowerCase().includes('estado') ||
        errorMessage.toLowerCase().includes('ya no está en estado iniciada') ||
        errorPayload.message?.toLowerCase().includes('sesión') ||
        errorPayload.message?.toLowerCase().includes('estado');
      
      if (isSessionStateError) {
        console.warn('⚠️ Error de sesión detectado, verificando estado actual...');
        
        // Verificar si la sesión ya está en ronda_2 (puede que ya se haya guardado)
        try {
          const sesionInfo = await obtenerSesion(accessToken, sesionId);
          console.log('📋 Estado actual de la sesión:', sesionInfo.data.estado);
          
          if (sesionInfo.data.estado === 'ronda_2' || sesionInfo.data.estado === 'completado') {
            // La sesión ya está en ronda 2 o completado, redirigir a Ronda 2
            console.log('✅ La sesión ya está en ronda_2, redirigiendo...');
            
            // Intentar obtener preguntas de Ronda 2 si están disponibles
            if (sesionInfo.data.preguntasRonda2 && sesionInfo.data.preguntasRonda2.length > 0) {
              localStorage.setItem('preguntasRonda2', JSON.stringify(sesionInfo.data.preguntasRonda2));
              console.log('✅ Preguntas de Ronda 2 obtenidas de la sesión:', sesionInfo.data.preguntasRonda2.length);
            }
            
            localStorage.setItem('estadoSesion', 'ronda_2');
            
            toast({
              title: "Ronda 1 completada",
              description: "Ya completaste la Ronda 1. Continuando con la Ronda 2...",
            });
            navigate('/orientacion/ronda-2');
            return;
          } else {
            // La sesión está en otro estado inesperado
            console.warn('⚠️ Estado de sesión inesperado:', sesionInfo.data.estado);
            toast({
              title: "Estado de sesión inesperado",
              description: `La sesión está en estado "${sesionInfo.data.estado}". Redirigiendo a seleccionar test...`,
              variant: "destructive",
            });
            // Limpiar y redirigir
            localStorage.removeItem('sesionId');
            localStorage.removeItem('tipoTest');
            localStorage.removeItem('estadoSesion');
            localStorage.removeItem('preguntasRonda1');
            localStorage.removeItem('respuestasRonda1');
            setTimeout(() => {
              navigate('/orientacion/seleccionar-test');
            }, 2000);
            return;
          }
        } catch (e) {
          console.error('Error al verificar sesión:', e);
          // Si no se pudo verificar, permitir continuar de todas formas
          // El backend puede estar procesando de forma asíncrona
          toast({
            title: "Ronda 1 completada",
            description: "Continuando con la Ronda 2...",
          });
          localStorage.setItem('estadoSesion', 'ronda_2');
          navigate('/orientacion/ronda-2');
          return;
        }
      } else {
        toast({
          title: "Error",
          description: error.message || "Error al guardar respuestas. Por favor intenta nuevamente.",
          variant: "destructive",
        });
      }
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

  if (preguntas.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* HEADER SUPERIOR */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/orientacion/seleccionar-test")}
              className="flex items-center gap-1 text-orange-500 font-medium hover:underline text-sm"
            >
              <ChevronLeft className="h-4 w-4" /> Volver
            </button>
            <div className="flex flex-col">
              <h1 className="text-[#F37021] text-xl font-bold leading-tight">
                Universidad Metropolitana
              </h1>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-tight">
                Orientación Vocacional - Ronda 1
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

      {/* BREADCRUMB */}
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
          <span className="hover:text-orange-500 transition-colors cursor-pointer"
            onClick={() => navigate("/orientacion/seleccionar-test")}
          >
            Seleccionar Test
          </span>
          <span className="text-gray-300">/</span>
          <span className="font-bold text-gray-900">Ronda 1</span>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Barra de progreso */}
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

          {/* Pregunta */}
          <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white">
            <CardContent className="p-8 md:p-12">
              <span className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-2 block">
                Ronda 1
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
                    onClick={() => {
                      responderPregunta(pregunta.id, true);
                    }}
                    className="w-full h-16 text-lg font-medium bg-green-50 hover:bg-green-100 text-green-700 border-2 border-green-200"
                  >
                    Sí
                  </Button>
                  <Button
                    onClick={() => {
                      responderPregunta(pregunta.id, false);
                    }}
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
                        Procesando...
                      </>
                    ) : preguntaActual === preguntas.length - 1 ? (
                      "Finalizar Ronda 1"
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

export default Ronda1;
