
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { toast } from 'sonner'

// Check for Supabase environment variables
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    "Supabase environment variables are not set. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
  
  // Add a delayed toast notification to ensure it appears after the app renders
  setTimeout(() => {
    toast.error(
      "Supabase configuration missing. Please set up your environment variables.",
      { duration: 10000 }
    );
  }, 1000);
}

createRoot(document.getElementById("root")!).render(<App />);
