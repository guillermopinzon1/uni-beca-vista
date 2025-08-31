import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { GraduationCap, LogOut, User, UserCheck, ChevronRight, Home, ArrowLeft, Target, Award, BookOpen } from "lucide-react";
import PasanteAyudantiasDashboard from "./PasanteAyudantiasDashboard";
import AspiranteScholarshipPrograms from "./AspiranteScholarshipPrograms";

const ScholarshipPrograms = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "supervisor";
    setUserRole(role);
  }, []);

  // Show role-specific views
  if (userRole === "pasante") {
    return <PasanteAyudantiasDashboard />;
  }

  if (userRole === "aspirante") {
    return <AspiranteScholarshipPrograms />;
  }

  const handleLogout = () => {
    navigate("/login");
  };

  const programs = [
    {
      id: 1,
      title: "Ayudantía",
      description: "Gestiona tu postulación y seguimiento como ayudante académico o de investigación.",
      icon: UserCheck,
      route: "/modules",
      available: true
    },
    {
      id: 2,
      title: "Impacto",
      description: "Programa de becas orientado al desarrollo de proyectos de impacto social y comunitario.",
      icon: Target,
      route: "/impacto",
      available: true
    },
    {
      id: 3,
      title: "Excelencia",
      description: "Reconocimiento al mérito académico excepcional y trayectoria estudiantil destacada.",
      icon: Award,
      route: "/excelencia",
      available: true
    },
    {
      id: 4,
      title: "Beca Formación Docente",
      description: "Programa especializado para la formación y desarrollo de futuros profesores universitarios.",
      icon: BookOpen,
      route: "/formacion-docente",
      available: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-orange/20 bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/modules")}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </Button>
              <GraduationCap className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">Universidad Metropolitana</h1>
                <p className="text-sm text-muted-foreground">Sistema de Gestión de Becas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-foreground">Bienvenido, Usuario ({userRole})</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="border-b border-orange/10 bg-card/50">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/modules")}
              className="p-0 h-auto text-muted-foreground hover:text-primary"
            >
              <Home className="h-4 w-4 mr-1" />
              Inicio
            </Button>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">Gestión de Becas</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">Programas de Becas</h2>
          <p className="text-muted-foreground">Selecciona el programa de becas que te interesa</p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {programs.map((program) => (
            <Card 
              key={program.id} 
              className={`bg-gradient-card border-orange/20 hover:shadow-lg transition-all duration-300 group ${program.available ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'}`}
              onClick={() => program.available && navigate(program.route)}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                  <program.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">{program.title}</CardTitle>
                {program.description && (
                  <CardDescription className="text-muted-foreground">
                    {program.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="text-center pb-6">
                <Button 
                  className="bg-gradient-primary hover:opacity-90 w-full"
                  disabled={!program.available}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (program.available) navigate(program.route);
                  }}
                >
                  {program.available ? "Acceder" : "Próximamente"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Future programs placeholder */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-orange-accent/20 rounded-lg">
            <span className="text-sm text-muted-foreground">
              Más programas de becas estarán disponibles próximamente
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScholarshipPrograms;