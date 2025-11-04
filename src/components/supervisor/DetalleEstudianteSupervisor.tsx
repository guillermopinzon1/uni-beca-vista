import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Mail, Phone, BookOpen, GraduationCap, MapPin, Clock, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { obtenerDetalleBecario, listarReportesDeAyudante, type EstudianteBecarioDetallado, type ReporteSemanal } from "@/lib/api/supervisor";

interface DetalleEstudianteSupervisorProps {
  becarioId: string;
  isOpen: boolean;
  onClose: () => void;
}

const DetalleEstudianteSupervisor = ({ becarioId, isOpen, onClose }: DetalleEstudianteSupervisorProps) => {
  const { tokens } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [becario, setBecario] = useState<EstudianteBecarioDetallado | null>(null);
  const [reportes, setReportes] = useState<ReporteSemanal[]>([]);

  useEffect(() => {
    if (isOpen && becarioId) {
      loadData();
    }
  }, [isOpen, becarioId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      // Cargar detalle del becario
      const becarioResponse = await obtenerDetalleBecario(accessToken, becarioId);
      setBecario(becarioResponse.data);

      // Cargar últimos 5 reportes
      try {
        const reportesResponse = await listarReportesDeAyudante(accessToken, becarioId, { limit: 5 });
        setReportes(reportesResponse.data.reportes);
      } catch (error) {
        console.warn('No se pudieron cargar los reportes', error);
        setReportes([]);
      }
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

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, { className: string }> = {
      'Activa': { className: 'bg-green-100 text-green-800 border-green-200' },
      'Suspendida': { className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'Culminada': { className: 'bg-blue-100 text-blue-800 border-blue-200' },
      'Cancelada': { className: 'bg-red-100 text-red-800 border-red-200' },
    };
    const variant = variants[estado] || { className: 'bg-gray-100 text-gray-800' };
    return <Badge className={variant.className}>{estado}</Badge>;
  };

  const getReporteEstadoBadge = (estado: string) => {
    const variants: Record<string, { className: string }> = {
      'Pendiente': { className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'Aprobada': { className: 'bg-green-100 text-green-800 border-green-200' },
      'Rechazada': { className: 'bg-red-100 text-red-800 border-red-200' },
      'En Revisión': { className: 'bg-blue-100 text-blue-800 border-blue-200' },
    };
    const variant = variants[estado] || { className: 'bg-gray-100 text-gray-800' };
    return <Badge className={variant.className}>{estado}</Badge>;
  };

  const calcularProgreso = (completadas: number, requeridas: number) => {
    if (requeridas === 0) return 0;
    return Math.min(Math.round((completadas / requeridas) * 100), 100);
  };

  if (!becario && !loading) {
    return null;
  }

  const horasCompletadas = Number(becario?.horasCompletadas) || 0;
  const horasRequeridas = Number(becario?.horasRequeridas) || 1;
  const progreso = calcularProgreso(horasCompletadas, horasRequeridas);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detalle del Estudiante</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando información...</p>
            </div>
          </div>
        ) : becario ? (
          <div className="space-y-6">
            {/* Información Personal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre Completo</p>
                  <p className="font-medium">
                    {becario.usuario.nombre} {becario.usuario.apellido}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cédula</p>
                  <p className="font-medium">{becario.usuario.cedula}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{becario.usuario.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="font-medium">{becario.usuario.telefono || 'No registrado'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Carrera</p>
                    <p className="font-medium">{becario.usuario.carrera}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Trimestre</p>
                    <p className="font-medium">{becario.usuario.trimestre}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de Beca */}
            <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Información de Beca
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Beca</p>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 mt-1">
                    Ayudantía
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Descuento Aplicado</p>
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-lg font-bold px-4 py-2 mt-1">
                    25%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Plaza Asignada */}
            {becario.plaza && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Plaza Asignada
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Nombre de la Plaza</p>
                    <p className="font-medium">{becario.plaza.nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ubicación</p>
                    <p className="font-medium">{becario.plaza.ubicacion}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo de Ayudantía</p>
                    <p className="font-medium capitalize">{becario.plaza.tipoAyudantia}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Horas Semanales</p>
                      <p className="font-medium">{becario.plaza.horasSemana}h/semana</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progreso de Horas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Progreso de Horas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Progreso Total</span>
                  <span className="text-2xl font-bold">{progreso}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all ${
                      progreso >= 100 ? 'bg-green-500' : progreso >= 75 ? 'bg-blue-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${progreso}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Horas Completadas</p>
                    <p className="text-2xl font-bold text-blue-600">{horasCompletadas.toFixed(1)}</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Horas Requeridas</p>
                    <p className="text-2xl font-bold text-purple-600">{horasRequeridas}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Últimos Reportes */}
            {reportes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Últimos Reportes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportes.map((reporte) => (
                      <div
                        key={reporte.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Semana {reporte.semana}</Badge>
                            {getReporteEstadoBadge(reporte.estado)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {reporte.horasTrabajadas}h trabajadas • {reporte.periodoAcademico}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(reporte.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {!becario.plaza && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="flex items-center gap-3 p-4">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-900">Sin Plaza Asignada</p>
                    <p className="text-sm text-yellow-700">
                      Este estudiante aún no tiene una plaza asignada. Contacta al administrador para asignarle una plaza.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No se encontró información del estudiante
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DetalleEstudianteSupervisor;
