import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, ClipboardList, BarChart3, Calendar, Plus } from "lucide-react";
import ModuleCard from "@/components/ModuleCard";

const AyudantiasDashboard = () => {
  const navigate = useNavigate();

  const submodules = [
    {
      title: "Postulaciones",
      description: "Gestiona las postulaciones de estudiantes para ayudantías académicas y de investigación",
      icon: ClipboardList,
      route: "/postulaciones"
    },
    {
      title: "Evaluaciones",
      description: "Revisa y evalúa las postulaciones de los estudiantes candidatos",
      icon: BarChart3,
      route: "#"
    },
    {
      title: "Programación",
      description: "Administra horarios y asignaciones de ayudantes",
      icon: Calendar,
      route: "#"
    },
    {
      title: "Ayudantes Activos",
      description: "Supervisa y gestiona a los estudiantes ayudantes actualmente asignados",
      icon: Users,
      route: "#"
    }
  ];

  const stats = [
    {
      title: "Postulaciones Activas",
      value: "24",
      change: "+12% vs mes anterior",
      icon: ClipboardList
    },
    {
      title: "Ayudantes Asignados",
      value: "156",
      change: "+8% vs mes anterior", 
      icon: Users
    },
    {
      title: "Departamentos",
      value: "8",
      change: "Sin cambios",
      icon: BarChart3
    },
    {
      title: "Período Actual",
      value: "2025-1",
      change: "Activo",
      icon: Calendar
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
              <h1 className="text-2xl font-bold text-primary">Ayudantías</h1>
              <p className="text-sm text-muted-foreground">
                Inicio &gt; Gestión de Becas &gt; Ayudantías
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-primary">Juan Carlos Pérez</p>
              <p className="text-xs text-muted-foreground">Administrador</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="border-orange/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Submodules Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-2">
                  Módulos de Ayudantías
                </h2>
                <p className="text-muted-foreground">
                  Accede a las diferentes funcionalidades del sistema de ayudantías
                </p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Convocatoria
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {submodules.map((module, index) => (
                <ModuleCard
                  key={index}
                  title={module.title}
                  description={module.description}
                  icon={module.icon}
                  onClick={() => {
                    if (module.route !== "#") {
                      navigate(module.route);
                    }
                  }}
                />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="border-orange/20">
            <CardHeader>
              <CardTitle className="text-primary">Acciones Rápidas</CardTitle>
              <CardDescription>
                Funcionalidades más utilizadas en el sistema de ayudantías
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                  onClick={() => navigate("/postulaciones")}
                >
                  <ClipboardList className="h-6 w-6 mb-2" />
                  Ver Postulaciones
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Users className="h-6 w-6 mb-2" />
                  Gestionar Ayudantes
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <BarChart3 className="h-6 w-6 mb-2" />
                  Ver Reportes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AyudantiasDashboard;