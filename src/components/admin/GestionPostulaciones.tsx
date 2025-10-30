import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Eye, Check, X, Clock, User, Mail, Phone, Calendar, FileText, GraduationCap, Download, Loader2, RefreshCw, CheckCircle, Circle } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { API_BASE } from "@/lib/api";
import { approveUser } from "@/lib/api/auth";

interface Postulacion {
  id: string;
  nombre: string;
  cedula: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  estadoCivil: string;
  tipoPostulante: string;
  carrera: string;
  trimestre: number;
  iaa?: number;
  promedioBachillerato?: number;
  asignaturasAprobadas?: number;
  creditosInscritos?: number;
  tipoBeca: string;
  estado: "Pendiente" | "Aprobada" | "Rechazada" | "En Revisión";
  fechaPostulacion: string;
  documentos: Array<{
    tipo: string;
    nombre: string;
    url: string;
    path: string;
  }>;
  observaciones?: string;
}

const GestionPostulaciones = () => {
  const { tokens } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBeca, setFilterBeca] = useState("todos");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [filterPeriodo, setFilterPeriodo] = useState("todos");
  const [sortBy, setSortBy] = useState<"fecha" | "prioridad">("fecha");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedPostulacion, setSelectedPostulacion] = useState<Postulacion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [checklist, setChecklist] = useState<{[key: string]: boolean}>({});

  // Función para descargar un documento con autenticación
  const handleDescargarDocumento = async (documentoUrl: string, nombreDocumento: string) => {
    try {
      console.log('🔽 INICIO - Descargando documento:', {
        url: documentoUrl,
        nombre: nombreDocumento,
        urlCompleta: documentoUrl
      });

      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) {
        toast({
          title: "Error de autenticación",
          description: "No se encontró token de acceso",
          variant: "destructive"
        });
        return;
      }

      console.log('🔑 Token disponible, haciendo fetch...');

      // Hacer fetch con el token de autenticación
      const response = await fetch(documentoUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      console.log('📡 Respuesta recibida:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url
      });

      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "Archivo no encontrado",
            description: "El archivo físico no existe en el servidor. Contacta al administrador del sistema.",
            variant: "destructive",
            duration: 7000
          });
          throw new Error(`Archivo no encontrado en el servidor (404)`);
        }
        throw new Error(`Error al descargar: ${response.status}`);
      }

      // Crear blob y descargarlo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nombreDocumento;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Documento descargado",
        description: `${nombreDocumento} descargado exitosamente`,
      });
    } catch (error: any) {
      console.error('Error descargando documento:', error);
      toast({
        title: "Error al descargar",
        description: error.message || "No se pudo descargar el documento",
        variant: "destructive"
      });
    }
  };

  // Función para cargar postulaciones del API
  const loadPostulaciones = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      // Solicitar todas las postulaciones, incluyendo las que no tienen usuarioId
      const response = await fetch(`${API_BASE}/v1/postulaciones?includeAll=true`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error al cargar postulaciones (${response.status})`);
      }

      const data = await response.json();
      const postulacionesRaw = data.data?.postulaciones || data.postulaciones || [];

      // Limpiar y convertir los datos para asegurar tipos correctos
      const postulacionesLimpias = postulacionesRaw.map((post: any) => ({
        ...post,
        iaa: post.iaa ? parseFloat(post.iaa) : undefined,
        promedioBachillerato: post.promedioBachillerato ? parseFloat(post.promedioBachillerato) : undefined,
        creditosInscritos: post.creditosInscritos ? parseInt(post.creditosInscritos) : undefined,
        asignaturasAprobadas: post.asignaturasAprobadas ? parseInt(post.asignaturasAprobadas) : undefined,
        trimestre: post.trimestre ? parseInt(post.trimestre) || 0 : 0, // Convertir a número, 0 si no es válido
      }));

      console.log('Postulaciones originales:', postulacionesRaw);
      console.log('Postulaciones limpias:', postulacionesLimpias);

      // 🔧 FIX: Enriquecer postulaciones con documentos reales de la BD
      // El campo JSON "documentos" del endpoint /v1/postulaciones tiene un bug del backend
      // Usamos el endpoint /v1/documents/public/postulacion/:id que consulta la tabla real
      const postulacionesConDocumentos = await Promise.all(
        postulacionesLimpias.map(async (post: any) => {
          try {
            const docsResponse = await fetch(`${API_BASE}/v1/documents/public/postulacion/${post.id}`);
            if (docsResponse.ok) {
              const docsData = await docsResponse.json();
              const documentosReales = docsData.data?.documentos || [];

              // Mapear documentos al formato esperado por la interfaz
              const documentosMapeados = documentosReales.map((doc: any) => {
                // Usar la URL de descarga que ya viene del backend con el ID correcto
                const downloadUrl = doc.urlDescarga || doc.url;
                const fullUrl = downloadUrl.startsWith('http')
                  ? downloadUrl
                  : `https://srodriguez.intelcondev.org${downloadUrl}`;

                console.log('📄 Mapeando documento para postulación:', {
                  documentoId: doc.id,
                  tipoDocumento: doc.tipoDocumento,
                  nombreOriginal: doc.nombreOriginal,
                  url_original: doc.url,
                  urlDescarga: doc.urlDescarga,
                  fullUrl: fullUrl,
                  tamano: doc.tamano,
                  fechaSubida: doc.fechaSubida
                });

                return {
                  id: doc.id, // ← IMPORTANTE: Guardar el ID del documento
                  tipo: doc.tipoDocumento,
                  nombre: doc.nombreOriginal,
                  url: fullUrl, // URL completa para fetch con el ID correcto del documento
                  path: doc.url,
                  tamano: doc.tamano,
                  fechaSubida: doc.fechaSubida
                };
              });

              return {
                ...post,
                documentos: documentosMapeados
              };
            }
          } catch (error) {
            console.error(`Error cargando documentos para postulación ${post.id}:`, error);
          }

          // Si falla, retornar con documentos vacíos
          return post;
        })
      );

      console.log('✅ Postulaciones enriquecidas con documentos:', postulacionesConDocumentos);

      setPostulaciones(postulacionesConDocumentos);
    } catch (err: any) {
      setError(err.message || "Error al cargar las postulaciones");
      toast({
        title: "Error",
        description: err.message || "No se pudieron cargar las postulaciones",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar postulaciones al montar el componente
  useEffect(() => {
    loadPostulaciones();
  }, []);

  // Función para obtener checklist según tipo de beca
  const getChecklistForBeca = (tipoBeca: string) => {
    const checklistMap: {[key: string]: string[]} = {
      "Excelencia": [
        "cumple_iaa_minimo",
        "documentos_completos",
        "curriculum_actualizado",
        "carta_motivacion_clara",
        "evidencia_logros"
      ],
      "Ayudantía": [
        "cumple_iaa_minimo",
        "documentos_completos",
        "disponibilidad_horaria",
        "habilidades_comunicacion",
        "area_conocimiento"
      ],
      "Formación Docente": [
        "cumple_iaa_minimo",
        "documentos_completos",
        "interes_docencia",
        "capacidad_pedagogica",
        "compromiso_programa"
      ]
    };

    return checklistMap[tipoBeca] || [
      "cumple_iaa_minimo",
      "documentos_completos",
      "informacion_veraz"
    ];
  };

  // Función para obtener etiquetas de checklist
  const getChecklistLabel = (key: string): string => {
    const labels: {[key: string]: string} = {
      "cumple_iaa_minimo": "Cumple con el IAA mínimo requerido (≥ 14.0)",
      "documentos_completos": "Todos los documentos requeridos están presentes",
      "curriculum_actualizado": "Currículum actualizado y completo",
      "carta_motivacion_clara": "Carta de motivación clara y coherente",
      "evidencia_logros": "Evidencias de logros académicos/deportivos/artísticos",
      "disponibilidad_horaria": "Disponibilidad horaria compatible",
      "habilidades_comunicacion": "Demuestra habilidades de comunicación",
      "area_conocimiento": "Dominio del área de conocimiento",
      "interes_docencia": "Interés genuino en la docencia",
      "capacidad_pedagogica": "Capacidad pedagógica y didáctica",
      "compromiso_programa": "Compromiso con el programa de formación",
      "informacion_veraz": "Información veraz y verificable"
    };
    return labels[key] || key;
  };

  const handleVerDetalles = (postulacion: Postulacion) => {
    setSelectedPostulacion(postulacion);
    setMotivoRechazo(""); // Limpiar motivo al abrir modal

    // Inicializar checklist en false
    const checklistItems = getChecklistForBeca(postulacion.tipoBeca);
    const initialChecklist: {[key: string]: boolean} = {};
    checklistItems.forEach(item => {
      initialChecklist[item] = false;
    });
    setChecklist(initialChecklist);

    setIsModalOpen(true);
  };

  const toggleChecklistItem = (key: string) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Función para cancelar una postulación
  const handleCancelarPostulacion = async (postulacionId: string) => {
    try {
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      const response = await fetch(`${API_BASE}/v1/postulaciones/${postulacionId}/cancelar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error al cancelar postulación:', errorData);
        throw new Error(errorData?.message || `Error al cancelar postulación (${response.status})`);
      }

      toast({
        title: "Postulación cancelada",
        description: "La postulación ha sido cancelada exitosamente"
      });

      // Recargar las postulaciones para reflejar el cambio
      await loadPostulaciones();
      
      // Cerrar el modal si está abierto
      setIsModalOpen(false);
      setSelectedPostulacion(null);

    } catch (err: any) {
      console.error('Error completo al cancelar postulación:', err);
      toast({
        title: "Error del Servidor",
        description: "Error interno del servidor. Por favor, intente nuevamente o contacte al administrador.",
        variant: "destructive"
      });
    }
  };

  // Función para aprobar una postulación
  const handleAprobarPostulacion = async (postulacionId: string, observaciones: string = "Cumple todos los requisitos") => {
    try {
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      // Log de datos que se van a enviar
      // WORKAROUND: Enviar horasRequeridas para evitar error de validación del backend
      // El backend requiere horasRequeridas >= 1, pero por ahora no diferencia por tipoBeca
      const requestBody = {
        observaciones: observaciones,
        horasRequeridas: 120 // Temporal: el backend valida min: 1, enviar 120 como default
      };
      
      console.log('=== LOG APROBAR POSTULACIÓN ===');
      console.log('Postulación ID:', postulacionId);
      console.log('Request Body:', requestBody);
      console.log('URL:', `${API_BASE}/v1/postulaciones/${postulacionId}/aprobar`);
      
      // Log de la postulación seleccionada para ver sus datos
      if (selectedPostulacion) {
        console.log('Datos de la postulación seleccionada:', selectedPostulacion);
        console.log('Datos académicos de la postulación:');
        console.log('- IAA (iaa):', selectedPostulacion.iaa);
        console.log('- Trimestre (string):', selectedPostulacion.trimestre);
        console.log('- Créditos inscritos:', selectedPostulacion.creditosInscritos);
        console.log('- Asignaturas aprobadas:', selectedPostulacion.asignaturasAprobadas);
        console.log('- Promedio bachillerato:', selectedPostulacion.promedioBachillerato);
        
        // Verificar tipos de datos
        console.log('Verificación de tipos:');
        console.log('- iaa es number?', typeof selectedPostulacion.iaa === 'number');
        console.log('- trimestre es string?', typeof selectedPostulacion.trimestre === 'string');
        console.log('- creditosInscritos es number?', typeof selectedPostulacion.creditosInscritos === 'number');
        console.log('- asignaturasAprobadas es number?', typeof selectedPostulacion.asignaturasAprobadas === 'number');
        console.log('- promedioBachillerato es number?', typeof selectedPostulacion.promedioBachillerato === 'number');
      }

      const response = await fetch(`${API_BASE}/v1/postulaciones/${postulacionId}/aprobar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('=== ERROR AL APROBAR POSTULACIÓN ===');
        console.error('Status:', response.status);
        console.error('Error Data:', errorData);
        console.error('Response Headers:', Object.fromEntries(response.headers.entries()));
        throw new Error(errorData?.message || `Error al aprobar postulación (${response.status})`);
      }

      // Log de respuesta exitosa
      const successData = await response.json().catch(() => null);
      console.log('=== RESPUESTA EXITOSA ===');
      console.log('Success Data:', successData);

      // Si el backend creó un usuario, aprobarlo automáticamente
      const newUserId = successData?.data?.usuario?.id || successData?.data?.usuarioId;
      if (newUserId) {
        console.log('🔄 Auto-aprobando usuario con ID:', newUserId);
        try {
          await approveUser(newUserId, accessToken);
          console.log('✅ Usuario aprobado automáticamente');
          toast({
            title: "Postulación aprobada",
            description: "La postulación y el usuario han sido aprobados exitosamente. El estudiante ya puede iniciar sesión."
          });
        } catch (approveError: any) {
          console.error('❌ Error al auto-aprobar usuario:', approveError);
          toast({
            title: "Postulación aprobada",
            description: "La postulación fue aprobada, pero hubo un error al aprobar automáticamente el usuario. Deberá aprobarse manualmente.",
            variant: "default"
          });
        }
      } else {
        toast({
          title: "Postulación aprobada",
          description: "La postulación ha sido aprobada exitosamente"
        });
      }

      // Recargar las postulaciones para reflejar el cambio
      await loadPostulaciones();

      // Cerrar el modal si está abierto
      setIsModalOpen(false);
      setSelectedPostulacion(null);

    } catch (err: any) {
      console.error('Error completo al aprobar postulación:', err);
      toast({
        title: "Error del Servidor",
        description: "Error interno del servidor. Por favor, intente nuevamente o contacte al administrador.",
        variant: "destructive"
      });
    }
  };

  // Función para rechazar una postulación
  const handleRechazarPostulacion = async (postulacionId: string) => {
    if (!motivoRechazo.trim()) {
      toast({
        title: "Error",
        description: "Debe ingresar un motivo para el rechazo",
        variant: "destructive"
      });
      return;
    }

    try {
      const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
      if (!accessToken) {
        throw new Error("No hay token de acceso");
      }

      const response = await fetch(`${API_BASE}/v1/postulaciones/${postulacionId}/rechazar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          motivoRechazo: motivoRechazo.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Error al rechazar postulación (${response.status})`);
      }

      toast({
        title: "Postulación rechazada",
        description: "La postulación ha sido rechazada exitosamente"
      });

      // Recargar las postulaciones para reflejar el cambio
      await loadPostulaciones();
      
      // Cerrar el modal si está abierto
      setIsModalOpen(false);
      setSelectedPostulacion(null);
      setMotivoRechazo("");

    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "No se pudo rechazar la postulación",
        variant: "destructive"
      });
    }
  };

  // Datos mock eliminados - ahora se cargan del API
  const mockPostulaciones: Postulacion[] = [
    {
      id: "1",
      nombre: "Roberto Silva Martínez",
      cedula: "V-23456789",
      carrera: "Ingeniería Civil",
      semestre: 7,
      promedio: 18.2,
      tipoBeca: "Excelencia Académica",
      estado: "Pendiente",
      fechaPostulacion: "2024-12-15",
      documentos: ["Certificado de notas", "Carta de motivación", "CV", "Fotocopia de cédula"],
      observaciones: "Cumple con todos los requisitos académicos",
      correoElectronico: "roberto.silva@email.com",
      telefono: "+57 301 234 5678",
      fechaNacimiento: "1997-05-20",
      estadoCivil: "Soltero",
      tipoPostulante: "Estudiante regular de pregrado",
      iaa: 18.2,
      asignaturasAprobadas: 42,
      creditosInscritos: 15
    },
    {
      id: "2",
      nombre: "Sofía Ramírez González",
      cedula: "V-34567890",
      carrera: "Psicología",
      semestre: 6,
      promedio: 17.8,
      tipoBeca: "Impacto Social",
      estado: "En Revisión",
      fechaPostulacion: "2024-12-10",
      documentos: ["Certificado de notas", "Proyecto social", "Cartas de referencia"]
    },
    {
      id: "3",
      nombre: "Miguel Torres López",
      cedula: "V-45678901",
      carrera: "Administración",
      semestre: 8,
      promedio: 19.1,
      tipoBeca: "Ayudantía",
      estado: "Aprobada",
      fechaPostulacion: "2024-12-05",
      documentos: ["Certificado de notas", "Carta de recomendación", "Portafolio"]
    },
    {
      id: "4",
      nombre: "Elena Vargas Castro",
      cedula: "V-56789012",
      carrera: "Derecho",
      semestre: 5,
      promedio: 16.5,
      tipoBeca: "Excelencia Académica",
      estado: "Rechazada",
      fechaPostulacion: "2024-12-01",
      documentos: ["Certificado de notas", "Carta de motivación"],
      observaciones: "No cumple con el promedio mínimo requerido"
    }
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>;
      case "En Revisión":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">En Revisión</Badge>;
      case "Aprobada":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Aprobada</Badge>;
      case "Rechazada":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rechazada</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  // Extraer períodos únicos de las postulaciones
  const periodosDisponibles = Array.from(new Set(postulaciones.map(p => p.trimestre?.toString() || "N/A"))).sort();

  const filteredPostulaciones = postulaciones.filter(postulacion => {
    const matchesSearch = postulacion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         postulacion.cedula.includes(searchTerm) ||
                         postulacion.carrera.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBeca = filterBeca === "todos" || postulacion.tipoBeca === filterBeca;
    const matchesEstado = filterEstado === "todos" || postulacion.estado === filterEstado;
    const matchesPeriodo = filterPeriodo === "todos" || (postulacion.trimestre?.toString() || "N/A") === filterPeriodo;

    return matchesSearch && matchesBeca && matchesEstado && matchesPeriodo;
  });

  // Aplicar ordenamiento
  const sortedPostulaciones = [...filteredPostulaciones].sort((a, b) => {
    if (sortBy === "fecha") {
      const dateA = new Date(a.fechaPostulacion).getTime();
      const dateB = new Date(b.fechaPostulacion).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } else {
      // Ordenar por prioridad: Pendiente > En Revisión > Rechazada > Aprobada
      const prioridadMap: { [key: string]: number } = {
        "Pendiente": 1,
        "En Revisión": 2,
        "Rechazada": 3,
        "Aprobada": 4
      };
      const prioridadA = prioridadMap[a.estado] || 999;
      const prioridadB = prioridadMap[b.estado] || 999;
      return sortOrder === "asc" ? prioridadA - prioridadB : prioridadB - prioridadA;
    }
  });

  const estadisticas = {
    total: postulaciones.length,
    pendientes: postulaciones.filter(p => p.estado === "Pendiente").length,
    enRevision: postulaciones.filter(p => p.estado === "En Revisión").length,
    aprobadas: postulaciones.filter(p => p.estado === "Aprobada").length,
    rechazadas: postulaciones.filter(p => p.estado === "Rechazada").length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-primary">Gestión de Postulaciones</h2>
          <p className="text-muted-foreground">Revisión y aprobación de postulaciones a becas</p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            {/* Primera fila: Búsqueda y filtros principales */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, cédula o carrera..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterBeca} onValueChange={setFilterBeca}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tipo de Beca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las Becas</SelectItem>
                  <SelectItem value="Excelencia Académica">Excelencia Académica</SelectItem>
                  <SelectItem value="Ayudantía">Ayudantía</SelectItem>
                  <SelectItem value="Impacto Social">Impacto Social</SelectItem>
                  <SelectItem value="Formación Docente">Formación Docente</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Pendiente">Pendiente</SelectItem>
                  <SelectItem value="En Revisión">En Revisión</SelectItem>
                  <SelectItem value="Aprobada">Aprobada</SelectItem>
                  <SelectItem value="Rechazada">Rechazada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Segunda fila: Filtro de período y ordenamiento */}
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={filterPeriodo} onValueChange={setFilterPeriodo}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Período Académico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los Períodos</SelectItem>
                  {periodosDisponibles.map((periodo) => (
                    <SelectItem key={periodo} value={periodo}>
                      {periodo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value) => setSortBy(value as "fecha" | "prioridad")}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fecha">Fecha de recepción</SelectItem>
                  <SelectItem value="prioridad">Prioridad</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Orden" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">{sortBy === "fecha" ? "Más reciente" : "Mayor prioridad"}</SelectItem>
                  <SelectItem value="asc">{sortBy === "fecha" ? "Más antigua" : "Menor prioridad"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{estadisticas.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{estadisticas.pendientes}</p>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{estadisticas.enRevision}</p>
              <p className="text-sm text-muted-foreground">En Revisión</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{estadisticas.aprobadas}</p>
              <p className="text-sm text-muted-foreground">Aprobadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{estadisticas.rechazadas}</p>
              <p className="text-sm text-muted-foreground">Rechazadas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de postulaciones */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Postulaciones ({sortedPostulaciones.length})</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={loadPostulaciones}
              disabled={loading}
              className="border-orange/40 hover:bg-orange/10 hover:border-orange/60"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Recargar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Cargando postulaciones...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={loadPostulaciones} variant="outline">
                Reintentar
              </Button>
            </div>
          ) : (
          <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Postulante</TableHead>
                <TableHead>Carrera</TableHead>
                <TableHead>Trimestre</TableHead>
                <TableHead>IAA/Promedio</TableHead>
                <TableHead>Tipo de Beca</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPostulaciones.map((postulacion) => (
                <TableRow key={postulacion.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{postulacion.nombre}</p>
                      <p className="text-sm text-muted-foreground">{postulacion.cedula}</p>
                    </div>
                  </TableCell>
                  <TableCell>{postulacion.carrera}</TableCell>
                  <TableCell>{postulacion.trimestre}</TableCell>
                  <TableCell>
                    <span className="font-medium">{postulacion.iaa || postulacion.promedioBachillerato || 'N/A'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{postulacion.tipoBeca}</Badge>
                  </TableCell>
                  <TableCell>{getEstadoBadge(postulacion.estado)}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(postulacion.fechaPostulacion).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        title="Ver detalles"
                        onClick={() => handleVerDetalles(postulacion)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {postulacion.estado === "En Revisión" && (
                        <Button variant="ghost" size="sm" className="text-blue-600" title="En proceso">
                          <Clock className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalles de Postulación */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-primary">
              Detalles de la Postulación - {selectedPostulacion?.nombre}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPostulacion && (
            <div className="space-y-6">
              {/* Resumen de la Postulación */}
              <Card className="border-orange/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <User className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold">{selectedPostulacion.nombre}</h3>
                        <p className="text-sm text-muted-foreground">ID: {selectedPostulacion.id}</p>
                      </div>
                    </div>
                    {getEstadoBadge(selectedPostulacion.estado)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de Beca</p>
                      <p className="font-medium">{selectedPostulacion.tipoBeca}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha de Postulación</p>
                      <p className="font-medium">{new Date(selectedPostulacion.fechaPostulacion).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Promedio/IAA</p>
                      <p className="font-medium text-primary text-lg">{selectedPostulacion.iaa}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Carrera</p>
                      <p className="font-medium">{selectedPostulacion.carrera}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Datos Personales */}
                <Card className="border-orange/20">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-primary flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Datos Personales
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <Label className="text-sm text-muted-foreground">Nombre Completo</Label>
                        <p className="font-medium">{selectedPostulacion.nombre}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Cédula de Identidad</Label>
                        <p className="font-medium">{selectedPostulacion.cedula}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <Label className="text-sm text-muted-foreground">Correo Electrónico</Label>
                          <p className="font-medium">{selectedPostulacion.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <Label className="text-sm text-muted-foreground">Teléfono</Label>
                          <p className="font-medium">{selectedPostulacion.telefono}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <Label className="text-sm text-muted-foreground">Fecha de Nacimiento</Label>
                          <p className="font-medium">{selectedPostulacion.fechaNacimiento ? new Date(selectedPostulacion.fechaNacimiento).toLocaleDateString('es-ES') : 'No disponible'}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Estado Civil</Label>
                        <p className="font-medium">{selectedPostulacion.estadoCivil}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Datos Académicos */}
                <Card className="border-orange/20">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-primary flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Datos Académicos
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <Label className="text-sm text-muted-foreground">Tipo de Postulante</Label>
                        <p className="font-medium">{selectedPostulacion.tipoPostulante}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Carrera/Programa de estudios</Label>
                        <p className="font-medium">{selectedPostulacion.carrera}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Trimestre actual</Label>
                        <p className="font-medium">{selectedPostulacion.trimestre || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Índice Académico Acumulado (IAA)</Label>
                        <p className="font-medium text-primary text-lg">{selectedPostulacion.iaa}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Asignaturas Aprobadas</Label>
                        <p className="font-medium">{selectedPostulacion.asignaturasAprobadas}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Créditos Inscritos este Trimestre</Label>
                        <p className="font-medium">{selectedPostulacion.creditosInscritos}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Documentos */}
              <Card className="border-orange/20">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-primary flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Documentos de la Postulación
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedPostulacion.documentos.map((documento, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="font-medium">{documento.nombre}</span>
                            <p className="text-sm text-muted-foreground">{documento.tipo}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-800 border-green-200">Recibido</Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDescargarDocumento(documento.url, documento.nombre)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Descargar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Checklist de Requisitos */}
              <Card className="border-orange/20">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-primary flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Checklist de Verificación - {selectedPostulacion.tipoBeca}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Verificación sistemática de requisitos según el reglamento del programa
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getChecklistForBeca(selectedPostulacion.tipoBeca).map((item) => (
                      <div
                        key={item}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => toggleChecklistItem(item)}
                      >
                        <div className="flex-shrink-0">
                          {checklist[item] ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <label className="flex-1 text-sm font-medium cursor-pointer">
                          {getChecklistLabel(item)}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Progreso del checklist */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progreso de verificación</span>
                      <span className="font-semibold text-primary">
                        {Object.values(checklist).filter(v => v).length} / {Object.keys(checklist).length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(Object.values(checklist).filter(v => v).length / Object.keys(checklist).length) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Observaciones */}
              {selectedPostulacion.observaciones && (
                <Card className="border-orange/20">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-primary">Observaciones</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{selectedPostulacion.observaciones}</p>
                  </CardContent>
                </Card>
              )}

              {/* Acciones de la postulación */}
              {selectedPostulacion.estado === "Pendiente" && (
                <Card className="border-orange/20">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-primary">Acciones</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="motivo-rechazo" className="text-sm font-medium text-muted-foreground">
                        Motivo del rechazo (opcional)
                      </Label>
                      <textarea
                        id="motivo-rechazo"
                        value={motivoRechazo}
                        onChange={(e) => setMotivoRechazo(e.target.value)}
                        placeholder="Ingrese el motivo del rechazo si aplica..."
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md resize-none"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleAprobarPostulacion(selectedPostulacion.id)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Aprobar Postulación
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleCancelarPostulacion(selectedPostulacion.id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Rechazar Postulación
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestionPostulaciones;