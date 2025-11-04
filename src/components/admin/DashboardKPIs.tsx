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
  CalendarDays
} from "lucide-react";
import { API_BASE } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DashboardKPIsProps {
  onNavigateToModule: (module: string) => void;
}

interface KPIData {
  becarios: {
    total: number;
    porTipoBeca: {
      Excelencia: number;
      Ayudantía: number;
      Impacto: number;
      "Exoneración de Pago": number;
      "Formación Docente": number;
    };
    sinPlaza: number;
  };
  plazas: {
    activas: number;
    inactivas: number;
    conCapacidad: number;
  };
  usuarios: {
    total: number;
    supervisores: number;
  };
  operaciones: {
    postulacionesPendientes: number;
    reportesPendientes: number;
  };
  metadata: {
    periodoAcademico: string;
    fechaGeneracion: string;
  };
}

const DashboardKPIs = ({ onNavigateToModule }: DashboardKPIsProps) => {
  const { tokens } = useAuth();
  const { toast } = useToast();
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriodo, setSelectedPeriodo] = useState<string>("todos");

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
      const url = selectedPeriodo === "todos"
        ? `${API_BASE}/v1/dashboard/kpis`
        : `${API_BASE}/v1/dashboard/kpis?periodo=${selectedPeriodo}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar los KPIs');
      }

      const result = await response.json();
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
  const totalBecariosPorTipo = Object.values(kpiData.becarios.porTipoBeca).reduce((a, b) => a + b, 0);
  const becariosPorTipoArray = Object.entries(kpiData.becarios.porTipoBeca).map(([tipo, cantidad]) => ({
    tipo,
    cantidad,
    porcentaje: totalBecariosPorTipo > 0 ? ((cantidad / totalBecariosPorTipo) * 100).toFixed(1) : '0'
  }));

  const totalPlazas = kpiData.plazas.activas + kpiData.plazas.inactivas;
  const porcentajePlazasActivas = totalPlazas > 0 ? ((kpiData.plazas.activas / totalPlazas) * 100).toFixed(1) : '0';

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
          <p className="text-gray-600 mt-1">Métricas y estadísticas del sistema de becas</p>
        </div>
        <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-gray-500" />
          <Select value={selectedPeriodo} onValueChange={setSelectedPeriodo}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los períodos</SelectItem>
              <SelectItem value="2025-1">2025-1</SelectItem>
              <SelectItem value="2024-3">2024-3</SelectItem>
              <SelectItem value="2024-2">2024-2</SelectItem>
              <SelectItem value="2024-1">2024-1</SelectItem>
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


      {/* KPIs principales - Grid superior */}
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
            <p className="text-4xl font-bold text-gray-900 mt-2">{kpiData.becarios.total}</p>
            <p className="text-xs text-gray-500 mt-2">Activos en el sistema · Clic para ver más</p>
          </CardContent>
        </Card>

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
            <p className="text-4xl font-bold text-gray-900 mt-2">{kpiData.usuarios.total}</p>
            <p className="text-xs text-gray-500 mt-2">
              {kpiData.usuarios.supervisores} supervisores · Clic para ver más
            </p>
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
            <p className="text-4xl font-bold text-orange-600 mt-2">{kpiData.plazas.activas}</p>
            <p className="text-xs text-gray-500 mt-2">
              {kpiData.plazas.conCapacidad} con capacidad · Clic para ver más
            </p>
          </CardContent>
        </Card>

        {/* Operaciones Pendientes */}
        <Card
          className="border-orange-200 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-orange-400"
          onClick={() => onNavigateToModule('postulaciones')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              {(kpiData.operaciones.postulacionesPendientes + kpiData.operaciones.reportesPendientes) > 0 && (
                <AlertCircle className="h-5 w-5 text-orange-500" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Pendientes</p>
            <p className="text-4xl font-bold text-orange-600 mt-2">
              {kpiData.operaciones.postulacionesPendientes + kpiData.operaciones.reportesPendientes}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {kpiData.operaciones.postulacionesPendientes} postulaciones, {kpiData.operaciones.reportesPendientes} reportes · Clic para ver más
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sección de gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfica de Becarios por Tipo */}
        <Card className="border-orange-200 shadow-md">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b border-orange-100">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="p-2 bg-orange-500 rounded-lg">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              Distribución de Becarios por Tipo
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

            {/* Alerta de becarios sin plaza */}
            {kpiData.becarios.sinPlaza > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-900">
                      {kpiData.becarios.sinPlaza} becario{kpiData.becarios.sinPlaza !== 1 ? 's' : ''} sin plaza asignada
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Ayudantes que requieren asignación de plaza
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estado de Plazas */}
        <Card className="border-gray-200 shadow-md">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="p-2 bg-gray-700 rounded-lg">
                <Building className="h-5 w-5 text-white" />
              </div>
              Estado de Plazas
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
                <p className="text-2xl font-bold text-orange-700">{kpiData.plazas.activas}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <p className="text-xs text-gray-600 font-medium">Inactivas</p>
                </div>
                <p className="text-2xl font-bold text-gray-700">{kpiData.plazas.inactivas}</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {kpiData.plazas.conCapacidad} plaza{kpiData.plazas.conCapacidad !== 1 ? 's' : ''} con capacidad
                  </p>
                  <p className="text-xs text-gray-600">Disponibles para asignación</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fila de estadísticas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Postulaciones Pendientes */}
        <Card className="border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-700 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Postulaciones Pendientes
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{kpiData.operaciones.postulacionesPendientes}</p>
            <p className="text-sm text-gray-600 mt-2">Requieren evaluación</p>
          </CardContent>
        </Card>

        {/* Reportes Pendientes */}
        <Card className="border-orange-200 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3 bg-gradient-to-r from-orange-50 to-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Reportes Pendientes
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">{kpiData.operaciones.reportesPendientes}</p>
            <p className="text-sm text-gray-600 mt-2">Requieren aprobación</p>
          </CardContent>
        </Card>

        {/* Supervisores Activos */}
        <Card className="border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-700 rounded-lg">
                <UserCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Supervisores
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{kpiData.usuarios.supervisores}</p>
            <p className="text-sm text-gray-600 mt-2">Supervisores activos</p>
          </CardContent>
        </Card>
      </div>

      {/* Footer con timestamp */}
      <div className="text-center text-sm text-gray-500">
        Última actualización: {new Date(kpiData.metadata.fechaGeneracion).toLocaleString('es-VE')}
      </div>
    </div>
  );
};

export default DashboardKPIs;
