
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { ChartLineUp, Leaf, Lightbulb, TrendingUp, Utensils } from "lucide-react";
import { mockWeeklyData, mockUser } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function Progress() {
  // Calculate improvements
  const firstDay = mockWeeklyData[0];
  const lastDay = mockWeeklyData[mockWeeklyData.length - 1];
  
  const calculateImprovement = (first: number, last: number) => {
    const diff = ((first - last) / first) * 100;
    return diff > 0 ? parseFloat(diff.toFixed(1)) : 0;
  };

  const improvements = {
    transportation: calculateImprovement(firstDay.transportation, lastDay.transportation),
    energy: calculateImprovement(firstDay.energy, lastDay.energy),
    diet: calculateImprovement(firstDay.diet, lastDay.diet),
    waste: calculateImprovement(firstDay.waste, lastDay.waste),
    overall: calculateImprovement(firstDay.total, lastDay.total)
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="rounded-lg p-6 eco-gradient">
        <h1 className="text-2xl font-bold">Your Progress</h1>
        <p className="opacity-90">Track your carbon reduction journey and see your improvements over time.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
            <span className="block text-sm opacity-80">Current Level</span>
            <span className="text-xl font-bold">{mockUser.level}</span>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
            <span className="block text-sm opacity-80">Total Reductions</span>
            <span className="text-xl font-bold">{mockUser.transportationReductions + mockUser.energySavings + mockUser.wasteReduction} kg</span>
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
              <LineChart data={mockWeeklyData}>
                <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                <YAxis unit=" kg" />
                <Tooltip
                  formatter={(value: number) => [`${value} kg`, 'Carbon Footprint']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                />
                <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} dot={{ strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Category improvements */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Category Improvements</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Leaf className="h-4 w-4 text-ecoPrimary" /> Transportation
              </CardTitle>
              <Badge className={improvements.transportation > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {improvements.transportation > 0 ? `${improvements.transportation}% Improved` : "No improvement yet"}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">You've reduced your transportation emissions by {mockUser.transportationReductions} kg.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" /> Energy
              </CardTitle>
              <Badge className={improvements.energy > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {improvements.energy > 0 ? `${improvements.energy}% Improved` : "No improvement yet"}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">You've saved {mockUser.energySavings} kg of CO₂ through energy efficiency.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Utensils className="h-4 w-4 text-orange-500" /> Diet
              </CardTitle>
              <Badge className={improvements.diet > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {improvements.diet > 0 ? `${improvements.diet}% Improved` : "No improvement yet"}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Your dietary choices have helped reduce carbon emissions.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <ChartLineUp className="h-4 w-4 text-purple-500" /> Waste
              </CardTitle>
              <Badge className={improvements.waste > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                {improvements.waste > 0 ? `${improvements.waste}% Improved` : "No improvement yet"}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">You've reduced waste by {mockUser.wasteReduction} kg of CO₂ equivalent.</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Tips for improvement */}
      <Card>
        <CardHeader>
          <CardTitle>Improvement Tips</CardTitle>
          <CardDescription>Suggestions to further reduce your carbon footprint</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <div className="bg-green-100 text-green-800 p-2 rounded-full h-8 w-8 flex items-center justify-center">1</div>
              <div>
                <h4 className="font-medium">Switch to renewable energy</h4>
                <p className="text-sm text-gray-600">Consider solar panels or switch to a green energy provider.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="bg-green-100 text-green-800 p-2 rounded-full h-8 w-8 flex items-center justify-center">2</div>
              <div>
                <h4 className="font-medium">Reduce meat consumption</h4>
                <p className="text-sm text-gray-600">Try going meat-free one day a week to start.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="bg-green-100 text-green-800 p-2 rounded-full h-8 w-8 flex items-center justify-center">3</div>
              <div>
                <h4 className="font-medium">Optimize transportation</h4>
                <p className="text-sm text-gray-600">Use public transport, carpool, or walk for shorter distances.</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
