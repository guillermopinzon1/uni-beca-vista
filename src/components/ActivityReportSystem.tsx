import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ActivityReportSystem = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    // Datos del estudiante
    nombresApellidos: "",
    correoUnimetro: "",
    nivel: "",
    facultad: "",
    planEstudios: "",
    
    // Datos del supervisor
    nombreSupervisor: "",
    correoSupervisor: "",
    plaza: "",
    
    // Objetivos y metas
    objetivoGeneral: "",
    meta1: "",
    descripcionAccion1: "",
    meta2: "",
    descripcionAccion2: "",
    meta3: "",
    descripcionAccion3: "",
    
    // Actividades por periodo
    actividadesAbril: "",
    actividadesMayo: "",
    actividadesJunio: "",
    
    // Reporte semanal
    actividadesSemana1: "",
    actividadesSemana2: "",
    actividadesSemana3: "",
    actividadesSemana4: "",
    
    // Observaciones
    observacionesAyudante: "",
    observacionesSupervisor: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Reporte de actividades enviado",
      description: "El reporte ha sido enviado exitosamente para revisión.",
    });
    setIsOpen(false);
    // Reset form
    setFormData({
      nombresApellidos: "",
      correoUnimetro: "",
      nivel: "",
      facultad: "",
      planEstudios: "",
      nombreSupervisor: "",
      correoSupervisor: "",
      plaza: "",
      objetivoGeneral: "",
      meta1: "",
      descripcionAccion1: "",
      meta2: "",
      descripcionAccion2: "",
      meta3: "",
      descripcionAccion3: "",
      actividadesAbril: "",
      actividadesMayo: "",
      actividadesJunio: "",
      actividadesSemana1: "",
      actividadesSemana2: "",
      actividadesSemana3: "",
      actividadesSemana4: "",
      observacionesAyudante: "",
      observacionesSupervisor: "",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="border-orange/20">
      <CardHeader>
        <CardTitle className="text-xl text-primary flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Sistema de Reporte de Actividades
        </CardTitle>
        <CardDescription>
          Completa el reporte detallado de tus actividades como ayudante
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Crear Nuevo Reporte
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Reporte de Actividades - Ayudantía</DialogTitle>
              <DialogDescription>
                Complete todos los campos requeridos para generar el reporte de actividades
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Datos del Estudiante */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Datos del Estudiante</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombresApellidos">Nombres y Apellidos</Label>
                    <Input
                      id="nombresApellidos"
                      value={formData.nombresApellidos}
                      onChange={(e) => handleInputChange("nombresApellidos", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="correoUnimetro">Correo Unimetro</Label>
                    <Input
                      id="correoUnimetro"
                      type="email"
                      value={formData.correoUnimetro}
                      onChange={(e) => handleInputChange("correoUnimetro", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nivel">Nivel</Label>
                    <Select value={formData.nivel} onValueChange={(value) => handleInputChange("nivel", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pregrado">Pregrado</SelectItem>
                        <SelectItem value="posgrado">Posgrado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facultad">Facultad</Label>
                    <Input
                      id="facultad"
                      value={formData.facultad}
                      onChange={(e) => handleInputChange("facultad", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="planEstudios">Plan de Estudios</Label>
                    <Input
                      id="planEstudios"
                      value={formData.planEstudios}
                      onChange={(e) => handleInputChange("planEstudios", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Datos del Supervisor */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Datos del Supervisor</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombreSupervisor">Nombre Supervisor</Label>
                    <Input
                      id="nombreSupervisor"
                      value={formData.nombreSupervisor}
                      onChange={(e) => handleInputChange("nombreSupervisor", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="correoSupervisor">Correo Supervisor</Label>
                    <Input
                      id="correoSupervisor"
                      type="email"
                      value={formData.correoSupervisor}
                      onChange={(e) => handleInputChange("correoSupervisor", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plaza">Plaza</Label>
                    <Input
                      id="plaza"
                      value={formData.plaza}
                      onChange={(e) => handleInputChange("plaza", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Objetivos y Metas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Objetivos y Metas</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="objetivoGeneral">Objetivo General de la Ayudantía</Label>
                    <Textarea
                      id="objetivoGeneral"
                      value={formData.objetivoGeneral}
                      onChange={(e) => handleInputChange("objetivoGeneral", e.target.value)}
                      placeholder="Describe el objetivo general de tu ayudantía..."
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="meta1">Meta 1</Label>
                      <Input
                        id="meta1"
                        value={formData.meta1}
                        onChange={(e) => handleInputChange("meta1", e.target.value)}
                        placeholder="Meta específica 1"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descripcionAccion1">Descripción de la Acción 1</Label>
                      <Textarea
                        id="descripcionAccion1"
                        value={formData.descripcionAccion1}
                        onChange={(e) => handleInputChange("descripcionAccion1", e.target.value)}
                        placeholder="Describe las acciones para lograr la meta 1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="meta2">Meta 2</Label>
                      <Input
                        id="meta2"
                        value={formData.meta2}
                        onChange={(e) => handleInputChange("meta2", e.target.value)}
                        placeholder="Meta específica 2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descripcionAccion2">Descripción de la Acción 2</Label>
                      <Textarea
                        id="descripcionAccion2"
                        value={formData.descripcionAccion2}
                        onChange={(e) => handleInputChange("descripcionAccion2", e.target.value)}
                        placeholder="Describe las acciones para lograr la meta 2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="meta3">Meta 3</Label>
                      <Input
                        id="meta3"
                        value={formData.meta3}
                        onChange={(e) => handleInputChange("meta3", e.target.value)}
                        placeholder="Meta específica 3"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descripcionAccion3">Descripción de la Acción 3</Label>
                      <Textarea
                        id="descripcionAccion3"
                        value={formData.descripcionAccion3}
                        onChange={(e) => handleInputChange("descripcionAccion3", e.target.value)}
                        placeholder="Describe las acciones para lograr la meta 3"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actividades por Periodo */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Programación de Actividades por Periodo</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="actividadesAbril">Actividades Abril</Label>
                    <Textarea
                      id="actividadesAbril"
                      value={formData.actividadesAbril}
                      onChange={(e) => handleInputChange("actividadesAbril", e.target.value)}
                      placeholder="Actividades programadas para abril"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="actividadesMayo">Actividades Mayo</Label>
                    <Textarea
                      id="actividadesMayo"
                      value={formData.actividadesMayo}
                      onChange={(e) => handleInputChange("actividadesMayo", e.target.value)}
                      placeholder="Actividades programadas para mayo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="actividadesJunio">Actividades Junio</Label>
                    <Textarea
                      id="actividadesJunio"
                      value={formData.actividadesJunio}
                      onChange={(e) => handleInputChange("actividadesJunio", e.target.value)}
                      placeholder="Actividades programadas para junio"
                    />
                  </div>
                </div>
              </div>

              {/* Reporte Semanal */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Reporte Semanal de Actividades</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="actividadesSemana1">Actividades Semana 1</Label>
                    <Textarea
                      id="actividadesSemana1"
                      value={formData.actividadesSemana1}
                      onChange={(e) => handleInputChange("actividadesSemana1", e.target.value)}
                      placeholder="Actividades realizadas en la semana 1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="actividadesSemana2">Actividades Semana 2</Label>
                    <Textarea
                      id="actividadesSemana2"
                      value={formData.actividadesSemana2}
                      onChange={(e) => handleInputChange("actividadesSemana2", e.target.value)}
                      placeholder="Actividades realizadas en la semana 2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="actividadesSemana3">Actividades Semana 3</Label>
                    <Textarea
                      id="actividadesSemana3"
                      value={formData.actividadesSemana3}
                      onChange={(e) => handleInputChange("actividadesSemana3", e.target.value)}
                      placeholder="Actividades realizadas en la semana 3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="actividadesSemana4">Actividades Semana 4</Label>
                    <Textarea
                      id="actividadesSemana4"
                      value={formData.actividadesSemana4}
                      onChange={(e) => handleInputChange("actividadesSemana4", e.target.value)}
                      placeholder="Actividades realizadas en la semana 4"
                    />
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary">Observaciones</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="observacionesAyudante">Observaciones del Ayudante</Label>
                    <Textarea
                      id="observacionesAyudante"
                      value={formData.observacionesAyudante}
                      onChange={(e) => handleInputChange("observacionesAyudante", e.target.value)}
                      placeholder="Observaciones y comentarios del ayudante"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="observacionesSupervisor">Observaciones del Supervisor</Label>
                    <Textarea
                      id="observacionesSupervisor"
                      value={formData.observacionesSupervisor}
                      onChange={(e) => handleInputChange("observacionesSupervisor", e.target.value)}
                      placeholder="Observaciones y comentarios del supervisor"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-6">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-gradient-primary hover:opacity-90">
                  Enviar Reporte
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ActivityReportSystem;