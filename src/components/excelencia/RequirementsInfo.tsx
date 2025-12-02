import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  GraduationCap,
  Trophy,
  Palette,
  Heart,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  FileText,
  CreditCard,
  Users,
  BookOpen,
  Info,
  Clock
} from "lucide-react";

const RequirementsInfo = () => {
  const categories = [
    {
      name: "Académica",
      icon: GraduationCap,
      iaaRequired: "≥ 16.50 (Pregrado) / ≥ 18.00 (Postgrado)",
      description: "Para estudiantes con rendimiento académico excepcional que demuestren excelencia sostenida en sus estudios",
      requirements: [
        "Histórico de notas certificado",
        "Flujograma de carrera indicando asignaturas cursadas y aprobadas",
        "Plan de carrera avalado por el Director de Escuela",
        "Haber cursado y aprobado 15 asignaturas anuales según flujograma",
        "Cumplir con evaluación integral de la DDBE"
      ],
      article: "Artículo 10, literal a"
    },
    {
      name: "Deportiva",
      icon: Trophy,
      iaaRequired: "≥ 15.00",
      description: "Para atletas destacados en selecciones deportivas UNIMET o con trayectoria deportiva relevante comprobada",
      requirements: [
        "Currículum deportivo con certificaciones",
        "Constancia de participación en selección (mínimo 2 trimestres)",
        "Aval del entrenador deportivo y Director del área",
        "Constancia de federación (si aplica)",
        "Flujograma de carrera con 15 asignaturas aprobadas",
        "Aval del Coordinador de la tipología"
      ],
      article: "Artículo 10, literal b"
    },
    {
      name: "Artística",
      icon: Palette,
      iaaRequired: "≥ 15.00",
      description: "Para talentos comprobados en áreas artísticas y culturales ofrecidas por la Universidad",
      requirements: [
        "Dossier artístico completo",
        "Constancia de participación en selección cultural (mínimo 2 trimestres)",
        "Aval del Director del área artística",
        "Aval del Coordinador de la tipología",
        "Flujograma de carrera con 15 asignaturas aprobadas",
        "Certificaciones de participación en eventos culturales"
      ],
      article: "Artículo 10, literal c"
    },
    {
      name: "Compromiso Cívico",
      icon: Heart,
      iaaRequired: "≥ 15.00",
      description: "Para estudiantes con participación destacada en programas de impacto social y bienestar comunitario",
      requirements: [
        "Evidencias de participación en iniciativas de impacto social",
        "Aval del Director del área",
        "Aval del Coordinador de la tipología",
        "Descripción de proyectos y resultados alcanzados",
        "Flujograma de carrera con 15 asignaturas aprobadas",
        "Cartas de respaldo de organizaciones beneficiadas"
      ],
      article: "Artículo 10, literal d"
    },
    {
      name: "Emprendimiento",
      icon: Lightbulb,
      iaaRequired: "≥ 15.00",
      description: "Para estudiantes con startups avalados por la Incubadora de Emprendimientos UNIMET",
      requirements: [
        "Resumen ejecutivo del proyecto emprendedor (máximo 2 páginas)",
        "Certificado de participación en competencia trimestral de proyectos",
        "Aval de ingreso a la Incubadora de Emprendimientos",
        "Aval del Departamento de Emprendimiento",
        "Flujograma de carrera con 15 asignaturas aprobadas",
        "Descripción del modelo de negocio y propuesta de valor"
      ],
      article: "Artículo 10, literal e"
    }
  ];

  const benefits = [
    {
      percentage: "Variable",
      description: "Cobertura de matrícula según disponibilidad presupuestaria anual",
      detail: "Los porcentajes son definidos por el Vicerrectorado Administrativo"
    },
    {
      percentage: "100%",
      description: "Exoneración de cuota de inscripción trimestral",
      detail: "Solo para becarios con ingreso desde 2223-1 en adelante"
    },
    {
      percentage: "Incluido",
      description: "Acompañamiento integral trimestral obligatorio",
      detail: "Seguimiento por la Dirección de Desarrollo y Bienestar Estudiantil"
    }
  ];

  const maintainanceConditions = [
    {
      condition: "Mantener IAA mínimo según tipología",
      detail: "16.50+ para Académica, 15.00+ para otras tipologías",
      article: "Art. 14-c"
    },
    {
      condition: "Inscribir y aprobar mínimo 15 créditos por trimestre regular",
      detail: "O el remanente necesario para finalizar estudios",
      article: "Art. 14-a"
    },
    {
      condition: "Culminar estudios en máximo 12 períodos regulares consecutivos",
      detail: "Incumplimiento resulta en rescisión automática salvo causas no imputables",
      article: "Art. 14-b"
    },
    {
      condition: "Cumplir con esquema de acompañamiento de DDBE",
      detail: "Participación obligatoria en tutorías y seguimiento",
      article: "Art. 14-h"
    },
    {
      condition: "No incurrir en sanciones disciplinarias",
      detail: "Cumplir reglamentos, normas y Código de Ética UNIMET",
      article: "Art. 14-i, Art. 3"
    },
    {
      condition: "Retiros de asignaturas requieren consulta previa",
      detail: "Debe evaluarse con DDBE antes de realizar retiros",
      article: "Art. 14-d"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Alerta informativa */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900">
          <strong>Reglamento vigente:</strong> Información basada en el Reglamento del Programa de Beneficios
          Socioeconómicos y Becas UNIMET, aprobado por Consejo Universitario (Reunión 588, 04/09/2025) y
          Consejo Superior (Reunión 436, 15/09/2025). Vigente desde período 2526-1.
        </AlertDescription>
      </Alert>

      {/* Categorías de Becas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Categorías de Becas de Excelencia (Art. 9)
          </CardTitle>
          <CardDescription>
            Conoce las cinco tipologías de becas de excelencia y sus requisitos específicos oficiales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {categories.map((category, index) => (
            <div key={category.name}>
              <div className="flex items-start space-x-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <category.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="font-semibold text-foreground text-lg">{category.name}</h3>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                        IAA {category.iaaRequired}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">{category.article}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Requisitos específicos de postulación:
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      {category.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              {index < categories.length - 1 && <Separator className="my-6" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Beneficios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Beneficios del Programa (Art. 8 y Art. 16)
          </CardTitle>
          <CardDescription>
            Cobertura económica y beneficios incluidos en el Programa de Excelencia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-4 border rounded-lg bg-card space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl font-bold text-primary">{benefit.percentage}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{benefit.description}</p>
                    <p className="text-xs text-muted-foreground">{benefit.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Alert className="mt-4 bg-orange-50 border-orange-200">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-900 text-sm">
              <strong>Importante:</strong> El programa NO cubre aranceles universitarios. El beneficiario debe
              pagar costos de asignaturas retiradas, reprobadas, o adicionales no pertenecientes al plan de
              estudios (Art. 16).
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Condiciones de Mantenimiento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Condiciones de Mantenimiento (Artículo 14)
          </CardTitle>
          <CardDescription>
            Requisitos obligatorios que debes cumplir para mantener tu beca activa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {maintainanceConditions.map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-foreground">{item.condition}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                  <Badge variant="outline" className="text-xs">{item.article}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documentos Generales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Proceso de Postulación (Artículo 13)
          </CardTitle>
          <CardDescription>
            Pasos y documentos generales para postularte al Programa de Excelencia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Enviar postulación por correo a DDBE con datos personales",
              "Flujograma de carrera indicando asignaturas cursadas y aprobadas",
              "Plan de carrera avalado por Director de Escuela",
              "Documentos específicos según tipología (ver arriba)",
              "Asistir a evaluación integral requerida por DDBE",
              "Firmar Carta Compromiso al ser seleccionado"
            ].map((doc, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <span className="text-sm text-muted-foreground">{doc}</span>
              </div>
            ))}
          </div>

          <Alert className="bg-purple-50 border-purple-200">
            <Clock className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-900 text-sm">
              <strong>Convocatorias:</strong> Anunciadas trimestralmente por la DDBE según cupos disponibles y
              previsión presupuestaria. Los resultados son avalados por el cuerpo técnico designado por la
              Secretaría General (Art. 5 y Art. 13).
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Información Adicional Importante
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
            <h4 className="font-semibold text-sm text-blue-900">Período Intensivo (Art. 14-e y Art. 16-c)</h4>
            <p className="text-xs text-blue-800">
              Si deseas cursar período intensivo, debes notificarlo a DDBE. El cuerpo técnico evaluará si los
              costos estarán cubiertos. No se permite retiro de asignaturas en período intensivo.
            </p>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-2">
            <h4 className="font-semibold text-sm text-green-900">Cambio de Carrera (Art. 14-g)</h4>
            <p className="text-xs text-green-800">
              Se permite un cambio de carrera si no tienes más de 45 unidades de crédito aprobadas, con aval
              de DDBE y aprobación del cuerpo técnico.
            </p>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg space-y-2">
            <h4 className="font-semibold text-sm text-yellow-900">Permisos para Interrumpir (Art. 17)</h4>
            <p className="text-xs text-yellow-800">
              Puedes solicitar permiso para interrumpir por condición de salud, orden legal, u otra causa que
              impida responsabilidades académicas. Estas solicitudes son evaluadas por el cuerpo técnico.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequirementsInfo;