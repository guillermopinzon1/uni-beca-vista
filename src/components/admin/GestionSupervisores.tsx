import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { Search, Users, RefreshCw, ChevronDown, ChevronUp, UserCheck, Clock, Plus, Edit, UserX, UserPlus, Building } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE } from "@/lib/api";

interface Supervisor {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  cedula: string;
  departamento: string;
  cargo: string;
  telefono: string;
  activo: boolean;
  cantidadAyudantes: number;
  estudiantesSupervisionados: Array<{
    id: string;
    tipoBeca: string;
    estado: string;
    horasCompletadas: string;
    horasRequeridas: number;
    periodoInicio: string;
    usuario: {
      id: string;
      nombre: string;
      apellido: string;
      cedula: string;
      email: string;
      telefono: string;
      carrera: string | null;
    };
    plaza: {
      id: string;
      materia: string;
      codigo: string;
      departamento: string;
      ubicacion: string;
      tipoAyudantia: string;
      horasSemana: number;
    } | null;
    postulacion: {
      id: string;
      iaa: string | null;
      creditosInscritos: number | null;
      fechaPostulacion: string;
      estado: string;
    };
  }>;
  plazasAsignadas?: Array<{
    id: string;
    materia: string;
    codigo: string;
    departamento: string;
    ubicacion: string;
    profesor: string;
    capacidad: number;
    ocupadas: number;
    horario: Array<{ dia: string; horaInicio: string; horaFin: string }>;
    estado: string;
    tipoAyudantia: string;
    descripcionActividades: string;
    requisitosEspeciales: string[];
    horasSemana: number;
    periodoAcademico: string;
    fechaInicio: string;
    fechaFin: string;
  }>;
}

interface Estadisticas {
  totalSupervisores: number;
  totalAyudantes: number;
  promedioAyudantesPorSupervisor: string;
}

const GestionSupervisores = () => {
  const { toast } = useToast();
  const { tokens } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [supervisores, setSupervisores] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedSupervisor, setExpandedSupervisor] = useState<string | null>(null);
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({
    totalSupervisores: 0,
    totalAyudantes: 0,
    promedioAyudantesPorSupervisor: "0"
  });

  // Estados para crear/editar supervisor
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    cedula: "",
    telefono: "",
    departamento: "",
    cargo: "",
    password: ""
  });
  const [cedulaTipo, setCedulaTipo] = useState("V");
  const [cedulaNumero, setCedulaNumero] = useState("");

  // Estados para desactivar/activar supervisor
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [supervisorToDeactivate, setSupervisorToDeactivate] = useState<Supervisor | null>(null);
  const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false);
  const [supervisorToActivate, setSupervisorToActivate] = useState<Supervisor | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [supervisorToDelete, setSupervisorToDelete] = useState<Supervisor | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchSupervisores();
  }, []);

  const handleCedulaChange = (tipo: string, numero: string) => {
    setCedulaTipo(tipo);
    setCedulaNumero(numero);
    const cedulaCompleta = numero ? `${tipo}-${numero}` : "";
    setFormData(prev => ({ ...prev, cedula: cedulaCompleta }));
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      cedula: "",
      telefono: "",
      departamento: "",
      cargo: "",
      password: ""
    });
    setCedulaTipo("V");
    setCedulaNumero("");
  };

  const fetchSupervisores = async () => {
    try {
      setLoading(true);
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;

      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      const response = await fetch(`${API_BASE}/v1/supervisores/ayudantes/all?limit=100&conAyudantes=false`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar supervisores');
      }

      const data = await response.json();

      if (data.success) {
        setSupervisores(data.data.supervisores);
        setEstadisticas(data.data.estadisticas);
      }
    } catch (error: any) {
      console.error('Error fetching supervisores:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar los supervisores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSupervisor = async () => {
    try {
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;

      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      // Validación básica
      if (!formData.nombre || !formData.apellido || !formData.email || !formData.cedula || !formData.password) {
        toast({
          title: "Error",
          description: "Por favor completa todos los campos requeridos",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${API_BASE}/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          role: "supervisor"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear supervisor');
      }

      toast({
        title: "Supervisor creado",
        description: "El supervisor ha sido creado exitosamente",
      });

      setIsCreateModalOpen(false);
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        cedula: "",
        telefono: "",
        departamento: "",
        cargo: "",
        password: ""
      });
      fetchSupervisores();
    } catch (error: any) {
      console.error('Error creating supervisor:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el supervisor",
        variant: "destructive",
      });
    }
  };

  const handleEditSupervisor = async () => {
    try {
      if (!selectedSupervisor) return;

      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;

      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      const response = await fetch(`${API_BASE}/v1/supervisores/${selectedSupervisor.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          departamento: formData.departamento,
          cargo: formData.cargo
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar supervisor');
      }

      toast({
        title: "Supervisor actualizado",
        description: "Los datos del supervisor han sido actualizados exitosamente",
      });

      setIsEditModalOpen(false);
      setSelectedSupervisor(null);
      setFormData({
        nombre: "",
        apellido: "",
        email: "",
        cedula: "",
        telefono: "",
        departamento: "",
        cargo: "",
        password: ""
      });
      fetchSupervisores();
    } catch (error: any) {
      console.error('Error updating supervisor:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el supervisor",
        variant: "destructive",
      });
    }
  };

  const handleDeactivateSupervisor = async () => {
    try {
      if (!supervisorToDeactivate) return;

      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;

      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      const response = await fetch(`${API_BASE}/v1/supervisores/${supervisorToDeactivate.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al desactivar supervisor');
      }

      toast({
        title: "Supervisor desactivado",
        description: "El supervisor ha sido desactivado exitosamente. Los ayudantes asignados han quedado sin supervisor.",
      });

      setIsDeactivateDialogOpen(false);
      setSupervisorToDeactivate(null);
      fetchSupervisores();
    } catch (error: any) {
      console.error('Error deactivating supervisor:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo desactivar el supervisor",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (supervisor: Supervisor) => {
    setSelectedSupervisor(supervisor);
    setFormData({
      nombre: supervisor.nombre,
      apellido: supervisor.apellido,
      email: supervisor.email,
      cedula: supervisor.cedula,
      telefono: supervisor.telefono,
      departamento: supervisor.departamento,
      cargo: supervisor.cargo,
      password: ""
    });
    setIsEditModalOpen(true);
  };

  const openDeactivateDialog = (supervisor: Supervisor) => {
    setSupervisorToDeactivate(supervisor);
    setIsDeactivateDialogOpen(true);
  };

  const openActivateDialog = (supervisor: Supervisor) => {
    setSupervisorToActivate(supervisor);
    setIsActivateDialogOpen(true);
  };

  const openDeleteDialog = (supervisor: Supervisor) => {
    setSupervisorToDelete(supervisor);
    setIsDeleteDialogOpen(true);
  };

  const handleActivateSupervisor = async () => {
    try {
      if (!supervisorToActivate) return;

      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;

      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      const response = await fetch(`${API_BASE}/v1/supervisores/${supervisorToActivate.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          activo: true
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al activar supervisor');
      }

      toast({
        title: "Supervisor activado",
        description: "El supervisor ha sido activado exitosamente y puede acceder al sistema nuevamente.",
      });

      setIsActivateDialogOpen(false);
      setSupervisorToActivate(null);
      fetchSupervisores();
    } catch (error: any) {
      console.error('Error activating supervisor:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo activar el supervisor",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSupervisor = async () => {
    try {
      if (!supervisorToDelete) return;

      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;
      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      setDeletingUserId(supervisorToDelete.id);

      const response = await fetch(`${API_BASE}/v1/users/${supervisorToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.message || 'Error al eliminar usuario');
      }

      toast({
        title: "Supervisor eliminado",
        description: `${supervisorToDelete.nombre} ${supervisorToDelete.apellido} fue eliminado correctamente`,
      });

      setIsDeleteDialogOpen(false);
      setSupervisorToDelete(null);
      // Refrescar lista
      fetchSupervisores();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'No se pudo eliminar el supervisor',
        variant: 'destructive'
      });
    } finally {
      setDeletingUserId(null);
    }
  };

  const filteredSupervisores = supervisores.filter((supervisor) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      supervisor.nombre.toLowerCase().includes(searchLower) ||
      supervisor.apellido.toLowerCase().includes(searchLower) ||
      supervisor.email.toLowerCase().includes(searchLower) ||
      supervisor.departamento.toLowerCase().includes(searchLower) ||
      supervisor.cedula.toLowerCase().includes(searchLower)
    );
  });

  const toggleExpand = (supervisorId: string) => {
    setExpandedSupervisor(expandedSupervisor === supervisorId ? null : supervisorId);
  };

  const getEstadoBadge = (estado: string) => {
    const estados: { [key: string]: { color: string; label: string } } = {
      'Activa': { color: 'bg-green-100 text-green-800 border-green-200', label: 'Activa' },
      'Suspendida': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Suspendida' },
      'Culminada': { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Culminada' },
    };
    const config = estados[estado] || { color: 'bg-gray-100 text-gray-800 border-gray-200', label: estado };
    return <Badge variant="outline" className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-orange/20 bg-gradient-to-br from-orange-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Total Supervisores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{estadisticas.totalSupervisores}</div>
          </CardContent>
        </Card>

        <Card className="border-orange/20 bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-blue-600" />
              Total Ayudantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{estadisticas.totalAyudantes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <Card className="border-orange/20">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-xl text-primary">Gestión de Supervisores</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email, departamento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={fetchSupervisores}
                disabled={loading}
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                onClick={() => {
                  resetForm();
                  setIsCreateModalOpen(true);
                }}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Supervisor
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-muted-foreground">Cargando supervisores...</p>
            </div>
          ) : filteredSupervisores.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <p className="mt-2 text-muted-foreground">No se encontraron supervisores</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredSupervisores.map((supervisor) => (
                <Card
                  key={supervisor.id}
                  className="border-orange/20 hover:shadow-md transition-all duration-200"
                >
                  {/* Supervisor Header */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleExpand(supervisor.id)}>
                        {/* Avatar */}
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-orange-accent flex items-center justify-center text-white font-semibold text-lg">
                          {supervisor.nombre.charAt(0)}{supervisor.apellido.charAt(0)}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">
                              {supervisor.nombre} {supervisor.apellido}
                            </h3>
                            <Badge
                              variant="outline"
                              className={supervisor.activo
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-gray-100 text-gray-800 border-gray-200"
                              }
                            >
                              {supervisor.activo ? "Activo" : "Inactivo"}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <span className="font-medium">Email:</span> {supervisor.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="font-medium">Cédula:</span> {supervisor.cedula}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="font-medium">Depto:</span> {supervisor.departamento}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="font-medium">Cargo:</span> {supervisor.cargo}
                            </span>
                          </div>
                        </div>

                        {/* Stats Badge */}
                        <div className="text-center px-4 py-2 bg-primary/10 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{supervisor.cantidadAyudantes}</div>
                          <div className="text-xs text-muted-foreground">Ayudantes</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(supervisor)}
                          className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        {supervisor.activo ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeactivateDialog(supervisor)}
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Desactivar
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openActivateDialog(supervisor)}
                              className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Activar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDeleteDialog(supervisor)}
                              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => toggleExpand(supervisor.id)}>
                          {expandedSupervisor === supervisor.id ? (
                            <ChevronUp className="h-5 w-5 text-primary" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-primary" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content - Plazas asignadas y estudiantes */}
                  {expandedSupervisor === supervisor.id && (
                    <div className="border-t border-orange/20 bg-orange/5 p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Plazas Asignadas Column */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-base text-primary flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              Plaza{Array.isArray(supervisor.plazasAsignadas) && supervisor.plazasAsignadas.length !== 1 ? 's' : ''} Asignada{Array.isArray(supervisor.plazasAsignadas) && supervisor.plazasAsignadas.length !== 1 ? 's' : ''}
                            </h4>
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                              {Array.isArray(supervisor.plazasAsignadas) ? supervisor.plazasAsignadas.length : 0}
                            </Badge>
                          </div>

                          {Array.isArray(supervisor.plazasAsignadas) && supervisor.plazasAsignadas.length > 0 ? (
                            <div className="space-y-3">
                              {supervisor.plazasAsignadas.map((plaza) => (
                                <Card key={plaza.id} className="border-purple-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                                  <CardContent className="p-4 space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1">
                                        <div className="text-sm font-semibold text-foreground line-clamp-1">{plaza.nombre}</div>
                                        <div className="text-xs text-muted-foreground">{plaza.ubicacion}</div>
                                      </div>
                                      <Badge variant="outline" className="text-xs shrink-0">{plaza.estado}</Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                      <div className="space-y-1">
                                        <div className="text-muted-foreground">Ubicación</div>
                                        <div className="font-medium truncate">{plaza.ubicacion}</div>
                                      </div>
                                      <div className="space-y-1">
                                        <div className="text-muted-foreground">Horas/Semana</div>
                                        <div className="font-medium">{plaza.horasSemana}h</div>
                                      </div>
                                      <div className="space-y-1">
                                        <div className="text-muted-foreground">Período</div>
                                        <div className="font-medium">{plaza.periodoAcademico}</div>
                                      </div>
                                      <div className="space-y-1">
                                        <div className="text-muted-foreground">Cupos</div>
                                        <div className="font-medium">
                                          <span className={plaza.ocupadas >= plaza.capacidad ? 'text-red-600' : 'text-green-600'}>
                                            {plaza.ocupadas}
                                          </span>
                                          /{plaza.capacidad}
                                        </div>
                                      </div>
                                    </div>
                                    {plaza.horario && plaza.horario.length > 0 && (
                                      <div>
                                        <div className="text-xs text-muted-foreground mb-1.5">Horario</div>
                                        <div className="flex flex-wrap gap-1.5">
                                          {plaza.horario.map((h, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                                              {h.dia}: {h.horaInicio}-{h.horaFin}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <Card className="border-dashed border-2 border-gray-200">
                              <CardContent className="p-6 text-center">
                                <Building className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                                <p className="text-sm text-muted-foreground">Sin plazas asignadas</p>
                              </CardContent>
                            </Card>
                          )}
                        </div>

                        {/* Ayudantes Asignados Column */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-base text-primary flex items-center gap-2">
                              <UserCheck className="h-4 w-4" />
                              Ayudantes Asignados
                            </h4>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                              {supervisor.cantidadAyudantes}
                            </Badge>
                          </div>

                          {supervisor.estudiantesSupervisionados.length > 0 ? (
                            <div className="space-y-3">
                              {supervisor.estudiantesSupervisionados.map((estudiante) => (
                                <Card key={estudiante.id} className="border-blue-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                                  <CardContent className="p-4 space-y-3">
                                    {/* Student Header */}
                                    <div className="flex items-start gap-3">
                                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                                        {estudiante.usuario.nombre.charAt(0)}{estudiante.usuario.apellido.charAt(0)}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm truncate">
                                          {estudiante.usuario.nombre} {estudiante.usuario.apellido}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">{estudiante.usuario.email}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className="text-xs text-muted-foreground">{estudiante.usuario.cedula}</span>
                                          {getEstadoBadge(estudiante.estado)}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Plaza Info */}
                                    {estudiante.plaza ? (
                                      <div className="space-y-2 pt-2 border-t border-gray-100">
                                        <div className="p-2 bg-green-50 border border-green-200 rounded-md">
                                          <p className="font-semibold text-xs text-green-800 truncate">{estudiante.plaza.nombre}</p>
                                          <p className="text-[10px] text-green-600">{estudiante.plaza.ubicacion}</p>
                                        </div>
                                        <div className="space-y-1.5">
                                          <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground flex items-center gap-1">
                                              <Clock className="h-3 w-3" />
                                              Horas:
                                            </span>
                                            <span className="font-bold text-primary">
                                              {parseFloat(estudiante.horasCompletadas).toFixed(0)}/{estudiante.horasRequeridas || 0}
                                            </span>
                                          </div>
                                          <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                              className="bg-gradient-to-r from-primary to-orange-accent rounded-full h-2 transition-all duration-300"
                                              style={{
                                                width: `${Math.min((parseFloat(estudiante.horasCompletadas || 0) / (estudiante.horasRequeridas || 1)) * 100, 100)}%`
                                              }}
                                            />
                                          </div>
                                          <div className="flex items-center justify-between text-[10px]">
                                            <span className="text-muted-foreground">Progreso</span>
                                            <span className="font-medium text-primary">
                                              {((parseFloat(estudiante.horasCompletadas || 0) / (estudiante.horasRequeridas || 1)) * 100).toFixed(1)}%
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                     ) : null}
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <Card className="border-dashed border-2 border-gray-200">
                              <CardContent className="p-6 text-center">
                                <UserCheck className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                                <p className="text-sm text-muted-foreground">Sin ayudantes asignados</p>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Supervisor Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Supervisor</DialogTitle>
            <DialogDescription>
              Complete los datos del nuevo supervisor. Todos los campos marcados con * son obligatorios.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-nombre">Nombre *</Label>
              <Input
                id="create-nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Nombre"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-apellido">Apellido *</Label>
              <Input
                id="create-apellido"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                placeholder="Apellido"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-email">Email *</Label>
              <Input
                id="create-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@unimet.edu.ve"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-cedula">Cédula *</Label>
              <div className="flex gap-2">
                <Select value={cedulaTipo} onValueChange={(tipo) => handleCedulaChange(tipo, cedulaNumero)}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="V">V</SelectItem>
                    <SelectItem value="E">E</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="create-cedula"
                  placeholder="12345678"
                  value={cedulaNumero}
                  onChange={(e) => handleCedulaChange(cedulaTipo, e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password">Contraseña *</Label>
              <Input
                id="create-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-telefono">Teléfono</Label>
              <Input
                id="create-telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="+58 212 1234567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-departamento">Departamento</Label>
              <Input
                id="create-departamento"
                value={formData.departamento}
                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                placeholder="Ej: Ciencias"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-cargo">Cargo</Label>
              <Input
                id="create-cargo"
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                placeholder="Ej: Profesor Asociado"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateSupervisor} className="bg-gradient-primary">
              Crear Supervisor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Supervisor Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Supervisor</DialogTitle>
            <DialogDescription>
              Modifique los datos del supervisor. No se puede cambiar el email ni la cédula.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nombre">Nombre</Label>
              <Input
                id="edit-nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Nombre"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-apellido">Apellido</Label>
              <Input
                id="edit-apellido"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                placeholder="Apellido"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-telefono">Teléfono</Label>
              <Input
                id="edit-telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="+58 212 1234567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-departamento">Departamento</Label>
              <Input
                id="edit-departamento"
                value={formData.departamento}
                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                placeholder="Ej: Ciencias"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-cargo">Cargo</Label>
              <Input
                id="edit-cargo"
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                placeholder="Ej: Profesor Asociado"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditSupervisor} className="bg-gradient-primary">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deactivate Supervisor Alert Dialog */}
      <AlertDialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desactivar Supervisor?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción desactivará al supervisor <strong>{supervisorToDeactivate?.nombre} {supervisorToDeactivate?.apellido}</strong>.
              <br /><br />
              <strong>Consecuencias:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>El supervisor no podrá acceder al sistema</li>
                <li>Todos los ayudantes activos ({supervisorToDeactivate?.cantidadAyudantes || 0}) quedarán sin supervisor</li>
                <li>El registro se mantiene para histórico</li>
                <li>Esta es una operación reversible</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivateSupervisor}
              className="bg-red-500 hover:bg-red-600"
            >
              Desactivar Supervisor
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Activate Supervisor Alert Dialog */}
      <AlertDialog open={isActivateDialogOpen} onOpenChange={setIsActivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Activar Supervisor?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción activará al supervisor <strong>{supervisorToActivate?.nombre} {supervisorToActivate?.apellido}</strong>.
              <br /><br />
              <strong>Efectos:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>El supervisor podrá acceder nuevamente al sistema</li>
                <li>Podrá gestionar ayudantes y reportes</li>
                <li>Su cuenta quedará activa inmediatamente</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleActivateSupervisor}
              className="bg-green-500 hover:bg-green-600"
            >
              Activar Supervisor
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Supervisor Alert Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar Supervisor?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente al supervisor <strong>{supervisorToDelete?.nombre} {supervisorToDelete?.apellido}</strong>.
              Esta operación no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSupervisor}
              className="bg-red-600 hover:bg-red-700"
              disabled={!!deletingUserId}
            >
              {deletingUserId ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GestionSupervisores;
