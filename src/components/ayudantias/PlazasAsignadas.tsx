import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, MapPin, Clock, Users, RefreshCw, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { fetchPlazas } from "@/lib/api";

interface Plaza {
  id: string;
  materia: string;
  codigo: string;
  departamento: string;
  ubicacion: string;
  profesor: string;
  capacidad: number;
  ocupadas: number;
  horario: Array<{
    dia: string;
    horaInicio: string;
    horaFin: string;
  }>;
  estado: string;
  tipoAyudantia: string;
  descripcionActividades: string;
  requisitosEspeciales: string[];
  horasSemana: number;
  periodoAcademico: string;
  fechaInicio: string;
  fechaFin: string;
  supervisorResponsable: string;
  supervisor?: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    departamento: string;
  };
  observaciones?: string;
  disponibilidad?: string;
  plazasDisponibles?: number;
  porcentajeOcupacion?: number;
  estudiantesAsignados?: Array<{
    id: string;
    usuarioId: string;
    estado: string;
    horasRequeridas: number;
    horasCompletadas: number;
    periodoInicio: string;
    fechaAsignacion: string;
    usuario: {
      nombre: string;
      apellido: string;
      email: string;
      carrera: string;
      trimestre: number;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

const PlazasAsignadas = () => {
  const { tokens, user } = useAuth();
  const { toast } = useToast();
  const [plazas, setPlazas] = useState<Plaza[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPlazas = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken || !user?.id) {
      toast({
        title: 'Sin sesión',
        description: 'Inicia sesión para cargar plazas',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetchPlazas(accessToken);
      const allPlazas = response.data.plazas;
      
      // Filtrar solo las plazas donde el usuario actual es el supervisor responsable
      const plazasAsignadas = allPlazas.filter(plaza => 
        plaza.supervisorResponsable === user.id
      );
      
      setPlazas(plazasAsignadas);
    } catch (error: any) {
      console.error('Error loading plazas:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudieron cargar las plazas',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlazas();
  }, [tokens?.accessToken, user?.id]);

  const formatHorario = (horario: Array<{dia: string, horaInicio: string, horaFin: string}>) => {
    return horario.map(h => `${h.dia}: ${h.horaInicio} - ${h.horaFin}`).join(', ');
  };

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'Activa': 'default',
      'Inactiva': 'secondary',
      'Completa': 'outline',
      'Cancelada': 'destructive'
    };
    return variants[estado] || 'outline';
  };

  const getTipoAyudantiaBadge = (tipo: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'academica': 'default',
      'investigacion': 'secondary',
      'administrativa': 'outline'
    };
    return variants[tipo] || 'outline';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Plazas Asignadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            Cargando plazas...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (plazas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Plazas Asignadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No tienes plazas asignadas</h3>
            <p className="text-muted-foreground mb-4">
              No se encontraron plazas donde seas el supervisor responsable.
            </p>
            <Button onClick={loadPlazas} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Recargar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Plazas Asignadas ({plazas.length})
          </CardTitle>
          <Button onClick={loadPlazas} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Recargar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {plazas.map((plaza) => (
            <Card key={plaza.id} className="border-l-4 border-l-primary">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Información básica */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{plaza.materia}</h3>
                      <Badge variant={getEstadoBadge(plaza.estado)}>
                        {plaza.estado}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Código:</strong> {plaza.codigo}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Profesor:</strong> {plaza.profesor}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Departamento:</strong> {plaza.departamento}
                    </p>
                  </div>

                  {/* Ubicación y horario */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Ubicación</p>
                        <p className="text-sm text-muted-foreground">{plaza.ubicacion}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Horario</p>
                        <p className="text-sm text-muted-foreground">
                          {formatHorario(plaza.horario)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Capacidad y tipo */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Capacidad</p>
                        <p className="text-sm text-muted-foreground">
                          {plaza.ocupadas}/{plaza.capacidad} estudiantes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getTipoAyudantiaBadge(plaza.tipoAyudantia)}>
                        {plaza.tipoAyudantia}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {plaza.horasSemana}h/semana
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Período:</strong> {plaza.periodoAcademico}
                    </p>
                  </div>
                </div>

                {/* Descripción y requisitos */}
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Descripción de Actividades</p>
                    <p className="text-sm text-muted-foreground">{plaza.descripcionActividades}</p>
                  </div>
                  
                  {plaza.requisitosEspeciales && plaza.requisitosEspeciales.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Requisitos Especiales</p>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        {plaza.requisitosEspeciales.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {plaza.observaciones && (
                    <div>
                      <p className="text-sm font-medium mb-1">Observaciones</p>
                      <p className="text-sm text-muted-foreground">{plaza.observaciones}</p>
                    </div>
                  )}
                </div>

                {/* Fechas */}
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Fecha de Inicio</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(plaza.fechaInicio).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Fecha de Fin</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(plaza.fechaFin).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Estudiantes asignados */}
                {plaza.estudiantesAsignados && plaza.estudiantesAsignados.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Estudiantes Asignados</p>
                    <div className="space-y-2">
                      {plaza.estudiantesAsignados.map((estudiante) => (
                        <div key={estudiante.id} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div>
                            <p className="text-sm font-medium">
                              {estudiante.usuario.nombre} {estudiante.usuario.apellido}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {estudiante.usuario.email} • {estudiante.usuario.carrera} - {estudiante.usuario.trimestre}° trimestre
                            </p>
                          </div>
                          <Badge variant="outline">
                            {estudiante.estado}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlazasAsignadas;
