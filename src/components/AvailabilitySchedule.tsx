import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, X, Save } from "lucide-react";

interface TimeSlot {
  time: string;
  [key: string]: string | boolean;
}

const AvailabilitySchedule = () => {
  const [schedule, setSchedule] = useState<TimeSlot[]>(() => {
    const timeSlots = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        timeSlots.push({
          time: timeString,
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
    return timeSlots;
  });

  const days = [
    { key: 'lunes', label: 'Lunes' },
    { key: 'martes', label: 'Martes' },
    { key: 'miercoles', label: 'Miércoles' },
    { key: 'jueves', label: 'Jueves' },
    { key: 'viernes', label: 'Viernes' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' },
  ];

  const handleSlotChange = (timeIndex: number, day: string, checked: boolean) => {
    setSchedule(prev => prev.map((slot, index) => 
      index === timeIndex ? { ...slot, [day]: checked } : slot
    ));
  };

  const handleClear = () => {
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
  };

  const handleSave = () => {
    // Here you would typically save to a backend
    console.log('Saving schedule:', schedule);
    // Show success message
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
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
            <Button 
              size="sm" 
              onClick={handleSave}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Save className="h-4 w-4 mr-1" />
              Guardar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4">
          Los bloques se muestran en intervalos de <strong>30min</strong>. Si usted selecciona 7:00 se considera que tiene disponibilidad de 7:00 a 7:30
        </div>
        
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
                        checked={slot[day.key] as boolean}
                        onCheckedChange={(checked) => 
                          handleSlotChange(timeIndex, day.key, checked as boolean)
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
      </CardContent>
    </Card>
  );
};

export default AvailabilitySchedule;