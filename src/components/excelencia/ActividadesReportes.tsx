import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Trophy,
  Award,
  FileText,
  Info,
  BookOpen,
  GraduationCap,
  Palette,
  Heart,
  Lightbulb,
  Target
} from "lucide-react";

const ActividadesReportes = ({ scholarshipType }: { scholarshipType?: string }) => {

  const getTipoBecaInfo = () => {
    switch (scholarshipType) {
      case 'academica':
        return {
          title: "Desempeño y Reconocimientos Académicos",
          subtitle: "Beca de Excelencia Académica (Art. 10-a)",
          icon: GraduationCap,
          color: "blue",
          iaaRequired: "16.50",
          description: "Como becario de Excelencia Académica, deberás mantener un destacado rendimiento académico y cumplir con los requisitos establecidos en el reglamento.",
          requirements: [
            "Mantener IAA ≥ 16.50 puntos al término del año lectivo",
            "Haber cursado y aprobado 15 asignaturas anuales según flujograma",
            "Aprobar mínimo 15 créditos por trimestre regular",
            "Cumplir con el acompañamiento integral de DDBE"
          ],
          distintions: [
            {
              title: "Lista del Rector",
              description: "Puedes optar al Certificado Distinción Lista del Rector si tu promedio simple de los IAP de tres trimestres regulares consecutivos es ≥17.5 puntos",
              articulo: "Art. 19-a"
            }
          ]
        };

      case 'deportiva':
        return {
          title: "Actividades y Logros Deportivos",
          subtitle: "Beca de Excelencia Deportiva (Art. 10-b)",
          icon: Trophy,
          color: "green",
          iaaRequired: "15.00",
          description: "Como becario de Excelencia Deportiva, debes mantener participación activa en selecciones deportivas UNIMET y cumplir con los requisitos académicos y deportivos.",
          requirements: [
            "Mantener IAA ≥ 15.00 puntos al término del año lectivo",
            "Participación activa en selección deportiva con mínimo 2 trimestres de antigüedad",
            "Mantener calificación deportiva ≥18/20 otorgada por el entrenador",
            "Aprobar mínimo 15 créditos por trimestre regular",
            "Cumplir con el acompañamiento integral de DDBE"
          ],
          distintions: [
            {
              title: "Requisitos de Postulación Deportiva",
              description: "Debes presentar currículum deportivo, certificaciones, constancia de federación (si aplica) y aval del entrenador deportivo y director del área",
              articulo: "Art. 10-b"
            }
          ]
        };

      case 'artistica':
        return {
          title: "Participación y Logros Artísticos",
          subtitle: "Beca de Excelencia Artística (Art. 10-c)",
          icon: Palette,
          color: "purple",
          iaaRequired: "15.00",
          description: "Como becario de Excelencia Artística, debes mantener participación activa en selecciones culturales UNIMET y cumplir con los requisitos académicos y artísticos.",
          requirements: [
            "Mantener IAA ≥ 15.00 puntos al término del año lectivo",
            "Participación activa en selección cultural con mínimo 2 trimestres de antigüedad",
            "Mantener calificación artística ≥18/20 otorgada por el Director del área",
            "Aprobar mínimo 15 créditos por trimestre regular",
            "Cumplir con el acompañamiento integral de DDBE"
          ],
          distintions: [
            {
              title: "Dossier Artístico",
              description: "Debes mantener un dossier artístico completo y actualizado con aval del Director del área y del Coordinador de la tipología",
              articulo: "Art. 10-c"
            }
          ]
        };

      case 'civico':
        return {
          title: "Proyectos de Impacto Social",
          subtitle: "Beca de Compromiso Cívico (Art. 10-d)",
          icon: Heart,
          color: "orange",
          iaaRequired: "15.00",
          description: "Como becario de Compromiso Cívico, debes mantener participación destacada en programas de impacto social y cumplir con los requisitos académicos establecidos.",
          requirements: [
            "Mantener IAA ≥ 15.00 puntos al término del año lectivo",
            "Participación destacada en programas de impacto social o bienestar comunitario",
            "Aprobar mínimo 15 créditos por trimestre regular",
            "Cumplir con el acompañamiento integral de DDBE"
          ],
          distintions: [
            {
              title: "Evidencias de Impacto",
              description: "Debes entregar recaudos que demuestren la participación en iniciativas de impacto social con aval del Director del área y del Coordinador de la tipología",
              articulo: "Art. 10-d"
            }
          ]
        };

      case 'emprendimiento':
        return {
          title: "Desarrollo de Emprendimiento",
          subtitle: "Beca de Emprendimiento (Art. 10-e)",
          icon: Lightbulb,
          color: "yellow",
          iaaRequired: "15.00",
          description: "Como becario de Emprendimiento, debes mantener tu startup activa en la Incubadora UNIMET y cumplir con los requisitos académicos y emprendedores.",
          requirements: [
            "Mantener IAA ≥ 15.00 puntos al término del año lectivo",
            "Mantener aval e ingreso activo en la Incubadora de Emprendimientos UNIMET",
            "Participar en competencias trimestrales de proyectos emprendedores",
            "Aprobar mínimo 15 créditos por trimestre regular",
            "Cumplir con el acompañamiento integral de DDBE"
          ],
          distintions: [
            {
              title: "Resumen Ejecutivo",
              description: "Debes mantener un resumen ejecutivo de tu proyecto avalado por el Departamento de Emprendimiento (máximo 2 páginas)",
              articulo: "Art. 10-e"
            }
          ]
        };

      default:
        return {
          title: "Actividades y Reportes",
          subtitle: "Programa de Excelencia",
          icon: Target,
          color: "blue",
          iaaRequired: "15.00",
          description: "Información sobre las actividades y requisitos del programa de excelencia.",
          requirements: [],
          distintions: []
        };
    }
  };

  const becaInfo = getTipoBecaInfo();
  const IconComponent = becaInfo.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <IconComponent className={`h-8 w-8 text-${becaInfo.color}-600`} />
          <div>
            <h2 className="text-3xl font-bold text-foreground">{becaInfo.title}</h2>
            <p className="text-sm text-muted-foreground">{becaInfo.subtitle}</p>
          </div>
        </div>
        <p className="text-muted-foreground">{becaInfo.description}</p>
      </div>

      {/* Alert Informativo */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900 text-sm">
          <strong>Importante:</strong> Debes mantener un IAA mínimo de <strong>{becaInfo.iaaRequired} puntos</strong> al término del año lectivo para conservar tu beca.
        </AlertDescription>
      </Alert>

      {/* Requisitos de Mantenimiento */}
      <Card className="border-orange/20">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Requisitos de Mantenimiento
          </CardTitle>
          <CardDescription>
            Condiciones que debes cumplir para mantener tu beca activa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {becaInfo.requirements.map((req, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                </div>
                <p className="text-sm text-blue-900 flex-1">{req}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Distinciones y Reconocimientos */}
      {becaInfo.distintions && becaInfo.distintions.length > 0 && (
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-purple-900">
              <Award className="h-5 w-5" />
              Distinciones y Reconocimientos
            </CardTitle>
            <CardDescription>
              Oportunidades adicionales disponibles para becarios de excelencia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {becaInfo.distintions.map((dist, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg border border-purple-200"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="font-semibold text-purple-900">{dist.title}</h4>
                    <Badge variant="outline" className="text-xs bg-purple-100 text-purple-700 border-purple-300">
                      {dist.articulo}
                    </Badge>
                  </div>
                  <p className="text-sm text-purple-800">{dist.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Acompañamiento DDBE */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-green-900">
            <BookOpen className="h-5 w-5" />
            Acompañamiento Integral DDBE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-900 mb-4">
            Como becario del Programa de Excelencia, contarás con un <strong>acompañamiento integral obligatorio</strong> provisto
            por la Dirección de Desarrollo y Bienestar Estudiantil (DDBE). Este acompañamiento es fundamental para tu éxito académico
            y el mantenimiento de tu beneficio.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Badge className="bg-green-600 text-xs">Seguimiento Trimestral</Badge>
            <Badge className="bg-green-600 text-xs">Revisión Anual</Badge>
            <Badge className="bg-green-600 text-xs">Orientación Académica</Badge>
            <Badge className="bg-green-600 text-xs">Apoyo Personalizado</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Información Adicional */}
      <Alert className="bg-orange-50 border-orange-200">
        <Info className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-900 text-sm">
          <strong>Recuerda:</strong> El seguimiento del cumplimiento de requisitos es <strong>trimestral con revisión anual</strong>.
          Cualquier incumplimiento puede resultar en la suspensión o pérdida del beneficio según lo establecido en el Art. 50 del reglamento.
          Para consultas sobre retiro de asignaturas, período intensivo o cambio de carrera, contacta a DDBE previamente.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ActividadesReportes;
