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
  
  const getCommitmentsData = () => {
    const commonCommitments = [
      {
        compromiso: "Mantener IAA requerido",
        estado: "cumplido",
        descripcion: `Mantener IAA ≥${scholarshipType === 'academica' ? '16.50' : '15.00'} puntos`,
        valorActual: scholarshipType === 'academica' ? "17.2" : "15.8",
        requerido: scholarshipType === 'academica' ? "≥16.50" : "≥15.00"
      },
      {
        compromiso: "15 créditos mínimos por trimestre",
        estado: "cumplido", 
        descripcion: "Inscribir y aprobar mínimo 15 créditos por período",
        valorActual: "18 créditos",
        requerido: "≥15"
      },
      {
        compromiso: "Acompañamiento integral",
        estado: "cumplido",
        descripcion: "Participar en seguimiento trimestral obligatorio",
        valorActual: "Al día",
        requerido: "Obligatorio"
      },
      {
        compromiso: "Conducta ejemplar",
        estado: "cumplido",
        descripcion: "Cumplir código de ética y evitar sanciones disciplinarias",
        valorActual: "Sin sanciones",
        requerido: "Sin sanciones"
      }
    ];

    const specificCommitments = {
      academica: [
        {
          compromiso: "Excelencia académica sostenida",
          estado: "cumplido",
          descripcion: "Mantener rendimiento académico superior",
          valorActual: "Lista del Rector",
          requerido: "Alto rendimiento"
        },
        {
          compromiso: "Participación en investigación",
          estado: "pendiente",
          descripcion: "Colaborar en al menos 1 proyecto de investigación",
          valorActual: "0/1",
          requerido: "1 proyecto"
        }
      ],
      deportiva: [
        {
          compromiso: "Participación en Selección",
          estado: "cumplido",
          descripcion: "Mantener participación activa en selección deportiva",
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
          compromiso: "Calificación deportiva",
          estado: "cumplido",
          descripcion: "Mantener calificación ≥18 en selección deportiva",
          valorActual: "19/20",
          requerido: "≥18"
        }
      ],
      artistica: [
        {
          compromiso: "Participación en selección cultural",
          estado: "cumplido",
          descripcion: "Mantener participación activa en selección artística",
          valorActual: "Activo",
          requerido: "Activo"
        },
        {
          compromiso: "Presentaciones mínimas",
          estado: "cumplido",
          descripcion: "Participar en mínimo 2 eventos culturales por período",
          valorActual: "3/2",
          requerido: "2"
        },
        {
          compromiso: "Calificación artística",
          estado: "cumplido",
          descripcion: "Mantener calificación ≥18 en selección cultural",
          valorActual: "18.5/20",
          requerido: "≥18"
        }
      ],
      civico: [
        {
          compromiso: "Proyectos de impacto social",
          estado: "cumplido",
          descripcion: "Liderar o participar en proyectos comunitarios",
          valorActual: "2 proyectos activos",
          requerido: "≥1 proyecto"
        },
        {
          compromiso: "Horas de servicio comunitario",
          estado: "pendiente",
          descripcion: "Completar mínimo 40 horas de servicio por período",
          valorActual: "25/40",
          requerido: "40 horas"
        },
        {
          compromiso: "Evidencias de impacto",
          estado: "cumplido",
          descripcion: "Documentar el impacto de actividades comunitarias",
          valorActual: "Documentado",
          requerido: "Evidencias"
        }
      ],
      emprendimiento: [
        {
          compromiso: "Proyecto en incubadora",
          estado: "cumplido",
          descripcion: "Mantener startup activo en incubadora UNIMET",
          valorActual: "Proyecto activo",
          requerido: "Activo"
        },
        {
          compromiso: "Milestones trimestrales",
          estado: "pendiente",
          descripcion: "Cumplir objetivos trimestrales del proyecto",
          valorActual: "2/3",
          requerido: "3 milestones"
        },
        {
          compromiso: "Competencias de emprendimiento",
          estado: "cumplido",
          descripcion: "Participar en competencias internas",
          valorActual: "1er lugar último trimestre",
          requerido: "Participación"
        }
      ]
    };

    return [...commonCommitments, ...(specificCommitments[scholarshipType as keyof typeof specificCommitments] || specificCommitments.deportiva)];
  };

  const compromisosEspecificos = getCommitmentsData();

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

  const compromisosCompletados = compromisosEspecificos.filter(c => c.estado === "cumplido").length;
  const progresoGeneral = (compromisosCompletados / compromisosEspecificos.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Compromisos Especiales</h2>
        <p className="text-muted-foreground">
          Seguimiento de tus compromisos específicos como becario de excelencia {scholarshipType === 'academica' ? 'académica' : scholarshipType === 'artistica' ? 'artística' : scholarshipType === 'civico' ? 'cívica' : scholarshipType === 'emprendimiento' ? 'de emprendimiento' : 'deportiva'}
        </p>
      </div>


      {/* Compromisos por Categoría */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Compromisos de Excelencia {scholarshipType === 'academica' ? 'Académica' : scholarshipType === 'artistica' ? 'Artística' : scholarshipType === 'civico' ? 'Cívica' : scholarshipType === 'emprendimiento' ? 'Emprendimiento' : 'Deportiva'}</span>
          </CardTitle>
          <CardDescription>
            Compromisos específicos para tu categoría de Excelencia {scholarshipType === 'academica' ? 'Académica' : scholarshipType === 'artistica' ? 'Artística' : scholarshipType === 'civico' ? 'Cívica' : scholarshipType === 'emprendimiento' ? 'Emprendimiento' : 'Deportiva'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {compromisosEspecificos.map((compromiso, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${getEstadoColor(compromiso.estado)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {getEstadoIcon(compromiso.estado)}
                      <h3 className="font-semibold">{compromiso.compromiso}</h3>
                    </div>
                    <p className="text-sm opacity-75 mt-1">{compromiso.descripcion}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-medium">Actual: {compromiso.valorActual}</span>
                      <span className="text-sm text-muted-foreground">Requerido: {compromiso.requerido}</span>
                    </div>
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