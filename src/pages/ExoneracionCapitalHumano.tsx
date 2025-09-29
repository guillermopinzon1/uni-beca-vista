import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Users, AlertTriangle, CheckCircle, Clock, Search, FileText, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ExoneracionCapitalHumano = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<'beneficiarios' | 'register-hijo' | 'register-empleado' | 'empleados'>('beneficiarios');

  const beneficiarios = [
    {
      id: 1,
      tipo: "Hijo",
      estudiante: "Ana María González",
      empleado: "Carlos González",
      cargo: "Coordinador de Sistemas",
      departamento: "Tecnología",
      antiguedad: "8 años",
      estadoLaboral: "Activo",
      estadoBeneficio: "Activo",
      fechaIngreso: "2023-09-01",
      iaa: 13.2
    },
    {
      id: 2,
      tipo: "Empleado",
      estudiante: "María Elena Rodríguez",
      empleado: "María Elena Rodríguez",
      cargo: "Profesora de Matemáticas",
      departamento: "Educación",
      antiguedad: "5 años",
      estadoLaboral: "Activo",
      estadoBeneficio: "Activo",
      fechaIngreso: "2024-01-15",
      compromisoPost: "1.5 años restantes"
    },
    {
      id: 3,
      tipo: "Hijo", 
      estudiante: "Roberto Martínez",
      empleado: "Carmen Martínez",
      cargo: "Secretaria Académica",
      departamento: "Registro",
      antiguedad: "12 años",
      estadoLaboral: "Pre-jubilación",
      estadoBeneficio: "En riesgo",
      fechaIngreso: "2022-09-01",
      alerta: "Empleado próximo a jubilarse"
    }
  ];

  const empleadosControl = [
    {
      id: 1,
      nombre: "Dr. Luis Fernández",
      cargo: "Profesor Tiempo Parcial",
      departamento: "Ingeniería",
      cursosActuales: 1,
      cursosMinimos: 2,
      estado: "Riesgo",
      trimestresGracia: 1,
      alerta: "Baja carga académica - 1 trimestre de gracia restante"
    },
    {
      id: 2,
      nombre: "Prof. Ana Delgado",
      cargo: "Profesora Tiempo Parcial",
      departamento: "Administración",
      cursosActuales: 3,
      cursosMinimos: 2,
      estado: "Cumple",
      trimestresGracia: 0,
      alerta: null
    }
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Activo":
        return <Badge className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />{estado}</Badge>;
      case "En riesgo":
        return <Badge variant="outline" className="text-orange-600 bg-orange-50 border-orange-200"><AlertTriangle className="h-3 w-3 mr-1" />{estado}</Badge>;
      case "Suspendido":
        return <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200"><Clock className="h-3 w-3 mr-1" />{estado}</Badge>;
      case "Cumple":
        return <Badge className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />{estado}</Badge>;
      case "Riesgo":
        return <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200"><AlertTriangle className="h-3 w-3 mr-1" />{estado}</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
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
              onClick={() => navigate(-1)}
              className="text-primary hover:text-primary/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Exoneración Personal e Hijos</h1>
              <p className="text-sm text-muted-foreground">
                Capital Humano - Gestión de beneficiarios y empleados
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="border-orange/40 text-primary">
              Eudice Figuera - Capital Humano
            </Badge>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeView === 'beneficiarios' ? 'default' : 'outline'}
              onClick={() => setActiveView('beneficiarios')}
              className="flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Lista de Beneficiarios</span>
            </Button>
            <Button 
              variant={activeView === 'register-hijo' ? 'default' : 'outline'}
              onClick={() => setActiveView('register-hijo')}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Registrar Hijo</span>
            </Button>
            <Button 
              variant={activeView === 'register-empleado' ? 'default' : 'outline'}
              onClick={() => setActiveView('register-empleado')}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Registrar Empleado Estudiante</span>
            </Button>
            <Button 
              variant={activeView === 'empleados' ? 'default' : 'outline'}
              onClick={() => setActiveView('empleados')}
              className="flex items-center space-x-2"
            >
              <Shield className="h-4 w-4" />
              <span>Control Profesores T.P.</span>
            </Button>
          </div>

          {/* Lista de Beneficiarios */}
          {activeView === 'beneficiarios' && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Beneficiarios Activos</CardTitle>
                    <CardDescription>
                      Gestión de empleados y sus hijos con beneficio de exoneración
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Buscar beneficiario..." className="pl-10 w-64" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Estudiante</TableHead>
                      <TableHead>Empleado UNIMET</TableHead>
                      <TableHead>Cargo/Departamento</TableHead>
                      <TableHead>Antigüedad</TableHead>
                      <TableHead>Estado Laboral</TableHead>
                      <TableHead>Estado Beneficio</TableHead>
                      <TableHead>Alertas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {beneficiarios.map((beneficiario) => (
                      <TableRow key={beneficiario.id}>
                        <TableCell>
                          <Badge variant="outline" className={beneficiario.tipo === 'Hijo' ? 'text-blue-600' : 'text-purple-600'}>
                            {beneficiario.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{beneficiario.estudiante}</p>
                            <p className="text-sm text-muted-foreground">
                              {beneficiario.tipo === 'Hijo' ? `IAA: ${beneficiario.iaa}` : beneficiario.compromisoPost}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{beneficiario.empleado}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{beneficiario.cargo}</p>
                            <p className="text-xs text-muted-foreground">{beneficiario.departamento}</p>
                          </div>
                        </TableCell>
                        <TableCell>{beneficiario.antiguedad}</TableCell>
                        <TableCell>{getEstadoBadge(beneficiario.estadoLaboral)}</TableCell>
                        <TableCell>{getEstadoBadge(beneficiario.estadoBeneficio)}</TableCell>
                        <TableCell>
                          {beneficiario.alerta && (
                            <div className="flex items-center space-x-1">
                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                              <span className="text-sm text-orange-600">{beneficiario.alerta}</span>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Formulario Registro Hijo */}
          {activeView === 'register-hijo' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Registrar Hijo de Empleado</CardTitle>
                <CardDescription>
                  Verificación de requisitos para hijos de empleados UNIMET
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  {/* Datos del Estudiante */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Datos del Estudiante</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nombres completos</Label>
                        <Input />
                      </div>
                      <div className="space-y-2">
                        <Label>Apellidos completos</Label>
                        <Input />
                      </div>
                      <div className="space-y-2">
                        <Label>Cédula de identidad</Label>
                        <Input />
                      </div>
                      <div className="space-y-2">
                        <Label>Fecha de nacimiento</Label>
                        <Input type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label>Promedio de bachillerato</Label>
                        <Input type="number" step="0.01" min="12" />
                        <p className="text-sm text-muted-foreground">Mínimo 12 puntos</p>
                      </div>
                      <div className="space-y-2">
                        <Label>Carrera a cursar</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar carrera" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ing-sistemas">Ingeniería en Sistemas</SelectItem>
                            <SelectItem value="ing-civil">Ingeniería Civil</SelectItem>
                            <SelectItem value="administracion">Administración</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Datos del Empleado */}
                  <div className="border-t pt-6 space-y-4">
                    <h3 className="text-lg font-semibold">Datos del Empleado Padre/Madre</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Empleado UNIMET</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Buscar empleado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="carlos-gonzalez">Carlos González - Tecnología</SelectItem>
                            <SelectItem value="maria-rodriguez">María Rodríguez - Educación</SelectItem>
                            <SelectItem value="carmen-martinez">Carmen Martínez - Registro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Relación familiar</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar relación" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="padre">Padre</SelectItem>
                            <SelectItem value="madre">Madre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Verificaciones automáticas */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">Verificaciones Automáticas</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Antigüedad mínima (1 año)</span>
                          <Badge className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />Cumple
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Edad máxima al ingreso (21 años)</span>
                          <Badge className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />Cumple
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Promedio mínimo bachillerato (12)</span>
                          <Badge variant="outline" className="text-yellow-600 bg-yellow-50 border-yellow-200">
                            <Clock className="h-3 w-3 mr-1" />Pendiente
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline">Cancelar</Button>
                    <Button type="submit">Registrar Beneficiario</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Control Profesores Tiempo Parcial */}
          {activeView === 'empleados' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Control de Profesores Tiempo Parcial</CardTitle>
                <CardDescription>
                  Validación especial: mínimo 2 cursos dictando por trimestre
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Profesor</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Cursos Actuales</TableHead>
                      <TableHead>Mínimo Requerido</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Trimestres Gracia</TableHead>
                      <TableHead>Alertas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {empleadosControl.map((profesor) => (
                      <TableRow key={profesor.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{profesor.nombre}</p>
                            <p className="text-sm text-muted-foreground">{profesor.cargo}</p>
                          </div>
                        </TableCell>
                        <TableCell>{profesor.departamento}</TableCell>
                        <TableCell className="text-center">{profesor.cursosActuales}</TableCell>
                        <TableCell className="text-center">{profesor.cursosMinimos}</TableCell>
                        <TableCell>{getEstadoBadge(profesor.estado)}</TableCell>
                        <TableCell className="text-center">{profesor.trimestresGracia}</TableCell>
                        <TableCell>
                          {profesor.alerta && (
                            <div className="flex items-center space-x-1">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                              <span className="text-sm text-red-600">{profesor.alerta}</span>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
};

export default ExoneracionCapitalHumano;