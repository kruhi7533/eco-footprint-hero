
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { mockAchievements } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function Achievements() {
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
          {mockAchievements.map((achievement) => (
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
                  <p className="text-xs text-green-600 mt-1">Earned on {new Date(achievement.date).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
