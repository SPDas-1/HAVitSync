// Store for tracking user entries
import { create } from 'zustand';

// Define the types for our tracker entries
export interface StudyEntry {
  id: string;
  date: Date;
  subject: string;
  duration: number; // in hours
  efficiency: number; // 1-5 scale
  notes?: string;
}

export interface WorkoutEntry {
  id: string;
  date: Date;
  workoutType: string;
  duration: number; // in minutes
  calories: number;
  intensity: number; // 1-5 scale
}

export interface MealEntry {
  id: string;
  date: Date;
  mealType: string;
  foodItems: string;
  calories: number;
  waterIntake: number; // in cups
}

export interface SleepEntry {
  id: string;
  date: Date;
  sleepDuration: number; // in hours
  sleepQuality: number; // 1-5 scale
  sleepNotes?: string;
}

interface TrackerStore {
  studyEntries: StudyEntry[];
  workoutEntries: WorkoutEntry[];
  mealEntries: MealEntry[];
  sleepEntries: SleepEntry[];
  addStudyEntry: (entry: Omit<StudyEntry, 'id' | 'date'>) => void;
  addWorkoutEntry: (entry: Omit<WorkoutEntry, 'id' | 'date'>) => void;
  addMealEntry: (entry: Omit<MealEntry, 'id' | 'date'>) => void;
  addSleepEntry: (entry: Omit<SleepEntry, 'id' | 'date'>) => void;
}

export const useTrackerStore = create<TrackerStore>((set) => ({
  studyEntries: [
    // Initial sample data for demonstration
    {
      id: '1',
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      subject: 'Mathematics',
      duration: 2.5,
      efficiency: 4,
      notes: 'Covered calculus basics'
    },
    {
      id: '2',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      subject: 'Physics',
      duration: 1.5,
      efficiency: 3,
      notes: 'Reviewed mechanics'
    },
    {
      id: '3',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      subject: 'Programming',
      duration: 3,
      efficiency: 5,
      notes: 'Practiced React hooks'
    }
  ],
  workoutEntries: [
    {
      id: '1',
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      workoutType: 'Cardio',
      duration: 45,
      calories: 320,
      intensity: 4
    },
    {
      id: '2',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      workoutType: 'Strength',
      duration: 60,
      calories: 380,
      intensity: 5
    },
    {
      id: '3',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      workoutType: 'Yoga',
      duration: 30,
      calories: 180,
      intensity: 2
    }
  ],
  mealEntries: [
    {
      id: '1',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      mealType: 'Breakfast',
      foodItems: 'Oatmeal, banana, coffee',
      calories: 350,
      waterIntake: 2
    },
    {
      id: '2',
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      mealType: 'Lunch',
      foodItems: 'Chicken salad sandwich, apple',
      calories: 520,
      waterIntake: 3
    },
    {
      id: '3',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      mealType: 'Dinner',
      foodItems: 'Salmon, brown rice, broccoli',
      calories: 650,
      waterIntake: 2
    },
    {
      id: '4',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      mealType: 'Snack',
      foodItems: 'Greek yogurt with berries',
      calories: 180,
      waterIntake: 1
    }
  ],
  sleepEntries: [
    {
      id: '1',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      sleepDuration: 7.5,
      sleepQuality: 4,
      sleepNotes: 'Went to bed early'
    },
    {
      id: '2',
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      sleepDuration: 6.5,
      sleepQuality: 3,
      sleepNotes: 'Took time to fall asleep'
    },
    {
      id: '3',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      sleepDuration: 8,
      sleepQuality: 5,
      sleepNotes: 'Felt well-rested'
    }
  ],
  
  // Add new entries with generated IDs
  addStudyEntry: (entry) => set((state) => ({
    studyEntries: [
      ...state.studyEntries,
      {
        id: Math.random().toString(36).substring(2, 9),
        date: new Date(),
        ...entry
      }
    ]
  })),
  
  addWorkoutEntry: (entry) => set((state) => ({
    workoutEntries: [
      ...state.workoutEntries,
      {
        id: Math.random().toString(36).substring(2, 9),
        date: new Date(),
        ...entry
      }
    ]
  })),
  
  addMealEntry: (entry) => set((state) => ({
    mealEntries: [
      ...state.mealEntries,
      {
        id: Math.random().toString(36).substring(2, 9),
        date: new Date(),
        ...entry
      }
    ]
  })),
  
  addSleepEntry: (entry) => set((state) => ({
    sleepEntries: [
      ...state.sleepEntries,
      {
        id: Math.random().toString(36).substring(2, 9),
        date: new Date(),
        ...entry
      }
    ]
  }))
}));