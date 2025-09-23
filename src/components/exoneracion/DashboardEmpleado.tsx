import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { User, TrendingUp, Clock, GraduationCap, DollarSign, Calendar, AlertTriangle } from "lucide-react";

const DashboardEmpleado = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Mi Beneficio de Exoneración</h1>
        <p className="text-muted-foreground">Panel de control para empleados estudiantes</p>
      </div>

      {/* Sección Superior Diferenciada */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 - Mi Estatus Laboral */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-800">Mi Estatus Laboral</CardTitle>
              <User className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="font-semibold text-blue-900">Analista de Sistemas</p>
                <p className="text-sm text-blue-700">Dept. Tecnología</p>
              </div>
              <div className="text-xs space-y-1">
                <p><span className="font-medium">Antigüedad:</span> 3 años, 2 meses</p>
                <p><span className="font-medium">Supervisor:</span> Ing. María González</p>
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                  Desempeño: Satisfactorio
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 - Compromiso de Permanencia */}
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-red-800">Compromiso de Permanencia</CardTitle>
              <GraduationCap className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-xs space-y-1">
                <p><span className="font-medium">Graduación estimada:</span> Dic 2027</p>
                <p><span className="font-medium">Compromiso post-grado:</span> 2 años</p>
                <p><span className="font-medium">Fecha fin compromiso:</span> Dic 2029</p>
              </div>
              <Button variant="outline" size="sm" className="w-full text-xs">
                Ver calculadora de reembolso
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 - Balance Trabajo-Estudio */}
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-800">Balance Trabajo-Estudio</CardTitle>
              <Clock className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-xs space-y-1">
                <p><span className="font-medium">Horario laboral:</span> 8:00 AM - 5:00 PM</p>
                <p><span className="font-medium">Horario de clases:</span> 6:00 PM - 9:00 PM</p>
                <p><span className="font-medium">Horas pendientes:</span> 0</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                Sin conflictos ✓
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card 4 - Progreso Académico Especial */}
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-purple-800">Progreso Académico</CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg font-bold text-purple-900">15.1</span>
                  <span className="text-sm text-purple-700">/20</span>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-purple-600 mt-1">Mínimo: 14.0 (postgrado)</p>
              </div>
              <div className="text-xs">
                <p><span className="font-medium">Asignaturas inscritas:</span> 2</p>
                <Badge variant="outline" className="border-purple-300 text-purple-700 text-xs">
                  Alineación aprobada ✓
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sección: Plan de Compensación Horaria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            <span>Plan de Compensación Horaria</span>
          </CardTitle>
          <CardDescription>Control de horas compensadas por estudios en horario laboral</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Horario Especial Aprobado</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm">Clases en horario laboral</span>
                  <span className="font-semibold text-blue-800">Martes 2-4 PM</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm">Horas a compensar semanales</span>
                  <span className="font-semibold text-orange-800">2 horas</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm">Plan de compensación</span>
                  <span className="font-semibold text-green-800">Sábados 8-10 AM</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Estado de Cumplimiento</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm">Horas compensadas este mes</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">8/8 ✓</Badge>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm"><span className="font-medium">Aprobado por:</span></p>
                  <p className="text-xs text-blue-700">Supervisor + Capital Humano</p>
                </div>
                <Button variant="outline" className="w-full">
                  Ver calendario de compensación
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección: Compromisos Laborales */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <span>Compromisos del Empleado Estudiante</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm">Mantener desempeño laboral satisfactorio</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">✓ Cumpliendo</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm">No afectar operaciones del departamento</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">✓ Cumpliendo</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm">Cumplir plan de compensación</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">✓ Al día</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm">Permanecer 2 años post-graduación</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">⏳ Pendiente</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-red-600" />
              <span>Cálculo de Reembolso Prorrateado</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2">Simulación de Retiro</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Si me retiro hoy:</span>
                  <span className="font-semibold text-red-700">Bs. 450.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Si me retiro en 6 meses:</span>
                  <span className="font-semibold text-orange-700">Bs. 350.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Si me retiro en 1 año:</span>
                  <span className="font-semibold text-yellow-700">Bs. 250.000</span>
                </div>
                <div className="flex justify-between">
                  <span>Después de 2 años post-grado:</span>
                  <span className="font-semibold text-green-700">Bs. 0</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Ver calculadora detallada
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Alerta de Actualización Anual */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-orange-800">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span>Recordatorio: Actualización Anual</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-orange-100 rounded-lg">
            <p className="text-sm text-orange-800 mb-3">
              Debes firmar la actualización anual del compromiso antes del 15 de enero de 2025.
            </p>
            <Button variant="outline" className="border-orange-300 text-orange-700">
              Programar cita con Capital Humano
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardEmpleado;