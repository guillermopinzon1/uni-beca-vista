import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Clock, Calendar, Plus, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReporteHoras {
  id: string;
  fecha: string;
  horas: number;
  descripcion: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  notas?: string;
}

const MisHoras = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fecha, setFecha] = useState("");
  const [horas, setHoras] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Datos dummy del estudiante
  const [reportes, setReportes] = useState<ReporteHoras[]>([
    {
      id: "r1",
      fecha: "2024-01-15",
      horas: 8,
      descripcion: "Apoyo en clases de laboratorio de química",
      estado: "pendiente"
    },
    {
      id: "r2",
      fecha: "2024-01-08",
      horas: 6,
      descripcion: "Preparación de material didáctico",
      estado: "aprobado"
    },
    {
      id: "r3",
      fecha: "2024-01-01",
      horas: 4,
      descripcion: "Tutorías a estudiantes de primer año",
      estado: "rechazado",
      notas: "Falta documentación de las actividades realizadas"
    }
  ]);

  const horasAprobadas = reportes.filter(r => r.estado === 'aprobado').reduce((sum, r) => sum + r.horas, 0);
  const horasPendientes = reportes.filter(r => r.estado === 'pendiente').reduce((sum, r) => sum + r.horas, 0);
  const horasRechazadas = reportes.filter(r => r.estado === 'rechazado').reduce((sum, r) => sum + r.horas, 0);

  const handleSubmitHoras = () => {
    if (!fecha || !horas || !descripcion) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive"
      });
      return;
    }

    const nuevoReporte: ReporteHoras = {
      id: `r${reportes.length + 1}`,
      fecha,
      horas: parseFloat(horas),
      descripcion,
      estado: "pendiente"
    };

    setReportes([nuevoReporte, ...reportes]);
    
    toast({
      title: "Horas registradas",
      description: "Tu reporte de horas ha sido enviado para aprobación.",
    });

    // Limpiar formulario
    setFecha("");
    setHoras("");
    setDescripcion("");
    setIsModalOpen(false);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'aprobado':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprobado
          </Badge>
        );
      case 'rechazado':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rechazado
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Mis Horas</h2>
          <p className="text-muted-foreground">Gestiona y reporta tus horas de ayudantía</p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Reportar Horas
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-primary">Nuevo Reporte de Horas</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="horas">Horas trabajadas</Label>
                <Input
                  id="horas"
                  type="number"
                  min="0.5"
                  step="0.5"
                  placeholder="Ej: 4"
                  value={horas}
                  onChange={(e) => setHoras(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción de actividades</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe las actividades realizadas..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="min-h-24"
                />
              </div>
              <Button 
                onClick={handleSubmitHoras}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                Enviar Reporte
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumen de horas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-green-200 bg-green-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-800">Horas Aprobadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-green-900">{horasAprobadas}</span>
              <span className="text-sm text-green-700">horas</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-yellow-200 bg-yellow-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-800">Horas Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-yellow-900">{horasPendientes}</span>
              <span className="text-sm text-yellow-700">horas</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-red-200 bg-red-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-800">Horas Rechazadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-red-900">{horasRechazadas}</span>
              <span className="text-sm text-red-700">horas</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de reportes */}
      <Card className="border border-orange/20">
        <CardHeader className="bg-orange/5">
          <CardTitle className="text-primary">Historial de Reportes</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {reportes.map((reporte) => (
              <div 
                key={reporte.id} 
                className="border border-orange/20 rounded-lg p-4 space-y-3 hover:bg-orange/5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(reporte.fecha).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-medium">{reporte.horas} {reporte.horas === 1 ? 'hora' : 'horas'}</span>
                    </div>
                  </div>
                  {getEstadoBadge(reporte.estado)}
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Actividades realizadas:</p>
                  <p className="text-sm">{reporte.descripcion}</p>
                </div>

                {reporte.notas && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-800 font-medium mb-1">Observaciones del supervisor:</p>
                    <p className="text-sm text-red-700">{reporte.notas}</p>
                  </div>
                )}
              </div>
            ))}

            {reportes.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg mb-2">No tienes reportes de horas</p>
                <p className="text-sm">Comienza reportando tus primeras horas de ayudantía</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MisHoras;
