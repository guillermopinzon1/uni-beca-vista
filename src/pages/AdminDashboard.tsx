import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Users, UserCheck, FileText, BarChart3, Building, Settings, FileUp, Activity, Clock, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import EstudiantesBecarios from "@/components/admin/EstudiantesBecarios";
import GestionUsuarios from "@/components/admin/GestionUsuarios";
import GestionSupervisores from "@/components/admin/GestionSupervisores";
import GestionPostulaciones from "@/components/admin/GestionPostulaciones";
import GestionPlazas from "@/components/admin/GestionPlazas";
import ConfiguracionBecas from "@/components/admin/ConfiguracionBecas";
import ConfiguracionSistema from "@/components/admin/ConfiguracionSistema";
import GestionUsuariosPendientes from "@/components/admin/GestionUsuariosPendientes";
import EstadisticasDashboard from "@/pages/EstadisticasDashboard";
import DashboardKPIs from "@/components/admin/DashboardKPIs";
import { fetchUsers } from "@/lib/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, tokens } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>("dashboard");
  const [pendingUsersCount, setPendingUsersCount] = useState<number>(0);

  // Cargar contador de usuarios pendientes
  useEffect(() => {
    const loadPendingCount = async () => {
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) return;

      try {
        const res = await fetchUsers(accessToken, {
          emailVerified: false,
          limit: 1
        });
        setPendingUsersCount(res.data.total);
      } catch (e) {
        console.error('Error loading pending users count:', e);
      }
    };

    loadPendingCount();
    // Recargar cada 30 segundos
    const interval = setInterval(loadPendingCount, 30000);
    return () => clearInterval(interval);
  }, [tokens?.accessToken]);

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      onClick: () => setActiveModule("dashboard")
    },
    {
      title: "Usuarios",
      icon: Users,
      onClick: () => setActiveModule("usuarios")
    },
    {
      title: "Becarios",
      icon: UserCheck,
      onClick: () => setActiveModule("estudiantes-becarios")
    },
    {
      title: "Usuarios Pendientes",
      icon: Clock,
      onClick: () => setActiveModule("usuarios-pendientes"),
      badge: pendingUsersCount > 0 ? pendingUsersCount : undefined
    },
    {
      title: "Supervisores",
      icon: UserCheck,
      onClick: () => setActiveModule("supervisores")
    },
    {
      title: "Postulaciones",
      icon: FileText,
      onClick: () => setActiveModule("postulaciones")
    },
    {
      title: "Gestión de Plazas",
      icon: Building,
      onClick: () => setActiveModule("plazas")
    },
    {
      title: "Configuración de Becas",
      icon: Settings,
      onClick: () => setActiveModule("configuracion")
    },
    {
      title: "Configuración del Sistema",
      icon: FileUp,
      onClick: () => setActiveModule("configuracion-sistema")
    },
    {
      title: "Reportes y Estadísticas",
      icon: BarChart3,
      onClick: () => setActiveModule("estadisticas")
    }
  ];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Diseño de fondo con líneas modernas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradientAdmin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#FF6B35', stopOpacity: 0 }} />
              <stop offset="50%" style={{ stopColor: '#FF6B35', stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: '#FF6B35', stopOpacity: 0 }} />
            </linearGradient>
          </defs>

          {/* Líneas diagonales principales (izquierda a derecha, descendente) */}
          <line x1="0" y1="10%" x2="100%" y2="25%" stroke="url(#lineGradientAdmin)" strokeWidth="1.5" opacity="0.4"/>
          <line x1="0" y1="30%" x2="100%" y2="45%" stroke="url(#lineGradientAdmin)" strokeWidth="2" opacity="0.5"/>
          <line x1="0" y1="55%" x2="100%" y2="70%" stroke="url(#lineGradientAdmin)" strokeWidth="1.5" opacity="0.35"/>
          <line x1="0" y1="75%" x2="100%" y2="90%" stroke="url(#lineGradientAdmin)" strokeWidth="1.5" opacity="0.3"/>

          {/* Líneas diagonales secundarias (izquierda a derecha, ascendente) */}
          <line x1="0" y1="85%" x2="100%" y2="70%" stroke="url(#lineGradientAdmin)" strokeWidth="1" opacity="0.25"/>
          <line x1="0" y1="50%" x2="100%" y2="35%" stroke="url(#lineGradientAdmin)" strokeWidth="1" opacity="0.2"/>

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
              <h1 className="text-2xl font-bold text-primary">Panel de Administración</h1>
              <p className="text-sm text-muted-foreground">
                Inicio &gt; Panel de Administración
              </p>
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
            <div className="text-right">
              <p className="text-sm font-medium text-primary">María González</p>
              <p className="text-xs text-muted-foreground">Administrador</p>
            </div>
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
                  className="w-12 h-12 flex items-center justify-center rounded-lg bg-background border border-orange/20 hover:bg-orange/10 hover:border-orange/40 transition-all duration-200 relative"
                >
                  <item.icon className="h-5 w-5 text-primary" />
                  {(item as any).badge && (
                    <Badge
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 border-none"
                    >
                      {(item as any).badge}
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
            {activeModule === "dashboard" ? (
              <DashboardKPIs onNavigateToModule={setActiveModule} />
            ) : activeModule === "usuarios" ? (
              <GestionUsuarios />
            ) : activeModule === "estudiantes-becarios" ? (
              <EstudiantesBecarios />
            ) : activeModule === "usuarios-pendientes" ? (
              <GestionUsuariosPendientes />
            ) : activeModule === "supervisores" ? (
              <GestionSupervisores />
            ) : activeModule === "postulaciones" ? (
              <GestionPostulaciones />
            ) : activeModule === "plazas" ? (
              <GestionPlazas />
            ) : activeModule === "configuracion" ? (
              <ConfiguracionBecas />
            ) : activeModule === "configuracion-sistema" ? (
              <ConfiguracionSistema />
            ) : activeModule === "estadisticas" ? (
              <EstadisticasDashboard />
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-primary mb-4">
                  Bienvenido al Panel de Administración
                </h2>
                <p className="text-muted-foreground">
                  Utiliza el menú lateral para navegar entre los diferentes módulos
                </p>
                {pendingUsersCount > 0 && (
                  <div className="mt-8 inline-block">
                    <Button
                      onClick={() => setActiveModule("usuarios-pendientes")}
                      className="bg-yellow-500 hover:bg-yellow-600"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      {pendingUsersCount} {pendingUsersCount === 1 ? 'Usuario Pendiente' : 'Usuarios Pendientes'} de Aprobación
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;