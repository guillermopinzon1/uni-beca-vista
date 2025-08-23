import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Award, FileText } from "lucide-react";
import universityCampus from "/lovable-uploads/94d62958-982a-4046-b0e0-6c3e9c128eb6.png";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: GraduationCap,
      title: "Gestión de Becas",
      description: "Administra y monitorea todas las becas disponibles para estudiantes"
    },
    {
      icon: Users,
      title: "Estudiantes",
      description: "Gestiona perfiles de estudiantes y sus solicitudes de becas"
    },
    {
      icon: Award,
      title: "Seguimiento",
      description: "Realiza seguimiento del progreso y estado de las becas otorgadas"
    },
    {
      icon: FileText,
      title: "Reportes",
      description: "Genera reportes detallados sobre el programa de becas"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src={universityCampus}
            alt="Universidad Metropolitana"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Universidad Metropolitana
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-slide-up">
            Sistema multiplataforma de la UNIMET
          </p>
          
          <div className="flex justify-center animate-slide-up">
            <Button
              size="lg"
              onClick={() => navigate("/modules")}
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3"
            >
              Acceder al Sistema
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">
              Funcionalidades del Sistema
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Herramientas completas para la gestión eficiente de becas estudiantiles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-orange/20 bg-gradient-card hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-primary">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-primary py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Accede a nuestro sistema multiplataforma para gestionar becas y ayudantías
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/modules")}
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3"
          >
            Acceder al Sistema
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-orange/20 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-bold text-primary">Universidad Metropolitana</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 Universidad Metropolitana. Sistema de Gestión de Becas.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
