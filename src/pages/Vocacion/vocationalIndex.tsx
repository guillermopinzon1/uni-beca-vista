import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Award, FileText, LogIn, UserPlus, BookOpen, BrainCircuit, UserCircle, BellRing, BarChart3, ChevronRight, PlayCircle, Search, Sparkles  } from "lucide-react";
import universityCampus from "/lovable-uploads/94d62958-982a-4046-b0e0-6c3e9c128eb6.png";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const vocationalBg = "https://www.unimet.edu.ve/wp-content/uploads/2021/03/MODULO-DE-AULAS-ahora-1030x687.jpg";

const VocationalIndex = () => {
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
                onClick={() => navigate("/")}
                className="bg-white text-primary hover:bg-white/90"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Volver al Portal
              </Button>
            </nav>
          </div>
        </div>
      </header>
    {/* Hero Section */}
    <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-slate-900">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src={vocationalBg}
            alt="Campus Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white space-y-8"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">Potenciado por IA</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Sistema de <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Orientación Inteligente
                  </span>
                </h1>
                
                <div className="w-32 h-1.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full" />
                
                <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-xl">
                  Una plataforma integral que conecta tus intereses con oportunidades académicas reales utilizando inteligencia artificial avanzada.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate("/vocational-test")}
                  className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-6 text-lg font-semibold rounded-lg transition-colors"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Iniciar Diagnóstico
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-3xl blur-3xl" />
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-6 w-full">
                    <div className="bg-blue-600/20 rounded-xl p-8 flex flex-col items-center justify-center border border-blue-500/30">
                      <BrainCircuit className="w-16 h-16 text-blue-400 mb-4" />
                      <span className="text-white font-semibold">IA Avanzada</span>
                    </div>
                    <div className="bg-purple-600/20 rounded-xl p-8 flex flex-col items-center justify-center border border-purple-500/30">
                      <UserCircle className="w-16 h-16 text-purple-400 mb-4" />
                      <span className="text-white font-semibold">Personalizado</span>
                    </div>
                    <div className="bg-blue-600/20 rounded-xl p-8 flex flex-col items-center justify-center border border-blue-500/30">
                      <BookOpen className="w-16 h-16 text-blue-400 mb-4" />
                      <span className="text-white font-semibold">Contenido</span>
                    </div>
                    <div className="bg-green-600/20 rounded-xl p-8 flex flex-col items-center justify-center border border-green-500/30">
                      <BarChart3 className="w-16 h-16 text-green-400 mb-4" />
                      <span className="text-white font-semibold">Analytics</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
             <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Módulos del Sistema</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                    Arquitectura modular diseñada para acompañar al estudiante en cada etapa de su decisión profesional.
                </p>
             </div>

             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               
               {/* Módulo 1: Asesoría Vocacional */}
               <Link href="/vocational-test">
               <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                 <div className="h-full bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow border border-slate-200 group cursor-pointer relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
                   
                   <div className="relative z-10">
                     <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                       <BrainCircuit className="w-7 h-7" />
                     </div>
                     <div className="text-xs font-bold text-purple-500 mb-2 uppercase tracking-wider">Módulo 1 & 5</div>
                     <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-purple-700 transition-colors">
                       Asesoría Vocacional IA
                     </h3>
                     <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                       Aplicación de tests estandarizados interpretados por nuestro Motor LLM para generar recomendaciones personalizadas.
                     </p>
                     <div onClick={() => navigate("/vocational-test")} className="flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform">
                       Iniciar diagnóstico <ChevronRight className="ml-1 w-4 h-4" />
                     </div>
                   </div>
                 </div>
               </motion.div>
               </Link>

               {/* Módulo 2: Gestión de Perfiles */}
               <Link href="/vocational-profile">
               <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                 <div className="h-full bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow border border-slate-200 group cursor-pointer relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
                   
                   <div className="relative z-10">
                     <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-6 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                       <UserCircle className="w-7 h-7" />
                     </div>
                     <div className="text-xs font-bold text-teal-500 mb-2 uppercase tracking-wider">Módulo 2</div>
                     <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-teal-700 transition-colors">
                       Mi Perfil y Trayectoria
                     </h3>
                     <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                       Gestión centralizada de tus datos, historial de tests y preferencias para alimentar al modelo de IA.
                     </p>
                     <div onClick={() => navigate("/vocational-profile")} className="flex items-center text-teal-600 font-semibold group-hover:translate-x-2 transition-transform">
                       Ver mi perfil <ChevronRight className="ml-1 w-4 h-4" />
                     </div>
                   </div>
                 </div>
               </motion.div>
               </Link>

               {/* Módulo 3: Contenido Académico */}
               <Link href="/vocational-explorer">
               <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                 <div className="h-full bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow border border-slate-200 group cursor-pointer relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
                   
                   <div className="relative z-10">
                     <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                       <BookOpen className="w-7 h-7" />
                     </div>
                     <div className="text-xs font-bold text-blue-500 mb-2 uppercase tracking-wider">Módulo 3</div>
                     <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">
                       Contenido Académico
                     </h3>
                     <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                       Base de conocimiento institucional: mallas curriculares, requisitos y perfiles de egreso de la UNIMET.
                     </p>
                     <div onClick={() => navigate("/vocational-explorer")}className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                       Ver catálogo <ChevronRight className="ml-1 w-4 h-4" />
                     </div>
                   </div>
                 </div>
               </motion.div>
               </Link>

               {/* Módulo 4: Comunicación CRM */}
               <Link href="/vocational-crm">
               <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                 <div className="h-full bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow border border-slate-200 group cursor-pointer relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500" />
                   
                   <div className="relative z-10">
                     <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-6 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors duration-300">
                       <BellRing className="w-7 h-7" />
                     </div>
                     <div className="text-xs font-bold text-pink-500 mb-2 uppercase tracking-wider">Módulo 4</div>
                     <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-pink-700 transition-colors">
                       Novedades y CRM
                     </h3>
                     <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                       Sistema de notificaciones inteligentes y seguimiento personalizado basado en tus intereses.
                     </p>
                     <div onClick={() => navigate("/vocational-crm")} className="flex items-center text-pink-600 font-semibold group-hover:translate-x-2 transition-transform">
                       Ver notificaciones <ChevronRight className="ml-1 w-4 h-4" />
                     </div>
                   </div>
                 </div>
               </motion.div>
               </Link>

               {/* Módulo 6: Analytics */}
               <Link href="/vocational-analytics">
               <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                 <div className="h-full bg-slate-900 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow border border-slate-800 group cursor-pointer relative overflow-hidden">
                   
                   <div className="relative z-10">
                     <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 text-slate-300 group-hover:bg-white group-hover:text-slate-900 transition-colors duration-300">
                       <BarChart3 className="w-7 h-7" />
                     </div>
                     <div className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Módulo 6</div>
                     <h3 className="text-2xl font-bold text-white mb-3">
                       Monitoreo y Analytics
                     </h3>
                     <p className="text-slate-400 mb-8 leading-relaxed text-sm">
                       Vista administrativa para medir impacto ODS 4, métricas de uso y tendencias vocacionales.
                     </p>
                     <div onClick={() => navigate("/vocational-analytics")}  className="flex items-center text-white font-semibold group-hover:translate-x-2 transition-transform">
                       Acceso Administrativo <ChevronRight className="ml-1 w-4 h-4" />
                     </div>
                   </div>
                 </div>
               </motion.div>
               </Link>

               {/* Acceso Orientadores (Nuevo Módulo) */}
               <Link href="/vocational-counselor">
               <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }} className="md:col-span-2 lg:col-span-1">
                 <div className="h-full bg-teal-900 rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow border border-teal-800 group cursor-pointer relative overflow-hidden">
                   
                   <div className="relative z-10">
                     <div className="w-14 h-14 bg-teal-800 rounded-2xl flex items-center justify-center mb-6 text-teal-300 group-hover:bg-white group-hover:text-teal-900 transition-colors duration-300">
                       <Users className="w-7 h-7" />
                     </div>
                     <div className="text-xs font-bold text-teal-400 mb-2 uppercase tracking-wider">Dirección de Bienestar</div>
                     <h3 className="text-2xl font-bold text-white mb-3">
                       Panel del Orientador
                     </h3>
                     <p className="text-teal-400 mb-8 leading-relaxed text-sm">
                       Gestión de casos, visualización de resultados de tests y seguimiento individualizado de estudiantes.
                     </p>
                     <div onClick={() => navigate("/vocational-counselor")} className="flex items-center text-white font-semibold group-hover:translate-x-2 transition-transform">
                       Ingresar al Panel <ChevronRight className="ml-1 w-4 h-4" />
                     </div>
                   </div>
                 </div>
               </motion.div>
               </Link>

             </div>
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

export default VocationalIndex;
