
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, FileText } from "lucide-react";
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
import { toast } from "sonner";

const AyudantiasSidebar = () => {
  const sidebarItems = [
    {
      title: "Postulaciones",
      icon: Users,
      onClick: () => toast.info("En construcción")
    },
    {
      title: "Reportes", 
      icon: FileText,
      onClick: () => toast.info("En construcción")
    }
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Ayudantías</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton onClick={item.onClick}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

const AyudantiasDashboard = () => {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AyudantiasSidebar />
        
        <div className="flex-1">
          {/* Header */}
          <header className="bg-card border-b border-orange/20 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/scholarship-programs")}
                  className="text-primary hover:text-primary/90"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-primary">Ayudantías</h1>
                  <p className="text-sm text-muted-foreground">
                    Inicio &gt; Gestión de Becas &gt; Ayudantías
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-primary">Juan Carlos Pérez</p>
                  <p className="text-xs text-muted-foreground">Administrador</p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="px-6 py-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold text-primary mb-4">
                  Bienvenido al Sistema de Ayudantías
                </h2>
                <p className="text-muted-foreground">
                  Utiliza el menú lateral para navegar entre los diferentes módulos
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AyudantiasDashboard;
