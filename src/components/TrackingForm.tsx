
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  calculateTransportEmissions, 
  calculateEnergyEmissions, 
  calculateDietEmissions, 
  calculateWasteEmissions 
} from "@/lib/carbonUtils";
import { addCarbonEntry } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export function TrackingForm() {
  const [activeTab, setActiveTab] = useState<string>("transport");
  const { refreshProfile } = useAuth();
  
  // Transport state
  const [transportMode, setTransportMode] = useState<string>("CAR");
  const [distance, setDistance] = useState<string>("");
  const [transportLoading, setTransportLoading] = useState(false);
  
  // Energy state
  const [energyType, setEnergyType] = useState<string>("ELECTRICITY");
  const [consumption, setConsumption] = useState<string>("");
  const [energyLoading, setEnergyLoading] = useState(false);
  
  // Diet state
  const [dietType, setDietType] = useState<string>("AVERAGE");
  const [dietLoading, setDietLoading] = useState(false);
  
  // Waste state
  const [wasteType, setWasteType] = useState<string>("LANDFILL");
  const [weight, setWeight] = useState<string>("");
  const [wasteLoading, setWasteLoading] = useState(false);
  
  const handleTransportSubmit = async () => {
    if (!distance || isNaN(Number(distance)) || Number(distance) <= 0) {
      toast.error("Please enter a valid distance");
      return;
    }
    
    setTransportLoading(true);
    try {
      const emissions = calculateTransportEmissions(
        transportMode as any, 
        Number(distance)
      );
      
      await addCarbonEntry({
        date: new Date().toISOString().split('T')[0],
        category: 'transportation',
        activity_type: transportMode,
        amount: Number(distance),
        emissions
      });
      
      toast.success(`${emissions.toFixed(2)} kg CO₂ added to your footprint`);
      setDistance("");
      refreshProfile(); // Update user profile with new points/achievements
    } catch (error) {
      console.error('Error adding transportation entry:', error);
      toast.error("Failed to log transportation. Please try again.");
    } finally {
      setTransportLoading(false);
    }
  };
  
  const handleEnergySubmit = async () => {
    if (!consumption || isNaN(Number(consumption)) || Number(consumption) <= 0) {
      toast.error("Please enter a valid consumption amount");
      return;
    }
    
    setEnergyLoading(true);
    try {
      const emissions = calculateEnergyEmissions(
        energyType as any,
        Number(consumption)
      );
      
      await addCarbonEntry({
        date: new Date().toISOString().split('T')[0],
        category: 'energy',
        activity_type: energyType,
        amount: Number(consumption),
        emissions
      });
      
      toast.success(`${emissions.toFixed(2)} kg CO₂ added to your footprint`);
      setConsumption("");
      refreshProfile(); // Update user profile with new points/achievements
    } catch (error) {
      console.error('Error adding energy entry:', error);
      toast.error("Failed to log energy usage. Please try again.");
    } finally {
      setEnergyLoading(false);
    }
  };
  
  const handleDietSubmit = async () => {
    setDietLoading(true);
    try {
      const emissions = calculateDietEmissions(dietType as any);
      
      await addCarbonEntry({
        date: new Date().toISOString().split('T')[0],
        category: 'diet',
        activity_type: dietType,
        amount: 1, // One day of this diet type
        emissions
      });
      
      toast.success(`${emissions.toFixed(2)} kg CO₂ added to your footprint`);
      refreshProfile(); // Update user profile with new points/achievements
    } catch (error) {
      console.error('Error adding diet entry:', error);
      toast.error("Failed to log diet. Please try again.");
    } finally {
      setDietLoading(false);
    }
  };
  
  const handleWasteSubmit = async () => {
    if (!weight || isNaN(Number(weight)) || Number(weight) <= 0) {
      toast.error("Please enter a valid weight");
      return;
    }
    
    setWasteLoading(true);
    try {
      const emissions = calculateWasteEmissions(
        wasteType as any,
        Number(weight)
      );
      
      await addCarbonEntry({
        date: new Date().toISOString().split('T')[0],
        category: 'waste',
        activity_type: wasteType,
        amount: Number(weight),
        emissions
      });
      
      toast.success(`${emissions.toFixed(2)} kg CO₂ added to your footprint`);
      setWeight("");
      refreshProfile(); // Update user profile with new points/achievements
    } catch (error) {
      console.error('Error adding waste entry:', error);
      toast.error("Failed to log waste. Please try again.");
    } finally {
      setWasteLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Track Your Carbon Footprint</CardTitle>
          <CardDescription>
            Log your daily activities to calculate your carbon emissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="transport">Transport</TabsTrigger>
              <TabsTrigger value="energy">Energy</TabsTrigger>
              <TabsTrigger value="diet">Diet</TabsTrigger>
              <TabsTrigger value="waste">Waste</TabsTrigger>
            </TabsList>
            
            <TabsContent value="transport" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transport-mode">Transportation Mode</Label>
                  <Select value={transportMode} onValueChange={setTransportMode}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transportation mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CAR">Car</SelectItem>
                      <SelectItem value="BUS">Bus</SelectItem>
                      <SelectItem value="TRAIN">Train</SelectItem>
                      <SelectItem value="PLANE">Airplane</SelectItem>
                      <SelectItem value="WALK_BIKE">Walking/Biking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    placeholder="Enter distance traveled"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                className="w-full eco-gradient border-0" 
                onClick={handleTransportSubmit}
                disabled={transportLoading}
              >
                {transportLoading ? "Logging..." : "Log Transportation"}
              </Button>
            </TabsContent>
            
            <TabsContent value="energy" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="energy-type">Energy Type</Label>
                  <Select value={energyType} onValueChange={setEnergyType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select energy type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ELECTRICITY">Electricity</SelectItem>
                      <SelectItem value="NATURAL_GAS">Natural Gas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="consumption">Consumption (kWh)</Label>
                  <Input
                    id="consumption"
                    type="number"
                    placeholder="Enter energy consumption"
                    value={consumption}
                    onChange={(e) => setConsumption(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                className="w-full eco-gradient border-0" 
                onClick={handleEnergySubmit}
                disabled={energyLoading}
              >
                {energyLoading ? "Logging..." : "Log Energy Usage"}
              </Button>
            </TabsContent>
            
            <TabsContent value="diet" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="diet-type">Diet Type</Label>
                  <Select value={dietType} onValueChange={setDietType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select diet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MEAT_HEAVY">Meat Heavy</SelectItem>
                      <SelectItem value="AVERAGE">Average (Mixed)</SelectItem>
                      <SelectItem value="VEGETARIAN">Vegetarian</SelectItem>
                      <SelectItem value="VEGAN">Vegan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Daily Diet Impact:</p>
                  <ul className="text-sm mt-1 space-y-1 text-muted-foreground">
                    <li>• Meat Heavy: 7.19 kg CO₂ per day</li>
                    <li>• Average Diet: 5.63 kg CO₂ per day</li>
                    <li>• Vegetarian: 3.81 kg CO₂ per day</li>
                    <li>• Vegan: 2.89 kg CO₂ per day</li>
                  </ul>
                </div>
              </div>
              
              <Button 
                className="w-full eco-gradient border-0" 
                onClick={handleDietSubmit}
                disabled={dietLoading}
              >
                {dietLoading ? "Logging..." : "Log Diet"}
              </Button>
            </TabsContent>
            
            <TabsContent value="waste" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="waste-type">Waste Type</Label>
                  <Select value={wasteType} onValueChange={setWasteType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select waste type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LANDFILL">Landfill Waste</SelectItem>
                      <SelectItem value="RECYCLED">Recycled Waste</SelectItem>
                      <SelectItem value="COMPOSTED">Composted Waste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter waste weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                className="w-full eco-gradient border-0" 
                onClick={handleWasteSubmit}
                disabled={wasteLoading}
              >
                {wasteLoading ? "Logging..." : "Log Waste"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-sm text-muted-foreground mb-2">
            Track your daily activities to get an accurate carbon footprint calculation.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
