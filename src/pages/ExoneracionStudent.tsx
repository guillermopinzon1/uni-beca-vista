import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, Clock, DollarSign, BookOpen, Users, Calendar, FileText, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const ExoneracionStudent = () => {
  const navigate = useNavigate();

  const beneficiarioData = {
    nombre: "Ana María González",
    empleadoPadre: {
      nombre: "Carlos González",
      cargo: "Coordinador de Sistemas",
      departamento: "Tecnología",
      antiguedad: "8 años",
      estado: "ACTIVO"
    },
    cobertura: "100%",
    fechaIngreso: "2023-09-01",
    iaaActual: 13.2,
    creditosCompletados: 45,
    añoCursando: "2do año"
  };

  const compromisos = [
    {
      compromiso: "Mantener IAA mínimo 12.0",
      estado: "cumplido",
      valorActual: "13.2",
      requerido: "≥12.0",
      descripcion: "Rendimiento académico mínimo"
    },
    {
      compromiso: "Aprobar mínimo 12 asignaturas anuales",
      estado: "cumplido",
      valorActual: "15 asignaturas",
      requerido: "≥12",
      descripcion: "Carga académica anual"
    },
    {
      compromiso: "Completar carrera en máximo 5 años",
      estado: "en_tiempo",
      valorActual: "1.5 años cursados",
      requerido: "≤5 años",
      descripcion: "Tiempo máximo de permanencia"
    },
    {
      compromiso: "Asistir a 3 tutorías obligatorias por trimestre",
      estado: "pendiente",
      valorActual: "2/3 tutorías",
      requerido: "3 tutorías",
      descripcion: "Acompañamiento académico trimestral"
    }
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "cumplido": return "text-green-600 bg-green-50 border-green-200";
      case "en_tiempo": return "text-blue-600 bg-blue-50 border-blue-200";
      case "pendiente": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "incumplido": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "cumplido": return <CheckCircle className="h-4 w-4" />;
      case "en_tiempo": return <Clock className="h-4 w-4" />;
      case "pendiente": return <AlertTriangle className="h-4 w-4" />;
      case "incumplido": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const compromisosCompletados = compromisos.filter(c => c.estado === "cumplido" || c.estado === "en_tiempo").length;
  const progresoCumplimiento = (compromisosCompletados / compromisos.length) * 100;

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
              <h1 className="text-2xl font-bold text-primary">Mi Exoneración</h1>
              <p className="text-sm text-muted-foreground">
                Dashboard informativo - Solo lectura
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="border-green-400 text-green-700">
              Beneficiario Activo
            </Badge>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Estado del Beneficio */}
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="text-xl flex items-center space-x-2 text-green-800">
                <Shield className="h-6 w-6" />
                <span>Beneficiario Activo - Exoneración 100%</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-green-800">Información del Beneficio</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Cobertura:</span> {beneficiarioData.cobertura}</p>
                    <p><span className="font-medium">Fecha de ingreso:</span> {beneficiarioData.fechaIngreso}</p>
                    <p><span className="font-medium">Año cursando:</span> {beneficiarioData.añoCursando}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-green-800">Empleado UNIMET</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Padre/Madre:</span> {beneficiarioData.empleadoPadre.nombre}</p>
                    <p><span className="font-medium">Cargo:</span> {beneficiarioData.empleadoPadre.cargo}</p>
                    <p><span className="font-medium">Departamento:</span> {beneficiarioData.empleadoPadre.departamento}</p>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Estado:</span>
                      <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Progenitor ACTIVO en UNIMET ✅
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advertencia Importante */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-orange-800 font-medium">⚠️ IMPORTANTE: Beneficio vinculado al empleo</p>
                <p className="text-orange-700 text-sm">
                  Este beneficio está directamente vinculado al empleo de tu padre/madre en UNIMET. 
                  Si {beneficiarioData.empleadoPadre.nombre} deja de trabajar en la universidad, 
                  el beneficio de exoneración se pierde inmediatamente.
                </p>
              </div>
            </div>
          </div>

          {/* Compromisos y Requisitos */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Compromisos y Requisitos</span>
                  </CardTitle>
                  <CardDescription>
                    Seguimiento de cumplimiento de compromisos del beneficio
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{progresoCumplimiento.toFixed(0)}%</p>
                  <p className="text-sm text-muted-foreground">Cumplimiento</p>
                </div>
              </div>
              <Progress value={progresoCumplimiento} className="h-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {compromisos.map((compromiso, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border ${getEstadoColor(compromiso.estado)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          {getEstadoIcon(compromiso.estado)}
                          <h3 className="font-semibold">{compromiso.compromiso}</h3>
                        </div>
                        <p className="text-sm opacity-75 mt-1">{compromiso.descripcion}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-medium">Actual: {compromiso.valorActual}</span>
                          <span className="text-sm opacity-75">Requerido: {compromiso.requerido}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Información Importante */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Conceptos NO Cubiertos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Conceptos NO Cubiertos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="text-sm">Cuota de inscripción trimestral</span>
                    <span className="text-sm font-medium text-red-600">No cubierto</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="text-sm">Seguro estudiantil</span>
                    <span className="text-sm font-medium text-red-600">No cubierto</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="text-sm">Aranceles especiales</span>
                    <span className="text-sm font-medium text-red-600">No cubierto</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="text-sm">Asignaturas retiradas/reprobadas</span>
                    <span className="text-sm font-medium text-red-600">Debe pagar</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documentos y Recursos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Documentos y Recursos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Reglamento de Exoneración
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Certificado de Beneficiario
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Programar Tutoría Obligatoria
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Contactar DDBE
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ExoneracionStudent;