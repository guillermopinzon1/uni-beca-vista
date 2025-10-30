import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RefreshCw, UserCheck, Clock, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUsers } from "@/lib/api";
import { approveUser } from "@/lib/api/auth";
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

const GestionUsuariosPendientes = () => {
  const { toast } = useToast();
  const { tokens } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("todos");
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState<UsuarioPendiente[]>([]);
  const [selectedUser, setSelectedUser] = useState<UsuarioPendiente | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [approvingUserId, setApprovingUserId] = useState<string | null>(null);

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

  const handleApproveClick = (usuario: UsuarioPendiente) => {
    setSelectedUser(usuario);
    setShowConfirmDialog(true);
  };

  const handleApproveConfirm = async () => {
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

    setApprovingUserId(selectedUser.id);
    try {
      const result = await approveUser(selectedUser.id, accessToken);

      toast({
        title: "Usuario aprobado",
        description: result.message || `${selectedUser.nombre} ${selectedUser.apellido || ''} ha sido aprobado exitosamente. Se ha enviado un correo de notificación.`,
      });

      // Remover usuario de la lista
      setUsuarios(prev => prev.filter(u => u.id !== selectedUser.id));
      setShowConfirmDialog(false);
      setSelectedUser(null);
    } catch (err: any) {
      toast({
        title: "Error al aprobar",
        description: err?.message || "No se pudo aprobar el usuario",
        variant: "destructive"
      });
    } finally {
      setApprovingUserId(null);
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
                          onClick={() => handleApproveClick(usuario)}
                          disabled={approvingUserId === usuario.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {approvingUserId === usuario.id ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Aprobando...
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Aprobar
                            </>
                          )}
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

      {/* Dialog de confirmación */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Aprobar este usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser && (
                <div className="space-y-2 pt-4">
                  <p><strong>Nombre:</strong> {selectedUser.nombre} {selectedUser.apellido || ''}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Rol:</strong> {selectedUser.role}</p>
                  {selectedUser.cedula && <p><strong>Cédula:</strong> {selectedUser.cedula}</p>}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                    <p className="text-sm text-blue-900">
                      Al aprobar este usuario:
                    </p>
                    <ul className="text-sm text-blue-800 mt-2 space-y-1 ml-4 list-disc">
                      <li>Podrá iniciar sesión en el sistema</li>
                      <li>Recibirá un correo de notificación automático</li>
                      <li>Tendrá acceso según su rol asignado</li>
                    </ul>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApproveConfirm}
              className="bg-green-600 hover:bg-green-700"
            >
              Aprobar Usuario
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GestionUsuariosPendientes;
