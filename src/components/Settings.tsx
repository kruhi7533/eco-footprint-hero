
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile } from "@/lib/supabase";
import { useState } from "react";
import { toast } from "sonner";

const userFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }).optional(),
  notifications: z.boolean().default(true),
  emailUpdates: z.boolean().default(true),
  measurementUnit: z.enum(["metric", "imperial"])
});

export function Settings() {
  const { profile, refreshProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: profile?.name || "",
      email: profile?.email || "",
      notifications: true,
      emailUpdates: true,
      measurementUnit: (profile?.measurement_unit as "metric" | "imperial") || "metric"
    },
  });

  async function onSubmit(values: z.infer<typeof userFormSchema>) {
    setIsSubmitting(true);
    try {
      await updateProfile({
        name: values.name,
        measurement_unit: values.measurementUnit
      });
      
      await refreshProfile();
      toast.success("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update settings. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    form.reset({
      name: profile?.name || "",
      email: profile?.email || "",
      notifications: true,
      emailUpdates: true,
      measurementUnit: (profile?.measurement_unit as "metric" | "imperial") || "metric"
    });
    toast.info("Form reset to original values");
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="rounded-lg p-6 eco-gradient">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="opacity-90">Customize your EcoStep experience and manage your account preferences.</p>
      </div>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        
        <Card>
          <CardHeader>
            <CardTitle>User Settings</CardTitle>
            <CardDescription>Manage your account settings and preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Your email address" {...field}  />
                      </FormControl>
                      <FormDescription>
                        Email cannot be changed. Contact support if needed.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Separator className="my-4" />
                
                <FormField
                  control={form.control}
                  name="measurementUnit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Measurement Units</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select measurement system" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="metric">Metric (kg, kilometers)</SelectItem>
                          <SelectItem value="imperial">Imperial (lbs, miles)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Choose your preferred measurement system.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Separator className="my-4" />
                
                <FormField
                  control={form.control}
                  name="notifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Push Notifications</FormLabel>
                        <FormDescription>
                          Receive notifications about your carbon goals and achievements.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="emailUpdates"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Email Updates</FormLabel>
                        <FormDescription>
                          Receive weekly summaries and tips via email.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={handleReset}>Reset</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Delete All Data</h4>
                  <p className="text-sm text-gray-600 mb-2">Delete all your carbon tracking history and reset your progress.</p>
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Delete All Data</Button>
                </div>
                <div>
                  <h4 className="font-medium">Delete Account</h4>
                  <p className="text-sm text-gray-600 mb-2">Permanently delete your account and all associated data.</p>
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
}
