import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Video, MapPin, Plus, RotateCcw } from "lucide-react";

const sesiones = [
  {
    id: 1,
    estudiante: "Carlos Rodríguez",
    fecha: "2024-01-22",
    hora: "10:00 AM",
    duracion: "60 min",
    tipo: "regular",
    modalidad: "presencial",
    ubicacion: "Oficina 301",
    estado: "confirmada"
  },
  {
    id: 2,
    estudiante: "Ana Martínez",
    fecha: "2024-01-22",
    hora: "2:00 PM",
    duracion: "45 min",
    tipo: "seguimiento",
    modalidad: "virtual",
    ubicacion: "Zoom",
    estado: "confirmada"
  },
  {
    id: 3,
    estudiante: "Luis Pérez",
    fecha: "2024-01-23",
    hora: "9:00 AM",
    duracion: "90 min",
    tipo: "urgente",
    modalidad: "presencial",
    ubicacion: "Oficina 301",
    estado: "pendiente"
  },
  {
    id: 4,
    estudiante: "María González",
    fecha: "2024-01-24",
    hora: "11:00 AM",
    duracion: "60 min",
    tipo: "regular",
    modalidad: "presencial",
    ubicacion: "Oficina 301",
    estado: "confirmada"
  },
  {
    id: 5,
    estudiante: "Sofía Torres",
    fecha: "2024-01-25",
    hora: "3:00 PM",
    duracion: "45 min",
    tipo: "seguimiento",
    modalidad: "virtual",
    ubicacion: "Teams",
    estado: "reagendar"
  }
];

const CalendarioMentoria = () => {
  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "regular":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "seguimiento":
        return "bg-green-100 text-green-700 border-green-200";
      case "urgente":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "confirmada":
        return "bg-green-50 border-green-200";
      case "pendiente":
        return "bg-yellow-50 border-yellow-200";
      case "reagendar":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const sesionesHoy = sesiones.filter(s => s.fecha === "2024-01-22");
  const proximasSesiones = sesiones.filter(s => s.fecha > "2024-01-22");

  return (
    <div className="space-y-6">
      {/* Header con estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sesiones Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-blue-600">{sesionesHoy.length}</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-green-600">{sesiones.length}</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-yellow-600">
              {sesiones.filter(s => s.estado === "pendiente").length}
            </span>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-red-600">
              {sesiones.filter(s => s.tipo === "urgente").length}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Botón para nueva sesión */}
      <div className="flex justify-end">
        <Button className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" />
          Agendar Nueva Sesión
        </Button>
      </div>

      {/* Sesiones de Hoy */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Sesiones de Hoy</span>
              </CardTitle>
              <CardDescription>Lunes, 22 de Enero 2024</CardDescription>
            </div>
            <Badge variant="secondary">
              {sesionesHoy.length} sesiones
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sesionesHoy.map(sesion => (
              <Card key={sesion.id} className={`${getEstadoColor(sesion.estado)}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {sesion.estudiante.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{sesion.estudiante}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{sesion.hora} ({sesion.duracion})</span>
                          </span>
                          {sesion.modalidad === "presencial" ? (
                            <span className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{sesion.ubicacion}</span>
                            </span>
                          ) : (
                            <span className="flex items-center space-x-1">
                              <Video className="h-4 w-4" />
                              <span>{sesion.ubicacion}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getTipoColor(sesion.tipo)}>
                        {sesion.tipo}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reagendar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Próximas Sesiones */}
      <Card>
        <CardHeader>
          <CardTitle>Próximas Sesiones</CardTitle>
          <CardDescription>Esta semana</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proximasSesiones.map(sesion => (
              <Card key={sesion.id} className={`${getEstadoColor(sesion.estado)}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {sesion.estudiante.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{sesion.estudiante}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{sesion.fecha}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{sesion.hora} ({sesion.duracion})</span>
                          </span>
                          {sesion.modalidad === "presencial" ? (
                            <span className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{sesion.ubicacion}</span>
                            </span>
                          ) : (
                            <span className="flex items-center space-x-1">
                              <Video className="h-4 w-4" />
                              <span>{sesion.ubicacion}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getTipoColor(sesion.tipo)}>
                        {sesion.tipo}
                      </Badge>
                      {sesion.estado === "reagendar" && (
                        <Button variant="outline" size="sm" className="text-red-600">
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Reagendar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarioMentoria;