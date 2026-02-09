import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  Building,
  FileText,
  Activity,
  TrendingUp,
  UserCheck,
  Clock,
  AlertCircle,
  RefreshCw,
  CalendarDays,
  Brain,
  TrendingDown,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { API_BASE } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { obtenerKPIsGeneral, DashboardKPIsGeneralData } from "@/lib/api/dashboard";

interface DashboardKPIsProps {
  onNavigateToModule: (module: string) => void;
}

const DashboardKPIs = ({ onNavigateToModule }: DashboardKPIsProps) => {
  const { tokens } = useAuth();
  const { toast } = useToast();
  const [kpiData, setKpiData] = useState<DashboardKPIsGeneralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriodo, setSelectedPeriodo] = useState<string>("todos");
  const [periodos, setPeriodos] = useState<Array<{ id: string; periodoAcademico: string; activo: boolean }>>([]);

  const loadPeriodos = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) return;

    try {
      const response = await fetch(`${API_BASE}/v1/configuracion/periodos`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Manejar diferentes estructuras de respuesta
        let periodosData = [];
        if (data.data && Array.isArray(data.data)) {
          periodosData = data.data;
        } else if (data.data && data.data.periodos && Array.isArray(data.data.periodos)) {
          periodosData = data.data.periodos;
        } else if (Array.isArray(data)) {
          periodosData = data;
        }

        // Ordenar por fecha de inicio descendente (más reciente primero)
        periodosData.sort((a: any, b: any) => {
          const dateA = new Date(a.fechaInicio);
          const dateB = new Date(b.fechaInicio);
          return dateB.getTime() - dateA.getTime();
        });

        setPeriodos(periodosData);
      }
    } catch (error) {
      console.error('Error loading períodos:', error);
    }
  };

  const loadKPIs = async () => {
    setLoading(true);
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;

    if (!accessToken) {
      toast({
        title: "Error de autenticación",
        description: "No se encontró token de acceso",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const result = await obtenerKPIsGeneral(
        accessToken,
        selectedPeriodo === "todos" ? undefined : selectedPeriodo
      );

      if (!result?.data) {
        throw new Error('Estructura de respuesta inválida');
      }

      setKpiData(result.data);
    } catch (error: any) {
      console.error('Error cargando KPIs:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar los KPIs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKPIs();
  }, [selectedPeriodo]);

  useEffect(() => {
    loadPeriodos();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!kpiData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No se pudieron cargar los datos del dashboard</p>
      </div>
    );
  }

  // Calcular porcentajes para las gráficas
  const totalBecariosPorTipo = Object.values(kpiData.becas.porTipoBeca).reduce((a, b) => a + b, 0);
  const becariosPorTipoArray = Object.entries(kpiData.becas.porTipoBeca).map(([tipo, cantidad]) => ({
    tipo,
    cantidad,
    porcentaje: totalBecariosPorTipo > 0 ? ((cantidad / totalBecariosPorTipo) * 100).toFixed(1) : '0'
  }));

  const totalPlazas = kpiData.becas.plazasActivas + kpiData.becas.plazasInactivas;
  const porcentajePlazasActivas = totalPlazas > 0 ? ((kpiData.becas.plazasActivas / totalPlazas) * 100).toFixed(1) : '0';

  const coloresBecas = {
    'Excelencia': 'bg-orange-500',
    'Ayudantía': 'bg-orange-400',
    'Impacto': 'bg-gray-500',
    'Exoneración de Pago': 'bg-gray-400',
    'Formación Docente': 'bg-gray-600'
  };

  return (
    <div className="space-y-6">
      {/* Header con filtro de período */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard General</h2>
          <p className="text-gray-600 mt-1">Métricas integradas: Becas, Orientación Vocacional y Usuarios</p>
        </div>
        <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-gray-500" />
          <Select value={selectedPeriodo} onValueChange={setSelectedPeriodo}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los períodos</SelectItem>
              {periodos.map((periodo) => (
                <SelectItem key={periodo.id} value={periodo.periodoAcademico}>
                  {periodo.periodoAcademico}
                  {periodo.activo && ' (Activo)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={loadKPIs}
            variant="outline"
            size="sm"
            className="border-orange-200 hover:bg-orange-50"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>


      {/* ========== SECCIÓN 1: BECAS ========== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <GraduationCap className="h-6 w-6 text-orange-600" />
          <h3 className="text-xl font-bold text-gray-900">Sistema de Becas</h3>
        </div>

        {/* KPIs de Becas - Grid superior */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Becarios */}
          <Card
            className="border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-gray-400"
            onClick={() => onNavigateToModule('estudiantes-becarios')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-gray-700" />
                </div>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Becarios</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{kpiData.becas.totalBecarios}</p>
              <p className="text-xs text-gray-500 mt-2">Activos en el sistema · Clic para ver más</p>
            </CardContent>
          </Card>

          {/* Plazas Activas */}
          <Card
            className="border-orange-200 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-orange-400"
            onClick={() => onNavigateToModule('plazas')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Building className="h-6 w-6 text-orange-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Plazas Activas</p>
              <p className="text-4xl font-bold text-orange-600 mt-2">{kpiData.becas.plazasActivas}</p>
              <p className="text-xs text-gray-500 mt-2">
                {kpiData.becas.plazasConCapacidad} con capacidad · Clic para ver más
              </p>
            </CardContent>
          </Card>

          {/* Postulaciones Pendientes */}
          <Card
            className="border-orange-200 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-orange-400"
            onClick={() => onNavigateToModule('postulaciones')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                {kpiData.becas.postulacionesPendientes > 0 && (
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Postulaciones Pendientes</p>
              <p className="text-4xl font-bold text-orange-600 mt-2">
                {kpiData.becas.postulacionesPendientes}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Requieren revisión · Clic para ver más
              </p>
            </CardContent>
          </Card>

          {/* Reportes Pendientes */}
          <Card className="border-orange-200 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3 bg-gradient-to-r from-orange-50 to-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Reportes Pendientes</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{kpiData.becas.reportesPendientes}</p>
              <p className="text-sm text-gray-600 mt-2">Requieren aprobación</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficas de Becas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfica de Becarios por Tipo */}
        <Card className="border-orange-200 shadow-md">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b border-orange-100">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="p-2 bg-orange-500 rounded-lg">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              Distribución de becarios por tipo
            </CardTitle>
            <CardDescription>Becarios activos por programa de becas</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {becariosPorTipoArray.map((item) => (
                <div key={item.tipo} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{item.tipo}</span>
                    <span className="text-gray-600">{item.cantidad} ({item.porcentaje}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full ${coloresBecas[item.tipo as keyof typeof coloresBecas]} transition-all duration-500`}
                      style={{ width: `${item.porcentaje}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Estado de Plazas */}
        <Card className="border-gray-200 shadow-md">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="p-2 bg-gray-700 rounded-lg">
                <Building className="h-5 w-5 text-white" />
              </div>
              Estado de plazas
            </CardTitle>
            <CardDescription>Distribución y capacidad de plazas</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Gráfica circular de plazas */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="#e5e7eb"
                    strokeWidth="16"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="#FF6B35"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${(parseFloat(porcentajePlazasActivas) / 100) * 502.4} 502.4`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold text-orange-600">{porcentajePlazasActivas}%</span>
                  <span className="text-sm text-gray-600">Activas</span>
                </div>
              </div>
            </div>

            {/* Detalles de plazas */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <p className="text-xs text-gray-600 font-medium">Activas</p>
                </div>
                <p className="text-2xl font-bold text-orange-700">{kpiData.becas.plazasActivas}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <p className="text-xs text-gray-600 font-medium">Inactivas</p>
                </div>
                <p className="text-2xl font-bold text-gray-700">{kpiData.becas.plazasInactivas}</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {kpiData.becas.plazasConCapacidad} plaza{kpiData.becas.plazasConCapacidad !== 1 ? 's' : ''} con capacidad
                  </p>
                  <p className="text-xs text-gray-600">Disponibles para asignación</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>

      {/* ========== SECCIÓN 2: ORIENTACIÓN VOCACIONAL ========== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Brain className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Orientación Vocacional</h3>
        </div>

        {/* KPIs de Orientación Vocacional */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tests Completados */}
          <Card className="border-blue-200 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-blue-600" />
                </div>
                <TrendingUp className="h-5 w-5 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Tests Completados</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{kpiData.orientacionVocacional.testsCompletados}</p>
              <p className="text-xs text-gray-500 mt-2">Tests finalizados exitosamente</p>
            </CardContent>
          </Card>

          {/* Usuarios con Tests */}
          <Card className="border-blue-200 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Usuarios Evaluados</p>
              <p className="text-4xl font-bold text-blue-600 mt-2">{kpiData.orientacionVocacional.usuariosConTests}</p>
              <p className="text-xs text-gray-500 mt-2">Usuarios únicos con test realizado</p>
            </CardContent>
          </Card>

          {/* Tasa de Completitud */}
          <Card className="border-green-200 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Tasa de Completitud</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{kpiData.orientacionVocacional.tasaCompletitud}%</p>
              <p className="text-xs text-gray-500 mt-2">Tests completados vs iniciados</p>
            </CardContent>
          </Card>

          {/* Tests Abandonados */}
          <Card className="border-red-200 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-red-100 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <TrendingDown className="h-5 w-5 text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Tests Abandonados</p>
              <p className="text-4xl font-bold text-red-600 mt-2">{kpiData.orientacionVocacional.testsAbandonados}</p>
              <p className="text-xs text-gray-500 mt-2">Tests iniciados pero no completados</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficas de Orientación Vocacional */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribución por Perfil Vocacional */}
          <Card className="border-blue-200 shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                Perfiles Vocacionales Dominantes
              </CardTitle>
              <CardDescription>Top 6 perfiles más comunes</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {Object.entries(kpiData.orientacionVocacional.perfilesDominantes).length > 0 ? (
                  Object.entries(kpiData.orientacionVocacional.perfilesDominantes)
                    .slice(0, 6)
                    .map(([perfil, cantidad]) => {
                      const total = Object.values(kpiData.orientacionVocacional.perfilesDominantes).reduce((a, b) => a + b, 0);
                      const porcentaje = total > 0 ? ((cantidad / total) * 100).toFixed(1) : '0';

                      return (
                        <div key={perfil} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-700">{perfil}</span>
                            <span className="text-gray-600">{cantidad} ({porcentaje}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className="h-full bg-blue-500 transition-all duration-500"
                              style={{ width: `${porcentaje}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <p className="text-center text-gray-500">No hay datos disponibles</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tests por Tipo */}
          <Card className="border-blue-200 shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-blue-700 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                Distribución por Tipo de Test
              </CardTitle>
              <CardDescription>Tests completados por tipo</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Gráfica circular de tests por tipo */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-48 h-48">
                  {(() => {
                    const total = kpiData.orientacionVocacional.testsPorTipo.Holland_RIASEC + kpiData.orientacionVocacional.testsPorTipo.ICO;
                    const porcentajeHolland = total > 0
                      ? ((kpiData.orientacionVocacional.testsPorTipo.Holland_RIASEC / total) * 100).toFixed(1)
                      : '0';

                    return (
                      <>
                        <svg className="w-48 h-48 transform -rotate-90">
                          <circle cx="96" cy="96" r="80" stroke="#e5e7eb" strokeWidth="16" fill="none" />
                          <circle
                            cx="96" cy="96" r="80" stroke="#3B82F6" strokeWidth="16" fill="none"
                            strokeDasharray={`${(parseFloat(porcentajeHolland) / 100) * 502.4} 502.4`}
                            className="transition-all duration-500"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-4xl font-bold text-blue-600">{porcentajeHolland}%</span>
                          <span className="text-sm text-gray-600">Holland</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Detalles de tests */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <p className="text-xs text-gray-600 font-medium">Holland RIASEC</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">{kpiData.orientacionVocacional.testsPorTipo.Holland_RIASEC}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <p className="text-xs text-gray-600 font-medium">ICO</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-700">{kpiData.orientacionVocacional.testsPorTipo.ICO}</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {kpiData.orientacionVocacional.testsEnProgreso} test{kpiData.orientacionVocacional.testsEnProgreso !== 1 ? 's' : ''} en progreso
                    </p>
                    <p className="text-xs text-gray-600">Iniciados pero no finalizados</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ========== SECCIÓN 3: USUARIOS Y TRANSICIONES ========== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Users className="h-6 w-6 text-purple-600" />
          <h3 className="text-xl font-bold text-gray-900">Usuarios y Transiciones</h3>
        </div>

        {/* KPIs de Usuarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Total Usuarios */}
          <Card
            className="border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-gray-400"
            onClick={() => onNavigateToModule('usuarios')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Users className="h-6 w-6 text-gray-700" />
                </div>
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Usuarios</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{kpiData.usuarios.totalUsuarios}</p>
              <p className="text-xs text-gray-500 mt-2">
                {kpiData.usuarios.totalSupervisores} supervisores · Clic para ver más
              </p>
            </CardContent>
          </Card>

          {/* Aspirantes */}
          <Card className="border-purple-200 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <UserCheck className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Aspirantes Activos</p>
              <p className="text-4xl font-bold text-purple-600 mt-2">{kpiData.usuarios.totalAspirantes}</p>
              <p className="text-xs text-gray-500 mt-2">
                {kpiData.usuarios.aspirantesPendientes} pendientes de verificar
              </p>
            </CardContent>
          </Card>

          {/* Estudiantes */}
          <Card className="border-purple-200 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Estudiantes Activos</p>
              <p className="text-4xl font-bold text-purple-600 mt-2">{kpiData.usuarios.totalEstudiantes}</p>
              <p className="text-xs text-gray-500 mt-2">
                {kpiData.usuarios.estudiantesConBeca} con beca activa
              </p>
            </CardContent>
          </Card>

          {/* Aspirantes Convertidos */}
          <Card className="border-indigo-200 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Aspirantes → Estudiantes</p>
              <p className="text-4xl font-bold text-indigo-600 mt-2">{kpiData.usuarios.aspirantesConvertidos}</p>
              <p className="text-xs text-gray-500 mt-2">
                Transiciones completadas
              </p>
            </CardContent>
          </Card>

          {/* Tasa de Aprobación */}
          <Card className="border-green-200 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Tasa de Aprobación</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{kpiData.usuarios.tasaAprobacion}%</p>
              <p className="text-xs text-gray-500 mt-2">
                {kpiData.usuarios.postulacionesAprobadas} postulaciones aprobadas
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer con timestamp */}
      <div className="text-center text-sm text-gray-500">
        Última actualización: {new Date(kpiData.metadata.fechaGeneracion).toLocaleString('es-VE')}
      </div>
    </div>
  );
};

export default DashboardKPIs;
