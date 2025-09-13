import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { TrackersSection } from "@/components/TrackersSection";
import { AIInsights } from "@/components/AIInsights";
import { StatsSummary } from "@/components/StatsSummary";
import { UpcomingFeatures } from "@/components/UpcomingFeatures";
import { LoginModal } from "@/components/LoginModal";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";

const Index = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { user } = useAuth();

  const handleOpenLogin = () => setLoginModalOpen(true);
  
  const handleGetStarted = () => {
    if (user) {
      // If user is logged in, redirect to dashboard or trackers
      toast({ 
        title: "Welcome back!", 
        description: `Good to see you again, ${user.displayName || user.email}` 
      });
    } else {
      // If user is not logged in, open login modal
      setLoginModalOpen(true);
    }
  };
  
  const handleViewAllInsights = () => {
    toast({ title: "All Insights", description: "Full insights coming soon!" });
  };
  return (
    <div className="min-h-screen bg-background">
      <Header onLoginClick={handleOpenLogin} />
      <main>
        <section id="dashboard">
          <HeroSection onGetStarted={handleGetStarted} />
        </section>
        <section id="trackers">
          <TrackersSection />
        </section>
        <section id="stats">
          <div className="py-20 bg-background">
            <div className="container mx-auto px-6">
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-4xl font-bold">Your Health Stats</h2>
                <p className="text-xl text-muted-foreground">Comprehensive view of your health metrics</p>
              </div>
              <StatsSummary />
            </div>
          </div>
        </section>
        <section id="insights">
          <div className="py-20 bg-muted/30">
            <div className="container mx-auto px-6">
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-4xl font-bold">AI Powered Insights</h2>
                <p className="text-xl text-muted-foreground">Get personalized recommendations based on your data</p>
              </div>
              <AIInsights onViewAll={handleViewAllInsights} />
            </div>
          </div>
        </section>
        
        <section id="roadmap">
          <div className="py-20 bg-background">
            <div className="container mx-auto px-6">
              <div className="text-center space-y-4 mb-16">
                <h2 className="text-4xl font-bold">Coming Soon</h2>
                <p className="text-xl text-muted-foreground">Exciting new features on our roadmap</p>
              </div>
              <UpcomingFeatures />
            </div>
          </div>
        </section>
      </main>
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </div>
  );
};

export default Index;
