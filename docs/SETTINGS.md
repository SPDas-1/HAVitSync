# Settings Feature Documentation

## Overview
The settings system in HAVitSync provides users with the ability to customize their experience, including toggling dark mode, enabling/disabling features, and configuring integrations.

## Components

### 1. Settings Store (`settings-store.ts`)
- Uses Zustand with persist middleware to save settings to localStorage
- Manages all user preferences in a centralized store
- Provides actions to toggle features and update settings

### 2. Theme Provider (`theme-context.tsx`)
- Manages application theme (dark/light mode)
- Applies theme classes to the document
- Provides theme context for components

### 3. Settings Modal (`SettingsModal.tsx`)
- Dialog component with sections for different settings categories:
  - Appearance: Toggle dark mode
  - Features: Activity Planner, Scheduler
  - Integrations: App Sync, Smart Watch

### 4. Header Integration (`Header.tsx`)
- Quick access button to toggle dark mode
- Settings button to open the settings modal
- Integrates with user dropdown menu

## Features

### Dark Mode
- Toggle between light and dark themes
- System persists preference across sessions
- Optimized for readability in both modes

### Activity Planner (Coming Soon)
- Plan activities in advance
- Set goals and targets for various activities
- Organize your weekly schedule

### Scheduler (Coming Soon)
- Schedule recurring activities
- Set reminders and notifications
- Optimize your daily routine

### App Sync (Coming Soon)
- Synchronize data with mobile applications
- Backup and restore user data
- Access your information across devices

### Smart Watch Integration (Coming Soon)
- Connect with popular smart watches
- Track activities directly from wearable devices
- Get notifications on your watch

## Technical Implementation
- State management with Zustand
- Persistent storage using localStorage
- React Context for theme management
- Tailwind CSS for styling with dark mode support
- Responsive design for all screen sizes