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
  ChevronRight, Loader2, DoorOpen 
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  guardarRespuestasRonda1,
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
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string | boolean | null>(null);
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
      const listaPreguntas = Array.isArray(preguntasData) ? preguntasData : (preguntasData.preguntas || []);
      setPreguntas(listaPreguntas);
      
      // Inicializar tiempos
      const tiemposIniciales: Record<string, number> = {};
      listaPreguntas.forEach((preg: Pregunta) => {
        tiemposIniciales[preg.id] = 0;
      });
      setTiempos(tiemposIniciales);
      
      // Iniciar timer para primera pregunta
      setInicioTiempo(Date.now());
      
      // Cargar respuestas guardadas si existen
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
        
        setRespuestas(respuestasFiltradas);
        if (Object.keys(respuestasFiltradas).length > 0) {
          localStorage.setItem('respuestasRonda1', JSON.stringify(respuestasFiltradas));
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

  // Sincronizar la selección mostrada al cambiar de pregunta (al retroceder se ve lo ya guardado)
  useEffect(() => {
    const p = preguntas[preguntaActual];
    if (!p) return;
    const guardada = respuestas[p.id]?.respuesta;
    setRespuestaSeleccionada(guardada !== undefined && guardada !== null ? guardada : null);
  }, [preguntaActual, preguntas, respuestas]);

  const calcularNivelSeguridad = (tiempoSegundos: number): 'seguro' | 'no_seguro' => {
    // Lógica basada en tiempo de respuesta:
    // - Rápido (< 10s) = seguro (respuesta rápida, alta confianza)
    // - Lento (>= 10s) = no_seguro (dudando)
    return tiempoSegundos < 10 ? 'seguro' : 'no_seguro';
  };

  const responderPregunta = (preguntaId: string, respuesta: string | boolean) => {
    if (!inicioTiempo) return;

    // Calcular tiempo transcurrido
    const tiempoTranscurrido = Math.floor((Date.now() - inicioTiempo) / 1000);
    
    // Guardar respuesta
    const nuevaRespuesta: RespuestaPregunta = {
      preguntaId,
      respuesta,
      tiempoRespuesta: tiempoTranscurrido,
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
      // Filtrar solo las respuestas que corresponden a las preguntas actuales
      const idsPreguntasActuales = new Set(preguntas.map(p => p.id));
      
      // Crear un Map para eliminar duplicados (mantener solo la última respuesta por pregunta)
      const respuestasMap = new Map<string, RespuestaPregunta>();
      
      Object.values(respuestasParaEnviar).forEach(respuesta => {
        if (idsPreguntasActuales.has(respuesta.preguntaId)) {
          respuestasMap.set(respuesta.preguntaId, respuesta);
        }
      });
      
      const respuestasFiltradas = Array.from(respuestasMap.values());
      
      console.log('📊 Total de preguntas:', preguntas.length);
      console.log('📊 Respuestas filtradas:', respuestasFiltradas.length);
      console.log('📊 IDs de preguntas actuales:', Array.from(idsPreguntasActuales));
      console.log('📊 IDs de respuestas:', respuestasFiltradas.map(r => r.preguntaId));
      
      // Verificar que todas las preguntas estén respondidas
      if (respuestasFiltradas.length !== preguntas.length) {
        const preguntasSinResponder = preguntas.filter(
          p => !respuestasMap.has(p.id)
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

      // Verificar que no haya más respuestas que preguntas
      if (respuestasFiltradas.length > preguntas.length) {
        console.error('❌ Hay más respuestas que preguntas:', respuestasFiltradas.length, 'vs', preguntas.length);
        toast({
          title: "Error de validación",
          description: `Se detectaron respuestas duplicadas. Por favor recarga la página e intenta nuevamente.`,
          variant: "destructive",
        });
        setCargando(false);
        return;
      }

      const respuesta = await guardarRespuestasRonda1(accessToken, sesionId, respuestasFiltradas);
      
      // Guardar datos de Ronda 1
      if (respuesta.data.puntuacionesRonda1) {
        localStorage.setItem('puntuacionesRonda1', JSON.stringify(respuesta.data.puntuacionesRonda1));
      }
      
      // Guardar preguntas de Ronda 2
      if (respuesta.data.preguntasRonda2 && respuesta.data.preguntasRonda2.length > 0) {
        localStorage.setItem('preguntasRonda2', JSON.stringify(respuesta.data.preguntasRonda2));
        localStorage.setItem('estadoSesion', respuesta.data.estado);
        
        toast({
          title: "Ronda 1 completada",
          description: "Ahora continuarás con la Ronda 2",
        });

        // Redirigir a Ronda 2
        navigate('/orientacion/ronda-2');
      } else {
        toast({
          title: "Ronda 1 completada",
          description: "Las preguntas de Ronda 2 se están generando...",
        });
        localStorage.setItem('estadoSesion', respuesta.data.estado);
        navigate('/orientacion/ronda-2');
      }
    } catch (error: any) {
      console.error('Error al guardar respuestas:', error);
      toast({
        title: "Error",
        description: error.message || "Error al guardar respuestas. Por favor intenta nuevamente.",
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

  if (preguntas.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="w-full pb-24">
      <div className="container mx-auto px-4 py-8">
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

              {pregunta?.opcionesRespuesta && pregunta.opcionesRespuesta.length > 0 ? (
                <RadioGroup 
                  value={respuestaSeleccionada !== null && respuestaSeleccionada !== undefined ? String(respuestaSeleccionada) : ""} 
                  onValueChange={(v) => setRespuestaSeleccionada(v)}
                  className="space-y-4"
                >
                  {pregunta.opcionesRespuesta.map((opcion, index) => (
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
                    onClick={() => setRespuestaSeleccionada(true)}
                    className={`w-full h-16 text-lg font-medium border-2 transition-all ${
                      respuestaSeleccionada === true ? "bg-green-200 border-green-500 shadow-sm" : "bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                    }`}
                  >
                    Sí
                  </Button>
                  <Button
                    onClick={() => setRespuestaSeleccionada(false)}
                    className={`w-full h-16 text-lg font-medium border-2 transition-all ${
                      respuestaSeleccionada === false ? "bg-red-200 border-red-500 shadow-sm" : "bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                    }`}
                  >
                    No
                  </Button>
                </div>
              )}

            </CardContent>
          </Card>

          {/* Navegación fija: Anterior + Siguiente/Finalizar (no avanzar sin responder) */}
          <div className="sticky bottom-0 left-0 right-0 z-10 mt-6 -mb-8 py-4 bg-background/95 backdrop-blur border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
            <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              <div className="flex justify-between items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPreguntaActual((p) => Math.max(0, p - 1))}
                  disabled={preguntaActual === 0 || cargando}
                  className="shrink-0"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Anterior
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate("/orientacion/historial")}
                  disabled={cargando}
                  className="shrink-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                >
                  <DoorOpen className="h-4 w-4 mr-2" />
                  Salir y continuar después
                </Button>
              </div>
              <Button
                onClick={() => respuestaSeleccionada !== null && respuestaSeleccionada !== undefined && responderPregunta(pregunta.id, respuestaSeleccionada)}
                disabled={respuestaSeleccionada === null || respuestaSeleccionada === undefined || cargando}
                className="bg-gray-900 hover:bg-black text-white px-8 h-12 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ronda1;
