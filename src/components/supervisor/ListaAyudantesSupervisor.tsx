import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye, RefreshCw, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { obtenerAyudantesDeSupervisor, listarReportesDeAyudante, type EstudianteBecarioDetallado } from "@/lib/api/supervisor";
import { API_BASE } from "@/lib/api";
import { formatTrimestresProgress, getTrimestresBadgeColor } from "@/lib/helpers/trimestreLimits";
import { Alert, AlertDescription } from "@/components/ui/alert";
interface ListaAyudantesSupervisorProps {
  supervisorId?: string; // Si no se pasa, se usa el usuario logueado
  onSelectAyudante?: (ayudante: EstudianteBecarioDetallado) => void;
}

const ListaAyudantesSupervisor = ({ supervisorId, onSelectAyudante }: ListaAyudantesSupervisorProps) => {
  const { user, tokens } = useAuth();
  const { toast } = useToast();
  const [ayudantes, setAyudantes] = useState<EstudianteBecarioDetallado[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [periodoActual, setPeriodoActual] = useState<string>('');
  const [horasPorPeriodo, setHorasPorPeriodo] = useState<Record<string, number>>({});
  const [plazasInfo, setPlazasInfo] = useState<any[]>([]);
  const [totalOcupadas, setTotalOcupadas] = useState<number>(0);

  // Determinar el ID del supervisor a usar
  const effectiveSupervisorId = supervisorId || user?.id;

  const loadPeriodoActual = async () => {
    try {
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) return;

      const response = await fetch(`${API_BASE}/v1/configuracion/periodo-actual`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.periodoAcademico) {
          setPeriodoActual(data.data.periodoAcademico);
          console.log('📅 [SUPERVISOR] Período académico actual:', data.data.periodoAcademico);
        }
      }
    } catch (error) {
      console.error('Error cargando período actual:', error);
    }
  };

  const loadAyudantes = async () => {
    if (!effectiveSupervisorId) {
      toast({
        title: "Error",
        description: "No se pudo identificar al supervisor",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      const response = await obtenerAyudantesDeSupervisor(accessToken, effectiveSupervisorId);
      const ayudantesData = response.data.ayudantes;

      // 🔍 DIAGNÓSTICO: Log completo de la respuesta
      console.log('📊 [DIAGNÓSTICO] Respuesta completa del endpoint:', response.data);
      console.log('📊 [DIAGNÓSTICO] Total de ayudantes recibidos:', response.data.total);
      console.log('📊 [DIAGNÓSTICO] Plazas del supervisor:', response.data.plazas);

      // Verificar si hay discrepancia entre plazas ocupadas y ayudantes
      if (response.data.plazas && response.data.plazas.length > 0) {
        const totalOcupadasCalc = response.data.plazas.reduce((sum: number, plaza: any) => sum + (plaza.ocupadas || 0), 0);
        const totalAyudantes = response.data.total || 0;

        setPlazasInfo(response.data.plazas);
        setTotalOcupadas(totalOcupadasCalc);

        if (totalOcupadasCalc > totalAyudantes) {
          console.warn(`⚠️ [DISCREPANCIA] Plazas indican ${totalOcupadasCalc} becarios ocupados, pero solo se recibieron ${totalAyudantes} ayudantes`);
          console.warn('⚠️ [DISCREPANCIA] Faltan:', totalOcupadasCalc - totalAyudantes, 'becarios');
          console.warn('⚠️ [DIAGNÓSTICO] Esto puede deberse a:');
          console.warn('   1. Becarios sin supervisorId asignado');
          console.warn('   2. Becarios con estado diferente a "Activa"');
          console.warn('   3. Becarios asignados a otro supervisor');

          toast({
            title: "Advertencia de Discrepancia",
            description: `Se esperaban ${totalOcupadasCalc} becarios pero solo se encontraron ${totalAyudantes}. Revisa la consola para más detalles.`,
            variant: "destructive",
          });
        }
      }

      // Log de cada ayudante recibido
      ayudantesData.forEach((ayudante: any, index: number) => {
        console.log(`📊 [AYUDANTE ${index + 1}]`, {
          nombre: `${ayudante.usuario.nombre} ${ayudante.usuario.apellido}`,
          estado: ayudante.estado,
          periodo: ayudante.periodoInicio,
          plaza: ayudante.plazaAsignada,
          supervisorId: ayudante.supervisorId || 'NO ASIGNADO'
        });
      });

      setAyudantes(ayudantesData);

      // Cargar horas del periodo actual para cada ayudante
      if (periodoActual) {
        const horasMap: Record<string, number> = {};

        for (const ayudante of ayudantesData) {
          try {
            const reportesResponse = await listarReportesDeAyudante(accessToken, ayudante.id, {
              periodoAcademico: periodoActual,
              limit: 100,
            });

            // Sumar solo las horas de reportes aprobados del periodo actual
            const horasPeriodo = reportesResponse.data.reportes
              .filter(r => r.estado === 'Aprobada' && r.periodoAcademico === periodoActual)
              .reduce((sum, r) => sum + (typeof r.horasTrabajadas === 'string' ? parseFloat(r.horasTrabajadas) : r.horasTrabajadas), 0);

            horasMap[ayudante.id] = horasPeriodo;
            console.log(`📊 [SUPERVISOR] Ayudante ${ayudante.usuario.nombre}: ${horasPeriodo}h en periodo ${periodoActual}`);
          } catch (error) {
            console.warn(`No se pudieron cargar reportes del ayudante ${ayudante.id}`, error);
            horasMap[ayudante.id] = 0;
          }
        }

        setHorasPorPeriodo(horasMap);
      }
    } catch (error: any) {
      console.error('Error loading ayudantes:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudieron cargar los ayudantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPeriodoActual();
  }, []);

  useEffect(() => {
    if (periodoActual) {
      loadAyudantes();
    }
  }, [effectiveSupervisorId, periodoActual]);

  const filteredAyudantes = ayudantes.filter(ayudante => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ayudante.usuario.nombre.toLowerCase().includes(searchLower) ||
      ayudante.usuario.apellido.toLowerCase().includes(searchLower) ||
      ayudante.usuario.email.toLowerCase().includes(searchLower) ||
      ayudante.usuario.cedula.toLowerCase().includes(searchLower) ||
      ayudante.plaza?.nombre.toLowerCase().includes(searchLower)
    );
  });

  const getEstadoBadge = (estado: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      'Activa': { className: 'bg-green-100 text-green-800 border-green-200', label: 'Activa' },
      'Suspendida': { className: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Suspendida' },
      'Culminada': { className: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Culminada' },
      'Cancelada': { className: 'bg-red-100 text-red-800 border-red-200', label: 'Cancelada' },
    };
    const variant = variants[estado] || { className: 'bg-gray-100 text-gray-800', label: estado };
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

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

  const calcularProgreso = (completadas: number, requeridas: number) => {
    if (requeridas === 0) return 0;
    return Math.min(Math.round((completadas / requeridas) * 100), 100);
  };

  const handleVerDetalle = (ayudante: EstudianteBecarioDetallado) => {
    if (onSelectAyudante) {
      onSelectAyudante(ayudante);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary mr-3" />
          <span className="text-muted-foreground">Cargando ayudantes...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="flex items-center gap-2">
            Mis Ayudantes Asignados
            <Badge variant="outline" className="ml-2">{ayudantes.length}</Badge>
          </CardTitle>
          <CardDescription className="mt-2">
            Lista de estudiantes becarios bajo tu supervisión
            {periodoActual && (
              <span className="block mt-1 text-sm font-medium text-primary">
                Mostrando horas del periodo: {periodoActual}
              </span>
            )}
          </CardDescription>
        </div>

        {/* Buscador */}
        <div className="flex items-center space-x-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, cédula, email o materia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Advertencia de Discrepancia */}
        {totalOcupadas > ayudantes.length && (
          <Alert className="mb-4 border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <AlertDescription className="text-yellow-900">
              <strong className="block mb-1">⚠️ Discrepancia Detectada</strong>
              <p className="text-sm mb-2">
                Las plazas indican <strong>{totalOcupadas} becarios</strong> ocupados, pero solo se muestran <strong>{ayudantes.length} ayudantes</strong>.
              </p>
              <p className="text-xs">
                <strong>Faltan {totalOcupadas - ayudantes.length} becarios.</strong> Esto puede deberse a que no tienen supervisor asignado o tienen un estado diferente a "Activa".
                Revisa la consola del navegador (F12) para ver detalles específicos.
              </p>
            </AlertDescription>
          </Alert>
        )}

        {filteredAyudantes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {searchTerm ? (
              <p>No se encontraron ayudantes con el criterio de búsqueda</p>
            ) : (
              <p>No tienes ayudantes asignados actualmente</p>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudiante</TableHead>
                <TableHead>Tipo de Beca</TableHead>
                <TableHead>Trimestres</TableHead>
                <TableHead>Horas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAyudantes.map((ayudante) => {
                // Usar las horas del periodo actual, no las horas totales acumuladas
                const horasCompletadasPeriodo = horasPorPeriodo[ayudante.id] || 0;
                const horasRequeridas = Number(ayudante.horasRequeridas) || 1;
                const progreso = calcularProgreso(horasCompletadasPeriodo, horasRequeridas);

                // Calcular trimestres
                const trimestresCursados = ayudante.trimestresCursados || 1;
                const progresoTrimestres = formatTrimestresProgress(trimestresCursados, ayudante.tipoBeca);
                const badgeColorTrimestres = getTrimestresBadgeColor(trimestresCursados, ayudante.tipoBeca);

                return (
                  <TableRow key={ayudante.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {ayudante.usuario.nombre} {ayudante.usuario.apellido}
                        </p>
                        <p className="text-sm text-muted-foreground">{ayudante.usuario.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {ayudante.usuario.cedula} • {ayudante.usuario.carrera}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getTipoBecaBadge(ayudante.tipoBeca)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={badgeColorTrimestres}>
                        {progresoTrimestres}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2 min-w-[120px]">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progreso:</span>
                          <span className="font-medium">{progreso}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              progreso >= 100 ? 'bg-green-500' : progreso >= 75 ? 'bg-blue-500' : 'bg-orange-500'
                            }`}
                            style={{ width: `${progreso}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{horasCompletadasPeriodo.toFixed(1)}h</span>
                          <span>/ {horasRequeridas}h</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getEstadoBadge(ayudante.estado)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVerDetalle(ayudante)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalle
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ListaAyudantesSupervisor;
