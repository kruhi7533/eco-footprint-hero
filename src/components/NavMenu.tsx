
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
    
    if (action === "settings") {
      onTabChange("settings");
    } else if (action === "logout") {
      // Handle logout action
      alert("You have been logged out!");
      // In a real app, you would call a logout function here
      // Example: logoutUser();
    } else if (action === "profile") {
      // Handle profile action
      alert("Viewing profile...");
      // In a real app, you would navigate to profile page
      // Example: navigateToProfile();
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full px-4 py-3 bg-gradient-to-r from-ecoPrimary/95 to-ecoSecondary/95 text-white shadow-md">
      <div className="flex items-center space-x-2 mb-4 md:mb-0">
        <div className="bg-white/20 p-2 rounded-full">
          <Leaf className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight">EcoStep</span>
      </div>
      
      <div className="flex flex-wrap justify-center gap-1 md:gap-2">
        {navItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            size="sm"
            className={cn(
              "flex items-center space-x-1 px-3 py-2 rounded-md transition-all duration-200",
              activeTab === item.value
                ? "bg-white/20 text-white font-medium backdrop-blur-sm"
                : "text-white/80 hover:text-white hover:bg-white/10"
            )}
            onClick={() => onTabChange(item.value)}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.name}</span>
          </Button>
        ))}
      </div>
      
      <div className="flex items-center space-x-2 mt-4 md:mt-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 hover:bg-white/10 rounded-full" aria-label="Profile options">
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-white">{mockUser.name}</p>
                  <p className="text-xs text-white/70">Level {mockUser.level}</p>
                </div>
                <Avatar className="h-9 w-9 border-2 border-white/30">
                  <AvatarFallback className="bg-white/10 text-white">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg rounded-lg border-0 animate-fade-in">
            <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleProfileAction("profile")}
              className="flex items-center cursor-pointer hover:bg-gray-100"
            >
              <User className="mr-2 h-4 w-4 text-gray-500" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleProfileAction("settings")}
              className="flex items-center cursor-pointer hover:bg-gray-100"
            >
              <Settings className="mr-2 h-4 w-4 text-gray-500" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleProfileAction("logout")}
              className="flex items-center cursor-pointer text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
