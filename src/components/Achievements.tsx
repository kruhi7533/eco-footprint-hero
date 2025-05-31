import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getAchievements, getAchievementDefinitions, type AchievementDefinition } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export function Achievements() {
  const { profile } = useAuth();
  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: getAchievements,
  });

  const { data: definitions, isLoading: definitionsLoading, error } = useQuery({
    queryKey: ['achievement-definitions'],
    queryFn: getAchievementDefinitions,
  });

  const isLoading = achievementsLoading || definitionsLoading;

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icons.Award className="h-5 w-5 text-yellow-500" />
            <span>Achievements</span>
          </CardTitle>
          <CardDescription>Complete eco-friendly actions to unlock achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Icons.Loader2 className="h-8 w-8 animate-spin text-ecoPrimary" />
            <span className="ml-2">Loading achievements...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !definitions) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Icons.Award className="h-5 w-5 text-yellow-500" />
            <span>Achievements</span>
          </CardTitle>
          <CardDescription>Complete eco-friendly actions to unlock achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 py-8">
            Failed to load achievements. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort achievements by level and then by points
  const sortedDefinitions = (definitions as AchievementDefinition[]).sort((a, b) => {
    if (a.level !== b.level) return a.level - b.level;
    return b.points - a.points;
  });

  // Merge earned achievements with definitions
  const mergedAchievements = sortedDefinitions.map(definition => {
    const earnedAchievement = achievements?.find(a => a.achievement_id === definition.achievement_id);
    const progress = calculateProgress(definition, profile, achievements);

    return {
      ...definition,
      earned: !!earnedAchievement,
      date: earnedAchievement?.earned_at || null,
      progress
    };
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icons.Award className="h-5 w-5 text-yellow-500" />
          <span>Achievements</span>
        </CardTitle>
        <CardDescription>Complete eco-friendly actions to unlock achievements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mergedAchievements.map((achievement) => {
            const Icon = (Icons as any)[achievement.icon_name] || Icons.Award;
            return (
              <div 
                key={achievement.id} 
                className={cn(
                  "flex items-start p-4 border rounded-lg transition-all duration-200",
                  achievement.earned 
                    ? "border-green-200 bg-green-50 hover:bg-green-100" 
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100 opacity-80"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center rounded-full w-12 h-12 mr-4 flex-shrink-0",
                  achievement.earned ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-400"
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-xs text-gray-500">Level {achievement.level} • {achievement.points} points</p>
                    </div>
                    {achievement.earned && (
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        Earned
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                  
                  {/* Progress bar */}
                  {!achievement.earned && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div 
                        className="bg-ecoPrimary h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, achievement.progress)}%` }}
                      />
                    </div>
                  )}
                  
                  {achievement.earned && achievement.date && (
                    <p className="text-xs text-green-600">
                      Earned on {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to calculate achievement progress
function calculateProgress(
  definition: AchievementDefinition,
  profile: any,
  achievements: any[]
): number {
  if (!profile) return 0;

  switch (definition.requirements.type) {
    case 'single':
      if (!definition.requirements.metric || !definition.requirements.threshold) return 0;
      const currentValue = profile[definition.requirements.metric] || 0;
      return Math.min(100, (currentValue / definition.requirements.threshold) * 100);

    case 'multiple':
      if (!definition.requirements.requirements) return 0;
      const progressValues = definition.requirements.requirements.map(req => {
        const value = profile[req.metric] || 0;
        return Math.min(100, (value / req.threshold) * 100);
      });
      return progressValues.reduce((sum, val) => sum + val, 0) / progressValues.length;

    case 'achievements':
      if (!definition.requirements.required) return 0;
      const earnedCount = definition.requirements.required.filter(id => 
        achievements?.some(a => a.achievement_id === id)
      ).length;
      return (earnedCount / definition.requirements.required.length) * 100;

    default:
      return 0;
  }
}
