import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, CheckCircle, AlertTriangle, Users, Clock, FileText, Briefcase } from "lucide-react";

const CapitalHumanoDashboard = () => {
  const navigate = useNavigate();
  const { logoutAndNavigateHome } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for employees with children beneficiaries
  const empleadosBeneficiarios = [
    {
      id: "1",
      nombre: "Ana García",
      cargo: "Coordinadora Académica",
      departamento: "Estudios Generales",
      antiguedad: "4 años, 2 meses",
      estadoLaboral: "Activo",
      ultimaVerificacion: "2024-06-15",
      hijoEstudiante: "Carlos García",
      carrera: "Ing. Sistemas",
      proximaVerificacion: "2024-07-15"
    },
    {
      id: "2",
      nombre: "Roberto Martínez", 
      cargo: "Analista de Sistemas",
      departamento: "Tecnología",
      antiguedad: "2 años, 8 meses",
      estadoLaboral: "Activo",
      ultimaVerificacion: "2024-06-10",
      hijoEstudiante: "María Martínez",
      carrera: "Comunicación Social",
      proximaVerificacion: "2024-07-10"
    },
    {
      id: "3",
      nombre: "Carmen López",
      cargo: "Secretaria Ejecutiva",
      departamento: "Rectorado",
      antiguedad: "1 año, 11 meses",
      estadoLaboral: "Activo",
      ultimaVerificacion: "2024-06-05",
      hijoEstudiante: "José López",
      carrera: "Administración",
      proximaVerificacion: "2024-07-05"
    }
  ];

  const empleadosEstudiantes = [
    {
      id: "1",
      nombre: "Luis Rodríguez",
      cargo: "Asistente Administrativo",
      departamento: "Finanzas",
      antiguedad: "3 años, 1 mes",
      estadoLaboral: "Activo",
      carreraEstudia: "Contaduría",
      modalidad: "Nocturna",
      horarioEspecial: "No",
      supervisor: "Ing. María González"
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

  const filteredEmployees = empleadosBeneficiarios.filter(emp =>
    emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.hijoEstudiante.toLowerCase().includes(searchTerm.toLowerCase())
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
                <h1 className="text-2xl font-bold text-primary">Capital Humano</h1>
                <p className="text-muted-foreground">Verificación de Estatus Laboral - Programa Exoneración</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-orange/30 text-orange-600">
                <Briefcase className="h-3 w-3 mr-1" />
                Capital Humano
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
              <CardTitle className="text-sm font-medium">Empleados con Hijos</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">43</div>
              <p className="text-xs text-muted-foreground">Con beneficio exoneración</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estatus Verificado</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">41</div>
              <p className="text-xs text-muted-foreground">Empleados activos</p>
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Requieren Atención</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">2</div>
              <p className="text-xs text-muted-foreground">Verificaciones pendientes</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Próximas Verificaciones</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">12</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="hijos-empleados" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hijos-empleados">Hijos de Empleados</TabsTrigger>
            <TabsTrigger value="empleados-estudiantes">Empleados Estudiantes</TabsTrigger>
            <TabsTrigger value="reportes">Reportes</TabsTrigger>
          </TabsList>

          <TabsContent value="hijos-empleados" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Empleados con Hijos Beneficiarios
                </CardTitle>
                <CardDescription>
                  Verificación continua del estatus laboral para mantener el beneficio de exoneración
                </CardDescription>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar empleado o estudiante..."
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
                      <TableHead>Antigüedad</TableHead>
                      <TableHead>Estudiante (Hijo/a)</TableHead>
                      <TableHead>Estado Laboral</TableHead>
                      <TableHead>Última Verificación</TableHead>
                      <TableHead>Próxima Verificación</TableHead>
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
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{empleado.antiguedad}</div>
                            {empleado.antiguedad.includes("1 año") && (
                              <div className="text-yellow-600 text-xs">⚠️ Menos de 2 años</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{empleado.hijoEstudiante}</div>
                            <div className="text-sm text-muted-foreground">{empleado.carrera}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getEstadoBadge(empleado.estadoLaboral)}</TableCell>
                        <TableCell>{empleado.ultimaVerificacion}</TableCell>
                        <TableCell>{empleado.proximaVerificacion}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              Verificar
                            </Button>
                            <Button size="sm" variant="outline">
                              Constancia
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

          <TabsContent value="empleados-estudiantes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Empleados que Estudian
                </CardTitle>
                <CardDescription>
                  Verificación de permanencia laboral y compromiso post-graduación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empleado</TableHead>
                      <TableHead>Carrera</TableHead>
                      <TableHead>Modalidad</TableHead>
                      <TableHead>Horario Especial</TableHead>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {empleadosEstudiantes.map((empleado) => (
                      <TableRow key={empleado.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{empleado.nombre}</div>
                            <div className="text-sm text-muted-foreground">{empleado.cargo}</div>
                            <div className="text-sm text-muted-foreground">{empleado.departamento}</div>
                          </div>
                        </TableCell>
                        <TableCell>{empleado.carreraEstudia}</TableCell>
                        <TableCell>{empleado.modalidad}</TableCell>
                        <TableCell>
                          {empleado.horarioEspecial === "No" ? (
                            <Badge variant="outline" className="text-green-600">No requerido</Badge>
                          ) : (
                            <Badge variant="default">Aprobado</Badge>
                          )}
                        </TableCell>
                        <TableCell>{empleado.supervisor}</TableCell>
                        <TableCell>{getEstadoBadge(empleado.estadoLaboral)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              Ver Compromisos
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

          <TabsContent value="reportes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Reportes de Verificación
                </CardTitle>
                <CardDescription>
                  Estadísticas y reportes del programa de exoneración
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Por Departamento</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Estudios Generales:</span>
                        <span className="font-medium">12 empleados</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tecnología:</span>
                        <span className="font-medium">8 empleados</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Finanzas:</span>
                        <span className="font-medium">6 empleados</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rectorado:</span>
                        <span className="font-medium">4 empleados</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Estadísticas Generales</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Tasa de retención laboral:</span>
                        <span className="font-medium">95.3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Verificaciones al día:</span>
                        <span className="font-medium">95.3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Empleados con &lt;2 años:</span>
                        <span className="font-medium">3</span>
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

export default CapitalHumanoDashboard;