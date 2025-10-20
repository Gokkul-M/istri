import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, Save, MapPin, Phone, Mail, Clock, TrendingUp, DollarSign, Star, Package, Calendar, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";
import { useProfile } from "@/hooks/useProfile";
import { useFirebaseOrders } from "@/hooks/useFirebaseOrders";
import { format } from "date-fns";

const BusinessProfile = () => {
  const { toast } = useToast();
  const { currentUser } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile, loading, uploading, updateProfile, uploadProfileImage } = useProfile(currentUser?.id || null);
  const { orders } = useFirebaseOrders();
  
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    businessAddress: "",
    businessDescription: "",
    businessHours: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        businessName: profile.businessName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        businessAddress: profile.businessAddress || "",
        businessDescription: profile.businessDescription || "",
        businessHours: profile.businessHours || "",
      });
    }
  }, [profile]);

  const businessStats = useMemo(() => {
    // Filter orders for this launderer only
    const myOrders = orders.filter(o => o.laundererId === currentUser?.id);
    const completedOrders = myOrders.filter(o => o.status === "completed");
    const totalRevenue = completedOrders.reduce((acc, order) => acc + order.totalAmount, 0);
    
    const ordersWithRatings = completedOrders.filter(order => order.rating && order.rating > 0);
    const averageRating = ordersWithRatings.length > 0
      ? (ordersWithRatings.reduce((acc, order) => acc + (order.rating || 0), 0) / ordersWithRatings.length).toFixed(1)
      : '0';
    
    return {
      totalOrders: myOrders.length,
      completedOrders: completedOrders.length,
      totalRevenue,
      averageRating,
      ratingsCount: ordersWithRatings.length,
    };
  }, [orders, currentUser?.id]);

  const memberSince = useMemo(() => {
    if (!profile?.createdAt) return 'N/A';
    try {
      let date: Date;
      const createdAt = profile.createdAt as any;
      
      // Handle Firestore Timestamp object
      if (createdAt?.seconds) {
        date = new Date(createdAt.seconds * 1000);
      } 
      // Handle ISO string or Date object
      else {
        date = new Date(createdAt);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'N/A';
      }
      
      return format(date, 'MMMM yyyy');
    } catch (error) {
      console.error('Error formatting member since date:', error);
      return 'N/A';
    }
  }, [profile?.createdAt]);

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      toast({
        title: "Success",
        description: "Business profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update business profile",
        variant: "destructive",
      });
    }
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadProfileImage(file, 'businessLogo');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-6">
        <div className="gradient-primary p-6 pb-8 rounded-b-[3rem] mb-6">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-40 h-6" />
            <div className="w-10" />
          </div>
          <div className="flex justify-center">
            <Skeleton className="w-28 h-28 rounded-3xl" />
          </div>
        </div>
        <div className="px-6 space-y-4">
          <Skeleton className="w-full h-64 rounded-[2rem]" />
          <Skeleton className="w-full h-64 rounded-[2rem]" />
        </div>
      </div>
    );
  }

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
            <div className="w-28 h-28 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
              {profile?.businessLogo ? (
                <img src={profile.businessLogo} alt="Business Logo" className="w-full h-full rounded-3xl object-cover" />
              ) : (
                <div className="text-center">
                  <p className="text-white text-xs">Business</p>
                  <p className="text-white text-xs">Logo</p>
                </div>
              )}
            </div>
            <button 
              onClick={handleLogoClick}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      <div className="px-6 space-y-4">
        {/* Profile Information */}
        <Card className="rounded-3xl p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            Profile Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Member since:</span>
              </div>
              <span className="text-sm font-semibold">{memberSince}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Role:</span>
              </div>
              <span className="text-sm font-semibold">Launderer</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Status:</span>
              </div>
              <Badge className="bg-green-500 text-white px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                Active
              </Badge>
            </div>
          </div>
        </Card>

        {/* Business Statistics */}
        <Card className="rounded-3xl p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Business Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background/50 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-blue-500" />
                <p className="text-xs text-muted-foreground">Total Orders</p>
              </div>
              <p className="text-2xl font-bold">{businessStats.totalOrders}</p>
            </div>
            <div className="bg-background/50 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <p className="text-2xl font-bold">{businessStats.completedOrders}</p>
            </div>
            <div className="bg-background/50 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <p className="text-xs text-muted-foreground">Total Revenue</p>
              </div>
              <p className="text-2xl font-bold">₹{businessStats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-background/50 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <p className="text-xs text-muted-foreground">Avg Rating</p>
              </div>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold">{businessStats.averageRating}</p>
                <span className="text-lg">⭐</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {businessStats.ratingsCount} {businessStats.ratingsCount === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl p-6">
          <h3 className="font-bold mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName" className="text-sm font-medium mb-2">
                Business Name
              </Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="rounded-2xl"
              />
            </div>

            <div>
              <Label htmlFor="businessDescription" className="text-sm font-medium mb-2">
                Description
              </Label>
              <Textarea
                id="businessDescription"
                value={formData.businessDescription}
                onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                className="rounded-2xl min-h-24"
                placeholder="Describe your laundry services..."
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="rounded-2xl"
              />
            </div>

            <div>
              <Label htmlFor="businessAddress" className="text-sm font-medium mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Business Address
              </Label>
              <Textarea
                id="businessAddress"
                value={formData.businessAddress}
                onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                className="rounded-2xl"
                placeholder="Enter your full business address"
              />
            </div>
          </div>
        </Card>

        <Card className="rounded-3xl p-6">
          <h3 className="font-bold mb-4">Operating Hours</h3>
          <div>
            <Label htmlFor="businessHours" className="text-sm font-medium mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Business Hours
            </Label>
            <Textarea
              id="businessHours"
              value={formData.businessHours}
              onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
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
