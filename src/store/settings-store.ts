// Settings store with Zustand for managing user preferences
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define settings interface
export interface Settings {
  // Theme settings
  darkMode: boolean;
  
  // Feature toggles
  activityPlannerEnabled: boolean;
  schedulerEnabled: boolean;
  appSyncEnabled: boolean;
  smartWatchEnabled: boolean;
  
  // Actions to update settings
  toggleDarkMode: () => void;
  toggleFeature: (feature: 'activityPlanner' | 'scheduler' | 'appSync' | 'smartWatch') => void;
  updateSettings: (settings: Partial<Omit<Settings, 'toggleDarkMode' | 'toggleFeature' | 'updateSettings'>>) => void;
}

// Create store with persistence
export const useSettingsStore = create<Settings>()(
  persist(
    (set) => ({
      // Default settings
      darkMode: false,
      activityPlannerEnabled: false,
      schedulerEnabled: false,
      appSyncEnabled: false,
      smartWatchEnabled: false,
      
      // Toggle dark mode
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      // Toggle a specific feature
      toggleFeature: (feature) => set((state) => {
        switch (feature) {
          case 'activityPlanner':
            return { activityPlannerEnabled: !state.activityPlannerEnabled };
          case 'scheduler':
            return { schedulerEnabled: !state.schedulerEnabled };
          case 'appSync':
            return { appSyncEnabled: !state.appSyncEnabled };
          case 'smartWatch':
            return { smartWatchEnabled: !state.smartWatchEnabled };
          default:
            return {};
        }
      }),
      
      // Update multiple settings at once
      updateSettings: (newSettings) => set((state) => ({ ...state, ...newSettings })),
    }),
    {
      name: 'havitsync-settings', // Local storage key
    }
  )
);