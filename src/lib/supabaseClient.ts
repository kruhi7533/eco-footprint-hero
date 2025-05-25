import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

// Validate environment variables
const validateEnvVars = () => {
  const missing = [];
  
  if (!import.meta.env.VITE_SUPABASE_URL) {
    missing.push('VITE_SUPABASE_URL');
  }
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
    missing.push('VITE_SUPABASE_ANON_KEY');
  }
  
  if (missing.length > 0) {
    const message = `Missing required environment variables: ${missing.join(', ')}`;
    console.error(message);
    toast.error(message);
    return false;
  }
  
  return true;
};

// Get environment variables with validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables before creating client
if (!validateEnvVars()) {
  throw new Error('Missing required environment variables');
}

// Create a single instance of the Supabase client
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      storageKey: 'eco-footprint-auth',
      storage: window.localStorage,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-client-info': 'ecostep-web'
      }
    }
  }
);

// Add auth state change handler
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user?.id);
  
  if (event === 'SIGNED_OUT') {
    // Clear any cached data
    localStorage.removeItem('eco-footprint-auth');
  }
});

export default supabase; 