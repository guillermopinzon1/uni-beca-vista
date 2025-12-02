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
import { renovarBecario, RenovarBecarioData } from "@/lib/api/configuracion";
import {
  getLimiteTrimestres,
  formatTrimestresProgress,
  getWarningMessage,
  hasReachedLimit,
} from "@/lib/helpers/trimestreLimits";
import {
  AlertTriangle,
  CheckCircle,
  Loader2,
  X,
  RefreshCw,
  Info,
  TrendingUp,
} from "lucide-react";

interface BecarioToRenew {
  id: string;
  nombre: string;
  tipoBeca: string;
  trimestresCursados: number;
  estado: string;
  horasCompletadas: number;
  horasRequeridas: number;
}

interface RenovarBecarioModalProps {
  open: boolean;
  onClose: () => void;
  becario: BecarioToRenew | null;
  onSuccess?: () => void;
}

const RenovarBecarioModal = ({
  open,
  onClose,
  becario,
  onSuccess,
}: RenovarBecarioModalProps) => {
  const { toast } = useToast();
  const { tokens } = useAuth();
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<RenovarBecarioData | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(true);

  const handleRenovar = async () => {
    if (!becario || !tokens?.accessToken) {
      toast({
        title: "Error",
        description: "No se encontró información del becario o token de acceso",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await renovarBecario(tokens.accessToken, becario.id);

      setResultado(response.data);
      setShowConfirmation(false);

      toast({
        title: "Becario Renovado Exitosamente",
        description: `${becario.nombre} ha sido renovado para el trimestre ${response.data.trimestresCursados}`,
      });

      // Llamar callback de éxito después de un delay
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
        handleClose();
      }, 2500);
    } catch (error: any) {
      console.error('Error renovando becario:', error);
      toast({
        title: "Error al Renovar Becario",
        description: error.message || "No se pudo renovar el becario",
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

  if (!becario) {
    return null;
  }

  const limite = getLimiteTrimestres(becario.tipoBeca);
  const progresoActual = formatTrimestresProgress(becario.trimestresCursados, becario.tipoBeca);
  const progresoSiguiente = formatTrimestresProgress(becario.trimestresCursados + 1, becario.tipoBeca);
  const warningMessage = getWarningMessage(becario.trimestresCursados, becario.tipoBeca);
  const reachedLimit = hasReachedLimit(becario.trimestresCursados, becario.tipoBeca);
  const nearLimit = limite !== null && becario.trimestresCursados >= limite - 1;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        {showConfirmation ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <RefreshCw className="h-6 w-6 text-primary" />
                Renovar Becario
              </DialogTitle>
              <DialogDescription className="text-base">
                Renovar a {becario.nombre} para el siguiente trimestre académico
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Información del becario */}
              <div className="border border-muted rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nombre</p>
                    <p className="font-semibold">{becario.nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo de Beca</p>
                    <Badge variant="outline" className="mt-1">{becario.tipoBeca}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estado Actual</p>
                    <Badge
                      variant="outline"
                      className={`mt-1 ${
                        becario.estado === 'Culminada'
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}
                    >
                      {becario.estado}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Horas Completadas</p>
                    <p className="font-semibold">
                      {becario.horasCompletadas} / {becario.horasRequeridas}
                      {becario.horasCompletadas >= becario.horasRequeridas && (
                        <CheckCircle className="inline h-4 w-4 ml-1 text-green-600" />
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progreso de trimestres */}
              <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Progreso de Trimestres</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg border">
                    <p className="text-sm text-muted-foreground mb-1">Trimestre Actual</p>
                    <p className="text-2xl font-bold text-primary">{progresoActual}</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border border-green-200">
                    <p className="text-sm text-muted-foreground mb-1">Después de Renovar</p>
                    <p className="text-2xl font-bold text-green-600">{progresoSiguiente}</p>
                  </div>
                </div>

                {limite && (
                  <div className="mt-3 text-sm text-muted-foreground text-center">
                    Límite para {becario.tipoBeca}: {limite} trimestres
                  </div>
                )}
              </div>

              {/* Advertencias */}
              {reachedLimit && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <AlertDescription className="text-red-900">
                    <strong>No se puede renovar:</strong> El becario ha alcanzado el límite de {limite} trimestres para {becario.tipoBeca}.
                  </AlertDescription>
                </Alert>
              )}

              {!reachedLimit && nearLimit && warningMessage && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <AlertDescription className="text-yellow-900">
                    <strong>Advertencia:</strong> {warningMessage}
                  </AlertDescription>
                </Alert>
              )}

              {!reachedLimit && becario.estado === 'Incompleta' && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <Info className="h-5 w-5 text-yellow-600" />
                  <AlertDescription className="text-yellow-900">
                    <strong>Becario con estado Incompleta:</strong> No completó las horas requeridas en el trimestre anterior.
                    Verifique que sea apropiado renovar.
                  </AlertDescription>
                </Alert>
              )}

              {/* Información de lo que sucederá */}
              <div className="border border-muted rounded-lg p-4">
                <h3 className="font-semibold mb-2">Al renovar, el sistema:</h3>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Incrementará el contador de trimestres cursados de {becario.trimestresCursados} a {becario.trimestresCursados + 1}</li>
                  <li>Reseteará las horas completadas a 0</li>
                  <li>Cambiará el estado a "Activa"</li>
                  <li>Actualizará el período de inicio al período activo</li>
                  <li>Mantendrá la plaza asignada (si existe en el nuevo período)</li>
                </ul>
              </div>
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
                onClick={handleRenovar}
                disabled={loading || reachedLimit}
                className="bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Renovando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Confirmar Renovación
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
                Becario Renovado Exitosamente
              </DialogTitle>
              <DialogDescription>
                {becario.nombre} ha sido renovado para el siguiente trimestre
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Resumen de resultados */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <div className="text-sm text-green-600 font-medium mb-1">Nuevo Trimestre</div>
                  <div className="text-2xl font-bold text-green-800">{resultado?.trimestresCursados}</div>
                </div>

                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <div className="text-sm text-blue-600 font-medium mb-1">Horas Completadas</div>
                  <div className="text-2xl font-bold text-blue-800">{resultado?.horasCompletadas}</div>
                </div>

                <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                  <div className="text-sm text-purple-600 font-medium mb-1">Nuevo Estado</div>
                  <div className="text-lg font-bold text-purple-800">{resultado?.estado}</div>
                </div>
              </div>

              {/* Información adicional */}
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-green-900">
                  <p className="font-medium mb-1">Renovación completada</p>
                  <p className="text-sm">
                    Período de inicio: {resultado?.periodoInicio || 'N/A'}
                  </p>
                </AlertDescription>
              </Alert>
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

export default RenovarBecarioModal;
