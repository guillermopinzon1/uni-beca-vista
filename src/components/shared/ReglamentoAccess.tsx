import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, ExternalLink } from 'lucide-react';

interface ReglamentoAccessProps {
  becaType: 'excelencia' | 'impacto' | 'exoneracion' | 'ayudantia' | 'formacion-docente';
}

const ReglamentoAccess: React.FC<ReglamentoAccessProps> = ({ becaType }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/documents/reglamento-becas-2025.pdf';
    link.download = 'Reglamento-Becas-UNIMET-2025.pdf';
    link.click();
  };

  const handleView = () => {
    window.open('/documents/reglamento-becas-2025.pdf', '_blank');
  };

  const getBecaInfo = () => {
    switch (becaType) {
      case 'excelencia':
        return {
          title: 'REGLAMENTO DEL PROGRAMA DE BENEFICIOS SOCIOECONÓMICOS Y BECAS DE LA UNIVERSIDAD METROPOLITANA',
          description: 'Consulta las normas específicas para la Beca de Excelencia Académica'
        };
      case 'impacto':
        return {
          title: 'REGLAMENTO DEL PROGRAMA DE BENEFICIOS SOCIOECONÓMICOS Y BECAS DE LA UNIVERSIDAD METROPOLITANA',
          description: 'Consulta las normas específicas para la Beca de Impacto Social'
        };
      case 'exoneracion':
        return {
          title: 'REGLAMENTO DEL PROGRAMA DE BENEFICIOS SOCIOECONÓMICOS Y BECAS DE LA UNIVERSIDAD METROPOLITANA',
          description: 'Consulta las normas específicas para la Exoneración de Aranceles'
        };
      case 'ayudantia':
        return {
          title: 'REGLAMENTO DEL PROGRAMA DE BENEFICIOS SOCIOECONÓMICOS Y BECAS DE LA UNIVERSIDAD METROPOLITANA',
          description: 'Consulta las normas específicas para el Programa de Ayudantías'
        };
      case 'formacion-docente':
        return {
          title: 'REGLAMENTO DEL PROGRAMA DE BENEFICIOS SOCIOECONÓMICOS Y BECAS DE LA UNIVERSIDAD METROPOLITANA',
          description: 'Consulta las normas específicas para la Beca de Formación Docente'
        };
      default:
        return {
          title: 'REGLAMENTO DEL PROGRAMA DE BENEFICIOS SOCIOECONÓMICOS Y BECAS DE LA UNIVERSIDAD METROPOLITANA',
          description: 'Consulta el reglamento general del programa de becas'
        };
    }
  };

  const { title, description } = getBecaInfo();

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground mb-3">
            Reglamento del Programa de Beneficios Socioeconómicos y Becas de la Universidad Metropolitana 2025
          </p>
          <div className="flex gap-2">
            <Button onClick={handleDownload} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Consulta los requisitos y condiciones específicas</p>
          <p>• Revisa los compromisos y responsabilidades</p>
          <p>• Conoce los procesos de renovación y seguimiento</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReglamentoAccess;