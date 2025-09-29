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

      {/* Requisitos a Cumplir */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Requisitos a Cumplir</span>
          </CardTitle>
          <CardDescription>
            Verifica que cumples con todos los requisitos para mantener tu beca
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default RenovacionAnual;