import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface PostulacionCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostulacionCreateModal = ({ isOpen, onClose }: PostulacionCreateModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    programa_beca_id: "",
    periodo_academico: "",
    indice_academico: "",
    creditos_inscritos: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const programasBeca = [
    { id: 1, name: "Beca Ayudantía" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.programa_beca_id || !formData.periodo_academico || !formData.indice_academico || !formData.creditos_inscritos) {
      toast({
        title: "Error de Validación",
        description: "Todos los campos son requeridos.",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(formData.indice_academico) < 0 || parseFloat(formData.indice_academico) > 20) {
      toast({
        title: "Error de Validación",
        description: "El índice académico debe estar entre 0 y 20.",
        variant: "destructive",
      });
      return;
    }

    if (parseInt(formData.creditos_inscritos) < 1) {
      toast({
        title: "Error de Validación",
        description: "Los créditos inscritos deben ser mayor a 0.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call - simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Postulación Creada",
        description: "Tu postulación ha sido enviada exitosamente y está pendiente de evaluación.",
      });
      
      // Reset form
      setFormData({
        programa_beca_id: "",
        periodo_academico: "",
        indice_academico: "",
        creditos_inscritos: ""
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu postulación. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      programa_beca_id: "",
      periodo_academico: "",
      indice_academico: "",
      creditos_inscritos: ""
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-primary">Nueva Postulación de Beca</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Programa de Beca */}
            <div>
              <Label htmlFor="programa_beca_id">Programa de Beca *</Label>
              <Select
                value={formData.programa_beca_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, programa_beca_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un programa" />
                </SelectTrigger>
                <SelectContent>
                  {programasBeca.map((programa) => (
                    <SelectItem key={programa.id} value={programa.id.toString()}>
                      {programa.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Período Académico */}
            <div>
              <Label htmlFor="periodo_academico">Período Académico *</Label>
              <Input
                id="periodo_academico"
                type="text"
                placeholder="ej: 2025-1"
                value={formData.periodo_academico}
                onChange={(e) => setFormData(prev => ({ ...prev, periodo_academico: e.target.value }))}
                className="mt-1"
              />
            </div>

            {/* Índice Académico */}
            <div>
              <Label htmlFor="indice_academico">Índice Académico *</Label>
              <Input
                id="indice_academico"
                type="number"
                step="0.01"
                min="0"
                max="20"
                placeholder="ej: 16.5"
                value={formData.indice_academico}
                onChange={(e) => setFormData(prev => ({ ...prev, indice_academico: e.target.value }))}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Valor entre 0 y 20</p>
            </div>

            {/* Créditos Inscritos */}
            <div>
              <Label htmlFor="creditos_inscritos">Créditos Inscritos *</Label>
              <Input
                id="creditos_inscritos"
                type="number"
                min="1"
                placeholder="ej: 18"
                value={formData.creditos_inscritos}
                onChange={(e) => setFormData(prev => ({ ...prev, creditos_inscritos: e.target.value }))}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">Número de créditos que tienes inscritos en el período</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              {isSubmitting ? "Enviando..." : "Enviar Postulación"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};