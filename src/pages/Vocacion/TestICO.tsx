import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, DoorOpen } from "lucide-react";
import { motion } from "framer-motion";
import {
  guardarRespuestasIco,
  Pregunta,
  RespuestaIcoBody,
} from "@/lib/api/orientacionVocacional";

const TestICO = () => {
  const navigate = useNavigate();
  const { tokens, logout } = useAuth();
  const { toast } = useToast();

  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [cargando, setCargando] = useState(false);

  /** Opciones de respuesta Likert (desde API o por defecto) */
  const opcionesPorDefecto = ["Frecuentemente", "A veces", "Nunca"];

  const accessToken =
    tokens?.accessToken ||
    JSON.parse(localStorage.getItem("auth_tokens") || "null")?.accessToken;

  useEffect(() => {
    const sesionId = localStorage.getItem("sesionId");
    const raw = localStorage.getItem("preguntasIco");
    if (!sesionId || !raw) {
      toast({
        title: "Error",
        description: "No se encontró la sesión o las preguntas. Inicia el test desde la selección.",
        variant: "destructive",
      });
      navigate("/orientacion/seleccionar-test");
      return;
    }
    try {
      const lista = JSON.parse(raw);
      const listaPreguntas = Array.isArray(lista) ? lista : lista?.preguntas ?? [];
      setPreguntas(listaPreguntas);
      const guardadas = localStorage.getItem("respuestasIco");
      if (guardadas && listaPreguntas.length > 0) {
        try {
          const parsed = JSON.parse(guardadas) as Record<string, string | boolean>;
          const idsValidos = new Set(listaPreguntas.map((p: Pregunta) => p.id));
          const filtrado: Record<string, string> = {};
          Object.keys(parsed).forEach((id) => {
            if (idsValidos.has(id)) {
              const v = parsed[id];
              filtrado[id] = typeof v === "string" ? v : v ? "Sí" : "No";
            }
          });
          if (Object.keys(filtrado).length > 0) {
            setRespuestas(filtrado);
            const primeraSinResponder = listaPreguntas.findIndex(
              (p: Pregunta) => filtrado[p.id] === undefined
            );
            const indiceInicial =
              primeraSinResponder >= 0
                ? primeraSinResponder
                : Math.max(0, listaPreguntas.length - 1);
            setPreguntaActual(indiceInicial);
          }
        } catch {
          // ignorar si no se puede parsear
        }
      }
    } catch {
      toast({
        title: "Error",
        description: "Error al cargar las preguntas. Inicia el test nuevamente.",
        variant: "destructive",
      });
      navigate("/orientacion/seleccionar-test");
    }
  }, [navigate, toast]);

  useEffect(() => {
    if (Object.keys(respuestas).length === 0) return;
    localStorage.setItem("respuestasIco", JSON.stringify(respuestas));
  }, [respuestas]);

  const responderPregunta = (preguntaId: string, valor: string) => {
    setRespuestas((prev) => {
      const next = { ...prev, [preguntaId]: valor };
      return next;
    });
  };

  const enviarRespuestas = async (respuestasParaEnviar: Record<string, string>) => {
    const sesionId = localStorage.getItem("sesionId");
    if (!sesionId || !accessToken) {
      toast({
        title: "Error",
        description: "Sesión no encontrada. Inicia el test nuevamente.",
        variant: "destructive",
      });
      navigate("/orientacion/seleccionar-test");
      return;
    }

    const respuestasArray: RespuestaIcoBody[] = preguntas.map((p) => ({
      pregunta_id: p.id,
      respuesta: respuestasParaEnviar[p.id] ?? "",
    }));

    setCargando(true);
    try {
      const respuesta = await guardarRespuestasIco(
        accessToken,
        sesionId,
        respuestasArray
      );

      localStorage.removeItem("preguntasIco");
      localStorage.removeItem("respuestasIco");
      toast({
        title: "Test ICO completado",
        description: "Tus resultados están listos.",
      });

      navigate("/orientacion/resultados-ico", {
        state: { resultadoIco: respuesta.data },
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.message || "Error al enviar respuestas. Intenta nuevamente.",
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
  const porcentajeProgreso =
    preguntas.length > 0 ? ((preguntaActual + 1) / preguntas.length) * 100 : 0;

  if (preguntas.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col max-h-[calc(100vh-11rem)] min-h-0">
      <div className="container mx-auto px-4 flex-1 flex flex-col min-h-0 max-w-3xl mx-auto">
        {/* Barra de progreso compacta */}
        <div className="shrink-0 mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-600">
              Pregunta {preguntaActual + 1} de {preguntas.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round(porcentajeProgreso)}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-orange-500 transition-all duration-500"
              initial={{ width: 0 }}
              animate={{ width: `${porcentajeProgreso}%` }}
            />
          </div>
        </div>

        {/* Pregunta + opciones Likert (ej. Frecuentemente / A veces / Nunca) */}
        <Card className="border-none shadow-sm rounded-xl bg-white flex-1 min-h-0 flex flex-col overflow-hidden">
          <CardContent className="p-5 md:p-6 flex-1 min-h-0 flex flex-col overflow-hidden">
            <span className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-2 block shrink-0">
              Test ICO
            </span>
            <div className="flex-1 min-h-0 overflow-y-auto mb-4">
              <h3 className="text-xl font-bold text-gray-900 leading-tight pr-2">
                {pregunta?.texto__pregunta ?? pregunta?.texto ?? ""}
              </h3>
            </div>
            <div className="space-y-3 shrink-0">
              {(pregunta?.instrucciones_respuesta ?? pregunta?.opcionesRespuesta ?? opcionesPorDefecto).map(
                (opcion: string) => (
                  <Button
                    key={opcion}
                    onClick={() => responderPregunta(pregunta.id, opcion)}
                    disabled={cargando}
                    className={`w-full h-14 text-base font-medium border-2 transition-all ${
                      respuestas[pregunta.id] === opcion
                        ? "bg-orange-200 border-orange-500 shadow-sm text-orange-900"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {opcion}
                  </Button>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navegación fija abajo: siempre visible sin bajar */}
        <div className="shrink-0 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-4 py-2">
          <div className="flex justify-between items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setPreguntaActual((p) => (p > 0 ? p - 1 : 0))}
              disabled={preguntaActual === 0}
              className="rounded-lg shrink-0"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/orientacion/historial")}
              disabled={cargando}
              className="rounded-lg shrink-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
            >
              <DoorOpen className="h-4 w-4 mr-1" />
              Salir y continuar después
            </Button>
          </div>
          {preguntaActual < preguntas.length - 1 ? (
            <Button
              onClick={() => setPreguntaActual((p) => p + 1)}
              disabled={!pregunta?.id || respuestas[pregunta.id] === undefined || respuestas[pregunta.id] === ""}
              className="bg-orange-600 hover:bg-orange-700 rounded-lg shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={() => enviarRespuestas(respuestas)}
              disabled={
                cargando ||
                preguntas.some((p) => respuestas[p.id] === undefined || respuestas[p.id] === "")
              }
              className="bg-orange-600 hover:bg-orange-700 rounded-lg shrink-0"
            >
              {cargando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                "Finalizar y ver resultados"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestICO;
