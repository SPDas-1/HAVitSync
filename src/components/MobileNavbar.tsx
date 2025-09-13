import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, Bell, Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { useSettingsStore } from "@/store/settings-store";

interface MobileNavbarProps {
  className?: string;
  onSettingsClick: () => void;
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({ className, onSettingsClick }) => {
  // Smooth scroll function for navigation links
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Scroll with smooth behavior
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Update URL without page reload
      history.pushState(null, '', `#${id}`);
    }
  };

  const handleNotification = () => {
    toast({ title: "No new notifications", description: "You're all caught up!" });
  };

  return (
    <div className={cn("md:hidden", className)}>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
            <Menu className="h-4 w-4 sm:h-6 sm:w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[80%] sm:w-[350px]">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-wellness rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">HAV</span>
              </div>
              <span className="text-2xl font-bold">HAVitSync</span>
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-5">
            <SheetClose asChild>
              <a 
                href="#dashboard" 
                className="flex items-center px-3 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth font-medium"
                onClick={(e) => handleSmoothScroll(e, 'dashboard')}
              >
                Dashboard
              </a>
            </SheetClose>
            <SheetClose asChild>
              <a 
                href="#trackers" 
                className="flex items-center px-3 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth font-medium"
                onClick={(e) => handleSmoothScroll(e, 'trackers')}
              >
                Trackers
              </a>
            </SheetClose>
            <SheetClose asChild>
              <a 
                href="#stats" 
                className="flex items-center px-3 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth font-medium"
                onClick={(e) => handleSmoothScroll(e, 'stats')}
              >
                Stats
              </a>
            </SheetClose>
            <SheetClose asChild>
              <a 
                href="#insights" 
                className="flex items-center px-3 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth font-medium"
                onClick={(e) => handleSmoothScroll(e, 'insights')}
              >
                AI Insights
              </a>
            </SheetClose>
            <SheetClose asChild>
              <a 
                href="#roadmap" 
                className="flex items-center px-3 py-2 text-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth font-medium"
                onClick={(e) => handleSmoothScroll(e, 'roadmap')}
              >
                Coming Soon
              </a>
            </SheetClose>
          </nav>
          
          <Separator className="my-6" />
          
          <div className="flex flex-col space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => {
                handleNotification();
                // No need to close the sheet here as notifications are displayed as a toast
              }}
            >
              <Bell className="mr-2 h-5 w-5" />
              Notifications
            </Button>
            <SheetClose asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={onSettingsClick}
              >
                <Settings className="mr-2 h-5 w-5" />
                Settings
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};