import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { ChartLine, Leaf, Lightbulb, TrendingUp, Utensils, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ImprovementTips } from "@/components/ImprovementTips";
import { useProgressData } from "@/hooks/useProgressData";
import { Button } from "@/components/ui/button";
import { Progress as ProgressIndicator } from "@/components/ui/progress";

export function Progress() {
  const { profile } = useAuth();
  const { progress, isLoading, error, refreshProgress } = useProgressData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-ecoPrimary" />
        <span className="ml-2">Loading your progress...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Sorry, we couldn't load your progress data. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  const categories = [
    { key: 'transportation', label: 'Transportation', color: 'bg-blue-500' },
    { key: 'energy', label: 'Energy', color: 'bg-yellow-500' },
    { key: 'diet', label: 'Diet', color: 'bg-green-500' },
    { key: 'waste', label: 'Waste', color: 'bg-purple-500' }
  ] as const;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header section */}
      <div className="rounded-lg p-6 eco-gradient">
        <h1 className="text-2xl font-bold">Your Progress</h1>
        <p className="opacity-90">Track your carbon reduction journey and see your improvements over time.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
            <span className="block text-sm opacity-80">Current Level</span>
            <span className="text-xl font-bold">{profile?.level || 1}</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
            <span className="block text-sm opacity-80">Total Reductions</span>
            <span className="text-xl font-bold">
              {(progress.transportation.reduction + 
                progress.energy.reduction + 
                progress.diet.reduction + 
                progress.waste.reduction).toFixed(1)} kg
            </span>
          </div>
        </div>
      </div>
      
      {/* Overall progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> Overall Progress
          </CardTitle>
          <CardDescription>Your carbon footprint reduction over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { date: '2024-01-01', total: 100 },
                { date: '2024-01-15', total: 85 },
                { date: '2024-02-01', total: 75 },
                { date: '2024-02-15', total: 65 },
                { date: '2024-03-01', total: 60 }
              ]}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
                />
                <YAxis unit=" kg" />
                <Tooltip
                  formatter={(value) => [`${value} kg`, 'Carbon Footprint']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                />
                <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} dot={{ strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Category improvements */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {categories.map(({ key, label, color }) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="text-lg">{label}</CardTitle>
              <CardDescription>
                {progress[key].reduction.toFixed(1)} kg CO₂ reduced
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Current: {progress[key].current.toFixed(1)} kg</span>
                  <span>Baseline: {progress[key].baseline.toFixed(1)} kg</span>
                </div>
                <ProgressIndicator 
                  value={progress[key].percentage} 
                  className={color}
                />
                <div className="text-sm text-center text-muted-foreground">
                  {progress[key].percentage}% reduction from baseline
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Improvement Tips */}
      <ImprovementTips />
    </div>
  );
}
