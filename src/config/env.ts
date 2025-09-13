// Environment configuration for API keys and settings
// In a real production environment, these should be stored in .env files
// and not committed to version control

// Replace this with your actual Gemini API key
// This should be loaded from environment variables in production
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

// Example of how to use this with .env files:
// 1. Create a .env file with GEMINI_API_KEY=your_key_here
// 2. Install dotenv and import it at the app entry point