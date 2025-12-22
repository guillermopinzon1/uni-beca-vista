import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { GraduationCap, LogOut, CheckCircle2, Clock, AlertCircle, FileCheck, Compass } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { verificarPostulacionesPorEmail, PostulacionPublicData } from "@/lib/api/postulacionesBecas";

const ModuleSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [postulaciones, setPostulaciones] = useState<PostulacionPublicData[]>([]);
  const [loadingPostulaciones, setLoadingPostulaciones] = useState(false);
  const [errorPostulaciones, setErrorPostulaciones] = useState<string | null>(null);

  // Check if user just registered
  const newRegistration = location.state?.newRegistration === true;
  const userEmail = location.state?.userEmail || user?.email;

  const handleLogout = () => {
    navigate("/");
  };

  // Verificar postulaciones al cargar la página (solo si hay email)
  useEffect(() => {
    const verificarPostulaciones = async () => {
      if (!userEmail) return;

      setLoadingPostulaciones(true);
      setErrorPostulaciones(null);

      try {
        console.log('📋 Verificando postulaciones para:', userEmail);
        const response = await verificarPostulacionesPorEmail(userEmail);

        console.log('✅ Postulaciones encontradas:', response.data);
        setPostulaciones(response.data || []);
      } catch (error) {
        console.log('ℹ️ No se encontraron postulaciones o error:', error);
        setPostulaciones([]);
        setErrorPostulaciones(null); // No mostrar error, simplemente no hay postulaciones
      } finally {
        setLoadingPostulaciones(false);
      }
    };

    verificarPostulaciones();
  }, [userEmail]);

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'aprobada':
      case 'aprobado':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'rechazada':
      case 'rechazado':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'pendiente':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'aprobada':
      case 'aprobado':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'rechazada':
      case 'rechazado':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <FileCheck className="h-5 w-5 text-gray-600" />;
    }
  };

  const modules = [
    {
      id: 1,
      title: "Gestión de Becas",
      description: "Centraliza la postulación, evaluación y seguimiento de todas las becas y ayudantías.",
      icon: GraduationCap,
      route: "/scholarship-programs",
      available: true
    },
    {
      id: 2,
      title: "Gestión de Orientación Vocacional",
      description: "Centraliza la realización, analisis y seguimiento de orientación vocacional.",
      icon: Compass,
      route: "/",
      available: true
    }
    // Future modules can be added here
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-orange/20 bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">Universidad Metropolitana</h1>
                <p className="text-sm text-muted-foreground">Sistema de Gestión de Becas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
            <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Volver al Inicio
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Success Message for New Registration */}
        {newRegistration && (
          <div className="max-w-3xl mx-auto mb-8">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                      ¡Registro Exitoso!
                    </h3>
                    <p className="text-green-800">
                      Tu cuenta ha sido creada correctamente.
                      {!loadingPostulaciones && postulaciones.length === 0 ? (
                        <> Si deseas postularte para una beca, entra en el módulo de <strong>Gestión de Becas</strong> a continuación.</>
                      ) : (
                        <> Puedes ver el estado de tu postulación en el módulo de <strong>Gestión de Becas</strong> a continuación.</>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {modules.map((module) => (
            <Card 
              key={module.id} 
              className="bg-gradient-card border-orange/20 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(module.route)}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                  <module.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">{module.title}</CardTitle>
                {module.description && (
                  <CardDescription className="text-muted-foreground">
                    {module.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="text-center pb-6">
                <Button 
                  className="bg-gradient-primary hover:opacity-90 w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(module.route);
                  }}
                >
                  Acceder
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Future modules placeholder */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-orange-accent/20 rounded-lg">
            <span className="text-sm text-muted-foreground">
              Más módulos estarán disponibles próximamente
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModuleSelection;