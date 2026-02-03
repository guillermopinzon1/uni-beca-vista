import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2, TrendingUp, BookOpen, Lightbulb, Target, CheckCircle2,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  obtenerResultadosIco,
  GuardarRespuestasIcoResponse,
} from "@/lib/api/orientacionVocacional";

type ResultadoIcoData = GuardarRespuestasIcoResponse["data"];

const ResultadosICO = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tokens } = useAuth();
  const { toast } = useToast();

  const [data, setData] = useState<ResultadoIcoData | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const accessToken =
    tokens?.accessToken ||
    JSON.parse(localStorage.getItem("auth_tokens") || "null")?.accessToken;

  useEffect(() => {
    const estado = location.state as { resultadoIco?: ResultadoIcoData; sesionId?: string } | undefined;
    if (estado?.resultadoIco) {
      setData(estado.resultadoIco);
      setCargando(false);
      return;
    }

    // sesionId: desde Historial (state) o desde localStorage (recién terminado el test)
    const sesionId = estado?.sesionId ?? localStorage.getItem("sesionId");
    if (!sesionId || !accessToken) {
      setError("No se encontró la sesión. Completa el test o inicia uno nuevo.");
      setCargando(false);
      return;
    }

    const cargar = async () => {
      try {
        const res = await obtenerResultadosIco(accessToken, sesionId);
        const d = res.data;
        setData({
          resultadoId: (d as any).id,
          puntuaciones: (d as any).puntuaciones_finales ?? {},
          codigoHolland: (d as any).codigo_holland ?? "",
          perfilDominante: (d as any).perfil_dominante ?? "",
          perfilSecundario: (d as any).perfil_secundario ?? "",
          analisisLlm: (d as any).analisis_llm,
          recomendacionesCarreras: (d as any).recomendaciones_carreras ?? [],
        });
      } catch (e: any) {
        setError(e?.message || "Error al cargar resultados.");
        toast({
          title: "Error",
          description: e?.message || "No se pudieron cargar los resultados ICO.",
          variant: "destructive",
        });
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [accessToken, location.state, toast]);

  const puntuaciones = data?.puntuaciones ?? {};
  const datosGrafico = Object.entries(puntuaciones).map(([dimension, puntuacion]) => ({
    dimension,
    puntuacion: Math.round(Number(puntuacion)),
  }));

  const codigoHolland = data?.codigoHolland ?? "N/A";
  const perfilDominante = data?.perfilDominante ?? "No disponible";
  const perfilSecundario = data?.perfilSecundario ?? "";
  const recomendacionesCarreras = data?.recomendacionesCarreras ?? [];
  const analisisLlm = data?.analisisLlm;
  const perfilVocacional = analisisLlm?.perfilVocacional;
  // Priorizar recomendacionesCarreras (trae facultad/area); si no hay, usar carrerasRecomendadas del LLM
  const carrerasRecomendadas =
    recomendacionesCarreras.length > 0
      ? recomendacionesCarreras
      : analisisLlm?.carrerasRecomendadas ?? [];
  const sugerenciasAcompanamiento = analisisLlm?.sugerenciasAcompanamiento ?? [];

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full">
        <main className="w-full">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-6">{error || "No se pudieron cargar los resultados"}</p>
              <Button onClick={() => navigate("/orientacion/historial")}>
                Ver Historial
              </Button>
              <Button
                variant="outline"
                className="ml-3"
                onClick={() => navigate("/orientacion/seleccionar-test")}
              >
                Iniciar otro test
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Perfil y código Holland */}
          <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-8 w-8" />
                <h2 className="text-3xl font-bold">Resultados Test ICO</h2>
              </div>
              <div className="mb-4">
                <h3 className="text-4xl font-black mb-2">{perfilDominante}</h3>
                {perfilSecundario && (
                  <p className="text-orange-50 text-lg">
                    Perfil Secundario: <span className="font-bold">{perfilSecundario}</span>
                  </p>
                )}
              </div>
              <p className="text-orange-50 text-lg">
                Código Holland: <span className="font-bold text-2xl">{codigoHolland}</span>
              </p>
            </CardContent>
          </Card>

          {/* Gráfico puntuaciones RIASEC */}
          {datosGrafico.length > 0 && (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                  Puntuaciones por Dimensión (RIASEC)
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
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => [`${value}`, "Puntuación"]} />
                    <Bar dataKey="puntuacion" fill="#F37021" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Análisis LLM - Resumen */}
          {perfilVocacional?.resumen && (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Target className="h-6 w-6 text-orange-500" />
                  Perfil Vocacional (análisis)
                </h3>
                <p className="text-gray-700 leading-relaxed">{perfilVocacional.resumen}</p>
              </CardContent>
            </Card>
          )}

          {/* Fortalezas y áreas a explorar */}
          {(perfilVocacional?.fortalezas?.length || perfilVocacional?.areasExplorar?.length) ? (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-orange-500" />
                  Fortalezas y áreas a explorar
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {perfilVocacional?.fortalezas && perfilVocacional.fortalezas.length > 0 && (
                    <div>
                      <h4 className="font-bold text-green-700 mb-3">Fortalezas</h4>
                      <ul className="space-y-2">
                        {perfilVocacional.fortalezas.map((f: string, i: number) => (
                          <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {perfilVocacional?.areasExplorar && perfilVocacional.areasExplorar.length > 0 && (
                    <div>
                      <h4 className="font-bold text-blue-700 mb-3">Áreas a explorar</h4>
                      <ul className="space-y-2">
                        {perfilVocacional.areasExplorar.map((a: string, i: number) => (
                          <li key={i} className="text-gray-700 text-sm flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* Carreras recomendadas */}
          {carrerasRecomendadas.length > 0 && (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-orange-500" />
                  Carreras Recomendadas
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {carrerasRecomendadas.map(
                    (c: { nombre?: string; name?: string; razon: string; facultad?: string; area?: string }, index: number) => {
                      const titulo = c.nombre ?? c.name ?? "Carrera recomendada";
                      const tituloConFacultad = c.facultad ? `${titulo} — Facultad de ${c.facultad}` : titulo;
                      return (
                        <div
                          key={index}
                          className="p-6 rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all bg-white"
                        >
                          <div className="border-l-4 border-orange-500 pl-3 mb-3">
                            <h4 className="text-xl font-bold text-gray-900">{tituloConFacultad}</h4>
                            {c.area && (
                              <p className="text-orange-600 text-sm font-medium mt-1">{c.area}</p>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">{c.razon}</p>
                        </div>
                      );
                    }
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sugerencias de acompañamiento */}
          {sugerenciasAcompanamiento.length > 0 && (
            <Card className="border-none shadow-sm rounded-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-orange-500" />
                  Sugerencias de Acompañamiento
                </h3>
                <ul className="space-y-3">
                  {sugerenciasAcompanamiento.map((s: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-100"
                    >
                      <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{s}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Botones */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={() => navigate("/orientacion/perfil")}
              className="bg-[#F37021] hover:bg-orange-600 text-white px-8 h-12 font-bold"
            >
              Ver Mi Perfil Completo
            </Button>
            <Button
              onClick={() => navigate("/orientacion/historial")}
              variant="outline"
              className="px-8 h-12 font-bold"
            >
              Ver Historial
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultadosICO;
