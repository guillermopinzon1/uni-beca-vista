import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, CheckCircle, FileText } from "lucide-react";

const PasanteAyudantiasDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Horas Registradas",
      value: "45.5",
      change: "Esta semana: 12h",
      icon: Clock
    },
    {
      title: "Horas Aprobadas",
      value: "40",
      change: "88% aprobación",
      icon: CheckCircle
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
              onClick={() => navigate(-1)}
              className="text-primary hover:text-primary/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Mi Ayudantía</h1>
              <p className="text-sm text-muted-foreground">
                Inicio &gt; Gestión de Becas &gt; Ayudantía
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-primary">Ana María Rodríguez</p>
              <p className="text-xs text-muted-foreground">Ayudante</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

          {/* Actions Section */}
          <div className="flex justify-center mb-8">
            {/* Activity Report System Card */}
            <Card className="border-orange/20 w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Sistema de Reporte de Actividades
                </CardTitle>
                <CardDescription>
                  Completa el reporte detallado de tus actividades como ayudante
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate("/pasante-ayudantias-modules")} 
                  className="w-full bg-gradient-primary hover:opacity-90"
                >
                  Ir a Gestión de Actividades
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="border-orange/20">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Actividad Reciente</CardTitle>
              <CardDescription>
                Últimas horas registradas y su estado de aprobación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">15 Enero 2025 - 4 horas</p>
                  </div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Aprobado</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">14 Enero 2025 - 3.5 horas</p>
                  </div>
                  <div className="flex items-center text-yellow-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">Pendiente</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">13 Enero 2025 - 4 horas</p>
                  </div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Aprobado</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PasanteAyudantiasDashboard;