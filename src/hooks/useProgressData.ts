
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export type ProgressData = Array<{
  category: string;
  current_emissions: number;
  baseline_emissions: number;
  reduction: number;
  percentage: number;
}>;

export function useProgressData() {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProgress = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Fetching progress for user:', user.id);

      const { data, error: rpcError } = await supabase
        .rpc('get_user_progress', {
          user_uuid: user.id
        });

      if (rpcError) {
        console.error('RPC Error:', rpcError);
        throw rpcError;
      }

      if (!data) {
        throw new Error('No data returned from progress function');
      }

      console.log('Progress data:', data);
      setProgressData(data);
    } catch (err) {
      console.error('Progress fetch error:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch progress data'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProgress();
    } else {
      setProgressData(null);
      setError(null);
      setIsLoading(false);
    }
  }, [user]);

  return {
    progressData,
    isLoading,
    error,
    refreshProgress: fetchProgress
  };
}
