import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Clock, User, FileText, Users, ArrowLeft, AlertCircle, UserCircle, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { obtenerSupervisorCompleto, listarReportesDeAyudante } from "@/lib/api/supervisor";
import ListaAyudantesSupervisor from "@/components/supervisor/ListaAyudantesSupervisor";
import GestionReportesSupervisor from "@/components/supervisor/GestionReportesSupervisor";
import AyudantesSinPlaza from "@/components/supervisor/AyudantesSinPlaza";
import DetalleEstudianteSupervisor from "@/components/supervisor/DetalleEstudianteSupervisor";
import PerfilSupervisor from "@/components/supervisor/PerfilSupervisor";

const SupervisorLaboralDashboard = () => {
  const navigate = useNavigate();
  const { user, tokens, logout } = useAuth();
  const { toast } = useToast();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string>("mis-ayudantes");
  const [stats, setStats] = useState({
    totalPlazas: 0,
    totalAyudantes: 0,
    ayudantesActivos: 0,
    reportesPendientes: 0,
    horasTotalesCompletadas: 0,
    ayudantesSinPlaza: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedBecarioId, setSelectedBecarioId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [supervisorInfo, setSupervisorInfo] = useState<{
    departamento: string | null;
    cargo: string | null;
  } | null>(null);

  // Cargar estadísticas del supervisor usando el nuevo endpoint
  useEffect(() => {
    loadStats();
  }, [user?.id]);

  const loadStats = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      // Cargar datos completos del supervisor con estadísticas
      const supervisorResponse = await obtenerSupervisorCompleto(accessToken, user.id);
      const supervisorData = supervisorResponse.data;

      // Guardar info del supervisor
      setSupervisorInfo({
        departamento: supervisorData.departamento || null,
        cargo: supervisorData.cargo || null,
      });

      // Cargar reportes pendientes
      let totalReportesPendientes = 0;

      for (const ayudante of supervisorData.estudiantesSupervisionados) {
        try {
          const reportesResponse = await listarReportesDeAyudante(accessToken, ayudante.id, {
            estado: 'Pendiente',
            limit: 100,
          });
          totalReportesPendientes += reportesResponse.data.reportes.length;
        } catch (error) {
          console.warn(`No se pudieron cargar reportes del ayudante ${ayudante.id}`, error);
        }
      }

      const ayudantesSinPlaza = supervisorData.estudiantesSupervisionados.filter(a => !a.plaza).length;

      setStats({
        totalPlazas: supervisorData.estadisticas.totalPlazas,
        totalAyudantes: supervisorData.estadisticas.totalAyudantes,
        ayudantesActivos: supervisorData.estadisticas.ayudantesActivos,
        reportesPendientes: totalReportesPendientes,
        horasTotalesCompletadas: supervisorData.estadisticas.totalHorasCompletadas,
        ayudantesSinPlaza,
      });
    } catch (error: any) {
      console.error('Error loading stats:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar las estadísticas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    {
      title: "Mis Ayudantes",
      icon: Users,
      onClick: () => setActiveModule("mis-ayudantes")
    },
    {
      title: "Reportes de Horas",
      icon: FileText,
      onClick: () => setActiveModule("reportes"),
      badge: stats.reportesPendientes > 0 ? stats.reportesPendientes : undefined
    },
    {
      title: "Sin Plaza Asignada",
      icon: AlertCircle,
      onClick: () => setActiveModule("sin-plaza")
    }
  ];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Diseño de fondo con líneas modernas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradientSupervisor" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#FF6B35', stopOpacity: 0 }} />
              <stop offset="50%" style={{ stopColor: '#FF6B35', stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: '#FF6B35', stopOpacity: 0 }} />
            </linearGradient>
          </defs>

          {/* Líneas diagonales principales (izquierda a derecha, descendente) */}
          <line x1="0" y1="10%" x2="100%" y2="25%" stroke="url(#lineGradientSupervisor)" strokeWidth="1.5" opacity="0.4"/>
          <line x1="0" y1="30%" x2="100%" y2="45%" stroke="url(#lineGradientSupervisor)" strokeWidth="2" opacity="0.5"/>
          <line x1="0" y1="55%" x2="100%" y2="70%" stroke="url(#lineGradientSupervisor)" strokeWidth="1.5" opacity="0.35"/>
          <line x1="0" y1="75%" x2="100%" y2="90%" stroke="url(#lineGradientSupervisor)" strokeWidth="1.5" opacity="0.3"/>

          {/* Líneas diagonales secundarias (izquierda a derecha, ascendente) */}
          <line x1="0" y1="85%" x2="100%" y2="70%" stroke="url(#lineGradientSupervisor)" strokeWidth="1" opacity="0.25"/>
          <line x1="0" y1="50%" x2="100%" y2="35%" stroke="url(#lineGradientSupervisor)" strokeWidth="1" opacity="0.2"/>

          {/* Líneas diagonales adicionales con diferentes ángulos */}
          <line x1="0" y1="0" x2="40%" y2="100%" stroke="#FF6B35" strokeWidth="1" opacity="0.08"/>
          <line x1="25%" y1="0" x2="65%" y2="100%" stroke="#FF6B35" strokeWidth="1.5" opacity="0.1"/>
          <line x1="50%" y1="0" x2="90%" y2="100%" stroke="#FF6B35" strokeWidth="1" opacity="0.08"/>
          <line x1="75%" y1="0" x2="100%" y2="50%" stroke="#FF6B35" strokeWidth="1" opacity="0.07"/>

          {/* Líneas diagonales inversas (derecha a izquierda) */}
          <line x1="100%" y1="15%" x2="60%" y2="100%" stroke="#FF6B35" strokeWidth="1" opacity="0.06"/>
          <line x1="100%" y1="45%" x2="80%" y2="100%" stroke="#FF6B35" strokeWidth="1" opacity="0.05"/>
        </svg>
      </div>
      {/* Header */}
      <header className="bg-card border-b border-orange/20 px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout(() => navigate('/'))}
              className="text-primary hover:text-primary/90"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Supervisor Laboral</h1>
              <p className="text-sm text-muted-foreground">
                Inicio &gt; Supervisor Laboral
              </p>
              {supervisorInfo && (supervisorInfo.departamento || supervisorInfo.cargo) && (
                <div className="flex items-center gap-2 mt-1">
                  {supervisorInfo.departamento && (
                    <Badge variant="secondary" className="text-xs">
                      {supervisorInfo.departamento}
                    </Badge>
                  )}
                  {supervisorInfo.cargo && (
                    <Badge variant="secondary" className="text-xs">
                      {supervisorInfo.cargo}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Logo en el centro */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img
              src="/450.jpg"
              alt="UNIMET Logo"
              className="h-12 object-contain"
            />
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveModule("perfil")}
              className="text-right cursor-pointer hover:opacity-80 transition-opacity"
            >
              <p className="text-sm font-medium text-primary">
                {user?.nombre && user?.apellido ? `${user.nombre} ${user.apellido}` : (user?.email || 'Mi Perfil')}
              </p>
              <p className="text-xs text-muted-foreground">Ver perfil</p>
            </button>
          </div>
        </div>
      </header>

      <div className="flex relative z-10">
        {/* Integrated Sidebar */}
        <div className="w-16 bg-card border-r border-orange/20 min-h-[calc(100vh-theme(spacing.20))] relative z-10">
          <div className="p-2 space-y-2">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setHoveredItem(item.title)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={item.onClick}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg bg-background border transition-all duration-200 relative ${
                    activeModule === (item.title === "Mis Ayudantes" ? "mis-ayudantes" : item.title === "Reportes de Horas" ? "reportes" : "sin-plaza")
                      ? "border-orange/40 bg-orange/10"
                      : "border-orange/20 hover:bg-orange/10 hover:border-orange/40"
                  }`}
                >
                  <item.icon className="h-5 w-5 text-primary" />
                  {item.badge && (
                    <Badge
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 border-none"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </button>

                {/* Tooltip on hover */}
                {hoveredItem === item.title && (
                  <div className="absolute left-16 top-0 bg-card border border-orange/20 rounded-lg px-3 py-2 shadow-lg z-10 whitespace-nowrap">
                    <span className="text-sm font-medium text-primary">{item.title}</span>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-card border-l border-b border-orange/20 rotate-45"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Content basado en módulo activo */}
            {activeModule === "mis-ayudantes" ? (
              <>
                {/* Stats Cards - Solo en Mis Ayudantes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="border-blue-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Ayudantes</CardTitle>
                      <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {loading ? "..." : stats.totalAyudantes}
                      </div>
                      <p className="text-xs text-muted-foreground">Estudiantes asignados</p>
                    </CardContent>
                  </Card>

                  <Card className="border-yellow-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Reportes Pendientes</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-600">
                        {loading ? "..." : stats.reportesPendientes}
                      </div>
                      <p className="text-xs text-muted-foreground">Por revisar</p>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Horas Completadas</CardTitle>
                      <Clock className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">
                        {loading ? "..." : stats.horasTotalesCompletadas.toFixed(1)}
                      </div>
                      <p className="text-xs text-muted-foreground">Total de horas</p>
                    </CardContent>
                  </Card>
                </div>

                <ListaAyudantesSupervisor
                  supervisorId={user?.id}
                  onSelectAyudante={(ayudante) => {
                    setSelectedBecarioId(ayudante.id);
                    setIsDetailModalOpen(true);
                  }}
                />
              </>
            ) : activeModule === "reportes" ? (
              <GestionReportesSupervisor supervisorId={user?.id} />
            ) : activeModule === "sin-plaza" ? (
              <AyudantesSinPlaza
                onSelectAyudante={(ayudante) => {
                  setSelectedBecarioId(ayudante.id);
                  setIsDetailModalOpen(true);
                }}
              />
            ) : activeModule === "perfil" ? (
              <PerfilSupervisor />
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-primary mb-4">
                  Bienvenido al Panel de Supervisor Laboral
                </h2>
                <p className="text-muted-foreground">
                  Utiliza el menú lateral para navegar entre los diferentes módulos
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal de Detalle del Estudiante */}
      {selectedBecarioId && (
        <DetalleEstudianteSupervisor
          becarioId={selectedBecarioId}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedBecarioId(null);
          }}
        />
      )}
    </div>
  );
};

export default SupervisorLaboralDashboard;
