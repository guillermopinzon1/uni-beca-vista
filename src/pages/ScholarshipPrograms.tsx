import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GraduationCap, LogOut, User, UserCheck, ChevronRight, Home } from "lucide-react";

const ScholarshipPrograms = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const programs = [
    {
      id: 1,
      title: "Ayudantías",
      description: "Gestiona tu postulación y seguimiento como ayudante académico o de investigación.",
      icon: UserCheck,
      route: "/dashboard",
      available: true
    }
    // Future programs: "Becas de Mérito Académico", "Becas Socioeconómicas", etc.
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-orange/20 bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">Universidad Metropolitana</h1>
                <p className="text-sm text-muted-foreground">Sistema de Gestión de Becas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-foreground">Bienvenido, Usuario</span>
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
              className="bg-gradient-card border-orange/20 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(program.route)}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(program.route);
                  }}
                >
                  Acceder
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