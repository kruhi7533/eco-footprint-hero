
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface BenchmarkData {
  global: {
    electricity: number;
    transportation: number;
    heating: number;
    average_daily: number;
  };
  country: {
    electricity: number;
    transportation: number;
    heating: number;
    average_daily: number;
  };
  regional: {
    electricity: number;
    transportation: number;
    heating: number;
    average_daily: number;
  };
  lastUpdated: string;
}

export function useLiveBenchmarkData() {
  return useQuery({
    queryKey: ['live-benchmark-data'],
    queryFn: async (): Promise<BenchmarkData> => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No authenticated session');
      }

      const response = await fetch('/supabase/functions/v1/climatiq-benchmark', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    },
    staleTime: 1000 * 60 * 30, // Consider data fresh for 30 minutes
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
    retry: 2,
  });
}
