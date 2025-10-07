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
import { fetchUsers } from "@/lib/api";
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

const ayudantesDummy: never[] = [];

const ListaAyudantes = () => {
  const { toast } = useToast();
  const { tokens } = useAuth();
  const [usuarios, setUsuarios] = useState<UsuarioAyudante[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAyudante, setSelectedAyudante] = useState<Ayudante | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notas, setNotas] = useState("");

  const loadUsuarios = async () => {
    const stored = (() => {
      try { return JSON.parse(localStorage.getItem('auth_tokens') || 'null'); } catch { return null; }
    })();
    const accessToken = tokens?.accessToken || stored?.accessToken;
    if (!accessToken) {
      toast({ title: 'Sin sesión', description: 'Inicia sesión para cargar usuarios', variant: 'destructive' });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetchUsers(accessToken);
      const mapped = res.data.usuarios
        .filter(u => !u.role || u.role === 'ayudante')
        .map(u => ({
          id: u.id,
          email: u.email,
          nombre: u.nombre,
          apellido: u.apellido,
          cedula: u.cedula,
          telefono: u.telefono,
          carrera: u.carrera,
          semestre: u.semestre,
        }));
      setUsuarios(mapped);
    } catch (e: any) {
      setError(e?.message || 'No se pudieron cargar los usuarios');
      toast({ title: 'Error', description: e?.message || 'No se pudieron cargar los usuarios', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Lista de Ayudantes</h2>
          <p className="text-muted-foreground">Gestiona los estudiantes ayudantes y sus horas registradas</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-orange">
            {usuarios.length} ayudantes activos
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={loadUsuarios}
            disabled={loading}
            className="border-orange/40 hover:bg-orange/10 hover:border-orange/60"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Recargar
          </Button>
        </div>
      </div>

      <Card className="border border-orange/20">
        <CardHeader className="bg-orange/5">
          <CardTitle className="text-primary">Estudiantes Ayudantes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-orange/20">
                <tr>
                  <th className="text-left p-4 font-semibold text-primary">Email</th>
                  <th className="text-left p-4 font-semibold text-primary">Nombre</th>
                  <th className="text-left p-4 font-semibold text-primary">Apellido</th>
                  <th className="text-left p-4 font-semibold text-primary">Cédula</th>
                  <th className="text-left p-4 font-semibold text-primary">Teléfono</th>
                  <th className="text-left p-4 font-semibold text-primary">Carrera</th>
                  <th className="text-center p-4 font-semibold text-primary">Semestre</th>
                  <th className="text-center p-4 font-semibold text-primary">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u, index) => (
                  <tr 
                    key={u.id} 
                    className={`border-b border-orange/10 hover:bg-orange/5 transition-colors ${
                      index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                    }`}
                  >
                    <td className="p-4 text-primary font-medium">{u.email}</td>
                    <td className="p-4 text-primary font-medium">{u.nombre}</td>
                    <td className="p-4 text-primary font-medium">{u.apellido}</td>
                    <td className="p-4 text-muted-foreground">{u.cedula || '-'}</td>
                    <td className="p-4 text-muted-foreground">{u.telefono || '-'}</td>
                    <td className="p-4 text-muted-foreground">{u.carrera || '-'}</td>
                    <td className="p-4 text-center">
                      <Badge variant="outline" className="border-primary/20 text-primary">
                        {u.semestre ?? '-'}
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerHoras(u)}
                        className="border-orange/40 hover:bg-orange/10 hover:border-orange/60"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Horas
                      </Button>
                    </td>
                  </tr>
                ))}
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
              {/* Información del ayudante */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Cédula</p>
                  <p className="font-medium">{selectedAyudante.cedula}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trimestre</p>
                  <p className="font-medium">{selectedAyudante.trimestre}°</p>
                </div>
              </div>

              {/* Lista de reportes de horas */}
              <div className="space-y-4">
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