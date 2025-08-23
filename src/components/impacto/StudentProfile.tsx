import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Award, 
  BookOpen, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Download
} from "lucide-react";

interface StudentData {
  id: string;
  nombre: string;
  carrera: string;
  cohorte: string;
  estadoBeca: "Activa" | "En Riesgo" | "Suspendida";
  iaa: number;
  creditosInscritos: number;
  creditosAprobados: number;
  creditosTotales: number;
  periodoActual: number;
  periodosRestantes: number;
  pagosRequeridos: number;
  materiasReprobadas: number;
  cambiosCarrera: number;
  interrupciones: number;
}

const StudentProfile = () => {
  // Datos de ejemplo del estudiante
  const studentData: StudentData = {
    id: "IMP-2024-001",
    nombre: "María Fernanda González",
    carrera: "Ingeniería en Sistemas",
    cohorte: "2024-1",
    estadoBeca: "Activa",
    iaa: 16.8,
    creditosInscritos: 15,
    creditosAprobados: 45,
    creditosTotales: 180,
    periodoActual: 3,
    periodosRestantes: 12,
    pagosRequeridos: 1200,
    materiasReprobadas: 1,
    cambiosCarrera: 0,
    interrupciones: 0,
  };

  const historialPagos = [
    { periodo: "2024-2", concepto: "Matemática II (Reprobada)", monto: 800, fecha: "2024-08-15", estado: "Pagado" },
    { periodo: "2024-2", concepto: "Física I (Retirada)", monto: 400, fecha: "2024-09-20", estado: "Pendiente" },
  ];

  const documentos = [
    { nombre: "Contrato de Beca", tipo: "PDF", fecha: "2024-01-15", firmado: true },
    { nombre: "Carta Compromiso", tipo: "PDF", fecha: "2024-01-15", firmado: true },
    { nombre: "Constancia de Inscripción", tipo: "PDF", fecha: "2024-09-01", firmado: false },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Activa":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Activa</Badge>;
      case "En Riesgo":
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="h-3 w-3 mr-1" />En Riesgo</Badge>;
      case "Suspendida":
        return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Suspendida</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const progresoCarrera = (studentData.creditosAprobados / studentData.creditosTotales) * 100;

  return (
    <div className="space-y-6">
      {/* Header del Perfil */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Mi Beca Impacto
              </CardTitle>
              <CardDescription>
                {studentData.nombre} - {studentData.carrera}
              </CardDescription>
            </div>
            {getStatusBadge(studentData.estadoBeca)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{studentData.iaa}</div>
              <div className="text-sm text-muted-foreground">IAA Actual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{studentData.creditosAprobados}</div>
              <div className="text-sm text-muted-foreground">Créditos Aprobados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{studentData.periodoActual}</div>
              <div className="text-sm text-muted-foreground">Período Actual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{studentData.periodosRestantes}</div>
              <div className="text-sm text-muted-foreground">Períodos Restantes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="academico" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="academico">Estado Académico</TabsTrigger>
          <TabsTrigger value="pagos">Pagos</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="compromisos">Compromisos</TabsTrigger>
        </TabsList>

        <TabsContent value="academico" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Progreso de Carrera
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progreso General</span>
                    <span>{progresoCarrera.toFixed(1)}%</span>
                  </div>
                  <Progress value={progresoCarrera} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Créditos Aprobados</div>
                    <div className="text-muted-foreground">{studentData.creditosAprobados}/{studentData.creditosTotales}</div>
                  </div>
                  <div>
                    <div className="font-medium">Créditos Inscritos</div>
                    <div className="text-muted-foreground">{studentData.creditosInscritos}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Rendimiento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">IAA Actual</span>
                    <Badge className={studentData.iaa >= 12 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {studentData.iaa}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Mínimo Requerido</span>
                    <span className="text-sm text-muted-foreground">12.0</span>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-sm text-muted-foreground">
                    Estado: <span className={studentData.iaa >= 12 ? "text-green-600" : "text-red-600"}>
                      {studentData.iaa >= 12 ? "Cumple requisitos" : "Por debajo del mínimo"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Limitaciones y Restricciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{studentData.materiasReprobadas}</div>
                  <div className="text-sm text-muted-foreground">Materias Reprobadas</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{studentData.cambiosCarrera}/1</div>
                  <div className="text-sm text-muted-foreground">Cambios de Carrera</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{studentData.interrupciones}/1</div>
                  <div className="text-sm text-muted-foreground">Interrupciones</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Historial de Pagos Requeridos
              </CardTitle>
              <CardDescription>
                Pagos relacionados con materias reprobadas y retiradas (30% del costo)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {historialPagos.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">No tienes pagos pendientes o realizados</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Período</TableHead>
                      <TableHead>Concepto</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historialPagos.map((pago, index) => (
                      <TableRow key={index}>
                        <TableCell>{pago.periodo}</TableCell>
                        <TableCell>{pago.concepto}</TableCell>
                        <TableCell>${pago.monto.toLocaleString()}</TableCell>
                        <TableCell>{new Date(pago.fecha).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={pago.estado === "Pagado" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                            {pago.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {historialPagos.some(p => p.estado === "Pendiente") && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-800">Pagos Pendientes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-yellow-700 mb-4">
                  Tienes pagos pendientes que deben ser realizados para mantener tu beca activa.
                </p>
                <Button variant="outline">
                  Realizar Pago
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documentos de la Beca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Documento</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentos.map((doc, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{doc.nombre}</TableCell>
                      <TableCell>{doc.tipo}</TableCell>
                      <TableCell>{new Date(doc.fecha).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={doc.firmado ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {doc.firmado ? "Firmado" : "Sin firmar"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          {!doc.firmado && (
                            <Button size="sm">
                              Firmar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compromisos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Estado de Compromisos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold text-green-800 mb-2">Programa de Mentorías</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Sesiones Completadas</span>
                        <span className="text-sm font-medium">8/12</span>
                      </div>
                      <Progress value={66.67} className="h-2" />
                      <p className="text-xs text-green-700">Próxima sesión: 25 de Enero, 2024</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold text-blue-800 mb-2">Actividades Institucionales</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Participación este período</span>
                        <span className="text-sm font-medium">3/3</span>
                      </div>
                      <Progress value={100} className="h-2" />
                      <p className="text-xs text-blue-700">Excelente participación</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Próximas Actividades</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Taller de Liderazgo</div>
                      <div className="text-xs text-muted-foreground">28 de Enero, 2024</div>
                    </div>
                    <Badge variant="outline">Obligatorio</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Conferencia de Excelencia</div>
                      <div className="text-xs text-muted-foreground">15 de Febrero, 2024</div>
                    </div>
                    <Badge variant="secondary">Opcional</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentProfile;