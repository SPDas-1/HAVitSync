import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";


interface TrackerCardProps {
  title: string;
  description: string;
  image: string;
  stats: {
    label: string;
    value: string;
    trend?: string;
  }[];
  color: "primary" | "secondary" | "accent" | "success" | "warning";
  onAddEntry?: (title: string) => void;
  onView?: (title: string) => void;
}

export const TrackerCard = ({ title, description, image, stats, color, onAddEntry, onView }: TrackerCardProps) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return {
          gradient: "bg-primary/10",
          border: "border-primary/20",
          text: "text-primary",
          button: "bg-primary text-primary-foreground"
        };
      case "secondary":
        return {
          gradient: "bg-secondary/10",
          border: "border-secondary/20",
          text: "text-secondary",
          button: "bg-secondary text-secondary-foreground"
        };
      case "accent":
        return {
          gradient: "bg-accent/10",
          border: "border-accent/20",
          text: "text-accent",
          button: "bg-accent text-accent-foreground"
        };
      case "success":
        return {
          gradient: "bg-success/10",
          border: "border-success/20",
          text: "text-success",
          button: "bg-success text-success-foreground"
        };
      case "warning":
        return {
          gradient: "bg-warning/10",
          border: "border-warning/20",
          text: "text-warning",
          button: "bg-warning text-warning-foreground"
        };
      default:
        return {
          gradient: "bg-primary/10",
          border: "border-primary/20",
          text: "text-primary",
          button: "bg-primary text-primary-foreground"
        };
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <Card className={`group hover:shadow-glow transition-all duration-300 hover:-translate-y-1 ${colorClasses.border} ${colorClasses.gradient}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {description}
            </CardDescription>
          </div>
          <div className="relative">
            <img 
              src={image} 
              alt={title}
              className="w-16 h-16 rounded-lg object-cover shadow-card"
            />
            <div className={`absolute inset-0 ${colorClasses.gradient} rounded-lg opacity-20`}></div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-1">
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className={`text-2xl font-bold ${colorClasses.text}`}>
                {stat.value}
              </div>
              {stat.trend && (
                <div className="text-xs text-success">
                  {stat.trend}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3 pt-2">
          <Button 
            size="sm" 
            className={`flex-1 ${colorClasses.button} hover:opacity-90 transition-smooth`}
            onClick={() => onAddEntry?.(title)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
          <Button variant="outline" size="sm" className="flex items-center space-x-1" onClick={() => onView?.(title)}>
            <span>View</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};