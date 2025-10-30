import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  FileText,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Award,
  Target,
  Activity,
  DollarSign
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  getInformeEjecutivo,
  getReporteOperativo,
  getDashboardCumplimiento,
  getAnalisisPredictivo,
  descargarInformeEjecutivo,
  descargarReporteOperativo,
  descargarDashboardCumplimiento,
  descargarAnalisisPredictivo,
} from "@/lib/api/reportes-ejecutivos";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EstadisticasDashboard = () => {
  const { tokens } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [informeEjecutivo, setInformeEjecutivo] = useState<any>(null);
  const [reporteOperativo, setReporteOperativo] = useState<any>(null);
  const [dashboardCumplimiento, setDashboardCumplimiento] = useState<any>(null);
  const [analisisPredictivo, setAnalisisPredictivo] = useState<any>(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;

      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      const [informeData, operativoData, cumplimientoData, predictivoData] = await Promise.all([
        getInformeEjecutivo(accessToken).catch((err) => { console.warn('Endpoint informe-ejecutivo:', err.message); return null; }),
        getReporteOperativo(accessToken).catch((err) => { console.warn('Endpoint operativo:', err.message); return null; }),
        getDashboardCumplimiento(accessToken).catch((err) => { console.warn('Endpoint cumplimiento:', err.message); return null; }),
        getAnalisisPredictivo(accessToken, { periodosHistoricos: 8 }).catch((err) => { console.warn('Endpoint predictivo:', err.message); return null; })
      ]);

      setInformeEjecutivo(informeData);
      setReporteOperativo(operativoData);
      setDashboardCumplimiento(cumplimientoData);
      setAnalisisPredictivo(predictivoData);

    } catch (error: any) {
      console.error('Error cargando estadísticas:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar las estadísticas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleDescargarReporte = async (tipo: 'informe' | 'operativo' | 'cumplimiento' | 'predictivo', formato: 'pdf' | 'excel') => {
    try {
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      toast({
        title: "Generando reporte...",
        description: "Por favor espere mientras se genera el documento"
      });

      switch (tipo) {
        case 'informe':
          await descargarInformeEjecutivo(accessToken, formato, { incluirGraficos: true, incluirProyecciones: true });
          break;
        case 'operativo':
          await descargarReporteOperativo(accessToken, formato);
          break;
        case 'cumplimiento':
          await descargarDashboardCumplimiento(accessToken, formato);
          break;
        case 'predictivo':
          await descargarAnalisisPredictivo(accessToken, formato, { periodosHistoricos: 8, incluirSimulacion: true });
          break;
      }

      toast({
        title: "Descarga exitosa",
        description: `Reporte ${tipo} descargado en formato ${formato.toUpperCase()}`
      });
    } catch (error: any) {
      toast({
        title: "Error al descargar",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getSemaforoColor = (semaforo: string) => {
    switch (semaforo) {
      case 'verde': return 'text-green-600 bg-green-50';
      case 'amarillo': return 'text-yellow-600 bg-yellow-50';
      case 'rojo': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSemaforoIcon = (semaforo: string) => {
    switch (semaforo) {
      case 'verde': return <CheckCircle className="h-5 w-5" />;
      case 'amarillo': return <AlertTriangle className="h-5 w-5" />;
      case 'rojo': return <XCircle className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  if (loading) {
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
          <h1 className="text-3xl font-bold text-primary">Panel de Control Ejecutivo</h1>
          <p className="text-muted-foreground mt-2">
            Métricas y estadísticas del sistema de becas
          </p>
        </div>
        <Button variant="outline" onClick={cargarDatos}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Tabs para diferentes reportes */}
      <Tabs defaultValue="informe" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="informe" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Informe Ejecutivo
          </TabsTrigger>
          <TabsTrigger value="operativo" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Reporte Operativo
          </TabsTrigger>
          <TabsTrigger value="cumplimiento" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Cumplimiento
          </TabsTrigger>
          <TabsTrigger value="predictivo" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Análisis Predictivo
          </TabsTrigger>
        </TabsList>

        {/* ==================== TAB: INFORME EJECUTIVO ==================== */}
        <TabsContent value="informe" className="space-y-6 mt-6">
          {informeEjecutivo ? (
            <>
              {/* Botones de descarga */}
              <div className="flex justify-end gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Informe
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDescargarReporte('informe', 'pdf')}>
                      <FileText className="h-4 w-4 mr-2" />
                      PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDescargarReporte('informe', 'excel')}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Excel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* KPIs principales */}
              {informeEjecutivo.kpis && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Indicadores Clave de Rendimiento
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {informeEjecutivo.kpis.map((kpi: any, index: number) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                              {kpi.nombre}
                            </CardTitle>
                            <div className={`p-2 rounded-full ${getSemaforoColor(kpi.semaforo)}`}>
                              {getSemaforoIcon(kpi.semaforo)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">
                            {kpi.formato === 'porcentaje' ? `${kpi.valor}%` : kpi.valor.toLocaleString()}
                          </div>
                          {kpi.cambio !== 0 && (
                            <div className={`flex items-center mt-2 text-sm ${kpi.cambio > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {kpi.cambio > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                              {Math.abs(kpi.cambio)}%
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Análisis de Postulaciones */}
              {informeEjecutivo.postulaciones && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Análisis de Postulaciones
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Por Estado */}
                    {informeEjecutivo.postulaciones.porEstado && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Distribución por Estado</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {informeEjecutivo.postulaciones.porEstado.map((item: any, index: number) => (
                              <div key={index} className="flex items-center justify-between">
                                <span className="text-sm">{item.estado}</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${
                                        item.estado === 'Aprobada' ? 'bg-green-600' :
                                        item.estado === 'Pendiente' ? 'bg-yellow-600' : 'bg-red-600'
                                      }`}
                                      style={{ width: `${(parseInt(item.cantidad) / informeEjecutivo.postulaciones.total * 100)}%` }}
                                    />
                                  </div>
                                  <span className="font-bold text-sm w-12 text-right">{item.cantidad}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Por Tipo de Beca */}
                    {informeEjecutivo.postulaciones.porTipoBeca && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Distribución por Tipo de Beca</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {informeEjecutivo.postulaciones.porTipoBeca.map((item: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <span className="font-medium text-sm">{item.tipoBeca}</span>
                                <Badge className="bg-blue-600">{item.cantidad}</Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Por Tipo de Postulante */}
                    {informeEjecutivo.postulaciones.porTipoPostulante && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Distribución por Tipo de Postulante</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {informeEjecutivo.postulaciones.porTipoPostulante.map((item: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                <span className="font-medium text-sm capitalize">{item.tipoPostulante.replace(/-/g, ' ')}</span>
                                <Badge className="bg-purple-600">{item.cantidad}</Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}

              {/* Top Beneficiarios */}
              {informeEjecutivo.beneficiarios?.topBeneficiarios && informeEjecutivo.beneficiarios.topBeneficiarios.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Top Beneficiarios Activos
                  </h2>
                  <Card>
                    <CardHeader>
                      <CardTitle>Mejores desempeños en horas completadas</CardTitle>
                      <CardDescription>Estudiantes con mayor progreso en sus becas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {informeEjecutivo.beneficiarios.topBeneficiarios.map((beneficiario: any, index: number) => (
                          <div key={index} className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <div className="font-semibold">{beneficiario.nombre}</div>
                                    <div className="text-sm text-muted-foreground">{beneficiario.email}</div>
                                  </div>
                                </div>
                                <div className="ml-11 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <div className="text-muted-foreground">Cédula</div>
                                    <div className="font-medium">{beneficiario.cedula}</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">Plaza</div>
                                    <div className="font-medium">{beneficiario.plaza || 'Sin asignar'}</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">Horas</div>
                                    <div className="font-medium">{beneficiario.horasCompletadas}/{beneficiario.horasRequeridas}</div>
                                  </div>
                                  <div>
                                    <div className="text-muted-foreground">Progreso</div>
                                    <div className="font-bold text-primary">{beneficiario.progreso}%</div>
                                  </div>
                                </div>
                                <Progress value={parseFloat(beneficiario.progreso)} className="mt-3 ml-11" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Supervisores Top */}
              {informeEjecutivo.beneficiarios?.supervisoresTop && informeEjecutivo.beneficiarios.supervisoresTop.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Supervisores Destacados
                  </h2>
                  <Card>
                    <CardHeader>
                      <CardTitle>Supervisores con mejor desempeño</CardTitle>
                      <CardDescription>Supervisores según cantidad de estudiantes y promedio de completado</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {informeEjecutivo.beneficiarios.supervisoresTop.map((item: any, index: number) => (
                          <div key={index} className="p-4 rounded-lg bg-green-50 border border-green-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold">
                                  {item.supervisor?.nombre} {item.supervisor?.apellido}
                                </div>
                                <div className="text-sm text-muted-foreground">{item.supervisor?.email}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-green-600">{item.cantidadEstudiantes}</div>
                                <div className="text-sm text-muted-foreground">estudiantes</div>
                                <div className="text-sm font-medium mt-1">Promedio: {item.promedioCompletado.toFixed(1)}%</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Métricas de Ayudantías */}
              {informeEjecutivo.ayudantias && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Análisis de Ayudantías
                  </h2>

                  {/* Métricas generales */}
                  {informeEjecutivo.ayudantias.metricas && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Total Ayudantes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{informeEjecutivo.ayudantias.metricas.totalAyudantes}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Total Horas</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{informeEjecutivo.ayudantias.metricas.totalHoras}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Promedio Horas/Ayudante</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{parseFloat(informeEjecutivo.ayudantias.metricas.promedioHorasPorAyudante).toFixed(2)}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Tasa Cumplimiento</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{informeEjecutivo.ayudantias.metricas.tasaCumplimiento}%</div>
                          <Progress value={parseFloat(informeEjecutivo.ayudantias.metricas.tasaCumplimiento)} className="mt-2" />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Evaluación Satisfactoria</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{informeEjecutivo.ayudantias.metricas.tasaEvaluacionSatisfactoria}%</div>
                          <Progress value={parseFloat(informeEjecutivo.ayudantias.metricas.tasaEvaluacionSatisfactoria)} className="mt-2" />
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Por Departamento */}
                  {informeEjecutivo.ayudantias.porDepartamento && informeEjecutivo.ayudantias.porDepartamento.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Distribución por Departamento</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {informeEjecutivo.ayudantias.porDepartamento.map((item: any, index: number) => (
                            <div key={index} className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                              <div className="text-sm text-muted-foreground">
                                {item.departamento || item['plaza.departamento'] || 'Sin departamento'}
                              </div>
                              <div className="text-2xl font-bold text-orange-600">{item.cantidad} ayudantes</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Proyección de cumplimiento */}
                  {informeEjecutivo.ayudantias.proyeccion && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Proyección de Cumplimiento</CardTitle>
                        <CardDescription>
                          Semana actual: {informeEjecutivo.ayudantias.proyeccion.semanaActual} |
                          Semanas restantes: {informeEjecutivo.ayudantias.proyeccion.semanasRestantes}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 rounded-lg bg-green-50 border-l-4 border-green-500">
                            <div className="text-sm text-muted-foreground">Cumplirán</div>
                            <div className="text-3xl font-bold text-green-600">{informeEjecutivo.ayudantias.proyeccion.cumpliran}</div>
                          </div>
                          <div className="p-4 rounded-lg bg-red-50 border-l-4 border-red-500">
                            <div className="text-sm text-muted-foreground">No Cumplirán</div>
                            <div className="text-3xl font-bold text-red-600">{informeEjecutivo.ayudantias.proyeccion.noCumpliran}</div>
                          </div>
                          <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                            <div className="text-sm text-muted-foreground">Tasa de Éxito Proyectada</div>
                            <div className="text-3xl font-bold text-blue-600">{informeEjecutivo.ayudantias.proyeccion.tasaExito}%</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Plazas Top */}
                  {informeEjecutivo.ayudantias.plazasTop && informeEjecutivo.ayudantias.plazasTop.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Plazas con Mayor Demanda</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {informeEjecutivo.ayudantias.plazasTop.map((plaza: any, index: number) => (
                            <div key={index} className="p-4 rounded-lg border bg-card">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-semibold">{plaza.codigo} - {plaza.materia}</div>
                                  <div className="text-sm text-muted-foreground">{plaza.departamento}</div>
                                </div>
                                <div className="text-right">
                                  <Badge className="bg-primary">{plaza.ocupacion}</Badge>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Demanda: {plaza.demanda} | Capacidad: {plaza.capacidad}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Estudiantes en Riesgo */}
                  {informeEjecutivo.ayudantias.estudiantesEnRiesgo && informeEjecutivo.ayudantias.estudiantesEnRiesgo.length > 0 && (
                    <Card className="border-l-4 border-l-red-500">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          Estudiantes en Riesgo
                        </CardTitle>
                        <CardDescription>Ayudantes que requieren atención inmediata</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {informeEjecutivo.ayudantias.estudiantesEnRiesgo.slice(0, 5).map((estudiante: any, index: number) => (
                            <div key={index} className={`p-4 rounded-lg border ${
                              estudiante.nivelRiesgo === 'critico' ? 'bg-red-50 border-red-300' :
                              estudiante.nivelRiesgo === 'alto' ? 'bg-orange-50 border-orange-300' :
                              'bg-yellow-50 border-yellow-300'
                            }`}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-semibold">{estudiante.nombre}</div>
                                  <div className="text-sm text-muted-foreground">{estudiante.email}</div>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 text-sm">
                                    <div>
                                      <div className="text-muted-foreground">Completadas</div>
                                      <div className="font-bold">{estudiante.horasCompletadas}h</div>
                                    </div>
                                    <div>
                                      <div className="text-muted-foreground">Requeridas</div>
                                      <div className="font-bold">{estudiante.horasRequeridas}h</div>
                                    </div>
                                    <div>
                                      <div className="text-muted-foreground">Restantes</div>
                                      <div className="font-bold text-red-600">{estudiante.horasRestantes}h</div>
                                    </div>
                                    <div>
                                      <div className="text-muted-foreground">Progreso</div>
                                      <div className="font-bold">{estudiante.porcentajeCompletado}%</div>
                                    </div>
                                  </div>
                                  <Progress value={parseFloat(estudiante.porcentajeCompletado)} className="mt-3" />
                                  {estudiante.semanasRestantes === 0 && (
                                    <div className="mt-2 text-sm text-red-600 font-medium">
                                      ⚠️ Requiere {estudiante.horasSemanalesRequeridas}h/semana
                                    </div>
                                  )}
                                </div>
                                <Badge variant={estudiante.nivelRiesgo === 'critico' ? 'destructive' : 'secondary'}>
                                  {estudiante.nivelRiesgo}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay datos disponibles para el Informe Ejecutivo</p>
            </div>
          )}
        </TabsContent>

        {/* ==================== TAB: REPORTE OPERATIVO ==================== */}
        <TabsContent value="operativo" className="space-y-6 mt-6">
          {reporteOperativo ? (
            <>
              {/* Botones de descarga */}
              <div className="flex justify-end gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Reporte
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDescargarReporte('operativo', 'pdf')}>
                      <FileText className="h-4 w-4 mr-2" />
                      PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDescargarReporte('operativo', 'excel')}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Excel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Resumen Operativo */}
              {reporteOperativo.resumen && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Resumen Operativo
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Supervisores</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-primary">{reporteOperativo.resumen.totalSupervisores}</div>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Ayudantes Supervisionados</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{reporteOperativo.resumen.totalAyudantesSupervisionados}</div>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Carga Promedio</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-600">{reporteOperativo.resumen.cargaPromedio}</div>
                        <p className="text-xs text-muted-foreground mt-1">ayudantes/supervisor</p>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Alertas Sobrecarga</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-red-600">{reporteOperativo.resumen.alertasSobrecarga}</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Supervisores */}
              {reporteOperativo.supervisores && reporteOperativo.supervisores.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Supervisores
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {reporteOperativo.supervisores.map((supervisor: any, index: number) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                {supervisor.nombre}
                                <div className={`p-2 rounded-full ${getSemaforoColor(supervisor.semaforo || 'verde')}`}>
                                  {getSemaforoIcon(supervisor.semaforo || 'verde')}
                                </div>
                              </CardTitle>
                              <CardDescription>{supervisor.email}</CardDescription>
                            </div>
                            <Badge className="bg-primary text-lg px-4 py-2">
                              Eficiencia: {supervisor.eficiencia}%
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div className="p-3 rounded-lg bg-blue-50">
                              <div className="text-xs text-muted-foreground">Ayudantes</div>
                              <div className="text-2xl font-bold text-blue-600">{supervisor.cantidadAyudantes}</div>
                            </div>
                            <div className="p-3 rounded-lg bg-green-50">
                              <div className="text-xs text-muted-foreground">Reportes Revisados</div>
                              <div className="text-2xl font-bold text-green-600">{supervisor.reportesRevisados}</div>
                            </div>
                            <div className="p-3 rounded-lg bg-green-50">
                              <div className="text-xs text-muted-foreground">Aprobados</div>
                              <div className="text-2xl font-bold text-green-600">{supervisor.reportesAprobados}</div>
                            </div>
                            <div className="p-3 rounded-lg bg-purple-50">
                              <div className="text-xs text-muted-foreground">Tiempo Respuesta</div>
                              <div className="text-2xl font-bold text-purple-600">{supervisor.tiempoPromedioRespuesta}h</div>
                            </div>
                            <div className="p-3 rounded-lg bg-orange-50">
                              <div className="text-xs text-muted-foreground">Satisfacción</div>
                              <div className="text-2xl font-bold text-orange-600">{supervisor.tasaSatisfaccion}%</div>
                            </div>
                            <div className="p-3 rounded-lg bg-primary/10">
                              <div className="text-xs text-muted-foreground">Eficiencia</div>
                              <div className="text-2xl font-bold text-primary">{supervisor.eficiencia}%</div>
                            </div>
                          </div>
                          <Progress value={parseFloat(supervisor.eficiencia)} className="mt-4" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Estudiantes en Riesgo Operativo */}
              {reporteOperativo.estudiantesEnRiesgo && reporteOperativo.estudiantesEnRiesgo.length > 0 && (
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      Estudiantes en Riesgo Crítico
                    </CardTitle>
                    <CardDescription>Requieren intervención inmediata del supervisor</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {reporteOperativo.estudiantesEnRiesgo.map((estudiante: any, index: number) => (
                        <div key={index} className={`p-4 rounded-lg border ${
                          estudiante.nivelUrgencia === 'critico' ? 'bg-red-50 border-red-300' :
                          estudiante.nivelUrgencia === 'alto' ? 'bg-orange-50 border-orange-300' :
                          'bg-yellow-50 border-yellow-300'
                        }`}>
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold">{estudiante.nombre}</h4>
                                  <Badge variant={estudiante.nivelUrgencia === 'critico' ? 'destructive' : 'secondary'} className="text-xs">
                                    {estudiante.nivelUrgencia}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{estudiante.email}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                              <div>
                                <div className="text-muted-foreground">Completadas</div>
                                <div className="font-bold">{estudiante.horasCompletadas}h</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Requeridas</div>
                                <div className="font-bold">{estudiante.horasRequeridas}h</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Restantes</div>
                                <div className="font-bold text-red-600">{estudiante.horasRestantes}h</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Progreso</div>
                                <div className="font-bold">{estudiante.porcentajeCompletado}%</div>
                              </div>
                            </div>

                            <Progress value={parseFloat(estudiante.porcentajeCompletado)} className="h-2" />

                            {estudiante.accionRecomendada && (
                              <div className="mt-2 p-3 rounded-lg bg-white border border-red-300">
                                <div className="flex items-start gap-2">
                                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <div className="text-sm font-semibold text-red-600">Acción Recomendada:</div>
                                    <div className="text-sm mt-1">{estudiante.accionRecomendada}</div>
                                    {estudiante.semanasRestantes === 0 && (
                                      <div className="text-sm text-red-600 font-medium mt-2">
                                        ⚠️ Requiere {estudiante.horasSemanalesRequeridas}h/semana para completar
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Análisis de Plazas */}
              {reporteOperativo.plazas && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Análisis de Plazas
                  </h2>

                  {/* Ocupación de Plazas */}
                  {reporteOperativo.plazas.vacantesVsOcupadas && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Ocupación de Plazas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm text-muted-foreground">Plazas Ocupadas</div>
                              <div className="text-3xl font-bold text-green-600">{reporteOperativo.plazas.vacantesVsOcupadas.ocupadas}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">de</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Total Plazas</div>
                              <div className="text-3xl font-bold text-blue-600">{reporteOperativo.plazas.vacantesVsOcupadas.totales}</div>
                            </div>
                          </div>
                          <Progress
                            value={(reporteOperativo.plazas.vacantesVsOcupadas.ocupadas / reporteOperativo.plazas.vacantesVsOcupadas.totales) * 100}
                            className="h-4"
                          />
                          <div className="text-center text-sm text-muted-foreground">
                            Tasa de ocupación: {((reporteOperativo.plazas.vacantesVsOcupadas.ocupadas / reporteOperativo.plazas.vacantesVsOcupadas.totales) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Plazas Más Productivas */}
                    {reporteOperativo.plazas.masProductivas && reporteOperativo.plazas.masProductivas.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-green-600" />
                            Plazas Más Productivas
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {reporteOperativo.plazas.masProductivas.map((plaza: any, index: number) => (
                              <div key={index} className="p-3 rounded-lg bg-green-50 border border-green-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="font-semibold text-sm">{plaza.nombre}</div>
                                    <div className="text-xs text-muted-foreground">Código: {plaza.codigo}</div>
                                  </div>
                                  <Badge className="bg-green-600">{plaza.porcentajeOcupacion}%</Badge>
                                </div>
                                <Progress value={plaza.porcentajeOcupacion} className="mt-2 h-2" />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Mayor Cumplimiento */}
                    {reporteOperativo.plazas.mayorCumplimiento && reporteOperativo.plazas.mayorCumplimiento.length > 0 ? (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                            Plazas con Mayor Cumplimiento
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {reporteOperativo.plazas.mayorCumplimiento.map((plaza: any, index: number) => (
                              <div key={index} className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="font-semibold text-sm">{plaza.nombre}</div>
                                    <div className="text-xs text-muted-foreground">Código: {plaza.codigo}</div>
                                  </div>
                                  <Badge className="bg-blue-600">{plaza.cumplimiento}%</Badge>
                                </div>
                                <Progress value={plaza.cumplimiento} className="mt-2 h-2" />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                            Plazas con Mayor Cumplimiento
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-8 text-muted-foreground">
                            No hay datos de cumplimiento disponibles
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Recomendaciones */}
                  {reporteOperativo.plazas.recomendaciones && reporteOperativo.plazas.recomendaciones.length > 0 && (
                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          Recomendaciones para Plazas
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {reporteOperativo.plazas.recomendaciones.map((rec: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                              <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Reportes Pendientes */}
              {reporteOperativo.reportesPendientes && (
                <Card className={reporteOperativo.reportesPendientes.total > 0 ? 'border-l-4 border-l-yellow-500' : ''}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-yellow-600" />
                      Reportes Pendientes de Revisión
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {reporteOperativo.reportesPendientes.total > 0 ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-yellow-600">{reporteOperativo.reportesPendientes.total}</div>
                          <div className="text-sm text-muted-foreground">reportes pendientes en total</div>
                        </div>
                        {reporteOperativo.reportesPendientes.criticos && reporteOperativo.reportesPendientes.criticos.length > 0 && (
                          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                            <div className="font-semibold text-red-600 mb-2">Reportes Críticos:</div>
                            <ul className="space-y-1">
                              {reporteOperativo.reportesPendientes.criticos.map((reporte: any, index: number) => (
                                <li key={index} className="text-sm">{reporte}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                        <div className="text-lg font-semibold text-green-600">¡Todo al día!</div>
                        <div className="text-sm text-muted-foreground">No hay reportes pendientes</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay datos disponibles para el Reporte Operativo</p>
            </div>
          )}
        </TabsContent>

        {/* ==================== TAB: DASHBOARD CUMPLIMIENTO ==================== */}
        <TabsContent value="cumplimiento" className="space-y-6 mt-6">
          {dashboardCumplimiento ? (
            <>
              {/* Botones de descarga */}
              <div className="flex justify-end gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Dashboard
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDescargarReporte('cumplimiento', 'pdf')}>
                      <FileText className="h-4 w-4 mr-2" />
                      PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDescargarReporte('cumplimiento', 'excel')}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Excel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Widgets de métricas principales */}
              {dashboardCumplimiento.widgets && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Métricas de Cumplimiento
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Postulaciones en Revisión */}
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Postulaciones en Revisión
                          </CardTitle>
                          <div className={`p-2 rounded-full ${getSemaforoColor(dashboardCumplimiento.widgets.postulacionesEnRevision?.semaforo || 'amarillo')}`}>
                            {getSemaforoIcon(dashboardCumplimiento.widgets.postulacionesEnRevision?.semaforo || 'amarillo')}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{dashboardCumplimiento.widgets.postulacionesEnRevision?.valor || 0}</div>
                        {dashboardCumplimiento.widgets.postulacionesEnRevision?.cambio !== 0 && (
                          <div className={`flex items-center mt-2 text-sm ${dashboardCumplimiento.widgets.postulacionesEnRevision.cambio > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {dashboardCumplimiento.widgets.postulacionesEnRevision.cambio > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                            {Math.abs(dashboardCumplimiento.widgets.postulacionesEnRevision.cambio)}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Beneficiarios Activos */}
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Beneficiarios Activos
                          </CardTitle>
                          <div className={`p-2 rounded-full ${getSemaforoColor(dashboardCumplimiento.widgets.beneficiariosActivos?.semaforo || 'verde')}`}>
                            {getSemaforoIcon(dashboardCumplimiento.widgets.beneficiariosActivos?.semaforo || 'verde')}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{dashboardCumplimiento.widgets.beneficiariosActivos?.valor || 0}</div>
                        {dashboardCumplimiento.widgets.beneficiariosActivos?.cambio !== 0 && (
                          <div className={`flex items-center mt-2 text-sm ${dashboardCumplimiento.widgets.beneficiariosActivos.cambio > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {dashboardCumplimiento.widgets.beneficiariosActivos.cambio > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                            {Math.abs(dashboardCumplimiento.widgets.beneficiariosActivos.cambio)}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Reportes Pendientes */}
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Reportes Pendientes
                          </CardTitle>
                          <div className={`p-2 rounded-full ${getSemaforoColor(dashboardCumplimiento.widgets.reportesPendientes?.semaforo || 'amarillo')}`}>
                            {getSemaforoIcon(dashboardCumplimiento.widgets.reportesPendientes?.semaforo || 'amarillo')}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-yellow-600">{dashboardCumplimiento.widgets.reportesPendientes?.valor || 0}</div>
                        {dashboardCumplimiento.widgets.reportesPendientes?.cambio !== 0 && (
                          <div className={`flex items-center mt-2 text-sm ${dashboardCumplimiento.widgets.reportesPendientes.cambio > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {dashboardCumplimiento.widgets.reportesPendientes.cambio > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                            {Math.abs(dashboardCumplimiento.widgets.reportesPendientes.cambio)}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Tasa de Cumplimiento */}
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Tasa de Cumplimiento
                          </CardTitle>
                          <div className={`p-2 rounded-full ${getSemaforoColor(dashboardCumplimiento.widgets.tasaCumplimiento?.semaforo || 'verde')}`}>
                            {getSemaforoIcon(dashboardCumplimiento.widgets.tasaCumplimiento?.semaforo || 'verde')}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{dashboardCumplimiento.widgets.tasaCumplimiento?.valor || '0%'}</div>
                        <Progress value={parseFloat(dashboardCumplimiento.widgets.tasaCumplimiento?.valor || '0')} className="mt-2" />
                        {dashboardCumplimiento.widgets.tasaCumplimiento?.cambio !== 0 && (
                          <div className={`flex items-center mt-2 text-sm ${dashboardCumplimiento.widgets.tasaCumplimiento.cambio > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {dashboardCumplimiento.widgets.tasaCumplimiento.cambio > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                            {Math.abs(dashboardCumplimiento.widgets.tasaCumplimiento.cambio)}%
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Alertas Críticas */}
              {dashboardCumplimiento.alertas && dashboardCumplimiento.alertas.length > 0 && (
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      Alertas Críticas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dashboardCumplimiento.alertas.map((alerta: any, index: number) => (
                        <div key={index} className={`p-4 rounded-lg ${alerta.tipo === 'critico' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant={alerta.tipo === 'critico' ? 'destructive' : 'secondary'} className="text-xs">
                                  {alerta.categoria}
                                </Badge>
                                <Badge variant={alerta.prioridad === 'alta' ? 'destructive' : 'secondary'} className="text-xs">
                                  {alerta.prioridad}
                                </Badge>
                              </div>
                              <h4 className="font-semibold text-sm">{alerta.titulo}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{alerta.descripcion}</p>
                            </div>
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-600 text-white font-bold text-lg flex-shrink-0">
                              {alerta.cantidad}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Estado del Sistema */}
              {dashboardCumplimiento.estadoSistema && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Estado del Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Salud General */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Salud General del Sistema</span>
                          <span className="text-2xl font-bold text-primary">{dashboardCumplimiento.estadoSistema.saludGeneral}%</span>
                        </div>
                        <Progress value={dashboardCumplimiento.estadoSistema.saludGeneral} className="h-3" />
                      </div>

                      {/* Componentes */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                          <div className="text-sm text-muted-foreground">Operativos</div>
                          <div className="text-2xl font-bold text-green-600">{dashboardCumplimiento.estadoSistema.componentesOperativos}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                          <div className="text-sm text-muted-foreground">Con Advertencia</div>
                          <div className="text-2xl font-bold text-yellow-600">{dashboardCumplimiento.estadoSistema.componentesConAdvertencia}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                          <div className="text-sm text-muted-foreground">Críticos</div>
                          <div className="text-2xl font-bold text-red-600">{dashboardCumplimiento.estadoSistema.componentesCriticos}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

            </>
          ) : (
            <div className="text-center py-16">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay datos disponibles para el Dashboard de Cumplimiento</p>
            </div>
          )}
        </TabsContent>

        {/* ==================== TAB: ANÁLISIS PREDICTIVO ==================== */}
        <TabsContent value="predictivo" className="space-y-6 mt-6">
          {analisisPredictivo ? (
            <>
              {/* Botones de descarga */}
              <div className="flex justify-end gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="default" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Análisis
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDescargarReporte('predictivo', 'pdf')}>
                      <FileText className="h-4 w-4 mr-2" />
                      PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDescargarReporte('predictivo', 'excel')}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Excel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Resumen Histórico */}
              {analisisPredictivo.historico?.resumen && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Resumen Histórico
                    </CardTitle>
                    <CardDescription>
                      Períodos analizados: {analisisPredictivo.periodosAnalizados?.join(', ') || 'N/A'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-blue-50">
                        <div className="text-sm text-muted-foreground">Períodos Analizados</div>
                        <div className="text-3xl font-bold text-blue-600">{analisisPredictivo.historico.resumen.periodosAnalizados}</div>
                      </div>
                      <div className="p-4 rounded-lg bg-green-50">
                        <div className="text-sm text-muted-foreground">Promedio Postulaciones</div>
                        <div className="text-3xl font-bold text-green-600">{analisisPredictivo.historico.resumen.promedioPostulaciones.toFixed(1)}</div>
                      </div>
                      <div className="p-4 rounded-lg bg-purple-50">
                        <div className="text-sm text-muted-foreground">Promedio Beneficiarios</div>
                        <div className="text-3xl font-bold text-purple-600">{analisisPredictivo.historico.resumen.promedioBeneficiarios.toFixed(1)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Escenarios de Proyección */}
              {analisisPredictivo.proyecciones?.escenarios && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Escenarios de Proyección
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Optimista */}
                    <Card className="border-l-4 border-l-green-500">
                      <CardHeader>
                        <CardTitle className="text-green-600">Optimista</CardTitle>
                        <CardDescription>{analisisPredictivo.proyecciones.escenarios.optimista.descripcion}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Postulaciones:</span>
                          <span className="font-bold">{analisisPredictivo.proyecciones.escenarios.optimista.postulaciones}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Beneficiarios:</span>
                          <span className="font-bold">{analisisPredictivo.proyecciones.escenarios.optimista.beneficiarios}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Tasa Aprobación:</span>
                          <span className="font-bold">{analisisPredictivo.proyecciones.escenarios.optimista.tasaAprobacion}%</span>
                        </div>
                        <div className="mt-2 pt-2 border-t">
                          <Badge className="bg-green-600">Probabilidad: {analisisPredictivo.proyecciones.escenarios.optimista.probabilidad}%</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Realista */}
                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <CardTitle className="text-blue-600">Realista</CardTitle>
                        <CardDescription>{analisisPredictivo.proyecciones.escenarios.realista.descripcion}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Postulaciones:</span>
                          <span className="font-bold">{analisisPredictivo.proyecciones.escenarios.realista.postulaciones}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Beneficiarios:</span>
                          <span className="font-bold">{analisisPredictivo.proyecciones.escenarios.realista.beneficiarios}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Tasa Aprobación:</span>
                          <span className="font-bold">{analisisPredictivo.proyecciones.escenarios.realista.tasaAprobacion}%</span>
                        </div>
                        <div className="mt-2 pt-2 border-t">
                          <Badge className="bg-blue-600">Probabilidad: {analisisPredictivo.proyecciones.escenarios.realista.probabilidad}%</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pesimista */}
                    <Card className="border-l-4 border-l-red-500">
                      <CardHeader>
                        <CardTitle className="text-red-600">Pesimista</CardTitle>
                        <CardDescription>{analisisPredictivo.proyecciones.escenarios.pesimista.descripcion}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Postulaciones:</span>
                          <span className="font-bold">{analisisPredictivo.proyecciones.escenarios.pesimista.postulaciones}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Beneficiarios:</span>
                          <span className="font-bold">{analisisPredictivo.proyecciones.escenarios.pesimista.beneficiarios}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Tasa Aprobación:</span>
                          <span className="font-bold">{analisisPredictivo.proyecciones.escenarios.pesimista.tasaAprobacion}%</span>
                        </div>
                        <div className="mt-2 pt-2 border-t">
                          <Badge variant="destructive">Probabilidad: {analisisPredictivo.proyecciones.escenarios.pesimista.probabilidad}%</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Proyección Base */}
              {analisisPredictivo.proyecciones?.proyeccionBase && analisisPredictivo.proyecciones.proyeccionBase.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Proyección Base por Período</CardTitle>
                    <CardDescription>Estimaciones para los próximos períodos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analisisPredictivo.proyecciones.proyeccionBase.map((proyeccion: any, index: number) => (
                        <div key={index} className="p-4 rounded-lg border bg-card">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-lg">{proyeccion.periodo}</h4>
                            <Badge variant={proyeccion.confianza === 'alta' ? 'default' : proyeccion.confianza === 'media' ? 'secondary' : 'destructive'}>
                              Confianza: {proyeccion.confianza}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Postulaciones</div>
                              <div className="font-bold">{proyeccion.postulaciones.estimado}</div>
                              <div className="text-xs text-muted-foreground">
                                Min: {proyeccion.postulaciones.minimo} | Max: {proyeccion.postulaciones.maximo}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Beneficiarios</div>
                              <div className="font-bold">{proyeccion.beneficiarios.estimado}</div>
                              <div className="text-xs text-muted-foreground">
                                Min: {proyeccion.beneficiarios.minimo} | Max: {proyeccion.beneficiarios.maximo}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Horas</div>
                              <div className="font-bold">{proyeccion.horas.estimado}</div>
                              <div className="text-xs text-muted-foreground">
                                Min: {proyeccion.horas.minimo} | Max: {proyeccion.horas.maximo}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Costos</div>
                              <div className="font-bold">${proyeccion.costos.estimado.toLocaleString()}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Análisis de Eficiencia */}
              {analisisPredictivo.eficiencia && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Análisis de Eficiencia
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Departamentos Óptimos */}
                    {analisisPredictivo.eficiencia.departamentosOptimos && analisisPredictivo.eficiencia.departamentosOptimos.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Departamentos Óptimos</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {analisisPredictivo.eficiencia.departamentosOptimos.map((dept: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                                <span className="text-sm">{dept.departamento}</span>
                                <Badge className="bg-green-600">{dept.eficiencia}%</Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Supervisores Eficientes */}
                    {analisisPredictivo.eficiencia.supervisoresEficientes && analisisPredictivo.eficiencia.supervisoresEficientes.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Supervisores Eficientes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {analisisPredictivo.eficiencia.supervisoresEficientes.map((sup: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                                <span className="text-sm">{sup.nombre}</span>
                                <Badge className="bg-blue-600">{sup.eficiencia}%</Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Plazas Efectivas */}
                    {analisisPredictivo.eficiencia.plazasEfectivas && analisisPredictivo.eficiencia.plazasEfectivas.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Plazas Efectivas</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {analisisPredictivo.eficiencia.plazasEfectivas.map((plaza: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-purple-50 rounded">
                                <span className="text-sm">{plaza.plaza}</span>
                                <Badge className="bg-purple-600">{plaza.efectividad}%</Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}

              {/* Recomendaciones */}
              {analisisPredictivo.recomendaciones && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Recomendaciones Estratégicas
                  </h2>

                  {/* Recomendaciones de mediano plazo */}
                  {analisisPredictivo.recomendaciones.medianoPlazo && analisisPredictivo.recomendaciones.medianoPlazo.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Mediano Plazo</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analisisPredictivo.recomendaciones.medianoPlazo.map((rec: any, index: number) => (
                            <div key={index} className="p-4 rounded-lg bg-yellow-50 border-l-4 border-yellow-500">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <Badge className="mb-2">{rec.categoria}</Badge>
                                  <h4 className="font-semibold">{rec.recomendacion}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">{rec.fundamentacion}</p>
                                </div>
                                <Badge variant={rec.prioridad === 'alta' ? 'destructive' : 'secondary'}>
                                  {rec.prioridad}
                                </Badge>
                              </div>
                              {rec.acciones && rec.acciones.length > 0 && (
                                <ul className="mt-3 space-y-1">
                                  {rec.acciones.map((accion: string, i: number) => (
                                    <li key={i} className="text-sm flex items-start gap-2">
                                      <CheckCircle className="h-4 w-4 mt-0.5 text-yellow-600 flex-shrink-0" />
                                      <span>{accion}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Recomendaciones estratégicas */}
                  {analisisPredictivo.recomendaciones.estrategicas && analisisPredictivo.recomendaciones.estrategicas.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Estratégicas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analisisPredictivo.recomendaciones.estrategicas.map((rec: any, index: number) => (
                            <div key={index} className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                              <Badge className="mb-2">{rec.area}</Badge>
                              <h4 className="font-semibold">{rec.recomendacion}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{rec.justificacion}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay datos disponibles para el Análisis Predictivo</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EstadisticasDashboard;
