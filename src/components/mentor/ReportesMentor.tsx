import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Download, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Users,
  Award,
  AlertTriangle
} from "lucide-react";

const ReportesMentor = () => {
  const estadisticas = {
    totalEstudiantes: 8,
    estudiantesExitosos: 6,
    estudiantesRiesgo: 2,
    tasaRetencion: 87.5,
    sesionesRealizadas: 45,
    promedioDuracion: 55
  };

  const reportesIndividuales = [
    {
      estudiante: "Carlos Rodríguez",
      ultimoReporte: "2024-01-15",
      estado: "Progreso Satisfactorio",
      iaa: 13.5,
      tendencia: "positiva"
    },
    {
      estudiante: "Ana Martínez",
      ultimoReporte: "2024-01-10",
      estado: "Requiere Atención",
      iaa: 12.3,
      tendencia: "neutral"
    },
    {
      estudiante: "Luis Pérez",
      ultimoReporte: "2024-01-08",
      estado: "Riesgo Alto",
      iaa: 11.8,
      tendencia: "negativa"
    },
    {
      estudiante: "María González",
      ultimoReporte: "2024-01-18",
      estado: "Excelente",
      iaa: 14.2,
      tendencia: "positiva"
    }
  ];

  const getTendenciaIcon = (tendencia: string) => {
    if (tendencia === "positiva") return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (tendencia === "negativa") return <AlertTriangle className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4 bg-yellow-500 rounded-full" />;
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Excelente":
        return "bg-green-100 text-green-700 border-green-200";
      case "Progreso Satisfactorio":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Requiere Atención":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Riesgo Alto":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Estudiantes Asignados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{estadisticas.totalEstudiantes}</span>
            <p className="text-sm text-muted-foreground">Total activos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Award className="h-4 w-4 mr-2" />
              Tasa de Retención
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-green-600">{estadisticas.tasaRetencion}%</span>
            <p className="text-sm text-muted-foreground">Este semestre</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Sesiones Realizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{estadisticas.sesionesRealizadas}</span>
            <p className="text-sm text-muted-foreground">Promedio: {estadisticas.promedioDuracion} min</p>
          </CardContent>
        </Card>
      </div>

      {/* Reportes Disponibles */}
      <Card>
        <CardHeader>
          <CardTitle>Generar Reportes</CardTitle>
          <CardDescription>
            Genere reportes consolidados o individuales de sus estudiantes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Reportes Consolidados */}
            <div className="space-y-4">
              <h4 className="font-medium">Reportes Consolidados</h4>
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Reporte Mensual de Actividades
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Estadísticas de Rendimiento
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Análisis de Tendencias
                </Button>
                
                <Button variant="outline" className="w-full justify-start">
                  <Award className="h-4 w-4 mr-2" />
                  Reporte de Casos de Éxito
                </Button>
              </div>
            </div>

            {/* Reportes Personalizados */}
            <div className="space-y-4">
              <h4 className="font-medium">Reportes Personalizados</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Período</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mes-actual">Mes Actual</SelectItem>
                      <SelectItem value="trimestre">Trimestre</SelectItem>
                      <SelectItem value="semestre">Semestre</SelectItem>
                      <SelectItem value="personalizado">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Tipo de Reporte</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academico">Rendimiento Académico</SelectItem>
                      <SelectItem value="asistencia">Asistencia a Mentoría</SelectItem>
                      <SelectItem value="riesgo">Análisis de Riesgo</SelectItem>
                      <SelectItem value="completo">Reporte Completo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full bg-gradient-primary">
                  <Download className="h-4 w-4 mr-2" />
                  Generar Reporte
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reportes Individuales por Estudiante */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes por Estudiante</CardTitle>
          <CardDescription>
            Genere reportes específicos para cada estudiante asignado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportesIndividuales.map((reporte, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="font-medium">{reporte.estudiante}</h4>
                        <p className="text-sm text-muted-foreground">
                          Último reporte: {reporte.ultimoReporte}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getEstadoColor(reporte.estado)}>
                          {reporte.estado}
                        </Badge>
                        {getTendenciaIcon(reporte.tendencia)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">IAA: {reporte.iaa}</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reportes para DDBE */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes para DDBE</CardTitle>
          <CardDescription>
            Documentos oficiales para la Dirección de Desarrollo y Bienestar Estudiantil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Informe Trimestral de Mentoría
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Reporte de Estudiantes en Riesgo
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <Award className="h-4 w-4 mr-2" />
            Certificación de Cumplimiento de Mentoría
          </Button>
          
          <Button variant="outline" className="w-full justify-start">
            <BarChart3 className="h-4 w-4 mr-2" />
            Recomendaciones Sistémicas
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportesMentor;