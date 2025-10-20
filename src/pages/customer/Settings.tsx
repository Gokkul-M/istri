import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/store/useStore";
import { useSettings } from "@/hooks/useSettings";
import { useProfile } from "@/hooks/useProfile";
import { authService } from "@/lib/firebase/auth";
import { Camera as CapacitorCamera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import {
  User,
  Lock,
  Image as ImageIcon,
  Moon,
  Languages,
  Bell,
  MapPin,
  CreditCard,
  Receipt,
  Clock,
  Download,
  Shield,
  LogOut,
  Trash2,
  ChevronRight,
  ArrowLeft,
  Camera,
  Mail,
  MessageSquare
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser } = useStore();
  const { settings, loading, updateNotificationPreference, updatePermission, changeLanguage } = useSettings(currentUser?.id || null);
  const { profile, uploading, uploadProfileImage } = useProfile(currentUser?.id || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [toggleLoading, setToggleLoading] = useState<string | null>(null);

  const emailNotifications = settings?.notifications.email ?? true;
  const smsNotifications = settings?.notifications.sms ?? false;
  const whatsappNotifications = settings?.notifications.whatsapp ?? true;
  const pushNotifications = settings?.notifications.push ?? true;
  const selectedLanguage = settings?.language || "en";
  const locationPermission = settings?.permissions.location ?? true;
  const cameraPermission = settings?.permissions.camera ?? true;
  const galleryPermission = settings?.permissions.gallery ?? true;

  const handlePermissionToggle = async (type: 'location' | 'camera' | 'gallery', value: boolean) => {
    if (!value) {
      await updatePermission(type, false);
      return;
    }

    setToggleLoading(type);
    try {
      if (type === 'location') {
        const permission = await Geolocation.checkPermissions();
        if (permission.location !== 'granted') {
          const request = await Geolocation.requestPermissions();
          if (request.location === 'granted') {
            await updatePermission(type, true);
          } else {
            toast({
              title: "Permission Denied",
              description: "Please enable location access in your device settings.",
              variant: "destructive",
            });
            return;
          }
        } else {
          await updatePermission(type, true);
        }
      } else if (type === 'camera' || type === 'gallery') {
        const permission = await CapacitorCamera.checkPermissions();
        const needsRequest = type === 'camera' 
          ? permission.camera !== 'granted' 
          : permission.photos !== 'granted';
        
        if (needsRequest) {
          const request = await CapacitorCamera.requestPermissions();
          const isGranted = type === 'camera'
            ? request.camera === 'granted'
            : request.photos === 'granted';
          
          if (isGranted) {
            await updatePermission(type, true);
          } else {
            toast({
              title: "Permission Denied",
              description: `Please enable ${type} access in your device settings.`,
              variant: "destructive",
            });
            return;
          }
        } else {
          await updatePermission(type, true);
        }
      }
    } catch (error) {
      console.error('Permission request error:', error);
      toast({
        title: "Error",
        description: "Failed to request permission. Please try again.",
        variant: "destructive",
      });
    } finally {
      setToggleLoading(null);
    }
  };

  const handleNotificationToggle = async (type: 'push' | 'email' | 'sms' | 'whatsapp', value: boolean) => {
    setToggleLoading(type);
    try {
      await updateNotificationPreference(type, value);
    } catch (error) {
      console.error('Notification toggle error:', error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences.",
        variant: "destructive",
      });
    } finally {
      setToggleLoading(null);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      useStore.setState({ currentUser: null });
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "New password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setPasswordLoading(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error('Password change error:', error);
      toast({
        title: "Password Change Failed",
        description: error.message || "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLanguageChange = async (value: string) => {
    await changeLanguage(value);
  };

  const handleDownloadInvoices = () => {
    toast({
      title: "Downloading Invoices",
      description: "Your invoices are being prepared for download.",
    });
  };

  const handleDeleteAccount = async () => {
    try {
      await authService.deleteAccount();
      useStore.setState({ currentUser: null });
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
        variant: "destructive",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "An error occurred while deleting your account",
        variant: "destructive",
      });
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please select an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      try {
        await uploadProfileImage(file, 'avatar');
        toast({
          title: "Success",
          description: "Profile picture updated successfully",
        });
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Failed to upload profile picture. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    to, 
    iconColor = "text-primary",
    iconBg = "from-primary/15 to-primary/5"
  }: { 
    icon: any; 
    title: string; 
    subtitle: string; 
    to?: string; 
    iconColor?: string;
    iconBg?: string;
  }) => {
    const content = (
      <div className="flex items-center gap-4 p-4 rounded-[1.25rem] hover:bg-muted/50 active:bg-muted/70 transition-colors cursor-pointer group">
        <div className={`w-11 h-11 rounded-[1rem] bg-gradient-to-br ${iconBg} flex items-center justify-center shadow-sm group-hover:shadow transition-shadow`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground tracking-tight">{title}</p>
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 group-hover:translate-x-1 transition-transform" />
      </div>
    );

    return to ? <Link to={to}>{content}</Link> : content;
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="gradient-primary rounded-b-[3rem] p-6 pb-10 mb-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <Link to="/customer">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white tracking-tight">Settings</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Profile & Account */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider px-1">
            Profile & Account
          </h3>
          <Card className="rounded-[2rem] overflow-hidden border-border/30 shadow-soft bg-gradient-to-br from-background to-background/50 divide-y divide-border/30">
            <SettingItem 
              icon={User}
              title="Edit Profile"
              subtitle="Name, phone, email address"
              to="/customer/profile"
              iconColor="text-primary"
              iconBg="from-primary/15 to-primary/5"
            />
            <Dialog>
              <DialogTrigger asChild>
                <div>
                  <SettingItem 
                    icon={Lock}
                    title="Change Password"
                    subtitle="Update your login password"
                    iconColor="text-secondary"
                    iconBg="from-secondary/15 to-secondary/5"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="rounded-[2rem] border-border/30">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold tracking-tight">Change Password</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Enter your current password and choose a new one
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="current" className="text-sm font-medium">Current Password</Label>
                    <Input
                      id="current"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="rounded-[1.25rem] h-11"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new" className="text-sm font-medium">New Password</Label>
                    <Input
                      id="new"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="rounded-[1.25rem] h-11"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm" className="text-sm font-medium">Confirm New Password</Label>
                    <Input
                      id="confirm"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="rounded-[1.25rem] h-11"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button 
                    onClick={handlePasswordChange} 
                    disabled={passwordLoading}
                    className="w-full rounded-[1.25rem] h-11 mt-2"
                  >
                    {passwordLoading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <div onClick={handleProfilePictureClick}>
              <SettingItem 
                icon={Camera}
                title="Profile Picture"
                subtitle={uploading ? "Uploading..." : "Update your profile picture"}
                iconColor="text-tertiary"
                iconBg="from-tertiary/15 to-tertiary/5"
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </Card>
        </div>

        {/* App Preferences */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider px-1">
            App Preferences
          </h3>
          <Card className="rounded-[2rem] overflow-hidden border-border/30 shadow-soft bg-gradient-to-br from-background to-background/50 divide-y divide-border/30">
            <Dialog>
              <DialogTrigger asChild>
                <div>
                  <SettingItem 
                    icon={Languages}
                    title="Language"
                    subtitle={`Current: ${selectedLanguage === 'en' ? 'English' : selectedLanguage === 'hi' ? 'Hindi' : selectedLanguage}`}
                    iconColor="text-accent"
                    iconBg="from-accent/15 to-accent/5"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="rounded-[2rem] border-border/30">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold tracking-tight">Select Language</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Choose your preferred language for the app
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="rounded-[1.25rem] h-11">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <div>
                  <SettingItem 
                    icon={Bell}
                    title="Notification Settings"
                    subtitle="Push, Email, SMS, WhatsApp"
                    iconColor="text-orange-600"
                    iconBg="from-orange-500/15 to-orange-500/5"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="rounded-[2rem] border-border/30 max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold tracking-tight">Notification Preferences</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Manage how you receive notifications
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between p-3 rounded-[1.25rem] bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Push Notifications</p>
                        <p className="text-xs text-muted-foreground">In-app alerts</p>
                      </div>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={(v) => handleNotificationToggle('push', v)} disabled={toggleLoading === 'push'} data-testid="switch-push" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-[1.25rem] bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/15 to-secondary/5 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Email</p>
                        <p className="text-xs text-muted-foreground">Order updates via email</p>
                      </div>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={(v) => handleNotificationToggle('email', v)} disabled={toggleLoading === 'email'} data-testid="switch-email" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-[1.25rem] bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-tertiary/15 to-tertiary/5 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-tertiary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">SMS</p>
                        <p className="text-xs text-muted-foreground">Text message alerts</p>
                      </div>
                    </div>
                    <Switch checked={smsNotifications} onCheckedChange={(v) => handleNotificationToggle('sms', v)} disabled={toggleLoading === 'sms'} data-testid="switch-sms" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-[1.25rem] bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/15 to-accent/5 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">WhatsApp</p>
                        <p className="text-xs text-muted-foreground">Updates on WhatsApp</p>
                      </div>
                    </div>
                    <Switch checked={whatsappNotifications} onCheckedChange={(v) => handleNotificationToggle('whatsapp', v)} disabled={toggleLoading === 'whatsapp'} data-testid="switch-whatsapp" />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <SettingItem 
              icon={MapPin}
              title="Default Address"
              subtitle="Set your primary delivery address"
              to="/customer/addresses"
              iconColor="text-blue-600"
              iconBg="from-blue-500/15 to-blue-500/5"
            />
          </Card>
        </div>

        {/* Orders */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider px-1">
            Orders
          </h3>
          <Card className="rounded-[2rem] overflow-hidden border-border/30 shadow-soft bg-gradient-to-br from-background to-background/50 divide-y divide-border/30">
            <SettingItem 
              icon={Clock}
              title="Order History"
              subtitle="View your past and current orders"
              to="/customer/orders"
              iconColor="text-secondary"
              iconBg="from-secondary/15 to-secondary/5"
            />
            <div onClick={handleDownloadInvoices}>
              <SettingItem 
                icon={Download}
                title="Download Invoices"
                subtitle="Get GST compliant invoices"
                iconColor="text-tertiary"
                iconBg="from-tertiary/15 to-tertiary/5"
              />
            </div>
          </Card>
        </div>

        {/* Privacy & Security */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider px-1">
            Privacy & Security
          </h3>
          <Card className="rounded-[2rem] overflow-hidden border-border/30 shadow-soft bg-gradient-to-br from-background to-background/50 divide-y divide-border/30">
            <Dialog>
              <DialogTrigger asChild>
                <div>
                  <SettingItem 
                    icon={Shield}
                    title="Manage Permissions"
                    subtitle="Location, camera, gallery"
                    iconColor="text-purple-600"
                    iconBg="from-purple-500/15 to-purple-500/5"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="rounded-[2rem] border-border/30">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold tracking-tight">App Permissions</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Control what the app can access
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between p-3 rounded-[1.25rem] bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Location</p>
                        <p className="text-xs text-muted-foreground">For delivery tracking</p>
                      </div>
                    </div>
                    <Switch checked={locationPermission} onCheckedChange={(v) => handlePermissionToggle('location', v)} disabled={toggleLoading === 'location'} data-testid="switch-location" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-[1.25rem] bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/15 to-secondary/5 flex items-center justify-center">
                        <Camera className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Camera</p>
                        <p className="text-xs text-muted-foreground">Take photos of items</p>
                      </div>
                    </div>
                    <Switch checked={cameraPermission} onCheckedChange={(v) => handlePermissionToggle('camera', v)} disabled={toggleLoading === 'camera'} data-testid="switch-camera" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-[1.25rem] bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-tertiary/15 to-tertiary/5 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-tertiary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Gallery</p>
                        <p className="text-xs text-muted-foreground">Upload photos</p>
                      </div>
                    </div>
                    <Switch checked={galleryPermission} onCheckedChange={(v) => handlePermissionToggle('gallery', v)} disabled={toggleLoading === 'gallery'} data-testid="switch-gallery" />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div>
                  <SettingItem 
                    icon={Trash2}
                    title="Delete Account"
                    subtitle="This action is permanent"
                    iconColor="text-red-600"
                    iconBg="from-red-500/15 to-red-500/5"
                  />
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-[2rem] border-border/30">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold">Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:gap-0">
                  <AlertDialogCancel className="rounded-[1.25rem]">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="rounded-[1.25rem] bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Card>
        </div>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full justify-center gap-3 h-14 rounded-[1.5rem] border-red-500/30 text-red-600 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-600 shadow-sm transition-all"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-bold tracking-tight">Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Settings;
