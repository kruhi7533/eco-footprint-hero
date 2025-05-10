
import { useState } from "react";
import { NavMenu } from "@/components/NavMenu";
import { Dashboard } from "@/components/Dashboard";
import { TrackingForm } from "@/components/TrackingForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  return (
    <div className="min-h-screen flex flex-col bg-ecoLight">
      <NavMenu activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="container mx-auto py-6 px-4 flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="hidden">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="track">Track</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-0">
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="track" className="mt-0">
            <TrackingForm />
          </TabsContent>
        </Tabs>
      </div>
      
      <footer className="bg-ecoPrimary text-white py-4 text-center">
        <p className="text-sm">EcoStep © 2023 - Making sustainability easy, one step at a time.</p>
      </footer>
    </div>
  );
}

export default Index;
