import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, Eye, Trash2, Loader2, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE } from "@/lib/api";

interface DocumentoReglamento {
  id: string;
  tipo: string;
  fileName?: string;
  uploadedAt?: string;
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

  useEffect(() => {
    // Cargar documentos reales del backend
    loadDocuments();
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-primary mb-2">Configuración del Sistema</h2>
        <p className="text-muted-foreground">
          Administración de reglamentos y configuraciones generales
        </p>
      </div>

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
