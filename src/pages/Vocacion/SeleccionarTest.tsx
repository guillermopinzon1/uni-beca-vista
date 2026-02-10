import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Compass,
  BrainCircuit,
  CheckCircle2,
  Loader2,
  Sparkles,
  BarChart3,
  Clock,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import { iniciarTest, TipoTest, obtenerHistorial, obtenerSesion, obtenerPreguntasIco } from "@/lib/api/orientacionVocacional";

/** Considera una sesión completada si tiene resultado o estado finalizado. */
function sesionCompletada(
  estado: string | undefined,
  tieneResultado?: boolean,
  item?: Record<string, unknown>
): boolean {
  const tiene = tieneResultado === true || item?.tiene_resultado === true;
  if (tiene) return true;
  const e = (estado || (item?.estado as string) || "").toString().toLowerCase();
  return /finalizada|completada|completed|ronda_2_completada/.test(e);
}

/** Normaliza tipo de test (camelCase o snake_case). */
function tipoTestDeSesion(s: Record<string, unknown>): string | undefined {
  return (s.tipoTest as string) ?? (s.tipo_test as string);
}

/** Texto "donde quedó" según estado de la sesión. */
function dondeQuedo(estado: string | undefined, tipoTest: string): string {
  const e = (estado ?? "").toString().toLowerCase();
  if (tipoTest === "ICO") return "Test ICO en curso";
  if (/ronda_2|ronda_1_completada/.test(e)) return "Ronda 2";
  return "Ronda 1";
}

function idDeSesion(s: Record<string, unknown>): string {
  return String((s.id ?? s.sesion_id ?? s.sesionId ?? "") || "");
}

const SeleccionarTest = () => {
  const navigate = useNavigate();
  const { tokens, logout } = useAuth();
  const { toast } = useToast();
  const [tipoTest, setTipoTest] = useState<TipoTest | null>(null);
  const [cargando, setCargando] = useState(false);
  const [yaTieneHolland, setYaTieneHolland] = useState(false);
  const [yaTieneIco, setYaTieneIco] = useState(false);
  const [sesionIdHolland, setSesionIdHolland] = useState<string | null>(null);
  const [sesionIdIco, setSesionIdIco] = useState<string | null>(null);
  const [hollandEnProgreso, setHollandEnProgreso] = useState<Record<string, unknown> | null>(null);
  const [icoEnProgreso, setIcoEnProgreso] = useState<Record<string, unknown> | null>(null);
  const [cargandoHistorial, setCargandoHistorial] = useState(true);
  const [continuandoId, setContinuandoId] = useState<string | null>(null);

  const accessToken = tokens?.accessToken || 
    JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;

  useEffect(() => {
    if (!accessToken) {
      setCargandoHistorial(false);
      return;
    }
    obtenerHistorial(accessToken)
      .then((res) => {
        const raw = res.data;
        const data = raw && typeof raw === "object" ? (raw as { historial?: unknown[]; sesionesEnProgreso?: unknown[] }) : {};
        const historial: Record<string, unknown>[] = Array.isArray(data.historial)
          ? (data.historial as Record<string, unknown>[])
          : Array.isArray(raw)
            ? (raw as Record<string, unknown>[])
            : [];
        const sesionesEnProgreso: Record<string, unknown>[] = Array.isArray(data.sesionesEnProgreso)
          ? (data.sesionesEnProgreso as Record<string, unknown>[])
          : [];
        const hollandCompletada = historial.find((s) => {
          const tipo = tipoTestDeSesion(s);
          return tipo === "Holland_RIASEC" && sesionCompletada(s.estado as string, s.tieneResultado as boolean, s);
        });
        const icoCompletada = historial.find((s) => {
          const tipo = tipoTestDeSesion(s);
          return tipo === "ICO" && sesionCompletada(s.estado as string, s.tieneResultado as boolean, s);
        });
        const hollandProgreso = sesionesEnProgreso.find((s) => tipoTestDeSesion(s) === "Holland_RIASEC") ?? null;
        const icoProgreso = sesionesEnProgreso.find((s) => tipoTestDeSesion(s) === "ICO") ?? null;
        setYaTieneHolland(!!hollandCompletada);
        setYaTieneIco(!!icoCompletada);
        setHollandEnProgreso(hollandProgreso as Record<string, unknown> | null);
        setIcoEnProgreso(icoProgreso as Record<string, unknown> | null);
        const idDe = (s: Record<string, unknown>) => String((s.id ?? s.sesion_id ?? s.sesionId ?? "") || "");
        setSesionIdHolland(hollandCompletada ? idDe(hollandCompletada) || null : null);
        setSesionIdIco(icoCompletada ? idDe(icoCompletada) || null : null);
      })
      .catch(() => {})
      .finally(() => setCargandoHistorial(false));
  }, [accessToken]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const continuarTest = async (sesion: Record<string, unknown>) => {
    const id = idDeSesion(sesion);
    const tipoTest = tipoTestDeSesion(sesion) ?? "Holland_RIASEC";
    const estado = (sesion.estado ?? "").toString().toLowerCase();
    if (!accessToken || !id) return;
    setContinuandoId(id);
    try {
      localStorage.setItem("sesionId", id);
      localStorage.setItem("tipoTest", tipoTest);
      localStorage.setItem("estadoSesion", (sesion.estado ?? "iniciada") as string);
      if (tipoTest === "ICO") {
        const res = await obtenerPreguntasIco(accessToken, id);
        const preguntas = (res?.data as { preguntas?: unknown[] })?.preguntas ?? [];
        localStorage.setItem("preguntasIco", JSON.stringify(preguntas));
        navigate("/orientacion/test-ico");
        return;
      }
      if (tipoTest === "Holland_RIASEC") {
        if (estado === "ronda_1_completada" || estado === "ronda_2") {
          const sesionInfo = await obtenerSesion(accessToken, id);
          const preguntasR2 = (sesionInfo?.data as { preguntasRonda2?: unknown[] })?.preguntasRonda2 ?? [];
          if (preguntasR2.length > 0) {
            localStorage.setItem("preguntasRonda2", JSON.stringify(preguntasR2));
            navigate("/orientacion/ronda-2");
            return;
          }
        }
        navigate("/orientacion/ronda-1");
      }
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? (err as { message: string }).message : "No se pudo cargar el test.";
      toast({ title: "Error al continuar", description: msg, variant: "destructive" });
    } finally {
      setContinuandoId(null);
    }
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
          title: "Test ya realizado",
          description: error.message || "Ya completaste este test. Solo puedes realizar uno por tipo.",
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

  const ambosCompletados = yaTieneHolland && yaTieneIco;
  const puedeIniciar = tipoTest && !cargando
    && !(tipoTest === "Holland_RIASEC" && (yaTieneHolland || hollandEnProgreso))
    && !(tipoTest === "ICO" && (yaTieneIco || icoEnProgreso));

  return (
    <div className="w-full min-h-[70vh] pb-28">
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero / Título */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-8 md:mb-10"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200 mb-4">
              <Compass className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight">
              Tests de Orientación Vocacional
            </h1>
            <p className="text-slate-600 text-base md:text-lg max-w-xl mx-auto">
              Elige un test para descubrir tu perfil vocacional y las carreras que mejor se alinean contigo.
            </p>
            {cargandoHistorial && (
              <p className="text-sm text-slate-500 mt-2 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Verificando tu historial...
              </p>
            )}
          </motion.div>

          {/* Tarjetas de tests */}
          <div className="grid md:grid-cols-2 gap-5 md:gap-6 mb-8">
            {/* Test Holland RIASEC */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              whileHover={yaTieneHolland ? undefined : { y: -4, transition: { duration: 0.2 } }}
              whileTap={yaTieneHolland ? undefined : { scale: 0.99 }}
            >
              <Card
                className={`overflow-hidden transition-all duration-200 border-2 h-full ${
                  yaTieneHolland
                    ? "border-slate-200 bg-slate-50/80 cursor-default"
                    : hollandEnProgreso
                      ? "border-amber-300 bg-amber-50/50"
                      : tipoTest === "Holland_RIASEC"
                        ? "border-orange-500 bg-gradient-to-br from-orange-50 to-white shadow-xl shadow-orange-100 ring-2 ring-orange-200/50"
                        : "border-slate-200 bg-white hover:border-orange-300 hover:shadow-md cursor-pointer"
                }`}
                onClick={() => !yaTieneHolland && !hollandEnProgreso && setTipoTest("Holland_RIASEC")}
              >
                <CardContent className="p-0">
                  <div className="p-5 md:p-6">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                        yaTieneHolland ? "bg-slate-200 text-slate-500" : hollandEnProgreso ? "bg-amber-100 text-amber-700" : "bg-orange-100 text-orange-600"
                      }`}>
                        <BarChart3 className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-lg md:text-xl font-bold text-slate-900">
                            Test Holland RIASEC
                          </h3>
                          {yaTieneHolland && (
                            <Badge className="bg-emerald-100 text-emerald-800 border-0 shrink-0">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Completado
                            </Badge>
                          )}
                          {!yaTieneHolland && hollandEnProgreso && (
                            <Badge className="bg-amber-100 text-amber-800 border-0 shrink-0">
                              <Clock className="w-3 h-3 mr-1" />
                              En progreso
                            </Badge>
                          )}
                        </div>
                        {!yaTieneHolland && hollandEnProgreso && (
                          <p className="text-amber-800 text-sm font-medium mb-2">
                            Quedaste en {dondeQuedo(hollandEnProgreso.estado as string, "Holland_RIASEC")}
                          </p>
                        )}
                        <p className="text-slate-600 text-sm mb-3">
                          Evalúa tus intereses en 6 dimensiones: Realista, Investigador, Artístico, Social, Emprendedor y Convencional.
                        </p>
                        <ul className="space-y-1.5 text-sm text-slate-600">
                          <li className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                            Dos rondas de preguntas
                          </li>
                          <li className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-orange-500 shrink-0" />
                            Código Holland y carreras recomendadas
                          </li>
                        </ul>
                        {yaTieneHolland && sesionIdHolland && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-4 w-full sm:w-auto border-orange-200 text-orange-700 hover:bg-orange-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/orientacion/resultados/${sesionIdHolland}`);
                            }}
                          >
                            Ver mis resultados
                          </Button>
                        )}
                        {!yaTieneHolland && hollandEnProgreso && (
                          <Button
                            type="button"
                            size="sm"
                            className="mt-4 w-full sm:w-auto bg-[#F37021] hover:bg-orange-600 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              continuarTest(hollandEnProgreso);
                            }}
                            disabled={continuandoId === idDeSesion(hollandEnProgreso)}
                          >
                            {continuandoId === idDeSesion(hollandEnProgreso) ? (
                              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Cargando...</>
                            ) : (
                              "Continuar"
                            )}
                          </Button>
                        )}
                      </div>
                      {tipoTest === "Holland_RIASEC" && !yaTieneHolland && !hollandEnProgreso && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Test ICO */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              whileHover={yaTieneIco ? undefined : { y: -4, transition: { duration: 0.2 } }}
              whileTap={yaTieneIco ? undefined : { scale: 0.99 }}
            >
              <Card
                className={`overflow-hidden transition-all duration-200 border-2 h-full ${
                  yaTieneIco
                    ? "border-slate-200 bg-slate-50/80 cursor-default"
                    : icoEnProgreso
                      ? "border-amber-300 bg-amber-50/50"
                      : tipoTest === "ICO"
                        ? "border-orange-500 bg-gradient-to-br from-orange-50 to-white shadow-xl shadow-orange-100 ring-2 ring-orange-200/50"
                        : "border-slate-200 bg-white hover:border-orange-300 hover:shadow-md cursor-pointer"
                }`}
                onClick={() => !yaTieneIco && !icoEnProgreso && setTipoTest("ICO")}
              >
                <CardContent className="p-0">
                  <div className="p-5 md:p-6">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                        yaTieneIco ? "bg-slate-200 text-slate-500" : icoEnProgreso ? "bg-amber-100 text-amber-700" : "bg-orange-100 text-orange-600"
                      }`}>
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-lg md:text-xl font-bold text-slate-900">
                            Test ICO
                          </h3>
                          {yaTieneIco && (
                            <Badge className="bg-emerald-100 text-emerald-800 border-0 shrink-0">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Completado
                            </Badge>
                          )}
                          {!yaTieneIco && icoEnProgreso && (
                            <Badge className="bg-amber-100 text-amber-800 border-0 shrink-0">
                              <Clock className="w-3 h-3 mr-1" />
                              En progreso
                            </Badge>
                          )}
                        </div>
                        {!yaTieneIco && icoEnProgreso && (
                          <p className="text-amber-800 text-sm font-medium mb-2">
                            {dondeQuedo(icoEnProgreso.estado as string, "ICO")}
                          </p>
                        )}
                        <p className="text-slate-600 text-sm mb-3">
                          Versión corta con preguntas Sí/No. Incluye análisis con inteligencia artificial y recomendaciones de carreras.
                        </p>
                        <ul className="space-y-1.5 text-sm text-slate-600">
                          <li className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                            Una sola ronda, más rápido
                          </li>
                          <li className="flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4 text-orange-500 shrink-0" />
                            Perfil RIASEC y análisis con IA
                          </li>
                        </ul>
                        {yaTieneIco && sesionIdIco && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-4 w-full sm:w-auto border-orange-200 text-orange-700 hover:bg-orange-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/orientacion/resultados-ico", { state: { sesionId: sesionIdIco } });
                            }}
                          >
                            Ver mis resultados
                          </Button>
                        )}
                        {!yaTieneIco && icoEnProgreso && (
                          <Button
                            type="button"
                            size="sm"
                            className="mt-4 w-full sm:w-auto bg-[#F37021] hover:bg-orange-600 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              continuarTest(icoEnProgreso);
                            }}
                            disabled={continuandoId === idDeSesion(icoEnProgreso)}
                          >
                            {continuandoId === idDeSesion(icoEnProgreso) ? (
                              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Cargando...</>
                            ) : (
                              "Continuar"
                            )}
                          </Button>
                        )}
                      </div>
                      {tipoTest === "ICO" && !yaTieneIco && !icoEnProgreso && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {ambosCompletados && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-slate-500 mb-4"
            >
              Has completado ambos tests. Puedes ver tus resultados desde cada tarjeta o desde tu <button type="button" onClick={() => navigate("/orientacion/perfil")} className="text-orange-600 font-medium hover:underline">perfil vocacional</button>.
            </motion.p>
          )}
        </div>
      </div>

      {/* Barra fija: Comenzar Test */}
      <div className="fixed bottom-0 left-0 right-0 z-10 py-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          {tipoTest && !puedeIniciar && !cargando && (
            <p className="text-sm text-slate-500">
              {tipoTest === "Holland_RIASEC" && yaTieneHolland
                ? "Ya completaste el test Holland."
                : tipoTest === "ICO" && yaTieneIco
                  ? "Ya completaste el test ICO."
                  : (tipoTest === "Holland_RIASEC" && hollandEnProgreso) || (tipoTest === "ICO" && icoEnProgreso)
                    ? "Tienes este test en progreso. Usa «Continuar» en la tarjeta."
                    : null}
            </p>
          )}
          <Button
            onClick={handleIniciarTest}
            disabled={!puedeIniciar}
            size="lg"
            className="w-full sm:w-auto min-w-[200px] bg-[#F37021] hover:bg-orange-600 text-white rounded-xl px-8 h-12 font-bold text-base shadow-lg shadow-orange-200/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {cargando ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Iniciando...
              </>
            ) : !tipoTest ? (
              "Selecciona un test arriba"
            ) : (tipoTest === "Holland_RIASEC" && yaTieneHolland) || (tipoTest === "ICO" && yaTieneIco) ? (
              "Test ya completado"
            ) : (
              "Comenzar test"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SeleccionarTest;
