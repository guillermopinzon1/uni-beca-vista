import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, CheckCircle, XCircle, RefreshCw, Clock, Calendar, FileText, AlertTriangle, User, BookOpen, Target, ListChecks, Briefcase, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  obtenerAyudantesDeSupervisor,
  listarReportesDeAyudante,
  aprobarReporteDeHoras,
  rechazarReporteDeHoras,
  obtenerReporteEspecifico,
  type ReporteSemanal,
  type EstudianteBecarioDetallado,
} from "@/lib/api/supervisor";

interface GestionReportesSupervisorProps {
  supervisorId?: string;
}

const GestionReportesSupervisor = ({ supervisorId }: GestionReportesSupervisorProps) => {
  const { user, tokens } = useAuth();
  const { toast } = useToast();
  const [ayudantes, setAyudantes] = useState<EstudianteBecarioDetallado[]>([]);
  const [reportes, setReportes] = useState<ReporteSemanal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [selectedReporte, setSelectedReporte] = useState<ReporteSemanal | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [observaciones, setObservaciones] = useState("");
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [processing, setProcessing] = useState(false);

  const effectiveSupervisorId = supervisorId || user?.id;

  const loadData = async () => {
    if (!effectiveSupervisorId) {
      toast({
        title: "Error",
        description: "No se pudo identificar al supervisor",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      // Cargar ayudantes
      const ayudantesResponse = await obtenerAyudantesDeSupervisor(accessToken, effectiveSupervisorId);
      setAyudantes(ayudantesResponse.data.ayudantes);

      // Cargar reportes de todos los ayudantes
      const allReportes: ReporteSemanal[] = [];
      for (const ayudante of ayudantesResponse.data.ayudantes) {
        try {
          const reportesResponse = await listarReportesDeAyudante(accessToken, ayudante.id, {
            limit: 100,
          });
          allReportes.push(...reportesResponse.data.reportes);
        } catch (error) {
          console.warn(`No se pudieron cargar reportes del ayudante ${ayudante.id}`, error);
        }
      }

      // Ordenar por fecha (más recientes primero)
      allReportes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setReportes(allReportes);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar los datos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [effectiveSupervisorId]);

  const filteredReportes = reportes.filter(reporte => {
    const matchesSearch = searchTerm === "" ||
      reporte.estudiante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reporte.estudiante.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reporte.estudiante.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEstado = filterEstado === "all" || reporte.estado === filterEstado;

    return matchesSearch && matchesEstado;
  });

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, { className: string; icon: any }> = {
      'Pendiente': { className: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
      'Aprobada': { className: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      'Rechazada': { className: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
      'En Revisión': { className: 'bg-blue-100 text-blue-800 border-blue-200', icon: FileText },
    };
    const variant = variants[estado] || { className: 'bg-gray-100 text-gray-800', icon: FileText };
    const Icon = variant.icon;
    return (
      <Badge className={variant.className}>
        <Icon className="h-3 w-3 mr-1" />
        {estado}
      </Badge>
    );
  };

  const handleVerDetalle = async (reporte: ReporteSemanal) => {
    // Mostrar de inmediato el reporte de la fila como prefetched
    setSelectedReporte(reporte);
    setIsDetailModalOpen(true);

    try {
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) throw new Error("No hay token de acceso");

      const response = await obtenerReporteEspecifico(accessToken, reporte.estudianteBecarioId, reporte.id);
      const det = response?.data?.reporte || response?.data;

      if (det) {
        // Normalizar tipos por si el backend envía strings numéricas
        const normalizado: ReporteSemanal = {
          ...reporte,
          ...det,
          horasTrabajadas: typeof det.horasTrabajadas === 'string' ? parseFloat(det.horasTrabajadas) : det.horasTrabajadas,
        };
        setSelectedReporte(normalizado);
      }
    } catch (error: any) {
      // Dejamos visible el reporte básico ya cargado
      console.warn('No se pudo actualizar el detalle del reporte. Mostrando datos básicos.', error);
      toast({
        title: "Aviso",
        description: error.message || "No se pudo cargar el detalle del reporte; mostrando datos básicos",
      });
    }
  };

  const handleAprobar = (reporte: ReporteSemanal) => {
    setSelectedReporte(reporte);
    setObservaciones("");
    setIsApproveModalOpen(true);
  };

  const handleRechazar = (reporte: ReporteSemanal) => {
    setSelectedReporte(reporte);
    setMotivoRechazo("");
    setIsRejectModalOpen(true);
  };

  const confirmarAprobacion = async () => {
    if (!selectedReporte) return;

    try {
      setProcessing(true);
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) throw new Error("No hay token de acceso");

      await aprobarReporteDeHoras(
        accessToken,
        selectedReporte.estudianteBecarioId,
        selectedReporte.id,
        observaciones ? { observaciones } : undefined
      );

      toast({
        title: "Reporte Aprobado",
        description: `El reporte de la semana ${selectedReporte.semana} ha sido aprobado exitosamente`,
      });

      setIsApproveModalOpen(false);
      setObservaciones("");
      setSelectedReporte(null);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo aprobar el reporte",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const confirmarRechazo = async () => {
    if (!selectedReporte || !motivoRechazo.trim()) {
      toast({
        title: "Error",
        description: "Debe proporcionar un motivo de rechazo",
        variant: "destructive",
      });
      return;
    }

    if (motivoRechazo.trim().length < 10) {
      toast({
        title: "Error",
        description: "El motivo debe tener al menos 10 caracteres",
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessing(true);
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) throw new Error("No hay token de acceso");

      await rechazarReporteDeHoras(
        accessToken,
        selectedReporte.estudianteBecarioId,
        selectedReporte.id,
        { motivo: motivoRechazo.trim() }
      );

      toast({
        title: "Reporte Rechazado",
        description: `El reporte de la semana ${selectedReporte.semana} ha sido rechazado`,
      });

      setIsRejectModalOpen(false);
      setMotivoRechazo("");
      setSelectedReporte(null);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo rechazar el reporte",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const reportesPendientes = reportes.filter(r => r.estado === 'Pendiente').length;
  const reportesAprobados = reportes.filter(r => r.estado === 'Aprobada').length;
  const reportesRechazados = reportes.filter(r => r.estado === 'Rechazada').length;

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mr-3" />
          <span className="text-muted-foreground">Cargando reportes...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              Reportes Semanales
              <Badge variant="outline" className="ml-2">{reportes.length}</Badge>
            </CardTitle>
            <CardDescription className="mt-2">
              Revisa y aprueba los reportes de horas trabajadas por tus ayudantes
            </CardDescription>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <Card className="border-yellow-200">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">{reportesPendientes}</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Aprobados</p>
                  <p className="text-2xl font-bold text-green-600">{reportesAprobados}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Rechazados</p>
                  <p className="text-2xl font-bold text-red-600">{reportesRechazados}</p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-blue-600">{reportes.length}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por estudiante..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Aprobada">Aprobada</SelectItem>
                <SelectItem value="Rechazada">Rechazada</SelectItem>
                <SelectItem value="En Revisión">En Revisión</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {filteredReportes.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm || filterEstado !== "all" ? (
                <p>No se encontraron reportes con los filtros seleccionados</p>
              ) : (
                <p>No hay reportes registrados</p>
              )}
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow>
                      <TableHead>Estudiante</TableHead>
                      <TableHead>Semana</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Horas</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReportes.map((reporte) => (
                      <TableRow key={reporte.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {reporte.estudiante.nombre} {reporte.estudiante.apellido}
                            </p>
                            <p className="text-sm text-muted-foreground">{reporte.estudiante.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Semana {reporte.semana}</Badge>
                        </TableCell>
                        <TableCell>{reporte.periodoAcademico}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{reporte.horasTrabajadas}h</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(reporte.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>{getEstadoBadge(reporte.estado)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVerDetalle(reporte)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalle - Rediseñado */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          {selectedReporte && (
            <>
              {/* Header blanco limpio */}
              <div className="bg-white border-b border-gray-200 px-6 py-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Reporte Semana {selectedReporte.semana}</h2>
                        <p className="text-gray-500 text-sm">{selectedReporte.periodoAcademico}</p>
                      </div>
                    </div>
                  </div>
                  {getEstadoBadge(selectedReporte.estado)}
                </div>

                {/* Info del estudiante */}
                <div className="mt-4 flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{selectedReporte.estudiante.nombre} {selectedReporte.estudiante.apellido}</p>
                    <p className="text-sm text-gray-600">{selectedReporte.estudiante.email}</p>
                  </div>
                </div>
              </div>

              {/* Contenido scrollable */}
              <div className="overflow-y-auto max-h-[calc(90vh-340px)] px-6 py-6 space-y-6">
                {/* Métricas principales */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-500 rounded-lg">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Horas Trabajadas</p>
                        <p className="text-2xl font-bold text-gray-900">{selectedReporte.horasTrabajadas}h</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-500 rounded-lg">
                        <Briefcase className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Tipo de Beca</p>
                        <p className="text-lg font-bold text-gray-900">{selectedReporte.tipoBeca}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secciones de contenido */}
                <div className="space-y-4">
                  {/* Objetivos */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100/30 rounded-xl p-5 border border-orange-200/60 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-orange-500 rounded-lg">
                        <Target className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-orange-900">Objetivos del Período</h3>
                    </div>
                    <p className="text-sm text-orange-800 leading-relaxed whitespace-pre-wrap">
                      {selectedReporte.objetivosPeriodo || 'No especificado'}
                    </p>
                  </div>

                  {/* Metas */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/30 rounded-xl p-5 border border-gray-200/60 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-gray-500 rounded-lg">
                        <ListChecks className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Metas Específicas</h3>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedReporte.metasEspecificas || 'No especificado'}
                    </p>
                  </div>

                  {/* Actividades Programadas */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/30 rounded-xl p-5 border border-gray-200/60 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-gray-500 rounded-lg">
                        <BookOpen className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Actividades Programadas</h3>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedReporte.actividadesProgramadas || 'No especificado'}
                    </p>
                  </div>

                  {/* Actividades Realizadas */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/30 rounded-xl p-5 border border-gray-200/60 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-gray-500 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Actividades Realizadas</h3>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedReporte.actividadesRealizadas || 'No especificado'}
                    </p>
                  </div>

                  {/* Descripción Detallada */}
                  {selectedReporte.descripcionActividades && (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100/30 rounded-xl p-5 border border-gray-200/60 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-gray-500 rounded-lg">
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Descripción Detallada</h3>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedReporte.descripcionActividades}
                      </p>
                    </div>
                  )}

                  {/* Observaciones del Estudiante */}
                  {selectedReporte.observaciones && (
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100/30 rounded-xl p-5 border border-orange-200/60 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-orange-500 rounded-lg">
                          <MessageSquare className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="font-semibold text-orange-900">Observaciones del Estudiante</h3>
                      </div>
                      <p className="text-sm text-orange-800 leading-relaxed whitespace-pre-wrap">
                        {selectedReporte.observaciones}
                      </p>
                    </div>
                  )}

                  {/* Feedback del Supervisor */}
                  {selectedReporte.estado === 'Aprobada' && selectedReporte.observacionesSupervisor && (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100/30 rounded-xl p-5 border-2 border-gray-300 shadow-md">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="h-5 w-5 text-gray-600" />
                        <h3 className="font-semibold text-gray-900">Observaciones del Supervisor</h3>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedReporte.observacionesSupervisor}
                      </p>
                    </div>
                  )}

                  {selectedReporte.estado === 'Rechazada' && selectedReporte.motivoRechazo && (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100/30 rounded-xl p-5 border-2 border-gray-300 shadow-md">
                      <div className="flex items-center gap-2 mb-3">
                        <XCircle className="h-5 w-5 text-gray-600" />
                        <h3 className="font-semibold text-gray-900">Motivo de Rechazo</h3>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedReporte.motivoRechazo}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer con acciones */}
              <div className="border-t bg-gray-50 px-6 py-5">
                {selectedReporte?.estado === 'Pendiente' ? (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        handleAprobar(selectedReporte);
                      }}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-md"
                      size="lg"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Aprobar Reporte
                    </Button>
                    <Button
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        handleRechazar(selectedReporte);
                      }}
                      variant="destructive"
                      className="flex-1 shadow-md"
                      size="lg"
                    >
                      <XCircle className="h-5 w-5 mr-2" />
                      Rechazar Reporte
                    </Button>
                  </div>
                ) : selectedReporte?.estado === 'Aprobada' ? (
                  <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 text-gray-800 font-semibold">
                    <CheckCircle className="h-5 w-5" />
                    <span>Reporte Aprobado Exitosamente</span>
                  </div>
                ) : selectedReporte?.estado === 'Rechazada' ? (
                  <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 text-gray-800 font-semibold">
                    <XCircle className="h-5 w-5" />
                    <span>Reporte Rechazado</span>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Aprobación */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprobar Reporte</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de aprobar el reporte de la semana {selectedReporte?.semana}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="observaciones">Observaciones (opcional)</Label>
              <Textarea
                id="observaciones"
                placeholder="Agrega comentarios sobre el trabajo realizado..."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsApproveModalOpen(false)}
                className="flex-1"
                disabled={processing}
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmarAprobacion}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Aprobando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmar Aprobación
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Rechazo */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Reporte</DialogTitle>
            <DialogDescription>
              Proporciona un motivo detallado del rechazo del reporte de la semana {selectedReporte?.semana}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="motivo">Motivo de Rechazo *</Label>
              <Textarea
                id="motivo"
                placeholder="Explica detalladamente por qué se rechaza este reporte (mínimo 10 caracteres)..."
                value={motivoRechazo}
                onChange={(e) => setMotivoRechazo(e.target.value)}
                rows={4}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {motivoRechazo.length}/2000 caracteres (mínimo 10)
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsRejectModalOpen(false)}
                className="flex-1"
                disabled={processing}
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmarRechazo}
                variant="destructive"
                className="flex-1"
                disabled={processing || motivoRechazo.trim().length < 10}
              >
                {processing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Rechazando...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Confirmar Rechazo
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GestionReportesSupervisor;
