import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, FileText, Activity } from "lucide-react";
import { useState } from "react";
import AvailabilitySchedule from "@/components/AvailabilitySchedule";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle } from "lucide-react";

const PasanteAyudantiasModules = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>("horario-disponibilidad");
  const [formData, setFormData] = useState({
    fecha: "",
    horas: "",
    descripcion: "",
    objetivos: "",
    metas: "",
    actividades: "",
    reporteSemanal: "",
    observaciones: ""
  });

  const sidebarItems = [
    {
      title: "Horario de Disponibilidad",
      icon: Calendar,
      onClick: () => setActiveModule("horario-disponibilidad")
    },
    {
      title: "Horas Registradas",
      icon: Clock,
      onClick: () => setActiveModule("horas-registradas")
    },
    {
      title: "Sistema de Reporte de Actividades",
      icon: FileText,
      onClick: () => setActiveModule("reporte-actividades")
    },
    {
      title: "Actividades Recientes",
      icon: Activity,
      onClick: () => setActiveModule("actividades-recientes")
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Datos enviados",
      description: "La información ha sido registrada exitosamente.",
    });
    setFormData({
      fecha: "",
      horas: "",
      descripcion: "",
      objetivos: "",
      metas: "",
      actividades: "",
      reporteSemanal: "",
      observaciones: ""
    });
  };

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

  const renderContent = () => {
    switch (activeModule) {
      case "horario-disponibilidad":
        return <AvailabilitySchedule />;
      
      case "horas-registradas":
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Register Hours Form */}
            <Card className="border-orange/20">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Registrar Horas</CardTitle>
                <CardDescription>
                  Registra las horas trabajadas en tu ayudantía
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fecha">Fecha</Label>
                      <Input
                        id="fecha"
                        type="date"
                        value={formData.fecha}
                        onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="horas">Horas trabajadas</Label>
                      <Input
                        id="horas"
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="8"
                        placeholder="Ej: 4.5"
                        value={formData.horas}
                        onChange={(e) => setFormData({...formData, horas: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción de actividades</Label>
                    <Textarea
                      id="descripcion"
                      placeholder="Describe las actividades realizadas..."
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                      required
                    />
                  </div>
                  <Button type="submit" className="bg-gradient-primary hover:opacity-90">
                    Registrar Horas
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        );

      case "reporte-actividades":
        return (
          <Card className="border-orange/20">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Sistema de Reporte de Actividades</CardTitle>
              <CardDescription>
                Completa el reporte detallado de tus actividades como ayudante
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Objetivos y Metas */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Objetivos y Metas</h3>
                  <div className="space-y-2">
                    <Label htmlFor="objetivos">Objetivos del período</Label>
                    <Textarea
                      id="objetivos"
                      placeholder="Describe los objetivos planteados para este período..."
                      value={formData.objetivos}
                      onChange={(e) => setFormData({...formData, objetivos: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="metas">Metas específicas</Label>
                    <Textarea
                      id="metas"
                      placeholder="Detalla las metas específicas alcanzadas..."
                      value={formData.metas}
                      onChange={(e) => setFormData({...formData, metas: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* Programación de Actividades */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Programación de Actividades por Período</h3>
                  <div className="space-y-2">
                    <Label htmlFor="actividades">Actividades programadas y ejecutadas</Label>
                    <Textarea
                      id="actividades"
                      placeholder="Describe las actividades programadas y su estado de ejecución..."
                      value={formData.actividades}
                      onChange={(e) => setFormData({...formData, actividades: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* Reporte Semanal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Reporte Semanal de Actividades</h3>
                  <div className="space-y-2">
                    <Label htmlFor="reporteSemanal">Actividades realizadas esta semana</Label>
                    <Textarea
                      id="reporteSemanal"
                      placeholder="Detalla las actividades específicas realizadas durante la semana..."
                      value={formData.reporteSemanal}
                      onChange={(e) => setFormData({...formData, reporteSemanal: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* Observaciones */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-primary">Observaciones</h3>
                  <div className="space-y-2">
                    <Label htmlFor="observaciones">Observaciones generales</Label>
                    <Textarea
                      id="observaciones"
                      placeholder="Incluye cualquier observación adicional, dificultades encontradas, sugerencias de mejora..."
                      value={formData.observaciones}
                      onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90">
                  Enviar Reporte
                </Button>
              </form>
            </CardContent>
          </Card>
        );

      case "actividades-recientes":
        return (
          <Card className="border-orange/20">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Actividades Recientes</CardTitle>
              <CardDescription>
                Últimas horas registradas y su estado de aprobación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">15 Enero 2025 - 4 horas</p>
                    <p className="text-sm text-muted-foreground">Revisión de materiales académicos</p>
                  </div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Aprobado</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">14 Enero 2025 - 3.5 horas</p>
                    <p className="text-sm text-muted-foreground">Apoyo en laboratorio de física</p>
                  </div>
                  <div className="flex items-center text-yellow-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">Pendiente</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">13 Enero 2025 - 4 horas</p>
                    <p className="text-sm text-muted-foreground">Preparación de clases prácticas</p>
                  </div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Aprobado</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">12 Enero 2025 - 3 horas</p>
                    <p className="text-sm text-muted-foreground">Tutoría a estudiantes</p>
                  </div>
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Aprobado</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Bienvenido al Sistema de Ayudantías
            </h2>
            <p className="text-muted-foreground">
              Utiliza el menú lateral para navegar entre los diferentes módulos
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-orange/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/pasante-ayudantias-dashboard")}
              className="text-primary hover:text-primary/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Gestión de Ayudantía</h1>
              <p className="text-sm text-muted-foreground">
                Inicio &gt; Mi Ayudantía &gt; Gestión
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

      <div className="flex">
        {/* Integrated Sidebar */}
        <div className="w-16 bg-card border-r border-orange/20 min-h-[calc(100vh-theme(spacing.20))]">
          <div className="p-2 space-y-2">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setHoveredItem(item.title)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={item.onClick}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg border transition-all duration-200 ${
                    activeModule === item.onClick.toString().split('"')[1]
                      ? "bg-orange/10 border-orange/40"
                      : "bg-background border-orange/20 hover:bg-orange/10 hover:border-orange/40"
                  }`}
                >
                  <item.icon className="h-5 w-5 text-primary" />
                </button>
                
                {/* Tooltip on hover */}
                {hoveredItem === item.title && (
                  <div className="absolute left-16 top-0 bg-card border border-orange/20 rounded-lg px-3 py-2 shadow-lg z-10 whitespace-nowrap">
                    <span className="text-sm font-medium text-primary">{item.title}</span>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-card border-l border-b border-orange/20 rotate-45"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PasanteAyudantiasModules;