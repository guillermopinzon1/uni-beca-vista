import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RefreshCw, Eye, Check, X, User, Mail, Calendar, FileText, Percent } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { getAllPostulaciones, getPostulacionById, aprobarPostulacion, rechazarPostulacion } from "@/lib/api/postulacionesPlazas";

interface Postulacion {
  id: string;
  estudianteBecarioId: string;
  plazaId: string;
  estado: 'Pendiente' | 'Aprobada' | 'Rechazada';
  fechaPostulacion: string;
  fechaRespuesta?: string;
  respondidoPor?: string;
  motivoRechazo?: string;
  observaciones?: string;
  compatibilidadHoraria?: {
    porcentaje: number;
    bloquesCompatibles: number;
  };
  estudianteBecario?: {
    id: string;
    usuarioId: string;
    usuario: {
      nombre: string;
      apellido: string;
      email: string;
      carrera?: string;
    };
  };
  plaza?: {
    id: string;
    nombre?: string;
    ubicacion?: string;
    tipoAyudantia?: string;
    horasSemana?: number;
  };
}

const GestionPostulacionesPlazas = () => {
  const { toast } = useToast();
  const { tokens } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPostulacion, setSelectedPostulacion] = useState<Postulacion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [procesando, setProcesando] = useState(false);

  // Cargar postulaciones
  const loadPostulaciones = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) return;

    setLoading(true);
    try {
      const data = await getAllPostulaciones(accessToken, {
        limit: 100,
        offset: 0
      });

      const postulaciones = data?.data?.postulaciones || data?.data || [];
      setPostulaciones(Array.isArray(postulaciones) ? postulaciones : []);
    } catch (error: any) {
      console.error('Error cargando postulaciones:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudieron cargar las postulaciones',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar al montar
  useEffect(() => {
    loadPostulaciones();
  }, [tokens?.accessToken]);

  // Ver detalles de postulación
  const handleVerDetalles = async (postulacion: Postulacion) => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) return;

    try {
      const data = await getPostulacionById(accessToken, postulacion.id);
      setSelectedPostulacion(data?.data || postulacion);
      setMotivoRechazo("");
      setObservaciones("");
      setIsModalOpen(true);
    } catch (error: any) {
      console.error('Error cargando detalle:', error);
      setSelectedPostulacion(postulacion);
      setIsModalOpen(true);
    }
  };

  // Aprobar postulación
  const handleAprobar = async () => {
    if (!selectedPostulacion) return;

    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) return;

    setProcesando(true);
    try {
      await aprobarPostulacion(accessToken, selectedPostulacion.id, observaciones);
      toast({
        title: 'Postulación aprobada',
        description: 'El becario ha sido asignado a la plaza automáticamente.'
      });

      setIsModalOpen(false);
      await loadPostulaciones();
    } catch (error: any) {
      console.error('Error aprobando:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo aprobar la postulación',
        variant: 'destructive'
      });
    } finally {
      setProcesando(false);
    }
  };

  // Rechazar postulación
  const handleRechazar = async () => {
    if (!selectedPostulacion) return;
    if (!motivoRechazo.trim()) {
      toast({
        title: 'Error',
        description: 'Debes ingresar un motivo para el rechazo',
        variant: 'destructive'
      });
      return;
    }

    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) return;

    setProcesando(true);
    try {
      await rechazarPostulacion(accessToken, selectedPostulacion.id, motivoRechazo, observaciones);
      toast({
        title: 'Postulación rechazada',
        description: 'La postulación ha sido rechazada exitosamente.'
      });

      setIsModalOpen(false);
      await loadPostulaciones();
    } catch (error: any) {
      console.error('Error rechazando:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo rechazar la postulación',
        variant: 'destructive'
      });
    } finally {
      setProcesando(false);
    }
  };

  // Badge de estado
  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>;
      case "Aprobada":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Aprobada</Badge>;
      case "Rechazada":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rechazada</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  // Filtrar postulaciones
  const filteredPostulaciones = postulaciones.filter(p => {
    const matchesSearch =
      p.estudianteBecario?.usuario?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.estudianteBecario?.usuario?.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.estudianteBecario?.usuario?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.plaza?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEstado = filterEstado === "todos" || p.estado === filterEstado;

    return matchesSearch && matchesEstado;
  });

  // Estadísticas
  const stats = {
    total: postulaciones.length,
    pendientes: postulaciones.filter(p => p.estado === 'Pendiente').length,
    aprobadas: postulaciones.filter(p => p.estado === 'Aprobada').length,
    rechazadas: postulaciones.filter(p => p.estado === 'Rechazada').length
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary">Gestión de Postulaciones a Plazas</h2>
        <p className="text-muted-foreground">Revisa y aprueba postulaciones de estudiantes a plazas de ayudantía</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-orange/20 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-primary">{stats.total}</p>
                <p className="text-sm text-muted-foreground font-medium mt-1">Total</p>
              </div>
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-yellow-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendientes}</p>
                <p className="text-sm text-yellow-700 font-medium mt-1">Pendientes</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-300 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-yellow-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-green-600">{stats.aprobadas}</p>
                <p className="text-sm text-green-700 font-medium mt-1">Aprobadas</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-red-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-red-600">{stats.rechazadas}</p>
                <p className="text-sm text-red-700 font-medium mt-1">Rechazadas</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-200 to-red-300 flex items-center justify-center">
                <X className="h-6 w-6 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="border-orange/20 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500" />
              <Input
                placeholder="Buscar por estudiante, email o plaza..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 border-orange/20"
              />
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-40 border-orange/20">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Aprobada">Aprobada</SelectItem>
                <SelectItem value="Rechazada">Rechazada</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={loadPostulaciones}
              disabled={loading}
              className="border-orange/40 hover:bg-orange/10"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Recargar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card className="border-orange/20 shadow-md">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b border-orange/10">
          <CardTitle>Postulaciones ({filteredPostulaciones.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="font-semibold">Estudiante</TableHead>
                  <TableHead className="font-semibold">Plaza</TableHead>
                  <TableHead className="font-semibold">Compatibilidad</TableHead>
                  <TableHead className="font-semibold">Estado</TableHead>
                  <TableHead className="font-semibold">Fecha</TableHead>
                  <TableHead className="font-semibold text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPostulaciones.map((postulacion) => (
                  <TableRow key={postulacion.id} className="hover:bg-orange/5">
                    <TableCell>
                      <div>
                        <p className="font-medium">{postulacion.estudianteBecario?.usuario?.nombre} {postulacion.estudianteBecario?.usuario?.apellido}</p>
                        <p className="text-xs text-muted-foreground">{postulacion.estudianteBecario?.usuario?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{postulacion.plaza?.nombre}</p>
                        <p className="text-xs text-muted-foreground">{postulacion.plaza?.ubicacion}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {postulacion.compatibilidadHoraria ? (
                        <div className="flex items-center gap-1">
                          <Percent className="h-3 w-3 text-green-600" />
                          <span className="text-sm font-semibold text-green-700">{postulacion.compatibilidadHoraria.porcentaje}%</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>{getEstadoBadge(postulacion.estado)}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(postulacion.fechaPostulacion).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVerDetalles(postulacion)}
                        className="hover:bg-orange-100"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalles */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de la Postulación</DialogTitle>
          </DialogHeader>

          {selectedPostulacion && (
            <div className="space-y-6">
              {/* Información del estudiante */}
              <Card className="border-orange/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Estudiante
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Label className="text-muted-foreground">Nombre</Label>
                    <p className="font-medium">{selectedPostulacion.estudianteBecario?.usuario?.nombre} {selectedPostulacion.estudianteBecario?.usuario?.apellido}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedPostulacion.estudianteBecario?.usuario?.email}</p>
                  </div>
                  {selectedPostulacion.estudianteBecario?.usuario?.carrera && (
                    <div>
                      <Label className="text-muted-foreground">Carrera</Label>
                      <p className="font-medium">{selectedPostulacion.estudianteBecario.usuario.carrera}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Información de la plaza */}
              <Card className="border-orange/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Plaza
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Label className="text-muted-foreground">Nombre</Label>
                    <p className="font-medium">{selectedPostulacion.plaza?.nombre}</p>
                  </div>
                  {selectedPostulacion.plaza?.ubicacion && (
                    <div>
                      <Label className="text-muted-foreground">Ubicación</Label>
                      <p className="font-medium">{selectedPostulacion.plaza.ubicacion}</p>
                    </div>
                  )}
                  {selectedPostulacion.plaza?.tipoAyudantia && (
                    <div>
                      <Label className="text-muted-foreground">Tipo</Label>
                      <p className="font-medium">{selectedPostulacion.plaza.tipoAyudantia}</p>
                    </div>
                  )}
                  {selectedPostulacion.compatibilidadHoraria && (
                    <div>
                      <Label className="text-muted-foreground">Compatibilidad Horaria</Label>
                      <p className="font-medium text-green-600">{selectedPostulacion.compatibilidadHoraria.porcentaje}%</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Estado */}
              <div>
                <Label>Estado actual</Label>
                <div className="mt-2">{getEstadoBadge(selectedPostulacion.estado)}</div>
              </div>

              {/* Acciones si está pendiente */}
              {selectedPostulacion.estado === 'Pendiente' && (
                <Card className="border-orange/20">
                  <CardHeader>
                    <CardTitle>Acciones</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="observaciones">Observaciones (opcional)</Label>
                      <Textarea
                        id="observaciones"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        placeholder="Agregar observaciones generales..."
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="motivo">Motivo de rechazo (solo si rechazas)</Label>
                      <Textarea
                        id="motivo"
                        value={motivoRechazo}
                        onChange={(e) => setMotivoRechazo(e.target.value)}
                        placeholder="Ingrese el motivo del rechazo..."
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleAprobar}
                        disabled={procesando}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Aprobar y Asignar
                      </Button>
                      <Button
                        onClick={handleRechazar}
                        disabled={procesando}
                        variant="destructive"
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Rechazar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Motivo de rechazo si fue rechazada */}
              {selectedPostulacion.motivoRechazo && (
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="pt-6">
                    <Label className="text-red-700">Motivo de rechazo</Label>
                    <p className="text-sm text-red-600 mt-2">{selectedPostulacion.motivoRechazo}</p>
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

export default GestionPostulacionesPlazas;
