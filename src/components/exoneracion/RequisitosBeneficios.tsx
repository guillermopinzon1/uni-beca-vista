import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Info,
  Shield,
  XCircle
} from "lucide-react";

interface RequisitosBeneficiosProps {
  userType: "hijo" | "empleado";
}

const RequisitosBeneficios = ({ userType }: RequisitosBeneficiosProps) => {
  if (userType === "hijo") {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">Beneficio de Exoneración de Matrícula - Hijo de Empleado</h1>
          <p className="text-muted-foreground">Información oficial sobre requisitos, beneficios y compromisos</p>
        </div>

        {/* Official Regulation Alert */}
        <Alert className="border-blue-200 bg-blue-50/50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-900">
            <strong>Reglamento Oficial:</strong> Programa de Beneficios Socioeconómicos y Becas de la Universidad Metropolitana
            <br />
            Aprobado por Consejo Universitario (Sesión 588, 04/09/2025) y Consejo Superior (Sesión 436, 15/09/2025)
            <br />
            Vigencia: A partir del período 2526-1
          </AlertDescription>
        </Alert>

        {/* Requisitos Principales - Art. 21 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Requisitos del Beneficio (Art. 21)</span>
            </CardTitle>
            <CardDescription>Condiciones que debe cumplir el hijo del empleado UNIMET</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50/30">
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-2 text-blue-900">Parentesco con Empleado UNIMET</h4>
                      <p className="text-xs text-blue-800 mb-2">
                        El progenitor debe ser empleado activo de la Universidad Metropolitana durante todo el período de estudios del beneficiario.
                      </p>
                      <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">Art. 21-a</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-green-200 rounded-lg bg-green-50/30">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-2 text-green-900">Rendimiento Académico Mínimo</h4>
                      <p className="text-xs text-green-800 mb-2">
                        <strong>IAA ≥ 12.0 puntos</strong> al término del año lectivo. Se verifica en cada período académico y es requisito indispensable para mantener el beneficio.
                      </p>
                      <Badge variant="outline" className="text-xs border-green-300 text-green-700">Art. 21-b</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50/30">
                  <div className="flex items-start space-x-3">
                    <BookOpen className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-2 text-orange-900">Carga Académica Anual</h4>
                      <p className="text-xs text-orange-800 mb-2">
                        Aprobar mínimo <strong>12 asignaturas por año lectivo</strong> para mantener un ritmo de avance adecuado en la carrera.
                      </p>
                      <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">Art. 21-c</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 border border-purple-200 rounded-lg bg-purple-50/30">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-2 text-purple-900">Tiempo Máximo de Graduación</h4>
                      <p className="text-xs text-purple-800 mb-2">
                        La carrera debe completarse en un máximo de <strong>15 períodos trimestrales</strong> (aproximadamente 5 años). Superado este plazo, se pierde el beneficio.
                      </p>
                      <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">Art. 21-d</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-indigo-200 rounded-lg bg-indigo-50/30">
                  <div className="flex items-start space-x-3">
                    <GraduationCap className="h-5 w-5 text-indigo-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-2 text-indigo-900">Tutorías Obligatorias DDBE</h4>
                      <p className="text-xs text-indigo-800 mb-2">
                        Participar en las tutorías y actividades programadas por la Dirección de Desarrollo y Bienestar Estudiantil (DDBE).
                      </p>
                      <Badge variant="outline" className="text-xs border-indigo-300 text-indigo-700">Art. 21-e</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-cyan-200 rounded-lg bg-cyan-50/30">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-cyan-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-2 text-cyan-900">Documentación Completa</h4>
                      <p className="text-xs text-cyan-800 mb-2">
                        Presentar acta de nacimiento, carta compromiso firmada, constancia laboral del progenitor y certificado de notas actualizado.
                      </p>
                      <Badge variant="outline" className="text-xs border-cyan-300 text-cyan-700">Art. 21-f</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Beneficios del Programa - Art. 20 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span>Beneficios Otorgados (Art. 20)</span>
            </CardTitle>
            <CardDescription>Cobertura y alcance del beneficio de exoneración</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50/50">
                <div className="flex items-start space-x-3 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">Cobertura del 100% de la Matrícula</h4>
                    <p className="text-sm text-green-800">
                      El beneficio cubre la totalidad del costo de matrícula para todas las asignaturas inscritas durante el período académico.
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="border-green-300 text-green-700">Art. 20</Badge>
              </div>

              <Alert className="border-orange-200 bg-orange-50/50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-sm text-orange-900">
                  <strong>Importante:</strong> Este beneficio cubre ÚNICAMENTE la matrícula de asignaturas. Los siguientes costos NO están cubiertos:
                  <ul className="list-disc list-inside mt-2 ml-2 space-y-1 text-xs">
                    <li>Cuota de inscripción trimestral (obligatoria cada período)</li>
                    <li>Seguro estudiantil (obligatorio)</li>
                    <li>Constancias adicionales (más de 2 por año lectivo)</li>
                    <li>Materias reprobadas (costo total a cargo del estudiante)</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* Restricciones y Compatibilidad - Art. 22 */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Restricción de Compatibilidad (Art. 22)</span>
            </CardTitle>
            <CardDescription>Importante: Incompatibilidad con otros beneficios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border-2 border-red-300 rounded-lg bg-red-50">
                <div className="flex items-start space-x-3">
                  <XCircle className="h-6 w-6 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900 mb-2">Incompatibilidad Padre/Madre-Hijo</h4>
                    <p className="text-sm text-red-800 mb-3">
                      Este beneficio <strong>NO es combinable</strong> si tanto el padre/madre como el hijo son beneficiarios de exoneración de matrícula simultáneamente.
                    </p>
                    <div className="p-3 bg-white border border-red-200 rounded-lg">
                      <p className="text-xs text-red-700 mb-2">
                        <strong>Excepción única (Art. 22):</strong>
                      </p>
                      <p className="text-xs text-red-600">
                        Ambos pueden mantener el beneficio ÚNICAMENTE si el ingreso familiar total es igual o menor a 3 salarios mínimos,
                        previa verificación y aprobación del estudio socioeconómico por la DDBE.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consecuencias de Incumplimiento */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-700">
              <XCircle className="h-5 w-5" />
              <span>Consecuencias de Incumplimiento</span>
            </CardTitle>
            <CardDescription>Situaciones que pueden resultar en pérdida del beneficio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="destructive" className="text-xs">Alta Gravedad</Badge>
                  </div>
                  <h4 className="font-semibold text-sm mb-2 text-red-900">Pérdida Inmediata del Beneficio</h4>
                  <ul className="space-y-2 text-xs text-red-800">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>IAA cae por debajo de 12.0 puntos al finalizar el año lectivo</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Progenitor cesa su relación laboral con UNIMET</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Supera los 15 períodos trimestrales sin graduarse</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>No presenta documentación requerida en los plazos establecidos</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50/50">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">Media Gravedad</Badge>
                  </div>
                  <h4 className="font-semibold text-sm mb-2 text-orange-900">Advertencias y Evaluaciones</h4>
                  <ul className="space-y-2 text-xs text-orange-800">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Aprobar menos de 12 asignaturas en el año lectivo genera evaluación del caso</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Inasistencia a tutorías DDBE puede resultar en suspensión temporal</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Cambio de carrera requiere nueva evaluación y aprobación</span>
                    </li>
                  </ul>
                </div>

                <Alert className="border-blue-200 bg-blue-50/50">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-xs text-blue-800">
                    Todas las situaciones de incumplimiento son evaluadas por el cuerpo técnico de la DDBE.
                    En casos excepcionales debidamente justificados, se puede considerar prórroga o reinstalación del beneficio.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información Adicional */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                <span>Situaciones Especiales</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm mb-1">Período Intensivo</h4>
                <p className="text-xs text-muted-foreground">
                  NO está cubierto por este beneficio. El estudiante debe asumir el costo completo de asignaturas en período intensivo.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm mb-1">Cambio de Carrera</h4>
                <p className="text-xs text-muted-foreground">
                  Requiere aprobación previa de la DDBE. El tiempo cursado en la carrera anterior cuenta para el límite de 15 períodos.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm mb-1">Permisos Especiales</h4>
                <p className="text-xs text-muted-foreground">
                  En casos de salud, familiares o fuerza mayor, se puede solicitar permiso temporal. Requiere documentación de respaldo.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <span>Renovación Anual</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Alert className="border-purple-200 bg-purple-50/50">
                <Info className="h-4 w-4 text-purple-600" />
                <AlertDescription className="text-sm text-purple-900">
                  El beneficio se renueva automáticamente cada período mientras se cumplan los requisitos establecidos.
                </AlertDescription>
              </Alert>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm mb-1">Verificación Continua</h4>
                <p className="text-xs text-muted-foreground">
                  Capital Humano verifica mensualmente el estatus del empleado progenitor. DDBE verifica el rendimiento académico cada trimestre.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-sm mb-1">Actualización de Documentos</h4>
                <p className="text-xs text-muted-foreground">
                  Presentar certificado de notas actualizado al inicio de cada período académico y constancia laboral vigente del progenitor anualmente.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Para empleados
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Beneficio de Exoneración de Matrícula - Empleado UNIMET</h1>
        <p className="text-muted-foreground">Información oficial sobre requisitos, beneficios y compromisos para empleados estudiantes</p>
      </div>

      {/* Official Regulation Alert */}
      <Alert className="border-blue-200 bg-blue-50/50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm text-blue-900">
          <strong>Reglamento Oficial:</strong> Programa de Beneficios Socioeconómicos y Becas de la Universidad Metropolitana
          <br />
          Aprobado por Consejo Universitario (Sesión 588, 04/09/2025) y Consejo Superior (Sesión 436, 15/09/2025)
          <br />
          Vigencia: A partir del período 2526-1
        </AlertDescription>
      </Alert>

      {/* Requisitos Principales - Art. 23 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Requisitos del Beneficio para Empleados (Art. 23)</span>
          </CardTitle>
          <CardDescription>Condiciones que debe cumplir el empleado estudiante de UNIMET</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50/30">
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-2 text-blue-900">Estatus Laboral Activo</h4>
                    <p className="text-xs text-blue-800 mb-2">
                      Ser empleado activo de UNIMET con desempeño laboral <strong>satisfactorio</strong> durante todo el período de estudios.
                      Capital Humano verifica continuamente el estatus.
                    </p>
                    <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">Art. 23-a</Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-purple-200 rounded-lg bg-purple-50/30">
                <div className="flex items-start space-x-3">
                  <GraduationCap className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-2 text-purple-900">Alineación Carrera-Puesto</h4>
                    <p className="text-xs text-purple-800 mb-2">
                      La carrera elegida debe estar <strong>alineada con el puesto de trabajo</strong> actual o con el plan de carrera institucional.
                      Requiere aprobación del supervisor y Capital Humano.
                    </p>
                    <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">Art. 23-b</Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-green-200 rounded-lg bg-green-50/30">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-2 text-green-900">Rendimiento Académico Mínimo</h4>
                    <p className="text-xs text-green-800 mb-2">
                      <strong>Pregrado:</strong> IAA ≥ 12.0 puntos<br />
                      <strong>Postgrado:</strong> IAA ≥ 14.0 puntos<br />
                      Verificación al término de cada año lectivo.
                    </p>
                    <Badge variant="outline" className="text-xs border-green-300 text-green-700">Art. 23-c</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 border border-orange-200 rounded-lg bg-orange-50/30">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-2 text-orange-900">Compatibilidad Horaria</h4>
                    <p className="text-xs text-orange-800 mb-2">
                      Las actividades académicas <strong>NO deben afectar las operaciones del departamento</strong>.
                      Si hay clases en horario laboral, se requiere plan de compensación aprobado.
                    </p>
                    <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">Art. 23-d</Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50/30">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-2 text-red-900">Compromiso de Permanencia (CRÍTICO)</h4>
                    <p className="text-xs text-red-800 mb-2">
                      <strong>Permanecer laborando en UNIMET por mínimo 2 años después de graduarse.</strong>
                      En caso de incumplimiento, debe reembolsar el beneficio proporcionalmente.
                    </p>
                    <Badge variant="destructive" className="text-xs">Art. 23-e - Obligatorio</Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-cyan-200 rounded-lg bg-cyan-50/30">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-cyan-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-2 text-cyan-900">Documentación y Reportes</h4>
                    <p className="text-xs text-cyan-800 mb-2">
                      Presentar plan de compensación horaria (si aplica), certificado de notas actualizado,
                      y reportes mensuales al supervisor laboral.
                    </p>
                    <Badge variant="outline" className="text-xs border-cyan-300 text-cyan-700">Art. 23-f</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Beneficios del Programa - Art. 20 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span>Beneficios Otorgados (Art. 20)</span>
          </CardTitle>
          <CardDescription>Cobertura y alcance del beneficio de exoneración</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50/50">
              <div className="flex items-start space-x-3 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">Cobertura del 100% de la Matrícula</h4>
                  <p className="text-sm text-green-800">
                    El beneficio cubre la totalidad del costo de matrícula para todas las asignaturas inscritas durante el período académico,
                    tanto para programas de pregrado como de postgrado.
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="border-green-300 text-green-700">Art. 20</Badge>
            </div>

            <Alert className="border-orange-200 bg-orange-50/50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-sm text-orange-900">
                <strong>Importante:</strong> Este beneficio cubre ÚNICAMENTE la matrícula de asignaturas. Los siguientes costos NO están cubiertos:
                <ul className="list-disc list-inside mt-2 ml-2 space-y-1 text-xs">
                  <li>Cuota de inscripción trimestral (obligatoria cada período)</li>
                  <li>Seguro estudiantil (obligatorio)</li>
                  <li>Constancias adicionales (más de 2 por año lectivo)</li>
                  <li>Materias reprobadas (costo total a cargo del empleado)</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Plan de Compensación Horaria - Art. 23-d */}
      <Card className="border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-indigo-600" />
            <span>Plan de Compensación Horaria (Art. 23-d)</span>
          </CardTitle>
          <CardDescription>Requisitos cuando las clases coinciden con horario laboral</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-yellow-200 bg-yellow-50/50 mb-4">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-sm text-yellow-900">
              <strong>Principio fundamental:</strong> Las responsabilidades laborales tienen prioridad absoluta.
              El horario académico NO debe afectar las operaciones del departamento.
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                Requisitos de Aprobación
              </h4>
              <div className="space-y-3">
                <div className="p-3 border border-blue-200 rounded-lg bg-blue-50/30">
                  <span className="text-sm font-medium text-blue-900">1. Aprobación del Supervisor Inmediato</span>
                  <p className="text-xs text-blue-700 mt-1">
                    Debe validar que las ausencias no comprometen las operaciones y que existe personal de respaldo.
                  </p>
                </div>
                <div className="p-3 border border-blue-200 rounded-lg bg-blue-50/30">
                  <span className="text-sm font-medium text-blue-900">2. Autorización de Capital Humano</span>
                  <p className="text-xs text-blue-700 mt-1">
                    Visto bueno institucional requerido para cualquier modificación del horario laboral.
                  </p>
                </div>
                <div className="p-3 border border-blue-200 rounded-lg bg-blue-50/30">
                  <span className="text-sm font-medium text-blue-900">3. Plan de Compensación Detallado</span>
                  <p className="text-xs text-blue-700 mt-1">
                    Documento formal con horarios específicos de recuperación de horas y fechas estimadas.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-orange-600" />
                Obligaciones de Cumplimiento
              </h4>
              <div className="space-y-3">
                <div className="p-3 border border-orange-200 rounded-lg bg-orange-50/30">
                  <span className="text-sm font-medium text-orange-900">Compensación Total (100%)</span>
                  <p className="text-xs text-orange-700 mt-1">
                    <strong>Cada hora de ausencia debe ser compensada completamente.</strong> Sin excepciones ni reducciones.
                  </p>
                </div>
                <div className="p-3 border border-orange-200 rounded-lg bg-orange-50/30">
                  <span className="text-sm font-medium text-orange-900">Reportes Mensuales Obligatorios</span>
                  <p className="text-xs text-orange-700 mt-1">
                    Enviar reporte mensual al supervisor con detalle de horas ausentes y horas compensadas.
                  </p>
                </div>
                <div className="p-3 border border-orange-200 rounded-lg bg-orange-50/30">
                  <span className="text-sm font-medium text-orange-900">Flexibilidad ante Necesidades Institucionales</span>
                  <p className="text-xs text-orange-700 mt-1">
                    El empleado debe estar disponible si surgen emergencias o necesidades operativas prioritarias.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compromiso de Permanencia y Sistema de Reembolso - Art. 23-e */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-700">
            <GraduationCap className="h-5 w-5" />
            <span>Compromiso de Permanencia Post-Graduación (Art. 23-e)</span>
          </CardTitle>
          <CardDescription className="text-red-600">Obligación contractual crítica - Reembolso si no se cumple</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert className="border-red-300 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-sm text-red-900">
                <strong>Obligación legal:</strong> Todo empleado que recibe el beneficio de exoneración debe permanecer laborando en UNIMET
                por un mínimo de <strong>2 años consecutivos</strong> después de graduarse. Este compromiso es contractual y de cumplimiento obligatorio.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-yellow-600" />
                  Sistema de Reembolso Prorrateado
                </h4>
                <div className="space-y-3">
                  <div className="p-4 border-2 border-yellow-300 rounded-lg bg-yellow-50/50">
                    <h5 className="text-sm font-semibold text-yellow-900 mb-2">Cálculo del Monto a Reembolsar</h5>
                    <p className="text-xs text-yellow-800 mb-3">
                      Si el empleado no cumple con el compromiso de permanencia, debe reembolsar el beneficio recibido de forma proporcional:
                    </p>
                    <ul className="space-y-2 text-xs text-yellow-700">
                      <li className="flex items-start">
                        <span className="font-semibold mr-2">100%:</span>
                        <span>Si se retira antes de graduarse o inmediatamente después sin cumplir ningún tiempo</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-semibold mr-2">75%:</span>
                        <span>Si cumple solo 6 meses del compromiso de 2 años</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-semibold mr-2">50%:</span>
                        <span>Si cumple 1 año del compromiso de 2 años</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-semibold mr-2">25%:</span>
                        <span>Si cumple 1.5 años del compromiso de 2 años</span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-semibold mr-2">0%:</span>
                        <span className="text-green-700">Si cumple los 2 años completos - NO hay reembolso</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <XCircle className="h-4 w-4 mr-2 text-red-600" />
                  Excepciones al Reembolso
                </h4>
                <div className="space-y-3">
                  <div className="p-3 border border-green-200 rounded-lg bg-green-50/30">
                    <span className="text-sm font-medium text-green-900">Causas de Fuerza Mayor</span>
                    <p className="text-xs text-green-700 mt-1">
                      Enfermedad grave certificada, fallecimiento del empleado, situaciones médicas incapacitantes.
                      Requiere documentación médica oficial.
                    </p>
                  </div>
                  <div className="p-3 border border-green-200 rounded-lg bg-green-50/30">
                    <span className="text-sm font-medium text-green-900">Despido sin Causa Justificada</span>
                    <p className="text-xs text-green-700 mt-1">
                      Si UNIMET finaliza la relación laboral sin justa causa, no aplica el reembolso.
                      Debe ser documentado por Capital Humano.
                    </p>
                  </div>
                  <div className="p-3 border border-green-200 rounded-lg bg-green-50/30">
                    <span className="text-sm font-medium text-green-900">Casos Excepcionales Aprobados</span>
                    <p className="text-xs text-green-700 mt-1">
                      Situaciones familiares graves evaluadas caso por caso por el Consejo de Becas.
                      Requiere solicitud formal y documentación de respaldo.
                    </p>
                  </div>

                  <Alert className="border-blue-200 bg-blue-50/50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-xs text-blue-800">
                      El compromiso se actualiza y firma anualmente al inicio de cada año lectivo.
                      Firmar el compromiso es requisito para renovar el beneficio.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Restricciones y Compatibilidad - Art. 22 */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Restricción de Compatibilidad (Art. 22)</span>
          </CardTitle>
          <CardDescription>Importante: Incompatibilidad con otros beneficios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-2 border-red-300 rounded-lg bg-red-50">
              <div className="flex items-start space-x-3">
                <XCircle className="h-6 w-6 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-2">Incompatibilidad Empleado-Hijo</h4>
                  <p className="text-sm text-red-800 mb-3">
                    Este beneficio <strong>NO es combinable</strong> si tanto el empleado como su hijo son beneficiarios de exoneración de matrícula simultáneamente.
                  </p>
                  <div className="p-3 bg-white border border-red-200 rounded-lg">
                    <p className="text-xs text-red-700 mb-2">
                      <strong>Excepción única (Art. 22):</strong>
                    </p>
                    <p className="text-xs text-red-600">
                      Ambos pueden mantener el beneficio ÚNICAMENTE si el ingreso familiar total es igual o menor a 3 salarios mínimos,
                      previa verificación y aprobación del estudio socioeconómico por la DDBE.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consecuencias de Incumplimiento */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-orange-700">
            <XCircle className="h-5 w-5" />
            <span>Consecuencias de Incumplimiento</span>
          </CardTitle>
          <CardDescription>Situaciones que pueden resultar en pérdida del beneficio o reembolso</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-4 border border-red-200 rounded-lg bg-red-50/50">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="destructive" className="text-xs">Alta Gravedad</Badge>
                </div>
                <h4 className="font-semibold text-sm mb-2 text-red-900">Pérdida Inmediata del Beneficio</h4>
                <ul className="space-y-2 text-xs text-red-800">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>IAA cae por debajo del mínimo requerido (12.0 pregrado / 14.0 postgrado)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Cese de la relación laboral con UNIMET (despido con causa justificada, renuncia)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Desempeño laboral insatisfactorio evaluado por Capital Humano</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Incumplimiento del plan de compensación horaria aprobado</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>No presentar documentación requerida en plazos establecidos</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 border border-orange-200 rounded-lg bg-orange-50/50">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">Media Gravedad</Badge>
                </div>
                <h4 className="font-semibold text-sm mb-2 text-orange-900">Advertencias y Evaluaciones</h4>
                <ul className="space-y-2 text-xs text-orange-800">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Alineación carrera-puesto cuestionable: requiere re-evaluación</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Afectación de operaciones departamentales: advertencia formal</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Cambio de carrera: requiere nueva aprobación de alineación</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Retrasos en reportes mensuales: evaluación del caso</span>
                  </li>
                </ul>
              </div>

              <Alert className="border-blue-200 bg-blue-50/50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-xs text-blue-800">
                  Todas las situaciones de incumplimiento son evaluadas por el cuerpo técnico de la DDBE en conjunto con Capital Humano.
                  En casos excepcionales debidamente justificados, se puede considerar prórroga o reinstalación del beneficio.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información Adicional */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <span>Situaciones Especiales</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm mb-1">Período Intensivo</h4>
              <p className="text-xs text-muted-foreground">
                NO está cubierto por este beneficio. El empleado debe asumir el costo completo de asignaturas en período intensivo.
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm mb-1">Cambio de Carrera o Programa</h4>
              <p className="text-xs text-muted-foreground">
                Requiere nueva evaluación de alineación carrera-puesto y aprobación del supervisor y Capital Humano.
                El beneficio puede ser suspendido si la nueva carrera no está alineada.
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm mb-1">Cambio de Puesto de Trabajo</h4>
              <p className="text-xs text-muted-foreground">
                Si el empleado cambia de puesto dentro de UNIMET, debe re-evaluarse la alineación.
                Si el nuevo puesto no está alineado con la carrera, puede perderse el beneficio.
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm mb-1">Permisos Especiales</h4>
              <p className="text-xs text-muted-foreground">
                En casos de salud, familiares o fuerza mayor, se puede solicitar permiso temporal.
                Requiere documentación de respaldo y aprobación de Capital Humano.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <span>Renovación y Verificación Continua</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert className="border-purple-200 bg-purple-50/50">
              <Info className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-sm text-purple-900">
                El beneficio se renueva cada período mientras se cumplan todos los requisitos establecidos.
                La renovación NO es automática y requiere firma del compromiso anual.
              </AlertDescription>
            </Alert>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm mb-1">Verificación Laboral Continua</h4>
              <p className="text-xs text-muted-foreground">
                Capital Humano verifica mensualmente el estatus laboral, desempeño y cumplimiento del plan de compensación (si aplica).
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm mb-1">Verificación Académica Trimestral</h4>
              <p className="text-xs text-muted-foreground">
                DDBE verifica el rendimiento académico cada trimestre. Al final del año lectivo se evalúa el IAA acumulado.
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm mb-1">Documentación Anual Obligatoria</h4>
              <p className="text-xs text-muted-foreground">
                Firma de compromiso de permanencia (enero), certificado de notas (cada período),
                evaluación de desempeño laboral (semestral), y reportes mensuales de compensación horaria.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequisitosBeneficios;