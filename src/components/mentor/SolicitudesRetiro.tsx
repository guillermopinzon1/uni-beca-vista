import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Eye,
  Calendar
} from "lucide-react";

const solicitudes = [
  {
    id: 1,
    estudiante: "Luis Pérez",
    carrera: "Psicología",
    asignatura: "Estadística Aplicada",
    justificacion: "Dificultades familiares que afectan mi concentración en esta materia específica. Solicito retiro para poder enfocarme en el resto de materias y recuperar esta en el próximo período.",
    fechaSolicitud: "2024-01-20",
    fechaLimite: "2024-01-25",
    impactoCreditos: "Quedaría con 10 créditos (mínimo: 12)",
    historialeRetiros: 1,
    estado: "pendiente",
    urgente: true
  },
  {
    id: 2,
    estudiante: "Ana Martínez",
    carrera: "Administración",
    asignatura: "Matemáticas Financieras",
    justificacion: "La carga académica junto con mi situación laboral no me permite dedicar el tiempo necesario a esta materia. Prefiero retirarla para mantener un buen rendimiento en las demás.",
    fechaSolicitud: "2024-01-18",
    fechaLimite: "2024-01-23",
    impactoCreditos: "Quedaría con 12 créditos (cumple mínimo)",
    historialeRetiros: 0,
    estado: "pendiente",
    urgente: false
  },
  {
    id: 3,
    estudiante: "Sofía Torres",
    carrera: "Arquitectura",
    asignatura: "Diseño Estructural",
    justificacion: "Problemas de salud que requieren tratamiento médico intensivo durante las próximas semanas.",
    fechaSolicitud: "2024-01-15",
    fechaLimite: "2024-01-20",
    impactoCreditos: "Quedaría con 12 créditos (cumple mínimo)",
    historialeRetiros: 2,
    estado: "aprobada",
    urgente: false
  }
];

const SolicitudesRetiro = () => {
  const solicitudesPendientes = solicitudes.filter(s => s.estado === "pendiente");
  const solicitudesAprobadas = solicitudes.filter(s => s.estado === "aprobada");
  const solicitudesRechazadas = solicitudes.filter(s => s.estado === "rechazada");

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "aprobada":
        return "bg-green-100 text-green-700 border-green-200";
      case "rechazada":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const SolicitudCard = ({ solicitud }: { solicitud: any }) => (
    <Card className={`mb-4 ${solicitud.urgente ? 'border-red-300 bg-red-50' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>
                {solicitud.estudiante.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{solicitud.estudiante}</CardTitle>
              <CardDescription>{solicitud.carrera}</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {solicitud.urgente && (
              <Badge variant="destructive" className="animate-pulse">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Urgente
              </Badge>
            )}
            <Badge variant="outline" className={getEstadoColor(solicitud.estado)}>
              {solicitud.estado}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Asignatura a Retirar</h4>
            <p className="font-medium">{solicitud.asignatura}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Impacto en Créditos</h4>
            <p className={`font-medium ${
              solicitud.impactoCreditos.includes("mínimo: 12)") ? 'text-red-600' : 'text-green-600'
            }`}>
              {solicitud.impactoCreditos}
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-2">Justificación</h4>
          <p className="text-sm bg-gray-50 p-3 rounded-md">{solicitud.justificacion}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Solicitado: {solicitud.fechaSolicitud}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Límite: {solicitud.fechaLimite}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span>Retiros previos: {solicitud.historialeRetiros}</span>
          </div>
        </div>

        {solicitud.estado === "pendiente" && (
          <div className="pt-4 border-t">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Recomendación del Mentor</label>
                <Textarea 
                  placeholder="Escriba su recomendación y justificación para aprobar o rechazar esta solicitud..."
                  className="mt-1"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1 text-green-600 border-green-200 hover:bg-green-50">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Aprobar Retiro
                </Button>
                <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                  <XCircle className="h-4 w-4 mr-2" />
                  Rechazar Retiro
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Ver Perfil Completo
          </Button>
          <Button variant="outline" size="sm">
            Contactar Estudiante
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-500" />
              <span className="text-2xl font-bold">{solicitudesPendientes.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Aprobadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold">{solicitudesAprobadas.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Rechazadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <XCircle className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold">{solicitudesRechazadas.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Solicitudes Pendientes */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-semibold">Solicitudes Pendientes</h2>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
            {solicitudesPendientes.length}
          </Badge>
        </div>
        
        {solicitudesPendientes.length > 0 ? (
          <div>
            {solicitudesPendientes.map(solicitud => (
              <SolicitudCard key={solicitud.id} solicitud={solicitud} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay solicitudes pendientes</h3>
              <p className="text-muted-foreground">Todas las solicitudes han sido procesadas.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Solicitudes Procesadas */}
      {(solicitudesAprobadas.length > 0 || solicitudesRechazadas.length > 0) && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Historial de Solicitudes</h2>
          <div>
            {[...solicitudesAprobadas, ...solicitudesRechazadas].map(solicitud => (
              <SolicitudCard key={solicitud.id} solicitud={solicitud} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SolicitudesRetiro;