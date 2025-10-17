import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Camera, Save, MapPin, Phone, Mail, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BusinessProfile = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    businessName: "Fresh Laundry Co.",
    email: "contact@freshlaundry.com",
    phone: "+1 234 567 8900",
    address: "456 Business Avenue, Suite 200",
    city: "New York, NY 10001",
    description: "Premium laundry service with same-day delivery. We specialize in eco-friendly cleaning solutions.",
    hours: "Mon-Sat: 8:00 AM - 8:00 PM, Sun: 10:00 AM - 6:00 PM",
    logo: ""
  });

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your business profile has been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="gradient-primary p-6 pb-8 rounded-b-[3rem] mb-6">
        <div className="flex items-center justify-between mb-8">
          <Link to="/launderer">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">Business Profile</h1>
          <div className="w-10" />
        </div>

        {/* Logo */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              {profile.logo ? (
                <img src={profile.logo} alt="Business Logo" className="w-full h-full rounded-3xl object-cover" />
              ) : (
                <div className="text-center">
                  <p className="text-white text-xs">Business</p>
                  <p className="text-white text-xs">Logo</p>
                </div>
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-lg">
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-4">
        <Card className="rounded-3xl p-6">
          <h3 className="font-bold mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName" className="text-sm font-medium mb-2">
                Business Name
              </Label>
              <Input
                id="businessName"
                value={profile.businessName}
                onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                className="rounded-2xl"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium mb-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={profile.description}
                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                className="rounded-2xl min-h-24"
              />
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl p-6">
          <h3 className="font-bold mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="rounded-2xl"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="rounded-2xl"
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-sm font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </Label>
              <Input
                id="address"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="rounded-2xl"
              />
            </div>

            <div>
              <Label htmlFor="city" className="text-sm font-medium mb-2">
                City, State ZIP
              </Label>
              <Input
                id="city"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="rounded-2xl"
              />
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl p-6">
          <h3 className="font-bold mb-4">Operating Hours</h3>
          <div>
            <Label htmlFor="hours" className="text-sm font-medium mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Business Hours
            </Label>
            <Textarea
              id="hours"
              value={profile.hours}
              onChange={(e) => setProfile({ ...profile, hours: e.target.value })}
              className="rounded-2xl"
              placeholder="e.g., Mon-Fri: 9AM-6PM"
            />
          </div>
        </Card>

        <Button onClick={handleSave} variant="hero" className="w-full" size="lg">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default BusinessProfile;
