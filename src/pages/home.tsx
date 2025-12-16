import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Award, FileText, LogIn, UserPlus, BookOpen, Compass, ChevronRight, ArrowRight } from "lucide-react";
import universityCampus from "/lovable-uploads/94d62958-982a-4046-b0e0-6c3e9c128eb6.png";
import { useEffect, useRef, useState } from "react";
import {motion} from "framer-motion";
import { Link } from "wouter";

const Home = () => {
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

      <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-4 overflow-hidden">
        
        {/* Full Screen Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <img  
            src="https://www.unimet.edu.ve/wp-content/uploads/2023/12/FOTOS-CAMPUS-2023-24-1-1024x683.jpg"
            alt="Campus Background" 
            className="w-full h-full object-cover scale-105"
          />
          {/* Gradients overlays for depth and readability */}
          <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-6xl w-full py-12">
          
          {/* Header Section */}
          <div className="text-center mb-16 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-lg">
                Universidad Metropolitana
              </h1>
              <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full my-6" />
              <h2 className="text-xl md:text-2xl text-slate-200 font-light tracking-wide uppercase">
                Sistema Integral de Servicios Estudiantiles
              </h2>
            </motion.div>
          </div>

          {/* Modules Selection */}
          <div className="grid md:grid-cols-2 gap-8 px-4">
            
            {/* Scholarships Module */}
            <Link href="/scholarships">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
              >
                <div className="h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/15 hover:border-orange-500/50 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden">
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-900/20 group-hover:scale-110 transition-transform duration-300 z-10">
                    <GraduationCap className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-3 z-10">Gestión de Becas</h3>
                  <p className="text-slate-300 text-lg mb-8 leading-relaxed z-10">
                    Portal administrativo para la solicitud, seguimiento y renovación de ayudas financieras.
                  </p>
                  
                  <div className="mt-auto z-10">
                    <Button onClick={() => navigate("/")} className="border-white/30 text-white hover:bg-white hover:text-orange-900 rounded-full px-8 h-12 text-lg font-medium transition-all group-hover:px-10">
                      Ingresar
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Vocational Module */}
            <Link href="/vocational">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
              >
                <div className="h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/15 hover:border-blue-500/50 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden">
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform duration-300 z-10">
                    <Compass className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-3 z-10">Orientación Vocacional</h3>
                  <p className="text-slate-300 text-lg mb-8 leading-relaxed z-10">
                    Herramientas interactivas para descubrir tu perfil profesional y académico.
                  </p>
                  
                  <div className="mt-auto z-10">
                    <Button className="bg-blue-600 text-white rounded-full px-8 h-12 text-lg font-medium transition-all group-hover:bg-blue-700 group-hover:px-10">
                      Explorar
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </Link>

          </div>
        </div>
      </div>

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

export default Home;
