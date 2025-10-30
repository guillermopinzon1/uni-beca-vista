import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  ArrowLeft
} from "lucide-react";
import ProgramaExcelenciaTabs from "@/components/excelencia/ProgramaExcelenciaTabs";
import { API_BASE } from "@/lib/api";

const PostulacionesBecas = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState<Array<any>>([]);
  const [error, setError] = useState<string | null>(null);

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
                  <p className="text-sm text-muted-foreground">Sistema de Postulaciones a Becas</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Volver al Inicio
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
                  Postulaciones a Becas
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{program?.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>


          {/* Mostrar requisitos arriba del formulario para Ayudantía y Formación */}
          {selectedProgram !== "excelencia" && selectedConfigs.length > 0 && (
            <Card className="mb-6 border-0 shadow-lg w-full">
              <CardContent className="p-6">
                {selectedConfigs.map((config: any, idx: number) => (
                  <div key={config.id || idx} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Cupos Disponibles</p>
                        <p className="text-2xl font-bold text-primary">{config.cuposDisponibles ?? '-'}</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Promedio Mínimo</p>
                        <p className="text-2xl font-bold text-primary">{config.promedioMinimo ?? '-'}</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Duración</p>
                        <p className="text-2xl font-bold text-primary">{config.duracionMeses ?? '-'} meses</p>
                      </div>
                    </div>
                    
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
                    
                    {config.semestreMinimo && config.semestreMaximo && (
                      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Requisitos Académicos</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            <span>Semestre: {config.semestreMinimo} - {config.semestreMaximo}</span>
                          </div>
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
            <ProgramaExcelenciaTabs configuraciones={configs.filter(c => (c.tipoBeca || '').toLowerCase() === 'excelencia')} />
          ) : (
            <UnifiedApplicationForm programTitle={program?.title || ""} />
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
                <p className="text-sm text-muted-foreground">Sistema de Postulaciones a Becas</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Volver al Inicio
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
              <BreadcrumbPage>Postulaciones a Becas</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Postulaciones a Becas
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explora y postúlate a los diferentes programas de becas disponibles en la Universidad Metropolitana
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

      </main>
    </div>
  );
};

export default PostulacionesBecas;