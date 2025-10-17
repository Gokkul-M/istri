import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Sparkles } from "lucide-react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import { authService } from "@/lib/firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const firebaseUser = await authService.signInWithEmail(email, password);
      const userProfile = await authService.getUserProfile(firebaseUser.uid);
      
      if (!userProfile) {
        toast.error("User profile not found. Please sign up first.");
        await authService.signOut();
        setIsLoading(false);
        return;
      }

      if (userProfile.role === "admin") {
        toast.error("Please use the admin login page.");
        await authService.signOut();
        setIsLoading(false);
        return;
      }

      setCurrentUser(userProfile);
      toast.success(`Welcome back, ${userProfile.name}!`);
      
      setTimeout(() => {
        if (userProfile.role === "customer") {
          navigate("/customer");
        } else if (userProfile.role === "launderer") {
          navigate("/launderer");
        }
      }, 500);
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Invalid credentials");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl gradient-primary bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Sign in to your ShineCycle account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
                data-testid="input-password"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 text-base font-semibold"
              disabled={isLoading}
              data-testid="button-login"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate("/signup")}
                  className="text-primary p-0 h-auto font-semibold"
                  data-testid="link-signup"
                >
                  Sign Up
                </Button>
              </p>
            </div>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => navigate("/")}
                className="text-sm"
                data-testid="link-home"
              >
                Back to Home
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
