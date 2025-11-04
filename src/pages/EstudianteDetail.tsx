import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Mail, Phone, Calendar, FileText, GraduationCap, Download, Edit, Save, X, Trash2, Info, CheckCircle, Clock, BookOpen, Award } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserById, API_BASE } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const EstudianteDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { tokens } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<null | {
    id: string;
    email: string;
    nombre: string;
    apellido?: string;
    cedula?: string;
    telefono?: string;
    role: string;
    carrera?: string | null;
    semestre?: number | null;
    activo: boolean;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  }>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [becario, setBecario] = useState<null | {
    id: string;
    tipoBeca: string;
    descuentoAplicado?: string;
    estado: string;
    periodoInicio?: string | null;
    periodoFin?: string | null;
    horasRequeridas?: number | null;
    horasCompletadas?: number | string | null;
    plaza?: { id: string; nombre?: string; ubicacion?: string } | null;
    observaciones?: string | null;
  }>(null);
  const [editData, setEditData] = useState({
    nombreCompleto: "María González Rodríguez",
    cedula: "V-27543123",
    correoElectronico: "maria.gonzalez@unimetro.edu.co",
    telefono: "+57 300 123 4567",
    fechaNacimiento: "1998-03-15",
    estadoCivil: "Soltera",
    tipoPostulante: "Estudiante regular de pregrado",
    carrera: "Ingeniería de Sistemas",
    trimestreActual: "6",
    iaa: "18.2",
    asignaturasAprobadas: "42",
    creditosInscritos: "18"
  });

  const handleEditarEstudiante = () => {
    // Cargar los datos actuales del estudiante en editData antes de editar
    const nombreCompleto = user ? `${user.nombre}${user.apellido ? ' ' + user.apellido : ''}` : '';
    setEditData({
      nombreCompleto: nombreCompleto,
      cedula: user?.cedula || '',
      correoElectronico: user?.email || '',
      telefono: user?.telefono || '',
      fechaNacimiento: editData.fechaNacimiento,
      estadoCivil: editData.estadoCivil,
      tipoPostulante: editData.tipoPostulante,
      carrera: user?.carrera || '',
      trimestreActual: user?.semestre ? String(user.semestre) : '',
      iaa: user?.iaa ? String(user.iaa) : '',
      asignaturasAprobadas: user?.asignaturasAprobadas ? String(user.asignaturasAprobadas) : '',
      creditosInscritos: editData.creditosInscritos
    });
    setIsEditing(true);
  };

  const handleCancelarEdicion = () => {
    setIsEditing(false);
    // Resetear datos si fuera necesario
  };

  const handleGuardarCambios = async () => {
    console.log('🔧 [GUARDAR] Iniciando guardado de cambios...');

    if (!id) {
      console.error('🔧 [GUARDAR] No hay ID de usuario');
      return;
    }

    const stored = (() => {
      try {
        return JSON.parse(localStorage.getItem('auth_tokens') || 'null');
      } catch {
        return null;
      }
    })();
    const accessToken = tokens?.accessToken || stored?.accessToken;

    if (!accessToken) {
      console.error('🔧 [GUARDAR] No hay token de acceso');
      toast({
        title: 'Error de autenticación',
        description: 'No se encontró token de acceso. Por favor, inicia sesión nuevamente.',
        variant: 'destructive',
      });
      return;
    }

    // Extraer nombre y apellido del nombreCompleto
    const nombreParts = editData.nombreCompleto.trim().split(' ');
    const nombre = nombreParts[0] || '';
    const apellido = nombreParts.slice(1).join(' ') || '';

    // Construir el body solo con campos que se pueden actualizar
    const updateData: any = {
      departamento: 'N/A',
      cargo: 'N/A'
    };

    if (nombre) updateData.nombre = nombre;
    if (apellido) updateData.apellido = apellido;
    // Cédula y correo NO se pueden editar, se omiten del request
    if (editData.telefono) updateData.telefono = editData.telefono;
    if (editData.carrera) updateData.carrera = editData.carrera;
    // Trimestre, IAA y asignaturas aprobadas se omiten (no se pueden editar desde esta vista)

    console.log('🔧 [GUARDAR] Datos a enviar:', updateData);
    console.log('🔧 [GUARDAR] URL:', `${API_BASE}/v1/users/${id}`);

    setIsSaving(true);
    try {
      console.log('🔧 [GUARDAR] Enviando request PUT...');

      const response = await fetch(`${API_BASE}/v1/users/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      console.log('🔧 [GUARDAR] Respuesta recibida:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('🔧 [GUARDAR] Error del servidor:', errorData);
        throw new Error(errorData?.message || `Error ${response.status}: No se pudo actualizar el usuario`);
      }

      const result = await response.json();
      console.log('🔧 [GUARDAR] Datos actualizados:', result);

      toast({
        title: 'Cambios guardados',
        description: 'La información del estudiante ha sido actualizada exitosamente.',
      });

      // Actualizar el estado del usuario con los nuevos datos
      if (result.data) {
        setUser(result.data);
        console.log('🔧 [GUARDAR] Usuario actualizado en el estado');
      }

      setIsEditing(false);
      console.log('🔧 [GUARDAR] Guardado completado exitosamente');
    } catch (e: any) {
      console.error('🔧 [GUARDAR] Error general:', e);
      toast({
        title: 'Error al guardar',
        description: e?.message || 'No se pudieron guardar los cambios. Intenta nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleDownloadDocument = async (documentId: string, nombreDocumento: string) => {
    const stored = (() => {
      try {
        return JSON.parse(localStorage.getItem('auth_tokens') || 'null');
      } catch {
        return null;
      }
    })();
    const accessToken = tokens?.accessToken || stored?.accessToken;

    if (!accessToken) {
      toast({
        title: 'Error de autenticación',
        description: 'No se encontró token de acceso. Por favor, inicia sesión nuevamente.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/v1/documents/${documentId}?download=true`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/pdf,application/octet-stream',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error ${response.status}: No se pudo descargar el documento`);
      }

      // Obtener el blob del archivo
      const blob = await response.blob();

      // Crear URL temporal para el blob
      const url = window.URL.createObjectURL(blob);

      // Crear elemento <a> temporal para descargar
      const a = document.createElement('a');
      a.href = url;
      a.download = nombreDocumento || 'documento.pdf';
      document.body.appendChild(a);
      a.click();

      // Limpiar
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Descarga exitosa',
        description: 'El documento se ha descargado correctamente.',
      });
    } catch (error: any) {
      console.error('Error al descargar documento:', error);
      toast({
        title: 'Error al descargar',
        description: error?.message || 'No se pudo descargar el documento. Intenta nuevamente.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async () => {
    if (!id) return;

    const stored = (() => {
      try {
        return JSON.parse(localStorage.getItem('auth_tokens') || 'null');
      } catch {
        return null;
      }
    })();
    const accessToken = tokens?.accessToken || stored?.accessToken;

    if (!accessToken) {
      toast({
        title: 'Error de autenticación',
        description: 'No se encontró token de acceso. Por favor, inicia sesión nuevamente.',
        variant: 'destructive',
      });
      return;
    }

    setIsTogglingStatus(true);
    try {
      const response = await fetch(`${API_BASE}/v1/users/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error ${response.status}: No se pudo cambiar el estado del usuario`);
      }

      const result = await response.json();

      // Actualizar el estado del usuario localmente
      if (user) {
        setUser({ ...user, activo: !user.activo });
      }

      toast({
        title: user?.activo ? 'Usuario desactivado' : 'Usuario activado',
        description: user?.activo
          ? 'El usuario ha sido desactivado exitosamente.'
          : 'El usuario ha sido activado exitosamente.',
      });
    } catch (e: any) {
      console.error('Error al cambiar estado del usuario:', e);
      toast({
        title: 'Error al cambiar estado',
        description: e?.message || 'No se pudo cambiar el estado del usuario. Intenta nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const handleEliminarUsuario = async () => {
    if (!id) return;

    const stored = (() => {
      try {
        return JSON.parse(localStorage.getItem('auth_tokens') || 'null');
      } catch {
        return null;
      }
    })();
    const accessToken = tokens?.accessToken || stored?.accessToken;

    if (!accessToken) {
      toast({
        title: 'Error de autenticación',
        description: 'No se encontró token de acceso. Por favor, inicia sesión nuevamente.',
        variant: 'destructive',
      });
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`${API_BASE}/v1/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error ${response.status}: No se pudo eliminar el usuario`);
      }

      toast({
        title: 'Usuario eliminado',
        description: 'El usuario ha sido desactivado exitosamente.',
      });

      // Redirigir al dashboard después de un breve delay
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 1500);
    } catch (e: any) {
      console.error('Error al eliminar usuario:', e);
      toast({
        title: 'Error al eliminar',
        description: e?.message || 'No se pudo eliminar el usuario. Intenta nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  useEffect(() => {
    const run = async () => {
      if (!id) return;
      const stored = (() => { try { return JSON.parse(localStorage.getItem('auth_tokens') || 'null'); } catch { return null; } })();
      const accessToken = tokens?.accessToken || stored?.accessToken;
      if (!accessToken) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetchUserById(accessToken, id);
        setUser(res.data);

        // Intentar cargar información de becario
        try {
          let detailResp = await fetch(`${API_BASE}/v1/becarios/${id}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
          });

          let payload: any = null;
          if (detailResp.ok) {
            payload = await detailResp.json();
          } else {
            // Fallback: listar y buscar por usuarioId
            const listResp = await fetch(`${API_BASE}/v1/becarios`, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`
              }
            });
            if (listResp.ok) {
              const listPayload = await listResp.json();
              const found = (listPayload?.data?.becarios || []).find((b: any) => b.usuarioId === id);
              if (found) payload = { data: found };
            }
          }

          if (payload?.data) {
            const b = payload.data;
            setBecario({
              id: b.id,
              tipoBeca: b.tipoBeca,
              descuentoAplicado: b.descuentoAplicado,
              estado: b.estado,
              periodoInicio: b.periodoInicio,
              periodoFin: b.periodoFin,
              horasRequeridas: b.horasRequeridas,
              horasCompletadas: b.horasCompletadas,
              plaza: b.plaza ? { id: b.plaza.id, nombre: b.plaza.nombre, ubicacion: b.plaza.ubicacion } : null,
              observaciones: b.observaciones
            });
          } else {
            setBecario(null);
          }
        } catch {
          setBecario(null);
        }
      } catch (e: any) {
        setError(e?.message || 'No se pudo cargar el usuario');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id, tokens?.accessToken]);

  const estudianteData = useMemo(() => {
    const nombreCompleto = user ? `${user.nombre}${user.apellido ? ' ' + user.apellido : ''}` : editData.nombreCompleto;
    return {
      id: id,
      // Datos personales
      nombreCompleto,
      cedula: user?.cedula || editData.cedula,
      correoElectronico: user?.email || editData.correoElectronico,
      telefono: user?.telefono || editData.telefono,
      fechaNacimiento: editData.fechaNacimiento, // no provisto por el endpoint
      estadoCivil: editData.estadoCivil, // no provisto por el endpoint
      
      // Datos académicos
      tipoPostulante: editData.tipoPostulante, // no provisto por el endpoint
      carrera: (user?.carrera as string) || editData.carrera,
      trimestreActual: typeof user?.semestre === 'number' ? user?.semestre : parseInt(editData.trimestreActual),
      iaa: parseFloat(editData.iaa), // no provisto por el endpoint
      asignaturasAprobadas: parseInt(editData.asignaturasAprobadas), // no provisto por el endpoint
      creditosInscritos: parseInt(editData.creditosInscritos), // no provisto por el endpoint
      
      // Datos de la beca
      tipoBeca: becario?.tipoBeca || "-",
      estadoPostulacion: user?.activo ? 'Aprobada' : 'Suspendida',
      fechaPostulacion: "2024-01-15",
      
      // Documentos (dinámicos desde postulaciones)
      documentos: (() => {
        const docs: Array<{ nombre: string; id: string; tipoDocumento: string; rutaArchivo: string }> = [];
        const u: any = user || {};

        // Extraer documentos de todas las postulaciones
        if (u.postulaciones && Array.isArray(u.postulaciones)) {
          u.postulaciones.forEach((postulacion: any) => {
            if (postulacion.documentosRelacionados && Array.isArray(postulacion.documentosRelacionados)) {
              postulacion.documentosRelacionados.forEach((doc: any) => {
                if (doc.activo) {
                  // Mapear nombre del tipo de documento a un nombre legible
                  const nombreLegible = (() => {
                    switch (doc.tipoDocumento) {
                      case 'cedula': return 'Fotocopia de Cédula de Identidad';
                      case 'historico_notas': return 'Histórico de Notas';
                      case 'flujograma_carrera': return 'Flujograma de Carrera';
                      case 'plan_carrera': return 'Plan de Carrera Avalado';
                      case 'curriculum_deportivo': return 'Currículum Deportivo';
                      default: return doc.nombreOriginal || 'Documento';
                    }
                  })();

                  docs.push({
                    nombre: nombreLegible,
                    id: doc.id,
                    tipoDocumento: doc.tipoDocumento,
                    rutaArchivo: doc.rutaArchivo
                  });
                }
              });
            }
          });
        }

        return docs;
      })(),
      
      // Información adicional (placeholder)
      observaciones: ""
    };
  }, [user, editData, id, becario]);

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Aprobada':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Aprobada</Badge>;
      case 'En Revisión':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">En Revisión</Badge>;
      case 'Rechazada':
        return <Badge variant="destructive">Rechazada</Badge>;
      default:
        return <Badge variant="secondary">Pendiente</Badge>;
    }
  };

  const getDocumentoBadge = (estado: string) => {
    switch (estado) {
      case 'Aprobado':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Aprobado</Badge>;
      case 'Rechazado':
        return <Badge variant="destructive">Rechazado</Badge>;
      case 'No aplica':
        return <Badge variant="secondary">No aplica</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-orange/20 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin-dashboard')}
              className="text-primary hover:text-primary/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Regresar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Detalles del Estudiante</h1>
              <p className="text-sm text-muted-foreground">
                Inicio &gt; Admin Dashboard &gt; Estudiantes Becarios &gt; Detalles
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-primary">María González</p>
              <p className="text-xs text-muted-foreground">Administrador</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 mb-6">
            {!isEditing ? (
              <>
                <Button
                  variant={user?.activo ? "outline" : "default"}
                  onClick={handleToggleStatus}
                  disabled={isTogglingStatus}
                  className={user?.activo ? "border-orange/40 hover:bg-orange/10 hover:border-orange/60" : "bg-green-600 hover:bg-green-700"}
                >
                  {isTogglingStatus ? (
                    <>Procesando...</>
                  ) : user?.activo ? (
                    <>Desactivar Usuario</>
                  ) : (
                    <>Activar Usuario</>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar Usuario
                </Button>
                <Button
                  onClick={handleEditarEstudiante}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Información
                </Button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleCancelarEdicion}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleGuardarCambios}
                  disabled={isSaving}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            )}
          </div>

          {/* Resumen del Estudiante (incluye info de beca) */}
          <Card className="border-orange/20 shadow-lg overflow-hidden">
            <div className="bg-white border-b-4 border-orange-500 px-6 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center border-2 border-orange-300 shadow-md">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{estudianteData.nombreCompleto}</h2>
                    <div className="mt-2">
                      <Badge variant="outline" className="border-2 border-orange-500 text-orange-700 font-semibold bg-white hover:bg-orange-50">
                        Estudiante Becario
                      </Badge>
                    </div>
                  </div>
                </div>
                {getEstadoBadge(estudianteData.estadoPostulacion)}
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">Tipo de Beca</p>
                    <p className="font-bold text-blue-900 mt-1">{estudianteData.tipoBeca}</p>
                  </div>
                </div>
                {becario && becario.descuentoAplicado && (
                  <div className="flex items-start space-x-3 p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200/50">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-green-600 font-semibold uppercase tracking-wide">Descuento Aplicado</p>
                      <p className="font-bold text-green-900 mt-1 text-xl">{parseFloat(becario.descuentoAplicado).toFixed(0)}%</p>
                    </div>
                  </div>
                )}
                {becario && (
                  <div className="flex items-start space-x-3 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200/50">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-purple-600 font-semibold uppercase tracking-wide">Estado</p>
                      <div className="mt-1">
                        <Badge className="bg-purple-600 hover:bg-purple-700">{becario.estado}</Badge>
                      </div>
                    </div>
                  </div>
                )}
                {becario && becario.tipoBeca === 'Ayudantía' && (
                  <>
                    <div className="flex items-start space-x-3 p-4 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/50">
                      <div className="p-2 bg-amber-500 rounded-lg">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide">Horas Requeridas</p>
                        <p className="font-bold text-amber-900 mt-1">{becario.horasRequeridas ?? '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 rounded-lg bg-gradient-to-br from-teal-50 to-teal-100/50 border border-teal-200/50">
                      <div className="p-2 bg-teal-500 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-teal-600 font-semibold uppercase tracking-wide">Horas Completadas</p>
                        <p className="font-bold text-teal-900 mt-1">{typeof becario.horasCompletadas === 'string' ? becario.horasCompletadas : (becario.horasCompletadas ?? '-')}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200/50">
                      <div className="p-2 bg-indigo-500 rounded-lg">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide">Plaza</p>
                        <p className="font-bold text-indigo-900 mt-1 text-sm">{becario.plaza?.nombre || '-'}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Datos Personales */}
            <Card className="border-orange/20 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-b border-orange-200/50">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-orange-900">Datos Personales</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-200">
                    <Label className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Nombre Completo</Label>
                    {isEditing ? (
                      <Input
                        value={editData.nombreCompleto}
                        onChange={(e) => handleInputChange("nombreCompleto", e.target.value)}
                        className="mt-2 border-orange-200 focus:border-orange-400"
                      />
                    ) : (
                      <p className="font-bold text-gray-900 mt-1">{estudianteData.nombreCompleto}</p>
                    )}
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-white border border-blue-200">
                    <Label className="text-xs text-blue-600 font-semibold uppercase tracking-wide">Cédula de Identidad</Label>
                    <p className="font-bold text-blue-900 mt-1">{estudianteData.cedula}</p>
                    <p className="text-xs text-blue-600/70 italic mt-1 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Este campo no se puede editar
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-white border border-purple-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="h-4 w-4 text-purple-600" />
                      <Label className="text-xs text-purple-600 font-semibold uppercase tracking-wide">Correo Electrónico</Label>
                    </div>
                    <p className="font-bold text-purple-900">{estudianteData.correoElectronico}</p>
                    <p className="text-xs text-purple-600/70 italic mt-1 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Este campo no se puede editar
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-white border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Phone className="h-4 w-4 text-green-600" />
                      <Label className="text-xs text-green-600 font-semibold uppercase tracking-wide">Teléfono</Label>
                    </div>
                    {isEditing ? (
                      <Input
                        value={editData.telefono}
                        onChange={(e) => handleInputChange("telefono", e.target.value)}
                        className="mt-2 border-green-200 focus:border-green-400"
                      />
                    ) : (
                      <p className="font-bold text-green-900">{estudianteData.telefono}</p>
                    )}
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-amber-50 to-white border border-amber-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-amber-600" />
                      <Label className="text-xs text-amber-600 font-semibold uppercase tracking-wide">Fecha de Nacimiento</Label>
                    </div>
                    {isEditing ? (
                      <Input
                        value={editData.fechaNacimiento}
                        onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
                        className="mt-2 border-amber-200 focus:border-amber-400"
                        type="date"
                      />
                    ) : (
                      <p className="font-bold text-amber-900">{new Date(estudianteData.fechaNacimiento).toLocaleDateString('es-ES')}</p>
                    )}
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-pink-50 to-white border border-pink-200">
                    <Label className="text-xs text-pink-600 font-semibold uppercase tracking-wide">Estado Civil</Label>
                    {isEditing ? (
                      <Select value={editData.estadoCivil} onValueChange={(value) => handleInputChange("estadoCivil", value)}>
                        <SelectTrigger className="mt-2 border-pink-200 focus:border-pink-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Soltero(a)">Soltero(a)</SelectItem>
                          <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                          <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                          <SelectItem value="Viudo(a)">Viudo(a)</SelectItem>
                          <SelectItem value="Unión Estable">Unión Estable</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="font-bold text-pink-900 mt-1">{estudianteData.estadoCivil}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Datos Académicos */}
            <Card className="border-orange/20 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b border-blue-200/50">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-blue-900">Datos Académicos</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-white border border-indigo-200">
                    <Label className="text-xs text-indigo-600 font-semibold uppercase tracking-wide">Tipo de Postulante</Label>
                    {isEditing ? (
                      <Select value={editData.tipoPostulante} onValueChange={(value) => handleInputChange("tipoPostulante", value)}>
                        <SelectTrigger className="mt-2 border-indigo-200 focus:border-indigo-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Estudiante regular de pregrado">Estudiante regular de pregrado</SelectItem>
                          <SelectItem value="Estudiante regular de postgrado">Estudiante regular de postgrado</SelectItem>
                          <SelectItem value="Estudiante de nuevo ingreso">Estudiante de nuevo ingreso (bachiller)</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="font-bold text-indigo-900 mt-1">{estudianteData.tipoPostulante}</p>
                    )}
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-50 to-white border border-cyan-200">
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap className="h-4 w-4 text-cyan-600" />
                      <Label className="text-xs text-cyan-600 font-semibold uppercase tracking-wide">Carrera/Programa de Estudios</Label>
                    </div>
                    {isEditing ? (
                      <Input
                        value={editData.carrera}
                        onChange={(e) => handleInputChange("carrera", e.target.value)}
                        className="mt-2 border-cyan-200 focus:border-cyan-400"
                      />
                    ) : (
                      <p className="font-bold text-cyan-900">{user?.carrera || 'N/A'}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Documentos */}
          <Card className="border-orange/20 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50 border-b border-purple-200/50">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="text-purple-900">Documentos de la Postulación</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {Array.isArray(estudianteData.documentos) && estudianteData.documentos.length > 0 ? (
                <div className="space-y-3">
                  {estudianteData.documentos.map((documento: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-white rounded-lg border border-purple-200/50 hover:border-purple-300 transition-all duration-200 hover:shadow-md">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <FileText className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{documento.nombre}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{documento.tipoDocumento}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-500 text-white hover:bg-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Cargado
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-300 text-purple-700 hover:bg-purple-50"
                          onClick={() => handleDownloadDocument(documento.id, documento.nombre)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Descargar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="font-medium">No hay documentos cargados para este usuario</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Observaciones */}
          {estudianteData.observaciones && (
            <Card className="border-orange/20">
              <CardHeader>
                <CardTitle className="text-lg text-primary">Observaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{estudianteData.observaciones}</p>
              </CardContent>
            </Card>
          )}

        </div>
      </main>

      {/* Alert Dialog de Confirmación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción desactivará al usuario <strong>{estudianteData.nombreCompleto}</strong> en el sistema.
              El usuario no podrá acceder a su cuenta hasta que sea reactivado por un administrador.
              <br />
              <br />
              ¿Estás seguro de que deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEliminarUsuario}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EstudianteDetail;