
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase, DailySummary, getProfile, Profile } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useCarbonData(days = 7) {
  const { user } = useAuth();
  
  // Get date range (last X days)
  const getDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    
    // Format dates as YYYY-MM-DD
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };
    
    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate)
    };
  };
  
  // Fetch daily summaries
  const { data: summaries, isLoading: isLoadingSummaries, error: summariesError } = useQuery({
    queryKey: ['dailySummaries', user?.id, days],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { startDate, endDate } = getDateRange();
      const { data, error } = await supabase
        .from('daily_summaries')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date');
        
      if (error) throw error;
      
      // If we don't have data for all days, fill in empty days
      const filledData = fillMissingDays(data || [], startDate, endDate);
      return filledData as DailySummary[];
    },
    enabled: !!user,
  });
  
  // Fetch user profile
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      try {
        return await getProfile();
      } catch (error: any) {
        toast.error(`Error loading profile: ${error.message}`);
        throw error;
      }
    },
    enabled: !!user,
  });
  
  // Fill in missing days with zero values
  const fillMissingDays = (data: DailySummary[], startDateStr: string, endDateStr: string) => {
    const result: DailySummary[] = [];
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    // Create a map of existing data by date
    const dataByDate = new Map();
    data.forEach(item => {
      dataByDate.set(item.date, item);
    });
    
    // Loop through each day in the range
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      
      if (dataByDate.has(dateStr)) {
        // Use existing data
        result.push(dataByDate.get(dateStr));
      } else {
        // Create empty data for this day
        result.push({
          id: `empty-${dateStr}`,
          user_id: user?.id || '',
          date: dateStr,
          transportation: 0,
          energy: 0,
          diet: 0,
          waste: 0,
          total: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }
    
    return result;
  };
  
  // Calculate improvements if we have data
  const calculateImprovements = () => {
    if (!summaries || summaries.length < 2) return {
      transportation: 0,
      energy: 0,
      diet: 0,
      waste: 0,
      overall: 0
    };
    
    const firstDay = summaries[0];
    const lastDay = summaries[summaries.length - 1];
    
    const calculateImprovement = (first: number, last: number) => {
      if (first === 0) return 0;
      const diff = ((first - last) / first) * 100;
      return diff > 0 ? parseFloat(diff.toFixed(1)) : 0;
    };
    
    return {
      transportation: calculateImprovement(firstDay.transportation, lastDay.transportation),
      energy: calculateImprovement(firstDay.energy, lastDay.energy),
      diet: calculateImprovement(firstDay.diet, lastDay.diet),
      waste: calculateImprovement(firstDay.waste, lastDay.waste),
      overall: calculateImprovement(firstDay.total, lastDay.total)
    };
  };
  
  const isLoading = isLoadingSummaries || isLoadingProfile;
  const error = summariesError;
  const improvements = calculateImprovements();
  
  return {
    summaries: summaries || [],
    profile: profile as Profile | null,
    isLoading,
    error,
    improvements
  };
}
