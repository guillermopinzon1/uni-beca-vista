import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Eye, RefreshCw, UserCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUsers, API_BASE } from "@/lib/api";

interface EstudianteBecario {
  id: string;
  nombre: string;
  cedula: string;
  tipoBeca: string;
  descuentoAplicado?: string;
  estado: "Activo" | "Desactivado" | "Suspendido" | "Finalizado";
  emailVerified?: boolean;
  plaza: string;
  horasRequeridas: number;
  horasCompletadas: number;
  fechaInicio: string;
  fechaFin?: string;
}


const EstudiantesBecarios = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { tokens } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBeca, setFilterBeca] = useState("todos");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [filterSupervisor, setFilterSupervisor] = useState("todos");
  const [activeTab, setActiveTab] = useState("estudiantes");
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState<Array<{ id: string; nombre: string; apellido?: string; cedula?: string; carrera?: string; semestre?: number; iaa?: number; activo?: boolean; emailVerified?: boolean }>>([]);
  const [becarios, setBecarios] = useState<any[]>([]);
  const [becariosLoading, setBecariosLoading] = useState(true);
  const [becariosError, setBecariosError] = useState<string | null>(null);



  // Función para cargar becarios del API
  const loadBecarios = async () => {
    try {
      setBecariosLoading(true);
      setBecariosError(null);
      
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      const response = await fetch(`${API_BASE}/v1/becarios`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error al cargar becarios (${response.status})`);
      }

      const data = await response.json();
      // Estructura esperada: data.data.becarios
      const becariosData = data?.data?.becarios || [];
      setBecarios(Array.isArray(becariosData) ? becariosData : []);
    } catch (err: any) {
      setBecariosError(err.message || "Error al cargar los becarios");
      toast({
        title: "Error",
        description: err.message || "No se pudieron cargar los becarios",
        variant: "destructive"
      });
    } finally {
      setBecariosLoading(false);
    }
  };

  // Cargar becarios al montar el componente
  useEffect(() => {
    loadBecarios();
  }, []);

  const handleVerDetalles = (estudianteId: string) => {
    navigate(`/estudiante/${estudianteId}`);
  };

  // Carga de usuarios desde backend (reemplaza mock)
  const loadUsuarios = async () => {
    const stored = (() => { try { return JSON.parse(localStorage.getItem('auth_tokens') || 'null'); } catch { return null; } })();
    const accessToken = tokens?.accessToken || stored?.accessToken;
    if (!accessToken) {
      toast({ title: 'Sin sesión', description: 'Inicia sesión para cargar becarios', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/v1/becarios`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || `Error obteniendo becarios (${response.status})`);
      }

      const becariosApi = Array.isArray(payload?.data?.becarios) ? payload.data.becarios : [];

      // Mapear a estructura intermedia que luego usamos para la tabla
      const mapped = becariosApi.map((b: any) => {
        const usuario = b.usuario || {};
        const estadoBeca = (b.estado || '').toLowerCase();
        const estadoTabla = estadoBeca === 'activa' ? 'Activo'
          : estadoBeca === 'suspendida' ? 'Suspendido'
          : estadoBeca === 'finalizada' ? 'Finalizado'
          : 'Activo';
        return {
          id: usuario.id || b.usuarioId || b.id,
          nombre: usuario.apellido ? `${usuario.nombre} ${usuario.apellido}` : (usuario.nombre || '-'),
          cedula: usuario.cedula || '-',
          tipoBeca: b.tipoBeca || '-',
          descuentoAplicado: b.descuentoAplicado || '0.00',
          estado: estadoTabla,
          emailVerified: usuario.emailVerified,
          plaza: b.plaza?.nombre || '-',
          horasRequeridas: typeof b.horasRequeridas === 'number' ? b.horasRequeridas : 0,
          horasCompletadas: typeof b.horasCompletadas === 'string' ? parseFloat(b.horasCompletadas) : (b.horasCompletadas || 0),
          fechaInicio: b.periodoInicio || ''
        };
      });

      setUsuarios(mapped);
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'No se pudieron cargar los becarios', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, [tokens?.accessToken]);


  const getEstadoBadge = (estado: string, emailVerified?: boolean) => {
    // Si no está aprobado, siempre mostrar "Pendiente de Aprobación"
    if (emailVerified === false) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">⏳ Pendiente de Aprobación</Badge>;
    }

    // Si está aprobado, mostrar estado normal
    switch (estado) {
      case "Activo":
        return <Badge className="bg-green-100 text-green-800 border-green-200">✅ Aprobado</Badge>;
      case "Desactivado":
        return <Badge variant="destructive">🚫 Inactivo</Badge>;
      case "Suspendido":
        return <Badge variant="destructive">⚠️ Suspendido</Badge>;
      case "Finalizado":
        return <Badge variant="secondary">Finalizado</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };


  const estudiantesFromApi: EstudianteBecario[] = useMemo(() => {
    // Mapea desde payload de /v1/becarios (cargado en loadUsuarios)
    return usuarios.map((u: any) => ({
      id: u.id,
      nombre: u.nombre,
      cedula: u.cedula || '-',
      tipoBeca: u.tipoBeca || '-',
      descuentoAplicado: u.descuentoAplicado || '0.00',
      estado: u.estado as EstudianteBecario['estado'],
      emailVerified: u.emailVerified,
      plaza: u.plaza || '-',
      horasRequeridas: typeof u.horasRequeridas === 'number' ? u.horasRequeridas : 0,
      horasCompletadas: typeof u.horasCompletadas === 'number' ? u.horasCompletadas : 0,
      fechaInicio: u.fechaInicio || ''
    }));
  }, [usuarios]);

  // Supervisor filter no longer applicable; keep empty list
  const supervisoresDisponibles: string[] = [];

  const filteredEstudiantes = estudiantesFromApi.filter(estudiante => {
    const matchesSearch =
      estudiante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.plaza.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBeca = filterBeca === "todos" || estudiante.tipoBeca === filterBeca;
    const matchesEstado = filterEstado === "todos" || estudiante.estado === filterEstado;
    const matchesSupervisor = true;

    return matchesSearch && matchesBeca && matchesEstado && matchesSupervisor;
  });




  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Becarios</h2>
          <p className="text-muted-foreground mt-1">Administración de estudiantes becarios y seguimiento de actividades</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="estudiantes" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Estudiantes Becarios</span>
          </TabsTrigger>
        </TabsList>

        {/* Pestaña Estudiantes Becarios */}
        <TabsContent value="estudiantes" className="space-y-6">
          
          {/* Filtros para Estudiantes */}
          <Card className="border-orange/20 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros de Búsqueda
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, cédula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterBeca} onValueChange={setFilterBeca}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Beca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las Becas</SelectItem>
                  <SelectItem value="Excelencia">Excelencia</SelectItem>
                  <SelectItem value="Ayudantía">Ayudantía</SelectItem>
                  <SelectItem value="Impacto">Impacto</SelectItem>
                  <SelectItem value="Formación Docente">Formación Docente</SelectItem>
                  <SelectItem value="Exoneración">Exoneración</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los Estados</SelectItem>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Suspendido">Suspendido</SelectItem>
                  <SelectItem value="Finalizado">Finalizado</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Estadísticas de Estudiantes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-orange/20 bg-gradient-to-br from-orange-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-primary" />
                  Total Becarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                {becariosLoading ? (
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                ) : becariosError ? (
                  <p className="text-red-500 text-sm">Error al cargar</p>
                ) : (
                  <div className="text-3xl font-bold text-primary">{Array.isArray(becarios) ? becarios.length : 0}</div>
                )}
              </CardContent>
            </Card>
            <Card className="border-orange/20 bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-green-600" />
                  Becarios Activos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {becariosLoading ? (
                  <RefreshCw className="h-8 w-8 animate-spin text-green-600" />
                ) : becariosError ? (
                  <p className="text-red-500 text-sm">Error al cargar</p>
                ) : (
                  <div className="text-3xl font-bold text-green-600">
                    {Array.isArray(becarios) ? becarios.filter(becario => becario.estado?.toLowerCase() === 'activa').length : 0}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tabla de estudiantes */}
          <Card className="border-orange/20 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Lista de Estudiantes Becarios</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {filteredEstudiantes.length} becario{filteredEstudiantes.length !== 1 ? 's' : ''} encontrado{filteredEstudiantes.length !== 1 ? 's' : ''}
                  </p>
                </div>
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
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Estudiante</TableHead>
                      <TableHead className="font-semibold">Tipo de Beca</TableHead>
                      <TableHead className="font-semibold">Descuento</TableHead>
                      <TableHead className="font-semibold">Estado</TableHead>
                      <TableHead className="text-center font-semibold">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEstudiantes.map((estudiante) => (
                      <TableRow key={estudiante.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                              {estudiante.nombre?.charAt(0)?.toUpperCase() || 'E'}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{estudiante.nombre}</p>
                              <p className="text-sm text-muted-foreground">{estudiante.cedula}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {estudiante.tipoBeca}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 border-green-200 font-semibold">
                            {parseFloat(estudiante.descuentoAplicado || '0').toFixed(0)}%
                          </Badge>
                        </TableCell>
                        <TableCell>{getEstadoBadge(estudiante.estado, estudiante.emailVerified)}</TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVerDetalles(estudiante.id)}
                            className="hover:bg-orange/10 hover:text-orange-600"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalles
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredEstudiantes.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-16">
                          <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-20" />
                          <p className="text-lg font-medium">No se encontraron becarios</p>
                          <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

        </TabsContent>


      </Tabs>
    </div>
  );
};

export default EstudiantesBecarios;