import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUsers, fetchUserById, updateUser, deleteUser, toggleUserStatus, FetchUsersParams, UpdateUserRequest } from "@/lib/api/users";
import { approveUser } from "@/lib/api/auth";
import { API_BASE } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Search, RefreshCw, Eye, Edit2, Save, X, Trash2, Power, User, Mail, Phone, Shield, Building, Briefcase, BookOpen, GraduationCap, Plus, FileText } from "lucide-react";

type RoleFilter = "all" | "estudiante" | "supervisor" | "admin";

const GestionUsuarios = () => {
  const { tokens } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  // filtros
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<RoleFilter>("all");
  const [activo, setActivo] = useState<string>("all");
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);

  // Modal states
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [postStatus, setPostStatus] = useState<string>("");
  const [loadingPostStatus, setLoadingPostStatus] = useState(false);

  // Create user modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);
  const [createTab, setCreateTab] = useState("estudiante");
  const [createFormData, setCreateFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "Student123!",
    cedula: "",
    telefono: "+58 212 1234567",
    carrera: "",
    trimestre: "",
    departamento: "",
    cargo: "",
    necesitaPostulacion: "si",
    tipoBeca: ""
  });
  const [cedulaData, setCedulaData] = useState({
    tipo: "V",
    numero: ""
  });

  const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem("auth_tokens") || "null")?.accessToken;

  const loadUsers = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const params: FetchUsersParams = {
        role: role === "all" ? undefined : role,
        activo: activo === "all" ? undefined : activo === "true",
        search: search || undefined,
        limit,
        offset,
      };
      const res = await fetchUsers(accessToken, params);
      setUsers(res.data.usuarios || []);
      setTotal(res.data.total || 0);
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "No se pudieron cargar los usuarios", variant: "destructive" });
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, activo, limit, offset]);

  const handleSearch = () => {
    setOffset(0);
    loadUsers();
  };

  const handleViewDetails = async (user: any) => {
    try {
      if (!accessToken) return;
      const response = await fetchUserById(accessToken, user.id);
      setSelectedUser(response.data);
      setEditForm(response.data);
      setIsDetailModalOpen(true);
      setIsEditing(false);
      // Estado de postulación
      await fetchPostulacionStatus(response.data.id);
    } catch (error: any) {
      toast({ title: "Error", description: error?.message || "No se pudieron cargar los detalles", variant: "destructive" });
    }
  };

  const fetchPostulacionStatus = async (userId: string) => {
    if (!accessToken || !userId) return;
    setLoadingPostStatus(true);
    setPostStatus("");
    try {
      // Únicamente consultar becarios y derivar estado por presencia de usuarioId
      const res = await fetch(`${API_BASE}/v1/becarios`, {
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${accessToken}` }
      });
      if (!res.ok) {
        setPostStatus('Estado desconocido');
        return;
      }
      const payload = await res.json();
      const becarios = payload?.data?.becarios || payload?.data || [];
      const existe = Array.isArray(becarios) && becarios.some((b: any) => b?.usuario?.id === userId);
      setPostStatus(existe ? 'Postulacion aprobada' : 'Postulación pendiente');
    } catch {
      setPostStatus('Estado desconocido');
    } finally {
      setLoadingPostStatus(false);
    }
  };

  const setPostulacionLabel = (label: string) => setPostStatus(label);

  const handleSaveEdit = async () => {
    if (!accessToken || !selectedUser) return;
    try {
      const updateData: UpdateUserRequest = {
        nombre: editForm.nombre,
        apellido: editForm.apellido,
        telefono: editForm.telefono,
        departamento: editForm.departamento || 'N/A',
        cargo: editForm.cargo || 'N/A',
        carrera: editForm.carrera,
        trimestre: editForm.trimestre ? parseInt(editForm.trimestre) : undefined,
        iaa: editForm.iaa ? parseFloat(editForm.iaa) : undefined,
        asignaturasAprobadas: editForm.asignaturasAprobadas ? parseInt(editForm.asignaturasAprobadas) : undefined,
      };

      await updateUser(accessToken, selectedUser.id, updateData);
      toast({ title: "Éxito", description: "Usuario actualizado correctamente" });
      setIsEditing(false);
      loadUsers();
      handleViewDetails({ id: selectedUser.id });
    } catch (error: any) {
      toast({ title: "Error", description: error?.message || "No se pudo actualizar el usuario", variant: "destructive" });
    }
  };

  const handleToggleStatus = async () => {
    if (!accessToken || !selectedUser) return;
    try {
      await toggleUserStatus(accessToken, selectedUser.id);
      toast({
        title: "Éxito",
        description: `Usuario ${selectedUser.activo ? 'desactivado' : 'activado'} correctamente`
      });
      loadUsers();
      handleViewDetails({ id: selectedUser.id });
    } catch (error: any) {
      toast({ title: "Error", description: error?.message || "No se pudo cambiar el estado", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!accessToken || !selectedUser) return;
    if (!confirm(`¿Estás seguro de que deseas eliminar al usuario ${selectedUser.nombre} ${selectedUser.apellido}?`)) return;

    try {
      await deleteUser(accessToken, selectedUser.id);
      toast({ title: "Éxito", description: "Usuario eliminado correctamente" });
      setIsDetailModalOpen(false);
      loadUsers();
    } catch (error: any) {
      toast({ title: "Error", description: error?.message || "No se pudo eliminar el usuario", variant: "destructive" });
    }
  };

  const handleCedulaChange = (tipo: string, numero: string) => {
    setCedulaData({ tipo, numero });
    const cedulaCompleta = numero ? `${tipo}-${numero}` : "";
    setCreateFormData(prev => ({ ...prev, cedula: cedulaCompleta }));
  };

  const resetCreateForm = () => {
    setCreateFormData({
      nombre: "",
      apellido: "",
      email: "",
      password: "Student123!",
      cedula: "",
      telefono: "+58 212 1234567",
      carrera: "",
      trimestre: "",
      departamento: "",
      cargo: "",
      necesitaPostulacion: "si",
      tipoBeca: ""
    });
    setCedulaData({ tipo: "V", numero: "" });
    setCreateTab("estudiante");
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingUser(true);

    try {
      const payload: any = {
        email: createFormData.email,
        password: createFormData.password,
        nombre: createFormData.nombre.trim(),
        apellido: createFormData.apellido.trim(),
        cedula: createFormData.cedula,
        telefono: createFormData.telefono,
        role: createTab
      };

      if (createTab === 'estudiante') {
        if (createFormData.carrera) payload.carrera = createFormData.carrera;
        if (createFormData.trimestre) payload.trimestre = parseInt(createFormData.trimestre);
      } else if (createTab === 'supervisor') {
        if (createFormData.departamento) payload.departamento = createFormData.departamento;
        if (createFormData.cargo) payload.cargo = createFormData.cargo;
      }

      const response = await fetch(`${API_BASE}/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error al crear usuario (${response.status})`);
      }

      const result = await response.json();
      const newUserId = result.data?.user?.id;

      if (newUserId && accessToken) {
        try {
          await approveUser(newUserId, accessToken);
          toast({
            title: "Usuario creado y aprobado",
            description: `El ${createTab} ha sido registrado y aprobado exitosamente.`,
          });
          // Registro directo de becario (sin postulación)
          if (createTab === 'estudiante' && createFormData.necesitaPostulacion === 'no') {
            try {
              const directBody: any = {
                nombre: `${createFormData.nombre} ${createFormData.apellido}`.trim(),
                cedula: createFormData.cedula || 'N/A',
                email: createFormData.email,
                telefono: createFormData.telefono || 'N/A',
                fechaNacimiento: '1975-01-01',
                estadoCivil: 'soltero',
                tipoPostulante: 'estudiante-pregrado',
                carrera: createFormData.carrera || 'N/A',
                trimestre: (createFormData.trimestre && String(createFormData.trimestre).length >= 5) ? String(createFormData.trimestre) : '0000-0',
                iaa: 20,
                promedioBachillerato: 0,
                asignaturasAprobadas: 0,
                creditosInscritos: 3,
                tipoBeca: createFormData.tipoBeca,
                documentos: []
              };
              const directRes = await fetch(`${API_BASE}/v1/postulaciones/registro-directo`, {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(directBody)
              });
              if (!directRes.ok) {
                const errJson = await directRes.json().catch(() => null);
                throw new Error(errJson?.message || `Error en registro directo (${directRes.status})`);
              }
              toast({
                title: 'Becario registrado directamente',
                description: 'Se creó la postulación aprobada y el registro de becario activo.'
              });
              setPostulacionLabel('Postulacion aprobada');
            } catch (directErr: any) {
              toast({
                title: 'Registro directo falló',
                description: directErr?.message || 'No se pudo completar el registro directo de becario',
                variant: 'destructive'
              });
            }
          }
        } catch (approveError: any) {
          toast({
            title: "Usuario creado",
            description: `El ${createTab} ha sido registrado, pero debe ser aprobado manualmente.`,
          });
        }
      } else {
        toast({
          title: "Usuario creado",
          description: `El ${createTab} ha sido registrado exitosamente.`,
        });
      }

      setIsCreateModalOpen(false);
      resetCreateForm();
      loadUsers();

    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "No se pudo crear el usuario",
        variant: "destructive"
      });
    } finally {
      setCreatingUser(false);
    }
  };

  const pages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const getRoleBadge = (rol: string) => {
    const variants: Record<string, string> = {
      'estudiante': 'bg-blue-100 text-blue-800 border-blue-200',
      'supervisor': 'bg-purple-100 text-purple-800 border-purple-200',
      'admin': 'bg-red-100 text-red-800 border-red-200',
      'mentor': 'bg-green-100 text-green-800 border-green-200',
      'director-area': 'bg-orange-100 text-orange-800 border-orange-200',
      'capital-humano': 'bg-pink-100 text-pink-800 border-pink-200',
      'supervisor-laboral': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };
    return variants[rol] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary">Gestión de Usuarios</h2>
          <p className="text-muted-foreground mt-1">Administra y visualiza todos los usuarios del sistema</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadUsers} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Recargar
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="border-orange/20 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
          <CardDescription>Filtra usuarios por nombre, rol o estado</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, apellido o email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Select value={role} onValueChange={(v) => { setRole(v as RoleFilter); setOffset(0); }}>
            <SelectTrigger>
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              <SelectItem value="estudiante">Estudiante</SelectItem>
              <SelectItem value="supervisor">Supervisor</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={activo} onValueChange={(v) => { setActivo(v); setOffset(0); }}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="true">Activos</SelectItem>
              <SelectItem value="false">Inactivos</SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleSearch} disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card className="border-orange/20 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Usuario</TableHead>
                  <TableHead className="font-semibold">Rol</TableHead>
                  <TableHead className="font-semibold">Cédula</TableHead>
                  <TableHead className="font-semibold">Carrera/Trimestre</TableHead>
                  <TableHead className="font-semibold">Estado</TableHead>
                  <TableHead className="text-center font-semibold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold">
                          {u.nombre?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{u.nombre} {u.apellido}</p>
                          <p className="text-sm text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadge(u.role || '')} variant="outline">
                        {u.role || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{u.cedula || '-'}</TableCell>
                    <TableCell>
                      {u.carrera ? (
                        <div>
                          <p className="text-sm font-medium">{u.carrera}</p>
                          {typeof u.trimestre === 'number' && (
                            <p className="text-xs text-muted-foreground">Trimestre {u.trimestre}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={u.activo ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 hover:bg-gray-500'}>
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(u)}
                        className="hover:bg-orange/10 hover:text-orange-600"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-16">
                      <User className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p className="text-lg font-medium">No se encontraron usuarios</p>
                      <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between p-4 border-t bg-muted/20">
            <div className="text-sm text-muted-foreground">
              Mostrando <span className="font-medium text-foreground">{Math.min(total, offset + 1)}-{Math.min(total, offset + users.length)}</span> de <span className="font-medium text-foreground">{total}</span> usuarios
            </div>
            <div className="flex items-center gap-2">
              <Select value={String(limit)} onValueChange={(v) => { setLimit(parseInt(v)); setOffset(0); }}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - limit))}>
                Anterior
              </Button>
              <Button variant="outline" size="sm" disabled={offset + limit >= total} onClick={() => setOffset(offset + limit)}>
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalles */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <User className="h-6 w-6 text-primary" />
              Detalles del Usuario
            </DialogTitle>
            <DialogDescription>
              Información completa y gestión del usuario
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* Header con avatar y acciones */}
              <div className="flex items-start justify-between p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {selectedUser.nombre?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {selectedUser.nombre} {selectedUser.apellido}
                    </h3>
                    <p className="text-muted-foreground">{selectedUser.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getRoleBadge(selectedUser.role)} variant="outline">
                        {selectedUser.role}
                      </Badge>
                      <Badge className={selectedUser.activo ? 'bg-green-500' : 'bg-gray-400'}>
                        {selectedUser.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button size="sm" onClick={() => setIsEditing(true)} className="bg-blue-500 hover:bg-blue-600">
                      <Edit2 className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  ) : (
                    <>
                      <Button size="sm" onClick={handleSaveEdit} className="bg-green-500 hover:bg-green-600">
                        <Save className="h-4 w-4 mr-1" />
                        Guardar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setIsEditing(false); setEditForm(selectedUser); }}>
                        <X className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Información Personal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre</Label>
                    {isEditing ? (
                      <Input
                        value={editForm.nombre || ''}
                        onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{selectedUser.nombre || '-'}</p>
                    )}
                  </div>
                  <div>
                    <Label>Apellido</Label>
                    {isEditing ? (
                      <Input
                        value={editForm.apellido || ''}
                        onChange={(e) => setEditForm({ ...editForm, apellido: e.target.value })}
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium">{selectedUser.apellido || '-'}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label>Cédula</Label>
                      <p className="mt-1 text-sm font-medium">{selectedUser.cedula || '-'}</p>
                      <p className="text-xs text-muted-foreground italic mt-0.5">Este campo no se puede editar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label>Email</Label>
                      <p className="mt-1 text-sm font-medium">{selectedUser.email || '-'}</p>
                      <p className="text-xs text-muted-foreground italic mt-0.5">Este campo no se puede editar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Label>Teléfono</Label>
                      {isEditing ? (
                        <Input
                          value={editForm.telefono || ''}
                          onChange={(e) => setEditForm({ ...editForm, telefono: e.target.value })}
                        />
                      ) : (
                        <p className="mt-1 text-sm font-medium">{selectedUser.telefono || '-'}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Estado de Postulación */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Estado de Postulación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Resultado basado en becarios y postulaciones del usuario</p>
                  <div className="mt-2">
                    {loadingPostStatus ? (
                      <Badge className="bg-gray-300">Cargando...</Badge>
                    ) : (
                      <Badge className={
                        postStatus.toLowerCase().includes('aprob') ? 'bg-green-500' : postStatus.toLowerCase().includes('pend') ? 'bg-yellow-500' : 'bg-gray-400'
                      }>
                        {postStatus || 'Estado desconocido'}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Información Académica/Laboral */}
              {(selectedUser.role === 'estudiante' || selectedUser.carrera) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Información Académica
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Carrera</Label>
                      {isEditing ? (
                        <Input
                          value={editForm.carrera || ''}
                          onChange={(e) => setEditForm({ ...editForm, carrera: e.target.value })}
                        />
                      ) : (
                        <p className="mt-1 text-sm font-medium">{selectedUser.carrera || '-'}</p>
                      )}
                    </div>
                    <div>
                      <Label>Trimestre</Label>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editForm.trimestre || ''}
                          onChange={(e) => setEditForm({ ...editForm, trimestre: e.target.value })}
                        />
                      ) : (
                        <p className="mt-1 text-sm font-medium">{selectedUser.trimestre || '-'}</p>
                      )}
                    </div>
                    {(editForm.iaa || selectedUser.iaa) && (
                      <div>
                        <Label>IAA</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={editForm.iaa || ''}
                            onChange={(e) => setEditForm({ ...editForm, iaa: e.target.value })}
                          />
                        ) : (
                          <p className="mt-1 text-sm font-medium">{selectedUser.iaa || '-'}</p>
                        )}
                      </div>
                    )}
                    {(editForm.asignaturasAprobadas || selectedUser.asignaturasAprobadas) && (
                      <div>
                        <Label>Asignaturas Aprobadas</Label>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editForm.asignaturasAprobadas || ''}
                            onChange={(e) => setEditForm({ ...editForm, asignaturasAprobadas: e.target.value })}
                          />
                        ) : (
                          <p className="mt-1 text-sm font-medium">{selectedUser.asignaturasAprobadas || '-'}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Información Laboral */}
              {(selectedUser.role !== 'estudiante' && (selectedUser.departamento || selectedUser.cargo)) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Información Laboral
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label>Departamento</Label>
                        {isEditing ? (
                          <Input
                            value={editForm.departamento || ''}
                            onChange={(e) => setEditForm({ ...editForm, departamento: e.target.value })}
                          />
                        ) : (
                          <p className="mt-1 text-sm font-medium">{selectedUser.departamento || '-'}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <Label>Cargo</Label>
                        {isEditing ? (
                          <Input
                            value={editForm.cargo || ''}
                            onChange={(e) => setEditForm({ ...editForm, cargo: e.target.value })}
                          />
                        ) : (
                          <p className="mt-1 text-sm font-medium">{selectedUser.cargo || '-'}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Acciones */}
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-lg">Acciones del Usuario</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleToggleStatus}
                    variant="outline"
                    className={selectedUser.activo ? "border-yellow-500 text-yellow-700 hover:bg-yellow-50" : "border-green-500 text-green-700 hover:bg-green-50"}
                  >
                    <Power className="h-4 w-4 mr-2" />
                    {selectedUser.activo ? 'Desactivar' : 'Activar'} Usuario
                  </Button>
                  <Button
                    onClick={handleDelete}
                    variant="outline"
                    className="border-red-500 text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar Usuario
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create User Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Complete los datos del nuevo usuario. Seleccione el tipo de usuario en las pestañas.
            </DialogDescription>
          </DialogHeader>

          <Tabs value={createTab} onValueChange={setCreateTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="estudiante">Estudiante</TabsTrigger>
              <TabsTrigger value="supervisor">Supervisor</TabsTrigger>
            </TabsList>

            <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="create-nombre">Nombre *</Label>
                  <Input
                    id="create-nombre"
                    value={createFormData.nombre}
                    onChange={(e) => setCreateFormData({ ...createFormData, nombre: e.target.value })}
                    placeholder="Ingrese el nombre"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-apellido">Apellido *</Label>
                  <Input
                    id="create-apellido"
                    value={createFormData.apellido}
                    onChange={(e) => setCreateFormData({ ...createFormData, apellido: e.target.value })}
                    placeholder="Ingrese el apellido"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-email">Correo Electrónico *</Label>
                  <Input
                    id="create-email"
                    type="email"
                    value={createFormData.email}
                    onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                    placeholder="usuario@unimet.edu.ve"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-cedula">Cédula *</Label>
                  <div className="flex gap-2">
                    <Select
                      value={cedulaData.tipo}
                      onValueChange={(value) => handleCedulaChange(value, cedulaData.numero)}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="V">V</SelectItem>
                        <SelectItem value="E">E</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="create-cedula"
                      value={cedulaData.numero}
                      onChange={(e) => handleCedulaChange(cedulaData.tipo, e.target.value)}
                      placeholder="12345678"
                      required
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-telefono">Teléfono *</Label>
                  <Input
                    id="create-telefono"
                    value={createFormData.telefono}
                    onChange={(e) => setCreateFormData({ ...createFormData, telefono: e.target.value })}
                    placeholder="+58 212 1234567"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-password">Contraseña Temporal *</Label>
                  <Input
                    id="create-password"
                    type="text"
                    value={createFormData.password}
                    onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                    placeholder="Student123!"
                    required
                  />
                </div>
              </div>

              {/* Tab-specific fields */}
              <TabsContent value="estudiante" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-carrera">Carrera</Label>
                    <Input
                      id="create-carrera"
                      value={createFormData.carrera}
                      onChange={(e) => setCreateFormData({ ...createFormData, carrera: e.target.value })}
                      placeholder="Ingeniería de Sistemas"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-trimestre">Trimestre</Label>
                    <Input
                      id="create-trimestre"
                      type="number"
                      min="1"
                      max="12"
                      value={createFormData.trimestre}
                      onChange={(e) => setCreateFormData({ ...createFormData, trimestre: e.target.value })}
                      placeholder="5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>¿Necesita postulación?</Label>
                    <Select
                      value={createFormData.necesitaPostulacion}
                      onValueChange={(v) => setCreateFormData({ ...createFormData, necesitaPostulacion: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="si">Sí</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {createFormData.necesitaPostulacion === 'no' && (
                    <div className="space-y-2">
                      <Label>Tipo de Beca (requerido)</Label>
                      <Select
                        value={createFormData.tipoBeca}
                        onValueChange={(v) => setCreateFormData({ ...createFormData, tipoBeca: v })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el tipo de beca" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ayudantía">Ayudantía</SelectItem>
                          <SelectItem value="Impacto">Impacto</SelectItem>
                          <SelectItem value="Excelencia">Excelencia</SelectItem>
                          <SelectItem value="Exoneración de Pago">Exoneración de Pago</SelectItem>
                          <SelectItem value="Formación Docente">Formación Docente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="supervisor" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="create-departamento">Departamento</Label>
                    <Input
                      id="create-departamento"
                      value={createFormData.departamento}
                      onChange={(e) => setCreateFormData({ ...createFormData, departamento: e.target.value })}
                      placeholder="Ej: Ciencias"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-cargo">Cargo</Label>
                    <Input
                      id="create-cargo"
                      value={createFormData.cargo}
                      onChange={(e) => setCreateFormData({ ...createFormData, cargo: e.target.value })}
                      placeholder="Ej: Profesor Asociado"
                    />
                  </div>
                </div>
              </TabsContent>

              <p className="text-xs text-muted-foreground">
                El usuario deberá cambiar esta contraseña en su primer acceso
              </p>

              <DialogFooter className="gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    resetCreateForm();
                  }}
                  disabled={creatingUser}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-primary hover:opacity-90"
                  disabled={creatingUser}
                >
                  {creatingUser ? "Creando..." : "Crear Usuario"}
                </Button>
              </DialogFooter>
            </form>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestionUsuarios;
