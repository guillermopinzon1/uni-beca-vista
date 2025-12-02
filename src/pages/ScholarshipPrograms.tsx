import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, LogOut, ChevronRight, Home, ArrowLeft, Trophy, BookOpen, Users, Target, Award, CreditCard, FileCheck, Clock, CheckCircle, XCircle, AlertCircle, Calendar } from "lucide-react";
import PasanteAyudantiasModules from "./PasanteAyudantiasModules";
import AspiranteScholarshipPrograms from "./AspiranteScholarshipPrograms";
import ModuleCard from "@/components/ModuleCard";
import { API_BASE } from "@/lib/api";
import ProgramaExcelenciaTabs from "@/components/excelencia/ProgramaExcelenciaTabs";
import UnifiedApplicationForm from "@/components/shared/UnifiedApplicationForm";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { verificarPostulacionesPorEmail, PostulacionPublicData } from "@/lib/api/postulacionesBecas";

const ScholarshipPrograms = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [userRole, setUserRole] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState<Array<any>>([]);
  const [error, setError] = useState<string | null>(null);
  const [postulaciones, setPostulaciones] = useState<PostulacionPublicData[]>([]);
  const [loadingPostulaciones, setLoadingPostulaciones] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "supervisor";
    setUserRole(role);
  }, []);

  // Cargar postulaciones del usuario
  useEffect(() => {
    const loadPostulaciones = async () => {
      if (!user?.email) return;

      setLoadingPostulaciones(true);
      try {
        const response = await verificarPostulacionesPorEmail(user.email);
        setPostulaciones(response.data || []);
      } catch (error) {
        console.error("Error cargando postulaciones:", error);
        setPostulaciones([]);
      } finally {
        setLoadingPostulaciones(false);
      }
    };

    loadPostulaciones();
  }, [user?.email]);

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

  // Show role-specific views
  if (userRole === "estudiante") {
    return <PasanteAyudantiasModules />;
  }

  if (userRole === "aspirante") {
    return <AspiranteScholarshipPrograms />;
  }

  const handleLogout = async () => {
    await logout(() => navigate('/'));
  };

  const handleProgramSelect = (programId: string) => {
    setSelectedProgram(programId);
  };

  const handleBackToPrograms = () => {
    setSelectedProgram(null);
  };

  // Módulos de información de los programas
  const infoModules = [
    {
      id: 2,
      title: "Impacto",
      description: "Programa de becas orientado al desarrollo de proyectos de impacto social y comunitario.",
      icon: Target,
      route: "/impacto",
      available: true
    },
    {
      id: 3,
      title: "Excelencia",
      description: "Reconocimiento al mérito académico excepcional y trayectoria estudiantil destacada.",
      icon: Award,
      route: "/excelencia",
      available: true
    },
    {
      id: 5,
      title: "Exoneración de Matrícula",
      description: "Programa de exoneración total o parcial de costos de matrícula para estudiantes destacados.",
      icon: CreditCard,
      route: "/exoneracion",
      available: true
    },
    {
      id: 6,
      title: "Formación Docente",
      description: "Beca para la profesionalización de docentes en ejercicio.",
      icon: BookOpen,
      route: "/formacion-docente",
      available: true
    },
    {
      id: 7,
      title: "Ayudantías",
      description: "Programa de ayudantías académicas y de investigación para estudiantes.",
      icon: Users,
      route: "/ayudantias",
      available: true
    }
  ];


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

  // Si se seleccionó un programa, mostrar el formulario
  if (selectedProgram) {
    const programTitles: Record<string, string> = {
      'excelencia': 'Programa de Excelencia',
      'formacion': 'Beca de Formación Docente',
      'ayudantia': 'Programa de Ayudantía'
    };
    const program = { id: selectedProgram, title: programTitles[selectedProgram] };
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
                              <span>Trimestre: {config.semestreMinimo} - {config.semestreMaximo}</span>
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
            <ProgramaExcelenciaTabs configuraciones={configs.filter(c => (c.tipoBeca || '').toLowerCase() === 'excelencia')} />
          ) : (
            <UnifiedApplicationForm
              programTitle={program?.title || ""}
              requiredDocuments={Array.from(new Set((selectedConfigs || []).flatMap((c: any) => Array.isArray(c.documentosRequeridos) ? c.documentosRequeridos : [])))}
            />
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-orange/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/modules')}
              className="text-primary hover:text-primary/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Universidad Metropolitana</h1>
              <p className="text-sm text-muted-foreground">Sistema de Gestión de Becas</p>
            </div>
          </div>

          {/* Logo en el centro */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img
              src="/450.jpg"
              alt="UNIMET Logo"
              className="h-12 object-contain"
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* Removed welcome text */}
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
      </header>

      {/* Breadcrumbs */}
      <div className="border-b border-orange/10 bg-card/50">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/modules")}
              className="p-0 h-auto text-muted-foreground hover:text-primary"
            >
              <Home className="h-4 w-4 mr-1" />
              Inicio
            </Button>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">Gestión de Becas</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Sección de Información de Programas */}
        <div className="mb-12">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">Programas de Becas</h2>
            <p className="text-muted-foreground">Selecciona el programa de becas que te interesa</p>
          </div>

          {/* Programs Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {infoModules.map((program) => {
              // Determinar si este programa tiene opción de postular
              const hasPostulacion = program.id === 3 || program.id === 6 || program.id === 7; // Excelencia, Formación Docente, Ayudantías
              const programMapping: Record<number, string> = {
                3: 'excelencia',
                6: 'formacion',
                7: 'ayudantia'
              };
              const programId = programMapping[program.id];

              // Verificar si el usuario ya tiene postulación para este programa
              const tienePostulacion = hasPostulacion && postulaciones.some(p => {
                const tipoBeca = p.tipoBeca.toLowerCase();
                if (programId === 'excelencia') return tipoBeca.includes('excelencia');
                if (programId === 'formacion') return tipoBeca.includes('formación') || tipoBeca.includes('formacion') || tipoBeca.includes('docente');
                if (programId === 'ayudantia') return tipoBeca.includes('ayudantía') || tipoBeca.includes('ayudantia');
                return false;
              });

              return (
                <Card
                  key={program.id}
                  className={`bg-gradient-card border-orange/20 hover:shadow-lg transition-all duration-300 group ${program.available ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'}`}
                  onClick={() => program.available && navigate(program.route)}
                >
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                      <program.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-foreground">{program.title}</CardTitle>
                    {program.description && (
                      <CardDescription className="text-muted-foreground">
                        {program.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="text-center pb-6 space-y-3">
                    <Button
                      className="bg-gradient-primary hover:opacity-90 w-full"
                      disabled={!program.available}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (program.available) navigate(program.route);
                      }}
                    >
                      {program.available ? "Acceder" : "Próximamente"}
                    </Button>

                    {/* Botón de Postular Ahora - Solo para Excelencia, Formación Docente y Ayudantías */}
                    {hasPostulacion && !tienePostulacion && !loadingPostulaciones && (
                      <Button
                        variant="outline"
                        className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProgramSelect(programId);
                        }}
                      >
                        Postular Ahora
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Sección de Estado de Postulaciones - Diseño mejorado */}
          {!loadingPostulaciones && postulaciones.length > 0 && (
            <div className="mb-12 max-w-6xl mx-auto">
              <div className="relative">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl opacity-50"></div>

                <div className="relative bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-2xl p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                      <FileCheck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Estado de tus Postulaciones</h3>
                      <p className="text-sm text-gray-600">Seguimiento en tiempo real de tus solicitudes</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {postulaciones.map((postulacion) => {
                      const getEstadoConfig = (estado: string) => {
                        switch (estado.toLowerCase()) {
                          case 'aprobada':
                            return {
                              icon: <CheckCircle className="h-6 w-6" />,
                              color: 'from-green-500 to-emerald-600',
                              bg: 'bg-green-50',
                              border: 'border-green-200',
                              text: 'text-green-700',
                              badgeClass: 'bg-green-100 text-green-700 border-green-300'
                            };
                          case 'rechazada':
                            return {
                              icon: <XCircle className="h-6 w-6" />,
                              color: 'from-red-500 to-rose-600',
                              bg: 'bg-red-50',
                              border: 'border-red-200',
                              text: 'text-red-700',
                              badgeClass: 'bg-red-100 text-red-700 border-red-300'
                            };
                          case 'en revisión':
                          case 'en revision':
                            return {
                              icon: <Clock className="h-6 w-6" />,
                              color: 'from-yellow-500 to-amber-600',
                              bg: 'bg-yellow-50',
                              border: 'border-yellow-200',
                              text: 'text-yellow-700',
                              badgeClass: 'bg-yellow-100 text-yellow-700 border-yellow-300'
                            };
                          case 'pendiente':
                          default:
                            return {
                              icon: <AlertCircle className="h-6 w-6" />,
                              color: 'from-blue-500 to-indigo-600',
                              bg: 'bg-blue-50',
                              border: 'border-blue-200',
                              text: 'text-blue-700',
                              badgeClass: 'bg-blue-100 text-blue-700 border-blue-300'
                            };
                        }
                      };

                      const estadoConfig = getEstadoConfig(postulacion.estado);

                      return (
                        <Card key={postulacion.id} className={`${estadoConfig.border} ${estadoConfig.bg} hover:shadow-lg transition-all duration-300 overflow-hidden group`}>
                          <div className={`h-2 bg-gradient-to-r ${estadoConfig.color}`}></div>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 bg-gradient-to-br ${estadoConfig.color} rounded-lg shadow-md text-white`}>
                                  {estadoConfig.icon}
                                </div>
                                <div>
                                  <CardTitle className="text-base font-bold text-gray-900">{postulacion.tipoBeca}</CardTitle>
                                  <p className="text-xs text-gray-500 mt-0.5">{postulacion.nombre}</p>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${estadoConfig.badgeClass}`}>
                              {postulacion.estado}
                            </div>

                            <div className="space-y-2 pt-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5" />
                                  Fecha
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {new Date(postulacion.fechaPostulacion).toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>

                              {postulacion.trimestre && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600 flex items-center gap-1.5">
                                    <BookOpen className="h-3.5 w-3.5" />
                                    Trimestre
                                  </span>
                                  <span className="font-semibold text-gray-900">{postulacion.trimestre}</span>
                                </div>
                              )}

                              {postulacion.carrera && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600 flex items-center gap-1.5">
                                    <GraduationCap className="h-3.5 w-3.5" />
                                    Carrera
                                  </span>
                                  <span className="font-semibold text-gray-900 text-xs text-right leading-tight max-w-[60%]">
                                    {postulacion.carrera}
                                  </span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default ScholarshipPrograms;