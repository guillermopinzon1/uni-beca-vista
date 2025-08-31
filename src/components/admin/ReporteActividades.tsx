import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Calendar, Clock, FileText, BarChart3 } from "lucide-react";
import { useState } from "react";

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

const ReporteActividades = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [filterPeriodo, setFilterPeriodo] = useState("2024-2");

  // Mock data
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
      actividades: ["Catalogación de libros", "Atención al usuario", "Digitalización de documentos"],
      estado: "Completo",
      fechaUltimoReporte: "2024-12-15",
      observaciones: "Cumplió satisfactoriamente con todas las horas requeridas"
    },
    {
      id: "3",
      estudiante: "Diego Morales Ruiz",
      cedula: "V-33445566",
      supervisor: "Prof. Ana García",
      plaza: "Departamento de Admisión",
      periodo: "2024-2",
      horasRequeridas: 80,
      horasCompletadas: 45,
      actividades: ["Atención al público", "Procesamiento de documentos", "Apoyo administrativo"],
      estado: "Atrasado",
      fechaUltimoReporte: "2024-11-28",
      observaciones: "Necesita ponerse al día con las horas de trabajo"
    },
    {
      id: "4",
      estudiante: "Valeria Castro López",
      cedula: "V-44556677",
      supervisor: "Dra. Laura Mendoza",
      plaza: "Centro de Investigación",
      periodo: "2024-2",
      horasRequeridas: 90,
      horasCompletadas: 20,
      actividades: ["Apoyo en investigación", "Revisión bibliográfica", "Preparación de materiales"],
      estado: "Pendiente",
      fechaUltimoReporte: "2024-12-01"
    }
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Completo":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completo</Badge>;
      case "En Progreso":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">En Progreso</Badge>;
      case "Pendiente":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>;
      case "Atrasado":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Atrasado</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getProgresoPorcentaje = (completadas: number, requeridas: number) => {
    return Math.round((completadas / requeridas) * 100);
  };

  const filteredReportes = reportes.filter(reporte => {
    const matchesSearch = reporte.estudiante.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reporte.cedula.includes(searchTerm) ||
                         reporte.supervisor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reporte.plaza.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = filterEstado === "todos" || reporte.estado === filterEstado;
    const matchesPeriodo = filterPeriodo === "todos" || reporte.periodo === filterPeriodo;
    
    return matchesSearch && matchesEstado && matchesPeriodo;
  });

  const estadisticas = {
    total: reportes.length,
    completos: reportes.filter(r => r.estado === "Completo").length,
    enProgreso: reportes.filter(r => r.estado === "En Progreso").length,
    atrasados: reportes.filter(r => r.estado === "Atrasado").length,
    promedioHoras: Math.round(reportes.reduce((sum, r) => sum + r.horasCompletadas, 0) / reportes.length)
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary">Reporte de Actividades</h2>
          <p className="text-muted-foreground">Seguimiento de actividades de ayudantías</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Reportes
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <BarChart3 className="h-4 w-4 mr-2" />
            Generar Informe
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por estudiante, supervisor o plaza..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterPeriodo} onValueChange={setFilterPeriodo}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="2024-2">2024-2</SelectItem>
                <SelectItem value="2024-1">2024-1</SelectItem>
                <SelectItem value="2023-2">2023-2</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Completo">Completo</SelectItem>
                <SelectItem value="En Progreso">En Progreso</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Atrasado">Atrasado</SelectItem>
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
              <p className="text-sm text-muted-foreground">Total Reportes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{estadisticas.completos}</p>
              <p className="text-sm text-muted-foreground">Completos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{estadisticas.enProgreso}</p>
              <p className="text-sm text-muted-foreground">En Progreso</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{estadisticas.atrasados}</p>
              <p className="text-sm text-muted-foreground">Atrasados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{estadisticas.promedioHoras}</p>
              <p className="text-sm text-muted-foreground">Promedio Horas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de reportes */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes de Actividades ({filteredReportes.length})</CardTitle>
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
                  <TableCell>{reporte.supervisor}</TableCell>
                  <TableCell>{reporte.plaza}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{reporte.horasCompletadas}/{reporte.horasRequeridas} horas</span>
                        <span>{getProgresoPorcentaje(reporte.horasCompletadas, reporte.horasRequeridas)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{
                            width: `${getProgresoPorcentaje(reporte.horasCompletadas, reporte.horasRequeridas)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getEstadoBadge(reporte.estado)}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(reporte.fechaUltimoReporte).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" title="Ver detalles">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Ver calendario">
                        <Calendar className="h-4 w-4" />
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

export default ReporteActividades;