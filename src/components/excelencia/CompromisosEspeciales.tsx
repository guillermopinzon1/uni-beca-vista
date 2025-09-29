import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Target,
  Users,
  Trophy,
  Calendar,
  AlertCircle,
  TrendingDown
} from "lucide-react";

const CompromisosEspeciales = ({ scholarshipType }: { scholarshipType?: string }) => {
  const compromisosDeportiva = [
    {
      compromiso: "Participación en Selección",
      estado: "cumplido",
      descripcion: "Mantener participación activa en selección de natación",
      valorActual: "Activo",
      requerido: "Activo"
    },
    {
      compromiso: "Competencias mínimas",
      estado: "cumplido", 
      descripcion: "Participar en mínimo 3 competencias por período",
      valorActual: "3/3",
      requerido: "3"
    },
    {
      compromiso: "Eventos UNIMET",
      estado: "cumplido",
      descripcion: "Asistir a eventos institucionales",
      valorActual: "2/2",
      requerido: "2"
    },
    {
      compromiso: "Actividades comunitarias",
      estado: "pendiente",
      descripcion: "Participar en actividades de impacto comunitario",
      valorActual: "1/2",
      requerido: "2"
    },
    {
      compromiso: "Calificación deportiva",
      estado: "cumplido",
      descripcion: "Mantener calificación ≥18 en selección deportiva",
      valorActual: "19/20",
      requerido: "≥18"
    }
  ];

  const timelineActividades = [
    {
      fecha: "Sep 2025",
      actividad: "Juegos Interclubes", 
      estado: "completado",
      tipo: "competencia"
    },
    {
      fecha: "Oct 2025",
      actividad: "Día del Deporte UNIMET",
      estado: "completado", 
      tipo: "evento"
    },
    {
      fecha: "Nov 2025",
      actividad: "Competencia Nacional",
      estado: "completado",
      tipo: "competencia"
    },
    {
      fecha: "Dic 2025",
      actividad: "Clínica comunitaria",
      estado: "pendiente",
      tipo: "comunitario"
    }
  ];

  const consecuenciasIncumplimiento = [
    {
      escenario: "IAA baja de 15.0",
      consecuencia: "Período de gracia de 1 semestre para recuperar",
      gravedad: "media"
    },
    {
      escenario: "Deja la selección", 
      consecuencia: "Pérdida inmediata de la beca deportiva",
      gravedad: "alta"
    },
    {
      escenario: "No cumple compromisos comunitarios",
      consecuencia: "Advertencia escrita y plan de recuperación",
      gravedad: "baja"
    },
    {
      escenario: "Recibe sanción disciplinaria",
      consecuencia: "Revisión del caso y posible suspensión temporal",
      gravedad: "alta"
    }
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "cumplido": return "text-green-600 bg-green-50 border-green-200";
      case "pendiente": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "completado": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "cumplido": return <CheckCircle className="h-4 w-4" />;
      case "completado": return <CheckCircle className="h-4 w-4" />;
      case "pendiente": return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getGravedadColor = (gravedad: string) => {
    switch (gravedad) {
      case "alta": return "border-red-200 bg-red-50";
      case "media": return "border-yellow-200 bg-yellow-50";
      case "baja": return "border-blue-200 bg-blue-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  const getGravedadIcon = (gravedad: string) => {
    switch (gravedad) {
      case "alta": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "media": return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "baja": return <AlertCircle className="h-4 w-4 text-blue-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const compromisosCompletados = compromisosDeportiva.filter(c => c.estado === "cumplido").length;
  const progresoGeneral = (compromisosCompletados / compromisosDeportiva.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Compromisos Especiales</h2>
        <p className="text-muted-foreground">
          Seguimiento de tus compromisos específicos como becario de excelencia deportiva
        </p>
      </div>


      {/* Compromisos por Categoría */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Compromisos Deportivos</span>
          </CardTitle>
          <CardDescription>
            Compromisos específicos para tu categoría de Excelencia Deportiva
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {compromisosDeportiva.map((compromiso, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg border border-orange/20"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{compromiso.compromiso}</h3>
                    <p className="text-sm opacity-75 mt-1">{compromiso.descripcion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default CompromisosEspeciales;