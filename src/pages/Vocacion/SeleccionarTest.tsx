import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, LogOut, Compass, BrainCircuit, 
  ChevronLeft, CheckCircle2 
} from "lucide-react";
import { motion } from "framer-motion";
import { iniciarTest, TipoTest } from "@/lib/api/orientacionVocacional";

const SeleccionarTest = () => {
  const navigate = useNavigate();
  const { tokens, logout } = useAuth();
  const { toast } = useToast();
  const [tipoTest, setTipoTest] = useState<TipoTest | null>(null);
  const [cargando, setCargando] = useState(false);

  const accessToken = tokens?.accessToken || 
    JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleIniciarTest = async () => {
    if (!tipoTest) {
      toast({
        title: "Selección requerida",
        description: "Por favor selecciona un tipo de test para continuar",
        variant: "destructive",
      });
      return;
    }

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
      if (tipoTest === 'ICO') {
        // Flujo ICO: POST iniciar-test-ico (sin body) → GET preguntas → guardar y ir a test-ico
        const { iniciarTestIco, obtenerPreguntasIco } = await import('@/lib/api/orientacionVocacional');
        const resInicio = await iniciarTestIco(accessToken);
        const sesionId = resInicio.data.sesionId;
        localStorage.setItem('sesionId', sesionId);
        localStorage.setItem('tipoTest', 'ICO');
        localStorage.setItem('estadoSesion', resInicio.data.estado);

        const resPreguntas = await obtenerPreguntasIco(accessToken, sesionId);
        const preguntas = resPreguntas.data?.preguntas ?? [];
        localStorage.setItem('preguntasIco', JSON.stringify(preguntas));

        toast({
          title: "Test iniciado",
          description: "Has comenzado el test ICO",
        });
        navigate('/orientacion/test-ico');
        return;
      }

      // Holland RIASEC: iniciar-test con tipoTest → preguntas en respuesta → ronda-1
      const respuesta = await iniciarTest(accessToken, tipoTest);
      localStorage.setItem('sesionId', respuesta.data.sesionId);
      localStorage.setItem('tipoTest', respuesta.data.tipoTest);
      localStorage.setItem('estadoSesion', respuesta.data.estado);
      localStorage.setItem('preguntasRonda1', JSON.stringify(respuesta.data.preguntas));

      toast({
        title: "Test iniciado",
        description: "Has comenzado el test Holland RIASEC",
      });
      navigate('/orientacion/ronda-1');
      
    } catch (error: any) {
      console.error('Error al iniciar test:', error);
      
      if (error.status === 401) {
        toast({
          title: "Sesión expirada",
          description: error.message || "Tu sesión ha expirado. Por favor inicia sesión nuevamente.",
          variant: "destructive",
        });
        navigate("/login");
      } else if (error.status === 403) {
        toast({
          title: "Sin permisos",
          description: error.message || "No tienes permisos para realizar este test. Contacta al administrador.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Error al iniciar el test. Por favor intenta nuevamente.",
          variant: "destructive",
        });
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="w-full pb-24">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-5 md:mb-6">
            <BrainCircuit className="w-12 h-12 md:w-14 md:h-14 text-orange-500 mx-auto mb-2 md:mb-3" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              Selecciona el Tipo de Test
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              Elige el test que mejor se adapte a tus necesidades
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-5 mb-6">
            {/* Test Holland RIASEC */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all border-2 ${
                  tipoTest === "Holland_RIASEC"
                    ? "border-orange-500 bg-orange-50 shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setTipoTest("Holland_RIASEC")}
              >
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                        Test Holland RIASEC
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        Evalúa 6 dimensiones de personalidad vocacional:
                      </p>
                      <ul className="space-y-0.5 text-xs text-gray-600">
                        <li className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0" />
                          Realista (R), Investigador (I), Artístico (A)
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0" />
                          Social (S), Emprendedor (E), Convencional (C)
                        </li>
                      </ul>
                    </div>
                    {tipoTest === "Holland_RIASEC" && (
                      <CheckCircle2 className="h-5 w-5 text-orange-500 flex-shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Test ICO */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all border-2 ${
                  tipoTest === "ICO"
                    ? "border-orange-500 bg-orange-50 shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setTipoTest("ICO")}
              >
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                        Test ICO
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        Una sola ronda: preguntas Sí/No, puntuaciones RIASEC y recomendaciones con IA.
                      </p>
                      <ul className="space-y-0.5 text-xs text-gray-600">
                        <li className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0" />
                          Preguntas directas por dimensión
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0" />
                          Código Holland y perfil dominante/secundario
                        </li>
                        <li className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0" />
                          Carreras recomendadas y análisis LLM
                        </li>
                      </ul>
                    </div>
                    {tipoTest === "ICO" && (
                      <CheckCircle2 className="h-5 w-5 text-orange-500 flex-shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Botón Comenzar Test fijo abajo: siempre visible */}
      <div className="sticky bottom-0 left-0 right-0 z-10 py-4 bg-background/95 backdrop-blur border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="max-w-4xl mx-auto px-4 flex justify-center">
          <Button
            onClick={handleIniciarTest}
            disabled={!tipoTest || cargando}
            className="bg-[#F37021] hover:bg-orange-600 text-white rounded-lg px-8 h-12 font-bold text-base md:text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {cargando ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Iniciando...
              </>
            ) : (
              "Comenzar Test"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeleccionarTest;
