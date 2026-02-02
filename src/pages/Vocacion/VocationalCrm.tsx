import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Bell, MessageSquare, Mail, GraduationCap, Loader2, Megaphone, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { obtenerMisNotificaciones, type Notificacion } from "@/lib/api/notificaciones";
import { toast } from "sonner";

const vocationalBg = "https://www.unimet.edu.ve/wp-content/uploads/2021/03/MODULO-DE-AULAS-ahora-1030x687.jpg";

// Función auxiliar para obtener el ícono según el tipo de notificación
const getIconForType = (tipo: string) => {
  switch (tipo) {
    case 'evento':
      return <Calendar className="w-6 h-6 text-blue-500" />;
    case 'anuncio':
      return <Megaphone className="w-6 h-6 text-purple-500" />;
    case 'recordatorio':
      return <AlertCircle className="w-6 h-6 text-orange-500" />;
    case 'campana':
      return <Mail className="w-6 h-6 text-green-500" />;
    case 'mensaje':
      return <MessageSquare className="w-6 h-6 text-pink-500" />;
    default:
      return <Bell className="w-6 h-6 text-slate-500" />;
  }
};

// Función auxiliar para obtener el color de fondo según el tipo
const getBgColorForType = (tipo: string) => {
  switch (tipo) {
    case 'evento':
      return 'bg-blue-50';
    case 'anuncio':
      return 'bg-purple-50';
    case 'recordatorio':
      return 'bg-orange-50';
    case 'campana':
      return 'bg-green-50';
    case 'mensaje':
      return 'bg-pink-50';
    default:
      return 'bg-slate-50';
  }
};

// Función auxiliar para formatear fecha relativa
const formatearFechaRelativa = (fecha: string) => {
  const ahora = new Date();
  const fechaNotif = new Date(fecha);
  const diffMs = ahora.getTime() - fechaNotif.getTime();
  const diffMinutos = Math.floor(diffMs / (1000 * 60));
  const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutos < 60) {
    return diffMinutos <= 1 ? 'Hace 1 minuto' : `Hace ${diffMinutos} minutos`;
  } else if (diffHoras < 24) {
    return diffHoras === 1 ? 'Hace 1 hora' : `Hace ${diffHoras} horas`;
  } else if (diffDias === 1) {
    return 'Ayer';
  } else if (diffDias < 7) {
    return `Hace ${diffDias} días`;
  } else {
    return fechaNotif.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }
};

const VocationalCrm = () => {
  const { tokens } = useAuth();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarNotificaciones = async () => {
      if (!tokens?.accessToken) {
        setCargando(false);
        return;
      }

      try {
        const respuesta = await obtenerMisNotificaciones(tokens.accessToken, 20);
        setNotificaciones(respuesta.data.notificaciones);
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
        toast.error('No se pudieron cargar las notificaciones');
      } finally {
        setCargando(false);
      }
    };

    cargarNotificaciones();
  }, [tokens]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="relative bg-pink-50 border-b border-pink-100 py-12 overflow-hidden">
           <div 
             className="absolute inset-0 opacity-40 mix-blend-multiply"
             style={{ backgroundImage: `url(${vocationalBg})`, backgroundSize: 'cover' }}
           />
           <div className="container mx-auto px-4 relative z-10">
             <div className="flex flex-col md:flex-row justify-between items-center gap-6">
               <div>
                 <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-200 mb-4">Módulo 4: CRM Estudiantil</Badge>
                 <h1 className="text-4xl font-bold text-slate-900 mb-2">Centro de Novedades</h1>
                 <p className="text-slate-600 max-w-xl">
                   Mantente al día con notificaciones personalizadas, eventos exclusivos y comunicación directa con la universidad.
                 </p>
               </div>
               <div className="flex gap-4">
                 <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-6">
                   <Mail className="w-4 h-4 mr-2" /> Contactar Soporte
                 </Button>
               </div>
             </div>
           </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Notifications Feed */}
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-pink-500" />
                Tus Notificaciones
                {notificaciones.length > 0 && (
                  <Badge className="ml-2 bg-pink-100 text-pink-700">
                    {notificaciones.filter(n => !n.leida).length}
                  </Badge>
                )}
              </h2>

              {cargando ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
                </div>
              ) : notificaciones.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
                  <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="font-bold text-slate-900 mb-2">No tienes notificaciones</h3>
                  <p className="text-slate-500 text-sm">
                    Las notificaciones sobre eventos y anuncios aparecerán aquí.
                  </p>
                </div>
              ) : (
                notificaciones.map((notif, index) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-2xl p-6 shadow-sm border flex gap-4 ${
                      notif.leida ? 'border-slate-100' : 'border-pink-200 bg-pink-50/30'
                    }`}
                  >
                    <div className={`w-12 h-12 ${getBgColorForType(notif.tipo)} rounded-full flex items-center justify-center shrink-0`}>
                      {getIconForType(notif.tipo)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-900">{notif.titulo}</h3>
                        <span className="text-xs text-slate-400">
                          {formatearFechaRelativa(notif.fecha_creacion)}
                        </span>
                      </div>
                      <div
                        className="text-slate-600 text-sm mb-3 prose prose-sm max-w-none
                          prose-p:my-1 prose-ul:my-1 prose-li:my-0"
                        dangerouslySetInnerHTML={{ __html: notif.contenido }}
                      />
                      {notif.metadata?.url && notif.metadata?.cta && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => window.open(notif.metadata?.url, '_blank')}
                        >
                          {notif.metadata.cta}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Sidebar Events */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Próximos Eventos</h2>
              
              <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
                <div className="h-2 bg-pink-500 w-full" />
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-center px-3 py-1 bg-slate-100 rounded-lg">
                      <div className="text-xs font-bold text-slate-500 uppercase">DIC</div>
                      <div className="text-xl font-bold text-slate-900">15</div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">Webinar: El Futuro del Trabajo</h3>
                      <span className="text-xs text-slate-500">10:00 AM - Zoom</span>
                    </div>
                  </div>
                  <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-full text-sm">Inscribirse</Button>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
                <div className="h-2 bg-blue-500 w-full" />
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-center px-3 py-1 bg-slate-100 rounded-lg">
                      <div className="text-xs font-bold text-slate-500 uppercase">ENE</div>
                      <div className="text-xl font-bold text-slate-900">20</div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">Visita al Campus</h3>
                      <span className="text-xs text-slate-500">09:00 AM - Presencial</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full rounded-full text-sm">Ver Detalles</Button>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>

      {/* Footer */}
      <footer className="bg-card border-t border-orange/20 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-bold text-primary">Universidad Metropolitana</span>
          </div>
          <p className="text-muted-foreground">
            © 2025 Universidad Metropolitana. Sistema Multiplataforma.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default VocationalCrm;
