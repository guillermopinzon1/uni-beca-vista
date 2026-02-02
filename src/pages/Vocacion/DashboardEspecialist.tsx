import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Target, Users, BookOpen, TrendingUp, Heart, Award, CheckCircle, AlertCircle, Info, FileText, BrainCircuit, Upload, User, LogOut, Search, Filter, Calendar, MessageSquare, Mail, BarChart, Download, Megaphone, Sparkles, ChevronRight, ArrowUpRight, GraduationCap, Loader2, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useEffect } from "react";
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
import { obtenerHistorialEspecialista, HistorialEspecialistaResponse } from "@/lib/api/orientacionVocacional";
import { enviarGrupoPredefinido, obtenerEstadisticas, segmentarEstudiantes, enviarCampana } from "@/lib/api/campanas";
import type { Estudiante, FiltrosSegmentacion } from "@/lib/api/campanas";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { getUserProfile, type UserProfileResponse } from "@/lib/api/auth";

// Interface para mapear datos del backend
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
  totalSesiones: number;
  recomendacionesCarreras: RecomendacionCarrera[];
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
  const [admissionsData, setAdmissionsData] = useState<HistorialEspecialistaResponse['data']>([]);
  const [notasColegio, setNotasColegio] = useState({
    primerAno: "",
    segundoAno: "",
    tercerAno: "",
    cuartoAno: "",
    promedio: ""
  });
  const [estadisticasCampanas, setEstadisticasCampanas] = useState({
    ingenieria: 0,
    artes: 0,
    cienciasSociales: 0,
    total: 0
  });
  const [loadingCampanas, setLoadingCampanas] = useState(false);
  const [modalCampanaAbierto, setModalCampanaAbierto] = useState(false);
  const [campanaSeleccionada, setCampanaSeleccionada] = useState<{
    grupo: 'ingenieria' | 'artes' | 'ciencias_sociales';
    nombreGrupo: string;
    titulo: string;
    asunto: string;
    contenido: string;
    ctaTexto: string;
    ctaUrl: string;
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
  }>({
    titulo: "",
    asunto: "",
    contenido: "",
    ctaTexto: "",
    ctaUrl: ""
  });
  const [perfilCompleto, setPerfilCompleto] = useState<UserProfileResponse['data'] | null>(null);
  const [loadingPerfil, setLoadingPerfil] = useState(false);

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

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString('es-ES', { month: 'short' });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch {
      return dateString;
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
  const getRiskLevel = (perfilDominante: string, totalSesiones: number): "Alto" | "Medio" | "Bajo" => {
    // Si tiene múltiples sesiones, es menos riesgoso
    if (totalSesiones > 2) return "Bajo";
    // Si el perfil es muy específico, es menos riesgoso
    if (perfilDominante && perfilDominante.length > 10) return "Bajo";
    // Si tiene pocas sesiones y perfil disperso, es más riesgoso
    if (totalSesiones === 1) return "Alto";
    return "Medio";
  };

  // Función para determinar el estado basado en los datos
  const getStatus = (totalSesiones: number, ultimaFechaTest: string): string => {
    const daysSinceLastTest = Math.floor(
      (new Date().getTime() - new Date(ultimaFechaTest).getTime()) / (1000 * 60 * 60 * 24)
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
        
        // Guardar datos crudos para el módulo de admissions
        if (isLoadingAdmissions) {
          setAdmissionsData(respuesta.data);
        }
        
        // Mapear datos del backend a la estructura del componente para estudiantes
        if (isLoadingEstudiantes) {
          const estudiantesMapeados: StudentData[] = respuesta.data.map((item) => {
            const careerInterest = item.recomendacionesCarreras.length > 0 
              ? item.recomendacionesCarreras[0].name 
              : "Indeciso";
            
            return {
              id: item.estudiante.id,
              name: item.estudiante.nombre,
              email: item.estudiante.email,
              career_interest: careerInterest,
              status: getStatus(item.totalSesiones, item.ultimaFechaTest),
              last_test: formatDate(item.ultimaFechaTest),
              result: `Perfil ${item.perfilDominante}`,
              risk_level: getRiskLevel(item.perfilDominante, item.totalSesiones),
              avatar: getInitials(item.estudiante.nombre),
              codigoHolland: item.codigoHolland,
              totalSesiones: item.totalSesiones,
              recomendacionesCarreras: item.recomendacionesCarreras
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
        console.log('📊 Cargando estadísticas de campañas...');
        const respuesta = await obtenerEstadisticas(accessToken);
        console.log('📊 Respuesta del backend:', respuesta);
        console.log('📊 Datos de estadísticas:', respuesta.data);
        setEstadisticasCampanas(respuesta.data);
      } catch (error: unknown) {
        console.error('❌ Error al cargar estadísticas:', error);
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

  // Función para abrir el modal de edición de campaña
  const handleAbrirModalCampana = (
    grupo: 'ingenieria' | 'artes' | 'ciencias_sociales',
    nombreGrupo: string
  ) => {
    // Contenido predeterminado según el grupo
    const contenidosPorGrupo = {
      ingenieria: {
        titulo: "Webinar: Futuro de la IA y la Ingeniería",
        asunto: "Invitación: Webinar sobre Inteligencia Artificial",
        contenido: `Hemos identificado que tu perfil vocacional muestra gran afinidad con las áreas de tecnología e ingeniería.

Te invitamos a un webinar exclusivo donde exploraremos:
• Las últimas tendencias en Inteligencia Artificial
• Oportunidades de carrera en tecnología
• Innovaciones en ingeniería de sistemas

Fecha: Próximo sábado, 10:00 AM`,
        ctaTexto: "Registrarme al Webinar",
        ctaUrl: "https://unimet.edu.ve/webinar-ia"
      },
      artes: {
        titulo: "Taller: Diseño y Creatividad",
        asunto: "Invitación: Taller de Diseño Creativo",
        contenido: `Tu perfil vocacional destaca por su orientación creativa y artística.

Te invitamos a un taller especial de diseño donde exploraremos:
• Técnicas avanzadas de diseño digital
• Carreras en el mundo del arte y la arquitectura
• Portfolio profesional para creativos

Fecha: Próximo viernes, 3:00 PM`,
        ctaTexto: "Inscribirme al Taller",
        ctaUrl: "https://unimet.edu.ve/taller-diseno"
      },
      ciencias_sociales: {
        titulo: "Charla: Impacto Social y Humanidades",
        asunto: "Invitación: Charla sobre Ciencias Sociales",
        contenido: `Tu perfil vocacional muestra gran interés por las áreas sociales y humanísticas.

Te invitamos a una charla especial donde discutiremos:
• Carreras con impacto social
• Psicología y desarrollo humano
• Oportunidades en derecho y comunicación social

Fecha: Próximo jueves, 4:00 PM`,
        ctaTexto: "Confirmar Asistencia",
        ctaUrl: "https://unimet.edu.ve/charla-social"
      }
    };

    const datosPredeterminados = contenidosPorGrupo[grupo];

    setCampanaSeleccionada({
      grupo,
      nombreGrupo,
      ...datosPredeterminados
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
      // Convertir el contenido de texto plano a HTML
      const contenidoHTML = campanaSeleccionada.contenido
        .split('\n')
        .map(line => {
          if (line.trim().startsWith('•')) {
            return `<li>${line.trim().substring(1).trim()}</li>`;
          }
          return line.trim() ? `<p>${line.trim()}</p>` : '';
        })
        .join('\n')
        .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

      const resultado = await enviarGrupoPredefinido(accessToken, {
        grupo: campanaSeleccionada.grupo,
        titulo: campanaSeleccionada.titulo,
        asunto: campanaSeleccionada.asunto,
        contenido: contenidoHTML,
        ctaTexto: campanaSeleccionada.ctaTexto,
        ctaUrl: campanaSeleccionada.ctaUrl
      });

      toast({
        title: "¡Campaña enviada exitosamente!",
        description: `Se enviaron ${resultado.data.exitosos} de ${resultado.data.total} correos al grupo "${campanaSeleccionada.nombreGrupo}". Tasa de éxito: ${resultado.data.tasaExito}`,
      });

      // Cerrar modal y recargar estadísticas
      setModalCampanaAbierto(false);
      setCampanaSeleccionada(null);

      const respuesta = await obtenerEstadisticas(accessToken);
      setEstadisticasCampanas(respuesta.data);

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
      // Convertir el contenido de texto plano a HTML
      const contenidoHTML = campanaPersonalizada.contenido
        .split('\n')
        .map(line => {
          if (line.trim().startsWith('•')) {
            return `<li>${line.trim().substring(1).trim()}</li>`;
          }
          return line.trim() ? `<p>${line.trim()}</p>` : '';
        })
        .join('\n')
        .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

      const destinatarios = resultadoSegmentacion.map(est => est.id);

      const resultado = await enviarCampana(accessToken, {
        destinatarios,
        asunto: campanaPersonalizada.asunto,
        contenido: contenidoHTML,
        titulo: campanaPersonalizada.titulo,
        ctaTexto: campanaPersonalizada.ctaTexto,
        ctaUrl: campanaPersonalizada.ctaUrl,
        usarTemplate: true
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

  // Filtrar estudiantes por término de búsqueda
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.career_interest.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  const renderContent = () => {
    if (activeModule === "estudiantes") {
      return (
        <div className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Student List Sidebar */}
                <div className="w-full lg:w-1/3 space-y-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-24">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input 
                          placeholder="Buscar estudiante..." 
                          className="pl-9 bg-slate-50 border-slate-200"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Button variant="outline" size="icon" className="border-slate-200">
                        <Filter className="h-4 w-4 text-slate-500" />
                      </Button>
                    </div>

                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-teal-500" />
                      </div>
                    ) : filteredStudents.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p>No se encontraron estudiantes</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                        {filteredStudents.map(student => (
                        <div 
                          key={student.id}
                          onClick={() => setSelectedStudent(student)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                            selectedStudent?.id === student.id 
                              ? 'bg-teal-50 border-teal-200 shadow-sm' 
                              : 'bg-white border-slate-100 hover:border-teal-100'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 bg-slate-100 text-slate-600 border border-slate-200">
                                <AvatarFallback>{student.avatar}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-bold text-sm text-slate-900">{student.name}</p>
                                <p className="text-xs text-slate-500">{student.career_interest}</p>
                              </div>
                            </div>
                            <Badge variant={student.risk_level === "Alto" ? "destructive" : "secondary"} className="text-[10px] px-1.5 h-5">
                              Riesgo {student.risk_level}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center text-xs text-slate-400 pl-12">
                            <span>Test: {student.last_test}</span>
                            <ChevronRight className={`w-4 h-4 ${selectedStudent?.id === student.id ? 'text-teal-500' : 'text-slate-300'}`} />
                          </div>
                        </div>
                      ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Detail View */}
                <div className="w-full lg:w-2/3">
                  {selectedStudent ? (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={selectedStudent.id}
                      className="space-y-6"
                    >
                      {/* Student Header Card */}
                      <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
                        <div className="h-2 bg-teal-500 w-full" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 bg-slate-100 text-slate-600 border-2 border-white shadow-md">
                              <AvatarFallback className="text-xl">{selectedStudent.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-2xl text-slate-900">{selectedStudent.name}</CardTitle>
                              <CardDescription>{selectedStudent.email} | {selectedStudent.career_interest}</CardDescription>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="rounded-full">
                              <Mail className="w-4 h-4 mr-2" /> Contactar
                            </Button>
                            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 rounded-full">
                              <Calendar className="w-4 h-4 mr-2" /> Agendar Cita
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4 mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="text-center border-r border-slate-200 last:border-0">
                              <p className="text-xs text-slate-500 uppercase font-bold">Estado</p>
                              <p className="text-sm font-semibold text-slate-900 mt-1">{selectedStudent.status}</p>
                            </div>
                            <div className="text-center border-r border-slate-200 last:border-0">
                              <p className="text-xs text-slate-500 uppercase font-bold">Perfil Detectado</p>
                              <p className="text-sm font-semibold text-teal-600 mt-1">{selectedStudent.result}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-slate-500 uppercase font-bold">Última Actividad</p>
                              <p className="text-sm font-semibold text-slate-900 mt-1">{selectedStudent.last_test}</p>
                            </div>
                          </div>
                          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-500 uppercase font-bold mb-2">Código Holland</p>
                            <Badge variant="outline" className="text-sm font-mono">{selectedStudent.codigoHolland}</Badge>
                            <p className="text-xs text-slate-500 mt-3 mb-1">Total de Sesiones</p>
                            <p className="text-sm font-semibold text-slate-900">{selectedStudent.totalSesiones} sesión(es)</p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Analysis Tabs */}
                      <Tabs defaultValue="results" className="w-full">
                        <TabsList className="w-full justify-start bg-white border border-slate-200 p-1 rounded-xl mb-6">
                          <TabsTrigger value="results" className="rounded-lg px-6">Resultados del Test</TabsTrigger>
                          <TabsTrigger value="notes" className="rounded-lg px-6">Notas del Orientador</TabsTrigger>
                          <TabsTrigger value="campaigns" className="rounded-lg px-6">Campañas de Correo</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="results">
                          <Card className="rounded-2xl border-slate-200 shadow-sm">
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <BarChart className="w-5 h-5 text-teal-500" />
                                Análisis Psicométrico
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              <div>
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm font-medium text-slate-700">Aptitud Lógica</span>
                                  <span className="text-sm font-bold text-slate-900">85%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-500 w-[85%]" />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm font-medium text-slate-700">Creatividad</span>
                                  <span className="text-sm font-bold text-slate-900">60%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-purple-500 w-[60%]" />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm font-medium text-slate-700">Habilidades Sociales</span>
                                  <span className="text-sm font-bold text-slate-900">45%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-green-500 w-[45%]" />
                                </div>
                              </div>

                              <div className="mt-6 p-4 bg-teal-50 border border-teal-100 rounded-xl">
                                <h4 className="font-bold text-teal-800 mb-2 flex items-center">
                                  <BrainCircuit className="w-4 h-4 mr-2" />
                                  Carreras Recomendadas
                                </h4>
                                <div className="space-y-3">
                                  {selectedStudent.recomendacionesCarreras && selectedStudent.recomendacionesCarreras.length > 0 ? (
                                    selectedStudent.recomendacionesCarreras.map((carrera, index) => (
                                      <div key={carrera.id} className="bg-white p-3 rounded-lg border border-teal-200">
                                        <p className="font-semibold text-teal-900 text-sm mb-1">
                                          {index + 1}. {carrera.name}
                                        </p>
                                        {((carrera as any).faculty ?? (carrera as any).facultad ?? (carrera as any).area) && (
                                          <p className="text-xs text-teal-600 font-medium mb-1">
                                            {[(carrera as any).faculty ?? (carrera as any).facultad, (carrera as any).area].filter(Boolean).join(" · ")}
                                          </p>
                                        )}
                                        <p className="text-xs text-teal-700 leading-relaxed">
                                          {carrera.razon}
                                        </p>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-sm text-teal-700">No hay recomendaciones disponibles</p>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
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

                        <TabsContent value="campaigns">
                          <Card className="rounded-2xl border-slate-200 shadow-sm">
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <Mail className="w-5 h-5 text-teal-500" />
                                Campañas de Interés
                              </CardTitle>
                              <CardDescription>
                                Envía información personalizada basada en el perfil vocacional del estudiante.
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                      <BrainCircuit className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-slate-900 text-sm">Webinar: Futuro de la IA</h4>
                                      <p className="text-xs text-slate-500">Recomendado para perfiles Lógicos y Científicos</p>
                                    </div>
                                  </div>
                                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                                    Enviar Invitación
                                  </Button>
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-100">
                                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Redactar Correo Personalizado</h4>
                                  <div className="space-y-3">
                                    <Input placeholder="Asunto: Oportunidad para tu carrera en Ingeniería..." className="bg-slate-50" />
                                    <textarea 
                                      className="w-full min-h-[100px] p-3 rounded-md border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                                      placeholder="Escribe un mensaje personalizado para el estudiante..."
                                    />
                                    <div className="flex justify-end">
                                      <Button className="bg-slate-900 text-white hover:bg-slate-800">
                                        <Mail className="w-4 h-4 mr-2" /> Enviar Correo
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    </motion.div>
                  ) : (
                    <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                      <User className="w-16 h-16 mb-4 opacity-20" />
                      <h3 className="text-lg font-medium text-slate-900">Selecciona un estudiante</h3>
                      <p>Haz clic en la lista para ver los detalles del caso</p>
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
      const totalEstudiantes = estadisticasCampanas.ingenieria + estadisticasCampanas.artes + estadisticasCampanas.cienciasSociales;

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
                    <CardTitle className="text-2xl text-slate-900">Gestor de Campañas Masivas</CardTitle>
                    <CardDescription>Envía comunicaciones segmentadas a grupos de estudiantes basados en sus intereses vocacionales.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      {/* Campaña Ingeniería */}
                      <Card className="border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                              <BrainCircuit className="w-6 h-6" />
                            </div>
                            <Badge className="bg-blue-600">
                              {estadisticasCampanas.ingenieria} {estadisticasCampanas.ingenieria === 1 ? 'Estudiante' : 'Estudiantes'}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-slate-900 mb-2">Interesados en Ingeniería</h3>
                          <p className="text-sm text-slate-600 mb-4">Estudiantes con perfil Lógico-Matemático que mostraron interés en áreas técnicas.</p>
                          <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleAbrirModalCampana('ingenieria', 'Interesados en Ingeniería')}
                            disabled={loadingCampanas || estadisticasCampanas.ingenieria === 0}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Crear Campaña
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Campaña Artes */}
                      <Card className="border border-purple-200 bg-purple-50/50 hover:bg-purple-50 transition-colors cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                              <Sparkles className="w-6 h-6" />
                            </div>
                            <Badge className="bg-purple-600">
                              {estadisticasCampanas.artes} {estadisticasCampanas.artes === 1 ? 'Estudiante' : 'Estudiantes'}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-slate-900 mb-2">Interesados en Artes</h3>
                          <p className="text-sm text-slate-600 mb-4">Estudiantes con perfil Creativo que buscan carreras de diseño o arquitectura.</p>
                          <Button
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={() => handleAbrirModalCampana('artes', 'Interesados en Artes')}
                            disabled={loadingCampanas || estadisticasCampanas.artes === 0}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Crear Campaña
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Campaña Humanidades */}
                      <Card className="border border-green-200 bg-green-50/50 hover:bg-green-50 transition-colors cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-green-100 rounded-xl text-green-600">
                              <Users className="w-6 h-6" />
                            </div>
                            <Badge className="bg-green-600">
                              {estadisticasCampanas.cienciasSociales} {estadisticasCampanas.cienciasSociales === 1 ? 'Estudiante' : 'Estudiantes'}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-slate-900 mb-2">Ciencias Sociales</h3>
                          <p className="text-sm text-slate-600 mb-4">Estudiantes con perfil Social-Humanista interesados en derecho o psicología.</p>
                          <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleAbrirModalCampana('ciencias_sociales', 'Ciencias Sociales')}
                            disabled={loadingCampanas || estadisticasCampanas.cienciasSociales === 0}
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
                            <option value="ingeniería">Ingeniería</option>
                            <option value="sistemas">Sistemas</option>
                            <option value="derecho">Derecho</option>
                            <option value="psicología">Psicología</option>
                            <option value="medicina">Medicina</option>
                            <option value="arquitectura">Arquitectura</option>
                            <option value="diseño">Diseño</option>
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
              Edita el contenido de la campaña antes de enviarla a {campanaSeleccionada?.nombreGrupo === 'Interesados en Ingeniería' ? estadisticasCampanas.ingenieria : campanaSeleccionada?.nombreGrupo === 'Interesados en Artes' ? estadisticasCampanas.artes : estadisticasCampanas.cienciasSociales} estudiante(s).
            </DialogDescription>
          </DialogHeader>

          {campanaSeleccionada && (
            <div className="space-y-4 mt-4">
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
                <Textarea
                  id="contenido"
                  value={campanaSeleccionada.contenido}
                  onChange={(e) => setCampanaSeleccionada({ ...campanaSeleccionada, contenido: e.target.value })}
                  placeholder="Escribe el contenido del correo..."
                  className="min-h-[200px] bg-slate-50"
                />
                <p className="text-xs text-slate-500">
                  Usa • para crear listas con viñetas
                </p>
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
              <Textarea
                id="contenido-segmentado"
                value={campanaPersonalizada.contenido}
                onChange={(e) => setCampanaPersonalizada({ ...campanaPersonalizada, contenido: e.target.value })}
                placeholder="Escribe el contenido del correo..."
                className="min-h-[200px] bg-slate-50"
              />
              <p className="text-xs text-slate-500">
                Usa • para crear listas con viñetas
              </p>
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

