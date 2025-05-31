
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, Profile, getProfile } from '@/lib/supabase';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user || null);

        if (initialSession?.user) {
          const userProfile = await getProfile();
          setProfile(userProfile);
        }

        // Set up auth listener
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          async (_event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user || null);

            if (newSession?.user) {
              try {
                const userProfile = await getProfile();
                setProfile(userProfile);
              } catch (error) {
                console.error('Error fetching profile:', error);
              }
            } else {
              setProfile(null);
            }
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error in auth initialization:', error);
        toast.error('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Signed in successfully!');
    } catch (error: any) {
      toast.error(`Sign in failed: ${error.message}`);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            name 
          }
        }
      });
      
      if (error) throw error;
      toast.success('Account created successfully! Check your email to verify your account.');
    } catch (error: any) {
      toast.error(`Sign up failed: ${error.message}`);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error(`Sign out failed: ${error.message}`);
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const userProfile = await getProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
