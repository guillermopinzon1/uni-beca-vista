import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RefreshCw, UserCheck, Clock, AlertCircle, Eye, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUsers } from "@/lib/api";
import { approveUser, deleteUser } from "@/lib/api/auth";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

interface UsuarioPendiente {
  id: string;
  email: string;
  nombre: string;
  apellido?: string;
  cedula?: string;
  telefono?: string;
  role: string;
  carrera?: string;
  semestre?: number;
  departamento?: string;
  cargo?: string;
  createdAt: string;
}

interface GestionUsuariosPendientesProps {
  onUserApproved?: () => void;
}

const GestionUsuariosPendientes = ({ onUserApproved }: GestionUsuariosPendientesProps) => {
  const { toast } = useToast();
  const { tokens } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("todos");
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState<UsuarioPendiente[]>([]);
  const [selectedUser, setSelectedUser] = useState<UsuarioPendiente | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [processingAction, setProcessingAction] = useState<'approving' | 'deleting' | null>(null);

  // Función para cargar usuarios pendientes de aprobación
  const loadUsuariosPendientes = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) {
      toast({
        title: 'Sin sesión',
        description: 'Inicia sesión para cargar usuarios pendientes',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetchUsers(accessToken, {
        emailVerified: false,  // Filtrar solo usuarios NO aprobados
        limit: 100
      });

      const usuariosMapeados: UsuarioPendiente[] = res.data.usuarios.map(u => ({
        id: u.id,
        email: u.email,
        nombre: u.nombre,
        apellido: (u as any).apellido,
        cedula: u.cedula,
        telefono: (u as any).telefono,
        role: u.role || 'N/A',
        carrera: u.carrera,
        semestre: u.semestre,
        departamento: (u as any).departamento,
        cargo: (u as any).cargo,
        createdAt: (u as any).createdAt || new Date().toISOString()
      }));

      setUsuarios(usuariosMapeados);

      if (usuariosMapeados.length === 0) {
        toast({
          title: 'Sin usuarios pendientes',
          description: 'No hay usuarios esperando aprobación',
          variant: 'default'
        });
      }
    } catch (e: any) {
      toast({
        title: 'Error',
        description: e?.message || 'No se pudieron cargar los usuarios pendientes',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuariosPendientes();

    // Recargar cada vez que el componente se monta (cuando cambias al módulo)
    const interval = setInterval(loadUsuariosPendientes, 30000); // Recargar cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  const handleViewUser = (usuario: UsuarioPendiente) => {
    setSelectedUser(usuario);
    setShowUserDialog(true);
  };

  const handleApproveUser = async () => {
    if (!selectedUser) return;

    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) {
      toast({
        title: 'Error',
        description: 'No se encontró el token de acceso',
        variant: 'destructive'
      });
      return;
    }

    setProcessingAction('approving');
    try {
      const result = await approveUser(selectedUser.id, accessToken);

      toast({
        title: "✅ Usuario aprobado",
        description: result.message || `${selectedUser.nombre} ${selectedUser.apellido || ''} ha sido aprobado exitosamente. Se ha enviado un correo de notificación.`,
      });

      // Remover usuario de la lista
      setUsuarios(prev => prev.filter(u => u.id !== selectedUser.id));
      setShowUserDialog(false);
      setSelectedUser(null);

      // Notificar al componente padre para actualizar el contador
      if (onUserApproved) {
        onUserApproved();
      }
    } catch (err: any) {
      toast({
        title: "❌ Error al aprobar",
        description: err?.message || "No se pudo aprobar el usuario",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(null);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) {
      toast({
        title: 'Error',
        description: 'No se encontró el token de acceso',
        variant: 'destructive'
      });
      return;
    }

    setProcessingAction('deleting');
    try {
      const result = await deleteUser(selectedUser.id, accessToken);

      toast({
        title: "🗑️ Usuario eliminado",
        description: result.message || `${selectedUser.nombre} ${selectedUser.apellido || ''} ha sido eliminado del sistema.`,
      });

      // Remover usuario de la lista
      setUsuarios(prev => prev.filter(u => u.id !== selectedUser.id));
      setShowDeleteConfirm(false);
      setShowUserDialog(false);
      setSelectedUser(null);

      // Notificar al componente padre para actualizar el contador
      if (onUserApproved) {
        onUserApproved();
      }
    } catch (err: any) {
      toast({
        title: "❌ Error al eliminar",
        description: err?.message || "No se pudo eliminar el usuario",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(null);
    }
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      admin: "bg-purple-100 text-purple-800 border-purple-200",
      supervisor: "bg-blue-100 text-blue-800 border-blue-200",
      estudiante: "bg-green-100 text-green-800 border-green-200",
      mentor: "bg-orange-100 text-orange-800 border-orange-200",
      "director-area": "bg-red-100 text-red-800 border-red-200",
      "capital-humano": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "supervisor-laboral": "bg-indigo-100 text-indigo-800 border-indigo-200"
    };

    return (
      <Badge className={roleColors[role] || "bg-gray-100 text-gray-800 border-gray-200"}>
        {role}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-VE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch =
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (usuario.apellido && usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (usuario.cedula && usuario.cedula.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = filterRole === "todos" || usuario.role === filterRole;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Usuarios Pendientes de Aprobación</h2>
          <p className="text-muted-foreground">
            Gestión de usuarios que esperan aprobación administrativa
          </p>
        </div>
        <Button
          onClick={loadUsuariosPendientes}
          variant="outline"
          disabled={loading}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar</span>
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pendientes</p>
                <p className="text-2xl font-bold text-primary">{usuarios.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Estudiantes</p>
                <p className="text-2xl font-bold text-green-600">
                  {usuarios.filter(u => u.role === 'estudiante').length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o cédula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los Roles</SelectItem>
                <SelectItem value="estudiante">Estudiante</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de usuarios pendientes */}
      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Usuarios Pendientes ({filteredUsuarios.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Cargando usuarios...</span>
            </div>
          ) : filteredUsuarios.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                No hay usuarios pendientes de aprobación
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Cédula</TableHead>
                    <TableHead>Fecha de Registro</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {usuario.nombre} {usuario.apellido || ''}
                          </p>
                          {usuario.telefono && (
                            <p className="text-sm text-muted-foreground">{usuario.telefono}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>{getRoleBadge(usuario.role)}</TableCell>
                      <TableCell>{usuario.cedula || 'N/A'}</TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(usuario.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewUser(usuario)}
                          className="hover:bg-primary/10 hover:text-primary"
                        >
                          <Eye className="h-4 w-4 text-orange-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de detalles del usuario */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <UserCheck className="h-6 w-6" />
              Detalles del Usuario Pendiente
            </DialogTitle>
            <DialogDescription>
              Revisa la información y decide si aprobar o eliminar este usuario
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* Información Personal */}
              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre Completo</p>
                      <p className="font-medium text-lg">{selectedUser.nombre} {selectedUser.apellido || ''}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rol</p>
                      <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Correo Electrónico</p>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                    {selectedUser.cedula && (
                      <div>
                        <p className="text-sm text-muted-foreground">Cédula</p>
                        <p className="font-medium">{selectedUser.cedula}</p>
                      </div>
                    )}
                  </div>

                  {selectedUser.telefono && (
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium">{selectedUser.telefono}</p>
                    </div>
                  )}

                  {(selectedUser.carrera || selectedUser.departamento) && (
                    <div className="grid grid-cols-2 gap-4">
                      {selectedUser.carrera && (
                        <div>
                          <p className="text-sm text-muted-foreground">Carrera</p>
                          <p className="font-medium">{selectedUser.carrera}</p>
                        </div>
                      )}
                      {selectedUser.departamento && (
                        <div>
                          <p className="text-sm text-muted-foreground">Departamento</p>
                          <p className="font-medium">{selectedUser.departamento}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de Registro</p>
                    <p className="font-medium">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Información sobre aprobación */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <UserCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900 mb-2">Al aprobar este usuario:</h4>
                    <ul className="space-y-1 text-sm text-green-800">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-green-600 rounded-full"></div>
                        Podrá iniciar sesión en el sistema
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-green-600 rounded-full"></div>
                        Recibirá un correo de notificación automático
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-green-600 rounded-full"></div>
                        Tendrá acceso según su rol asignado ({selectedUser.role})
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Advertencia sobre eliminación */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-900 mb-2">Al eliminar este usuario:</h4>
                    <ul className="space-y-1 text-sm text-red-800">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-red-600 rounded-full"></div>
                        El usuario será desactivado permanentemente
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-red-600 rounded-full"></div>
                        No podrá acceder al sistema
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-red-600 rounded-full"></div>
                        Esta acción no se puede deshacer fácilmente
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowUserDialog(false)}
              disabled={processingAction !== null}
            >
              Cancelar
            </Button>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={handleDeleteClick}
                disabled={processingAction !== null}
                className="bg-red-600 hover:bg-red-700"
              >
                {processingAction === 'deleting' ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </>
                )}
              </Button>
              <Button
                onClick={handleApproveUser}
                disabled={processingAction !== null}
                className="bg-green-600 hover:bg-green-700"
              >
                {processingAction === 'approving' ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Aprobando...
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Aprobar Usuario
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación de eliminación */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              ¿Confirmar eliminación?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser && (
                <div className="space-y-3 pt-3">
                  <p className="text-base">
                    Estás a punto de eliminar al usuario:
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="font-semibold text-red-900">
                      {selectedUser.nombre} {selectedUser.apellido || ''}
                    </p>
                    <p className="text-sm text-red-700">{selectedUser.email}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Esta acción desactivará permanentemente el usuario y no podrá acceder al sistema.
                    ¿Estás seguro de continuar?
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processingAction !== null}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={processingAction !== null}
              className="bg-red-600 hover:bg-red-700"
            >
              {processingAction === 'deleting' ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Sí, eliminar usuario
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GestionUsuariosPendientes;
