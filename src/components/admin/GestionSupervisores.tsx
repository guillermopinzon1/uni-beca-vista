import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Eye, Edit, Users } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartamento, setFilterDepartamento] = useState("todos");
  const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);

  // Mock data
  const supervisores: Supervisor[] = [
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
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Supervisor
        </Button>
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
                                  <TableRow key={estudiante.id}>
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
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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
    </div>
  );
};

export default GestionSupervisores;