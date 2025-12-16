import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { GraduationCap, Users, Award, FileText, LogIn, UserPlus, BookOpen, BrainCircuit, UserCircle, BellRing, BarChart3, ChevronRight, PlayCircle, Search, Sparkles, Filter, Clock, MapPin, Building2, FlaskConical, Palette } from "lucide-react";
import universityCampus from "/lovable-uploads/94d62958-982a-4046-b0e0-6c3e9c128eb6.png";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const vocationalBg = "https://www.unimet.edu.ve/wp-content/uploads/2021/03/MODULO-DE-AULAS-ahora-1030x687.jpg";

const careers = [
    {
      id: 1,
      title: "Ingeniería de Sistemas",
      category: "Ingeniería",
      duration: "4 años",
      modality: "Presencial",
      description: "Diseña, desarrolla y gestiona sistemas de software complejos. Fórmate en inteligencia artificial, ciberseguridad y desarrollo web.",
      icon: <BrainCircuitIcon className="w-6 h-6" />,
      color: "bg-blue-500"
    },
    {
      id: 2,
      title: "Psicología",
      category: "Humanidades",
      duration: "4 años",
      modality: "Híbrido",
      description: "Comprende el comportamiento humano y promueve la salud mental. Enfoque clínico, organizacional y social.",
      icon: <UsersIcon className="w-6 h-6" />,
      color: "bg-purple-500"
    },
    {
      id: 3,
      title: "Ingeniería Civil",
      category: "Ingeniería",
      duration: "4 años",
      modality: "Presencial",
      description: "Planifica y construye la infraestructura del futuro. Especialízate en estructuras, vías o gerencia de proyectos.",
      icon: <Building2 className="w-6 h-6" />,
      color: "bg-orange-500"
    },
    {
      id: 4,
      title: "Ciencias Administrativas",
      category: "Ciencias Sociales",
      duration: "4 años",
      modality: "Virtual",
      description: "Lidera organizaciones con visión estratégica. Finanzas, marketing, recursos humanos y emprendimiento.",
      icon: <BriefcaseIcon className="w-6 h-6" />,
      color: "bg-green-500"
    },
    {
      id: 5,
      title: "Ingeniería Química",
      category: "Ingeniería",
      duration: "4 años",
      modality: "Presencial",
      description: "Transforma materias primas en productos de valor. Procesos industriales, biotecnología y sustentabilidad.",
      icon: <FlaskConical className="w-6 h-6" />,
      color: "bg-teal-500"
    },
    {
      id: 6,
      title: "Diseño Gráfico",
      category: "Humanidades",
      duration: "4 años",
      modality: "Presencial",
      description: "Comunica ideas visualmente. Branding, diseño editorial, UX/UI y animación digital.",
      icon: <Palette className="w-6 h-6" />,
      color: "bg-pink-500"
    },
  ];
  
  const categories = ["Todas", "Ingeniería", "Humanidades", "Ciencias Sociales"];
  
  // Helper Icons
  function BrainCircuitIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.97-3.465"/><path d="M19.97 14.535A4 4 0 0 1 18 18"/></svg>}
  function UsersIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
  function BriefcaseIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>}

const VocationalExplorer = () => {

  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCareers = careers.filter(career => {
  const matchesCategory = selectedCategory === "Todas" || career.category === selectedCategory;
  const matchesSearch = career.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          career.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
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
    
      {/* Hero Header */}
      <div className="relative bg-slate-900 py-20 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-40 mix-blend-overlay"
          style={{ backgroundImage: `url(${vocationalBg })`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="text-blue-300 border-blue-500/30 mb-4 px-4 py-1">Catálogo Académico 2025</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Explora tu Futuro</h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">
              Descubre nuestra oferta académica diseñada para formar a los líderes del mañana.
              Filtra por área de interés y encuentra la carrera perfecta para ti.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Buscar carrera (ej. Ingeniería, Psicología...)" 
                className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-full focus:bg-white/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-slate-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          
          {/* Categories Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-6 ${selectedCategory === cat ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'}`}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Careers Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {filteredCareers.length > 0 ? (
                filteredCareers.map((career, index) => (
                  <motion.div
                    key={career.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-xl transition-all duration-300 group border-slate-200 overflow-hidden flex flex-col">
                      <div className={`h-2 w-full ${career.color}`} />
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal">
                            {career.category}
                          </Badge>
                          <div className={`p-2 rounded-lg ${career.color} bg-opacity-10 text-opacity-100`}>
                             <div className={`text-${career.color.replace('bg-', '')}-600`}>
                               {career.icon}
                             </div>
                          </div>
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {career.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                          {career.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                            <Clock className="w-3.5 h-3.5" /> {career.duration}
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                            <MapPin className="w-3.5 h-3.5" /> {career.modality}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-4 border-t border-slate-100 bg-slate-50/50">
                        <Button variant="ghost" className="w-full justify-between text-blue-600 hover:text-blue-700 hover:bg-blue-50 group-hover:pr-2 transition-all">
                          Ver Pensum
                          <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
             ) : (
                <div className="col-span-full text-center py-20">
                   <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Search className="w-8 h-8 text-slate-400" />
                   </div>
                   <h3 className="text-lg font-medium text-slate-900">No se encontraron carreras</h3>
                   <p className="text-slate-500">Intenta ajustar tu búsqueda o filtros.</p>
                   <Button 
                     variant="link" 
                     className="mt-2 text-blue-600"
                     onClick={() => {setSelectedCategory("Todas"); setSearchQuery("");}}
                   >
                     Limpiar filtros
                   </Button>
                </div>
             )}
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

export default VocationalExplorer;
