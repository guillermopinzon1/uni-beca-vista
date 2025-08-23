import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const ApplicationsList = () => {
  const applications = [
    {
      id: 1,
      categoria: "Académica",
      fechaEnvio: "2024-03-15",
      estado: "En revisión",
      porcentaje: null,
      comentarios: "Documentación completa, en proceso de evaluación."
    },
    {
      id: 2,
      categoria: "Deportiva",
      fechaEnvio: "2024-02-10",
      estado: "Aprobada",
      porcentaje: "25%",
      comentarios: "Felicitaciones, su postulación ha sido aprobada."
    },
    {
      id: 3,
      categoria: "Artística",
      fechaEnvio: "2024-01-20",
      estado: "Rechazada",
      porcentaje: null,
      comentarios: "No cumple con el requisito mínimo de IAA para esta categoría."
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprobada":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Rechazada":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "En revisión":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mis Postulaciones</CardTitle>
          <CardDescription>
            Revisa el estado de tus solicitudes de beca de excelencia
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tienes postulaciones registradas</p>
              <p className="text-sm text-muted-foreground mt-2">
                Dirígete a la pestaña "Postular" para crear tu primera solicitud
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app, index) => (
                <div key={app.id}>
                  <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-foreground">
                              Beca de {app.categoria}
                            </h3>
                            <Badge className={getStatusColor(app.estado)}>
                              {app.estado}
                            </Badge>
                            {app.porcentaje && (
                              <Badge variant="outline">
                                Cobertura: {app.porcentaje}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            Enviada el {new Date(app.fechaEnvio).toLocaleDateString('es-ES')}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {app.comentarios}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                          {app.estado === "Aprobada" && (
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Carta Compromiso
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {index < applications.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">3</div>
            <p className="text-sm text-muted-foreground">Total Postulaciones</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">1</div>
            <p className="text-sm text-muted-foreground">Aprobadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600">1</div>
            <p className="text-sm text-muted-foreground">En Revisión</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationsList;