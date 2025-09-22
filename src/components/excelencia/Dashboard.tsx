import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  TrendingUp, 
  BookOpen, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  AlertTriangle,
  Bell
} from "lucide-react";

const Dashboard = () => {
  // Mock data del estudiante
  const studentData = {
    iaa: 18.2,
    aaaMinimo: 17.5, // Para categoría Académica
    creditosAprobados: 15,
    creditosMinimos: 12,
    periodosCursados: 3,
    periodosMaximos: 15,
    categoria: "Académica",
    porcentajeCobertura: 50,
    fechaRenovacion: "2024-12-15",
    estadoRiesgo: "verde" // verde, amarillo, rojo
  };

  const getRiskColor = (estado: string) => {
    switch (estado) {
      case "verde": return "text-green-600 bg-green-50 border-green-200";
      case "amarillo": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "rojo": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getRiskIcon = (estado: string) => {
    switch (estado) {
      case "verde": return <CheckCircle className="h-5 w-5" />;
      case "amarillo": return <AlertTriangle className="h-5 w-5" />;
      case "rojo": return <AlertCircle className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const notifications = [
    {
      tipo: "renovacion",
      mensaje: "Renovación anual próxima: 15 de diciembre de 2024",
      icono: <Calendar className="h-4 w-4" />,
      urgencia: "media"
    },
    {
      tipo: "mentor",
      mensaje: "Nuevo mensaje de tu mentor asignado",
      icono: <Bell className="h-4 w-4" />,
      urgencia: "baja"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Mi Dashboard</h2>
        <p className="text-muted-foreground">
          Resumen de tu estado actual en el Programa de Excelencia
        </p>
      </div>

      {/* Indicadores principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* IAA Actual */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IAA Actual</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary mb-2">
              {studentData.iaa}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Mínimo requerido:</span>
                <span className="font-medium">{studentData.aaaMinimo}</span>
              </div>
              <Progress 
                value={(studentData.iaa / 20) * 100} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {studentData.iaa >= studentData.aaaMinimo 
                  ? "✓ Cumples el requisito mínimo" 
                  : "⚠ Por debajo del mínimo requerido"
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Créditos Aprobados */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créditos del Período</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary mb-2">
              {studentData.creditosAprobados}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Mínimo requerido:</span>
                <span className="font-medium">{studentData.creditosMinimos}</span>
              </div>
              <Progress 
                value={(studentData.creditosAprobados / 18) * 100} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {studentData.creditosAprobados >= studentData.creditosMinimos 
                  ? "✓ Cumples el requisito mínimo" 
                  : "⚠ Por debajo del mínimo requerido"
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Períodos Cursados */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Períodos Cursados</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary mb-2">
              {studentData.periodosCursados}/{studentData.periodosMaximos}
            </div>
            <div className="space-y-2">
              <Progress 
                value={(studentData.periodosCursados / studentData.periodosMaximos) * 100} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                Períodos restantes: {studentData.periodosMaximos - studentData.periodosCursados}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estado de la Beca */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Estado de tu Beca</CardTitle>
          <CardDescription>
            Información actual de tu beca de excelencia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Categoría</p>
              <Badge variant="outline" className="text-primary">
                {studentData.categoria}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Cobertura</p>
              <p className="text-2xl font-bold text-primary">
                {studentData.porcentajeCobertura}%
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Próxima Renovación</p>
              <p className="text-sm font-medium">
                {new Date(studentData.fechaRenovacion).toLocaleDateString('es-ES')}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Estado de Riesgo</p>
              <div className={`flex items-center space-x-2 px-2 py-1 rounded-md border ${getRiskColor(studentData.estadoRiesgo)}`}>
                {getRiskIcon(studentData.estadoRiesgo)}
                <span className="text-sm font-medium capitalize">
                  {studentData.estadoRiesgo === "verde" ? "En regla" : 
                   studentData.estadoRiesgo === "amarillo" ? "Atención" : "Riesgo"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notificaciones y Alertas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notificaciones y Alertas</span>
          </CardTitle>
          <CardDescription>
            Avisos importantes sobre tu beca
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.map((notif, index) => (
            <Alert key={index}>
              <div className="flex items-center space-x-2">
                {notif.icono}
                <AlertDescription>{notif.mensaje}</AlertDescription>
              </div>
            </Alert>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;