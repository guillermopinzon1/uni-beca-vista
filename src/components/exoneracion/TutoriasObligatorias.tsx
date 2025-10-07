import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, FileText, Users, AlertTriangle } from "lucide-react";

const TutoriasObligatorias = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Tutorías Obligatorias DDBE</h1>
        <p className="text-muted-foreground">
          Según Art. 6, todos los beneficiarios deben asistir a tutorías de orientación
        </p>
      </div>

      {/* Subsección: Calendario de Tutorías */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Calendario de Tutorías</span>
          </CardTitle>
          <CardDescription>Próximas sesiones programadas y historial de asistencia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4">Próxima Tutoría Programada</h4>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Viernes, 27 de Septiembre 2024</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>2:00 PM - 3:00 PM</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>Oficina DDBE - Piso 2</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span>Tutor: Lic. Ana Rodríguez</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button size="sm" className="flex-1">
                    Confirmar Asistencia
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Reagendar
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Historial de Asistencia</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Sesión 1 - Orientación Inicial</p>
                    <p className="text-xs text-gray-600">15/08/2024 - 2:00 PM</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Asistió ✓</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Sesión 2 - Planificación Académica</p>
                    <p className="text-xs text-gray-600">05/09/2024 - 2:00 PM</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Asistió ✓</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Sesión 3 - Seguimiento Académico</p>
                    <p className="text-xs text-gray-600">27/09/2024 - 2:00 PM</p>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Programada</Badge>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Progreso:</strong> 2/3 sesiones mínimas completadas este período
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subsección: Recursos de Orientación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-green-600" />
            <span>Recursos de Orientación</span>
          </CardTitle>
          <CardDescription>Materiales y herramientas proporcionados por el tutor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Plan de Estudios</span>
              </div>
              <p className="text-xs text-green-700 mb-3">Plan personalizado para tu carrera</p>
              <Button variant="outline" size="sm" className="w-full border-green-300 text-green-700">
                Descargar PDF
              </Button>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Técnicas de Estudio</span>
              </div>
              <p className="text-xs text-blue-700 mb-3">Métodos recomendados por el tutor</p>
              <Button variant="outline" size="sm" className="w-full border-blue-300 text-blue-700">
                Ver Recursos
              </Button>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-800">Tutores por Materia</span>
              </div>
              <p className="text-xs text-purple-700 mb-3">Contactos de apoyo académico</p>
              <Button variant="outline" size="sm" className="w-full border-purple-300 text-purple-700">
                Ver Contactos
              </Button>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-800">Grupos de Estudio</span>
              </div>
              <p className="text-xs text-orange-700 mb-3">Conecta con otros estudiantes</p>
              <Button variant="outline" size="sm" className="w-full border-orange-300 text-orange-700">
                Unirse
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subsección: Compromisos con DDBE */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-red-600" />
            <span>Compromisos con DDBE</span>
          </CardTitle>
          <CardDescription>Acuerdos firmados y seguimiento de cumplimiento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Acuerdos Firmados en Tutorías</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Plan de Mejora Académica</p>
                        <p className="text-xs text-gray-600">Firmado: 15/08/2024</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Cumpliendo</Badge>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Cronograma de Materias</p>
                        <p className="text-xs text-gray-600">Actualizado: 05/09/2024</p>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">En progreso</Badge>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Compromiso de Asistencia</p>
                        <p className="text-xs text-gray-600">Próxima revisión: 27/09/2024</p>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Evaluación de Progreso</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Cumplimiento de objetivos</span>
                      <span className="text-sm font-bold text-green-800">85%</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p>✓ Asistencia puntual a tutorías</p>
                      <p>✓ Entrega de tareas de seguimiento</p>
                      <p>⚠️ Pendiente: revisión de notas parciales</p>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h5 className="text-sm font-medium mb-2">Recomendaciones del Tutor</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Aumentar horas de estudio semanales</li>
                      <li>• Participar en grupo de estudio de Cálculo</li>
                      <li>• Programar sesión de refuerzo en Física</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerta de Asistencia */}
      <Card className="border-yellow-200 bg-yellow-50/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-yellow-800">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span>Importante: Asistencia Obligatoria</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-yellow-100 rounded-lg">
            <p className="text-sm text-yellow-800 mb-2">
              <strong>Recordatorio:</strong> La inasistencia injustificada a las tutorías DDBE puede afectar 
              tu beneficio de exoneración.
            </p>
            <p className="text-xs text-yellow-700">
              Debes cumplir con un mínimo de 3 sesiones por período académico. 
              Si no puedes asistir, debes justificar tu ausencia con 24 horas de anticipación.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TutoriasObligatorias;