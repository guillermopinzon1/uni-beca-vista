import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  TrendingUp, 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  FileText,
  Clock,
  GraduationCap,
  DollarSign,
  Info
} from "lucide-react";

interface RequisitosBeneficiosProps {
  userType: "hijo" | "empleado";
}

const RequisitosBeneficios = ({ userType }: RequisitosBeneficiosProps) => {
  if (userType === "hijo") {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">Requisitos del Beneficio de Exoneración</h1>
          <p className="text-muted-foreground">Información sobre los requisitos para hijos de empleados</p>
        </div>

        {/* Sección Superior: Requisitos Principales */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 - Estado del Progenitor */}
          <Card className="border-blue-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Estado del Progenitor</CardTitle>
                <User className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-xs space-y-1">
                  <p><span className="font-medium">Requisito:</span> Empleado activo UNIMET</p>
                  <p><span className="font-medium">Verificación:</span> Continua por Capital Humano</p>
                  <p><span className="font-medium">Antigüedad mínima:</span> No especifica</p>
                </div>
                <div className="p-2 bg-blue-50 rounded text-xs text-blue-700">
                  El progenitor debe mantener su estatus de empleado activo durante todo el período de estudios
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2 - Rendimiento Académico */}
          <Card className="border-green-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Rendimiento Académico</CardTitle>
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-xs space-y-1">
                  <p><span className="font-medium">IAA mínimo:</span> 12.0 puntos</p>
                  <p><span className="font-medium">Verificación:</span> Cada período académico</p>
                </div>
                <div className="p-2 bg-green-50 rounded text-xs text-green-700">
                  Mantener promedio ponderado igual o superior a 12.0 puntos
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 3 - Requisitos Anuales */}
          <Card className="border-orange-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Carga Académica</CardTitle>
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-xs space-y-1">
                  <p><span className="font-medium">Mínimo anual:</span> 12 asignaturas aprobadas</p>
                  <p><span className="font-medium">Inscripción:</span> Carga completa cada período</p>
                </div>
                <div className="p-2 bg-orange-50 rounded text-xs text-orange-700">
                  Debe mantener ritmo de avance académico adecuado
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4 - Tiempo Límite */}
          <Card className="border-purple-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Tiempo Límite</CardTitle>
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-xs space-y-1">
                  <p><span className="font-medium">Duración máxima:</span> 15 períodos</p>
                  <p><span className="font-medium">Equivale a:</span> 5 años aprox.</p>
                </div>
                <div className="p-2 bg-purple-50 rounded text-xs text-purple-700">
                  Debe completar la carrera dentro del tiempo establecido
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sección: Compromisos y Obligaciones */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Compromisos Académicos Requeridos</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <span className="text-sm font-medium">Mantener IAA ≥ 12.0 puntos</span>
                  <p className="text-xs text-muted-foreground mt-1">Verificación cada período académico</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <span className="text-sm font-medium">Aprobar mínimo 12 asignaturas anuales</span>
                  <p className="text-xs text-muted-foreground mt-1">Mantener ritmo de avance adecuado</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <span className="text-sm font-medium">Completar carrera en máximo 15 períodos</span>
                  <p className="text-xs text-muted-foreground mt-1">Aproximadamente 5 años</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <span className="text-sm font-medium">Asistir a tutorías obligatorias DDBE</span>
                  <p className="text-xs text-muted-foreground mt-1">Según programa establecido</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>Documentación Requerida</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <span className="text-sm font-medium">Acta de nacimiento</span>
                  <p className="text-xs text-muted-foreground mt-1">Que acredite parentesco con empleado</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <span className="text-sm font-medium">Carta compromiso firmada</span>
                  <p className="text-xs text-muted-foreground mt-1">Aceptación de términos y condiciones</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <span className="text-sm font-medium">Constancia laboral del progenitor</span>
                  <p className="text-xs text-muted-foreground mt-1">Actualizada y vigente</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <span className="text-sm font-medium">Certificado de notas</span>
                  <p className="text-xs text-muted-foreground mt-1">Actualizado cada período</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Restricciones Especiales */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Restricciones Importantes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <p className="text-sm text-red-800">
                <strong>Incompatibilidad:</strong> Este beneficio NO es combinable si el padre/madre también estudia con exoneración, 
                excepto si el ingreso familiar es ≤ 3 salarios mínimos.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sección: Costos NO Cubiertos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              <span>Costos NO Cubiertos por el Beneficio</span>
            </CardTitle>
            <CardDescription>Pagos que el estudiante debe realizar independientemente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Cuota de inscripción trimestral</span>
                    <Badge variant="outline">Obligatorio</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Pago requerido cada período</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Seguro estudiantil</span>
                    <Badge variant="outline">Obligatorio</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Cobertura médica estudiantil</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Constancias adicionales</span>
                    <Badge variant="outline">Si aplica</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Más de 2 por año tienen costo</p>
                </div>
                <div className="p-3 border rounded-lg border-red-200 bg-red-50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-red-700">Materias reprobadas</span>
                    <Badge variant="outline" className="border-red-300 text-red-700">Costo total</Badge>
                  </div>
                  <p className="text-xs text-red-600 mt-1">Sin cobertura de exoneración</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Para empleados
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Requisitos del Beneficio de Exoneración</h1>
        <p className="text-muted-foreground">Información sobre los requisitos para empleados estudiantes</p>
      </div>

      {/* Sección Superior para Empleados */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 - Estatus Laboral */}
        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Estatus Laboral Requerido</CardTitle>
              <User className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-xs space-y-1">
                <p><span className="font-medium">Requisito:</span> Empleado activo UNIMET</p>
                <p><span className="font-medium">Desempeño:</span> Satisfactorio mínimo</p>
                <p><span className="font-medium">Verificación:</span> Continua</p>
              </div>
              <div className="p-2 bg-blue-50 rounded text-xs text-blue-700">
                Mantener buen desempeño laboral durante los estudios
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 - Compromiso de Permanencia */}
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Compromiso Post-Graduación</CardTitle>
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-xs space-y-1">
                <p><span className="font-medium">Permanencia:</span> 2 años mínimo</p>
                <p><span className="font-medium">Inicio:</span> Desde graduación</p>
                <p><span className="font-medium">Reembolso:</span> Si no cumple</p>
              </div>
              <div className="p-2 bg-red-50 rounded text-xs text-red-700">
                Compromiso contractual obligatorio
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 - Balance Trabajo-Estudio */}
        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Compatibilidad Horaria</CardTitle>
              <Clock className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-xs space-y-1">
                <p><span className="font-medium">Prioridad:</span> Funciones laborales</p>
                <p><span className="font-medium">Horario especial:</span> Requiere aprobación</p>
                <p><span className="font-medium">Compensación:</span> Obligatoria si aplica</p>
              </div>
              <div className="p-2 bg-green-50 rounded text-xs text-green-700">
                No debe afectar operaciones departamentales
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4 - Progreso Académico */}
        <Card className="border-purple-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Rendimiento Académico</CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-xs space-y-1">
                <p><span className="font-medium">Pregrado:</span> IAA ≥ 12.0</p>
                <p><span className="font-medium">Postgrado:</span> IAA ≥ 14.0</p>
                <p><span className="font-medium">Alineación:</span> Carrera-puesto aprobada</p>
              </div>
              <div className="p-2 bg-purple-50 rounded text-xs text-purple-700">
                Requisitos académicos más exigentes
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sección: Plan de Compensación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            <span>Plan de Compensación Horaria (Si Aplica)</span>
          </CardTitle>
          <CardDescription>Requisitos cuando hay clases en horario laboral</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Requisitos de Aprobación</h4>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <span className="text-sm font-medium">Aprobación del supervisor inmediato</span>
                  <p className="text-xs text-muted-foreground mt-1">Debe validar que no afecta operaciones</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <span className="text-sm font-medium">Visto bueno de Capital Humano</span>
                  <p className="text-xs text-muted-foreground mt-1">Autorización institucional requerida</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <span className="text-sm font-medium">Plan de compensación definido</span>
                  <p className="text-xs text-muted-foreground mt-1">Horarios específicos de recuperación</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Obligaciones de Cumplimiento</h4>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <span className="text-sm font-medium">Compensar 100% de las horas</span>
                  <p className="text-xs text-muted-foreground mt-1">Sin excepciones</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <span className="text-sm font-medium">Reportes mensuales obligatorios</span>
                  <p className="text-xs text-muted-foreground mt-1">Al supervisor laboral</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <span className="text-sm font-medium">Flexibilidad según necesidades</span>
                  <p className="text-xs text-muted-foreground mt-1">La universidad tiene prioridad</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección: Compromisos del Empleado Estudiante */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary" />
              <span>Compromisos Durante los Estudios</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <span className="text-sm font-medium">Mantener desempeño laboral satisfactorio</span>
                <p className="text-xs text-muted-foreground mt-1">Evaluación continua</p>
              </div>
              <div className="p-3 border rounded-lg">
                <span className="text-sm font-medium">No afectar operaciones del departamento</span>
                <p className="text-xs text-muted-foreground mt-1">Prioridad institucional</p>
              </div>
              <div className="p-3 border rounded-lg">
                <span className="text-sm font-medium">Cumplir plan de compensación horaria</span>
                <p className="text-xs text-muted-foreground mt-1">Si aplica</p>
              </div>
              <div className="p-3 border rounded-lg border-red-200 bg-red-50">
                <span className="text-sm font-medium text-red-700">Permanecer 2 años post-graduación</span>
                <p className="text-xs text-red-600 mt-1">Compromiso contractual obligatorio</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-primary" />
              <span>Sistema de Reembolso</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
              <h4 className="font-medium text-yellow-800 mb-2">Cálculo Prorrateado</h4>
              <div className="space-y-2 text-sm">
                <p className="text-yellow-700">
                  Si el empleado no cumple el compromiso de permanencia, debe reembolsar proporcionalmente:
                </p>
                <ul className="list-disc list-inside text-xs text-yellow-600 space-y-1">
                  <li>100% si se retira antes de graduarse</li>
                  <li>Proporción según tiempo faltante post-graduación</li>
                  <li>0% si cumple los 2 años completos</li>
                </ul>
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <span className="text-sm font-medium">Actualización anual obligatoria</span>
              <p className="text-xs text-muted-foreground mt-1">Renovación del compromiso cada enero</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequisitosBeneficios;