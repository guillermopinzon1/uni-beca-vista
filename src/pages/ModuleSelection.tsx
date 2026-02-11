import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { GraduationCap, LogOut, CheckCircle2, Compass, ArrowUp, ChevronRight, Star } from "lucide-react";
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

  const newRegistration = location.state?.newRegistration === true;
  const userEmail = location.state?.userEmail || user?.email;

  const handleLogout = () => {
    navigate("/");
  };

  useEffect(() => {
    const verificarPostulaciones = async () => {
      if (!userEmail) return;
      setLoadingPostulaciones(true);
      setErrorPostulaciones(null);
      try {
        const response = await verificarPostulacionesPorEmail(userEmail);
        setPostulaciones(response.data || []);
      } catch {
        setPostulaciones([]);
        setErrorPostulaciones(null);
      } finally {
        setLoadingPostulaciones(false);
      }
    };
    verificarPostulaciones();
  }, [userEmail]);

  const modules = [
    {
      id: 1,
      title: "Gestión de Becas",
      description: "Postula, da seguimiento a becas y ayudantías. Todo en un solo lugar.",
      icon: GraduationCap,
      route: "/scholarship-programs",
      available: true,
      accent: "from-primary/30 to-primary/10",
      bg: "bg-primary/5",
    },
    {
      id: 2,
      title: "Orientación Vocacional",
      description: "Realiza tests, conoce tu perfil y recibe recomendaciones de carreras.",
      icon: Compass,
      route: "/dashboard-aspirante",
      available: true,
      accent: "from-primary/25 to-primary/5",
      bg: "bg-orange-accent/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header - sin cambios */}
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

      {/* Contenido: estilo carrusel / módulos visuales */}
      <main className="container mx-auto px-4 py-8 pb-12">
        {/* Mensaje registro exitoso */}
        {newRegistration && (
          <div className="max-w-3xl mx-auto mb-8">
            <Card className="border-orange/20 bg-gradient-card">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">¡Registro Exitoso!</h3>
                    <p className="text-muted-foreground">
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

        {/* Intro + título (estilo referencia) */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 text-sm font-medium text-primary mb-3">
            <ArrowUp className="h-4 w-4" />
            <span className="uppercase tracking-wider">UNIMET</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground max-w-3xl mx-auto leading-tight mb-3">
            Becas, ayudantías y orientación vocacional en un solo lugar
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Elige el módulo con el que deseas continuar y accede a todas las herramientas.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-orange/20">
            <Star className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">La mejor forma de postularte y orientar tu carrera</span>
          </div>
        </div>

        {/* Carrusel horizontal de módulos */}
        <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth md:flex-wrap md:justify-center md:overflow-visible md:max-w-5xl md:mx-auto">
            {modules.map((module) => (
              <Card
                key={module.id}
                className={`flex-shrink-0 w-[min(100%,320px)] snap-center border-orange/20 bg-gradient-card hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden ${module.bg}`}
                onClick={() => navigate(module.route)}
              >
                {/* Zona superior tipo “imagen” con gradiente e icono */}
                <div className={`h-36 bg-gradient-to-br ${module.accent} flex items-center justify-center relative`}>
                  <module.icon className="h-16 w-16 text-primary/90 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardHeader className="pb-2 pt-5">
                  <CardTitle className="text-xl text-primary">{module.title}</CardTitle>
                  <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-6">
                  <Button
                    className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-medium gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(module.route);
                    }}
                  >
                    Acceder al módulo
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Nota inferior */}
        <div className="mt-10 text-center">
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
