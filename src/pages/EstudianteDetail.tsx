import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Mail, Phone, Calendar, FileText, GraduationCap, Download, Edit } from "lucide-react";

const EstudianteDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleEditarEstudiante = () => {
    // TODO: Implementar navegación a vista de edición o modal
    console.log("Editar estudiante:", id);
  };

  // Datos simulados del estudiante - en una app real, esto vendría de una API
  const estudianteData = {
    id: id,
    // Datos personales
    nombreCompleto: "María González Rodríguez",
    cedula: "V-27543123",
    correoElectronico: "maria.gonzalez@unimetro.edu.co",
    telefono: "+57 300 123 4567",
    fechaNacimiento: "1998-03-15",
    estadoCivil: "Soltera",
    
    // Datos académicos
    tipoPostulante: "Estudiante regular de pregrado",
    carrera: "Ingeniería de Sistemas",
    trimestreActual: 6,
    iaa: 18.2,
    asignaturasAprobadas: 42,
    creditosInscritos: 18,
    
    // Datos de la beca
    tipoBeca: "Excelencia Académica",
    estadoPostulacion: "Aprobada",
    fechaPostulacion: "2024-01-15",
    
    // Documentos
    documentos: [
      { nombre: "Fotocopia de Cédula de Identidad", estado: "Aprobado" },
      { nombre: "Flujograma de carrera", estado: "Aprobado" },
      { nombre: "Histórico de notas", estado: "Aprobado" },
      { nombre: "Plan de carrera avalado", estado: "Aprobado" },
      { nombre: "Currículum deportivo", estado: "No aplica" }
    ],

    // Información adicional
    observaciones: "Estudiante ejemplar con excelente rendimiento académico y participación en actividades extracurriculares."
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Aprobada':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Aprobada</Badge>;
      case 'En Revisión':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">En Revisión</Badge>;
      case 'Rechazada':
        return <Badge variant="destructive">Rechazada</Badge>;
      default:
        return <Badge variant="secondary">Pendiente</Badge>;
    }
  };

  const getDocumentoBadge = (estado: string) => {
    switch (estado) {
      case 'Aprobado':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Aprobado</Badge>;
      case 'Rechazado':
        return <Badge variant="destructive">Rechazado</Badge>;
      case 'No aplica':
        return <Badge variant="secondary">No aplica</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-orange/20 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin-dashboard")}
              className="text-primary hover:text-primary/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Detalles del Estudiante</h1>
              <p className="text-sm text-muted-foreground">
                Inicio &gt; Admin Dashboard &gt; Estudiantes Becarios &gt; Detalles
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-primary">María González</p>
              <p className="text-xs text-muted-foreground">Administrador</p>
            </div>
            <Button 
              onClick={handleEditarEstudiante}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar Estudiante
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Resumen del Estudiante */}
          <Card className="border-orange/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <User className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl text-primary">{estudianteData.nombreCompleto}</CardTitle>
                </div>
                {getEstadoBadge(estudianteData.estadoPostulacion)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Beca</p>
                  <p className="font-medium">{estudianteData.tipoBeca}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Postulación</p>
                  <p className="font-medium">{new Date(estudianteData.fechaPostulacion).toLocaleDateString('es-ES')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">IAA</p>
                  <p className="font-medium text-primary">{estudianteData.iaa}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Datos Personales */}
            <Card className="border-orange/20">
              <CardHeader>
                <CardTitle className="text-lg text-primary flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Datos Personales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Nombre Completo</p>
                    <p className="font-medium">{estudianteData.nombreCompleto}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cédula de Identidad</p>
                    <p className="font-medium">{estudianteData.cedula}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Correo Electrónico</p>
                      <p className="font-medium">{estudianteData.correoElectronico}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium">{estudianteData.telefono}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
                      <p className="font-medium">{new Date(estudianteData.fechaNacimiento).toLocaleDateString('es-ES')}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estado Civil</p>
                    <p className="font-medium">{estudianteData.estadoCivil}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Datos Académicos */}
            <Card className="border-orange/20">
              <CardHeader>
                <CardTitle className="text-lg text-primary flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Datos Académicos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo de Postulante</p>
                    <p className="font-medium">{estudianteData.tipoPostulante}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Carrera/Programa de estudios</p>
                    <p className="font-medium">{estudianteData.carrera}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trimestre actual</p>
                    <p className="font-medium">{estudianteData.trimestreActual}°</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Índice Académico Acumulado (IAA)</p>
                    <p className="font-medium text-primary text-lg">{estudianteData.iaa}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Asignaturas Aprobadas</p>
                    <p className="font-medium">{estudianteData.asignaturasAprobadas}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Créditos Inscritos este Trimestre</p>
                    <p className="font-medium">{estudianteData.creditosInscritos}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Documentos */}
          <Card className="border-orange/20">
            <CardHeader>
              <CardTitle className="text-lg text-primary flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Documentos de la Postulación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {estudianteData.documentos.map((documento, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{documento.nombre}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getDocumentoBadge(documento.estado)}
                      {documento.estado === 'Aprobado' && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Observaciones */}
          {estudianteData.observaciones && (
            <Card className="border-orange/20">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Observaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{estudianteData.observaciones}</p>
              </CardContent>
            </Card>
          )}

        </div>
      </main>
    </div>
  );
};

export default EstudianteDetail;