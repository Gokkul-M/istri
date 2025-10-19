import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Camera, User as UserIcon, Mail, Phone, Save, QrCode, Loader2, Package, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";
import { useProfile } from "@/hooks/useProfile";
import { useFirebaseOrders } from "@/hooks/useFirebaseOrders";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const { toast } = useToast();
  const { currentUser } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile, loading, uploading, updateProfile, uploadProfileImage } = useProfile(currentUser?.id || null);
  const { orders } = useFirebaseOrders();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const customerStats = useMemo(() => {
    const completedOrders = orders.filter(o => o.status === "completed");
    const totalSpent = completedOrders.reduce((acc, order) => acc + order.totalAmount, 0);
    
    return {
      totalOrders: orders.length,
      completedOrders: completedOrders.length,
      totalSpent,
    };
  }, [orders]);

  const formatMemberSince = (createdAt: any): string => {
    if (!createdAt) return 'Recently';
    
    try {
      let date: Date;
      if (createdAt instanceof Date) {
        date = createdAt;
      } else if (createdAt.toDate && typeof createdAt.toDate === 'function') {
        date = createdAt.toDate();
      } else if (typeof createdAt === 'string' || typeof createdAt === 'number') {
        date = new Date(createdAt);
      } else {
        return 'Recently';
      }
      
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadProfileImage(file, 'avatar');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-6">
        <div className="gradient-primary p-6 pb-10 rounded-b-[3rem] mb-6 shadow-soft">
          <div className="flex items-center justify-between mb-10">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-32 h-6" />
            <div className="w-10" />
          </div>
          <div className="flex justify-center">
            <Skeleton className="w-28 h-28 rounded-full" />
          </div>
        </div>
        <div className="px-6 space-y-4">
          <Skeleton className="w-full h-64 rounded-[2rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="gradient-primary p-6 pb-10 rounded-b-[3rem] mb-6 shadow-soft animate-in fade-in slide-in-from-top duration-500">
        <div className="flex items-center justify-between mb-10">
          <Link to="/customer/settings">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 transition-all duration-300" data-testid="button-back">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">Edit Profile</h1>
          <div className="w-10" />
        </div>

        {/* Avatar */}
        <div className="flex justify-center">
          <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden ring-4 ring-white/20">
            <UserIcon className="w-14 h-14 text-white" />
          </div>
        </div>
      </div>

      <div className="px-6 space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
        <Card className="rounded-[2rem] p-6 shadow-soft border-border/30 backdrop-blur-sm hover:shadow-medium transition-shadow duration-300">
          <div className="space-y-5">
            <div className="group">
              <Label htmlFor="name" className="text-sm font-medium mb-2 flex items-center gap-2 text-foreground/80 group-hover:text-foreground transition-colors">
                <UserIcon className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                disabled
                className="rounded-2xl border-border/50 bg-muted/50 cursor-not-allowed opacity-70"
                data-testid="input-name"
              />
              <p className="text-xs text-muted-foreground mt-1">Name cannot be changed after signup</p>
            </div>

            <div className="group">
              <Label htmlFor="email" className="text-sm font-medium mb-2 flex items-center gap-2 text-foreground/80 group-hover:text-foreground transition-colors">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="rounded-2xl border-border/50 bg-muted/50 cursor-not-allowed opacity-70"
                data-testid="input-email"
              />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed after signup</p>
            </div>

            <div className="group">
              <Label htmlFor="phone" className="text-sm font-medium mb-2 flex items-center gap-2 text-foreground/80 group-hover:text-foreground transition-colors">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="rounded-2xl border-border/50 focus:border-primary transition-all duration-300"
                data-testid="input-phone"
              />
            </div>
          </div>
        </Card>

        <Button 
          onClick={handleSave} 
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          data-testid="button-save-profile"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>

        {/* Customer QR Code */}
        <Card className="rounded-[2rem] p-6 gradient-primary text-white shadow-medium border-0 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold mb-1">Your QR Code</h3>
              <p className="text-sm text-white/80">Show this to launderers for quick service</p>
            </div>
            <QrCode className="w-8 h-8 animate-pulse" />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="w-full bg-white/95 text-primary hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg"
                data-testid="button-view-qr"
              >
                View QR Code
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm rounded-3xl">
              <DialogHeader>
                <DialogTitle>Your Customer QR Code</DialogTitle>
                <DialogDescription>
                  Launderers can scan this code to quickly identify you and process your orders
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center py-6">
                <div className="bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <QRCodeSVG 
                    value={`CUSTOMER-${currentUser?.id || profile?.id || 'DEMO'}`}
                    size={200}
                    level="H"
                    includeMargin
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm font-semibold" data-testid="text-qr-name">{profile?.name || 'Customer'}</p>
                  <p className="text-xs text-muted-foreground" data-testid="text-qr-id">ID: {currentUser?.id || profile?.id || 'DEMO'}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </Card>

        {/* Account Statistics */}
        <Card className="rounded-[2rem] p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10 shadow-soft hover:shadow-medium transition-all duration-300">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Your Statistics
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-background/50 rounded-2xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Total Orders</p>
              <p className="text-xl font-bold">{customerStats.totalOrders}</p>
            </div>
            <div className="bg-background/50 rounded-2xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Completed</p>
              <p className="text-xl font-bold text-green-600">{customerStats.completedOrders}</p>
            </div>
            <div className="bg-background/50 rounded-2xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
              <p className="text-xl font-bold text-primary">${customerStats.totalSpent.toFixed(0)}</p>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] p-6 bg-gradient-to-br from-muted/30 to-muted/10 border-border/30 shadow-soft hover:shadow-medium transition-all duration-300">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Account Information
          </h3>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="font-medium text-foreground">Member since:</span>
              {formatMemberSince(profile?.createdAt)}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="font-medium text-foreground">Customer ID:</span>
              {currentUser?.id || profile?.id || 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="font-medium text-foreground">Role:</span>
              Customer
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="font-medium text-foreground">Status:</span>
              <span className="px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full text-xs">Active</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
