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
import { iniciarTest, TipoTest, obtenerMiTrayectoria, actualizarMiTrayectoria, TrayectoriaBody, normalizarTrayectoria } from "@/lib/api/orientacionVocacional";

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
      const respuesta = await iniciarTest(accessToken, tipoTest);
      
      // Guardar datos en localStorage
      localStorage.setItem('sesionId', respuesta.data.sesionId);
      localStorage.setItem('tipoTest', respuesta.data.tipoTest);
      localStorage.setItem('estadoSesion', respuesta.data.estado);
      localStorage.setItem('preguntasRonda1', JSON.stringify(respuesta.data.preguntas));
      
      toast({
        title: "Test iniciado",
        description: `Has comenzado el test ${tipoTest === 'Holland_RIASEC' ? 'Holland RIASEC' : 'Kuder'}`,
      });

      // Redirigir a Ronda 1
      navigate('/orientacion/ronda-1');
      
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
      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <Compass className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Selecciona el Tipo de Test
            </h2>
            <p className="text-gray-500 text-lg">
              Elige el test que mejor se adapte a tus necesidades
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Test Holland RIASEC */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all border-2 ${
                  tipoTest === 'Holland_RIASEC' 
                    ? 'border-orange-500 bg-orange-50 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setTipoTest('Holland_RIASEC')}
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Test Holland RIASEC
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Evalúa 6 dimensiones de personalidad vocacional:
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Realista (R)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Investigador (I)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Artístico (A)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Social (S)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Emprendedor (E)
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500   rounded-full"></span>
                          Convencional (C)
                        </li>
                      </ul>
                    </div>
                    {tipoTest === 'Holland_RIASEC' && (
                      <CheckCircle2 className="h-6 w-6 text-orange-500 flex-shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Test Kuder */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all border-2 ${
                  tipoTest === 'Kuder' 
                    ? 'border-orange-500 bg-orange-50 shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setTipoTest('Kuder')}
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Test Kuder
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Evalúa 10 áreas de interés profesional:
                      </p>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Mecánico, Científico, Computacional
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Artístico, Literario, Musical
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                          Social, Administrativo, Al aire libre
                        </li>
                      </ul>
                    </div>
                    {tipoTest === 'Kuder' && (
                      <CheckCircle2 className="h-6 w-6 text-orange-500 flex-shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="text-center">
            <Button
              onClick={handleIniciarTest}
              disabled={!tipoTest || cargandoTest}
              className="bg-[#F37021] hover:bg-orange-600 text-white rounded-md px-10 h-12 font-bold transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cargandoTest ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Iniciando...
                </>
              ) : (
                "Comenzar Test"
              )}
            </Button>
          </div>
        </div>
      );
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
                      <div className="text-xl sm:text-2xl font-bold text-primary mb-1">3</div>
                      <div className="text-xs text-slate-500 uppercase">Tests Realizados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl font-bold text-primary mb-1">12</div>
                      <div className="text-xs text-slate-500 uppercase">Carreras Guardadas</div>
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
                    Resumen de Intereses
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <div className="flex flex-wrap gap-2">
                    {["Tecnología", "Diseño", "Innovación", "Psicología", "Arte Digital"].map((tag) => (
                      <Badge key={tag} className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 px-2.5 py-1 text-xs sm:text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
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
                    <div className="border-2 border-purple-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-br from-white to-purple-50/30">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                            <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                                    <BrainCircuit className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-1">Test de Aptitud Vocacional</h3>
                                    <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      Realizado el 10 Dic 2025
                                    </p>
                                </div>
                            </div>
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm flex-shrink-0">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completado
                            </Badge>
                        </div>
                        <div className="mt-3 sm:mt-4 pl-0 sm:pl-14 sm:pl-16 border-l-0 sm:border-l-4 border-purple-300 pl-2 sm:pl-4">
                            <p className="text-xs sm:text-sm text-slate-600 mb-1 sm:mb-2 font-medium">
                              Resultado Principal: <span className="text-purple-600 font-bold">Perfil Creativo-Tecnológico</span>
                            </p>
                            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                              Se recomienda explorar carreras relacionadas con Diseño Gráfico, Ingeniería de Sistemas y Arquitectura.
                            </p>
                        </div>
                    </div>

                    <div className="border-2 border-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group bg-gradient-to-br from-white to-blue-50/30">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                            <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                                    <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-1">Evaluación de Intereses (Holland)</h3>
                                    <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      Realizado el 15 Nov 2025
                                    </p>
                                </div>
                            </div>
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm flex-shrink-0">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completado
                            </Badge>
                        </div>
                    </div>
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
        
        {/* Navegación del flujo de Orientación Vocacional */}
        {(activeModule === "orientacion" || location.pathname.includes('/orientacion/')) && (
          <div className="mt-4 border-t border-orange/20 pt-4">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Button
                variant={currentStep === 'seleccionar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setActiveModule('orientacion');
                  navigate('/orientacion/seleccionar-test');
                }}
                className={currentStep === 'seleccionar' ? 'bg-primary text-white' : ''}
              >
                <ListChecks className="h-4 w-4 mr-2" />
                Seleccionar Test
              </Button>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <Button
                variant={currentStep === 'ronda1' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('/orientacion/ronda-1')}
                className={currentStep === 'ronda1' ? 'bg-primary text-white' : ''}
                disabled={!localStorage.getItem('sesionId')}
              >
                Ronda 1
              </Button>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <Button
                variant={currentStep === 'ronda2' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('/orientacion/ronda-2')}
                className={currentStep === 'ronda2' ? 'bg-primary text-white' : ''}
                disabled={!localStorage.getItem('sesionId')}
              >
                Ronda 2
              </Button>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <Button
                variant={currentStep === 'resultados' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  const sesionId = localStorage.getItem('sesionId');
                  if (sesionId) {
                    navigate(`/orientacion/resultados/${sesionId}`);
                  }
                }}
                className={currentStep === 'resultados' ? 'bg-primary text-white' : ''}
                disabled={!localStorage.getItem('sesionId')}
              >
                Resultados
              </Button>
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <Button
                variant={currentStep === 'historial' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('/orientacion/historial')}
                className={currentStep === 'historial' ? 'bg-primary text-white' : ''}
              >
                Historial
              </Button>
            </div>
          </div>
        )}
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
                  onClick={() => setActiveModule(item.module)}
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
              {/* Si hay una ruta hija (Outlet), renderizarla, sino mostrar el contenido del módulo activo */}
              {location.pathname.includes('/orientacion/') ? (
                <Outlet />
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