import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Mail, User, Sparkles } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { authService } from "@/lib/firebase/auth";
import { useStore } from "@/store/useStore";

const Signup = () => {
  const navigate = useNavigate();
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "launderer">("customer");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create Firebase user
      const firebaseUser = await authService.createAccount(email, password);
      
      toast.success("Account created! Please complete your profile.");
      
      // Navigate to appropriate setup page with state
      setTimeout(() => {
        if (role === "customer") {
          navigate("/customer-setup", { 
            state: { firebaseUid: firebaseUser.uid, email, name, role } 
          });
        } else {
          navigate("/launderer-setup", { 
            state: { firebaseUid: firebaseUser.uid, email, name, role } 
          });
        }
      }, 500);
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account");
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
            Create Account
          </CardTitle>
          <CardDescription>
            Join ShineCycle today
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11"
                data-testid="input-name"
              />
            </div>

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
                minLength={6}
                className="h-11"
                data-testid="input-password"
              />
            </div>

            <div className="space-y-3">
              <Label>I want to</Label>
              <RadioGroup value={role} onValueChange={(value: "customer" | "launderer") => setRole(value)}>
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors">
                  <RadioGroupItem value="customer" id="customer" data-testid="radio-customer" />
                  <Label htmlFor="customer" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Use Laundry Services</div>
                    <div className="text-xs text-muted-foreground">Book doorstep pickup & delivery</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-accent transition-colors">
                  <RadioGroupItem value="launderer" id="launderer" data-testid="radio-launderer" />
                  <Label htmlFor="launderer" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Provide Laundry Services</div>
                    <div className="text-xs text-muted-foreground">Manage orders & grow your business</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 text-base font-semibold"
              disabled={isLoading}
              data-testid="button-signup"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>

            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate("/login")}
                  className="text-primary p-0 h-auto font-semibold"
                  data-testid="link-login"
                >
                  Sign In
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

export default Signup;
