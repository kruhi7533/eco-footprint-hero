
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { calculateDietEmissions } from "@/lib/carbonUtils";
import { addCarbonEntry } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export function DietForm() {
  const [dietType, setDietType] = useState<string>("AVERAGE");
  const [dietLoading, setDietLoading] = useState(false);
  const { refreshProfile } = useAuth();
  
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

  return (
    <div className="space-y-4">
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
    </div>
  );
}
