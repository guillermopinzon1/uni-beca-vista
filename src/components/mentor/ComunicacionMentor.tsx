import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageSquare, 
  Send, 
  Users, 
  Bell, 
  Mail,
  Phone,
  Calendar,
  Search,
  Filter
} from "lucide-react";

const conversaciones = [
  {
    id: 1,
    estudiante: "Carlos Rodríguez",
    ultimoMensaje: "Gracias por la sesión de hoy, me ayudó mucho con el plan de estudio",
    fechaUltimo: "2024-01-22 14:30",
    noLeidos: 0,
    estado: "activo"
  },
  {
    id: 2,
    estudiante: "Ana Martínez",
    ultimoMensaje: "¿Podemos reagendar la sesión de mañana?",
    fechaUltimo: "2024-01-22 10:15",
    noLeidos: 2,
    estado: "pendiente"
  },
  {
    id: 3,
    estudiante: "Luis Pérez",
    ultimoMensaje: "Necesito ayuda urgente con la situación académica",
    fechaUltimo: "2024-01-21 16:45",
    noLeidos: 3,
    estado: "urgente"
  }
];

const contactosDBBE = [
  {
    nombre: "Dra. Carmen Silva",
    cargo: "Directora DDBE",
    email: "c.silva@unimet.edu.ve",
    telefono: "+58 212 240-0611 ext. 2150",
    disponibilidad: "Lun-Vie 8:00-17:00"
  },
  {
    nombre: "Lic. Roberto Mendez",
    cargo: "Coordinador de Becas",
    email: "r.mendez@unimet.edu.ve",
    telefono: "+58 212 240-0611 ext. 2155",
    disponibilidad: "Lun-Vie 9:00-16:00"
  }
];

const plantillas = [
  {
    nombre: "Recordatorio de Sesión",
    asunto: "Recordatorio: Sesión de Mentoría Programada",
    contenido: "Estimado/a [NOMBRE], te recordamos que tienes una sesión de mentoría programada para [FECHA] a las [HORA]. Por favor confirma tu asistencia."
  },
  {
    nombre: "Seguimiento Post-Sesión",
    asunto: "Seguimiento de nuestra sesión de mentoría",
    contenido: "Hola [NOMBRE], espero que estés bien. Quería hacer seguimiento a los compromisos que acordamos en nuestra última sesión..."
  },
  {
    nombre: "Alerta Académica",
    asunto: "Importante: Revisión de tu situación académica",
    contenido: "Estimado/a [NOMBRE], hemos detectado que tu IAA está cerca del límite mínimo. Es importante que programemos una sesión urgente..."
  }
];

const ComunicacionMentor = () => {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "urgente":
        return "border-l-red-500 bg-red-50";
      case "pendiente":
        return "border-l-yellow-500 bg-yellow-50";
      default:
        return "border-l-blue-500 bg-blue-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas de comunicación */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Mensajes No Leídos</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-red-600">5</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recordatorios Enviados</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-blue-600">12</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Estudiantes Contactados</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-green-600">8</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Respuestas Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold text-yellow-600">3</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de Conversaciones */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Conversaciones</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Input placeholder="Buscar..." className="w-32" />
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {conversaciones.map(conversacion => (
              <Card key={conversacion.id} className={`cursor-pointer hover:shadow-md transition-shadow border-l-4 ${getEstadoColor(conversacion.estado)}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {conversacion.estudiante.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{conversacion.estudiante}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {conversacion.ultimoMensaje}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {conversacion.fechaUltimo}
                        </p>
                      </div>
                    </div>
                    {conversacion.noLeidos > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {conversacion.noLeidos}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Panel de Nuevo Mensaje */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Send className="h-5 w-5" />
              <span>Enviar Mensaje</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Destinatario</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estudiante(s)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Mensaje Individual</SelectItem>
                    <SelectItem value="grupo">Mensaje Grupal</SelectItem>
                    <SelectItem value="todos">Todos los Estudiantes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Plantilla</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Usar plantilla (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {plantillas.map((plantilla, index) => (
                      <SelectItem key={index} value={plantilla.nombre}>
                        {plantilla.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Asunto</label>
                <Input placeholder="Asunto del mensaje" />
              </div>
              
              <div>
                <label className="text-sm font-medium">Mensaje</label>
                <Textarea 
                  placeholder="Escriba su mensaje aquí..."
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Button className="flex-1 bg-gradient-primary">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Mensaje
                </Button>
                <Button variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Recordatorio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plantillas de Mensajes */}
      <Card>
        <CardHeader>
          <CardTitle>Plantillas de Mensajes</CardTitle>
          <CardDescription>
            Plantillas predefinidas para comunicaciones comunes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plantillas.map((plantilla, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">{plantilla.nombre}</h4>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                    {plantilla.contenido}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Usar Plantilla
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contactos DDBE */}
      <Card>
        <CardHeader>
          <CardTitle>Coordinación con DDBE</CardTitle>
          <CardDescription>
            Contacto directo con la Dirección de Desarrollo y Bienestar Estudiantil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contactosDBBE.map((contacto, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">{contacto.nombre}</h4>
                      <p className="text-sm text-muted-foreground">{contacto.cargo}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4" />
                        <span>{contacto.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4" />
                        <span>{contacto.telefono}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{contacto.disponibilidad}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Phone className="h-4 w-4 mr-1" />
                        Llamar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              Canal de Escalamiento
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Para casos que requieren intervención inmediata o decisiones administrativas
            </p>
            <Button variant="outline" className="w-full">
              Escalar Caso a DDBE
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComunicacionMentor;