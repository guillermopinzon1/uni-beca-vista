import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Award, FileText, LogIn, UserPlus, BookOpen, BrainCircuit, UserCircle, BellRing, BarChart3, ChevronRight, PlayCircle, Search, Sparkles, Settings, Download, Clock } from "lucide-react";
import universityCampus from "/lovable-uploads/94d62958-982a-4046-b0e0-6c3e9c128eb6.png";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const profileBg = "https://www.unimet.edu.ve/wp-content/uploads/2021/03/MODULO-DE-AULAS-ahora-1030x687.jpg";

const VocationalProfile = () => {
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

      <div className="min-h-screen bg-slate-50">
        {/* Header Profile Section */}
        <div className="relative h-64 bg-slate-900 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-40 mix-blend-overlay"
            style={{ backgroundImage: `url(${profileBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Profile Sidebar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full md:w-1/3 space-y-6"
            >
              <Card className="rounded-[2rem] overflow-hidden shadow-xl border-slate-200">
                <CardContent className="pt-8 flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg mb-4 overflow-hidden bg-slate-200">
                    <Avatar className="w-full h-full">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Carlos Rodríguez</h2>
                  <p className="text-slate-500 mb-4">Estudiante - 5to Trimestre</p>
                  <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-200 mb-6">Perfil Completado 85%</Badge>
                  
                  <div className="w-full grid grid-cols-2 gap-4 py-6 border-t border-slate-100">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">3</div>
                      <div className="text-xs text-slate-500 uppercase">Tests Realizados</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">12</div>
                      <div className="text-xs text-slate-500 uppercase">Carreras Guardadas</div>
                    </div>
                  </div>

                  <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-full">
                    <Settings className="w-4 h-4 mr-2" /> Editar Perfil
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] shadow-lg border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">Resumen de Intereses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["Tecnología", "Diseño", "Innovación", "Psicología", "Arte Digital"].map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-slate-100 text-slate-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full md:w-2/3"
            >
              <div className="bg-white rounded-[2rem] shadow-xl border border-slate-200 min-h-[500px] p-6 md:p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Mi Trayectoria</h1>
                        <p className="text-slate-500">Historial académico y resultados vocacionales</p>
                    </div>
                    <Button variant="outline" className="rounded-full hidden md:flex">
                        <Download className="w-4 h-4 mr-2" /> Exportar Informe
                    </Button>
                </div>

                <Tabs defaultValue="tests" className="w-full">
                  <TabsList className="w-full justify-start bg-slate-100 p-1 rounded-full mb-8">
                    <TabsTrigger value="tests" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Tests Vocacionales</TabsTrigger>
                    <TabsTrigger value="history" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Historial Académico</TabsTrigger>
                    <TabsTrigger value="preferences" className="rounded-full px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Preferencias</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="tests" className="space-y-4">
                    <div className="border border-slate-100 rounded-2xl p-6 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <BrainCircuit className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">Test de Aptitud Vocacional</h3>
                                    <p className="text-slate-500 text-sm">Realizado el 10 Dic 2025</p>
                                </div>
                            </div>
                            <Badge className="bg-green-100 text-green-700">Completado</Badge>
                        </div>
                        <div className="mt-4 pl-16">
                            <p className="text-sm text-slate-600 mb-2 font-medium">Resultado Principal: <span className="text-purple-600">Perfil Creativo-Tecnológico</span></p>
                            <p className="text-sm text-slate-500">Se recomienda explorar carreras relacionadas con Diseño Gráfico, Ingeniería de Sistemas y Arquitectura.</p>
                        </div>
                    </div>

                    <div className="border border-slate-100 rounded-2xl p-6 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">Evaluación de Intereses (Holland)</h3>
                                    <p className="text-slate-500 text-sm">Realizado el 15 Nov 2025</p>
                                </div>
                            </div>
                            <Badge className="bg-green-100 text-green-700">Completado</Badge>
                        </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="history">
                    <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                        <Clock className="w-16 h-16 mb-4 opacity-20" />
                        <h3 className="text-lg font-medium text-slate-900">Sincronizando Historial</h3>
                        <p className="max-w-xs mx-auto">Estamos conectando con el sistema de control de estudios para traer tus notas.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
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

export default VocationalProfile;
