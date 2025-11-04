import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Clock, User, FileText, Users, ArrowLeft, AlertCircle, UserCircle, BookOpen, MapPin, Calendar, CalendarDays, FileCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { obtenerSupervisorCompleto, listarReportesDeAyudante } from "@/lib/api/supervisor";
import ListaAyudantesSupervisor from "@/components/supervisor/ListaAyudantesSupervisor";
import GestionReportesSupervisor from "@/components/supervisor/GestionReportesSupervisor";
// import AyudantesSinPlaza from "@/components/supervisor/AyudantesSinPlaza";
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
  const [plazasAsignadas, setPlazasAsignadas] = useState<any[]>([]);

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

      // Guardar plazas asignadas del supervisor
      setPlazasAsignadas(Array.isArray(supervisorData.plazasAsignadas) ? supervisorData.plazasAsignadas : []);

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
    // {
    //   title: "Sin Plaza Asignada",
    //   icon: AlertCircle,
    //   onClick: () => setActiveModule("sin-plaza")
    // }
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
                <ListaAyudantesSupervisor
                  supervisorId={user?.id}
                  onSelectAyudante={(ayudante) => {
                    setSelectedBecarioId(ayudante.id);
                    setIsDetailModalOpen(true);
                  }}
                />

                {/* Plaza Asignada - tarjeta destacada */}
                <div className="mt-8">
                  <Card className="border border-green-200/60 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <CardHeader className="pb-3 bg-gradient-to-r from-green-600 to-emerald-600">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold flex items-center gap-2 text-white">
                          <BookOpen className="h-4 w-4" />
                          Plaza Asignada
                        </CardTitle>
                        {!loading && (
                          <Badge className={`${
                            plazasAsignadas.length > 0
                              ? 'bg-white text-green-700'
                              : 'bg-white/20 text-white'
                          } px-2.5 py-0.5 text-xs font-medium`}>
                            {plazasAsignadas.length > 0 ? 'Activa' : 'Ninguna'}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 pb-5">
                      {loading ? (
                        <div className="h-16 flex items-center justify-center">
                          <div className="flex items-center gap-2 text-green-600">
                            <Clock className="h-4 w-4 animate-spin" />
                            <span className="text-sm font-medium">Cargando...</span>
                          </div>
                        </div>
                      ) : plazasAsignadas.length > 0 ? (
                        <div className="space-y-4">
                          {/* Info principal en grid compacto */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Materia */}
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-green-100 rounded-lg shrink-0">
                                <BookOpen className="h-4 w-4 text-green-700" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-muted-foreground mb-0.5">Materia</p>
                                <p className="text-base font-bold text-gray-900 truncate">
                                  {plazasAsignadas[0].materia || 'Materia'}
                                </p>
                                {plazasAsignadas[0].codigo && (
                                  <Badge variant="outline" className="text-xs border-green-300 text-green-700 mt-1">
                                    {plazasAsignadas[0].codigo}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Ubicación */}
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                                <MapPin className="h-4 w-4 text-blue-700" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-muted-foreground mb-0.5">Ubicación</p>
                                <p className="text-base font-semibold text-gray-900 truncate">
                                  {plazasAsignadas[0].ubicacion || 'No especificada'}
                                </p>
                              </div>
                            </div>

                            {/* Cupos */}
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-purple-100 rounded-lg shrink-0">
                                <Users className="h-4 w-4 text-purple-700" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-muted-foreground mb-0.5">Cupos</p>
                                <p className="text-base font-bold text-purple-900">
                                  {(plazasAsignadas[0].estudiantesAsignados?.length ?? 0)}/{plazasAsignadas[0].capacidad ?? 0}
                                </p>
                                <div className="w-full bg-purple-100 rounded-full h-1.5 mt-1.5">
                                  <div
                                    className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                                    style={{
                                      width: `${plazasAsignadas[0].capacidad > 0
                                        ? ((plazasAsignadas[0].estudiantesAsignados?.length ?? 0) / plazasAsignadas[0].capacidad) * 100
                                        : 0}%`
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Horario compacto */}
                          <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-3.5 w-3.5 text-blue-700" />
                              <h4 className="text-xs font-semibold text-blue-900">Horario</h4>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {(plazasAsignadas[0].horario || []).map((h: any, idx: number) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="bg-white border-blue-200 text-blue-900 px-2 py-0.5 text-xs font-medium"
                                >
                                  <span className="font-bold">{h.dia}</span> {h.horaInicio}-{h.horaFin}
                                </Badge>
                              ))}
                              {(!plazasAsignadas[0].horario || plazasAsignadas[0].horario.length === 0) && (
                                <span className="text-xs text-muted-foreground italic">Sin horario</span>
                              )}
                            </div>
                          </div>

                          {/* Periodo y vigencia en línea */}
                          <div className="flex flex-wrap gap-3 text-sm">
                            <div className="flex items-center gap-2 bg-orange-50/50 px-3 py-2 rounded-lg border border-orange-100">
                              <Calendar className="h-3.5 w-3.5 text-orange-700 shrink-0" />
                              <div>
                                <span className="text-xs text-muted-foreground">Periodo:</span>
                                <span className="ml-1 font-semibold text-orange-900">
                                  {plazasAsignadas[0].periodoAcademico || 'N/D'}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 bg-teal-50/50 px-3 py-2 rounded-lg border border-teal-100 flex-1">
                              <CalendarDays className="h-3.5 w-3.5 text-teal-700 shrink-0" />
                              <div className="truncate">
                                <span className="text-xs text-muted-foreground">Vigencia:</span>
                                <span className="ml-1 text-xs font-semibold text-teal-900">
                                  {plazasAsignadas[0].fechaInicio || 'N/D'} <span className="text-teal-600">→</span> {plazasAsignadas[0].fechaFin || 'N/D'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Descripción compacta */}
                          <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-100">
                            <div className="flex items-center gap-2 mb-1.5">
                              <FileCheck className="h-3.5 w-3.5 text-gray-600" />
                              <h4 className="text-xs font-semibold text-gray-900">Descripción</h4>
                            </div>
                            <p className="text-xs leading-relaxed text-gray-700 line-clamp-2">
                              {plazasAsignadas[0].descripcionActividades || 'Sin descripción disponible'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="py-8 text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                            <BookOpen className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-sm font-semibold text-gray-700 mb-1">Sin plaza asignada</p>
                          <p className="text-xs text-muted-foreground">Verás los detalles cuando se te asigne una plaza</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : activeModule === "reportes" ? (
              <GestionReportesSupervisor supervisorId={user?.id} />
            // ) : activeModule === "sin-plaza" ? (
            //   <AyudantesSinPlaza
            //     onSelectAyudante={(ayudante) => {
            //       setSelectedBecarioId(ayudante.id);
            //       setIsDetailModalOpen(true);
            //     }}
            //   />
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
