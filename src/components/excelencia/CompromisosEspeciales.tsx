import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  Target,
  Trophy,
  Palette,
  Heart,
  Lightbulb,
  GraduationCap,
  Info,
  BookOpen,
  Shield,
  XCircle
} from "lucide-react";

const CompromisosEspeciales = ({ scholarshipType }: { scholarshipType?: string }) => {

  const getTipoBecaTexto = () => {
    const textos: Record<string, string> = {
      academica: 'Académica',
      deportiva: 'Deportiva',
      artistica: 'Artística',
      civico: 'Cívico',
      emprendimiento: 'Emprendimiento'
    };
    return textos[scholarshipType || 'academica'] || 'Académica';
  };

  const getTipoBecaIcon = () => {
    const iconos: Record<string, any> = {
      academica: GraduationCap,
      deportiva: Trophy,
      artistica: Palette,
      civico: Heart,
      emprendimiento: Lightbulb
    };
    const IconComponent = iconos[scholarshipType || 'academica'] || GraduationCap;
    return <IconComponent className="h-6 w-6" />;
  };

  const getCondicionesGenerales = () => {
    const iaaRequerido = scholarshipType === 'academica' ? '16.50' : '15.00';

    return [
      {
        titulo: "Mantener IAA mínimo requerido",
        descripcion: `Mantener un Índice Académico Acumulado (IAA) ≥${iaaRequerido} puntos al término del año lectivo`,
        articulo: "Art. 14-c",
        prioridad: "Alta"
      },
      {
        titulo: "Inscribir y aprobar 15 créditos mínimos",
        descripcion: "Inscribir y aprobar un mínimo de 15 créditos en período regular o el remanente necesario para finalizar estudios",
        articulo: "Art. 14-a",
        prioridad: "Alta"
      },
      {
        titulo: "Culminar en máximo 12 trimestres regulares",
        descripcion: "Finalizar el plan de estudios de pregrado en un tiempo máximo de 12 períodos regulares consecutivos",
        articulo: "Art. 14-b",
        prioridad: "Media"
      },
      {
        titulo: "Acompañamiento integral DDBE",
        descripcion: "Cumplir con el esquema de acompañamiento trimestral obligatorio propuesto por la Dirección de Desarrollo y Bienestar Estudiantil",
        articulo: "Art. 14-h, Art. 3-b",
        prioridad: "Alta"
      },
      {
        titulo: "Conducta ética y disciplinaria",
        descripcion: "Cumplir a cabalidad con los reglamentos, normas y Código de Ética de la Universidad Metropolitana sin incurrir en sanciones disciplinarias",
        articulo: "Art. 14-i, Art. 3",
        prioridad: "Alta"
      },
      {
        titulo: "Consultar retiros de asignaturas",
        descripcion: "En caso de requerir el retiro de alguna asignatura, realizar consulta previa con la Dirección de Desarrollo y Bienestar Estudiantil para su evaluación",
        articulo: "Art. 14-d",
        prioridad: "Media"
      },
      {
        titulo: "Notificar período intensivo",
        descripcion: "Si deseas cursar el período intensivo, deberás notificarlo a DDBE para tramitar el permiso correspondiente. No se permitirá el retiro de asignaturas durante este período",
        articulo: "Art. 14-e",
        prioridad: "Media"
      },
      {
        titulo: "Restricción de cambio de carrera",
        descripcion: "Se permite un cambio de carrera siempre que no tengas más de 45 unidades de crédito aprobadas, con aval de DDBE y aprobación del cuerpo técnico",
        articulo: "Art. 14-g",
        prioridad: "Baja"
      }
    ];
  };

  const getCondicionesEspecificas = () => {
    const condiciones: Record<string, any[]> = {
      academica: [
        {
          titulo: "Mantener IAA ≥16.50 puntos",
          descripcion: "Como becario de Excelencia Académica, debes mantener un IAA al término del año lectivo igual o superior a 16,50 puntos",
          articulo: "Art. 10-a, Art. 14-c"
        },
        {
          titulo: "Haber cursado 15 asignaturas anuales",
          descripcion: "Como requisito de postulación, debes haber cursado y aprobado quince (15) asignaturas anuales según el flujograma de tu carrera",
          articulo: "Art. 10-a"
        },
        {
          titulo: "Elegibilidad para Lista del Rector",
          descripcion: "Puedes optar al Certificado Distinción Lista del Rector si tu promedio simple de los IAP de tres trimestres regulares consecutivos es ≥17,5 puntos",
          articulo: "Art. 19-a"
        }
      ],
      deportiva: [
        {
          titulo: "Participación activa en Selección Deportiva",
          descripcion: "Debes mantener participación activa en alguna selección deportiva de la Universidad con al menos dos trimestres de antigüedad",
          articulo: "Art. 10-b"
        },
        {
          titulo: "Calificación deportiva mínima",
          descripcion: "Debes mantener una calificación ≥18/20 otorgada por tu entrenador deportivo",
          articulo: "Art. 10-b"
        },
        {
          titulo: "Currículum deportivo y certificaciones",
          descripcion: "Debes presentar currículum deportivo, certificaciones, constancia de federación (si aplica) y aval del entrenador deportivo y director del área",
          articulo: "Art. 10-b"
        },
        {
          titulo: "Mantener IAA ≥15.00 puntos",
          descripcion: "Como becario de Excelencia Deportiva, debes mantener un IAA al término del año lectivo igual o superior a 15,00 puntos",
          articulo: "Art. 10-b, Art. 14-c"
        }
      ],
      artistica: [
        {
          titulo: "Participación activa en Selección Artística",
          descripcion: "Debes mantener participación activa en alguna selección cultural/artística de la Universidad con al menos dos trimestres de antigüedad",
          articulo: "Art. 10-c"
        },
        {
          titulo: "Calificación artística mínima",
          descripcion: "Debes mantener una calificación ≥18/20 otorgada por el Director del área artística",
          articulo: "Art. 10-c"
        },
        {
          titulo: "Dossier artístico actualizado",
          descripcion: "Debes mantener un dossier artístico completo y actualizado con aval del Director del área y del Coordinador de la tipología",
          articulo: "Art. 10-c"
        },
        {
          titulo: "Mantener IAA ≥15.00 puntos",
          descripcion: "Como becario de Excelencia Artística, debes mantener un IAA al término del año lectivo igual o superior a 15,00 puntos",
          articulo: "Art. 10-c, Art. 14-c"
        }
      ],
      civico: [
        {
          titulo: "Participación en proyectos de impacto social",
          descripcion: "Debes mantener participación destacada en programas de impacto social o de bienestar para la comunidad",
          articulo: "Art. 10-d"
        },
        {
          titulo: "Evidencias de impacto documentadas",
          descripcion: "Debes entregar recaudos que demuestren la participación en iniciativas de impacto social con aval del Director del área y del Coordinador de la tipología",
          articulo: "Art. 10-d"
        },
        {
          titulo: "Mantener IAA ≥15.00 puntos",
          descripcion: "Como becario de Compromiso Cívico, debes mantener un IAA al término del año lectivo igual o superior a 15,00 puntos",
          articulo: "Art. 10-d, Art. 14-c"
        }
      ],
      emprendimiento: [
        {
          titulo: "Proyecto activo en Incubadora UNIMET",
          descripcion: "Tu startup debe mantener el aval e ingreso en la Incubadora de Emprendimientos de la Universidad",
          articulo: "Art. 10-e"
        },
        {
          titulo: "Participación en competencias trimestrales",
          descripcion: "Debes haber participado en la competencia trimestral de proyectos emprendedores establecida por la Universidad",
          articulo: "Art. 10-e"
        },
        {
          titulo: "Resumen ejecutivo del proyecto",
          descripcion: "Debes mantener un resumen ejecutivo de tu proyecto avalado por el Departamento de Emprendimiento (máximo 2 páginas)",
          articulo: "Art. 10-e"
        },
        {
          titulo: "Mantener IAA ≥15.00 puntos",
          descripcion: "Como becario de Emprendimiento, debes mantener un IAA al término del año lectivo igual o superior a 15,00 puntos",
          articulo: "Art. 10-e, Art. 14-c"
        }
      ]
    };

    return condiciones[scholarshipType || 'academica'] || condiciones.academica;
  };

  const consecuenciasIncumplimiento = [
    {
      escenario: "IAA cae por debajo del mínimo requerido",
      consecuencia: "Evaluación del caso por el cuerpo técnico. Posible rescisión del beneficio",
      gravedad: "Alta",
      articulo: "Art. 14-c"
    },
    {
      escenario: "No culmina en 12 períodos regulares",
      consecuencia: "Rescisión automática de la beca, salvo evaluación por causas no imputables al beneficiario",
      gravedad: "Alta",
      articulo: "Art. 14-b"
    },
    {
      escenario: "Asignaturas retiradas o reprobadas",
      consecuencia: "El estudiante deberá pagar a la Universidad el costo de las asignaturas inscritas y no aprobadas o inscritas y retiradas",
      gravedad: "Media",
      articulo: "Art. 3-e, Art. 16-b"
    },
    {
      escenario: "Incumplimiento del acompañamiento DDBE",
      consecuencia: "Evaluación del caso. Posible suspensión o pérdida del beneficio",
      gravedad: "Alta",
      articulo: "Art. 14-h"
    },
    {
      escenario: "Sanción disciplinaria o conducta inadecuada",
      consecuencia: "Pérdida inmediata del beneficio. El becario debe evitar incurrir en conductas que den lugar a sanción disciplinaria",
      gravedad: "Alta",
      articulo: "Art. 14-i, Art. 3"
    },
    {
      escenario: "Retiro o abandono voluntario",
      descripcion: "Pago de asignaturas inscritas no aprobadas o retiradas",
      gravedad: "Media",
      articulo: "Art. 3-e, Art. 16-d"
    },
    {
      escenario: "Incumplimiento de la Carta Compromiso",
      consecuencia: "Pérdida del beneficio. El abandono voluntario o incumplimiento resultará en la pérdida del beneficio",
      gravedad: "Alta",
      articulo: "Art. 16-d"
    }
  ];

  const getPrioridadBadge = (prioridad: string) => {
    switch (prioridad) {
      case "Alta":
        return <Badge variant="destructive" className="text-xs">Alta Prioridad</Badge>;
      case "Media":
        return <Badge variant="default" className="text-xs bg-yellow-500">Media Prioridad</Badge>;
      case "Baja":
        return <Badge variant="secondary" className="text-xs">Baja Prioridad</Badge>;
      default:
        return null;
    }
  };

  const getGravedadColor = (gravedad: string) => {
    switch (gravedad) {
      case "Alta": return "border-red-200 bg-red-50";
      case "Media": return "border-yellow-200 bg-yellow-50";
      case "Baja": return "border-blue-200 bg-blue-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  const getGravedadIcon = (gravedad: string) => {
    switch (gravedad) {
      case "Alta": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "Media": return <Info className="h-4 w-4 text-yellow-600" />;
      case "Baja": return <Info className="h-4 w-4 text-blue-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const condicionesGenerales = getCondicionesGenerales();
  const condicionesEspecificas = getCondicionesEspecificas();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          {getTipoBecaIcon()}
          Condiciones de Mantenimiento - Excelencia {getTipoBecaTexto()}
        </h2>
        <p className="text-muted-foreground">
          Compromisos y requisitos que debes cumplir para mantener tu Beca de Excelencia {getTipoBecaTexto()} activa (Artículo 14)
        </p>
      </div>

      {/* Alerta informativa */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900 text-sm">
          <strong>Importante:</strong> El cumplimiento de estas condiciones es <strong>obligatorio</strong> para
          mantener tu beca activa. El seguimiento es trimestral con revisión anual. Cualquier incumplimiento puede
          resultar en la suspensión o pérdida del beneficio (Art. 50).
        </AlertDescription>
      </Alert>

      {/* Condiciones Generales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Condiciones Generales de Mantenimiento
          </CardTitle>
          <CardDescription>
            Requisitos comunes para todos los becarios del Programa de Excelencia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {condicionesGenerales.map((condicion, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-blue-200 bg-blue-50/50"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm text-blue-900">{condicion.titulo}</h3>
                      {getPrioridadBadge(condicion.prioridad)}
                    </div>
                    <p className="text-xs text-blue-800 leading-relaxed">{condicion.descripcion}</p>
                    <Badge variant="outline" className="text-xs bg-white/50 text-blue-700 border-blue-300">
                      {condicion.articulo}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Condiciones Específicas */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-purple-900">
            <Target className="h-5 w-5" />
            Requisitos Específicos - Excelencia {getTipoBecaTexto()}
          </CardTitle>
          <CardDescription>
            Compromisos adicionales específicos de tu tipología de beca
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {condicionesEspecificas.map((condicion, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-purple-200 bg-purple-50/50"
              >
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-purple-900">{condicion.titulo}</h3>
                  <p className="text-xs text-purple-800 leading-relaxed">{condicion.descripcion}</p>
                  <Badge variant="outline" className="text-xs bg-white/50 text-purple-700 border-purple-300">
                    {condicion.articulo}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Consecuencias de Incumplimiento */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-orange-900">
            <AlertTriangle className="h-5 w-5" />
            Consecuencias de Incumplimiento
          </CardTitle>
          <CardDescription>
            Posibles consecuencias ante el incumplimiento de las condiciones de mantenimiento (Art. 50, Art. 3-e)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {consecuenciasIncumplimiento.map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getGravedadColor(item.gravedad)}`}
              >
                <div className="flex items-start gap-3">
                  {getGravedadIcon(item.gravedad)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h4 className="font-semibold text-sm">{item.escenario}</h4>
                      <Badge variant="outline" className="text-xs">Gravedad: {item.gravedad}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.consecuencia}</p>
                    <Badge variant="secondary" className="text-xs mt-1">{item.articulo}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Alert className="mt-4 bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-900 text-sm">
              <strong>Advertencia:</strong> El incumplimiento de las condiciones puede resultar en suspensión
              o revocación del beneficio sin perjuicio de otras acciones que la Universidad considere pertinentes
              (Art. 50). Los costos de asignaturas retiradas/reprobadas no están cubiertos por el beneficio (Art. 3-e, Art. 16).
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Información de Apoyo */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-green-900">
            <BookOpen className="h-5 w-5" />
            Apoyo y Recursos Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-900 mb-4">
            Si tienes dudas sobre tus compromisos o necesitas apoyo para cumplirlos, contacta a la <strong>Dirección de
            Desarrollo y Bienestar Estudiantil (DDBE)</strong>. El acompañamiento integral es parte de tu beneficio y está
            diseñado para apoyar tu prosecución de estudios.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Badge className="bg-green-600 text-xs">Seguimiento Trimestral</Badge>
            <Badge className="bg-green-600 text-xs">Revisión Anual</Badge>
            <Badge className="bg-green-600 text-xs">Orientación DDBE</Badge>
            <Badge className="bg-green-600 text-xs">Tutoría y Mentoría</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompromisosEspeciales;
