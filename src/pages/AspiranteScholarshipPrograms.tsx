import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserPlus, FileText, Clock, Users } from "lucide-react";
import ModuleCard from "@/components/ModuleCard";

const AspiranteScholarshipPrograms = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Convocatorias Activas",
      value: "5",
      change: "3 nuevas esta semana",
      icon: FileText
    },
    {
      title: "Plazas Disponibles",
      value: "24",
      change: "En diferentes departamentos",
      icon: Users
    },
    {
      title: "Tiempo Restante",
      value: "15 días",
      change: "Para postularse",
      icon: Clock
    },
    {
      title: "Mis Postulaciones",
      value: "0",
      change: "Aún no has postulado",
      icon: UserPlus
    }
  ];

  const submodules = [
    {
      title: "Postularme",
      description: "Postúlate a las convocatorias de ayudantías disponibles según tu perfil académico",
      icon: UserPlus,
      route: "/postulaciones",
      highlighted: true
    },
    {
      title: "Requisitos",
      description: "Consulta los requisitos específicos para cada tipo de beca disponible",
      icon: FileText,
      route: "/requisitos",
      highlighted: false
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
              onClick={() => navigate("/modules")}
              className="text-primary hover:text-primary/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Postulaciones a Becas</h1>
              <p className="text-sm text-muted-foreground">
                Inicio &gt; Postulaciones
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
              <CardTitle className="text-xl text-primary">¡Bienvenido Aspirante!</CardTitle>
              <CardDescription>
                Aquí puedes postularte a las diferentes convocatorias de ayudantías disponibles. 
                Revisa los requisitos de cada convocatoria y postúlate a las que mejor se adapten a tu perfil académico.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Modules Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-2">
                  Postulaciones
                </h2>
                <p className="text-muted-foreground">
                  Accede al sistema de postulaciones para ayudantías
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {submodules.map((module, index) => (
                <div key={index} className={module.highlighted ? "transform scale-105" : ""}>
                  <ModuleCard
                    title={module.title}
                    description={module.description}
                    icon={module.icon}
                    onClick={() => {
                      if (module.route !== "#") {
                        navigate(module.route);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Information Card */}
          <Card className="border-orange/20">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Información Importante</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• Las postulaciones están abiertas hasta el final del período establecido</p>
                <p>• Asegúrate de cumplir con todos los requisitos académicos antes de postularte</p>
                <p>• Puedes postularte a múltiples convocatorias si cumples los requisitos</p>
                <p>• El proceso de selección se basa en el rendimiento académico y disponibilidad horaria</p>
                <p>• Recibirás notificaciones sobre el estado de tus postulaciones por correo electrónico</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AspiranteScholarshipPrograms;