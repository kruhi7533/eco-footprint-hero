
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { calculateEnergyEmissions } from "@/lib/carbonUtils";
import { addCarbonEntry } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export function EnergyForm() {
  const [energyType, setEnergyType] = useState<string>("ELECTRICITY");
  const [consumption, setConsumption] = useState<string>("");
  const [energyLoading, setEnergyLoading] = useState(false);
  const { refreshProfile } = useAuth();
  
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

  return (
    <div className="space-y-4">
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
    </div>
  );
}
