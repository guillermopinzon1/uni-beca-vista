import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, CheckCircle, AlertTriangle, Clock, Calendar, User, FileText } from "lucide-react";

const SupervisorLaboralDashboard = () => {
  const navigate = useNavigate();
  const { logoutAndNavigateHome } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for employees studying during work hours
  const empleadosHorarioLaboral = [
    {
      id: "1",
      nombre: "Luis Rodríguez",
      cargo: "Asistente Administrativo",
      departamento: "Finanzas",
      carrera: "Contaduría",
      horarioClases: "Martes 2:00-4:00 PM",
      horasCompensarSemana: 2,
      horasCompensadasMes: "8/8",
      planCompensacion: "Sábados 8:00-10:00 AM",
      ultimaValidacion: "2024-06-30",
      proximaValidacion: "2024-07-31",
      cumplimiento: "Completo"
    },
    {
      id: "2",
      nombre: "María González",
      cargo: "Analista de Sistemas",
      departamento: "Tecnología",
      carrera: "Ing. Sistemas",
      horarioClases: "Jueves 3:00-5:00 PM",
      horasCompensarSemana: 2,
      horasCompensadasMes: "6/8",
      planCompensacion: "Viernes 5:00-7:00 PM",
      ultimaValidacion: "2024-06-30",
      proximaValidacion: "2024-07-31",
      cumplimiento: "Pendiente"
    }
  ];

  const getCumplimientoBadge = (cumplimiento: string) => {
    switch (cumplimiento) {
      case "Completo":
        return <Badge variant="default" className="bg-green-100 text-green-800">✓ Completo</Badge>;
      case "Pendiente":
        return <Badge variant="destructive">⚠️ Pendiente</Badge>;
      default:
        return <Badge variant="secondary">{cumplimiento}</Badge>;
    }
  };

  const filteredEmployees = empleadosHorarioLaboral.filter(emp =>
    emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.carrera.toLowerCase().includes(searchTerm.toLowerCase())
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
                <h1 className="text-2xl font-bold text-primary">Supervisor Laboral</h1>
                <p className="text-muted-foreground">Gestión de Horarios Especiales - Empleados Estudiantes</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-orange/30 text-orange-600">
                <User className="h-3 w-3 mr-1" />
                Supervisor Laboral
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
              <CardTitle className="text-sm font-medium">Empleados con Horario Especial</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">12</div>
              <p className="text-xs text-muted-foreground">Estudian en horario laboral</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cumplimiento Completo</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">10</div>
              <p className="text-xs text-muted-foreground">Horas compensadas al día</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">2</div>
              <p className="text-xs text-muted-foreground">Con horas por compensar</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Validaciones Pendientes</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">5</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="horarios-especiales" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="horarios-especiales">Horarios Especiales</TabsTrigger>
            <TabsTrigger value="compensaciones">Compensaciones</TabsTrigger>
            <TabsTrigger value="reportes">Reportes</TabsTrigger>
          </TabsList>

          <TabsContent value="horarios-especiales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Empleados con Horario Especial
                </CardTitle>
                <CardDescription>
                  Gestión y seguimiento de empleados que estudian en horario laboral
                </CardDescription>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar empleado o carrera..."
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
                      <TableHead>Empleado</TableHead>
                      <TableHead>Carrera</TableHead>
                      <TableHead>Horario de Clases</TableHead>
                      <TableHead>Plan de Compensación</TableHead>
                      <TableHead>Horas del Mes</TableHead>
                      <TableHead>Cumplimiento</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((empleado) => (
                      <TableRow key={empleado.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{empleado.nombre}</div>
                            <div className="text-sm text-muted-foreground">{empleado.cargo}</div>
                            <div className="text-sm text-muted-foreground">{empleado.departamento}</div>
                          </div>
                        </TableCell>
                        <TableCell>{empleado.carrera}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{empleado.horarioClases}</div>
                            <div className="text-muted-foreground">{empleado.horasCompensarSemana}h semanales</div>
                          </div>
                        </TableCell>
                        <TableCell>{empleado.planCompensacion}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className={empleado.horasCompensadasMes === "8/8" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                              {empleado.horasCompensadasMes}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getCumplimientoBadge(empleado.cumplimiento)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              Validar Horas
                            </Button>
                            <Button size="sm" variant="outline">
                              Ver Detalle
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

          <TabsContent value="compensaciones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Registro de Compensaciones
                </CardTitle>
                <CardDescription>
                  Control detallado de horas compensadas por empleado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">📋 Proceso de Validación</h4>
                    <ol className="text-sm text-blue-700 space-y-1 ml-4 list-decimal">
                      <li>Verificar asistencia a compensación según plan aprobado</li>
                      <li>Validar cumplimiento de horas mínimas semanales</li>
                      <li>Confirmar que no afecta operaciones del departamento</li>
                      <li>Generar reporte mensual para Capital Humano</li>
                    </ol>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">⚠️ Alertas del Sistema</h4>
                    <ul className="text-sm text-yellow-700 space-y-1 ml-4 list-disc">
                      <li>María González: 2 horas pendientes de compensar este mes</li>
                      <li>Recordatorio: Validaciones mensuales vencen el 31 de julio</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reportes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Reportes Mensuales
                </CardTitle>
                <CardDescription>
                  Reportes de cumplimiento para Capital Humano
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Cumplimiento por Empleado</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Luis Rodríguez:</span>
                        <span className="font-medium text-green-600">100%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>María González:</span>
                        <span className="font-medium text-yellow-600">75%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Estadísticas Generales</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Promedio de cumplimiento:</span>
                        <span className="font-medium">87.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Horas totales compensadas:</span>
                        <span className="font-medium">96/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Empleados al día:</span>
                        <span className="font-medium">10/12</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button className="w-full">
                    Generar Reporte Mensual para Capital Humano
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SupervisorLaboralDashboard;