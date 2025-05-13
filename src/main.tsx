
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Make sure Supabase environment variables are set up
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    "Supabase environment variables are not set. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

createRoot(document.getElementById("root")!).render(<App />);
