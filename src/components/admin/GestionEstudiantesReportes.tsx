import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Eye, CheckCircle, XCircle, Clock, AlertCircle, FileText, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Reporte {
  id: string;
  semana: number;
  periodoAcademico: string;
  fecha: string;
  horasTrabajadas: number;
  descripcionActividades: string;
  estado: string;
  objetivosPeriodo: string;
  metasEspecificas: string;
  actividadesProgramadas: string;
  actividadesRealizadas: string;
  observaciones: string;
  fechaPostulacion: string;
  evaluadoPor: string;
  motivoRechazo: string;
  estudiante: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    cedula: string;
    tipoBeca?: string;
    descuentoAplicado?: string;
  };
  supervisor: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
  };
  plaza: {
    id: string;
    materia: string;
    codigo: string;
    departamento: string;
    supervisorResponsable: string;
  };
}

const GestionEstudiantesReportes = () => {
  const { toast } = useToast();
  const { tokens } = useAuth();
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReporte, setSelectedReporte] = useState<Reporte | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filtros, setFiltros] = useState({
    periodoAcademico: '2025-1',
    estado: '',
    supervisorId: '',
    estudianteId: ''
  });

  // Estados para crear nuevo usuario
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "Student123!",
    cedula: "",
    telefono: "+58 212 1234567",
    role: "estudiante",
    carrera: "",
    trimestre: ""
  });
  const [cedulaData, setCedulaData] = useState({
    tipo: "V",
    numero: ""
  });

  // Función para cargar todos los reportes
  const loadReportes = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) return;

    setLoading(true);
    try {
      console.log('📊 [REPORTES] Cargando todos los reportes usando endpoint global');
      
      // Usar el endpoint global para obtener todos los reportes con filtros
      const url = new URL(`${API_BASE}/v1/reportes/all`);
      url.searchParams.append('limit', '100');
      url.searchParams.append('offset', '0');
      
      // Aplicar filtros
      if (filtros.periodoAcademico) {
        url.searchParams.append('periodoAcademico', filtros.periodoAcademico);
      }
      if (filtros.estado) {
        url.searchParams.append('estado', filtros.estado);
      }
      if (filtros.supervisorId) {
        url.searchParams.append('supervisorId', filtros.supervisorId);
      }
      if (filtros.estudianteId) {
        url.searchParams.append('estudianteId', filtros.estudianteId);
      }
      
      const reportesResp = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' }
      });
      
      console.log('📊 [REPORTES] Respuesta del servidor:', reportesResp.status, reportesResp.statusText);
      console.log('📊 [REPORTES] URL utilizada:', url.toString());
      
      if (!reportesResp.ok) {
        const errorData = await reportesResp.json().catch(() => null);
        console.error('❌ [REPORTES] Error del servidor:', errorData);
        
        // Si el endpoint no existe, usar datos mock para probar la interfaz
        console.log('📊 [MOCK] Usando datos mock para probar la interfaz');
        const mockReportes = [
          {
            id: 'mock-1',
            semana: 1,
            periodoAcademico: '2025-1',
            fecha: '2025-01-15',
            horasTrabajadas: 8,
            descripcionActividades: 'Clases de apoyo en cálculo diferencial',
            estado: 'Aprobada',
            objetivosPeriodo: 'Apoyar en las clases de matemáticas',
            metasEspecificas: 'Atender 20 estudiantes por semana',
            actividadesProgramadas: 'Clases lunes y miércoles',
            actividadesRealizadas: 'Se realizaron las clases programadas',
            observaciones: 'Los estudiantes mostraron buen progreso',
            fechaPostulacion: '2025-01-15',
            evaluadoPor: 'Dr. García',
            motivoRechazo: '',
            estudiante: {
              id: 'est-1',
              nombre: 'Ana María',
              apellido: 'Rodríguez',
              email: 'ana.rodriguez@unimet.edu.ve',
              cedula: 'V-12345678'
            },
            supervisor: {
              id: 'sup-1',
              nombre: 'Dr. Carlos',
              apellido: 'García',
              email: 'carlos.garcia@unimet.edu.ve'
            },
            plaza: {
              id: 'plaza-1',
              materia: 'Cálculo Diferencial',
              codigo: 'MAT-101',
              departamento: 'Matemáticas',
              supervisorResponsable: 'Dr. Carlos García'
            }
          },
          {
            id: 'mock-2',
            semana: 2,
            periodoAcademico: '2025-1',
            fecha: '2025-01-22',
            horasTrabajadas: 6,
            descripcionActividades: 'Preparación de material didáctico',
            estado: 'Pendiente',
            objetivosPeriodo: 'Desarrollar material de apoyo',
            metasEspecificas: 'Crear 5 ejercicios por tema',
            actividadesProgramadas: 'Diseño de ejercicios',
            actividadesRealizadas: 'Se completaron 3 ejercicios',
            observaciones: 'Material en desarrollo',
            fechaPostulacion: '2025-01-22',
            evaluadoPor: '',
            motivoRechazo: '',
            estudiante: {
              id: 'est-2',
              nombre: 'Luis',
              apellido: 'Pérez',
              email: 'luis.perez@unimet.edu.ve',
              cedula: 'V-87654321'
            },
            supervisor: {
              id: 'sup-2',
              nombre: 'Dra. María',
              apellido: 'López',
              email: 'maria.lopez@unimet.edu.ve'
            },
            plaza: {
              id: 'plaza-2',
              materia: 'Física I',
              codigo: 'FIS-101',
              departamento: 'Física',
              supervisorResponsable: 'Dra. María López'
            }
          },
          {
            id: 'mock-3',
            semana: 3,
            periodoAcademico: '2025-1',
            fecha: '2025-01-29',
            horasTrabajadas: 4,
            descripcionActividades: 'Tutorías individuales',
            estado: 'Rechazada',
            objetivosPeriodo: 'Brindar apoyo personalizado',
            metasEspecificas: 'Atender 10 estudiantes',
            actividadesProgramadas: 'Tutorías martes y jueves',
            actividadesRealizadas: 'Solo se atendieron 5 estudiantes',
            observaciones: 'Falta de asistencia de estudiantes',
            fechaPostulacion: '2025-01-29',
            evaluadoPor: 'Dr. García',
            motivoRechazo: 'No se cumplió con las horas mínimas requeridas',
            estudiante: {
              id: 'est-3',
              nombre: 'Carlos',
              apellido: 'Martínez',
              email: 'carlos.martinez@unimet.edu.ve',
              cedula: 'V-11223344'
            },
            supervisor: {
              id: 'sup-3',
              nombre: 'Dr. Roberto',
              apellido: 'Silva',
              email: 'roberto.silva@unimet.edu.ve'
            },
            plaza: {
              id: 'plaza-3',
              materia: 'Química General',
              codigo: 'QUI-101',
              departamento: 'Química',
              supervisorResponsable: 'Dr. Roberto Silva'
            }
          }
        ];
        
        setReportes(mockReportes);
        toast({
          title: 'Datos de Prueba',
          description: 'Se están mostrando datos mock para probar la interfaz',
          variant: 'default'
        });
        return;
      }
      
      const data = await reportesResp.json();
      console.log('📊 [REPORTES] Datos recibidos completos:', JSON.stringify(data, null, 2));
      
      // Manejar diferentes estructuras de respuesta
      let reportesData = [];
      if (data?.data?.reportes) {
        reportesData = data.data.reportes;
        console.log('📊 [REPORTES] Usando data.data.reportes, cantidad:', reportesData.length);
      } else if (data?.data && Array.isArray(data.data)) {
        reportesData = data.data;
        console.log('📊 [REPORTES] Usando data.data como array, cantidad:', reportesData.length);
      } else if (data?.reportes) {
        reportesData = data.reportes;
        console.log('📊 [REPORTES] Usando data.reportes, cantidad:', reportesData.length);
      } else if (Array.isArray(data)) {
        reportesData = data;
        console.log('📊 [REPORTES] Usando data como array directo, cantidad:', reportesData.length);
      } else {
        console.log('📊 [REPORTES] Estructura de respuesta no reconocida:', Object.keys(data));
        reportesData = [];
      }
      
      console.log('📊 [REPORTES] Reportes encontrados:', reportesData.length);
      
      // Mapear los reportes al formato esperado con validaciones robustas
      const reportesMapeados = reportesData.map((reporte: any, index: number) => {
        // Validar que reporte existe
        if (!reporte || typeof reporte !== 'object') {
          console.warn(`📊 [REPORTES] Reporte inválido en índice ${index}:`, reporte);
          return null;
        }

        return {
          id: reporte.id || `temp-${index}`,
          semana: reporte.semana || 1,
          periodoAcademico: reporte.periodoAcademico || 'N/A',
          fecha: reporte.fecha || reporte.createdAt || new Date().toISOString(),
          horasTrabajadas: reporte.horasTrabajadas || 0,
          descripcionActividades: reporte.descripcionActividades || reporte.actividadesRealizadas || '',
          estado: reporte.estado || 'Pendiente',
          objetivosPeriodo: reporte.objetivosPeriodo || '',
          metasEspecificas: reporte.metasEspecificas || '',
          actividadesProgramadas: reporte.actividadesProgramadas || '',
          actividadesRealizadas: reporte.actividadesRealizadas || '',
          observaciones: reporte.observaciones || '',
          fechaPostulacion: reporte.fechaPostulacion || reporte.createdAt || new Date().toISOString(),
          evaluadoPor: reporte.evaluadoPor || '',
          motivoRechazo: reporte.motivoRechazo || '',
          estudiante: {
            id: reporte.estudiante?.id || reporte.usuarioId || 'N/A',
            nombre: reporte.estudiante?.nombre || reporte.usuario?.nombre || 'N/A',
            apellido: reporte.estudiante?.apellido || reporte.usuario?.apellido || 'N/A',
            email: reporte.estudiante?.email || reporte.usuario?.email || 'N/A',
            cedula: reporte.estudiante?.cedula || reporte.usuario?.cedula || 'N/A',
            tipoBeca: reporte.estudiante?.tipoBeca || reporte.becario?.tipoBeca,
            descuentoAplicado: reporte.estudiante?.descuentoAplicado || reporte.becario?.descuentoAplicado
          },
          supervisor: {
            id: reporte.supervisor?.id || reporte.supervisorId || 'N/A',
            nombre: reporte.supervisor?.nombre || 'N/A',
            apellido: reporte.supervisor?.apellido || 'N/A',
            email: reporte.supervisor?.email || 'N/A'
          },
          plaza: {
            id: reporte.plaza?.id || reporte.plazaId || 'N/A',
            nombre: reporte.plaza?.nombre || 'N/A',
            ubicacion: reporte.plaza?.ubicacion || 'N/A',
            supervisorResponsable: reporte.plaza?.supervisorResponsable || 'N/A'
          }
        };
      }).filter(reporte => reporte !== null); // Filtrar reportes nulos
      
      console.log('📊 [REPORTES] Reportes mapeados:', reportesMapeados);
      setReportes(reportesMapeados);
      
      if (reportesMapeados.length === 0) {
        toast({
          title: 'Sin reportes',
          description: 'No se encontraron reportes de actividades',
          variant: 'default'
        });
      } else {
        toast({
          title: 'Reportes cargados',
          description: `Se cargaron ${reportesMapeados.length} reportes exitosamente`,
          variant: 'default'
        });
      }
      
    } catch (error) {
      console.error('❌ [REPORTES] Error general:', error);
      toast({
        title: 'Error',
        description: `No se pudieron cargar los reportes: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportes();
  }, []);

  // Funciones para manejar el formulario de creación
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCedulaChange = (tipo: string, numero: string) => {
    setCedulaData({ tipo, numero });
    const cedulaCompleta = numero ? `${tipo}-${numero}` : "";
    setFormData(prev => ({ ...prev, cedula: cedulaCompleta }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    setCreatingUser(true);
    try {
      console.log('=== CREAR USUARIO ===');
      console.log('Datos del formulario:', formData);

      // Preparar el payload para el registro
      const payload: any = {
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        cedula: formData.cedula,
        telefono: formData.telefono,
        role: formData.role
      };

      // Agregar campos opcionales si el rol es estudiante
      if (formData.role === 'estudiante') {
        if (formData.carrera) payload.carrera = formData.carrera;
        if (formData.trimestre) payload.trimestre = parseInt(formData.trimestre);
      }

      console.log('Payload enviado:', payload);

      const response = await fetch(`${API_BASE}/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error creando usuario:', errorData);
        throw new Error(errorData?.message || `Error al crear usuario (${response.status})`);
      }

      const result = await response.json();
      console.log('Usuario creado exitosamente:', result);

      toast({
        title: "Usuario creado exitosamente",
        description: `El ${formData.role} ha sido registrado. Un administrador debe aprobar la cuenta antes de que pueda iniciar sesión.`,
      });

      // Cerrar modal y limpiar formulario
      setIsCreateModalOpen(false);
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        password: "Student123!",
        cedula: "",
        telefono: "+58 212 1234567",
        role: "estudiante",
        carrera: "",
        trimestre: ""
      });
      setCedulaData({
        tipo: "V",
        numero: ""
      });

      // Recargar reportes por si el usuario recién creado tiene reportes
      loadReportes();

    } catch (err: any) {
      console.error('Error creating user:', err);
      toast({
        title: "Error",
        description: err.message || "No se pudo crear el usuario",
        variant: "destructive"
      });
    } finally {
      setCreatingUser(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Aprobada':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Aprobada</Badge>;
      case 'Pendiente':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case 'Rechazada':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rechazada</Badge>;
      case 'En Revisión':
        return <Badge className="bg-blue-100 text-blue-800"><AlertCircle className="h-3 w-3 mr-1" />En Revisión</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800"><AlertCircle className="h-3 w-3 mr-1" />{estado || 'Sin estado'}</Badge>;
    }
  };

  const getProgresoColor = (horasTrabajadas: number) => {
    if (horasTrabajadas >= 8) return 'text-green-600';
    if (horasTrabajadas >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-VE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Gestión de Estudiantes y Reportes</h2>
          <p className="text-muted-foreground">
            Administración de estudiantes becarios y seguimiento de actividades
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isCreateModalOpen} onOpenChange={(open) => {
            setIsCreateModalOpen(open);
            if (!open) {
              // Limpiar el formulario al cerrar
              setFormData({
                nombre: "",
                apellido: "",
                email: "",
                password: "Student123!",
                cedula: "",
                telefono: "+58 212 1234567",
                role: "estudiante",
                carrera: "",
                trimestre: ""
              });
              setCedulaData({
                tipo: "V",
                numero: ""
              });
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Estudiante
              </Button>
            </DialogTrigger>
          </Dialog>
          <Button
            onClick={() => {
              console.log('📊 [DEBUG] Estado actual:', { reportes: reportes.length, loading, filtros });
              console.log('📊 [DEBUG] Reportes:', reportes);
            }}
            variant="outline"
            size="sm"
          >
            Debug
          </Button>
          <Button
            onClick={async () => {
              const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
              if (!accessToken) return;

              console.log('🧪 [TEST] Probando diferentes endpoints...');

              // Probar endpoint global
              try {
                const resp1 = await fetch(`${API_BASE}/v1/reportes/all?limit=5`, {
                  headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' }
                });
                const data1 = await resp1.json();
                console.log('🧪 [TEST] /v1/reportes/all:', resp1.status, data1);
              } catch (e) {
                console.error('🧪 [TEST] Error en /v1/reportes/all:', e);
              }

              // Probar con usuarios
              try {
                const resp2 = await fetch(`${API_BASE}/v1/users?role=ayudante&limit=3`, {
                  headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' }
                });
                const data2 = await resp2.json();
                console.log('🧪 [TEST] /v1/users?role=ayudante:', resp2.status, data2);
              } catch (e) {
                console.error('🧪 [TEST] Error en /v1/users:', e);
              }
            }}
            variant="outline"
            size="sm"
          >
            Test Endpoints
          </Button>
          <Button
            onClick={loadReportes}
            variant="outline"
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Período Académico</label>
              <select
                value={filtros.periodoAcademico}
                onChange={(e) => setFiltros({...filtros, periodoAcademico: e.target.value})}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="2025-1">2025-1</option>
                <option value="2024-2">2024-2</option>
                <option value="2024-1">2024-1</option>
                <option value="">Todos</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Estado</label>
              <select
                value={filtros.estado}
                onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="">Todos los Estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobada">Aprobada</option>
                <option value="Rechazada">Rechazada</option>
                <option value="En Revisión">En Revisión</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={loadReportes} 
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Aplicar Filtros</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reportes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {reportes.filter(r => r.estado === 'Aprobada').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {reportes.filter(r => r.estado === 'Pendiente').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rechazados</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {reportes.filter(r => r.estado === 'Rechazada').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reportes de Actividades</CardTitle>
              <CardDescription>
                Lista de todos los reportes semanales de estudiantes becarios
              </CardDescription>
            </div>
            <Button 
              onClick={loadReportes} 
              variant="outline" 
              size="sm"
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Recargar</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Cargando reportes...</span>
            </div>
          ) : reportes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No hay reportes disponibles</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>Supervisor</TableHead>
                    <TableHead>Plaza</TableHead>
                    <TableHead>Progreso</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Último Reporte</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportes.map((reporte) => (
                    <TableRow key={reporte.id}>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {reporte.estudiante.nombre} {reporte.estudiante.apellido}
                            </p>
                            {reporte.estudiante.descuentoAplicado && (
                              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                {parseFloat(reporte.estudiante.descuentoAplicado).toFixed(0)}%
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {reporte.estudiante.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {reporte.supervisor.nombre} {reporte.supervisor.apellido}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {reporte.supervisor.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{reporte.plaza.nombre}</p>
                          <p className="text-sm text-muted-foreground">
                            {reporte.plaza.ubicacion}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`font-medium ${getProgresoColor(reporte.horasTrabajadas)}`}>
                          {reporte.horasTrabajadas}h
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Semana {reporte.semana}
                        </p>
                      </TableCell>
                      <TableCell>
                        {getEstadoBadge(reporte.estado)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{formatDate(reporte.fecha)}</p>
                          <p className="text-xs text-muted-foreground">
                            {reporte.periodoAcademico}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedReporte(reporte);
                            setShowModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalles */}
      {showModal && selectedReporte && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Detalles del Reporte</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowModal(false)}
              >
                Cerrar
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estudiante</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {selectedReporte.estudiante.nombre} {selectedReporte.estudiante.apellido}
                    </p>
                    {selectedReporte.estudiante.descuentoAplicado && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        {parseFloat(selectedReporte.estudiante.descuentoAplicado).toFixed(0)}%
                      </Badge>
                    )}
                  </div>
                  {selectedReporte.estudiante.tipoBeca && (
                    <p className="text-sm text-muted-foreground">{selectedReporte.estudiante.tipoBeca}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Supervisor</p>
                  <p className="font-medium">
                    {selectedReporte.supervisor.nombre} {selectedReporte.supervisor.apellido}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Plaza</p>
                  <p className="font-medium">{selectedReporte.plaza.nombre}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Estado</p>
                  <div>{getEstadoBadge(selectedReporte.estado)}</div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Descripción de Actividades</p>
                <p className="text-sm">{selectedReporte.descripcionActividades}</p>
              </div>

              {selectedReporte.objetivosPeriodo && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Objetivos del Período</p>
                  <p className="text-sm">{selectedReporte.objetivosPeriodo}</p>
                </div>
              )}

              {selectedReporte.observaciones && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Observaciones</p>
                  <p className="text-sm">{selectedReporte.observaciones}</p>
                </div>
              )}

              {selectedReporte.motivoRechazo && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground text-red-600">Motivo de Rechazo</p>
                  <p className="text-sm text-red-600">{selectedReporte.motivoRechazo}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para Crear Nuevo Usuario */}
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Estudiante</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                placeholder="Ingrese el nombre"
                required
              />
            </div>

            {/* Apellido */}
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido *</Label>
              <Input
                id="apellido"
                value={formData.apellido}
                onChange={(e) => handleInputChange("apellido", e.target.value)}
                placeholder="Ingrese el apellido"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="estudiante@unimet.edu.ve"
                required
              />
            </div>

            {/* Cédula */}
            <div className="space-y-2">
              <Label htmlFor="cedula">Cédula *</Label>
              <div className="flex gap-2">
                <Select
                  value={cedulaData.tipo}
                  onValueChange={(value) => handleCedulaChange(value, cedulaData.numero)}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="V">V</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="cedula"
                  value={cedulaData.numero}
                  onChange={(e) => handleCedulaChange(cedulaData.tipo, e.target.value)}
                  placeholder="12345678"
                  required
                  className="flex-1"
                />
              </div>
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => handleInputChange("telefono", e.target.value)}
                placeholder="+58 212 1234567"
                required
              />
            </div>

            {/* Rol */}
            <div className="space-y-2">
              <Label htmlFor="role">Rol *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="estudiante">Estudiante</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Carrera - Opcional */}
            <div className="space-y-2">
              <Label htmlFor="carrera">Carrera</Label>
              <Input
                id="carrera"
                value={formData.carrera}
                onChange={(e) => handleInputChange("carrera", e.target.value)}
                placeholder="Ingeniería de Sistemas"
              />
            </div>

            {/* Trimestre - Opcional */}
            <div className="space-y-2">
              <Label htmlFor="trimestre">Trimestre</Label>
              <Input
                id="trimestre"
                type="number"
                min="1"
                max="15"
                value={formData.trimestre}
                onChange={(e) => handleInputChange("trimestre", e.target.value)}
                placeholder="5"
              />
            </div>

            {/* Contraseña - Mostrar solo como información */}
            <div className="space-y-2 col-span-2">
              <Label htmlFor="password">Contraseña Temporal</Label>
              <Input
                id="password"
                type="text"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Student123!"
              />
              <p className="text-xs text-muted-foreground">
                El usuario deberá cambiar esta contraseña en su primer acceso
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              className="flex-1"
              disabled={creatingUser}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary hover:opacity-90"
              disabled={creatingUser}
            >
              {creatingUser ? "Creando..." : "Crear Usuario"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </div>
  );
};

export default GestionEstudiantesReportes;
