import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Award, FileText, LogIn, UserPlus, BookOpen, Compass, ChevronRight, ArrowRight, Calendar, MapPin, ExternalLink, TrendingUp, Shield } from "lucide-react";
import universityCampus from "/lovable-uploads/94d62958-982a-4046-b0e0-6c3e9c128eb6.png";
import { useEffect, useRef, useState } from "react";
import {motion} from "framer-motion";
import { Link } from "wouter";
import Index from "./Index";

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
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative pt-40 pb-24 px-4 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img  
            src="https://www.unimet.edu.ve/wp-content/uploads/2023/12/FOTOS-CAMPUS-2023-24-1-1024x683.jpg"
            alt="Campus Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/75" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Universidad Metropolitana
              </h1>
              <div className="flex justify-center">
                <div className="w-40 h-1.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent rounded-full" />
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl text-slate-200 font-light uppercase tracking-wide">
                Sistema Integral de Servicios Estudiantiles
              </h2>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
                Accede a todas las herramientas y servicios estudiantiles en un solo lugar. 
                Gestiona tus becas, descubre tu vocación y aprovecha todas las oportunidades que tenemos para ti.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                onClick={() => navigate("/register")}
                className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-6 text-lg font-semibold rounded-lg transition-colors"
              >
                Registrarse
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => navigate("/index")}
                className="bg-orange-500 text-white hover:bg-orange-600 px-8 py-6 text-lg font-semibold rounded-lg transition-colors"
              >
                Gestión de Becas
                <GraduationCap className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => navigate("/vocational")}
                className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-6 text-lg font-semibold rounded-lg transition-colors"
              >
                Orientación Vocacional
                <Compass className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "Becas Activas", icon: GraduationCap },
              { number: "1,200+", label: "Estudiantes Beneficiados", icon: Users },
              { number: "95%", label: "Tasa de Éxito", icon: TrendingUp },
              { number: "24/7", label: "Soporte Disponible", icon: Shield }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/90 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Tres pasos simples para acceder a todos nuestros servicios estudiantiles
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Crea tu cuenta",
                description: "Regístrate en minutos con tu información básica y verifica tu identidad como estudiante.",
                color: "orange"
              },
              {
                step: "02",
                title: "Explora los servicios",
                description: "Accede a becas disponibles, realiza pruebas vocacionales y descubre oportunidades.",
                color: "blue"
              },
              {
                step: "03",
                title: "Gestiona todo desde aquí",
                description: "Solicita, monitorea y renueva tus becas. Revisa tu perfil vocacional y más.",
                color: "orange"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 h-full border border-slate-200 hover:shadow-xl transition-all">
                  <div className={`text-6xl font-bold mb-4 ${
                    item.color === "orange" ? "text-orange-500" : "text-blue-600"
                  } opacity-20`}>
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Nuestros Servicios Principales
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Accede a las herramientas más importantes para tu desarrollo académico y profesional
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Scholarships Module */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="group cursor-pointer"
              onClick={() => navigate("/index")}
            >
              <div className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-xl transition-all h-full flex flex-col">
                <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Gestión de Becas</h3>
                <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                  Portal administrativo para la solicitud, seguimiento y renovación de ayudas financieras.
                </p>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/index");
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-6 w-full sm:w-auto"
                >
                  Ingresar
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            {/* Vocational Module */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group cursor-pointer"
              onClick={() => navigate("/vocational")}
            >
              <div className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-xl transition-all h-full flex flex-col">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Compass className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Orientación Vocacional</h3>
                <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                  Herramientas interactivas para descubrir tu perfil profesional y académico.
                </p>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/vocational");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 w-full sm:w-auto"
                >
                  Explorar
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 text-white"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10 text-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                ¿Listo para comenzar?
              </h3>
              <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                Únete a nuestra comunidad de estudiantes y accede a todas las oportunidades que tenemos para ti
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  onClick={() => navigate("/register")}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg font-semibold rounded-lg transition-colors"
                >
                  Crear Cuenta Gratis
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-6 text-lg font-semibold rounded-lg transition-colors"
                >
                  Ya tengo cuenta
                  <LogIn className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="h-6 w-6 text-orange-500" />
            <span className="text-xl font-semibold text-slate-900">Universidad Metropolitana</span>
          </div>
          <p className="text-sm text-slate-600">
            © 2025 Universidad Metropolitana. Sistema Multiplataforma.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
