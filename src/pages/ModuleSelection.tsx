import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GraduationCap, LogOut, User } from "lucide-react";

const ModuleSelection = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const modules = [
    {
      id: 1,
      title: "Gestión de Becas",
      description: "Centraliza la postulación, evaluación y seguimiento de todas las becas.",
      icon: GraduationCap,
      route: "/scholarship-programs",
      available: true
    }
    // Future modules can be added here
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">Módulos del Sistema</h2>
          <p className="text-muted-foreground">Selecciona el módulo al que deseas acceder</p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {modules.map((module) => (
            <Card 
              key={module.id} 
              className="bg-gradient-card border-orange/20 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(module.route)}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                  <module.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">{module.title}</CardTitle>
                {module.description && (
                  <CardDescription className="text-muted-foreground">
                    {module.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="text-center pb-6">
                <Button 
                  className="bg-gradient-primary hover:opacity-90 w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(module.route);
                  }}
                >
                  Acceder
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Future modules placeholder */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-orange-accent/20 rounded-lg">
            <span className="text-sm text-muted-foreground">
              Más módulos estarán disponibles próximamente
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModuleSelection;