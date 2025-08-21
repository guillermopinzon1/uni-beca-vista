import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserCheck, Target, Award, BookOpen, CheckCircle, AlertCircle } from "lucide-react";
import ModuleCard from "@/components/ModuleCard";

const Requisitos = () => {
  const navigate = useNavigate();

  const scholarshipTypes = [
    {
      id: "ayudantia",
      title: "Beca Ayudantía",
      description: "Requisitos para postularte como ayudante académico o de investigación",
      icon: UserCheck,
      requirements: [
        "Índice académico mínimo de 15 puntos",
        "Estar cursando entre 12 y 18 créditos por semestre",
        "No haber reprobado más de 2 materias en el último año académico",
        "Disponibilidad de al menos 8 horas semanales",
        "Carta de recomendación de un profesor",
        "Estar al día con los pagos universitarios"
      ]
    },
    {
      id: "impacto",
      title: "Beca Impacto",
      description: "Requisitos para proyectos de impacto social y comunitario",
      icon: Target,
      requirements: [
        "Índice académico mínimo de 16 puntos",
        "Presentar propuesta de proyecto de impacto social",
        "Demostrar experiencia en trabajo comunitario o voluntariado",
        "Carta de apoyo de organización comunitaria",
        "Cronograma detallado del proyecto propuesto",
        "Presupuesto justificado del proyecto",
        "Disponibilidad de tiempo completo durante el período de la beca"
      ]
    },
    {
      id: "excelencia",
      title: "Beca Excelencia",
      description: "Requisitos para reconocimiento al mérito académico excepcional",
      icon: Award,
      requirements: [
        "Índice académico mínimo de 18 puntos",
        "Estar en el 5% superior de tu promoción",
        "No haber reprobado ninguna materia",
        "Participación destacada en actividades académicas extracurriculares",
        "Carta de recomendación de al menos 2 profesores",
        "Ensayo sobre tus logros académicos y metas futuras",
        "Demostrar liderazgo estudiantil"
      ]
    },
    {
      id: "formacion-docente",
      title: "Beca Formación Docente",
      description: "Requisitos para futuros profesores universitarios",
      icon: BookOpen,
      requirements: [
        "Índice académico mínimo de 17 puntos",
        "Estar en los últimos 4 semestres de la carrera",
        "Demostrar vocación docente mediante experiencias previas",
        "Completar curso de pedagogía universitaria",
        "Carta de recomendación de director de escuela",
        "Compromiso de permanecer como docente por al menos 2 años",
        "Presentar propuesta de materia a dictar",
        "Aprobar entrevista con comité académico"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-orange/20 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/scholarship-programs")}
              className="text-primary hover:text-primary/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Requisitos de Becas</h1>
              <p className="text-sm text-muted-foreground">
                Inicio &gt; Postulaciones &gt; Requisitos
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-primary">Carlos Eduardo Silva</p>
              <p className="text-xs text-muted-foreground">Aspirante</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Message */}
          <Card className="border-orange/20 mb-8 bg-gradient-subtle">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Requisitos por Tipo de Beca</CardTitle>
              <CardDescription>
                Revisa cuidadosamente los requisitos específicos para cada tipo de beca antes de postularte. 
                Asegúrate de cumplir con todos los criterios para aumentar tus posibilidades de aprobación.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Scholarship Types Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {scholarshipTypes.map((scholarship) => (
              <Card key={scholarship.id} className="border-orange/20 h-fit">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <scholarship.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-primary">{scholarship.title}</CardTitle>
                      <CardDescription>{scholarship.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {scholarship.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{requirement}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Important Information */}
          <Card className="border-orange/20 mt-8">
            <CardHeader>
              <CardTitle className="text-xl text-primary flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>Información Importante</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• Los requisitos pueden variar según el período académico y disponibilidad presupuestaria</p>
                <p>• Es obligatorio cumplir con TODOS los requisitos listados para cada tipo de beca</p>
                <p>• La documentación debe estar actualizada y debidamente certificada</p>
                <p>• El proceso de verificación de requisitos puede tomar hasta 5 días hábiles</p>
                <p>• Para dudas específicas, contacta a la Oficina de Becas Estudiantiles</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Requisitos;