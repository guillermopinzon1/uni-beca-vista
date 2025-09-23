import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { User, TrendingUp, BookOpen, Calendar, CheckCircle, AlertTriangle, FileText } from "lucide-react";

const DashboardHijo = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Mi Beneficio de Exoneración</h1>
        <p className="text-muted-foreground">Panel de control para estudiantes beneficiarios - Hijos de empleados</p>
      </div>

      {/* Sección Superior: Estado del Beneficio */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 - Estado del Progenitor */}
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-800">Estado del Progenitor</CardTitle>
              <User className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="font-semibold text-green-900">Ing. Roberto Mendoza</p>
                <p className="text-sm text-green-700">Dept. Tecnología</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  ACTIVO ✓
                </Badge>
              </div>
              <div className="text-xs space-y-1">
                <p><span className="font-medium">Antigüedad:</span> 3 años, 4 meses</p>
                <p><span className="font-medium">Última verificación:</span> 15/09/2024</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 - Rendimiento Académico */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-800">Rendimiento Académico</CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-blue-900">14.2</span>
                  <span className="text-sm text-blue-700">/20</span>
                </div>
                <Progress value={71} className="h-2" />
                <p className="text-xs text-blue-600 mt-1">Mínimo requerido: 12.0</p>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">Tendencia: Subiendo</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 - Requisitos Anuales */}
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-orange-800">Requisitos Anuales</CardTitle>
              <BookOpen className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-orange-900">8/12</span>
                  <span className="text-sm text-orange-700">aprobadas</span>
                </div>
                <Progress value={67} className="h-2" />
                <p className="text-xs text-orange-600 mt-1">Faltan 4 asignaturas</p>
              </div>
              <Badge variant="outline" className="border-orange-300 text-orange-700 text-xs">
                Ritmo adecuado ✓
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card 4 - Tiempo en el Programa */}
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-purple-800">Tiempo en el Programa</CardTitle>
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-purple-900">6/15</span>
                  <span className="text-sm text-purple-700">períodos</span>
                </div>
                <Progress value={40} className="h-2" />
                <p className="text-xs text-purple-600 mt-1">Graduación proyectada: Dic 2027</p>
              </div>
              <Badge variant="outline" className="border-purple-300 text-purple-700 text-xs">
                Dentro del límite
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sección: Compromisos y Obligaciones Específicas */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Compromisos Académicos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm">Mantener IAA ≥ 12.0 puntos</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">✓ Cumpliendo</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm">Aprobar mínimo 12 asignaturas anuales</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">⚠️ En progreso</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm">Completar carrera en máximo 5 años</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">✓ En tiempo</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm">Asistir a tutorías obligatorias DDBE</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">✓ Al día</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Documentación Vigente</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm">Acta de nacimiento</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">✓ Cargada</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm">Carta compromiso firmada</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">✓ Vigente</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm">Constancia laboral del progenitor</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">⚠️ Actualizar en 30 días</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm">Certificado de notas actualizado</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">✓ Al día</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Restricciones Especiales */}
      <Card className="border-red-200 bg-red-50/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-800">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>Restricciones Especiales</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-100 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Importante:</strong> Este beneficio NO es combinable si tu padre/madre también estudia con exoneración, 
              excepto si el ingreso familiar es ≤ 3 salarios mínimos.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sección: Costos NO Cubiertos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span>Costos NO Cubiertos por el Beneficio</span>
          </CardTitle>
          <CardDescription>Pagos que debes realizar independientemente del beneficio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <span className="text-sm">Cuota de inscripción trimestral</span>
                <span className="font-semibold text-orange-800">Bs. 45.000</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <span className="text-sm">Seguro estudiantil</span>
                <span className="font-semibold text-orange-800">Bs. 12.000</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <span className="text-sm">Constancias adicionales (más de 2/año)</span>
                <span className="font-semibold text-orange-800">Bs. 8.000 c/u</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-sm">Materias reprobadas (si aplica)</span>
                <Button variant="outline" size="sm" className="text-red-700 border-red-300">
                  Ver detalle
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHijo;