
// Import the tracker store to access user activity data
import { useTrackerStore } from "@/store/tracker-store";
// Import UI components for displaying stats in cards
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// Import date utility functions for date calculations
import { format, startOfDay, endOfDay, subDays, isWithinInterval } from "date-fns";

export const StatsSummary = () => {
  // Access tracker data from the store. This will trigger re-renders when the data changes.
  const { studyEntries, workoutEntries, mealEntries, sleepEntries } = useTrackerStore();

  /**
   * Calculates all statistics for study, workout, meal, and sleep trackers.
   * Returns an object with stats for each category.
   */
  const calculateStats = () => {
    // Get today's date and calculate the start and end of today
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);
    // Calculate the start of the week (last 7 days)
    const startOfWeek = startOfDay(subDays(today, 6));
    
    // Filter study entries for today
    const todayStudyEntries = studyEntries.filter(entry => {
      // Convert entry date to Date object if needed
      const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
      // Check if entry is within today
      return isWithinInterval(entryDate, {
        start: startOfToday,
        end: endOfToday
      });
    });
    
    // Filter workout entries for today
    const todayWorkoutEntries = workoutEntries.filter(entry => {
      const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
      return isWithinInterval(entryDate, {
        start: startOfToday,
        end: endOfToday
      });
    });
    
    // Filter meal entries for today
    const todayMealEntries = mealEntries.filter(entry => {
      const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
      return isWithinInterval(entryDate, {
        start: startOfToday,
        end: endOfToday
      });
    });
    
    // Get the most recent sleep entry (last night)
    const lastSleepEntry = sleepEntries.length > 0 ? 
      sleepEntries.sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date : new Date(a.date);
        const dateB = b.date instanceof Date ? b.date : new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      })[0] : null;
    
    // Filter study entries for the last 7 days
    const weekStudyEntries = studyEntries.filter(entry => {
      const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
      return entryDate >= startOfWeek;
    });
    
    // Filter workout entries for the last 7 days
    const weekWorkoutEntries = workoutEntries.filter(entry => {
      const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
      return entryDate >= startOfWeek;
    });
    
    // Calculate total study hours for today and this week
    const totalStudyHoursToday = todayStudyEntries.reduce((acc, entry) => acc + entry.duration, 0);
    const totalStudyHoursWeek = weekStudyEntries.reduce((acc, entry) => acc + entry.duration, 0);
    
    // Calculate total workout minutes for today
    const totalWorkoutMinutesToday = todayWorkoutEntries.reduce((acc, entry) => acc + entry.duration, 0);
    // Calculate total calories and water intake for today
    const totalCaloriesToday = todayMealEntries.reduce((acc, entry) => acc + entry.calories, 0);
    const totalWaterToday = todayMealEntries.reduce((acc, entry) => acc + entry.waterIntake, 0);
    // Count total workouts this week
    const totalWorkoutsWeek = weekWorkoutEntries.length;
    
    // Calculate average sleep quality (scale 1-5)
    const avgSleepQuality = sleepEntries.length > 0 ?
      sleepEntries.reduce((acc, entry) => acc + entry.sleepQuality, 0) / sleepEntries.length : 0;
    
    // Return all calculated stats in a structured object
    return {
      studyStats: {
        hoursToday: totalStudyHoursToday.toFixed(1), // Study hours today
        hoursWeek: totalStudyHoursWeek.toFixed(1),   // Study hours this week
        weeklyTarget: 40, // Example weekly study target in hours
        weekProgress: Math.min(100, Math.round((totalStudyHoursWeek / 40) * 100)) // Progress toward weekly goal
      },
      workoutStats: {
        minutesToday: Math.round(totalWorkoutMinutesToday), // Workout minutes today
        workoutsWeek: totalWorkoutsWeek, // Number of workouts this week
        lastWorkout: weekWorkoutEntries.length > 0 ? format(
          new Date(weekWorkoutEntries[weekWorkoutEntries.length - 1].date),
          'MMM d'
        ) : 'No workouts' // Date of last workout or fallback
      },
      mealStats: {
        caloriesToday: Math.round(totalCaloriesToday), // Calories consumed today
        waterToday: Math.round(totalWaterToday), // Water intake today (cups)
        waterTarget: 8, // Example daily water target in cups
        waterProgress: Math.min(100, Math.round((totalWaterToday / 8) * 100)) // Progress toward water goal
      },
      sleepStats: {
        lastDuration: lastSleepEntry ? lastSleepEntry.sleepDuration.toFixed(1) : '0', // Last night's sleep duration
        avgQuality: avgSleepQuality.toFixed(1), // Average sleep quality
        qualityText: avgSleepQuality >= 4 ? 'Excellent' : 
                     avgSleepQuality >= 3 ? 'Good' : 
                     avgSleepQuality >= 2 ? 'Fair' : 'Poor' // Textual quality rating
      }
    };
  };

  // Calculate all stats for rendering
  const stats = calculateStats();

  // Render the summary cards for each tracker category
  return (
    <div className="mt-12">
      {/* Section title */}
      <h3 className="text-2xl font-semibold text-center mb-6">Stats Summary</h3>
      {/* Grid layout for summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Study stats card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Study Stats</CardTitle>
            <CardDescription>Learning progress</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Today</dt>
                {/* Total study hours today */}
                <dd className="text-sm font-semibold">{stats.studyStats.hoursToday}h</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">This Week</dt>
                {/* Total study hours this week */}
                <dd className="text-sm font-semibold">{stats.studyStats.hoursWeek}h</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Weekly Goal</dt>
                {/* Progress toward weekly study goal */}
                <dd className="text-sm font-semibold">{stats.studyStats.hoursWeek}/{stats.studyStats.weeklyTarget}h ({stats.studyStats.weekProgress}%)</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Workout stats card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Workout Stats</CardTitle>
            <CardDescription>Fitness activities</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Today</dt>
                {/* Total workout minutes today */}
                <dd className="text-sm font-semibold">{stats.workoutStats.minutesToday} mins</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Workouts This Week</dt>
                {/* Number of workouts this week */}
                <dd className="text-sm font-semibold">{stats.workoutStats.workoutsWeek}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Last Workout</dt>
                {/* Date of last workout */}
                <dd className="text-sm font-semibold">{stats.workoutStats.lastWorkout}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Meal stats card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Meal Stats</CardTitle>
            <CardDescription>Nutrition tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Calories Today</dt>
                {/* Total calories consumed today */}
                <dd className="text-sm font-semibold">{stats.mealStats.caloriesToday}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Water Intake</dt>
                {/* Water intake today vs target */}
                <dd className="text-sm font-semibold">{stats.mealStats.waterToday}/{stats.mealStats.waterTarget} cups</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Water Goal</dt>
                {/* Progress toward daily water goal */}
                <dd className="text-sm font-semibold">{stats.mealStats.waterProgress}% complete</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Sleep stats card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Sleep Stats</CardTitle>
            <CardDescription>Sleep patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Last Night</dt>
                {/* Last night's sleep duration */}
                <dd className="text-sm font-semibold">{stats.sleepStats.lastDuration}h</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Quality Rating</dt>
                {/* Average sleep quality (1-5) */}
                <dd className="text-sm font-semibold">{stats.sleepStats.avgQuality}/5</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Quality</dt>
                {/* Textual sleep quality rating */}
                <dd className="text-sm font-semibold">{stats.sleepStats.qualityText}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};