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
      const respuesta = await iniciarTest(accessToken, tipoTest);
      
      // Guardar datos en localStorage
      localStorage.setItem('sesionId', respuesta.data.sesionId);
      localStorage.setItem('tipoTest', respuesta.data.tipoTest);
      localStorage.setItem('estadoSesion', respuesta.data.estado);
      localStorage.setItem('preguntasRonda1', JSON.stringify(respuesta.data.preguntas));
      
      toast({
        title: "Test iniciado",
        description: `Has comenzado el test ${tipoTest === 'Holland_RIASEC' ? 'Holland RIASEC' : 'Kuder'}`,
      });

      // Redirigir a Ronda 1
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
    <div className="w-full">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <BrainCircuit className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Selecciona el Tipo de Test
            </h2>
            <p className="text-gray-500 text-lg">
              Elige el test que mejor se adapte a tus necesidades
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Test Holland RIASEC */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all border-2 ${
                  tipoTest === 'Holland_RIASEC' 
                    ? 'border-orange-500 bg-orange-50 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setTipoTest('Holland_RIASEC')}
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Test Holland RIASEC
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Evalúa 6 dimensiones de personalidad vocacional:
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Realista (R)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Investigador (I)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Artístico (A)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Social (S)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Emprendedor (E)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Convencional (C)
                        </li>
                      </ul>
                    </div>
                    {tipoTest === 'Holland_RIASEC' && (
                      <CheckCircle2 className="h-6 w-6 text-orange-500 flex-shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Test Kuder */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all border-2 ${
                  tipoTest === 'Kuder' 
                    ? 'border-orange-500 bg-orange-50 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setTipoTest('Kuder')}
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Test Kuder
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Evalúa 10 áreas de interés profesional:
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Mecánico, Científico, Computacional
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Artístico, Literario, Musical
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Social, Administrativo, Al aire libre
                        </li>
                      </ul>
                    </div>
                    {tipoTest === 'Kuder' && (
                      <CheckCircle2 className="h-6 w-6 text-orange-500 flex-shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="text-center">
            <Button
              onClick={handleIniciarTest}
              disabled={!tipoTest || cargando}
              className="bg-[#F37021] hover:bg-orange-600 text-white rounded-md px-10 h-12 font-bold transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};

export default SeleccionarTest;
