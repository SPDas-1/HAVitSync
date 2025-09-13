import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useTrackerStore } from "@/store/tracker-store";
import { format, startOfDay, endOfDay, subDays, isWithinInterval } from "date-fns";
import { AreaChart, BarChart, LineChart, XAxis, YAxis, CartesianGrid, Bar, Line, Area, Tooltip } from "recharts";

interface DynamicTrackerCardProps {
  title: string;
  description: string;
  image: string;
  color: "primary" | "secondary" | "accent" | "success" | "warning";
  onAddEntry?: (title: string) => void;
}

export const DynamicTrackerCard = ({ title, description, image, color, onAddEntry }: DynamicTrackerCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const { studyEntries, workoutEntries, mealEntries, sleepEntries } = useTrackerStore();
  
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
      default:
        return {
          gradient: "bg-gray/10",
          border: "border-gray/20",
          text: "text-gray",
          button: "bg-gray text-gray-foreground"
        };
    }
  };
  
  // Calculate stats from data
  const getDynamicStats = () => {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);
    const startOfWeek = startOfDay(subDays(today, 6)); // Last 7 days
    
    switch (title) {
      case "Study Tracker": {
        // Get today's entries
        const todayEntries = studyEntries.filter(entry => {
          const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
          return isWithinInterval(entryDate, {
            start: startOfToday,
            end: endOfToday
          });
        });
        
        // Get weekly entries
        const weekEntries = studyEntries.filter(entry => {
          const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
          return entryDate >= startOfWeek;
        });
        
        const totalHoursToday = todayEntries.reduce((acc, entry) => acc + entry.duration, 0);
        const totalHoursWeek = weekEntries.reduce((acc, entry) => acc + entry.duration, 0);
        const weeklyTarget = 40;
        
        return [
          { label: "Hours Today", value: `${totalHoursToday.toFixed(1)}h`, trend: totalHoursToday > 0 ? "✓ Tracked" : "No data today" },
          { label: "Weekly Goal", value: `${totalHoursWeek.toFixed(1)}/${weeklyTarget}h`, trend: `${Math.min(100, Math.round((totalHoursWeek / weeklyTarget) * 100))}% complete` }
        ];
      }
      
      case "Workout Tracker": {
        // Get today's entries
        const todayEntries = workoutEntries.filter(entry => {
          const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
          return isWithinInterval(entryDate, {
            start: startOfToday,
            end: endOfToday
          });
        });
        
        // Get weekly entries
        const weekEntries = workoutEntries.filter(entry => {
          const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
          return entryDate >= startOfWeek;
        });
        
        const totalMinutesToday = todayEntries.reduce((acc, entry) => acc + entry.duration, 0);
        const totalCaloriesToday = todayEntries.reduce((acc, entry) => acc + entry.calories, 0);
        const workoutsThisWeek = weekEntries.length;
        
        return [
          { label: "Workouts This Week", value: `${workoutsThisWeek}`, trend: workoutsThisWeek > 0 ? "✓ Active" : "No workouts" },
          { label: "Calories Burned", value: `${Math.round(totalCaloriesToday)}`, trend: totalCaloriesToday > 0 ? "Today" : "No data today" }
        ];
      }
      
      case "Meal Planner": {
        // Get today's entries
        const todayEntries = mealEntries.filter(entry => {
          const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
          return isWithinInterval(entryDate, {
            start: startOfToday,
            end: endOfToday
          });
        });
        
        const totalCaloriesToday = todayEntries.reduce((acc, entry) => acc + entry.calories, 0);
        const totalWaterToday = todayEntries.reduce((acc, entry) => acc + entry.waterIntake, 0);
        const waterTarget = 8;
        
        return [
          { label: "Calories Today", value: `${Math.round(totalCaloriesToday)}`, trend: totalCaloriesToday > 0 ? "Tracked" : "No data today" },
          { label: "Water Intake", value: `${totalWaterToday.toFixed(1)}/${waterTarget} cups`, trend: `${Math.min(100, Math.round((totalWaterToday / waterTarget) * 100))}% complete` }
        ];
      }
      
      case "Sleep Tracker": {
        const lastSleepEntry = sleepEntries.length > 0 ? 
          sleepEntries.sort((a, b) => {
            const dateA = a.date instanceof Date ? a.date : new Date(a.date);
            const dateB = b.date instanceof Date ? b.date : new Date(b.date);
            return dateB.getTime() - dateA.getTime();
          })[0] : null;
        
        const weekEntries = sleepEntries.filter(entry => {
          const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
          return entryDate >= startOfWeek;
        });
        
        const avgSleepWeek = weekEntries.length > 0 ? 
          weekEntries.reduce((acc, entry) => acc + entry.sleepDuration, 0) / weekEntries.length : 0;
          
        return [
          { label: "Last Night", value: lastSleepEntry ? `${lastSleepEntry.sleepDuration.toFixed(1)}h` : "No data", 
            trend: lastSleepEntry ? `Quality: ${lastSleepEntry.sleepQuality}/5` : "Add an entry" },
          { label: "Average This Week", value: `${avgSleepWeek.toFixed(1)}h`, 
            trend: weekEntries.length > 0 ? `${weekEntries.length} entries` : "No data" }
        ];
      }
      
      default:
        return [];
    }
  };
  
  // Get visualization data
  const getVisualizationData = () => {
    const today = new Date();
    const dates = Array.from({length: 7}, (_, i) => {
      return subDays(today, 6-i);
    });
    
    switch (title) {
      case "Study Tracker": {
        return dates.map(date => {
          const dayEntries = studyEntries.filter(entry => {
            const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
            return isWithinInterval(entryDate, {
              start: startOfDay(date),
              end: endOfDay(date)
            });
          });
          
          const totalHours = dayEntries.reduce((acc, entry) => acc + entry.duration, 0);
          return {
            name: format(date, 'EEE'),
            hours: parseFloat(totalHours.toFixed(1))
          };
        });
      }
      
      case "Workout Tracker": {
        return dates.map(date => {
          const dayEntries = workoutEntries.filter(entry => {
            const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
            return isWithinInterval(entryDate, {
              start: startOfDay(date),
              end: endOfDay(date)
            });
          });
          
          const totalMinutes = dayEntries.reduce((acc, entry) => acc + entry.duration, 0);
          const totalCalories = dayEntries.reduce((acc, entry) => acc + entry.calories, 0);
          return {
            name: format(date, 'EEE'),
            minutes: Math.round(totalMinutes),
            calories: Math.round(totalCalories)
          };
        });
      }
      
      case "Meal Planner": {
        return dates.map(date => {
          const dayEntries = mealEntries.filter(entry => {
            const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
            return isWithinInterval(entryDate, {
              start: startOfDay(date),
              end: endOfDay(date)
            });
          });
          
          const totalCalories = dayEntries.reduce((acc, entry) => acc + entry.calories, 0);
          const totalWater = dayEntries.reduce((acc, entry) => acc + entry.waterIntake, 0);
          return {
            name: format(date, 'EEE'),
            calories: Math.round(totalCalories),
            water: totalWater
          };
        });
      }
      
      case "Sleep Tracker": {
        return dates.map(date => {
          const dayEntries = sleepEntries.filter(entry => {
            const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
            return isWithinInterval(entryDate, {
              start: startOfDay(date),
              end: endOfDay(date)
            });
          });
          
          // Use the latest entry for the day if multiple entries exist
          const entry = dayEntries.length ? dayEntries[dayEntries.length - 1] : null;
          return {
            name: format(date, 'EEE'),
            hours: entry ? parseFloat(entry.sleepDuration.toFixed(1)) : 0,
            quality: entry ? entry.sleepQuality : 0
          };
        });
      }
      
      default:
        return [];
    }
  };
  
  const renderVisualization = () => {
    const data = getVisualizationData();
    const hasData = data.some(item => {
      return Object.entries(item).some(([key, value]) => 
        key !== 'name' && typeof value === 'number' && value > 0
      );
    });
    
    if (!hasData) {
      return (
        <div className="flex flex-col items-center justify-center h-48 bg-muted/20 rounded-md">
          <p className="text-sm text-muted-foreground">No data available</p>
          <p className="text-xs text-muted-foreground">Add entries to see visualization</p>
        </div>
      );
    }
    
    const colorClass = getColorClasses(color);
    
    switch (title) {
      case "Study Tracker":
        return (
          <div className="h-48">
            <BarChart width={300} height={180} data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill={colorClass.text.includes('primary') ? '#3b82f6' : '#10b981'} name="Hours" />
            </BarChart>
          </div>
        );
        
      case "Workout Tracker":
        return (
          <div className="h-48">
            <BarChart width={300} height={180} data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="minutes" fill={colorClass.text.includes('secondary') ? '#8b5cf6' : '#f59e0b'} name="Minutes" />
            </BarChart>
          </div>
        );
        
      case "Meal Planner":
        return (
          <div className="h-48">
            <AreaChart width={300} height={180} data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="calories" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="Calories" />
            </AreaChart>
          </div>
        );
        
      case "Sleep Tracker":
        return (
          <div className="h-48">
            <LineChart width={300} height={180} data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hours" stroke="#8b5cf6" strokeWidth={2} name="Hours" />
            </LineChart>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  const colorClasses = getColorClasses(color);
  const dynamicStats = getDynamicStats();
  
  return (
    <Card className={`overflow-hidden border ${colorClasses.border} transition-all duration-300`}>
      <div className={`p-6 ${colorClasses.gradient}`}>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${colorClasses.text}`}>{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6 pt-4">
        <div className="space-y-4">
          {dynamicStats.map((stat, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className={`text-sm font-bold ${colorClasses.text}`}>{stat.value}</p>
              </div>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4 p-4 pt-0">
        <Button 
          className={`w-full ${colorClasses.button}`} 
          onClick={() => onAddEntry && onAddEntry(title)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Entry
        </Button>
        
        <Button 
          variant="ghost"
          className="w-full flex items-center justify-center" 
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>Hide Visualization <ChevronUp className="ml-2 h-4 w-4" /></>
          ) : (
            <>Show Visualization <ChevronDown className="ml-2 h-4 w-4" /></>
          )}
        </Button>
        
        {expanded && (
          <div className="pt-2">
            {renderVisualization()}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};