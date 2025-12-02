import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import UnifiedApplicationForm from "@/components/shared/UnifiedApplicationForm";
import {
  Trophy,
  Users,
  BookOpen,
  Home,
  LogOut,
  CheckCircle2
} from "lucide-react";
import ProgramaExcelenciaTabs from "@/components/excelencia/ProgramaExcelenciaTabs";
import { API_BASE } from "@/lib/api";

const PostRegisterApplication = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, tokens } = useAuth();
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState<Array<any>>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasExistingPostulacion, setHasExistingPostulacion] = useState(false);

  // Check if user was redirected here with hasPostulacion flag
  const hasPostulacion = location.state?.hasPostulacion === true;

  const handleLogout = async () => {
    await logout(() => navigate('/'));
  };

  const handleProgramSelect = (programId: string) => {
    setSelectedProgram(programId);
  };

  const handleBackToPrograms = () => {
    setSelectedProgram(null);
  };

  const programs = [
    {
      id: "excelencia",
      title: "Programa de Excelencia",
      description: "Para estudiantes destacados en diferentes áreas: académica, deportiva, artística, emprendimiento y compromiso cívico.",
      icon: Trophy
    },
    {
      id: "formacion",
      title: "Beca de Formación Docente",
      description: "Para estudiantes interesados en la carrera docente y formación pedagógica.",
      icon: BookOpen
    },
    {
      id: "ayudantia",
      title: "Programa de Ayudantía",
      description: "Para estudiantes que deseen trabajar como ayudantes académicos o de investigación en la universidad.",
      icon: Users
    }
  ];

  // Cargar configuraciones de becas
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch(`${API_BASE}/v1/configuracion/becas`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        const payload = await resp.json();
        if (!resp.ok) throw new Error(payload?.message || 'No se pudieron cargar las configuraciones');
        setConfigs(Array.isArray(payload?.data?.configuraciones) ? payload.data.configuraciones : []);
      } catch (e: any) {
        setError(e?.message || 'No se pudieron cargar las configuraciones');
        setConfigs([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const getConfigsByProgram = (programId: string | null) => {
    if (!programId) return [] as any[];
    if (programId === 'excelencia') {
      return configs.filter(c => (c.tipoBeca || '').toLowerCase() === 'excelencia');
    }
    if (programId === 'ayudantia') {
      return configs.filter(c => (c.tipoBeca || '').toLowerCase() === 'ayudantía' || (c.tipoBeca || '').toLowerCase() === 'ayudantia');
    }
    if (programId === 'formacion') {
      return configs.filter(c => (c.tipoBeca || '').toLowerCase().includes('formación') || (c.tipoBeca || '').toLowerCase().includes('formacion'));
    }
    return [] as any[];
  };

  const selectedConfigs = useMemo(() => getConfigsByProgram(selectedProgram), [configs, selectedProgram]);

  // If user has existing postulacion, show success message
  if (hasPostulacion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-green-200 shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 p-4 rounded-full bg-green-100 w-fit">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-green-700 mb-2">
              ¡Cuenta Asociada Exitosamente!
            </CardTitle>
            <CardDescription className="text-lg">
              Tu cuenta se ha vinculado con tu postulación existente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3 text-lg">Estado de tu Postulación</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                  <p className="text-blue-800">Tu postulación está siendo revisada por nuestro equipo</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                  <p className="text-blue-800">Recibirás un correo electrónico con la respuesta</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                  <p className="text-blue-800">El tiempo de respuesta es de 5 a 10 días hábiles</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Importante:</strong> Mantente atento a tu correo electrónico para recibir actualizaciones sobre tu postulación.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => navigate('/login')}
                className="flex-1 bg-gradient-primary hover:opacity-90"
              >
                Ir a Iniciar Sesión
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="flex-1"
              >
                Volver al Inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedProgram) {
    const program = programs.find(p => p.id === selectedProgram);
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-orange/20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <img
                  src="/lovable-uploads/8f3cd009-b095-4b62-9526-09516381421e.png"
                  alt="Universidad Metropolitana"
                  className="h-10"
                />
                <div>
                  <h1 className="font-semibold text-primary">Universidad Metropolitana</h1>
                  <p className="text-sm text-muted-foreground">Completa tu Postulación</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Ir a Iniciar Sesión
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate("/")} className="cursor-pointer">
                  <Home className="h-4 w-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink onClick={handleBackToPrograms} className="cursor-pointer">
                  Postulación
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{program?.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Info Banner */}
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <p className="text-sm text-blue-800">
                <strong>¡Bienvenido!</strong> Algunos de tus datos ya están pre-llenados desde tu registro. Solo completa la información adicional requerida.
              </p>
            </CardContent>
          </Card>

          {/* Mostrar requisitos arriba del formulario para Ayudantía y Formación */}
          {selectedProgram !== "excelencia" && selectedConfigs.length > 0 && (
            <Card className="mb-6 border-0 shadow-lg w-full">
              <CardContent className="p-6">
                {selectedConfigs.map((config: any, idx: number) => (
                  <div key={config.id || idx} className="space-y-4">
                    <div className="bg-white border border-gray-200 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Requisitos Especiales</h3>
                      <p className="text-sm text-muted-foreground">{config.requisitosEspeciales || 'No tiene ningún requisito'}</p>
                    </div>

                    <div className="bg-white border border-gray-200 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3">Documentos Requeridos</h3>
                      {Array.isArray(config.documentosRequeridos) && config.documentosRequeridos.length > 0 ? (
                        <ul className="space-y-2">
                          {config.documentosRequeridos.map((doc: string, i: number) => (
                            <li key={i} className="flex items-center text-sm">
                              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                              {doc}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No tiene ningún requisito</p>
                      )}
                    </div>

                    {(config.promedioMinimo !== undefined || config.semestreMinimo && config.semestreMaximo || config.edadMaxima) && (
                      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Requisitos Académicos</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {config.promedioMinimo !== undefined && (
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              <span>Promedio mínimo: {config.promedioMinimo}</span>
                            </div>
                          )}
                          {config.semestreMinimo && config.semestreMaximo && (
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              <span>Semestre: {config.semestreMinimo} - {config.semestreMaximo}</span>
                            </div>
                          )}
                          {config.edadMaxima && (
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              <span>Edad máxima: {config.edadMaxima} años</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Application Form */}
          {selectedProgram === "excelencia" ? (
            <ProgramaExcelenciaTabs
              configuraciones={configs.filter(c => (c.tipoBeca || '').toLowerCase() === 'excelencia')}
            />
          ) : (
            <UnifiedApplicationForm
              programTitle={program?.title || ""}
              requiredDocuments={Array.from(new Set((selectedConfigs || []).flatMap((c: any) => Array.isArray(c.documentosRequeridos) ? c.documentosRequeridos : [])))}
              preFillUserData={true}
            />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-orange/20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img
                src="/lovable-uploads/8f3cd009-b095-4b62-9526-09516381421e.png"
                alt="Universidad Metropolitana"
                className="h-10"
              />
              <div>
                <h1 className="font-semibold text-primary">Universidad Metropolitana</h1>
                <p className="text-sm text-muted-foreground">Completa tu Postulación</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Ir a Iniciar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate("/")} className="cursor-pointer">
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Completa tu Postulación</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 p-3 rounded-full bg-green-100 w-fit">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-4">
            ¡Registro Exitoso!
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-2">
            Ahora completa tu postulación a un programa de becas
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Tus datos personales ya están guardados, solo necesitas completar la información adicional
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
          {programs.map((program) => (
            <Card
              key={program.id}
              className="border-orange/20 bg-gradient-card hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col"
            >
              <CardHeader className="text-center">
                <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <program.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-primary">{program.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center flex flex-col flex-1">
                <CardDescription className="mb-6 min-h-[6rem] flex items-center justify-center">
                  {program.description}
                </CardDescription>

                <Button
                  onClick={() => handleProgramSelect(program.id)}
                  className="w-full mt-auto"
                >
                  Postular Ahora
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skip Option */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => navigate('/login')}
            className="text-muted-foreground"
          >
            Saltar por ahora e ir a iniciar sesión
          </Button>
        </div>
      </main>
    </div>
  );
};

export default PostRegisterApplication;
