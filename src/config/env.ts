// Environment configuration for API keys and settings
// In a real production environment, these should be stored in .env files
// and not committed to version control

// For Vite, environment variables must be prefixed with VITE_
// and accessed via import.meta.env instead of process.env
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// For development:
// 1. Create a .env file in the project root
// 2. Add VITE_GEMINI_API_KEY=your_gemini_api_key
// 3. Restart your dev server

// Default fallback for demo mode - use this only for demonstration purposes
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';