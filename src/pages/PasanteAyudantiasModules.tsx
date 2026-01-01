import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, FileText, Activity, RefreshCw, CheckCircle, Users, User, LogOut, Send, Percent, XCircle } from "lucide-react";
import ReglamentoAccess from "@/components/shared/ReglamentoAccess";
import { useEffect, useState } from "react";
import AvailabilitySchedule from "@/components/AvailabilitySchedule";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE } from "@/lib/api";
import { getPlazasCompatibles, postularAPlaza, getMisPostulaciones } from "@/lib/api/postulacionesPlazas";
import { verificarPostulacionesPorEmail, PostulacionPublicData } from "@/lib/api/postulacionesBecas";
import { CheckCircle2, AlertCircle } from "lucide-react";

const PasanteAyudantiasModules = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, tokens, logout } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>("actividades-recientes");
  const [activeWeek, setActiveWeek] = useState<string>("semana-1");
  const [completedWeeks, setCompletedWeeks] = useState<Set<number>>(new Set());
  const [weeklyDeadlines] = useState<Record<number, Date>>(() => {
    const deadlines: Record<number, Date> = {};
    const now = new Date();
    for (let i = 1; i <= 12; i++) {
      // Each week has a deadline 7 days after the previous one
      deadlines[i] = new Date(now.getTime() + (i * 7 * 24 * 60 * 60 * 1000));
    }
    return deadlines;
  });
  const [formData, setFormData] = useState({
    fecha: "",
    horas: "",
    descripcion: "",
    objetivos: "",
    metas: "",
    actividades: "",
    reporteSemanal: "",
    observaciones: ""
  });
  const [loadingReportes, setLoadingReportes] = useState(false);
  const [reportes, setReportes] = useState<Array<{ 
    id: string; 
    fecha: string; 
    horasTrabajadas: number; 
    descripcionActividades?: string; 
    estado?: string;
    semana?: number;
    periodoAcademico?: string;
    objetivosPeriodo?: string;
    metasEspecificas?: string;
    actividadesProgramadas?: string;
    actividadesRealizadas?: string;
    observaciones?: string;
    fechaPostulacion?: string;
    evaluadoPor?: string;
    motivoRechazo?: string;
  }>>([]);
  const [ayudantiaId, setAyudantiaId] = useState<string | null>(null);
  const [plazaActual, setPlazaActual] = useState<any>(null);
  const [plazasDisponibles, setPlazasDisponibles] = useState<any[]>([]);
  const [loadingPlazas, setLoadingPlazas] = useState(false);
  const [misPostulaciones, setMisPostulaciones] = useState<any[]>([]);
  const [loadingPostulaciones, setLoadingPostulaciones] = useState(false);
  const [postulando, setPostulando] = useState<string | null>(null);
  
  // Estados para gestión de semanas habilitadas
  const [semanasHabilitadas, setSemanasHabilitadas] = useState<number[]>([]);
  const [semanaActual, setSemanaActual] = useState<number>(1);
  const [loadingSemanas, setLoadingSemanas] = useState(false);
  const [periodoActual, setPeriodoActual] = useState<string>('2025-1'); // Estado para el período académico actual

  // Reiniciar inputs al cambiar de semana en las pestañas
  useEffect(() => {
    setFormData({
      fecha: "",
      horas: "",
      descripcion: "",
      objetivos: "",
      metas: "",
      actividades: "",
      reporteSemanal: "",
      observaciones: ""
    });
  }, [activeWeek]);

  // Estado para información académica del perfil
  const [academicInfo, setAcademicInfo] = useState({
    carrera: '',
    trimestre: '',
    iaa: '',
    asignaturasAprobadas: '',
    creditosInscritos: ''
  });

  // Estado para información del becario desde /becarios/me
  const [becarioStatus, setBecarioStatus] = useState<any>(null);
  const [loadingBecarioStatus, setLoadingBecarioStatus] = useState(true);

  // Estado para verificación de postulaciones de becas
  const [postulacionesBecas, setPostulacionesBecas] = useState<PostulacionPublicData[]>([]);
  const [loadingPostulacionesBecas, setLoadingPostulacionesBecas] = useState(true);

  // Función para verificar el estado de la beca del usuario
  const loadBecarioStatus = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken || !user?.id) {
      setLoadingBecarioStatus(false);
      return;
    }

    setLoadingBecarioStatus(true);
    try {
      console.log('🎓 [BECARIO] Verificando estado de beca del usuario');

      const response = await fetch(`${API_BASE}/v1/becarios/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      console.log('🎓 [BECARIO] Respuesta:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('🎓 [BECARIO] Datos recibidos:', data);

        if (data.data && data.data.estado === 'Activa') {
          setBecarioStatus(data.data);
          console.log('✅ [BECARIO] Estado de beca: Activa');
        } else {
          setBecarioStatus(null);
          console.log('⚠️ [BECARIO] Estado de beca no activa:', data.data?.estado);
        }
      } else {
        // Si hay error 404 o cualquier otro, significa que no hay beca activa
        console.log('❌ [BECARIO] No se encontró beca activa');
        setBecarioStatus(null);
      }
    } catch (error) {
      console.error('❌ [BECARIO] Error al verificar estado de beca:', error);
      setBecarioStatus(null);
    } finally {
      setLoadingBecarioStatus(false);
    }
  };

  // Función para verificar postulaciones de becas
  const loadPostulacionesBecas = async () => {
    if (!user?.email) {
      setLoadingPostulacionesBecas(false);
      return;
    }

    try {
      console.log('📋 [POSTULACIONES] Verificando postulaciones de becas...');
      const response = await verificarPostulacionesPorEmail(user.email);

      console.log('✅ [POSTULACIONES] Postulaciones encontradas:', response.data);
      setPostulacionesBecas(response.data || []);
    } catch (error) {
      console.log('ℹ️ [POSTULACIONES] No se encontraron postulaciones:', error);
      setPostulacionesBecas([]);
    } finally {
      setLoadingPostulacionesBecas(false);
    }
  };

  // Función para cargar información académica del usuario
  const loadInfoAcademica = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken || !user?.id) return;

    try {
      console.log('📚 [ACADÉMICO] Cargando información académica...');

      const response = await fetch(`${API_BASE}/v1/users/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userData = data.data;

        // Cargar los datos en el estado
        setAcademicInfo({
          carrera: userData.carrera || '',
          trimestre: userData.trimestre?.toString() || '',
          iaa: userData.iaa?.toString() || '',
          asignaturasAprobadas: userData.asignaturasAprobadas?.toString() || '',
          creditosInscritos: academicInfo.creditosInscritos, // Mantener el valor local
        });

        console.log('✅ [ACADÉMICO] Información cargada:', {
          carrera: userData.carrera,
          trimestre: userData.trimestre,
          iaa: userData.iaa,
          asignaturasAprobadas: userData.asignaturasAprobadas,
        });
      }
    } catch (error) {
      console.error('❌ [ACADÉMICO] Error al cargar información:', error);
    }
  };

  // Función para guardar información académica
  const handleGuardarInfoAcademica = async (e: React.FormEvent) => {
    e.preventDefault();

    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken || !user?.id) {
      toast({
        title: 'Error',
        description: 'No se pudo identificar al usuario',
        variant: 'destructive',
      });
      return;
    }

    // Validar campos
    if (!academicInfo.carrera || !academicInfo.trimestre || !academicInfo.iaa || !academicInfo.asignaturasAprobadas || !academicInfo.creditosInscritos) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos',
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log('📚 [ACADÉMICO] Guardando información académica...');

      const body = {
        carrera: academicInfo.carrera,
        trimestre: parseInt(academicInfo.trimestre),
        iaa: parseFloat(academicInfo.iaa),
        asignaturasAprobadas: parseInt(academicInfo.asignaturasAprobadas),
        // Note: creditosInscritos no está en el modelo User del backend,
        // solo enviamos carrera, trimestre, iaa y asignaturasAprobadas
      };

      const response = await fetch(`${API_BASE}/v1/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al guardar la información académica');
      }

      console.log('✅ [ACADÉMICO] Información guardada exitosamente');

      toast({
        title: 'Información guardada',
        description: 'Tus datos académicos se han actualizado correctamente',
      });
    } catch (error: any) {
      console.error('❌ [ACADÉMICO] Error al guardar:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo guardar la información académica',
        variant: 'destructive',
      });
    }
  };

  // Función para cargar semanas habilitadas del período activo
  const loadSemanasHabilitadas = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) return '2025-1';

    setLoadingSemanas(true);
    try {
      console.log('📅 [SEMANAS] Cargando semanas habilitadas del período activo');

      const response = await fetch(`${API_BASE}/v1/configuracion/periodo-actual`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📅 [SEMANAS] Respuesta del período activo:', data);

        if (data.data) {
          setSemanasHabilitadas(data.data.semanasHabilitadas || []);
          setSemanaActual(data.data.semanaActual || 1);
          const periodo = data.data.periodoAcademico || '2025-1';
          setPeriodoActual(periodo); // Guardar el período académico actual
          // Establecer la semana actual como activa
          setActiveWeek(`semana-${data.data.semanaActual || 1}`);
          console.log('📅 [SEMANAS] Semanas habilitadas:', data.data.semanasHabilitadas);
          console.log('📅 [SEMANAS] Semana actual:', data.data.semanaActual);
          console.log('📅 [SEMANAS] Período académico:', periodo);
          return periodo;
        } else {
          console.log('📅 [SEMANAS] No hay período activo configurado');
          setSemanasHabilitadas([]);
          setSemanaActual(1);
          setPeriodoActual('2025-1'); // Valor por defecto
          setActiveWeek('semana-1');
          return '2025-1';
        }
      } else {
        console.log('📅 [SEMANAS] Error al cargar período activo:', response.status);
        setSemanasHabilitadas([]);
        setSemanaActual(1);
        setPeriodoActual('2025-1'); // Valor por defecto
        setActiveWeek('semana-1');
        return '2025-1';
      }
    } catch (error) {
      console.error('📅 [SEMANAS] Error general:', error);
      setSemanasHabilitadas([]);
      setSemanaActual(1);
      setPeriodoActual('2025-1');
      setActiveWeek('semana-1');
      return '2025-1';
    } finally {
      setLoadingSemanas(false);
    }
  };

  // Función para obtener el ID de la ayudantía del usuario
  const loadAyudantiaId = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken || !user?.id) return;

    try {
      console.log('🔍 [AYUDANTIA] Probando con ID de usuario directamente:', user.id);
      
      // Probar si el usuario puede acceder a sus reportes directamente
      const resp = await fetch(`${API_BASE}/v1/ayudantias/${user.id}/reportes?limit=1`, {
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' }
      });
      
      console.log('🔍 [AYUDANTIA] Respuesta de prueba:', resp.status, resp.statusText);
      
      if (resp.ok) {
        // Si funciona, usar el ID del usuario directamente
        setAyudantiaId(user.id);
        console.log('✅ [AYUDANTIA] ID de usuario funciona:', user.id);
        return user.id;
      } else {
        console.log('❌ [AYUDANTIA] El ID de usuario no funciona, probando con plazas...');
        
        // Intentar obtener plazas donde el usuario sea ayudante
        const plazasResp = await fetch(`${API_BASE}/v1/plazas?ayudanteId=${user.id}`, {
          headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' }
        });
        
        if (plazasResp.ok) {
          const plazasData = await plazasResp.json();
          const plazas = plazasData?.data?.plazas || plazasData?.data || plazasData?.plazas || [];
          
          if (Array.isArray(plazas) && plazas.length > 0) {
            const plazaActiva = plazas.find((p: any) => p.estado === 'Activa' || p.activa === true) || plazas[0];
            setAyudantiaId(plazaActiva.id);
            console.log('✅ [AYUDANTIA] ID de plaza encontrado:', plazaActiva.id);
            return plazaActiva.id;
          }
        }
        
        // Fallback: usar el ID del usuario de todas formas
        setAyudantiaId(user.id);
        console.log('⚠️ [AYUDANTIA] Usando ID de usuario como fallback:', user.id);
        return user.id;
      }
    } catch (error) {
      console.error('❌ [AYUDANTIA] Error general:', error);
      // Fallback: usar el ID del usuario
      setAyudantiaId(user.id);
      return user.id;
    }
  };

  // Función para cargar la plaza actual del usuario
  const loadPlazaActual = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken || !user?.id) return;

    try {
      console.log('🏢 [PLAZA] Cargando plaza actual para usuario:', user.id);
      
      // Buscar plazas donde el usuario sea el ayudante asignado
      const resp = await fetch(`${API_BASE}/v1/plazas?ayudanteId=${user.id}`, {
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' }
      });
      
      if (resp.ok) {
        const data = await resp.json();
        const plazas = data?.data?.plazas || data?.data || data?.plazas || [];
        
        if (Array.isArray(plazas) && plazas.length > 0) {
          // Tomar la primera plaza activa
          const plazaActiva = plazas.find((p: any) => p.estado === 'Activa' || p.activa === true) || plazas[0];
          setPlazaActual(plazaActiva);
          console.log('✅ [PLAZA] Plaza actual encontrada:', plazaActiva.nombre);
        } else {
          console.log('⚠️ [PLAZA] No se encontró plaza asignada');
          setPlazaActual(null);
        }
      } else {
        console.log('❌ [PLAZA] Error al obtener plaza actual:', resp.status);
        setPlazaActual(null);
      }
    } catch (error) {
      console.error('❌ [PLAZA] Error general:', error);
      setPlazaActual(null);
    }
  };

  // Función para cargar mis postulaciones
  const loadMisPostulaciones = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) return;

    setLoadingPostulaciones(true);
    try {
      console.log('📋 [POSTULACIONES] Cargando mis postulaciones');
      const data = await getMisPostulaciones(accessToken);
      const postulaciones = data?.data?.postulaciones || data?.data || [];
      setMisPostulaciones(Array.isArray(postulaciones) ? postulaciones : []);
      console.log('✅ [POSTULACIONES] Postulaciones cargadas:', postulaciones.length);
    } catch (error) {
      console.error('❌ [POSTULACIONES] Error general:', error);
      setMisPostulaciones([]);
    } finally {
      setLoadingPostulaciones(false);
    }
  };

  // Función para cargar plazas compatibles (usa el nuevo endpoint)
  const loadPlazasDisponibles = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) return;

    setLoadingPlazas(true);
    try {
      console.log('🏢 [PLAZAS] Cargando plazas compatibles con mi horario');
      console.log('🏢 [PLAZAS] Período académico:', periodoActual);

      const data = await getPlazasCompatibles(accessToken, {
        periodoAcademico: periodoActual // Usar el período dinámico
      });

      const plazas = data?.data?.plazas || data?.data || [];
      setPlazasDisponibles(Array.isArray(plazas) ? plazas : []);
      console.log('✅ [PLAZAS] Plazas compatibles cargadas:', plazas.length);
    } catch (error: any) {
      console.error('❌ [PLAZAS] Error general:', error);

      // Si falla porque no hay horario registrado, mostrar mensaje específico
      if (error.message?.includes('disponibilidad horaria')) {
        toast({
          title: 'Sin horario registrado',
          description: 'Debes registrar tu horario de disponibilidad antes de ver plazas compatibles.',
          variant: 'destructive'
        });
      }

      setPlazasDisponibles([]);
    } finally {
      setLoadingPlazas(false);
    }
  };

  // Función para postular a una plaza
  const handlePostularPlaza = async (plazaId: string) => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) {
      toast({
        title: 'Error',
        description: 'No hay sesión activa',
        variant: 'destructive'
      });
      return;
    }

    setPostulando(plazaId);
    try {
      console.log('📝 [POSTULAR] Postulando a plaza:', plazaId);
      console.log('📝 [POSTULAR] Access token presente:', !!accessToken);

      const result = await postularAPlaza(accessToken, plazaId);
      console.log('✅ [POSTULAR] Resultado:', result);

      toast({
        title: 'Postulación enviada',
        description: 'Tu postulación ha sido enviada exitosamente y está pendiente de aprobación por el administrador.',
      });

      // Recargar postulaciones y plazas
      await Promise.all([loadMisPostulaciones(), loadPlazasDisponibles()]);
    } catch (error: any) {
      console.error('❌ [POSTULAR] Error completo:', error);
      console.error('❌ [POSTULAR] Error message:', error.message);

      // Mensaje más específico si es error de validación del backend
      let errorMessage = error.message || 'No se pudo enviar la postulación';

      if (error.message?.includes('validación') || error.message?.includes('Auditoria')) {
        errorMessage = 'Error en el servidor al procesar la postulación. El administrador ha sido notificado. Por favor intenta nuevamente más tarde.';
      } else if (error.message?.includes('horario') || error.message?.includes('disponibilidad')) {
        errorMessage = 'Debes registrar tu horario de disponibilidad antes de postular a una plaza.';
      } else if (error.message?.includes('postulación pendiente')) {
        errorMessage = 'Ya tienes una postulación pendiente. Debes esperar a que sea procesada antes de postular a otra plaza.';
      } else if (error.message?.includes('plaza asignada')) {
        errorMessage = 'Ya tienes una plaza asignada. No puedes postular a otra plaza.';
      }

      toast({
        title: 'Error al postular',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setPostulando(null);
    }
  };

  const loadReportes = async (periodoOverride?: string) => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken || !user?.id) return;

    // Verificar que el usuario tenga rol de estudiante
    if (user.role !== 'estudiante') {
      console.log('📝 [REPORTE] Usuario no es estudiante, no se cargan reportes');
      return;
    }

    setLoadingReportes(true);
    try {
      // Obtener el ID de la ayudantía, ya sea del estado o cargándolo
      let idToUse = ayudantiaId;
      if (!idToUse) {
        const id = await loadAyudantiaId();
        idToUse = id || user.id;
      }
      console.log('📝 [REPORTE] Cargando reportes para ayudantía:', idToUse);

      // Usar el período académico pasado como parámetro o el del estado
      const periodoToUse = periodoOverride || periodoActual;
      console.log('📝 [REPORTE] Usando período académico:', periodoToUse);
      
      // Usar el endpoint correcto con parámetros de consulta
      const url = new URL(`${API_BASE}/v1/ayudantias/${idToUse}/reportes`);
      url.searchParams.append('limit', '20');
      url.searchParams.append('offset', '0');
      url.searchParams.append('periodoAcademico', periodoToUse);
      
      const resp = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' }
      });
      
      console.log('📝 [REPORTE] Respuesta de carga:', resp.status, resp.statusText);
      console.log('📝 [REPORTE] URL utilizada:', url.toString());
      
      if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        console.error('📝 [REPORTE] Error al cargar reportes:', err);
        
        // Manejar error específico de estudiante becario no encontrado
        if (err?.message === 'Registro de estudiante becario no encontrado') {
          toast({ 
            title: 'Registro no encontrado', 
            description: 'No se encontró tu registro como estudiante becario. Contacta al administrador.', 
            variant: 'destructive' 
          });
          return;
        }
        return;
      }
      
      const data = await resp.json();
      console.log('📝 [REPORTE] Datos recibidos completos:', JSON.stringify(data, null, 2));
      
      // Manejar diferentes estructuras de respuesta
      let items = [];
      if (data?.data?.reportes) {
        items = data.data.reportes;
        console.log('📝 [REPORTE] Usando data.data.reportes');
      } else if (data?.data && Array.isArray(data.data)) {
        items = data.data;
        console.log('📝 [REPORTE] Usando data.data como array');
      } else if (data?.reportes) {
        items = data.reportes;
        console.log('📝 [REPORTE] Usando data.reportes');
      } else if (Array.isArray(data)) {
        items = data;
        console.log('📝 [REPORTE] Usando data como array directo');
      } else {
        console.log('📝 [REPORTE] Estructura de respuesta no reconocida:', Object.keys(data));
        items = [];
      }
      
      console.log('📝 [REPORTE] Items encontrados:', items.length);
      console.log('📝 [REPORTE] Primer item (si existe):', items[0]);
      
      const mapped = items.map((r: any, index: number) => {
        console.log(`📝 [REPORTE] Mapeando item ${index}:`, r);
        return {
          id: r.id || `temp-${index}`,
          fecha: r.fecha || r.createdAt || new Date().toISOString(),
          horasTrabajadas: r.horasTrabajadas || 0,
          descripcionActividades: r.descripcionActividades || r.actividadesRealizadas || '',
          estado: r.estado || 'Pendiente',
          semana: r.semana || r.weekNumber || 1,
          periodoAcademico: r.periodoAcademico || periodoActual,
          objetivosPeriodo: r.objetivosPeriodo || '',
          metasEspecificas: r.metasEspecificas || '',
          actividadesProgramadas: r.actividadesProgramadas || '',
          actividadesRealizadas: r.actividadesRealizadas || '',
          observaciones: r.observaciones || '',
          fechaPostulacion: r.fechaPostulacion || r.createdAt || new Date().toISOString(),
          evaluadoPor: r.evaluadoPor || '',
          motivoRechazo: r.motivoRechazo || ''
        };
      });
      
      console.log('📝 [REPORTE] Reportes mapeados:', mapped);
      setReportes(mapped);

      // Actualizar semanas completadas basado en los reportes del backend
      const semanasCompletadas = new Set<number>();
      mapped.forEach((r: any) => {
        if (r.semana && r.estado !== 'cancelado' && r.estado !== 'rechazado') {
          semanasCompletadas.add(parseInt(r.semana));
        }
      });
      setCompletedWeeks(semanasCompletadas);

      console.log('📝 [REPORTE] Semanas completadas:', Array.from(semanasCompletadas));
    } catch (e) {
      console.error('📝 [REPORTE] Error general al cargar reportes:', e);
    }
    finally { setLoadingReportes(false); }
  };

  useEffect(() => {
    // Cargar ID de ayudantía, reportes y plazas al entrar
    const initializeData = async () => {
      if (user?.role === 'estudiante') {
        try {
          // Cargar datos básicos en paralelo
          await Promise.all([
            loadBecarioStatus(),
            loadPostulacionesBecas(),
          ]);

          // Cargar semanas habilitadas y obtener el período académico
          const periodoAcademico = await loadSemanasHabilitadas();

          // Cargar ayudantiaId primero y esperar el resultado
          const ayudantiaIdResult = await loadAyudantiaId();

          // Luego cargar el resto que depende del ayudantiaId y período académico
          await Promise.all([
            loadReportes(periodoAcademico),
            loadPlazaActual(),
            loadPlazasDisponibles(),
            loadMisPostulaciones(),
          ]);
        } catch (error) {
          console.error('Error inicializando datos:', error);
        }
      }
    };
    initializeData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens?.accessToken, user?.id, user?.role]);

  const sidebarItems = [
    {
      title: "Actividades Recientes",
      icon: Activity,
      onClick: () => setActiveModule("actividades-recientes")
    },
    {
      title: "Horario de Disponibilidad",
      icon: Calendar,
      onClick: () => setActiveModule("horario-disponibilidad")
    },
    {
      title: "Sistema de Reporte de Actividades",
      icon: FileText,
      onClick: () => setActiveModule("reporte-actividades")
    },
    {
      title: "Acceso al Reglamento",
      icon: FileText,
      onClick: () => setActiveModule("reglamento")
    }
  ];

  const isWeekAvailable = (weekNumber: number): boolean => {
    // Solo las semanas habilitadas están disponibles
    return semanasHabilitadas.includes(weekNumber);
  };

  const isWeekExpired = (weekNumber: number): boolean => {
    const deadline = weeklyDeadlines[weekNumber];
    if (!deadline) return false;
    return new Date() > deadline && !completedWeeks.has(weekNumber);
  };

  const handleWeekSubmit = async (weekNumber: number) => {
    try {
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken || !user?.id) {
        toast({ title: 'Sin sesión', description: 'Inicia sesión para enviar reportes', variant: 'destructive' });
        return;
      }

      // Verificar que el usuario tenga rol de estudiante
      if (user.role !== 'estudiante') {
        toast({
          title: 'Acceso denegado',
          description: 'Solo los estudiantes pueden enviar reportes de actividades',
          variant: 'destructive'
        });
        return;
      }

      // Obtener el ID de la ayudantía si no lo tenemos
      if (!ayudantiaId) {
        const id = await loadAyudantiaId();
        if (!id) {
          toast({ 
            title: 'Error', 
            description: 'No se pudo obtener el ID de la ayudantía', 
            variant: 'destructive' 
          });
          return;
        }
      }

      const body = {
        semana: weekNumber,
        periodoAcademico: periodoActual, // Usar el período dinámico
        fecha: formData.fecha,
        horasTrabajadas: parseFloat(formData.horas),
        objetivosPeriodo: formData.objetivos,
        metasEspecificas: formData.metas,
        actividadesProgramadas: formData.actividades,
        actividadesRealizadas: formData.reporteSemanal,
        descripcionActividades: formData.descripcion,
        observaciones: formData.observaciones,
      };

      const idToUse = ayudantiaId || user.id;
      console.log('📝 [REPORTE] Enviando reporte para semana:', weekNumber);
      console.log('📝 [REPORTE] Usuario ID:', user.id);
      console.log('📝 [REPORTE] Ayudantía ID:', idToUse);
      console.log('📝 [REPORTE] Rol del usuario:', user.role);
      console.log('📝 [REPORTE] URL:', `${API_BASE}/v1/ayudantias/${idToUse}/reportes`);

      const resp = await fetch(`${API_BASE}/v1/ayudantias/${idToUse}/reportes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log('📝 [REPORTE] Respuesta del servidor:', resp.status, resp.statusText);

      if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        console.error('📝 [REPORTE] Error del servidor:', err);

        // Manejar error específico de estudiante becario no encontrado
        if (err?.message === 'Registro de estudiante becario no encontrado') {
          toast({
            title: 'Registro no encontrado',
            description: 'No se encontró tu registro como estudiante becario. Contacta al administrador para verificar tu estado.',
            variant: 'destructive'
          });
          return;
        }

        // Manejar errores de validación con detalles específicos
        if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
          const errorMessages = err.errors.map((error: any) =>
            `• ${error.field}: ${error.message}`
          ).join('\n');

          toast({
            title: err?.message || 'Error de Validación',
            description: errorMessages,
            variant: 'destructive'
          });
          return;
        }

        throw new Error(err?.message || `Error ${resp.status}`);
      }

      const newCompletedWeeks = new Set(completedWeeks);
      newCompletedWeeks.add(weekNumber);
      setCompletedWeeks(newCompletedWeeks);
      toast({ title: 'Reporte enviado', description: `Semana ${weekNumber} registrada exitosamente.` });
      await loadReportes();
    } catch (e: any) {
      console.error('📝 [REPORTE] Error general:', e);
      toast({ title: 'Error', description: e?.message || 'No se pudo enviar el reporte', variant: 'destructive' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Datos enviados",
      description: "La información ha sido registrada exitosamente.",
    });
    setFormData({
      fecha: "",
      horas: "",
      descripcion: "",
      objetivos: "",
      metas: "",
      actividades: "",
      reporteSemanal: "",
      observaciones: ""
    });
  };

  // Función para calcular estadísticas reales
  const calculateStats = () => {
    // Asegurar que reportes sea un array
    const reportesArray = Array.isArray(reportes) ? reportes : [];
    
    const totalHorasRegistradas = reportesArray.reduce((sum, r) => {
      const horas = typeof r.horasTrabajadas === 'number' ? r.horasTrabajadas : parseFloat(String(r.horasTrabajadas)) || 0;
      return sum + horas;
    }, 0);
    
    const totalHorasAprobadas = reportesArray
      .filter(r => {
        const estado = String(r.estado || '').toLowerCase();
        return estado === 'aprobado' || estado === 'aprobada';
      })
      .reduce((sum, r) => {
        const horas = typeof r.horasTrabajadas === 'number' ? r.horasTrabajadas : parseFloat(String(r.horasTrabajadas)) || 0;
        return sum + horas;
      }, 0);
    
    // Calcular horas de esta semana (semana actual)
    const horasEstaSemana = reportesArray
      .filter(r => parseInt(String(r.semana)) === parseInt(String(semanaActual || 1)))
      .reduce((sum, r) => {
        const horas = typeof r.horasTrabajadas === 'number' ? r.horasTrabajadas : parseFloat(String(r.horasTrabajadas)) || 0;
        return sum + horas;
      }, 0);
    
    // Calcular porcentaje de aprobación
    const porcentajeAprobacion = totalHorasRegistradas > 0 
      ? Math.round((totalHorasAprobadas / totalHorasRegistradas) * 100)
      : 0;

    return {
      totalHorasRegistradas: Number(totalHorasRegistradas).toFixed(1),
      totalHorasAprobadas: Number(totalHorasAprobadas).toFixed(1),
      horasEstaSemana: Number(horasEstaSemana).toFixed(1),
      porcentajeAprobacion
    };
  };

  const statsData = calculateStats();

  const stats = [
    {
      title: "Horas Registradas",
      value: statsData.totalHorasRegistradas,
      change: `Esta semana: ${statsData.horasEstaSemana}h`,
      icon: Clock
    },
    {
      title: "Horas Aprobadas",
      value: statsData.totalHorasAprobadas,
      change: `${statsData.porcentajeAprobacion}% aprobación`,
      icon: () => <CheckCircle className="h-4 w-4" />
    }
  ];

  const renderContent = () => {
    switch (activeModule) {
      case "horario-disponibilidad":
        return <AvailabilitySchedule />;
      

      case "reporte-actividades":
        return (
          <Card className="border-orange/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
              <CardTitle className="text-xl text-primary">Sistema de Reporte de Actividades</CardTitle>
              <CardDescription>
                Completa el reporte detallado de tus actividades como ayudante
              </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeWeek} onValueChange={setActiveWeek} className="w-full">
                <TabsList className="grid grid-cols-6 lg:grid-cols-12 mb-6">
                  {loadingSemanas ? (
                    <div className="col-span-full text-center py-4 text-muted-foreground">
                      Cargando semanas habilitadas...
                    </div>
                  ) : (
                    Array.from({ length: 12 }, (_, i) => {
                    const weekNumber = i + 1;
                    const isAvailable = isWeekAvailable(weekNumber);
                    const isExpired = isWeekExpired(weekNumber);
                    const isCompleted = completedWeeks.has(weekNumber);
                    
                    return (
                      <TabsTrigger 
                        key={weekNumber} 
                        value={`semana-${weekNumber}`} 
                        className={`text-xs ${
                          !isAvailable 
                              ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400' 
                            : isExpired 
                              ? 'text-red-500 bg-red-50' 
                              : isCompleted 
                                ? 'text-green-600 bg-green-50' 
                                : ''
                        }`}
                        disabled={!isAvailable}
                      >
                        S{weekNumber}
                        {isCompleted && ' ✓'}
                        {isExpired && ' ✗'}
                      </TabsTrigger>
                    );
                    })
                  )}
                </TabsList>
                
                {Array.from({ length: 12 }, (_, i) => {
                  const weekNumber = i + 1;
                  const isAvailable = isWeekAvailable(weekNumber);
                  const isExpired = isWeekExpired(weekNumber);
                  const isCompleted = completedWeeks.has(weekNumber);
                  const deadline = weeklyDeadlines[weekNumber];
                  
                  return (
                    <TabsContent key={weekNumber} value={`semana-${weekNumber}`}>
                      {!isAvailable ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-600 font-medium mb-2">
                            Semana {weekNumber} No Disponible
                          </p>
                          <p className="text-gray-500 text-sm">
                            Esta semana no está habilitada en el período académico actual.
                          </p>
                        </div>
                      ) : isExpired ? (
                        <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200">
                          <p className="text-red-600 font-medium">
                            ⚠️ Esta semana ha expirado
                          </p>
                          <p className="text-red-500 text-sm mt-2">
                            No se registró el reporte a tiempo. La oportunidad se ha perdido.
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          handleWeekSubmit(weekNumber);
                        }} className="space-y-6">
                        {/* Week Status */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-primary">
                              {weekNumber === semanaActual ? `Semana ${weekNumber} (Actual)` : `Semana ${weekNumber}`}
                            </h3>
                            </div>
                          {weekNumber === semanaActual && (
                            <p className="text-blue-600 text-sm mt-2">📅 Semana actual del período</p>
                          )}
                          {isCompleted && (
                            <p className="text-green-600 text-sm mt-2">✓ Semana completada</p>
                          )}
                        </div>

                        {/* Registro de Horas */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-primary">Registro de Horas - Semana {weekNumber}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fecha">Fecha</Label>
                            <Input
                              id="fecha"
                              type="date"
                              value={formData.fecha}
                              onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="horas">Horas trabajadas</Label>
                            <Input
                              id="horas"
                              type="number"
                              step="0.5"
                              min="0.5"
                              max="120"
                              placeholder="Ej: 4.5"
                              value={formData.horas}
                              onChange={(e) => setFormData({...formData, horas: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Objetivos y Metas */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary">Objetivos y Metas</h3>
                        <div className="space-y-2">
                          <Label htmlFor="objetivos">Objetivos del período</Label>
                          <Textarea
                            id="objetivos"
                            placeholder="Describe los objetivos planteados para este período..."
                            value={formData.objetivos}
                            onChange={(e) => setFormData({...formData, objetivos: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="metas">Metas específicas</Label>
                          <Textarea
                            id="metas"
                            placeholder="Detalla las metas específicas alcanzadas..."
                            value={formData.metas}
                            onChange={(e) => setFormData({...formData, metas: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      {/* Programación de Actividades */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary">Programación de Actividades por Período</h3>
                        <div className="space-y-2">
                          <Label htmlFor="actividades">Actividades programadas y ejecutadas</Label>
                          <Textarea
                            id="actividades"
                            placeholder="Describe las actividades programadas y su estado de ejecución..."
                            value={formData.actividades}
                            onChange={(e) => setFormData({...formData, actividades: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      {/* Reporte Semanal */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary">Reporte Semanal de Actividades</h3>
                        <div className="space-y-2">
                          <Label htmlFor="reporteSemanal">Actividades realizadas esta semana</Label>
                          <Textarea
                            id="reporteSemanal"
                            placeholder="Detalla las actividades específicas realizadas durante la semana..."
                            value={formData.reporteSemanal}
                            onChange={(e) => setFormData({...formData, reporteSemanal: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="descripcion">Descripción de actividades</Label>
                          <Textarea
                            id="descripcion"
                            placeholder="Describe las actividades realizadas..."
                            value={formData.descripcion}
                            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      {/* Observaciones */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary">Observaciones</h3>
                        <div className="space-y-2">
                          <Label htmlFor="observaciones">Observaciones generales</Label>
                          <Textarea
                            id="observaciones"
                            placeholder="Incluye cualquier observación adicional, dificultades encontradas, sugerencias de mejora..."
                            value={formData.observaciones}
                            onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                          />
                        </div>
                      </div>

                          <Button
                            type="submit"
                            className="w-full bg-gradient-primary hover:opacity-90"
                          >
                            {isCompleted ? `Enviar Nuevo Reporte Semana ${weekNumber}` : `Enviar Reporte Semana ${weekNumber}`}
                          </Button>
                        </form>
                      )}
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>
        );

      case "actividades-recientes":
        return (
          <div className="space-y-6">
            {/* Plaza Actual */}
            {plazaActual && (
              <Card className="border-orange/20 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="bg-gradient-to-r from-orange-50 to-white border-b border-orange-100 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-orange-500 rounded-lg shadow-sm">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">Plaza Asignada</CardTitle>
                      <p className="text-sm text-orange-600/70">{plazaActual.nombre || 'Plaza de Ayudantía'}</p>
                    </div>
                  </div>
                </div>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{plazaActual.descripcionActividades || plazaActual.descripcion || 'Sin descripción'}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <User className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="text-xs text-gray-500">Supervisor</p>
                          <p className="text-sm font-medium text-gray-900">
                            {plazaActual.supervisor?.nombre && plazaActual.supervisor?.apellido
                              ? `${plazaActual.supervisor.nombre} ${plazaActual.supervisor.apellido}`
                              : plazaActual.supervisorResponsable || 'No asignado'
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="text-xs text-gray-500">Horas semanales</p>
                          <p className="text-sm font-medium text-gray-900">{plazaActual.horasSemana || plazaActual.horasRequeridas || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    {plazaActual.horario && Array.isArray(plazaActual.horario) && plazaActual.horario.length > 0 && (
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Horario</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {plazaActual.horario.map((h: any, index: number) => (
                            <div key={index} className="flex items-center gap-2 text-sm bg-white p-2 rounded border border-gray-100">
                              <span className="font-medium text-gray-900">{h.dia}</span>
                              <span className="text-gray-400">·</span>
                              <span className="text-gray-600">{h.horaInicio} - {h.horaFin}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Postulaciones de Becas Section */}
            {!loadingPostulacionesBecas && postulacionesBecas.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground">Estado de tus Postulaciones a Becas</h2>
                {postulacionesBecas.map((postulacion) => {
                  const getEstadoColor = (estado: string) => {
                    switch (estado.toLowerCase()) {
                      case 'pendiente':
                        return 'border-yellow-200 bg-yellow-50';
                      case 'aprobada':
                      case 'aprobado':
                        return 'border-green-200 bg-green-50';
                      case 'rechazada':
                      case 'rechazado':
                        return 'border-red-200 bg-red-50';
                      default:
                        return 'border-gray-200 bg-gray-50';
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
                        return <FileText className="h-5 w-5 text-gray-600" />;
                    }
                  };

                  return (
                    <Card
                      key={postulacion.id}
                      className={`border-2 ${getEstadoColor(postulacion.estado)}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {getEstadoIcon(postulacion.estado)}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">
                                {postulacion.tipoBeca}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(postulacion.estado)}`}>
                                {postulacion.estado}
                              </span>
                            </div>
                            <div className="space-y-1 text-sm text-gray-700">
                              <p><strong>Carrera:</strong> {postulacion.carrera}</p>
                              <p><strong>Fecha de postulación:</strong> {new Date(postulacion.fechaPostulacion).toLocaleDateString('es-ES')}</p>
                            </div>
                            {postulacion.estado.toLowerCase() === 'pendiente' && (
                              <p className="mt-3 text-sm italic text-yellow-700">
                                Tu postulación está siendo evaluada. Recibirás una notificación cuando haya una respuesta.
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* No Postulaciones Message */}
            {!loadingPostulacionesBecas && postulacionesBecas.length === 0 && user?.email && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        ¿Deseas postularte a una beca?
                      </h3>
                      <p className="text-blue-800 mb-4">
                        Puedes postularte a diferentes programas de becas desde el módulo de postulaciones.
                      </p>
                      <Button
                        onClick={() => navigate('/postulaciones-becas')}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Ir a Postular
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="border-orange/20 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        {stat.title}
                      </CardTitle>
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <stat.icon className="h-5 w-5 text-orange-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-gray-900">{stat.value}h</div>
                      <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>

            {/* Recent Activities */}
            <Card className="border-orange/20 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="bg-gradient-to-r from-orange-50 to-white border-b border-orange-100 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-orange-500 rounded-lg shadow-sm">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">Actividades Recientes</CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        Últimas horas registradas y su estado de aprobación
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    onClick={loadReportes}
                    variant="outline"
                    size="sm"
                    disabled={loadingReportes}
                    className="border-orange-200 hover:bg-orange-50 hover:border-orange-300"
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingReportes ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {loadingReportes && (
                    <div className="text-sm text-muted-foreground">Cargando...</div>
                  )}
                  {!loadingReportes && reportes.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">Sin actividades registradas</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Comienza enviando tu primer reporte semanal
                      </p>
                    </div>
                  )}
                  {!loadingReportes && reportes.map((r) => (
                    <div key={r.id} className="p-4 bg-white rounded-lg border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-full">
                              <Calendar className="h-3.5 w-3.5 text-orange-600" />
                              <span className="text-sm font-semibold text-orange-700">
                                Semana {r.semana}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(r.fecha).toLocaleDateString('es-VE')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <p className="text-sm font-medium text-gray-700">
                              {r.horasTrabajadas} horas trabajadas
                            </p>
                          </div>
                          {r.descripcionActividades && (
                            <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                              {r.descripcionActividades}
                            </p>
                          )}
                          {r.objetivosPeriodo && (
                            <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
                              <span className="font-semibold text-gray-700">Objetivos:</span> {r.objetivosPeriodo}
                            </p>
                          )}
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                          r.estado === 'aprobado' || r.estado === 'Aprobado'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : r.estado === 'pendiente' || r.estado === 'Pendiente'
                            ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                            : r.estado === 'rechazado' || r.estado === 'Rechazado'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-gray-50 text-gray-700 border border-gray-200'
                        }`}>
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>{r.estado ? r.estado.charAt(0).toUpperCase() + r.estado.slice(1) : 'Registrado'}</span>
                        </div>
                      </div>
                      {r.observaciones && (
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-600">
                            <span className="font-semibold text-gray-700">Observaciones:</span> {r.observaciones}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mis Postulaciones - Solo mostrar si NO tiene plaza asignada */}
            {!plazaActual && misPostulaciones.length > 0 && (
              <Card className="border-blue/20 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-500 rounded-lg shadow-sm">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900">Mis Postulaciones</CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          Estado de tus postulaciones a plazas de ayudantía
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      onClick={loadMisPostulaciones}
                      variant="outline"
                      size="sm"
                      disabled={loadingPostulaciones}
                      className="border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                    >
                      <RefreshCw className={`h-4 w-4 ${loadingPostulaciones ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {misPostulaciones.map((postulacion) => (
                      <div key={postulacion.id} className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{postulacion.plaza?.nombre || 'Plaza de Ayudantía'}</h4>
                            <p className="text-sm text-gray-600 mt-1">{postulacion.plaza?.descripcionActividades || 'Sin descripción'}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-3 ${
                            postulacion.estado === 'Aprobada'
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : postulacion.estado === 'Pendiente'
                              ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {postulacion.estado}
                          </span>
                        </div>
                        {postulacion.compatibilidadHoraria && (
                          <div className="flex items-center gap-2 mb-2">
                            <Percent className="h-4 w-4 text-blue-500" />
                            <span className="text-sm text-gray-600">Compatibilidad: <span className="font-semibold text-blue-600">{postulacion.compatibilidadHoraria.porcentaje}%</span></span>
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          Postulado el {new Date(postulacion.fechaPostulacion).toLocaleDateString('es-ES')}
                        </div>
                        {postulacion.motivoRechazo && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm text-red-600">
                              <span className="font-semibold">Motivo de rechazo:</span> {postulacion.motivoRechazo}
                            </p>
                          </div>
                        )}
                        {postulacion.observaciones && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Observaciones:</span> {postulacion.observaciones}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Plazas Compatibles - Solo mostrar si NO tiene plaza asignada */}
            {!plazaActual && (
            <Card className="border-orange/20 shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="bg-gradient-to-r from-orange-50 to-white border-b border-orange-100 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-orange-500 rounded-lg shadow-sm">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">Plazas Compatibles</CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        Plazas compatibles con tu horario de disponibilidad
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    onClick={loadPlazasDisponibles}
                    variant="outline"
                    size="sm"
                    disabled={loadingPlazas}
                    className="border-orange-200 hover:bg-orange-50 hover:border-orange-300"
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingPlazas ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
              <CardContent className="pt-6">
                {loadingPlazas ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Cargando plazas compatibles...</span>
                  </div>
                ) : plazasDisponibles.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-2">No hay plazas compatibles en este momento</p>
                    <p className="text-sm text-gray-500 mb-2">
                      Período académico actual: <span className="font-semibold text-primary">{periodoActual}</span>
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Asegúrate de tener tu horario de disponibilidad registrado y que haya plazas activas para el período actual
                    </p>
                    <Button
                      onClick={loadPlazasDisponibles}
                      variant="outline"
                      className="mt-2"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Actualizar
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {plazasDisponibles.map((plaza) => {
                      const yaPostulado = misPostulaciones.some(p => p.plazaId === plaza.id && (p.estado === 'Pendiente' || p.estado === 'Aprobada'));
                      const postulacionRechazada = misPostulaciones.find(p => p.plazaId === plaza.id && p.estado === 'Rechazada');

                      return (
                        <Card key={plaza.id} className="border-gray-200 hover:border-orange-300 transition-all duration-200 hover:shadow-md">
                          <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <CardTitle className="text-base font-bold text-gray-900">{plaza.nombre || 'Plaza de Ayudantía'}</CardTitle>
                                <CardDescription className="text-sm text-gray-600">
                                  {plaza.descripcionActividades || plaza.descripcion || 'Sin descripción'}
                                </CardDescription>
                              </div>
                              {plaza.compatibilidadPorcentaje && (
                                <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-lg border border-green-200">
                                  <Percent className="h-3.5 w-3.5 text-green-600" />
                                  <span className="text-xs font-semibold text-green-700">{plaza.compatibilidadPorcentaje}%</span>
                                </div>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3 pt-4">
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                              <User className="h-4 w-4 text-orange-500" />
                              <div className="flex-1">
                                <p className="text-xs text-gray-500">Supervisor</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {plaza.supervisor?.nombre && plaza.supervisor?.apellido
                                    ? `${plaza.supervisor.nombre} ${plaza.supervisor.apellido}`
                                    : plaza.supervisorResponsable || 'No asignado'
                                  }
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="p-2 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Horas/semana</p>
                                <p className="text-sm font-semibold text-gray-900">{plaza.horasSemana || plaza.horasRequeridas || 'N/A'}</p>
                              </div>
                              <div className="p-2 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Cupos disponibles</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {plaza.plazasDisponibles ?? plaza.cuposDisponibles ?? (plaza.capacidad && plaza.ocupadas !== undefined ? plaza.capacidad - plaza.ocupadas : 'N/A')}
                                </p>
                              </div>
                            </div>
                            {plaza.horario && Array.isArray(plaza.horario) && plaza.horario.length > 0 && (
                              <div className="pt-3 border-t border-gray-100">
                                <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Horario</p>
                                <div className="space-y-1">
                                  {plaza.horario.map((h: any, index: number) => (
                                    <div key={index} className="flex items-center gap-2 text-xs bg-white p-1.5 rounded border border-gray-100">
                                      <span className="font-medium text-gray-900">{h.dia}</span>
                                      <span className="text-gray-400">·</span>
                                      <span className="text-gray-600">{h.horaInicio} - {h.horaFin}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className="pt-3 border-t border-gray-100">
                              {yaPostulado ? (
                                <Button
                                  disabled
                                  className="w-full bg-gray-300 text-gray-600 cursor-not-allowed"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Ya postulaste a esta plaza
                                </Button>
                              ) : postulacionRechazada ? (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
                                    <XCircle className="h-4 w-4 text-red-600" />
                                    <span className="text-xs text-red-700">Postulación anterior rechazada</span>
                                  </div>
                                  <Button
                                    onClick={() => handlePostularPlaza(plaza.id)}
                                    disabled={postulando === plaza.id}
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                  >
                                    {postulando === plaza.id ? (
                                      <>
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        Postulando...
                                      </>
                                    ) : (
                                      <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Postular nuevamente
                                      </>
                                    )}
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  onClick={() => handlePostularPlaza(plaza.id)}
                                  disabled={postulando === plaza.id}
                                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                                >
                                  {postulando === plaza.id ? (
                                    <>
                                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                      Postulando...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="h-4 w-4 mr-2" />
                                      Postular a esta plaza
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
            )}
          </div>
        );

      case "perfil":
        return (
          <div className="space-y-6">
            {/* Información Personal */}
            <Card className="border-orange/20">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Información Personal
                </CardTitle>
                <CardDescription>
                  Datos de tu perfil como ayudante
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Nombre Completo</Label>
                    <p className="text-base font-medium text-primary">
                      {user?.nombre && user?.apellido
                        ? `${user.nombre} ${user.apellido}`
                        : 'No disponible'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Correo Electrónico</Label>
                    <p className="text-base font-medium text-primary">
                      {user?.email || 'No disponible'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Carnet/ID</Label>
                    <p className="text-base font-medium text-primary">
                      {user?.carnet || user?.id || 'No disponible'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Rol</Label>
                    <p className="text-base font-medium text-primary capitalize">
                      {user?.role === 'estudiante' ? 'Estudiante' : user?.role || 'No definido'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de Ayudantía */}
            <Card className="border-orange/20">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Información de Ayudantía
                </CardTitle>
                <CardDescription>
                  Detalles de tu asignación y supervisor
                </CardDescription>
              </CardHeader>
              <CardContent>
                {plazaActual ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Plaza Asignada</Label>
                        <p className="text-base font-medium text-primary">
                          {plazaActual.nombre || 'No asignada'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Supervisor</Label>
                        <p className="text-base font-medium text-primary">
                          {plazaActual.supervisor?.nombre && plazaActual.supervisor?.apellido
                            ? `${plazaActual.supervisor.nombre} ${plazaActual.supervisor.apellido}`
                            : plazaActual.supervisorResponsable || 'No asignado'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Período Académico</Label>
                        <p className="text-base font-medium text-primary">{periodoActual}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Estado</Label>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          plazaActual.estado === 'Activa'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {plazaActual.estado || 'Sin estado'}
                        </span>
                      </div>
                    </div>
                    {plazaActual.descripcionActividades && (
                      <div className="pt-4 border-t border-orange/20">
                        <Label className="text-sm font-medium text-muted-foreground">Descripción de Actividades</Label>
                        <p className="text-sm text-muted-foreground mt-2">
                          {plazaActual.descripcionActividades}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-muted-foreground">No tienes una plaza asignada actualmente</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Información Académica */}
            <Card className="border-orange/20">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Información Académica
                </CardTitle>
                <CardDescription>
                  Completa tu información académica
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleGuardarInfoAcademica}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="carrera">Carrera</Label>
                      <Input
                        id="carrera"
                        type="text"
                        placeholder="Ej: Ingeniería de Sistemas"
                        value={academicInfo.carrera}
                        onChange={(e) =>
                          setAcademicInfo({ ...academicInfo, carrera: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trimestre">Trimestre</Label>
                      <Input
                        id="trimestre"
                        type="number"
                        min="1"
                        max="20"
                        placeholder="6"
                        value={academicInfo.trimestre}
                        onChange={(e) =>
                          setAcademicInfo({ ...academicInfo, trimestre: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="iaa">Índice Académico Acumulado (IAA)</Label>
                      <Input
                        id="iaa"
                        type="number"
                        step="0.01"
                        min="0"
                        max="20"
                        placeholder="15"
                        value={academicInfo.iaa}
                        onChange={(e) =>
                          setAcademicInfo({ ...academicInfo, iaa: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="asignaturasAprobadas">Asignaturas Aprobadas</Label>
                      <Input
                        id="asignaturasAprobadas"
                        type="number"
                        min="0"
                        placeholder="20"
                        value={academicInfo.asignaturasAprobadas}
                        onChange={(e) =>
                          setAcademicInfo({
                            ...academicInfo,
                            asignaturasAprobadas: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="creditosInscritos">Créditos Inscritos este Trimestre</Label>
                      <Input
                        id="creditosInscritos"
                        type="number"
                        min="0"
                        placeholder="18"
                        value={academicInfo.creditosInscritos}
                        onChange={(e) =>
                          setAcademicInfo({
                            ...academicInfo,
                            creditosInscritos: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Nota:</strong> Los datos de Carrera, Trimestre, IAA y Asignaturas Aprobadas se guardan en el servidor. Los Créditos Inscritos se mantienen localmente.
                    </p>
                  </div>

                  <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90">
                    Guardar Información Académica
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        );

      case "reglamento":
        return (
          <div className="flex justify-center">
            <ReglamentoAccess becaType="ayudantia" />
          </div>
        );

      default:
        return (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Bienvenido al Sistema de Ayudantías
            </h2>
            <p className="text-muted-foreground">
              Utiliza el menú lateral para navegar entre los diferentes módulos
            </p>
          </div>
        );
    }
  };

  // Verificar que el usuario tenga rol de estudiante
  if (user?.role !== 'estudiante') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-destructive">Acceso Denegado</CardTitle>
            <CardDescription>
              Solo los estudiantes pueden acceder a esta sección
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Tu rol actual es: <span className="font-semibold">{user?.role || 'No definido'}</span>
            </p>
            <Button
              onClick={() => navigate("/scholarship-programs")}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Programas de Becas
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mostrar spinner mientras se carga la verificación inicial - simplificado
  if (user?.role === 'estudiante' && (loadingBecarioStatus || loadingSemanas || ayudantiaId === null && loadingReportes)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <RefreshCw className="h-16 w-16 animate-spin text-orange-500" />
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-gray-900">Cargando...</p>
            <p className="text-sm text-gray-500">
              Preparando tu espacio de trabajo
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Verificar si la postulación del estudiante ha sido aprobada
  // Solo mostrar el mensaje si hay una postulación pendiente de ayudantía
  const tienePostulacionPendienteAyudantia = postulacionesBecas.some(
    (post) => post.tipoBeca === 'Ayudantía' && post.estado === 'Pendiente'
  );

  if (
    user?.role === 'estudiante' && 
    !loadingBecarioStatus && 
    !loadingPostulacionesBecas &&
    (!becarioStatus || becarioStatus?.estado !== 'Activa') &&
    tienePostulacionPendienteAyudantia
  ) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <CardTitle className="text-xl text-yellow-600">Postulación Pendiente de Aprobación</CardTitle>
            <CardDescription>
              Tu postulación está siendo revisada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800 text-center">
                <strong>Estado:</strong> Tu registro ha sido creado exitosamente, pero tu postulación aún no ha sido aprobada por el gestor del programa.
              </p>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="text-center">
                Una vez que tu postulación sea aprobada, podrás acceder a todas las funcionalidades de tu beca, incluyendo:
              </p>
              <ul className="space-y-2 ml-6 list-disc">
                <li>Registro de horas trabajadas</li>
                <li>Sistema de reportes semanales</li>
                <li>Gestión de horarios de disponibilidad</li>
                <li>Acceso a plazas disponibles</li>
                <li>Visualización de tu perfil completo</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 text-center">
                💡 <strong>Consejo:</strong> Mientras esperas, puedes contactar al gestor del programa para consultar el estado de tu postulación.
              </p>
            </div>

            <div className="pt-4 space-y-2">
              <Button
                onClick={() => navigate("/scholarship-programs")}
                className="w-full"
                variant="outline"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Programas de Becas
              </Button>
              <Button
                onClick={async () => {
                  await loadBecarioStatus();
                  toast({
                    title: becarioStatus?.estado === 'Activa' ? 'Estado verificado' : 'Aún pendiente',
                    description: becarioStatus?.estado === 'Activa'
                      ? 'Tu postulación ha sido aprobada. La página se recargará automáticamente.'
                      : 'Tu postulación aún está pendiente de aprobación.',
                    variant: becarioStatus?.estado === 'Activa' ? 'default' : 'destructive',
                  });
                  if (becarioStatus?.estado === 'Activa') {
                    setTimeout(() => window.location.reload(), 1500);
                  }
                }}
                className="w-full bg-gradient-primary hover:opacity-90"
                disabled={loadingBecarioStatus}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loadingBecarioStatus ? 'animate-spin' : ''}`} />
                {loadingBecarioStatus ? 'Verificando...' : 'Verificar Estado de Aprobación'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background relative">
      {/* Diseño de fondo con líneas modernas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#FF6B35', stopOpacity: 0 }} />
              <stop offset="50%" style={{ stopColor: '#FF6B35', stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: '#FF6B35', stopOpacity: 0 }} />
            </linearGradient>
          </defs>

          {/* Líneas diagonales principales (izquierda a derecha, descendente) */}
          <line x1="0" y1="10%" x2="100%" y2="25%" stroke="url(#lineGradient)" strokeWidth="1.5" opacity="0.4"/>
          <line x1="0" y1="30%" x2="100%" y2="45%" stroke="url(#lineGradient)" strokeWidth="2" opacity="0.5"/>
          <line x1="0" y1="55%" x2="100%" y2="70%" stroke="url(#lineGradient)" strokeWidth="1.5" opacity="0.35"/>
          <line x1="0" y1="75%" x2="100%" y2="90%" stroke="url(#lineGradient)" strokeWidth="1.5" opacity="0.3"/>

          {/* Líneas diagonales secundarias (izquierda a derecha, ascendente) */}
          <line x1="0" y1="85%" x2="100%" y2="70%" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.25"/>
          <line x1="0" y1="50%" x2="100%" y2="35%" stroke="url(#lineGradient)" strokeWidth="1" opacity="0.2"/>

          {/* Líneas diagonales adicionales con diferentes ángulos */}
          <line x1="0" y1="0" x2="40%" y2="100%" stroke="#FF6B35" strokeWidth="1" opacity="0.08"/>
          <line x1="25%" y1="0" x2="65%" y2="100%" stroke="#FF6B35" strokeWidth="1.5" opacity="0.1"/>
          <line x1="50%" y1="0" x2="90%" y2="100%" stroke="#FF6B35" strokeWidth="1" opacity="0.08"/>
          <line x1="75%" y1="0" x2="100%" y2="50%" stroke="#FF6B35" strokeWidth="1" opacity="0.07"/>

          {/* Líneas diagonales inversas (derecha a izquierda) */}
          <line x1="100%" y1="15%" x2="60%" y2="100%" stroke="#FF6B35" strokeWidth="1" opacity="0.06"/>
          <line x1="100%" y1="45%" x2="80%" y2="100%" stroke="#FF6B35" strokeWidth="1" opacity="0.05"/>
        </svg>
      </div>
      {/* Header */}
      <header className="bg-card border-b border-orange/20 px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout(() => navigate("/"))}
              className="text-primary hover:text-primary/90"
            >
              <LogOut className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Gestión de Ayudantía</h1>
              <p className="text-sm text-muted-foreground">
                Inicio &gt; Mi Ayudantía &gt; Gestión
                {periodoActual && (
                  <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-800 rounded-md text-xs font-semibold">
                    Período: {periodoActual}
                  </span>
                )}
              </p>
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

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveModule("perfil")}
              className="text-right cursor-pointer hover:opacity-80 transition-opacity"
            >
              <p className="text-sm font-medium text-primary">
                {user?.nombre && user?.apellido
                  ? `${user.nombre} ${user.apellido}`
                  : user?.email || 'Usuario'}
              </p>
              <p className="text-xs text-muted-foreground">
                {user?.role === 'estudiante' ? 'Estudiante' : user?.role || 'Usuario'}
              </p>
            </button>
          </div>
        </div>
      </header>

      <div className="flex relative z-10">
        {/* Integrated Sidebar */}
        <div className="w-16 bg-card border-r border-orange/20 min-h-[calc(100vh-theme(spacing.20))] relative z-10">
          <div className="p-2 space-y-2">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setHoveredItem(item.title)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={item.onClick}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg border transition-all duration-200 ${
                    activeModule === item.title.toLowerCase().replace(/\s+/g, '-')
                      ? "bg-orange/10 border-orange/40"
                      : "bg-background border-orange/20 hover:bg-orange/10 hover:border-orange/40"
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
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PasanteAyudantiasModules;