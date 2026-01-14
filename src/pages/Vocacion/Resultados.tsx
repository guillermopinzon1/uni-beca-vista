import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, LogOut, Compass, ChevronLeft, 
  Loader2, TrendingUp, BookOpen, Lightbulb, AlertCircle 
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

  const datosGrafico = resultados?.puntuaciones 
    ? Object.entries(resultados.puntuaciones).map(([dimension, puntuacion]) => ({
        dimension,
        puntuacion: Math.round(puntuacion * 100),
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

  if (error || !resultados) {
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
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
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
          <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-8 w-8" />
                <h2 className="text-3xl font-bold">Tu Perfil Vocacional</h2>
              </div>
              <h3 className="text-4xl font-black mb-2">{resultados.perfil_dominante}</h3>
              <p className="text-orange-50 text-lg mb-4">
                Nivel de confianza: <span className="font-bold">{Math.round(resultados.nivel_confianza * 100)}%</span>
              </p>
              {resultados.perfiles_secundarios && resultados.perfiles_secundarios.length > 0 && (
                <div className="mt-4">
                  <p className="text-orange-50 mb-2">Perfiles Secundarios:</p>
                  <div className="flex flex-wrap gap-2">
                    {resultados.perfiles_secundarios.map((perfil, index) => (
                      <span 
                        key={index}
                        className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium"
                      >
                        {perfil}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

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
                      formatter={(value: number) => [`${value}%`, 'Puntuación']}
                    />
                    <Bar dataKey="puntuacion" fill="#F37021" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {resultados.recomendaciones_carreras && resultados.recomendaciones_carreras.length > 0 && (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-orange-500" />
                  Carreras Recomendadas
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {resultados.recomendaciones_carreras.map((carrera, index) => (
                    <div 
                      key={index}
                      className="p-6 rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all bg-white"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-xl font-bold text-gray-900">{carrera.nombre}</h4>
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
                          {Math.round(carrera.match_score * 100)}%
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{carrera.descripcion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {resultados.recomendaciones_actividades && resultados.recomendaciones_actividades.length > 0 && (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-orange-500" />
                  Actividades Recomendadas
                </h3>
                <ul className="space-y-3">
                  {resultados.recomendaciones_actividades.map((actividad, index) => (
                    <li 
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-100"
                    >
                      <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{actividad}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {resultados.analisis_llm && (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Análisis Personalizado</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {resultados.analisis_llm.resumen}
                  </p>
                  {resultados.analisis_llm.fortalezas && resultados.analisis_llm.fortalezas.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-bold text-gray-900 mb-2">Fortalezas:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {resultados.analisis_llm.fortalezas.map((fortaleza, index) => (
                          <li key={index}>{fortaleza}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {resultados.analisis_llm.areas_mejora && resultados.analisis_llm.areas_mejora.length > 0 && (
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Áreas de Mejora:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {resultados.analisis_llm.areas_mejora.map((area, index) => (
                          <li key={index}>{area}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {resultados.discrepancias_detectadas && resultados.discrepancias_detectadas.length > 0 && (
            <Card className="border-none shadow-sm rounded-xl border-yellow-200 bg-yellow-50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                  Observaciones
                </h3>
                <div className="space-y-4">
                  {resultados.discrepancias_detectadas.map((discrepancia, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-lg bg-white border border-yellow-200"
                    >
                      <strong className="text-yellow-800 block mb-2">{discrepancia.tipo}</strong>
                      <p className="text-gray-700">{discrepancia.descripcion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
