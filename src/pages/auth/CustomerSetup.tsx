import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import { authService } from "@/lib/firebase/auth";

const CustomerSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const firebaseUid = location.state?.firebaseUid || "";
  const initialName = location.state?.name || "";
  const initialEmail = location.state?.email || "";
  const { setCurrentUser } = useStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: initialName,
    email: initialEmail,
    phone: "",
    address: "",
    pinCode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.pinCode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!firebaseUid) {
      toast({
        title: "Authentication Error",
        description: "Please complete signup first",
        variant: "destructive",
      });
      navigate("/signup");
      return;
    }

    setLoading(true);
    try {
      // Create user profile in Firestore with Firebase Auth UID
      const newUser = await authService.createUserProfile(firebaseUid, {
        role: 'customer' as const,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        pinCode: formData.pinCode,
        avatar: "",
      });

      setCurrentUser(newUser);

      toast({
        title: "Profile Created Successfully!",
        description: "Welcome to ShineCycle",
      });

      navigate("/customer");
    } catch (error: any) {
      console.error("Profile creation error:", error);
      
      let errorMessage = "Please try again";
      
      if (error.code === "permission-denied") {
        errorMessage = "System setup required. Please contact administrator to update Firebase security rules.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Profile Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        {/* Header */}
        <div className="mb-8 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/signup")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Complete Your Profile</h1>
        </div>

        {/* Setup Card */}
        <Card className="border-0 shadow-lg rounded-3xl card-glass">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold">
              Customer Profile Setup
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Help us serve you better
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="h-11 rounded-xl"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="h-11 rounded-xl"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="h-11 rounded-xl"
                  required
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Complete Address *</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="House no., Street, Area"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="h-11 rounded-xl"
                  required
                />
              </div>

              {/* PIN Code */}
              <div className="space-y-2">
                <Label htmlFor="pinCode">PIN Code *</Label>
                <Input
                  id="pinCode"
                  type="text"
                  placeholder="Enter PIN code"
                  value={formData.pinCode}
                  onChange={(e) =>
                    setFormData({ ...formData, pinCode: e.target.value.replace(/\D/g, "") })
                  }
                  className="h-11 rounded-xl"
                  maxLength={6}
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 rounded-xl glow-button mt-6"
                variant="hero"
                disabled={loading}
              >
                {loading ? "Creating Profile..." : "Complete Setup & Start"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CustomerSetup;
