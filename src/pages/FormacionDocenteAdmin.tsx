import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Search, Users, BookOpen, GraduationCap, AlertCircle, CheckCircle, Clock, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const FormacionDocenteAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<'list' | 'register'>('list');
  const [candidateForm, setCandidateForm] = useState({
    nombres: '',
    apellidos: '',
    cedula: '',
    telefono: '',
    email: '',
    institucionActual: '',
    cargoDocente: '',
    anosExperiencia: '',
    tituloUniversitario: '',
    areaEspecializacion: '',
    motivacion: ''
  });

  const candidatos = [
    {
      id: 1,
      nombre: "María Elena García",
      cedula: "V-12.345.678",
      institucion: "Colegio San Patricio",
      experiencia: "8 años",
      titulo: "Lic. en Educación Matemática",
      area: "Matemáticas",
      estado: "Evaluando",
      fechaRegistro: "2025-01-15"
    },
    {
      id: 2,
      nombre: "Carlos Alberto Mendoza",
      cedula: "V-23.456.789",
      institucion: "U.E. Andrés Bello",
      experiencia: "12 años",
      titulo: "Ing. Civil, Esp. en Docencia",
      area: "Ingeniería",
      estado: "Aprobado",
      fechaRegistro: "2025-01-10"
    },
    {
      id: 3,
      nombre: "Ana Lucía Rodríguez",
      cedula: "V-34.567.890",
      institucion: "Instituto Pedagógico",
      experiencia: "5 años",
      titulo: "Lic. en Ciencias Sociales",
      area: "Historia",
      estado: "Inscrito",
      fechaRegistro: "2025-01-08"
    }
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Evaluando":
        return <Badge variant="outline" className="text-yellow-600 bg-yellow-50 border-yellow-200"><Clock className="h-3 w-3 mr-1" />{estado}</Badge>;
      case "Aprobado":
        return <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />{estado}</Badge>;
      case "Inscrito":
        return <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200"><GraduationCap className="h-3 w-3 mr-1" />{estado}</Badge>;
      case "Rechazado":
        return <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200"><X className="h-3 w-3 mr-1" />{estado}</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar experiencia mínima
    if (parseInt(candidateForm.anosExperiencia) < 2) {
      toast({
        title: "Error de validación",
        description: "El candidato debe tener mínimo 2 años de experiencia docente",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Candidato registrado",
      description: "El candidato ha sido agregado para evaluación",
    });

    setCandidateForm({
      nombres: '', apellidos: '', cedula: '', telefono: '', email: '',
      institucionActual: '', cargoDocente: '', anosExperiencia: '',
      tituloUniversitario: '', areaEspecializacion: '', motivacion: ''
    });
    setActiveView('list');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-orange/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-primary hover:text-primary/90"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">Programa de Formación Docente</h1>
              <p className="text-sm text-muted-foreground">
                Panel de Administración - Gestión de candidatos con perfil docente
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="border-orange/40 text-primary">
              Julio Salas - Administrador
            </Badge>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Warning Banner */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-orange-800 font-medium">Programa de Selección Controlada</p>
                <p className="text-orange-700 text-sm">
                  Este programa NO es de postulación abierta. Solo candidatos preseleccionados con experiencia docente mínima.
                  Una vez inscrito, el seguimiento se transfiere automáticamente al módulo de DDBE.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-4">
            <Button 
              variant={activeView === 'list' ? 'default' : 'outline'}
              onClick={() => setActiveView('list')}
              className="flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Lista de Candidatos</span>
            </Button>
            <Button 
              variant={activeView === 'register' ? 'default' : 'outline'}
              onClick={() => setActiveView('register')}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Registrar Candidato</span>
            </Button>
          </div>

          {/* Lista de Candidatos */}
          {activeView === 'list' && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Candidatos Registrados</CardTitle>
                    <CardDescription>
                      Gestión y seguimiento de candidatos preseleccionados
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Buscar candidato..." className="pl-10 w-64" />
                    </div>
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filtrar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="evaluando">Evaluando</SelectItem>
                        <SelectItem value="aprobado">Aprobado</SelectItem>
                        <SelectItem value="inscrito">Inscrito</SelectItem>
                        <SelectItem value="rechazado">Rechazado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidato</TableHead>
                      <TableHead>Institución Actual</TableHead>
                      <TableHead>Experiencia</TableHead>
                      <TableHead>Título/Área</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha Registro</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidatos.map((candidato) => (
                      <TableRow key={candidato.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{candidato.nombre}</p>
                            <p className="text-sm text-muted-foreground">{candidato.cedula}</p>
                          </div>
                        </TableCell>
                        <TableCell>{candidato.institucion}</TableCell>
                        <TableCell>{candidato.experiencia}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{candidato.titulo}</p>
                            <p className="text-xs text-muted-foreground">{candidato.area}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getEstadoBadge(candidato.estado)}</TableCell>
                        <TableCell className="text-sm">{candidato.fechaRegistro}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {candidato.estado === 'Evaluando' && (
                              <>
                                <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Aprobar
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                  <X className="h-3 w-3 mr-1" />
                                  Rechazar
                                </Button>
                              </>
                            )}
                            {candidato.estado === 'Aprobado' && (
                              <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-700">
                                <GraduationCap className="h-3 w-3 mr-1" />
                                Marcar Inscrito
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Formulario de Registro */}
          {activeView === 'register' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Registrar Candidato Preseleccionado</CardTitle>
                <CardDescription>
                  Solo para candidatos con experiencia docente comprobada (mínimo 2 años)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Datos Personales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombres">Nombres *</Label>
                      <Input
                        id="nombres"
                        value={candidateForm.nombres}
                        onChange={(e) => setCandidateForm({...candidateForm, nombres: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apellidos">Apellidos *</Label>
                      <Input
                        id="apellidos"
                        value={candidateForm.apellidos}
                        onChange={(e) => setCandidateForm({...candidateForm, apellidos: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cedula">Cédula de Identidad *</Label>
                      <Input
                        id="cedula"
                        value={candidateForm.cedula}
                        onChange={(e) => setCandidateForm({...candidateForm, cedula: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono *</Label>
                      <Input
                        id="telefono"
                        value={candidateForm.telefono}
                        onChange={(e) => setCandidateForm({...candidateForm, telefono: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={candidateForm.email}
                        onChange={(e) => setCandidateForm({...candidateForm, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  {/* Experiencia Docente */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Experiencia Docente (Obligatorio)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="institucionActual">Institución donde enseña actualmente *</Label>
                        <Input
                          id="institucionActual"
                          value={candidateForm.institucionActual}
                          onChange={(e) => setCandidateForm({...candidateForm, institucionActual: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cargoDocente">Cargo/Materia que dicta *</Label>
                        <Input
                          id="cargoDocente"
                          value={candidateForm.cargoDocente}
                          onChange={(e) => setCandidateForm({...candidateForm, cargoDocente: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="anosExperiencia">Años de experiencia docente *</Label>
                        <Input
                          id="anosExperiencia"
                          type="number"
                          min="2"
                          value={candidateForm.anosExperiencia}
                          onChange={(e) => setCandidateForm({...candidateForm, anosExperiencia: e.target.value})}
                          required
                        />
                        <p className="text-sm text-muted-foreground">Mínimo 2 años requeridos</p>
                      </div>
                    </div>
                  </div>

                  {/* Formación Académica */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Formación Académica</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tituloUniversitario">Título universitario actual *</Label>
                        <Input
                          id="tituloUniversitario"
                          value={candidateForm.tituloUniversitario}
                          onChange={(e) => setCandidateForm({...candidateForm, tituloUniversitario: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="areaEspecializacion">Área de especialización *</Label>
                        <Input
                          id="areaEspecializacion"
                          value={candidateForm.areaEspecializacion}
                          onChange={(e) => setCandidateForm({...candidateForm, areaEspecializacion: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Motivación */}
                  <div className="space-y-2">
                    <Label htmlFor="motivacion">Motivación para el programa</Label>
                    <Textarea
                      id="motivacion"
                      placeholder="Razones por las cuales el candidato está interesado en el programa..."
                      value={candidateForm.motivacion}
                      onChange={(e) => setCandidateForm({...candidateForm, motivacion: e.target.value})}
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={() => setActiveView('list')}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      Registrar Candidato
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
};

export default FormacionDocenteAdmin;