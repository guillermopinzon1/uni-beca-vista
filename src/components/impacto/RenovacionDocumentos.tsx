import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, Download, Upload, RefreshCw, FileText } from "lucide-react";

const RenovacionDocumentos = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Renovación y Documentos</h2>
        <p className="text-muted-foreground">Gestión de documentos y verificaciones trimestrales</p>
      </div>

      {/* Mi Carta Compromiso */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mi Carta Compromiso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <FileText className="h-6 w-6 text-blue-600 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900">Carta Compromiso - Beca Impacto 2024</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Documento firmado el 15 de enero de 2024
                </p>
                <div className="mt-3 space-y-2 text-sm">
                  <p><strong>Cláusulas principales:</strong></p>
                  <ul className="list-disc list-inside space-y-1 text-blue-800">
                    <li>Mantener IAA mínimo de 12.0 puntos</li>
                    <li>Inscribir y aprobar mínimo 12 créditos por período</li>
                    <li>No exceder 15 períodos regulares consecutivos</li>
                    <li>Participar activamente en el programa de mentoría</li>
                    <li>Pagar 30% del costo de reinscripción por materias reprobadas</li>
                    <li>Colaborar en actividades institucionales cuando sea requerido</li>
                  </ul>
                </div>
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-800">
                    <strong>Consecuencias de incumplimiento:</strong> La beca será suspendida inmediatamente 
                    sin posibilidad de recuperación. El estudiante deberá pagar la totalidad de los montos 
                    exonerados durante su permanencia en el programa.
                  </p>
                </div>
                <Button className="mt-4" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PDF Certificado
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documentos Requeridos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Documentos Requeridos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Cédula de Identidad</p>
                  <p className="text-sm text-muted-foreground">Vigente hasta: 12/08/2028</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Vigente
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Carta Compromiso</p>
                  <p className="text-sm text-muted-foreground">Firmada: 15/01/2024</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Firmada
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium">Constancia de Notas Actualizada</p>
                  <p className="text-sm text-muted-foreground">Última actualización: 15/09/2025</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                  Actualizar
                </Badge>
                <Button size="sm" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Subir
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Comprobante Situación Socioeconómica</p>
                  <p className="text-sm text-muted-foreground">Válido hasta: 15/01/2026</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Vigente
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default RenovacionDocumentos;