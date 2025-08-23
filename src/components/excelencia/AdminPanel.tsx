import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Users, 
  FileText, 
  Calendar,
  TrendingUp,
  Download
} from "lucide-react";

const AdminPanel = () => {
  const pendingApplications = [
    {
      id: 1,
      estudiante: "Carlos Rodríguez",
      cedula: "V-23456789",
      carrera: "Ingeniería Industrial",
      categoria: "Académica",
      iaa: 18.2,
      fechaEnvio: "2024-03-20",
      documentos: 4,
      documentosRequeridos: 4
    },
    {
      id: 2,
      estudiante: "Ana Pérez",
      cedula: "V-34567890",
      carrera: "Comunicación Social",
      categoria: "Artística",
      iaa: 16.8,
      fechaEnvio: "2024-03-19",
      documentos: 3,
      documentosRequeridos: 4
    },
    {
      id: 3,
      estudiante: "Luis García",
      cedula: "V-45678901",
      carrera: "Administración",
      categoria: "Emprendimiento",
      iaa: 17.5,
      fechaEnvio: "2024-03-18",
      documentos: 4,
      documentosRequeridos: 4
    }
  ];

  const approvedApplications = [
    {
      id: 4,
      estudiante: "María González",
      cedula: "V-12345678",
      carrera: "Ingeniería de Sistemas",
      categoria: "Académica",
      iaa: 18.75,
      porcentaje: "25%",
      fechaAprobacion: "2024-03-15"
    },
    {
      id: 5,
      estudiante: "Pedro Martínez",
      cedula: "V-56789012",
      carrera: "Psicología",
      categoria: "Deportiva",
      iaa: 16.2,
      porcentaje: "15%",
      fechaAprobacion: "2024-03-10"
    }
  ];

  const stats = {
    totalPostulaciones: 25,
    pendientes: 8,
    aprobadas: 12,
    rechazadas: 5,
    nuevasHoy: 3
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completo":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Incompleto":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-primary">{stats.totalPostulaciones}</div>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendientes}</div>
            <p className="text-sm text-muted-foreground">Pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.aprobadas}</div>
            <p className="text-sm text-muted-foreground">Aprobadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.rechazadas}</div>
            <p className="text-sm text-muted-foreground">Rechazadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.nuevasHoy}</div>
            <p className="text-sm text-muted-foreground">Nuevas Hoy</p>
          </CardContent>
        </Card>
      </div>

      {/* Panel Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Panel de Administración - Becas de Excelencia
          </CardTitle>
          <CardDescription>
            Gestiona las postulaciones y aprobaciones de becas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pendientes" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pendientes">Pendientes de Revisión</TabsTrigger>
              <TabsTrigger value="aprobadas">Aprobadas</TabsTrigger>
              <TabsTrigger value="reportes">Reportes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pendientes" className="space-y-4">
              {/* Filtros */}
              <div className="flex flex-col md:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre o cédula..."
                    className="w-full pl-10"
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filtrar por carrera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las carreras</SelectItem>
                    <SelectItem value="sistemas">Ingeniería de Sistemas</SelectItem>
                    <SelectItem value="industrial">Ingeniería Industrial</SelectItem>
                    <SelectItem value="comunicacion">Comunicación Social</SelectItem>
                    <SelectItem value="administracion">Administración</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filtrar por categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las categorías</SelectItem>
                    <SelectItem value="academica">Académica</SelectItem>
                    <SelectItem value="deportiva">Deportiva</SelectItem>
                    <SelectItem value="artistica">Artística</SelectItem>
                    <SelectItem value="civico">Compromiso Cívico</SelectItem>
                    <SelectItem value="emprendimiento">Emprendimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Lista de Postulaciones Pendientes */}
              <div className="space-y-4">
                {pendingApplications.map((app) => (
                  <Card key={app.id} className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold">{app.estudiante}</h4>
                            <Badge variant="outline">{app.cedula}</Badge>
                            <Badge>{app.categoria}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{app.carrera}</span>
                            <span>IAA: {app.iaa}</span>
                            <span>Enviado: {new Date(app.fechaEnvio).toLocaleDateString('es-ES')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Documentos:</span>
                            <Badge className={getStatusColor(
                              app.documentos === app.documentosRequeridos ? "Completo" : "Incompleto"
                            )}>
                              {app.documentos}/{app.documentosRequeridos}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Revisar
                          </Button>
                          <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Aprobar
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <XCircle className="h-4 w-4 mr-2" />
                            Rechazar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="aprobadas" className="space-y-4">
              {/* Lista de Postulaciones Aprobadas */}
              <div className="space-y-4">
                {approvedApplications.map((app) => (
                  <Card key={app.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold">{app.estudiante}</h4>
                            <Badge variant="outline">{app.cedula}</Badge>
                            <Badge>{app.categoria}</Badge>
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Aprobada
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{app.carrera}</span>
                            <span>IAA: {app.iaa}</span>
                            <span>Cobertura: {app.porcentaje}</span>
                            <span>Aprobado: {new Date(app.fechaAprobacion).toLocaleDateString('es-ES')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Ver Detalles
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Carta Compromiso
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="reportes" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Reporte por Categoría</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Académica</span>
                        <Badge>8 postulaciones</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Deportiva</span>
                        <Badge>6 postulaciones</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Artística</span>
                        <Badge>5 postulaciones</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Compromiso Cívico</span>
                        <Badge>3 postulaciones</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Emprendimiento</span>
                        <Badge>3 postulaciones</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Reporte por Carrera</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Ingeniería de Sistemas</span>
                        <Badge>7 postulaciones</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Ingeniería Industrial</span>
                        <Badge>6 postulaciones</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Administración</span>
                        <Badge>5 postulaciones</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Comunicación Social</span>
                        <Badge>4 postulaciones</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Psicología</span>
                        <Badge>3 postulaciones</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar a Excel
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Generar Reporte PDF
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;