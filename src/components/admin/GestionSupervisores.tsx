import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Eye, Edit, Users, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUsers, API_BASE } from "@/lib/api";
import { useEffect, useState as useStateReact } from "react";

interface Supervisor {
  id: string;
  nombre: string;
  cedula: string;
  departamento: string;
  cargo: string;
  email: string;
  telefono: string;
  estudiantesAsignados: number;
  maxEstudiantes: number;
  estado: "Activo" | "Inactivo";
  fechaIngreso: string;
  // Datos adicionales del nuevo endpoint
  estudiantesSupervisionados?: Array<{
    id: string;
    tipoBeca: string;
    estado: string;
    horasCompletadas: number;
    horasRequeridas: number;
    usuario: {
      nombre: string;
      apellido: string;
      cedula: string;
      email: string;
    };
    plaza: {
      materia: string;
      codigo: string;
      departamento: string;
    };
  }>;
}

interface EstudianteAsignado {
  id: string;
  nombre: string;
  carrera: string;
  tipoBeca: string;
  promedio: number;
  estado: string;
}

const GestionSupervisores = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { tokens } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartamento, setFilterDepartamento] = useState("todos");
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSupervisor, setEditingSupervisor] = useState<Supervisor | null>(null);
  const [supervisores, setSupervisores] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    cedula: "",
    departamento: "",
    cargo: "",
    estudiantes: [] as string[]
  });

  // Estado separado para el tipo y número de cédula
  const [cedulaData, setCedulaData] = useState({
    tipo: "V",
    numero: ""
  });

  // Estados para estadísticas de supervisores
  const [supervisoresAPI, setSupervisoresAPI] = useState<any[]>([]);
  const [supervisoresLoading, setSupervisoresLoading] = useState(true);
  const [supervisoresError, setSupervisoresError] = useState<string | null>(null);
  const [estadisticas, setEstadisticas] = useState({
    totalSupervisores: 0,
    totalAyudantes: 0,
    promedioAyudantesPorSupervisor: 0
  });
  
  // Estados para cambio de supervisor
  const [isChangeSupervisorModalOpen, setIsChangeSupervisorModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [availableSupervisors, setAvailableSupervisors] = useState<any[]>([]);
  const [newSupervisorId, setNewSupervisorId] = useState("");
  const [changingSupervisor, setChangingSupervisor] = useState(false);

  // Función para cargar supervisores del API
  const loadSupervisores = async () => {
    try {
      setSupervisoresLoading(true);
      setSupervisoresError(null);
      
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      const response = await fetch(`https://srodriguez.intelcondev.org/api/v1/supervisores/ayudantes/all?limit=50&offset=0`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error al cargar supervisores (${response.status})`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      // Asegurar que supervisores siempre sea un array
      const supervisoresData = data.data?.supervisores || data.supervisores || [];
      setSupervisoresAPI(Array.isArray(supervisoresData) ? supervisoresData : []);
      
      // Guardar estadísticas del API
      if (data.data?.estadisticas) {
        setEstadisticas({
          totalSupervisores: data.data.estadisticas.totalSupervisores || 0,
          totalAyudantes: data.data.estadisticas.totalAyudantes || 0,
          promedioAyudantesPorSupervisor: parseFloat(data.data.estadisticas.promedioAyudantesPorSupervisor) || 0
        });
      }
    } catch (err: any) {
      console.error('Error loading supervisores:', err); // Debug log
      setSupervisoresError(err.message || "Error al cargar los supervisores");
      toast({
        title: "Error",
        description: err.message || "No se pudieron cargar los supervisores",
        variant: "destructive"
      });
    } finally {
      setSupervisoresLoading(false);
    }
  };

  // Cargar supervisores al montar el componente
  useEffect(() => {
    loadSupervisores();
  }, []);

  const handleEditSupervisor = async (supervisor: Supervisor) => {
    setEditingSupervisor(supervisor);
    setIsEditModalOpen(true);
    
    // Cargar datos reales del supervisor y sus ayudantes
    await loadSupervisorData(supervisor);
  };

  // Función para cargar datos del supervisor y sus ayudantes
  const loadSupervisorData = async (supervisor: Supervisor) => {
    try {
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      console.log('=== CARGANDO DATOS DEL SUPERVISOR ===');
      console.log('Supervisor ID:', supervisor.id);

      // Cargar ayudantes del supervisor
      const ayudantesResponse = await fetch(`${API_BASE}/v1/supervisores/${supervisor.id}/ayudantes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (ayudantesResponse.ok) {
        const ayudantesData = await ayudantesResponse.json();
        console.log('Ayudantes del supervisor:', ayudantesData);
        
        // Mapear ayudantes a IDs para el formulario
        const ayudantesIds = ayudantesData.data?.ayudantes?.map((ayudante: any) => ayudante.id) || [];
        
        // Separar nombre completo en nombre y apellido
        const nombreCompleto = supervisor.nombre || "";
        const partesNombre = nombreCompleto.split(' ');
        const nombre = partesNombre[0] || "";
        const apellido = partesNombre.slice(1).join(' ') || "";
        
        // Parsear cédula existente
        const cedulaExistente = supervisor.cedula || "";
        const cedulaMatch = cedulaExistente.match(/^([VE])-(.+)$/);
        const cedulaTipo = cedulaMatch ? cedulaMatch[1] : "V";
        const cedulaNumero = cedulaMatch ? cedulaMatch[2] : "";
        
        setCedulaData({
          tipo: cedulaTipo,
          numero: cedulaNumero
        });
        
    setFormData({
          nombre: nombre,
          apellido: apellido,
          correo: supervisor.email || "",
          cedula: cedulaExistente,
          departamento: supervisor.departamento || "",
          cargo: supervisor.cargo || "",
          estudiantes: ayudantesIds
        });
      } else {
        console.warn('No se pudieron cargar los ayudantes del supervisor');
        // Separar nombre completo en nombre y apellido
        const nombreCompleto = supervisor.nombre || "";
        const partesNombre = nombreCompleto.split(' ');
        const nombre = partesNombre[0] || "";
        const apellido = partesNombre.slice(1).join(' ') || "";
        
        // Parsear cédula existente
        const cedulaExistente = supervisor.cedula || "";
        const cedulaMatch = cedulaExistente.match(/^([VE])-(.+)$/);
        const cedulaTipo = cedulaMatch ? cedulaMatch[1] : "V";
        const cedulaNumero = cedulaMatch ? cedulaMatch[2] : "";
        
        setCedulaData({
          tipo: cedulaTipo,
          numero: cedulaNumero
        });
        
        setFormData({
          nombre: nombre,
          apellido: apellido,
          correo: supervisor.email || "",
          cedula: cedulaExistente,
          departamento: supervisor.departamento || "",
          cargo: supervisor.cargo || "",
          estudiantes: []
        });
      }

      // Cargar estudiantes disponibles para asignar
      await loadEstudiantesDisponibles();
    } catch (err: any) {
      console.error('Error cargando datos del supervisor:', err);
      // Usar datos básicos del supervisor si falla la carga
      const nombreCompleto = supervisor.nombre || "";
      const partesNombre = nombreCompleto.split(' ');
      const nombre = partesNombre[0] || "";
      const apellido = partesNombre.slice(1).join(' ') || "";
      
      // Parsear cédula existente
      const cedulaExistente = supervisor.cedula || "";
      const cedulaMatch = cedulaExistente.match(/^([VE])-(.+)$/);
      const cedulaTipo = cedulaMatch ? cedulaMatch[1] : "V";
      const cedulaNumero = cedulaMatch ? cedulaMatch[2] : "";
      
      setCedulaData({
        tipo: cedulaTipo,
        numero: cedulaNumero
      });
      
      setFormData({
        nombre: nombre,
        apellido: apellido,
        correo: supervisor.email || "",
        cedula: cedulaExistente,
        departamento: supervisor.departamento || "",
        cargo: supervisor.cargo || "",
        estudiantes: []
      });
    }
  };

  // Función para cargar estudiantes disponibles (sin supervisor asignado)
  const loadEstudiantesDisponibles = async () => {
    try {
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      console.log('=== CARGANDO ESTUDIANTES DISPONIBLES (SIN SUPERVISOR) ===');

      // Cargar becarios sin supervisor asignado
      const response = await fetch(`${API_BASE}/v1/becarios?sinSupervisor=true&estado=Activa&limit=100`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Respuesta del endpoint becarios:', data);
        
        const becarios = data.data?.becarios || data.becarios || [];
        
        // Mapear a formato esperado
        const estudiantesMapeados = becarios.map((becario: any) => ({
          id: becario.id,
          nombre: `${becario.usuario?.nombre || ''} ${becario.usuario?.apellido || ''}`.trim(),
          cedula: becario.usuario?.cedula || 'N/A',
          email: becario.usuario?.email || 'N/A',
          tipoBeca: becario.tipoBeca || 'N/A',
          plaza: becario.plaza?.materia || 'Sin plaza asignada'
        }));
        
        setEstudiantesDisponibles(estudiantesMapeados);
        console.log('✅ Estudiantes disponibles (sin supervisor) cargados:', estudiantesMapeados);
        console.log(`📊 Total de estudiantes disponibles: ${estudiantesMapeados.length}`);
      } else {
        const errorData = await response.json().catch(() => null);
        console.warn('No se pudieron cargar los estudiantes disponibles:', errorData);
        // Usar datos mock como fallback
        setEstudiantesDisponibles([
          { id: "1", nombre: "María González Rodríguez", cedula: "V-27543123" },
          { id: "2", nombre: "Carlos López Martínez", cedula: "V-28456789" }
        ]);
      }
    } catch (err: any) {
      console.error('Error cargando estudiantes disponibles:', err);
      // Usar datos mock como fallback
      setEstudiantesDisponibles([
        { id: "1", nombre: "María González Rodríguez", cedula: "V-27543123" },
        { id: "2", nombre: "Carlos López Martínez", cedula: "V-28456789" }
      ]);
    }
  };

  const handleEstudianteClick = (estudianteId: string) => {
    navigate(`/estudiante/${estudianteId}`);
  };

  // Función para abrir modal de cambio de supervisor
  const handleChangeSupervisor = (estudiante: any) => {
    setSelectedStudent(estudiante);
    setNewSupervisorId("");
    setIsChangeSupervisorModalOpen(true);
    // Cargar supervisores disponibles
    loadAvailableSupervisors();
  };

  // Función para cargar supervisores disponibles
  const loadAvailableSupervisors = async () => {
    try {
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      const response = await fetch(`https://srodriguez.intelcondev.org/api/v1/supervisores/ayudantes/all?limit=50&offset=0`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error al cargar supervisores (${response.status})`);
      }

      const data = await response.json();
      const supervisoresData = data.data?.supervisores || data.supervisores || [];
      setAvailableSupervisors(Array.isArray(supervisoresData) ? supervisoresData : []);
    } catch (err: any) {
      console.error('Error loading available supervisors:', err);
      toast({
        title: "Error",
        description: "No se pudieron cargar los supervisores disponibles",
        variant: "destructive"
      });
    }
  };

  // Función para cambiar supervisor de un estudiante
  const handleChangeSupervisorSubmit = async () => {
    if (!selectedStudent || !newSupervisorId) {
      toast({
        title: "Error",
        description: "Seleccione un supervisor",
        variant: "destructive"
      });
      return;
    }

    setChangingSupervisor(true);
    try {
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      const response = await fetch(`https://srodriguez.intelcondev.org/api/v1/supervisores/ayudantes/${selectedStudent.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          supervisorId: newSupervisorId
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error al cambiar supervisor (${response.status})`);
      }

      const data = await response.json();
      console.log('Supervisor changed successfully:', data);
      
      toast({
        title: "Éxito",
        description: data.message || "Supervisor cambiado exitosamente",
      });

      // Cerrar modal y recargar datos
      setIsChangeSupervisorModalOpen(false);
      setSelectedStudent(null);
      setNewSupervisorId("");
      loadSupervisores(); // Recargar la lista de supervisores
    } catch (err: any) {
      console.error('Error changing supervisor:', err);
      toast({
        title: "Error",
        description: err.message || "No se pudo cambiar el supervisor",
        variant: "destructive"
      });
    } finally {
      setChangingSupervisor(false);
    }
  };

  // Estado para estudiantes disponibles (sin supervisor asignado)
  const [estudiantesDisponibles, setEstudiantesDisponibles] = useState([
    { id: "1", nombre: "María González Rodríguez", cedula: "V-27543123", email: "maria.gonzalez@unimet.edu.ve", tipoBeca: "Ayudantía", plaza: "Programación I" },
    { id: "2", nombre: "Carlos López Martínez", cedula: "V-28456789", email: "carlos.lopez@unimet.edu.ve", tipoBeca: "Ayudantía", plaza: "Cálculo I" }
  ]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCedulaChange = (tipo: string, numero: string) => {
    setCedulaData({ tipo, numero });
    // Concatenar tipo y número para formData.cedula
    const cedulaCompleta = numero ? `${tipo}-${numero}` : "";
    setFormData(prev => ({ ...prev, cedula: cedulaCompleta }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      console.log('=== CREAR SUPERVISOR ===');
      console.log('Datos del formulario:', formData);

      // Paso 1: Crear usuario con POST /api/v1/auth/register
      const userData = {
        email: formData.correo,
        password: "Supervisor123!", // Contraseña temporal
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        cedula: formData.cedula,
        telefono: "+58 212 1234567", // Teléfono temporal
        role: "supervisor",
        departamento: formData.departamento,
        cargo: formData.cargo
      };

      console.log('Paso 1 - Creando usuario:', userData);

      const userResponse = await fetch(`${API_BASE}/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json().catch(() => null);
        console.error('Error creando usuario:', errorData);
        throw new Error(errorData?.message || `Error al crear usuario (${userResponse.status})`);
      }

      const userResult = await userResponse.json();
      console.log('Usuario creado exitosamente:', userResult);
      
      const supervisorId = userResult.data?.user?.id;
      if (!supervisorId) {
        throw new Error("No se pudo obtener el ID del supervisor creado");
      }

      // Paso 2: Asignar ayudantes si hay estudiantes seleccionados
      if (formData.estudiantes.length > 0) {
        console.log('Paso 2 - Asignando ayudantes:', formData.estudiantes);
        
        const assignData = {
          estudiantesBecarios: formData.estudiantes,
          permitirReasignacion: true
        };

        console.log('Datos de asignación:', assignData);

        const assignResponse = await fetch(`${API_BASE}/v1/supervisores/${supervisorId}/ayudantes/asignar`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(assignData)
        });

        if (!assignResponse.ok) {
          const errorData = await assignResponse.json().catch(() => null);
          console.error('Error asignando ayudantes:', errorData);
          
          // Mostrar información específica del error
          if (errorData?.data?.errores) {
            console.warn('Errores de asignación:', errorData.data.errores);
            toast({
              title: "Advertencia",
              description: `El supervisor se creó pero ${errorData.data.totalErrores} ayudante(s) no se pudieron asignar. Revisa la consola para más detalles.`,
              variant: "destructive"
            });
          } else {
            console.warn('El supervisor se creó pero no se pudieron asignar los ayudantes');
            toast({
              title: "Advertencia", 
              description: "El supervisor se creó pero no se pudieron asignar los ayudantes",
              variant: "destructive"
            });
          }
        } else {
          const successData = await assignResponse.json().catch(() => null);
          console.log('Ayudantes asignados exitosamente:', successData);
          
          if (successData?.data?.totalAsignados > 0) {
            toast({
              title: "Éxito",
              description: `${successData.data.totalAsignados} ayudante(s) asignado(s) exitosamente`
            });
          }
        }
      }

    toast({
      title: "Supervisor creado",
      description: "El supervisor ha sido creado exitosamente.",
    });

    setIsModalOpen(false);
    setFormData({
      nombre: "",
        apellido: "",
      correo: "",
      cedula: "",
      departamento: "",
      cargo: "",
      estudiantes: []
    });
    setCedulaData({
      tipo: "V",
      numero: ""
    });
      await loadSupervisores();
    } catch (err: any) {
      console.error('Error creating supervisor:', err);
      toast({
        title: "Error",
        description: err.message || "No se pudo crear el supervisor",
        variant: "destructive"
      });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingSupervisor) {
    toast({
        title: "Error",
        description: "No hay supervisor seleccionado para editar",
        variant: "destructive"
    });
      return;
    }

    try {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      console.log('=== EDITAR SUPERVISOR ===');
      console.log('Supervisor ID:', editingSupervisor.id);
      console.log('Datos del formulario:', formData);

      // Paso 1: Actualizar datos básicos del supervisor
      const userData = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        departamento: formData.departamento,
        cargo: formData.cargo
      };

      console.log('Paso 1 - Actualizando datos básicos:', userData);

      const userResponse = await fetch(`${API_BASE}/v1/users/${editingSupervisor.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json().catch(() => null);
        console.error('Error actualizando usuario:', errorData);
        throw new Error(errorData?.message || `Error al actualizar usuario (${userResponse.status})`);
      }

      console.log('Datos básicos actualizados exitosamente');

      // Paso 2: Actualizar ayudantes asignados si hay cambios
      if (formData.estudiantes.length > 0) {
        console.log('Paso 2 - Asignando ayudantes:', formData.estudiantes);
        
        const assignData = {
          estudiantesBecarios: formData.estudiantes,
          permitirReasignacion: true
        };

        console.log('Datos de asignación (editar):', assignData);

        const assignResponse = await fetch(`${API_BASE}/v1/supervisores/${editingSupervisor.id}/ayudantes/asignar`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(assignData)
        });

        if (!assignResponse.ok) {
          const errorData = await assignResponse.json().catch(() => null);
          console.error('Error asignando ayudantes:', errorData);
          
          // Mostrar información específica del error
          if (errorData?.data?.errores) {
            console.warn('Errores de asignación:', errorData.data.errores);
            toast({
              title: "Advertencia",
              description: `Los datos se actualizaron pero ${errorData.data.totalErrores} ayudante(s) no se pudieron asignar. Revisa la consola para más detalles.`,
              variant: "destructive"
            });
          } else {
            console.warn('Los datos básicos se actualizaron pero no se pudieron asignar los ayudantes');
            toast({
              title: "Advertencia",
              description: "Los datos se actualizaron pero no se pudieron asignar los ayudantes",
              variant: "destructive"
            });
          }
        } else {
          const successData = await assignResponse.json().catch(() => null);
          console.log('Ayudantes asignados exitosamente:', successData);
          
          if (successData?.data?.totalAsignados > 0) {
            toast({
              title: "Éxito",
              description: `${successData.data.totalAsignados} ayudante(s) asignado(s) exitosamente`
            });
          }
        }
      }

      toast({
        title: "Supervisor actualizado",
        description: "Los datos del supervisor han sido actualizados exitosamente.",
      });

      setIsEditModalOpen(false);
      setEditingSupervisor(null);
      await loadSupervisores();
    } catch (err: any) {
      console.error('Error updating supervisor:', err);
      toast({
        title: "Error",
        description: err.message || "No se pudo actualizar el supervisor",
        variant: "destructive"
      });
    }
  };


  // Mock data (temporal hasta que se implementen los endpoints faltantes)
  const supervisoresMock: Supervisor[] = [
    {
      id: "1",
      nombre: "Dr. Carlos Mendoza",
      cedula: "V-98765432",
      departamento: "Ingeniería",
      cargo: "Profesor Titular",
      email: "cmendoza@universidad.edu",
      telefono: "0412-1234567",
      estudiantesAsignados: 8,
      maxEstudiantes: 10,
      estado: "Activo",
      fechaIngreso: "2020-03-15"
    },
    {
      id: "2",
      nombre: "Prof. María Fernández",
      cedula: "V-87654321",
      departamento: "Administración",
      cargo: "Profesora Agregada",
      email: "mfernandez@universidad.edu",
      telefono: "0416-7654321",
      estudiantesAsignados: 5,
      maxEstudiantes: 8,
      estado: "Activo",
      fechaIngreso: "2019-08-20"
    },
    {
      id: "3",
      nombre: "Dra. Ana Morales",
      cedula: "V-76543210",
      departamento: "Psicología",
      cargo: "Profesora Asociada",
      email: "amorales@universidad.edu",
      telefono: "0424-9876543",
      estudiantesAsignados: 3,
      maxEstudiantes: 6,
      estado: "Activo",
      fechaIngreso: "2021-01-10"
    }
  ];

  const estudiantesAsignados: EstudianteAsignado[] = [
    {
      id: "1",
      nombre: "Ana García López",
      carrera: "Ingeniería de Sistemas",
      tipoBeca: "Excelencia Académica",
      promedio: 18.5,
      estado: "Activo"
    },
    {
      id: "2",
      nombre: "Pedro Martínez",
      carrera: "Ingeniería Civil",
      tipoBeca: "Ayudantía",
      promedio: 17.8,
      estado: "Activo"
    }
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Activo":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Activo</Badge>;
      case "Inactivo":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactivo</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getCargaBadge = (asignados: number, max: number) => {
    const porcentaje = (asignados / max) * 100;
    if (porcentaje >= 90) {
      return <Badge className="bg-red-100 text-red-800 border-red-200">Completo</Badge>;
    } else if (porcentaje >= 70) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Alto</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Disponible</Badge>;
    }
  };

  // Mapear datos del API al formato esperado por la tabla
  const supervisoresMapeados = supervisoresAPI.map(supervisor => ({
    id: supervisor.id,
    nombre: supervisor.nombre + (supervisor.apellido ? ` ${supervisor.apellido}` : ''),
    cedula: 'N/A', // No viene en el nuevo endpoint
    departamento: supervisor.departamento || 'N/A',
    cargo: 'Supervisor', // Valor por defecto
    email: supervisor.email,
    telefono: 'N/A', // No viene en el nuevo endpoint
    estudiantesAsignados: supervisor.cantidadAyudantes || 0,
    maxEstudiantes: 10, // Valor por defecto
    estado: "Activo", // Asumimos activo por defecto
    fechaIngreso: 'N/A', // No viene en el nuevo endpoint
    // Datos adicionales del nuevo endpoint
    estudiantesSupervisionados: supervisor.estudiantesSupervisionados || []
  }));

  const filteredSupervisores = supervisoresMapeados.filter(supervisor => {
    const matchesSearch = supervisor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supervisor.cedula.includes(searchTerm) ||
                         supervisor.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartamento = filterDepartamento === "todos" || supervisor.departamento === filterDepartamento;
    
    return matchesSearch && matchesDepartamento;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary">Gestión de Supervisores</h2>
          <p className="text-muted-foreground">Administración de supervisores y estudiantes asignados</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          setIsModalOpen(open);
          if (open) {
            // Limpiar el formulario cuando se abre el modal de crear
            setFormData({
              nombre: "",
              apellido: "",
              correo: "",
              cedula: "",
              departamento: "",
              cargo: "",
              estudiantes: []
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
              Nuevo Supervisor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Supervisor</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                      placeholder="Ingrese el nombre"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellido">Apellido</Label>
                    <Input
                      id="apellido"
                      value={formData.apellido}
                      onChange={(e) => handleInputChange("apellido", e.target.value)}
                      placeholder="Ingrese el apellido"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="correo">Correo Electrónico</Label>
                  <Input
                    id="correo"
                    type="email"
                    value={formData.correo}
                    onChange={(e) => handleInputChange("correo", e.target.value)}
                    placeholder="correo@universidad.edu"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cedula">Cédula</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  <Select value={formData.departamento} onValueChange={(value) => handleInputChange("departamento", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar departamento" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value="Ingeniería">Ingeniería</SelectItem>
                      <SelectItem value="Ciencias">Ciencias</SelectItem>
                      <SelectItem value="Humanidades">Humanidades</SelectItem>
                      <SelectItem value="Medicina">Medicina</SelectItem>
                      <SelectItem value="Derecho">Derecho</SelectItem>
                      <SelectItem value="Administración">Administración</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Select value={formData.cargo} onValueChange={(value) => handleInputChange("cargo", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cargo" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value="Profesor Titular">Profesor Titular</SelectItem>
                      <SelectItem value="Profesor Asociado">Profesor Asociado</SelectItem>
                      <SelectItem value="Profesor Asistente">Profesor Asistente</SelectItem>
                      <SelectItem value="Instructor">Instructor</SelectItem>
                      <SelectItem value="Coordinador">Coordinador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estudiantes">Estudiantes a Asignar</Label>
                  <Select value="" onValueChange={(value) => {
                    if (value && !formData.estudiantes.includes(value)) {
                      handleInputChange("estudiantes", [...formData.estudiantes, value]);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estudiantes" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50 max-h-48 overflow-y-auto">
                      {estudiantesDisponibles.map((estudiante) => (
                        <SelectItem 
                          key={estudiante.id} 
                          value={estudiante.id}
                          disabled={formData.estudiantes.includes(estudiante.id)}
                        >
                          {estudiante.nombre} - {estudiante.cedula}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Lista de estudiantes seleccionados */}
              {formData.estudiantes.length > 0 && (
                <div className="space-y-2">
                  <Label>Estudiantes Seleccionados:</Label>
                  <div className="bg-muted/20 p-3 rounded-lg space-y-2">
                    {formData.estudiantes.map((estudianteId) => {
                      const estudiante = estudiantesDisponibles.find(e => e.id === estudianteId);
                      return (
                        <div key={estudianteId} className="flex items-center justify-between bg-background p-3 rounded border">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{estudiante?.nombre}</p>
                            <p className="text-xs text-muted-foreground">
                              {estudiante?.cedula} • {estudiante?.tipoBeca} • {estudiante?.plaza}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              handleInputChange("estudiantes", formData.estudiantes.filter(id => id !== estudianteId));
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-gradient-primary hover:opacity-90">
                  Crear Supervisor
                </Button>
              </div>
            </form>
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
                placeholder="Buscar por nombre, cédula o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterDepartamento} onValueChange={setFilterDepartamento}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los Departamentos</SelectItem>
                <SelectItem value="Ingeniería">Ingeniería</SelectItem>
                <SelectItem value="Administración">Administración</SelectItem>
                <SelectItem value="Psicología">Psicología</SelectItem>
                <SelectItem value="Derecho">Derecho</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>


      {/* Tabla de supervisores */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
          <CardTitle>Lista de Supervisores ({filteredSupervisores.length})</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadSupervisores}
              disabled={supervisoresLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${supervisoresLoading ? 'animate-spin' : ''}`} />
              Recargar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {supervisoresLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Cargando supervisores...</span>
            </div>
          ) : supervisoresError ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{supervisoresError}</p>
              <Button onClick={loadSupervisores} variant="outline">
                Reintentar
              </Button>
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supervisor</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Estudiantes</TableHead>
                <TableHead>Carga</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSupervisores.map((supervisor) => (
                <TableRow key={supervisor.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{supervisor.nombre}</p>
                      <p className="text-sm text-muted-foreground">{supervisor.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{supervisor.departamento}</TableCell>
                  <TableCell>{supervisor.cargo}</TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {supervisor.estudiantesAsignados}/{supervisor.maxEstudiantes}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getCargaBadge(supervisor.estudiantesAsignados, supervisor.maxEstudiantes)}
                  </TableCell>
                  <TableCell>{getEstadoBadge(supervisor.estado)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedSupervisor(supervisor)}
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>
                              Estudiantes Asignados - {supervisor.nombre}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Departamento</p>
                                <p>{supervisor.departamento}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Cargo</p>
                                <p>{supervisor.cargo}</p>
                              </div>
                            </div>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Estudiante</TableHead>
                                  <TableHead>Plaza</TableHead>
                                  <TableHead>Tipo de Beca</TableHead>
                                  <TableHead>Horas</TableHead>
                                  <TableHead>Estado</TableHead>
                                  <TableHead>Acciones</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {supervisor.estudiantesSupervisionados && supervisor.estudiantesSupervisionados.length > 0 ? (
                                  supervisor.estudiantesSupervisionados.map((estudiante) => (
                                  <TableRow 
                                    key={estudiante.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => handleEstudianteClick(estudiante.id)}
                                  >
                                      <TableCell className="font-medium">
                                        <div>
                                          <p>{estudiante.usuario.nombre} {estudiante.usuario.apellido}</p>
                                          <p className="text-sm text-muted-foreground">{estudiante.usuario.email}</p>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <div>
                                          <p className="font-medium">{estudiante.plaza.materia}</p>
                                          <p className="text-sm text-muted-foreground">{estudiante.plaza.codigo}</p>
                                        </div>
                                      </TableCell>
                                    <TableCell>
                                      <Badge variant="outline">{estudiante.tipoBeca}</Badge>
                                    </TableCell>
                                      <TableCell>
                                        <div className="text-sm">
                                          <p>{estudiante.horasCompletadas}/{estudiante.horasRequeridas} hrs</p>
                                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                            <div 
                                              className="bg-blue-600 h-2 rounded-full" 
                                              style={{ 
                                                width: `${estudiante.horasRequeridas > 0 ? (estudiante.horasCompletadas / estudiante.horasRequeridas) * 100 : 0}%` 
                                              }}
                                            ></div>
                                          </div>
                                        </div>
                                      </TableCell>
                                    <TableCell>
                                      <Badge className="bg-green-100 text-green-800 border-green-200">
                                        {estudiante.estado}
                                      </Badge>
                                    </TableCell>
                                      <TableCell>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleChangeSupervisor(estudiante);
                                          }}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                  </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                                      No hay estudiantes asignados a este supervisor
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditSupervisor(supervisor)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
        </CardContent>
        </Card>

        {/* Modal de Edición - Editar Datos del Supervisor */}
        <Dialog open={isEditModalOpen} onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) {
            // Limpiar el formulario cuando se cierra el modal de edición
            setFormData({
              nombre: "",
              apellido: "",
              correo: "",
              cedula: "",
              departamento: "",
              cargo: "",
              estudiantes: []
            });
            setCedulaData({
              tipo: "V",
              numero: ""
            });
            setEditingSupervisor(null);
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Supervisor</DialogTitle>
            </DialogHeader>
            
            {editingSupervisor && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="edit-nombre">Nombre</Label>
                  <Input
                    id="edit-nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                      placeholder="Ingrese el nombre"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-apellido">Apellido</Label>
                    <Input
                      id="edit-apellido"
                      value={formData.apellido}
                      onChange={(e) => handleInputChange("apellido", e.target.value)}
                      placeholder="Ingrese el apellido"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-correo">Correo Electrónico</Label>
                  <Input
                    id="edit-correo"
                    type="email"
                    value={formData.correo}
                    onChange={(e) => handleInputChange("correo", e.target.value)}
                    placeholder="correo@universidad.edu"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cedula">Cédula</Label>
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
                      id="edit-cedula"
                      value={cedulaData.numero}
                      onChange={(e) => handleCedulaChange(cedulaData.tipo, e.target.value)}
                      placeholder="12345678"
                      required
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-departamento">Departamento</Label>
                  <Select value={formData.departamento} onValueChange={(value) => handleInputChange("departamento", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar departamento" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value="Ingeniería">Ingeniería</SelectItem>
                      <SelectItem value="Ciencias">Ciencias</SelectItem>
                      <SelectItem value="Humanidades">Humanidades</SelectItem>
                      <SelectItem value="Medicina">Medicina</SelectItem>
                      <SelectItem value="Derecho">Derecho</SelectItem>
                      <SelectItem value="Administración">Administración</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cargo">Cargo</Label>
                  <Select value={formData.cargo} onValueChange={(value) => handleInputChange("cargo", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cargo" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50">
                      <SelectItem value="Profesor Titular">Profesor Titular</SelectItem>
                      <SelectItem value="Profesor Asociado">Profesor Asociado</SelectItem>
                      <SelectItem value="Profesor Asistente">Profesor Asistente</SelectItem>
                      <SelectItem value="Instructor">Instructor</SelectItem>
                      <SelectItem value="Coordinador">Coordinador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-estudiantes">Estudiantes a Asignar</Label>
                  <Select value="" onValueChange={(value) => {
                    if (value && !formData.estudiantes.includes(value)) {
                      handleInputChange("estudiantes", [...formData.estudiantes, value]);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estudiantes" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-50 max-h-48 overflow-y-auto">
                      {estudiantesDisponibles.map((estudiante) => (
                        <SelectItem 
                          key={estudiante.id} 
                          value={estudiante.id}
                          disabled={formData.estudiantes.includes(estudiante.id)}
                        >
                            <div className="flex flex-col">
                              <span className="font-medium">{estudiante.nombre}</span>
                              <span className="text-xs text-muted-foreground">
                                {estudiante.cedula} • {estudiante.tipoBeca} • {estudiante.plaza}
                              </span>
                            </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Lista de estudiantes seleccionados */}
              {formData.estudiantes.length > 0 && (
                <div className="space-y-2">
                  <Label>Estudiantes Asignados:</Label>
                  <div className="bg-muted/20 p-3 rounded-lg space-y-2">
                    {formData.estudiantes.map((estudianteId) => {
                      const estudiante = estudiantesDisponibles.find(e => e.id === estudianteId);
                      return (
                        <div key={estudianteId} className="flex items-center justify-between bg-background p-3 rounded border">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{estudiante?.nombre}</p>
                            <p className="text-xs text-muted-foreground">
                              {estudiante?.cedula} • {estudiante?.tipoBeca} • {estudiante?.plaza}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              handleInputChange("estudiantes", formData.estudiantes.filter(id => id !== estudianteId));
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-gradient-primary hover:opacity-90">
                  Actualizar Supervisor
                </Button>
              </div>
            </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal para cambiar supervisor */}
        <Dialog open={isChangeSupervisorModalOpen} onOpenChange={setIsChangeSupervisorModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Cambiar Supervisor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedStudent && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Estudiante:</h4>
                  <p className="text-sm">
                    {selectedStudent.usuario?.nombre} {selectedStudent.usuario?.apellido}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedStudent.usuario?.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Plaza: {selectedStudent.plaza?.materia} ({selectedStudent.plaza?.codigo})
                  </p>
                </div>
              )}
              
              <div>
                <Label htmlFor="newSupervisor">Nuevo Supervisor *</Label>
                <Select 
                  value={newSupervisorId} 
                  onValueChange={setNewSupervisorId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSupervisors.map((supervisor) => (
                      <SelectItem key={supervisor.id} value={supervisor.id}>
                        {supervisor.nombre} {supervisor.apellido || ''} ({supervisor.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsChangeSupervisorModalOpen(false)} 
                  className="flex-1"
                  disabled={changingSupervisor}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleChangeSupervisorSubmit} 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={changingSupervisor || !newSupervisorId}
                >
                  {changingSupervisor ? "Cambiando..." : "Cambiar Supervisor"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default GestionSupervisores;