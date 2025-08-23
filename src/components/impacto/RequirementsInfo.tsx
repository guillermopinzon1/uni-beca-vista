import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Info, 
  DollarSign, 
  Users, 
  Award, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  FileText,
  GraduationCap
} from "lucide-react";

const RequirementsInfo = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Información del Programa de Beca Impacto
          </CardTitle>
          <CardDescription>
            Toda la información que necesitas conocer sobre el programa, requisitos y beneficios.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="programa" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="programa">Programa</TabsTrigger>
          <TabsTrigger value="requisitos">Requisitos</TabsTrigger>
          <TabsTrigger value="beneficios">Beneficios</TabsTrigger>
          <TabsTrigger value="compromisos">Compromisos</TabsTrigger>
          <TabsTrigger value="mantenimiento">Mantenimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="programa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Sobre la Beca Impacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Descripción del Programa</h4>
                <p className="text-muted-foreground">
                  La Beca Impacto es un programa de apoyo financiero integral dirigido a estudiantes con excelente 
                  rendimiento académico y potencial de liderazgo, que buscan cursar estudios de pregrado en la 
                  Universidad Metropolitana.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Cobertura</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li><strong>Exoneración total</strong> de matrícula de pregrado</li>
                  <li>Cobertura de asignaturas del plan de estudios</li>
                  <li>Cuota trimestral de inscripción incluida</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Proceso de Selección</h4>
                <p className="text-muted-foreground">
                  El proceso es avalado por un cuerpo técnico designado por la Secretaría General, garantizando 
                  transparencia y criterios académicos rigurosos en la evaluación de candidatos.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Acompañamiento</h4>
                <p className="text-muted-foreground">
                  Incluye mentoría y acompañamiento integral por parte de la Dirección de Bienestar Estudiantil 
                  durante toda la duración de los estudios.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requisitos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Requisitos de Postulación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2 text-green-800">Requisitos Académicos</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Promedio mínimo: <Badge variant="secondary">15.00 puntos</Badge>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Notas certificadas del 1º al 4º año
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Presentar la PDU obligatoriamente
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2 text-blue-800">Requisitos Personales</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        Edad máxima: <Badge variant="secondary">21 años</Badge>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        Bachiller graduado o cursando último año
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                        Carta motivacional
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Documentos Requeridos</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm">Título/Constancia de Bachillerato</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm">Notas Certificadas</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm">Cédula de Identidad</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Prueba Diagnóstica de Ubicación (PDU)</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Importante:</strong> Percentil mínimo requerido ≥ 30. Si obtienes menos de 30, 
                    podrás inscribirte en el CPES para prepararte y volver a postular.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="beneficios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Beneficios de la Beca
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-green-200 bg-green-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Beneficios Económicos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>✓ Exoneración total de matrícula</li>
                      <li>✓ Cobertura de asignaturas del plan de estudios</li>
                      <li>✓ Cuota trimestral de inscripción</li>
                      <li>✓ Tiempo máximo: 15 períodos regulares</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Beneficios Académicos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>✓ Programa de mentorías personalizado</li>
                      <li>✓ Acompañamiento integral por Bienestar Estudiantil</li>
                      <li>✓ Participación en actividades institucionales</li>
                      <li>✓ Desarrollo de liderazgo</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-blue-800">Límites de Tiempo</h4>
                <p className="text-sm text-blue-700">
                  La beca tiene una duración máxima de <strong>15 períodos regulares</strong>, 
                  durante los cuales debes mantener un rendimiento académico excelente.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compromisos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Compromisos del Beneficiario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Compromisos Académicos</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Cumplir con los compromisos académicos establecidos</li>
                  <li>Mantener un rendimiento académico sobresaliente</li>
                  <li>Participar activamente en el proceso de formación</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Compromisos Administrativos</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Cumplir con todos los procedimientos administrativos</li>
                  <li>Mantener actualizada la información personal y académica</li>
                  <li>Realizar pagos de aranceles no cubiertos por la beca</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Apoyo Institucional</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Participar en actividades institucionales convocadas por la Secretaría General</li>
                  <li>Contribuir con eventos e iniciativas de la universidad</li>
                  <li>Ser embajador de los valores institucionales</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Programa de Mentorías</h4>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-700">
                    <strong>Obligatorio:</strong> Todos los becarios deben participar en el Programa de Mentorías 
                    como parte integral de su formación académica y personal.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Aranceles No Cubiertos</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Badge variant="outline">Constancias</Badge>
                  <Badge variant="outline">Derecho a grado</Badge>
                  <Badge variant="outline">Reingresos</Badge>
                  <Badge variant="outline">Cambio de carrera</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mantenimiento" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Mantenimiento de la Beca
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Requisitos Académicos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">IAA ≥ 12 puntos</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Mantener un Índice Académico Acumulado mínimo de 12 puntos.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800">12 créditos mínimos</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Inscribir mínimo 12 créditos regulares por período (excluye deportes/artes).
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Restricciones Importantes</h4>
                <div className="space-y-3">
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="pt-4">
                      <h5 className="font-medium text-yellow-800 mb-2">Cambio de Carrera</h5>
                      <p className="text-sm text-yellow-700">
                        Solo se permite <strong>un cambio de carrera</strong> y únicamente si tienes 
                        menos de 45 créditos aprobados.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="pt-4">
                      <h5 className="font-medium text-orange-800 mb-2">Asignaturas Reprobadas/Retiradas</h5>
                      <p className="text-sm text-orange-700">
                        Debes pagar el <strong>30% del costo</strong> de las asignaturas reprobadas o retiradas.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-4">
                      <h5 className="font-medium text-red-800 mb-2">Pérdida del Beneficio</h5>
                      <p className="text-sm text-red-700">
                        La beca se pierde por incumplimiento académico o disciplinario según las 
                        normas universitarias.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Permisos de Interrupción</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    Se permite <strong>solo una interrupción</strong> durante toda la carrera, 
                    con aval previo del cuerpo técnico designado por la Secretaría General.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full md:w-auto">
                  Descargar Reglamento Completo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequirementsInfo;