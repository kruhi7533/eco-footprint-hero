
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { calculateWasteEmissions } from "@/lib/carbonUtils";
import { addCarbonEntry } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export function WasteForm() {
  const [wasteType, setWasteType] = useState<string>("LANDFILL");
  const [weight, setWeight] = useState<string>("");
  const [wasteLoading, setWasteLoading] = useState(false);
  const { refreshProfile } = useAuth();
  
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
    <div className="space-y-4">
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
    </div>
  );
}
