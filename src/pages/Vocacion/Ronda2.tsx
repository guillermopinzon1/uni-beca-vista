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
  ChevronRight, Loader2, AlertCircle
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
      try {
        const sesionInfo = await obtenerSesion(accessToken, sesionId);
        
        if (sesionInfo.data.preguntasRonda2 && sesionInfo.data.preguntasRonda2.length > 0) {
          setPreguntas(sesionInfo.data.preguntasRonda2);
          localStorage.setItem('preguntasRonda2', JSON.stringify(sesionInfo.data.preguntasRonda2));
          
          const tiemposIniciales: Record<string, number> = {};
          sesionInfo.data.preguntasRonda2.forEach((preg: Pregunta) => {
            tiemposIniciales[preg.id] = 0;
          });
          setTiempos(tiemposIniciales);
          setInicioTiempo(Date.now());
        } else {
          toast({
            title: "Preguntas en generación",
            description: "Las preguntas de Ronda 2 se están generando. Por favor espera unos segundos y recarga.",
          });
        }
      } catch (error: any) {
        console.error('Error al obtener preguntas:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las preguntas. Intenta recargar la página.",
          variant: "destructive",
        });
      } finally {
        setCargandoPreguntas(false);
      }
    };

    cargarPreguntas();
  }, [navigate, toast, accessToken]);

  const calcularNivelSeguridad = (tiempoSegundos: number): 'seguro' | 'no_seguro' => {
    return tiempoSegundos < 10 ? 'seguro' : 'no_seguro';
  };

  const responderPregunta = (preguntaId: string, respuesta: string | boolean) => {
    if (!inicioTiempo) return;

    const tiempoTranscurrido = Math.floor((Date.now() - inicioTiempo) / 1000);
    
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
      // Filtrar solo las respuestas que corresponden a las preguntas actuales
      const idsPreguntasActuales = new Set(preguntas.map(p => p.id));
      
      // Crear un Map para eliminar duplicados (mantener solo la última respuesta por pregunta)
      const respuestasMap = new Map<string, RespuestaPregunta>();
      
      Object.values(respuestasParaEnviar).forEach(respuesta => {
        if (idsPreguntasActuales.has(respuesta.preguntaId)) {
          respuestasMap.set(respuesta.preguntaId, respuesta);
        }
      });
      
      const respuestasArray = Array.from(respuestasMap.values());
      
      console.log('📊 Ronda 2 - Total de preguntas:', preguntas.length);
      console.log('📊 Ronda 2 - Respuestas filtradas:', respuestasArray.length);
      
      // Verificar que todas las preguntas estén respondidas
      if (respuestasArray.length !== preguntas.length) {
        toast({
          title: "Error de validación",
          description: `Faltan ${preguntas.length - respuestasArray.length} pregunta(s) por responder.`,
          variant: "destructive",
        });
        setCargando(false);
        return;
      }

      // Verificar que no haya más respuestas que preguntas
      if (respuestasArray.length > preguntas.length) {
        console.error('❌ Ronda 2 - Hay más respuestas que preguntas:', respuestasArray.length, 'vs', preguntas.length);
        toast({
          title: "Error de validación",
          description: `Se detectaron respuestas duplicadas. Por favor recarga la página e intenta nuevamente.`,
          variant: "destructive",
        });
        setCargando(false);
        return;
      }

      const respuesta = await guardarRespuestasRonda2(accessToken, sesionId, respuestasArray);
      
      // Limpiar localStorage
      localStorage.removeItem('respuestasRonda1');
      localStorage.removeItem('respuestasRonda2');
      localStorage.removeItem('preguntasRonda1');
      localStorage.removeItem('preguntasRonda2');
      localStorage.setItem('estadoSesion', respuesta.data.estado);
      
      toast({
        title: "Test completado",
        description: "Tus respuestas han sido procesadas. Generando resultados...",
      });

      // Esperar un poco antes de redirigir para que el backend procese
      setTimeout(() => {
        navigate(`/orientacion/resultados/${sesionId}`);
      }, 1000);
      
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

  if (cargandoPreguntas) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando preguntas de Ronda 2...</p>
        </div>
      </div>
    );
  }

  if (preguntas.length === 0) {
    return (
      <div className="w-full">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No hay preguntas disponibles
                </h3>
                <p className="text-gray-600 mb-6">
                  No se encontraron preguntas para la Ronda 2. Por favor contacta al administrador.
                </p>
                <Button
                  onClick={() => navigate("/orientacion/ronda-1")}
                  variant="outline"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" /> Volver a Ronda 1
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-8">
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

              {pregunta?.opcionesRespuesta && pregunta.opcionesRespuesta.length > 0 ? (
                <RadioGroup 
                  value={respuestaSeleccionada || ""} 
                  onValueChange={setRespuestaSeleccionada}
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

              {pregunta?.opcionesRespuesta && pregunta.opcionesRespuesta.length > 0 && (
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
      </div>
    </div>
  );
};

export default Ronda2;
