import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Eye, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUsers } from "@/lib/api";

interface EstudianteBecario {
  id: string;
  nombre: string;
  cedula: string;
  carrera: string;
  semestre: number;
  promedio: number;
  tipoBeca: string;
  estado: "Activo" | "Suspendido" | "Finalizado";
  supervisor: string;
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
  const [activeTab, setActiveTab] = useState("estudiantes");
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState<Array<{ id: string; nombre: string; apellido?: string; cedula?: string; carrera?: string; semestre?: number }>>([]);
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

      const response = await fetch(`https://srodriguez.intelcondev.org/api/v1/users?role=ayudante`, {
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
      // Asegurar que becarios siempre sea un array
      const becariosData = data.data?.usuarios || data.usuarios || data.data || data || [];
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
      toast({ title: 'Sin sesión', description: 'Inicia sesión para cargar usuarios', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetchUsers(accessToken, { role: 'ayudante' });
      const mapped = res.data.usuarios.map(u => ({
        id: u.id,
        nombre: u.nombre,
        apellido: (u as any).apellido,
        cedula: u.cedula,
        carrera: u.carrera,
        semestre: u.semestre,
      }));
      setUsuarios(mapped);
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'No se pudieron cargar los usuarios', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, [tokens?.accessToken]);


  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Activo":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Activo</Badge>;
      case "Suspendido":
        return <Badge variant="destructive">Suspendido</Badge>;
      case "Finalizado":
        return <Badge variant="secondary">Finalizado</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };


  const estudiantesFromApi: EstudianteBecario[] = useMemo(() => {
    return usuarios.map(u => ({
      id: u.id,
      nombre: u.apellido ? `${u.nombre} ${u.apellido}` : u.nombre,
      cedula: u.cedula || '-',
      carrera: u.carrera || '-',
      semestre: typeof u.semestre === 'number' ? u.semestre : 0,
      promedio: 0,
      tipoBeca: '-',
      estado: 'Activo',
      supervisor: '-',
      fechaInicio: ''
    }));
  }, [usuarios]);

  const filteredEstudiantes = estudiantesFromApi.filter(estudiante => {
    const matchesSearch = 
      estudiante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estudiante.carrera.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBeca = filterBeca === "todos" || estudiante.tipoBeca === filterBeca;
    const matchesEstado = filterEstado === "todos" || estudiante.estado === filterEstado;
    
    return matchesSearch && matchesBeca && matchesEstado;
  });



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Gestión de Estudiantes y Reportes</h2>
          <p className="text-muted-foreground">Administración de estudiantes becarios y seguimiento de actividades</p>
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
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los Estados</SelectItem>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Suspendido">Suspendido</SelectItem>
                    <SelectItem value="Finalizado">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas de Estudiantes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  {becariosLoading ? (
                    <div className="flex items-center justify-center">
                      <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : becariosError ? (
                    <p className="text-red-500 text-sm">Error al cargar</p>
                  ) : (
                    <p className="text-2xl font-bold text-primary">{Array.isArray(becarios) ? becarios.length : 0}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Total Becarios</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  {becariosLoading ? (
                    <div className="flex items-center justify-center">
                      <RefreshCw className="h-6 w-6 animate-spin text-green-600" />
                    </div>
                  ) : becariosError ? (
                    <p className="text-red-500 text-sm">Error al cargar</p>
                  ) : (
                    <p className="text-2xl font-bold text-green-600">
                      {Array.isArray(becarios) ? becarios.filter(becario => becario.activo === true).length : 0}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">Activos</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de estudiantes */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Lista de Estudiantes Becarios ({filteredEstudiantes.length})</CardTitle>
                <Badge variant="secondary" className="text-orange">
                  {filteredEstudiantes.length} estudiantes encontrados
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadUsuarios}
                  disabled={loading}
                  className="ml-2 border-orange/40 hover:bg-orange/10 hover:border-orange/60"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Recargar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estudiante</TableHead>
                      <TableHead>Carrera</TableHead>
                      <TableHead>Trimestre</TableHead>
                      <TableHead>Promedio</TableHead>
                      <TableHead>Tipo de Beca</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEstudiantes.map((estudiante) => (
                      <TableRow key={estudiante.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{estudiante.nombre}</p>
                            <p className="text-sm text-muted-foreground">{estudiante.cedula}</p>
                          </div>
                        </TableCell>
                        <TableCell>{estudiante.carrera}</TableCell>
                        <TableCell>{estudiante.semestre}°</TableCell>
                        <TableCell>
                          <span className="font-medium">{estudiante.promedio}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{estudiante.tipoBeca}</Badge>
                        </TableCell>
                        <TableCell>{getEstadoBadge(estudiante.estado)}</TableCell>
                        <TableCell className="text-sm">{estudiante.supervisor}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleVerDetalles(estudiante.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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