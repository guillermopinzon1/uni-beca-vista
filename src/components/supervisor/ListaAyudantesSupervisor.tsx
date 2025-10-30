import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, RefreshCw, Clock, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { obtenerAyudantesDeSupervisor, type EstudianteBecarioDetallado } from "@/lib/api/supervisor";
interface ListaAyudantesSupervisorProps {
  supervisorId?: string; // Si no se pasa, se usa el usuario logueado
  onSelectAyudante?: (ayudante: EstudianteBecarioDetallado) => void;
}

const ListaAyudantesSupervisor = ({ supervisorId, onSelectAyudante }: ListaAyudantesSupervisorProps) => {
  const { user, tokens } = useAuth();
  const { toast } = useToast();
  const [ayudantes, setAyudantes] = useState<EstudianteBecarioDetallado[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Determinar el ID del supervisor a usar
  const effectiveSupervisorId = supervisorId || user?.id;

  const loadAyudantes = async () => {
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

      const response = await obtenerAyudantesDeSupervisor(accessToken, effectiveSupervisorId);
      setAyudantes(response.data.ayudantes);
    } catch (error: any) {
      console.error('Error loading ayudantes:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar los ayudantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAyudantes();
  }, [effectiveSupervisorId]);

  const filteredAyudantes = ayudantes.filter(ayudante => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ayudante.usuario.nombre.toLowerCase().includes(searchLower) ||
      ayudante.usuario.apellido.toLowerCase().includes(searchLower) ||
      ayudante.usuario.email.toLowerCase().includes(searchLower) ||
      ayudante.usuario.cedula.toLowerCase().includes(searchLower) ||
      ayudante.plaza?.materia.toLowerCase().includes(searchLower)
    );
  });

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      'Activa': { className: 'bg-green-100 text-green-800 border-green-200', label: 'Activa' },
      'Suspendida': { className: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Suspendida' },
      'Culminada': { className: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Culminada' },
      'Cancelada': { className: 'bg-red-100 text-red-800 border-red-200', label: 'Cancelada' },
    };
    const variant = variants[estado] || { className: 'bg-gray-100 text-gray-800', label: estado };
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getTipoBecaBadge = (tipo: string) => {
    const variants: Record<string, { className: string }> = {
      'Ayudantía': { className: 'bg-blue-100 text-blue-800 border-blue-200' },
      'Impacto': { className: 'bg-purple-100 text-purple-800 border-purple-200' },
      'Excelencia': { className: 'bg-orange-100 text-orange-800 border-orange-200' },
      'Exoneración de Pago': { className: 'bg-pink-100 text-pink-800 border-pink-200' },
    };
    const variant = variants[tipo] || { className: 'bg-gray-100 text-gray-800' };
    return <Badge variant="outline" className={variant.className}>{tipo}</Badge>;
  };

  const calcularProgreso = (completadas: number, requeridas: number) => {
    if (requeridas === 0) return 0;
    return Math.min(Math.round((completadas / requeridas) * 100), 100);
  };

  const handleVerDetalle = (ayudante: EstudianteBecarioDetallado) => {
    if (onSelectAyudante) {
      onSelectAyudante(ayudante);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mr-3" />
          <span className="text-muted-foreground">Cargando ayudantes...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Mis Ayudantes Asignados
              <Badge variant="outline" className="ml-2">{ayudantes.length}</Badge>
            </CardTitle>
            <CardDescription>
              Lista de estudiantes becarios bajo tu supervisión
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadAyudantes}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        {/* Buscador */}
        <div className="flex items-center space-x-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, cédula, email o materia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredAyudantes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {searchTerm ? (
              <p>No se encontraron ayudantes con el criterio de búsqueda</p>
            ) : (
              <p>No tienes ayudantes asignados actualmente</p>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudiante</TableHead>
                <TableHead>Tipo de Beca</TableHead>
                <TableHead>Horas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAyudantes.map((ayudante) => {
                const horasCompletadas = Number(ayudante.horasCompletadas) || 0;
                const horasRequeridas = Number(ayudante.horasRequeridas) || 1;
                const progreso = calcularProgreso(horasCompletadas, horasRequeridas);
                return (
                  <TableRow key={ayudante.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {ayudante.usuario.nombre} {ayudante.usuario.apellido}
                        </p>
                        <p className="text-sm text-muted-foreground">{ayudante.usuario.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {ayudante.usuario.cedula} • {ayudante.usuario.carrera}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getTipoBecaBadge(ayudante.tipoBeca)}</TableCell>
                    <TableCell>
                      <div className="space-y-2 min-w-[120px]">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progreso:</span>
                          <span className="font-medium">{progreso}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              progreso >= 100 ? 'bg-green-500' : progreso >= 75 ? 'bg-blue-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${progreso}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{horasCompletadas.toFixed(1)}h</span>
                          <span>/ {horasRequeridas}h</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getEstadoBadge(ayudante.estado)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVerDetalle(ayudante)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {/* Resumen */}
        {filteredAyudantes.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Horas Completadas</p>
                <p className="text-xl font-bold">
                  {filteredAyudantes.reduce((sum, a) => sum + (Number(a.horasCompletadas) || 0), 0).toFixed(1)}h
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Becas Activas</p>
                <p className="text-xl font-bold">
                  {filteredAyudantes.filter(a => a.estado === 'Activa').length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Promedio de Progreso</p>
                <p className="text-xl font-bold">
                  {Math.round(
                    filteredAyudantes.reduce((sum, a) => sum + calcularProgreso(Number(a.horasCompletadas) || 0, Number(a.horasRequeridas) || 1), 0) /
                    filteredAyudantes.length
                  )}%
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ListaAyudantesSupervisor;
