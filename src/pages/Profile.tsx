import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchProfile } from "@/lib/api";
import { 
  GraduationCap, 
  LogOut, 
  User, 
  ArrowLeft, 
  Mail, 
  Phone, 
  CreditCard, 
  Calendar,
  UserCheck,
  Clock
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { tokens, logoutAndNavigateHome } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<null | {
    id: string;
    email: string;
    nombre: string;
    apellido?: string;
    telefono?: string;
    cedula?: string;
    role: string;
    carrera?: string | null;
    semestre?: number | null;
    activo: boolean;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  }>(null);

  const handleLogout = () => {
    logoutAndNavigateHome();
  };

  useEffect(() => {
    const run = async () => {
      const stored = (() => { try { return JSON.parse(localStorage.getItem('auth_tokens') || 'null'); } catch { return null; } })();
      const accessToken = tokens?.accessToken || stored?.accessToken;
      if (!accessToken) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetchProfile(accessToken);
        setProfile(res.data);
      } catch (e: any) {
        setError(e?.message || 'No se pudo cargar el perfil');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [tokens?.accessToken]);

  const userData = useMemo(() => {
    return {
      id: profile?.id || '-',
      nombre: profile?.nombre || '-',
      apellido: profile?.apellido || '-',
      cedula: profile?.cedula || '-',
      telefono: profile?.telefono || '-',
      email: profile?.email || '-',
      tipo_usuario: profile?.role || '-',
      activo: profile?.activo ?? false,
      ultimo_acceso: profile?.updatedAt || new Date().toISOString(),
      creado_en: profile?.createdAt || new Date().toISOString(),
      actualizado_en: profile?.updatedAt || new Date().toISOString(),
    };
  }, [profile]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-orange/20 bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </Button>
              <GraduationCap className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">Universidad Metropolitana</h1>
                <p className="text-sm text-muted-foreground">Perfil de Usuario</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-foreground">{userData.nombre} {userData.apellido}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Mi Perfil</h2>
            <p className="text-muted-foreground">Información personal y detalles de la cuenta</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Summary Card */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-card border-orange/20">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-6 bg-primary/10 rounded-full w-fit">
                    <User className="h-16 w-16 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-foreground">
                    {userData.nombre} {userData.apellido}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground capitalize">
                    {userData.tipo_usuario}
                  </CardDescription>
                  <div className="flex items-center justify-center mt-2">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      userData.activo 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      <UserCheck className="h-3 w-3 mr-1" />
                      {userData.activo ? 'Activo' : 'Inactivo'}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Personal Information */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-card border-orange/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <User className="h-5 w-5 text-primary" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Cédula</label>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{userData.cedula}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">ID Usuario</label>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground text-xs">{userData.id}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{userData.email}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{userData.telefono}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Details */}
            <div className="lg:col-span-3">
              <Card className="bg-gradient-card border-orange/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Clock className="h-5 w-5 text-primary" />
                    Detalles de la Cuenta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Fecha de Registro</label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{formatDate(userData.creado_en)}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Último Acceso</label>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{formatDate(userData.ultimo_acceso)}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Última Actualización</label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{formatDate(userData.actualizado_en)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-center">
            <Button 
              onClick={() => navigate(-1)}
              className="bg-gradient-primary hover:opacity-90"
            >
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;