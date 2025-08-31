import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PostulacionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  // Mock data for a specific postulation
  const mockPostulacion = {
    id: parseInt(id || "1"),
    usuario: {
      nombre: "Juan Carlos",
      apellido: "Pérez González",
      cedula: "V-12345678",
      carnet: "20180001",
      email: "juan.perez@unimet.edu.ve",
      telefono: "+58-212-1234567"
    },
    programa_beca: {
      id: 1,
      nombre: "Beca Ayudantía",
      descripcion: "Programa de ayudantías académicas para estudiantes destacados",
      requisitos: {
        indice_academico_minimo: 12.0,
        creditos_minimos: 12,
        semestre_minimo: 3
      }
    },
    periodo_academico: "2025-1",
    estado: "pendiente",
    fecha_postulacion: "2025-01-15T10:30:00Z",
    fecha_evaluacion: null,
    indice_academico: 16.5,
    creditos_inscritos: 18,
    observaciones: null,
    created_at: "2025-01-15T10:30:00Z",
    updated_at: "2025-01-15T10:30:00Z"
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pendiente: { variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800" },
      en_evaluacion: { variant: "secondary" as const, className: "bg-blue-100 text-blue-800" },
      aprobada: { variant: "secondary" as const, className: "bg-green-100 text-green-800" },
      rechazada: { variant: "secondary" as const, className: "bg-red-100 text-red-800" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendiente;
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {status === "pendiente" && "Pendiente"}
        {status === "en_evaluacion" && "En Evaluación"}
        {status === "aprobada" && "Aprobada"}
        {status === "rechazada" && "Rechazada"}
      </Badge>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No disponible";
    return new Date(dateString).toLocaleDateString('es-VE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleApprove = () => {
    // Mock approval action
    toast({
      title: "Postulación Aprobada",
      description: "La postulación ha sido aprobada exitosamente.",
    });
  };

  const handleReject = () => {
    // Mock rejection action
    toast({
      title: "Postulación Rechazada",
      description: "La postulación ha sido rechazada.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-orange/20 bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground hover:text-primary" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Detalle de Postulación #{mockPostulacion.id}</h1>
              <p className="text-sm text-muted-foreground">Información completa de la postulación</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Data */}
            <Card>
              <CardHeader>
                <CardTitle>Datos Generales de la Postulación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Estado</label>
                    <div className="mt-1">
                      {getStatusBadge(mockPostulacion.estado)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Período Académico</label>
                    <p className="mt-1 text-foreground">{mockPostulacion.periodo_academico}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Fecha de Postulación</label>
                    <p className="mt-1 text-foreground">{formatDate(mockPostulacion.fecha_postulacion)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Fecha de Evaluación</label>
                    <p className="mt-1 text-foreground">{formatDate(mockPostulacion.fecha_evaluacion)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Índice Académico</label>
                    <p className="mt-1 text-foreground font-semibold">{mockPostulacion.indice_academico}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Créditos Inscritos</label>
                    <p className="mt-1 text-foreground">{mockPostulacion.creditos_inscritos}</p>
                  </div>
                </div>
                {mockPostulacion.observaciones && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Observaciones</label>
                    <p className="mt-1 text-foreground bg-muted/50 p-3 rounded-lg">{mockPostulacion.observaciones}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Student Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Estudiante</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
                    <p className="mt-1 text-foreground font-semibold">
                      {mockPostulacion.usuario.nombre} {mockPostulacion.usuario.apellido}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Cédula</label>
                    <p className="mt-1 text-foreground">{mockPostulacion.usuario.cedula}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Carnet</label>
                    <p className="mt-1 text-foreground">{mockPostulacion.usuario.carnet}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="mt-1 text-foreground">{mockPostulacion.usuario.email}</p>
                  </div>
                  {mockPostulacion.usuario.telefono && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                      <p className="mt-1 text-foreground">{mockPostulacion.usuario.telefono}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Program Information and Actions */}
          <div className="space-y-6">
            {/* Program Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información del Programa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nombre del Programa</label>
                  <p className="mt-1 text-foreground font-semibold">{mockPostulacion.programa_beca.nombre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Descripción</label>
                  <p className="mt-1 text-foreground">{mockPostulacion.programa_beca.descripcion}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Requisitos</label>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm text-foreground">• IA Mínimo: {mockPostulacion.programa_beca.requisitos.indice_academico_minimo}</p>
                    <p className="text-sm text-foreground">• Créditos Mínimos: {mockPostulacion.programa_beca.requisitos.creditos_minimos}</p>
                    <p className="text-sm text-foreground">• Semestre Mínimo: {mockPostulacion.programa_beca.requisitos.semestre_minimo}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin Actions */}
            {mockPostulacion.estado === "pendiente" && (
              <Card>
                <CardHeader>
                  <CardTitle>Acciones de Administrador</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handleApprove}
                    className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Aprobar Postulación
                  </Button>
                  <Button
                    onClick={handleReject}
                    variant="destructive"
                    className="w-full flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Rechazar Postulación
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="w-full"
                >
                  Volver al Listado
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostulacionDetail;