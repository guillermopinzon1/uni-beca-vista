import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  Users,
  FileText,
  Download,
  RefreshCw,
  Building,
  Award,
  Activity,
  PieChart,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  exportarBecarios,
  exportarPlazas,
  exportarSupervisores,
  exportarActividades,
  exportarDistribucionBecas,
  exportarDistribucionPostulantes,
  exportarDashboard,
} from "@/lib/api/reportes";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const EstadisticasDashboard = () => {
  const { tokens } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Estados para los datos de cada reporte
  const [becariosData, setBecariosData] = useState<any>(null);
  const [plazasData, setPlazasData] = useState<any>(null);
  const [supervisoresData, setSupervisoresData] = useState<any>(null);
  const [actividadesData, setActividadesData] = useState<any>(null);
  const [distribucionBecasData, setDistribucionBecasData] = useState<any>(null);
  const [distribucionPostulantesData, setDistribucionPostulantesData] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Filtros
  const [filtros, setFiltros] = useState({
    periodo: '2025-1',
    estado: 'todos',
    tipoBeca: 'todos',
    tipoAyudantia: 'todos',
    departamento: '',
  });

  const cargarReporte = async (tipo: string) => {
    try {
      setLoading(true);
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;

      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      switch (tipo) {
        case 'becarios':
          const becariosResponse = await exportarBecarios(accessToken, {
            formato: 'json',
            estado: filtros.estado !== 'todos' ? filtros.estado : undefined,
            tipoBeca: filtros.tipoBeca !== 'todos' ? filtros.tipoBeca : undefined,
          });
          setBecariosData(becariosResponse);
          break;

        case 'plazas':
          const plazasResponse = await exportarPlazas(accessToken, {
            formato: 'json',
            estado: filtros.estado !== 'todos' ? filtros.estado : undefined,
            tipoAyudantia: filtros.tipoAyudantia !== 'todos' ? filtros.tipoAyudantia : undefined,
          });
          setPlazasData(plazasResponse);
          break;

        case 'supervisores':
          const supervisoresResponse = await exportarSupervisores(accessToken, {
            formato: 'json',
            departamento: filtros.departamento || undefined,
          });
          setSupervisoresData(supervisoresResponse);
          break;

        case 'actividades':
          const actividadesResponse = await exportarActividades(accessToken, {
            formato: 'json',
            tipoBeca: filtros.tipoBeca !== 'todos' ? filtros.tipoBeca : undefined,
          });
          setActividadesData(actividadesResponse);
          break;

        case 'distribucion-becas':
          const distribucionBecasResponse = await exportarDistribucionBecas(accessToken, {
            formato: 'json',
          });
          setDistribucionBecasData(distribucionBecasResponse);
          break;

        case 'distribucion-postulantes':
          const distribucionPostulantesResponse = await exportarDistribucionPostulantes(accessToken, {
            formato: 'json',
            tipoBeca: filtros.tipoBeca !== 'todos' ? filtros.tipoBeca : undefined,
          });
          setDistribucionPostulantesData(distribucionPostulantesResponse);
          break;

        case 'dashboard':
          const dashboardResponse = await exportarDashboard(accessToken, {
            formato: 'json',
          });
          setDashboardData(dashboardResponse);
          break;
      }

    } catch (error: any) {
      console.error('Error cargando reporte:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo cargar el reporte",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReporte(activeTab);
  }, [activeTab]);

  const handleDescargar = async (tipo: string, formato: 'pdf' | 'excel' | 'json') => {
    try {
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      toast({
        title: "Generando reporte...",
        description: `Descargando en formato ${formato.toUpperCase()}`
      });

      const params = {
        formato,
        estado: filtros.estado !== 'todos' ? filtros.estado : undefined,
        tipoBeca: filtros.tipoBeca !== 'todos' ? filtros.tipoBeca : undefined,
        tipoAyudantia: filtros.tipoAyudantia !== 'todos' ? filtros.tipoAyudantia : undefined,
        departamento: filtros.departamento || undefined,
      };

      switch (tipo) {
        case 'becarios':
          await exportarBecarios(accessToken, params);
          break;
        case 'plazas':
          await exportarPlazas(accessToken, params);
          break;
        case 'supervisores':
          await exportarSupervisores(accessToken, params);
          break;
        case 'actividades':
          await exportarActividades(accessToken, params);
          break;
        case 'distribucion-becas':
          await exportarDistribucionBecas(accessToken, params);
          break;
        case 'distribucion-postulantes':
          await exportarDistribucionPostulantes(accessToken, params);
          break;
        case 'dashboard':
          await exportarDashboard(accessToken, params);
          break;
      }

      if (formato !== 'json') {
        toast({
          title: "Descarga exitosa",
          description: `Reporte descargado en formato ${formato.toUpperCase()}`
        });
      }
    } catch (error: any) {
      toast({
        title: "Error al descargar",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (loading && !becariosData && !plazasData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Reportes y Estadísticas</h1>
          <p className="text-muted-foreground mt-2">
            Exportación de reportes en múltiples formatos
          </p>
        </div>
        <Button variant="outline" onClick={() => cargarReporte(activeTab)} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Filtros Globales */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Estado</Label>
              <Select value={filtros.estado} onValueChange={(value) => setFiltros({ ...filtros, estado: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Activa">Activa</SelectItem>
                  <SelectItem value="Suspendida">Suspendida</SelectItem>
                  <SelectItem value="Culminada">Culminada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo de Beca</Label>
              <Select value={filtros.tipoBeca} onValueChange={(value) => setFiltros({ ...filtros, tipoBeca: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Ayudantía">Ayudantía</SelectItem>
                  <SelectItem value="Impacto">Impacto</SelectItem>
                  <SelectItem value="Excelencia">Excelencia</SelectItem>
                  <SelectItem value="Exoneración de Pago">Exoneración de Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo de Ayudantía</Label>
              <Select value={filtros.tipoAyudantia} onValueChange={(value) => setFiltros({ ...filtros, tipoAyudantia: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="academica">Académica</SelectItem>
                  <SelectItem value="investigacion">Investigación</SelectItem>
                  <SelectItem value="administrativa">Administrativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Departamento</Label>
              <Input
                value={filtros.departamento}
                onChange={(e) => setFiltros({ ...filtros, departamento: e.target.value })}
                placeholder="Sistemas"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={() => cargarReporte(activeTab)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Aplicar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs para diferentes reportes */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="supervisores" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Supervisores
          </TabsTrigger>
          <TabsTrigger value="becarios" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Becarios
          </TabsTrigger>
          <TabsTrigger value="plazas" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Plazas
          </TabsTrigger>
          <TabsTrigger value="actividades" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Actividades
          </TabsTrigger>
          <TabsTrigger value="distribucion-becas" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Dist. Becas
          </TabsTrigger>
          <TabsTrigger value="distribucion-postulantes" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Dist. Postulantes
          </TabsTrigger>
        </TabsList>

        {/* TAB: DASHBOARD COMPLETO */}
        <TabsContent value="dashboard" className="space-y-6 mt-6">
          <div className="flex justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDescargar('dashboard', 'json')}>
                  <FileText className="h-4 w-4 mr-2" />
                  JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDescargar('dashboard', 'excel')}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDescargar('dashboard', 'pdf')}>
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {dashboardData && dashboardData.becarios ? (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Total Becarios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">{dashboardData.becarios?.length || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Registrados en el sistema</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Becarios Activos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {dashboardData.becarios?.filter((b: any) => b.estado === 'Activa').length || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Estado: Activa</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">En Riesgo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600">
                      {dashboardData.becarios?.filter((b: any) => b.enRiesgo === true).length || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Requieren atención</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Horas Totales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {dashboardData.becarios?.reduce((sum: number, b: any) => sum + parseFloat(b.horasCompletadas || 0), 0).toFixed(0) || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Horas completadas</p>
                  </CardContent>
                </Card>
              </div>

              {/* Distribución por Tipo de Beca */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribución por Tipo de Beca</CardTitle>
                  <CardDescription>Becarios agrupados por programa</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Ayudantía', 'Excelencia', 'Impacto', 'Exoneración de Pago'].map((tipo) => {
                      const count = dashboardData.becarios?.filter((b: any) => b.tipoBeca === tipo).length || 0;
                      const total = dashboardData.becarios?.length || 1;
                      const percentage = ((count / total) * 100).toFixed(1);
                      return (
                        <Card key={tipo}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{tipo}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-primary mb-2">{count}</div>
                            <Progress value={parseFloat(percentage)} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-2">{percentage}% del total</p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Tabla de Becarios */}
              <Card>
                <CardHeader>
                  <CardTitle>Lista de Becarios ({dashboardData.becarios?.length || 0})</CardTitle>
                  <CardDescription>Información detallada de todos los becarios</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Carrera</TableHead>
                        <TableHead>Tipo de Beca</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Descuento</TableHead>
                        <TableHead>IAA</TableHead>
                        <TableHead>Progreso</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dashboardData.becarios?.slice(0, 20).map((becario: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {becario.usuario?.nombre} {becario.usuario?.apellido}
                          </TableCell>
                          <TableCell className="text-sm">{becario.usuario?.carrera || '-'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{becario.tipoBeca}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={becario.estado === 'Activa' ? 'bg-green-100 text-green-800' : ''}>
                              {becario.estado}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              {becario.descuentoAplicado}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {becario.iaaActual ? (
                              <Badge variant="outline">{becario.iaaActual}</Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm">
                                {becario.horasCompletadas}/{becario.horasRequeridas || 0}h
                              </div>
                              <Progress value={becario.porcentajeCompletado || 0} className="h-2 w-20" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={becario.enRiesgo ? "destructive" : "outline"}
                            >
                              {becario.estadoProgreso || 'Normal'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {dashboardData.becarios && dashboardData.becarios.length > 20 && (
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                      Mostrando 20 de {dashboardData.becarios.length} resultados. Descarga el reporte completo para ver todos.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                No hay datos disponibles para este reporte
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* TAB: SUPERVISORES */}
        <TabsContent value="supervisores" className="space-y-6 mt-6">
          <div className="flex justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDescargar('supervisores', 'json')}>
                  <FileText className="h-4 w-4 mr-2" />
                  JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDescargar('supervisores', 'excel')}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDescargar('supervisores', 'pdf')}>
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {supervisoresData && Array.isArray(supervisoresData) ? (
            <Card>
              <CardHeader>
                <CardTitle>Supervisores ({supervisoresData.length})</CardTitle>
                <CardDescription>Carga de trabajo y becarios asignados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {supervisoresData.map((supervisor: any, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {supervisor.nombre} {supervisor.apellido}
                        </CardTitle>
                        <CardDescription className="text-xs">{supervisor.email}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Cédula:</span>
                            <span className="font-medium">{supervisor.cedula}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Departamento:</span>
                            <span className="font-medium text-xs">{supervisor.departamento || '-'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Teléfono:</span>
                            <span className="font-medium text-xs">{supervisor.telefono || '-'}</span>
                          </div>

                          {supervisor.estadisticas && (
                            <>
                              <div className="border-t pt-2 mt-2">
                                <p className="text-xs font-semibold text-muted-foreground mb-2">Estadísticas</p>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Becarios Activos:</span>
                                    <Badge>{supervisor.estadisticas.becariosActivos || 0}</Badge>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Plazas Supervisadas:</span>
                                    <Badge variant="outline">{supervisor.estadisticas.plazasSupervisadas || 0}</Badge>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Horas Supervisadas:</span>
                                    <Badge variant="secondary">{supervisor.estadisticas.horasTotalesSupervisadas || '0.00'}h</Badge>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Reportes Pendientes:</span>
                                    <Badge variant="destructive">{supervisor.estadisticas.reportesPendientesRevision || 0}</Badge>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Reportes Aprobados:</span>
                                    <Badge className="bg-green-100 text-green-800">{supervisor.estadisticas.reportesAprobados || 0}</Badge>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tasa de Aprobación:</span>
                                    <Badge variant="outline">{supervisor.estadisticas.tasaAprobacion || 0}%</Badge>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Capacidad Disponible:</span>
                                    <Badge className="bg-blue-100 text-blue-800">{supervisor.estadisticas.capacidadDisponible || 0}</Badge>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                No hay datos disponibles para este reporte
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* TAB: BECARIOS */}
        <TabsContent value="becarios" className="space-y-6 mt-6">
          <div className="flex justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDescargar('becarios', 'json')}>
                  <FileText className="h-4 w-4 mr-2" />
                  JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDescargar('becarios', 'excel')}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDescargar('becarios', 'pdf')}>
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {becariosData && Array.isArray(becariosData) ? (
            <Card>
              <CardHeader>
                <CardTitle>Lista de Becarios ({becariosData.length})</CardTitle>
                <CardDescription>Progreso, plazas asignadas y supervisores</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo de Beca</TableHead>
                      <TableHead>Descuento</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Plaza</TableHead>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Progreso</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {becariosData.slice(0, 20).map((becario: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {becario.usuario?.nombre} {becario.usuario?.apellido}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{becario.tipoBeca}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            {becario.descuentoAplicado || '0'}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge>{becario.estado}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{becario.plaza?.nombre || '-'}</TableCell>
                        <TableCell className="text-sm">
                          {becario.supervisor ? `${becario.supervisor.nombre} ${becario.supervisor.apellido}` : '-'}
                        </TableCell>
                        <TableCell>
                          {becario.horasCompletadas}/{becario.horasRequeridas}h
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {becariosData.length > 20 && (
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Mostrando 20 de {becariosData.length} resultados. Descarga el reporte completo para ver todos.
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                No hay datos disponibles para este reporte
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* TAB: PLAZAS */}
        <TabsContent value="plazas" className="space-y-6 mt-6">
          <div className="flex justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDescargar('plazas', 'json')}>
                  <FileText className="h-4 w-4 mr-2" />
                  JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDescargar('plazas', 'excel')}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDescargar('plazas', 'pdf')}>
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {plazasData && Array.isArray(plazasData) ? (
            <Card>
              <CardHeader>
                <CardTitle>Plazas ({plazasData.length})</CardTitle>
                <CardDescription>Disponibilidad, ocupación y supervisores responsables</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Ocupación</TableHead>
                      <TableHead>Supervisor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plazasData.slice(0, 20).map((plaza: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{plaza.nombre}</TableCell>
                        <TableCell className="text-sm">{plaza.ubicacion}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{plaza.tipoAyudantia}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge>{plaza.estado}</Badge>
                        </TableCell>
                        <TableCell>
                          {plaza.ocupadas}/{plaza.capacidad}
                          <Progress
                            value={(plaza.ocupadas / plaza.capacidad) * 100}
                            className="mt-2 h-2"
                          />
                        </TableCell>
                        <TableCell className="text-sm">
                          {plaza.supervisor ? `${plaza.supervisor.nombre} ${plaza.supervisor.apellido}` : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {plazasData.length > 20 && (
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Mostrando 20 de {plazasData.length} resultados
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                No hay datos disponibles para este reporte
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* TAB: ACTIVIDADES */}
        <TabsContent value="actividades" className="space-y-6 mt-6">
          <div className="flex justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDescargar('actividades', 'json')}>
                  <FileText className="h-4 w-4 mr-2" />
                  JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDescargar('actividades', 'excel')}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDescargar('actividades', 'pdf')}>
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {actividadesData ? (
            <div className="space-y-4">
              {/* Resumen */}
              {actividadesData.resumen && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total Reportes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{actividadesData.resumen.totalReportes || 0}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Aprobados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">{actividadesData.resumen.aprobados || 0}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Pendientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-yellow-600">{actividadesData.resumen.pendientes || 0}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Rechazados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-600">{actividadesData.resumen.rechazados || 0}</div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Detalles */}
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas de Actividades</CardTitle>
                  <CardDescription>Período: {actividadesData.periodo || filtros.periodo}</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-96">
                    {JSON.stringify(actividadesData, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                No hay datos disponibles para este reporte
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* TAB: DISTRIBUCIÓN BECAS */}
        <TabsContent value="distribucion-becas" className="space-y-6 mt-6">
          <div className="flex justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDescargar('distribucion-becas', 'json')}>
                  <FileText className="h-4 w-4 mr-2" />
                  JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDescargar('distribucion-becas', 'excel')}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDescargar('distribucion-becas', 'pdf')}>
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {distribucionBecasData && Array.isArray(distribucionBecasData) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {distribucionBecasData.map((dist: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{dist.tipoBeca}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Beneficiarios Activos:</span>
                        <Badge className="bg-blue-600">{dist.beneficiariosActivos}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Postulaciones:</span>
                        <Badge variant="outline">{dist.postulaciones}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Aprobadas:</span>
                        <Badge className="bg-green-600">{dist.aprobadas}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Rechazadas:</span>
                        <Badge variant="destructive">{dist.rechazadas}</Badge>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Tasa de Aprobación:</span>
                          <span className="text-lg font-bold text-primary">{dist.tasaAprobacion}%</span>
                        </div>
                        <Progress value={dist.tasaAprobacion} className="mt-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                No hay datos disponibles para este reporte
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* TAB: DISTRIBUCIÓN POSTULANTES */}
        <TabsContent value="distribucion-postulantes" className="space-y-6 mt-6">
          <div className="flex justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDescargar('distribucion-postulantes', 'json')}>
                  <FileText className="h-4 w-4 mr-2" />
                  JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDescargar('distribucion-postulantes', 'excel')}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDescargar('distribucion-postulantes', 'pdf')}>
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {distribucionPostulantesData && Array.isArray(distribucionPostulantesData) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {distribucionPostulantesData.map((dist: any, index: number) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="capitalize">{dist.tipoPostulante.replace(/-/g, ' ')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Postulaciones:</span>
                        <Badge className="bg-purple-600">{dist.postulaciones}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Aprobadas:</span>
                        <Badge className="bg-green-600">{dist.aprobadas}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">IAA Promedio:</span>
                        <Badge variant="outline">{dist.iaaPromedio?.toFixed(2) || 'N/A'}</Badge>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Tasa de Aprobación:</span>
                          <span className="text-lg font-bold text-primary">{dist.tasaAprobacion}%</span>
                        </div>
                        <Progress value={dist.tasaAprobacion} className="mt-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                No hay datos disponibles para este reporte
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EstadisticasDashboard;
