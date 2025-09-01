import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import UnifiedApplicationForm from "@/components/shared/UnifiedApplicationForm";
import { 
  Trophy, 
  Users, 
  BookOpen, 
  Home,
  LogOut,
  Heart,
  CreditCard,
  ArrowLeft
} from "lucide-react";

const PostulacionesBecas = () => {
  const navigate = useNavigate();
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  const handleLogout = () => {
    navigate("/");
  };

  const handleProgramSelect = (programId: string) => {
    setSelectedProgram(programId);
  };

  const handleBackToPrograms = () => {
    setSelectedProgram(null);
  };

  const programs = [
    {
      id: "excelencia",
      title: "Beca de Excelencia Académica",
      description: "Para estudiantes con alto rendimiento académico que demuestren excelencia en sus estudios.",
      icon: Trophy
    },
    {
      id: "impacto",
      title: "Beca de Impacto Social",
      description: "Dirigida a estudiantes comprometidos con proyectos de impacto social y comunitario.",
      icon: Users
    },
    {
      id: "formacion",
      title: "Beca de Formación Docente",
      description: "Para estudiantes interesados en la carrera docente y formación pedagógica.",
      icon: BookOpen
    },
    {
      id: "necesidad",
      title: "Beca por Necesidad Económica",
      description: "Apoyo financiero para estudiantes en situación de vulnerabilidad económica.",
      icon: Heart
    },
    {
      id: "exoneracion",
      title: "Exoneración de Matrícula",
      description: "Programa de exoneración total o parcial de costos de matrícula para estudiantes destacados.",
      icon: CreditCard
    }
  ];

  if (selectedProgram) {
    const program = programs.find(p => p.id === selectedProgram);
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-orange/20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <img 
                  src="/lovable-uploads/8f3cd009-b095-4b62-9526-09516381421e.png" 
                  alt="Universidad Metropolitana" 
                  className="h-10"
                />
                <div>
                  <h1 className="font-semibold text-primary">Universidad Metropolitana</h1>
                  <p className="text-sm text-muted-foreground">Sistema de Postulaciones a Becas</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Volver al Inicio
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate("/")} className="cursor-pointer">
                  <Home className="h-4 w-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink onClick={handleBackToPrograms} className="cursor-pointer">
                  Postulaciones a Becas
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{program?.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Back Button */}
          <Button 
            variant="outline" 
            onClick={handleBackToPrograms}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Programas
          </Button>

          {/* Application Form */}
          <UnifiedApplicationForm programTitle={program?.title || ""} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-orange/20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/8f3cd009-b095-4b62-9526-09516381421e.png" 
                alt="Universidad Metropolitana" 
                className="h-10"
              />
              <div>
                <h1 className="font-semibold text-primary">Universidad Metropolitana</h1>
                <p className="text-sm text-muted-foreground">Sistema de Postulaciones a Becas</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Volver al Inicio
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate("/")} className="cursor-pointer">
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Postulaciones a Becas</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Postulaciones a Becas
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explora y postúlate a los diferentes programas de becas disponibles en la Universidad Metropolitana
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {programs.map((program) => (
            <Card 
              key={program.id}
              className="border-orange/20 bg-gradient-card hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <CardHeader className="text-center">
                <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <program.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-primary">{program.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="mb-6 min-h-[3rem] flex items-center justify-center">
                  {program.description}
                </CardDescription>
                
                <Button 
                  onClick={() => handleProgramSelect(program.id)}
                  className="w-full"
                >
                  Postular Ahora
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

      </main>
    </div>
  );
};

export default PostulacionesBecas;