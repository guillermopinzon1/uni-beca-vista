import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, CheckCircle, AlertTriangle, Star, Trophy, Calendar, FileText } from "lucide-react";

const DirectorAreaDashboard = () => {
  const navigate = useNavigate();
  const { logoutAndNavigateHome } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for students in sports/arts programs
  const estudiantesDeportivos = [
    {
      id: "1",
      nombre: "Carlos Rodríguez",
      carrera: "Ing. Sistemas",
      modalidad: "Deportiva",
      deporte: "Fútbol",
      notaActual: 19.5,
      ultimaCertificacion: "2024-01-15",
      estado: "Activo",
      proximaEvaluacion: "2024-07-15"
    },
    {
      id: "2", 
      nombre: "María González",
      carrera: "Comunicación Social",
      modalidad: "Artística",
      deporte: "Danza Contemporánea",
      notaActual: 18.8,
      ultimaCertificacion: "2024-01-15",
      estado: "Activo",
      proximaEvaluacion: "2024-07-15"
    },
    {
      id: "3",
      nombre: "José Martínez",
      carrera: "Administración",
      modalidad: "Deportiva", 
      deporte: "Natación",
      notaActual: 17.2,
      ultimaCertificacion: "2024-01-15",
      estado: "En Riesgo",
      proximaEvaluacion: "2024-07-15"
    }
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Activo":
        return <Badge variant="default" className="bg-green-100 text-green-800">✓ Activo</Badge>;
      case "En Riesgo":
        return <Badge variant="destructive">⚠️ En Riesgo</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const filteredStudents = estudiantesDeportivos.filter(student =>
    student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.deporte.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border/40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={logoutAndNavigateHome}
                className="border-orange/20 hover:bg-orange/5"
              >
                ← Volver al Inicio
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-primary">Director de Área</h1>
                <p className="text-muted-foreground">Gestión de Becas Deportivas y Artísticas</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-orange/30 text-orange-600">
                <Trophy className="h-3 w-3 mr-1" />
                Director de Área
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
              <Star className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">24</div>
              <p className="text-xs text-muted-foreground">En programas deportivos/artísticos</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">21</div>
              <p className="text-xs text-muted-foreground">Con nota ≥18 puntos</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Riesgo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <p className="text-xs text-muted-foreground">Nota por debajo de 18</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximas Certificaciones</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">8</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="estudiantes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="estudiantes">Estudiantes</TabsTrigger>
            <TabsTrigger value="certificaciones">Certificaciones</TabsTrigger>
            <TabsTrigger value="reportes">Reportes</TabsTrigger>
          </TabsList>

          <TabsContent value="estudiantes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Estudiantes en Programas Deportivos/Artísticos
                </CardTitle>
                <CardDescription>
                  Gestión y seguimiento de estudiantes con beca de excelencia modalidad deportiva/artística
                </CardDescription>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre o disciplina..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Estudiante</TableHead>
                      <TableHead>Modalidad</TableHead>
                      <TableHead>Disciplina</TableHead>
                      <TableHead>Nota Actual</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Próxima Evaluación</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{student.nombre}</div>
                            <div className="text-sm text-muted-foreground">{student.carrera}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {student.modalidad}
                          </Badge>
                        </TableCell>
                        <TableCell>{student.deporte}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className={student.notaActual >= 18 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                              {student.notaActual}
                            </span>
                            <span className="text-sm text-muted-foreground">/20</span>
                          </div>
                        </TableCell>
                        <TableCell>{getEstadoBadge(student.estado)}</TableCell>
                        <TableCell>{student.proximaEvaluacion}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              Evaluar
                            </Button>
                            <Button size="sm" variant="outline">
                              Certificar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificaciones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Certificaciones Semestrales
                </CardTitle>
                <CardDescription>
                  Certificar que los estudiantes mantienen su participación activa con nota ≥18
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">⚠️ Certificaciones Pendientes</h4>
                    <p className="text-sm text-yellow-700">
                      8 estudiantes requieren certificación semestral antes del 31 de julio.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">📋 Proceso de Certificación</h4>
                    <ol className="text-sm text-blue-700 space-y-1 ml-4 list-decimal">
                      <li>Verificar participación activa en la selección</li>
                      <li>Confirmar nota mínima de 18 puntos</li>
                      <li>Evaluar desempeño deportivo/artístico</li>
                      <li>Emitir certificación oficial</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reportes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reportes y Estadísticas</CardTitle>
                <CardDescription>
                  Análisis del desempeño de estudiantes en programas deportivos/artísticos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Por Modalidad</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Deportiva:</span>
                        <span className="font-medium">18 estudiantes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Artística:</span>
                        <span className="font-medium">6 estudiantes</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Rendimiento Promedio</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Nota promedio:</span>
                        <span className="font-medium">18.7/20</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tasa de permanencia:</span>
                        <span className="font-medium">87.5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DirectorAreaDashboard;