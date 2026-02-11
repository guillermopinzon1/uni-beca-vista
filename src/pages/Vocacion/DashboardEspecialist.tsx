import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Target, Users, BookOpen, TrendingUp, Heart, Award, CheckCircle, AlertCircle, Info, FileText, BrainCircuit, Upload, User, LogOut, Search, Filter, Calendar, MessageSquare, Mail, BarChart, Download, Megaphone, Sparkles, ChevronRight, ArrowUpRight, GraduationCap, Loader2, X, Plus, FileQuestion, BookMarked, Bold, Italic, Underline, List } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useEffect, useRef } from "react";
import ReglamentoAccess from "@/components/shared/ReglamentoAccess";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import ConsultaLLM from "@/components/OrientacionVocacional/ConsultaLLM";
import RecomendacionesCarrera from "@/components/OrientacionVocacional/RecomendacionesCarrera";
import ChatOrientacion from "@/components/OrientacionVocacional/ChatOrientacion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { obtenerHistorialEspecialista, HistorialEspecialistaResponse, type RecomendacionCarrera } from "@/lib/api/orientacionVocacional";
import { enviarGrupoPredefinido, obtenerEstadisticas, segmentarEstudiantes, enviarCampana } from "@/lib/api/campanas";
import type { Estudiante, FiltrosSegmentacion } from "@/lib/api/campanas";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getUserProfile, type UserProfileResponse } from "@/lib/api/auth";
import { agendarCita, obtenerMisCitas, actualizarCita, type Cita } from "@/lib/api/citas";
import {
  listarPreguntas,
  obtenerPregunta,
  crearPregunta,
  actualizarPregunta,
  desactivarPregunta,
  existeCodigoPregunta,
  normalizarInstruccionesParaForm,
  type PreguntaItem,
  type CrearPreguntaBody,
  type TipoTestPregunta,
  type DimensionRIASEC,
  type TipoInstruccionesRespuesta,
  type InstruccionesRespuestaValue,
} from "@/lib/api/preguntas";
import {
  listarCareers,
  obtenerCareer,
  crearCareer,
  actualizarCareer,
  desactivarCareer,
  type CareerListItem,
  type CrearCarreraBody,
} from "@/lib/api/careers";

const MOTIVOS_LEGIBLES: Record<string, string> = {
  orientacion_vocacional: "Orientación Vocacional",
  revision_resultados: "Revisión de Resultados de Test",
  opciones_beca: "Información sobre Becas",
  plan_estudios: "Plan de Estudios",
  seguimiento: "Seguimiento General",
  otro: "Otro",
};

const formatearMotivo = (motivo: string): string =>
  MOTIVOS_LEGIBLES[motivo] || motivo.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());

// Templates visuales para campañas de correo
const TEMPLATES_EMAIL = [
  {
    id: 'clasico',
    nombre: 'Clásico',
    descripcion: 'Verde institucional',
    headerColor: '#0d9488',
    btnColor: '#0d9488',
    bgColor: '#f0fdfa',
    previewBg: 'bg-teal-600',
    previewAccent: 'bg-teal-100',
  },
  {
    id: 'universitario',
    nombre: 'Universitario',
    descripcion: 'Azul académico',
    headerColor: '#1d4ed8',
    btnColor: '#1d4ed8',
    bgColor: '#eff6ff',
    previewBg: 'bg-blue-700',
    previewAccent: 'bg-blue-100',
  },
  {
    id: 'motivacional',
    nombre: 'Motivacional',
    descripcion: 'Púrpura dinámico',
    headerColor: '#7c3aed',
    btnColor: '#7c3aed',
    bgColor: '#f5f3ff',
    previewBg: 'bg-violet-600',
    previewAccent: 'bg-violet-100',
  },
  {
    id: 'profesional',
    nombre: 'Profesional',
    descripcion: 'Elegante oscuro',
    headerColor: '#1e293b',
    btnColor: '#334155',
    bgColor: '#f8fafc',
    previewBg: 'bg-slate-800',
    previewAccent: 'bg-slate-200',
  },
  {
    id: 'calido',
    nombre: 'Cálido',
    descripcion: 'Naranja amigable',
    headerColor: '#ea580c',
    btnColor: '#ea580c',
    bgColor: '#fff7ed',
    previewBg: 'bg-orange-500',
    previewAccent: 'bg-orange-100',
  },
] as const;

type TemplateId = typeof TEMPLATES_EMAIL[number]['id'];

// Interface para mapear datos del backend (soporta Holland e ICO)
interface StudentData {
  id: string;
  name: string;
  career_interest: string;
  status: string;
  last_test: string;
  result: string;
  risk_level: "Alto" | "Medio" | "Bajo";
  avatar: string;
  email: string;
  codigoHolland: string;
  /** Total de tests completados (Holland + ICO) */
  totalSesiones: number;
  recomendacionesCarreras: RecomendacionCarrera[];
  /** Tests Holland RIASEC completados (si el backend lo envía) */
  sesionesHolland?: number;
  /** Tests ICO completados (si el backend lo envía) */
  sesionesIco?: number;
  /** Etiqueta para mostrar tipo del último test: "Holland", "ICO" o null */
  ultimoTipoTestLabel?: string | null;
}

const DashboardEspecialist = () => {
  const navigate = useNavigate();
  const { user, logout, tokens } = useAuth();
  const { toast } = useToast();
  const [activeModule, setActiveModule] = useState<string>("estudiantes");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAdmissions, setLoadingAdmissions] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtrosEstudiantes, setFiltrosEstudiantes] = useState<{
    nivelRiesgo: string;
    perfilHolland: string;
  }>({
    nivelRiesgo: '',
    perfilHolland: ''
  });
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const STUDENTS_PER_PAGE = 15;
  const [studentsPage, setStudentsPage] = useState(1);
  const [admissionsData, setAdmissionsData] = useState<HistorialEspecialistaResponse['data']>([]);
  const [notasColegio, setNotasColegio] = useState({
    primerAno: "",
    segundoAno: "",
    tercerAno: "",
    cuartoAno: "",
    promedio: ""
  });
  const [estadisticasCampanas, setEstadisticasCampanas] = useState({
    facultadIngenieria: 0,
    facultadCienciasEconomicas: 0,
    facultadCiencias: 0,
    facultadHumanidades: 0,
    facultadEstudiosJuridicos: 0,
    total: 0
  });
  const [loadingCampanas, setLoadingCampanas] = useState(false);
  const [modalCampanaAbierto, setModalCampanaAbierto] = useState(false);
  const [campanaSeleccionada, setCampanaSeleccionada] = useState<{
    grupo: 'facultad_ingenieria' | 'facultad_ciencias_economicas' | 'facultad_ciencias' | 'facultad_humanidades' | 'facultad_estudios_juridicos';
    nombreGrupo: string;
    titulo: string;
    asunto: string;
    contenido: string;
    ctaTexto: string;
    ctaUrl: string;
    templateId: TemplateId;
  } | null>(null);

  // Estados para segmentación personalizada
  const [filtrosSegmentacion, setFiltrosSegmentacion] = useState<FiltrosSegmentacion>({});
  const [resultadoSegmentacion, setResultadoSegmentacion] = useState<Estudiante[] | null>(null);
  const [loadingSegmentacion, setLoadingSegmentacion] = useState(false);
  const [modalCampanaPersonalizada, setModalCampanaPersonalizada] = useState(false);
  const [campanaPersonalizada, setCampanaPersonalizada] = useState<{
    titulo: string;
    asunto: string;
    contenido: string;
    ctaTexto: string;
    ctaUrl: string;
    templateId: TemplateId;
  }>({
    titulo: "",
    asunto: "",
    contenido: "",
    ctaTexto: "",
    ctaUrl: "",
    templateId: "clasico"
  });
  const textareaSegmentadaRef = useRef<HTMLTextAreaElement>(null);
  const textareaGrupoRef = useRef<HTMLTextAreaElement>(null);
  const [seleccionGrupo, setSeleccionGrupo] = useState({ start: 0, end: 0 });
  const [seleccionSegmentada, setSeleccionSegmentada] = useState({ start: 0, end: 0 });
  const [perfilCompleto, setPerfilCompleto] = useState<UserProfileResponse['data'] | null>(null);
  const [loadingPerfil, setLoadingPerfil] = useState(false);

  // Estados para el modal de agendar cita
  const [modalCitaAbierto, setModalCitaAbierto] = useState(false);
  const [datosCita, setDatosCita] = useState({
    fecha: "",
    hora: "",
    modalidad: "presencial",
    motivo: "",
    notas: ""
  });
  const [loadingCita, setLoadingCita] = useState(false);

  // Estados para el módulo de agenda
  const [citasAgendadas, setCitasAgendadas] = useState<Cita[]>([]);
  const [loadingCitas, setLoadingCitas] = useState(false);
  const [filtroEstadoCita, setFiltroEstadoCita] = useState<string>("todas");

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

  // Módulo Preguntas de tests
  const [preguntasList, setPreguntasList] = useState<PreguntaItem[]>([]);
  const [preguntasLoading, setPreguntasLoading] = useState(false);
  const [preguntasPagination, setPreguntasPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [preguntasFilters, setPreguntasFilters] = useState<{ tipo_test: TipoTestPregunta | ""; dimension_principal: DimensionRIASEC | ""; activa: "" | boolean }>({ tipo_test: "", dimension_principal: "", activa: "" });
  const [modalPreguntaAbierto, setModalPreguntaAbierto] = useState(false);
  const [preguntaEdit, setPreguntaEdit] = useState<PreguntaItem | null>(null);
  const [formPregunta, setFormPregunta] = useState<
    CrearPreguntaBody & {
      id?: string;
      instrucciones_respuesta_tipo?: TipoInstruccionesRespuesta;
      instrucciones_respuesta_opciones?: string[];
    }
  >({
    codigo_pregunta: "",
    tipo_test: "Holland_RIASEC",
    dimension_principal: "Realista",
    texto__pregunta: "",
    tipo_pregunta: "directa",
    peso_pregunta: "media",
    activa: true,
    instrucciones_respuesta_tipo: "si_no",
    instrucciones_respuesta_opciones: ["Sí", "No"],
  });
  const [guardandoPregunta, setGuardandoPregunta] = useState(false);
  const [uploadPreguntasLoading, setUploadPreguntasLoading] = useState(false);
  const [uploadPreguntasResult, setUploadPreguntasResult] = useState<{ creadas: number; duplicados: number; errores: string[] } | null>(null);
  const fileInputPreguntasRef = useRef<HTMLInputElement>(null);
  const [busquedaCodigoPregunta, setBusquedaCodigoPregunta] = useState("");
  const [guiaCSVPreguntasTab, setGuiaCSVPreguntasTab] = useState<"descargar" | "subir" | null>(null);
  const [exportandoPreguntas, setExportandoPreguntas] = useState(false);
  const [preguntaADesactivar, setPreguntaADesactivar] = useState<PreguntaItem | null>(null);
  const [carreraADesactivar, setCarreraADesactivar] = useState<CareerListItem | null>(null);
  const [desactivandoPregunta, setDesactivandoPregunta] = useState(false);
  const [desactivandoCarrera, setDesactivandoCarrera] = useState(false);

  // Módulo Carreras
  const [careersList, setCareersList] = useState<CareerListItem[]>([]);
  const [careersLoading, setCareersLoading] = useState(false);
  const [careersPagination, setCareersPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [careersFilters, setCareersFilters] = useState<{ q: string; faculty: string; area: string; incluir_inactivas: boolean }>({ q: "", faculty: "", area: "", incluir_inactivas: false });
  const [modalCarreraAbierto, setModalCarreraAbierto] = useState(false);
  const [carreraEdit, setCarreraEdit] = useState<CareerListItem | null>(null);
  const [formCarrera, setFormCarrera] = useState<CrearCarreraBody & { is_active?: boolean }>({
    name: "",
    faculty: "",
    code: "",
    area: "",
    description: "",
    duration: "",
    modality: "",
  });
  const [guardandoCarrera, setGuardandoCarrera] = useState(false);

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

  // Función para formatear fecha (evita NaN Invalid Date)
  const formatDate = (dateString: string) => {
    if (!dateString || String(dateString).trim() === "" || dateString === "null" || dateString === "undefined") return "—";
    try {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return "—";
      const day = date.getDate();
      const month = date.toLocaleString('es-ES', { month: 'short' });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch {
      return "—";
    }
  };

  // Función para obtener iniciales del nombre
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Función para determinar el nivel de riesgo basado en el perfil
  const getRiskLevel = (perfilDominante: string | undefined, totalSesiones: number): "Alto" | "Medio" | "Bajo" => {
    const perfil = (perfilDominante ?? "").trim();
    if (totalSesiones > 2) return "Bajo";
    if (perfil.length > 10) return "Bajo";
    if (totalSesiones === 1 && perfil.length < 3) return "Alto";
    return "Medio";
  };

  // Función para determinar el estado basado en los datos
  const getStatus = (totalSesiones: number, ultimaFechaTest: string): string => {
    if (!ultimaFechaTest || ultimaFechaTest === "null" || ultimaFechaTest === "undefined") {
      return totalSesiones >= 2 ? "Orientación Completada" : "En Proceso";
    }
    const lastDate = new Date(ultimaFechaTest);
    if (Number.isNaN(lastDate.getTime())) return "En Proceso";
    const daysSinceLastTest = Math.floor(
      (new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceLastTest > 30) return "Requiere Asesoría";
    if (daysSinceLastTest > 14) return "En Seguimiento";
    if (totalSesiones >= 2) return "Orientación Completada";
    return "En Proceso";
  };

  // Cargar datos del historial
  useEffect(() => {
    const cargarHistorial = async () => {
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

      const isLoadingEstudiantes = activeModule === "estudiantes";
      const isLoadingAdmissions = activeModule === "admissions";

      if (isLoadingEstudiantes) setLoading(true);
      if (isLoadingAdmissions) setLoadingAdmissions(true);

      try {
        const respuesta = await obtenerHistorialEspecialista(accessToken);
        // Aceptar data como array; backend puede devolver snake_case
        const rawData = Array.isArray(respuesta?.data) ? respuesta.data : [];
        
        // Guardar datos crudos para el módulo de admissions (normalizar keys)
        if (isLoadingAdmissions) {
          setAdmissionsData(rawData.map((item: any) => ({
            estudiante: item.estudiante ?? {},
            perfilDominante: item.perfilDominante ?? item.perfil_dominante ?? "",
            codigoHolland: item.codigoHolland ?? item.codigo_holland ?? "",
            recomendacionesCarreras: item.recomendacionesCarreras ?? item.recomendaciones_carreras ?? [],
            totalSesiones: item.totalSesiones ?? item.total_sesiones ?? 0,
            ultimaFechaTest: item.ultimaFechaTest ?? item.ultima_fecha_test ?? "",
          })));
        }
        
        // Mapear datos del backend a la estructura del componente para estudiantes
        if (isLoadingEstudiantes) {
          const estudiantesMapeados: StudentData[] = rawData.map((item: any) => {
            const estudiante = item.estudiante ?? {};
            const id = estudiante.id ?? estudiante.user_id ?? "";
            const nombre = ((estudiante.nombre ?? estudiante.name ?? "").trim() || estudiante.email) ?? "Estudiante";
            const email = (estudiante.email ?? "").trim();
            const recs = item.recomendacionesCarreras ?? item.recomendaciones_carreras ?? [];
            const recsNormalized: RecomendacionCarrera[] = Array.isArray(recs)
              ? recs.map((c: any, idx: number) => ({
                  id: c.id ?? idx,
                  name: (c.name ?? c.nombre ?? "Carrera recomendada").trim(),
                  razon: (c.razon ?? c.razón ?? "").trim(),
                  faculty: c.faculty ?? c.facultad,
                  facultad: c.facultad ?? c.faculty,
                  area: (c.area ?? "").trim(),
                }))
              : [];
            const careerInterest = recsNormalized.length > 0 ? recsNormalized[0].name : "Indeciso";
            const perfilDominante = (item.perfilDominante ?? item.perfil_dominante ?? "").trim();
            const codigoHolland = (item.codigoHolland ?? item.codigo_holland ?? "N/A").trim();
            const totalSesiones = Number(item.totalSesiones ?? item.total_sesiones ?? 0) || 0;
            const ultimaFechaTest = item.ultimaFechaTest ?? item.ultima_fecha_test ?? "";
            const sesionesHolland = Number(item.sesionesHolland ?? item.sesiones_holland ?? item.total_sesiones_holland ?? 0) || 0;
            const sesionesIco = Number(item.sesionesIco ?? item.sesiones_ico ?? item.total_sesiones_ico ?? 0) || 0;
            const ultimoTipoTest = (item.ultimoTipoTest ?? item.ultimo_tipo_test ?? item.tipo_ultimo_test ?? "").toString().toUpperCase();
            const ultimoTipoTestLabel =
              ultimoTipoTest === "ICO" ? "ICO" : ultimoTipoTest.includes("HOLLAND") || ultimoTipoTest === "HOLLAND_RIASEC" ? "Holland" : null;

            return {
              id: String(id),
              name: nombre,
              email: email,
              career_interest: careerInterest,
              status: getStatus(totalSesiones, ultimaFechaTest),
              last_test: formatDate(ultimaFechaTest) || "—",
              result: perfilDominante ? `Perfil ${perfilDominante}` : "Sin perfil",
              risk_level: getRiskLevel(perfilDominante, totalSesiones),
              avatar: getInitials(nombre),
              codigoHolland: codigoHolland || "N/A",
              totalSesiones,
              recomendacionesCarreras: recsNormalized,
              sesionesHolland: sesionesHolland > 0 ? sesionesHolland : undefined,
              sesionesIco: sesionesIco > 0 ? sesionesIco : undefined,
              ultimoTipoTestLabel: ultimoTipoTestLabel ?? undefined,
            };
          });

          setStudents(estudiantesMapeados);
        }
      } catch (error: any) {
        console.error('Error al cargar historial:', error);
        toast({
          title: "Error",
          description: error.message || "Error al cargar el historial de estudiantes",
          variant: "destructive",
        });
      } finally {
        if (isLoadingEstudiantes) setLoading(false);
        if (isLoadingAdmissions) setLoadingAdmissions(false);
      }
    };

    if (activeModule === "estudiantes" || activeModule === "admissions") {
      cargarHistorial();
    }
  }, [activeModule, tokens, navigate, toast]);

  // Calcular estadísticas de admisiones
  const calcularEstadisticasAdmisiones = () => {
    const totalAspirantes = admissionsData.length;
    
    // Interés Alto: estudiantes con perfil dominante claro y múltiples sesiones
    const interesAlto = admissionsData.filter(item => 
      item.totalSesiones >= 2 && 
      item.recomendacionesCarreras.length >= 2 &&
      item.perfilDominante && item.perfilDominante.length > 5
    ).length;

    // Identificados como potenciales: todos los que completaron al menos 1 test
    const potenciales = admissionsData.filter(item => item.totalSesiones >= 1).length;
    const porcentajePotenciales = totalAspirantes > 0 
      ? Math.round((potenciales / totalAspirantes) * 100) 
      : 0;

    // Contactados/Invitados: estudiantes con múltiples sesiones (asumiendo que fueron contactados)
    const contactados = admissionsData.filter(item => item.totalSesiones >= 2).length;
    const porcentajeContactados = totalAspirantes > 0 
      ? Math.round((contactados / totalAspirantes) * 100) 
      : 0;

    // Proyectado matriculados: estimación conservadora (30% de los contactados)
    const proyectadoMatriculados = Math.round(contactados * 0.3);
    const porcentajeMatriculados = totalAspirantes > 0 
      ? Math.round((proyectadoMatriculados / totalAspirantes) * 100) 
      : 0;

    return {
      totalAspirantes,
      interesAlto,
      contactados,
      proyectadoMatriculados,
      potenciales,
      porcentajePotenciales,
      porcentajeContactados,
      porcentajeMatriculados
    };
  };

  // Calcular probabilidad de matrícula basada en perfil
  const calcularProbabilidad = (item: HistorialEspecialistaResponse['data'][0]): { nivel: string; porcentaje: number } => {
    let score = 0;
    
    // Más sesiones = mayor probabilidad
    if (item.totalSesiones >= 3) score += 40;
    else if (item.totalSesiones === 2) score += 25;
    else score += 10;

    // Perfil dominante claro
    if (item.perfilDominante && item.perfilDominante.length > 8) score += 30;
    else if (item.perfilDominante && item.perfilDominante.length > 5) score += 15;

    // Múltiples recomendaciones
    if (item.recomendacionesCarreras.length >= 3) score += 30;
    else if (item.recomendacionesCarreras.length >= 2) score += 15;

    if (score >= 80) return { nivel: "Muy Alta", porcentaje: 95 };
    if (score >= 60) return { nivel: "Alta", porcentaje: 85 };
    if (score >= 40) return { nivel: "Media", porcentaje: 65 };
    return { nivel: "Baja", porcentaje: 45 };
  };

  const sidebarItems = [
    {
      title: "Gestión de Estudiantes",
      icon: Users,
      module: "estudiantes"
    },
    {
      title: "Agenda de Citas",
      icon: Calendar,
      module: "agenda"
    },
    {
      title: "Admisiones y Aspirantes",
      icon: GraduationCap,
      module: "admissions"
    },
    {
      title: "Campañas Masivas",
      icon: Megaphone,
      module: "campanas"
    },
    {
      title: "Preguntas de tests",
      icon: FileQuestion,
      module: "preguntas"
    },
    {
      title: "Carreras",
      icon: BookMarked,
      module: "carreras"
    },
    {
      title: "Mi Perfil",
      icon: User,
      module: "perfil"
    }
  ];

  const handleSubirNotas = async () => {
    if (!notasColegio.primerAno || !notasColegio.segundoAno || !notasColegio.tercerAno || !notasColegio.cuartoAno) {
      toast({
        title: "Error",
        description: "Por favor completa todas las notas",
        variant: "destructive"
      });
      return;
    }

    const promedio = (
      (parseFloat(notasColegio.primerAno) +
       parseFloat(notasColegio.segundoAno) +
       parseFloat(notasColegio.tercerAno) +
       parseFloat(notasColegio.cuartoAno)) / 4
    ).toFixed(2);

    setNotasColegio({ ...notasColegio, promedio });

    toast({
      title: "Éxito",
      description: `Notas guardadas. Promedio calculado: ${promedio}`,
    });
  };

  // Cargar estadísticas de campañas cuando se active el módulo
  useEffect(() => {
    const cargarEstadisticas = async () => {
      if (activeModule !== "campanas") return;

      const accessToken = tokens?.accessToken ||
        JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;

      if (!accessToken) return;

      try {
        const respuesta = await obtenerEstadisticas(accessToken);
        const d = respuesta.data as Record<string, unknown>;
        setEstadisticasCampanas({
          facultadIngenieria: Number(d?.facultadIngenieria ?? d?.facultad_ingenieria ?? 0),
          facultadCienciasEconomicas: Number(d?.facultadCienciasEconomicas ?? d?.facultad_ciencias_economicas ?? 0),
          facultadCiencias: Number(d?.facultadCiencias ?? d?.facultad_ciencias ?? 0),
          facultadHumanidades: Number(d?.facultadHumanidades ?? d?.facultad_humanidades ?? 0),
          facultadEstudiosJuridicos: Number(d?.facultadEstudiosJuridicos ?? d?.facultad_estudios_juridicos ?? 0),
          total: Number(d?.total ?? 0),
        });
      } catch (error: unknown) {
        console.error('Error al cargar estadísticas de campañas:', error);
        toast({
          title: "Error al cargar campañas",
          description: error instanceof Error ? error.message : "No se pudieron cargar las estadísticas",
          variant: "destructive",
        });
      }
    };

    cargarEstadisticas();
  }, [activeModule, tokens]);

  // Cargar perfil completo cuando se active el módulo de perfil
  useEffect(() => {
    const cargarPerfil = async () => {
      if (activeModule !== "perfil") return;

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

      setLoadingPerfil(true);

      try {
        const respuesta = await getUserProfile(accessToken);
        setPerfilCompleto(respuesta.data);
      } catch (error: unknown) {
        console.error('Error al cargar perfil:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Error al cargar el perfil del usuario",
          variant: "destructive",
        });
      } finally {
        setLoadingPerfil(false);
      }
    };

    cargarPerfil();
  }, [activeModule, tokens, navigate, toast]);

  // Cargar citas cuando se active el módulo de agenda
  useEffect(() => {
    if (activeModule !== "agenda") return;
    if (!tokens?.accessToken) {
      navigate("/login");
      return;
    }

    const cargarCitas = async () => {
      setLoadingCitas(true);
      try {
        const filtro = filtroEstadoCita !== "todas"
          ? { estado: filtroEstadoCita as 'pendiente' | 'confirmada' | 'completada' | 'cancelada' }
          : undefined;

        const resultado = await obtenerMisCitas(tokens.accessToken, filtro);
        setCitasAgendadas(resultado.data.citas);
      } catch (error: unknown) {
        console.error('Error al cargar citas:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Error al cargar las citas",
          variant: "destructive",
        });
      } finally {
        setLoadingCitas(false);
      }
    };

    cargarCitas();
  }, [activeModule, tokens, navigate, toast, filtroEstadoCita]);

  // Cargar preguntas cuando se active el módulo de preguntas
  useEffect(() => {
    if (activeModule !== "preguntas") return;
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) return;

    const cargar = async () => {
      setPreguntasLoading(true);
      try {
        const params: { tipo_test?: TipoTestPregunta; dimension_principal?: DimensionRIASEC; activa?: boolean; page: number; limit: number } = {
          page: preguntasPagination.page,
          limit: preguntasPagination.limit,
        };
        if (preguntasFilters.tipo_test) params.tipo_test = preguntasFilters.tipo_test as TipoTestPregunta;
        if (preguntasFilters.dimension_principal) params.dimension_principal = preguntasFilters.dimension_principal as DimensionRIASEC;
        if (preguntasFilters.activa !== "") params.activa = preguntasFilters.activa as boolean;

        const res = await listarPreguntas(accessToken, params);
        setPreguntasList(res.data.items);
        setPreguntasPagination(prev => ({
          ...prev,
          total: res.data.pagination.total,
          totalPages: res.data.pagination.totalPages,
        }));
      } catch (e: unknown) {
        toast({
          title: "Error",
          description: e instanceof Error ? e.message : "Error al cargar preguntas",
          variant: "destructive",
        });
      } finally {
        setPreguntasLoading(false);
      }
    };
    cargar();
  }, [activeModule, tokens, preguntasPagination.page, preguntasPagination.limit, preguntasFilters.tipo_test, preguntasFilters.dimension_principal, preguntasFilters.activa, toast]);

  // Cargar carreras cuando se active el módulo de carreras
  useEffect(() => {
    if (activeModule !== "carreras") return;
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;

    const cargar = async () => {
      setCareersLoading(true);
      try {
        const params = {
          page: careersPagination.page,
          limit: careersPagination.limit,
          q: careersFilters.q || undefined,
          faculty: careersFilters.faculty || undefined,
          area: careersFilters.area || undefined,
          incluir_inactivas: careersFilters.incluir_inactivas,
        };
        const res = await listarCareers(accessToken, params);
        setCareersList(res.data);
        setCareersPagination(prev => ({
          ...prev,
          total: res.total,
          totalPages: res.totalPages,
        }));
      } catch (e: unknown) {
        toast({
          title: "Error",
          description: e instanceof Error ? e.message : "Error al cargar carreras",
          variant: "destructive",
        });
      } finally {
        setCareersLoading(false);
      }
    };
    cargar();
  }, [activeModule, tokens, careersPagination.page, careersPagination.limit, careersFilters.q, careersFilters.faculty, careersFilters.area, careersFilters.incluir_inactivas, toast]);

  // Función para abrir el modal de edición de campaña
  const handleAbrirModalCampana = (
    grupo: 'facultad_ingenieria' | 'facultad_ciencias_economicas' | 'facultad_ciencias' | 'facultad_humanidades' | 'facultad_estudios_juridicos',
    nombreGrupo: string
  ) => {
    // Contenido predeterminado según la facultad
    const contenidosPorFacultad = {
      facultad_ingenieria: {
        titulo: "Descubre la Facultad de Ingeniería UNIMET",
        asunto: "Invitación: Conoce nuestras carreras de Ingeniería",
        contenido: `Tu perfil vocacional muestra gran afinidad con las áreas de tecnología e ingeniería.

Te invitamos a conocer nuestra Facultad de Ingeniería:
• Ingeniería Civil, Mecánica y Producción
• Ingeniería Química y Eléctrica
• Ingeniería de Sistemas

Fecha: Próximo sábado, 10:00 AM`,
        ctaTexto: "Registrarme",
        ctaUrl: "https://unimet.edu.ve/ingenieria"
      },
      facultad_ciencias_economicas: {
        titulo: "Explora Ciencias Económicas y Sociales",
        asunto: "Invitación: Charla sobre negocios y economía",
        contenido: `Tu perfil vocacional destaca por tu interés en el mundo empresarial y económico.

Conoce nuestra Facultad de Ciencias Económicas y Sociales:
• Ciencias Administrativas
• Economía Empresarial
• Contaduría Pública

Fecha: Próximo viernes, 3:00 PM`,
        ctaTexto: "Inscribirme",
        ctaUrl: "https://unimet.edu.ve/ciencias-economicas"
      },
      facultad_ciencias: {
        titulo: "Descubre la Facultad de Ciencias",
        asunto: "Invitación: Conoce Psicología y Matemáticas",
        contenido: `Tu perfil vocacional muestra interés en las ciencias y el comportamiento humano.

Te invitamos a conocer nuestra Facultad de Ciencias:
• Psicología
• Matemáticas Industriales

Fecha: Próximo jueves, 4:00 PM`,
        ctaTexto: "Confirmar Asistencia",
        ctaUrl: "https://unimet.edu.ve/ciencias"
      },
      facultad_humanidades: {
        titulo: "Explora la Facultad de Humanidades",
        asunto: "Invitación: Charla sobre Humanidades y Comunicación",
        contenido: `Tu perfil vocacional destaca por tu orientación humanística y creativa.

Conoce nuestra Facultad de Humanidades:
• Educación e Idiomas Modernos
• Comunicación Social y Empresarial
• Turismo Sostenible

Fecha: Próximo miércoles, 2:00 PM`,
        ctaTexto: "Reservar Cupo",
        ctaUrl: "https://unimet.edu.ve/humanidades"
      },
      facultad_estudios_juridicos: {
        titulo: "Descubre Estudios Jurídicos y Políticos",
        asunto: "Invitación: Conoce Derecho y Estudios Internacionales",
        contenido: `Tu perfil vocacional muestra interés en el ámbito legal y las relaciones internacionales.

Te invitamos a conocer nuestra Facultad de Estudios Jurídicos y Políticos:
• Derecho
• Estudios Liberales
• Estudios Internacionales

Fecha: Próximo martes, 5:00 PM`,
        ctaTexto: "Registrarme",
        ctaUrl: "https://unimet.edu.ve/estudios-juridicos"
      }
    };

    const datosPredeterminados = contenidosPorFacultad[grupo];

    setCampanaSeleccionada({
      grupo,
      nombreGrupo,
      ...datosPredeterminados,
      templateId: 'clasico'
    });

    setModalCampanaAbierto(true);
  };

  // Función para enviar campaña personalizada (grupos predefinidos)
  const handleEnviarCampanaPersonalizada = async () => {
    if (!campanaSeleccionada) return;

    const accessToken = tokens?.accessToken ||
      JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;

    if (!accessToken) {
      toast({
        title: "Error",
        description: "Sesión expirada. Por favor inicia sesión nuevamente.",
        variant: "destructive",
      });
      return;
    }

    setLoadingCampanas(true);

    try {
      const contenidoHTML = convertirContenidoAHTML(campanaSeleccionada.contenido);

      const resultado = await enviarGrupoPredefinido(accessToken, {
        grupo: campanaSeleccionada.grupo,
        titulo: campanaSeleccionada.titulo,
        asunto: campanaSeleccionada.asunto,
        contenido: contenidoHTML,
        ctaTexto: campanaSeleccionada.ctaTexto,
        ctaUrl: campanaSeleccionada.ctaUrl,
        templateId: campanaSeleccionada.templateId
      });

      toast({
        title: "¡Campaña enviada exitosamente!",
        description: `Se enviaron ${resultado.data.exitosos} de ${resultado.data.total} correos al grupo "${campanaSeleccionada.nombreGrupo}". Tasa de éxito: ${resultado.data.tasaExito}`,
      });

      // Cerrar modal y recargar estadísticas
      setModalCampanaAbierto(false);
      setCampanaSeleccionada(null);

      const respuesta = await obtenerEstadisticas(accessToken);
      const d = respuesta.data as Record<string, unknown>;
      setEstadisticasCampanas({
        facultadIngenieria: Number(d?.facultadIngenieria ?? d?.facultad_ingenieria ?? 0),
        facultadCienciasEconomicas: Number(d?.facultadCienciasEconomicas ?? d?.facultad_ciencias_economicas ?? 0),
        facultadCiencias: Number(d?.facultadCiencias ?? d?.facultad_ciencias ?? 0),
        facultadHumanidades: Number(d?.facultadHumanidades ?? d?.facultad_humanidades ?? 0),
        facultadEstudiosJuridicos: Number(d?.facultadEstudiosJuridicos ?? d?.facultad_estudios_juridicos ?? 0),
        total: Number(d?.total ?? 0),
      });

    } catch (error: unknown) {
      console.error('Error al enviar campaña:', error);
      toast({
        title: "Error al enviar campaña",
        description: error instanceof Error ? error.message : "No se pudo enviar la campaña de notificaciones",
        variant: "destructive",
      });
    } finally {
      setLoadingCampanas(false);
    }
  };

  // Función para buscar grupo objetivo con filtros personalizados
  const handleBuscarGrupoObjetivo = async () => {
    const accessToken = tokens?.accessToken ||
      JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;

    if (!accessToken) {
      toast({
        title: "Error",
        description: "Sesión expirada. Por favor inicia sesión nuevamente.",
        variant: "destructive",
      });
      return;
    }

    setLoadingSegmentacion(true);

    try {
      const resultado = await segmentarEstudiantes(accessToken, filtrosSegmentacion);

      setResultadoSegmentacion(resultado.data.estudiantes);

      toast({
        title: "Búsqueda completada",
        description: `Se encontraron ${resultado.data.total} estudiante${resultado.data.total !== 1 ? 's' : ''} que coinciden con los filtros.`,
      });
    } catch (error: unknown) {
      console.error('Error al segmentar estudiantes:', error);
      toast({
        title: "Error al buscar estudiantes",
        description: error instanceof Error ? error.message : "No se pudo realizar la búsqueda",
        variant: "destructive",
      });
    } finally {
      setLoadingSegmentacion(false);
    }
  };

  // Función para abrir modal de campaña con grupo segmentado
  const handleCrearCampanaSegmentada = () => {
    if (!resultadoSegmentacion || resultadoSegmentacion.length === 0) {
      toast({
        title: "No hay estudiantes seleccionados",
        description: "Primero debes buscar un grupo objetivo",
        variant: "destructive",
      });
      return;
    }

    setCampanaPersonalizada({
      titulo: "Invitación Personalizada",
      asunto: "Te invitamos a un evento especial",
      contenido: `Hemos identificado que tu perfil vocacional podría beneficiarse de esta oportunidad.

Te invitamos a conocer más sobre:
• Opciones académicas disponibles
• Oportunidades de desarrollo profesional
• Recursos de apoyo y orientación

¡Esperamos verte pronto!`,
      ctaTexto: "Conocer más",
      ctaUrl: "https://unimet.edu.ve"
    });

    setModalCampanaPersonalizada(true);
  };

  // Función para enviar campaña al grupo segmentado
  const handleEnviarCampanaSegmentada = async () => {
    if (!resultadoSegmentacion || resultadoSegmentacion.length === 0) return;

    const accessToken = tokens?.accessToken ||
      JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;

    if (!accessToken) {
      toast({
        title: "Error",
        description: "Sesión expirada. Por favor inicia sesión nuevamente.",
        variant: "destructive",
      });
      return;
    }

    setLoadingCampanas(true);

    try {
      const contenidoHTML = convertirContenidoAHTML(campanaPersonalizada.contenido);

      const destinatarios = resultadoSegmentacion.map(est => est.id);

      const resultado = await enviarCampana(accessToken, {
        destinatarios,
        asunto: campanaPersonalizada.asunto,
        contenido: contenidoHTML,
        titulo: campanaPersonalizada.titulo,
        ctaTexto: campanaPersonalizada.ctaTexto,
        ctaUrl: campanaPersonalizada.ctaUrl,
        usarTemplate: true,
        templateId: campanaPersonalizada.templateId
      });

      toast({
        title: "¡Campaña enviada exitosamente!",
        description: `Se enviaron ${resultado.data.exitosos} de ${resultado.data.total} correos. Tasa de éxito: ${resultado.data.tasaExito}`,
      });

      // Cerrar modal y limpiar resultados
      setModalCampanaPersonalizada(false);
      setResultadoSegmentacion(null);
      setFiltrosSegmentacion({
        carreraInteres: undefined,
        nivelRiesgo: undefined,
        estadoProceso: undefined,
      });

    } catch (error: unknown) {
      console.error('Error al enviar campaña:', error);
      toast({
        title: "Error al enviar campaña",
        description: error instanceof Error ? error.message : "No se pudo enviar la campaña de notificaciones",
        variant: "destructive",
      });
    } finally {
      setLoadingCampanas(false);
    }
  };

  // Función para aplicar/quitar formato (negrita, cursiva, subrayado, lista) al textarea
  const aplicarFormato = (
    tipo: 'bold' | 'italic' | 'underline' | 'list',
    ref: React.RefObject<HTMLTextAreaElement>,
    getValue: () => string,
    setValue: (v: string) => void
  ) => {
    const textarea = ref.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = getValue();
    const selected = value.substring(start, end);

    if (tipo === 'list') {
      const replacement = selected
        ? selected.split('\n').map(l => `• ${l}`).join('\n')
        : '• elemento';
      setValue(value.substring(0, start) + replacement + value.substring(end));
      setTimeout(() => {
        textarea.selectionStart = start;
        textarea.selectionEnd = start + replacement.length;
        textarea.focus();
      }, 0);
      return;
    }

    const markers: Record<string, string> = { bold: '**', italic: '_', underline: '__' };
    const marker = markers[tipo];

    // Toggle: el texto seleccionado ya tiene el marcador dentro → quitarlo
    if (selected.startsWith(marker) && selected.endsWith(marker) && selected.length > marker.length * 2) {
      const unwrapped = selected.slice(marker.length, -marker.length);
      setValue(value.substring(0, start) + unwrapped + value.substring(end));
      setTimeout(() => {
        textarea.selectionStart = start;
        textarea.selectionEnd = start + unwrapped.length;
        textarea.focus();
      }, 0);
      return;
    }

    // Toggle: el marcador está alrededor de la selección en el texto completo → quitarlo
    if (value.substring(start - marker.length, start) === marker &&
        value.substring(end, end + marker.length) === marker) {
      const newValue = value.substring(0, start - marker.length) + selected + value.substring(end + marker.length);
      setValue(newValue);
      setTimeout(() => {
        textarea.selectionStart = start - marker.length;
        textarea.selectionEnd = end - marker.length;
        textarea.focus();
      }, 0);
      return;
    }

    // Aplicar formato
    const inner = selected || 'texto';
    setValue(value.substring(0, start) + marker + inner + marker + value.substring(end));
    setTimeout(() => {
      textarea.selectionStart = start + marker.length;
      textarea.selectionEnd = start + marker.length + inner.length;
      textarea.focus();
    }, 0);
  };

  // Verifica si el cursor/selección está dentro de un fragmento con ese formato
  const isFormatoActivo = (
    tipo: 'bold' | 'italic' | 'underline',
    content: string,
    start: number,
    end: number
  ): boolean => {
    const regexMap: Record<string, RegExp> = {
      bold: /\*\*(.+?)\*\*/gs,
      underline: /__(.+?)__/gs,
      italic: /(?<![_*])_(?!_)(.+?)_(?![_*])/gs,
    };
    const regex = regexMap[tipo];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
      const mStart = match.index;
      const mEnd = match.index + match[0].length;
      if (start <= mEnd && end >= mStart) return true;
    }
    return false;
  };

  // Convierte texto con marcadores de formato a HTML
  const convertirContenidoAHTML = (texto: string): string => {
    return texto
      .split('\n')
      .map(line => {
        if (line.trim().startsWith('•')) {
          let content = line.trim().substring(1).trim();
          content = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
          content = content.replace(/__(.+?)__/g, '<u>$1</u>');
          content = content.replace(/_(.+?)_/g, '<em>$1</em>');
          return `<li>${content}</li>`;
        }
        if (!line.trim()) return '';
        let content = line.trim();
        content = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        content = content.replace(/__(.+?)__/g, '<u>$1</u>');
        content = content.replace(/_(.+?)_/g, '<em>$1</em>');
        return `<p>${content}</p>`;
      })
      .join('\n')
      .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  };

  // Función para abrir el modal de agendar cita
  const handleAbrirModalCita = () => {
    if (!selectedStudent) return;

    // Resetear el formulario
    setDatosCita({
      fecha: "",
      hora: "",
      modalidad: "presencial",
      motivo: "",
      notas: ""
    });

    setModalCitaAbierto(true);
  };

  // Función para agendar la cita
  const handleAgendarCita = async () => {
    if (!selectedStudent || !tokens?.accessToken) return;

    // Validar campos requeridos
    if (!datosCita.fecha || !datosCita.hora || !datosCita.motivo) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa la fecha, hora y motivo de la cita",
        variant: "destructive",
      });
      return;
    }

    setLoadingCita(true);

    try {
      // Llamar al API para guardar la cita
      const resultado = await agendarCita(tokens.accessToken, {
        estudiante_id: selectedStudent.id,
        fecha: datosCita.fecha,
        hora: datosCita.hora,
        modalidad: datosCita.modalidad as 'presencial' | 'virtual' | 'telefonica',
        motivo: datosCita.motivo,
        notas: datosCita.notas
      });

      toast({
        title: "¡Cita agendada exitosamente!",
        description: `Cita con ${selectedStudent.name} programada para el ${datosCita.fecha} a las ${datosCita.hora}`,
      });

      // Cerrar modal y resetear
      setModalCitaAbierto(false);
      setDatosCita({
        fecha: "",
        hora: "",
        modalidad: "presencial",
        motivo: "",
        notas: ""
      });

    } catch (error: unknown) {
      console.error('Error al agendar cita:', error);
      toast({
        title: "Error al agendar cita",
        description: error instanceof Error ? error.message : "No se pudo agendar la cita",
        variant: "destructive",
      });
    } finally {
      setLoadingCita(false);
    }
  };

  // Filtrar estudiantes por término de búsqueda y filtros
  const filteredStudents = students.filter(student => {
    // Filtro de búsqueda por texto
    const matchesSearch = searchTerm === '' ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.career_interest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro por nivel de riesgo
    const matchesRiesgo = !filtrosEstudiantes.nivelRiesgo ||
      student.risk_level === filtrosEstudiantes.nivelRiesgo;

    // Filtro por perfil Holland
    const matchesHolland = !filtrosEstudiantes.perfilHolland ||
      student.codigoHolland?.includes(filtrosEstudiantes.perfilHolland);

    return matchesSearch && matchesRiesgo && matchesHolland;
  });

  // Contar filtros activos
  const filtrosActivos = [
    filtrosEstudiantes.nivelRiesgo,
    filtrosEstudiantes.perfilHolland
  ].filter(Boolean).length;

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltrosEstudiantes({ nivelRiesgo: '', perfilHolland: '' });
    setFiltrosAbiertos(false);
    setStudentsPage(1);
  };

  // Estudiantes de la página actual
  const totalStudentsPages = Math.ceil(filteredStudents.length / STUDENTS_PER_PAGE);
  const paginatedStudents = filteredStudents.slice(
    (studentsPage - 1) * STUDENTS_PER_PAGE,
    studentsPage * STUDENTS_PER_PAGE
  );
 
  const renderContent = () => {
    if (activeModule === "estudiantes") {
      return (
        <div className="flex flex-col h-[calc(100vh-10rem)]">
          {/* Compact header */}
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Gestión de Estudiantes</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Aspirantes con tests de orientación vocacional · Holland RIASEC e ICO
              </p>
            </div>
            <span className="text-sm text-slate-400">{students.length} estudiante{students.length !== 1 ? "s" : ""}</span>
          </div>

          {/* Two-panel app layout */}
          <div className="flex gap-4 flex-1 min-h-0">
            {/* ── Sidebar ── */}
            <div className="w-80 shrink-0 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Search + filter — fijo */}
              <div className="p-3 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Buscar estudiante..."
                      className="pl-9 bg-slate-50 border-slate-200 h-9 text-sm"
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setStudentsPage(1); }}
                    />
                  </div>
                      <Popover open={filtrosAbiertos} onOpenChange={setFiltrosAbiertos}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className={`border-slate-200 relative ${filtrosActivos > 0 ? 'border-teal-300 bg-teal-50' : ''}`}
                            title="Filtrar"
                          >
                            <Filter className={`h-4 w-4 ${filtrosActivos > 0 ? 'text-teal-600' : 'text-slate-500'}`} />
                            {filtrosActivos > 0 && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 text-white text-[10px] rounded-full flex items-center justify-center">
                                {filtrosActivos}
                              </span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72 p-4" align="end">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm text-slate-900">Filtros</h4>
                              {filtrosActivos > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 text-xs text-slate-500 hover:text-slate-700"
                                  onClick={limpiarFiltros}
                                >
                                  Limpiar
                                </Button>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-medium text-slate-600">Nivel de Riesgo</Label>
                              <select
                                className="w-full p-2 rounded-md border border-slate-200 bg-white text-sm"
                                value={filtrosEstudiantes.nivelRiesgo}
                                onChange={(e) => { setFiltrosEstudiantes(prev => ({ ...prev, nivelRiesgo: e.target.value })); setStudentsPage(1); }}
                              >
                                <option value="">Todos los niveles</option>
                                <option value="Alto">Riesgo Alto</option>
                                <option value="Medio">Riesgo Medio</option>
                                <option value="Bajo">Riesgo Bajo</option>
                              </select>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs font-medium text-slate-600">Perfil Holland</Label>
                              <select
                                className="w-full p-2 rounded-md border border-slate-200 bg-white text-sm"
                                value={filtrosEstudiantes.perfilHolland}
                                onChange={(e) => { setFiltrosEstudiantes(prev => ({ ...prev, perfilHolland: e.target.value })); setStudentsPage(1); }}
                              >
                                <option value="">Todos los perfiles</option>
                                <option value="R">R - Realista</option>
                                <option value="I">I - Investigador</option>
                                <option value="A">A - Artístico</option>
                                <option value="S">S - Social</option>
                                <option value="E">E - Emprendedor</option>
                                <option value="C">C - Convencional</option>
                              </select>
                            </div>

                            <div className="pt-2 border-t border-slate-100">
                              <p className="text-xs text-slate-400">
                                {filteredStudents.length} de {students.length} estudiantes
                              </p>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
              </div>

              {/* Lista scrollable */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 py-12">
                    <Loader2 className="w-5 h-5 animate-spin text-teal-500" />
                    <p className="text-xs text-slate-500">Cargando estudiantes...</p>
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-20 text-slate-400" />
                    <p className="text-sm font-medium text-slate-600">
                      {students.length === 0 ? "Sin estudiantes aún" : "Sin resultados"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {students.length === 0
                        ? "Aparecerán cuando completen un test."
                        : "Intenta con otro término."}
                    </p>
                  </div>
                ) : (
                  paginatedStudents.map(student => (
                    <div
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                        selectedStudent?.id === student.id
                          ? 'bg-teal-50 border-teal-200'
                          : 'border-transparent hover:bg-slate-50 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8 shrink-0 bg-slate-100 text-slate-600 border border-slate-200">
                          <AvatarFallback className="text-xs">{student.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="font-semibold text-sm text-slate-900 truncate">{student.name}</p>
                            <Badge
                              variant={student.risk_level === "Alto" ? "destructive" : "secondary"}
                              className="text-[9px] px-1 h-4 shrink-0"
                            >
                              {student.risk_level}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-400 truncate">{student.career_interest || student.email}</p>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${selectedStudent?.id === student.id ? 'text-teal-500' : 'text-slate-300'}`} />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Paginación — fija al fondo */}
              {totalStudentsPages > 1 && (
                <div className="border-t border-slate-100 px-3 py-2 shrink-0 flex items-center justify-between bg-white">
                  <p className="text-[11px] text-slate-400">
                    {(studentsPage - 1) * STUDENTS_PER_PAGE + 1}–{Math.min(studentsPage * STUDENTS_PER_PAGE, filteredStudents.length)} / {filteredStudents.length}
                  </p>
                  <div className="flex gap-0.5">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-xs" disabled={studentsPage === 1} onClick={() => setStudentsPage(p => p - 1)}>‹</Button>
                    {Array.from({ length: totalStudentsPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalStudentsPages || Math.abs(p - studentsPage) <= 1)
                      .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                        if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push("…");
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((item, idx) =>
                        item === "…" ? (
                          <span key={`e-${idx}`} className="h-6 w-5 flex items-center justify-center text-[11px] text-slate-400">…</span>
                        ) : (
                          <Button
                            key={item}
                            variant={studentsPage === item ? "default" : "ghost"}
                            size="sm"
                            className={`h-6 w-6 p-0 text-[11px] ${studentsPage === item ? 'bg-teal-600 hover:bg-teal-700 text-white' : ''}`}
                            onClick={() => setStudentsPage(item as number)}
                          >
                            {item}
                          </Button>
                        )
                      )}
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-xs" disabled={studentsPage === totalStudentsPages} onClick={() => setStudentsPage(p => p + 1)}>›</Button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Panel de detalle ── */}
            <div className="flex-1 overflow-y-auto">
              {selectedStudent ? (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={selectedStudent.id}
                      className="space-y-6"
                    >
                      {/* Student Header — compacto */}
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="h-1 bg-teal-500 w-full" />
                        <div className="p-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="h-11 w-11 shrink-0 bg-slate-100 text-slate-600 border border-slate-200">
                              <AvatarFallback className="text-base">{selectedStudent.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate">{selectedStudent.name}</p>
                              <p className="text-xs text-slate-500 truncate">{selectedStudent.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              selectedStudent.risk_level === "Alto" ? "bg-red-100 text-red-700" :
                              selectedStudent.risk_level === "Medio" ? "bg-yellow-100 text-yellow-700" :
                              "bg-green-100 text-green-700"
                            }`}>
                              Riesgo {selectedStudent.risk_level}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8"
                              onClick={() => window.location.href = `mailto:${selectedStudent.email}`}
                            >
                              <Mail className="w-3.5 h-3.5 mr-1.5" /> Correo
                            </Button>
                            <Button
                              size="sm"
                              className="bg-teal-600 hover:bg-teal-700 h-8"
                              onClick={handleAbrirModalCita}
                            >
                              <Calendar className="w-3.5 h-3.5 mr-1.5" /> Cita
                            </Button>
                          </div>
                        </div>
                        <div className="px-4 pb-3 flex gap-4 border-t border-slate-50 pt-3">
                          <div className="text-center">
                            <p className="text-[10px] text-slate-400 uppercase font-semibold">Estado</p>
                            <p className="text-xs font-semibold text-slate-800 mt-0.5">{selectedStudent.status}</p>
                          </div>
                          <div className="w-px bg-slate-100" />
                          <div className="text-center">
                            <p className="text-[10px] text-slate-400 uppercase font-semibold">Perfil</p>
                            <p className="text-xs font-semibold text-teal-600 mt-0.5">{selectedStudent.result || "—"}</p>
                          </div>
                          <div className="w-px bg-slate-100" />
                          <div className="text-center">
                            <p className="text-[10px] text-slate-400 uppercase font-semibold">Último test</p>
                            <p className="text-xs font-semibold text-slate-800 mt-0.5">
                              {selectedStudent.last_test}
                              {selectedStudent.ultimoTipoTestLabel && <span className="text-slate-400 ml-1">({selectedStudent.ultimoTipoTestLabel})</span>}
                            </p>
                          </div>
                          <div className="w-px bg-slate-100" />
                          <div className="text-center">
                            <p className="text-[10px] text-slate-400 uppercase font-semibold">Holland</p>
                            <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">{selectedStudent.codigoHolland || "—"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Analysis Tabs */}
                      <Tabs defaultValue="results" className="w-full">
                        <TabsList className="w-full justify-start bg-white border border-slate-200 p-1 rounded-xl mb-6">
                          <TabsTrigger value="results" className="rounded-lg px-6">Resultados del Test</TabsTrigger>
                          <TabsTrigger value="notes" className="rounded-lg px-6">Notas del Orientador</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="results">
                          <div className="space-y-4">
                            {/* RIASEC Profile Card */}
                            <Card className="rounded-2xl border-slate-200 shadow-sm">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <BarChart className="w-5 h-5 text-teal-500" />
                                  Perfil RIASEC — Holland
                                </CardTitle>
                                <CardDescription>
                                  Código dominante: <span className="font-mono font-bold text-slate-900">{selectedStudent.codigoHolland || "—"}</span>
                                  {" · "}
                                  {selectedStudent.totalSesiones} test{selectedStudent.totalSesiones !== 1 ? "s" : ""}
                                  {(selectedStudent.sesionesHolland != null || selectedStudent.sesionesIco != null) && (
                                    <span className="text-slate-400 ml-1">
                                      ({[
                                        selectedStudent.sesionesHolland && selectedStudent.sesionesHolland > 0 ? `${selectedStudent.sesionesHolland} Holland` : null,
                                        selectedStudent.sesionesIco && selectedStudent.sesionesIco > 0 ? `${selectedStudent.sesionesIco} ICO` : null,
                                      ].filter(Boolean).join(", ")})
                                    </span>
                                  )}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                {(() => {
                                  const RIASEC_META: Record<string, { label: string; color: string; bar: string; desc: string }> = {
                                    R: { label: "Realista", color: "text-orange-700", bar: "bg-orange-500", desc: "Práctico, manual, técnico" },
                                    I: { label: "Investigativo", color: "text-blue-700", bar: "bg-blue-500", desc: "Analítico, científico, curioso" },
                                    A: { label: "Artístico", color: "text-purple-700", bar: "bg-purple-500", desc: "Creativo, expresivo, original" },
                                    S: { label: "Social", color: "text-green-700", bar: "bg-green-500", desc: "Cooperativo, empático, educador" },
                                    E: { label: "Emprendedor", color: "text-yellow-700", bar: "bg-yellow-500", desc: "Líder, persuasivo, ambicioso" },
                                    C: { label: "Convencional", color: "text-slate-600", bar: "bg-slate-400", desc: "Ordenado, metódico, detallista" },
                                  };
                                  // Weight by position in code: 1st=100%, 2nd=70%, 3rd=45%, rest=15%
                                  const code = (selectedStudent.codigoHolland || "").toUpperCase().replace(/[^RIASCE]/g, "");
                                  const weights: Record<string, number> = {};
                                  ["R","I","A","S","C","E"].forEach(l => { weights[l] = 15; });
                                  if (code[0]) weights[code[0]] = 100;
                                  if (code[1]) weights[code[1]] = 70;
                                  if (code[2]) weights[code[2]] = 45;
                                  const sorted = Object.entries(weights).sort((a, b) => b[1] - a[1]);
                                  return (
                                    <div className="space-y-3">
                                      {sorted.map(([letter, pct]) => {
                                        const meta = RIASEC_META[letter];
                                        const rank = code.indexOf(letter);
                                        return (
                                          <div key={letter}>
                                            <div className="flex items-center justify-between mb-1">
                                              <div className="flex items-center gap-2">
                                                <span className={`font-mono font-bold text-sm w-4 ${meta.color}`}>{letter}</span>
                                                <span className="text-sm font-medium text-slate-700">{meta.label}</span>
                                                <span className="text-xs text-slate-400 hidden sm:inline">{meta.desc}</span>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                {rank >= 0 && rank <= 2 && (
                                                  <Badge variant="outline" className={`text-[10px] px-1.5 h-4 ${meta.color} border-current`}>
                                                    #{rank + 1}
                                                  </Badge>
                                                )}
                                                <span className="text-xs font-semibold text-slate-500 w-8 text-right">{pct}%</span>
                                              </div>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                              <div
                                                className={`h-full ${meta.bar} rounded-full transition-all duration-500`}
                                                style={{ width: `${pct}%` }}
                                              />
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  );
                                })()}

                                {/* Risk level indicator */}
                                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                                  <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Nivel de Riesgo Detectado</p>
                                    <p className="text-sm text-slate-700">{selectedStudent.result}</p>
                                  </div>
                                  <div className={`px-4 py-2 rounded-xl text-sm font-bold ${
                                    selectedStudent.risk_level === "Alto"
                                      ? "bg-red-100 text-red-700 border border-red-200"
                                      : selectedStudent.risk_level === "Medio"
                                      ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                      : "bg-green-100 text-green-700 border border-green-200"
                                  }`}>
                                    {selectedStudent.risk_level}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Career Recommendations */}
                            <Card className="rounded-2xl border-slate-200 shadow-sm">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <BrainCircuit className="w-5 h-5 text-teal-500" />
                                  Carreras Recomendadas
                                </CardTitle>
                                <CardDescription>Basadas en el perfil vocacional detectado</CardDescription>
                              </CardHeader>
                              <CardContent>
                                {selectedStudent.recomendacionesCarreras && selectedStudent.recomendacionesCarreras.length > 0 ? (
                                  <div className="space-y-3">
                                    {selectedStudent.recomendacionesCarreras.map((carrera, index) => (
                                      <div key={carrera.id} className="flex gap-3 p-3 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/30 transition-colors">
                                        <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                                          {index + 1}
                                        </div>
                                        <div className="min-w-0">
                                          <p className="font-semibold text-slate-900 text-sm">{carrera.name}</p>
                                          {(carrera.faculty ?? carrera.facultad ?? carrera.area) && (
                                            <p className="text-xs text-teal-600 font-medium mt-0.5">
                                              {[carrera.faculty ?? carrera.facultad, carrera.area].filter(Boolean).join(" · ")}
                                            </p>
                                          )}
                                          <p className="text-xs text-slate-500 leading-relaxed mt-1">{carrera.razon}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-8 text-slate-400">
                                    <GraduationCap className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">No hay recomendaciones disponibles</p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        </TabsContent>

                        <TabsContent value="notes">
                          <Card className="rounded-2xl border-slate-200 shadow-sm">
                            <CardHeader>
                              <CardTitle className="text-lg">Bitácora de Seguimiento</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                    <User className="w-4 h-4 text-slate-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-slate-900 font-medium">Nota agregada por Dr. Mendez</p>
                                    <p className="text-xs text-slate-400 mb-2">10 Dic 2025 - 14:30</p>
                                    <p className="text-sm text-slate-600">Se asignó cita para revisión de opciones de beca. El estudiante muestra preocupación por los costos.</p>
                                  </div>
                                </div>
                                <Button variant="outline" className="w-full border-dashed border-slate-300 text-slate-500 hover:text-teal-600 hover:border-teal-300 hover:bg-teal-50">
                                  + Agregar Nueva Nota
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>

                      </Tabs>
                    </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <User className="w-12 h-12 mb-3 opacity-20" />
                  <p className="font-medium text-slate-600">Selecciona un estudiante</p>
                  <p className="text-sm mt-1">Haz clic en la lista para ver su perfil</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (activeModule === "admissions") {
      const stats = calcularEstadisticasAdmisiones();
      
      return (
        <div className="space-y-8">
                {loadingAdmissions ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
                  </div>
                ) : (
                  <>
                {/* KPI Cards */}
                <div className="grid md:grid-cols-4 gap-4">
                  <Card className="bg-white border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                          <Users className="w-5 h-5" />
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 font-medium">Total Aspirantes</p>
                      <h3 className="text-2xl font-bold text-slate-900">{stats.totalAspirantes}</h3>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                          <Sparkles className="w-5 h-5" />
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 font-medium">Interés Alto</p>
                      <h3 className="text-2xl font-bold text-slate-900">{stats.interesAlto}</h3>
                    </CardContent>
                  </Card>
                  <Card className="bg-white border-slate-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                          <Megaphone className="w-5 h-5" />
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 font-medium">Invitaciones Enviadas</p>
                      <h3 className="text-2xl font-bold text-slate-900">{stats.contactados}</h3>
                    </CardContent>
                  </Card>
                  <Card className="bg-teal-900 border-teal-800 shadow-sm text-white">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-teal-800 rounded-lg text-teal-300">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                      </div>
                      <p className="text-sm text-teal-200 font-medium">Proyectado Matriculados</p>
                      <h3 className="text-2xl font-bold">{stats.proyectadoMatriculados}</h3>
                    </CardContent>
                  </Card>
                </div>

                {/* Pipeline Visual */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Pipeline de Admisiones</CardTitle>
                    <CardDescription>Conversión de aspirantes desde el test vocacional hasta la matrícula.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="relative pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                            <span className="font-semibold text-slate-700">Realizaron Test Vocacional</span>
                          </div>
                          <span className="font-bold text-slate-900">{stats.totalAspirantes}</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-400 w-full rounded-full"></div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                            <span className="font-semibold text-slate-700">Identificados como Potenciales</span>
                          </div>
                          <span className="font-bold text-slate-900">{stats.potenciales} ({stats.porcentajePotenciales}%)</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.porcentajePotenciales}%` }}></div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                            <span className="font-semibold text-slate-700">Contactados / Invitados</span>
                          </div>
                          <span className="font-bold text-slate-900">{stats.contactados} ({stats.porcentajeContactados}%)</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${stats.porcentajeContactados}%` }}></div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-teal-500"></span>
                            <span className="font-semibold text-slate-700">Proyectado Matriculados</span>
                          </div>
                          <span className="font-bold text-slate-900">{stats.proyectadoMatriculados} ({stats.porcentajeMatriculados}%)</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${stats.porcentajeMatriculados}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Aspirants Table */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Aspirantes Destacados</CardTitle>
                      <CardDescription>Estudiantes potenciales identificados por el sistema de IA.</CardDescription>
                    </div>
                    <Button variant="outline" className="text-teal-600 border-teal-200 hover:bg-teal-50">
                      <Download className="w-4 h-4 mr-2" /> Exportar Reporte
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {admissionsData.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p>No hay aspirantes disponibles</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                              <th className="p-4 rounded-l-lg">Aspirante</th>
                              <th className="p-4">Interés Principal</th>
                              <th className="p-4">Probabilidad (IA)</th>
                              <th className="p-4">Estado</th>
                              <th className="p-4 rounded-r-lg text-right">Acción</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {admissionsData
                              .sort((a, b) => {
                                const probA = calcularProbabilidad(a);
                                const probB = calcularProbabilidad(b);
                                return probB.porcentaje - probA.porcentaje;
                              })
                              .slice(0, 10)
                              .map((aspirant) => {
                                const probabilidad = calcularProbabilidad(aspirant);
                                const interesPrincipal = aspirant.recomendacionesCarreras.length > 0 
                                  ? aspirant.recomendacionesCarreras[0].name 
                                  : "Indeciso";
                                const estado = getStatus(aspirant.totalSesiones, aspirant.ultimaFechaTest);
                                
                                return (
                                  <tr key={aspirant.estudiante.id} className="hover:bg-slate-50 group">
                                    <td className="p-4 font-medium text-slate-900">
                                      <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8 bg-slate-200 text-slate-500">
                                          <AvatarFallback>{getInitials(aspirant.estudiante.nombre)}</AvatarFallback>
                                        </Avatar>
                                        {aspirant.estudiante.nombre}
                                      </div>
                                    </td>
                                    <td className="p-4 text-slate-600">{interesPrincipal}</td>
                                    <td className="p-4">
                                      <Badge variant="outline" className={`
                                        ${probabilidad.nivel === "Muy Alta" ? "bg-green-50 text-green-700 border-green-200" : 
                                          probabilidad.nivel === "Alta" ? "bg-blue-50 text-blue-700 border-blue-200" : 
                                          probabilidad.nivel === "Media" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                                          "bg-orange-50 text-orange-700 border-orange-200"}
                                      `}>
                                        {probabilidad.nivel} ({probabilidad.porcentaje}%)
                                      </Badge>
                                    </td>
                                    <td className="p-4 text-slate-600">{estado}</td>
                                    <td className="p-4 text-right">
                                      <Button size="sm" className="bg-white border border-slate-200 text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                                        Invitar <ArrowUpRight className="w-3 h-3 ml-1" />
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
                  </>
                )}
              </div>
      );
    }

    if (activeModule === "campanas") {
      const totalEstudiantes = estadisticasCampanas.facultadIngenieria + estadisticasCampanas.facultadCienciasEconomicas + estadisticasCampanas.facultadCiencias + estadisticasCampanas.facultadHumanidades + estadisticasCampanas.facultadEstudiosJuridicos;

      return (
        <div className="space-y-6">
                {totalEstudiantes === 0 && (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <Info className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      No se encontraron estudiantes clasificados en los grupos de campañas. Asegúrate de que haya estudiantes con tests de orientación vocacional completados y con recomendaciones de carreras.
                    </AlertDescription>
                  </Alert>
                )}

                <Card className="rounded-2xl border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl text-slate-900">Gestor de Campañas por Facultad</CardTitle>
                    <CardDescription>Envía comunicaciones segmentadas a estudiantes según la facultad de su interés vocacional.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {/* Facultad de Ingeniería */}
                      <Card className="border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                              <BrainCircuit className="w-6 h-6" />
                            </div>
                            <Badge className="bg-blue-600">
                              {estadisticasCampanas.facultadIngenieria} {estadisticasCampanas.facultadIngenieria === 1 ? 'Estudiante' : 'Estudiantes'}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-slate-900 mb-2">Facultad de Ingeniería</h3>
                          <p className="text-sm text-slate-600 mb-4">Civil, Mecánica, Producción, Química, Sistemas, Eléctrica</p>
                          <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleAbrirModalCampana('facultad_ingenieria', 'Facultad de Ingeniería')}
                            disabled={loadingCampanas || estadisticasCampanas.facultadIngenieria === 0}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Crear Campaña
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Facultad de Ciencias Económicas y Sociales */}
                      <Card className="border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 transition-colors cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                              <TrendingUp className="w-6 h-6" />
                            </div>
                            <Badge className="bg-emerald-600">
                              {estadisticasCampanas.facultadCienciasEconomicas} {estadisticasCampanas.facultadCienciasEconomicas === 1 ? 'Estudiante' : 'Estudiantes'}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-slate-900 mb-2">Ciencias Económicas y Sociales</h3>
                          <p className="text-sm text-slate-600 mb-4">Administración, Economía Empresarial, Contaduría</p>
                          <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleAbrirModalCampana('facultad_ciencias_economicas', 'Ciencias Económicas y Sociales')}
                            disabled={loadingCampanas || estadisticasCampanas.facultadCienciasEconomicas === 0}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Crear Campaña
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Facultad de Ciencias */}
                      <Card className="border border-purple-200 bg-purple-50/50 hover:bg-purple-50 transition-colors cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                              <Heart className="w-6 h-6" />
                            </div>
                            <Badge className="bg-purple-600">
                              {estadisticasCampanas.facultadCiencias} {estadisticasCampanas.facultadCiencias === 1 ? 'Estudiante' : 'Estudiantes'}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-slate-900 mb-2">Facultad de Ciencias</h3>
                          <p className="text-sm text-slate-600 mb-4">Psicología, Matemáticas Industriales</p>
                          <Button
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={() => handleAbrirModalCampana('facultad_ciencias', 'Facultad de Ciencias')}
                            disabled={loadingCampanas || estadisticasCampanas.facultadCiencias === 0}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Crear Campaña
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Facultad de Humanidades */}
                      <Card className="border border-orange-200 bg-orange-50/50 hover:bg-orange-50 transition-colors cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
                              <BookOpen className="w-6 h-6" />
                            </div>
                            <Badge className="bg-orange-600">
                              {estadisticasCampanas.facultadHumanidades} {estadisticasCampanas.facultadHumanidades === 1 ? 'Estudiante' : 'Estudiantes'}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-slate-900 mb-2">Facultad de Humanidades</h3>
                          <p className="text-sm text-slate-600 mb-4">Educación, Idiomas, Comunicación Social, Turismo</p>
                          <Button
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                            onClick={() => handleAbrirModalCampana('facultad_humanidades', 'Facultad de Humanidades')}
                            disabled={loadingCampanas || estadisticasCampanas.facultadHumanidades === 0}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Crear Campaña
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Facultad de Estudios Jurídicos y Políticos */}
                      <Card className="border border-rose-200 bg-rose-50/50 hover:bg-rose-50 transition-colors cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-rose-100 rounded-xl text-rose-600">
                              <Award className="w-6 h-6" />
                            </div>
                            <Badge className="bg-rose-600">
                              {estadisticasCampanas.facultadEstudiosJuridicos} {estadisticasCampanas.facultadEstudiosJuridicos === 1 ? 'Estudiante' : 'Estudiantes'}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-slate-900 mb-2">Estudios Jurídicos y Políticos</h3>
                          <p className="text-sm text-slate-600 mb-4">Derecho, Estudios Liberales, Estudios Internacionales</p>
                          <Button
                            className="w-full bg-rose-600 hover:bg-rose-700 text-white"
                            onClick={() => handleAbrirModalCampana('facultad_estudios_juridicos', 'Estudios Jurídicos y Políticos')}
                            disabled={loadingCampanas || estadisticasCampanas.facultadEstudiosJuridicos === 0}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Crear Campaña
                          </Button>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                      <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                        <Filter className="w-5 h-5 mr-2 text-slate-500" />
                        Segmentación Personalizada
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Carrera de Interés</label>
                          <select
                            className="w-full p-2 rounded-md border border-slate-200 bg-white text-sm"
                            value={filtrosSegmentacion.carreraInteres || ''}
                            onChange={(e) => setFiltrosSegmentacion({ ...filtrosSegmentacion, carreraInteres: e.target.value || undefined })}
                          >
                            <option value="">Todas las carreras</option>
                            <optgroup label="Facultad de Ingeniería">
                              <option value="ingenieria_civil">Ingeniería Civil</option>
                              <option value="ingenieria_mecanica">Ingeniería Mecánica</option>
                              <option value="ingenieria_produccion">Ingeniería Producción</option>
                              <option value="ingenieria_quimica">Ingeniería Química</option>
                              <option value="ingenieria_sistemas">Ingeniería de Sistemas</option>
                              <option value="ingenieria_electrica">Ingeniería Eléctrica</option>
                            </optgroup>
                            <optgroup label="Ciencias Económicas y Sociales">
                              <option value="ciencias_administrativas">Ciencias Administrativas</option>
                              <option value="economia_empresarial">Economía Empresarial</option>
                              <option value="contaduria_publica">Contaduría Pública</option>
                            </optgroup>
                            <optgroup label="Facultad de Ciencias">
                              <option value="psicologia">Psicología</option>
                              <option value="matematicas_industriales">Matemáticas Industriales</option>
                            </optgroup>
                            <optgroup label="Facultad de Humanidades">
                              <option value="educacion">Educación</option>
                              <option value="idiomas_modernos">Idiomas Modernos</option>
                              <option value="comunicacion_social">Comunicación Social y Empresarial</option>
                              <option value="turismo_sostenible">Turismo Sostenible</option>
                            </optgroup>
                            <optgroup label="Estudios Jurídicos y Políticos">
                              <option value="derecho">Derecho</option>
                              <option value="estudios_liberales">Estudios Liberales</option>
                              <option value="estudios_internacionales">Estudios Internacionales</option>
                            </optgroup>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Nivel de Riesgo</label>
                          <select
                            className="w-full p-2 rounded-md border border-slate-200 bg-white text-sm"
                            value={filtrosSegmentacion.nivelRiesgo || ''}
                            onChange={(e) => setFiltrosSegmentacion({
                              ...filtrosSegmentacion,
                              nivelRiesgo: e.target.value ? (e.target.value as 'Alto' | 'Medio' | 'Bajo') : undefined
                            })}
                          >
                            <option value="">Todos los niveles</option>
                            <option value="Alto">Riesgo Alto</option>
                            <option value="Medio">Riesgo Medio</option>
                            <option value="Bajo">Riesgo Bajo</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Estado del Proceso</label>
                          <select
                            className="w-full p-2 rounded-md border border-slate-200 bg-white text-sm"
                            value={filtrosSegmentacion.estadoProceso || ''}
                            onChange={(e) => setFiltrosSegmentacion({ ...filtrosSegmentacion, estadoProceso: e.target.value || undefined })}
                          >
                            <option value="">Cualquier estado</option>
                            <option value="completado">Test Completado</option>
                            <option value="proceso">En Proceso</option>
                            <option value="seguimiento">En Seguimiento</option>
                            <option value="asesoria">Requiere Asesoría</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        {resultadoSegmentacion && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-white">
                              {resultadoSegmentacion.length} estudiante{resultadoSegmentacion.length !== 1 ? 's' : ''} encontrado{resultadoSegmentacion.length !== 1 ? 's' : ''}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setResultadoSegmentacion(null)}
                              className="text-slate-500 hover:text-slate-700"
                            >
                              <X className="w-3 h-3 mr-1" /> Limpiar
                            </Button>
                          </div>
                        )}
                        <div className={`flex gap-2 ${resultadoSegmentacion ? 'ml-auto' : 'w-full justify-end'}`}>
                          <Button
                            className="bg-teal-600 hover:bg-teal-700 text-white"
                            onClick={handleBuscarGrupoObjetivo}
                            disabled={loadingSegmentacion}
                          >
                            {loadingSegmentacion ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Buscando...
                              </>
                            ) : (
                              <>
                                <Search className="w-4 h-4 mr-2" /> Buscar Grupo Objetivo
                              </>
                            )}
                          </Button>
                          {resultadoSegmentacion && resultadoSegmentacion.length > 0 && (
                            <Button
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={handleCrearCampanaSegmentada}
                            >
                              <Mail className="w-4 h-4 mr-2" /> Crear Campaña
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Lista de estudiantes encontrados */}
                      {resultadoSegmentacion && resultadoSegmentacion.length > 0 && (
                        <div className="mt-4 bg-white rounded-lg border border-slate-200 p-4">
                          <h4 className="font-semibold text-slate-900 mb-3 text-sm">Estudiantes seleccionados:</h4>
                          <div className="max-h-60 overflow-y-auto space-y-2">
                            {resultadoSegmentacion.map((estudiante) => (
                              <div key={estudiante.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-md text-sm">
                                <div>
                                  <p className="font-medium text-slate-900">{estudiante.nombre}</p>
                                  <p className="text-xs text-slate-500">{estudiante.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {estudiante.perfilDominante}
                                  </Badge>
                                  {estudiante.carrerasInteres && estudiante.carrerasInteres.length > 0 && (
                                    <span className="text-xs text-slate-500">
                                      {estudiante.carrerasInteres[0]}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
      );
    }

    if (activeModule === "agenda") {
      return (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Agenda de Citas</h2>
            <p className="text-sm text-slate-600">
              Gestiona tus citas de orientación vocacional con los estudiantes. Puedes ver, confirmar, completar o cancelar las citas agendadas.
            </p>
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <Label className="text-sm font-medium text-slate-700">Filtrar por estado:</Label>
            <select
              value={filtroEstadoCita}
              onChange={(e) => setFiltroEstadoCita(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="todas">Todas las citas</option>
              <option value="pendiente">Pendientes</option>
              <option value="confirmada">Confirmadas</option>
              <option value="completada">Completadas</option>
              <option value="cancelada">Canceladas</option>
            </select>
          </div>

          {/* Lista de citas */}
          {loadingCitas ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              <span className="ml-3 text-slate-600">Cargando citas...</span>
            </div>
          ) : citasAgendadas.length === 0 ? (
            <Card className="border-slate-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No hay citas agendadas</h3>
                <p className="text-sm text-slate-500 text-center max-w-md">
                  Las citas que agendes con los estudiantes desde la sección de Gestión de Estudiantes aparecerán aquí.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {citasAgendadas.map((cita) => (
                <Card key={cita.id} className="border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${
                          cita.estado === 'pendiente' ? 'bg-yellow-100' :
                          cita.estado === 'confirmada' ? 'bg-blue-100' :
                          cita.estado === 'completada' ? 'bg-green-100' :
                          'bg-red-100'
                        }`}>
                          <Calendar className={`w-6 h-6 ${
                            cita.estado === 'pendiente' ? 'text-yellow-600' :
                            cita.estado === 'confirmada' ? 'text-blue-600' :
                            cita.estado === 'completada' ? 'text-green-600' :
                            'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {cita.estudiante?.nombre} {cita.estudiante?.apellido}
                          </h3>
                          <p className="text-sm text-slate-600">{cita.estudiante?.email}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-slate-700">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(cita.fecha + 'T00:00:00').toLocaleDateString('es-VE', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                            <span className="font-medium">{cita.hora}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="capitalize">
                              {cita.modalidad}
                            </Badge>
                            <Badge className={`${
                              cita.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                              cita.estado === 'confirmada' ? 'bg-blue-100 text-blue-800' :
                              cita.estado === 'completada' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mt-2">
                            <strong>Motivo:</strong> {formatearMotivo(cita.motivo)}
                          </p>
                          {cita.notas && (
                            <p className="text-sm text-slate-500 mt-1">
                              <strong>Notas:</strong> {cita.notas}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Acciones */}
                      {cita.estado !== 'cancelada' && cita.estado !== 'completada' && (
                        <div className="flex gap-2">
                          {cita.estado === 'pendiente' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                              onClick={async () => {
                                try {
                                  await actualizarCita(tokens!.accessToken, cita.id, { estado: 'confirmada' });
                                  setCitasAgendadas(prev => prev.map(c =>
                                    c.id === cita.id ? { ...c, estado: 'confirmada' } : c
                                  ));
                                  toast({ title: "Cita confirmada", description: "La cita ha sido confirmada exitosamente" });
                                } catch (error) {
                                  toast({ title: "Error", description: "No se pudo confirmar la cita", variant: "destructive" });
                                }
                              }}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" /> Confirmar
                            </Button>
                          )}
                          {(cita.estado === 'pendiente' || cita.estado === 'confirmada') && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={async () => {
                                  try {
                                    await actualizarCita(tokens!.accessToken, cita.id, { estado: 'completada' });
                                    setCitasAgendadas(prev => prev.map(c =>
                                      c.id === cita.id ? { ...c, estado: 'completada' } : c
                                    ));
                                    toast({ title: "Cita completada", description: "La cita ha sido marcada como completada" });
                                  } catch (error) {
                                    toast({ title: "Error", description: "No se pudo completar la cita", variant: "destructive" });
                                  }
                                }}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" /> Completar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={async () => {
                                  try {
                                    await actualizarCita(tokens!.accessToken, cita.id, { estado: 'cancelada' });
                                    setCitasAgendadas(prev => prev.map(c =>
                                      c.id === cita.id ? { ...c, estado: 'cancelada' } : c
                                    ));
                                    toast({ title: "Cita cancelada", description: "La cita ha sido cancelada" });
                                  } catch (error) {
                                    toast({ title: "Error", description: "No se pudo cancelar la cita", variant: "destructive" });
                                  }
                                }}
                              >
                                <X className="w-4 h-4 mr-1" /> Cancelar
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (activeModule === "preguntas") {
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      const TIPOS_TEST: { value: TipoTestPregunta; label: string }[] = [
        { value: "Holland_RIASEC", label: "Holland RIASEC" },
        { value: "Kuder", label: "Kuder" },
        { value: "ICO", label: "ICO" },
        { value: "Personalizado", label: "Personalizado" },
      ];
      const DIMENSIONES: { value: DimensionRIASEC; label: string }[] = [
        { value: "Realista", label: "Realista" },
        { value: "Investigador", label: "Investigador" },
        { value: "Artístico", label: "Artístico" },
        { value: "Social", label: "Social" },
        { value: "Emprendedor", label: "Emprendedor" },
        { value: "Convencional", label: "Convencional" },
      ];

      const abrirModalPregunta = (p?: PreguntaItem) => {
        const { tipo, opciones } = p ? normalizarInstruccionesParaForm(p.instrucciones_respuesta) : { tipo: "si_no" as TipoInstruccionesRespuesta, opciones: ["Sí", "No"] };
        if (p) {
          setPreguntaEdit(p);
          setFormPregunta({
            codigo_pregunta: p.codigo_pregunta,
            tipo_test: p.tipo_test,
            dimension_principal: p.dimension_principal,
            texto__pregunta: p.texto__pregunta,
            tipo_pregunta: p.tipo_pregunta,
            peso_pregunta: p.peso_pregunta,
            instrucciones_pregunta: p.instrucciones_pregunta ?? undefined,
            dimension_secundaria: p.dimension_secundaria ?? [],
            activa: p.activa,
            instrucciones_respuesta_tipo: tipo,
            instrucciones_respuesta_opciones: opciones.length ? opciones : ["Sí", "No"],
          });
        } else {
          setPreguntaEdit(null);
          setFormPregunta({
            codigo_pregunta: "",
            tipo_test: "Holland_RIASEC",
            dimension_principal: "Realista",
            texto__pregunta: "",
            tipo_pregunta: "directa",
            peso_pregunta: "media",
            activa: true,
            instrucciones_respuesta_tipo: tipo,
            instrucciones_respuesta_opciones: opciones,
          });
        }
        setModalPreguntaAbierto(true);
      };

      const guardarPregunta = async () => {
        if (!accessToken) return;
        if (!formPregunta.codigo_pregunta.trim() || !formPregunta.texto__pregunta.trim()) {
          toast({ title: "Campos requeridos", description: "Código y texto de la pregunta son obligatorios", variant: "destructive" });
          return;
        }
        const existe = await existeCodigoPregunta(
          accessToken,
          formPregunta.tipo_test,
          formPregunta.codigo_pregunta,
          preguntaEdit?.id
        );
        if (existe) {
          toast({
            title: "Código duplicado",
            description: preguntaEdit
              ? `Ya existe otra pregunta con el código "${formPregunta.codigo_pregunta.trim()}" para el tipo de test ${formPregunta.tipo_test}. Elige otro código.`
              : `Ya existe una pregunta con el código "${formPregunta.codigo_pregunta.trim()}" para el tipo de test ${formPregunta.tipo_test}. Elige otro código.`,
            variant: "destructive",
          });
          return;
        }
        setGuardandoPregunta(true);
        const tipoInst = formPregunta.instrucciones_respuesta_tipo ?? "si_no";
        const opcionesInst = (formPregunta.instrucciones_respuesta_opciones ?? ["Sí", "No"]).filter(Boolean);
        const instruccionesRespuesta = { tipo: tipoInst, opciones: opcionesInst.length ? opcionesInst : ["Sí", "No"] };

        try {
          if (preguntaEdit) {
            await actualizarPregunta(accessToken, preguntaEdit.id, {
              codigo_pregunta: formPregunta.codigo_pregunta,
              tipo_test: formPregunta.tipo_test,
              dimension_principal: formPregunta.dimension_principal,
              texto__pregunta: formPregunta.texto__pregunta,
              tipo_pregunta: formPregunta.tipo_pregunta,
              peso_pregunta: formPregunta.peso_pregunta,
              instrucciones_pregunta: formPregunta.instrucciones_pregunta,
              instrucciones_respuesta: instruccionesRespuesta,
              dimension_secundaria: formPregunta.dimension_secundaria,
              activa: formPregunta.activa,
            });
            toast({ title: "Pregunta actualizada", description: "Se guardaron los cambios correctamente." });
          } else {
            await crearPregunta(accessToken, {
              codigo_pregunta: formPregunta.codigo_pregunta,
              tipo_test: formPregunta.tipo_test,
              dimension_principal: formPregunta.dimension_principal,
              texto__pregunta: formPregunta.texto__pregunta,
              tipo_pregunta: formPregunta.tipo_pregunta,
              peso_pregunta: formPregunta.peso_pregunta,
              instrucciones_pregunta: formPregunta.instrucciones_pregunta,
              instrucciones_respuesta: instruccionesRespuesta,
              dimension_secundaria: formPregunta.dimension_secundaria,
              activa: formPregunta.activa ?? true,
            });
            toast({ title: "Pregunta creada", description: "La pregunta se agregó correctamente." });
          }
          setModalPreguntaAbierto(false);
          const res = await listarPreguntas(accessToken, {
            page: 1,
            limit: preguntasPagination.limit,
            tipo_test: preguntasFilters.tipo_test || undefined,
            dimension_principal: preguntasFilters.dimension_principal || undefined,
            activa: preguntasFilters.activa === "" ? undefined : preguntasFilters.activa,
          });
          setPreguntasList(res.data.items);
          setPreguntasPagination(prev => ({
            ...prev,
            page: 1,
            total: res.data.pagination.total,
            totalPages: res.data.pagination.totalPages,
          }));
        } catch (e: unknown) {
          toast({ title: "Error", description: e instanceof Error ? e.message : "Error al guardar", variant: "destructive" });
        } finally {
          setGuardandoPregunta(false);
        }
      };

      const abrirConfirmDesactivarPregunta = (p: PreguntaItem) => setPreguntaADesactivar(p);
      const confirmarDesactivarPregunta = async () => {
        if (!preguntaADesactivar || !accessToken) return;
        setDesactivandoPregunta(true);
        try {
          await desactivarPregunta(accessToken, preguntaADesactivar.id);
          toast({ title: "Pregunta desactivada", description: "Se desactivó correctamente." });
          setPreguntasList(prev => prev.map(x => x.id === preguntaADesactivar.id ? { ...x, activa: false } : x));
          setPreguntaADesactivar(null);
        } catch (e: unknown) {
          toast({ title: "Error", description: e instanceof Error ? e.message : "Error al desactivar", variant: "destructive" });
        } finally {
          setDesactivandoPregunta(false);
        }
      };

      const TIPOS_TEST_CSV = ["Holland_RIASEC", "Kuder", "ICO", "Personalizado"] as const;
      const DIMENSIONES_CSV = ["Realista", "Investigador", "Artístico", "Social", "Emprendedor", "Convencional"] as const;

      const preguntasFiltradasPorCodigo = busquedaCodigoPregunta.trim()
        ? preguntasList.filter((p) =>
            p.codigo_pregunta.toLowerCase().includes(busquedaCodigoPregunta.trim().toLowerCase())
          )
        : preguntasList;

      const csvCell = (val: string) => {
        if (val.includes(";") || val.includes('"') || val.includes("\n")) return '"' + val.replace(/"/g, '""') + '"';
        return val;
      };

      const descargarPlantillaVacia = () => {
        const header = "codigo_pregunta;tipo_test;dimension_principal;texto__pregunta;tipo_pregunta;peso_pregunta;activa;instrucciones_respuesta";
        const ejemplo = "H-R-01;Holland_RIASEC;Realista;¿Te gusta trabajar con herramientas?;directa;alta;true;{\"tipo\":\"si_no\",\"opciones\":[\"Sí\",\"No\"]}";
        const csv = [header, ejemplo].join("\n");
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "plantilla_preguntas_vacia.csv";
        a.click();
        URL.revokeObjectURL(url);
      };

      const exportarPreguntas = async () => {
        if (!accessToken) return;
        setExportandoPreguntas(true);
        try {
          const todas: PreguntaItem[] = [];
          let page = 1;
          const limit = 100;
          let totalPages = 1;
          do {
            const res = await listarPreguntas(accessToken, {
              page,
              limit,
              tipo_test: preguntasFilters.tipo_test || undefined,
              dimension_principal: preguntasFilters.dimension_principal || undefined,
              activa: preguntasFilters.activa === "" ? undefined : preguntasFilters.activa,
            });
            todas.push(...res.data.items);
            totalPages = res.data.pagination.totalPages;
            page++;
          } while (page <= totalPages);
          const header = "codigo_pregunta;tipo_test;dimension_principal;texto__pregunta;tipo_pregunta;peso_pregunta;activa;instrucciones_respuesta";
          const filas = todas.map((p) => {
            const instResp = p.instrucciones_respuesta;
            const instStr = instResp != null ? JSON.stringify(instResp) : "";
            return [
              csvCell(p.codigo_pregunta),
              csvCell(p.tipo_test),
              csvCell(p.dimension_principal),
              csvCell((p.texto__pregunta || "").replace(/;/g, ",")),
              csvCell(p.tipo_pregunta),
              csvCell(p.peso_pregunta),
              csvCell(p.activa ? "true" : "false"),
              csvCell(instStr),
            ].join(";");
          });
          const csv = [header, ...filas].join("\n");
          const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = preguntasFilters.tipo_test || preguntasFilters.dimension_principal
            ? `preguntas_exportadas_${new Date().toISOString().slice(0, 10)}.csv`
            : "preguntas_todas.csv";
          a.click();
          URL.revokeObjectURL(url);
          toast({
            title: "Exportación lista",
            description: `Se descargaron ${todas.length} pregunta(s). Sin filtros = todas; con filtros = solo las que coinciden.`,
          });
        } catch (e: unknown) {
          toast({
            title: "Error al exportar",
            description: e instanceof Error ? e.message : "No se pudieron cargar las preguntas",
            variant: "destructive",
          });
        } finally {
          setExportandoPreguntas(false);
        }
      };

      const parsearLineaCSV = (linea: string): string[] => {
        const campos: string[] = [];
        let campo = "";
        let entreComillas = false;
        for (let i = 0; i < linea.length; i++) {
          const c = linea[i];
          if (c === '"') {
            entreComillas = !entreComillas;
          } else if ((c === ";" && !entreComillas) || (c === "\t" && !entreComillas)) {
            campos.push(campo.trim());
            campo = "";
          } else {
            campo += c;
          }
        }
        campos.push(campo.trim());
        return campos;
      };

      const cargarPreguntasDesdeArchivo = async (file: File) => {
        if (!accessToken) return;
        setUploadPreguntasResult(null);
        setUploadPreguntasLoading(true);
        const resultado = { creadas: 0, duplicados: 0, errores: [] as string[] };
        try {
          const texto = await file.text();
          const lineas = texto.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
          const esCabecera = (linea: string) =>
            linea.toLowerCase().startsWith("codigo") || linea.toLowerCase().includes("codigo_pregunta");
          const filas = lineas.filter((l) => !esCabecera(l));
          for (let i = 0; i < filas.length; i++) {
            const campos = parsearLineaCSV(filas[i]);
            if (campos.length < 4) {
              resultado.errores.push(`Fila ${i + 1}: faltan columnas (mínimo: código, tipo_test, dimensión, texto)`);
              continue;
            }
            const [codigo, tipoTest, dimension, textoPregunta] = campos.map((c) => c.trim());
            const tipoPregunta = (campos[4]?.trim() || "directa") as "directa" | "comparativa" | "situacional" | "proyectiva";
            const pesoPregunta = (campos[5]?.trim() || "media") as "alta" | "media" | "baja";
            const activa = campos[6]?.trim().toLowerCase() !== "false";
            let instruccionesRespuesta: InstruccionesRespuestaValue | undefined;
            const instStr = campos[7]?.trim();
            if (instStr) {
              try {
                const parsed = JSON.parse(instStr);
                if (Array.isArray(parsed) || (typeof parsed === "object" && parsed !== null && "opciones" in parsed)) {
                  instruccionesRespuesta = parsed as InstruccionesRespuestaValue;
                }
              } catch {
                // ignorar: se crea sin instrucciones_respuesta
              }
            }
            if (!codigo || !tipoTest || !dimension || !textoPregunta) {
              resultado.errores.push(`Fila ${i + 1}: código, tipo_test, dimension_principal y texto son obligatorios`);
              continue;
            }
            if (!TIPOS_TEST_CSV.includes(tipoTest as typeof TIPOS_TEST_CSV[number])) {
              resultado.errores.push(`Fila ${i + 1}: tipo_test debe ser uno de: ${TIPOS_TEST_CSV.join(", ")}`);
              continue;
            }
            if (!DIMENSIONES_CSV.includes(dimension as typeof DIMENSIONES_CSV[number])) {
              resultado.errores.push(`Fila ${i + 1}: dimension_principal debe ser una de: ${DIMENSIONES_CSV.join(", ")}`);
              continue;
            }
            try {
              await crearPregunta(accessToken, {
                codigo_pregunta: codigo,
                tipo_test: tipoTest as TipoTestPregunta,
                dimension_principal: dimension as DimensionRIASEC,
                texto__pregunta: textoPregunta,
                tipo_pregunta: ["directa", "comparativa", "situacional", "proyectiva"].includes(tipoPregunta) ? tipoPregunta : "directa",
                peso_pregunta: ["alta", "media", "baja"].includes(pesoPregunta) ? pesoPregunta : "media",
                activa,
                ...(instruccionesRespuesta != null && (Array.isArray(instruccionesRespuesta) ? instruccionesRespuesta.length > 0 : true) ? { instrucciones_respuesta: instruccionesRespuesta } : {}),
              });
              resultado.creadas++;
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : String(err);
              if (msg.includes("Ya existe") || msg.includes("409") || msg.includes("duplicado")) {
                resultado.duplicados++;
              } else {
                resultado.errores.push(`Fila ${i + 1} (${codigo}): ${msg}`);
              }
            }
          }
          setUploadPreguntasResult(resultado);
          setPreguntasPagination(prev => ({ ...prev, page: 1 }));
          const res = await listarPreguntas(accessToken, {
            page: 1,
            limit: preguntasPagination.limit,
            tipo_test: preguntasFilters.tipo_test || undefined,
            dimension_principal: preguntasFilters.dimension_principal || undefined,
            activa: preguntasFilters.activa === "" ? undefined : preguntasFilters.activa,
          });
          setPreguntasList(res.data.items);
          setPreguntasPagination(p => ({ ...p, total: res.data.pagination.total, totalPages: res.data.pagination.totalPages }));
          toast({
            title: "Carga completada",
            description: `Creadas: ${resultado.creadas}. Duplicados omitidos: ${resultado.duplicados}.${resultado.errores.length ? ` Errores: ${resultado.errores.length}.` : ""}`,
            variant: resultado.errores.length ? "destructive" : "default",
          });
        } catch (e: unknown) {
          toast({
            title: "Error al procesar el archivo",
            description: e instanceof Error ? e.message : "No se pudo leer el archivo",
            variant: "destructive",
          });
          setUploadPreguntasResult({ creadas: 0, duplicados: 0, errores: [e instanceof Error ? e.message : String(e)] });
        } finally {
          setUploadPreguntasLoading(false);
          if (fileInputPreguntasRef.current) fileInputPreguntasRef.current.value = "";
        }
      };

      return (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Preguntas de los tests</h2>
            <p className="text-sm text-slate-600">Gestión de preguntas para Holland RIASEC, Kuder, ICO y Personalizado. Crear, editar y desactivar (soft delete). Puedes agregar una por una o cargar varias desde un CSV (descarga la plantilla y usa punto y coma como separador).</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por código..."
                className="pl-8 rounded-md border border-slate-200"
                value={busquedaCodigoPregunta}
                onChange={(e) => setBusquedaCodigoPregunta(e.target.value)}
              />
            </div>
            <select
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              value={preguntasFilters.tipo_test}
              onChange={e => setPreguntasFilters(f => ({ ...f, tipo_test: (e.target.value || "") as TipoTestPregunta | "" }))}
            >
              <option value="">Todos los tipos</option>
              {TIPOS_TEST.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              value={preguntasFilters.dimension_principal}
              onChange={e => setPreguntasFilters(f => ({ ...f, dimension_principal: (e.target.value || "") as DimensionRIASEC | "" }))}
            >
              <option value="">Todas las dimensiones</option>
              {DIMENSIONES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
            <select
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              value={preguntasFilters.activa === "" ? "" : preguntasFilters.activa ? "true" : "false"}
              onChange={e => setPreguntasFilters(f => ({ ...f, activa: e.target.value === "" ? "" : e.target.value === "true" }))}
            >
              <option value="">Todas</option>
              <option value="true">Activas</option>
              <option value="false">Inactivas</option>
            </select>
            <Button onClick={() => abrirModalPregunta()} className="bg-primary text-primary-foreground">Agregar pregunta</Button>
          </div>

          <Card className="border-orange/20 bg-slate-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Guía: usar archivos CSV
              </CardTitle>
              <CardDescription>
                Elige qué quieres hacer: descargar una plantilla o exportar preguntas, o subir un archivo con nuevas preguntas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={guiaCSVPreguntasTab ?? "descargar"} onValueChange={(v) => setGuiaCSVPreguntasTab(v as "descargar" | "subir")}>
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="descargar" onClick={() => setGuiaCSVPreguntasTab("descargar")}>
                    Quiero descargar
                  </TabsTrigger>
                  <TabsTrigger value="subir" onClick={() => setGuiaCSVPreguntasTab("subir")}>
                    Quiero subir un CSV
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="descargar" className="mt-4 space-y-3">
                  <p className="text-sm font-medium text-slate-700">Pasos para descargar:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600">
                    <li><strong>Plantilla vacía:</strong> si vas a crear preguntas nuevas en Excel o similar, descarga la plantilla vacía (solo cabecera y un ejemplo).</li>
                    <li><strong>Exportar preguntas:</strong> si quieres ver todas las preguntas en CSV o editarlas fuera del sistema, exporta. Sin filtros = todas las preguntas; con tipo/dimensión/estado = solo las que coinciden.</li>
                  </ol>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={descargarPlantillaVacia} className="gap-1">
                      <Download className="h-4 w-4" /> Descargar plantilla vacía
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportarPreguntas} disabled={exportandoPreguntas} className="gap-1">
                      {exportandoPreguntas ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                      {exportandoPreguntas ? "Exportando…" : "Exportar preguntas (según filtros)"}
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="subir" className="mt-4 space-y-3">
                  <p className="text-sm font-medium text-slate-700">Pasos para subir un CSV:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600">
                    <li>Descarga la plantilla vacía o exporta preguntas para ver el formato correcto.</li>
                    <li>El archivo debe ser <strong>CSV con separador punto y coma (;)</strong>. Si el texto de la pregunta lleva punto y coma, envuélvelo entre comillas dobles.</li>
                    <li><strong>Columnas en este orden:</strong> codigo_pregunta, tipo_test, dimension_principal, texto__pregunta, tipo_pregunta, peso_pregunta, activa.</li>
                    <li><strong>tipo_test</strong> debe ser uno de: Holland_RIASEC, Kuder, ICO, Personalizado.</li>
                    <li><strong>dimension_principal</strong> debe ser una de: Realista, Investigador, Artístico, Social, Emprendedor, Convencional.</li>
                    <li>Haz clic en &quot;Cargar desde CSV&quot; y selecciona tu archivo. Se crearán las preguntas; las que ya existan (mismo código y tipo) se omitirán.</li>
                  </ol>
                  <div className="pt-2">
                    <input
                      ref={fileInputPreguntasRef}
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) cargarPreguntasDesdeArchivo(f);
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={uploadPreguntasLoading}
                      onClick={() => fileInputPreguntasRef.current?.click()}
                      className="gap-1"
                    >
                      {uploadPreguntasLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {uploadPreguntasLoading ? "Subiendo…" : "Cargar desde CSV"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          {uploadPreguntasResult && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
              <p className="font-medium text-slate-800 mb-1">Resultado de la carga</p>
              <p className="text-slate-600">Creadas: {uploadPreguntasResult.creadas} · Duplicados omitidos: {uploadPreguntasResult.duplicados}</p>
              {uploadPreguntasResult.errores.length > 0 && (
                <ul className="mt-2 list-disc list-inside text-destructive">
                  {uploadPreguntasResult.errores.slice(0, 10).map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                  {uploadPreguntasResult.errores.length > 10 && (
                    <li>… y {uploadPreguntasResult.errores.length - 10} errores más</li>
                  )}
                </ul>
              )}
            </div>
          )}
          {preguntasLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left p-3 font-medium">Código</th>
                      <th className="text-left p-3 font-medium">Tipo test</th>
                      <th className="text-left p-3 font-medium">Dimensión</th>
                      <th className="text-left p-3 font-medium">Texto</th>
                      <th className="text-left p-3 font-medium">Estado</th>
                      <th className="text-right p-3 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preguntasFiltradasPorCodigo.length === 0 ? (
                      <tr><td colSpan={6} className="p-6 text-center text-slate-500">{preguntasList.length === 0 ? "No hay preguntas que coincidan con los filtros." : "Ningún código coincide con la búsqueda. Prueba otro texto."}</td></tr>
                    ) : (
                      preguntasFiltradasPorCodigo.map(p => (
                        <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-3">{p.codigo_pregunta}</td>
                          <td className="p-3">{p.tipo_test}</td>
                          <td className="p-3">{p.dimension_principal}</td>
                          <td className="p-3 max-w-[200px] truncate" title={p.texto__pregunta}>{p.texto__pregunta}</td>
                          <td className="p-3">
                            <Badge variant={p.activa ? "default" : "secondary"}>{p.activa ? "Activa" : "Inactiva"}</Badge>
                          </td>
                          <td className="p-3 text-right">
                            <Button variant="ghost" size="sm" onClick={() => abrirModalPregunta(p)}>Editar</Button>
                            {p.activa && (
                              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => abrirConfirmDesactivarPregunta(p)}>Desactivar</Button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {preguntasPagination.totalPages > 1 && (
                <div className="flex items-center justify-between p-3 border-t border-slate-200">
                  <span className="text-sm text-slate-600">Total: {preguntasPagination.total}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={preguntasPagination.page <= 1} onClick={() => setPreguntasPagination(prev => ({ ...prev, page: prev.page - 1 }))}>Anterior</Button>
                    <span className="py-2 text-sm">Pág. {preguntasPagination.page} de {preguntasPagination.totalPages}</span>
                    <Button variant="outline" size="sm" disabled={preguntasPagination.page >= preguntasPagination.totalPages} onClick={() => setPreguntasPagination(prev => ({ ...prev, page: prev.page + 1 }))}>Siguiente</Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <Dialog open={modalPreguntaAbierto} onOpenChange={setModalPreguntaAbierto}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{preguntaEdit ? "Editar pregunta" : "Nueva pregunta"}</DialogTitle>
                <DialogDescription>Los campos código, tipo de test, dimensión y texto son obligatorios.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Código pregunta</Label>
                    <Input value={formPregunta.codigo_pregunta} onChange={e => setFormPregunta(f => ({ ...f, codigo_pregunta: e.target.value }))} placeholder="Ej. H-R-01" />
                  </div>
                  <div>
                    <Label>Tipo de test</Label>
                    <select className="w-full rounded-md border border-slate-200 bg-white px-3 py-2" value={formPregunta.tipo_test} onChange={e => setFormPregunta(f => ({ ...f, tipo_test: e.target.value as TipoTestPregunta }))}>
                      {TIPOS_TEST.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <Label>Dimensión principal</Label>
                  <select className="w-full rounded-md border border-slate-200 bg-white px-3 py-2" value={formPregunta.dimension_principal} onChange={e => setFormPregunta(f => ({ ...f, dimension_principal: e.target.value as DimensionRIASEC }))}>
                    {DIMENSIONES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Texto de la pregunta</Label>
                  <Textarea value={formPregunta.texto__pregunta} onChange={e => setFormPregunta(f => ({ ...f, texto__pregunta: e.target.value }))} rows={3} placeholder="¿Te gusta...?" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tipo pregunta</Label>
                    <select className="w-full rounded-md border border-slate-200 bg-white px-3 py-2" value={formPregunta.tipo_pregunta} onChange={e => setFormPregunta(f => ({ ...f, tipo_pregunta: e.target.value as "directa" | "comparativa" | "situacional" | "proyectiva" }))}>
                      <option value="directa">Directa</option>
                      <option value="comparativa">Comparativa</option>
                      <option value="situacional">Situacional</option>
                      <option value="proyectiva">Proyectiva</option>
                    </select>
                  </div>
                  <div>
                    <Label>Peso</Label>
                    <select className="w-full rounded-md border border-slate-200 bg-white px-3 py-2" value={formPregunta.peso_pregunta} onChange={e => setFormPregunta(f => ({ ...f, peso_pregunta: e.target.value as "alta" | "media" | "baja" }))}>
                      <option value="alta">Alta</option>
                      <option value="media">Media</option>
                      <option value="baja">Baja</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3 border-t border-slate-200 pt-4">
                  <Label>Instrucciones de respuesta</Label>
                  <div>
                    <Label className="text-xs text-muted-foreground">Tipo</Label>
                    <select
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 mt-1"
                      value={formPregunta.instrucciones_respuesta_tipo ?? "si_no"}
                      onChange={e => setFormPregunta(f => ({ ...f, instrucciones_respuesta_tipo: e.target.value as TipoInstruccionesRespuesta }))}
                    >
                      <option value="si_no">Sí / No</option>
                      <option value="dos_opciones">Dos opciones</option>
                      <option value="mas_de_dos_opciones">Más de dos opciones</option>
                      <option value="opciones_multiples">Opciones múltiples (escala)</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Opciones (etiquetas que verá el usuario)</Label>
                    <div className="space-y-2 mt-1">
                      {(formPregunta.instrucciones_respuesta_opciones ?? ["Sí", "No"]).map((opcion, idx) => (
                        <div key={idx} className="flex gap-2">
                          <Input
                            value={opcion}
                            onChange={e => {
                              const list = [...(formPregunta.instrucciones_respuesta_opciones ?? ["Sí", "No"])];
                              list[idx] = e.target.value;
                              setFormPregunta(f => ({ ...f, instrucciones_respuesta_opciones: list }));
                            }}
                            placeholder={`Opción ${idx + 1}`}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="shrink-0"
                            onClick={() => {
                              const list = (formPregunta.instrucciones_respuesta_opciones ?? ["Sí", "No"]).filter((_, i) => i !== idx);
                              setFormPregunta(f => ({ ...f, instrucciones_respuesta_opciones: list.length ? list : ["Sí", "No"] }));
                            }}
                            disabled={(formPregunta.instrucciones_respuesta_opciones ?? ["Sí", "No"]).length <= 1}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const list = [...(formPregunta.instrucciones_respuesta_opciones ?? ["Sí", "No"]), ""];
                          setFormPregunta(f => ({ ...f, instrucciones_respuesta_opciones: list }));
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" /> Añadir opción
                      </Button>
                    </div>
                  </div>
                </div>
                {preguntaEdit && (
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="activa-pregunta" checked={formPregunta.activa ?? true} onChange={e => setFormPregunta(f => ({ ...f, activa: e.target.checked }))} />
                    <Label htmlFor="activa-pregunta">Activa</Label>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setModalPreguntaAbierto(false)}>Cancelar</Button>
                <Button onClick={guardarPregunta} disabled={guardandoPregunta}>{guardandoPregunta ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar"}</Button>
              </div>
            </DialogContent>
          </Dialog>

          <AlertDialog open={!!preguntaADesactivar} onOpenChange={(open) => !open && setPreguntaADesactivar(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Desactivar pregunta</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Desactivar la pregunta &quot;{preguntaADesactivar?.codigo_pregunta}&quot;? No se borrará; dejará de usarse en nuevos tests.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    confirmarDesactivarPregunta();
                  }}
                  disabled={desactivandoPregunta}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {desactivandoPregunta ? <Loader2 className="h-4 w-4 animate-spin" /> : "Desactivar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    }

    if (activeModule === "carreras") {
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;

      const abrirModalCarrera = (c?: CareerListItem) => {
        if (c) {
          setCarreraEdit(c);
          setFormCarrera({
            name: c.name,
            faculty: c.faculty,
            code: c.code ?? "",
            area: c.area ?? "",
            description: (c as { description?: string }).description ?? "",
            duration: (c as { duration?: string }).duration ?? "",
            modality: (c as { modality?: string }).modality ?? "",
            is_active: (c as { is_active?: boolean }).is_active ?? true,
          });
        } else {
          setCarreraEdit(null);
          setFormCarrera({
            name: "",
            faculty: "",
            code: "",
            area: "",
            description: "",
            duration: "",
            modality: "",
          });
        }
        setModalCarreraAbierto(true);
      };

      const guardarCarrera = async () => {
        if (!accessToken) return;
        if (!formCarrera.name.trim() || !formCarrera.faculty.trim()) {
          toast({ title: "Campos requeridos", description: "Nombre y facultad son obligatorios", variant: "destructive" });
          return;
        }
        setGuardandoCarrera(true);
        try {
          if (carreraEdit) {
            await actualizarCareer(accessToken, carreraEdit.id, {
              name: formCarrera.name,
              faculty: formCarrera.faculty,
              code: formCarrera.code || undefined,
              area: formCarrera.area || undefined,
              description: formCarrera.description,
              duration: formCarrera.duration,
              modality: formCarrera.modality,
              is_active: formCarrera.is_active,
            });
            toast({ title: "Carrera actualizada", description: "Se guardaron los cambios." });
          } else {
            await crearCareer(accessToken, {
              name: formCarrera.name,
              faculty: formCarrera.faculty,
              code: formCarrera.code || undefined,
              area: formCarrera.area || undefined,
              description: formCarrera.description,
              duration: formCarrera.duration,
              modality: formCarrera.modality,
            });
            toast({ title: "Carrera creada", description: "La carrera se agregó correctamente." });
          }
          setModalCarreraAbierto(false);
          setCareersPagination(prev => ({ ...prev, page: 1 }));
          const res = await listarCareers(accessToken, {
            page: careersPagination.page,
            limit: careersPagination.limit,
            q: careersFilters.q || undefined,
            faculty: careersFilters.faculty || undefined,
            area: careersFilters.area || undefined,
            incluir_inactivas: careersFilters.incluir_inactivas,
          });
          setCareersList(res.data);
          setCareersPagination(p => ({ ...p, total: res.total, totalPages: res.totalPages }));
        } catch (e: unknown) {
          toast({ title: "Error", description: e instanceof Error ? e.message : "Error al guardar", variant: "destructive" });
        } finally {
          setGuardandoCarrera(false);
        }
      };

      const abrirConfirmDesactivarCarrera = (c: CareerListItem) => setCarreraADesactivar(c);
      const confirmarDesactivarCarrera = async () => {
        if (!carreraADesactivar || !accessToken) return;
        setDesactivandoCarrera(true);
        try {
          await desactivarCareer(accessToken, carreraADesactivar.id);
          toast({ title: "Carrera desactivada", description: "Se desactivó correctamente." });
          setCareersList(prev => prev.map(x => x.id === carreraADesactivar.id ? { ...x, is_active: false } : x));
          setCarreraADesactivar(null);
        } catch (e: unknown) {
          toast({ title: "Error", description: e instanceof Error ? e.message : "Error al desactivar", variant: "destructive" });
        } finally {
          setDesactivandoCarrera(false);
        }
      };

      return (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Catálogo de carreras</h2>
            <p className="text-sm text-slate-600">Agregar, editar y desactivar carreras. Las desactivadas no se muestran en el listado público salvo con "Incluir inactivas".</p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Input
              placeholder="Buscar por nombre o descripción"
              className="max-w-xs"
              value={careersFilters.q}
              onChange={e => setCareersFilters(f => ({ ...f, q: e.target.value }))}
            />
            <Input placeholder="Facultad" className="max-w-[140px]" value={careersFilters.faculty} onChange={e => setCareersFilters(f => ({ ...f, faculty: e.target.value }))} />
            <Input placeholder="Área" className="max-w-[140px]" value={careersFilters.area} onChange={e => setCareersFilters(f => ({ ...f, area: e.target.value }))} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={careersFilters.incluir_inactivas} onChange={e => setCareersFilters(f => ({ ...f, incluir_inactivas: e.target.checked }))} />
              Incluir inactivas
            </label>
            <Button onClick={() => abrirModalCarrera()} className="bg-primary text-primary-foreground">Agregar carrera</Button>
          </div>
          {careersLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left p-3 font-medium">Código</th>
                      <th className="text-left p-3 font-medium">Nombre</th>
                      <th className="text-left p-3 font-medium">Facultad</th>
                      <th className="text-left p-3 font-medium">Área</th>
                      <th className="text-left p-3 font-medium">Estado</th>
                      <th className="text-right p-3 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {careersList.length === 0 ? (
                      <tr><td colSpan={6} className="p-6 text-center text-slate-500">No hay carreras que coincidan con los filtros.</td></tr>
                    ) : (
                      careersList.map(c => (
                        <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-3">{c.code || "—"}</td>
                          <td className="p-3">{c.name}</td>
                          <td className="p-3">{c.faculty}</td>
                          <td className="p-3">{c.area || "—"}</td>
                          <td className="p-3">
                            <Badge variant={(c as { is_active?: boolean }).is_active !== false ? "default" : "secondary"}>
                              {(c as { is_active?: boolean }).is_active !== false ? "Activa" : "Inactiva"}
                            </Badge>
                          </td>
                          <td className="p-3 text-right">
                            <Button variant="ghost" size="sm" onClick={() => abrirModalCarrera(c)}>Editar</Button>
                            {(c as { is_active?: boolean }).is_active !== false && (
                              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => abrirConfirmDesactivarCarrera(c)}>Desactivar</Button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {careersPagination.totalPages > 1 && (
                <div className="flex items-center justify-between p-3 border-t border-slate-200">
                  <span className="text-sm text-slate-600">Total: {careersPagination.total}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={careersPagination.page <= 1} onClick={() => setCareersPagination(prev => ({ ...prev, page: prev.page - 1 }))}>Anterior</Button>
                    <span className="py-2 text-sm">Pág. {careersPagination.page} de {careersPagination.totalPages}</span>
                    <Button variant="outline" size="sm" disabled={careersPagination.page >= careersPagination.totalPages} onClick={() => setCareersPagination(prev => ({ ...prev, page: prev.page + 1 }))}>Siguiente</Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <Dialog open={modalCarreraAbierto} onOpenChange={setModalCarreraAbierto}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{carreraEdit ? "Editar carrera" : "Nueva carrera"}</DialogTitle>
                <DialogDescription>Nombre y facultad son obligatorios.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre *</Label>
                    <Input value={formCarrera.name} onChange={e => setFormCarrera(f => ({ ...f, name: e.target.value }))} placeholder="Ej. Ingeniería de Sistemas" />
                  </div>
                  <div>
                    <Label>Facultad *</Label>
                    <Input value={formCarrera.faculty} onChange={e => setFormCarrera(f => ({ ...f, faculty: e.target.value }))} placeholder="Ej. Ingeniería" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Código</Label>
                    <Input value={formCarrera.code} onChange={e => setFormCarrera(f => ({ ...f, code: e.target.value }))} placeholder="Ej. ING-SIS" />
                  </div>
                  <div>
                    <Label>Área</Label>
                    <Input value={formCarrera.area} onChange={e => setFormCarrera(f => ({ ...f, area: e.target.value }))} placeholder="Ej. Tecnología" />
                  </div>
                </div>
                <div>
                  <Label>Descripción</Label>
                  <Textarea value={formCarrera.description} onChange={e => setFormCarrera(f => ({ ...f, description: e.target.value }))} rows={2} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Duración</Label>
                    <Input value={formCarrera.duration} onChange={e => setFormCarrera(f => ({ ...f, duration: e.target.value }))} placeholder="Ej. 10 trimestres" />
                  </div>
                  <div>
                    <Label>Modalidad</Label>
                    <Input value={formCarrera.modality} onChange={e => setFormCarrera(f => ({ ...f, modality: e.target.value }))} placeholder="Ej. Presencial" />
                  </div>
                </div>
                {carreraEdit && (
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="activa-carrera" checked={formCarrera.is_active !== false} onChange={e => setFormCarrera(f => ({ ...f, is_active: e.target.checked }))} />
                    <Label htmlFor="activa-carrera">Activa</Label>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setModalCarreraAbierto(false)}>Cancelar</Button>
                <Button onClick={guardarCarrera} disabled={guardandoCarrera}>{guardandoCarrera ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar"}</Button>
              </div>
            </DialogContent>
          </Dialog>

          <AlertDialog open={!!carreraADesactivar} onOpenChange={(open) => !open && setCarreraADesactivar(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Desactivar carrera</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Desactivar la carrera &quot;{carreraADesactivar?.name}&quot;? Dejará de mostrarse en listados públicos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    confirmarDesactivarCarrera();
                  }}
                  disabled={desactivandoCarrera}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {desactivandoCarrera ? <Loader2 className="h-4 w-4 animate-spin" /> : "Desactivar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    }

    if (activeModule === "perfil") {
      // Usar perfilCompleto si está disponible, sino usar user del contexto
      const datosUsuario = perfilCompleto || user;

      return (
        <div className="space-y-6">
          <Card className="border-orange/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <User className="h-6 w-6" />
                Mi Perfil
              </CardTitle>
              <CardDescription>
                Información personal y datos de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loadingPerfil ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
                </div>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Nombre</Label>
                      <p className="text-base font-medium text-primary">
                        {datosUsuario?.nombre || 'No disponible'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Apellido</Label>
                      <p className="text-base font-medium text-primary">
                        {datosUsuario?.apellido || 'No disponible'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Correo Electrónico</Label>
                      <p className="text-base font-medium text-primary">
                        {datosUsuario?.email || 'No disponible'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Cédula</Label>
                      <p className="text-base font-medium text-primary">
                        {datosUsuario?.cedula || 'No disponible'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Teléfono</Label>
                      <p className="text-base font-medium text-primary">
                        {datosUsuario?.telefono || 'No disponible'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Rol</Label>
                      <p className="text-base font-medium text-primary capitalize">
                        {datosUsuario?.role || 'Especialista'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Estado de la cuenta:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        datosUsuario?.activo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {datosUsuario?.activo ? 'Activa' : 'Pendiente de aprobación'}
                      </span>
                    </div>
                    {!datosUsuario?.emailVerified && (
                      <p className="text-sm text-muted-foreground mt-2">
                        ⚠️ Tu correo electrónico aún no ha sido verificado
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {/* Modal de edición de campaña para grupos predefinidos */}
      <Dialog open={modalCampanaAbierto} onOpenChange={setModalCampanaAbierto}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Personalizar Campaña: {campanaSeleccionada?.nombreGrupo}
            </DialogTitle>
            <DialogDescription>
              Edita el contenido de la campaña antes de enviarla a {
                campanaSeleccionada?.grupo === 'facultad_ingenieria' ? estadisticasCampanas.facultadIngenieria :
                campanaSeleccionada?.grupo === 'facultad_ciencias_economicas' ? estadisticasCampanas.facultadCienciasEconomicas :
                campanaSeleccionada?.grupo === 'facultad_ciencias' ? estadisticasCampanas.facultadCiencias :
                campanaSeleccionada?.grupo === 'facultad_humanidades' ? estadisticasCampanas.facultadHumanidades :
                estadisticasCampanas.facultadEstudiosJuridicos
              } estudiante(s).
            </DialogDescription>
          </DialogHeader>

          {campanaSeleccionada && (
            <div className="space-y-4 mt-4">

              {/* Selector de template */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Estilo visual del correo</Label>
                <div className="grid grid-cols-5 gap-2">
                  {TEMPLATES_EMAIL.map(tpl => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setCampanaSeleccionada({ ...campanaSeleccionada, templateId: tpl.id })}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                        campanaSeleccionada.templateId === tpl.id
                          ? 'border-teal-500 bg-teal-50 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {/* Vista previa del color */}
                      <div className={`w-full h-8 rounded-lg ${tpl.previewBg} flex items-end justify-center pb-1`}>
                        <div className={`w-4 h-1.5 rounded-sm ${tpl.previewAccent}`} />
                      </div>
                      <span className="text-[10px] font-medium text-slate-700 leading-tight text-center">{tpl.nombre}</span>
                      <span className="text-[9px] text-slate-400 leading-tight text-center">{tpl.descripcion}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="titulo" className="text-sm font-semibold">
                  Título de la campaña
                </Label>
                <Input
                  id="titulo"
                  value={campanaSeleccionada.titulo}
                  onChange={(e) => setCampanaSeleccionada({ ...campanaSeleccionada, titulo: e.target.value })}
                  placeholder="Título que aparecerá en el correo"
                  className="bg-slate-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="asunto" className="text-sm font-semibold">
                  Asunto del correo
                </Label>
                <Input
                  id="asunto"
                  value={campanaSeleccionada.asunto}
                  onChange={(e) => setCampanaSeleccionada({ ...campanaSeleccionada, asunto: e.target.value })}
                  placeholder="Asunto que verán los destinatarios"
                  className="bg-slate-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contenido" className="text-sm font-semibold">
                  Contenido del mensaje
                </Label>
                {/* Toolbar de formato */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-t-lg">
                  {(['bold', 'italic', 'underline'] as const).map((tipo) => {
                    const activo = isFormatoActivo(tipo, campanaSeleccionada.contenido, seleccionGrupo.start, seleccionGrupo.end);
                    const Icon = tipo === 'bold' ? Bold : tipo === 'italic' ? Italic : Underline;
                    const titulo = tipo === 'bold' ? 'Negrita' : tipo === 'italic' ? 'Cursiva' : 'Subrayado';
                    return (
                      <button
                        key={tipo}
                        type="button"
                        title={titulo}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => aplicarFormato(tipo, textareaGrupoRef, () => campanaSeleccionada.contenido, (v) => setCampanaSeleccionada({ ...campanaSeleccionada, contenido: v }))}
                        className={`p-1.5 rounded transition-all ${activo ? 'bg-teal-100 text-teal-700 shadow-inner' : 'hover:bg-white hover:shadow-sm text-slate-700'}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </button>
                    );
                  })}
                  <div className="w-px h-4 bg-slate-300 mx-0.5" />
                  <button
                    type="button"
                    title="Lista con viñetas"
                    onClick={() => aplicarFormato('list', textareaGrupoRef, () => campanaSeleccionada.contenido, (v) => setCampanaSeleccionada({ ...campanaSeleccionada, contenido: v }))}
                    className="p-1.5 rounded hover:bg-white hover:shadow-sm transition-all text-slate-700"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
                <Textarea
                  id="contenido"
                  ref={textareaGrupoRef}
                  value={campanaSeleccionada.contenido}
                  onChange={(e) => { setCampanaSeleccionada({ ...campanaSeleccionada, contenido: e.target.value }); const t = e.currentTarget; setSeleccionGrupo({ start: t.selectionStart, end: t.selectionEnd }); }}
                  onSelect={(e) => { const t = e.currentTarget; setSeleccionGrupo({ start: t.selectionStart, end: t.selectionEnd }); }}
                  onKeyUp={(e) => { const t = e.currentTarget; setSeleccionGrupo({ start: t.selectionStart, end: t.selectionEnd }); }}
                  onMouseUp={(e) => { const t = e.currentTarget; setSeleccionGrupo({ start: t.selectionStart, end: t.selectionEnd }); }}
                  onClick={(e) => { const t = e.currentTarget; setSeleccionGrupo({ start: t.selectionStart, end: t.selectionEnd }); }}
                  placeholder="Escribe el contenido del correo..."
                  className="min-h-[200px] bg-slate-50 rounded-t-none border-t-0"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ctaTexto" className="text-sm font-semibold">
                    Texto del botón
                  </Label>
                  <Input
                    id="ctaTexto"
                    value={campanaSeleccionada.ctaTexto}
                    onChange={(e) => setCampanaSeleccionada({ ...campanaSeleccionada, ctaTexto: e.target.value })}
                    placeholder="Ej: Registrarme"
                    className="bg-slate-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ctaUrl" className="text-sm font-semibold">
                    URL del botón
                  </Label>
                  <Input
                    id="ctaUrl"
                    value={campanaSeleccionada.ctaUrl}
                    onChange={(e) => setCampanaSeleccionada({ ...campanaSeleccionada, ctaUrl: e.target.value })}
                    placeholder="https://..."
                    className="bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setModalCampanaAbierto(false)}
                  disabled={loadingCampanas}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleEnviarCampanaPersonalizada}
                  disabled={loadingCampanas}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  {loadingCampanas ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Enviar Campaña
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de campaña para grupo segmentado */}
      <Dialog open={modalCampanaPersonalizada} onOpenChange={setModalCampanaPersonalizada}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Crear Campaña Personalizada
            </DialogTitle>
            <DialogDescription>
              Campaña para {resultadoSegmentacion?.length || 0} estudiante(s) del grupo segmentado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">

            {/* Selector de template */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Estilo visual del correo</Label>
              <div className="grid grid-cols-5 gap-2">
                {TEMPLATES_EMAIL.map(tpl => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setCampanaPersonalizada({ ...campanaPersonalizada, templateId: tpl.id })}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                      campanaPersonalizada.templateId === tpl.id
                        ? 'border-teal-500 bg-teal-50 shadow-md'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`w-full h-8 rounded-lg ${tpl.previewBg} flex items-end justify-center pb-1`}>
                      <div className={`w-4 h-1.5 rounded-sm ${tpl.previewAccent}`} />
                    </div>
                    <span className="text-[10px] font-medium text-slate-700 leading-tight text-center">{tpl.nombre}</span>
                    <span className="text-[9px] text-slate-400 leading-tight text-center">{tpl.descripcion}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="titulo-segmentado" className="text-sm font-semibold">
                Título de la campaña
              </Label>
              <Input
                id="titulo-segmentado"
                value={campanaPersonalizada.titulo}
                onChange={(e) => setCampanaPersonalizada({ ...campanaPersonalizada, titulo: e.target.value })}
                placeholder="Título que aparecerá en el correo"
                className="bg-slate-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="asunto-segmentado" className="text-sm font-semibold">
                Asunto del correo
              </Label>
              <Input
                id="asunto-segmentado"
                value={campanaPersonalizada.asunto}
                onChange={(e) => setCampanaPersonalizada({ ...campanaPersonalizada, asunto: e.target.value })}
                placeholder="Asunto que verán los destinatarios"
                className="bg-slate-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contenido-segmentado" className="text-sm font-semibold">
                Contenido del mensaje
              </Label>
              {/* Toolbar de formato */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-t-lg">
                {(['bold', 'italic', 'underline'] as const).map((tipo) => {
                  const activo = isFormatoActivo(tipo, campanaPersonalizada.contenido, seleccionSegmentada.start, seleccionSegmentada.end);
                  const Icon = tipo === 'bold' ? Bold : tipo === 'italic' ? Italic : Underline;
                  const titulo = tipo === 'bold' ? 'Negrita' : tipo === 'italic' ? 'Cursiva' : 'Subrayado';
                  return (
                    <button
                      key={tipo}
                      type="button"
                      title={titulo}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => aplicarFormato(tipo, textareaSegmentadaRef, () => campanaPersonalizada.contenido, (v) => setCampanaPersonalizada({ ...campanaPersonalizada, contenido: v }))}
                      className={`p-1.5 rounded transition-all ${activo ? 'bg-teal-100 text-teal-700 shadow-inner' : 'hover:bg-white hover:shadow-sm text-slate-700'}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
                <div className="w-px h-4 bg-slate-300 mx-0.5" />
                <button
                  type="button"
                  title="Lista con viñetas"
                  onClick={() => aplicarFormato('list', textareaSegmentadaRef, () => campanaPersonalizada.contenido, (v) => setCampanaPersonalizada({ ...campanaPersonalizada, contenido: v }))}
                  className="p-1.5 rounded hover:bg-white hover:shadow-sm transition-all text-slate-700"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
              <Textarea
                id="contenido-segmentado"
                ref={textareaSegmentadaRef}
                value={campanaPersonalizada.contenido}
                onChange={(e) => { setCampanaPersonalizada({ ...campanaPersonalizada, contenido: e.target.value }); const t = e.currentTarget; setSeleccionSegmentada({ start: t.selectionStart, end: t.selectionEnd }); }}
                onSelect={(e) => { const t = e.currentTarget; setSeleccionSegmentada({ start: t.selectionStart, end: t.selectionEnd }); }}
                onKeyUp={(e) => { const t = e.currentTarget; setSeleccionSegmentada({ start: t.selectionStart, end: t.selectionEnd }); }}
                onMouseUp={(e) => { const t = e.currentTarget; setSeleccionSegmentada({ start: t.selectionStart, end: t.selectionEnd }); }}
                onClick={(e) => { const t = e.currentTarget; setSeleccionSegmentada({ start: t.selectionStart, end: t.selectionEnd }); }}
                placeholder="Escribe el contenido del correo..."
                className="min-h-[200px] bg-slate-50 rounded-t-none border-t-0"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ctaTexto-segmentado" className="text-sm font-semibold">
                  Texto del botón
                </Label>
                <Input
                  id="ctaTexto-segmentado"
                  value={campanaPersonalizada.ctaTexto}
                  onChange={(e) => setCampanaPersonalizada({ ...campanaPersonalizada, ctaTexto: e.target.value })}
                  placeholder="Ej: Registrarme"
                  className="bg-slate-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctaUrl-segmentado" className="text-sm font-semibold">
                  URL del botón
                </Label>
                <Input
                  id="ctaUrl-segmentado"
                  value={campanaPersonalizada.ctaUrl}
                  onChange={(e) => setCampanaPersonalizada({ ...campanaPersonalizada, ctaUrl: e.target.value })}
                  placeholder="https://..."
                  className="bg-slate-50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setModalCampanaPersonalizada(false)}
                disabled={loadingCampanas}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleEnviarCampanaSegmentada}
                disabled={loadingCampanas}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {loadingCampanas ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar Campaña
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de agendar cita */}
      <Dialog open={modalCitaAbierto} onOpenChange={setModalCitaAbierto}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Agendar Cita con {selectedStudent?.name}
            </DialogTitle>
            <DialogDescription>
              Programa una reunión de orientación con el estudiante
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Fecha y Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha-cita" className="text-sm font-semibold">
                  Fecha <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fecha-cita"
                  type="date"
                  value={datosCita.fecha}
                  onChange={(e) => setDatosCita({ ...datosCita, fecha: e.target.value })}
                  className="bg-slate-50"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora-cita" className="text-sm font-semibold">
                  Hora <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="hora-cita"
                  type="time"
                  value={datosCita.hora}
                  onChange={(e) => setDatosCita({ ...datosCita, hora: e.target.value })}
                  className="bg-slate-50"
                />
              </div>
            </div>

            {/* Modalidad */}
            <div className="space-y-2">
              <Label htmlFor="modalidad-cita" className="text-sm font-semibold">
                Modalidad
              </Label>
              <select
                id="modalidad-cita"
                value={datosCita.modalidad}
                onChange={(e) => setDatosCita({ ...datosCita, modalidad: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
                <option value="telefonica">Telefónica</option>
              </select>
            </div>

            {/* Motivo */}
            <div className="space-y-2">
              <Label htmlFor="motivo-cita" className="text-sm font-semibold">
                Motivo de la cita <span className="text-red-500">*</span>
              </Label>
              <select
                id="motivo-cita"
                value={datosCita.motivo}
                onChange={(e) => setDatosCita({ ...datosCita, motivo: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Selecciona un motivo...</option>
                <option value="orientacion_vocacional">Orientación Vocacional</option>
                <option value="revision_resultados">Revisión de Resultados de Test</option>
                <option value="opciones_beca">Información sobre Becas</option>
                <option value="plan_estudios">Plan de Estudios</option>
                <option value="seguimiento">Seguimiento General</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            {/* Notas adicionales */}
            <div className="space-y-2">
              <Label htmlFor="notas-cita" className="text-sm font-semibold">
                Notas adicionales
              </Label>
              <Textarea
                id="notas-cita"
                value={datosCita.notas}
                onChange={(e) => setDatosCita({ ...datosCita, notas: e.target.value })}
                placeholder="Agrega cualquier información relevante para la cita..."
                className="min-h-[100px] bg-slate-50"
              />
            </div>

            {/* Información del estudiante */}
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-teal-900 mb-1">Contacto del estudiante:</p>
              <p className="text-sm text-teal-800">{selectedStudent?.email}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setModalCitaAbierto(false)}
              disabled={loadingCita}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAgendarCita}
              disabled={loadingCita}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {loadingCita ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Agendando...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Cita
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-orange/20 px-6 py-4 sticky top-0 z-10">
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
              <h1 className="text-2xl font-bold text-primary">Panel del Especialista</h1>
              <p className="text-sm text-muted-foreground">Sistema de Orientación Vocacional</p>
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
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
    </>
  );
};

export default DashboardEspecialist;

