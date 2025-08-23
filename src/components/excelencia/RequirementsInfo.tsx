import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Users
} from "lucide-react";

const RequirementsInfo = () => {
  const categories = [
    {
      name: "Académica",
      icon: GraduationCap,
      iaaRequired: "≥ 17.5 (Pregrado) / ≥ 18 (Postgrado)",
      description: "Para estudiantes con excelencia académica demostrada",
      requirements: [
        "Histórico de notas certificado",
        "Flujograma de carrera actualizado",
        "Carta de recomendación académica",
        "Ensayo sobre objetivos académicos"
      ]
    },
    {
      name: "Deportiva",
      icon: Trophy,
      iaaRequired: "≥ 15",
      description: "Para atletas destacados en competencias deportivas",
      requirements: [
        "Certificado de participación deportiva",
        "Logros y reconocimientos deportivos",
        "Carta del entrenador o director deportivo",
        "Cronograma de entrenamientos y competencias"
      ]
    },
    {
      name: "Artística",
      icon: Palette,
      iaaRequired: "≥ 15",
      description: "Para estudiantes con talento artístico reconocido",
      requirements: [
        "Portafolio de obras artísticas",
        "Certificados de participación en eventos",
        "Carta de recomendación artística",
        "Plan de desarrollo artístico"
      ]
    },
    {
      name: "Compromiso Cívico",
      icon: Heart,
      iaaRequired: "≥ 15",
      description: "Para estudiantes activos en servicio comunitario",
      requirements: [
        "Certificado de horas de servicio comunitario",
        "Carta de la organización beneficiaria",
        "Proyecto de impacto social",
        "Evidencias fotográficas de actividades"
      ]
    },
    {
      name: "Emprendimiento",
      icon: Lightbulb,
      iaaRequired: "≥ 15",
      description: "Para estudiantes con iniciativas emprendedoras",
      requirements: [
        "Plan de negocio o proyecto emprendedor",
        "Evidencias de implementación",
        "Carta de recomendación empresarial",
        "Proyección de impacto económico/social"
      ]
    }
  ];

  const benefits = [
    { percentage: "15%", description: "Descuento base según estudio socioeconómico" },
    { percentage: "25%", description: "Descuento medio según estudio socioeconómico" },
    { percentage: "50%", description: "Descuento máximo según estudio socioeconómico" },
    { percentage: "15%", description: "Descuento adicional por posición de honor" }
  ];

  const maintainanceConditions = [
    "Mantener el IAA mínimo según la categoría de beca",
    "Inscribir el número mínimo de créditos por período",
    "Cumplir con las normas de convivencia universitaria",
    "Participar en actividades relacionadas con la categoría de beca",
    "Presentar informes periódicos de progreso",
    "Renovar la beca cada período académico"
  ];

  return (
    <div className="space-y-6">
      {/* Categorías de Becas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Categorías de Becas de Excelencia
          </CardTitle>
          <CardDescription>
            Conoce los diferentes tipos de becas disponibles y sus requisitos específicos
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
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{category.name}</h3>
                    <Badge variant="outline">IAA {category.iaaRequired}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Documentos requeridos:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {category.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {req}
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
            Beneficios y Cobertura
          </CardTitle>
          <CardDescription>
            Porcentajes de descuento disponibles según evaluación socioeconómica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">{benefit.percentage}</div>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Condiciones de Mantenimiento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Condiciones de Mantenimiento
          </CardTitle>
          <CardDescription>
            Requisitos que debe cumplir para mantener la beca activa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {maintainanceConditions.map((condition, index) => (
              <div key={index} className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <p className="text-sm text-muted-foreground">{condition}</p>
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
            Documentos Generales Requeridos
          </CardTitle>
          <CardDescription>
            Documentos básicos necesarios para todas las categorías
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Histórico de notas certificado",
              "Flujograma de carrera actualizado",
              "Copia de cédula de identidad",
              "Foto tipo carnet reciente",
              "Planilla de inscripción vigente",
              "Solvencia administrativa"
            ].map((doc, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-muted-foreground">{doc}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequirementsInfo;