import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, CheckCircle, TrendingUp, Plus, Calendar } from "lucide-react";

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
    },
    {
      title: "Progreso Total",
      value: "37.9%",
      change: "45.5/120 horas",
      icon: TrendingUp
    },
    {
      title: "Días Trabajados",
      value: "18",
      change: "Este mes",
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
              <h1 className="text-2xl font-bold text-primary">Mi Ayudantía</h1>
              <p className="text-sm text-muted-foreground">
                Inicio &gt; Gestión de Becas &gt; Ayudantía
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-primary">Ana María Rodríguez</p>
              <p className="text-xs text-muted-foreground">Pasante</p>
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

          {/* Actions Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Register Hours Card */}
            <Card className="border-orange/20">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Registrar Horas
                </CardTitle>
                <CardDescription>
                  Registra las horas trabajadas en tu ayudantía
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-primary hover:opacity-90">
                  Registrar Horas Trabajadas
                </Button>
              </CardContent>
            </Card>

            {/* Hours History Card */}
            <Card className="border-orange/20">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Historial de Horas
                </CardTitle>
                <CardDescription>
                  Consulta tu historial de horas registradas y aprobaciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Ver Historial Completo
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