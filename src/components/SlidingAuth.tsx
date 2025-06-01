
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Leaf, ArrowRight, ArrowLeft } from "lucide-react";

const SlidingAuth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        await signUp(email, password, name);
        toast.success("Account created successfully! Please check your email to verify your account.");
        setIsSignUp(false);
        setName("");
        setEmail("");
        setPassword("");
      } else {
        await signIn(email, password);
        toast.success("Signed in successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ecoLight via-white to-green-50 p-4">
      <div className="w-full max-w-md relative">
        {/* Logo and Brand */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-ecoPrimary rounded-full">
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-ecoPrimary mb-2">EcoStep</h1>
          <p className="text-gray-600">
            {isSignUp ? "Join the movement for a greener future" : "Track your carbon footprint"}
          </p>
        </div>
        
        {/* Sliding Card Container */}
        <div className="relative overflow-hidden">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-0">
              {/* Sliding Forms Container */}
              <div 
                className={`flex transition-transform duration-500 ease-in-out ${
                  isSignUp ? "-translate-x-full" : "translate-x-0"
                }`}
                style={{ width: "200%" }}
              >
                {/* Login Form */}
                <div className="w-1/2 p-8">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-ecoPrimary">Welcome Back</h2>
                      <p className="text-gray-600 mt-2">Sign in to your account</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input 
                          id="login-email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12 border-ecoSecondary/20 focus:border-ecoSecondary"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input 
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-12 border-ecoSecondary/20 focus:border-ecoSecondary"
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full h-12 eco-gradient hover:scale-105 transition-all duration-200" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : "Sign In"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                    
                    <div className="text-center">
                      <button
                        onClick={toggleMode}
                        className="text-ecoSecondary hover:text-ecoPrimary font-medium transition-colors"
                      >
                        Don't have an account? Sign up
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sign Up Form */}
                <div className="w-1/2 p-8">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-ecoPrimary">Create Account</h2>
                      <p className="text-gray-600 mt-2">Start your eco journey today</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Full Name</Label>
                        <Input 
                          id="signup-name"
                          type="text"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="h-12 border-ecoSecondary/20 focus:border-ecoSecondary"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input 
                          id="signup-email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-12 border-ecoSecondary/20 focus:border-ecoSecondary"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input 
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-12 border-ecoSecondary/20 focus:border-ecoSecondary"
                          minLength={6}
                          required
                        />
                        <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full h-12 eco-gradient hover:scale-105 transition-all duration-200" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating Account..." : "Create Account"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                    
                    <div className="text-center">
                      <button
                        onClick={toggleMode}
                        className="text-ecoSecondary hover:text-ecoPrimary font-medium transition-colors"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4 inline" />
                        Already have an account? Sign in
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-ecoAccent/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute -bottom-20 -right-20 w-32 h-32 bg-ecoSecondary/10 rounded-full blur-3xl animate-pulse-glow"></div>
      </div>
    </div>
  );
};

export default SlidingAuth;
