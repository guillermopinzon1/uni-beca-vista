import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, FileText, Heart, GraduationCap, Upload } from "lucide-react";

const SituacionesEspeciales = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Situaciones Especiales</h1>
        <p className="text-muted-foreground">
          Gestión de solicitudes especiales según normativas del programa
        </p>
      </div>

      {/* Subsección: Retiro de Asignatura */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span>Retiro de Asignatura</span>
          </CardTitle>
          <CardDescription>
            Según Art. 15.f, requiere aval del tutor DDBE
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4">Nueva Solicitud de Retiro</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="asignatura">Asignatura a retirar</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la asignatura" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="calculo1">Cálculo I</SelectItem>
                      <SelectItem value="fisica1">Física I</SelectItem>
                      <SelectItem value="quimica">Química General</SelectItem>
                      <SelectItem value="programacion">Programación I</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="justificacion">Justificación Detallada</Label>
                  <Textarea 
                    id="justificacion"
                    placeholder="Explica detalladamente las razones del retiro..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Impacto:</strong> Este retiro podría afectar tu cumplimiento del mínimo 
                    de 12 asignaturas anuales requeridas.
                  </p>
                </div>

                <Button className="w-full">
                  Enviar Solicitud al Tutor DDBE
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Historial de Solicitudes</h4>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Cálculo II</span>
                    <Badge variant="destructive">Rechazado</Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Solicitud: 15/08/2024</p>
                  <p className="text-xs text-red-700">
                    Motivo rechazo: Insuficiente justificación académica
                  </p>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Estadística</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
                  </div>
                  <p className="text-xs text-gray-600">Solicitud: 20/09/2024</p>
                  <p className="text-xs text-yellow-700">
                    En revisión por tutor DDBE
                  </p>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Resumen:</strong> 1 retiro aprobado, 1 rechazado, 1 pendiente
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subsección: Solicitud de Permiso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-600" />
            <span>Solicitud de Permiso</span>
          </CardTitle>
          <CardDescription>
            Para ausentarse según Art. 17 (condición de salud o programa académico)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4">Nueva Solicitud de Permiso</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tipo-permiso">Tipo de Permiso</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salud-propia">Condición de salud propia</SelectItem>
                      <SelectItem value="salud-familiar">Condición de salud familiar directa</SelectItem>
                      <SelectItem value="programa-academico">Programa académico no vinculado con UNIMET</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duracion">Duración del Permiso</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" placeholder="Fecha inicio" />
                    <Input type="date" placeholder="Fecha fin" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="justificacion-permiso">Justificación</Label>
                  <Textarea 
                    id="justificacion-permiso"
                    placeholder="Detalla la razón del permiso..."
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="documentos">Documentos Soporte</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Arrastra archivos aquí o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-gray-500">
                      Documentos médicos, cartas oficiales, etc.
                    </p>
                  </div>
                </div>

                <Button className="w-full">
                  Enviar Solicitud de Permiso
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Información Importante</h4>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h5 className="text-sm font-medium text-green-800 mb-2">Beneficios del Permiso</h5>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• Mantiene el beneficio al regresar</li>
                    <li>• No cuenta como abandono del programa</li>
                    <li>• Protege tu status académico</li>
                  </ul>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="text-sm font-medium text-blue-800 mb-2">Documentos Requeridos</h5>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Informe médico (si es por salud)</li>
                    <li>• Carta de aceptación (programa académico)</li>
                    <li>• Formulario de solicitud completo</li>
                  </ul>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h5 className="text-sm font-medium text-yellow-800 mb-2">Condiciones</h5>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    <li>• Máximo 2 períodos consecutivos</li>
                    <li>• Debe notificar fecha de regreso</li>
                    <li>• Requiere aprobación previa</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subsección: Cambio de Carrera */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5 text-purple-600" />
            <span>Cambio de Carrera</span>
          </CardTitle>
          <CardDescription>
            Permitido 1 vez si tiene menos de 45 créditos según Art. 21
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Verificador de elegibilidad */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800">Estado de Elegibilidad</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">Elegible ✓</Badge>
              </div>
              <div className="text-xs text-green-700 space-y-1">
                <p>• Créditos aprobados: 38/45 (bajo el límite)</p>
                <p>• Cambios previos: 0/1 (permitido)</p>
                <p>• Status académico: Activo</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-4">Solicitud de Cambio</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="carrera-actual">Carrera Actual</Label>
                    <Input 
                      id="carrera-actual"
                      value="Ingeniería Industrial"
                      disabled
                      className="bg-gray-50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="carrera-nueva">Nueva Carrera Deseada</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la nueva carrera" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ing-sistemas">Ingeniería de Sistemas</SelectItem>
                        <SelectItem value="ing-civil">Ingeniería Civil</SelectItem>
                        <SelectItem value="administracion">Administración</SelectItem>
                        <SelectItem value="contaduria">Contaduría</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="justificacion-cambio">Justificación del Cambio</Label>
                    <Textarea 
                      id="justificacion-cambio"
                      placeholder="Explica las razones del cambio de carrera..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button className="w-full">
                    Enviar Solicitud de Cambio
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Proceso de Aprobación</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">1. Aval del Tutor DDBE</span>
                      <Badge variant="outline" className="border-blue-300 text-blue-700">Pendiente</Badge>
                    </div>
                    <p className="text-xs text-blue-700">
                      Evaluación de viabilidad académica
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">2. Aprobación Capital Humano</span>
                      <Badge variant="outline" className="border-gray-400 text-gray-600">Esperando</Badge>
                    </div>
                    <p className="text-xs text-gray-600">
                      Revisión de impacto en el beneficio
                    </p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">3. Aprobación Final</span>
                      <Badge variant="outline" className="border-gray-400 text-gray-600">Esperando</Badge>
                    </div>
                    <p className="text-xs text-gray-600">
                      Confirmación del cambio
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-800">
                    <strong>Advertencia:</strong> Solo se permite 1 cambio de carrera durante 
                    todo el programa. Esta decisión es irreversible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SituacionesEspeciales;