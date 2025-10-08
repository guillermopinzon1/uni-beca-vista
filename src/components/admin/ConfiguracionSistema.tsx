import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, Eye, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE } from "@/lib/api";

interface DocumentoReglamento {
  id: string;
  tipo: string;
  fileName?: string;
  uploadedAt?: string;
}

const TIPOS_BECAS = [
  { id: "excelencia", label: "Beca de Excelencia" },
  { id: "impacto", label: "Beca de Impacto Social" },
  { id: "exoneracion", label: "Exoneración de Capital Humano" },
  { id: "ayudantias", label: "Programa de Ayudantías" },
];

const ConfiguracionSistema = () => {
  const { toast } = useToast();
  const { tokens } = useAuth();
  const [documentos, setDocumentos] = useState<DocumentoReglamento[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    // Cargar documentos existentes desde localStorage temporalmente
    const stored = localStorage.getItem('reglamentos_documentos');
    if (stored) {
      try {
        setDocumentos(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading documents', e);
      }
    }
  }, []);

  const handleUpload = async (tipo: string, file: File) => {
    if (!file) return;

    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;
    if (!accessToken) {
      toast({
        title: "Error",
        description: "No se encontró token de autenticación",
        variant: "destructive",
      });
      return;
    }

    setUploading(tipo);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tipoDocumento', `reglamento_${tipo}`);
      formData.append('notas', `Reglamento para ${TIPOS_BECAS.find(b => b.id === tipo)?.label}`);

      const response = await fetch(`${API_BASE}/v1/documents/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir el documento');
      }

      const data = await response.json();
      
      // Actualizar estado local
      const nuevoDoc: DocumentoReglamento = {
        id: data.data?.id || data.id || Math.random().toString(),
        tipo,
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
      };

      const nuevosDocumentos = documentos.filter(d => d.tipo !== tipo).concat(nuevoDoc);
      setDocumentos(nuevosDocumentos);
      localStorage.setItem('reglamentos_documentos', JSON.stringify(nuevosDocumentos));

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
      setUploading(null);
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
      const response = await fetch(`${API_BASE}/v1/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el documento');
      }

      const nuevosDocumentos = documentos.filter(d => d.id !== documentId);
      setDocumentos(nuevosDocumentos);
      localStorage.setItem('reglamentos_documentos', JSON.stringify(nuevosDocumentos));

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

  const getDocumentoForTipo = (tipo: string) => {
    return documentos.find(d => d.tipo === tipo);
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
            {TIPOS_BECAS.map((beca) => {
              const documento = getDocumentoForTipo(beca.id);
              const isUploading = uploading === beca.id;
              const isLoadingView = loading === documento?.id;

              return (
                <div key={beca.id} className="border border-orange/20 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">{beca.label}</h3>
                    {documento && (
                      <span className="text-xs text-muted-foreground">
                        Subido: {new Date(documento.uploadedAt || '').toLocaleDateString('es-ES')}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`file-${beca.id}`}>Reglamento a Mostrar</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`file-${beca.id}`}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          disabled={isUploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleUpload(beca.id, file);
                            }
                          }}
                          className="flex-1"
                        />
                        {isUploading && (
                          <Button disabled size="icon" variant="outline">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </Button>
                        )}
                      </div>
                      {documento && (
                        <p className="text-sm text-muted-foreground">
                          Archivo actual: <span className="text-foreground font-medium">{documento.fileName}</span>
                        </p>
                      )}
                    </div>

                    {documento && (
                      <div className="space-y-2">
                        <Label>Acciones</Label>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(documento.id)}
                            disabled={isLoadingView}
                            className="flex-1"
                          >
                            {isLoadingView ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Eye className="h-4 w-4 mr-2" />
                            )}
                            Ver Archivo
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(documento.id, beca.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfiguracionSistema;
