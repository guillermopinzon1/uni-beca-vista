import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, X, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { API_BASE } from "@/lib/api";

type DayKey = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';
type DayFlags = Record<DayKey, boolean>;

interface TimeSlot extends DayFlags {
  time: string;
  timeValue: string;
}

interface DisponibilidadData {
  lunes: string[];
  martes: string[];
  miercoles: string[];
  jueves: string[];
  viernes: string[];
  sabado: string[];
  domingo: string[];
}

const AvailabilitySchedule = () => {
  const { toast } = useToast();
  const { tokens } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState<{ totalBloques?: number; diasActivos?: number; primerBloque?: string; ultimoBloque?: string } | null>(null);

  // Generar bloques de 30 minutos desde 06:00 hasta 22:00
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endHour = minute === 30 ? hour + 1 : hour;
        const endMinute = minute === 30 ? 0 : 30;
        const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
        
        slots.push({
          time: `${startTime} - ${endTime}`,
          timeValue: startTime,
          lunes: false,
          martes: false,
          miercoles: false,
          jueves: false,
          viernes: false,
          sabado: false,
          domingo: false,
        });
      }
    }
    return slots;
  };

  const [schedule, setSchedule] = useState<TimeSlot[]>(generateTimeSlots());

  const days: { key: DayKey; label: string }[] = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miércoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' },
  ];

  // Cargar disponibilidad existente
  const loadAvailability = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;
    if (!accessToken) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/v1/disponibilidad/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.disponibilidad) {
          // Mapear la disponibilidad del backend al estado local
          const disponibilidad = data.data.disponibilidad;
          setSchedule(prev => prev.map(slot => {
            const timeValue = slot.timeValue;
            return {
              ...slot,
              lunes: disponibilidad.lunes?.includes(timeValue) || false,
              martes: disponibilidad.martes?.includes(timeValue) || false,
              miercoles: disponibilidad.miercoles?.includes(timeValue) || false,
              jueves: disponibilidad.jueves?.includes(timeValue) || false,
              viernes: disponibilidad.viernes?.includes(timeValue) || false,
              sabado: disponibilidad.sabado?.includes(timeValue) || false,
              domingo: disponibilidad.domingo?.includes(timeValue) || false,
            };
          }));
        }
      } else if (response.status === 404) {
        // No hay disponibilidad guardada, mantener estado inicial
        console.log('No hay disponibilidad guardada');
      }
    } catch (error) {
      console.error('Error loading availability:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la disponibilidad",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar estadísticas personales
  const loadStats = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;
    if (!accessToken) return;
    try {
      const resp = await fetch(`${API_BASE}/v1/disponibilidad/me/stats`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });
      if (!resp.ok) return;
      const data = await resp.json();
      const s = data?.data || {};
      setStats({
        totalBloques: s.totalBloques,
        diasActivos: s.diasActivos,
        primerBloque: s.primerBloque,
        ultimoBloque: s.ultimoBloque,
      });
    } catch {}
  };

  // Cargar disponibilidad al montar el componente
  useEffect(() => {
    loadAvailability();
    loadStats();
  }, []);

  const handleSlotChange = async (timeIndex: number, day: DayKey, checked: boolean) => {
    setSchedule(prev => {
      const newSchedule = prev.map((slot, index) => 
      index === timeIndex ? { ...slot, [day]: checked } : slot
      );

      // Verificar si no hay ningún horario seleccionado después del cambio
      const hasAnySelection = newSchedule.some(slot => 
        slot.lunes || slot.martes || slot.miercoles || slot.jueves || 
        slot.viernes || slot.sabado || slot.domingo
      );

      // Si no hay ninguna selección, eliminar la disponibilidad del backend
      if (!hasAnySelection) {
        deleteAvailability();
      }

      return newSchedule;
    });
  };

  // Función auxiliar para eliminar disponibilidad
  const deleteAvailability = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;
    if (!accessToken) return;

    setDeleting(true);
    try {
      const response = await fetch(`${API_BASE}/v1/disponibilidad`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Disponibilidad eliminada automáticamente');
      }
    } catch (error) {
      console.error('Error deleting availability:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleClear = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;
    if (!accessToken) {
      toast({
        title: "Error",
        description: "No se encontró token de autenticación",
        variant: "destructive",
      });
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`${API_BASE}/v1/disponibilidad`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        // Limpiar el estado local
    setSchedule(prev => prev.map(slot => ({
      ...slot,
      lunes: false,
      martes: false,
      miercoles: false,
      jueves: false,
      viernes: false,
      sabado: false,
      domingo: false,
    })));

        toast({
          title: "Éxito",
          description: "Disponibilidad eliminada correctamente",
        });
      } else {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `Error al eliminar la disponibilidad (${response.status})`;
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Error deleting availability:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la disponibilidad",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    const accessToken = tokens?.accessToken || JSON.parse(localStorage.getItem('auth_tokens') || '{}')?.accessToken;
    if (!accessToken) {
      toast({
        title: "Error",
        description: "No se encontró token de autenticación",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      // Convertir el estado local al formato esperado por el backend
      const disponibilidad: DisponibilidadData = {
        lunes: [],
        martes: [],
        miercoles: [],
        jueves: [],
        viernes: [],
        sabado: [],
        domingo: [],
      };

      schedule.forEach(slot => {
        if (slot.lunes) disponibilidad.lunes.push(slot.timeValue);
        if (slot.martes) disponibilidad.martes.push(slot.timeValue);
        if (slot.miercoles) disponibilidad.miercoles.push(slot.timeValue);
        if (slot.jueves) disponibilidad.jueves.push(slot.timeValue);
        if (slot.viernes) disponibilidad.viernes.push(slot.timeValue);
        if (slot.sabado) disponibilidad.sabado.push(slot.timeValue);
        if (slot.domingo) disponibilidad.domingo.push(slot.timeValue);
      });

      const response = await fetch(`${API_BASE}/v1/disponibilidad`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ disponibilidad }),
      });

      if (response.ok) {
        toast({
          title: "Éxito",
          description: "Disponibilidad guardada correctamente",
        });
      } else {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || `Error al guardar la disponibilidad (${response.status})`;
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Error saving availability:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo guardar la disponibilidad",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-orange/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-primary flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Horario de Disponibilidad
            </CardTitle>
            <CardDescription>
              Horas disponibles según día(s) de la semana
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClear}
              className="text-destructive hover:text-destructive"
              disabled={loading || saving || deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
              <X className="h-4 w-4 mr-1" />
              Limpiar
                </>
              )}
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
              className="bg-gradient-primary hover:opacity-90"
              disabled={loading || saving || deleting}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
              <Save className="h-4 w-4 mr-1" />
              Guardar
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4">
          Selecciona los bloques de 30 minutos en los que tienes disponibilidad. Los horarios van desde las 06:00 hasta las 22:00.
        </div>
        
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span className="text-muted-foreground">Cargando disponibilidad...</span>
          </div>
        )}
        
        {!loading && (
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-8 gap-1 mb-2">
              <div className="text-sm font-medium text-center py-2"></div>
              {days.map(day => (
                <div key={day.key} className="text-sm font-medium text-center py-2 text-primary">
                  {day.label}
                </div>
              ))}
            </div>

            {/* Time slots grid */}
            <div className="space-y-1">
              {schedule.map((slot, timeIndex) => (
                <div key={slot.time} className="grid grid-cols-8 gap-1">
                  <div className="text-sm text-right py-2 text-muted-foreground font-mono">
                    {slot.time}
                  </div>
                  {days.map(day => (
                    <div key={day.key} className="flex items-center justify-center">
                      <Checkbox
                        checked={slot[day.key]}
                        onCheckedChange={(checked) => 
                          handleSlotChange(timeIndex, day.key, Boolean(checked))
                        }
                        className="h-6 w-6 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailabilitySchedule;