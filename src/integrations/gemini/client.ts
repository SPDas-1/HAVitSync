// Google Gemini API client for AI insights
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with API key
// In production, this should be stored in environment variables
let genAI: GoogleGenerativeAI | null = null;

export interface InsightResult {
  title: string;
  description: string;
  confidence: string;
  type: 'recommendation' | 'trend' | 'goal';
}

export const initGeminiAI = (apiKey: string) => {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log("Gemini API initialized successfully");
    return true;
  } catch (error) {
    console.error("Failed to initialize Gemini API:", error);
    return false;
  }
};

export const isGeminiInitialized = () => {
  return genAI !== null;
};

export const generateInsights = async (
  userData: {
    studyData?: any[];
    workoutData?: any[];
    mealData?: any[];
    sleepData?: any[];
  }
): Promise<InsightResult[]> => {
  if (!genAI) {
    throw new Error("Gemini API not initialized. Call initGeminiAI first.");
  }

  try {
    // Create a prompt based on user data
    const prompt = createPromptFromUserData(userData);
    
    // Get a generative model - using gemini-pro for text generation
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response to get insights
    return parseInsightsFromResponse(text);
  } catch (error) {
    console.error("Error generating insights:", error);
    return getFallbackInsights();
  }
};

const createPromptFromUserData = (userData: any) => {
  const { studyData, workoutData, mealData, sleepData } = userData;
  
  let prompt = "Based on the following health and wellness data, generate 3 personalized insights. ";
  prompt += "Format your response as a JSON array with objects containing 'title', 'description', 'confidence' (as a percentage string), ";
  prompt += "and 'type' (which should be one of 'recommendation', 'trend', or 'goal'). ";
  prompt += "Make the insights actionable, specific, and data-driven.\n\n";
  
  if (studyData && studyData.length) {
    prompt += "Study data: " + JSON.stringify(studyData) + "\n";
  }
  
  if (workoutData && workoutData.length) {
    prompt += "Workout data: " + JSON.stringify(workoutData) + "\n";
  }
  
  if (mealData && mealData.length) {
    prompt += "Meal data: " + JSON.stringify(mealData) + "\n";
  }
  
  if (sleepData && sleepData.length) {
    prompt += "Sleep data: " + JSON.stringify(sleepData) + "\n";
  }
  
  // If no data is available, ask for general wellness tips
  if (!studyData?.length && !workoutData?.length && !mealData?.length && !sleepData?.length) {
    prompt += "No specific user data is available. Please generate general wellness insights that would be helpful for anyone tracking their health, study habits, workouts, meals, and sleep.";
  }
  
  return prompt;
};

const parseInsightsFromResponse = (text: string): InsightResult[] => {
  try {
    // Find JSON in the text - sometimes AI might include explanatory text
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response");
    }
    
    const jsonString = jsonMatch[0];
    const insights = JSON.parse(jsonString);
    
    return insights.map((insight: any) => ({
      title: insight.title || "AI Insight",
      description: insight.description || "No description provided",
      confidence: insight.confidence || "85%",
      type: insight.type || "recommendation"
    })).slice(0, 3); // Ensure we only return at most 3 insights
  } catch (error) {
    console.error("Error parsing insights:", error);
    return getFallbackInsights();
  }
};

// Fallback insights if the API call fails
const getFallbackInsights = (): InsightResult[] => {
  return [
    {
      title: "Smart Recommendations",
      description: "Consider scheduling complex study tasks in the morning when cognitive performance tends to be higher for most people.",
      confidence: "90%",
      type: "recommendation"
    },
    {
      title: "Progress Trend",
      description: "Consistent workouts, even short ones, lead to better long-term results than occasional intense sessions.",
      confidence: "85%",
      type: "trend"
    },
    {
      title: "Goal Adjustment",
      description: "Setting a regular sleep schedule can significantly improve your overall wellness and productivity.",
      confidence: "92%",
      type: "goal"
    }
  ];
};

// Helper function to get user data from the store
export const prepareUserDataForInsights = (store: any) => {
  const { studyEntries, workoutEntries, mealEntries, sleepEntries } = store;
  
  // Process data to make it more useful for insights generation
  // Only send recent data (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const processDate = (entry: any) => {
    const entryDate = entry.date instanceof Date ? entry.date : new Date(entry.date);
    return entryDate >= thirtyDaysAgo;
  };
  
  return {
    studyData: studyEntries.filter(processDate),
    workoutData: workoutEntries.filter(processDate),
    mealData: mealEntries.filter(processDate),
    sleepData: sleepEntries.filter(processDate)
  };
};