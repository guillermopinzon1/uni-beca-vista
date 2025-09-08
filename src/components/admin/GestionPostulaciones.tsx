import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Eye, Check, X, Clock, User, Mail, Phone, Calendar, FileText, GraduationCap, Download } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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
  // Datos adicionales para el modal
  correoElectronico?: string;
  telefono?: string;
  fechaNacimiento?: string;
  estadoCivil?: string;
  tipoPostulante?: string;
  iaa?: number;
  asignaturasAprobadas?: number;
  creditosInscritos?: number;
}

const GestionPostulaciones = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBeca, setFilterBeca] = useState("todos");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [selectedPostulacion, setSelectedPostulacion] = useState<Postulacion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVerDetalles = (postulacion: Postulacion) => {
    // Agregar datos adicionales simulados para el modal
    const postulacionCompleta = {
      ...postulacion,
      correoElectronico: "postulante@email.com",
      telefono: "+57 300 123 4567",
      fechaNacimiento: "1998-03-15",
      estadoCivil: "Soltero(a)",
      tipoPostulante: "Estudiante regular de pregrado",
      iaa: postulacion.promedio,
      asignaturasAprobadas: 35,
      creditosInscritos: 18
    };
    setSelectedPostulacion(postulacionCompleta);
    setIsModalOpen(true);
  };

  // Mock data con datos más completos
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
      documentos: ["Certificado de notas", "Carta de motivación", "CV", "Fotocopia de cédula"],
      observaciones: "Cumple con todos los requisitos académicos",
      correoElectronico: "roberto.silva@email.com",
      telefono: "+57 301 234 5678",
      fechaNacimiento: "1997-05-20",
      estadoCivil: "Soltero",
      tipoPostulante: "Estudiante regular de pregrado",
      iaa: 18.2,
      asignaturasAprobadas: 42,
      creditosInscritos: 15
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
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="Ver detalles"
                        onClick={() => handleVerDetalles(postulacion)}
                      >
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

      {/* Modal de Detalles de Postulación */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">
              Detalles de la Postulación - {selectedPostulacion?.nombre}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPostulacion && (
            <div className="space-y-6">
              {/* Resumen de la Postulación */}
              <Card className="border-orange/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <User className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold">{selectedPostulacion.nombre}</h3>
                        <p className="text-sm text-muted-foreground">ID: {selectedPostulacion.id}</p>
                      </div>
                    </div>
                    {getEstadoBadge(selectedPostulacion.estado)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de Beca</p>
                      <p className="font-medium">{selectedPostulacion.tipoBeca}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha de Postulación</p>
                      <p className="font-medium">{new Date(selectedPostulacion.fechaPostulacion).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Promedio/IAA</p>
                      <p className="font-medium text-primary text-lg">{selectedPostulacion.iaa}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Carrera</p>
                      <p className="font-medium">{selectedPostulacion.carrera}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Datos Personales */}
                <Card className="border-orange/20">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-primary flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Datos Personales
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <Label className="text-sm text-muted-foreground">Nombre Completo</Label>
                        <p className="font-medium">{selectedPostulacion.nombre}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Cédula de Identidad</Label>
                        <p className="font-medium">{selectedPostulacion.cedula}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <Label className="text-sm text-muted-foreground">Correo Electrónico</Label>
                          <p className="font-medium">{selectedPostulacion.correoElectronico}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <Label className="text-sm text-muted-foreground">Teléfono</Label>
                          <p className="font-medium">{selectedPostulacion.telefono}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <Label className="text-sm text-muted-foreground">Fecha de Nacimiento</Label>
                          <p className="font-medium">{selectedPostulacion.fechaNacimiento ? new Date(selectedPostulacion.fechaNacimiento).toLocaleDateString('es-ES') : 'No disponible'}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Estado Civil</Label>
                        <p className="font-medium">{selectedPostulacion.estadoCivil}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Datos Académicos */}
                <Card className="border-orange/20">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-primary flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Datos Académicos
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <Label className="text-sm text-muted-foreground">Tipo de Postulante</Label>
                        <p className="font-medium">{selectedPostulacion.tipoPostulante}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Carrera/Programa de estudios</Label>
                        <p className="font-medium">{selectedPostulacion.carrera}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Trimestre actual</Label>
                        <p className="font-medium">{selectedPostulacion.semestre}°</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Índice Académico Acumulado (IAA)</Label>
                        <p className="font-medium text-primary text-lg">{selectedPostulacion.iaa}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Asignaturas Aprobadas</Label>
                        <p className="font-medium">{selectedPostulacion.asignaturasAprobadas}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Créditos Inscritos este Trimestre</Label>
                        <p className="font-medium">{selectedPostulacion.creditosInscritos}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Documentos */}
              <Card className="border-orange/20">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-primary flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Documentos de la Postulación
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedPostulacion.documentos.map((documento, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{documento}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-800 border-green-200">Recibido</Badge>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Ver
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Observaciones */}
              {selectedPostulacion.observaciones && (
                <Card className="border-orange/20">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-primary">Observaciones</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{selectedPostulacion.observaciones}</p>
                  </CardContent>
                </Card>
              )}

              {/* Acciones de la postulación */}
              {selectedPostulacion.estado === "Pendiente" && (
                <Card className="border-orange/20">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-primary">Acciones</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <Check className="h-4 w-4 mr-2" />
                        Aprobar Postulación
                      </Button>
                      <Button variant="destructive">
                        <X className="h-4 w-4 mr-2" />
                        Rechazar Postulación
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestionPostulaciones;