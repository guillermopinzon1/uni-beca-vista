import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { obtenerSupervisorCompleto, type SupervisorCompleto, type PlazaAsignada } from "@/lib/api/supervisor";
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  Calendar,
  MapPin,
  BookOpen,
  RefreshCw,
  Clock,
  Shield
} from "lucide-react";

const PerfilSupervisor = () => {
  const { user, tokens } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [supervisorData, setSupervisorData] = useState<SupervisorCompleto | null>(null);

  useEffect(() => {
    loadProfileData();
  }, [user?.id]);

  const loadProfileData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      // Cargar datos completos del supervisor con plazas y estadísticas
      const supervisorResponse = await obtenerSupervisorCompleto(accessToken, user.id);
      setSupervisorData(supervisorResponse.data);
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo cargar el perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mr-3" />
          <span className="text-muted-foreground">Cargando perfil...</span>
        </CardContent>
      </Card>
    );
  }

  if (!supervisorData) {
    return (
      <Card>
        <CardContent className="text-center py-12 text-muted-foreground">
          No se pudo cargar la información del perfil
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Información Personal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Información Personal
          </CardTitle>
          <CardDescription>
            Datos personales del supervisor laboral
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={supervisorData.nombre}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                value={supervisorData.apellido || ''}
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cedula" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Cédula de Identidad
              </Label>
              <Input
                id="cedula"
                value={supervisorData.cedula || 'No registrado'}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Correo Electrónico
              </Label>
              <Input
                id="email"
                value={supervisorData.email}
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Teléfono
            </Label>
            <Input
              id="telefono"
              value={supervisorData.telefono || 'No registrado'}
              disabled
              className="bg-muted"
            />
          </div>
        </CardContent>
      </Card>

      {/* Información Laboral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Información Laboral
          </CardTitle>
          <CardDescription>
            Información sobre tu rol y ubicación en la universidad
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="departamento" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Departamento
              </Label>
              <Input
                id="departamento"
                value={supervisorData.departamento || 'No asignado'}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cargo" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Cargo
              </Label>
              <Input
                id="cargo"
                value={supervisorData.cargo || 'No asignado'}
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rol en el Sistema</Label>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-orange/30 text-orange-600">
                  {supervisorData.role}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Estado de la Cuenta</Label>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={supervisorData.activo
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"}
                >
                  {supervisorData.activo ? 'Activo' : 'Inactivo'}
                </Badge>
                <Badge
                  variant="outline"
                  className={supervisorData.emailVerified
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-yellow-200 bg-yellow-50 text-yellow-700"}
                >
                  {supervisorData.emailVerified ? 'Email Verificado' : 'Email Pendiente'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plazas Asignadas */}
      {supervisorData.plazasAsignadas && supervisorData.plazasAsignadas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Plazas Asignadas
            </CardTitle>
            <CardDescription>
              Plazas de ayudantía bajo tu supervisión
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supervisorData.plazasAsignadas.map((plaza) => (
                <Card key={plaza.id} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          {plaza.nombre}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {plaza.tipoAyudantia}
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className={plaza.activa
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-gray-200 bg-gray-50 text-gray-700"}
                      >
                        {plaza.activa ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Ubicación</p>
                          <p className="font-medium">{plaza.ubicacion}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{plaza.horasSemana}h/semana</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {plaza.tipoAyudantia === 'academica' ? 'Académica' :
                         plaza.tipoAyudantia === 'administrativa' ? 'Administrativa' :
                         'Investigación'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sin Plazas Asignadas */}
      {supervisorData.plazasAsignadas && supervisorData.plazasAsignadas.length === 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex items-start gap-3 p-4">
            <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Sin Plazas Asignadas</p>
              <p className="text-sm text-blue-700 mt-1">
                Actualmente no tienes plazas de ayudantía asignadas. Contacta al administrador del sistema si necesitas supervisar plazas.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información de Cuenta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Información de la Cuenta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Cuenta Creada</Label>
              <p className="text-sm font-medium">{formatDate(supervisorData.createdAt)}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Última Actualización</Label>
              <p className="text-sm font-medium">{formatDate(supervisorData.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerfilSupervisor;
