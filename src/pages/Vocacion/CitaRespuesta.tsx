import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Calendar, AlertCircle } from "lucide-react";
import { API_BASE } from "@/lib/api/config";

type AccionCita = "confirmar" | "cancelar";

interface CitaResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    fecha: string;
    hora: string;
    modalidad: string;
    motivo: string;
    estado: string;
    estudiante?: {
      nombre: string;
      apellido: string;
    };
    especialista?: {
      nombre: string;
      apellido: string;
    };
  };
}

const CitaRespuesta = () => {
  const { citaId } = useParams<{ citaId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  // Determinar la acción basándose en la URL
  const accion: AccionCita = window.location.pathname.includes("/cancelar/") ? "cancelar" : "confirmar";

  const [loading, setLoading] = useState(true);
  const [resultado, setResultado] = useState<CitaResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const procesarCita = async () => {
      if (!citaId || !token) {
        setError("Enlace inválido. Falta el ID de la cita o el token de confirmación.");
        setLoading(false);
        return;
      }

      try {
        const endpoint = accion === "confirmar"
          ? `${API_BASE}/v1/citas/confirmar/${citaId}?token=${token}`
          : `${API_BASE}/v1/citas/cancelar-por-token/${citaId}?token=${token}`;

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || `Error al ${accion} la cita`);
        } else {
          setResultado(data);
        }
      } catch (err) {
        console.error("Error al procesar cita:", err);
        setError("Error de conexión. Por favor intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    procesarCita();
  }, [citaId, token, accion]);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha + "T00:00:00").toLocaleDateString("es-VE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-10 pb-10">
            <Loader2 className="w-16 h-16 animate-spin text-teal-600 mx-auto mb-4" />
            <p className="text-lg text-slate-600">
              {accion === "confirmar" ? "Confirmando tu cita..." : "Cancelando tu cita..."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-700">Error</CardTitle>
            <CardDescription className="text-red-600">{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={() => navigate("/")}
              className="bg-red-600 hover:bg-red-700"
            >
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const esConfirmacion = accion === "confirmar";
  const colorPrimario = esConfirmacion ? "teal" : "red";
  const Icono = esConfirmacion ? CheckCircle : XCircle;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${esConfirmacion ? "from-teal-50 to-cyan-100" : "from-red-50 to-orange-100"} flex items-center justify-center p-4`}>
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center pb-2">
          <div className={`mx-auto w-20 h-20 ${esConfirmacion ? "bg-teal-100" : "bg-red-100"} rounded-full flex items-center justify-center mb-4`}>
            <Icono className={`w-12 h-12 ${esConfirmacion ? "text-teal-600" : "text-red-600"}`} />
          </div>
          <CardTitle className={`text-2xl ${esConfirmacion ? "text-teal-700" : "text-red-700"}`}>
            {esConfirmacion ? "Cita Confirmada" : "Cita Cancelada"}
          </CardTitle>
          <CardDescription className="text-base">
            {resultado?.message}
          </CardDescription>
        </CardHeader>

        {resultado?.data && (
          <CardContent className="space-y-4">
            <div className={`bg-slate-50 rounded-xl p-4 border ${esConfirmacion ? "border-teal-200" : "border-red-200"}`}>
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Detalles de la cita
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Fecha:</span>
                  <span className="font-medium text-slate-800">
                    {formatearFecha(resultado.data.fecha)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hora:</span>
                  <span className="font-medium text-slate-800">{resultado.data.hora}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Modalidad:</span>
                  <span className="font-medium text-slate-800 capitalize">{resultado.data.modalidad}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Especialista:</span>
                  <span className="font-medium text-slate-800">
                    {resultado.data.especialista?.nombre} {resultado.data.especialista?.apellido}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Motivo:</span>
                  <span className="font-medium text-slate-800">{resultado.data.motivo}</span>
                </div>
              </div>
            </div>

            {esConfirmacion && (
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                <p className="text-sm text-teal-800">
                  <strong>Recuerda:</strong> Llega 10 minutos antes si la cita es presencial,
                  o asegúrate de tener buena conexión si es virtual.
                </p>
              </div>
            )}

            {!esConfirmacion && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Nota:</strong> El especialista ha sido notificado de la cancelación.
                  Si deseas agendar una nueva cita, contacta con orientación vocacional.
                </p>
              </div>
            )}

            <div className="text-center pt-4">
              <Button
                onClick={() => navigate("/")}
                className={esConfirmacion ? "bg-teal-600 hover:bg-teal-700" : "bg-slate-600 hover:bg-slate-700"}
              >
                Volver al inicio
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default CitaRespuesta;
