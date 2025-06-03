
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCarbonData } from "@/hooks/useCarbonData";
import { BarChart, Clock, Users, Building2, Globe } from "lucide-react";

interface BenchmarkData {
  category: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  lastUpdated: string;
}

export function CarbonBenchmarking() {
  const { profile } = useAuth();
  const { summaries } = useCarbonData(7);
  const [activeTab, setActiveTab] = useState("global");
  
  // Calculate user's current average daily emissions
  const userAverage = summaries && summaries.length > 0 
    ? summaries.reduce((sum, day) => sum + day.total, 0) / summaries.length 
    : 0;

  // Mock benchmark data - in a real app, this would come from APIs
  const benchmarkData: Record<string, BenchmarkData[]> = {
    global: [
      {
        category: "Your Average",
        value: userAverage,
        icon: <Users className="h-4 w-4" />,
        description: "Your daily carbon footprint",
        lastUpdated: "Live"
      },
      {
        category: "Country Average",
        value: 15.2,
        icon: <Globe className="h-4 w-4" />,
        description: "National average daily emissions",
        lastUpdated: "Updated Dec 2024"
      },
      {
        category: "Global Average",
        value: 12.8,
        icon: <Globe className="h-4 w-4" />,
        description: "Worldwide average daily emissions",
        lastUpdated: "Updated Dec 2024"
      }
    ],
    regional: [
      {
        category: "Your Average",
        value: userAverage,
        icon: <Users className="h-4 w-4" />,
        description: "Your daily carbon footprint",
        lastUpdated: "Live"
      },
      {
        category: "Regional Average",
        value: 13.5,
        icon: <Users className="h-4 w-4" />,
        description: "Local community average",
        lastUpdated: "Updated Nov 2024"
      },
      {
        category: "City Average",
        value: 11.8,
        icon: <Building2 className="h-4 w-4" />,
        description: "Metropolitan area average",
        lastUpdated: "Updated Nov 2024"
      }
    ],
    demographic: [
      {
        category: "Your Average",
        value: userAverage,
        icon: <Users className="h-4 w-4" />,
        description: "Your daily carbon footprint",
        lastUpdated: "Live"
      },
      {
        category: "Age Group Average",
        value: 14.2,
        icon: <Users className="h-4 w-4" />,
        description: "25-35 year olds average",
        lastUpdated: "Updated Oct 2024"
      },
      {
        category: "Professional Average",
        value: 16.5,
        icon: <Building2 className="h-4 w-4" />,
        description: "Tech industry average",
        lastUpdated: "Updated Oct 2024"
      }
    ]
  };

  const currentBenchmarks = benchmarkData[activeTab] || benchmarkData.global;
  const maxValue = Math.max(...currentBenchmarks.map(b => b.value));

  // Calculate comparison summary
  const getComparisonSummary = () => {
    if (userAverage === 0) return "Start tracking to see your impact!";
    
    const comparison = currentBenchmarks.find(b => b.category !== "Your Average");
    if (!comparison) return "";
    
    const difference = ((comparison.value - userAverage) / comparison.value * 100);
    const isLower = difference > 0;
    
    if (activeTab === "global") {
      return `You emit ${Math.abs(difference).toFixed(0)}% ${isLower ? 'less' : 'more'} CO₂ than the ${comparison.category.toLowerCase()}.`;
    } else if (activeTab === "regional") {
      return `You emit ${Math.abs(difference).toFixed(0)}% ${isLower ? 'less' : 'more'} CO₂ than your local community average.`;
    } else {
      return `You emit ${Math.abs(difference).toFixed(0)}% ${isLower ? 'less' : 'more'} CO₂ than the average professional in your demographic.`;
    }
  };

  return (
    <Card className="bg-ecoSecondary border-ecoAccent">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white">
          <BarChart className="h-5 w-5" />
          Carbon Footprint Benchmarking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-ecoPrimary/30">
            <TabsTrigger 
              value="global" 
              className="data-[state=active]:bg-ecoAccent data-[state=active]:text-white text-green-200"
            >
              Global
            </TabsTrigger>
            <TabsTrigger 
              value="regional" 
              className="data-[state=active]:bg-ecoAccent data-[state=active]:text-white text-green-200"
            >
              Regional
            </TabsTrigger>
            <TabsTrigger 
              value="demographic" 
              className="data-[state=active]:bg-ecoAccent data-[state=active]:text-white text-green-200"
            >
              Demographic
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-4">
              {currentBenchmarks.map((benchmark, index) => (
                <div key={benchmark.category}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {benchmark.icon}
                      <span className={`text-sm font-medium ${
                        benchmark.category === "Your Average" ? "text-green-400" : "text-green-200"
                      }`}>
                        {benchmark.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${
                        benchmark.category === "Your Average" ? "text-green-400" : "text-green-200"
                      }`}>
                        {benchmark.value.toFixed(1)} kg/day
                      </span>
                      <div className="flex items-center gap-1 text-xs text-green-300">
                        <Clock className="h-3 w-3" />
                        {benchmark.lastUpdated}
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-3 bg-ecoPrimary/30 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        benchmark.category === "Your Average" 
                          ? "bg-green-400" 
                          : "bg-ecoAccent"
                      }`}
                      style={{ 
                        width: `${Math.min((benchmark.value / maxValue) * 100, 100)}%` 
                      }}
                    />
                  </div>
                  
                  <p className="text-xs text-green-300 mt-1">
                    {benchmark.description}
                  </p>
                </div>
              ))}
              
              {/* Comparison Summary */}
              <div className="mt-6 p-4 bg-ecoPrimary/20 rounded-lg border border-ecoAccent/30">
                <h4 className="text-sm font-medium text-green-400 mb-2">Summary</h4>
                <p className="text-sm text-green-200">
                  {getComparisonSummary()}
                </p>
              </div>
              
              {/* Privacy Notice */}
              <div className="mt-4 p-3 bg-ecoPrimary/10 rounded-lg border border-ecoAccent/20">
                <p className="text-xs text-green-300">
                  <span className="font-medium">Privacy Protected:</span> All comparisons are anonymous and aggregated. 
                  Your individual data is never shared with other users.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
