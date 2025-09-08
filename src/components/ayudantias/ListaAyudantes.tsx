import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, Check, X, Clock, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Ayudante {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  trimestre: number;
  horasRegistradas: number;
  horasPendientes: number;
  reportesHoras: ReporteHoras[];
}

interface ReporteHoras {
  id: string;
  fecha: string;
  horas: number;
  descripcion: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  notas?: string;
}

const ayudantesDummy: Ayudante[] = [
  {
    id: "1",
    nombre: "María",
    apellido: "González",
    cedula: "27.543.123",
    trimestre: 6,
    horasRegistradas: 45,
    horasPendientes: 8,
    reportesHoras: [
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
    ]
  },
  {
    id: "2", 
    nombre: "Carlos",
    apellido: "Rodríguez",
    cedula: "29.876.456",
    trimestre: 5,
    horasRegistradas: 32,
    horasPendientes: 12,
    reportesHoras: [
      {
        id: "r4",
        fecha: "2024-01-12",
        horas: 12,
        descripcion: "Asistencia en investigación de física aplicada",
        estado: "pendiente"
      },
      {
        id: "r5",
        fecha: "2024-01-05",
        horas: 5,
        descripcion: "Organización de biblioteca departamental",
        estado: "aprobado"
      }
    ]
  },
  {
    id: "3",
    nombre: "Ana",
    apellido: "Martínez",
    cedula: "28.234.789",
    trimestre: 7,
    horasRegistradas: 67,
    horasPendientes: 5,
    reportesHoras: [
      {
        id: "r6",
        fecha: "2024-01-10",
        horas: 5,
        descripcion: "Apoyo en eventos académicos",
        estado: "pendiente"
      }
    ]
  },
  {
    id: "4",
    nombre: "Luis",
    apellido: "Hernández", 
    cedula: "26.987.321",
    trimestre: 8,
    horasRegistradas: 28,
    horasPendientes: 15,
    reportesHoras: [
      {
        id: "r7",
        fecha: "2024-01-14",
        horas: 15,
        descripcion: "Desarrollo de material multimedia para clases",
        estado: "pendiente"
      }
    ]
  },
  {
    id: "5",
    nombre: "Sofia",
    apellido: "López",
    cedula: "30.123.654",
    trimestre: 4,
    horasRegistradas: 41,
    horasPendientes: 7,
    reportesHoras: [
      {
        id: "r8",
        fecha: "2024-01-13",
        horas: 7,
        descripcion: "Monitoreo de estudiantes en prácticas",
        estado: "pendiente"
      }
    ]
  }
];

const ListaAyudantes = () => {
  const { toast } = useToast();
  const [selectedAyudante, setSelectedAyudante] = useState<Ayudante | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notas, setNotas] = useState("");

  const handleVerHoras = (ayudante: Ayudante) => {
    setSelectedAyudante(ayudante);
    setIsModalOpen(true);
    setNotas("");
  };

  const handleAprobarHoras = (reporteId: string) => {
    toast({
      title: "Horas aprobadas",
      description: "Las horas han sido aprobadas exitosamente.",
    });
    setIsModalOpen(false);
  };

  const handleRechazarHoras = (reporteId: string) => {
    if (!notas.trim()) {
      toast({
        title: "Error",
        description: "Debe proporcionar una nota para rechazar las horas.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Horas rechazadas",
      description: "Las horas han sido rechazadas con observaciones.",
    });
    setIsModalOpen(false);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'aprobado':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Aprobado</Badge>;
      case 'rechazado':
        return <Badge variant="destructive">Rechazado</Badge>;
      default:
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Lista de Ayudantes</h2>
          <p className="text-muted-foreground">Gestiona los estudiantes ayudantes y sus horas registradas</p>
        </div>
        <Badge variant="secondary" className="text-orange">
          {ayudantesDummy.length} ayudantes activos
        </Badge>
      </div>

      <Card className="border border-orange/20">
        <CardHeader className="bg-orange/5">
          <CardTitle className="text-primary">Estudiantes Ayudantes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-orange/20">
                <tr>
                  <th className="text-left p-4 font-semibold text-primary">Nombre</th>
                  <th className="text-left p-4 font-semibold text-primary">Apellido</th>
                  <th className="text-left p-4 font-semibold text-primary">Cédula</th>
                  <th className="text-center p-4 font-semibold text-primary">Trimestre</th>
                  <th className="text-center p-4 font-semibold text-primary">Horas Registradas</th>
                  <th className="text-center p-4 font-semibold text-primary">Horas Pendientes</th>
                  <th className="text-center p-4 font-semibold text-primary">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ayudantesDummy.map((ayudante, index) => (
                  <tr 
                    key={ayudante.id} 
                    className={`border-b border-orange/10 hover:bg-orange/5 transition-colors ${
                      index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                    }`}
                  >
                    <td className="p-4 text-primary font-medium">{ayudante.nombre}</td>
                    <td className="p-4 text-primary font-medium">{ayudante.apellido}</td>
                    <td className="p-4 text-muted-foreground">{ayudante.cedula}</td>
                    <td className="p-4 text-center">
                      <Badge variant="outline" className="border-primary/20 text-primary">
                        {ayudante.trimestre}°
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      <Badge variant="outline" className="border-orange/40 text-orange">
                        {ayudante.horasRegistradas}h
                      </Badge>
                    </td>
                    <td className="p-4 text-center">
                      {ayudante.horasPendientes > 0 ? (
                        <Badge variant="destructive" className="bg-orange/10 text-orange border-orange/40">
                          {ayudante.horasPendientes}h
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-muted-foreground">
                          0h
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerHoras(ayudante)}
                        className="border-orange/40 hover:bg-orange/10 hover:border-orange/60"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Horas
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal para ver y gestionar horas */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">
              Gestión de Horas - {selectedAyudante?.nombre} {selectedAyudante?.apellido}
            </DialogTitle>
          </DialogHeader>
          
          {selectedAyudante && (
            <div className="space-y-6">
              {/* Información del ayudante */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Cédula</p>
                  <p className="font-medium">{selectedAyudante.cedula}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trimestre</p>
                  <p className="font-medium">{selectedAyudante.trimestre}°</p>
                </div>
              </div>

              {/* Lista de reportes de horas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Reportes de Horas</h3>
                {selectedAyudante.reportesHoras.map((reporte) => (
                  <div key={reporte.id} className="border border-orange/20 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(reporte.fecha).toLocaleDateString('es-ES')}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="font-medium">{reporte.horas} horas</span>
                        </div>
                      </div>
                      {getEstadoBadge(reporte.estado)}
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Descripción de actividades:</p>
                      <p className="text-sm">{reporte.descripcion}</p>
                    </div>

                    {reporte.notas && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Notas del supervisor:</p>
                        <p className="text-sm bg-muted/50 p-2 rounded">{reporte.notas}</p>
                      </div>
                    )}

                    {reporte.estado === 'pendiente' && (
                      <div className="space-y-3">
                        <Separator />
                        <div className="space-y-3">
                          <Label htmlFor="notas">Notas (opcional para aprobación, requerido para rechazo)</Label>
                          <Textarea
                            id="notas"
                            placeholder="Escriba sus observaciones aquí..."
                            value={notas}
                            onChange={(e) => setNotas(e.target.value)}
                            className="min-h-20"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleAprobarHoras(reporte.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Aprobar Horas
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={() => handleRechazarHoras(reporte.id)}
                            className="flex-1"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Rechazar Horas
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {selectedAyudante.reportesHoras.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay reportes de horas registrados</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListaAyudantes;