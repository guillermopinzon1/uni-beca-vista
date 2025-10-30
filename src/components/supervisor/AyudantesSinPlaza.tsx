import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, AlertTriangle, RefreshCw, User, Eye } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { obtenerMisAyudantes, type EstudianteBecarioDetallado } from "@/lib/api/supervisor";

interface AyudantesSinPlazaProps {
  onSelectAyudante?: (ayudante: EstudianteBecarioDetallado) => void;
}

const AyudantesSinPlaza = ({ onSelectAyudante }: AyudantesSinPlazaProps) => {
  const { tokens } = useAuth();
  const { toast } = useToast();
  const [ayudantes, setAyudantes] = useState<EstudianteBecarioDetallado[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadAyudantes();
  }, []);

  const loadAyudantes = async () => {
    try {
      setLoading(true);
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      const response = await obtenerMisAyudantes(accessToken, { estado: 'Activa', limit: 100 });

      // Filtrar solo ayudantes sin plaza asignada
      const sinPlaza = response.data.ayudantes.filter(ayudante => !ayudante.plazaAsignada);
      setAyudantes(sinPlaza);
    } catch (error: any) {
      console.error('Error loading ayudantes sin plaza:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar los ayudantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAyudantes = ayudantes.filter(ayudante => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ayudante.usuario.nombre.toLowerCase().includes(searchLower) ||
      ayudante.usuario.apellido.toLowerCase().includes(searchLower) ||
      ayudante.usuario.email.toLowerCase().includes(searchLower) ||
      ayudante.usuario.cedula.toLowerCase().includes(searchLower)
    );
  });

  const getTipoBecaBadge = (tipo: string) => {
    const variants: Record<string, { className: string }> = {
      'Ayudantía': { className: 'bg-blue-100 text-blue-800 border-blue-200' },
      'Impacto': { className: 'bg-purple-100 text-purple-800 border-purple-200' },
      'Excelencia': { className: 'bg-orange-100 text-orange-800 border-orange-200' },
      'Exoneración de Pago': { className: 'bg-pink-100 text-pink-800 border-pink-200' },
    };
    const variant = variants[tipo] || { className: 'bg-gray-100 text-gray-800' };
    return <Badge variant="outline" className={variant.className}>{tipo}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mr-3" />
          <span className="text-muted-foreground">Cargando ayudantes sin plaza...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Ayudantes Sin Plaza Asignada
              <Badge variant="outline" className="ml-2 border-orange-300 text-orange-700">
                {ayudantes.length}
              </Badge>
            </CardTitle>
            <CardDescription>
              Estudiantes que requieren asignación de plaza
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadAyudantes}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        {/* Buscador */}
        <div className="flex items-center space-x-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, cédula o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {filteredAyudantes.length === 0 ? (
          <div className="text-center py-12">
            {searchTerm ? (
              <p className="text-muted-foreground">No se encontraron ayudantes con el criterio de búsqueda</p>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="p-4 bg-green-100 rounded-full">
                    <User className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <p className="font-medium text-green-800">¡Excelente!</p>
                <p className="text-muted-foreground">
                  Todos tus ayudantes tienen plaza asignada
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Alerta informativa */}
            <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-medium text-orange-900">Acción Requerida</p>
                  <p className="text-sm text-orange-700 mt-1">
                    Los siguientes estudiantes necesitan que se les asigne una plaza.
                    Contacta al administrador para realizar las asignaciones correspondientes.
                  </p>
                </div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Carrera</TableHead>
                  <TableHead>Tipo de Beca</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAyudantes.map((ayudante) => (
                  <TableRow key={ayudante.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {ayudante.usuario.nombre} {ayudante.usuario.apellido}
                        </p>
                        <p className="text-sm text-muted-foreground">{ayudante.usuario.email}</p>
                        <p className="text-xs text-muted-foreground">{ayudante.usuario.cedula}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{ayudante.usuario.carrera}</p>
                        <p className="text-sm text-muted-foreground">Trimestre {ayudante.usuario.trimestre}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getTipoBecaBadge(ayudante.tipoBeca)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{ayudante.periodoInicio}</p>
                        {ayudante.periodoFin && (
                          <p className="text-xs text-muted-foreground">Hasta: {ayudante.periodoFin}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectAyudante?.(ayudante)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AyudantesSinPlaza;
