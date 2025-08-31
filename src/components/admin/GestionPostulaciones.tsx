import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Eye, Check, X, Clock } from "lucide-react";
import { useState } from "react";

interface Postulacion {
  id: string;
  nombre: string;
  cedula: string;
  carrera: string;
  semestre: number;
  promedio: number;
  tipoBeca: string;
  estado: "Pendiente" | "Aprobada" | "Rechazada" | "En Revisión";
  fechaPostulacion: string;
  documentos: string[];
  observaciones?: string;
}

const GestionPostulaciones = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBeca, setFilterBeca] = useState("todos");
  const [filterEstado, setFilterEstado] = useState("todos");

  // Mock data
  const postulaciones: Postulacion[] = [
    {
      id: "1",
      nombre: "Roberto Silva Martínez",
      cedula: "V-23456789",
      carrera: "Ingeniería Civil",
      semestre: 7,
      promedio: 18.2,
      tipoBeca: "Excelencia Académica",
      estado: "Pendiente",
      fechaPostulacion: "2024-12-15",
      documentos: ["Certificado de notas", "Carta de motivación", "CV"],
      observaciones: "Cumple con todos los requisitos académicos"
    },
    {
      id: "2",
      nombre: "Sofía Ramírez González",
      cedula: "V-34567890",
      carrera: "Psicología",
      semestre: 6,
      promedio: 17.8,
      tipoBeca: "Impacto Social",
      estado: "En Revisión",
      fechaPostulacion: "2024-12-10",
      documentos: ["Certificado de notas", "Proyecto social", "Cartas de referencia"]
    },
    {
      id: "3",
      nombre: "Miguel Torres López",
      cedula: "V-45678901",
      carrera: "Administración",
      semestre: 8,
      promedio: 19.1,
      tipoBeca: "Ayudantía",
      estado: "Aprobada",
      fechaPostulacion: "2024-12-05",
      documentos: ["Certificado de notas", "Carta de recomendación", "Portafolio"]
    },
    {
      id: "4",
      nombre: "Elena Vargas Castro",
      cedula: "V-56789012",
      carrera: "Derecho",
      semestre: 5,
      promedio: 16.5,
      tipoBeca: "Excelencia Académica",
      estado: "Rechazada",
      fechaPostulacion: "2024-12-01",
      documentos: ["Certificado de notas", "Carta de motivación"],
      observaciones: "No cumple con el promedio mínimo requerido"
    }
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>;
      case "En Revisión":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">En Revisión</Badge>;
      case "Aprobada":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Aprobada</Badge>;
      case "Rechazada":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rechazada</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const filteredPostulaciones = postulaciones.filter(postulacion => {
    const matchesSearch = postulacion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         postulacion.cedula.includes(searchTerm) ||
                         postulacion.carrera.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBeca = filterBeca === "todos" || postulacion.tipoBeca === filterBeca;
    const matchesEstado = filterEstado === "todos" || postulacion.estado === filterEstado;
    
    return matchesSearch && matchesBeca && matchesEstado;
  });

  const estadisticas = {
    total: postulaciones.length,
    pendientes: postulaciones.filter(p => p.estado === "Pendiente").length,
    enRevision: postulaciones.filter(p => p.estado === "En Revisión").length,
    aprobadas: postulaciones.filter(p => p.estado === "Aprobada").length,
    rechazadas: postulaciones.filter(p => p.estado === "Rechazada").length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary">Gestión de Postulaciones</h2>
          <p className="text-muted-foreground">Revisión y aprobación de postulaciones a becas</p>
        </div>
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
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="En Revisión">En Revisión</SelectItem>
                <SelectItem value="Aprobada">Aprobada</SelectItem>
                <SelectItem value="Rechazada">Rechazada</SelectItem>
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
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{estadisticas.pendientes}</p>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{estadisticas.enRevision}</p>
              <p className="text-sm text-muted-foreground">En Revisión</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{estadisticas.aprobadas}</p>
              <p className="text-sm text-muted-foreground">Aprobadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{estadisticas.rechazadas}</p>
              <p className="text-sm text-muted-foreground">Rechazadas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de postulaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Postulaciones ({filteredPostulaciones.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Postulante</TableHead>
                <TableHead>Carrera</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead>Promedio</TableHead>
                <TableHead>Tipo de Beca</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPostulaciones.map((postulacion) => (
                <TableRow key={postulacion.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{postulacion.nombre}</p>
                      <p className="text-sm text-muted-foreground">{postulacion.cedula}</p>
                    </div>
                  </TableCell>
                  <TableCell>{postulacion.carrera}</TableCell>
                  <TableCell>{postulacion.semestre}°</TableCell>
                  <TableCell>
                    <span className="font-medium">{postulacion.promedio}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{postulacion.tipoBeca}</Badge>
                  </TableCell>
                  <TableCell>{getEstadoBadge(postulacion.estado)}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(postulacion.fechaPostulacion).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" title="Ver detalles">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {postulacion.estado === "Pendiente" && (
                        <>
                          <Button variant="ghost" size="sm" className="text-green-600" title="Aprobar">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600" title="Rechazar">
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {postulacion.estado === "En Revisión" && (
                        <Button variant="ghost" size="sm" className="text-blue-600" title="En proceso">
                          <Clock className="h-4 w-4" />
                        </Button>
                      )}
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

export default GestionPostulaciones;