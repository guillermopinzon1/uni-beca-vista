import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Users, Building, MapPin, RefreshCw, UserPlus, X, Clock, Calendar, AlertCircle, CheckCircle2, ChevronRight, Trash2, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { fetchPlazas, createPlaza, updatePlaza, fetchUsers, fetchBecarios, assignBecarioToPlaza, assignSupervisorToPlaza, fetchPlazaById, verificarCompatibilidadHorario, API_BASE } from "@/lib/api";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getAllPostulaciones, aprobarPostulacion, rechazarPostulacion } from "@/lib/api/postulacionesPlazas";

interface Plaza {
  id: string;
  nombre: string;
  ubicacion: string;
  supervisor: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
  };
  supervisorNombre: string; // Helper para display rápido
  capacidadMaxima: number;
  ayudantesActuales: number;
  tipoActividad: string;
  horarios: string[];
  estado: "Activa" | "Inactiva" | "Completa";
  descripcion: string;
  requisitos: string[];
  fechaCreacion: string;
  // Propiedades del API para edición
  capacidad?: number;
  ocupadas?: number;
  horario?: Array<{
    dia: string;
    horaInicio: string;
    horaFin: string;
  }>;
  tipoAyudantia?: string;
  descripcionActividades?: string;
  requisitosEspeciales?: string[];
  horasSemana?: number;
  periodoAcademico?: string;
  supervisorResponsable?: string;
  observaciones?: string;
  // Datos de estudiantes asignados
  estudiantesAsignados?: Array<{
    id: string;
    usuarioId: string;
    estado: string;
    horasRequeridas: number;
    horasCompletadas: number;
    periodoInicio: string;
    fechaAsignacion: string;
    usuario: {
      nombre: string;
      apellido: string;
      email: string;
      carrera: string;
      trimestre: number;
    };
  }>;
}


const GestionPlazas = () => {
  const { toast } = useToast();
  const { tokens } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [selectedPlaza, setSelectedPlaza] = useState<Plaza | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPlaza, setEditingPlaza] = useState<Plaza | null>(null);
  const [plazas, setPlazas] = useState<Plaza[]>([]);
  const [loading, setLoading] = useState(false);
  const [supervisores, setSupervisores] = useState<Array<{id: string, nombre: string, apellido?: string, email: string}>>([]);
  const [loadingSupervisores, setLoadingSupervisores] = useState(false);
  const [loadingPlazaDetails, setLoadingPlazaDetails] = useState(false);

  // Estados para postulaciones
  const [postulaciones, setPostulaciones] = useState<any[]>([]);
  const [loadingPostulaciones, setLoadingPostulaciones] = useState(false);
  const [showPostulacionesModal, setShowPostulacionesModal] = useState(false);
  const [selectedPostulacion, setSelectedPostulacion] = useState<any>(null);

  // Estados para asignar becarios
  const [isAssigningBecario, setIsAssigningBecario] = useState(false);
  const [plazaToAssign, setPlazaToAssign] = useState<Plaza | null>(null);
  const [becarios, setBecarios] = useState<Array<{
    id: string;
    usuarioId: string;
    programaBeca?: string;
    tipoBeca?: string;
    estado?: string;
    plazaAsignada?: string | null;
    usuario: {
      id?: string;
      nombre: string;
      apellido: string;
      email: string;
      cedula?: string;
      carrera?: string;
      trimestre?: number;
    };
    disponibilidadVerificada?: boolean;
    disponible?: boolean;
    // Nuevos campos de compatibilidad
    bloquesMatcheados?: number;
    totalBloques?: number;
    porcentajeCobertura?: number;
    detallesPorDia?: any;
  }>>([]);
  const [loadingBecarios, setLoadingBecarios] = useState(false);
  const [selectedBecarioId, setSelectedBecarioId] = useState("");
  const [horasRequeridas, setHorasRequeridas] = useState(10);
  const [assigningBecario, setAssigningBecario] = useState(false);
  const [verificandoDisponibilidad, setVerificandoDisponibilidad] = useState(false);

  // Estado para el panel lateral de detalles
  const [isPlazaDetailOpen, setIsPlazaDetailOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isAssigningSupervisor, setIsAssigningSupervisor] = useState(false);
  const [selectedSupervisorId, setSelectedSupervisorId] = useState("");
  const [isDeletingPlaza, setIsDeletingPlaza] = useState(false);

  console.log('GestionPlazas component rendering');
  
  // Limpiar formulario cuando se abre el modal de creación
  useEffect(() => {
    if (isCreating && !isEditing) {
      setFormData({
        nombre: "",
        ubicacion: "",
        capacidad: 1,
        horario: [{ dia: "Lunes", horaInicio: "08:00", horaFin: "12:00" }],
        tipoAyudantia: "academica",
        descripcionActividades: "",
        requisitosEspeciales: [""],
        horasSemana: 10,
        periodoAcademico: "2025-1",
        supervisorResponsable: "",
        observaciones: ""
      });
    }
  }, [isCreating, isEditing]);

  const [formData, setFormData] = useState({
    nombre: "",
    ubicacion: "",
    capacidad: 1,
    horario: [{ dia: "Lunes", horaInicio: "08:00", horaFin: "12:00" }],
    tipoAyudantia: "academica",
    descripcionActividades: "",
    requisitosEspeciales: [""],
    horasSemana: 10,
    periodoAcademico: "2025-1",
    supervisorResponsable: "",
    observaciones: ""
  });
  const [creating, setCreating] = useState(false);

  const loadPlazas = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) {
      toast({ title: 'Sin sesión', description: 'Inicia sesión para cargar plazas', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetchPlazas(accessToken, {
        estado: filterEstado !== 'todos' ? filterEstado : undefined,
        search: searchTerm || undefined,
        limit: 20,
        offset: 0
      });
      const mapped = res.data.plazas.map(p => ({
        id: p.id,
        nombre: p.nombre,
        ubicacion: p.ubicacion,
        supervisor: p.supervisor,
        supervisorNombre: p.supervisor ? `${p.supervisor.nombre}${p.supervisor.apellido ? ` ${p.supervisor.apellido}` : ''}` : '-',
        capacidadMaxima: p.capacidad,
        ayudantesActuales: p.ocupadas,
        tipoActividad: p.tipoAyudantia,
        horarios: Array.isArray(p.horario) ? p.horario.map(h => `${h.dia} ${h.horaInicio}-${h.horaFin}`) : [],
        estado: p.estado as "Activa" | "Inactiva" | "Completa",
        descripcion: p.descripcionActividades,
        requisitos: p.requisitosEspeciales,
        fechaCreacion: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : 'N/A',
        // Propiedades del API para edición
        capacidad: p.capacidad,
        ocupadas: p.ocupadas,
        horario: p.horario,
        tipoAyudantia: p.tipoAyudantia,
        descripcionActividades: p.descripcionActividades,
        requisitosEspeciales: p.requisitosEspeciales,
        horasSemana: p.horasSemana,
        periodoAcademico: p.periodoAcademico,
        supervisorResponsable: p.supervisorResponsable,
        observaciones: p.observaciones,
        // Datos de estudiantes asignados
        estudiantesAsignados: p.estudiantesAsignados || []
      }));
      setPlazas(mapped);
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'No se pudieron cargar las plazas', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaza = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) {
      toast({ title: 'Sin sesión', description: 'Inicia sesión para crear plazas', variant: 'destructive' });
      return;
    }
    
    setCreating(true);
    try {
      // Filtrar requisitos vacíos
      const requisitos = formData.requisitosEspeciales.filter(req => req.trim() !== '');
      
      // Filtrar horarios vacíos y asegurar que todos los campos estén llenos
      const horarios = formData.horario.filter(h => 
        h.dia && h.horaInicio && h.horaFin && 
        h.dia.trim() !== '' && h.horaInicio.trim() !== '' && h.horaFin.trim() !== ''
      );
      
      // Validar que haya al menos un horario
      if (horarios.length === 0) {
        toast({ title: 'Error', description: 'Debe agregar al menos un horario de trabajo', variant: 'destructive' });
        setCreating(false);
        return;
      }
      
      const plazaData = {
        nombre: formData.nombre,
        ubicacion: formData.ubicacion,
        capacidad: formData.capacidad,
        horario: horarios,
        tipoAyudantia: formData.tipoAyudantia,
        descripcionActividades: formData.descripcionActividades,
        requisitosEspeciales: requisitos,
        horasSemana: formData.horasSemana,
        periodoAcademico: formData.periodoAcademico,
        supervisorResponsable: formData.supervisorResponsable,
        observaciones: formData.observaciones
      };

      await createPlaza(accessToken, plazaData);
      toast({ title: 'Éxito', description: 'Plaza creada exitosamente' });
      setIsCreating(false);
      setFormData({
        nombre: "",
        ubicacion: "",
        capacidad: 1,
        horario: [{ dia: "Lunes", horaInicio: "08:00", horaFin: "12:00" }],
        tipoAyudantia: "academica",
        descripcionActividades: "",
        requisitosEspeciales: [""],
        horasSemana: 10,
        periodoAcademico: "2025-1",
        supervisorResponsable: "",
        observaciones: ""
      });
      await loadPlazas();
    } catch (e: any) {
      // Intentar parsear detalles de validación
      let shown = false;
      if (typeof e?.message === 'string' && e.message.startsWith('{')) {
        try {
          const parsed = JSON.parse(e.message);
          if (parsed?.errors && Array.isArray(parsed.errors)) {
            parsed.errors.forEach((err: any) => {
              toast({
                title: 'Error de validación',
                description: `${err.field}: ${err.message}`,
                variant: 'destructive'
              });
            });
            shown = true;
          } else if (parsed?.message) {
            toast({ title: 'Error', description: parsed.message, variant: 'destructive' });
            shown = true;
          }
        } catch {}
      }
      if (!shown) {
        toast({ title: 'Error', description: e?.message || 'No se pudo crear la plaza', variant: 'destructive' });
      }
    } finally {
      setCreating(false);
    }
  };

  const handleEditPlaza = (plaza: Plaza) => {
    console.log('Editando plaza:', plaza); // Debug log
    setEditingPlaza(plaza);

    // Asegurar que requisitosEspeciales sea un array
    const requisitos = Array.isArray(plaza.requisitosEspeciales)
      ? plaza.requisitosEspeciales
      : [""];

    // Asegurar que horario sea un array
    const horario = Array.isArray(plaza.horario) && plaza.horario.length > 0
      ? plaza.horario
      : [{ dia: "Lunes", horaInicio: "08:00", horaFin: "12:00" }];

    setFormData({
      nombre: plaza.nombre || "",
      ubicacion: plaza.ubicacion || "",
      capacidad: plaza.capacidad || 1,
      horario: horario,
      tipoAyudantia: plaza.tipoAyudantia || "academica",
      descripcionActividades: plaza.descripcionActividades || "",
      requisitosEspeciales: requisitos,
      horasSemana: plaza.horasSemana || 10,
      periodoAcademico: plaza.periodoAcademico || "2025-1",
      supervisorResponsable: plaza.supervisorResponsable || "",
      observaciones: plaza.observaciones || ""
    });
    setIsEditing(true);
  };

  const handleUpdatePlaza = async () => {
    if (!editingPlaza) return;

    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) {
      toast({
        title: 'Sin sesión',
        description: 'Inicia sesión para actualizar plazas',
        variant: 'destructive'
      });
      return;
    }

    setCreating(true);
    try {
      // Filtrar requisitos vacíos
      const requisitos = formData.requisitosEspeciales.filter(req => req.trim() !== '');
      
      // Filtrar horarios vacíos y asegurar que todos los campos estén llenos
      const horarios = formData.horario.filter(h => 
        h.dia && h.horaInicio && h.horaFin && 
        h.dia.trim() !== '' && h.horaInicio.trim() !== '' && h.horaFin.trim() !== ''
      );
      
      // Validar que haya al menos un horario
      if (horarios.length === 0) {
        toast({ title: 'Error', description: 'Debe agregar al menos un horario de trabajo', variant: 'destructive' });
        setCreating(false);
        return;
      }
      
      const plazaData = {
        ...formData,
        requisitosEspeciales: requisitos,
        horario: horarios,
        fechaInicio: formData.fechaInicio || new Date().toISOString().split('T')[0],
        fechaFin: formData.fechaFin || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      
      await updatePlaza(accessToken, editingPlaza.id, plazaData);
      toast({
        title: 'Plaza actualizada',
        description: 'La plaza se ha actualizado exitosamente',
      });
      setIsEditing(false);
      setEditingPlaza(null);
      loadPlazas();
    } catch (error: any) {
      console.error('Error updating plaza:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo actualizar la plaza',
        variant: 'destructive'
      });
    } finally {
      setCreating(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingPlaza(null);
    setFormData({
      nombre: "",
      ubicacion: "",
      capacidad: 1,
      horario: [{ dia: "Lunes", horaInicio: "08:00", horaFin: "12:00" }],
      tipoAyudantia: "academica",
      descripcionActividades: "",
      requisitosEspeciales: [""],
      horasSemana: 10,
      periodoAcademico: "2025-1",
      supervisorResponsable: "",
      observaciones: ""
    });
  };

  const loadSupervisores = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) {
      console.log('No access token for loading supervisores');
      return;
    }

    setLoadingSupervisores(true);
    try {
      console.log('Loading supervisores...');
      // Usar endpoint correcto con parámetros para obtener todos los supervisores activos
      const response = await fetch(`${API_BASE}/v1/supervisores/ayudantes/all?activo=true&limit=100&offset=0&conAyudantes=false`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar supervisores');
      }

      const res = await response.json();
      console.log('Supervisores response:', res);

      // Filtrar solo supervisores SIN plazas asignadas (plazasAsignadas debe estar vacío)
      const supervisoresDisponibles = res.data.supervisores.filter((sup: any) =>
        Array.isArray(sup.plazasAsignadas) && sup.plazasAsignadas.length === 0
      );

      const mapped = supervisoresDisponibles.map((u: any) => ({
        id: u.id,
        nombre: u.nombre,
        apellido: u.apellido,
        email: u.email
      }));
      setSupervisores(mapped);
      console.log('Supervisores loaded:', mapped);
    } catch (e: any) {
      console.error('Error loading supervisores:', e);
      setSupervisores([]);
    } finally {
      setLoadingSupervisores(false);
    }
  };

  const loadBecarios = async (plazaId: string) => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) {
      toast({ title: 'Sin sesión', description: 'Inicia sesión para cargar becarios', variant: 'destructive' });
      return;
    }

    setLoadingBecarios(true);
    try {
      // Usar nuevo endpoint que devuelve becarios compatibles con horarios de la plaza
      const response = await fetch(`${API_BASE}/v1/plazas/${plazaId}/becarios-compatibles?limit=100&offset=0`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cargar becarios compatibles');
      }

      const res = await response.json();

      // Los becarios vienen con información de compatibilidad de horarios
      setBecarios(res.data.becarios || []);

      if (res.data.becarios.length === 0) {
        toast({
          title: 'Sin becarios compatibles',
          description: 'No hay estudiantes disponibles cuyos horarios coincidan con esta plaza',
          variant: 'default'
        });
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'No se pudieron cargar los becarios', variant: 'destructive' });
      setBecarios([]);
    } finally {
      setLoadingBecarios(false);
    }
  };

  const handleOpenAssignBecario = async (plaza: Plaza) => {
    setPlazaToAssign(plaza);
    setIsAssigningBecario(true);
    setSelectedBecarioId("");
    setHorasRequeridas(10);

    // Cargar becarios compatibles con la plaza
    await loadBecarios(plaza.id);
  };

  // Ya no necesitamos verificar disponibilidad manualmente
  // El endpoint /api/v1/plazas/{id}/becarios-compatibles ya devuelve becarios compatibles validados

  const handleAssignBecario = async () => {
    if (!plazaToAssign || !selectedBecarioId) {
      toast({ title: 'Error', description: 'Selecciona un becario para asignar', variant: 'destructive' });
      return;
    }

    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) {
      toast({ title: 'Sin sesión', description: 'Inicia sesión para asignar becarios', variant: 'destructive' });
      return;
    }

    const becarioSeleccionado = becarios.find(b => b.id === selectedBecarioId);
    const nombreCompleto = becarioSeleccionado
      ? `${becarioSeleccionado.usuario.nombre} ${becarioSeleccionado.usuario.apellido}`
      : 'el estudiante';

    setAssigningBecario(true);
    try {
      await assignBecarioToPlaza(accessToken, selectedBecarioId, {
        plazaId: plazaToAssign.id
      });

      toast({
        title: 'Asignación exitosa',
        description: `${nombreCompleto} ha sido asignado exitosamente a ${plazaToAssign.nombre}`,
        className: "bg-green-50 border-green-200"
      });

      setIsAssigningBecario(false);
      setPlazaToAssign(null);
      setSelectedBecarioId("");

      // Recargar los detalles de la plaza si está seleccionada
      if (selectedPlaza && selectedPlaza.id === plazaToAssign.id) {
        await loadPlazaDetails(plazaToAssign.id);
      }

      await loadPlazas();
    } catch (e: any) {
      const errorMessage = e?.message || 'No se pudo asignar el becario';

      // Manejo específico para errores de horario/disponibilidad
      if (errorMessage.toLowerCase().includes('horario') ||
          errorMessage.toLowerCase().includes('compatible') ||
          errorMessage.toLowerCase().includes('disponibilidad')) {
        toast({
          title: 'Incompatibilidad de Horarios',
          description: (
            <div className="space-y-2">
              <p className="font-medium">{errorMessage}</p>
              <p className="text-xs mt-2">
                <strong>Horarios de la plaza:</strong><br />
                {plazaToAssign.horarios.join(', ')}
              </p>
              <p className="text-xs mt-2 bg-yellow-50 border border-yellow-200 rounded p-2">
                📋 <strong>Solución:</strong> El estudiante necesita registrar su disponibilidad horaria en el sistema antes de poder ser asignado a esta plaza.
              </p>
            </div>
          ),
          variant: 'destructive',
          duration: 10000
        });
      } else {
        toast({
          title: 'Error al asignar estudiante',
          description: errorMessage,
          variant: 'destructive'
        });
      }
    } finally {
      setAssigningBecario(false);
    }
  };

  const handleUnassignBecario = async (plazaId: string, becarioId: string) => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) {
      toast({ title: 'Sin sesión', description: 'Inicia sesión para desasignar becarios', variant: 'destructive' });
      return;
    }

    try {
      // Usar nuevo endpoint PUT /api/v1/becarios/:id/remover-plaza
      const response = await fetch(`${API_BASE}/v1/becarios/${becarioId}/remover-plaza`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al desasignar becario de la plaza');
      }

      toast({ title: 'Éxito', description: 'Becario desasignado exitosamente de la plaza' });

      // Recargar los detalles de la plaza actual si está abierta
      if (selectedPlaza && selectedPlaza.id === plazaId) {
        await loadPlazaDetails(plazaId);
      }

      await loadPlazas();
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'No se pudo desasignar el becario', variant: 'destructive' });
    }
  };

  const loadPlazaDetails = async (plazaId: string) => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) {
      toast({ title: 'Sin sesión', description: 'Inicia sesión para cargar detalles', variant: 'destructive' });
      return;
    }

    setLoadingPlazaDetails(true);
    try {
      const res = await fetchPlazaById(accessToken, plazaId);
      const p = res.data;

      const plazaDetallada: Plaza = {
        id: p.id,
        nombre: p.nombre,
        ubicacion: p.ubicacion,
        supervisor: p.supervisor,
        supervisorNombre: p.supervisor ? `${p.supervisor.nombre}${p.supervisor.apellido ? ` ${p.supervisor.apellido}` : ''}` : '-',
        capacidadMaxima: p.capacidad,
        ayudantesActuales: p.ocupadas,
        tipoActividad: p.tipoAyudantia,
        horarios: p.horario.map(h => `${h.dia} ${h.horaInicio}-${h.horaFin}`),
        estado: p.estado as "Activa" | "Inactiva" | "Completa",
        descripcion: p.descripcionActividades,
        requisitos: p.requisitosEspeciales,
        fechaCreacion: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : 'N/A',
        capacidad: p.capacidad,
        ocupadas: p.ocupadas,
        horario: p.horario,
        tipoAyudantia: p.tipoAyudantia,
        descripcionActividades: p.descripcionActividades,
        requisitosEspeciales: p.requisitosEspeciales,
        horasSemana: p.horasSemana,
        periodoAcademico: p.periodoAcademico,
        supervisorResponsable: p.supervisorResponsable,
        observaciones: p.observaciones,
        estudiantesAsignados: p.estudiantesAsignados || []
      };

      setSelectedPlaza(plazaDetallada);
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'No se pudieron cargar los detalles de la plaza', variant: 'destructive' });
    } finally {
      setLoadingPlazaDetails(false);
    }
  };

  const handleOpenPlazaDetails = (plaza: Plaza) => {
    setSelectedPlaza(plaza);
    setIsPlazaDetailOpen(true);
    loadPlazaDetails(plaza.id);
  };

  // Función para parsear horarios y verificar compatibilidad
  // Nota: Esta es una verificación básica del lado del cliente
  // El backend hace la validación real con la disponibilidad del estudiante
  const parseTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const checkScheduleOverlap = (plazaHorario: Array<{dia: string, horaInicio: string, horaFin: string}>, becarioDisponibilidad: any): boolean => {
    // Esta es una verificación simplificada
    // El backend tiene la lógica completa de validación
    return true; // Temporalmente aceptamos todos, el backend validará
  };

  // Función para asignar supervisor a plaza
  const handleAssignSupervisorToPlaza = async () => {
    if (!selectedPlaza || !selectedSupervisorId) {
      toast({ title: 'Error', description: 'Selecciona un supervisor', variant: 'destructive' });
      return;
    }

    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) {
      toast({ title: 'Sin sesión', description: 'Inicia sesión para asignar supervisor', variant: 'destructive' });
      return;
    }

    setIsAssigningSupervisor(true);
    try {
      await assignSupervisorToPlaza(accessToken, selectedPlaza.id, {
        supervisorResponsable: selectedSupervisorId
      });

      toast({
        title: 'Supervisor asignado',
        description: 'El supervisor ha sido asignado exitosamente a la plaza',
        className: "bg-green-50 border-green-200"
      });

      // Recargar detalles de la plaza
      await loadPlazaDetails(selectedPlaza.id);
      await loadPlazas();
      setSelectedSupervisorId("");
    } catch (e: any) {
      toast({
        title: 'Error al asignar supervisor',
        description: e?.message || 'No se pudo asignar el supervisor',
        variant: 'destructive'
      });
    } finally {
      setIsAssigningSupervisor(false);
    }
  };

  // Función para eliminar plaza
  const handleDeletePlaza = async () => {
    if (!selectedPlaza) return;

    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) {
      toast({ title: 'Sin sesión', description: 'Inicia sesión para eliminar plaza', variant: 'destructive' });
      return;
    }

    setIsDeletingPlaza(true);
    try {
      const response = await fetch(`${API_BASE}/v1/plazas/${selectedPlaza.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar la plaza');
      }

      toast({
        title: 'Plaza eliminada',
        description: 'La plaza ha sido eliminada exitosamente',
        className: "bg-green-50 border-green-200"
      });

      // Cerrar panel y recargar plazas
      setIsPlazaDetailOpen(false);
      setSelectedPlaza(null);
      await loadPlazas();
    } catch (e: any) {
      toast({
        title: 'Error al eliminar plaza',
        description: e?.message || 'No se pudo eliminar la plaza',
        variant: 'destructive'
      });
    } finally {
      setIsDeletingPlaza(false);
    }
  };

  // Función para cargar postulaciones
  const loadPostulaciones = async () => {
    const accessToken = tokens?.accessToken;
    if (!accessToken) return;

    setLoadingPostulaciones(true);
    try {
      const data = await getAllPostulaciones(accessToken, {
        estado: 'Pendiente',
        limit: 100
      });
      const postulacionesData = data?.data?.postulaciones || [];
      setPostulaciones(Array.isArray(postulacionesData) ? postulacionesData : []);
    } catch (error) {
      console.error('Error cargando postulaciones:', error);
      setPostulaciones([]);
    } finally {
      setLoadingPostulaciones(false);
    }
  };

  useEffect(() => {
    if (tokens?.accessToken) {
      loadPlazas();
      loadSupervisores();
      loadPostulaciones();
    }
  }, [tokens?.accessToken, filterEstado, searchTerm]);

  // Ya no necesitamos verificar disponibilidad - el endpoint ya trae becarios compatibles


  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Activa":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Activa</Badge>;
      case "Completa":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Completa</Badge>;
      case "Inactiva":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactiva</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getDisponibilidadBadge = (actuales: number, maxima: number) => {
    const porcentaje = (actuales / maxima) * 100;
    if (porcentaje === 100) {
      return <Badge className="bg-red-100 text-red-800 border-red-200">Completa</Badge>;
    } else if (porcentaje >= 75) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Casi Llena</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Disponible</Badge>;
    }
  };

  const filteredPlazas = plazas.filter(plaza => {
    const matchesSearch = plaza.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plaza.supervisorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plaza.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEstado = filterEstado === "todos" || plaza.estado === filterEstado;

    return matchesSearch && matchesEstado;
  });

  const estadisticas = {
    total: plazas.length,
    activas: plazas.filter(p => p.estado === "Activa").length,
    completas: plazas.filter(p => p.estado === "Completa").length,
    totalAyudantes: plazas.reduce((sum, p) => sum + p.ayudantesActuales, 0),
    capacidadTotal: plazas.reduce((sum, p) => sum + p.capacidadMaxima, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header con título y botón */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary">Gestión de Plazas</h2>
          <p className="text-muted-foreground">Administración de plazas de trabajo para ayudantías</p>
        </div>
        <Dialog open={isCreating || isEditing} onOpenChange={(open) => {
          if (!open) {
            if (isEditing) {
              handleCancelEdit();
            } else {
              setIsCreating(false);
            }
          } else if (!isEditing) {
            setIsCreating(true);
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 whitespace-nowrap">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Plaza
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Editar Plaza' : 'Crear Nueva Plaza'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">

              <div>
                <Label htmlFor="nombre">Nombre de la Plaza *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder='Ejemplo: "Ayudantía de Laboratorio de Física - Grupo A"'
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Ingresa un nombre descriptivo (3-200 caracteres) que identifique claramente esta plaza.
                </p>
              </div>

              <div>
                <Label htmlFor="ubicacion">Ubicación *</Label>
                <Input
                  id="ubicacion"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                  placeholder="Ej: Edificio A, Piso 3, Oficina 301"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="capacidad">Capacidad *</Label>
                  <Input 
                    id="capacidad" 
                    type="number" 
                    value={formData.capacidad}
                    onChange={(e) => setFormData({...formData, capacidad: parseInt(e.target.value) || 1})}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="horasSemana">Horas/Semana *</Label>
                  <Input 
                    id="horasSemana" 
                    type="number" 
                    value={formData.horasSemana}
                    onChange={(e) => setFormData({...formData, horasSemana: parseInt(e.target.value) || 10})}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="tipoAyudantia">Tipo de Ayudantía *</Label>
                  <Select value={formData.tipoAyudantia} onValueChange={(value) => setFormData({...formData, tipoAyudantia: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academica">Académica</SelectItem>
                      <SelectItem value="investigacion">Investigación</SelectItem>
                      <SelectItem value="administrativa">Administrativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="supervisorResponsable">Supervisor Responsable *</Label>
                  {supervisores.length === 0 && !loadingSupervisores && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={loadSupervisores}
                    >
                      Recargar
                    </Button>
                  )}
                </div>
                <Select 
                  value={formData.supervisorResponsable} 
                  onValueChange={(value) => setFormData({...formData, supervisorResponsable: value})}
                  disabled={loadingSupervisores || supervisores.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      loadingSupervisores 
                        ? "Cargando supervisores..." 
                        : supervisores.length === 0 
                          ? "No hay supervisores disponibles" 
                          : "Seleccionar supervisor"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {supervisores && supervisores.length > 0 ? supervisores.map((supervisor) => (
                      <SelectItem key={supervisor.id} value={supervisor.id}>
                        {supervisor.nombre} {supervisor.apellido || ''} ({supervisor.email})
                      </SelectItem>
                    )) : null}
                  </SelectContent>
                </Select>
                {supervisores.length === 0 && !loadingSupervisores && (
                  <p className="text-sm text-muted-foreground mt-1">
                    No se encontraron supervisores. Haz clic en "Recargar" para intentar nuevamente.
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="descripcionActividades">Descripción de Actividades *</Label>
                <Textarea 
                  id="descripcionActividades" 
                  value={formData.descripcionActividades}
                  onChange={(e) => setFormData({...formData, descripcionActividades: e.target.value})}
                  placeholder="Apoyo en clases de cálculo, preparación de material didáctico..." 
                />
              </div>
              
              <div>
                <Label>Requisitos Especiales</Label>
                {formData.requisitosEspeciales.map((req, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input 
                      value={req}
                      onChange={(e) => {
                        const newReqs = [...formData.requisitosEspeciales];
                        newReqs[index] = e.target.value;
                        setFormData({...formData, requisitosEspeciales: newReqs});
                      }}
                      placeholder={`Requisito ${index + 1}`}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const newReqs = formData.requisitosEspeciales.filter((_, i) => i !== index);
                        setFormData({...formData, requisitosEspeciales: newReqs});
                      }}
                    >
                      -
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setFormData({...formData, requisitosEspeciales: [...formData.requisitosEspeciales, ""]})}
                >
                  + Agregar Requisito
                </Button>
              </div>
              
              <div>
                <Label>Horarios de Trabajo</Label>
                {formData.horario.map((horario, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                    <Select 
                      value={horario.dia} 
                      onValueChange={(value) => {
                        const newHorarios = [...formData.horario];
                        newHorarios[index] = { ...newHorarios[index], dia: value };
                        setFormData({...formData, horario: newHorarios});
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Día" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lunes">Lunes</SelectItem>
                        <SelectItem value="Martes">Martes</SelectItem>
                        <SelectItem value="Miércoles">Miércoles</SelectItem>
                        <SelectItem value="Jueves">Jueves</SelectItem>
                        <SelectItem value="Viernes">Viernes</SelectItem>
                        <SelectItem value="Sábado">Sábado</SelectItem>
                        <SelectItem value="Domingo">Domingo</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      type="time"
                      value={horario.horaInicio}
                      onChange={(e) => {
                        const newHorarios = [...formData.horario];
                        newHorarios[index] = { ...newHorarios[index], horaInicio: e.target.value };
                        setFormData({...formData, horario: newHorarios});
                      }}
                    />
                    <Input 
                      type="time"
                      value={horario.horaFin}
                      onChange={(e) => {
                        const newHorarios = [...formData.horario];
                        newHorarios[index] = { ...newHorarios[index], horaFin: e.target.value };
                        setFormData({...formData, horario: newHorarios});
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        const newHorarios = formData.horario.filter((_, i) => i !== index);
                        setFormData({...formData, horario: newHorarios});
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setFormData({...formData, horario: [...formData.horario, { dia: "Lunes", horaInicio: "08:00", horaFin: "12:00" }]})}
                >
                  + Agregar Horario
                </Button>
              </div>
              
              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea 
                  id="observaciones" 
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  placeholder="Plaza prioritaria para el período..." 
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={isEditing ? handleCancelEdit : () => setIsCreating(false)} 
                  disabled={creating}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={isEditing ? handleUpdatePlaza : handleCreatePlaza} 
                  disabled={creating}
                >
                  {creating 
                    ? (isEditing ? "Actualizando..." : "Creando...") 
                    : (isEditing ? "Actualizar Plaza" : "Crear Plaza")
                  }
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, supervisor o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Activa">Activa</SelectItem>
                <SelectItem value="Completa">Completa</SelectItem>
                <SelectItem value="Inactiva">Inactiva</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{estadisticas.total}</p>
              <p className="text-sm text-muted-foreground">Total Plazas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{estadisticas.activas}</p>
              <p className="text-sm text-muted-foreground">Activas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{estadisticas.completas}</p>
              <p className="text-sm text-muted-foreground">Completas</p>
            </div>
          </CardContent>
        </Card>
        <Card
          className="cursor-pointer hover:shadow-md transition-shadow border-orange-200"
          onClick={() => setShowPostulacionesModal(true)}
        >
          <CardContent className="p-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <p className="text-2xl font-bold text-orange-600">{postulaciones.length}</p>
                {postulaciones.length > 0 && (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Postulaciones Pendientes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid de plazas */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Plazas de Ayudantía ({filteredPlazas.length})</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={loadPlazas}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Recargar
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <RefreshCw className="h-8 w-8 mr-3 animate-spin text-primary" />
            <span className="text-lg">Cargando plazas...</span>
          </div>
        ) : filteredPlazas.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Building className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="text-lg text-muted-foreground">No se encontraron plazas</p>
              <p className="text-sm text-muted-foreground mt-1">Intenta ajustar los filtros de búsqueda</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlazas.map((plaza) => {
              const postulacionesPlaza = postulaciones.filter(p => p.plazaId === plaza.id && p.estado === 'Pendiente');
              const tienePostulaciones = postulacionesPlaza.length > 0;

              return (
              <Card
                key={plaza.id}
                className="hover:shadow-lg transition-shadow cursor-pointer border-l-4"
                style={{
                  borderLeftColor: plaza.estado === "Activa" ? "#22c55e" : plaza.estado === "Completa" ? "#3b82f6" : "#9ca3af"
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{plaza.nombre}</CardTitle>
                        {tienePostulaciones && (
                          <Badge
                            variant="outline"
                            className="bg-orange-50 text-orange-700 border-orange-300 text-xs px-2 py-0.5"
                          >
                            {postulacionesPlaza.length} {postulacionesPlaza.length === 1 ? 'postulación' : 'postulaciones'}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center text-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        {plaza.ubicacion}
                      </CardDescription>
                    </div>
                    {getEstadoBadge(plaza.estado)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Info básica */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Supervisor:</span>
                      <span className="font-medium text-xs">{plaza.supervisorNombre}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <Badge variant="outline" className="text-xs">{plaza.tipoActividad}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Periodo:</span>
                      <span className="font-medium text-xs">{plaza.periodoAcademico || 'N/A'}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Capacidad visual */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Capacidad</span>
                      <span className="text-sm font-semibold">
                        {plaza.ayudantesActuales}/{plaza.capacidadMaxima}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          (plaza.ayudantesActuales / plaza.capacidadMaxima) * 100 === 100
                            ? "bg-red-500"
                            : (plaza.ayudantesActuales / plaza.capacidadMaxima) * 100 >= 75
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${(plaza.ayudantesActuales / plaza.capacidadMaxima) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Horarios compactos */}
                  <div>
                    <div className="flex items-center text-sm text-muted-foreground mb-1">
                      <Clock className="h-3 w-3 mr-1" />
                      Horarios ({plaza.horarios.length})
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {plaza.horarios.slice(0, 2).map((horario, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {horario.split(' ')[0]}
                        </Badge>
                      ))}
                      {plaza.horarios.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{plaza.horarios.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenPlazaDetails(plaza)}
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Ver Detalles
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditPlaza(plaza)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Panel lateral de detalles de plaza */}
      <Sheet open={isPlazaDetailOpen} onOpenChange={setIsPlazaDetailOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl">{selectedPlaza?.nombre || 'Detalles de Plaza'}</SheetTitle>
            <SheetDescription>
              {selectedPlaza?.ubicacion}
            </SheetDescription>
          </SheetHeader>

          {loadingPlazaDetails ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mr-3" />
              <span>Cargando detalles...</span>
            </div>
          ) : selectedPlaza ? (
            <ScrollArea className="h-[calc(100vh-120px)] pr-4">
              <div className="space-y-6 mt-6">
                {/* Información General */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Información General</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Estado</p>
                        <div className="mt-1">{getEstadoBadge(selectedPlaza.estado)}</div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tipo</p>
                        <p className="font-medium mt-1">{selectedPlaza.tipoActividad}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Capacidad</p>
                        <p className="font-medium mt-1">{selectedPlaza.ayudantesActuales}/{selectedPlaza.capacidadMaxima}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Horas/Semana</p>
                        <p className="font-medium mt-1">{selectedPlaza.horasSemana || 'N/A'}</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-2">Supervisor Asignado</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">{selectedPlaza.supervisorNombre}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditMode(true)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Cambiar
                        </Button>
                      </div>

                      {editMode && (
                        <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
                          <Label>Seleccionar nuevo supervisor</Label>
                          <Select value={selectedSupervisorId} onValueChange={setSelectedSupervisorId}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un supervisor" />
                            </SelectTrigger>
                            <SelectContent>
                              {supervisores.map((sup) => (
                                <SelectItem key={sup.id} value={sup.id}>
                                  {sup.nombre} {sup.apellido || ''} ({sup.email})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleAssignSupervisorToPlaza}
                              disabled={!selectedSupervisorId || isAssigningSupervisor}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              {isAssigningSupervisor ? (
                                <>
                                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                  Asignando...
                                </>
                              ) : (
                                <>
                                  <Save className="h-4 w-4 mr-2" />
                                  Guardar
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditMode(false);
                                setSelectedSupervisorId("");
                              }}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Horarios */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Horarios de Trabajo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedPlaza.horarios.map((horario, index) => (
                        <div key={index} className="flex items-center p-2 bg-muted rounded-md">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          <span className="font-medium">{horario}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Descripción y Requisitos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Descripción y Requisitos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Descripción de Actividades</p>
                      <p className="text-sm text-muted-foreground">{selectedPlaza.descripcion}</p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-2">Requisitos Especiales</p>
                      <ul className="space-y-1">
                        {selectedPlaza.requisitos.map((requisito, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{requisito}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Estudiantes Asignados */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Estudiantes Asignados ({selectedPlaza.estudiantesAsignados?.length || 0})
                      </CardTitle>
                      <Button
                        size="sm"
                        onClick={() => {
                          handleOpenAssignBecario(selectedPlaza);
                        }}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Asignar
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedPlaza.estudiantesAsignados && selectedPlaza.estudiantesAsignados.length > 0 ? (
                      <div className="space-y-3">
                        {selectedPlaza.estudiantesAsignados.map((estudiante) => (
                          <Card key={estudiante.id} className="border-l-4 border-l-blue-500">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-medium">{estudiante.usuario.nombre} {estudiante.usuario.apellido}</p>
                                  <p className="text-sm text-muted-foreground">{estudiante.usuario.carrera} • Trimestre {estudiante.usuario.trimestre}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{estudiante.usuario.email}</p>

                                  <div className="mt-3">
                                    <div className="flex items-center justify-between text-sm mb-1">
                                      <span className="text-muted-foreground">Progreso de Horas</span>
                                      <span className="font-medium">{estudiante.horasCompletadas}/{estudiante.horasRequeridas} hrs</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-blue-600 h-2 rounded-full transition-all"
                                        style={{
                                          width: `${estudiante.horasRequeridas > 0 ? (estudiante.horasCompletadas / estudiante.horasRequeridas) * 100 : 0}%`
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUnassignBecario(selectedPlaza.id, estudiante.id)}
                                  className="ml-2"
                                >
                                  <X className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No hay estudiantes asignados</p>
                        <p className="text-xs mt-1">Haz clic en "Asignar" para agregar estudiantes</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Eliminar Plaza */}
                <Card className="border-red-200 bg-red-50/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-700">Zona de Peligro</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-800">Eliminar Plaza</p>
                        <p className="text-xs text-muted-foreground">Esta acción no se puede deshacer</p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará permanentemente la plaza "{selectedPlaza?.nombre}".
                              {selectedPlaza?.estudiantesAsignados && selectedPlaza.estudiantesAsignados.length > 0 && (
                                <span className="block mt-2 text-red-600 font-medium">
                                  ⚠️ Advertencia: Esta plaza tiene {selectedPlaza.estudiantesAsignados.length} estudiante(s) asignado(s).
                                </span>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeletePlaza}
                              disabled={isDeletingPlaza}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {isDeletingPlaza ? (
                                <>
                                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                  Eliminando...
                                </>
                              ) : (
                                'Sí, eliminar plaza'
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          ) : null}
        </SheetContent>
      </Sheet>

      {/* Modal para asignar becario - Mejorado */}
      <Dialog open={isAssigningBecario} onOpenChange={setIsAssigningBecario}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-xl">Asignar Estudiante a Plaza</DialogTitle>
            {plazaToAssign && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{plazaToAssign.nombre}</Badge>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{plazaToAssign.departamento}</span>
              </div>
            )}
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-180px)]">
            <div className="space-y-4 pr-4">
              {plazaToAssign && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium mb-2">Horarios de la Plaza:</p>
                    <div className="flex flex-wrap gap-2">
                      {plazaToAssign.horarios.map((horario, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {horario}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {loadingBecarios || verificandoDisponibilidad ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary mr-3" />
                  <span>
                    {loadingBecarios ? 'Cargando estudiantes...' : 'Verificando disponibilidad de horarios...'}
                  </span>
                </div>
              ) : becarios.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <AlertCircle className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <p className="text-lg text-muted-foreground">No hay becarios disponibles</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Todos los becarios activos ya tienen plaza asignada o no están disponibles
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Estudiantes compatibles con los horarios de la plaza:</p>
                    <Badge variant="outline" className="text-xs">
                      {becarios.length} encontrado{becarios.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="grid gap-3">
                    {becarios.map((becario) => {
                      // Todos los becarios del endpoint ya son compatibles
                      return (
                        <Card
                          key={becario.id}
                          className={`transition-all cursor-pointer ${
                            selectedBecarioId === becario.id
                              ? 'border-primary border-2 shadow-md'
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedBecarioId(becario.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium">
                                    {becario.usuario.nombre} {becario.usuario.apellido}
                                  </p>
                                  {selectedBecarioId === becario.id && (
                                    <Badge className="bg-primary">
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Seleccionado
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                  <span>{becario.usuario.carrera || 'Sin carrera'}</span>
                                  <span>•</span>
                                  <span>Trimestre {becario.usuario.trimestre || 'N/A'}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{becario.usuario.email}</p>

                                {/* Indicador de compatibilidad con información del endpoint */}
                                <div className="mt-3 space-y-2">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge variant="outline" className="text-xs">
                                      {becario.tipoBeca || becario.programaBeca || 'Ayudantía'}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      {becario.porcentajeCobertura || 100}% Compatible
                                    </Badge>
                                  </div>

                                  {/* Mostrar información de bloques matcheados */}
                                  {becario.bloquesMatcheados !== undefined && becario.totalBloques !== undefined && (
                                    <div className="text-xs text-muted-foreground">
                                      <span className="font-medium">{becario.bloquesMatcheados}</span> de <span className="font-medium">{becario.totalBloques}</span> bloques de tiempo coinciden
                                    </div>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className={`h-5 w-5 transition-transform ${
                                selectedBecarioId === becario.id ? 'rotate-90' : ''
                              }`} />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {selectedBecarioId && becarios.find(b => b.id === selectedBecarioId)
                ? `Asignando a: ${becarios.find(b => b.id === selectedBecarioId)?.usuario.nombre} ${becarios.find(b => b.id === selectedBecarioId)?.usuario.apellido}`
                : 'Selecciona un estudiante para continuar'}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAssigningBecario(false);
                  setSelectedBecarioId("");
                }}
                disabled={assigningBecario}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAssignBecario}
                disabled={assigningBecario || !selectedBecarioId}
                className="bg-primary hover:bg-primary/90"
              >
                {assigningBecario ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Asignando...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Asignar Estudiante
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sheet para ver postulaciones */}
      <Sheet open={showPostulacionesModal} onOpenChange={setShowPostulacionesModal}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Postulaciones Pendientes ({postulaciones.length})</SheetTitle>
            <SheetDescription>
              Revisa y gestiona las postulaciones de estudiantes a plazas de ayudantía
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {loadingPostulaciones ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : postulaciones.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No hay postulaciones pendientes</p>
              </div>
            ) : (
              postulaciones.map((postulacion) => (
                <Card key={postulacion.id} className="border-orange/20">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Estudiante */}
                      <div>
                        <p className="text-sm text-muted-foreground">Estudiante</p>
                        <p className="font-semibold">
                          {postulacion.estudianteBecario?.usuario?.nombre} {postulacion.estudianteBecario?.usuario?.apellido}
                        </p>
                        <p className="text-sm text-muted-foreground">{postulacion.estudianteBecario?.usuario?.email}</p>
                      </div>

                      {/* Plaza */}
                      <div>
                        <p className="text-sm text-muted-foreground">Plaza</p>
                        <p className="font-semibold">{postulacion.plaza?.nombre}</p>
                        <p className="text-sm text-muted-foreground">{postulacion.plaza?.ubicacion}</p>
                      </div>

                      {/* Compatibilidad */}
                      {postulacion.compatibilidadHoraria && (
                        <div>
                          <p className="text-sm text-muted-foreground">Compatibilidad Horaria</p>
                          <p className="text-lg font-bold text-green-600">{postulacion.compatibilidadHoraria.porcentaje}%</p>
                        </div>
                      )}

                      {/* Fecha */}
                      <div>
                        <p className="text-sm text-muted-foreground">Fecha de postulación</p>
                        <p className="text-sm">{new Date(postulacion.fechaPostulacion).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>

                      {/* Botones */}
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={async () => {
                            try {
                              await aprobarPostulacion(tokens?.accessToken!, postulacion.id);
                              toast({
                                title: 'Postulación aprobada',
                                description: 'El becario ha sido asignado a la plaza exitosamente'
                              });
                              await Promise.all([loadPostulaciones(), loadPlazas()]);
                            } catch (error: any) {
                              toast({
                                title: 'Error',
                                description: error.message || 'No se pudo aprobar la postulación',
                                variant: 'destructive'
                              });
                            }
                          }}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Aprobar
                        </Button>
                        <Button
                          onClick={() => setSelectedPostulacion(postulacion)}
                          variant="outline"
                          className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Rechazar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Dialog para rechazar postulación */}
      <Dialog open={!!selectedPostulacion} onOpenChange={(open) => !open && setSelectedPostulacion(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Postulación</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="motivoRechazo">Motivo del rechazo *</Label>
              <Textarea
                id="motivoRechazo"
                placeholder="Ingrese el motivo del rechazo..."
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedPostulacion(null)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={async () => {
                  const motivo = (document.getElementById('motivoRechazo') as HTMLTextAreaElement)?.value;
                  if (!motivo?.trim()) {
                    toast({
                      title: 'Error',
                      description: 'Debes ingresar un motivo para el rechazo',
                      variant: 'destructive'
                    });
                    return;
                  }

                  try {
                    await rechazarPostulacion(tokens?.accessToken!, selectedPostulacion.id, motivo);
                    toast({
                      title: 'Postulación rechazada',
                      description: 'La postulación ha sido rechazada exitosamente'
                    });
                    setSelectedPostulacion(null);
                    await loadPostulaciones();
                  } catch (error: any) {
                    toast({
                      title: 'Error',
                      description: error.message || 'No se pudo rechazar la postulación',
                      variant: 'destructive'
                    });
                  }
                }}
                variant="destructive"
                className="flex-1"
              >
                Rechazar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestionPlazas;