import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, Target, Lightbulb, RotateCcw, ArrowRight } from "lucide-react";
import { useTrackerStore } from "@/store/tracker-store";
import { 
  initGeminiAI, 
  generateInsights, 
  prepareUserDataForInsights, 
  InsightResult,
  isGeminiInitialized
} from "@/integrations/gemini/client";
import { GEMINI_API_KEY } from "@/config/env";
import { Skeleton } from "@/components/ui/skeleton";

interface AIInsightsProps {
  onViewAll?: () => void;
}

// Initialize the Gemini AI when the component is first loaded
let initialized = false;

export const AIInsights: React.FC<AIInsightsProps> = ({ onViewAll }) => {
  const store = useTrackerStore();
  const [insights, setInsights] = useState<InsightResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [healthScore, setHealthScore] = useState<number>(0);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Initialize Gemini if not already done
      if (!initialized && !isGeminiInitialized()) {
        initialized = initGeminiAI(GEMINI_API_KEY as string);
        if (!initialized) {
          throw new Error("Failed to initialize Gemini AI");
        }
      }
      
      // Prepare user data from the store
      const userData = prepareUserDataForInsights(store);
      
      // Generate insights using Gemini
      const newInsights = await generateInsights(userData);
      setInsights(newInsights);
      
      // Calculate a health score based on available data
      calculateHealthScore(userData);
    } catch (err) {
      console.error("Error fetching insights:", err);
      setError("Failed to generate insights. Please try again later.");
      
      // Use fallback insights if available
      if (insights.length === 0) {
        setInsights([
          {
            title: "Smart Recommendations",
            description: "Your study performance peaks between 9-11 AM. Consider scheduling complex topics during this time.",
            confidence: "95%",
            type: "recommendation"
          },
          {
            title: "Progress Trend",
            description: "Your workout consistency has improved 40% this month. Keep up the momentum!",
            confidence: "89%",
            type: "trend"
          },
          {
            title: "Goal Adjustment",
            description: "Based on your sleep data, consider moving your bedtime 30 minutes earlier for optimal recovery.",
            confidence: "92%",
            type: "goal"
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const calculateHealthScore = (userData: any) => {
    // Simple algorithm to calculate health score based on available data
    let score = 75; // Base score
    
    const { studyData, workoutData, mealData, sleepData } = userData;
    
    // Add points for recent activity
    if (studyData.length) score += 5;
    if (workoutData.length > 3) score += 7;
    if (mealData.length > 5) score += 5;
    if (sleepData.length) {
      // Bonus for good sleep habits
      const recentSleep = sleepData.slice(-7);
      const avgSleepQuality = recentSleep.reduce((acc: number, entry: any) => acc + entry.sleepQuality, 0) / recentSleep.length;
      score += avgSleepQuality > 3 ? 8 : 4;
    }
    
    // Cap score at 100
    score = Math.min(100, score);
    setHealthScore(score);
  };
  
  // Generate insights when the component mounts or when store data changes
  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    store.studyEntries.length, 
    store.workoutEntries.length, 
    store.mealEntries.length,
    store.sleepEntries.length
  ]);
  
  // Get appropriate icon based on insight type
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'recommendation':
        return Brain;
      case 'trend':
        return TrendingUp;
      case 'goal':
        return Target;
      default:
        return Lightbulb;
    }
  };
  
  // Get appropriate color based on insight type
  const getInsightColor = (type: string) => {
    switch (type) {
      case 'recommendation':
        return 'text-primary';
      case 'trend':
        return 'text-secondary';
      case 'goal':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };
  
  // Get gradient background for insight icons
  const getInsightGradient = (type: string) => {
    switch (type) {
      case 'recommendation':
        return 'bg-gradient-to-br from-primary to-primary/80';
      case 'trend':
        return 'bg-gradient-to-br from-secondary to-secondary/80';
      case 'goal':
        return 'bg-gradient-to-br from-accent to-accent/80';
      default:
        return 'bg-gradient-to-br from-muted to-muted-foreground/50';
    }
  };
  
  // Style the confidence badge based on confidence percentage
  const getInsightConfidenceStyle = (confidence: string) => {
    // Extract number from percentage string
    const percentage = parseInt(confidence.replace('%', ''));
    
    if (percentage >= 95) {
      return 'bg-success/20 text-success-foreground border border-success/30';
    } else if (percentage >= 85) {
      return 'bg-primary/20 text-primary border border-primary/30';
    } else {
      return 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30';
    }
  };

  return (
    <Card className="w-full group hover:shadow-glow transition-all duration-300 border-primary/20 bg-primary/5">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">AI Health Insights</CardTitle>
          <CardDescription>Personalized recommendations based on your data</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          {!loading && (
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={fetchInsights} 
              aria-label="Refresh insights"
              className="text-primary hover:bg-primary/10"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewAll}
            className="flex items-center space-x-1 hover:bg-primary/10"
          >
            <span>View all</span>
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="mb-4 flex items-center justify-between bg-card/50 p-4 rounded-lg shadow-sm">
          <div>
            <p className="text-sm text-muted-foreground">Health Score</p>
            <p className="text-2xl font-bold text-primary">{healthScore}/100</p>
          </div>
          <div className="h-16 w-16 rounded-full border-4 border-primary/30 flex items-center justify-center bg-background/80 shadow-inner">
            <div 
              className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-primary-foreground"
              style={{ 
                background: `conic-gradient(var(--primary) ${healthScore}%, transparent ${healthScore}%)` 
              }}
            >
              <span className="text-sm font-bold bg-background rounded-full h-8 w-8 flex items-center justify-center">
                {healthScore}%
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-start space-x-4 p-3 rounded-lg bg-card/50">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 shadow-sm">
            <p className="text-sm text-destructive-foreground">{error}</p>
            <Button onClick={fetchInsights} variant="outline" size="sm" className="mt-2 bg-background hover:bg-background/90 border-destructive/20 text-destructive-foreground">
              Try again
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div key={i} className="flex items-start space-x-4 p-3 rounded-lg bg-card/50 hover:bg-card/80 transition-colors group/insight">
                <div className={`rounded-full p-3 ${getInsightGradient(insight.type)}`}>
                  {React.createElement(getInsightIcon(insight.type), { className: "h-5 w-5 text-primary-foreground" })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium group-hover/insight:text-primary transition-colors">{insight.title}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getInsightConfidenceStyle(insight.confidence)}`}>
                      {insight.confidence}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}