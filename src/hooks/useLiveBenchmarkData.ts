
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
      console.log('Fetching live benchmark data...');
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No authenticated session');
      }

      const { data, error } = await supabase.functions.invoke('climatiq-benchmark', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Failed to fetch benchmark data: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data received from benchmark API');
      }

      console.log('Successfully fetched live benchmark data:', data);
      return data;
    },
    staleTime: 1000 * 60 * 30, // Consider data fresh for 30 minutes
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
    retry: 2,
    onError: (error) => {
      console.error('Live benchmark data fetch error:', error);
    },
    onSuccess: (data) => {
      console.log('Live benchmark data loaded successfully');
    }
  });
}
