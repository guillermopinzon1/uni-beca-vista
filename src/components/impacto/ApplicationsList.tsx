import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Download, Clock, CheckCircle, XCircle } from "lucide-react";

interface Application {
  id: string;
  fecha: string;
  estado: "En Revisión" | "Seleccionado" | "No Seleccionado" | "Pendiente PDU";
  promedio: number;
  pduResultado?: number;
  observaciones?: string;
}

const ApplicationsList = () => {
  // Datos de ejemplo
  const applications: Application[] = [
    {
      id: "IMP-2024-001",
      fecha: "2024-01-15",
      estado: "Seleccionado",
      promedio: 18.5,
      pduResultado: 85,
      observaciones: "Cumple todos los requisitos. Excelente perfil académico.",
    },
    {
      id: "IMP-2024-002",
      fecha: "2024-01-20",
      estado: "En Revisión",
      promedio: 17.2,
      observaciones: "Pendiente resultado de PDU.",
    },
    {
      id: "IMP-2023-018",
      fecha: "2023-12-10",
      estado: "No Seleccionado",
      promedio: 16.8,
      pduResultado: 25,
      observaciones: "No alcanza percentil mínimo en PDU. Puede optar por CPES.",
    },
  ];

  const getStatusBadge = (status: Application["estado"]) => {
    switch (status) {
      case "Seleccionado":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200"><CheckCircle className="h-3 w-3 mr-1" />Seleccionado</Badge>;
      case "No Seleccionado":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />No Seleccionado</Badge>;
      case "En Revisión":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />En Revisión</Badge>;
      case "Pendiente PDU":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"><Clock className="h-3 w-3 mr-1" />Pendiente PDU</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mis Postulaciones a Beca Impacto</CardTitle>
          <CardDescription>
            Historial de todas tus postulaciones y su estado actual. Puedes revisar los detalles y descargar documentos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tienes postulaciones registradas aún.</p>
              <Button className="mt-4" onClick={() => window.location.hash = "#postular"}>
                Crear Nueva Postulación
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Promedio</TableHead>
                  <TableHead>PDU</TableHead>
                  <TableHead>Observaciones</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.id}</TableCell>
                    <TableCell>{new Date(application.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(application.estado)}</TableCell>
                    <TableCell>{application.promedio.toFixed(2)}</TableCell>
                    <TableCell>
                      {application.pduResultado ? (
                        <span className={application.pduResultado >= 30 ? "text-green-600" : "text-red-600"}>
                          {application.pduResultado}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Pendiente</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {application.observaciones || "Sin observaciones"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => console.log("Ver detalles", application.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => console.log("Descargar", application.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Resultado de Selección */}
      {applications.some(app => app.estado === "Seleccionado") && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800">¡Felicitaciones!</CardTitle>
            <CardDescription className="text-green-700">
              Has sido seleccionado para la Beca Impacto. Revisa los próximos pasos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h4 className="font-semibold">Próximos pasos:</h4>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Completar el proceso de matrícula</li>
                <li>Firmar el contrato de beca</li>
                <li>Asistir a la sesión de orientación para becarios</li>
                <li>Iniciar el programa de mentorías</li>
              </ul>
              <Button className="mt-4">
                Descargar Carta de Aceptación
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información sobre PDU */}
      {applications.some(app => app.pduResultado && app.pduResultado < 30) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">Opción CPES Disponible</CardTitle>
            <CardDescription className="text-yellow-700">
              Tu resultado en la PDU indica que puedes acceder al Curso Propedéutico de Educación Superior (CPES).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              El CPES te permitirá fortalecer tus conocimientos y volver a postular para la Beca Impacto en el siguiente período.
            </p>
            <Button variant="outline">
              Información sobre CPES
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApplicationsList;