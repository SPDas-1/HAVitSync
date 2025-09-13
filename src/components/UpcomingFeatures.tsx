import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Smartphone, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const UpcomingFeatures: React.FC = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Watch Integration Card */}
      <Card className="group hover:shadow-glow transition-all duration-300 border-primary/20 bg-primary/5 overflow-hidden">
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-secondary/20 text-secondary font-medium">
            Coming Soon
          </Badge>
        </div>
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl font-bold">Smartwatch Integration</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Seamlessly connect your wearable devices for real-time tracking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative h-48 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center bg-background/80">
                <div className="w-24 h-24 rounded-full border-4 border-primary/40 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Steps</div>
                    <div className="text-2xl font-bold text-primary">8,742</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/80 to-transparent">
              <div className="text-sm text-center text-foreground/80">
                Preview of watch data integration
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
              <p className="text-sm text-muted-foreground">Sync health data from Apple Watch, Fitbit, Garmin and more</p>
            </div>
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
              <p className="text-sm text-muted-foreground">Automatically import workouts, sleep data, and heart metrics</p>
            </div>
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
              <p className="text-sm text-muted-foreground">Receive goals and AI insights directly on your watch</p>
            </div>
          </div>

          <Button variant="outline" className="w-full border-primary/20 text-primary hover:bg-primary/10">
            Join Waitlist
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Mobile App Card */}
      <Card className="group hover:shadow-glow transition-all duration-300 border-secondary/20 bg-secondary/5 overflow-hidden">
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30 font-medium">
            In Development
          </Badge>
        </div>
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-secondary/10">
              <Smartphone className="h-5 w-5 text-secondary" />
            </div>
            <CardTitle className="text-xl font-bold">Mobile Application</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Track your health and activities on the go with our native app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative h-48 rounded-lg bg-gradient-to-br from-secondary/10 to-primary/10 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-48 rounded-2xl border-8 border-secondary/20 flex items-center justify-center bg-background/80">
                <div className="w-full h-full p-2 flex flex-col">
                  <div className="w-12 h-1 rounded-full bg-secondary/30 mx-auto mb-3"></div>
                  <div className="flex-1 rounded-lg bg-secondary/5 p-1 flex flex-col gap-1">
                    <div className="h-2 w-3/4 rounded-full bg-secondary/20"></div>
                    <div className="h-2 w-1/2 rounded-full bg-secondary/20"></div>
                    <div className="h-6 w-full rounded-md bg-secondary/10 mt-1"></div>
                    <div className="h-6 w-full rounded-md bg-secondary/10"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/80 to-transparent">
              <div className="text-sm text-center text-foreground/80">
                Mobile app interface preview
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 mr-2"></div>
              <p className="text-sm text-muted-foreground">Log meals, workouts, and study sessions with just a few taps</p>
            </div>
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 mr-2"></div>
              <p className="text-sm text-muted-foreground">Get push notifications for health reminders and achievements</p>
            </div>
            <div className="flex items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 mr-2"></div>
              <p className="text-sm text-muted-foreground">Access your data offline and sync when connected</p>
            </div>
          </div>

          <Button variant="outline" className="w-full border-secondary/20 text-secondary hover:bg-secondary/10">
            Join Beta Testers
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};