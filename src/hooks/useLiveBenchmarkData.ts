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
        console.warn('No authenticated session, using default benchmark data');
        return getDefaultBenchmarkData();
      }

      try {
        const { data, error } = await supabase.functions.invoke('climatiq-benchmark', {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        if (error) {
          console.error('Supabase function error:', error);
          console.warn('Using default benchmark data due to Edge Function error');
          return getDefaultBenchmarkData();
        }

        if (!data) {
          console.warn('No data received from benchmark API, using defaults');
          return getDefaultBenchmarkData();
        }

        return data as BenchmarkData;
      } catch (err) {
        console.error('Error in benchmark data fetch:', err);
        return getDefaultBenchmarkData();
      }
    },
    retry: false,
    onError: (error) => {
      console.warn('Benchmark data fetch failed:', error);
    },
  });
}

// Default benchmark data for fallback
function getDefaultBenchmarkData(): BenchmarkData {
  return {
    global: {
      electricity: 2.5,
      transportation: 4.0,
      heating: 1.5,
      average_daily: 8.0
    },
    country: {
      electricity: 2.0,
      transportation: 3.5,
      heating: 1.2,
      average_daily: 6.7
    },
    regional: {
      electricity: 1.8,
      transportation: 3.0,
      heating: 1.0,
      average_daily: 5.8
    },
    lastUpdated: new Date().toISOString()
  };
}
