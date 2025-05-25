import React from 'react';
import { Card } from "@/components/ui/card";
import { ExternalLink, Leaf, Zap, Utensils, Home, Droplets, Recycle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useImprovementTips, ImprovementTip } from "@/hooks/useImprovementTips";

const categoryIcons = {
  transportation: Leaf,
  energy: Zap,
  diet: Utensils,
  home: Home,
  waste: Recycle,
  general: Droplets
};

const difficultyLabels = {
  1: "Very Easy",
  2: "Easy",
  3: "Moderate",
  4: "Hard",
  5: "Very Hard"
};

export function ImprovementTips() {
  const { tips, isLoading, error } = useImprovementTips();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded-lg bg-red-50">
        Failed to load improvement tips. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Improvement Tips</h2>
        <p className="text-muted-foreground">
          Suggestions to further reduce your carbon footprint
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tips.map((tip) => {
          const IconComponent = categoryIcons[tip.category] || Droplets;
          
          return (
            <a 
              key={tip.id} 
              href={tip.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <Card className="p-6 hover:shadow-lg transition-all group-hover:border-green-500 group-hover:-translate-y-1">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[rgb(220,252,231)]">
                      <IconComponent className="h-4 w-4 text-green-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold group-hover:text-green-600">{tip.title}</h3>
                        <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-muted-foreground mt-2">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="outline" className="bg-green-50">
                      {difficultyLabels[tip.difficulty_level]}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50">
                      Impact: {tip.impact_level}/5
                    </Badge>
                    <Badge variant="outline" className="bg-amber-50">
                      Saves {tip.co2_reduction_potential} kg CO₂/year
                    </Badge>
                  </div>
                </div>
              </Card>
            </a>
          );
        })}
      </div>
    </div>
  );
} 