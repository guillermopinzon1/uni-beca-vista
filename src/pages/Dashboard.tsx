import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  Users, 
  DollarSign, 
  FileText, 
  Bell, 
  Settings,
  LogOut,
  Calendar,
  TrendingUp
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");

  const handleLogout = () => {
    navigate("/login");
  };

  const scholarships = [
    {
      id: 1,
      name: "Beca de Excelencia Académica",
      status: "Activa",
      amount: "$1,200",
      deadline: "2024-12-15",
      progress: 75
    },
    {
      id: 2,
      name: "Beca de Apoyo Socioeconómico",
      status: "En revisión",
      amount: "$800",
      deadline: "2024-11-30",
      progress: 50
    },
    {
      id: 3,
      name: "Beca de Investigación",
      status: "Disponible",
      amount: "$1,500",
      deadline: "2024-12-31",
      progress: 0
    }
  ];

  const stats = [
    {
      title: "Becas Activas",
      value: "24",
      icon: GraduationCap,
      change: "+12%",
      positive: true
    },
    {
      title: "Estudiantes Beneficiados",
      value: "156",
      icon: Users,
      change: "+8%",
      positive: true
    },
    {
      title: "Monto Total Otorgado",
      value: "$45,600",
      icon: DollarSign,
      change: "+15%",
      positive: true
    },
    {
      title: "Solicitudes Pendientes",
      value: "18",
      icon: FileText,
      change: "-5%",
      positive: false
    }
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
              <Bell className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary" />
              <Settings className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary" />
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Panel de Control</h2>
          <p className="text-muted-foreground">Gestiona las becas y monitorea el progreso</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gradient-card border-orange/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className={`h-4 w-4 mr-1 ${stat.positive ? 'text-green-500' : 'text-red-500'}`} />
                      <span className={`text-sm ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Section */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="scholarships">Becas</TabsTrigger>
            <TabsTrigger value="applications">Solicitudes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-orange/20">
                <CardHeader>
                  <CardTitle className="text-primary">Becas Recientes</CardTitle>
                  <CardDescription>Últimas becas agregadas al sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scholarships.slice(0, 3).map((scholarship) => (
                      <div key={scholarship.id} className="flex items-center justify-between p-3 bg-orange-accent/20 rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{scholarship.name}</p>
                          <p className="text-sm text-muted-foreground">{scholarship.amount}</p>
                        </div>
                        <Badge 
                          variant={scholarship.status === "Activa" ? "default" : "secondary"}
                          className="bg-primary/10 text-primary"
                        >
                          {scholarship.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange/20">
                <CardHeader>
                  <CardTitle className="text-primary">Progreso del Mes</CardTitle>
                  <CardDescription>Estadísticas de solicitudes procesadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Solicitudes Aprobadas</span>
                        <span className="text-sm text-muted-foreground">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Documentos Revisados</span>
                        <span className="text-sm text-muted-foreground">60%</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Pagos Procesados</span>
                        <span className="text-sm text-muted-foreground">90%</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scholarships" className="mt-6">
            <Card className="border-orange/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-primary">Gestión de Becas</CardTitle>
                    <CardDescription>Administra todas las becas disponibles</CardDescription>
                  </div>
                  <Button className="bg-gradient-primary hover:opacity-90">
                    Nueva Beca
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scholarships.map((scholarship) => (
                    <div key={scholarship.id} className="flex items-center justify-between p-4 border border-orange/20 rounded-lg bg-gradient-card">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{scholarship.name}</h3>
                        <p className="text-sm text-muted-foreground">Monto: {scholarship.amount}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Vence: {scholarship.deadline}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">Progreso</p>
                          <Progress value={scholarship.progress} className="w-20 h-2" />
                        </div>
                        <Badge 
                          variant={scholarship.status === "Activa" ? "default" : "secondary"}
                          className="bg-primary/10 text-primary"
                        >
                          {scholarship.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="mt-6">
            <Card className="border-orange/20">
              <CardHeader>
                <CardTitle className="text-primary">Solicitudes de Becas</CardTitle>
                <CardDescription>Revisa y gestiona las solicitudes pendientes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No hay solicitudes pendientes</h3>
                  <p className="text-muted-foreground">Las nuevas solicitudes aparecerán aquí para su revisión</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;