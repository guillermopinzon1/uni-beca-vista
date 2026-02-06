import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2, TrendingUp, BookOpen, Lightbulb, Target, CheckCircle2, GraduationCap, ExternalLink, Calendar, DollarSign, FileCheck,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  obtenerResultadosIco,
  GuardarRespuestasIcoResponse,
} from "@/lib/api/orientacionVocacional";
import { prepararDatosDimensiones } from "@/lib/riasec";

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
  const datosGrafico = prepararDatosDimensiones(
    puntuaciones as Record<string, number>
  );

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
                <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                  Puntuaciones por Dimensión (RIASEC)
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  Cada barra representa tu puntuación en una dimensión del modelo Holland. Pasa el cursor sobre una barra o revisa la tabla para ver qué significa cada una.
                </p>
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart data={datosGrafico} margin={{ top: 10, right: 20, left: 10, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="nombreCompleto"
                      angle={-35}
                      textAnchor="end"
                      height={80}
                      tick={{ fontSize: 13, fill: "#475569" }}
                      interval={0}
                    />
                    <YAxis
                      domain={[0, (dataMax: number) => Math.max(100, Math.ceil((dataMax || 0) * 1.1))]}
                      tick={{ fontSize: 12 }}
                      label={{ value: "Puntuación", angle: -90, position: "insideLeft", style: { fontSize: 12 } }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const p = payload[0].payload as { nombreCompleto: string; puntuacion: number; descripcion: string };
                        return (
                          <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-4 max-w-xs">
                            <p className="font-bold text-slate-900 mb-1">{p.nombreCompleto}</p>
                            <p className="text-orange-600 font-semibold mb-2">Puntuación: {p.puntuacion}</p>
                            <p className="text-slate-600 text-sm">{p.descripcion}</p>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="puntuacion" fill="#F37021" radius={[8, 8, 0, 0]} name="Puntuación" />
                  </BarChart>
                </ResponsiveContainer>
                {/* Tabla detalle dimensiones */}
                <div className="mt-6 rounded-lg border border-slate-200 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Dimensión</th>
                        <th className="text-center py-3 px-4 font-semibold text-slate-700 w-24">Puntuación</th>
                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Qué significa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datosGrafico.map((d, i) => (
                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium text-slate-900">{d.nombreCompleto}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center justify-center min-w-[2.5rem] py-1 px-2 rounded-md bg-orange-100 text-orange-800 font-semibold">
                              {d.puntuacion}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{d.descripcion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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

          {/* Invitación PDU - Prueba Diagnóstica de Ubicación - Diseño mejorado */}
          <Card className="relative overflow-hidden rounded-2xl border-0 shadow-lg bg-gradient-to-br from-[#F37021] via-[#e65c15] to-amber-700">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" aria-hidden />
            <CardContent className="relative p-8 sm:p-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div className="text-white space-y-4 max-w-xl">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/95">
                    Siguiente paso
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold leading-tight">
                    Ya tomaste la decisión. ¡Realiza la PDU, te esperamos!
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                    Inscríbete a la Prueba Diagnóstica de Ubicación (PDU) de la UNIMET. Evalúa tus habilidades verbales y cuantitativas para el ingreso a la universidad.
                  </p>
                  <ul className="flex flex-wrap gap-3 text-sm text-white/90">
                    <li className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-amber-200" />
                      <span>Fechas y modalidad</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-amber-200" />
                      <span>Costos y métodos de pago</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-amber-200" />
                      <span>Inscripción en línea</span>
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col items-center md:items-end gap-4 shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                    <GraduationCap className="h-10 w-10 text-white" />
                  </div>
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-[#F37021] hover:bg-white/95 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all px-8 h-12 border-0"
                  >
                    <a
                      href="https://www.unimet.edu.ve/pregrado/vias-de-ingreso/pdu/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      Ir a inscripciones PDU
                    </a>
                  </Button>
                  <span className="text-xs text-white/70">Se abre en nueva pestaña</span>
                </div>
              </div>
            </CardContent>
          </Card>

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
