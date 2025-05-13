
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { calculateTransportEmissions } from "@/lib/carbonUtils";
import { addCarbonEntry } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export function TransportForm() {
  const [transportMode, setTransportMode] = useState<string>("CAR");
  const [distance, setDistance] = useState<string>("");
  const [transportLoading, setTransportLoading] = useState(false);
  const { refreshProfile } = useAuth();
  
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

  return (
    <div className="space-y-4">
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
    </div>
  );
}
