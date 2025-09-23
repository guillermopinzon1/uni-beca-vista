import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar 
} from "@/components/ui/sidebar";
import { 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare, 
  AlertTriangle,
  BarChart3,
  GraduationCap 
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

// Components
import ResumenEstudiantes from "@/components/mentor/ResumenEstudiantes";
import CalendarioMentoria from "@/components/mentor/CalendarioMentoria";
import SolicitudesRetiro from "@/components/mentor/SolicitudesRetiro";
import ReportesMentor from "@/components/mentor/ReportesMentor";
import ComunicacionMentor from "@/components/mentor/ComunicacionMentor";

const menuItems = [
  {
    title: "Resumen de Estudiantes",
    url: "#resumen",
    icon: Users,
  },
  {
    title: "Calendario de Mentoría",
    url: "#calendario",
    icon: Calendar,
  },
  {
    title: "Solicitudes de Retiro",
    url: "#solicitudes",
    icon: FileText,
  },
  {
    title: "Reportes",
    url: "#reportes",
    icon: BarChart3,
  },
  {
    title: "Comunicación",
    url: "#comunicacion",
    icon: MessageSquare,
  },
];

function MentorSidebar({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const isActive = (url: string) => `#${activeTab}` === url;

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Portal de Mentoría</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={isActive(item.url) ? "bg-accent text-accent-foreground" : ""}
                  >
                    <button
                      onClick={() => setActiveTab(item.url.replace('#', ''))}
                      className="w-full flex items-center space-x-2"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

const MentorDashboard = () => {
  const [activeTab, setActiveTab] = useState("resumen");

  const renderContent = () => {
    switch (activeTab) {
      case "resumen":
        return <ResumenEstudiantes />;
      case "calendario":
        return <CalendarioMentoria />;
      case "solicitudes":
        return <SolicitudesRetiro />;
      case "reportes":
        return <ReportesMentor />;
      case "comunicacion":
        return <ComunicacionMentor />;
      default:
        return <ResumenEstudiantes />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <MentorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-4">
              <SidebarTrigger className="mr-4" />
              <div className="flex items-center space-x-4">
                <GraduationCap className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-xl font-semibold">Portal de Mentoría - Programa Beca Impacto</h1>
                  <p className="text-sm text-muted-foreground">Dr. María González</p>
                </div>
              </div>
              <div className="ml-auto flex items-center space-x-4">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                  8 Estudiantes Asignados
                </Badge>
                <Badge variant="destructive" className="animate-pulse">
                  2 Alertas Urgentes
                </Badge>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MentorDashboard;