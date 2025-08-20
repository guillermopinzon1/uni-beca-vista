import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  buttonText?: string;
}

const ModuleCard = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  buttonText = "Acceder" 
}: ModuleCardProps) => {
  return (
    <Card 
      className="border-orange/20 bg-gradient-card hover:shadow-lg transition-all duration-300 cursor-pointer group" 
      onClick={onClick}
    >
      <CardHeader className="text-center">
        <div className="mx-auto p-3 rounded-full bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <CardDescription className="mb-6 min-h-[3rem] flex items-center justify-center">
          {description}
        </CardDescription>
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ModuleCard;