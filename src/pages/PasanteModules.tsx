import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Users, Clock } from "lucide-react";
import ModuleCard from "@/components/ModuleCard";

const PasanteModules = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const modules = [
    {
      title: "Mi Ayudantía",
      description: "Gestiona tus horas de trabajo, registra actividades y consulta tu progreso en el programa de ayudantías.",
      icon: Clock,
      route: "/pasante-ayudantias-dashboard",
      available: true
    },
    {
      title: "Capacitaciones",
      description: "Accede a recursos de formación y capacitaciones para mejorar tus habilidades como ayudante.",
      icon: BookOpen,
      route: "/capacitaciones",
      available: false
    },
    {
      title: "Comunidad",
      description: "Conecta con otros ayudantes y supervisores para compartir experiencias y conocimientos.",
      icon: Users,
      route: "/comunidad",
      available: false
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
              <h1 className="text-2xl font-bold text-primary">Módulos de Ayudante</h1>
              <p className="text-sm text-muted-foreground">
                Inicio &gt; Gestión de Becas &gt; Módulos
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-primary">Ana María Rodríguez</p>
              <p className="text-xs text-muted-foreground">Ayudante</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-orange/20 hover:bg-orange/10"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Card */}
          <Card className="border-orange/20 mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Bienvenida al Portal de Ayudantes</CardTitle>
              <CardDescription>
                Accede a los diferentes módulos disponibles para gestionar tu experiencia como ayudante en el programa de ayudantías.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {modules.map((module, index) => (
              <div key={index} className="relative">
                <ModuleCard
                  title={module.title}
                  description={module.description}
                  icon={module.icon}
                  onClick={() => {
                    if (module.available) {
                      navigate(module.route);
                    }
                  }}
                  buttonText={module.available ? "Acceder" : "Próximamente"}
                />
                {!module.available && (
                  <div className="absolute inset-0 bg-background/50 rounded-lg pointer-events-none" />
                )}
              </div>
            ))}
          </div>

          {/* Information Card */}
          <Card className="border-orange/20">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Información Importante</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  • Registra tus horas de trabajo semanalmente para mantener tu beca activa
                </p>
                <p className="text-sm text-muted-foreground">
                  • Las horas deben ser aprobadas por tu supervisor para ser válidas
                </p>
                <p className="text-sm text-muted-foreground">
                  • Participa en las capacitaciones disponibles para mejorar tus habilidades
                </p>
                <p className="text-sm text-muted-foreground">
                  • Mantén comunicación constante con tu supervisor y coordinador de programa
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PasanteModules;