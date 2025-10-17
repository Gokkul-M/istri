import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Camera, Shield, Mail, Phone, Save, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";

const AdminProfile = () => {
  const { toast } = useToast();
  const { currentUser } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile, loading, uploading, updateProfile, uploadProfileImage } = useProfile(currentUser?.id || null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

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
    await updateProfile(formData);
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
        <div className="gradient-tertiary p-6 pb-10 rounded-b-[3rem] mb-6 shadow-soft">
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
      <div className="gradient-tertiary p-6 pb-10 rounded-b-[3rem] mb-6 shadow-soft animate-in fade-in slide-in-from-top duration-500">
        <div className="flex items-center justify-between mb-10">
          <Link to="/admin">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 transition-all duration-300" data-testid="button-back">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">Admin Profile</h1>
          <div className="w-10" />
        </div>

        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden ring-4 ring-white/20 transition-all duration-300 group-hover:ring-white/40">
              {profile?.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover transition-transform duration-300 group-hover:scale-110" 
                  data-testid="img-avatar"
                />
              ) : (
                <Shield className="w-14 h-14 text-white transition-transform duration-300 group-hover:scale-110" />
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              data-testid="input-avatar-upload"
            />
            <button 
              onClick={handleAvatarClick}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-gradient-to-r from-accent to-accent/80 flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-12 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-upload-avatar"
            >
              {uploading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Camera className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
        <Card className="rounded-[2rem] p-6 shadow-soft border-border/30 backdrop-blur-sm hover:shadow-medium transition-shadow duration-300">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-tertiary" />
            Administrator Information
          </h3>
          <div className="space-y-5">
            <div className="group">
              <Label htmlFor="name" className="text-sm font-medium mb-2 flex items-center gap-2 text-foreground/80 group-hover:text-foreground transition-colors">
                <Shield className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Administrator Name"
                className="rounded-2xl border-border/50 focus:border-tertiary transition-all duration-300"
                data-testid="input-name"
              />
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
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@example.com"
                className="rounded-2xl border-border/50 focus:border-tertiary transition-all duration-300"
                data-testid="input-email"
              />
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
                placeholder="+1 234 567 8900"
                className="rounded-2xl border-border/50 focus:border-tertiary transition-all duration-300"
                data-testid="input-phone"
              />
            </div>
          </div>
        </Card>

        <Button 
          onClick={handleSave} 
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-tertiary to-primary hover:from-tertiary/90 hover:to-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          data-testid="button-save-profile"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>

        <Card className="rounded-[2rem] p-6 bg-gradient-to-br from-tertiary/10 to-primary/10 border-tertiary/20 shadow-soft hover:shadow-medium transition-all duration-300">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-tertiary" />
            Administrator Privileges
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Full system access</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>User management</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Order oversight</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Service configuration</span>
            </div>
          </div>
        </Card>

        <Card className="rounded-[2rem] p-6 bg-gradient-to-br from-muted/30 to-muted/10 border-border/30 shadow-soft hover:shadow-medium transition-all duration-300">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            Account Information
          </h3>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="font-medium text-foreground">Member since:</span>
              {profile?.createdAt?.toLocaleDateString() || 'January 2025'}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="font-medium text-foreground">Role:</span>
              <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary rounded-full text-xs font-semibold">Administrator</span>
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="font-medium text-foreground">Status:</span>
              <span className="px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full text-xs">Active</span>
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="font-medium text-foreground">Last Login:</span>
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminProfile;
