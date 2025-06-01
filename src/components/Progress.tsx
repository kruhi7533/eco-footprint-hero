import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, TrendingDown, TrendingUp, Target } from "lucide-react";
import { useProgressData } from "@/hooks/useProgressData";

interface ProgressProps {
  progress?: any; // Make this optional to handle the prop being passed
}

export function Progress({ progress }: ProgressProps = {}) {
  const { progressData, isLoading } = useProgressData();

  // Use the passed progress prop or fall back to hook data
  const dataToUse = progress || progressData;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!dataToUse) {
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Progress Overview</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="w-4 h-4" />
          Last 30 days
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dataToUse.categories?.map((category: any) => (
          <Card key={category.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize">
                {category.name}
              </CardTitle>
              {category.improvement > 0 ? (
                <TrendingDown className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {category.improvement > 0 ? '-' : '+'}{Math.abs(category.improvement)}%
              </div>
              <p className="text-xs text-muted-foreground">
                vs. last month
              </p>
              <div className="mt-3">
                <ProgressBar 
                  value={Math.abs(category.improvement)} 
                  className={category.improvement > 0 ? "bg-green-100" : "bg-red-100"}
                />
              </div>
            </CardContent>
          </Card>
        )) || <div>No category data available</div>}
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
                  -{dataToUse.totalReduction || 0}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Since you started tracking
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Goal Progress</CardTitle>
                <CardDescription>Progress towards your monthly goal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span className="text-2xl font-bold">{dataToUse.goalProgress || 0}%</span>
                </div>
                <ProgressBar value={dataToUse.goalProgress || 0} className="mt-2" />
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
                {dataToUse.categories?.map((category: any) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <span className="capitalize">{category.name}</span>
                    <div className="flex items-center gap-2">
                      <ProgressBar value={Math.abs(category.improvement)} className="w-24" />
                      <span className={`text-sm ${category.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {category.improvement > 0 ? '-' : '+'}{Math.abs(category.improvement)}%
                      </span>
                    </div>
                  </div>
                )) || <div>No detailed data available</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
