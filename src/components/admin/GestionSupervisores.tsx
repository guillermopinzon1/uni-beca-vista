import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Eye, Edit, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUsers } from "@/lib/api";
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
    correo: "",
    cedula: "",
    departamento: "",
    cargo: "",
    estudiantes: [] as string[]
  });

  const handleEditSupervisor = (supervisor: Supervisor) => {
    setEditingSupervisor(supervisor);
    setFormData({
      nombre: supervisor.nombre,
      correo: supervisor.email,
      cedula: supervisor.cedula,
      departamento: supervisor.departamento,
      cargo: supervisor.cargo,
      estudiantes: ["1", "2"] // Simulando estudiantes asignados
    });
    setIsEditModalOpen(true);
  };

  const handleEstudianteClick = (estudianteId: string) => {
    navigate(`/estudiante/${estudianteId}`);
  };

  // Lista de estudiantes disponibles para asignar
  const estudiantesDisponibles = [
    { id: "1", nombre: "María González Rodríguez", cedula: "V-27543123" },
    { id: "2", nombre: "Carlos López Martínez", cedula: "V-28456789" },
    { id: "3", nombre: "Ana Sofía Ramírez", cedula: "V-29567890" },
    { id: "4", nombre: "Luis Fernando Torres", cedula: "V-30678901" },
    { id: "5", nombre: "Daniela Vásquez Castro", cedula: "V-31789012" },
    { id: "6", nombre: "Pedro Miguel Santos", cedula: "V-32890123" },
    { id: "7", nombre: "Isabella Morales Cruz", cedula: "V-33901234" },
    { id: "8", nombre: "Diego Alejandro Ruiz", cedula: "V-34012345" }
  ];

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Supervisor creado",
      description: "El supervisor ha sido creado exitosamente.",
    });
    setIsModalOpen(false);
    setFormData({
      nombre: "",
      correo: "",
      cedula: "",
      departamento: "",
      cargo: "",
      estudiantes: []
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Supervisor actualizado",
      description: "Los datos del supervisor han sido actualizados exitosamente.",
    });
    setIsEditModalOpen(false);
    setEditingSupervisor(null);
  };

  const loadSupervisores = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) {
      toast({ title: 'Sin sesión', description: 'Inicia sesión para cargar supervisores', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetchUsers(accessToken, { role: 'supervisor' });
      const mapped = res.data.usuarios.map(u => ({
        id: u.id,
        nombre: u.nombre + (u.apellido ? ` ${u.apellido}` : ''),
        cedula: u.cedula || 'N/A',
        departamento: u.departamento || 'N/A',
        cargo: u.cargo || 'N/A',
        email: u.email,
        telefono: u.telefono || 'N/A',
        estudiantesAsignados: 0, // TODO: obtener del endpoint correspondiente
        maxEstudiantes: 5, // TODO: obtener del endpoint correspondiente
        estado: u.activo ? "Activo" : "Inactivo",
        fechaIngreso: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : 'N/A'
      }));
      setSupervisores(mapped);
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'No se pudieron cargar los supervisores', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSupervisores();
  }, [tokens?.accessToken]);

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

  const filteredSupervisores = supervisores.filter(supervisor => {
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
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
                  <Label htmlFor="nombre">Nombre Completo</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    placeholder="Ingrese el nombre completo"
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
                  <Input
                    id="cedula"
                    value={formData.cedula}
                    onChange={(e) => handleInputChange("cedula", e.target.value)}
                    placeholder="V-12345678"
                    required
                  />
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
                        <div key={estudianteId} className="flex items-center justify-between bg-background p-2 rounded border">
                          <span className="text-sm">{estudiante?.nombre} - {estudiante?.cedula}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              handleInputChange("estudiantes", formData.estudiantes.filter(id => id !== estudianteId));
                            }}
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

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">24</p>
              <p className="text-sm text-muted-foreground">Total Supervisores</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">22</p>
              <p className="text-sm text-muted-foreground">Activos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">142</p>
              <p className="text-sm text-muted-foreground">Estudiantes Supervisados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de supervisores */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Supervisores ({filteredSupervisores.length})</CardTitle>
        </CardHeader>
        <CardContent>
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
                                  <TableHead>Carrera</TableHead>
                                  <TableHead>Tipo de Beca</TableHead>
                                  <TableHead>Promedio</TableHead>
                                  <TableHead>Estado</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {estudiantesAsignados.map((estudiante) => (
                                  <TableRow 
                                    key={estudiante.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => handleEstudianteClick(estudiante.id)}
                                  >
                                    <TableCell className="font-medium">{estudiante.nombre}</TableCell>
                                    <TableCell>{estudiante.carrera}</TableCell>
                                    <TableCell>
                                      <Badge variant="outline">{estudiante.tipoBeca}</Badge>
                                    </TableCell>
                                    <TableCell>{estudiante.promedio}</TableCell>
                                    <TableCell>
                                      <Badge className="bg-green-100 text-green-800 border-green-200">
                                        {estudiante.estado}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
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
        </CardContent>
        </Card>

        {/* Modal de Edición */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Supervisor</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nombre">Nombre Completo</Label>
                  <Input
                    id="edit-nombre"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    placeholder="Ingrese el nombre completo"
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
                  <Input
                    id="edit-cedula"
                    value={formData.cedula}
                    onChange={(e) => handleInputChange("cedula", e.target.value)}
                    placeholder="V-12345678"
                    required
                  />
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
                  <Label>Estudiantes Asignados:</Label>
                  <div className="bg-muted/20 p-3 rounded-lg space-y-2">
                    {formData.estudiantes.map((estudianteId) => {
                      const estudiante = estudiantesDisponibles.find(e => e.id === estudianteId);
                      return (
                        <div key={estudianteId} className="flex items-center justify-between bg-background p-2 rounded border">
                          <span className="text-sm">{estudiante?.nombre} - {estudiante?.cedula}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              handleInputChange("estudiantes", formData.estudiantes.filter(id => id !== estudianteId));
                            }}
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
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default GestionSupervisores;