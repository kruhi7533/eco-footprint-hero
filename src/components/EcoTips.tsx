
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockTips } from "@/lib/mockData";

export function EcoTips() {
  const [activeTab, setActiveTab] = useState<string>("transportation");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Eco Tips</CardTitle>
        <CardDescription>Personalized recommendations to reduce your carbon footprint</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="transportation">Transport</TabsTrigger>
            <TabsTrigger value="energy">Energy</TabsTrigger>
            <TabsTrigger value="diet">Diet</TabsTrigger>
            <TabsTrigger value="waste">Waste</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transportation" className="animate-fade-in">
            <ul className="space-y-2">
              {mockTips.transportation.map((tip, index) => (
                <li key={index} className="leaf-bullet text-sm">{tip}</li>
              ))}
            </ul>
          </TabsContent>
          
          <TabsContent value="energy" className="animate-fade-in">
            <ul className="space-y-2">
              {mockTips.energy.map((tip, index) => (
                <li key={index} className="leaf-bullet text-sm">{tip}</li>
              ))}
            </ul>
          </TabsContent>
          
          <TabsContent value="diet" className="animate-fade-in">
            <ul className="space-y-2">
              {mockTips.diet.map((tip, index) => (
                <li key={index} className="leaf-bullet text-sm">{tip}</li>
              ))}
            </ul>
          </TabsContent>
          
          <TabsContent value="waste" className="animate-fade-in">
            <ul className="space-y-2">
              {mockTips.waste.map((tip, index) => (
                <li key={index} className="leaf-bullet text-sm">{tip}</li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
