import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, Check, X, Clock, Calendar, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface UsuarioAyudante {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  cedula?: string;
  telefono?: string;
  carrera?: string;
  semestre?: number;
}

interface ReporteHoras {
  id: string;
  fecha: string;
  horas: number;
  descripcion: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  notas?: string;
}

interface Ayudante {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  trimestre: number;
  horasRegistradas: number;
  horasPendientes: number;
  reportesHoras: ReporteHoras[];
}

interface ReporteHoras {
  id: string;
  fecha: string;
  horas: number;
  descripcion: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  notas?: string;
}

const ListaAyudantes = () => {
  const { toast } = useToast();
  const { tokens, user } = useAuth();
  const [selectedAyudante, setSelectedAyudante] = useState<Ayudante | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notas, setNotas] = useState("");

  // Disponibilidades (admin/supervisor)
  interface DisponibilidadItem {
    id?: string;
    usuarioId?: string;
    disponibilidad?: {
      lunes?: string[];
      martes?: string[];
      miercoles?: string[];
      jueves?: string[];
      viernes?: string[];
      sabado?: string[];
      domingo?: string[];
    };
    usuario?: {
      id?: string;
      nombre?: string;
      apellido?: string;
      role?: string;
      cedula?: string;
      carrera?: string;
      semestre?: number;
      promedio?: number;
      email?: string;
      telefono?: string;
      cvUrl?: string;
    };
  }

  const [disponibilidades, setDisponibilidades] = useState<DisponibilidadItem[]>([]);
  const [loadingDispon, setLoadingDispon] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(20);
  const [offset, setOffset] = useState<number>(0);
  const [selectedDisponibilidad, setSelectedDisponibilidad] = useState<DisponibilidadItem | null>(null);
  const [supervisorAyudantes, setSupervisorAyudantes] = useState<Array<{ id: string; nombre: string; apellido?: string; email?: string; carrera?: string; semestre?: number; cedula?: string; telefono?: string; becaInfo?: any }>>([]);

  // Nota: Se eliminó la carga de usuarios (endpoint /users) en esta vista

  const loadDisponibilidades = async (customOffset?: number) => {
    const stored = (() => {
      try { return JSON.parse(localStorage.getItem('auth_tokens') || 'null'); } catch { return null; }
    })();
    const accessToken = tokens?.accessToken || stored?.accessToken;
    if (!accessToken) {
      toast({ title: 'Sin sesión', description: 'Inicia sesión para cargar disponibilidades', variant: 'destructive' });
      return;
    }
    setLoadingDispon(true);
    try {
      const resp = await fetch(`${API_BASE}/v1/disponibilidad?limit=${limit}&offset=${customOffset ?? offset}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.message || `Error ${resp.status}`);
      }
      const data = await resp.json();
      const items: DisponibilidadItem[] = data?.data?.disponibilidades || data?.data || [];
      setDisponibilidades(items);
      if (typeof (data?.data?.limit) === 'number') setLimit(data.data.limit);
      if (typeof (data?.data?.offset) === 'number') setOffset(data.data.offset);
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'No se pudieron cargar las disponibilidades', variant: 'destructive' });
    } finally {
      setLoadingDispon(false);
    }
  };

  useEffect(() => {
    loadDisponibilidades(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens?.accessToken]);

  const buildAyudanteFromUsuario = (u: UsuarioAyudante): Ayudante => {
    return {
      id: u.id,
      nombre: u.nombre,
      apellido: u.apellido,
      cedula: u.cedula || '-',
      trimestre: typeof u.semestre === 'number' ? u.semestre : 0,
      horasRegistradas: 0,
      horasPendientes: 0,
      reportesHoras: [],
    };
  };

  const handleVerHoras = (u: UsuarioAyudante) => {
    const ayudante = buildAyudanteFromUsuario(u);
    setSelectedAyudante(ayudante);
    setIsModalOpen(true);
    setNotas("");
  };

  const handleAprobarHoras = (reporteId: string) => {
    toast({
      title: "Horas aprobadas",
      description: "Las horas han sido aprobadas exitosamente.",
    });
    setIsModalOpen(false);
  };

  const handleRechazarHoras = (reporteId: string) => {
    if (!notas.trim()) {
      toast({
        title: "Error",
        description: "Debe proporcionar una nota para rechazar las horas.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Horas rechazadas",
      description: "Las horas han sido rechazadas con observaciones.",
    });
    setIsModalOpen(false);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'aprobado':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Aprobado</Badge>;
      case 'rechazado':
        return <Badge variant="destructive">Rechazado</Badge>;
      default:
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>;
    }
  };

  const loadSupervisorAyudantes = async () => {
    const stored = (() => { try { return JSON.parse(localStorage.getItem('auth_tokens') || 'null'); } catch { return null; } })();
    const accessToken = tokens?.accessToken || stored?.accessToken;

    if (!accessToken) {
      toast({ title: 'Sin sesión', description: 'Inicia sesión para cargar ayudantes', variant: 'destructive' });
      return;
    }

    // Obtener el ID del supervisor del usuario autenticado
    const supervisorId = user?.id;
    if (!supervisorId) {
      toast({ title: 'Error', description: 'No se pudo obtener el ID del supervisor', variant: 'destructive' });
      return;
    }

    try {
      // Usar el endpoint con el ID del supervisor
      const resp = await fetch(`${API_BASE}/v1/supervisores/${supervisorId}/ayudantes`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.message || `Error ${resp.status}`);
      }

      const data = await resp.json();
      console.log('📊 Respuesta de ayudantes del supervisor:', data);

      const list = data?.data?.ayudantes || data?.data || [];
      const mapped = list.map((ayudante: any) => ({
        id: ayudante.usuario?.id || ayudante.id,
        nombre: ayudante.usuario?.nombre || ayudante.nombre,
        apellido: ayudante.usuario?.apellido || ayudante.apellido,
        email: ayudante.usuario?.email || ayudante.email,
        carrera: ayudante.usuario?.carrera || ayudante.carrera,
        semestre: ayudante.usuario?.trimestre || ayudante.usuario?.semestre || ayudante.semestre,
        cedula: ayudante.usuario?.cedula || ayudante.cedula,
        telefono: ayudante.usuario?.telefono || ayudante.telefono,
        becaInfo: {
          tipoBeca: ayudante.tipoBeca,
          estado: ayudante.estado,
          periodoInicio: ayudante.periodoInicio,
          periodoFin: ayudante.periodoFin,
          horasRequeridas: ayudante.horasRequeridas,
          horasCompletadas: ayudante.horasCompletadas,
          iaaActual: ayudante.iaaActual,
          plaza: ayudante.plaza,
          fechaAsignacion: ayudante.fechaAsignacion,
          observaciones: ayudante.observaciones
        }
      }));

      setSupervisorAyudantes(mapped);

      if (mapped.length === 0) {
        toast({
          title: 'Sin ayudantes',
          description: 'No tienes ayudantes asignados actualmente',
          variant: 'default'
        });
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'No se pudieron cargar los ayudantes', variant: 'destructive' });
    }
  };

  useEffect(() => {
    loadSupervisorAyudantes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens?.accessToken]);

  return (
    <div className="space-y-6">
      {/* Encabezado de lista de ayudantes removido según solicitud */}

      

      {/* Tabla de ayudantes asignados al supervisor (GET /supervisores/ayudantes) */}
      <Card className="border border-orange/20">
        <CardHeader className="bg-orange/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-primary">Ayudantes asignados</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadSupervisorAyudantes()}
              className="border-orange/40 hover:bg-orange/10 hover:border-orange/60"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Recargar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-orange/20">
                <tr>
                  <th className="text-left p-4 font-semibold text-primary">Nombre</th>
                  <th className="text-left p-4 font-semibold text-primary">Email</th>
                  <th className="text-left p-4 font-semibold text-primary">Carrera</th>
                  <th className="text-left p-4 font-semibold text-primary">Semestre</th>
                  <th className="text-center p-4 font-semibold text-primary">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {supervisorAyudantes.map((a, index) => (
                  <tr key={a.id || index} className={`border-b border-orange/10 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}>
                    <td className="p-4 text-primary font-medium">{a.nombre} {a.apellido || ''}</td>
                    <td className="p-4 text-muted-foreground">{a.email || '-'}</td>
                    <td className="p-4 text-muted-foreground">{a.carrera || '-'}</td>
                    <td className="p-4 text-muted-foreground">{typeof a.semestre === 'number' ? a.semestre : '-'}</td>
                    <td className="p-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-orange/40 hover:bg-orange/10 hover:border-orange/60"
                        onClick={() => {
                          setSelectedAyudante({
                            id: a.id,
                            nombre: a.nombre,
                            apellido: a.apellido || '',
                            cedula: a.cedula || '-',
                            trimestre: a.semestre || 0,
                            horasRegistradas: parseFloat(a.becaInfo?.horasCompletadas || '0'),
                            horasPendientes: a.becaInfo?.horasRequeridas ? (a.becaInfo.horasRequeridas - parseFloat(a.becaInfo.horasCompletadas || '0')) : 0,
                            reportesHoras: []
                          });
                          setIsModalOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
                {supervisorAyudantes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-muted-foreground">Sin ayudantes asignados</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal para ver y gestionar horas */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">
              Gestión de Horas - {selectedAyudante?.nombre} {selectedAyudante?.apellido}
            </DialogTitle>
          </DialogHeader>
          
          {selectedAyudante && (
            <div className="space-y-6">
              {/* Información del estudiante becario */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-primary mb-4">Información del Estudiante</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nombre Completo</p>
                    <p className="font-medium text-primary">{selectedAyudante.nombre} {selectedAyudante.apellido}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cédula</p>
                    <p className="font-medium">{selectedAyudante.cedula}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{supervisorAyudantes.find(a => a.id === selectedAyudante.id)?.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="font-medium">{supervisorAyudantes.find(a => a.id === selectedAyudante.id)?.telefono || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Carrera</p>
                    <p className="font-medium">{supervisorAyudantes.find(a => a.id === selectedAyudante.id)?.carrera || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trimestre</p>
                    <p className="font-medium">{selectedAyudante.trimestre || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Información de la Beca */}
              {supervisorAyudantes.find(a => a.id === selectedAyudante.id)?.becaInfo && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-primary mb-4">Información de la Beca</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(() => {
                      const becaInfo = supervisorAyudantes.find(a => a.id === selectedAyudante.id)?.becaInfo;
                      return (
                        <>
                          <div>
                            <p className="text-sm text-muted-foreground">Tipo de Beca</p>
                            <Badge className="mt-1">{becaInfo?.tipoBeca || '-'}</Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Estado</p>
                            <Badge variant={becaInfo?.estado === 'Activa' ? 'default' : 'secondary'} className="mt-1">
                              {becaInfo?.estado || '-'}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Período</p>
                            <p className="font-medium">{becaInfo?.periodoInicio || '-'} {becaInfo?.periodoFin ? `- ${becaInfo.periodoFin}` : ''}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">IAA Actual</p>
                            <p className="font-medium">{becaInfo?.iaaActual || '-'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Horas Completadas / Requeridas</p>
                            <p className="font-medium text-primary">
                              {parseFloat(becaInfo?.horasCompletadas || '0').toFixed(2)} / {becaInfo?.horasRequeridas || 0} horas
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${Math.min((parseFloat(becaInfo?.horasCompletadas || '0') / (becaInfo?.horasRequeridas || 1)) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Fecha de Asignación</p>
                            <p className="font-medium">{becaInfo?.fechaAsignacion ? new Date(becaInfo.fechaAsignacion).toLocaleDateString('es-ES') : '-'}</p>
                          </div>
                          {becaInfo?.plaza && (
                            <div className="col-span-2">
                              <p className="text-sm text-muted-foreground mb-2">Plaza Asignada</p>
                              <div className="bg-white/50 border border-blue-300 rounded-lg p-3">
                                <p className="font-semibold text-primary">{becaInfo.plaza.materia}</p>
                                <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Código:</span>
                                    <span className="ml-1 font-medium">{becaInfo.plaza.codigo}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Departamento:</span>
                                    <span className="ml-1 font-medium">{becaInfo.plaza.departamento}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Tipo:</span>
                                    <span className="ml-1 font-medium capitalize">{becaInfo.plaza.tipoAyudantia}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {becaInfo?.observaciones && (
                            <div className="col-span-2">
                              <p className="text-sm text-muted-foreground">Observaciones</p>
                              <p className="text-sm bg-white/50 p-3 rounded border border-blue-300 mt-1">{becaInfo.observaciones}</p>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Lista de reportes de horas / Disponibilidad */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Disponibilidad Seleccionada</h3>

                {/* Mostrar disponibilidad si llegó desde la tarjeta de disponibilidades */}
                {selectedDisponibilidad?.disponibilidad ? (
                  <div className="border border-orange/20 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      {Object.entries(selectedDisponibilidad.disponibilidad).map(([dia, horas]) => (
                        <div key={dia}>
                          <p className="text-muted-foreground capitalize">{dia}</p>
                          <p className="font-medium">{(horas as string[]).length > 0 ? (horas as string[]).join(', ') : '-'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No hay disponibilidad asociada a este usuario en la selección actual.</div>
                )}

                <h3 className="text-lg font-semibold text-primary">Reportes de Horas</h3>
                {selectedAyudante.reportesHoras.map((reporte) => (
                  <div key={reporte.id} className="border border-orange/20 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(reporte.fecha).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="font-medium">{reporte.horas} horas</span>
                        </div>
                      </div>
                      {getEstadoBadge(reporte.estado)}
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Descripción de actividades:</p>
                      <p className="text-sm">{reporte.descripcion}</p>
                    </div>

                    {reporte.notas && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Notas del supervisor:</p>
                        <p className="text-sm bg-muted/50 p-2 rounded">{reporte.notas}</p>
                      </div>
                    )}

                    {reporte.estado === 'pendiente' && (
                      <div className="space-y-3">
                        <Separator />
                        <div className="space-y-3">
                          <Label htmlFor="notas">Notas (opcional para aprobación, requerido para rechazo)</Label>
                          <Textarea
                            id="notas"
                            placeholder="Escriba sus observaciones aquí..."
                            value={notas}
                            onChange={(e) => setNotas(e.target.value)}
                            className="min-h-20"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleAprobarHoras(reporte.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Aprobar Horas
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={() => handleRechazarHoras(reporte.id)}
                            className="flex-1"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Rechazar Horas
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {selectedAyudante.reportesHoras.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay reportes de horas registrados</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListaAyudantes;