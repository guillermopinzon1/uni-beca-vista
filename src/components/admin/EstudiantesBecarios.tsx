import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Eye } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface EstudianteBecario {
  id: string;
  nombre: string;
  cedula: string;
  carrera: string;
  semestre: number;
  promedio: number;
  tipoBeca: string;
  estado: "Activo" | "Suspendido" | "Finalizado";
  supervisor: string;
  fechaInicio: string;
  fechaFin?: string;
}

const EstudiantesBecarios = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBeca, setFilterBeca] = useState("todos");
  const [filterEstado, setFilterEstado] = useState("todos");

  const handleVerDetalles = (estudianteId: string) => {
    navigate(`/estudiante/${estudianteId}`);
  };

  // Mock data
  const estudiantes: EstudianteBecario[] = [
    {
      id: "1",
      nombre: "Ana García López",
      cedula: "V-12345678",
      carrera: "Ingeniería de Sistemas",
      semestre: 8,
      promedio: 18.5,
      tipoBeca: "Excelencia Académica",
      estado: "Activo",
      supervisor: "Dr. Carlos Mendoza",
      fechaInicio: "2024-09-01"
    },
    {
      id: "2",
      nombre: "Luis Rodríguez Silva",
      cedula: "V-87654321",
      carrera: "Administración",
      semestre: 6,
      promedio: 17.2,
      tipoBeca: "Ayudantía",
      estado: "Activo",
      supervisor: "Prof. María Fernández",
      fechaInicio: "2024-08-15"
    },
    {
      id: "3",
      nombre: "Carmen Pérez Torres",
      cedula: "V-11223344",
      carrera: "Psicología",
      semestre: 7,
      promedio: 19.1,
      tipoBeca: "Impacto Social",
      estado: "Suspendido",
      supervisor: "Dra. Ana Morales",
      fechaInicio: "2024-07-01"
    }
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Activo":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Activo</Badge>;
      case "Suspendido":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Suspendido</Badge>;
      case "Finalizado":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Finalizado</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const filteredEstudiantes = estudiantes.filter(estudiante => {
    const matchesSearch = estudiante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         estudiante.cedula.includes(searchTerm) ||
                         estudiante.carrera.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBeca = filterBeca === "todos" || estudiante.tipoBeca === filterBeca;
    const matchesEstado = filterEstado === "todos" || estudiante.estado === filterEstado;
    
    return matchesSearch && matchesBeca && matchesEstado;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary">Estudiantes Becarios</h2>
          <p className="text-muted-foreground">Gestión de estudiantes con becas activas</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Download className="h-4 w-4 mr-2" />
          Exportar Lista
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, cédula o carrera..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterBeca} onValueChange={setFilterBeca}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo de Beca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las Becas</SelectItem>
                <SelectItem value="Excelencia Académica">Excelencia Académica</SelectItem>
                <SelectItem value="Ayudantía">Ayudantía</SelectItem>
                <SelectItem value="Impacto Social">Impacto Social</SelectItem>
                <SelectItem value="Formación Docente">Formación Docente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Suspendido">Suspendido</SelectItem>
                <SelectItem value="Finalizado">Finalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">156</p>
              <p className="text-sm text-muted-foreground">Total Becarios</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">142</p>
              <p className="text-sm text-muted-foreground">Activos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">8</p>
              <p className="text-sm text-muted-foreground">Suspendidos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de estudiantes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Estudiantes Becarios ({filteredEstudiantes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudiante</TableHead>
                <TableHead>Carrera</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead>Promedio</TableHead>
                <TableHead>Tipo de Beca</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Supervisor</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEstudiantes.map((estudiante) => (
                <TableRow key={estudiante.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{estudiante.nombre}</p>
                      <p className="text-sm text-muted-foreground">{estudiante.cedula}</p>
                    </div>
                  </TableCell>
                  <TableCell>{estudiante.carrera}</TableCell>
                  <TableCell>{estudiante.semestre}°</TableCell>
                  <TableCell>
                    <span className="font-medium">{estudiante.promedio}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{estudiante.tipoBeca}</Badge>
                  </TableCell>
                  <TableCell>{getEstadoBadge(estudiante.estado)}</TableCell>
                  <TableCell className="text-sm">{estudiante.supervisor}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleVerDetalles(estudiante.id)}
                      >
                        <Eye className="h-4 w-4" />
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

export default EstudiantesBecarios;