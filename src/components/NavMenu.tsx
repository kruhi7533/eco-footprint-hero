
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Leaf, Home, ChartBar, Star, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockUser } from "@/lib/mockData";

type NavItem = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
};

const navItems: NavItem[] = [
  { name: "Dashboard", icon: Home, href: "#dashboard" },
  { name: "Track", icon: Leaf, href: "#track" },
  { name: "Progress", icon: ChartBar, href: "#progress" },
  { name: "Achievements", icon: Star, href: "#achievements" },
  { name: "Settings", icon: Settings, href: "#settings" },
];

export function NavMenu() {
  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full px-4 py-2 bg-white border-b shadow-sm">
      <div className="flex items-center space-x-2 mb-2 md:mb-0">
        <Leaf className="h-6 w-6 text-ecoPrimary" />
        <span className="text-2xl font-bold text-ecoPrimary">EcoStep</span>
      </div>
      
      <div className="flex flex-wrap justify-center space-x-1 md:space-x-2">
        {navItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center space-x-1 px-2",
              activeItem === item.name
                ? "bg-ecoLight text-ecoPrimary font-medium"
                : "text-gray-600 hover:text-ecoPrimary hover:bg-ecoLight/50"
            )}
            onClick={() => setActiveItem(item.name)}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.name}</span>
          </Button>
        ))}
      </div>
      
      <div className="flex items-center space-x-2 mt-2 md:mt-0">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-gray-700">{mockUser.name}</p>
          <p className="text-xs text-gray-500">Level {mockUser.level}</p>
        </div>
        <div className="rounded-full bg-ecoPrimary/10 p-1">
          <User className="h-6 w-6 text-ecoPrimary" />
        </div>
      </div>
    </div>
  );
}
