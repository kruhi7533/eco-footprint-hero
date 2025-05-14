
import { GaugeCircle, Leaf, Zap, Utensils, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryCard } from "./SummaryCard";
import { CarbonChart } from "./CarbonChart";
import { EcoTips } from "./EcoTips";
import { Achievements } from "./Achievements";
import { useCarbonData } from "@/hooks/useCarbonData";
import { useAuth } from "@/contexts/AuthContext";

export function Dashboard() {
  const { profile } = useAuth();
  const { summaries, isLoading, error, improvements, profile: userProfile } = useCarbonData(7);
  
  // Calculate total carbon footprint
  const totalCarbonFootprint = summaries?.reduce((sum, day) => sum + day.total, 0).toFixed(1) || "0";
  
  // Get the latest day's emissions
  const latestDay = summaries && summaries.length > 0 ? summaries[summaries.length - 1] : null;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-ecoPrimary" />
        <span className="ml-2">Loading your eco data...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Sorry, we couldn't load your eco data. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="rounded-lg p-6 eco-gradient">
        <h1 className="text-2xl font-bold">Welcome, {profile?.name || 'Eco Friend'}!</h1>
        <p className="opacity-90">Track your carbon footprint and make a positive impact on the environment.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
            <span className="block text-sm opacity-80">Eco Points</span>
            <span className="text-xl font-bold">{profile?.eco_points || 0}</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
            <span className="block text-sm opacity-80">Level</span>
            <span className="text-xl font-bold">{profile?.level || 1}</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
            <span className="block text-sm opacity-80">Streak</span>
            <span className="text-xl font-bold">{profile?.consecutive_days || 0} days</span>
          </div>
        </div>
      </div>
      
      {/* Summary cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <SummaryCard
          title="Weekly Footprint"
          value={`${totalCarbonFootprint} kg`}
          description="Total CO₂ emissions"
          icon={<GaugeCircle />}
          trend={improvements.overall > 0 ? { value: improvements.overall, isPositive: true } : undefined}
        />
        <SummaryCard
          title="Transportation"
          value={latestDay ? `${latestDay.transportation.toFixed(1)} kg` : "0 kg"}
          icon={<Leaf />}
          trend={improvements.transportation > 0 ? { value: improvements.transportation, isPositive: true } : undefined}
        />
        <SummaryCard
          title="Energy"
          value={latestDay ? `${latestDay.energy.toFixed(1)} kg` : "0 kg"}
          icon={<Zap />}
          trend={improvements.energy > 0 ? { value: improvements.energy, isPositive: true } : undefined}
        />
        <SummaryCard
          title="Diet & Waste"
          value={latestDay ? `${(latestDay.diet + latestDay.waste).toFixed(1)} kg` : "0 kg"}
          icon={<Utensils />}
          trend={(improvements.diet > 0 || improvements.waste > 0) ? 
            { value: (improvements.diet + improvements.waste) / 2, isPositive: true } : undefined}
        />
      </div>
      
      {/* Comparison card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Your Carbon Footprint</CardTitle>
          <CardDescription>Compare your impact with average emissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Your Average</span>
                <span className="text-sm text-muted-foreground">
                  {summaries && summaries.length > 0 
                    ? (summaries.reduce((sum, day) => sum + day.total, 0) / summaries.length).toFixed(1) 
                    : "0"} kg/day
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-ecoPrimary rounded-full" 
                  style={{ width: `${summaries && summaries.length > 0 ? 
                    Math.min((summaries.reduce((sum, day) => sum + day.total, 0) / summaries.length) / 15 * 100, 100) : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Country Average</span>
                <span className="text-sm text-muted-foreground">15 kg/day</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-ecoSecondary rounded-full" 
                  style={{ width: `${15 / 15 * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Global Average</span>
                <span className="text-sm text-muted-foreground">12 kg/day</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-ecoAccent rounded-full" 
                  style={{ width: `${12 / 15 * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Charts and tips */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <CarbonChart carbonData={summaries} />
        <EcoTips />
      </div>
      
      {/* Achievements */}
      <Achievements />
    </div>
  );
}
