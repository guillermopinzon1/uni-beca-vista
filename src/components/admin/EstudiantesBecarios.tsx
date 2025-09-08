import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Eye, Calendar, Clock, FileText, BarChart3 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface ReporteActividad {
  id: string;
  estudiante: string;
  cedula: string;
  supervisor: string;
  plaza: string;
  periodo: string;
  horasRequeridas: number;
  horasCompletadas: number;
  actividades: string[];
  estado: "Completo" | "En Progreso" | "Pendiente" | "Atrasado";
  fechaUltimoReporte: string;
  observaciones?: string;
}

const EstudiantesBecarios = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBeca, setFilterBeca] = useState("todos");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [activeTab, setActiveTab] = useState("estudiantes");
  
  // Estados para reportes de actividades
  const [searchTermReportes, setSearchTermReportes] = useState("");
  const [filterEstadoReportes, setFilterEstadoReportes] = useState("todos");
  const [filterPeriodo, setFilterPeriodo] = useState("2024-2");

  const handleVerDetalles = (estudianteId: string) => {
    navigate(`/estudiante/${estudianteId}`);
  };

  // Mock data para estudiantes
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
      nombre: "Carlos Rodríguez Pérez",
      cedula: "V-23456789",
      carrera: "Administración",
      semestre: 6,
      promedio: 17.2,
      tipoBeca: "Ayudantía",
      estado: "Activo",
      supervisor: "Prof. Ana Martínez",
      fechaInicio: "2024-09-01"
    },
    {
      id: "3",
      nombre: "María González Silva",
      cedula: "V-34567890",
      carrera: "Psicología",
      semestre: 7,
      promedio: 18.8,
      tipoBeca: "Impacto Social",
      estado: "Suspendido",
      supervisor: "Dra. Laura Vásquez",
      fechaInicio: "2024-09-01"
    }
  ];

  // Mock data para reportes de actividades
  const reportes: ReporteActividad[] = [
    {
      id: "1",
      estudiante: "Luis Rodríguez Silva",
      cedula: "V-87654321",
      supervisor: "Prof. María Fernández",
      plaza: "Laboratorio de Sistemas",
      periodo: "2024-2",
      horasRequeridas: 120,
      horasCompletadas: 95,
      actividades: ["Apoyo en clases prácticas", "Mantenimiento de equipos", "Tutoría a estudiantes"],
      estado: "En Progreso",
      fechaUltimoReporte: "2024-12-10",
      observaciones: "Excelente desempeño en todas las actividades asignadas"
    },
    {
      id: "2",
      estudiante: "Carmen Pérez Torres",
      cedula: "V-11223344",
      supervisor: "Dr. Roberto Sánchez",
      plaza: "Biblioteca Central",
      periodo: "2024-2",
      horasRequeridas: 100,
      horasCompletadas: 100,
      actividades: ["Organización de material", "Atención a usuarios", "Catalogación"],
      estado: "Completo",
      fechaUltimoReporte: "2024-12-15",
      observaciones: "Completó todas las horas requeridas satisfactoriamente"
    },
    {
      id: "3",
      estudiante: "Diego Martínez Ruiz",
      cedula: "V-55667788",
      supervisor: "Ing. Laura Vásquez",
      plaza: "Laboratorio de Química",
      periodo: "2024-2",
      horasRequeridas: 90,
      horasCompletadas: 45,
      actividades: ["Preparación de reactivos", "Limpieza de equipos"],
      estado: "Atrasado",
      fechaUltimoReporte: "2024-11-20",
      observaciones: "Necesita mejorar la asistencia y cumplimiento de horarios"
    }
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Activo":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Activo</Badge>;
      case "Suspendido":
        return <Badge variant="destructive">Suspendido</Badge>;
      case "Finalizado":
        return <Badge variant="secondary">Finalizado</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getEstadoReporteBadge = (estado: string) => {
    switch (estado) {
      case "Completo":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completo</Badge>;
      case "En Progreso":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">En Progreso</Badge>;
      case "Pendiente":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>;
      case "Atrasado":
        return <Badge variant="destructive">Atrasado</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getProgresoColor = (completadas: number, requeridas: number) => {
    const porcentaje = (completadas / requeridas) * 100;
    if (porcentaje >= 90) return "bg-green-500";
    if (porcentaje >= 70) return "bg-blue-500";
    if (porcentaje >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const filteredEstudiantes = estudiantes.filter(estudiante => {
    const matchesSearch = 
      estudiante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.carrera.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBeca = filterBeca === "todos" || estudiante.tipoBeca === filterBeca;
    const matchesEstado = filterEstado === "todos" || estudiante.estado === filterEstado;
    
    return matchesSearch && matchesBeca && matchesEstado;
  });

  const filteredReportes = reportes.filter(reporte => {
    const matchesSearch = 
      reporte.estudiante.toLowerCase().includes(searchTermReportes.toLowerCase()) ||
      reporte.cedula.toLowerCase().includes(searchTermReportes.toLowerCase()) ||
      reporte.supervisor.toLowerCase().includes(searchTermReportes.toLowerCase());
    
    const matchesEstado = filterEstadoReportes === "todos" || reporte.estado === filterEstadoReportes;
    const matchesPeriodo = reporte.periodo === filterPeriodo;
    
    return matchesSearch && matchesEstado && matchesPeriodo;
  });

  // Estadísticas para reportes
  const estadisticasReportes = {
    total: reportes.length,
    completos: reportes.filter(r => r.estado === "Completo").length,
    enProgreso: reportes.filter(r => r.estado === "En Progreso").length,
    atrasados: reportes.filter(r => r.estado === "Atrasado").length,
    horasTotales: reportes.reduce((acc, r) => acc + r.horasCompletadas, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Gestión de Estudiantes y Reportes</h2>
          <p className="text-muted-foreground">Administración de estudiantes becarios y seguimiento de actividades</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="estudiantes" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Estudiantes Becarios</span>
          </TabsTrigger>
          <TabsTrigger value="reportes" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Reporte de Actividades</span>
          </TabsTrigger>
        </TabsList>

        {/* Pestaña Estudiantes Becarios */}
        <TabsContent value="estudiantes" className="space-y-6">
          
          {/* Filtros para Estudiantes */}
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
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los Estados</SelectItem>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Suspendido">Suspendido</SelectItem>
                    <SelectItem value="Finalizado">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas de Estudiantes */}
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
              <div className="flex items-center justify-between">
                <CardTitle>Lista de Estudiantes Becarios ({filteredEstudiantes.length})</CardTitle>
                <Badge variant="secondary" className="text-orange">
                  {filteredEstudiantes.length} estudiantes encontrados
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>Carrera</TableHead>
                    <TableHead>Trimestre</TableHead>
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
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleVerDetalles(estudiante.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </TabsContent>

        {/* Pestaña Reporte de Actividades */}
        <TabsContent value="reportes" className="space-y-6">
          
          {/* Filtros para Reportes */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por estudiante, cédula o supervisor..."
                    value={searchTermReportes}
                    onChange={(e) => setSearchTermReportes(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={filterPeriodo} onValueChange={setFilterPeriodo}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-2">2024-2</SelectItem>
                    <SelectItem value="2024-1">2024-1</SelectItem>
                    <SelectItem value="2023-3">2023-3</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterEstadoReportes} onValueChange={setFilterEstadoReportes}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los Estados</SelectItem>
                    <SelectItem value="Completo">Completo</SelectItem>
                    <SelectItem value="En Progreso">En Progreso</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="Atrasado">Atrasado</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-primary hover:bg-primary/90">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de reportes de actividades */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Reportes de Actividades ({filteredReportes.length})</CardTitle>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Período: {filterPeriodo}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
                  {filteredReportes.map((reporte) => (
                    <TableRow key={reporte.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{reporte.estudiante}</p>
                          <p className="text-sm text-muted-foreground">{reporte.cedula}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{reporte.supervisor}</TableCell>
                      <TableCell className="text-sm">{reporte.plaza}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getProgresoColor(reporte.horasCompletadas, reporte.horasRequeridas)}`}
                              style={{ width: `${Math.min((reporte.horasCompletadas / reporte.horasRequeridas) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">
                            {reporte.horasCompletadas}/{reporte.horasRequeridas}h
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getEstadoReporteBadge(reporte.estado)}</TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{new Date(reporte.fechaUltimoReporte).toLocaleDateString('es-ES')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" title="Ver detalles">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" title="Descargar reporte">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </TabsContent>

      </Tabs>
    </div>
  );
};

export default EstudiantesBecarios;