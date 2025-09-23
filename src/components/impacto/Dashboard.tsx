import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Clock, User } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Mi Beca Impacto</h2>
        <p className="text-muted-foreground">Estado actual de tu beca de 100% exoneración</p>
      </div>

      {/* Cards Superior - Estado Actual */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 - Rendimiento Académico */}
        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rendimiento Académico</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-3xl font-bold text-green-600">13.5</span>
              <span className="text-muted-foreground">/20</span>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Mínimo: 12.0</span>
                <span className="text-green-600">+0.2</span>
              </div>
              <Progress value={67.5} className="h-2" />
              <Badge variant="secondary" className="bg-green-50 text-green-700 text-xs">
                ✅ Cumpliendo con margen
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 - Créditos del Período */}
        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Créditos del Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-3xl font-bold text-blue-600">14</span>
              <span className="text-muted-foreground">créditos</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Mínimo: 12</span>
                <span className="text-green-600">+2</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Período anterior: 12/12 aprobados
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
                ✅ Cumpliendo
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 - Progreso en la Carrera */}
        <Card className="border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Progreso en la Carrera</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-3xl font-bold text-orange-600">5</span>
              <span className="text-muted-foreground">/15</span>
            </div>
            <div className="space-y-2">
              <Progress value={33.33} className="h-2" />
              <div className="text-xs text-muted-foreground">
                Proyección: Graduación en 10 períodos más
              </div>
              <Badge variant="secondary" className="bg-orange-50 text-orange-700 text-xs">
                🎯 En tiempo
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card 4 - Estado del Mentor */}
        <Card className="border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Estado del Mentor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Dra. María López</p>
                <p className="text-xs text-muted-foreground">Ing. Sistemas</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs">
                Próxima sesión: <span className="font-medium">15 Nov, 2:00 PM</span>
              </div>
              <div className="text-xs">
                Sesiones completadas: <span className="font-medium">3/4</span>
              </div>
              <Button size="sm" className="w-full">
                Contactar Mentor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sección: Compromisos y Obligaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Compromisos Académicos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">Mantener IAA ≥ 12.0 puntos</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                13.5/20
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">Inscribir min. 12 créditos</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                14 créditos
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">No exceder 15 períodos</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                5/15
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">Cumplir esquema mentoría</span>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Al día
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Compromisos Institucionales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Participación en eventos UNIMET</span>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                2/2
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Apoyo actividades promoción</span>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Completado
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="text-sm">Testimonio para futuros becarios</span>
              </div>
              <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                Pendiente
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Disponibilidad para actividades SG</span>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Activo
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas y Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Alertas y Notificaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Tu beca está en excelente estado - Todos los requisitos cumplidos
            </span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Próxima verificación trimestral en 15 días
            </span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              Recuerda completar tu testimonio para futuros becarios antes del 30 de noviembre
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;