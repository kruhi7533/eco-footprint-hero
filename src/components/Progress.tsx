
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, TrendingDown, TrendingUp, Target, Loader2, ExternalLink, Car, Lightbulb, Utensils, Leaf } from "lucide-react";
import { useProgressData } from "@/hooks/useProgressData";
import { useAuth } from "@/contexts/AuthContext";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ProgressProps {
  progress?: any;
}

// Improvement tips with external links
const improvementTips = [
  {
    id: 1,
    title: "Renewable Energy",
    description: "Switch to renewable energy sources for your home",
    link: "https://www.energy.gov/clean-energy",
    gradient: "bg-ecoPrimary hover:bg-ecoSecondary",
  },
  {
    id: 2,
    title: "Sustainable Transport",
    description: "Choose eco-friendly transportation methods",
    link: "https://www.epa.gov/transportation-air-pollution-and-climate-change",
    gradient: "bg-ecoPrimary hover:bg-ecoSecondary",
  },
  {
    id: 3,
    title: "Zero Waste Living",
    description: "Adopt zero waste practices in daily life",
    link: "https://www.epa.gov/transforming-waste-tool",
    gradient: "bg-ecoPrimary hover:bg-ecoSecondary",
  },
  {
    id: 4,
    title: "Plant-Based Diet",
    description: "Reduce carbon footprint through diet choices",
    link: "https://www.un.org/en/actnow/food-choices",
    gradient: "bg-ecoPrimary hover:bg-ecoSecondary",
  },
  {
    id: 5,
    title: "Water Conservation",
    description: "Save water with efficient practices",
    link: "https://www.epa.gov/watersense",
    gradient: "bg-ecoPrimary hover:bg-ecoSecondary",
  },
  {
    id: 6,
    title: "Energy Efficiency",
    description: "Optimize home energy usage",
    link: "https://www.energy.gov/energysaver/energy-saver",
    gradient: "bg-ecoPrimary hover:bg-ecoSecondary",
  },
  {
    id: 7,
    title: "Sustainable Shopping",
    description: "Make eco-conscious purchasing decisions",
    link: "https://www.epa.gov/greenerproducts",
    gradient: "bg-ecoPrimary hover:bg-ecoSecondary",
  },
  {
    id: 8,
    title: "Green Gardening",
    description: "Create an eco-friendly garden",
    link: "https://www.epa.gov/green-infrastructure",
    gradient: "bg-ecoPrimary hover:bg-ecoSecondary",
  },
  {
    id: 9,
    title: "Waste Recycling",
    description: "Learn proper recycling methods",
    link: "https://www.epa.gov/recycle",
    gradient: "bg-ecoPrimary hover:bg-ecoSecondary",
  },
];

export function Progress({ progress }: ProgressProps = {}) {
  const { progressData, isLoading, error } = useProgressData();
  const { profile } = useAuth();

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
    return sum + (category.reduction || 0);
  }, 0);

  // Calculate goal progress (assuming 20% reduction target)
  const goalProgress = Math.min(100, Math.abs(totalReduction / 100 * 20));

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'transportation':
        return <Car className="h-5 w-5" />;
      case 'energy':
        return <Lightbulb className="h-5 w-5" />;
      case 'diet':
        return <Utensils className="h-5 w-5" />;
      case 'waste':
        return <Leaf className="h-5 w-5" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 mb-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Your Progress</h1>
          <p className="text-green-100 mb-8">
            Track your carbon reduction journey and see your improvements over time.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-sm font-medium text-green-100 mb-2">Current Level</h3>
              <div className="text-3xl font-bold">{profile?.level || 1}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-sm font-medium text-green-100 mb-2">Total Reductions</h3>
              <div className="text-3xl font-bold">{totalReduction.toFixed(1)} kg CO₂</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Category Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {dataToUse.map((category: any) => (
            <Card key={category.category} className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <CardTitle className="text-sm font-medium capitalize flex items-center gap-2">
                    {getCategoryIcon(category.category)}
                    {category.category}
                  </CardTitle>
                </div>
                {category.percentage > 0 ? (
                  <TrendingDown className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-600" />
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Current: {category.current_emissions.toFixed(1)} kg</div>
                    <div className="text-sm text-muted-foreground">Baseline: {category.baseline_emissions.toFixed(1)} kg</div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.abs(category.percentage))}%` }}
                    />
                  </div>
                  
                  <div className={`text-sm font-medium ${category.percentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {category.percentage > 0 ? '-' : '+'}{Math.abs(category.percentage).toFixed(1)}% reduction
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emissions Trend Chart */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Emissions Trend
            </CardTitle>
            <CardDescription>Your carbon footprint by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataToUse}>
                  <XAxis 
                    dataKey="category" 
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value} kg`}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="current_emissions"
                    stroke="#16a34a"
                    strokeWidth={3}
                    dot={{ fill: "#16a34a", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="baseline_emissions"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="8 8"
                    dot={{ fill: "#94a3b8", strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Improvement Tips Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
              <Lightbulb className="h-6 w-6" />
              Improvement Tips
            </h2>
            <p className="text-muted-foreground">
              Personalized suggestions to reduce your carbon footprint
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {improvementTips.map((tip) => (
              <Card
                key={tip.id}
                className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${tip.gradient} group`}
                onClick={() => window.open(tip.link, '_blank')}
              >
                <div className="p-6 text-white min-h-[180px] flex flex-col justify-between relative z-10">
                  <div>
                    <h3 className="text-xl font-bold mb-3">{tip.title}</h3>
                    <p className="text-white/90 text-sm leading-relaxed mb-6">{tip.description}</p>
                  </div>
                  
                  {/* Learn More Link */}
                  <div className="flex items-center">
                    <span className="inline-flex items-center text-white font-medium hover:text-white/90 transition-colors">
                      Learn More
                      <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>

                  {/* Large Number Watermark */}
                  <div className="absolute -right-4 bottom-0 text-[120px] font-bold opacity-10 select-none pointer-events-none leading-none">
                    {String(tip.id).padStart(2, '0')}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
