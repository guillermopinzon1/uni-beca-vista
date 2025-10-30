import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Settings, AlertCircle, CheckCircle, RefreshCw, Plus, X, Award, Users, GraduationCap, Shield, BookOpen } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchConfiguracionesBecas,
  createOrUpdateConfiguracionBeca,
  TipoBeca,
  SubtipoExcelencia,
  ConfiguracionBeca,
  CreateOrUpdateConfiguracionBecaRequest,
} from "@/lib/api/configuracion";
import { Badge } from "@/components/ui/badge";

const ConfiguracionBecas = () => {
  const { toast } = useToast();
  const { tokens } = useAuth();

  const [configuraciones, setConfiguraciones] = useState<ConfiguracionBeca[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TipoBeca>(TipoBeca.EXCELENCIA);
  const [selectedSubtipoExcelencia, setSelectedSubtipoExcelencia] = useState<SubtipoExcelencia | undefined>(
    SubtipoExcelencia.ACADEMICA
  );

  // Estados para el formulario
  const [formData, setFormData] = useState<CreateOrUpdateConfiguracionBecaRequest>({
    tipoBeca: TipoBeca.EXCELENCIA,
    subtipoExcelencia: SubtipoExcelencia.ACADEMICA,
    cuposDisponibles: null,
    duracionMeses: null,
    promedioMinimo: 15.0,
    semestreMinimo: 1,
    semestreMaximo: 12,
    edadMaxima: 30,
    requisitosEspeciales: "",
    documentosRequeridos: ["Cédula de identidad", "Certificado de notas"],
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    loadConfiguraciones();
  }, []);

  useEffect(() => {
    // Solo actualizar el formulario cuando cambia el tab o subtipo, NO cuando cambian las configuraciones durante la edición
    const config = findConfig(selectedTab, selectedSubtipoExcelencia);
    if (config) {
      setFormData({
        tipoBeca: config.tipoBeca,
        subtipoExcelencia: config.subtipoExcelencia,
        cuposDisponibles: config.cuposDisponibles,
        duracionMeses: config.duracionMeses,
        promedioMinimo: config.promedioMinimo,
        semestreMinimo: config.semestreMinimo,
        semestreMaximo: config.semestreMaximo,
        edadMaxima: config.edadMaxima,
        requisitosEspeciales: config.requisitosEspeciales || "",
        documentosRequeridos: config.documentosRequeridos,
      });
    } else {
      // Configuración por defecto para nuevo
      setFormData({
        tipoBeca: selectedTab,
        subtipoExcelencia: selectedTab === TipoBeca.EXCELENCIA ? selectedSubtipoExcelencia : undefined,
        cuposDisponibles: null,
        duracionMeses: null,
        promedioMinimo: 15.0,
        semestreMinimo: 1,
        semestreMaximo: 12,
        edadMaxima: 30,
        requisitosEspeciales: "",
        documentosRequeridos: ["Cédula de identidad", "Certificado de notas"],
      });
    }
    setHasChanges(false);
    setInitialLoadDone(true);
  }, [selectedTab, selectedSubtipoExcelencia]);

  const loadConfiguraciones = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) {
      toast({ title: 'Sin sesión', description: 'Inicia sesión para cargar configuraciones', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetchConfiguracionesBecas(accessToken);
      const newConfigs = response.data.configuraciones;
      setConfiguraciones(newConfigs);

      // Solo actualizar el formulario si no se ha hecho la carga inicial o si no hay cambios sin guardar
      if (!initialLoadDone || !hasChanges) {
        const config = newConfigs.find(
          (c) =>
            c.tipoBeca === selectedTab &&
            (selectedTab !== TipoBeca.EXCELENCIA || c.subtipoExcelencia === selectedSubtipoExcelencia)
        );

        if (config) {
          setFormData({
            tipoBeca: config.tipoBeca,
            subtipoExcelencia: config.subtipoExcelencia,
            cuposDisponibles: config.cuposDisponibles,
            duracionMeses: config.duracionMeses,
            promedioMinimo: config.promedioMinimo,
            semestreMinimo: config.semestreMinimo,
            semestreMaximo: config.semestreMaximo,
            edadMaxima: config.edadMaxima,
            requisitosEspeciales: config.requisitosEspeciales || "",
            documentosRequeridos: config.documentosRequeridos,
          });
          setHasChanges(false);
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudieron cargar las configuraciones',
        variant: 'destructive',
      });
      setConfiguraciones([]);
    } finally {
      setLoading(false);
    }
  };

  const findConfig = (tipoBeca: TipoBeca, subtipoExcelencia?: SubtipoExcelencia): ConfiguracionBeca | undefined => {
    return configuraciones.find(
      (c) =>
        c.tipoBeca === tipoBeca &&
        (tipoBeca !== TipoBeca.EXCELENCIA || c.subtipoExcelencia === subtipoExcelencia)
    );
  };

  const handleSave = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || 'null')?.accessToken;
    if (!accessToken) {
      toast({ title: 'Sin sesión', description: 'Inicia sesión para guardar cambios', variant: 'destructive' });
      return;
    }

    // Validaciones (cupos/duración pueden ser null por requerimiento)

    setSaving(true);
    try {
      // Preparar el payload, excluyendo subtipoExcelencia si no es tipo Excelencia
      const payload: CreateOrUpdateConfiguracionBecaRequest = {
        ...formData,
        subtipoExcelencia: formData.tipoBeca === TipoBeca.EXCELENCIA ? formData.subtipoExcelencia : undefined,
      };

      await createOrUpdateConfiguracionBeca(accessToken, payload);

      toast({
        title: 'Éxito',
        description: 'Configuración guardada exitosamente',
        className: "bg-green-50 border-green-200"
      });

      setHasChanges(false);
      await loadConfiguraciones();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo guardar la configuración',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFormChange = useCallback((field: keyof CreateOrUpdateConfiguracionBecaRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  }, []);

  const addDocumento = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      documentosRequeridos: [...prev.documentosRequeridos, ""],
    }));
    setHasChanges(true);
  }, []);

  const updateDocumento = useCallback((index: number, value: string) => {
    setFormData((prev) => {
      const newDocs = [...prev.documentosRequeridos];
      newDocs[index] = value;
      return { ...prev, documentosRequeridos: newDocs };
    });
    setHasChanges(true);
  }, []);

  const removeDocumento = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      documentosRequeridos: prev.documentosRequeridos.filter((_, i) => i !== index),
    }));
    setHasChanges(true);
  }, []);

  // Función para obtener el icono según el tipo de beca
  const getBecaIcon = (tipo: TipoBeca) => {
    switch (tipo) {
      case TipoBeca.EXCELENCIA:
        return Award;
      case TipoBeca.AYUDANTIA:
        return Users;
      case TipoBeca.IMPACTO:
        return GraduationCap;
      case TipoBeca.EXONERACION:
        return Shield;
      case TipoBeca.FORMACION_DOCENTE:
        return BookOpen;
      default:
        return Settings;
    }
  };

  // Función para obtener el color según el tipo de beca
  const getBecaColor = (tipo: TipoBeca) => {
    switch (tipo) {
      case TipoBeca.EXCELENCIA:
        return "from-yellow-400 to-orange-500";
      case TipoBeca.AYUDANTIA:
        return "from-blue-400 to-indigo-500";
      case TipoBeca.IMPACTO:
        return "from-green-400 to-emerald-500";
      case TipoBeca.EXONERACION:
        return "from-purple-400 to-violet-500";
      case TipoBeca.FORMACION_DOCENTE:
        return "from-teal-400 to-cyan-500";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  // Memorizar formulario para evitar re-renders innecesarios
  const configuracionForm = useMemo(() => {
    const config = findConfig(selectedTab, selectedSubtipoExcelencia);
    const BecaIcon = getBecaIcon(selectedTab);
    const gradientColor = getBecaColor(selectedTab);

    return (
      <div className="space-y-6">
        {/* Header con estado mejorado */}
        <Card className="border-0 shadow-md bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-800">
                  {selectedTab === TipoBeca.EXCELENCIA
                    ? `${selectedTab} - ${selectedSubtipoExcelencia}`
                    : selectedTab}
                </CardTitle>
                <CardDescription className="text-gray-500 text-sm mt-1">
                  {config
                    ? `Última actualización: ${new Date(config.updatedAt).toLocaleDateString('es-VE', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}`
                    : 'Nueva configuración - Aún no guardada'}
                </CardDescription>
              </div>
              <Button 
                onClick={handleSave} 
                disabled={!hasChanges || saving} 
                size="sm"
                className={`transition-all duration-200 ${
                  hasChanges 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {saving ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-3 w-3 mr-1" />
                    Guardar
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Información básica: removida por requerimiento (cupos/duración ahora null) */}

        {/* Requisitos académicos mejorados */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-emerald-600" />
              Requisitos Académicos
            </CardTitle>
            <CardDescription className="text-gray-600">
              Define los criterios académicos mínimos para la beca
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-2">
                <Label htmlFor="promedio" className="text-sm font-medium text-gray-700">
                  Promedio Mínimo (IAA)
                </Label>
                <Input
                  id="promedio"
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={formData.promedioMinimo}
                  onChange={(e) => handleFormChange('promedioMinimo', parseFloat(e.target.value) || 0)}
                  className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Ej: 15.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sem-min" className="text-sm font-medium text-gray-700">
                  Semestre Mínimo
                </Label>
                <Input
                  id="sem-min"
                  type="number"
                  min="1"
                  max="12"
                  value={formData.semestreMinimo}
                  onChange={(e) => handleFormChange('semestreMinimo', parseInt(e.target.value) || 1)}
                  className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Ej: 3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sem-max" className="text-sm font-medium text-gray-700">
                  Semestre Máximo
                </Label>
                <Input
                  id="sem-max"
                  type="number"
                  min="1"
                  max="12"
                  value={formData.semestreMaximo}
                  onChange={(e) => handleFormChange('semestreMaximo', parseInt(e.target.value) || 1)}
                  className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Ej: 10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edad" className="text-sm font-medium text-gray-700">
                  Edad Máxima
                </Label>
                <Input
                  id="edad"
                  type="number"
                  min="18"
                  max="50"
                  value={formData.edadMaxima}
                  onChange={(e) => handleFormChange('edadMaxima', parseInt(e.target.value) || 18)}
                  className="h-11 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="Ej: 25"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requisitos especiales mejorados */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Requisitos Especiales
            </CardTitle>
            <CardDescription className="text-gray-600">
              Especifica condiciones adicionales o criterios especiales
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              <Label htmlFor="especial" className="text-sm font-medium text-gray-700">
                Descripción de Requisitos Especiales
              </Label>
              <Textarea
                id="especial"
                value={formData.requisitosEspeciales}
                onChange={(e) => handleFormChange('requisitosEspeciales', e.target.value)}
                placeholder="Describe requisitos adicionales específicos para esta beca..."
                rows={4}
                className="border-gray-200 focus:border-amber-500 focus:ring-amber-500 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Documentos requeridos mejorados */}
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-violet-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-violet-600" />
                  Documentos Requeridos
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Lista de documentos necesarios para la postulación
                </CardDescription>
              </div>
              <Button 
                onClick={addDocumento} 
                variant="outline" 
                size="sm"
                className="border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Documento
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-2">
              {formData.documentosRequeridos.map((doc, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <Input
                      value={doc}
                      onChange={(e) => updateDocumento(index, e.target.value)}
                      placeholder="Nombre del documento requerido"
                      className="border-gray-200 focus:border-violet-500 focus:ring-violet-500 bg-white"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDocumento(index)}
                    disabled={formData.documentosRequeridos.length <= 1}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }, [selectedTab, selectedSubtipoExcelencia, configuraciones, formData, handleFormChange, addDocumento, updateDocumento, removeDocumento]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header principal mejorado */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-800">
              Configuración de Becas
            </h1>
            <p className="text-sm text-gray-500">
              Administra parámetros y requisitos para cada tipo de beca
            </p>
          </div>
        </div>

        {/* Tabs mejorados */}
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-0">
            <Tabs 
              value={selectedTab} 
              onValueChange={(value) => {
                setSelectedTab(value as TipoBeca);
                // Resetear subtipo cuando no es Excelencia
                if (value !== TipoBeca.EXCELENCIA) {
                  setSelectedSubtipoExcelencia(undefined);
                } else {
                  // Si es Excelencia y no hay subtipo seleccionado, usar el primero por defecto
                  if (!selectedSubtipoExcelencia) {
                    setSelectedSubtipoExcelencia(SubtipoExcelencia.ACADEMICA);
                  }
                }
              }} 
              className="w-full"
            >
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm border border-gray-200 rounded-lg">
                  <TabsTrigger 
                    value={TipoBeca.EXCELENCIA} 
                    className="flex items-center space-x-1 text-sm data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-lg rounded-lg transition-all duration-200"
                  >
                    <Award className="h-3 w-3" />
                    <span>Excelencia</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value={TipoBeca.AYUDANTIA} 
                    className="flex items-center space-x-1 text-sm data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-lg rounded-lg transition-all duration-200"
                  >
                    <Users className="h-3 w-3" />
                    <span>Ayudantía</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value={TipoBeca.IMPACTO} 
                    className="flex items-center space-x-1 text-sm data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-lg rounded-lg transition-all duration-200"
                  >
                    <GraduationCap className="h-3 w-3" />
                    <span>Impacto</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value={TipoBeca.EXONERACION} 
                    className="flex items-center space-x-1 text-sm data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-lg rounded-lg transition-all duration-200"
                  >
                    <Shield className="h-3 w-3" />
                    <span>Exoneración</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value={TipoBeca.FORMACION_DOCENTE} 
                    className="flex items-center space-x-1 text-sm data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-lg rounded-lg transition-all duration-200"
                  >
                    <BookOpen className="h-3 w-3" />
                    <span>Formación Docente</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value={TipoBeca.EXCELENCIA} className="mt-0">
                  <div className="mb-6">
                    <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Subtipo de Excelencia
                    </Label>
                    <Select
                      value={selectedSubtipoExcelencia}
                      onValueChange={(value) => setSelectedSubtipoExcelencia(value as SubtipoExcelencia)}
                    >
                      <SelectTrigger className="w-full h-12 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={SubtipoExcelencia.ACADEMICA}>Académica</SelectItem>
                        <SelectItem value={SubtipoExcelencia.DEPORTIVA}>Deportiva</SelectItem>
                        <SelectItem value={SubtipoExcelencia.ARTISTICA}>Artística</SelectItem>
                        <SelectItem value={SubtipoExcelencia.EMPRENDIMIENTO}>Emprendimiento</SelectItem>
                        <SelectItem value={SubtipoExcelencia.CIVICO}>Cívico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {configuracionForm}
                </TabsContent>

                <TabsContent value={TipoBeca.AYUDANTIA} className="mt-0">
                  {configuracionForm}
                </TabsContent>

                <TabsContent value={TipoBeca.IMPACTO} className="mt-0">
                  {configuracionForm}
                </TabsContent>

                <TabsContent value={TipoBeca.EXONERACION} className="mt-0">
                  {configuracionForm}
                </TabsContent>

                <TabsContent value={TipoBeca.FORMACION_DOCENTE} className="mt-0">
                  {configuracionForm}
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConfiguracionBecas;
