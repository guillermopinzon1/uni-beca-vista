import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Calendar, Bell, MessageSquare, Mail, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const vocationalBg = "https://www.unimet.edu.ve/wp-content/uploads/2021/03/MODULO-DE-AULAS-ahora-1030x687.jpg";

const VocationalCrm = () => {

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
              </h2>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-4"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-900">Feria de Carreras 2025</h3>
                    <span className="text-xs text-slate-400">Hace 2 horas</span>
                  </div>
                  <p className="text-slate-600 text-sm mb-3">
                    Basado en tus intereses en Ingeniería, te invitamos a la charla de apertura de la Facultad de Ingeniería.
                  </p>
                  <Button variant="outline" size="sm" className="rounded-full text-blue-600 border-blue-200 hover:bg-blue-50">
                    Ver Agenda
                  </Button>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-4"
              >
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center shrink-0">
                  <Star className="w-6 h-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-900">Nuevos Cursos Electivos</h3>
                    <span className="text-xs text-slate-400">Ayer</span>
                  </div>
                  <p className="text-slate-600 text-sm mb-3">
                    Se han abierto cupos para "Introducción a la IA", compatible con tu perfil tecnológico.
                  </p>
                  <Button variant="outline" size="sm" className="rounded-full text-purple-600 border-purple-200 hover:bg-purple-50">
                    Más Información
                  </Button>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-4"
              >
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center shrink-0">
                  <MessageSquare className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-900">Recordatorio de Cita</h3>
                    <span className="text-xs text-slate-400">Hace 2 días</span>
                  </div>
                  <p className="text-slate-600 text-sm mb-3">
                    Recuerda completar tu perfil antes de tu cita con el orientador vocacional.
                  </p>
                </div>
              </motion.div>
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
