import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Users, 
  FileCheck, 
  Download, 
  Eye, 
  Edit, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter
} from "lucide-react";

interface Applicant {
  id: string;
  nombre: string;
  cedula: string;
  edad: number;
  email: string;
  promedio: number;
  estado: "En Revisión" | "Seleccionado" | "No Seleccionado" | "Pendiente PDU";
  pduResultado?: number;
  fechaPostulacion: string;
  carreraInteres: string;
}

interface Scholarship {
  id: string;
  estudiante: string;
  carrera: string;
  periodoActual: number;
  iaa: number;
  creditosAprobados: number;
  estadoBeca: "Activa" | "En Riesgo" | "Suspendida";
  pagosRequeridos: number;
  observaciones: string;
}

const AdminPanel = () => {
  const [selectedTab, setSelectedTab] = useState("aspirantes");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  // Datos de ejemplo para aspirantes
  const aspirantes: Applicant[] = [
    {
      id: "IMP-2024-015",
      nombre: "Ana María Rodríguez",
      cedula: "V-28456789",
      edad: 18,
      email: "ana.rodriguez@email.com",
      promedio: 18.5,
      estado: "En Revisión",
      fechaPostulacion: "2024-01-20",
      carreraInteres: "Ingeniería Industrial"
    },
    {
      id: "IMP-2024-016",
      nombre: "Carlos Eduardo Pérez",
      cedula: "V-29123456",
      edad: 19,
      email: "carlos.perez@email.com",
      promedio: 17.8,
      estado: "Seleccionado",
      pduResultado: 75,
      fechaPostulacion: "2024-01-18",
      carreraInteres: "Ingeniería en Sistemas"
    },
    {
      id: "IMP-2024-017",
      nombre: "María José González",
      cedula: "V-27789123",
      edad: 20,
      email: "maria.gonzalez@email.com",
      promedio: 16.2,
      estado: "No Seleccionado",
      pduResultado: 25,
      fechaPostulacion: "2024-01-15",
      carreraInteres: "Administración"
    }
  ];

  // Datos de ejemplo para becarios
  const becarios: Scholarship[] = [
    {
      id: "IMP-2023-001",
      estudiante: "Laura Martínez",
      carrera: "Ingeniería Civil",
      periodoActual: 4,
      iaa: 16.8,
      creditosAprobados: 60,
      estadoBeca: "Activa",
      pagosRequeridos: 0,
      observaciones: "Excelente rendimiento académico"
    },
    {
      id: "IMP-2023-005",
      estudiante: "Roberto Silva",
      carrera: "Ingeniería en Sistemas",
      periodoActual: 6,
      iaa: 11.5,
      creditosAprobados: 85,
      estadoBeca: "En Riesgo",
      pagosRequeridos: 1200,
      observaciones: "IAA por debajo del mínimo requerido"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Seleccionado":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Seleccionado</Badge>;
      case "No Seleccionado":
        return <Badge variant="destructive">No Seleccionado</Badge>;
      case "En Revisión":
        return <Badge variant="secondary">En Revisión</Badge>;
      case "Activa":
        return <Badge className="bg-green-100 text-green-800">Activa</Badge>;
      case "En Riesgo":
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="h-3 w-3 mr-1" />En Riesgo</Badge>;
      case "Suspendida":
        return <Badge variant="destructive">Suspendida</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredAspirants = aspirantes.filter(aspirante => {
    const matchesSearch = aspirante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         aspirante.cedula.includes(searchTerm);
    const matchesStatus = statusFilter === "todos" || aspirante.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Panel de Administración - Beca Impacto
          </CardTitle>
          <CardDescription>
            Gestión centralizada de aspirantes y becarios del programa de impacto
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="aspirantes">Aspirantes</TabsTrigger>
          <TabsTrigger value="becarios">Becarios</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
          <TabsTrigger value="configuracion">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="aspirantes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Gestión de Aspirantes
              </CardTitle>
              <CardDescription>
                Validación de requisitos y proceso de selección
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filtros y búsqueda */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre o cédula..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="En Revisión">En Revisión</SelectItem>
                    <SelectItem value="Seleccionado">Seleccionado</SelectItem>
                    <SelectItem value="No Seleccionado">No Seleccionado</SelectItem>
                    <SelectItem value="Pendiente PDU">Pendiente PDU</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Aspirante</TableHead>
                    <TableHead>Edad</TableHead>
                    <TableHead>Promedio</TableHead>
                    <TableHead>PDU</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Carrera</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAspirants.map((aspirante) => (
                    <TableRow key={aspirante.id}>
                      <TableCell className="font-medium">{aspirante.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{aspirante.nombre}</div>
                          <div className="text-sm text-muted-foreground">{aspirante.cedula}</div>
                        </div>
                      </TableCell>
                      <TableCell>{aspirante.edad}</TableCell>
                      <TableCell>
                        <Badge className={aspirante.promedio >= 15 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {aspirante.promedio.toFixed(2)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {aspirante.pduResultado ? (
                          <Badge className={aspirante.pduResultado >= 30 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {aspirante.pduResultado}%
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">Pendiente</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(aspirante.estado)}</TableCell>
                      <TableCell className="text-sm">{aspirante.carreraInteres}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
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

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">{aspirantes.length}</div>
                <p className="text-xs text-muted-foreground">Total Aspirantes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-green-600">{aspirantes.filter(a => a.estado === "Seleccionado").length}</div>
                <p className="text-xs text-muted-foreground">Seleccionados</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-yellow-600">{aspirantes.filter(a => a.estado === "En Revisión").length}</div>
                <p className="text-xs text-muted-foreground">En Revisión</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-blue-600">{aspirantes.filter(a => a.promedio >= 15).length}</div>
                <p className="text-xs text-muted-foreground">Cumplen Promedio</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="becarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Seguimiento de Becarios
              </CardTitle>
              <CardDescription>
                Monitoreo del desempeño académico y cumplimiento de compromisos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Becario</TableHead>
                    <TableHead>Carrera</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>IAA</TableHead>
                    <TableHead>Créditos</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Pagos</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {becarios.map((becario) => (
                    <TableRow key={becario.id}>
                      <TableCell className="font-medium">{becario.id}</TableCell>
                      <TableCell>{becario.estudiante}</TableCell>
                      <TableCell>{becario.carrera}</TableCell>
                      <TableCell>{becario.periodoActual}</TableCell>
                      <TableCell>
                        <Badge className={becario.iaa >= 12 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {becario.iaa.toFixed(2)}
                        </Badge>
                      </TableCell>
                      <TableCell>{becario.creditosAprobados}</TableCell>
                      <TableCell>{getStatusBadge(becario.estadoBeca)}</TableCell>
                      <TableCell>
                        {becario.pagosRequeridos > 0 ? (
                          <Badge variant="destructive">${becario.pagosRequeridos}</Badge>
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
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

          {/* Alertas y seguimiento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Becarios en Riesgo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-yellow-700 mb-2">
                  {becarios.filter(b => b.estadoBeca === "En Riesgo").length} becarios requieren atención
                </p>
                <Button variant="outline" size="sm">
                  Ver Detalles
                </Button>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Pagos Pendientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700 mb-2">
                  Total: ${becarios.reduce((sum, b) => sum + b.pagosRequeridos, 0).toLocaleString()}
                </p>
                <Button variant="outline" size="sm">
                  Gestionar
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reportes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Reportes y Estadísticas
              </CardTitle>
              <CardDescription>
                Genera reportes exportables sobre el programa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <Download className="h-6 w-6 mb-2" />
                  <span>Listado de Beneficiarios</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <Download className="h-6 w-6 mb-2" />
                  <span>Reporte de Créditos</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <Download className="h-6 w-6 mb-2" />
                  <span>Costos Reconocidos</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <Download className="h-6 w-6 mb-2" />
                  <span>Seguimiento Académico</span>
                </Button>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Estadísticas Generales</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-primary">{becarios.length}</div>
                    <div className="text-sm text-muted-foreground">Becarios Activos</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {((becarios.filter(b => b.iaa >= 12).length / becarios.length) * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Cumplen IAA</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      ${becarios.reduce((sum, b) => sum + b.pagosRequeridos, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Pagos Pendientes</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuracion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Programa</CardTitle>
              <CardDescription>
                Ajustes y parámetros del programa de becas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Promedio Mínimo Requerido</label>
                  <Input type="number" defaultValue="15.00" step="0.01" />
                </div>
                <div>
                  <label className="text-sm font-medium">Edad Máxima</label>
                  <Input type="number" defaultValue="21" />
                </div>
                <div>
                  <label className="text-sm font-medium">IAA Mínimo para Mantener Beca</label>
                  <Input type="number" defaultValue="12.00" step="0.01" />
                </div>
                <div>
                  <label className="text-sm font-medium">Percentil Mínimo PDU</label>
                  <Input type="number" defaultValue="30" />
                </div>
              </div>
              <Button className="mt-4">Guardar Configuración</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;