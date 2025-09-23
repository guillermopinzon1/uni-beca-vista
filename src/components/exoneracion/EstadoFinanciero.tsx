import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, Calendar, AlertTriangle, ExternalLink } from "lucide-react";

const EstadoFinanciero = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Estado Financiero</h1>
        <p className="text-muted-foreground">
          Resumen de cobertura, pagos pendientes y proyecciones financieras
        </p>
      </div>

      {/* Subsección: Resumen de Cobertura */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span>Resumen de Cobertura</span>
          </CardTitle>
          <CardDescription>Beneficios económicos del programa de exoneración</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800">Matrícula Cubierta</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">100%</Badge>
              </div>
              <p className="text-lg font-bold text-green-900">Bs. 185.000</p>
              <p className="text-xs text-green-700">Este período</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">Monto Exonerado</span>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-lg font-bold text-blue-900">Bs. 185.000</p>
              <p className="text-xs text-blue-700">Período 2024-3</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-800">Ahorro Acumulado</span>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <p className="text-lg font-bold text-purple-900">Bs. 1.110.000</p>
              <p className="text-xs text-purple-700">Desde ingreso</p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-800">Costo Regular</span>
                <DollarSign className="h-4 w-4 text-orange-600" />
              </div>
              <p className="text-lg font-bold text-orange-900">Bs. 185.000</p>
              <p className="text-xs text-orange-700">Sin beneficio</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-800">Porcentaje de Cobertura Total</h4>
                <p className="text-sm text-green-700">Matrícula completamente cubierta</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-900">100%</p>
                <Progress value={100} className="w-24 mt-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subsección: Pagos Pendientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span>Pagos Pendientes</span>
          </CardTitle>
          <CardDescription>Costos no cubiertos por el beneficio que debes cancelar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Pagos Obligatorios</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <span className="text-sm font-medium">Cuota de inscripción</span>
                      <p className="text-xs text-gray-600">Vence: 30/09/2024</p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-red-800">Bs. 45.000</span>
                      <Badge variant="destructive" className="ml-2 text-xs">Pendiente</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <span className="text-sm font-medium">Seguro estudiantil</span>
                      <p className="text-xs text-gray-600">Pagado: 15/09/2024</p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-green-800">Bs. 12.000</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 ml-2 text-xs">Pagado ✓</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div>
                      <span className="text-sm font-medium">Constancia de notas</span>
                      <p className="text-xs text-gray-600">Opcional</p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-yellow-800">Bs. 8.000</span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 ml-2 text-xs">Opcional</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Resumen de Pagos</h4>
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-blue-800">Total Pendiente</span>
                      <span className="text-lg font-bold text-blue-900">Bs. 45.000</span>
                    </div>
                    <div className="text-xs text-blue-700 space-y-1">
                      <p>• Cuota de inscripción: Bs. 45.000</p>
                      <p>• Fecha límite: 30/09/2024</p>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-green-800">Total Pagado</span>
                      <span className="text-lg font-bold text-green-900">Bs. 12.000</span>
                    </div>
                    <div className="text-xs text-green-700">
                      <p>• Seguro estudiantil: Bs. 12.000</p>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ir a Sistema de Pagos
                  </Button>
                </div>
              </div>
            </div>

            {/* Materias Reprobadas (si aplica) */}
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-medium text-red-800 mb-3">Materias Reprobadas - Pagos Adicionales</h4>
              <div className="text-sm text-red-700">
                <p className="mb-2">
                  <strong>Nota:</strong> No tienes materias reprobadas que requieran pago adicional.
                </p>
                <p className="text-xs">
                  Si repruebas alguna materia, deberás pagar el costo completo de reinscripción 
                  (no cubierto por el beneficio).
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subsección: Proyección Financiera */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span>Proyección Financiera</span>
          </CardTitle>
          <CardDescription>Estimaciones de costos y ahorros hasta la graduación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4">Proyección con Beneficio</h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Matrícula hasta graduación</span>
                    <span className="font-semibold text-green-800">Bs. 0</span>
                  </div>
                  <p className="text-xs text-green-700">100% cubierto por beneficio</p>
                </div>

                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pagos obligatorios restantes</span>
                    <span className="font-semibold text-orange-800">Bs. 342.000</span>
                  </div>
                  <p className="text-xs text-orange-700">Inscripciones + seguros (6 períodos)</p>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-300">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total proyectado a pagar</span>
                    <span className="text-lg font-bold text-blue-800">Bs. 342.000</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Comparación sin Beneficio</h4>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Matrícula total sin beneficio</span>
                    <span className="font-semibold text-red-800">Bs. 1.110.000</span>
                  </div>
                  <p className="text-xs text-red-700">Costo regular completo</p>
                </div>

                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pagos obligatorios</span>
                    <span className="font-semibold text-orange-800">Bs. 342.000</span>
                  </div>
                  <p className="text-xs text-orange-700">Inscripciones + seguros</p>
                </div>

                <div className="p-3 bg-red-50 rounded-lg border-2 border-red-300">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total sin beneficio</span>
                    <span className="text-lg font-bold text-red-800">Bs. 1.452.000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg border border-green-200">
            <div className="text-center">
              <h4 className="text-xl font-bold text-green-800 mb-2">Ahorro Total Proyectado</h4>
              <p className="text-3xl font-bold text-green-900 mb-2">Bs. 1.110.000</p>
              <p className="text-sm text-green-700">
                Este es el monto que ahorrarás gracias al beneficio de exoneración
              </p>
              <div className="mt-4 flex items-center justify-center space-x-4">
                <div className="text-center">
                  <p className="text-xs text-gray-600">Progreso del ahorro</p>
                  <Progress value={66} className="w-32 mt-1" />
                  <p className="text-xs text-gray-600 mt-1">66% completado</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerta de Renovación */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Verificación Trimestral</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800 mb-2">
              <strong>Próxima verificación:</strong> 15 de Octubre de 2024
            </p>
            <p className="text-xs text-blue-700">
              El sistema verificará automáticamente tu cumplimiento del IAA mínimo, 
              créditos inscritos y asistencia a tutorías DDBE.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstadoFinanciero;