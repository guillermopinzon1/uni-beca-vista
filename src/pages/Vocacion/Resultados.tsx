import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, LogOut, Compass, ChevronLeft, 
  Loader2, TrendingUp, BookOpen, Lightbulb, Target, CheckCircle2
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { obtenerResultados, ResultadosResponse } from "@/lib/api/orientacionVocacional";

const Resultados = () => {
  const navigate = useNavigate();
  const { sesionId: sesionIdParam } = useParams();
  const { tokens, logout } = useAuth();
  const { toast } = useToast();
  
  const [resultados, setResultados] = useState<ResultadosResponse['data'] | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const accessToken = tokens?.accessToken || 
    JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;

  useEffect(() => {
    const cargarResultados = async () => {
      if (!accessToken) {
        toast({
          title: "Sesión expirada",
          description: "Por favor inicia sesión nuevamente",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const sesionId = sesionIdParam || localStorage.getItem('sesionId');
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
      setError(null);

      try {
        const respuesta = await obtenerResultados(accessToken, sesionId);
        setResultados(respuesta.data);
      } catch (error: any) {
        console.error('Error al cargar resultados:', error);
        const mensajeError = error.message || "Error al cargar resultados";
        setError(mensajeError);
        toast({
          title: "Error",
          description: mensajeError,
          variant: "destructive",
        });
      } finally {
        setCargando(false);
      }
    };

    cargarResultados();
  }, [accessToken, sesionIdParam, navigate, toast]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const datosGrafico = resultados?.puntuacionesFinales 
    ? Object.entries(resultados.puntuacionesFinales).map(([dimension, puntuacion]) => ({
        dimension,
        puntuacion: Math.round(puntuacion),
      }))
    : [];

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Generando tus resultados...</p>
        </div>
      </div>
    );
  }

  if (error || !resultados || !resultados.resultado) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <header className="bg-white border-b border-gray-100 px-6 py-4">
          <div className="max-w-[1400px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/orientacion/historial")}
                className="flex items-center gap-1 text-orange-500 font-medium hover:underline text-sm"
              >
                <ChevronLeft className="h-4 w-4" /> Volver
              </button>
              <div className="flex flex-col">
                <h1 className="text-[#F37021] text-xl font-bold leading-tight">
                  Universidad Metropolitana
                </h1>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-tight">
                  Orientación Vocacional
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-6">{error || "No se pudieron cargar los resultados"}</p>
              <Button onClick={() => navigate('/orientacion/historial')}>
                Ver Historial
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const { resultado } = resultados;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/orientacion/historial")}
              className="flex items-center gap-1 text-orange-500 font-medium hover:underline text-sm"
            >
              <ChevronLeft className="h-4 w-4" /> Volver
            </button>
            <div className="flex flex-col">
              <h1 className="text-[#F37021] text-xl font-bold leading-tight">
                Universidad Metropolitana
              </h1>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-tight">
                Resultados del Test
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
          <span className="font-bold text-gray-900">Resultados</span>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Perfil Dominante */}
          <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-8 w-8" />
                <h2 className="text-3xl font-bold">Tu Perfil Vocacional</h2>
              </div>
              <div className="mb-4">
                <h3 className="text-4xl font-black mb-2">{resultado.perfilDominante}</h3>
                {resultado.perfilSecundario && (
                  <p className="text-orange-50 text-lg">
                    Perfil Secundario: <span className="font-bold">{resultado.perfilSecundario}</span>
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p className="text-orange-50 text-lg">
                  Código Holland: <span className="font-bold text-2xl">{resultado.codigoHolland}</span>
                </p>
                <p className="text-orange-50 text-lg">
                  Nivel de confianza: <span className="font-bold">{Math.round(resultado.nivelConfianza)}%</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Puntuaciones */}
          {datosGrafico.length > 0 && (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                  Puntuaciones por Dimensión
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={datosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="dimension" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      domain={[0, 100]}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value}`, 'Puntuación']}
                    />
                    <Bar dataKey="puntuacion" fill="#F37021" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Recomendaciones de Carreras */}
          {resultado.recomendacionesCarreras && resultado.recomendacionesCarreras.length > 0 && (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-orange-500" />
                  Carreras Recomendadas
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {resultado.recomendacionesCarreras.map((carrera, index) => (
                    <div 
                      key={index}
                      className="p-6 rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all bg-white"
                    >
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{carrera.name}</h4>
                      <p className="text-gray-600 text-sm">{carrera.razon}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Perfil Vocacional */}
          {resultado.perfilVocacional && (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Target className="h-6 w-6 text-orange-500" />
                  Perfil Vocacional
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {resultado.perfilVocacional.fortalezas && resultado.perfilVocacional.fortalezas.length > 0 && (
                    <div>
                      <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Fortalezas
                      </h4>
                      <ul className="space-y-2">
                        {resultado.perfilVocacional.fortalezas.map((fortaleza, index) => (
                          <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {fortaleza}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {resultado.perfilVocacional.debilidades && resultado.perfilVocacional.debilidades.length > 0 && (
                    <div>
                      <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Debilidades
                      </h4>
                      <ul className="space-y-2">
                        {resultado.perfilVocacional.debilidades.map((debilidad, index) => (
                          <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            {debilidad}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {resultado.perfilVocacional.oportunidades && resultado.perfilVocacional.oportunidades.length > 0 && (
                    <div>
                      <h4 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        Oportunidades
                      </h4>
                      <ul className="space-y-2">
                        {resultado.perfilVocacional.oportunidades.map((oportunidad, index) => (
                          <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            {oportunidad}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Áreas de Desarrollo */}
          {resultado.areasDesarrollo && resultado.areasDesarrollo.length > 0 && (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Target className="h-6 w-6 text-orange-500" />
                  Áreas de Desarrollo
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {resultado.areasDesarrollo.map((area, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-lg bg-gray-50 border border-gray-100"
                    >
                      <span className="text-gray-700">{area}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sugerencias de Acompañamiento */}
          {resultado.sugerenciasAcompanamiento && resultado.sugerenciasAcompanamiento.length > 0 && (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-orange-500" />
                  Sugerencias de Acompañamiento
                </h3>
                <ul className="space-y-3">
                  {resultado.sugerenciasAcompanamiento.map((sugerencia, index) => (
                    <li 
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-100"
                    >
                      <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{sugerencia}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Plan de Desarrollo */}
          {resultado.planDesarrollo && (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Target className="h-6 w-6 text-orange-500" />
                  Plan de Desarrollo
                </h3>
                <div className="space-y-6">
                  {resultado.planDesarrollo.cortoPlazo && resultado.planDesarrollo.cortoPlazo.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">Corto Plazo</h4>
                      <ul className="space-y-2">
                        {resultado.planDesarrollo.cortoPlazo.map((item, index) => (
                          <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {resultado.planDesarrollo.medianoPlazo && resultado.planDesarrollo.medianoPlazo.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">Mediano Plazo</h4>
                      <ul className="space-y-2">
                        {resultado.planDesarrollo.medianoPlazo.map((item, index) => (
                          <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {resultado.planDesarrollo.largoPlazo && resultado.planDesarrollo.largoPlazo.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3">Largo Plazo</h4>
                      <ul className="space-y-2">
                        {resultado.planDesarrollo.largoPlazo.map((item, index) => (
                          <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={() => navigate('/orientacion/perfil')}
              className="bg-[#F37021] hover:bg-orange-600 text-white px-8 h-12 font-bold"
            >
              Ver Mi Perfil Completo
            </Button>
            <Button
              onClick={() => navigate('/orientacion/historial')}
              variant="outline"
              className="px-8 h-12 font-bold"
            >
              Ver Historial
            </Button>
            <Button
              onClick={() => navigate('/orientacion/seleccionar-test')}
              variant="outline"
              className="px-8 h-12 font-bold"
            >
              Realizar Otro Test
            </Button>
          </div>
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

export default Resultados;
