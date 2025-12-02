import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Award, FileText, LogIn, UserPlus, BookOpen } from "lucide-react";
import universityCampus from "/lovable-uploads/94d62958-982a-4046-b0e0-6c3e9c128eb6.png";
import { useEffect, useRef, useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [isCtaVisible, setIsCtaVisible] = useState(false);
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
  const ctaRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px"
    };

    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsCtaVisible(true);
        }
      });
    }, observerOptions);

    const featuresObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsFeaturesVisible(true);
        }
      });
    }, observerOptions);

    if (ctaRef.current) {
      ctaObserver.observe(ctaRef.current);
    }

    if (featuresRef.current) {
      featuresObserver.observe(featuresRef.current);
    }

    return () => {
      ctaObserver.disconnect();
      featuresObserver.disconnect();
    };
  }, []);

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
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-orange/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/8f3cd009-b095-4b62-9526-09516381421e.png" 
                alt="Universidad Metropolitana" 
                className="h-12"
              />
            </div>
            <nav className="flex items-center space-x-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-primary hover:text-primary-foreground hover:bg-primary"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/register")}
                className="bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Registrarse
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/postulaciones-becas")}
                className="bg-white text-primary hover:bg-white/90"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Postularme a Beca
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center pt-16">
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
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button
              size="lg"
              onClick={() => navigate("/postulaciones-becas")}
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Postularme a Beca
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 ${isFeaturesVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold text-primary mb-4">
              Funcionalidades del Sistema
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Herramientas completas para la gestión eficiente de becas estudiantiles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`border-orange/20 bg-gradient-card hover:shadow-lg hover:scale-105 ${
                  isFeaturesVisible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{
                  animationDelay: isFeaturesVisible ? `${index * 0.1}s` : '0s',
                  animationFillMode: 'both',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
              >
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
      <section ref={ctaRef} className="relative bg-gradient-primary py-20 px-4 overflow-hidden">
        {/* Diseño de fondo decorativo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="ctaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
                <stop offset="50%" style={{ stopColor: '#ffffff', stopOpacity: 0.1 }} />
                <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            {/* Círculos decorativos */}
            <circle cx="10%" cy="20%" r="120" fill="rgba(255, 255, 255, 0.05)" />
            <circle cx="90%" cy="80%" r="150" fill="rgba(255, 255, 255, 0.05)" />
            <circle cx="85%" cy="15%" r="80" fill="rgba(255, 255, 255, 0.07)" />
            <circle cx="15%" cy="85%" r="100" fill="rgba(255, 255, 255, 0.06)" />

            {/* Líneas diagonales sutiles */}
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="url(#ctaGradient)" strokeWidth="2" opacity="0.3"/>
            <line x1="0" y1="30%" x2="100%" y2="70%" stroke="url(#ctaGradient)" strokeWidth="1.5" opacity="0.25"/>
            <line x1="0" y1="70%" x2="100%" y2="30%" stroke="url(#ctaGradient)" strokeWidth="1.5" opacity="0.2"/>

            {/* Puntos decorativos */}
            <circle cx="25%" cy="35%" r="3" fill="rgba(255, 255, 255, 0.3)" />
            <circle cx="75%" cy="45%" r="4" fill="rgba(255, 255, 255, 0.25)" />
            <circle cx="40%" cy="65%" r="2.5" fill="rgba(255, 255, 255, 0.35)" />
            <circle cx="60%" cy="25%" r="3.5" fill="rgba(255, 255, 255, 0.3)" />
          </svg>
        </div>

        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <h2 className={`text-4xl font-bold mb-6 ${isCtaVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationFillMode: 'both' }}>
            ¿Listo para comenzar?
          </h2>
          <p className={`text-xl mb-8 opacity-90 ${isCtaVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: isCtaVisible ? '0.2s' : '0s', animationFillMode: 'both' }}>
            Accede a nuestro sistema multiplataforma para gestionar becas y ayudantías
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isCtaVisible ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: isCtaVisible ? '0.4s' : '0s', animationFillMode: 'both' }}>
            <Button
              size="lg"
              onClick={() => navigate("/postulaciones-becas")}
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3 transition-transform hover:scale-105 shadow-xl"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Postularme a Beca
            </Button>
          </div>
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
            © 2025 Universidad Metropolitana. Sistema Multiplataforma.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
