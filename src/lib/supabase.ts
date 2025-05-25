import { createClient } from '@supabase/supabase-js'

// Types for our Supabase database
export type Profile = {
  id: string;
  name: string;
  email: string;
  joined_date: string;
  level: number;
  eco_points: number;
  consecutive_days: number;
  transportation_reductions: number;
  energy_savings: number;
  waste_reduction: number;
  measurement_unit: 'metric' | 'imperial';
  language: 'en' | 'es' | 'fr';
  notifications_enabled: boolean;
  data_sharing_enabled: boolean;
  updated_at: string;
};

export type CarbonEntry = {
  id: string;
  user_id: string;
  date: string;
  category: 'transportation' | 'energy' | 'diet' | 'waste';
  activity_type: string;
  amount: number;
  emissions: number;
  notes?: string;
  created_at: string;
};

export type DailySummary = {
  id: string;
  user_id: string;
  date: string;
  transportation: number;
  energy: number;
  diet: number;
  waste: number;
  total: number;
  created_at: string;
  updated_at: string;
};

export type Achievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  title: string;
  description: string;
  earned_at: string;
};

export type EcoTip = {
  id: string;
  category: string;
  tip: string;
  impact_level: number;
};

// Check if Supabase environment variables are set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Display a more helpful error message in development
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "ERROR: Supabase environment variables are missing. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment."
  );
}

// Initialize Supabase client with fallbacks to prevent runtime errors
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Helper function to get a user's profile
export const getProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Try to get the existing profile
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') {
      // Profile doesn't exist, create one
      console.log("Profile doesn't exist, creating new profile for user", user.id);
      
      const newProfile: Partial<Profile> = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        joined_date: new Date().toISOString(),
        level: 1,
        eco_points: 0,
        consecutive_days: 0,
        transportation_reductions: 0,
        energy_savings: 0,
        waste_reduction: 0,
        measurement_unit: 'metric',
        language: 'en',
        notifications_enabled: true,
        data_sharing_enabled: true,
        updated_at: new Date().toISOString()
      };
      
      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select('*')
        .single();
        
      if (createError) {
        console.error('Error creating profile:', createError);
        throw createError;
      }
      
      return createdProfile as Profile;
    } else {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }
  
  return data as Profile;
};

// Helper function to update a user's profile
export const updateProfile = async (updates: Partial<Profile>) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();
    
  if (error) {
    throw error;
  }
  
  return data as Profile;
};

// Helper function to add a carbon footprint entry
export const addCarbonEntry = async (entry: Omit<CarbonEntry, 'id' | 'user_id' | 'created_at'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('carbon_entries')
    .insert({
      ...entry,
      user_id: user.id
    })
    .select()
    .single();
    
  if (error) {
    throw error;
  }
  
  return data as CarbonEntry;
};

// Helper function to get daily summaries for a date range
export const getDailySummaries = async (startDate: string, endDate: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('daily_summaries')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date');
    
  if (error) {
    throw error;
  }
  
  return data as DailySummary[];
};

// Helper function to get user achievements
export const getAchievements = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('user_id', user.id);
    
  if (error) {
    throw error;
  }
  
  return data as Achievement[];
};

// Helper function to get eco tips
export const getEcoTips = async (category?: string) => {
  let query = supabase
    .from('eco_tips')
    .select('*');
    
  if (category) {
    query = query.eq('category', category);
  }
  
  const { data, error } = await query;
    
  if (error) {
    throw error;
  }
  
  return data as EcoTip[];
};
