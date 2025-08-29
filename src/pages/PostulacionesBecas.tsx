import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Trophy, 
  Users, 
  BookOpen, 
  ChevronRight,
  Home,
  LogOut,
  Construction
} from "lucide-react";

const PostulacionesBecas = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const programs = [
    {
      id: "excelencia",
      title: "Beca de Excelencia Académica",
      description: "Para estudiantes con alto rendimiento académico que demuestren excelencia en sus estudios.",
      icon: Trophy,
      route: null,
      available: false
    },
    {
      id: "impacto",
      title: "Beca de Impacto Social",
      description: "Dirigida a estudiantes comprometidos con proyectos de impacto social y comunitario.",
      icon: Users,
      route: null,
      available: false
    },
    {
      id: "formacion",
      title: "Beca de Formación Docente",
      description: "Para estudiantes interesados en la carrera docente y formación pedagógica.",
      icon: BookOpen,
      route: null,
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-orange/20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/8f3cd009-b095-4b62-9526-09516381421e.png" 
                alt="Universidad Metropolitana" 
                className="h-10"
              />
              <div>
                <h1 className="font-semibold text-primary">Universidad Metropolitana</h1>
                <p className="text-sm text-muted-foreground">Sistema de Postulaciones a Becas</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Volver al Inicio
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate("/")} className="cursor-pointer">
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Postulaciones a Becas</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Postulaciones a Becas
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explora y postúlate a los diferentes programas de becas disponibles en la Universidad Metropolitana
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {programs.map((program) => (
            <Card 
              key={program.id}
              className="border-orange/20 bg-gradient-card hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <CardHeader className="text-center">
                <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <program.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-primary">{program.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="mb-6 min-h-[3rem] flex items-center justify-center">
                  {program.description}
                </CardDescription>
                
                <div className="space-y-4">
                  <Badge 
                    variant="secondary"
                    className="bg-orange/10 text-orange border-orange/20"
                  >
                    <Construction className="h-3 w-3 mr-1" />
                    En Construcción
                  </Badge>
                  
                  <Button 
                    disabled
                    className="w-full opacity-50 cursor-not-allowed"
                  >
                    Próximamente
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Announcement Card */}
        <Card className="border-primary/20 bg-gradient-card max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-primary text-2xl">¡Próximas Convocatorias!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <CardDescription className="text-lg mb-6">
              Estamos trabajando en habilitar el sistema de postulaciones para todos nuestros programas de becas.
              Mantente atento a los anuncios oficiales para conocer las fechas de apertura.
            </CardDescription>
            <div className="flex justify-center">
              <Badge 
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20 text-base px-4 py-2"
              >
                <Construction className="h-4 w-4 mr-2" />
                Sistema en Desarrollo
              </Badge>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PostulacionesBecas;