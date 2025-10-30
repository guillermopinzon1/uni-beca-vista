import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Mail, Phone, Calendar, FileText, GraduationCap, Download, Edit, Save, X, Trash2, Info } from "lucide-react";
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
    estado: string;
    periodoInicio?: string | null;
    periodoFin?: string | null;
    horasRequeridas?: number | null;
    horasCompletadas?: number | string | null;
    plaza?: { id: string; materia?: string; codigo?: string } | null;
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
    setEditData({
      nombreCompleto: estudianteData.nombreCompleto,
      cedula: estudianteData.cedula,
      correoElectronico: estudianteData.correoElectronico,
      telefono: estudianteData.telefono,
      fechaNacimiento: estudianteData.fechaNacimiento,
      estadoCivil: estudianteData.estadoCivil,
      tipoPostulante: estudianteData.tipoPostulante,
      carrera: estudianteData.carrera,
      trimestreActual: String(estudianteData.trimestreActual),
      iaa: String(estudianteData.iaa),
      asignaturasAprobadas: String(estudianteData.asignaturasAprobadas),
      creditosInscritos: String(estudianteData.creditosInscritos)
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
    const updateData: any = {};

    if (nombre) updateData.nombre = nombre;
    if (apellido) updateData.apellido = apellido;
    if (editData.telefono) updateData.telefono = editData.telefono;
    if (editData.carrera) updateData.carrera = editData.carrera;
    if (editData.trimestreActual) updateData.trimestre = parseInt(editData.trimestreActual);

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
              estado: b.estado,
              periodoInicio: b.periodoInicio,
              periodoFin: b.periodoFin,
              horasRequeridas: b.horasRequeridas,
              horasCompletadas: b.horasCompletadas,
              plaza: b.plaza ? { id: b.plaza.id, materia: b.plaza.materia, codigo: b.plaza.codigo } : null,
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
      
      // Documentos (dinámicos desde usuario)
      documentos: (() => {
        const docs: Array<{ nombre: string; id: string }> = [];
        const u: any = user || {};
        if (u.fotocopiaCedulaId) docs.push({ nombre: "Fotocopia de Cédula de Identidad", id: u.fotocopiaCedulaId });
        if (u.flujogramaCarreraId) docs.push({ nombre: "Flujograma de Carrera", id: u.flujogramaCarreraId });
        if (u.historicoNotasId) docs.push({ nombre: "Histórico de Notas", id: u.historicoNotasId });
        if (u.planCarreraAvaladoId) docs.push({ nombre: "Plan de Carrera Avalado", id: u.planCarreraAvaladoId });
        if (u.curriculumDeportivoId) docs.push({ nombre: "Currículum Deportivo", id: u.curriculumDeportivoId });
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
              onClick={() => navigate(-1)}
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

          {/* Alert informativo cuando está en modo edición */}
          {isEditing && (
            <Alert className="border-orange/30 bg-orange/5">
              <Info className="h-4 w-4 text-orange" />
              <AlertTitle className="text-orange font-semibold">Campos Editables</AlertTitle>
              <AlertDescription className="text-sm text-muted-foreground mt-2">
                Solo se pueden modificar los siguientes campos del usuario:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong>Nombre</strong> y <strong>Apellido</strong></li>
                  <li><strong>Teléfono</strong></li>
                  <li><strong>Carrera</strong></li>
                  <li><strong>Trimestre</strong></li>
                </ul>
                <p className="mt-2 text-xs">
                  Los demás campos son de solo lectura o están pendientes de implementación en el backend.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Resumen del Estudiante (incluye info de beca) */}
          <Card className="border-orange/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <User className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl text-primary">{estudianteData.nombreCompleto}</CardTitle>
                </div>
                {getEstadoBadge(estudianteData.estadoPostulacion)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Beca</p>
                  <p className="font-medium">{estudianteData.tipoBeca}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Postulación</p>
                  <p className="font-medium">{new Date(estudianteData.fechaPostulacion).toLocaleDateString('es-ES')}</p>
                </div>
                {becario && (
                  <div>
                    <p className="text-sm text-muted-foreground">Estado</p>
                    <Badge>{becario.estado}</Badge>
                  </div>
                )}
                {becario && (
                  <div>
                    <p className="text-sm text-muted-foreground">Período Inicio</p>
                    <p className="font-medium">{becario.periodoInicio || '-'}</p>
                  </div>
                )}
                {becario && (
                  <div>
                    <p className="text-sm text-muted-foreground">Horas Requeridas</p>
                    <p className="font-medium">{becario.horasRequeridas ?? '-'}</p>
                  </div>
                )}
                {becario && (
                  <div>
                    <p className="text-sm text-muted-foreground">Horas Completadas</p>
                    <p className="font-medium">{typeof becario.horasCompletadas === 'string' ? becario.horasCompletadas : (becario.horasCompletadas ?? '-')}</p>
                  </div>
                )}
                {becario && (
                  <div>
                    <p className="text-sm text-muted-foreground">Plaza</p>
                    <p className="font-medium">{becario.plaza?.materia ? `${becario.plaza.materia}${becario.plaza.codigo ? ` · ${becario.plaza.codigo}` : ''}` : '-'}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Datos Personales */}
            <Card className="border-orange/20">
              <CardHeader>
                <CardTitle className="text-lg text-primary flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Datos Personales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label className="text-sm text-muted-foreground">Nombre Completo</Label>
                    {isEditing ? (
                      <Input 
                        value={editData.nombreCompleto}
                        onChange={(e) => handleInputChange("nombreCompleto", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{estudianteData.nombreCompleto}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Cédula de Identidad</Label>
                    {isEditing ? (
                      <Input 
                        value={editData.cedula}
                        onChange={(e) => handleInputChange("cedula", e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="font-medium">{estudianteData.cedula}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-sm text-muted-foreground">Correo Electrónico</Label>
                      {isEditing ? (
                        <Input 
                          value={editData.correoElectronico}
                          onChange={(e) => handleInputChange("correoElectronico", e.target.value)}
                          className="mt-1"
                          type="email"
                        />
                      ) : (
                        <p className="font-medium">{estudianteData.correoElectronico}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-sm text-muted-foreground">Teléfono</Label>
                      {isEditing ? (
                        <Input 
                          value={editData.telefono}
                          onChange={(e) => handleInputChange("telefono", e.target.value)}
                          className="mt-1"
                        />
                      ) : (
                        <p className="font-medium">{estudianteData.telefono}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-sm text-muted-foreground">Fecha de Nacimiento</Label>
                      {isEditing ? (
                        <Input 
                          value={editData.fechaNacimiento}
                          onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
                          className="mt-1"
                          type="date"
                        />
                      ) : (
                        <p className="font-medium">{new Date(estudianteData.fechaNacimiento).toLocaleDateString('es-ES')}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Estado Civil</Label>
                    {isEditing ? (
                      <Select value={editData.estadoCivil} onValueChange={(value) => handleInputChange("estadoCivil", value)}>
                        <SelectTrigger className="mt-1">
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
                      <p className="font-medium">{estudianteData.estadoCivil}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Datos Académicos */}
            <Card className="border-orange/20">
              <CardHeader>
                <CardTitle className="text-lg text-primary flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Datos Académicos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label className="text-sm text-muted-foreground">Tipo de Postulante</Label>
                    {isEditing ? (
                      <Select value={editData.tipoPostulante} onValueChange={(value) => handleInputChange("tipoPostulante", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Estudiante regular de pregrado">Estudiante regular de pregrado</SelectItem>
                          <SelectItem value="Estudiante regular de postgrado">Estudiante regular de postgrado</SelectItem>
                          <SelectItem value="Estudiante de nuevo ingreso">Estudiante de nuevo ingreso (bachiller)</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="font-medium">{estudianteData.tipoPostulante}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Carrera/Programa de estudios</Label>
                    {isEditing ? (
                      <Input 
                        value={editData.carrera}
                        onChange={(e) => handleInputChange("carrera", e.target.value)}
                        className="mt-1"
                      />
                  ) : (
                      <p className="font-medium">{user?.carrera || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Trimestre actual</Label>
                    {isEditing ? (
                      <Input 
                        value={editData.trimestreActual}
                        onChange={(e) => handleInputChange("trimestreActual", e.target.value)}
                        className="mt-1"
                        type="number"
                        min="1"
                        max="15"
                      />
                    ) : (
                      <p className="font-medium">{typeof user?.semestre === 'number' ? `${user.semestre}°` : 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Índice Académico Acumulado (IAA)</Label>
                    {isEditing ? (
                      <Input 
                        value={editData.iaa}
                        onChange={(e) => handleInputChange("iaa", e.target.value)}
                        className="mt-1"
                        type="number"
                        step="0.1"
                        min="0"
                        max="20"
                      />
                    ) : (
                      <p className="font-medium text-primary text-lg">{user?.iaa != null ? user.iaa : 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Asignaturas Aprobadas</Label>
                    {isEditing ? (
                      <Input 
                        value={editData.asignaturasAprobadas}
                        onChange={(e) => handleInputChange("asignaturasAprobadas", e.target.value)}
                        className="mt-1"
                        type="number"
                        min="0"
                      />
                    ) : (
                      <p className="font-medium">{user?.asignaturasAprobadas != null ? user.asignaturasAprobadas : 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Créditos Inscritos este Trimestre</Label>
                    {isEditing ? (
                      <Input 
                        value={editData.creditosInscritos}
                        onChange={(e) => handleInputChange("creditosInscritos", e.target.value)}
                        className="mt-1"
                        type="number"
                        min="0"
                      />
                    ) : (
                      <p className="font-medium">{'N/A'}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Documentos */}
          <Card className="border-orange/20">
            <CardHeader>
              <CardTitle className="text-lg text-primary flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Documentos de la Postulación
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(estudianteData.documentos) && estudianteData.documentos.length > 0 ? (
                <div className="space-y-3">
                  {estudianteData.documentos.map((documento: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{documento.nombre}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">Cargado</Badge>
                        {/* Placeholder descarga si aplica en futuro */}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  No hay documentos cargados para este usuario
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