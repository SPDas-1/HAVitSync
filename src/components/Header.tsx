
import { Button } from "@/components/ui/button";
import { User, Bell, Settings, LogOut } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import React from "react";
import { useAuth } from "@/contexts/auth-context";
import { logoutUser } from "@/integrations/firebase/client";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  onLoginClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const { user, loading } = useAuth();
  
  const handleNotification = () => {
    toast({ title: "No new notifications", description: "You're all caught up!" });
  };
  
  const handleSettings = () => {
    toast({ title: "Settings", description: "Settings coming soon!" });
  };
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast({ title: "Logged out", description: "You have been logged out successfully" });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to log out. Please try again.", 
        variant: "destructive" 
      });
    }
  };
  
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
  return (
    <header className="w-full bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-wellness rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">HAV</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">HAVitSync</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#dashboard" 
              className="text-foreground hover:text-primary transition-smooth font-medium"
              onClick={(e) => handleSmoothScroll(e, 'dashboard')}
            >
              Dashboard
            </a>
            <a 
              href="#trackers" 
              className="text-foreground hover:text-primary transition-smooth font-medium"
              onClick={(e) => handleSmoothScroll(e, 'trackers')}
            >
              Trackers
            </a>
            <a 
              href="#stats" 
              className="text-foreground hover:text-primary transition-smooth font-medium"
              onClick={(e) => handleSmoothScroll(e, 'stats')}
            >
              Stats
            </a>
            <a 
              href="#insights" 
              className="text-foreground hover:text-primary transition-smooth font-medium"
              onClick={(e) => handleSmoothScroll(e, 'insights')}
            >
              AI Insights
            </a>
            <a 
              href="#roadmap" 
              className="text-foreground hover:text-primary transition-smooth font-medium"
              onClick={(e) => handleSmoothScroll(e, 'roadmap')}
            >
              Coming Soon
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative" onClick={handleNotification}>
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-warning rounded-full"></span>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSettings}>
              <Settings className="h-5 w-5" />
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full h-8 w-8 p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                      <AvatarFallback>{user.displayName?.[0] || user.email?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSettings}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" className="flex items-center space-x-2" onClick={onLoginClick} disabled={loading}>
                <User className="h-4 w-4" />
                <span>{loading ? "Loading..." : "Login"}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};