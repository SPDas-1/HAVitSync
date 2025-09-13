import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, BarChart, LineChart, PieChart, Pie, Area, Bar, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { useTrackerStore } from "@/store/tracker-store";
import { format, startOfDay, endOfDay, isWithinInterval, subDays } from "date-fns";

// Process real data from the store
const processTrackerData = (trackerType: string) => {
  const { 
    studyEntries, 
    workoutEntries, 
    mealEntries, 
    sleepEntries 
  } = useTrackerStore();
  
  const now = new Date();
  const lastWeekDays = Array.from({length: 7}, (_, i) => {
    const date = subDays(now, 6-i);
    return {
      date,
      dayName: format(date, 'EEE'),
      dayFull: format(date, 'yyyy-MM-dd')
    };
  });
  
  switch (trackerType) {
    case "Study Tracker": {
      // Process weekly study hours
      const weeklyData = lastWeekDays.map(day => {
        const dayEntries = studyEntries.filter(entry => {
          // Ensure entry.date is a Date object
          const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
          return isWithinInterval(entryDate, {
            start: startOfDay(day.date),
            end: endOfDay(day.date)
          });
        });
        
        const totalHours = dayEntries.reduce((acc, entry) => acc + entry.duration, 0);
        const avgEfficiency = dayEntries.length 
          ? dayEntries.reduce((acc, entry) => acc + entry.efficiency, 0) / dayEntries.length
          : 0;
          
        return {
          name: day.dayName,
          fullDate: day.dayFull,
          hours: parseFloat(totalHours.toFixed(1)),
          efficiency: parseFloat(avgEfficiency.toFixed(1))
        };
      });
      
      // Process subject distribution
      const subjectMap = new Map();
      studyEntries.forEach(entry => {
        const currentValue = subjectMap.get(entry.subject) || 0;
        subjectMap.set(entry.subject, currentValue + entry.duration);
      });
      
      const subjectData = Array.from(subjectMap.entries()).map(([name, value]) => ({
        name,
        value
      }));
      
      // Process efficiency trends
      const efficiencyData = lastWeekDays.map(day => {
        const dayEntries = studyEntries.filter(entry => {
          // Ensure entry.date is a Date object
          const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
          return isWithinInterval(entryDate, {
            start: startOfDay(day.date),
            end: endOfDay(day.date)
          });
        });
        
        const avgEfficiency = dayEntries.length 
          ? dayEntries.reduce((acc, entry) => acc + entry.efficiency, 0) / dayEntries.length
          : 0;
          
        return {
          name: day.dayName,
          fullDate: day.dayFull,
          efficiency: parseFloat(avgEfficiency.toFixed(1))
        };
      });
      
      return { weeklyData, subjectData, efficiencyData };
    }
      
    case "Workout Tracker": {
      // Process weekly workout data
      const weeklyData = lastWeekDays.map(day => {
        const dayEntries = workoutEntries.filter(entry => {
          // Ensure entry.date is a Date object
          const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
          return isWithinInterval(entryDate, {
            start: startOfDay(day.date),
            end: endOfDay(day.date)
          });
        });
        
        const totalMinutes = dayEntries.reduce((acc, entry) => acc + entry.duration, 0);
        const totalCalories = dayEntries.reduce((acc, entry) => acc + entry.calories, 0);
        
        return {
          name: day.dayName,
          fullDate: day.dayFull,
          minutes: totalMinutes,
          calories: totalCalories
        };
      });
      
      // Process workout type distribution
      const typeMap = new Map();
      workoutEntries.forEach(entry => {
        const currentValue = typeMap.get(entry.workoutType) || 0;
        typeMap.set(entry.workoutType, currentValue + 1);
      });
      
      const typeData = Array.from(typeMap.entries()).map(([name, value]) => ({
        name,
        value
      }));
      
      // Process intensity trends
      const intensityData = lastWeekDays.map(day => {
        const dayEntries = workoutEntries.filter(entry => {
          // Ensure entry.date is a Date object
          const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
          return isWithinInterval(entryDate, {
            start: startOfDay(day.date),
            end: endOfDay(day.date)
          });
        });
        
        const avgIntensity = dayEntries.length 
          ? dayEntries.reduce((acc, entry) => acc + entry.intensity, 0) / dayEntries.length
          : 0;
          
        return {
          name: day.dayName,
          fullDate: day.dayFull,
          intensity: parseFloat(avgIntensity.toFixed(1))
        };
      });
      
      return { weeklyData, typeData, intensityData };
    }
      
    case "Meal Planner": {
      // Process weekly meal data
      const weeklyData = lastWeekDays.map(day => {
        const dayEntries = mealEntries.filter(entry => {
          // Ensure entry.date is a Date object
          const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
          return isWithinInterval(entryDate, {
            start: startOfDay(day.date),
            end: endOfDay(day.date)
          });
        });
        
        const totalCalories = dayEntries.reduce((acc, entry) => acc + entry.calories, 0);
        const totalWater = dayEntries.reduce((acc, entry) => acc + entry.waterIntake, 0);
        
        return {
          name: day.dayName,
          fullDate: day.dayFull,
          calories: totalCalories,
          water: totalWater
        };
      });
      
      // Process meal type distribution
      const mealTypeMap = new Map();
      mealEntries.forEach(entry => {
        const currentValue = mealTypeMap.get(entry.mealType) || 0;
        mealTypeMap.set(entry.mealType, currentValue + entry.calories);
      });
      
      const mealTypeData = Array.from(mealTypeMap.entries()).map(([name, value]) => ({
        name,
        value
      }));
      
      // For nutrition data, calculate based on meal entries and calories
      // We're using a simplified calculation based on total calories
      const totalCalories = mealEntries.reduce((acc, entry) => acc + entry.calories, 0);
      const nutritionData = [
        { name: "Protein", value: Math.round(totalCalories * 0.3) },
        { name: "Carbs", value: Math.round(totalCalories * 0.5) },
        { name: "Fats", value: Math.round(totalCalories * 0.15) },
        { name: "Fiber", value: Math.round(totalCalories * 0.05) }
      ];
      
      return { weeklyData, mealTypeData, nutritionData };
    }
      
    case "Sleep Tracker": {
      // Process weekly sleep data
      const weeklyData = lastWeekDays.map(day => {
        const dayEntries = sleepEntries.filter(entry => {
          // Ensure entry.date is a Date object
          const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
          return isWithinInterval(entryDate, {
            start: startOfDay(day.date),
            end: endOfDay(day.date)
          });
        });
        
        // Use the latest entry for the day if multiple entries exist
        const entry = dayEntries.length ? dayEntries[dayEntries.length - 1] : null;
        
        return {
          name: day.dayName,
          fullDate: day.dayFull,
          hours: entry ? parseFloat(entry.sleepDuration.toFixed(1)) : 0,
          quality: entry ? entry.sleepQuality : 0
        };
      });
      
      // For sleep quality distribution, calculate based on actual sleep entries
      const avgQuality = sleepEntries.length ? 
        sleepEntries.reduce((acc, entry) => acc + entry.sleepQuality, 0) / sleepEntries.length : 3;
      
      // Total sleep hours to create more meaningful data
      const totalSleepHours = sleepEntries.reduce((acc, entry) => acc + entry.sleepDuration, 0);
      
      // Adjust phases based on quality - higher quality means more deep and REM sleep
      const qualityFactor = Math.max(1, avgQuality / 2.5); // Normalize to reasonable factor
      const qualityData = [
        { name: "Deep Sleep", value: Math.round(totalSleepHours * 0.2 * qualityFactor) },
        { name: "REM Sleep", value: Math.round(totalSleepHours * 0.25 * qualityFactor) },
        { name: "Light Sleep", value: Math.round(totalSleepHours * 0.4) },
        { name: "Awake", value: Math.round(totalSleepHours * 0.15 / qualityFactor) }
      ];
      
      // Process weekly average sleep duration
      const weekAvg = lastWeekDays.map(day => {
        // Get average sleep for past week from this day
        const pastWeekEntries = sleepEntries.filter(entry => {
          // Ensure entry.date is a Date object
          const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
          return entryDate <= day.date && entryDate >= subDays(day.date, 7);
        });
        
        const avgSleep = pastWeekEntries.length 
          ? pastWeekEntries.reduce((acc, entry) => acc + entry.sleepDuration, 0) / pastWeekEntries.length
          : 0;
          
        return {
          name: day.dayName,
          fullDate: day.dayFull,
          average: parseFloat(avgSleep.toFixed(1))
        };
      });
      
      return { weeklyData, qualityData, weekAvg };
    }
      
    default:
      return { weeklyData: [], subjectData: [] };
  }
};

interface TrackerVisualizationProps {
  isOpen: boolean;
  onClose: () => void;
  trackerType: string;
}

export const TrackerVisualization = ({ isOpen, onClose, trackerType }: TrackerVisualizationProps) => {
  const [viewMode, setViewMode] = useState("weekly");
  
  // Process the real data from the store
  const chartData = useMemo(() => {
    const data = processTrackerData(trackerType);
    console.log(`Chart data for ${trackerType}:`, data);
    return data;
  }, [trackerType]);

  const getMainTitle = () => {
    switch (viewMode) {
      case "weekly":
        return "Weekly Progress";
      case "distribution":
        return trackerType === "Study Tracker" ? "Subject Distribution" : 
               trackerType === "Workout Tracker" ? "Workout Types" :
               trackerType === "Meal Planner" ? "Calorie Distribution by Meal" : "Sleep Quality Distribution";
      case "trends":
        return trackerType === "Study Tracker" ? "Efficiency Trends" : 
               trackerType === "Workout Tracker" ? "Intensity Trends" :
               trackerType === "Meal Planner" ? "Nutrition Breakdown" : "Average Sleep Trend";
      default:
        return "Progress Overview";
    }
  };

  const renderStudyVisualizations = () => {
    const { weeklyData, subjectData, efficiencyData } = chartData;
    
    const emptyMessage = (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <p className="text-lg">No data available</p>
        <p className="text-sm">Add entries to see visualizations</p>
      </div>
    );
    
    switch (viewMode) {
      case "weekly":
        if (!weeklyData.some(day => day.hours > 0)) return emptyMessage;
        
        return (
          <ChartContainer className="w-full aspect-[4/3]" config={{ hours: { theme: { light: "#3b82f6", dark: "#60a5fa" } } }}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis unit="h" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="hours" fill="var(--color-hours)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        );
      case "distribution":
        if (subjectData.length === 0 || !subjectData.some(subject => subject.value > 0)) return emptyMessage;
        
        // Create colors for each subject
        const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];
        
        // Generate config dynamically based on available subjects
        const subjectConfig: ChartConfig = {};
        subjectData.forEach((subject, index) => {
          const colorIndex = index % colors.length;
          subjectConfig[subject.name] = { theme: { light: colors[colorIndex], dark: colors[colorIndex] } };
        });
        
        return (
          <ChartContainer className="w-full aspect-[4/3]" config={subjectConfig}>
            <PieChart>
              <Pie
                data={subjectData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ChartContainer>
        );
      case "trends":
        if (!efficiencyData || !efficiencyData.some(day => day.efficiency > 0)) return emptyMessage;
        
        return (
          <ChartContainer className="w-full aspect-[4/3]" config={{ efficiency: { theme: { light: "#8b5cf6", dark: "#a78bfa" } } }}>
            <LineChart data={efficiencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="efficiency" stroke="var(--color-efficiency)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ChartContainer>
        );
      default:
        return null;
    }
  };

  const renderWorkoutVisualizations = () => {
    const { weeklyData, typeData, intensityData } = chartData;
    
    const emptyMessage = (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <p className="text-lg">No workout data available</p>
        <p className="text-sm">Add workout entries to see visualizations</p>
      </div>
    );
    
    switch (viewMode) {
      case "weekly":
        if (!weeklyData.some(day => day.minutes > 0)) return emptyMessage;
        
        return (
          <ChartContainer className="w-full aspect-[4/3]" config={{ 
            minutes: { theme: { light: "#f59e0b", dark: "#fbbf24" } },
            calories: { theme: { light: "#ec4899", dark: "#f472b6" } }
          }}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="var(--color-minutes)" />
              <YAxis yAxisId="right" orientation="right" stroke="var(--color-calories)" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar yAxisId="left" dataKey="minutes" fill="var(--color-minutes)" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="calories" fill="var(--color-calories)" radius={[4, 4, 0, 0]} />
              <Legend />
            </BarChart>
          </ChartContainer>
        );
      case "distribution":
        if (typeData.length === 0 || !typeData.some(type => type.value > 0)) return emptyMessage;
        
        // Create colors for each workout type
        const colors = ["#ef4444", "#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"];
        
        // Generate config dynamically based on available workout types
        const typeConfig: ChartConfig = {};
        typeData.forEach((type, index) => {
          const colorIndex = index % colors.length;
          typeConfig[type.name] = { theme: { light: colors[colorIndex], dark: colors[colorIndex] } };
        });
        
        return (
          <ChartContainer className="w-full aspect-[4/3]" config={typeConfig}>
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ChartContainer>
        );
      case "trends":
        if (!intensityData || !intensityData.some(day => day.intensity > 0)) return emptyMessage;
        
        return (
          <ChartContainer className="w-full aspect-[4/3]" config={{ intensity: { theme: { light: "#ef4444", dark: "#f87171" } } }}>
            <LineChart data={intensityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="intensity" stroke="var(--color-intensity)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ChartContainer>
        );
      default:
        return null;
    }
  };

  const renderMealVisualizations = () => {
    const { weeklyData, mealTypeData, nutritionData } = chartData;
    
    const emptyMessage = (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <p className="text-lg">No meal data available</p>
        <p className="text-sm">Add meal entries to see visualizations</p>
      </div>
    );
    
    switch (viewMode) {
      case "weekly":
        if (!weeklyData.some(day => day.calories > 0)) return emptyMessage;
        
        return (
          <ChartContainer className="w-full aspect-[4/3]" config={{ 
            calories: { theme: { light: "#f59e0b", dark: "#fbbf24" } },
            water: { theme: { light: "#3b82f6", dark: "#60a5fa" } }
          }}>
            <AreaChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="calories" stroke="var(--color-calories)" fill="var(--color-calories)" fillOpacity={0.3} />
              <Area type="monotone" dataKey="water" stroke="var(--color-water)" fill="var(--color-water)" fillOpacity={0.3} />
              <Legend />
            </AreaChart>
          </ChartContainer>
        );
      case "distribution":
        if (mealTypeData.length === 0 || !mealTypeData.some(type => type.value > 0)) return emptyMessage;
        
        // Create colors for each meal type
        const colors = ["#3b82f6", "#f59e0b", "#8b5cf6", "#10b981", "#ef4444", "#ec4899"];
        
        // Generate config dynamically based on available meal types
        const mealTypeConfig: ChartConfig = {};
        mealTypeData.forEach((type, index) => {
          const colorIndex = index % colors.length;
          mealTypeConfig[type.name] = { theme: { light: colors[colorIndex], dark: colors[colorIndex] } };
        });
        
        return (
          <ChartContainer className="w-full aspect-[4/3]" config={mealTypeConfig}>
            <PieChart>
              <Pie
                data={mealTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ChartContainer>
        );
      case "trends":
        if (!nutritionData || !nutritionData.some(item => item.value > 0)) return emptyMessage;
        
        return (
          <ChartContainer className="w-full aspect-[4/3]" config={{
            Protein: { theme: { light: "#ef4444", dark: "#f87171" } },
            Carbs: { theme: { light: "#f59e0b", dark: "#fbbf24" } },
            Fats: { theme: { light: "#10b981", dark: "#34d399" } },
            Fiber: { theme: { light: "#3b82f6", dark: "#60a5fa" } }
          }}>
            <PieChart>
              <Pie
                data={nutritionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ChartContainer>
        );
      default:
        return null;
    }
  };

  const renderSleepVisualizations = () => {
    const { weeklyData, qualityData, weekAvg } = chartData;
    
    const emptyMessage = (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <p className="text-lg">No sleep data available</p>
        <p className="text-sm">Add sleep entries to see visualizations</p>
      </div>
    );
    
    switch (viewMode) {
      case "weekly":
        if (!weeklyData.some(day => day.hours > 0)) return emptyMessage;
        
        return (
          <ChartContainer className="w-full aspect-[4/3]" config={{ 
            hours: { theme: { light: "#8b5cf6", dark: "#a78bfa" } },
            quality: { theme: { light: "#10b981", dark: "#34d399" } }
          }}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line yAxisId="left" type="monotone" dataKey="hours" stroke="var(--color-hours)" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="quality" stroke="var(--color-quality)" strokeWidth={2} />
              <Legend />
            </LineChart>
          </ChartContainer>
        );
      case "distribution":
        if (qualityData.length === 0 || !qualityData.some(item => item.value > 0)) return emptyMessage;
        
        return (
          <ChartContainer className="w-full aspect-[4/3]" config={{
            "Deep Sleep": { theme: { light: "#3b82f6", dark: "#60a5fa" } },
            "REM Sleep": { theme: { light: "#8b5cf6", dark: "#a78bfa" } },
            "Light Sleep": { theme: { light: "#10b981", dark: "#34d399" } },
            "Awake": { theme: { light: "#f59e0b", dark: "#fbbf24" } }
          }}>
            <PieChart>
              <Pie
                data={qualityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ChartContainer>
        );
      case "trends":
        if (!weekAvg || !weekAvg.some(day => day.average > 0)) return emptyMessage;
        
        // Find the domain range based on data
        const minAvg = Math.floor(Math.min(...weekAvg.map(d => d.average).filter(v => v > 0)) || 4);
        const maxAvg = Math.ceil(Math.max(...weekAvg.map(d => d.average)) || 10);
        
        return (
          <ChartContainer className="w-full aspect-[4/3]" config={{ average: { theme: { light: "#8b5cf6", dark: "#a78bfa" } } }}>
            <AreaChart data={weekAvg}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[Math.max(0, minAvg - 1), maxAvg + 1]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="average" stroke="var(--color-average)" fill="var(--color-average)" fillOpacity={0.3} />
            </AreaChart>
          </ChartContainer>
        );
      default:
        return null;
    }
  };

  const renderVisualizations = () => {
    console.log(`Rendering visualizations for ${trackerType}, view mode: ${viewMode}`);
    switch (trackerType) {
      case "Study Tracker":
        return renderStudyVisualizations();
      case "Workout Tracker":
        return renderWorkoutVisualizations();
      case "Meal Planner":
        return renderMealVisualizations();
      case "Sleep Tracker":
        return renderSleepVisualizations();
      default:
        return <div>No visualization available</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{trackerType} Statistics</DialogTitle>
          <DialogDescription>
            Visualizing your progress and trends
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="weekly" value={viewMode} onValueChange={(value) => {
          console.log(`Tab changed to: ${value}`);
          setViewMode(value);
        }}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="weekly">Weekly Data</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center">{getMainTitle()}</h3>
            {renderVisualizations()}
          </div>
        </Tabs>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};