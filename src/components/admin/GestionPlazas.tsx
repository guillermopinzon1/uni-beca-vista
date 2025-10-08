import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Users, Building, MapPin, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { fetchPlazas, createPlaza, fetchUsers } from "@/lib/api";

interface Plaza {
  id: string;
  nombre: string;
  departamento: string;
  ubicacion: string;
  supervisor: string;
  capacidadMaxima: number;
  ayudantesActuales: number;
  tipoActividad: string;
  horarios: string[];
  estado: "Activa" | "Inactiva" | "Completa";
  descripcion: string;
  requisitos: string[];
  fechaCreacion: string;
}

interface AyudanteEnPlaza {
  id: string;
  nombre: string;
  cedula: string;
  carrera: string;
  horario: string;
  estado: string;
}

const GestionPlazas = () => {
  const { toast } = useToast();
  const { tokens } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartamento, setFilterDepartamento] = useState("todos");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [selectedPlaza, setSelectedPlaza] = useState<Plaza | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [plazas, setPlazas] = useState<Plaza[]>([]);
  const [loading, setLoading] = useState(false);
  const [supervisores, setSupervisores] = useState<Array<{id: string, nombre: string, apellido?: string, email: string}>>([]);
  const [loadingSupervisores, setLoadingSupervisores] = useState(false);

  console.log('GestionPlazas component rendering');
  const [formData, setFormData] = useState({
    materia: "",
    codigo: "",
    departamento: "",
    ubicacion: "",
    profesor: "",
    capacidad: 1,
    ocupadas: 0,
    horario: [{ dia: "Lunes", horaInicio: "08:00", horaFin: "12:00" }],
    estado: "Activa",
    tipoAyudantia: "academica",
    descripcionActividades: "",
    requisitosEspeciales: [""],
    horasSemana: 10,
    periodoAcademico: "2025-1",
    fechaInicio: "",
    fechaFin: "",
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
        departamento: filterDepartamento !== 'todos' ? filterDepartamento : undefined,
        estado: filterEstado !== 'todos' ? filterEstado : undefined,
        search: searchTerm || undefined,
        limit: 20,
        offset: 0
      });
      const mapped = res.data.plazas.map(p => ({
        id: p.id,
        nombre: p.materia,
        departamento: p.departamento,
        ubicacion: p.ubicacion,
        supervisor: p.supervisor.nombre + (p.supervisor.apellido ? ` ${p.supervisor.apellido}` : ''),
        capacidadMaxima: p.capacidad,
        ayudantesActuales: p.ocupadas,
        tipoActividad: p.tipoAyudantia,
        horarios: p.horario.map(h => `${h.dia} ${h.horaInicio}-${h.horaFin}`),
        estado: p.estado as "Activa" | "Inactiva" | "Completa",
        descripcion: p.descripcionActividades,
        requisitos: p.requisitosEspeciales,
        fechaCreacion: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : 'N/A'
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
      
      const plazaData = {
        ...formData,
        requisitosEspeciales: requisitos,
        fechaInicio: formData.fechaInicio || new Date().toISOString().split('T')[0],
        fechaFin: formData.fechaFin || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      
      await createPlaza(accessToken, plazaData);
      toast({ title: 'Éxito', description: 'Plaza creada exitosamente' });
      setIsCreating(false);
      setFormData({
        materia: "",
        codigo: "",
        departamento: "",
        ubicacion: "",
        profesor: "",
        capacidad: 1,
        ocupadas: 0,
        horario: [{ dia: "Lunes", horaInicio: "08:00", horaFin: "12:00" }],
        estado: "Activa",
        tipoAyudantia: "academica",
        descripcionActividades: "",
        requisitosEspeciales: [""],
        horasSemana: 10,
        periodoAcademico: "2025-1",
        fechaInicio: "",
        fechaFin: "",
        supervisorResponsable: "",
        observaciones: ""
      });
      await loadPlazas();
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'No se pudo crear la plaza', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
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
      const res = await fetchUsers(accessToken, { role: 'supervisor' });
      console.log('Supervisores response:', res);
      const mapped = res.data.usuarios.map(u => ({
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

  useEffect(() => {
    if (tokens?.accessToken) {
      loadPlazas();
      loadSupervisores();
    }
  }, [tokens?.accessToken, filterDepartamento, filterEstado, searchTerm]);

  // Mock data (temporal)
  const plazasMock: Plaza[] = [
    {
      id: "1",
      nombre: "Laboratorio de Sistemas",
      departamento: "Ingeniería",
      ubicacion: "Edificio A, Piso 3",
      supervisor: "Prof. María Fernández",
      capacidadMaxima: 6,
      ayudantesActuales: 4,
      tipoActividad: "Apoyo Técnico",
      horarios: ["Lunes 8:00-12:00", "Miércoles 14:00-18:00", "Viernes 8:00-12:00"],
      estado: "Activa",
      descripcion: "Apoyo en laboratorio de sistemas, mantenimiento de equipos y asistencia en clases prácticas",
      requisitos: ["Estudiante de Ingeniería", "Promedio mínimo 16", "Conocimientos en sistemas"],
      fechaCreacion: "2024-01-15"
    },
    {
      id: "2",
      nombre: "Biblioteca Central",
      departamento: "Servicios Académicos",
      ubicacion: "Edificio Central, Planta Baja",
      supervisor: "Dr. Roberto Sánchez",
      capacidadMaxima: 8,
      ayudantesActuales: 8,
      tipoActividad: "Apoyo Bibliotecario",
      horarios: ["Lunes a Viernes 8:00-17:00", "Sábados 8:00-13:00"],
      estado: "Completa",
      descripcion: "Catalogación, atención al usuario, digitalización de documentos y mantenimiento del acervo",
      requisitos: ["Cualquier carrera", "Promedio mínimo 15", "Habilidades organizacionales"],
      fechaCreacion: "2023-09-01"
    },
    {
      id: "3",
      nombre: "Departamento de Admisión",
      departamento: "Administración",
      ubicacion: "Edificio B, Piso 1",
      supervisor: "Prof. Ana García",
      capacidadMaxima: 4,
      ayudantesActuales: 2,
      tipoActividad: "Apoyo Administrativo",
      horarios: ["Lunes a Viernes 8:00-16:00"],
      estado: "Activa",
      descripcion: "Atención al público, procesamiento de documentos de admisión y apoyo administrativo general",
      requisitos: ["Estudiante de Administración o carreras afines", "Promedio mínimo 16", "Habilidades de atención al cliente"],
      fechaCreacion: "2024-02-20"
    },
    {
      id: "4",
      nombre: "Centro de Investigación",
      departamento: "Investigación",
      ubicacion: "Edificio C, Piso 2",
      supervisor: "Dra. Laura Mendoza",
      capacidadMaxima: 3,
      ayudantesActuales: 1,
      tipoActividad: "Apoyo en Investigación",
      horarios: ["Martes y Jueves 9:00-15:00"],
      estado: "Activa",
      descripcion: "Apoyo en proyectos de investigación, revisión bibliográfica y preparación de materiales",
      requisitos: ["Estudiante de últimos semestres", "Promedio mínimo 17", "Interés en investigación"],
      fechaCreacion: "2024-03-10"
    }
  ];

  const ayudantesEnPlaza: AyudanteEnPlaza[] = [
    {
      id: "1",
      nombre: "Luis Rodríguez Silva",
      cedula: "V-87654321",
      carrera: "Ingeniería de Sistemas",
      horario: "Lunes 8:00-12:00",
      estado: "Activo"
    },
    {
      id: "2",
      nombre: "Ana García López",
      cedula: "V-12345678",
      carrera: "Ingeniería Civil",
      horario: "Miércoles 14:00-18:00",
      estado: "Activo"
    }
  ];

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
                         plaza.supervisor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plaza.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartamento = filterDepartamento === "todos" || plaza.departamento === filterDepartamento;
    const matchesEstado = filterEstado === "todos" || plaza.estado === filterEstado;
    
    return matchesSearch && matchesDepartamento && matchesEstado;
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary">Gestión de Plazas</h2>
          <p className="text-muted-foreground">Administración de plazas de trabajo para ayudantías</p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Plaza
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Plaza</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="materia">Materia *</Label>
                  <Input 
                    id="materia" 
                    value={formData.materia}
                    onChange={(e) => setFormData({...formData, materia: e.target.value})}
                    placeholder="Ej: Cálculo I" 
                  />
                </div>
                <div>
                  <Label htmlFor="codigo">Código *</Label>
                  <Input 
                    id="codigo" 
                    value={formData.codigo}
                    onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                    placeholder="Ej: MAT-101-A" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departamento">Departamento *</Label>
                  <Input 
                    id="departamento" 
                    value={formData.departamento}
                    onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                    placeholder="Ej: Matemáticas" 
                  />
                </div>
                <div>
                  <Label htmlFor="profesor">Profesor *</Label>
                  <Input 
                    id="profesor" 
                    value={formData.profesor}
                    onChange={(e) => setFormData({...formData, profesor: e.target.value})}
                    placeholder="Ej: Dr. Juan Pérez" 
                  />
                </div>
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
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fechaInicio">Fecha Inicio *</Label>
                  <Input 
                    id="fechaInicio" 
                    type="date" 
                    value={formData.fechaInicio}
                    onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="fechaFin">Fecha Fin *</Label>
                  <Input 
                    id="fechaFin" 
                    type="date" 
                    value={formData.fechaFin}
                    onChange={(e) => setFormData({...formData, fechaFin: e.target.value})}
                  />
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
                  disabled={loadingSupervisores}
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
                    )) : (
                      <SelectItem value="" disabled>
                        No hay supervisores disponibles
                      </SelectItem>
                    )}
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
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea 
                  id="observaciones" 
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  placeholder="Plaza prioritaria para el período..." 
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreating(false)} disabled={creating}>
                  Cancelar
                </Button>
                <Button onClick={handleCreatePlaza} disabled={creating}>
                  {creating ? "Creando..." : "Crear Plaza"}
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
            <Select value={filterDepartamento} onValueChange={setFilterDepartamento}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los Departamentos</SelectItem>
                <SelectItem value="Ingeniería">Ingeniería</SelectItem>
                <SelectItem value="Administración">Administración</SelectItem>
                <SelectItem value="Servicios Académicos">Servicios Académicos</SelectItem>
                <SelectItem value="Investigación">Investigación</SelectItem>
              </SelectContent>
            </Select>
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{estadisticas.totalAyudantes}</p>
              <p className="text-sm text-muted-foreground">Ayudantes Asignados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{estadisticas.capacidadTotal}</p>
              <p className="text-sm text-muted-foreground">Capacidad Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de plazas */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Plazas de Ayudantía ({filteredPlazas.length})</CardTitle>
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
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plaza</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Supervisor</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Disponibilidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Cargando plazas...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredPlazas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No se encontraron plazas
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlazas.map((plaza) => (
                <TableRow key={plaza.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{plaza.nombre}</p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {plaza.ubicacion}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{plaza.departamento}</TableCell>
                  <TableCell>{plaza.supervisor}</TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {plaza.ayudantesActuales}/{plaza.capacidadMaxima}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getDisponibilidadBadge(plaza.ayudantesActuales, plaza.capacidadMaxima)}
                  </TableCell>
                  <TableCell>{getEstadoBadge(plaza.estado)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedPlaza(plaza)}
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>
                              Detalles de la Plaza - {plaza.nombre}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Información General</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Ubicación:</span> {plaza.ubicacion}</p>
                                    <p><span className="font-medium">Supervisor:</span> {plaza.supervisor}</p>
                                    <p><span className="font-medium">Tipo:</span> {plaza.tipoActividad}</p>
                                    <p><span className="font-medium">Capacidad:</span> {plaza.capacidadMaxima} ayudantes</p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Horarios</h4>
                                  <ul className="text-sm space-y-1">
                                    {plaza.horarios.map((horario, index) => (
                                      <li key={index} className="flex items-center">
                                        <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                                        {horario}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Descripción</h4>
                                  <p className="text-sm text-muted-foreground">{plaza.descripcion}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Requisitos</h4>
                                  <ul className="text-sm space-y-1">
                                    {plaza.requisitos.map((requisito, index) => (
                                      <li key={index} className="flex items-center">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                        {requisito}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-3">Ayudantes Asignados</h4>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Carrera</TableHead>
                                    <TableHead>Horario</TableHead>
                                    <TableHead>Estado</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {ayudantesEnPlaza.map((ayudante) => (
                                    <TableRow key={ayudante.id}>
                                      <TableCell>
                                        <div>
                                          <p className="font-medium">{ayudante.nombre}</p>
                                          <p className="text-sm text-muted-foreground">{ayudante.cedula}</p>
                                        </div>
                                      </TableCell>
                                      <TableCell>{ayudante.carrera}</TableCell>
                                      <TableCell>{ayudante.horario}</TableCell>
                                      <TableCell>
                                        <Badge className="bg-green-100 text-green-800 border-green-200">
                                          {ayudante.estado}
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default GestionPlazas;