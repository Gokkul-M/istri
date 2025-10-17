import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Shield } from "lucide-react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import { authService } from "@/lib/firebase/auth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Sign in with Firebase
      const firebaseUser = await authService.signInWithEmail(email, password);
      
      // Get or create admin profile in Firestore
      let userProfile = await authService.getUserProfile(firebaseUser.uid);
      
      if (!userProfile) {
        // Create admin profile if it doesn't exist
        userProfile = await authService.createUserProfile(firebaseUser.uid, {
          role: "admin" as const,
          name: "Admin User",
          email: email,
          phone: "1234567890",
          address: "Admin Office",
          pinCode: "000000",
          avatar: "",
        });
      }

      // Verify user has admin role
      if (userProfile.role !== "admin") {
        toast.error("Access denied. Admin privileges required.");
        await authService.signOut();
        setIsLoading(false);
        return;
      }

      setCurrentUser(userProfile);
      toast.success("Welcome, Admin!");
      setTimeout(() => {
        navigate("/admin");
      }, 500);
    } catch (error: any) {
      console.error("Admin login error:", error);
      toast.error(error.message || "Invalid admin credentials");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full border-none shadow-2xl">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl gradient-primary bg-clip-text text-transparent">
            Admin Panel
          </CardTitle>
          <CardDescription>
            Sign in to access the admin dashboard
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
                placeholder="admin@laundry.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
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
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in as Admin"}
            </Button>

            {/* Demo Credentials Display */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-sm">
                <p className="font-mono">
                  <span className="text-muted-foreground">Email:</span> admin@laundry.com
                </p>
                <p className="font-mono">
                  <span className="text-muted-foreground">Password:</span> admin123
                </p>
              </div>
            </div>

            <div className="text-center pt-2">
              <Button
                type="button"
                variant="link"
                onClick={() => navigate("/")}
                className="text-sm"
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

export default AdminLogin;
