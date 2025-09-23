import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";

const estudiantes = [
  {
    id: 1,
    nombre: "Carlos Rodríguez",
    carrera: "Ingeniería en Sistemas",
    iaa: 13.5,
    creditos: 15,
    ultimaSesion: "2024-01-15",
    proximaSesion: "2024-01-22",
    riesgo: "sin-riesgo",
    tendencia: "up"
  },
  {
    id: 2,
    nombre: "Ana Martínez",
    carrera: "Administración",
    iaa: 12.3,
    creditos: 12,
    ultimaSesion: "2024-01-10",
    proximaSesion: "2024-01-24",
    riesgo: "moderado",
    tendencia: "down"
  },
  {
    id: 3,
    nombre: "Luis Pérez",
    carrera: "Psicología",
    iaa: 11.8,
    creditos: 13,
    ultimaSesion: "2024-01-08",
    proximaSesion: "Pendiente",
    riesgo: "alto",
    tendencia: "down"
  },
  {
    id: 4,
    nombre: "María González",
    carrera: "Comunicación Social",
    iaa: 14.2,
    creditos: 14,
    ultimaSesion: "2024-01-18",
    proximaSesion: "2024-01-25",
    riesgo: "sin-riesgo",
    tendencia: "stable"
  },
  {
    id: 5,
    nombre: "Sofía Torres",
    carrera: "Arquitectura",
    iaa: 12.1,
    creditos: 15,
    ultimaSesion: "2024-01-12",
    proximaSesion: "2024-01-26",
    riesgo: "moderado",
    tendencia: "up"
  }
];

const ResumenEstudiantes = () => {
  const estudiantesSinRiesgo = estudiantes.filter(e => e.riesgo === "sin-riesgo");
  const estudiantesRiesgoModerado = estudiantes.filter(e => e.riesgo === "moderado");
  const estudiantesRiesgoAlto = estudiantes.filter(e => e.riesgo === "alto");

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRiesgoColor = (riesgo: string) => {
    switch (riesgo) {
      case "sin-riesgo":
        return "bg-green-50 border-green-200";
      case "moderado":
        return "bg-yellow-50 border-yellow-200";
      case "alto":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const EstudianteCard = ({ estudiante }: { estudiante: any }) => (
    <Card className={`mb-4 ${getRiesgoColor(estudiante.riesgo)}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={`/placeholder-avatar-${estudiante.id}.jpg`} />
              <AvatarFallback>
                {estudiante.nombre.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{estudiante.nombre}</h4>
              <p className="text-sm text-muted-foreground">{estudiante.carrera}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getTendenciaIcon(estudiante.tendencia)}
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              Ver Perfil
            </Button>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">IAA Actual:</span>
              <span className={`text-sm font-medium ${
                estudiante.iaa >= 13 ? 'text-green-600' : 
                estudiante.iaa >= 12 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {estudiante.iaa}/20
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Créditos:</span>
              <span className="text-sm font-medium">{estudiante.creditos}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Última sesión:</span>
              <span className="text-sm">{estudiante.ultimaSesion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Próxima sesión:</span>
              <span className={`text-sm ${
                estudiante.proximaSesion === 'Pendiente' ? 'text-red-600 font-medium' : ''
              }`}>
                {estudiante.proximaSesion}
              </span>
            </div>
          </div>
        </div>
        
        {estudiante.proximaSesion === 'Pendiente' && (
          <div className="mt-3 pt-3 border-t">
            <Button variant="outline" size="sm" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Agendar Sesión Urgente
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Sin Riesgo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold">{estudiantesSinRiesgo.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Riesgo Moderado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-500" />
              <span className="text-2xl font-bold">{estudiantesRiesgoModerado.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Riesgo Alto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <span className="text-2xl font-bold">{estudiantesRiesgoAlto.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kanban View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sin Riesgo */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold text-green-700">Sin Riesgo</h3>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {estudiantesSinRiesgo.length}
            </Badge>
          </div>
          {estudiantesSinRiesgo.map(estudiante => (
            <EstudianteCard key={estudiante.id} estudiante={estudiante} />
          ))}
        </div>

        {/* Riesgo Moderado */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-yellow-700">Riesgo Moderado</h3>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
              {estudiantesRiesgoModerado.length}
            </Badge>
          </div>
          {estudiantesRiesgoModerado.map(estudiante => (
            <EstudianteCard key={estudiante.id} estudiante={estudiante} />
          ))}
        </div>

        {/* Riesgo Alto */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold text-red-700">Riesgo Alto</h3>
            <Badge variant="secondary" className="bg-red-100 text-red-700">
              {estudiantesRiesgoAlto.length}
            </Badge>
          </div>
          {estudiantesRiesgoAlto.map(estudiante => (
            <EstudianteCard key={estudiante.id} estudiante={estudiante} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumenEstudiantes;