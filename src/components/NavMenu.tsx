
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Leaf, Home, ChartBar, Star, Settings, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockUser } from "@/lib/mockData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type NavItem = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string; // This will be used to match with tab values
};

// Updated to include values that match tab values
const navItems: NavItem[] = [
  { name: "Dashboard", icon: Home, value: "dashboard" },
  { name: "Track", icon: Leaf, value: "track" },
  { name: "Progress", icon: ChartBar, value: "progress" },
  { name: "Achievements", icon: Star, value: "achievements" },
  { name: "Settings", icon: Settings, value: "settings" },
];

interface NavMenuProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function NavMenu({ activeTab, onTabChange }: NavMenuProps) {
  const handleProfileAction = (action: string) => {
    console.log(`Profile action: ${action}`);
    // Here you could add actual logic for profile actions
    if (action === "settings") {
      onTabChange("settings");
    }
  };

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
              activeTab === item.value
                ? "bg-ecoLight text-ecoPrimary font-medium"
                : "text-gray-600 hover:text-ecoPrimary hover:bg-ecoLight/50"
            )}
            onClick={() => onTabChange(item.value)}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.name}</span>
          </Button>
        ))}
      </div>
      
      <div className="flex items-center space-x-2 mt-2 md:mt-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 hover:bg-transparent" aria-label="Profile options">
              <div className="flex items-center space-x-2">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-700">{mockUser.name}</p>
                  <p className="text-xs text-gray-500">Level {mockUser.level}</p>
                </div>
                <Avatar className="h-8 w-8 bg-ecoPrimary/10">
                  <AvatarFallback className="text-ecoPrimary">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleProfileAction("profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleProfileAction("settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleProfileAction("logout")}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
