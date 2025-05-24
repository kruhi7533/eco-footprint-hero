
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getAchievements } from "@/lib/supabase";

export function Achievements() {
  const { data: achievements, isLoading, error } = useQuery({
    queryKey: ['achievements'],
    queryFn: getAchievements,
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span>Achievements</span>
          </CardTitle>
          <CardDescription>Complete eco-friendly actions to unlock achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-ecoPrimary" />
            <span className="ml-2">Loading achievements...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
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

  // Define all possible achievements with their criteria
  const allAchievements = [
    {
      id: "achievement1",
      title: "Carbon Cutter",
      description: "Reduce transportation emissions by 50kg",
      earned: false,
      date: null,
    },
    {
      id: "achievement2",
      title: "Energy Saver", 
      description: "Save 100kWh of energy",
      earned: false,
      date: null,
    },
    {
      id: "achievement3",
      title: "Waste Warrior",
      description: "Reduce waste by 20kg", 
      earned: false,
      date: null,
    },
    {
      id: "achievement4",
      title: "Eco Streak", 
      description: "Log your footprint for 7 consecutive days",
      earned: false,
      date: null,
    },
    {
      id: "achievement5",
      title: "Green Guardian", 
      description: "Master of all eco-friendly habits",
      earned: false,
      date: null,
    },
  ];

  // Merge earned achievements with all possible achievements
  const mergedAchievements = allAchievements.map(achievement => {
    const earnedAchievement = achievements?.find(a => a.achievement_id === achievement.id);
    return {
      ...achievement,
      earned: !!earnedAchievement,
      date: earnedAchievement?.earned_at || null
    };
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <span>Achievements</span>
        </CardTitle>
        <CardDescription>Complete eco-friendly actions to unlock achievements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mergedAchievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={cn(
                "flex items-start p-3 border rounded-md",
                achievement.earned 
                  ? "border-green-200 bg-green-50" 
                  : "border-gray-200 bg-gray-50 opacity-60"
              )}
            >
              <div className={cn(
                "flex items-center justify-center rounded-full w-10 h-10 mr-3",
                achievement.earned ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-400"
              )}>
                <Star className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{achievement.title}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                {achievement.earned && achievement.date && (
                  <p className="text-xs text-green-600 mt-1">
                    Earned on {new Date(achievement.date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
