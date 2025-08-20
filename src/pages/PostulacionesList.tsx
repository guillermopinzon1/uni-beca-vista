import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { PostulacionCreateModal } from "@/components/PostulacionCreateModal";

const PostulacionesList = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    periodo: "",
    estado: "all",
    programa_beca_id: ""
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data based on the API structure
  const mockPostulaciones = {
    data: [
      {
        id: 1,
        usuario: {
          nombre: "Juan Carlos",
          apellido: "Pérez González",
          cedula: "V-12345678",
          carnet: "20180001",
          email: "juan.perez@unimet.edu.ve"
        },
        programa_beca: {
          id: 1,
          nombre: "Beca Ayudantía"
        },
        periodo_academico: "2025-1",
        estado: "pendiente",
        fecha_postulacion: "2025-01-15T10:30:00Z",
        fecha_evaluacion: null,
        indice_academico: 16.5,
        creditos_inscritos: 18,
        observaciones: null
      },
      {
        id: 2,
        usuario: {
          nombre: "María Elena",
          apellido: "González López",
          cedula: "V-87654321",
          carnet: "20190045",
          email: "maria.gonzalez@unimet.edu.ve"
        },
        programa_beca: {
          id: 1,
          nombre: "Beca Ayudantía"
        },
        periodo_academico: "2025-1",
        estado: "aprobada",
        fecha_postulacion: "2025-01-10T14:20:00Z",
        fecha_evaluacion: "2025-01-12T09:15:00Z",
        indice_academico: 17.8,
        creditos_inscritos: 15,
        observaciones: "Estudiante destacado con excelente rendimiento académico."
      },
      {
        id: 3,
        usuario: {
          nombre: "Carlos Alberto",
          apellido: "Rodríguez Silva",
          cedula: "V-11223344",
          carnet: "20200012",
          email: "carlos.rodriguez@unimet.edu.ve"
        },
        programa_beca: {
          id: 1,
          nombre: "Beca Ayudantía"
        },
        periodo_academico: "2024-3",
        estado: "en_evaluacion",
        fecha_postulacion: "2025-01-08T16:45:00Z",
        fecha_evaluacion: null,
        indice_academico: 15.2,
        creditos_inscritos: 20,
        observaciones: null
      }
    ],
    pagination: {
      current_page: 1,
      per_page: 10,
      total: 3,
      total_pages: 1,
      has_next: false,
      has_prev: false
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pendiente: { variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800" },
      en_evaluacion: { variant: "secondary" as const, className: "bg-blue-100 text-blue-800" },
      aprobada: { variant: "secondary" as const, className: "bg-green-100 text-green-800" },
      rechazada: { variant: "secondary" as const, className: "bg-red-100 text-red-800" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendiente;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {status === "pendiente" && "Pendiente"}
        {status === "en_evaluacion" && "En Evaluación"}
        {status === "aprobada" && "Aprobada"}
        {status === "rechazada" && "Rechazada"}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-VE');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-orange/20 bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/ayudantias")}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-primary">Listado de Postulaciones</h1>
                <p className="text-sm text-muted-foreground">Gestiona todas las postulaciones de becas</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-primary hover:opacity-90 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Crear Nueva Postulación
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Período</label>
                <Input
                  placeholder="ej: 2025-1"
                  value={filters.periodo}
                  onChange={(e) => setFilters(prev => ({ ...prev, periodo: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Estado</label>
                <Select value={filters.estado} onValueChange={(value) => setFilters(prev => ({ ...prev, estado: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="en_evaluacion">En Evaluación</SelectItem>
                    <SelectItem value="aprobada">Aprobada</SelectItem>
                    <SelectItem value="rechazada">Rechazada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">ID Programa</label>
                <Input
                  type="number"
                  placeholder="ej: 1"
                  value={filters.programa_beca_id}
                  onChange={(e) => setFilters(prev => ({ ...prev, programa_beca_id: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Postulación</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockPostulaciones.data.map((postulacion) => (
                  <TableRow key={postulacion.id}>
                    <TableCell>{postulacion.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{postulacion.usuario.nombre} {postulacion.usuario.apellido}</p>
                        <p className="text-sm text-muted-foreground">{postulacion.usuario.carnet}</p>
                      </div>
                    </TableCell>
                    <TableCell>{postulacion.periodo_academico}</TableCell>
                    <TableCell>{getStatusBadge(postulacion.estado)}</TableCell>
                    <TableCell>{formatDate(postulacion.fecha_postulacion)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/postulaciones/${postulacion.id}`)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Ver Detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-center space-x-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={!mockPostulaciones.pagination.has_prev}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {mockPostulaciones.pagination.current_page} de {mockPostulaciones.pagination.total_pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={!mockPostulaciones.pagination.has_next}
            className="flex items-center gap-2"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </main>

      {/* Create Modal */}
      <PostulacionCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default PostulacionesList;