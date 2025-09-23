import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Clock, 
  Calendar, 
  FileText,
  Download,
  AlertCircle
} from "lucide-react";

const RenovacionAnual = () => {
  const renovacionData = {
    fechaProximaRenovacion: "2025-07-15",
    diasRestantes: 45,
    documentos: [
      { nombre: "IAA mínimo 15.0", estado: "completado", valor: "15.8", automatico: true },
      { nombre: "12 créditos mínimos", estado: "completado", valor: "Completado", automatico: true },
      { nombre: "Certificación del Director de Deportes", estado: "pendiente", automatico: false },
      { nombre: "Carta de continuidad en selección", estado: "pendiente", automatico: false },
      { nombre: "Sin sanciones disciplinarias", estado: "completado", valor: "Verificado", automatico: true },
      { nombre: "Actualización de datos personales", estado: "opcional", automatico: false }
    ]
  };

  const historialRenovaciones = [
    { año: "2024", estado: "Aprobada", iaa: "15.5", observaciones: "Sin observaciones" },
    { año: "2023", estado: "Aprobada", iaa: "15.3", observaciones: "Primera renovación" }
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "completado": return "text-green-600 bg-green-50 border-green-200";
      case "pendiente": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "opcional": return "text-blue-600 bg-blue-50 border-blue-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "completado": return <CheckCircle className="h-4 w-4" />;
      case "pendiente": return <Clock className="h-4 w-4" />;
      case "opcional": return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const documentosCompletados = renovacionData.documentos.filter(doc => doc.estado === "completado").length;
  const totalObligatorios = renovacionData.documentos.filter(doc => doc.estado !== "opcional").length;
  const progreso = (documentosCompletados / totalObligatorios) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Renovación Anual</h2>
        <p className="text-muted-foreground">
          Gestiona el proceso de renovación de tu beca de excelencia
        </p>
      </div>

      {/* Estado de Renovación */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Estado de Renovación</span>
          </CardTitle>
          <CardDescription>
            Próxima renovación: {new Date(renovacionData.fechaProximaRenovacion).toLocaleDateString('es-ES')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Alerta de tiempo */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <p className="text-yellow-800 font-medium">
                Te quedan {renovacionData.diasRestantes} días para completar la renovación
              </p>
            </div>
          </div>

          {/* Progreso general */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Progreso de Documentos</h3>
              <span className="text-sm text-muted-foreground">
                {documentosCompletados}/{totalObligatorios} completados
              </span>
            </div>
            <Progress value={progreso} className="h-3" />
          </div>

          {/* Checklist de Documentos */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Checklist de Documentos</h3>
            <div className="space-y-2">
              {renovacionData.documentos.map((doc, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${getEstadoColor(doc.estado)}`}
                >
                  <div className="flex items-center space-x-3">
                    {getEstadoIcon(doc.estado)}
                    <div>
                      <p className="font-medium">{doc.nombre}</p>
                      {doc.valor && (
                        <p className="text-sm opacity-75">
                          {doc.automatico ? "Verificado automáticamente" : ""} - {doc.valor}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getEstadoColor(doc.estado)}>
                      {doc.estado === "completado" ? "Completado" : 
                       doc.estado === "pendiente" ? "Pendiente" : "Opcional"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botón de acción */}
          <div className="pt-4">
            <Button className="w-full bg-primary hover:bg-primary/90">
              <FileText className="h-4 w-4 mr-2" />
              Iniciar Proceso de Renovación
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historial de Renovaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Historial de Renovaciones</CardTitle>
          <CardDescription>
            Registro de todas tus renovaciones anteriores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Año</th>
                  <th className="text-left py-3 px-4 font-semibold">Estado</th>
                  <th className="text-left py-3 px-4 font-semibold">IAA</th>
                  <th className="text-left py-3 px-4 font-semibold">Observaciones</th>
                  <th className="text-left py-3 px-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {historialRenovaciones.map((renovacion, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">{renovacion.año}</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                        {renovacion.estado}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-medium">{renovacion.iaa}</td>
                    <td className="py-3 px-4 text-muted-foreground">{renovacion.observaciones}</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Ver detalles
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RenovacionAnual;