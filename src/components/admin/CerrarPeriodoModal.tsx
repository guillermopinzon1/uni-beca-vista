import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { cerrarPeriodo, CerrarPeriodoData } from "@/lib/api/configuracion";
import {
  AlertTriangle,
  CheckCircle,
  Loader2,
  X,
  UserCheck,
  FileCheck,
  CalendarOff,
} from "lucide-react";

interface CerrarPeriodoModalProps {
  open: boolean;
  onClose: () => void;
  periodoActual: {
    periodoAcademico: string;
    becariosActivos: number;
  } | null;
  onSuccess?: () => void;
}

const CerrarPeriodoModal = ({
  open,
  onClose,
  periodoActual,
  onSuccess,
}: CerrarPeriodoModalProps) => {
  const { toast } = useToast();
  const { tokens } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<CerrarPeriodoData | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(true);

  const handleCerrarPeriodo = async () => {
    if (!tokens?.accessToken) {
      toast({
        title: "Error de Autenticación",
        description: "No se encontró token de acceso",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await cerrarPeriodo(tokens.accessToken, true);

      setResultado(response.data);
      setShowConfirmation(false);

      toast({
        title: "Período Cerrado Exitosamente",
        description: `${response.data.becariosActualizados} becarios evaluados, ${response.data.reportesAprobados} reportes aprobados`,
      });

      // Llamar callback de éxito después de un delay para que vean el resultado
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 3000);
    } catch (error: any) {
      console.error('Error cerrando período:', error);
      toast({
        title: "Error al Cerrar Período",
        description: error.message || "No se pudo cerrar el período académico",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowConfirmation(true);
    setResultado(null);
    onClose();
  };

  if (!periodoActual) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        {showConfirmation ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                Cerrar Período Académico {periodoActual.periodoAcademico}
              </DialogTitle>
              <DialogDescription className="text-base">
                Esta acción evaluará automáticamente a todos los becarios activos y NO es reversible.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Advertencia principal */}
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <AlertDescription className="text-orange-900">
                  <strong className="block mb-2">Esta acción NO es reversible</strong>
                  <p className="text-sm">
                    Una vez cerrado el período, no podrá revertir los cambios realizados automáticamente.
                  </p>
                </AlertDescription>
              </Alert>

              {/* Información de lo que sucederá */}
              <div className="border border-muted rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-lg mb-3">Lo que sucederá al cerrar:</h3>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserCheck className="h-4 w-4 text-blue-700" />
                  </div>
                  <div>
                    <p className="font-medium">Evaluación de Becarios</p>
                    <p className="text-sm text-muted-foreground">
                      Se evaluarán <Badge variant="outline" className="ml-1">{periodoActual.becariosActivos}</Badge> becarios activos:
                    </p>
                    <ul className="text-sm text-muted-foreground mt-1 ml-4 list-disc">
                      <li>Si completaron sus horas → Estado: <strong className="text-green-600">Culminada</strong></li>
                      <li>Si NO completaron sus horas → Estado: <strong className="text-yellow-600">Incompleta</strong></li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <FileCheck className="h-4 w-4 text-green-700" />
                  </div>
                  <div>
                    <p className="font-medium">Auto-aprobación de Reportes</p>
                    <p className="text-sm text-muted-foreground">
                      Todos los reportes pendientes del período serán aprobados automáticamente
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <CalendarOff className="h-4 w-4 text-red-700" />
                  </div>
                  <div>
                    <p className="font-medium">Deshabilitación de Semanas</p>
                    <p className="text-sm text-muted-foreground">
                      Las semanas 1-12 serán deshabilitadas para el período cerrado
                    </p>
                  </div>
                </div>
              </div>

              {/* Mensaje final de confirmación */}
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-900 text-sm">
                  <strong>Confirme que desea continuar.</strong> Esta acción cerrará permanentemente el período {periodoActual.periodoAcademico}.
                </AlertDescription>
              </Alert>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                onClick={handleCerrarPeriodo}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Cerrando Período...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Confirmar Cierre
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl text-green-600">
                <CheckCircle className="h-6 w-6" />
                Período Cerrado Exitosamente
              </DialogTitle>
              <DialogDescription>
                El período {resultado?.periodoAcademico} ha sido cerrado correctamente
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Resumen de resultados */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <div className="text-sm text-green-600 font-medium mb-1">Período Cerrado</div>
                  <div className="text-2xl font-bold text-green-800">{resultado?.periodoAcademico}</div>
                </div>

                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="text-sm text-blue-600 font-medium mb-1">Becarios Evaluados</div>
                  <div className="text-2xl font-bold text-blue-800">{resultado?.becariosActualizados}</div>
                </div>

                <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                  <div className="text-sm text-purple-600 font-medium mb-1">Reportes Aprobados</div>
                  <div className="text-2xl font-bold text-purple-800">{resultado?.reportesAprobados}</div>
                </div>
              </div>

              {/* Información adicional */}
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-green-900">
                  <p className="font-medium mb-1">Cierre completado</p>
                  <p className="text-sm">
                    Fecha de cierre: {resultado?.fechaCierre ? new Date(resultado.fechaCierre).toLocaleString() : 'N/A'}
                  </p>
                </AlertDescription>
              </Alert>

              {/* Próximos pasos */}
              <div className="border border-muted rounded-lg p-4">
                <h3 className="font-semibold mb-2">Próximos Pasos:</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Los becarios con estado "Culminada" o "Incompleta" pueden ser renovados</li>
                  <li>Active un nuevo período académico para el siguiente trimestre</li>
                  <li>Revise la lista de becarios para gestionar renovaciones</li>
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleClose} className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Entendido
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CerrarPeriodoModal;
