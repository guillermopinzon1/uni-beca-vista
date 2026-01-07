import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Award, FileText, BookOpen, Download, Filter, TrendingUp, Target } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const vocationalBg = "https://www.unimet.edu.ve/wp-content/uploads/2021/03/MODULO-DE-AULAS-ahora-1030x687.jpg";

// Mock Data
const dataInterests = [
    { name: 'Ingeniería', value: 40 },
    { name: 'Humanidades', value: 25 },
    { name: 'Ciencias', value: 20 },
    { name: 'Artes', value: 15 },
  ];
  
  const dataTrends = [
    { month: 'Ene', tests: 65, consultations: 40 },
    { month: 'Feb', tests: 59, consultations: 50 },
    { month: 'Mar', tests: 80, consultations: 90 },
    { month: 'Abr', tests: 81, consultations: 85 },
    { month: 'May', tests: 56, consultations: 70 },
    { month: 'Jun', tests: 120, consultations: 100 },
  ];
  
  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

const VocationalAnalytics = () => {

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Header */}
      <div className="relative py-10 border-b border-slate-800">
            <div 
             className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none"
             style={{ backgroundImage: `url(${vocationalBg})`, backgroundSize: 'cover' }}
           />
           <div className="container mx-auto px-4 relative z-10">
             <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <TrendingUp className="text-blue-500" />
                        Monitoreo y Analytics
                    </h1>
                    <p className="text-slate-400">Módulo 6: Métricas de impacto ODS 4 y comportamiento vocacional</p>
                </div>
                <div className="flex gap-3">
                    <Select defaultValue="this_month">
                        <SelectTrigger className="w-[180px] bg-slate-900 border-slate-700 text-slate-200">
                            <SelectValue placeholder="Periodo" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                            <SelectItem value="this_month">Este Mes</SelectItem>
                            <SelectItem value="last_quarter">Último Trimestre</SelectItem>
                            <SelectItem value="year_to_date">Año en curso</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800">
                        <Filter className="w-4 h-4 mr-2" /> Filtrar
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Download className="w-4 h-4 mr-2" /> Reporte
                    </Button>
                </div>
             </div>
           </div>
        </div>

        <div className="container mx-auto px-4 py-8">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Tests Completados</CardTitle>
                        <Target className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">2,543</div>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                            <TrendingUp className="w-3 h-3 mr-1" /> +20.1% vs mes anterior
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Estudiantes Activos</CardTitle>
                        <Users className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">12,305</div>
                        <p className="text-xs text-slate-500 mt-1">
                            85% de la matrícula total
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Carreras Consultadas</CardTitle>
                        <BookOpen className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">45,231</div>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                            <TrendingUp className="w-3 h-3 mr-1" /> +12% visitas al catálogo
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Match Vocacional</CardTitle>
                        <Target className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">92%</div>
                        <p className="text-xs text-slate-500 mt-1">
                            Precisión de recomendación IA
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Trend Chart */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Actividad Mensual</CardTitle>
                        <CardDescription className="text-slate-400">Comparativa de tests realizados vs consultas de carrera</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dataTrends}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="month" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                                    />
                                    <Line type="monotone" dataKey="tests" stroke="#3b82f6" strokeWidth={3} name="Tests" />
                                    <Line type="monotone" dataKey="consultations" stroke="#10b981" strokeWidth={3} name="Consultas" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Pie Chart */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Intereses por Área</CardTitle>
                        <CardDescription className="text-slate-400">Distribución de preferencias vocacionales</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dataInterests}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {dataInterests.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-6 mt-4">
                            {dataInterests.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-sm text-slate-400">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

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

export default VocationalAnalytics;
