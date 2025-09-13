import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSettingsStore } from "@/store/settings-store";
import { Moon, Calendar, Clock, Smartphone, Watch } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ open, onOpenChange }) => {
  const {
    darkMode,
    activityPlannerEnabled,
    schedulerEnabled,
    appSyncEnabled,
    smartWatchEnabled,
    toggleDarkMode,
    toggleFeature
  } = useSettingsStore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Settings</DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* Theme Setting */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Appearance</h3>
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Moon className="h-5 w-5" />
                </div>
                <div>
                  <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark theme
                  </p>
                </div>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
          </div>

          {/* Features Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Features</h3>
            <Separator />
            
            {/* Activity Planner */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-secondary/10 text-secondary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <Label htmlFor="activity-planner" className="font-medium">Activity Planner</Label>
                  <p className="text-sm text-muted-foreground">
                    Plan your activities in advance
                  </p>
                </div>
              </div>
              <Switch
                id="activity-planner"
                checked={activityPlannerEnabled}
                onCheckedChange={() => toggleFeature('activityPlanner')}
              />
            </div>
            
            {/* Scheduler */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-accent/10 text-accent">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <Label htmlFor="scheduler" className="font-medium">Scheduler</Label>
                  <p className="text-sm text-muted-foreground">
                    Schedule recurring activities and reminders
                  </p>
                </div>
              </div>
              <Switch
                id="scheduler"
                checked={schedulerEnabled}
                onCheckedChange={() => toggleFeature('scheduler')}
              />
            </div>
          </div>

          {/* Integrations Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Integrations</h3>
            <Separator />
            
            {/* App Sync */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-success/10 text-success">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <Label htmlFor="app-sync" className="font-medium">App Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Sync with mobile apps and other devices
                  </p>
                </div>
              </div>
              <Switch
                id="app-sync"
                checked={appSyncEnabled}
                onCheckedChange={() => toggleFeature('appSync')}
              />
            </div>
            
            {/* Smart Watch */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-warning/10 text-warning">
                  <Watch className="h-5 w-5" />
                </div>
                <div>
                  <Label htmlFor="smart-watch" className="font-medium">Smart Watch</Label>
                  <p className="text-sm text-muted-foreground">
                    Connect and sync with smart watches
                  </p>
                </div>
              </div>
              <Switch
                id="smart-watch"
                checked={smartWatchEnabled}
                onCheckedChange={() => toggleFeature('smartWatch')}
              />
            </div>
          </div>

          <div className="pt-2 text-xs text-center text-muted-foreground">
            <p>HAVitSync v1.0.0</p>
            <p>All preferences are saved automatically</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};