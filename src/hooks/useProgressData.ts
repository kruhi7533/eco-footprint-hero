import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export interface CategoryProgress {
  transportation: {
    percentage: number;
    reduction: number;
    baseline: number;
    current: number;
  };
  energy: {
    percentage: number;
    reduction: number;
    baseline: number;
    current: number;
  };
  diet: {
    percentage: number;
    reduction: number;
    baseline: number;
    current: number;
  };
  waste: {
    percentage: number;
    reduction: number;
    baseline: number;
    current: number;
  };
}

interface ProgressData {
  category: 'transportation' | 'energy' | 'diet' | 'waste';
  percentage: number;
  reduction: number;
  baseline_emissions: number;
  current_emissions: number;
}

interface UseProgressDataReturn {
  progress: CategoryProgress;
  isLoading: boolean;
  error: Error | null;
  refreshProgress: () => Promise<void>;
}

export function useProgressData(): UseProgressDataReturn {
  const { profile } = useAuth();
  const [progress, setProgress] = useState<CategoryProgress>({
    transportation: { percentage: 0, reduction: 0, baseline: 0, current: 0 },
    energy: { percentage: 0, reduction: 0, baseline: 0, current: 0 },
    diet: { percentage: 0, reduction: 0, baseline: 0, current: 0 },
    waste: { percentage: 0, reduction: 0, baseline: 0, current: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProgress = async () => {
    console.log('Fetching progress, profile:', profile);
    if (!profile?.id) {
      console.log('No profile ID available');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Calling get_user_progress with user_uuid:', profile.id);

      // Call the get_user_progress function
      const { data, error: progressError } = await supabase
        .rpc('get_user_progress', {
          user_uuid: profile.id
        });

      console.log('Progress data:', data);
      console.log('Progress error:', progressError);

      if (progressError) throw progressError;

      // Transform the data into our CategoryProgress format
      const newProgress: CategoryProgress = {
        transportation: {
          percentage: 0,
          reduction: 0,
          baseline: 0,
          current: 0
        },
        energy: {
          percentage: 0,
          reduction: 0,
          baseline: 0,
          current: 0
        },
        diet: {
          percentage: 0,
          reduction: 0,
          baseline: 0,
          current: 0
        },
        waste: {
          percentage: 0,
          reduction: 0,
          baseline: 0,
          current: 0
        }
      };

      // Update each category with the returned data
      (data as ProgressData[]).forEach((item) => {
        newProgress[item.category] = {
          percentage: Math.round(item.percentage || 0),
          reduction: Number(item.reduction.toFixed(1)),
          baseline: Number(item.baseline_emissions.toFixed(1)),
          current: Number(item.current_emissions.toFixed(1))
        };
      });

      console.log('Setting new progress:', newProgress);
      setProgress(newProgress);
      setError(null);
    } catch (err) {
      console.error('Error fetching progress data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch progress data'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered, profile:', profile);
    fetchProgress();

    // Set up real-time subscription for carbon entries
    const carbonEntriesSubscription = supabase
      .channel('carbon_entries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'carbon_entries',
          filter: `user_id=eq.${profile?.id}`
        },
        () => {
          console.log('Carbon entry changed, refreshing progress');
          fetchProgress();
        }
      )
      .subscribe();

    // Refresh data periodically as backup
    const intervalId = setInterval(fetchProgress, 5 * 60 * 1000);

    return () => {
      carbonEntriesSubscription.unsubscribe();
      clearInterval(intervalId);
    };
  }, [profile?.id]);

  return {
    progress,
    isLoading,
    error,
    refreshProgress: fetchProgress
  };
} 