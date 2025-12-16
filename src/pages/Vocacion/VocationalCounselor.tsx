import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Award, FileText, LogIn, UserPlus, BookOpen, BrainCircuit, UserCircle, BellRing, BarChart3, PlayCircle,  Sparkles, Search, Filter, Calendar, User, MessageSquare, CheckCircle, Clock, ChevronRight, BarChart, Download, Mail, Send,Megaphone, TrendingUp, ArrowUpRight } from "lucide-react";
import universityCampus from "/lovable-uploads/94d62958-982a-4046-b0e0-6c3e9c128eb6.png";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const vocationalBg = "https://www.unimet.edu.ve/wp-content/uploads/2021/03/MODULO-DE-AULAS-ahora-1030x687.jpg";

// Mock Data for Students
const students = [
    {
      id: 1,
      name: "Ana García",
      career_interest: "Ingeniería",
      status: "Requiere Asesoría",
      last_test: "10 Dic 2025",
      result: "Perfil Lógico-Matemático",
      risk_level: "Bajo",
      avatar: "AG"
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      career_interest: "Artes",
      status: "En Seguimiento",
      last_test: "09 Dic 2025",
      result: "Perfil Creativo",
      risk_level: "Medio",
      avatar: "CR"
    },
    {
      id: 3,
      name: "María Pérez",
      career_interest: "Ciencias Sociales",
      status: "Orientación Completada",
      last_test: "05 Dic 2025",
      result: "Perfil Social-Humanista",
      risk_level: "Bajo",
      avatar: "MP"
    },
    {
      id: 4,
      name: "Luis Hernández",
      career_interest: "Indeciso",
      status: "Urgente",
      last_test: "11 Dic 2025",
      result: "Perfil Disperso",
      risk_level: "Alto",
      avatar: "LH"
    },
    {
      id: 5,
      name: "Sofia Martínez",
      career_interest: "Salud",
      status: "En Seguimiento",
      last_test: "08 Dic 2025",
      result: "Perfil Científico",
      risk_level: "Bajo",
      avatar: "SM"
    }
  ];

const VocationalCounselor = () => {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
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
        
        {/* Header */}
        <div className="relative bg-teal-900 py-10 overflow-hidden">
           <div 
             className="absolute inset-0 opacity-20 mix-blend-overlay"
             style={{ backgroundImage: `url(${vocationalBg})`, backgroundSize: 'cover' }}
           />
           <div className="container mx-auto px-4 relative z-10 text-white">
             <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <Badge className="bg-teal-500/20 text-teal-200 border-teal-500/30 mb-2">Dirección de Bienestar Estudiantil</Badge>
                    <h1 className="text-3xl font-bold mb-2">Panel del Orientador</h1>
                    <p className="text-teal-100/80">Gestión de casos, seguimiento vocacional y análisis de perfiles.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="border-teal-500/30 text-teal-100 hover:bg-teal-800 hover:text-white">
                        <Calendar className="w-4 h-4 mr-2" /> Mi Agenda
                    </Button>
                    <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                        <MessageSquare className="w-4 h-4 mr-2" /> Mensajes (3)
                    </Button>
                </div>
             </div>
           </div>
        </div>

        <div className="container mx-auto px-4 py-8">
            <Tabs defaultValue="students" className="w-full">
                <TabsList className="w-full justify-start bg-white border border-slate-200 p-1 rounded-xl mb-6 max-w-3xl mx-auto lg:mx-0">
                    <TabsTrigger value="students" className="rounded-lg px-6 flex-1">Gestión de Estudiantes</TabsTrigger>
                    <TabsTrigger value="admissions" className="rounded-lg px-6 flex-1">Admisiones y Aspirantes</TabsTrigger>
                    <TabsTrigger value="bulk-campaigns" className="rounded-lg px-6 flex-1">Campañas Masivas</TabsTrigger>
                </TabsList>

                <TabsContent value="students">
                  <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Student List Sidebar */}
                    <div className="w-full lg:w-1/3 space-y-4">
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-24">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input placeholder="Buscar estudiante..." className="pl-9 bg-slate-50 border-slate-200" />
                            </div>
                            <Button variant="outline" size="icon" className="border-slate-200">
                                <Filter className="h-4 w-4 text-slate-500" />
                            </Button>
                        </div>

                        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                            {students.map(student => (
                                <div 
                                    key={student.id}
                                    onClick={() => setSelectedStudent(student)}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${selectedStudent?.id === student.id ? 'bg-teal-50 border-teal-200 shadow-sm' : 'bg-white border-slate-100 hover:border-teal-100'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 bg-slate-100 text-slate-600 border border-slate-200">
                                                <AvatarFallback>{student.avatar}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-bold text-sm text-slate-900">{student.name}</p>
                                                <p className="text-xs text-slate-500">{student.career_interest}</p>
                                            </div>
                                        </div>
                                        <Badge variant={student.risk_level === "Alto" ? "destructive" : "secondary"} className="text-[10px] px-1.5 h-5">
                                            Riesgo {student.risk_level}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-slate-400 pl-12">
                                        <span>Test: {student.last_test}</span>
                                        <ChevronRight className={`w-4 h-4 ${selectedStudent?.id === student.id ? 'text-teal-500' : 'text-slate-300'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Main Detail View */}
                    <div className="w-full lg:w-2/3">
                        {selectedStudent ? (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={selectedStudent.id}
                                className="space-y-6"
                            >
                                {/* Student Header Card */}
                                <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
                                    <div className="h-2 bg-teal-500 w-full" />
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-16 w-16 bg-slate-100 text-slate-600 border-2 border-white shadow-md">
                                                <AvatarFallback className="text-xl">{selectedStudent.avatar}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <CardTitle className="text-2xl text-slate-900">{selectedStudent.name}</CardTitle>
                                                <CardDescription>ID: 2025-{selectedStudent.id}00 | {selectedStudent.career_interest}</CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="rounded-full">
                                                <Mail className="w-4 h-4 mr-2" /> Contactar
                                            </Button>
                                            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 rounded-full">
                                                <Calendar className="w-4 h-4 mr-2" /> Agendar Cita
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-3 gap-4 mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <div className="text-center border-r border-slate-200 last:border-0">
                                                <p className="text-xs text-slate-500 uppercase font-bold">Estado</p>
                                                <p className="text-sm font-semibold text-slate-900 mt-1">{selectedStudent.status}</p>
                                            </div>
                                            <div className="text-center border-r border-slate-200 last:border-0">
                                                <p className="text-xs text-slate-500 uppercase font-bold">Perfil Detectado</p>
                                                <p className="text-sm font-semibold text-teal-600 mt-1">{selectedStudent.result}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs text-slate-500 uppercase font-bold">Última Actividad</p>
                                                <p className="text-sm font-semibold text-slate-900 mt-1">Hace 2 horas</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Analysis Tabs */}
                                <Tabs defaultValue="results" className="w-full">
                                    <TabsList className="w-full justify-start bg-white border border-slate-200 p-1 rounded-xl mb-6">
                                        <TabsTrigger value="results" className="rounded-lg px-6">Resultados del Test</TabsTrigger>
                                        <TabsTrigger value="history" className="rounded-lg px-6">Historial Académico</TabsTrigger>
                                        <TabsTrigger value="notes" className="rounded-lg px-6">Notas del Orientador</TabsTrigger>
                                        <TabsTrigger value="campaigns" className="rounded-lg px-6">Campañas de Correo</TabsTrigger>
                                    </TabsList>
                                    
                                    <TabsContent value="results">
                                        <Card className="rounded-2xl border-slate-200 shadow-sm">
                                            <CardHeader>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <BarChart className="w-5 h-5 text-teal-500" />
                                                    Análisis Psicométrico
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div>
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-sm font-medium text-slate-700">Aptitud Lógica</span>
                                                        <span className="text-sm font-bold text-slate-900">85%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-500 w-[85%]" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-sm font-medium text-slate-700">Creatividad</span>
                                                        <span className="text-sm font-bold text-slate-900">60%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-purple-500 w-[60%]" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-sm font-medium text-slate-700">Habilidades Sociales</span>
                                                        <span className="text-sm font-bold text-slate-900">45%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-green-500 w-[45%]" />
                                                    </div>
                                                </div>

                                                <div className="mt-6 p-4 bg-teal-50 border border-teal-100 rounded-xl">
                                                    <h4 className="font-bold text-teal-800 mb-2 flex items-center">
                                                        <BrainCircuit className="w-4 h-4 mr-2" />
                                                        Interpretación IA
                                                    </h4>
                                                    <p className="text-sm text-teal-700 leading-relaxed">
                                                        El estudiante muestra una fuerte inclinación hacia el pensamiento estructurado y la resolución de problemas abstractos. 
                                                        Se observa una brecha en habilidades sociales que podría beneficiarse de talleres de comunicación.
                                                        Carreras recomendadas: Ingeniería de Sistemas, Matemáticas, Física.
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="notes">
                                        <Card className="rounded-2xl border-slate-200 shadow-sm">
                                            <CardHeader>
                                                <CardTitle className="text-lg">Bitácora de Seguimiento</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                        <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                                            <User className="w-4 h-4 text-slate-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-slate-900 font-medium">Nota agregada por Dr. Mendez</p>
                                                            <p className="text-xs text-slate-400 mb-2">10 Dic 2025 - 14:30</p>
                                                            <p className="text-sm text-slate-600">Se asignó cita para revisión de opciones de beca. El estudiante muestra preocupación por los costos.</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" className="w-full border-dashed border-slate-300 text-slate-500 hover:text-teal-600 hover:border-teal-300 hover:bg-teal-50">
                                                        + Agregar Nueva Nota
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="campaigns">
                                        <Card className="rounded-2xl border-slate-200 shadow-sm">
                                            <CardHeader>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Mail className="w-5 h-5 text-teal-500" />
                                                    Campañas de Interés
                                                </CardTitle>
                                                <CardDescription>
                                                    Envía información personalizada basada en el perfil vocacional del estudiante.
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                                                <BrainCircuit className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-slate-900 text-sm">Webinar: Futuro de la IA</h4>
                                                                <p className="text-xs text-slate-500">Recomendado para perfiles Lógicos y Científicos</p>
                                                            </div>
                                                        </div>
                                                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                                                            Enviar Invitación
                                                        </Button>
                                                    </div>

                                                    <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                                                                <CheckCircle className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-slate-900 text-sm">Taller de Becas al Mérito</h4>
                                                                <p className="text-xs text-slate-500">Recomendado para estudiantes de Alto Rendimiento</p>
                                                            </div>
                                                        </div>
                                                        <Button size="sm" variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                                                            Programar Envío
                                                        </Button>
                                                    </div>

                                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                                        <h4 className="text-sm font-semibold text-slate-900 mb-3">Redactar Correo Personalizado</h4>
                                                        <div className="space-y-3">
                                                            <Input placeholder="Asunto: Oportunidad para tu carrera en Ingeniería..." className="bg-slate-50" />
                                                            <textarea 
                                                                className="w-full min-h-[100px] p-3 rounded-md border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                                                                placeholder="Escribe un mensaje personalizado para el estudiante..."
                                                            />
                                                            <div className="flex justify-end">
                                                                <Button className="bg-slate-900 text-white hover:bg-slate-800">
                                                                    <Mail className="w-4 h-4 mr-2" /> Enviar Correo
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>

                            </motion.div>
                        ) : (
                            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                <User className="w-16 h-16 mb-4 opacity-20" />
                                <h3 className="text-lg font-medium text-slate-900">Selecciona un estudiante</h3>
                                <p>Haz clic en la lista para ver los detalles del caso</p>
                            </div>
                        )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="admissions">
                  <div className="space-y-8">
                    {/* KPI Cards */}
                    <div className="grid md:grid-cols-4 gap-4">
                        <Card className="bg-white border-slate-200 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200">+12%</Badge>
                                </div>
                                <p className="text-sm text-slate-500 font-medium">Total Aspirantes</p>
                                <h3 className="text-2xl font-bold text-slate-900">2,543</h3>
                            </CardContent>
                        </Card>
                        <Card className="bg-white border-slate-200 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200">+5%</Badge>
                                </div>
                                <p className="text-sm text-slate-500 font-medium">Interés Alto</p>
                                <h3 className="text-2xl font-bold text-slate-900">856</h3>
                            </CardContent>
                        </Card>
                        <Card className="bg-white border-slate-200 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                        <Megaphone className="w-5 h-5" />
                                    </div>
                                    <Badge className="bg-slate-100 text-slate-600">--</Badge>
                                </div>
                                <p className="text-sm text-slate-500 font-medium">Invitaciones Enviadas</p>
                                <h3 className="text-2xl font-bold text-slate-900">1,204</h3>
                            </CardContent>
                        </Card>
                        <Card className="bg-teal-900 border-teal-800 shadow-sm text-white">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 bg-teal-800 rounded-lg text-teal-300">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <Badge className="bg-teal-500 text-white border-0">+8%</Badge>
                                </div>
                                <p className="text-sm text-teal-200 font-medium">Proyectado Matriculados</p>
                                <h3 className="text-2xl font-bold">450</h3>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Pipeline Visual */}
                        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg">Pipeline de Admisiones</CardTitle>
                                <CardDescription>Conversión de aspirantes desde el test vocacional hasta la matrícula.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="relative pt-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                                                <span className="font-semibold text-slate-700">Realizaron Test Vocacional</span>
                                            </div>
                                            <span className="font-bold text-slate-900">2,543</span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-slate-400 w-full rounded-full"></div>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                                <span className="font-semibold text-slate-700">Identificados como Potenciales</span>
                                            </div>
                                            <span className="font-bold text-slate-900">1,850 (72%)</span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 w-[72%] rounded-full"></div>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                                                <span className="font-semibold text-slate-700">Contactados / Invitados</span>
                                            </div>
                                            <span className="font-bold text-slate-900">1,204 (47%)</span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-500 w-[47%] rounded-full"></div>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="w-3 h-3 rounded-full bg-teal-500"></span>
                                                <span className="font-semibold text-slate-700">Inscritos / Matriculados</span>
                                            </div>
                                            <span className="font-bold text-slate-900">450 (18%)</span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-teal-500 w-[18%] rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions / Recruitment */}
                        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg text-orange-900">Captación de Talentos</CardTitle>
                                <CardDescription className="text-orange-700/80">
                                    Acciones rápidas para convertir aspirantes en estudiantes UNIMET.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-white rounded-xl border border-orange-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                            <UserPlus className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">Top Perfiles Académicos</h4>
                                            <p className="text-xs text-slate-500">50 aspirantes con puntaje alto</p>
                                        </div>
                                    </div>
                                    <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs">
                                        Invitar a Beca Excelencia
                                    </Button>
                                </div>

                                <div className="p-4 bg-white rounded-xl border border-orange-100 shadow-sm">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                            <Megaphone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">Cierre de Inscripciones</h4>
                                            <p className="text-xs text-slate-500">Recordatorio para rezagados</p>
                                        </div>
                                    </div>
                                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs">
                                        Enviar Recordatorio Urgente
                                    </Button>
                                </div>

                                <div className="mt-4 pt-4 border-t border-orange-200">
                                    <h4 className="font-bold text-orange-900 text-sm mb-2">Mensaje Directo de Admisión</h4>
                                    <p className="text-xs text-orange-800/70 mb-3">
                                        "Hola [Nombre], tu perfil vocacional encaja perfecto en UNIMET. ¡Te invitamos a inscribirte hoy!"
                                    </p>
                                    <Button variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-100">
                                        Configurar Plantilla
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Aspirants Table */}
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Aspirantes Destacados</CardTitle>
                                <CardDescription>Estudiantes potenciales identificados por el sistema de IA.</CardDescription>
                            </div>
                            <Button variant="outline" className="text-teal-600 border-teal-200 hover:bg-teal-50">
                                <Download className="w-4 h-4 mr-2" /> Exportar Reporte
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-500 font-medium">
                                        <tr>
                                            <th className="p-4 rounded-l-lg">Aspirante</th>
                                            <th className="p-4">Interés Principal</th>
                                            <th className="p-4">Probabilidad (IA)</th>
                                            <th className="p-4">Estado</th>
                                            <th className="p-4 rounded-r-lg text-right">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {[
                                            { name: "Valentina Ruiz", interest: "Psicología", prob: "Alta (92%)", status: "Contactado" },
                                            { name: "Javier Méndez", interest: "Ing. Mecánica", prob: "Media (65%)", status: "Pendiente" },
                                            { name: "Camila Torres", interest: "Derecho", prob: "Muy Alta (98%)", status: "En Proceso" },
                                            { name: "Andrés Silva", interest: "Economía", prob: "Alta (88%)", status: "Pendiente" },
                                        ].map((aspirant, i) => (
                                            <tr key={i} className="hover:bg-slate-50 group">
                                                <td className="p-4 font-medium text-slate-900">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8 bg-slate-200 text-slate-500">
                                                            <AvatarFallback>{aspirant.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        {aspirant.name}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-slate-600">{aspirant.interest}</td>
                                                <td className="p-4">
                                                    <Badge variant="outline" className={`
                                                        ${aspirant.prob.includes("Muy Alta") ? "bg-green-50 text-green-700 border-green-200" : 
                                                          aspirant.prob.includes("Alta") ? "bg-blue-50 text-blue-700 border-blue-200" : 
                                                          "bg-yellow-50 text-yellow-700 border-yellow-200"}
                                                    `}>
                                                        {aspirant.prob}
                                                    </Badge>
                                                </td>
                                                <td className="p-4 text-slate-600">{aspirant.status}</td>
                                                <td className="p-4 text-right">
                                                    <Button size="sm" className="bg-white border border-slate-200 text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all">
                                                        Invitar <ArrowUpRight className="w-3 h-3 ml-1" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="bulk-campaigns">
                  <div className="flex flex-col gap-6">
                    <Card className="rounded-2xl border-slate-200 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-2xl text-slate-900">Gestor de Campañas Masivas</CardTitle>
                        <CardDescription>Envía comunicaciones segmentadas a grupos de estudiantes basados en sus intereses vocacionales.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                           {/* Campaña Ingeniería */}
                           <Card className="border border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer">
                              <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                  <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                                    <BrainCircuit className="w-6 h-6" />
                                  </div>
                                  <Badge className="bg-blue-600">128 Estudiantes</Badge>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">Interesados en Ingeniería</h3>
                                <p className="text-sm text-slate-600 mb-4">Estudiantes con perfil Lógico-Matemático que mostraron interés en áreas técnicas.</p>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                  <Mail className="w-4 h-4 mr-2" /> Crear Campaña
                                </Button>
                              </CardContent>
                           </Card>

                           {/* Campaña Artes */}
                           <Card className="border border-purple-200 bg-purple-50/50 hover:bg-purple-50 transition-colors cursor-pointer">
                              <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                  <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
                                    <Sparkles className="w-6 h-6" />
                                  </div>
                                  <Badge className="bg-purple-600">85 Estudiantes</Badge>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">Interesados en Artes</h3>
                                <p className="text-sm text-slate-600 mb-4">Estudiantes con perfil Creativo que buscan carreras de diseño o arquitectura.</p>
                                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                                  <Mail className="w-4 h-4 mr-2" /> Crear Campaña
                                </Button>
                              </CardContent>
                           </Card>

                           {/* Campaña Humanidades */}
                           <Card className="border border-green-200 bg-green-50/50 hover:bg-green-50 transition-colors cursor-pointer">
                              <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                  <div className="p-3 bg-green-100 rounded-xl text-green-600">
                                    <Users className="w-6 h-6" />
                                  </div>
                                  <Badge className="bg-green-600">210 Estudiantes</Badge>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">Ciencias Sociales</h3>
                                <p className="text-sm text-slate-600 mb-4">Estudiantes con perfil Social-Humanista interesados en derecho o psicología.</p>
                                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                                  <Mail className="w-4 h-4 mr-2" /> Crear Campaña
                                </Button>
                              </CardContent>
                           </Card>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                           <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                             <Filter className="w-5 h-5 mr-2 text-slate-500" />
                             Segmentación Personalizada
                           </h3>
                           <div className="grid md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Carrera de Interés</label>
                                <select className="w-full p-2 rounded-md border border-slate-200 bg-white text-sm">
                                  <option>Todas las carreras</option>
                                  <option>Ingeniería de Sistemas</option>
                                  <option>Derecho</option>
                                  <option>Medicina</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Nivel de Riesgo</label>
                                <select className="w-full p-2 rounded-md border border-slate-200 bg-white text-sm">
                                  <option>Todos los niveles</option>
                                  <option>Riesgo Alto</option>
                                  <option>Riesgo Medio</option>
                                  <option>Sin Riesgo</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Estado del Proceso</label>
                                <select className="w-full p-2 rounded-md border border-slate-200 bg-white text-sm">
                                  <option>Cualquier estado</option>
                                  <option>Test Completado</option>
                                  <option>Pendiente de Cita</option>
                                </select>
                              </div>
                           </div>
                           <div className="flex justify-end">
                             <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                               <Search className="w-4 h-4 mr-2" /> Buscar Grupo Objetivo
                             </Button>
                           </div>
                        </div>

                        <div className="mt-8">
                          <h3 className="font-bold text-slate-900 mb-4">Historial de Campañas Recientes</h3>
                          <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left">
                              <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                  <th className="p-4">Nombre de Campaña</th>
                                  <th className="p-4">Segmento</th>
                                  <th className="p-4">Fecha Envío</th>
                                  <th className="p-4 text-center">Destinatarios</th>
                                  <th className="p-4 text-center">Apertura</th>
                                  <th className="p-4 text-right">Estado</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-slate-50">
                                  <td className="p-4 font-medium text-slate-900">Invitación Open House Ingeniería</td>
                                  <td className="p-4 text-slate-500">Interés: Ingeniería</td>
                                  <td className="p-4 text-slate-500">10 Dic 2025</td>
                                  <td className="p-4 text-center">128</td>
                                  <td className="p-4 text-center text-green-600 font-bold">45%</td>
                                  <td className="p-4 text-right"><Badge className="bg-green-100 text-green-700 hover:bg-green-200">Enviado</Badge></td>
                                </tr>
                                <tr className="hover:bg-slate-50">
                                  <td className="p-4 font-medium text-slate-900">Recordatorio Test Vocacional</td>
                                  <td className="p-4 text-slate-500">Estado: Pendiente</td>
                                  <td className="p-4 text-slate-500">08 Dic 2025</td>
                                  <td className="p-4 text-center">54</td>
                                  <td className="p-4 text-center text-yellow-600 font-bold">28%</td>
                                  <td className="p-4 text-right"><Badge className="bg-green-100 text-green-700 hover:bg-green-200">Enviado</Badge></td>
                                </tr>
                                <tr className="hover:bg-slate-50">
                                  <td className="p-4 font-medium text-slate-900">Becas Artísticas 2026</td>
                                  <td className="p-4 text-slate-500">Interés: Artes</td>
                                  <td className="p-4 text-slate-500">--</td>
                                  <td className="p-4 text-center">85</td>
                                  <td className="p-4 text-center text-slate-400">--</td>
                                  <td className="p-4 text-right"><Badge variant="outline" className="text-slate-500">Borrador</Badge></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
            </Tabs>
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

export default VocationalCounselor;
