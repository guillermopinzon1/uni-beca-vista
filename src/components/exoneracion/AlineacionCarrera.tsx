import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Building, Target, TrendingUp, CheckCircle, Users } from "lucide-react";

const AlineacionCarrera = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Alineación Carrera-Puesto</h1>
        <p className="text-muted-foreground">
          Específica para empleados según Art. 7.g y 9.f - Justificación y plan de desarrollo
        </p>
      </div>

      {/* Subsección: Justificación Aprobada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Justificación Aprobada</span>
          </CardTitle>
          <CardDescription>Alineación entre tu carrera académica y puesto laboral</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4">Información Académica y Laboral</h4>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <GraduationCap className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Carrera Seleccionada</span>
                  </div>
                  <p className="text-lg font-semibold text-blue-900">Contaduría Pública</p>
                  <p className="text-sm text-blue-700">Pregrado - 5 años de duración</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Building className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Puesto Actual</span>
                  </div>
                  <p className="text-lg font-semibold text-green-900">Analista Contable</p>
                  <p className="text-sm text-green-700">Departamento de Finanzas</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-800">Aprobación</span>
                  </div>
                  <p className="text-sm text-purple-900">
                    <strong>Aprobado por:</strong> Director de Finanzas
                  </p>
                  <p className="text-sm text-purple-900">
                    <strong>Fecha:</strong> 15 de Marzo de 2024
                  </p>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 mt-2">
                    Alineación Aprobada ✓
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Justificación del Desarrollo</h4>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h5 className="font-medium text-yellow-800 mb-2">Desarrollo Profesional Alineado</h5>
                  <p className="text-sm text-yellow-700 mb-3">
                    La carrera de Contaduría Pública complementa directamente las funciones 
                    del puesto de Analista Contable, permitiendo:
                  </p>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    <li>• Profundizar conocimientos en normas contables</li>
                    <li>• Mejorar análisis financiero institucional</li>
                    <li>• Desarrollar competencias en auditoría interna</li>
                    <li>• Optimizar procesos contables existentes</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-medium text-blue-800 mb-2">Beneficios para UNIMET</h5>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Mayor eficiencia en procesos contables</li>
                    <li>• Reducción de errores en reportes financieros</li>
                    <li>• Capacidad de asumir responsabilidades adicionales</li>
                    <li>• Apoyo en implementación de nuevos sistemas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subsección: Plan de Desarrollo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span>Plan de Desarrollo</span>
          </CardTitle>
          <CardDescription>Competencias y proyección de carrera profesional</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4">Competencias Actuales vs. A Desarrollar</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Normas Contables Nacionales</span>
                    <span className="text-sm font-bold text-green-800">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-gray-600 mt-1">Competencia actual sólida</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">NIIF (Normas Internacionales)</span>
                    <span className="text-sm font-bold text-yellow-800">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                  <p className="text-xs text-gray-600 mt-1">A desarrollar con materias específicas</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Auditoría Interna</span>
                    <span className="text-sm font-bold text-red-800">20%</span>
                  </div>
                  <Progress value={20} className="h-2" />
                  <p className="text-xs text-gray-600 mt-1">Nuevo conocimiento a adquirir</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Análisis Financiero Avanzado</span>
                    <span className="text-sm font-bold text-orange-800">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                  <p className="text-xs text-gray-600 mt-1">En desarrollo continuo</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Aplicación de Conocimientos</h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h5 className="text-sm font-medium text-green-800 mb-2">Aplicación Inmediata</h5>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• Implementación de nuevos controles contables</li>
                    <li>• Optimización de procesos de cierre mensual</li>
                    <li>• Mejora en preparación de estados financieros</li>
                  </ul>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="text-sm font-medium text-blue-800 mb-2">Aplicación a Mediano Plazo</h5>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Liderazgo en implementación de NIIF</li>
                    <li>• Desarrollo de procedimientos de auditoría</li>
                    <li>• Capacitación a personal del departamento</li>
                  </ul>
                </div>

                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <h5 className="text-sm font-medium text-purple-800 mb-2">Aplicación a Largo Plazo</h5>
                  <ul className="text-xs text-purple-700 space-y-1">
                    <li>• Consultoría interna en temas contables</li>
                    <li>• Participación en decisiones estratégicas</li>
                    <li>• Mentoring a nuevos empleados</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subsección: Proyección de Carrera Interna */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span>Proyección de Carrera Interna</span>
          </CardTitle>
          <CardDescription>Plan de crecimiento profesional dentro de UNIMET</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Timeline de carrera */}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-green-400"></div>
              
              <div className="space-y-6">
                <div className="relative flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center relative z-10">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-800">Posición Actual (2024)</h5>
                    <p className="text-sm text-green-700">Analista Contable - Departamento de Finanzas</p>
                    <p className="text-xs text-green-600">Competencias básicas desarrolladas</p>
                  </div>
                </div>

                <div className="relative flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center relative z-10">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div className="flex-1 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="font-medium text-blue-800">Analista Senior (2026)</h5>
                    <p className="text-sm text-blue-700">Al completar 50% de la carrera</p>
                    <p className="text-xs text-blue-600">Liderazgo de proyectos específicos</p>
                  </div>
                </div>

                <div className="relative flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center relative z-10">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div className="flex-1 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h5 className="font-medium text-purple-800">Coordinador Contable (2028)</h5>
                    <p className="text-sm text-purple-700">Al graduarse y completar compromiso</p>
                    <p className="text-xs text-purple-600">Supervisión de equipo y procesos</p>
                  </div>
                </div>

                <div className="relative flex items-start space-x-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center relative z-10">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div className="flex-1 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h5 className="font-medium text-orange-800">Gerente de Contabilidad (2030+)</h5>
                    <p className="text-sm text-orange-700">Proyección a largo plazo</p>
                    <p className="text-xs text-orange-600">Dirección estratégica del área contable</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compromisos de Mejora Laboral */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-blue-800">Compromisos de Mejora Laboral</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-3">Compromisos Académicos Aplicados</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="text-sm">Aplicar NIIF en reportes trimestrales</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">En progreso</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="text-sm">Liderar proyecto de automatización</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">Planificado</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="text-sm">Certificación en auditoría interna</span>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">2025</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-3">Indicadores de Rendimiento</h5>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Eficiencia en cierre mensual</span>
                          <span className="font-bold text-green-700">+25%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Reducción de errores</span>
                          <span className="font-bold text-green-700">-40%</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Satisfacción del supervisor</span>
                          <span className="font-bold text-green-700">9.2/10</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Próxima Evaluación */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <span>Próxima Evaluación de Alineación</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Evaluación anual programada:</strong> 15 de Marzo de 2025
            </p>
            <p className="text-xs text-blue-700 mb-3">
              Se revisará el progreso académico y su aplicación en el puesto laboral, 
              así como el cumplimiento de los compromisos establecidos.
            </p>
            <Button variant="outline" className="border-blue-300 text-blue-700">
              Programar reunión con supervisor
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlineacionCarrera;