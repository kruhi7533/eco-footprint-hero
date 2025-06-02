
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, TrendingDown, TrendingUp, Target, Loader2 } from "lucide-react";
import { useProgressData } from "@/hooks/useProgressData";

interface ProgressProps {
  progress?: any;
}

export function Progress({ progress }: ProgressProps = {}) {
  const { progressData, isLoading, error } = useProgressData();

  const dataToUse = progress || progressData;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-ecoPrimary" />
          <span className="ml-2">Loading progress data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Progress Overview</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-600">
              Error loading progress data: {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dataToUse || dataToUse.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Progress Overview</h2>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No progress data available yet.</p>
          <p className="text-sm text-muted-foreground mt-2">Start tracking your carbon footprint to see your progress!</p>
        </div>
      </div>
    );
  }

  // Calculate total reduction across all categories
  const totalReduction = dataToUse.reduce((sum: number, category: any) => {
    return sum + (category.percentage || 0);
  }, 0) / dataToUse.length;

  // Calculate goal progress (assuming 20% reduction target)
  const goalProgress = Math.min(100, totalReduction);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Progress Overview</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="w-4 h-4" />
          Last 7 days vs baseline
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dataToUse.map((category: any) => (
          <Card key={category.category}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize">
                {category.category}
              </CardTitle>
              {category.percentage > 0 ? (
                <TrendingDown className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {category.percentage > 0 ? '-' : '+'}{Math.abs(category.percentage).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                vs. baseline
              </p>
              <div className="mt-3">
                <ProgressBar 
                  value={Math.min(100, Math.abs(category.percentage))} 
                  className={category.percentage > 0 ? "bg-green-100" : "bg-red-100"}
                />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Current: {category.current_emissions.toFixed(1)} kg CO₂
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Total Reduction</CardTitle>
                <CardDescription>Your overall carbon footprint improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  -{totalReduction.toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Average across all categories
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Goal Progress</CardTitle>
                <CardDescription>Progress towards 20% reduction goal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span className="text-2xl font-bold">{goalProgress.toFixed(0)}%</span>
                </div>
                <ProgressBar value={goalProgress} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="detailed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Breakdown</CardTitle>
              <CardDescription>Category-wise progress analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataToUse.map((category: any) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="capitalize font-medium">{category.category}</span>
                      <span className={`text-sm ${category.percentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {category.percentage > 0 ? '-' : '+'}{Math.abs(category.percentage).toFixed(1)}%
                      </span>
                    </div>
                    <ProgressBar 
                      value={Math.min(100, Math.abs(category.percentage))} 
                      className="w-full" 
                    />
                    <div className="text-xs text-muted-foreground">
                      Current: {category.current_emissions.toFixed(1)} kg CO₂ | 
                      Baseline: {category.baseline_emissions.toFixed(1)} kg CO₂ | 
                      Reduction: {category.reduction.toFixed(1)} kg CO₂
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
