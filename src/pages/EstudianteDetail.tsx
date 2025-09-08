import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Mail, Phone, Calendar, FileText, GraduationCap, Download, Edit, Save, X } from "lucide-react";
import { useState } from "react";

const EstudianteDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    nombreCompleto: "María González Rodríguez",
    cedula: "V-27543123",
    correoElectronico: "maria.gonzalez@unimetro.edu.co",
    telefono: "+57 300 123 4567",
    fechaNacimiento: "1998-03-15",
    estadoCivil: "Soltera",
    tipoPostulante: "Estudiante regular de pregrado",
    carrera: "Ingeniería de Sistemas",
    trimestreActual: "6",
    iaa: "18.2",
    asignaturasAprobadas: "42",
    creditosInscritos: "18"
  });

  const handleEditarEstudiante = () => {
    setIsEditing(true);
  };

  const handleCancelarEdicion = () => {
    setIsEditing(false);
    // Resetear datos si fuera necesario
  };

  const handleGuardarCambios = () => {
    setIsEditing(false);
    // Aquí se guardarían los cambios en una app real
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  // Datos simulados del estudiante - en una app real, esto vendría de una API
  const estudianteData = {
    id: id,
    // Datos personales
    nombreCompleto: editData.nombreCompleto,
    cedula: editData.cedula,
    correoElectronico: editData.correoElectronico,
    telefono: editData.telefono,
    fechaNacimiento: editData.fechaNacimiento,
    estadoCivil: editData.estadoCivil,
    
    // Datos académicos
    tipoPostulante: editData.tipoPostulante,
    carrera: editData.carrera,
    trimestreActual: parseInt(editData.trimestreActual),
    iaa: parseFloat(editData.iaa),
    asignaturasAprobadas: parseInt(editData.asignaturasAprobadas),
    creditosInscritos: parseInt(editData.creditosInscritos),
    
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 mb-6">
            {!isEditing ? (
              <Button 
                onClick={handleEditarEstudiante}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar Información
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={handleCancelarEdicion}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button 
                  onClick={handleGuardarCambios}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            )}
          </div>

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
                    <Label className="text-sm text-muted-foreground">Nombre Completo</Label>
                    {isEditing ? (
                      <Input 
                        value={editData.nombreCompleto}
                        onChange={(e) => handleInputChange("nombreCompleto", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{estudianteData.nombreCompleto}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Cédula de Identidad</Label>
                    {isEditing ? (
                      <Input 
                        value={editData.cedula}
                        onChange={(e) => handleInputChange("cedula", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{estudianteData.cedula}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-sm text-muted-foreground">Correo Electrónico</Label>
                      {isEditing ? (
                        <Input 
                          value={editData.correoElectronico}
                          onChange={(e) => handleInputChange("correoElectronico", e.target.value)}
                          className="mt-1"
                          type="email"
                        />
                      ) : (
                        <p className="font-medium">{estudianteData.correoElectronico}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-sm text-muted-foreground">Teléfono</Label>
                      {isEditing ? (
                        <Input 
                          value={editData.telefono}
                          onChange={(e) => handleInputChange("telefono", e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="font-medium">{estudianteData.telefono}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-sm text-muted-foreground">Fecha de Nacimiento</Label>
                      {isEditing ? (
                        <Input 
                          value={editData.fechaNacimiento}
                          onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
                          className="mt-1"
                          type="date"
                        />
                      ) : (
                        <p className="font-medium">{new Date(estudianteData.fechaNacimiento).toLocaleDateString('es-ES')}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Estado Civil</Label>
                    {isEditing ? (
                      <Select value={editData.estadoCivil} onValueChange={(value) => handleInputChange("estadoCivil", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Soltero(a)">Soltero(a)</SelectItem>
                          <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                          <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                          <SelectItem value="Viudo(a)">Viudo(a)</SelectItem>
                          <SelectItem value="Unión Estable">Unión Estable</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="font-medium">{estudianteData.estadoCivil}</p>
                    )}
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
                    <Label className="text-sm text-muted-foreground">Tipo de Postulante</Label>
                    {isEditing ? (
                      <Select value={editData.tipoPostulante} onValueChange={(value) => handleInputChange("tipoPostulante", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Estudiante regular de pregrado">Estudiante regular de pregrado</SelectItem>
                          <SelectItem value="Estudiante regular de postgrado">Estudiante regular de postgrado</SelectItem>
                          <SelectItem value="Estudiante de nuevo ingreso">Estudiante de nuevo ingreso (bachiller)</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="font-medium">{estudianteData.tipoPostulante}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Carrera/Programa de estudios</Label>
                    {isEditing ? (
                      <Input 
                        value={editData.carrera}
                        onChange={(e) => handleInputChange("carrera", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{estudianteData.carrera}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Trimestre actual</Label>
                    {isEditing ? (
                      <Input 
                        value={editData.trimestreActual}
                        onChange={(e) => handleInputChange("trimestreActual", e.target.value)}
                        className="mt-1"
                        type="number"
                        min="1"
                        max="15"
                      />
                    ) : (
                      <p className="font-medium">{estudianteData.trimestreActual}°</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Índice Académico Acumulado (IAA)</Label>
                    {isEditing ? (
                      <Input 
                        value={editData.iaa}
                        onChange={(e) => handleInputChange("iaa", e.target.value)}
                        className="mt-1"
                        type="number"
                        step="0.1"
                        min="0"
                        max="20"
                      />
                    ) : (
                      <p className="font-medium text-primary text-lg">{estudianteData.iaa}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Asignaturas Aprobadas</Label>
                    {isEditing ? (
                      <Input 
                        value={editData.asignaturasAprobadas}
                        onChange={(e) => handleInputChange("asignaturasAprobadas", e.target.value)}
                        className="mt-1"
                        type="number"
                        min="0"
                      />
                    ) : (
                      <p className="font-medium">{estudianteData.asignaturasAprobadas}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Créditos Inscritos este Trimestre</Label>
                    {isEditing ? (
                      <Input 
                        value={editData.creditosInscritos}
                        onChange={(e) => handleInputChange("creditosInscritos", e.target.value)}
                        className="mt-1"
                        type="number"
                        min="0"
                      />
                    ) : (
                      <p className="font-medium">{estudianteData.creditosInscritos}</p>
                    )}
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