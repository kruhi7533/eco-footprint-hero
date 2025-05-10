
import { GaugeCircle, Leaf, Zap, Utensils, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryCard } from "./SummaryCard";
import { CarbonChart } from "./CarbonChart";
import { EcoTips } from "./EcoTips";
import { Achievements } from "./Achievements";
import { mockUser, totalCarbonFootprint, averageFootprints } from "@/lib/mockData";

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="rounded-lg p-6 eco-gradient">
        <h1 className="text-2xl font-bold">Welcome, {mockUser.name}!</h1>
        <p className="opacity-90">Track your carbon footprint and make a positive impact on the environment.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
            <span className="block text-sm opacity-80">Eco Points</span>
            <span className="text-xl font-bold">{mockUser.ecoPoints}</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
            <span className="block text-sm opacity-80">Level</span>
            <span className="text-xl font-bold">{mockUser.level}</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
            <span className="block text-sm opacity-80">Streak</span>
            <span className="text-xl font-bold">{mockUser.consecutiveDays} days</span>
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
          trend={{ value: 5.2, isPositive: true }}
        />
        <SummaryCard
          title="Transportation"
          value="28.3 kg"
          icon={<Leaf />}
          trend={{ value: 3.1, isPositive: true }}
        />
        <SummaryCard
          title="Energy"
          value="42.5 kg"
          icon={<Zap />}
          trend={{ value: 1.4, isPositive: false }}
        />
        <SummaryCard
          title="Diet & Waste"
          value="36.8 kg"
          icon={<Utensils />}
          trend={{ value: 2.8, isPositive: true }}
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
                <span className="text-sm text-muted-foreground">{averageFootprints.user} kg/day</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-ecoPrimary rounded-full" 
                  style={{ width: `${(averageFootprints.user / averageFootprints.country) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Country Average</span>
                <span className="text-sm text-muted-foreground">{averageFootprints.country} kg/day</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-ecoSecondary rounded-full" 
                  style={{ width: `${(averageFootprints.country / averageFootprints.country) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Global Average</span>
                <span className="text-sm text-muted-foreground">{averageFootprints.global} kg/day</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-ecoAccent rounded-full" 
                  style={{ width: `${(averageFootprints.global / averageFootprints.country) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Charts and tips */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <CarbonChart />
        <EcoTips />
      </div>
      
      {/* Achievements */}
      <Achievements />
    </div>
  );
}
