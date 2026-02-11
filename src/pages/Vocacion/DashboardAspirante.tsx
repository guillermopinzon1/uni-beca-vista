import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Target, Users, BookOpen, TrendingUp, Heart, Award, CheckCircle, AlertCircle, Info, FileText, BrainCircuit, Upload, User, LogOut, Settings, Download, Clock, Sparkles, Compass, Link, CheckCircle2, ListChecks, ChevronRight, Plus, X, Loader2, Save, Edit2, GraduationCap, Bell, Calendar, MessageSquare, Mail, Megaphone, ExternalLink } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import { iniciarTest, TipoTest, obtenerMiTrayectoria, actualizarMiTrayectoria, TrayectoriaBody, normalizarTrayectoria, obtenerHistorial, obtenerPerfilVocacional, obtenerSesion, obtenerPreguntasIco, HistorialResponse, type HistorialItem, PerfilVocacionalResponse, MateriasPorAnoLapsoType, MateriaNota, MateriasPorAreaItem } from "@/lib/api/orientacionVocacional";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { fetchUserById } from "@/lib/api/users";
import { convertirAspiranteAEstudiante } from "@/lib/api/auth";
import { RIASEC_LABELS, RIASEC_DESCRIPTIONS } from "@/lib/riasec";
import { obtenerMisNotificaciones, marcarComoLeida, marcarTodasComoLeidas, type Notificacion } from "@/lib/api/notificaciones";
import { obtenerCitasEstudiante, actualizarCita, cancelarCita, type Cita } from "@/lib/api/citas";

import imagenBecas from "@/assets/Universidad-Metropolitana.jpg";

// Helpers para notificaciones (estilo CRM)
const getIconForNotifType = (tipo: string) => {
  switch (tipo) {
    case "evento": return <Calendar className="w-5 h-5 text-blue-500" />;
    case "anuncio": return <Megaphone className="w-5 h-5 text-purple-500" />;
    case "recordatorio": return <AlertCircle className="w-5 h-5 text-orange-500" />;
    case "campana": return <Mail className="w-5 h-5 text-green-500" />;
    case "mensaje": return <MessageSquare className="w-5 h-5 text-pink-500" />;
    default: return <Bell className="w-5 h-5 text-slate-500" />;
  }
};
const getBgForNotifType = (tipo: string) => {
  switch (tipo) {
    case "evento": return "bg-blue-50";
    case "anuncio": return "bg-purple-50";
    case "recordatorio": return "bg-orange-50";
    case "campana": return "bg-green-50";
    case "mensaje": return "bg-pink-50";
    default: return "bg-slate-50";
  }
};
const formatearFechaRelativa = (fecha: string) => {
  const ahora = new Date();
  const f = new Date(fecha);
  const diffMs = ahora.getTime() - f.getTime();
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffD = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffMin < 60) return diffMin <= 1 ? "Hace 1 minuto" : `Hace ${diffMin} minutos`;
  if (diffH < 24) return diffH === 1 ? "Hace 1 hora" : `Hace ${diffH} horas`;
  if (diffD === 1) return "Ayer";
  if (diffD < 7) return `Hace ${diffD} días`;
  return f.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
};
const formatearFechaSegura = (fecha: string | undefined | null): string => {
  if (fecha == null || String(fecha).trim() === "") return "—";
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd/MM/yyyy");
};

const DashboardAspirante = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, tokens, loginSuccess } = useAuth();
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
    materiasPorAnoLapso: {},
    materiasPorArea: [],
  });
  const [trayectoriaLoading, setTrayectoriaLoading] = useState(false);
  const [trayectoriaSaving, setTrayectoriaSaving] = useState(false);
  // Inputs temporales para agregar ítems a listas
  const [nuevaMateria, setNuevaMateria] = useState("");
  const [nuevaActividad, setNuevaActividad] = useState("");
  const [nuevoProyecto, setNuevoProyecto] = useState("");
  // Materias por año/lapso: key "ano-lapso" (ej. "1-1")
  const [newMateriaLapsoInputs, setNewMateriaLapsoInputs] = useState<Record<string, { materia: string; nota: string }>>({});
  // Materias por área: nuevo nombre de área y por cada área índice, inputs para nueva materia
  const [nuevaAreaNombre, setNuevaAreaNombre] = useState("");
  const [newMateriaAreaInputs, setNewMateriaAreaInputs] = useState<Record<number, { nombre: string; nota: string }>>({});
  
  // Estado para Orientación Vocacional
  const [tipoTest, setTipoTest] = useState<TipoTest | null>(null);
  const [cargandoTest, setCargandoTest] = useState(false);

  // Datos del perfil (historial y perfil vocacional) para Mi Perfil
  const [historialPerfil, setHistorialPerfil] = useState<HistorialItem[]>([]);
  const [sesionesEnProgresoPerfil, setSesionesEnProgresoPerfil] = useState<HistorialItem[]>([]);
  const [perfilVocacionalData, setPerfilVocacionalData] = useState<PerfilVocacionalResponse["data"] | null>(null);
  const [cargandoPerfil, setCargandoPerfil] = useState(false);
  const [continuandoTestId, setContinuandoTestId] = useState<string | null>(null);

  // Notificaciones (Centro de novedades / CRM)
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [cargandoNotif, setCargandoNotif] = useState(false);
  const [citasProximas, setCitasProximas] = useState<Cita[]>([]);
  const [citaAccionLoading, setCitaAccionLoading] = useState<string | null>(null);

  // Detectar la ruta actual para mostrar navegación
  const [currentStep, setCurrentStep] = useState<string>("seleccionar");

  // Estados para editar perfil
  const [editarPerfilOpen, setEditarPerfilOpen] = useState(false);
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [perfilEditado, setPerfilEditado] = useState({
    telefono: user?.telefono || '',
    bio: '',
  });

  // Convertir aspirante a estudiante UNIMET
  const [convertirEstudianteOpen, setConvertirEstudianteOpen] = useState(false);
  const [emailUnimet, setEmailUnimet] = useState("");
  const [carreraConvertir, setCarreraConvertir] = useState("");
  const [trimestreConvertir, setTrimestreConvertir] = useState<number | "">("");
  const [convirtiendoEstudiante, setConvirtiendoEstudiante] = useState(false);

  // Estados para preferencias
  const [preferencias, setPreferencias] = useState(() => {
    const saved = localStorage.getItem('preferencias_usuario');
    return saved ? JSON.parse(saved) : {
      modalidad: 'presencial',
      duracion: '5 años',
      areasInteres: ['Tecnología', 'Diseño', 'Innovación']
    };
  });
  const [editandoPreferencias, setEditandoPreferencias] = useState(false);
  const [nuevaArea, setNuevaArea] = useState('');

  // Cargar datos actualizados del usuario al montar el componente
  useEffect(() => {
    const cargarDatosUsuario = async () => {
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      const userId = user?.id;

      if (!userId || !accessToken) return;

      try {
        const userData = await fetchUserById(accessToken, userId);
        // Actualizar el contexto con los datos completos del usuario
        if (userData.success && userData.data && tokens) {
          loginSuccess({
            id: userData.data.id,
            email: userData.data.email,
            nombre: userData.data.nombre,
            apellido: userData.data.apellido || '',
            role: userData.data.role,
            cedula: userData.data.cedula,
            telefono: userData.data.telefono,
            carrera: userData.data.carrera || undefined,
            trimestre: userData.data.semestre || undefined,
            emailVerified: userData.data.emailVerified,
            activo: userData.data.activo,
          }, tokens);
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        // No mostrar error al usuario, los datos antiguos seguirán disponibles
      }
    };

    cargarDatosUsuario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo ejecutar una vez al montar el componente

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
      obtenerHistorial(accessToken).catch(() => ({ success: true, data: { historial: [], sesionesEnProgreso: [], total: 0, totalEnProgreso: 0 } })),
      obtenerPerfilVocacional(accessToken).catch(() => null),
    ])
      .then(([histRes, perfilRes]) => {
        const data = (histRes as HistorialResponse).data;
        const historialData = Array.isArray(data.historial) ? data.historial : [];
        const enProgresoData = Array.isArray(data.sesionesEnProgreso) ? data.sesionesEnProgreso : [];
        setHistorialPerfil(historialData);
        setSesionesEnProgresoPerfil(enProgresoData);
        setPerfilVocacionalData(perfilRes?.data ?? null);

        // Debug: ver qué datos se reciben
        console.log('📊 [Dashboard] Datos del perfil vocacional:', perfilRes);
        console.log('📊 [Dashboard] Historial de tests:', historialData);
      })
      .finally(() => setCargandoPerfil(false));
  }, [activeModule, accessToken]);

  // Cargar notificaciones y citas al entrar al módulo Notificaciones
  useEffect(() => {
    if (activeModule !== "notificaciones") return;
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem("auth_tokens") || "null")?.accessToken;
    if (!accessToken) {
      setCargandoNotif(false);
      return;
    }
    setCargandoNotif(true);
    const promesas: Promise<void>[] = [
      obtenerMisNotificaciones(accessToken, 10)
        .then((res) => setNotificaciones(res.data.notificaciones))
        .catch(() => setNotificaciones([])),
    ];
    if (user?.id) {
      promesas.push(
        obtenerCitasEstudiante(accessToken, user.id)
          .then((res) => {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            const proximas = res.data.citas
              .filter((c) => ["pendiente", "confirmada"].includes(c.estado) && new Date(c.fecha + "T00:00:00") >= hoy)
              .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora));
            setCitasProximas(proximas);
          })
          .catch(() => setCitasProximas([]))
      );
    }
    Promise.all(promesas).finally(() => setCargandoNotif(false));
  }, [activeModule, tokens?.accessToken, user?.id]);

  // Handler para marcar una notificación como leída
  const handleMarcarComoLeida = async (notificacionId: string) => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem("auth_tokens") || "null")?.accessToken;
    if (!accessToken) return;

    try {
      await marcarComoLeida(accessToken, notificacionId);
      // Actualizar el estado local
      setNotificaciones(prev =>
        prev.map(n => n.id === notificacionId ? { ...n, leida: true } : n)
      );
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error);
    }
  };

  // Handler para marcar todas las notificaciones como leídas
  const handleMarcarTodasComoLeidas = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem("auth_tokens") || "null")?.accessToken;
    if (!accessToken) return;

    try {
      await marcarTodasComoLeidas(accessToken);
      // Actualizar el estado local
      setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
    } catch (error) {
      console.error("Error al marcar todas las notificaciones como leídas:", error);
    }
  };

  // Handlers para acciones sobre citas (confirmar / cancelar)
  const handleConfirmarCita = async (citaId: string) => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem("auth_tokens") || "null")?.accessToken;
    if (!accessToken) return;
    setCitaAccionLoading(citaId);
    try {
      await actualizarCita(accessToken, citaId, { estado: "confirmada" });
      setCitasProximas(prev => prev.map(c => c.id === citaId ? { ...c, estado: "confirmada" } : c));
      toast({ title: "Cita confirmada", description: "Tu asistencia ha sido confirmada." });
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message || "No se pudo confirmar la cita.", variant: "destructive" });
    } finally {
      setCitaAccionLoading(null);
    }
  };

  const handleCancelarCita = async (citaId: string) => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem("auth_tokens") || "null")?.accessToken;
    if (!accessToken) return;
    setCitaAccionLoading(citaId);
    try {
      await cancelarCita(accessToken, citaId);
      setCitasProximas(prev => prev.filter(c => c.id !== citaId));
      toast({ title: "Cita cancelada", description: "Tu cita ha sido cancelada." });
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message || "No se pudo cancelar la cita.", variant: "destructive" });
    } finally {
      setCitaAccionLoading(null);
    }
  };

  // Continuar test en progreso (desde pestaña Tests)
  const dondeQuedoTest = (estado: string | undefined, tipoTest: string): string => {
    const e = (estado ?? "").toString().toLowerCase();
    if (tipoTest === "ICO") return "Test ICO en curso";
    if (/ronda_2|ronda_1_completada/.test(e)) return "Ronda 2";
    return "Ronda 1";
  };
  const continuarTestDesdePerfil = async (sesion: HistorialItem) => {
    const id = sesion.id ?? (sesion as unknown as { sesion_id?: string }).sesion_id;
    const tipoTest = (sesion.tipoTest ?? (sesion as unknown as { tipo_test?: string }).tipo_test) ?? "Holland_RIASEC";
    const estado = (sesion.estado ?? "").toString().toLowerCase();
    const acc = tokens?.accessToken || JSON.parse(localStorage.getItem("auth_tokens") || "null")?.accessToken;
    if (!acc || !id) return;
    setContinuandoTestId(String(id));
    try {
      localStorage.setItem("sesionId", String(id));
      localStorage.setItem("tipoTest", tipoTest);
      localStorage.setItem("estadoSesion", sesion.estado ?? "iniciada");
      if (tipoTest === "ICO") {
        const res = await obtenerPreguntasIco(acc, String(id));
        const preguntas = (res?.data as { preguntas?: unknown[] })?.preguntas ?? [];
        localStorage.setItem("preguntasIco", JSON.stringify(preguntas));
        navigate("/orientacion/test-ico");
        return;
      }
      if (tipoTest === "Holland_RIASEC") {
        if (estado === "ronda_1_completada" || estado === "ronda_2") {
          const sesionInfo = await obtenerSesion(acc, String(id));
          const preguntasR2 = (sesionInfo?.data as { preguntasRonda2?: unknown[] })?.preguntasRonda2 ?? [];
          if (preguntasR2.length > 0) {
            localStorage.setItem("preguntasRonda2", JSON.stringify(preguntasR2));
            navigate("/orientacion/ronda-2");
            return;
          }
        }
        navigate("/orientacion/ronda-1");
      }
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? (err as { message: string }).message : "No se pudo cargar el test.";
      toast({ title: "Error al continuar", description: msg, variant: "destructive" });
    } finally {
      setContinuandoTestId(null);
    }
  };

  // Contar notificaciones no leídas
  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;

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
    logout(() => navigate("/"));
  };

  const sidebarItems = [
    {
      title: "Trayectoria académica",
      icon: Upload,
      module: "notas"
    },
    {
      title: "Orientación Vocacional",
      icon: Compass,
      module: "orientacion"
    },
    {
      title: "Chatbot vocacional",
      icon: BrainCircuit,
      module: "tests"
    },
    {
      title: "Notificaciones",
      icon: Bell,
      module: "notificaciones"
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
            materiasPorAnoLapso: normalizada.materiasPorAnoLapso ?? {},
            materiasPorArea: normalizada.materiasPorArea ?? [],
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
        materiasPorAnoLapso: Object.keys(trayectoria.materiasPorAnoLapso || {}).length
          ? trayectoria.materiasPorAnoLapso
          : undefined,
        materiasPorArea: (trayectoria.materiasPorArea?.length && trayectoria.materiasPorArea.length > 0)
          ? trayectoria.materiasPorArea
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

  /** Opciones de grado actual: solo 4to y 5to año. */
  const GRADO_OPCIONES = ["4to año", "5to año"] as const;
  /** Valor interno del Select para "sin selección" (Radix no permite value=""). */
  const GRADO_NINGUNO = "__ninguno__";
  /** Devuelve 4 o 5 según el grado actual; 0 si no hay grado seleccionado. */
  const getMaxAnoFromGrado = (grado: string): number => {
    const g = (grado || "").trim();
    if (!g || g === GRADO_NINGUNO) return 0;
    const i = GRADO_OPCIONES.indexOf(g as typeof GRADO_OPCIONES[number]);
    if (i >= 0) return i + 4; // 4to año -> 4, 5to año -> 5
    const lower = g.toLowerCase();
    if (/5to|quinto/.test(lower)) return 5;
    if (/4to|cuarto/.test(lower)) return 4;
    return 0;
  };
  /** Agrega materia destacada con nota (se guarda como "Materia: nota" para el API). */
  const [nuevaMateriaNota, setNuevaMateriaNota] = useState("");
  const addMateriaDestacada = () => {
    const mat = nuevaMateria?.trim();
    const notaVal = nuevaMateriaNota?.trim();
    if (!mat) return;
    const nota = notaVal !== "" ? notaVal : "—";
    setTrayectoria((prev) => ({
      ...prev,
      materiasDestacadas: [...(prev.materiasDestacadas || []), `${mat}: ${nota}`],
    }));
    setNuevaMateria("");
    setNuevaMateriaNota("");
  };
  const addToList = (key: 'actividadesExtracurriculares' | 'proyectosRealizados', value: string) => {
    const v = value?.trim();
    if (!v) return;
    setTrayectoria((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), v],
    }));
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

  // Función para guardar preferencias
  const handleGuardarPreferencias = () => {
    localStorage.setItem('preferencias_usuario', JSON.stringify(preferencias));
    setEditandoPreferencias(false);
    toast({
      title: "Preferencias guardadas",
      description: "Tus preferencias se han actualizado correctamente.",
    });
  };

  // Función para agregar área de interés
  const handleAgregarArea = () => {
    if (nuevaArea.trim() && !preferencias.areasInteres.includes(nuevaArea.trim())) {
      setPreferencias({
        ...preferencias,
        areasInteres: [...preferencias.areasInteres, nuevaArea.trim()]
      });
      setNuevaArea('');
    }
  };

  // Función para eliminar área de interés
  const handleEliminarArea = (area: string) => {
    setPreferencias({
      ...preferencias,
      areasInteres: preferencias.areasInteres.filter(a => a !== area)
    });
  };

  // Función para guardar edición de perfil
  const handleGuardarPerfil = async () => {
    setEditandoPerfil(true);
    try {
      // Aquí podrías hacer una llamada al backend para actualizar el perfil
      // Por ahora solo guardamos en localStorage
      localStorage.setItem('perfil_editado', JSON.stringify(perfilEditado));
      toast({
        title: "Perfil actualizado",
        description: "Tu información de perfil se ha actualizado correctamente.",
      });
      setEditarPerfilOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setEditandoPerfil(false);
    }
  };

  // Convertir aspirante a estudiante UNIMET
  const handleConvertirAEstudiante = async () => {
    const email = emailUnimet.trim().toLowerCase();
    if (!email) {
      toast({ title: "Campo requerido", description: "Ingresa tu email institucional (@correo.unimet.edu.ve).", variant: "destructive" });
      return;
    }
    if (!email.endsWith("@correo.unimet.edu.ve")) {
      toast({ title: "Email institucional", description: "Debes usar tu correo de estudiante UNIMET (@correo.unimet.edu.ve).", variant: "destructive" });
      return;
    }
    const accessToken = tokens?.accessToken;
    if (!accessToken) {
      toast({ title: "Sesión", description: "Inicia sesión nuevamente para continuar.", variant: "destructive" });
      return;
    }
    setConvirtiendoEstudiante(true);
    try {
      // Armar body solo con valores válidos (evitar "" y tipos incorrectos)
      const body: { emailUnimet: string; carrera?: string; trimestre?: number } = { emailUnimet: email };
      const carreraVal = carreraConvertir.trim();
      if (carreraVal) body.carrera = carreraVal;
      const trimestreNum = trimestreConvertir === "" ? null : Number(trimestreConvertir);
      if (typeof trimestreNum === "number" && !Number.isNaN(trimestreNum) && trimestreNum >= 1 && trimestreNum <= 15) {
        body.trimestre = Math.floor(trimestreNum);
      }
      const res = await convertirAspiranteAEstudiante(accessToken, body);
      const updatedUser = res.data as Parameters<typeof loginSuccess>[0];
      loginSuccess(updatedUser, tokens!);
      setConvertirEstudianteOpen(false);
      setEmailUnimet("");
      setCarreraConvertir("");
      setTrimestreConvertir("");
      toast({
        title: "¡Bienvenido a la UNIMET!",
        description: "Tu cuenta ha sido actualizada a estudiante. Revisa tu correo institucional.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "No se pudo completar la conversión.",
        variant: "destructive",
      });
    } finally {
      setConvirtiendoEstudiante(false);
    }
  };

  // Función para exportar informe
  const handleExportarInforme = () => {
    toast({
      title: "Generando informe",
      description: "Preparando tu informe para imprimir...",
    });

    // Crear contenido del informe
    const informeWindow = window.open('', '_blank');
    if (!informeWindow) {
      toast({
        title: "Error",
        description: "No se pudo abrir la ventana. Verifica los bloqueadores de ventanas emergentes.",
        variant: "destructive",
      });
      return;
    }

    const testsCompletados = historialPerfil.filter((s: HistorialItem) => {
      const e = (s.estado ?? "").toLowerCase();
      const t = s.tipoTest ?? s.tipo_test;
      return t === "ICO" ? (e === "finalizada" || e === "completada") : (e === "finalizada" || e === "ronda_2_completada");
    });

    informeWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Informe de Orientación Vocacional - ${user?.nombre} ${user?.apellido}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
            h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
            h2 { color: #1e40af; margin-top: 30px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            .badge { display: inline-block; padding: 5px 10px; background: #dbeafe; color: #1e40af; border-radius: 5px; margin: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #2563eb; color: white; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
            @media print {
              body { padding: 20px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Informe de Orientación Vocacional</h1>
            <p><strong>${user?.nombre} ${user?.apellido}</strong></p>
            <p>${user?.email}</p>
            <p>Fecha: ${format(new Date(), 'dd/MM/yyyy')}</p>
          </div>

          <div class="section">
            <h2>Resumen del Perfil</h2>
            <p><strong>Tests Completados:</strong> ${testsCompletados.length}</p>
            ${perfilVocacionalData?.resultadoActual?.resultado ? `
              <p><strong>Perfil Dominante:</strong> <span class="badge">${(perfilVocacionalData.resultadoActual.resultado as Record<string, unknown>).perfilDominante ?? (perfilVocacionalData.resultadoActual.resultado as Record<string, unknown>).perfil_dominante ?? "—"}</span></p>
              <p><strong>Código Holland:</strong> <span class="badge">${(perfilVocacionalData.resultadoActual.resultado as Record<string, unknown>).codigoHolland ?? (perfilVocacionalData.resultadoActual.resultado as Record<string, unknown>).codigo_holland ?? "—"}</span></p>
              ${(perfilVocacionalData.resultadoActual.resultado as Record<string, unknown>).perfilSecundario ? `<p><strong>Perfil Secundario:</strong> ${(perfilVocacionalData.resultadoActual.resultado as Record<string, unknown>).perfilSecundario ?? (perfilVocacionalData.resultadoActual.resultado as Record<string, unknown>).perfil_secundario}</p>` : ''}
            ` : '<p>No hay resultados de tests disponibles.</p>'}
          </div>

          ${testsCompletados.length > 0 ? `
          <div class="section">
            <h2>Historial de Tests</h2>
            <table>
              <thead>
                <tr>
                  <th>Tipo de Test</th>
                  <th>Fecha</th>
                  <th>Perfil</th>
                </tr>
              </thead>
              <tbody>
                ${testsCompletados.map((sesion: HistorialItem) => {
                  const tipoTestVal = sesion.tipoTest ?? sesion.tipo_test;
                  const fechaVal = sesion.fechaCompletada ?? sesion.fechaFin ?? sesion.fechaInicio ?? sesion.fecha_fin ?? sesion.fecha_inicio;
                  const perfilVal = sesion.perfilDominante ?? sesion.perfil_dominante ?? '—';
                  const nombreTest = tipoTestVal === "ICO" ? "Test ICO" : "Test Holland RIASEC";
                  return `
                    <tr>
                      <td>${nombreTest}</td>
                      <td>${formatearFechaSegura(fechaVal as string)}</td>
                      <td>${perfilVal}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}

          ${perfilVocacionalData?.resultadoActual?.resultado?.recomendacionesCarreras && perfilVocacionalData.resultadoActual.resultado.recomendacionesCarreras.length > 0 ? `
          <div class="section">
            <h2>Carreras Recomendadas</h2>
            <p><strong>Total de Recomendaciones:</strong> ${perfilVocacionalData.resultadoActual.resultado.recomendacionesCarreras.length}</p>
            <ul>
              ${perfilVocacionalData.resultadoActual.resultado.recomendacionesCarreras.slice(0, 5).map((carrera) => `
                <li><strong>${carrera.name}</strong> - ${carrera.razon}</li>
              `).join('')}
            </ul>
          </div>
          ` : ''}

          <div class="section">
            <h2>Preferencias de Estudio</h2>
            <p><strong>Modalidad:</strong> ${preferencias.modalidad}</p>
            <p><strong>Duración preferida:</strong> ${preferencias.duracion}</p>
            <p><strong>Áreas de interés:</strong> ${preferencias.areasInteres.join(', ')}</p>
          </div>

          <div class="footer">
            <p>Universidad Metropolitana - Sistema de Orientación Vocacional</p>
            <p>Este informe es confidencial y de uso exclusivo para orientación académica.</p>
          </div>

          <button onclick="window.print()" style="margin: 20px auto; display: block; padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Imprimir / Guardar como PDF
          </button>
        </body>
      </html>
    `);
    informeWindow.document.close();
  };

  // Materias por año/lapso: año "1".."5", lapso "1"|"2"|"3"
  const getMateriasLapso = (ano: string, lapso: string): MateriaNota[] =>
    (trayectoria.materiasPorAnoLapso?.[ano]?.[lapso] ?? []) as MateriaNota[];
  const addMateriaLapso = (ano: string, lapso: string, materia: string, nota: number) => {
    if (!materia?.trim()) return;
    setTrayectoria((prev) => {
      const porAno = { ...(prev.materiasPorAnoLapso || {}) };
      if (!porAno[ano]) porAno[ano] = {};
      const lapsos = { ...(porAno[ano] || {}) };
      const list = [...(lapsos[lapso] || []), { materia: materia.trim(), nota }];
      lapsos[lapso] = list;
      porAno[ano] = lapsos;
      return { ...prev, materiasPorAnoLapso: porAno };
    });
  };
  const removeMateriaLapso = (ano: string, lapso: string, index: number) => {
    setTrayectoria((prev) => {
      const porAno = { ...(prev.materiasPorAnoLapso || {}) };
      const lapsos = { ...(porAno[ano] || {}) };
      const list = [...(lapsos[lapso] || [])];
      list.splice(index, 1);
      lapsos[lapso] = list;
      porAno[ano] = lapsos;
      return { ...prev, materiasPorAnoLapso: porAno };
    });
  };
  const setNewMateriaLapso = (ano: string, lapso: string, field: "materia" | "nota", value: string) => {
    const key = `${ano}-${lapso}`;
    setNewMateriaLapsoInputs((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || { materia: "", nota: "" }), [field]: value },
    }));
  };
  const getNewMateriaLapso = (ano: string, lapso: string) =>
    newMateriaLapsoInputs[`${ano}-${lapso}`] || { materia: "", nota: "" };

  // Materias por área (graduados)
  const addArea = () => {
    const nombre = nuevaAreaNombre?.trim();
    if (!nombre) return;
    setTrayectoria((prev) => ({
      ...prev,
      materiasPorArea: [...(prev.materiasPorArea || []), { area: nombre, materias: [] }],
    }));
    setNuevaAreaNombre("");
  };
  const removeArea = (areaIndex: number) => {
    setTrayectoria((prev) => {
      const arr = [...(prev.materiasPorArea || [])];
      arr.splice(areaIndex, 1);
      return { ...prev, materiasPorArea: arr };
    });
    setNewMateriaAreaInputs((prev) => {
      const next = { ...prev };
      delete next[areaIndex];
      return next;
    });
  };
  const addMateriaToArea = (areaIndex: number, nombre: string, nota: number) => {
    if (!nombre?.trim()) return;
    setTrayectoria((prev) => {
      const areas = [...(prev.materiasPorArea || [])];
      if (!areas[areaIndex]) return prev;
      areas[areaIndex] = {
        ...areas[areaIndex],
        materias: [...(areas[areaIndex].materias || []), { nombre: nombre.trim(), nota }],
      };
      return { ...prev, materiasPorArea: areas };
    });
    setNewMateriaAreaInputs((prev) => ({ ...prev, [areaIndex]: { nombre: "", nota: "" } }));
  };
  const removeMateriaFromArea = (areaIndex: number, matIndex: number) => {
    setTrayectoria((prev) => {
      const areas = [...(prev.materiasPorArea || [])];
      if (!areas[areaIndex]) return prev;
      const materias = [...(areas[areaIndex].materias || [])];
      materias.splice(matIndex, 1);
      areas[areaIndex] = { ...areas[areaIndex], materias };
      return { ...prev, materiasPorArea: areas };
    });
  };
  const setNewMateriaArea = (areaIndex: number, field: "nombre" | "nota", value: string) => {
    setNewMateriaAreaInputs((prev) => ({
      ...prev,
      [areaIndex]: { ...(prev[areaIndex] || { nombre: "", nota: "" }), [field]: value },
    }));
  };
  const getNewMateriaArea = (areaIndex: number) =>
    newMateriaAreaInputs[areaIndex] || { nombre: "", nota: "" };

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
          title: "Test ya realizado",
          description: error.message || "Ya completaste este test. Solo puedes realizar uno por tipo.",
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
                Perfil Académico (Bachillerato)
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
                      Estos datos se usan en tu perfil de orientación vocacional.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="gradoActual">Grado actual</Label>
                    <p className="text-sm text-muted-foreground">
                      Selecciona tu grado. A partir de aquí se mostrarán solo los años y lapsos donde puedes cargar materias y notas.
                    </p>
                    <Select
                      value={trayectoria.gradoActual?.trim() && GRADO_OPCIONES.includes(trayectoria.gradoActual?.trim() as (typeof GRADO_OPCIONES)[number]) ? trayectoria.gradoActual?.trim() : GRADO_NINGUNO}
                      onValueChange={(value) => setTrayectoria((prev) => ({ ...prev, gradoActual: value === GRADO_NINGUNO ? "" : value }))}
                    >
                      <SelectTrigger id="gradoActual">
                        <SelectValue placeholder="Selecciona tu grado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={GRADO_NINGUNO}>Selecciona tu grado</SelectItem>
                        {GRADO_OPCIONES.map((g) => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Materias de más interés con la nota */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">Materias de más interés con la nota</Label>
                    <p className="text-sm text-muted-foreground">
                      Agrega las materias de más interés para ti con su calificación (nota 0–20).
                    </p>
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
                    <div className="flex flex-wrap gap-2 items-end">
                      <Input
                        placeholder="Ej: Matemáticas, Física"
                        className="flex-1 min-w-[140px]"
                        value={nuevaMateria}
                        onChange={(e) => setNuevaMateria(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMateriaDestacada())}
                      />
                      <Input
                        type="number"
                        min={0}
                        max={20}
                        step={0.01}
                        placeholder="Nota"
                        className="w-20"
                        value={nuevaMateriaNota}
                        onChange={(e) => setNuevaMateriaNota(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMateriaDestacada())}
                      />
                      <Button type="button" variant="outline" size="icon" onClick={addMateriaDestacada}>
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

                  {/* Materias por año y lapso (solo si hay grado actual; años hasta ese grado) */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Materias y notas por año y lapso</Label>
                    <p className="text-sm text-muted-foreground">
                      Agrega materias con su nota (0–20) por cada año y lapso. Se muestran solo los años hasta el grado que seleccionaste.
                    </p>
                    {getMaxAnoFromGrado(trayectoria.gradoActual ?? "") === 0 ? (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Selecciona tu grado actual arriba para ver los años y lapsos donde cargar materias y notas.
                        </AlertDescription>
                      </Alert>
                    ) : (
                    (["1", "2", "3", "4", "5"] as const)
                      .filter((ano) => Number(ano) <= getMaxAnoFromGrado(trayectoria.gradoActual ?? ""))
                      .map((ano) => (
                      <Card key={ano} className="border-orange/10 p-4">
                        <h4 className="font-medium mb-3">{["1er año", "2do año", "3er año", "4to año", "5to año"][Number(ano) - 1]}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {(["1", "2", "3"] as const).map((lapso) => {
                            const list = getMateriasLapso(ano, lapso);
                            const input = getNewMateriaLapso(ano, lapso);
                            return (
                              <div key={lapso} className="space-y-2 rounded border p-3 bg-muted/30">
                                <span className="text-xs font-medium text-muted-foreground">Lapso {lapso}</span>
                                <ul className="space-y-1 min-h-[2rem]">
                                  {list.map((m, i) => (
                                    <li key={i} className="flex items-center justify-between text-sm">
                                      <span>{m.materia}: {m.nota}</span>
                                      <button type="button" onClick={() => removeMateriaLapso(ano, lapso, i)} className="rounded hover:bg-muted p-1">
                                        <X className="h-3 w-3" />
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                                <div className="flex gap-1 flex-wrap items-center">
                                  <Input
                                    placeholder="Materia"
                                    className="flex-1 min-w-[80px]"
                                    value={input.materia}
                                    onChange={(e) => setNewMateriaLapso(ano, lapso, "materia", e.target.value)}
                                  />
                                  <Input
                                    type="number"
                                    min={0}
                                    max={20}
                                    step={0.01}
                                    placeholder="Nota"
                                    className="w-16"
                                    value={input.nota}
                                    onChange={(e) => setNewMateriaLapso(ano, lapso, "nota", e.target.value)}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                      const n = input.nota === "" ? 0 : parseFloat(input.nota);
                                      if (!Number.isNaN(n) && n >= 0 && n <= 20) {
                                        addMateriaLapso(ano, lapso, input.materia, n);
                                        setNewMateriaLapsoInputs((p) => ({ ...p, [`${ano}-${lapso}`]: { materia: "", nota: "" } }));
                                      }
                                    }}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </Card>
                    )))}
                  </div>

                  {/* Materias por área (graduados) */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Materias por área de formación (graduados)</Label>
                    <p className="text-sm text-muted-foreground">
                      Si ya egresaste, puedes agregar materias como Computación, Inglés Conversacional, Teatro, Informática.
                    </p>
                    <div className="flex gap-2 mb-3">
                      <Input
                        placeholder="Nombre del área (ej. Matemática)"
                        value={nuevaAreaNombre}
                        onChange={(e) => setNuevaAreaNombre(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addArea())}
                      />
                      <Button type="button" variant="outline" onClick={addArea}>
                        <Plus className="h-4 w-4 mr-1" /> Agregar área
                      </Button>
                    </div>
                    {(trayectoria.materiasPorArea || []).map((item, areaIndex) => (
                      <Card key={areaIndex} className="border-orange/10 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{item.area}</h4>
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeArea(areaIndex)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <ul className="space-y-1 mb-3">
                          {(item.materias || []).map((m, matIndex) => (
                            <li key={matIndex} className="flex items-center justify-between text-sm">
                              <span>{m.nombre}: {m.nota}</span>
                              <button type="button" onClick={() => removeMateriaFromArea(areaIndex, matIndex)} className="rounded hover:bg-muted p-1">
                                <X className="h-3 w-3" />
                              </button>
                            </li>
                          ))}
                        </ul>
                        <div className="flex gap-1 flex-wrap items-center">
                          <Input
                            placeholder="Nombre materia"
                            className="flex-1 min-w-[100px]"
                            value={getNewMateriaArea(areaIndex).nombre}
                            onChange={(e) => setNewMateriaArea(areaIndex, "nombre", e.target.value)}
                          />
                          <Input
                            type="number"
                            min={0}
                            max={20}
                            step={0.01}
                            placeholder="Nota"
                            className="w-16"
                            value={getNewMateriaArea(areaIndex).nota}
                            onChange={(e) => setNewMateriaArea(areaIndex, "nota", e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const inp = getNewMateriaArea(areaIndex);
                              const n = inp.nota === "" ? 0 : parseFloat(inp.nota);
                              if (!Number.isNaN(n) && n >= 0 && n <= 20) {
                                addMateriaToArea(areaIndex, inp.nombre, n);
                              }
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
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

    if (activeModule === "notificaciones") {
      return (
        <div className="space-y-6">
          <Card className="border-orange/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Bell className="h-6 w-6" />
                  Notificaciones
                  {notificacionesNoLeidas > 0 && (
                    <Badge className="ml-2 bg-primary/10 text-primary">
                      {notificacionesNoLeidas} sin leer
                    </Badge>
                  )}
                </CardTitle>
                {notificacionesNoLeidas > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-primary/30 text-primary hover:bg-primary/10"
                    onClick={handleMarcarTodasComoLeidas}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Marcar todas como leídas
                  </Button>
                )}
              </div>
              <CardDescription>
                Eventos, anuncios y comunicación de orientación vocacional.
              </CardDescription>
            </CardHeader>
          </Card>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {cargandoNotif ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : notificaciones.length === 0 ? (
                <Card className="border-orange/20">
                  <CardContent className="py-12 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-slate-900 mb-2">No tienes notificaciones</h3>
                    <p className="text-sm text-muted-foreground">
                      Los eventos y anuncios aparecerán aquí.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                notificaciones.map((notif, index) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={`border-orange/20 overflow-hidden ${!notif.leida ? "border-l-4 border-l-primary bg-primary/5" : ""}`}>
                      <CardContent className="p-4 flex gap-4">
                        <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${getBgForNotifType(notif.tipo)}`}>
                          {getIconForNotifType(notif.tipo)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <h3 className="font-semibold text-slate-900">{notif.titulo}</h3>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs text-muted-foreground">{formatearFechaRelativa(notif.fecha_creacion)}</span>
                              {!notif.leida && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs text-primary hover:bg-primary/10"
                                  onClick={() => handleMarcarComoLeida(notif.id)}
                                  title="Marcar como leída"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <div
                            className="text-slate-600 text-sm prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0"
                            dangerouslySetInnerHTML={{ __html: notif.contenido }}
                          />
                          {notif.metadata?.url && notif.metadata?.cta && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 rounded-full border-primary/30 text-primary hover:bg-primary/10"
                              onClick={() => window.open(notif.metadata?.url, "_blank")}
                            >
                              {notif.metadata.cta}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Próximas citas
              </h3>
              {cargandoNotif ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              ) : citasProximas.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="p-4 text-center text-sm text-muted-foreground">
                    No tienes citas próximas agendadas.
                  </CardContent>
                </Card>
              ) : (
                citasProximas.slice(0, 3).map((cita) => {
                  const [y, m, d] = cita.fecha.split("-").map(Number);
                  const fechaCita = new Date(y, m - 1, d);
                  const mes = fechaCita.toLocaleDateString("es-ES", { month: "short" }).toUpperCase();
                  const dia = fechaCita.getDate();
                  const modalidadLabel = ({ presencial: "Presencial", virtual: "Virtual", telefonica: "Telefónica" } as Record<string, string>)[cita.modalidad] ?? cita.modalidad;
                  const motivoLabel = ({
                    orientacion_vocacional: "Orientación Vocacional",
                    revision_resultados: "Revisión de Resultados",
                    opciones_beca: "Info. sobre Becas",
                    plan_estudios: "Plan de Estudios",
                    seguimiento: "Seguimiento",
                    otro: "Otro",
                  } as Record<string, string>)[cita.motivo] ?? cita.motivo;
                  const googleCalendarUrl = (() => {
                    const [hh, mm] = cita.hora.split(":").map(Number);
                    const start = new Date(y, m - 1, d, hh, mm, 0);
                    const end = new Date(y, m - 1, d, hh + 1, mm, 0);
                    const fmt = (dt: Date) =>
                      `${dt.getFullYear()}${String(dt.getMonth() + 1).padStart(2, "0")}${String(dt.getDate()).padStart(2, "0")}T${String(dt.getHours()).padStart(2, "0")}${String(dt.getMinutes()).padStart(2, "0")}00`;
                    const location = ({ presencial: "UNIMET - Oficina de Orientación Vocacional", virtual: "Virtual (enlace a enviar)", telefonica: "Telefónica" } as Record<string, string>)[cita.modalidad] ?? "";
                    const details = cita.especialista
                      ? `Cita de ${motivoLabel} con ${cita.especialista.nombre} ${cita.especialista.apellido}. Modalidad: ${modalidadLabel}.`
                      : `Cita de ${motivoLabel}. Modalidad: ${modalidadLabel}.`;
                    return `https://calendar.google.com/calendar/render?${new URLSearchParams({ action: "TEMPLATE", text: `Cita UNIMET: ${motivoLabel}`, dates: `${fmt(start)}/${fmt(end)}`, details, location })}`;
                  })();
                  return (
                    <Card key={cita.id} className="border-primary/20 overflow-hidden">
                      <div className={`h-1.5 w-full ${cita.estado === "confirmada" ? "bg-green-500" : "bg-primary"}`} />
                      <CardContent className="p-4 space-y-3">
                        <div className="flex gap-3">
                          <div className="text-center px-2.5 py-1 bg-slate-100 rounded-lg shrink-0">
                            <div className="text-xs font-bold text-slate-500 uppercase">{mes}</div>
                            <div className="text-lg font-bold text-slate-900">{dia}</div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-slate-900 leading-tight text-sm">{motivoLabel}</h4>
                            <span className="text-xs text-muted-foreground">{cita.hora} · {modalidadLabel}</span>
                            {cita.especialista && (
                              <p className="text-xs text-slate-500 mt-0.5">
                                Con {cita.especialista.nombre} {cita.especialista.apellido}
                              </p>
                            )}
                          </div>
                          <Badge variant={cita.estado === "confirmada" ? "default" : "secondary"} className="shrink-0 self-start text-xs">
                            {cita.estado === "confirmada" ? "Confirmada" : "Pendiente"}
                          </Badge>
                        </div>
                        {cita.estado === "pendiente" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 h-7 rounded-full text-xs bg-green-600 hover:bg-green-700 text-white gap-1"
                              disabled={citaAccionLoading === cita.id}
                              onClick={() => handleConfirmarCita(cita.id)}
                            >
                              {citaAccionLoading === cita.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                              Confirmar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 h-7 rounded-full text-xs border-red-200 text-red-600 hover:bg-red-50 gap-1"
                              disabled={citaAccionLoading === cita.id}
                              onClick={() => handleCancelarCita(cita.id)}
                            >
                              {citaAccionLoading === cita.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
                              Cancelar
                            </Button>
                          </div>
                        )}
                        <button
                          onClick={() => window.open(googleCalendarUrl, "_blank")}
                          title="Agregar a Google Calendar"
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-primary transition-colors"
                        >
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Añadir al calendario</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </button>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      );
    }
    
    if (activeModule === "perfil") {
      return (
        <div className="relative min-h-[calc(100vh-5rem)]">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-stretch p-4 sm:p-6 lg:p-8">
            
            {/* Tarjeta de perfil - sin avatar */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full lg:w-1/3 space-y-4"
            >
              <Card className="rounded-2xl overflow-hidden shadow-xl border-0 bg-white/95 backdrop-blur-md">
                <div className="h-2 bg-gradient-to-r from-primary to-orange-500" />
                <CardContent className="pt-6 sm:pt-8 pb-6 sm:pb-8 flex flex-col items-center text-center px-4 sm:px-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-orange-500/15 flex items-center justify-center mb-4">
                    <User className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-0.5">
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

                  <Button
                    onClick={() => {
                      setPerfilEditado({
                        telefono: user?.telefono || '',
                        bio: localStorage.getItem('perfil_editado') ? JSON.parse(localStorage.getItem('perfil_editado') || '{}').bio : '',
                      });
                      setEditarPerfilOpen(true);
                    }}
                    className="w-full bg-gradient-to-r from-primary to-orange-dark text-white hover:opacity-90 rounded-full shadow-md hover:shadow-lg transition-all h-10 sm:h-11"
                  >
                    <Settings className="w-4 h-4 mr-2" /> Editar Perfil
                  </Button>

                  {user?.role === 'aspirante' && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEmailUnimet("");
                        setCarreraConvertir("");
                        setTrimestreConvertir("");
                        setConvertirEstudianteOpen(true);
                      }}
                      className="w-full mt-3 rounded-xl h-11 sm:h-12 border-2 border-[#f37021]/40 bg-gradient-to-r from-orange-50 to-amber-50/80 text-[#c45a1a] hover:border-[#f37021] hover:from-orange-100 hover:to-amber-100 hover:text-[#b84f0f] shadow-sm hover:shadow-md transition-all duration-200 font-semibold"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f37021]/15">
                          <GraduationCap className="h-4 w-4 text-[#f37021]" />
                        </span>
                        <span className="text-left">
                          <span className="block leading-tight">Pasar a estudiante</span>
                          <span className="block text-xs font-normal text-slate-500 opacity-90">Universidad Metropolitana</span>
                        </span>
                      </span>
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-xl border-0 bg-white/95 backdrop-blur-md overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-primary/80 to-orange-500/80" />
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
                  ) : (() => {
                    // Buscar perfil dominante en múltiples ubicaciones posibles
                    const resultadoActual = perfilVocacionalData?.resultadoActual as Record<string, unknown>;
                    const resultado = resultadoActual?.resultado as Record<string, unknown>;

                    // Buscar en resultado directamente
                    let perfilDominante = resultado?.perfilDominante || resultado?.perfil_dominante;
                    let codigoHolland = resultado?.codigoHolland || resultado?.codigo_holland;
                    let perfilSecundario = resultado?.perfilSecundario || resultado?.perfil_secundario;

                    // Si no está en resultado, buscar en resultadoActual directamente
                    if (!perfilDominante) {
                      perfilDominante = resultadoActual?.perfilDominante || resultadoActual?.perfil_dominante;
                    }
                    if (!codigoHolland) {
                      codigoHolland = resultadoActual?.codigoHolland || resultadoActual?.codigo_holland;
                    }
                    if (!perfilSecundario) {
                      perfilSecundario = resultadoActual?.perfilSecundario || resultadoActual?.perfil_secundario;
                    }

                    // También buscar en el historial el test más reciente completado
                    const ultimoTestCompletado = historialPerfil.find((s: HistorialItem) => {
                      const estado = (s.estado ?? "").toLowerCase();
                      const tipo = s.tipoTest ?? s.tipo_test;
                      return tipo === "ICO"
                        ? (estado === "finalizada" || estado === "completada")
                        : (estado === "finalizada" || estado === "ronda_2_completada");
                    });

                    const perfilDelHistorial = ultimoTestCompletado?.perfilDominante ?? ultimoTestCompletado?.perfil_dominante;

                    // Usar datos del resultado o del historial
                    const perfilMostrar = perfilDominante || perfilDelHistorial;
                    const codigoMostrar = codigoHolland || (ultimoTestCompletado?.codigoHolland ?? ultimoTestCompletado?.codigo_holland);

                    // Debug: mostrar qué valores se encontraron
                    console.log('🔍 [Resumen] perfilDominante:', perfilDominante);
                    console.log('🔍 [Resumen] codigoHolland:', codigoHolland);
                    console.log('🔍 [Resumen] perfilDelHistorial:', perfilDelHistorial);
                    console.log('🔍 [Resumen] ultimoTestCompletado:', ultimoTestCompletado);

                    if (perfilMostrar || codigoMostrar) {
                      return (
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {perfilMostrar != null && perfilMostrar !== "" && (
                              <Badge className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-xs sm:text-sm">
                                {String(perfilMostrar)}
                              </Badge>
                            )}
                            {codigoMostrar != null && codigoMostrar !== "" && (
                              <Badge className="bg-orange-100 text-orange-700 border border-orange-200 px-2.5 py-1 text-xs sm:text-sm">
                                Código: {String(codigoMostrar)}
                              </Badge>
                            )}
                          </div>
                          {perfilSecundario != null && perfilSecundario !== "" && (
                            <p className="text-xs text-slate-600">
                              Secundario: {String(perfilSecundario)}
                            </p>
                          )}
                        </div>
                      );
                    } else {
                      return (
                        <p className="text-sm text-slate-500">
                          Completa un test de orientación para ver tu perfil dominante y código Holland.
                        </p>
                      );
                    }
                  })()}
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

            {/* Contenido principal Mi Trayectoria */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="w-full lg:w-2/3"
            >
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border-0 min-h-[400px] sm:min-h-[500px] p-4 sm:p-6 md:p-8 overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-primary to-orange-500 rounded-full mb-6" />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Mi Trayectoria</h1>
                        <p className="text-sm sm:text-base text-slate-500">Historial académico y resultados vocacionales</p>
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-full w-full sm:w-auto"
                      onClick={handleExportarInforme}
                    >
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
                      const enProgreso = sesionesEnProgresoPerfil;
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
                      if (enProgreso.length === 0 && completados.length === 0) {
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
                          {enProgreso.length > 0 && (
                            <div className="space-y-2 mb-4">
                              <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-500" />
                                Tests en progreso
                              </h3>
                              {enProgreso.map((sesion: any, idx: number) => {
                                const tipoVal = sesion.tipoTest ?? sesion.tipo_test;
                                const esIco = tipoVal === "ICO";
                                const nombreTest = esIco ? "Test ICO" : "Test Holland RIASEC";
                                const idVal = sesion.id ?? sesion.sesion_id;
                                const donde = dondeQuedoTest(sesion.estado, tipoVal);
                                return (
                                  <div
                                    key={idVal || `prog-${idx}`}
                                    className="border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-amber-400 bg-amber-50/50"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-bold text-slate-900">{nombreTest}</h3>
                                        <Badge className="bg-amber-100 text-amber-800 border-0">En progreso</Badge>
                                      </div>
                                      <p className="text-sm text-slate-600 mt-1">Quedaste en {donde}</p>
                                    </div>
                                    <Button
                                      size="sm"
                                      onClick={() => continuarTestDesdePerfil(sesion)}
                                      disabled={continuandoTestId === String(idVal)}
                                      className="shrink-0 bg-[#F37021] hover:bg-orange-600 text-white"
                                    >
                                      {continuandoTestId === String(idVal) ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Cargando...</>
                                      ) : (
                                        "Continuar"
                                      )}
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          {completados.length > 0 && (
                            <>
                              {enProgreso.length > 0 && (
                                <h3 className="text-sm font-semibold text-slate-700 mt-2 mb-2">Completados</h3>
                              )}
                          {completados.map((sesion: any, index: number) => {
                            const tipoTestVal = sesion.tipoTest ?? sesion.tipo_test;
                            const fechaVal = sesion.fechaFin ?? sesion.fecha_fin ?? sesion.fechaInicio ?? sesion.fecha_inicio;
                            const perfilVal = sesion.perfilDominante ?? sesion.perfil_dominante;
                            const codigoVal = sesion.codigoHolland ?? sesion.codigo_holland;
                            const idVal = sesion.id ?? sesion.sesion_id;
                            const esIco = tipoTestVal === "ICO";
                            const nombreTest = esIco ? "Test ICO" : "Test Holland RIASEC";
                            const descripcionCorta = esIco
                              ? "Intereses y competencias organizacionales"
                              : (perfilVal && RIASEC_DESCRIPTIONS[perfilVal]) || (codigoVal && codigoVal[0] && RIASEC_DESCRIPTIONS[codigoVal[0]]) || "Perfil de intereses vocacionales";
                            const verResultados = () => {
                              if (esIco) navigate("/orientacion/resultados-ico", { state: { sesionId: idVal } });
                              else navigate(`/orientacion/resultados/${idVal}`);
                            };
                            return (
                              <div
                                key={idVal || `sesion-${index}`}
                                className={`border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors border-l-4 ${esIco ? "border-l-blue-500" : "border-l-primary"}`}
                              >
                                <div className="min-w-0 flex-1 space-y-2">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="font-bold text-slate-900">{nombreTest}</h3>
                                    <span className="text-xs sm:text-sm text-slate-500">{formatearFechaSegura(fechaVal)}</span>
                                  </div>
                                  <p className="text-sm text-slate-600 line-clamp-2">{descripcionCorta}</p>
                                  <div className="flex flex-wrap gap-2">
                                    {perfilVal && (
                                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                        Dominante: {RIASEC_LABELS[perfilVal] || perfilVal}
                                      </Badge>
                                    )}
                                    {codigoVal && (
                                      <Badge variant="outline" className="text-slate-700">
                                        Código: {codigoVal}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={verResultados} className="shrink-0 self-start sm:self-center">
                                  Ver Resultados <ChevronRight className="w-3 h-3 ml-1" />
                                </Button>
                              </div>
                            );
                          })}
                            </>
                          )}
                        </>
                      );
                    })()}
                  </TabsContent>

                  <TabsContent value="history">
                    {trayectoriaLoading ? (
                      <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                        <p className="text-slate-600">Cargando historial académico...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Resumen de lo que el usuario colocó en la pestaña Trayectoria académica */}
                        <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-orange-50 border border-primary/20 shadow-sm">
                          <p className="text-sm font-semibold text-slate-700 mb-1">Resumen de lo que registraste en Trayectoria académica</p>
                          <p className="text-xs text-slate-500 mb-3">Esto es lo que tienes guardado en el módulo Trayectoria académica (bachillerato):</p>
                          {(trayectoria.gradoActual || trayectoria.promedioGeneral != null || (trayectoria.materiasDestacadas?.length ?? 0) > 0 || (trayectoria.actividadesExtracurriculares?.length ?? 0) > 0 || (trayectoria.proyectosRealizados?.length ?? 0) > 0 || Object.keys(trayectoria.promediosPorAno || {}).length > 0 || Object.keys(trayectoria.materiasPorAnoLapso || {}).length > 0 || (trayectoria.materiasPorArea?.length ?? 0) > 0) ? (
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-700">
                              {trayectoria.gradoActual && (
                                <span className="flex items-center gap-1">
                                  <GraduationCap className="w-4 h-4 text-primary" />
                                  Grado: {trayectoria.gradoActual}
                                </span>
                              )}
                              {Object.keys(trayectoria.promediosPorAno || {}).length > 0 && (
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="w-4 h-4 text-primary" />
                                  Promedios en {Object.keys(trayectoria.promediosPorAno!).length} año(s)
                                </span>
                              )}
                              {Object.keys(trayectoria.materiasPorAnoLapso || {}).length > 0 && (
                                <span className="flex items-center gap-1">
                                  <BookOpen className="w-4 h-4 text-orange-600" />
                                  {Object.keys(trayectoria.materiasPorAnoLapso!).length} lapso(s) con materias
                                </span>
                              )}
                              {(trayectoria.materiasPorArea?.length ?? 0) > 0 && (
                                <span className="flex items-center gap-1">
                                  <BookOpen className="w-4 h-4 text-orange-600" />
                                  {(trayectoria.materiasPorArea!).length} área(s) académica(s)
                                </span>
                              )}
                              {(trayectoria.materiasDestacadas?.length ?? 0) > 0 && (
                                <span className="flex items-center gap-1">
                                  <BookOpen className="w-4 h-4 text-orange-600" />
                                  {trayectoria.materiasDestacadas!.length} materia{trayectoria.materiasDestacadas!.length !== 1 ? "s" : ""} destacada{trayectoria.materiasDestacadas!.length !== 1 ? "s" : ""}
                                </span>
                              )}
                              {(trayectoria.actividadesExtracurriculares?.length ?? 0) > 0 && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4 text-green-600" />
                                  {trayectoria.actividadesExtracurriculares!.length} actividad{trayectoria.actividadesExtracurriculares!.length !== 1 ? "es" : ""} extracurricular{trayectoria.actividadesExtracurriculares!.length !== 1 ? "es" : ""}
                                </span>
                              )}
                              {(trayectoria.proyectosRealizados?.length ?? 0) > 0 && (
                                <span className="flex items-center gap-1">
                                  <Target className="w-4 h-4 text-purple-600" />
                                  {trayectoria.proyectosRealizados!.length} proyecto{trayectoria.proyectosRealizados!.length !== 1 ? "s" : ""} realizado{trayectoria.proyectosRealizados!.length !== 1 ? "s" : ""}
                                </span>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-600">Aún no has registrado nada en Trayectoria académica. Entra al módulo <strong>Trayectoria académica</strong> en el menú lateral y completa los datos de tu bachillerato.</p>
                          )}
                        </div>
                        {trayectoria.promedioGeneral || Object.keys(trayectoria.promediosPorAno || {}).length > 0 ? (
                          <>
                            <Card className="border-primary/20">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <Award className="w-5 h-5 text-primary" />
                                  Resumen Académico
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                {trayectoria.gradoActual && (
                                  <div className="p-3 bg-slate-50 rounded-lg">
                                    <p className="text-sm text-slate-600 mb-1">Grado Actual</p>
                                    <p className="text-lg font-semibold text-slate-900">{trayectoria.gradoActual}</p>
                                  </div>
                                )}
                                {Object.keys(trayectoria.promediosPorAno || {}).length > 0 && (
                                  <div className="pt-3 border-t">
                                    <p className="text-sm font-medium text-slate-700 mb-2">Promedios por Año</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                      {Object.entries(trayectoria.promediosPorAno || {}).map(([ano, promedio]) => (
                                        <div key={ano} className="p-2 bg-white border rounded-lg text-center">
                                          <p className="text-xs text-slate-500">{ano}</p>
                                          <p className="text-lg font-bold text-primary">{promedio.toFixed(2)}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>

                            {(trayectoria.materiasDestacadas?.length || 0) > 0 && (
                              <Card className="border-orange/20">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-orange-dark" />
                                    Materias de más interés con la nota
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex flex-wrap gap-2">
                                    {trayectoria.materiasDestacadas?.map((materia, i) => (
                                      <Badge key={i} className="bg-orange-100 text-orange-800 border-orange-200">
                                        {materia}
                                      </Badge>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {(trayectoria.actividadesExtracurriculares?.length || 0) > 0 && (
                              <Card className="border-green-200">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base flex items-center gap-2">
                                    <Users className="w-4 h-4 text-green-600" />
                                    Actividades Extracurriculares
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex flex-wrap gap-2">
                                    {trayectoria.actividadesExtracurriculares?.map((actividad, i) => (
                                      <Badge key={i} className="bg-green-100 text-green-800 border-green-200">
                                        {actividad}
                                      </Badge>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {(trayectoria.proyectosRealizados?.length || 0) > 0 && (
                              <Card className="border-purple-200">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base flex items-center gap-2">
                                    <Target className="w-4 h-4 text-purple-600" />
                                    Proyectos Realizados
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <ul className="space-y-2">
                                    {trayectoria.proyectosRealizados?.map((proyecto, i) => (
                                      <li key={i} className="flex items-start gap-2 p-2 bg-purple-50 rounded-lg">
                                        <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm text-slate-700">{proyecto}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </CardContent>
                              </Card>
                            )}

                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => setActiveModule("notas")}
                            >
                              <Edit2 className="w-4 h-4 mr-2" />
                              Actualizar Trayectoria Académica
                            </Button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-4">
                              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Sin Historial Académico</h3>
                            <p className="text-sm sm:text-base text-slate-600 max-w-sm mx-auto px-4 mb-4">
                              Aún no has registrado tu trayectoria académica. Completa tus datos para enriquecer tu perfil.
                            </p>
                            <Button
                              onClick={() => setActiveModule("notas")}
                              className="bg-primary hover:bg-primary/90"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Agregar Trayectoria
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="preferences">
                    <div className="space-y-4">
                      <div className="p-4 sm:p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl sm:rounded-2xl border-2 border-pink-100 shadow-md">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <h3 className="font-bold text-lg sm:text-xl text-slate-900 flex items-center gap-2">
                            <Heart className="w-5 h-5 text-pink-600" />
                            Preferencias de Estudio
                          </h3>
                          <Button
                            variant={editandoPreferencias ? "default" : "outline"}
                            size="sm"
                            onClick={() => setEditandoPreferencias(!editandoPreferencias)}
                          >
                            {editandoPreferencias ? (
                              <>
                                <X className="w-4 h-4 mr-1" />
                                Cancelar
                              </>
                            ) : (
                              <>
                                <Edit2 className="w-4 h-4 mr-1" />
                                Editar
                              </>
                            )}
                          </Button>
                        </div>

                        {editandoPreferencias ? (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="modalidad">Modalidad de Estudio</Label>
                              <select
                                id="modalidad"
                                value={preferencias.modalidad}
                                onChange={(e) => setPreferencias({ ...preferencias, modalidad: e.target.value })}
                                className="w-full p-2 border rounded-lg bg-white"
                              >
                                <option value="presencial">Presencial</option>
                                <option value="virtual">Virtual</option>
                                <option value="hibrido">Híbrido</option>
                              </select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="duracion">Duración Preferida</Label>
                              <select
                                id="duracion"
                                value={preferencias.duracion}
                                onChange={(e) => setPreferencias({ ...preferencias, duracion: e.target.value })}
                                className="w-full p-2 border rounded-lg bg-white"
                              >
                                <option value="3 años">3 años</option>
                                <option value="4 años">4 años</option>
                                <option value="5 años">5 años</option>
                                <option value="6 años o más">6 años o más</option>
                              </select>
                            </div>

                            <div className="space-y-2">
                              <Label>Áreas de Interés</Label>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {preferencias.areasInteres.map((area: string, i: number) => (
                                  <Badge key={i} variant="secondary" className="pl-2 pr-1 py-1">
                                    {area}
                                    <button
                                      type="button"
                                      onClick={() => handleEliminarArea(area)}
                                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Agregar nueva área de interés"
                                  value={nuevaArea}
                                  onChange={(e) => setNuevaArea(e.target.value)}
                                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAgregarArea())}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={handleAgregarArea}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <Button
                              onClick={handleGuardarPreferencias}
                              className="w-full bg-gradient-to-r from-primary to-orange-dark text-white"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Guardar Preferencias
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2.5 sm:space-y-3 text-sm sm:text-base">
                            <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-white/70 rounded-lg">
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                              <span className="font-semibold text-slate-700">Modalidad:</span>
                              <span className="text-slate-600">{preferencias.modalidad}</span>
                            </div>
                            <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-white/70 rounded-lg">
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                              <span className="font-semibold text-slate-700">Duración preferida:</span>
                              <span className="text-slate-600">{preferencias.duracion}</span>
                            </div>
                            <div className="p-2.5 sm:p-3 bg-white/70 rounded-lg">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                                <span className="font-semibold text-slate-700">Áreas de interés:</span>
                              </div>
                              <div className="flex flex-wrap gap-2 ml-5">
                                {preferencias.areasInteres.map((area: string, i: number) => (
                                  <Badge key={i} className="bg-primary/10 text-primary">
                                    {area}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
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
          <div
            className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer"
            onClick={() => navigate("/")}
          >
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
        <main className="flex-1 px-6 py-8 relative">
          {/* Fondo solo en Perfil: capa a ancho completo sin tapar sidebar; estructura igual que el resto */}
          {activeModule === "perfil" && (
            <div className="absolute inset-0 z-0" aria-hidden="true">
              <img src={imagenBecas} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-slate-900/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-background/30" />
            </div>
          )}
          <div className="relative z-10 max-w-6xl mx-auto">
            <div className="pt-0">
              {/* Orientación: barra de progreso solo cuando ya estás en un test (RIASEC o ICO), no en selección */}
              {location.pathname.includes('/orientacion/') ? (
                <>
                  {/* Barra de progreso: ocultar en pantalla de seleccionar test; mostrar la que corresponda según ruta */}
                  {(() => {
                    const path = location.pathname;
                    const enFlujoTest = path.includes('ronda-1') || path.includes('ronda-2') || path.includes('test-ico');
                    if (!enFlujoTest) return null;

                    const enFlujoIco = path.includes('test-ico');
                    const enFlujoHolland = path.includes('ronda-1') || path.includes('ronda-2');
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

      {/* Dialog para Editar Perfil */}
      <Dialog open={editarPerfilOpen} onOpenChange={setEditarPerfilOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Editar Perfil
            </DialogTitle>
            <DialogDescription>
              Actualiza tu información personal. Los cambios se guardarán en tu perfil.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-telefono">Teléfono</Label>
              <Input
                id="edit-telefono"
                placeholder="Ej: +58 412 123 4567"
                value={perfilEditado.telefono}
                onChange={(e) => setPerfilEditado({ ...perfilEditado, telefono: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-bio">Biografía / Descripción Personal</Label>
              <Textarea
                id="edit-bio"
                placeholder="Cuéntanos un poco sobre ti, tus metas y aspiraciones..."
                value={perfilEditado.bio}
                onChange={(e) => setPerfilEditado({ ...perfilEditado, bio: e.target.value })}
                rows={4}
                className="resize-none"
              />
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Algunos campos como nombre, email y cédula solo pueden ser modificados por un administrador.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditarPerfilOpen(false)}
              disabled={editandoPerfil}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleGuardarPerfil}
              disabled={editandoPerfil}
              className="bg-gradient-to-r from-primary to-orange-dark text-white"
            >
              {editandoPerfil ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para convertir aspirante a estudiante UNIMET */}
      <Dialog open={convertirEstudianteOpen} onOpenChange={setConvertirEstudianteOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              Pasar a estudiante de la Universidad Metropolitana
            </DialogTitle>
            <DialogDescription>
              Si ya ingresaste a la UNIMET, actualiza tu cuenta con tu correo institucional (@correo.unimet.edu.ve). Tu rol pasará de aspirante a estudiante.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email-unimet">Email institucional UNIMET *</Label>
              <Input
                id="email-unimet"
                type="email"
                placeholder="tu.nombre@correo.unimet.edu.ve"
                value={emailUnimet}
                onChange={(e) => setEmailUnimet(e.target.value)}
                disabled={convirtiendoEstudiante}
              />
              <p className="text-xs text-slate-500">Debe ser @correo.unimet.edu.ve</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="carrera-convertir">Carrera (opcional)</Label>
              <Input
                id="carrera-convertir"
                placeholder="Ej: Ingeniería de Sistemas"
                value={carreraConvertir}
                onChange={(e) => setCarreraConvertir(e.target.value)}
                disabled={convirtiendoEstudiante}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trimestre-convertir">Trimestre (opcional, 1-15)</Label>
              <Input
                id="trimestre-convertir"
                type="number"
                min={1}
                max={15}
                placeholder="Ej: 1"
                value={trimestreConvertir === "" ? "" : trimestreConvertir}
                onChange={(e) => setTrimestreConvertir(e.target.value === "" ? "" : Math.min(15, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                disabled={convirtiendoEstudiante}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConvertirEstudianteOpen(false)}
              disabled={convirtiendoEstudiante}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConvertirAEstudiante}
              disabled={convirtiendoEstudiante || !emailUnimet.trim()}
              className="bg-gradient-to-r from-primary to-orange-dark text-white"
            >
              {convirtiendoEstudiante ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Convertir a estudiante
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardAspirante;