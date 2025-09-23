import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, Mail, Phone, MapPin, Award, FileText, Calendar, Heart } from "lucide-react";

const InstitucionAliada = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Mi Institución Aliada</h2>
        <p className="text-muted-foreground">Información sobre la institución que te nominó para la beca</p>
      </div>

      {/* Información de la Alianza */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Información de la Alianza</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">Fundación Empresas Polar</h3>
                    <Badge className="bg-blue-600 text-xs">Institución Nominadora</Badge>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Caracas, Venezuela</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span>Programa de Becas de Excelencia Académica</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">CONVENIO</h4>
                  <p className="font-semibold">Convenio Marco de Cooperación UNIMET-FEP 2024</p>
                  <p className="text-sm text-muted-foreground">
                    Acuerdo para el otorgamiento de becas de estudio a estudiantes de alto rendimiento académico
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">FECHA DE NOMINACIÓN</h4>
                  <p className="font-semibold">15 de diciembre de 2023</p>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">VIGENCIA</h4>
                  <p className="font-semibold">2024 - 2029 (5 años)</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">Compromisos con la Institución</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                    <Award className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Mantener excelencia académica (IAA ≥ 12.0)</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                    <FileText className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Participar en reportes anuales de progreso</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                    <Heart className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Representar positivamente a ambas instituciones</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                    <Building className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Participar en eventos de la Fundación</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Contacto del Representante</h4>
                <div className="p-3 border rounded-lg">
                  <p className="font-semibold">Lic. Carmen Rodríguez</p>
                  <p className="text-sm text-muted-foreground mb-2">Coordinadora de Becas</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>carmen.rodriguez@empresaspolar.com</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>+58 212-202-7111 ext. 4567</span>
                    </div>
                  </div>
                  <Button size="sm" className="mt-2 w-full">
                    Enviar Email
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reportes a la Institución */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Reportes a la Institución</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Reporte Automático de Progreso</h4>
              <p className="text-sm text-blue-800 mb-3">
                La Fundación recibe automáticamente informes trimestrales sobre tu rendimiento académico
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-white p-2 rounded border">
                  <p className="font-medium">Último Reporte</p>
                  <p className="text-muted-foreground">Oct 2025</p>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs mt-1">
                    ✅ Excelente
                  </Badge>
                </div>
                <div className="bg-white p-2 rounded border">
                  <p className="font-medium">IAA Reportado</p>
                  <p className="text-muted-foreground">13.5/20</p>
                </div>
                <div className="bg-white p-2 rounded border">
                  <p className="font-medium">Estado</p>
                  <p className="text-muted-foreground">Cumpliendo metas</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">Carta de Agradecimiento Anual</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Envía una carta personalizada de agradecimiento a la Fundación
                </p>
                <div className="space-y-2">
                  <div className="text-xs">
                    <span className="font-medium">Última carta:</span> Enero 2025
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Próxima carta:</span> Enero 2026
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-3">
                  Redactar Carta 2026
                </Button>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">Eventos de la Institución</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Participa en actividades organizadas por la Fundación
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Encuentro Anual de Becarios</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Asistido
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Taller de Liderazgo</span>
                    <Badge variant="outline" className="border-blue-300 text-blue-700">
                      15 Dic 2025
                    </Badge>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-3">
                  Ver Próximos Eventos
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historial de Interacciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Historial de Interacciones</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Encuentro Anual de Becarios 2025</h4>
                    <p className="text-sm text-muted-foreground">Asistencia al evento anual de la Fundación</p>
                  </div>
                  <span className="text-xs text-muted-foreground">15 Feb 2025</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Carta de Agradecimiento 2025</h4>
                    <p className="text-sm text-muted-foreground">Carta enviada expresando gratitud por la beca</p>
                  </div>
                  <span className="text-xs text-muted-foreground">20 Ene 2025</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Nominación Recibida</h4>
                    <p className="text-sm text-muted-foreground">Seleccionado para beca Impacto por la Fundación</p>
                  </div>
                  <span className="text-xs text-muted-foreground">15 Dic 2023</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstitucionAliada;