import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart3, FileText, AlertTriangle, Download, Calendar, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Reportes = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState("2025-1");
  const [selectedType, setSelectedType] = useState("todos");

  const reportTypes = [
    {
      title: "Estadísticas Generales",
      description: "Obtén estadísticas generales del sistema de ayudantías",
      icon: BarChart3,
      action: "Generar Estadísticas"
    },
    {
      title: "Reporte por Período",
      description: "Reporte detallado de ayudantías en un período específico",
      icon: Calendar,
      action: "Generar Reporte"
    },
    {
      title: "Reporte de Cumplimiento",
      description: "Identifica estudiantes con riesgo de incumplimiento",
      icon: AlertTriangle,
      action: "Generar Análisis"
    },
    {
      title: "Dashboard Ejecutivo",
      description: "Métricas clave y tendencias para la toma de decisiones",
      icon: FileText,
      action: "Ver Dashboard"
    }
  ];

  const mockStats = {
    total_postulaciones: 150,
    postulaciones_por_estado: {
      pendiente: 25,
      en_evaluacion: 30,
      aprobada: 80,
      rechazada: 15
    },
    total_ayudantias: 80,
    ayudantias_por_tipo: {
      academica: 45,
      administrativa: 25,
      investigacion: 10
    },
    promedio_horas_completadas: 75.5,
    periodo_actual: "2025-1"
  };

  const handleExportExcel = () => {
    // Simular descarga de Excel
    console.log("Exportando reporte a Excel...");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-orange/20 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/ayudantias")}
              className="text-primary hover:text-primary/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Reportes y Estadísticas</h1>
              <p className="text-sm text-muted-foreground">
                Inicio &gt; Gestión de Becas &gt; Ayudantías &gt; Reportes
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportExcel}
              className="border-primary/20 text-primary hover:bg-primary/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar Excel
            </Button>
            <div className="text-right">
              <p className="text-sm font-medium text-primary">Juan Carlos Pérez</p>
              <p className="text-xs text-muted-foreground">Supervisor</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Filters Section */}
          <Card className="mb-8 border-orange/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Filter className="h-5 w-5" />
                Filtros de Reporte
              </CardTitle>
              <CardDescription>
                Configura los parámetros para generar reportes personalizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="period">Período Académico</Label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025-1">2025-1</SelectItem>
                      <SelectItem value="2024-2">2024-2</SelectItem>
                      <SelectItem value="2024-1">2024-1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Ayudantía</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="academica">Académica</SelectItem>
                      <SelectItem value="administrativa">Administrativa</SelectItem>
                      <SelectItem value="investigacion">Investigación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="threshold">Umbral de Cumplimiento (%)</Label>
                  <Input 
                    type="number" 
                    placeholder="75" 
                    min="0" 
                    max="100"
                    className="border-orange/20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-orange/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Postulaciones
                </CardTitle>
                <FileText className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{mockStats.total_postulaciones}</div>
                <p className="text-xs text-muted-foreground">Período actual</p>
              </CardContent>
            </Card>

            <Card className="border-orange/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ayudantías Activas
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{mockStats.total_ayudantias}</div>
                <p className="text-xs text-muted-foreground">En funcionamiento</p>
              </CardContent>
            </Card>

            <Card className="border-orange/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Promedio Horas
                </CardTitle>
                <Calendar className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{mockStats.promedio_horas_completadas}%</div>
                <p className="text-xs text-muted-foreground">Completadas</p>
              </CardContent>
            </Card>

            <Card className="border-orange/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Aprobadas
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{mockStats.postulaciones_por_estado.aprobada}</div>
                <p className="text-xs text-muted-foreground">De {mockStats.total_postulaciones} postulaciones</p>
              </CardContent>
            </Card>
          </div>

          {/* Report Types */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-2">
                  Tipos de Reportes
                </h2>
                <p className="text-muted-foreground">
                  Selecciona el tipo de reporte que deseas generar
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportTypes.map((report, index) => (
                <Card key={index} className="border-orange/20 hover:bg-accent/5 transition-colors cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-primary">
                      <report.icon className="h-6 w-6" />
                      {report.title}
                    </CardTitle>
                    <CardDescription>
                      {report.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      {report.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Status Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="border-orange/20">
              <CardHeader>
                <CardTitle className="text-primary">Distribución por Estado</CardTitle>
                <CardDescription>Postulaciones según su estado actual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(mockStats.postulaciones_por_estado).map(([estado, cantidad]) => (
                    <div key={estado} className="flex items-center justify-between">
                      <span className="text-sm capitalize text-muted-foreground">{estado.replace('_', ' ')}</span>
                      <span className="font-semibold text-primary">{cantidad}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange/20">
              <CardHeader>
                <CardTitle className="text-primary">Ayudantías por Tipo</CardTitle>
                <CardDescription>Distribución según tipo de ayudantía</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(mockStats.ayudantias_por_tipo).map(([tipo, cantidad]) => (
                    <div key={tipo} className="flex items-center justify-between">
                      <span className="text-sm capitalize text-muted-foreground">{tipo}</span>
                      <span className="font-semibold text-primary">{cantidad}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reportes;