import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import { authService } from "@/lib/firebase/auth";

const LaundererSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const firebaseUid = location.state?.firebaseUid || "";
  const initialName = location.state?.name || "";
  const initialEmail = location.state?.email || "";
  const { setCurrentUser } = useStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: initialName,
    email: initialEmail,
    phone: "",
    address: "",
    pinCode: "",
    description: "",
    pricePerKg: "50",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.businessName || !formData.ownerName || !formData.email || !formData.phone || !formData.address || !formData.pinCode) {
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
        role: 'launderer' as const,
        name: formData.ownerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        pinCode: formData.pinCode,
        businessName: formData.businessName,
        businessDescription: formData.description,
        pricePerKg: parseFloat(formData.pricePerKg) || 50,
        rating: 4.5,
        distance: 0,
        avatar: "",
      });

      setCurrentUser(newUser);

      toast({
        title: "Business Profile Created!",
        description: "Welcome to ShineCycle",
      });

      navigate("/launderer");
    } catch (error: any) {
      console.error("Profile creation error:", error);
      toast({
        title: "Profile Creation Failed",
        description: error.message || "Please try again",
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
        <div className="mb-8 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/signup")} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Business Setup</h1>
        </div>

        <Card className="border-0 shadow-lg rounded-3xl card-glass">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold">Launderer Profile Setup</CardTitle>
            <p className="text-sm text-muted-foreground">Set up your business profile</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input id="businessName" value={formData.businessName} onChange={(e) => setFormData({ ...formData, businessName: e.target.value })} className="h-11 rounded-xl" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name *</Label>
                <Input id="ownerName" value={formData.ownerName} onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })} className="h-11 rounded-xl" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-11 rounded-xl" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-11 rounded-xl" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Business Address *</Label>
                <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="h-11 rounded-xl" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pinCode">PIN Code *</Label>
                <Input id="pinCode" value={formData.pinCode} onChange={(e) => setFormData({ ...formData, pinCode: e.target.value.replace(/\D/g, "") })} className="h-11 rounded-xl" maxLength={6} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Business Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="rounded-xl" rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePerKg">Price (₹/kg)</Label>
                <Input id="pricePerKg" type="number" value={formData.pricePerKg} onChange={(e) => setFormData({ ...formData, pricePerKg: e.target.value })} className="h-11 rounded-xl" />
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl glow-button mt-6" variant="hero" disabled={loading}>{loading ? "Creating Profile..." : "Complete Setup & Start"}</Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LaundererSetup;
