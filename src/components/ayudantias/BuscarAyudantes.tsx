import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EstudianteSinPlaza {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  carrera: string;
  trimestre: number;
  promedio: number;
  email: string;
  telefono: string;
  tieneCV: boolean;
}

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
    email?: string;
    nombre?: string;
    apellido?: string;
    role?: string;
    carrera?: string | null;
    semestre?: number | null;
  };
}

const BuscarAyudantes = () => {
  const { tokens } = useAuth();
  const { toast } = useToast();
  const [disponibilidades, setDisponibilidades] = useState<DisponibilidadItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDisp, setSelectedDisp] = useState<DisponibilidadItem | null>(null);
  const [mensajeCorreo, setMensajeCorreo] = useState("");
  
  const handleVerCV = (estudiante: EstudianteSinPlaza) => {
    if (!estudiante.tieneCV) {
      alert("Este estudiante no ha subido su CV");
      return;
    }
    // TODO: Implementar modal para mostrar CV
    console.log("Ver CV de:", estudiante.nombre, estudiante.apellido);
  };

  const handleProponer = (estudiante: EstudianteSinPlaza) => {
    // TODO: Implementar modal de propuesta
    console.log("Proponer a:", estudiante.nombre, estudiante.apellido);
  };

  const getPromedioColor = (promedio: number) => {
    if (promedio >= 18) return "text-green-600";
    if (promedio >= 16) return "text-orange";
    return "text-yellow-600";
  };

  const getPromedioVariant = (promedio: number) => {
    if (promedio >= 18) return "default";
    if (promedio >= 16) return "secondary";
    return "outline";
  };



  const loadDisponibilidades = async (customOffset?: number) => {
    const stored = (() => { try { return JSON.parse(localStorage.getItem('auth_tokens') || 'null'); } catch { return null; } })();
    const accessToken = tokens?.accessToken || stored?.accessToken;
    if (!accessToken) {
      toast({ title: 'Sin sesión', description: 'Inicia sesión para cargar disponibilidades', variant: 'destructive' });
      return;
    }
    setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisponibilidades(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens?.accessToken]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Buscar Ayudantes</h2>
          <p className="text-muted-foreground">Estudiantes sin plaza disponibles por su disponibilidad horaria</p>
        </div>
        <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-orange">
            {disponibilidades.length} registros
        </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadDisponibilidades()}
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
          <CardTitle className="text-primary flex items-center">
            <GraduationCap className="h-5 w-5 mr-2" />
            Estudiantes sin Plaza de Ayudantía
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-orange/20">
                <tr>
                  <th className="text-left p-4 font-semibold text-primary">Email</th>
                  <th className="text-left p-4 font-semibold text-primary">Nombre</th>
                  <th className="text-left p-4 font-semibold text-primary">Apellido</th>
                  <th className="text-left p-4 font-semibold text-primary">Rol</th>
                  <th className="text-left p-4 font-semibold text-primary">Carrera</th>
                  <th className="text-left p-4 font-semibold text-primary">Trimestre</th>
                  <th className="text-center p-4 font-semibold text-primary">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {disponibilidades.map((d, index) => (
                  <tr 
                    key={(d.id || d.usuarioId || index).toString()}
                    className={`border-b border-orange/10 hover:bg-orange/5 transition-colors ${
                      index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                    }`}
                  >
                    <td className="p-4 text-primary font-medium">{d.usuario?.email || '-'}</td>
                    <td className="p-4 text-muted-foreground">{d.usuario?.nombre || '-'}</td>
                    <td className="p-4 text-muted-foreground">{d.usuario?.apellido || '-'}</td>
                    <td className="p-4 text-muted-foreground">{d.usuario?.role || '-'}</td>
                    <td className="p-4 text-muted-foreground">{d.usuario?.carrera ?? '-'}</td>
                    <td className="p-4 text-muted-foreground">{d.usuario?.semestre ?? '-'}</td>
                    <td className="p-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-orange/40 hover:bg-orange/10 hover:border-orange/60"
                        onClick={() => { setSelectedDisp(d); setIsModalOpen(true); }}
                      >
                        Ver Horas
                      </Button>
                    </td>
                  </tr>
                ))}
                {disponibilidades.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-muted-foreground">
                      {loading ? 'Cargando...' : 'Sin registros de disponibilidad'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>


      {/* Modal Ver Horas / Disponibilidad */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">
              Disponibilidad - {selectedDisp?.usuario?.nombre} {selectedDisp?.usuario?.apellido}
            </DialogTitle>
          </DialogHeader>

          {selectedDisp?.disponibilidad ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {Object.entries(selectedDisp.disponibilidad).map(([dia, horas]) => (
                  <div key={dia}>
                    <p className="text-muted-foreground capitalize">{dia}</p>
                    <p className="font-medium">{(horas as string[]).length > 0 ? (horas as string[]).join(', ') : '-'}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mensaje-correo">¿Desea enviarle algún mensaje al correo del postulado?</Label>
                <Textarea
                  id="mensaje-correo"
                  placeholder="Escriba un mensaje para el estudiante..."
                  value={mensajeCorreo}
                  onChange={(e) => setMensajeCorreo(e.target.value)}
                  className="min-h-24"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                    toast({ title: 'Propuesta enviada', description: mensajeCorreo ? 'Mensaje incluido en la propuesta.' : 'Se ha propuesto al ayudante.' });
                  }}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  Proponer
                </Button>
      </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No hay disponibilidad cargada para este usuario.</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuscarAyudantes;