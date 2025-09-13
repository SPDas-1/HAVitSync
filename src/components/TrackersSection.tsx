
import { useState } from "react";
import { DynamicTrackerCard } from "@/components/DynamicTrackerCard";
import { EntryForm } from "@/components/TrackerEntryForm";
import studyIcon from "@/assets/study-icon.jpg";
import workoutIcon from "@/assets/workout-icon.jpg";
import mealIcon from "@/assets/meal-icon.jpg";
import sleepIcon from "@/assets/sleep-icon.jpg";

export const TrackersSection = () => {
  const [activeTracker, setActiveTracker] = useState<string | null>(null);
  const [isEntryFormOpen, setIsEntryFormOpen] = useState(false);

  const handleAddEntry = (title: string) => {
    setActiveTracker(title);
    setIsEntryFormOpen(true);
  };
  
  const trackers = [
    {
      title: "Study Tracker",
      description: "Monitor your learning progress and study habits",
      image: studyIcon,
      color: "primary" as const
    },
    {
      title: "Workout Tracker",
      description: "Track your fitness activities and progress",
      image: workoutIcon,
      color: "secondary" as const
    },
    {
      title: "Meal Planner",
      description: "Plan and track your nutrition and meals",
      image: mealIcon,
      color: "success" as const
    },
    {
      title: "Sleep Tracker",
      description: "Monitor your sleep patterns and quality",
      image: sleepIcon,
      color: "accent" as const
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-foreground">
            Your 
            <span className="gradient-wellness bg-clip-text text-transparent"> Ecosystem</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tracking tools to monitor every aspect of your daily journey. 
            Get insights, set goals, and build healthy habits.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trackers.map((tracker, index) => (
            <DynamicTrackerCard
              key={index}
              title={tracker.title}
              description={tracker.description}
              image={tracker.image}
              color={tracker.color}
              onAddEntry={handleAddEntry}
            />
          ))}
        </div>
      </div>
      
      {/* Entry Form Dialog */}
      {activeTracker && isEntryFormOpen && (
        <EntryForm
          isOpen={isEntryFormOpen}
          onClose={() => setIsEntryFormOpen(false)}
          trackerType={activeTracker}
        />
      )}
    </section>
  );
};