import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useTrackerStore } from "@/store/tracker-store";

interface EntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  trackerType: string;
}

export const EntryForm = ({ isOpen, onClose, trackerType }: EntryFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { 
    addStudyEntry, 
    addWorkoutEntry, 
    addMealEntry, 
    addSleepEntry 
  } = useTrackerStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Add the entry to the appropriate store based on tracker type
      switch (trackerType) {
        case "Study Tracker":
          addStudyEntry({
            subject: formData.subject || "Untitled",
            duration: Number(formData.duration) || 1,
            efficiency: Number(formData.efficiency) || 3,
            notes: formData.notes
          });
          break;
        case "Workout Tracker":
          addWorkoutEntry({
            workoutType: formData.workoutType || "Other",
            duration: Number(formData.duration) || 30,
            calories: Number(formData.calories) || 0,
            intensity: Number(formData.intensity) || 3
          });
          break;
        case "Meal Planner":
          addMealEntry({
            mealType: formData.mealType || "Snack",
            foodItems: formData.foodItems || "Not specified",
            calories: Number(formData.calories) || 0,
            waterIntake: Number(formData.waterIntake) || 0
          });
          break;
        case "Sleep Tracker":
          addSleepEntry({
            sleepDuration: Number(formData.sleepDuration) || 7,
            sleepQuality: Number(formData.sleepQuality) || 3,
            sleepNotes: formData.sleepNotes
          });
          break;
      }
      
      // Add a small delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      toast({
        title: "Entry Added",
        description: `Your ${trackerType} entry has been saved successfully.`
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your entry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStudyForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input 
          id="subject" 
          placeholder="e.g., Mathematics, Physics" 
          required
          onChange={(e) => handleChange("subject", e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="duration">Duration (hours)</Label>
        <div className="flex items-center gap-4">
          <Slider 
            id="duration"
            defaultValue={[1]}
            max={12}
            step={0.5}
            onValueChange={(value) => handleChange("duration", value[0])}
          />
          <span className="text-sm font-medium w-12 text-right">{formData.duration || 1}h</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="efficiency">Efficiency Rating</Label>
        <Select onValueChange={(value) => handleChange("efficiency", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 - Poor focus</SelectItem>
            <SelectItem value="2">2 - Below average</SelectItem>
            <SelectItem value="3">3 - Average</SelectItem>
            <SelectItem value="4">4 - Good focus</SelectItem>
            <SelectItem value="5">5 - Excellent focus</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea 
          id="notes" 
          placeholder="What did you learn? Any challenges?"
          onChange={(e) => handleChange("notes", e.target.value)}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Entry"}
      </Button>
    </form>
  );

  const renderWorkoutForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="workoutType">Workout Type</Label>
        <Select onValueChange={(value) => handleChange("workoutType", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cardio">Cardio</SelectItem>
            <SelectItem value="strength">Strength Training</SelectItem>
            <SelectItem value="hiit">HIIT</SelectItem>
            <SelectItem value="yoga">Yoga</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="duration">Duration (minutes)</Label>
        <div className="flex items-center gap-4">
          <Slider 
            id="duration"
            defaultValue={[30]}
            max={180}
            step={5}
            onValueChange={(value) => handleChange("duration", value[0])}
          />
          <span className="text-sm font-medium w-12 text-right">{formData.duration || 30}m</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="calories">Calories Burned (estimate)</Label>
        <Input 
          id="calories" 
          type="number" 
          placeholder="e.g., 300" 
          onChange={(e) => handleChange("calories", e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="intensity">Intensity Rating</Label>
        <Select onValueChange={(value) => handleChange("intensity", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select intensity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 - Very Light</SelectItem>
            <SelectItem value="2">2 - Light</SelectItem>
            <SelectItem value="3">3 - Moderate</SelectItem>
            <SelectItem value="4">4 - Intense</SelectItem>
            <SelectItem value="5">5 - Very Intense</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Entry"}
      </Button>
    </form>
  );

  const renderMealForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mealType">Meal Type</Label>
        <Select onValueChange={(value) => handleChange("mealType", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select meal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="breakfast">Breakfast</SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
            <SelectItem value="dinner">Dinner</SelectItem>
            <SelectItem value="snack">Snack</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="foodItems">Food Items</Label>
        <Textarea 
          id="foodItems" 
          placeholder="List the food items you ate"
          onChange={(e) => handleChange("foodItems", e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="calories">Calories (estimate)</Label>
        <Input 
          id="calories" 
          type="number" 
          placeholder="e.g., 500" 
          onChange={(e) => handleChange("calories", e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="waterIntake">Water Intake (cups)</Label>
        <div className="flex items-center gap-4">
          <Slider 
            id="waterIntake"
            defaultValue={[2]}
            max={12}
            step={1}
            onValueChange={(value) => handleChange("waterIntake", value[0])}
          />
          <span className="text-sm font-medium w-12 text-right">{formData.waterIntake || 2} cups</span>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Entry"}
      </Button>
    </form>
  );

  const renderSleepForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="sleepDuration">Sleep Duration (hours)</Label>
        <div className="flex items-center gap-4">
          <Slider 
            id="sleepDuration"
            defaultValue={[7]}
            max={12}
            step={0.5}
            onValueChange={(value) => handleChange("sleepDuration", value[0])}
          />
          <span className="text-sm font-medium w-12 text-right">{formData.sleepDuration || 7}h</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="sleepQuality">Sleep Quality</Label>
        <Select onValueChange={(value) => handleChange("sleepQuality", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select quality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 - Poor</SelectItem>
            <SelectItem value="2">2 - Fair</SelectItem>
            <SelectItem value="3">3 - Good</SelectItem>
            <SelectItem value="4">4 - Very Good</SelectItem>
            <SelectItem value="5">5 - Excellent</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="sleepNotes">Notes</Label>
        <Textarea 
          id="sleepNotes" 
          placeholder="Any factors affecting your sleep?"
          onChange={(e) => handleChange("sleepNotes", e.target.value)}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Entry"}
      </Button>
    </form>
  );

  const renderForm = () => {
    switch (trackerType) {
      case "Study Tracker":
        return renderStudyForm();
      case "Workout Tracker":
        return renderWorkoutForm();
      case "Meal Planner":
        return renderMealForm();
      case "Sleep Tracker":
        return renderSleepForm();
      default:
        return <div>Unknown tracker type</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{trackerType} Entry</DialogTitle>
          <DialogDescription>
            Add a new entry to track your progress
          </DialogDescription>
        </DialogHeader>
        
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
};