import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Target, Users, BookOpen, TrendingUp, Heart, Award, CheckCircle, AlertCircle, Info, FileText, BrainCircuit, Upload, User, LogOut, Settings, Download, Clock, Sparkles, Compass, Link, CheckCircle2, ListChecks, ChevronRight, Plus, X, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import ConsultaLLM from "@/components/OrientacionVocacional/ConsultaLLM";
import RecomendacionesCarrera from "@/components/OrientacionVocacional/RecomendacionesCarrera";
import ChatOrientacion from "@/components/OrientacionVocacional/ChatOrientacion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import { iniciarTest, TipoTest, obtenerMiTrayectoria, actualizarMiTrayectoria, TrayectoriaBody, normalizarTrayectoria, obtenerHistorial, obtenerPerfilVocacional, HistorialResponse, PerfilVocacionalResponse } from "@/lib/api/orientacionVocacional";
import { format } from "date-fns";

const profileBg = "https://www.unimet.edu.ve/wp-content/uploads/2021/03/MODULO-DE-AULAS-ahora-1030x687.jpg";

const DashboardAspirante = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, tokens } = useAuth();
  const { toast } = useToast();
  const [activeModule, setActiveModule] = useState<string>("tests");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Trayectoria académica (bachillerato) – campos según spec del back
  const [trayectoria, setTrayectoria] = useState<TrayectoriaBody>({
    promediosPorAno: {},
    promedioGeneral: undefined,
    gradoActual: "",
    materiasDestacadas: [],
    actividadesExtracurriculares: [],
    proyectosRealizados: [],
  });
  const [trayectoriaLoading, setTrayectoriaLoading] = useState(false);
  const [trayectoriaSaving, setTrayectoriaSaving] = useState(false);
  // Inputs temporales para agregar ítems a listas
  const [nuevaMateria, setNuevaMateria] = useState("");
  const [nuevaActividad, setNuevaActividad] = useState("");
  const [nuevoProyecto, setNuevoProyecto] = useState("");
  
  // Estado para Orientación Vocacional
  const [tipoTest, setTipoTest] = useState<TipoTest | null>(null);
  const [cargandoTest, setCargandoTest] = useState(false);

  // Datos del perfil (historial y perfil vocacional) para Mi Perfil
  const [historialPerfil, setHistorialPerfil] = useState<HistorialResponse["data"]>([]);
  const [perfilVocacionalData, setPerfilVocacionalData] = useState<PerfilVocacionalResponse["data"] | null>(null);
  const [cargandoPerfil, setCargandoPerfil] = useState(false);
  
  // Detectar la ruta actual para mostrar navegación
  const [currentStep, setCurrentStep] = useState<string>("seleccionar");
  
  useEffect(() => {
    // Detectar el paso actual basado en la ruta
    const path = location.pathname;
    if (path.includes('/orientacion/ronda-1')) {
      setCurrentStep('ronda1');
      setActiveModule('orientacion');
    } else if (path.includes('/orientacion/ronda-2')) {
      setCurrentStep('ronda2');
      setActiveModule('orientacion');
    } else if (path.includes('/orientacion/test-ico')) {
      setCurrentStep('testIco');
      setActiveModule('orientacion');
    } else if (path.includes('/orientacion/resultados-ico')) {
      setCurrentStep('resultadosIco');
      setActiveModule('orientacion');
    } else if (path.includes('/orientacion/resultados')) {
      setCurrentStep('resultados');
      setActiveModule('orientacion');
    } else if (path.includes('/orientacion/historial')) {
      setCurrentStep('historial');
      setActiveModule('orientacion');
    } else if (path.includes('/orientacion/seleccionar-test')) {
      setCurrentStep('seleccionar');
      setActiveModule('orientacion');
    } else if (path === '/dashboard-aspirante' && activeModule === 'orientacion') {
      setCurrentStep('seleccionar');
    }
  }, [location.pathname, activeModule]);

  // Cargar historial y perfil vocacional cuando se entra a Mi Perfil
  const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem("auth_tokens") || "null")?.accessToken;
  useEffect(() => {
    if (activeModule !== "perfil" || !accessToken) return;
    setCargandoPerfil(true);
    Promise.all([
      obtenerHistorial(accessToken).catch(() => ({ success: true, data: [] } as HistorialResponse)),
      obtenerPerfilVocacional(accessToken).catch(() => null),
    ])
      .then(([histRes, perfilRes]) => {
        // Extraer array del historial (misma lógica que Historial.tsx: data puede ser array u objeto anidado)
        let historialData: any[] = [];
        const data = (histRes as HistorialResponse).data;
        if (Array.isArray(data)) {
          historialData = data;
        } else if (data && typeof data === "object") {
          const dataObj = data as Record<string, unknown>;
          if (Array.isArray(dataObj.sesiones)) historialData = dataObj.sesiones;
          else if (Array.isArray(dataObj.historial)) historialData = dataObj.historial;
          else if (Array.isArray(dataObj.data)) historialData = dataObj.data;
          else {
            const firstKey = Object.keys(dataObj).find((k) => Array.isArray(dataObj[k]));
            if (firstKey) historialData = (dataObj[firstKey] as any[]) || [];
          }
        }
        setHistorialPerfil(historialData);
        setPerfilVocacionalData(perfilRes?.data ?? null);
      })
      .finally(() => setCargandoPerfil(false));
  }, [activeModule, accessToken]);

  // Datos para RecomendacionesCarrera
  const [perfilEstudiante] = useState({
    intereses: ['tecnología', 'programación', 'matemáticas'],
    habilidades: ['lógica', 'resolución de problemas', 'trabajo en equipo'],
    resultadosTest: {
      personalidad: 'INTJ',
      intereses: ['STEM', 'Tecnología']
    },
    preferencias: {
      modalidad: 'presencial',
      duracion: '5 años'
    }
  });

  const [carrerasDisponibles] = useState([
    {
      nombre: 'Ingeniería de Sistemas',
      descripcion: 'Carrera enfocada en el desarrollo de software y sistemas informáticos'
    },
    {
      nombre: 'Ingeniería Informática',
      descripcion: 'Carrera que combina hardware y software'
    },
    {
      nombre: 'Ingeniería en Computación',
      descripcion: 'Carrera con enfoque en algoritmos y estructuras de datos'
    },
    {
      nombre: 'Matemáticas Industriales',
      descripcion: 'Carrera que aplica matemáticas a problemas industriales'
    },
    {
      nombre: 'Psicología',
      descripcion: 'Carrera enfocada en el estudio del comportamiento humano'
    }
  ]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const sidebarItems = [
    {
      title: "Tests Vocacionales",
      icon: BrainCircuit,
      module: "tests"
    },
    {
      title: "Orientación Vocacional",
      icon: Compass,
      module: "orientacion"
    },
    {
      title: "Trayectoria académica",
      icon: Upload,
      module: "notas"
    },
    {
      title: "Mi Perfil",
      icon: User,
      module: "perfil"
    }
  ];

  // Cargar trayectoria al entrar al módulo notas
  useEffect(() => {
    if (activeModule !== "notas") return;
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) return;

    setTrayectoriaLoading(true);
    obtenerMiTrayectoria(accessToken)
      .then((res) => {
        const normalizada = normalizarTrayectoria(res.data);
        if (normalizada) {
          setTrayectoria({
            promediosPorAno: normalizada.promediosPorAno ?? {},
            promedioGeneral: normalizada.promedioGeneral,
            gradoActual: normalizada.gradoActual ?? "",
            materiasDestacadas: normalizada.materiasDestacadas ?? [],
            actividadesExtracurriculares: normalizada.actividadesExtracurriculares ?? [],
            proyectosRealizados: normalizada.proyectosRealizados ?? [],
          });
        }
      })
      .catch(() => {
        // 404 o sin datos: se mantiene el estado inicial
      })
      .finally(() => setTrayectoriaLoading(false));
  }, [activeModule, tokens]);

  const handleGuardarTrayectoria = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) {
      toast({ title: "Sesión expirada", description: "Inicia sesión nuevamente", variant: "destructive" });
      return;
    }

    setTrayectoriaSaving(true);
    try {
      const body: TrayectoriaBody = {
        promediosPorAno: Object.keys(trayectoria.promediosPorAno || {}).length
          ? trayectoria.promediosPorAno
          : undefined,
        promedioGeneral: trayectoria.promedioGeneral != null && trayectoria.promedioGeneral !== undefined
          ? Number(trayectoria.promedioGeneral)
          : undefined,
        gradoActual: trayectoria.gradoActual?.trim() || undefined,
        materiasDestacadas: (trayectoria.materiasDestacadas?.length && trayectoria.materiasDestacadas.length > 0)
          ? trayectoria.materiasDestacadas
          : undefined,
        actividadesExtracurriculares: (trayectoria.actividadesExtracurriculares?.length && trayectoria.actividadesExtracurriculares.length > 0)
          ? trayectoria.actividadesExtracurriculares
          : undefined,
        proyectosRealizados: (trayectoria.proyectosRealizados?.length && trayectoria.proyectosRealizados.length > 0)
          ? trayectoria.proyectosRealizados
          : undefined,
      };
      await actualizarMiTrayectoria(accessToken, body);
      toast({ title: "Éxito", description: "Trayectoria académica guardada correctamente." });
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.message || "No se pudo guardar la trayectoria.",
        variant: "destructive",
      });
    } finally {
      setTrayectoriaSaving(false);
    }
  };

  const aniosDefault = ["1er año", "2do año", "3er año", "4to año", "5to año"] as const;
  const setPromedioPorAno = (ano: string, value: string) => {
    const num = value === "" ? undefined : parseFloat(value);
    const isValid = num != null && !Number.isNaN(num);
    setTrayectoria((prev) => {
      const next = { ...(prev.promediosPorAno || {}) };
      if (isValid) next[ano] = num;
      else delete next[ano];
      return { ...prev, promediosPorAno: next };
    });
  };
  const addToList = (key: 'materiasDestacadas' | 'actividadesExtracurriculares' | 'proyectosRealizados', value: string) => {
    const v = value?.trim();
    if (!v) return;
    setTrayectoria((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), v],
    }));
    if (key === 'materiasDestacadas') setNuevaMateria("");
    if (key === 'actividadesExtracurriculares') setNuevaActividad("");
    if (key === 'proyectosRealizados') setNuevoProyecto("");
  };
  const removeFromList = (key: 'materiasDestacadas' | 'actividadesExtracurriculares' | 'proyectosRealizados', index: number) => {
    setTrayectoria((prev) => {
      const arr = [...(prev[key] || [])];
      arr.splice(index, 1);
      return { ...prev, [key]: arr };
    });
  };

  const handleIniciarTest = async () => {
    if (!tipoTest) {
      toast({
        title: "Selección requerida",
        description: "Por favor selecciona un tipo de test para continuar",
        variant: "destructive",
      });
      return;
    }

    const accessToken = tokens?.accessToken || 
      JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;

    if (!accessToken) {
      toast({
        title: "Sesión expirada",
        description: "Por favor inicia sesión nuevamente",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setCargandoTest(true);

    try {
      if (tipoTest === 'ICO') {
        const { iniciarTestIco, obtenerPreguntasIco } = await import('@/lib/api/orientacionVocacional');
        const resInicio = await iniciarTestIco(accessToken);
        const sesionId = resInicio.data.sesionId;
        localStorage.setItem('sesionId', sesionId);
        localStorage.setItem('tipoTest', 'ICO');
        localStorage.setItem('estadoSesion', resInicio.data.estado);
        const resPreguntas = await obtenerPreguntasIco(accessToken, sesionId);
        const preguntas = resPreguntas.data?.preguntas ?? [];
        localStorage.setItem('preguntasIco', JSON.stringify(preguntas));
        toast({ title: "Test iniciado", description: "Has comenzado el test ICO" });
        navigate('/orientacion/test-ico');
      } else {
        const respuesta = await iniciarTest(accessToken, tipoTest);
        localStorage.setItem('sesionId', respuesta.data.sesionId);
        localStorage.setItem('tipoTest', respuesta.data.tipoTest);
        localStorage.setItem('estadoSesion', respuesta.data.estado);
        localStorage.setItem('preguntasRonda1', JSON.stringify(respuesta.data.preguntas));
        toast({ title: "Test iniciado", description: "Has comenzado el test Holland RIASEC" });
        navigate('/orientacion/ronda-1');
      }
      
    } catch (error: any) {
      console.error('Error al iniciar test:', error);
      
      if (error.status === 401) {
        toast({
          title: "Sesión expirada",
          description: error.message || "Tu sesión ha expirado. Por favor inicia sesión nuevamente.",
          variant: "destructive",
        });
        navigate("/login");
      } else if (error.status === 403) {
        toast({
          title: "Sin permisos",
          description: error.message || "No tienes permisos para realizar este test. Contacta al administrador.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Error al iniciar el test. Por favor intenta nuevamente.",
          variant: "destructive",
        });
      }
    } finally {
      setCargandoTest(false);
    }
  };

  const renderContent = () => {
    if (activeModule === "orientacion") {
      return <Navigate to="/orientacion/seleccionar-test" replace />;
    }

    if (activeModule === "tests") {
      return (
        <div className="space-y-6">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="consulta">Consulta</TabsTrigger>
              <TabsTrigger value="recomendaciones">Recomendaciones</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="mt-4">
              <ChatOrientacion />
            </TabsContent>

            <TabsContent value="consulta" className="mt-4">
              <ConsultaLLM />
            </TabsContent>

            <TabsContent value="recomendaciones" className="mt-4">
              <RecomendacionesCarrera
                perfilEstudiante={perfilEstudiante}
                carrerasDisponibles={carrerasDisponibles}
              />
            </TabsContent>
          </Tabs>
        </div>
      );
    }

    if (activeModule === "notas") {
      return (
        <div className="space-y-6">
          <Card className="border-orange/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Upload className="h-6 w-6" />
                Trayectoria académica (Bachillerato)
              </CardTitle>
              <CardDescription>
                Completa tus datos de bachillerato para enriquecer tu perfil vocacional. Todos los campos son opcionales.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {trayectoriaLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Estos datos se usan en tu perfil de orientación vocacional. Escala de notas sugerida: 0–20.
                    </AlertDescription>
                  </Alert>

                  {/* Promedios por año */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Promedios por año / periodo</Label>
                    <p className="text-sm text-muted-foreground">
                      Ej: &quot;1er año&quot;: 14, &quot;2do año&quot;: 15, etc.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {aniosDefault.map((ano) => (
                        <div key={ano} className="space-y-1">
                          <Label htmlFor={`prom-${ano}`} className="text-xs">{ano}</Label>
                          <Input
                            id={`prom-${ano}`}
                            type="number"
                            min={0}
                            max={20}
                            step={0.01}
                            placeholder="—"
                            value={trayectoria.promediosPorAno?.[ano] ?? ""}
                            onChange={(e) => setPromedioPorAno(ano, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="promedioGeneral">Promedio general (0–20)</Label>
                      <Input
                        id="promedioGeneral"
                        type="number"
                        min={0}
                        max={20}
                        step={0.01}
                        placeholder="Ej: 16.00"
                        value={trayectoria.promedioGeneral ?? ""}
                        onChange={(e) =>
                          setTrayectoria((prev) => ({
                            ...prev,
                            promedioGeneral: e.target.value === "" ? undefined : parseFloat(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gradoActual">Grado actual (máx. 50 caracteres)</Label>
                      <Input
                        id="gradoActual"
                        maxLength={50}
                        placeholder="Ej: 5to año, 3er año bachillerato"
                        value={trayectoria.gradoActual ?? ""}
                        onChange={(e) => setTrayectoria((prev) => ({ ...prev, gradoActual: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Materias destacadas */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Materias destacadas</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(trayectoria.materiasDestacadas || []).map((m, i) => (
                        <Badge key={i} variant="secondary" className="pl-2 pr-1 py-1">
                          {m}
                          <button type="button" onClick={() => removeFromList("materiasDestacadas", i)} className="ml-1 rounded-full hover:bg-muted p-0.5">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ej: Matemáticas, Física"
                        value={nuevaMateria}
                        onChange={(e) => setNuevaMateria(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addToList("materiasDestacadas", nuevaMateria))}
                      />
                      <Button type="button" variant="outline" size="icon" onClick={() => addToList("materiasDestacadas", nuevaMateria)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Actividades extracurriculares */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Actividades extracurriculares</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(trayectoria.actividadesExtracurriculares || []).map((a, i) => (
                        <Badge key={i} variant="secondary" className="pl-2 pr-1 py-1">
                          {a}
                          <button type="button" onClick={() => removeFromList("actividadesExtracurriculares", i)} className="ml-1 rounded-full hover:bg-muted p-0.5">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ej: Deportes, Teatro, Voluntariado"
                        value={nuevaActividad}
                        onChange={(e) => setNuevaActividad(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addToList("actividadesExtracurriculares", nuevaActividad))}
                      />
                      <Button type="button" variant="outline" size="icon" onClick={() => addToList("actividadesExtracurriculares", nuevaActividad)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Proyectos realizados */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Proyectos realizados</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(trayectoria.proyectosRealizados || []).map((p, i) => (
                        <Badge key={i} variant="secondary" className="pl-2 pr-1 py-1">
                          {p}
                          <button type="button" onClick={() => removeFromList("proyectosRealizados", i)} className="ml-1 rounded-full hover:bg-muted p-0.5">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ej: Feria científica 2024, Proyecto comunitario"
                        value={nuevoProyecto}
                        onChange={(e) => setNuevoProyecto(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addToList("proyectosRealizados", nuevoProyecto))}
                      />
                      <Button type="button" variant="outline" size="icon" onClick={() => addToList("proyectosRealizados", nuevoProyecto)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleGuardarTrayectoria}
                    disabled={trayectoriaSaving}
                    className="w-full bg-gradient-primary hover:opacity-90"
                  >
                    {trayectoriaSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Guardando…
                      </>
                    ) : (
                      "Guardar trayectoria académica"
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }
    
    if (activeModule === "perfil") {
      return (
        <div className="space-y-4 sm:space-y-6">
          {/* Header Profile Section */}
          <div className="relative h-48 sm:h-64 md:h-72 lg:h-80 overflow-hidden rounded-xl sm:rounded-2xl shadow-lg mt-4">
            <img 
              src={profileBg}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
            <div className="absolute inset-0 bg-primary/20" />
          </div>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-start -mt-16 sm:-mt-24 lg:-mt-32 relative z-0 px-2 sm:px-0">
            
            {/* Profile Sidebar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full lg:w-1/3 space-y-4 sm:space-y-6"
            >
              <Card className="rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border-slate-200">
                <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 flex flex-col items-center text-center px-4 sm:px-6">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-xl mb-3 sm:mb-4 overflow-hidden bg-gradient-to-br from-primary/20 to-orange-dark/20">
                    <Avatar className="w-full h-full">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-orange-dark text-white text-2xl sm:text-3xl font-bold">
                        {user?.nombre?.charAt(0) || ''}{user?.apellido?.charAt(0) || ''}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">
                    {user?.nombre || 'Usuario'} {user?.apellido || ''}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-500 mb-3 sm:mb-4">
                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Aspirante'}
                    {user?.trimestre && ` • ${user.trimestre}to Trimestre`}
                  </p>
                  <Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:opacity-90 mb-4 sm:mb-6 px-3 py-1 shadow-md">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Perfil {user?.emailVerified ? '100%' : '85%'} Completado
                  </Badge>
                  
                  <div className="w-full grid grid-cols-2 gap-3 sm:gap-4 py-4 sm:py-6 border-t border-slate-200">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-primary mb-1">
                        {cargandoPerfil ? "—" : historialPerfil.filter((s: any) => {
                          const e = (s.estado ?? s.estado)?.toLowerCase?.() ?? "";
                          const t = s.tipoTest ?? s.tipo_test;
                          return t === "ICO" ? (e === "finalizada" || e === "completada") : (e === "finalizada" || e === "ronda_2_completada");
                        }).length}
                      </div>
                      <div className="text-xs text-slate-500 uppercase">Tests Completados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-primary mb-1">
                        {cargandoPerfil ? "—" : (perfilVocacionalData?.resultadoActual?.resultado?.recomendacionesCarreras?.length ?? "—")}
                      </div>
                      <div className="text-xs text-slate-500 uppercase">Recomendaciones</div>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-primary to-orange-dark text-white hover:opacity-90 rounded-full shadow-md hover:shadow-lg transition-all h-10 sm:h-11">
                    <Settings className="w-4 h-4 mr-2" /> Editar Perfil
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-xl sm:rounded-2xl shadow-lg border-slate-200">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    Resumen Vocacional
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                  {cargandoPerfil ? (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Loader2 className="w-4 h-4 animate-spin" /> Cargando...
                    </div>
                  ) : perfilVocacionalData?.resultadoActual?.resultado ? (
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-xs sm:text-sm">
                          {(perfilVocacionalData.resultadoActual.resultado as any).perfilDominante ?? (perfilVocacionalData.resultadoActual.resultado as any).perfil_dominante ?? "—"}
                        </Badge>
                        <Badge className="bg-orange-100 text-orange-700 border border-orange-200 px-2.5 py-1 text-xs sm:text-sm">
                          Código: {(perfilVocacionalData.resultadoActual.resultado as any).codigoHolland ?? (perfilVocacionalData.resultadoActual.resultado as any).codigo_holland ?? "—"}
                        </Badge>
                      </div>
                      {(perfilVocacionalData.resultadoActual.resultado as any).perfilSecundario && (
                        <p className="text-xs text-slate-600">
                          Secundario: {(perfilVocacionalData.resultadoActual.resultado as any).perfilSecundario ?? (perfilVocacionalData.resultadoActual.resultado as any).perfil_secundario}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">
                      Completa un test de orientación para ver tu perfil dominante y código Holland.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Información Personal Adicional */}
              <Card className="rounded-xl sm:rounded-2xl shadow-lg border-slate-200">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    Información de Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 px-4 sm:px-6 pb-4 sm:pb-6">
                  <div className="space-y-1 p-2.5 sm:p-3 bg-slate-50 rounded-lg">
                    <Label className="text-xs text-slate-500 font-medium">Correo Electrónico</Label>
                    <p className="text-sm font-semibold text-slate-900 break-all">
                      {user?.email || 'No disponible'}
                    </p>
                  </div>
                  <div className="space-y-1 p-2.5 sm:p-3 bg-slate-50 rounded-lg">
                    <Label className="text-xs text-slate-500 font-medium">Teléfono</Label>
                    <p className="text-sm font-semibold text-slate-900">
                      {user?.telefono || 'No disponible'}
                    </p>
                  </div>
                  <div className="space-y-1 p-2.5 sm:p-3 bg-slate-50 rounded-lg">
                    <Label className="text-xs text-slate-500 font-medium">Cédula</Label>
                    <p className="text-sm font-semibold text-slate-900">
                      {user?.cedula || 'No disponible'}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-slate-700">Estado de la cuenta:</span>
                      <Badge className={`${
                        user?.activo 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                          : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white'
                      } shadow-sm`}>
                        {user?.activo ? '✓ Activa' : '⏳ Pendiente'}
                      </Badge>
                    </div>
                    {!user?.emailVerified && (
                      <div className="flex items-center gap-2 mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 flex-shrink-0" />
                        <p className="text-xs text-yellow-800 font-medium">
                          Correo no verificado
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full lg:w-2/3"
            >
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-slate-200 min-h-[400px] sm:min-h-[500px] p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Mi Trayectoria</h1>
                        <p className="text-sm sm:text-base text-slate-500">Historial académico y resultados vocacionales</p>
                    </div>
                    <Button variant="outline" className="rounded-full w-full sm:w-auto">
                        <Download className="w-4 h-4 mr-2" /> 
                        <span className="hidden sm:inline">Exportar Informe</span>
                        <span className="sm:hidden">Exportar</span>
                    </Button>
                </div>

                <Tabs defaultValue="tests" className="w-full">
                  <TabsList className="w-full grid grid-cols-3 bg-slate-100 p-1 rounded-xl sm:rounded-full mb-6 sm:mb-8 h-auto">
                    <TabsTrigger value="tests" className="rounded-lg sm:rounded-full px-3 sm:px-6 py-2 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <BrainCircuit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Tests Vocacionales</span>
                      <span className="sm:hidden">Tests</span>
                    </TabsTrigger>
                    <TabsTrigger value="history" className="rounded-lg sm:rounded-full px-3 sm:px-6 py-2 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Historial Académico</span>
                      <span className="sm:hidden">Historial</span>
                    </TabsTrigger>
                    <TabsTrigger value="preferences" className="rounded-lg sm:rounded-full px-3 sm:px-6 py-2 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Preferencias</span>
                      <span className="sm:hidden">Prefs</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="tests" className="space-y-3 sm:space-y-4">
                    {(() => {
                      const completados = historialPerfil.filter((s: any) => {
                        const e = (s.estado ?? s.estado)?.toLowerCase?.() ?? "";
                        const t = s.tipoTest ?? s.tipo_test;
                        return t === "ICO" ? (e === "finalizada" || e === "completada") : (e === "finalizada" || e === "ronda_2_completada");
                      });
                      if (cargandoPerfil) {
                        return (
                          <div className="flex items-center justify-center py-12 text-slate-500">
                            <Loader2 className="w-8 h-8 animate-spin mr-2" /> Cargando...
                          </div>
                        );
                      }
                      if (completados.length === 0) {
                        return (
                          <div className="border-2 border-dashed border-slate-200 rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center">
                            <BrainCircuit className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <h3 className="font-bold text-slate-700 mb-1">No hay tests completados</h3>
                            <p className="text-sm text-slate-500 mb-4">Completa un test de orientación para ver tus resultados aquí.</p>
                            <Button onClick={() => { setActiveModule("orientacion"); navigate("/orientacion/seleccionar-test"); }} className="bg-primary hover:bg-primary/90 text-white">
                              Ir a Orientación Vocacional
                            </Button>
                          </div>
                        );
                      }
                      return (
                        <>
                          {completados.map((sesion: any, index: number) => {
                            const tipoTestVal = sesion.tipoTest ?? sesion.tipo_test;
                            const fechaVal = sesion.fechaFin ?? sesion.fecha_fin ?? sesion.fechaInicio ?? sesion.fecha_inicio;
                            const perfilVal = sesion.perfilDominante ?? sesion.perfil_dominante;
                            const idVal = sesion.id ?? sesion.sesion_id;
                            const esIco = tipoTestVal === "ICO";
                            const nombreTest = esIco ? "Test ICO" : "Test Holland RIASEC";
                            const verResultados = () => {
                              if (esIco) navigate("/orientacion/resultados-ico", { state: { sesionId: idVal } });
                              else navigate(`/orientacion/resultados/${idVal}`);
                            };
                            return (
                              <div
                                key={idVal || `sesion-${index}`}
                                className="border rounded-xl p-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                              >
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-bold text-slate-900">{nombreTest}</h3>
                                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 mt-0.5">
                                    {fechaVal && <span>{format(new Date(fechaVal), "dd/MM/yyyy")}</span>}
                                    {perfilVal && <span className="font-medium text-slate-800">{perfilVal}</span>}
                                  </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={verResultados} className="shrink-0">
                                  Ver Resultados <ChevronRight className="w-3 h-3 ml-1" />
                                </Button>
                              </div>
                            );
                          })}
                          <Button
                            variant="outline"
                            className="w-full rounded-xl border-dashed"
                            onClick={() => { setActiveModule("orientacion"); navigate("/orientacion/seleccionar-test"); }}
                          >
                            <Plus className="w-4 h-4 mr-2" /> Realizar otro test
                          </Button>
                        </>
                      );
                    })()}
                  </TabsContent>

                  <TabsContent value="history">
                    <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                        <div className="relative mb-4 sm:mb-6">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                            <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-primary rounded-full animate-pulse" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Sincronizando Historial</h3>
                        <p className="text-sm sm:text-base text-slate-600 max-w-sm mx-auto px-4">
                          Estamos conectando con el sistema de control de estudios para traer tus notas y rendimiento académico.
                        </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="preferences">
                    <div className="space-y-4">
                      <div className="p-4 sm:p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl sm:rounded-2xl border-2 border-pink-100 shadow-md">
                        <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-3 sm:mb-4 flex items-center gap-2">
                          <Heart className="w-5 h-5 text-pink-600" />
                          Preferencias de Estudio
                        </h3>
                        <div className="space-y-2.5 sm:space-y-3 text-sm sm:text-base">
                          <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-white/70 rounded-lg">
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                            <span className="font-semibold text-slate-700">Modalidad:</span>
                            <span className="text-slate-600">Presencial</span>
                          </div>
                          <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-white/70 rounded-lg">
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                            <span className="font-semibold text-slate-700">Duración preferida:</span>
                            <span className="text-slate-600">5 años</span>
                          </div>
                          <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-white/70 rounded-lg">
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                            <span className="font-semibold text-slate-700">Áreas de interés:</span>
                            <span className="text-slate-600">Tecnología, Diseño, Innovación</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-orange/20 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-primary hover:text-primary/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Orientación Vocacional</h1>
              <p className="text-sm text-muted-foreground">Sistema de Orientación</p>
            </div>
          </div>

          {/* Logo en el centro */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img
              src="/lovable-uploads/UNIMETLogo.png"
              alt="UNIMET Logo"
              className="h-12 object-contain"
            />
          </div>

          {/* Botón Cerrar Sesión */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-primary hover:text-primary/90 border-orange/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-16 bg-card border-r border-orange/20 min-h-[calc(100vh-theme(spacing.20))]">
          <div className="p-2 space-y-2">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setHoveredItem(item.title)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={() => {
                    setActiveModule(item.module);
                    if (item.module === "orientacion") {
                      navigate("/orientacion/seleccionar-test");
                    } else if (item.module !== "orientacion" && location.pathname.includes("/orientacion/")) {
                      navigate("/dashboard-aspirante");
                    }
                  }}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg border border-orange/20 transition-all duration-200 ${
                    activeModule === item.module
                      ? "bg-orange/10 border-orange/40"
                      : "bg-background hover:bg-orange/10 hover:border-orange/40"
                  }`}
                >
                  <item.icon className="h-5 w-5 text-primary" />
                </button>

                {/* Tooltip on hover */}
                {hoveredItem === item.title && (
                  <div className="absolute left-16 top-0 bg-card border border-orange/20 rounded-lg px-3 py-2 shadow-lg z-10 whitespace-nowrap">
                    <span className="text-sm font-medium text-primary">{item.title}</span>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-card border-l border-b border-orange/20 rotate-45"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="pt-0">
              {/* Orientación: barra de progreso solo cuando ya estás en un test (RIASEC o ICO), no en selección */}
              {location.pathname.includes('/orientacion/') ? (
                <>
                  {/* Barra de progreso: ocultar en pantalla de seleccionar test; mostrar la que corresponda según ruta */}
                  {(() => {
                    const path = location.pathname;
                    const enSeleccionar = path.includes('seleccionar-test');
                    const enFlujoIco = path.includes('test-ico') || path.includes('resultados-ico');
                    const enFlujoHolland = path.includes('ronda-1') || path.includes('ronda-2') || path.includes('/orientacion/resultados/');
                    if (enSeleccionar && !enFlujoIco && !enFlujoHolland) return null;

                    const stepsFlow: { id: string; label: string; getPath: () => string }[] = enFlujoIco
                      ? [
                          { id: 'seleccionar', label: 'Inicio', getPath: () => '/orientacion/seleccionar-test' },
                          { id: 'testIco', label: 'Test ICO', getPath: () => '/orientacion/test-ico' },
                          { id: 'resultadosIco', label: 'Resultados', getPath: () => '/orientacion/resultados-ico' },
                        ]
                      : [
                          { id: 'seleccionar', label: 'Inicio', getPath: () => '/orientacion/seleccionar-test' },
                          { id: 'ronda1', label: 'Ronda 1', getPath: () => '/orientacion/ronda-1' },
                          { id: 'ronda2', label: 'Ronda 2', getPath: () => '/orientacion/ronda-2' },
                          { id: 'resultados', label: 'Resultados', getPath: () => `/orientacion/resultados/${localStorage.getItem('sesionId') || ''}` },
                        ];
                    const currentIndex = stepsFlow.findIndex(s => s.id === currentStep);
                    const stepIndex = currentIndex >= 0 ? currentIndex : (currentStep === 'historial' ? stepsFlow.length : 0);
                    return (
                      <div className="mb-6 rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-1 items-center gap-0">
                            {stepsFlow.map((step, i) => {
                              const completed = i < stepIndex;
                              const current = i === stepIndex;
                              const canNavigate = i <= stepIndex;
                              const onHistorial = currentStep === 'historial';
                              const hasSesion = !!localStorage.getItem('sesionId');
                              const isResultadosStep = step.id === 'resultados' || step.id === 'resultadosIco';
                              const clickable = !onHistorial && (
                                (canNavigate && !isResultadosStep) ||
                                (canNavigate && isResultadosStep && hasSesion)
                              );
                              return (
                                <div key={step.id} className="flex flex-1 items-center">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!clickable) return;
                                      if (isResultadosStep && hasSesion) navigate(step.getPath());
                                      else { setActiveModule('orientacion'); navigate(step.getPath()); }
                                    }}
                                    disabled={!clickable}
                                    className={`flex flex-col items-center gap-1.5 flex-1 min-w-0 ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
                                  >
                                    <span
                                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                                        completed
                                          ? 'bg-primary text-primary-foreground'
                                          : current
                                            ? 'bg-primary text-primary-foreground ring-2 ring-primary/40 ring-offset-2 ring-offset-slate-50'
                                            : 'bg-slate-200 text-slate-400'
                                      }`}
                                    >
                                      {completed ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                                    </span>
                                    <span className={`text-xs font-medium truncate max-w-full ${current ? 'text-primary' : completed ? 'text-slate-600' : 'text-slate-400'}`}>
                                      {step.label}
                                    </span>
                                  </button>
                                  {i < stepsFlow.length - 1 && (
                                    <div className={`flex-1 h-0.5 min-w-4 mx-1 rounded-full transition-colors ${completed ? 'bg-primary/60' : 'bg-slate-200'}`} aria-hidden />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <button
                            type="button"
                            onClick={() => navigate('/orientacion/historial')}
                            className={`shrink-0 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                              currentStep === 'historial' ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:bg-slate-200/80 hover:text-slate-700'
                            }`}
                          >
                            <Clock className="h-3.5 w-3.5" />
                            Historial
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                  <Outlet />
                </>
              ) : (
                renderContent()
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardAspirante;