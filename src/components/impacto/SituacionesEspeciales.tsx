import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, FileText, Upload, Clock, Ban, RotateCcw } from "lucide-react";

const SituacionesEspeciales = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Situaciones Especiales</h2>
        <p className="text-muted-foreground">Gestión de retiros, permisos y cambios de carrera</p>
      </div>

      {/* Retiro de Asignaturas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Retiro de Asignaturas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Importante:</span>
              </div>
              <p className="text-sm text-yellow-800 mt-1">
                Durante período intensivo NO se permiten retiros. Requiere aprobación del mentor asignado.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="materia-retiro">Asignatura a retirar</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una materia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="calculo2">Cálculo II (MAT-201)</SelectItem>
                      <SelectItem value="fisica1">Física I (FIS-101)</SelectItem>
                      <SelectItem value="programacion">Programación (INF-101)</SelectItem>
                      <SelectItem value="quimica">Química General (QUI-101)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="justificacion">Justificación detallada</Label>
                  <Textarea 
                    id="justificacion"
                    placeholder="Describe las razones para solicitar el retiro..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="plan-recuperacion">Plan de recuperación</Label>
                  <Textarea 
                    id="plan-recuperacion"
                    placeholder="Describe cómo recuperarás la materia..."
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="documentos-soporte">Documentos de soporte</Label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                    <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Arrastra archivos aquí o haz clic para seleccionar
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button className="w-full">
              Enviar Solicitud de Retiro
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mis Solicitudes de Retiro */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historial de Solicitudes de Retiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">Cálculo II (MAT-201)</h4>
                  <p className="text-sm text-muted-foreground">Solicitud enviada: 15 Sep 2025</p>
                </div>
                <Badge className="bg-green-600">Aprobada</Badge>
              </div>
              <p className="text-sm"><strong>Motivo:</strong> Dificultades con el contenido, necesita refuerzo</p>
              <p className="text-sm"><strong>Mentor:</strong> Aprobado - Recomendó tutoría intensiva</p>
              <p className="text-sm"><strong>Recuperación:</strong> Período 2025-2</p>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">Física I (FIS-101)</h4>
                  <p className="text-sm text-muted-foreground">Solicitud enviada: 3 Oct 2025</p>
                </div>
                <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                  En evaluación
                </Badge>
              </div>
              <p className="text-sm"><strong>Motivo:</strong> Conflicto de horarios con trabajo</p>
              <p className="text-sm"><strong>Estado:</strong> Esperando revisión del mentor</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Solicitud de Permiso */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Solicitud de Permiso (Art. 22)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Casos excepcionales permitidos:</strong> Condición de salud propia o familiar, 
                participación en programa académico especial (intercambio, investigación).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="tipo-permiso">Tipo de permiso</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salud-propia">Condición de salud propia</SelectItem>
                      <SelectItem value="salud-familiar">Condición de salud familiar</SelectItem>
                      <SelectItem value="programa-academico">Programa académico especial</SelectItem>
                      <SelectItem value="otro">Otro (especificar)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duracion">Duración del permiso</Label>
                  <Input placeholder="Ej: 1 período académico" />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="justificacion-permiso">Justificación detallada</Label>
                  <Textarea 
                    id="justificacion-permiso"
                    placeholder="Explica la situación excepcional..."
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="soportes-medicos">Soportes médicos/académicos</Label>
                  <div className="border-2 border-dashed border-muted rounded-lg p-3 text-center">
                    <Upload className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Subir documentos</p>
                  </div>
                </div>
              </div>
            </div>

            <Button className="w-full">
              Enviar Solicitud de Permiso
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cambio de Carrera */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <RotateCcw className="h-5 w-5" />
            <span>Cambio de Carrera</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className="bg-blue-600">Disponible</Badge>
                <span className="text-sm font-medium">Puedes solicitar cambio de carrera</span>
              </div>
              <p className="text-sm text-blue-800">
                Tienes 42 créditos aprobados (menos de 45). Máximo 1 cambio permitido.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="carrera-actual">Carrera actual</Label>
                  <Input value="Ingeniería de Sistemas" disabled />
                </div>

                <div>
                  <Label htmlFor="carrera-nueva">Nueva carrera solicitada</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona nueva carrera" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ing-industrial">Ingeniería Industrial</SelectItem>
                      <SelectItem value="ing-civil">Ingeniería Civil</SelectItem>
                      <SelectItem value="administracion">Administración</SelectItem>
                      <SelectItem value="comunicacion">Comunicación Social</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="creditos-actuales">Créditos actuales</Label>
                  <Input value="42 créditos aprobados" disabled />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="justificacion-cambio">Justificación del cambio</Label>
                  <Textarea 
                    id="justificacion-cambio"
                    placeholder="Explica las razones para el cambio de carrera..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    <strong>Nota:</strong> Requiere aval del cuerpo técnico y solo se permite 1 cambio durante toda la carrera.
                  </p>
                </div>
              </div>
            </div>

            <Button className="w-full">
              Enviar Solicitud de Cambio
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historial de Permisos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historial de Solicitudes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Ban className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No tienes solicitudes de permisos o cambios anteriores</p>
            <p className="text-sm">Cuando realices solicitudes aparecerán aquí</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SituacionesEspeciales;