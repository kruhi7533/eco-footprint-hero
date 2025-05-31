import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { ChartLine, Leaf, Lightbulb, TrendingUp, Utensils, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ImprovementTips } from "@/components/ImprovementTips";
import { useProgressData } from "@/hooks/useProgressData";
import { Button } from "@/components/ui/button";
import { Progress as ProgressIndicator } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function Progress() {
  const { profile } = useAuth();
  const { progress, isLoading, error, refreshProgress } = useProgressData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          <Button onClick={refreshProgress} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!progress || progress.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Progress Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Start tracking your carbon emissions to see your progress here.</p>
          <Button onClick={() => window.location.href = '/track'} className="mt-4">
            Start Tracking
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 20) return "text-green-500";
    if (percentage >= 10) return "text-yellow-500";
    return "text-red-500";
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'transportation':
        return <TrendingUp className="h-5 w-5" />;
      case 'energy':
        return <Lightbulb className="h-5 w-5" />;
      case 'diet':
        return <Utensils className="h-5 w-5" />;
      case 'waste':
        return <Leaf className="h-5 w-5" />;
      default:
        return <ChartLine className="h-5 w-5" />;
    }
  };

  // Calculate total reduction
  const totalReduction = progress.reduce((sum, item) => sum + item.reduction, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header section */}
      <div className="rounded-lg p-6 bg-gradient-to-br from-ecoPrimary to-ecoSecondary text-white">
        <h1 className="text-2xl font-bold">Your Progress</h1>
        <p className="opacity-90">Track your carbon reduction journey and see your improvements over time.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="block text-sm opacity-80">Current Level</span>
            <span className="text-xl font-bold">{profile?.level || 1}</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <span className="block text-sm opacity-80">Total Reductions</span>
            <span className="text-xl font-bold">
              {totalReduction.toFixed(1)} kg CO₂
            </span>
          </div>
        </div>
      </div>

      {/* Category cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {progress.map((item) => (
          <Card key={item.category}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </CardTitle>
              {getCategoryIcon(item.category)}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Current: {item.current_emissions.toFixed(1)} kg</span>
                  <span>Baseline: {item.baseline_emissions.toFixed(1)} kg</span>
                </div>
                <ProgressIndicator 
                  value={item.percentage} 
                  className={cn(
                    "h-2",
                    item.percentage >= 20 ? "bg-ecoPrimary" :
                    item.percentage >= 10 ? "bg-yellow-500" :
                    "bg-red-500"
                  )}
                />
                <div className="text-sm text-center">
                  <span className={getProgressColor(item.percentage)}>
                    {item.percentage.toFixed(1)}% reduction
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Emissions chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartLine className="h-5 w-5" /> Emissions Trend
          </CardTitle>
          <CardDescription>Your carbon footprint by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progress}>
                <XAxis 
                  dataKey="category"
                  tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                />
                <YAxis unit=" kg" />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(1)} kg`, 'Emissions']}
                />
                <Line 
                  type="monotone" 
                  name="Current"
                  dataKey="current_emissions" 
                  stroke="#1B4332" 
                  strokeWidth={2} 
                  dot={{ strokeWidth: 2, r: 4 }} 
                />
                <Line 
                  type="monotone" 
                  name="Baseline"
                  dataKey="baseline_emissions" 
                  stroke="#94a3b8" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Improvement Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" /> Improvement Tips
          </CardTitle>
          <CardDescription>Personalized suggestions to reduce your carbon footprint</CardDescription>
        </CardHeader>
        <CardContent>
          <ImprovementTips progress={progress} />
        </CardContent>
      </Card>
    </div>
  );
}
