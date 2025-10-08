import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, FileText, Activity } from "lucide-react";
import ReglamentoAccess from "@/components/shared/ReglamentoAccess";
import { useEffect, useState } from "react";
import AvailabilitySchedule from "@/components/AvailabilitySchedule";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE } from "@/lib/api";

const PasanteAyudantiasModules = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, tokens } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<string | null>("horario-disponibilidad");
  const [activeWeek, setActiveWeek] = useState<string>("semana-1");
  const [completedWeeks, setCompletedWeeks] = useState<Set<number>>(new Set());
  const [weeklyDeadlines] = useState<Record<number, Date>>(() => {
    const deadlines: Record<number, Date> = {};
    const now = new Date();
    for (let i = 1; i <= 12; i++) {
      // Each week has a deadline 7 days after the previous one
      deadlines[i] = new Date(now.getTime() + (i * 7 * 24 * 60 * 60 * 1000));
    }
    return deadlines;
  });
  const [formData, setFormData] = useState({
    fecha: "",
    horas: "",
    descripcion: "",
    objetivos: "",
    metas: "",
    actividades: "",
    reporteSemanal: "",
    observaciones: ""
  });
  const [loadingReportes, setLoadingReportes] = useState(false);
  const [reportes, setReportes] = useState<Array<{ id: string; fecha: string; horasTrabajadas: number; descripcionActividades?: string; estado?: string }>>([]);

  const loadReportes = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken || !user?.id) return;
    setLoadingReportes(true);
    try {
      const resp = await fetch(`${API_BASE}/v1/ayudantias/${user.id}/reportes?limit=20&offset=0`, {
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Accept': 'application/json' }
      });
      if (!resp.ok) return;
      const data = await resp.json();
      const items = data?.data?.reportes || data?.data || [];
      const mapped = items.map((r: any) => ({
        id: r.id,
        fecha: r.fecha,
        horasTrabajadas: r.horasTrabajadas,
        descripcionActividades: r.descripcionActividades || r.actividadesRealizadas,
        estado: r.estado,
        semana: r.semana || r.weekNumber,
      }));
      setReportes(mapped);
      
      // Actualizar semanas completadas basado en los reportes del backend
      const semanasCompletadas = new Set<number>();
      mapped.forEach((r: any) => {
        if (r.semana && r.estado !== 'cancelado') {
          semanasCompletadas.add(parseInt(r.semana));
        }
      });
      setCompletedWeeks(semanasCompletadas);
    } catch {}
    finally { setLoadingReportes(false); }
  };

  useEffect(() => { loadReportes(); // cargar al entrar
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens?.accessToken, user?.id]);

  const sidebarItems = [
    {
      title: "Horario de Disponibilidad",
      icon: Calendar,
      onClick: () => setActiveModule("horario-disponibilidad")
    },
    {
      title: "Sistema de Reporte de Actividades",
      icon: FileText,
      onClick: () => setActiveModule("reporte-actividades")
    },
    {
      title: "Actividades Recientes",
      icon: Activity,
      onClick: () => setActiveModule("actividades-recientes")
    },
    {
      title: "Acceso al Reglamento",
      icon: FileText,
      onClick: () => setActiveModule("reglamento")
    }
  ];

  const isWeekAvailable = (weekNumber: number): boolean => {
    if (weekNumber === 1) return true; // First week is always available
    if (completedWeeks.has(weekNumber - 1)) return true; // Available if previous week is completed
    return false;
  };

  const isWeekExpired = (weekNumber: number): boolean => {
    const deadline = weeklyDeadlines[weekNumber];
    if (!deadline) return false;
    return new Date() > deadline && !completedWeeks.has(weekNumber);
  };

  const handleWeekSubmit = async (weekNumber: number) => {
    try {
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken || !user?.id) {
        toast({ title: 'Sin sesión', description: 'Inicia sesión para enviar reportes', variant: 'destructive' });
        return;
      }
      const body = {
        semana: weekNumber,
        periodoAcademico: '2025-1',
        fecha: formData.fecha,
        horasTrabajadas: parseFloat(formData.horas),
        objetivosPeriodo: formData.objetivos,
        metasEspecificas: formData.metas,
        actividadesProgramadas: formData.actividades,
        actividadesRealizadas: formData.reporteSemanal,
        descripcionActividades: formData.descripcion,
        observaciones: formData.observaciones,
      };
      const resp = await fetch(`${API_BASE}/v1/ayudantias/${user.id}/reportes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        throw new Error(err?.message || `Error ${resp.status}`);
      }
      const newCompletedWeeks = new Set(completedWeeks);
      newCompletedWeeks.add(weekNumber);
      setCompletedWeeks(newCompletedWeeks);
      toast({ title: 'Reporte enviado', description: `Semana ${weekNumber} registrada exitosamente.` });
      await loadReportes();
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'No se pudo enviar el reporte', variant: 'destructive' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Datos enviados",
      description: "La información ha sido registrada exitosamente.",
    });
    setFormData({
      fecha: "",
      horas: "",
      descripcion: "",
      objetivos: "",
      metas: "",
      actividades: "",
      reporteSemanal: "",
      observaciones: ""
    });
  };

  const stats = [
    {
      title: "Horas Registradas",
      value: "45.5",
      change: "Esta semana: 12h",
      icon: Clock
    },
    {
      title: "Horas Aprobadas",
      value: "40",
      change: "88% aprobación",
      icon: CheckCircle
    }
  ];

  const renderContent = () => {
    switch (activeModule) {
      case "horario-disponibilidad":
        return <AvailabilitySchedule />;
      

      case "reporte-actividades":
        return (
          <Card className="border-orange/20">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Sistema de Reporte de Actividades</CardTitle>
              <CardDescription>
                Completa el reporte detallado de tus actividades como ayudante
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeWeek} onValueChange={setActiveWeek} className="w-full">
                <TabsList className="grid grid-cols-6 lg:grid-cols-12 mb-6">
                  {Array.from({ length: 12 }, (_, i) => {
                    const weekNumber = i + 1;
                    const isAvailable = isWeekAvailable(weekNumber);
                    const isExpired = isWeekExpired(weekNumber);
                    const isCompleted = completedWeeks.has(weekNumber);
                    
                    return (
                      <TabsTrigger 
                        key={weekNumber} 
                        value={`semana-${weekNumber}`} 
                        className={`text-xs ${
                          !isAvailable 
                            ? 'opacity-40 cursor-not-allowed' 
                            : isExpired 
                              ? 'text-red-500 bg-red-50' 
                              : isCompleted 
                                ? 'text-green-600 bg-green-50' 
                                : ''
                        }`}
                        disabled={!isAvailable}
                      >
                        S{weekNumber}
                        {isCompleted && ' ✓'}
                        {isExpired && ' ✗'}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                
                {Array.from({ length: 12 }, (_, i) => {
                  const weekNumber = i + 1;
                  const isAvailable = isWeekAvailable(weekNumber);
                  const isExpired = isWeekExpired(weekNumber);
                  const isCompleted = completedWeeks.has(weekNumber);
                  const deadline = weeklyDeadlines[weekNumber];
                  
                  return (
                    <TabsContent key={weekNumber} value={`semana-${weekNumber}`}>
                      {!isAvailable ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">
                            Esta semana no está disponible. Completa la semana anterior primero.
                          </p>
                        </div>
                      ) : isExpired ? (
                        <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200">
                          <p className="text-red-600 font-medium">
                            ⚠️ Esta semana ha expirado
                          </p>
                          <p className="text-red-500 text-sm mt-2">
                            No se registró el reporte a tiempo. La oportunidad se ha perdido.
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          handleWeekSubmit(weekNumber);
                        }} className="space-y-6">
                        {/* Week Status */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-primary">Semana {weekNumber}</h3>
                            <div className="text-sm text-muted-foreground">
                              {deadline && (
                                <span>Límite: {deadline.toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                          {isCompleted && (
                            <p className="text-green-600 text-sm mt-2">✓ Semana completada</p>
                          )}
                        </div>

                        {/* Registro de Horas */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-primary">Registro de Horas - Semana {weekNumber}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fecha">Fecha</Label>
                            <Input
                              id="fecha"
                              type="date"
                              value={formData.fecha}
                              onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="horas">Horas trabajadas</Label>
                            <Input
                              id="horas"
                              type="number"
                              step="0.5"
                              min="0.5"
                              max="8"
                              placeholder="Ej: 4.5"
                              value={formData.horas}
                              onChange={(e) => setFormData({...formData, horas: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Objetivos y Metas */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary">Objetivos y Metas</h3>
                        <div className="space-y-2">
                          <Label htmlFor="objetivos">Objetivos del período</Label>
                          <Textarea
                            id="objetivos"
                            placeholder="Describe los objetivos planteados para este período..."
                            value={formData.objetivos}
                            onChange={(e) => setFormData({...formData, objetivos: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="metas">Metas específicas</Label>
                          <Textarea
                            id="metas"
                            placeholder="Detalla las metas específicas alcanzadas..."
                            value={formData.metas}
                            onChange={(e) => setFormData({...formData, metas: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      {/* Programación de Actividades */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary">Programación de Actividades por Período</h3>
                        <div className="space-y-2">
                          <Label htmlFor="actividades">Actividades programadas y ejecutadas</Label>
                          <Textarea
                            id="actividades"
                            placeholder="Describe las actividades programadas y su estado de ejecución..."
                            value={formData.actividades}
                            onChange={(e) => setFormData({...formData, actividades: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      {/* Reporte Semanal */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary">Reporte Semanal de Actividades</h3>
                        <div className="space-y-2">
                          <Label htmlFor="reporteSemanal">Actividades realizadas esta semana</Label>
                          <Textarea
                            id="reporteSemanal"
                            placeholder="Detalla las actividades específicas realizadas durante la semana..."
                            value={formData.reporteSemanal}
                            onChange={(e) => setFormData({...formData, reporteSemanal: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="descripcion">Descripción de actividades</Label>
                          <Textarea
                            id="descripcion"
                            placeholder="Describe las actividades realizadas..."
                            value={formData.descripcion}
                            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      {/* Observaciones */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary">Observaciones</h3>
                        <div className="space-y-2">
                          <Label htmlFor="observaciones">Observaciones generales</Label>
                          <Textarea
                            id="observaciones"
                            placeholder="Incluye cualquier observación adicional, dificultades encontradas, sugerencias de mejora..."
                            value={formData.observaciones}
                            onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                          />
                        </div>
                      </div>

                          <Button 
                            type="submit" 
                            className="w-full bg-gradient-primary hover:opacity-90"
                            disabled={isCompleted}
                          >
                            {isCompleted ? `Semana ${weekNumber} Completada ✓` : `Enviar Reporte Semana ${weekNumber}`}
                          </Button>
                        </form>
                      )}
                    </TabsContent>
                  );
                })}
              </Tabs>
            </CardContent>
          </Card>
        );

      case "actividades-recientes":
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="border-orange/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activities */}
            <Card className="border-orange/20">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Actividades Recientes</CardTitle>
                <CardDescription>
                  Últimas horas registradas y su estado de aprobación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loadingReportes && (
                    <div className="text-sm text-muted-foreground">Cargando...</div>
                  )}
                  {!loadingReportes && reportes.length === 0 && (
                    <div className="text-sm text-muted-foreground">Sin actividades registradas</div>
                  )}
                  {!loadingReportes && reportes.map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{new Date(r.fecha).toLocaleDateString('es-VE')} - {r.horasTrabajadas} horas</p>
                        <p className="text-sm text-muted-foreground">{r.descripcionActividades || 'Reporte semanal'}</p>
                      </div>
                      <div className={`flex items-center ${r.estado === 'aprobado' ? 'text-green-600' : r.estado === 'pendiente' ? 'text-yellow-600' : 'text-muted-foreground'}`}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">{r.estado ? r.estado.charAt(0).toUpperCase() + r.estado.slice(1) : 'Registrado'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "reglamento":
        return (
          <div className="flex justify-center">
            <ReglamentoAccess becaType="ayudantia" />
          </div>
        );

      default:
        return (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Bienvenido al Sistema de Ayudantías
            </h2>
            <p className="text-muted-foreground">
              Utiliza el menú lateral para navegar entre los diferentes módulos
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-orange/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/scholarship-programs")}
              className="text-primary hover:text-primary/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Becas
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Gestión de Ayudantía</h1>
              <p className="text-sm text-muted-foreground">
                Inicio &gt; Mi Ayudantía &gt; Gestión
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-primary">Ana María Rodríguez</p>
              <p className="text-xs text-muted-foreground">Ayudante</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Integrated Sidebar */}
        <div className="w-16 bg-card border-r border-orange/20 min-h-[calc(100vh-theme(spacing.20))]">
          <div className="p-2 space-y-2">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setHoveredItem(item.title)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button
                  onClick={item.onClick}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg border transition-all duration-200 ${
                    activeModule === item.onClick.toString().split('"')[1]
                      ? "bg-orange/10 border-orange/40"
                      : "bg-background border-orange/20 hover:bg-orange/10 hover:border-orange/40"
                  }`}
                >
                  <item.icon className="h-5 w-5 text-primary" />
                </button>
                
                {/* Tooltip on hover */}
                {hoveredItem === item.title && (
                  <div className="absolute left-16 top-0 bg-card border border-orange/20 rounded-lg px-3 py-2 shadow-lg z-10 whitespace-nowrap">
                    <span className="text-sm font-medium text-primary">{item.title}</span>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-card border-l border-b border-orange/20 rotate-45"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PasanteAyudantiasModules;