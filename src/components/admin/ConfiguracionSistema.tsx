import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, Eye, Trash2, Loader2, X, Calendar, Lock, Unlock, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE } from "@/lib/api";

interface DocumentoReglamento {
  id: string;
  tipo: string;
  fileName?: string;
  uploadedAt?: string;
}

interface SemanaHabilitada {
  semana: number;
  periodoAcademico: string;
  habilitada: boolean;
}

interface PeriodoAcademico {
  id: string;
  periodoAcademico: string;
  semanaActual: number;
  semanasHabilitadas: number[];
  fechaInicio: string;
  fechaFin: string;
  descripcion?: string;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ConfiguracionPeriodoActivo {
  periodoAcademico: string;
  semanaActual: number;
  semanasHabilitadas: number[];
  totalSemanasHabilitadas: number;
  fechaInicio: string;
  fechaFin: string;
}

// Simplificado a un solo reglamento
const REGLAMENTO_BECAS = {
  id: "reglamento",
  label: "Reglamento de Becas"
};

const ConfiguracionSistema = () => {
  const { toast } = useToast();
  const { tokens } = useAuth();
  const [documentos, setDocumentos] = useState<DocumentoReglamento[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Estados para gestión de semanas
  const [semanasHabilitadas, setSemanasHabilitadas] = useState<SemanaHabilitada[]>([]);
  const [periodosAcademicos, setPeriodosAcademicos] = useState<PeriodoAcademico[]>([]);
  const [configuracionPeriodoActivo, setConfiguracionPeriodoActivo] = useState<ConfiguracionPeriodoActivo | null>(null);
  const [semanaActual, setSemanaActual] = useState<number>(1);
  const [semanaSeleccionada, setSemanaSeleccionada] = useState<number>(1);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>("2025-1");
  const [loadingSemanas, setLoadingSemanas] = useState<boolean>(false);
  const [loadingConfig, setLoadingConfig] = useState<boolean>(false);
  const [loadingPeriodos, setLoadingPeriodos] = useState<boolean>(false);
  
  // Estados para crear período
  const [mostrarCrearPeriodo, setMostrarCrearPeriodo] = useState<boolean>(false);
  const [nuevoPeriodo, setNuevoPeriodo] = useState({
    periodoAcademico: "",
    semanaActual: 1,
    semanasHabilitadas: [1, 2, 3],
    fechaInicio: "",
    fechaFin: "",
    descripcion: "",
    activo: false
  });

  useEffect(() => {
    // Cargar documentos reales del backend
    loadDocuments();
    // Cargar configuración de semanas
    loadConfiguracionPeriodoActivo();
    loadPeriodosAcademicos();
  }, []);

  const loadDocuments = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;
    if (!accessToken) {
      console.log('No access token found');
      return;
    }

    try {
      console.log('Loading reglamentos from:', `${API_BASE}/v1/documents/sistema/tipo/reglamento`);
      
      // Usar el nuevo endpoint para documentos del sistema por tipo
      const response = await fetch(`${API_BASE}/v1/documents/sistema/tipo/reglamento`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.success && data.data) {
          // Hay un reglamento existente
          const reglamento: DocumentoReglamento = {
            id: data.data.id,
            tipo: 'reglamento',
            fileName: data.data.nombreOriginal,
            uploadedAt: data.data.fechaSubida,
          };
          setDocumentos([reglamento]);
          console.log('Reglamento cargado:', reglamento);
        } else {
          // No hay reglamento
          setDocumentos([]);
          console.log('No reglamento found in response');
        }
      } else if (response.status === 404) {
        // No existe reglamento del sistema
        setDocumentos([]);
        console.log('No reglamento found (404)');
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error loading reglamentos:', error);
      setDocumentos([]);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    // Limpiar el input file
    const fileInput = document.getElementById('reglamento-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo",
        variant: "destructive",
      });
      return;
    }

    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;
    if (!accessToken) {
      toast({
        title: "Error",
        description: "No se encontró token de autenticación",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('tipoDocumento', 'reglamento');
      formData.append('observaciones', 'Reglamento de Becas - Documento oficial');

      // Usar el nuevo endpoint específico para documentos del sistema
      const response = await fetch(`${API_BASE}/v1/documents/sistema/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        let errorMessage = errorData?.message || `Error al subir el documento (${response.status})`;
        
        // Manejar error específico de documento existente
        if (response.status === 409) {
          errorMessage = "Ya existe un reglamento del sistema. Elimínelo primero si desea reemplazarlo.";
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Actualizar estado local con el documento subido
      const nuevoDoc: DocumentoReglamento = {
        id: data.data?.id || data.id || Math.random().toString(),
        tipo: 'reglamento',
        fileName: selectedFile.name,
        uploadedAt: new Date().toISOString(),
      };

      // Reemplazar cualquier reglamento existente
      setDocumentos(prev => prev.filter(d => d.tipo !== 'reglamento').concat(nuevoDoc));

      // Limpiar archivo seleccionado
      setSelectedFile(null);
      handleClearFile();

      toast({
        title: "Éxito",
        description: "Reglamento subido correctamente",
      });
    } catch (error: any) {
      console.error('Error uploading:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo subir el documento",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleView = async (documentId: string) => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;
    if (!accessToken) {
      toast({
        title: "Error",
        description: "No se encontró token de autenticación",
        variant: "destructive",
      });
      return;
    }

    setLoading(documentId);

    try {
      const response = await fetch(`${API_BASE}/v1/documents/${documentId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener el documento');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error: any) {
      console.error('Error viewing:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo visualizar el documento",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (documentId: string, tipo: string) => {
    if (!confirm('¿Está seguro de eliminar este reglamento?')) return;

    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;
    if (!accessToken) {
      toast({
        title: "Error",
        description: "No se encontró token de autenticación",
        variant: "destructive",
      });
      return;
    }

    try {
      // Usar el nuevo endpoint específico para documentos del sistema
      const response = await fetch(`${API_BASE}/v1/documents/sistema/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || 'Error al eliminar el documento';
        throw new Error(errorMessage);
      }

      // Actualizar estado local removiendo el documento eliminado
      setDocumentos(prev => prev.filter(d => d.id !== documentId));

      toast({
        title: "Éxito",
        description: "Reglamento eliminado correctamente",
      });
    } catch (error: any) {
      console.error('Error deleting:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el documento",
        variant: "destructive",
      });
    }
  };

  const getReglamento = () => {
    return documentos.find(d => d.tipo === 'reglamento');
  };

  // Funciones para gestión de semanas y períodos
  const loadConfiguracionPeriodoActivo = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;
    if (!accessToken) return;

    setLoadingSemanas(true);
    try {
      const response = await fetch(`${API_BASE}/v1/configuracion/periodo-actual`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConfiguracionPeriodoActivo(data.data);
        setSemanaActual(data.data.semanaActual);
        
        // Convertir semanas habilitadas al formato esperado
        const semanasFormateadas = data.data.semanasHabilitadas.map((semana: number) => ({
          semana,
          periodoAcademico: data.data.periodoAcademico,
          habilitada: true
        }));
        setSemanasHabilitadas(semanasFormateadas);
      } else {
        const errorData = await response.json().catch(() => null);
        if (errorData?.message?.includes('período académico activo')) {
          // No hay período activo
          setConfiguracionPeriodoActivo(null);
          setSemanasHabilitadas([]);
        } else {
          throw new Error(errorData?.message || 'Error al cargar configuración del período');
        }
      }
    } catch (error: any) {
      console.error('Error loading configuración período activo:', error);
      setConfiguracionPeriodoActivo(null);
      setSemanasHabilitadas([]);
    } finally {
      setLoadingSemanas(false);
    }
  };

  const loadPeriodosAcademicos = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;
    if (!accessToken) return;

    setLoadingPeriodos(true);
    try {
      const response = await fetch(`${API_BASE}/v1/configuracion/periodos`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Períodos académicos response:', data);
        
        // Manejar diferentes estructuras de respuesta
        let periodos = [];
        if (data.data && Array.isArray(data.data)) {
          periodos = data.data;
        } else if (data.data && data.data.periodos && Array.isArray(data.data.periodos)) {
          periodos = data.data.periodos;
        } else if (Array.isArray(data)) {
          periodos = data;
        } else {
          console.warn('Estructura de respuesta inesperada:', data);
          periodos = [];
        }
        
        setPeriodosAcademicos(periodos);
      } else {
        console.error('Error loading períodos académicos:', response.status, response.statusText);
        setPeriodosAcademicos([]);
      }
    } catch (error) {
      console.error('Error loading períodos académicos:', error);
      setPeriodosAcademicos([]);
    } finally {
      setLoadingPeriodos(false);
    }
  };

  const cambiarSemanaActual = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;
    if (!accessToken) return;

    setLoadingConfig(true);
    try {
      const response = await fetch(`${API_BASE}/v1/configuracion/semana-actual`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ semana: semanaActual }),
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: `Semana actual cambiada a la semana ${semanaActual}`,
        });
      } else {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || 'Error al cambiar semana actual';
        
        if (errorMessage.includes('período académico activo')) {
          toast({
            title: "Error de Configuración",
            description: "No hay un período académico activo configurado. Configure primero un período académico activo en el sistema.",
            variant: "destructive",
          });
        } else {
          throw new Error(errorMessage);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo cambiar la semana actual",
        variant: "destructive",
      });
    } finally {
      setLoadingConfig(false);
    }
  };

  const habilitarSemana = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;
    if (!accessToken) return;

    setLoadingConfig(true);
    try {
      const response = await fetch(`${API_BASE}/v1/configuracion/habilitar-semana`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          semana: semanaSeleccionada, 
          periodoId: periodoSeleccionado 
        }),
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: `Semana ${semanaSeleccionada} habilitada exitosamente`,
        });
        loadConfiguracionPeriodoActivo();
      } else {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || 'Error al habilitar semana';
        
        if (errorMessage.includes('período académico activo')) {
          toast({
            title: "Error de Configuración",
            description: "No hay un período académico activo configurado. Configure primero un período académico activo en el sistema.",
            variant: "destructive",
          });
        } else {
          throw new Error(errorMessage);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo habilitar la semana",
        variant: "destructive",
      });
    } finally {
      setLoadingConfig(false);
    }
  };

  const deshabilitarSemana = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;
    if (!accessToken) return;

    setLoadingConfig(true);
    try {
      const response = await fetch(`${API_BASE}/v1/configuracion/deshabilitar-semana`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          semana: semanaSeleccionada, 
          periodoId: periodoSeleccionado 
        }),
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: `Semana ${semanaSeleccionada} deshabilitada exitosamente`,
        });
        loadConfiguracionPeriodoActivo();
      } else {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || 'Error al deshabilitar semana';
        
        if (errorMessage.includes('período académico activo')) {
          toast({
            title: "Error de Configuración",
            description: "No hay un período académico activo configurado. Configure primero un período académico activo en el sistema.",
            variant: "destructive",
          });
        } else {
          throw new Error(errorMessage);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo deshabilitar la semana",
        variant: "destructive",
      });
    } finally {
      setLoadingConfig(false);
    }
  };


  // Funciones para gestión de períodos académicos
  const crearPeriodoAcademico = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;
    if (!accessToken) return;

    setLoadingConfig(true);
    try {
      const response = await fetch(`${API_BASE}/v1/configuracion/periodos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoPeriodo),
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Período académico creado exitosamente",
        });
        setMostrarCrearPeriodo(false);
        setNuevoPeriodo({
          periodoAcademico: "",
          semanaActual: 1,
          semanasHabilitadas: [1, 2, 3],
          fechaInicio: "",
          fechaFin: "",
          descripcion: "",
          activo: false
        });
        loadPeriodosAcademicos();
      } else {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Error al crear período académico');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el período académico",
        variant: "destructive",
      });
    } finally {
      setLoadingConfig(false);
    }
  };

  const activarPeriodo = async (periodoId: string) => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;
    if (!accessToken) return;

    setLoadingConfig(true);
    try {
      const response = await fetch(`${API_BASE}/v1/configuracion/periodos/${periodoId}/activar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Período académico activado exitosamente",
        });
        loadPeriodosAcademicos();
        loadConfiguracionPeriodoActivo();
      } else {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Error al activar período académico');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo activar el período académico",
        variant: "destructive",
      });
    } finally {
      setLoadingConfig(false);
    }
  };

  const eliminarPeriodo = async (periodoId: string) => {
    if (!confirm('¿Está seguro de eliminar este período académico?')) return;

    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;
    if (!accessToken) return;

    setLoadingConfig(true);
    try {
      const response = await fetch(`${API_BASE}/v1/configuracion/periodos/${periodoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Período académico eliminado exitosamente",
        });
        loadPeriodosAcademicos();
        loadConfiguracionPeriodoActivo();
      } else {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Error al eliminar período académico');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el período académico",
        variant: "destructive",
      });
    } finally {
      setLoadingConfig(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Configuración del Sistema</h2>
        <p className="text-muted-foreground">
          Administración de reglamentos y configuraciones generales
        </p>
      </div>

      {/* Gestión de Semanas */}
      <Card className="bg-gradient-card border-orange/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Gestión de Semanas y Reportes
          </CardTitle>
          <CardDescription>
            Configure las semanas habilitadas para reportes y gestione el bloqueo/desbloqueo de reportes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Cambiar Semana Actual */}
            <div className="border border-orange/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Semana Actual del Período</h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <Label htmlFor="semana-actual">Semana Actual</Label>
                  <Input
                    id="semana-actual"
                    type="number"
                    min="1"
                    max="16"
                    value={semanaActual}
                    onChange={(e) => setSemanaActual(parseInt(e.target.value) || 1)}
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={cambiarSemanaActual}
                  disabled={loadingConfig}
                  className="mt-6"
                >
                  {loadingConfig ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Calendar className="h-4 w-4 mr-2" />
                  )}
                  Cambiar Semana Actual
                </Button>
              </div>
            </div>

            {/* Gestión de Semanas Específicas */}
            <div className="border border-orange/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Gestión de Semanas Específicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="semana-seleccionada">Semana</Label>
                  <Select value={semanaSeleccionada.toString()} onValueChange={(value) => setSemanaSeleccionada(parseInt(value))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 16 }, (_, i) => i + 1).map((semana) => (
                        <SelectItem key={semana} value={semana.toString()}>
                          Semana {semana}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="periodo-seleccionado">Período Académico</Label>
                  <Select value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(periodosAcademicos) && periodosAcademicos.map((periodo) => (
                        <SelectItem key={periodo.id} value={periodo.id}>
                          {periodo.periodoAcademico} {periodo.activo && "(Activo)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={habilitarSemana}
                  disabled={loadingConfig}
                  variant="outline"
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  <Unlock className="h-4 w-4 mr-2" />
                  Habilitar Semana
                </Button>
                <Button
                  onClick={deshabilitarSemana}
                  disabled={loadingConfig}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Deshabilitar Semana
                </Button>
                <Button
                  onClick={loadConfiguracionPeriodoActivo}
                  disabled={loadingSemanas}
                  variant="outline"
                  className="text-gray-600 border-gray-200 hover:bg-gray-50"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loadingSemanas ? 'animate-spin' : ''}`} />
                  Actualizar
                </Button>
              </div>
            </div>

            {/* Información del Período Activo */}
            {configuracionPeriodoActivo && (
              <div className="border border-orange/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-primary mb-4">Período Académico Activo</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Período</div>
                    <div className="text-lg font-semibold text-blue-800">{configuracionPeriodoActivo.periodoAcademico}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">Semana Actual</div>
                    <div className="text-lg font-semibold text-green-800">{configuracionPeriodoActivo.semanaActual}</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm text-purple-600 font-medium">Semanas Habilitadas</div>
                    <div className="text-lg font-semibold text-purple-800">{configuracionPeriodoActivo.totalSemanasHabilitadas}</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p><strong>Fecha de Inicio:</strong> {new Date(configuracionPeriodoActivo.fechaInicio).toLocaleDateString()}</p>
                  <p><strong>Fecha de Fin:</strong> {new Date(configuracionPeriodoActivo.fechaFin).toLocaleDateString()}</p>
                </div>
              </div>
            )}

            {/* Estado de Semanas Habilitadas */}
            <div className="border border-orange/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Estado de Semanas Habilitadas</h3>
              {loadingSemanas ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2">Cargando semanas...</span>
                </div>
              ) : !configuracionPeriodoActivo ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">No hay período académico activo</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Cree y active un período académico para gestionar las semanas
                  </p>
                  <Button onClick={() => setMostrarCrearPeriodo(true)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Crear Período Académico
                  </Button>
                </div>
              ) : semanasHabilitadas.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">No hay semanas habilitadas</p>
                  <p className="text-sm text-muted-foreground">
                    Use los controles de arriba para habilitar semanas específicas
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {semanasHabilitadas.map((semana) => (
                    <div
                      key={`${semana.semana}-${semana.periodoAcademico}`}
                      className={`p-3 rounded-lg border text-center ${
                        semana.habilitada
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : 'bg-red-50 border-red-200 text-red-800'
                      }`}
                    >
                      <div className="font-semibold">Semana {semana.semana}</div>
                      <div className="text-xs">{semana.periodoAcademico}</div>
                      <div className="text-xs mt-1">
                        {semana.habilitada ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Habilitada
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            Deshabilitada
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gestión de Períodos Académicos */}
      <Card className="bg-gradient-card border-orange/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Gestión de Períodos Académicos
          </CardTitle>
          <CardDescription>
            Cree, active y gestione los períodos académicos del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Lista de Períodos */}
            <div className="border border-orange/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary">Períodos Académicos</h3>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setMostrarCrearPeriodo(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Crear Período
                  </Button>
                  <Button
                    onClick={loadPeriodosAcademicos}
                    disabled={loadingPeriodos}
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loadingPeriodos ? 'animate-spin' : ''}`} />
                    Actualizar
                  </Button>
                </div>
              </div>

              {loadingPeriodos ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2">Cargando períodos...</span>
                </div>
              ) : !Array.isArray(periodosAcademicos) || periodosAcademicos.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No hay períodos académicos</p>
                  <Button onClick={() => setMostrarCrearPeriodo(true)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Crear Primer Período
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {Array.isArray(periodosAcademicos) && periodosAcademicos.map((periodo) => (
                    <div
                      key={periodo.id}
                      className={`p-4 rounded-lg border ${
                        periodo.activo
                          ? 'bg-green-50 border-green-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">{periodo.periodoAcademico}</h4>
                            {periodo.activo && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Activo
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">Semana Actual:</span> {periodo.semanaActual}
                            </div>
                            <div>
                              <span className="font-medium">Semanas Habilitadas:</span> {periodo.semanasHabilitadas.length}
                            </div>
                            <div>
                              <span className="font-medium">Inicio:</span> {new Date(periodo.fechaInicio).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Fin:</span> {new Date(periodo.fechaFin).toLocaleDateString()}
                            </div>
                          </div>
                          {periodo.descripcion && (
                            <p className="text-sm text-muted-foreground mt-2">{periodo.descripcion}</p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          {!periodo.activo && (
                            <Button
                              onClick={() => activarPeriodo(periodo.id)}
                              disabled={loadingConfig}
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Activar
                            </Button>
                          )}
                          <Button
                            onClick={() => eliminarPeriodo(periodo.id)}
                            disabled={loadingConfig || periodo.activo}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal para Crear Período */}
            {mostrarCrearPeriodo && (
              <div className="border border-orange/20 rounded-lg p-6 bg-muted/50">
                <h3 className="text-lg font-semibold text-primary mb-4">Crear Nuevo Período Académico</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="periodo-academico">Período Académico</Label>
                    <Input
                      id="periodo-academico"
                      value={nuevoPeriodo.periodoAcademico}
                      onChange={(e) => setNuevoPeriodo({...nuevoPeriodo, periodoAcademico: e.target.value})}
                      placeholder="2025-1"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="semana-actual-nueva">Semana Actual</Label>
                    <Input
                      id="semana-actual-nueva"
                      type="number"
                      min="1"
                      max="16"
                      value={nuevoPeriodo.semanaActual}
                      onChange={(e) => setNuevoPeriodo({...nuevoPeriodo, semanaActual: parseInt(e.target.value) || 1})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fecha-inicio">Fecha de Inicio</Label>
                    <Input
                      id="fecha-inicio"
                      type="date"
                      value={nuevoPeriodo.fechaInicio}
                      onChange={(e) => setNuevoPeriodo({...nuevoPeriodo, fechaInicio: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fecha-fin">Fecha de Fin</Label>
                    <Input
                      id="fecha-fin"
                      type="date"
                      value={nuevoPeriodo.fechaFin}
                      onChange={(e) => setNuevoPeriodo({...nuevoPeriodo, fechaFin: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="descripcion">Descripción (Opcional)</Label>
                    <Input
                      id="descripcion"
                      value={nuevoPeriodo.descripcion}
                      onChange={(e) => setNuevoPeriodo({...nuevoPeriodo, descripcion: e.target.value})}
                      placeholder="Descripción del período académico"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={crearPeriodoAcademico}
                    disabled={loadingConfig || !nuevoPeriodo.periodoAcademico || !nuevoPeriodo.fechaInicio || !nuevoPeriodo.fechaFin}
                  >
                    {loadingConfig ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Calendar className="h-4 w-4 mr-2" />
                    )}
                    Crear Período
                  </Button>
                  <Button
                    onClick={() => setMostrarCrearPeriodo(false)}
                    variant="outline"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-orange/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Gestión de Reglamentos a Mostrar
          </CardTitle>
          <CardDescription>
            Suba los reglamentos oficiales para cada tipo de beca. Estos serán mostrados a los estudiantes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="border border-orange/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary">Reglamento de Becas</h3>
                  <p className="text-sm text-muted-foreground">
                    {getReglamento() ? 'Reglamento cargado' : 'Sin reglamento cargado'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getReglamento() && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <FileText className="h-3 w-3 mr-1" />
                      Cargado
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="reglamento-file">Seleccionar Archivo</Label>
                  <Input
                    id="reglamento-file"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Formatos permitidos: PDF, DOC, DOCX
                  </p>
                </div>

                {selectedFile && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{selectedFile.name}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearFile}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                       <div className="flex gap-2">
                         <Button
                           onClick={handleUpload}
                           disabled={!selectedFile || uploading}
                           className="flex-1"
                         >
                           {uploading ? (
                             <>
                               <Loader2 className="h-4 w-4 animate-spin mr-2" />
                               Subiendo...
                             </>
                           ) : (
                             <>
                               <Upload className="h-4 w-4 mr-2" />
                               Subir Documento
                             </>
                           )}
                         </Button>
                         <Button
                           variant="outline"
                           onClick={loadDocuments}
                           disabled={uploading}
                           title="Recargar reglamentos"
                         >
                           <Loader2 className="h-4 w-4" />
                         </Button>
                       </div>

                {getReglamento() && (
                  <div className="space-y-2">
                    <Label>Archivo Actual</Label>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{getReglamento()?.fileName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          {getReglamento()?.uploadedAt && new Date(getReglamento()!.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => getReglamento() && handleView(getReglamento()!.id)}
                        disabled={loading === getReglamento()?.id}
                        className="flex-1"
                      >
                        {loading === getReglamento()?.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Eye className="h-4 w-4 mr-2" />
                        )}
                        Ver Archivo
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => getReglamento() && handleDelete(getReglamento()!.id, 'reglamento')}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfiguracionSistema;
