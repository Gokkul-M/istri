import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/store/useStore";
import { useSettings } from "@/hooks/useSettings";
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
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      // Just save to settings if turning off
      await updatePermission(type, false);
      return;
    }

    setToggleLoading(type);
    try {
      if (type === 'location') {
        const permission = await Geolocation.checkPermissions();
        if (permission.location === 'denied') {
          const request = await Geolocation.requestPermissions();
          if (request.location === 'granted' || request.location === 'prompt') {
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
        if (permission.camera === 'denied' || permission.photos === 'denied') {
          const request = await CapacitorCamera.requestPermissions();
          if (request.camera === 'granted' || request.photos === 'granted') {
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

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
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

  const SettingItem = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    to, 
    iconColor = "text-primary" 
  }: { 
    icon: any; 
    title: string; 
    subtitle: string; 
    to?: string; 
    iconColor?: string;
  }) => {
    const content = (
      <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <div className="flex-1">
          <p className="font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
    );

    return to ? <Link to={to}>{content}</Link> : <div className="cursor-pointer">{content}</div>;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-primary p-6 pb-8 rounded-b-[3rem]">
        <div className="flex items-center justify-between mb-4">
          <Link to="/customer">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">Settings</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Profile & Account */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Profile & Account
          </h3>
          <Card className="rounded-2xl overflow-hidden divide-y divide-border">
            <SettingItem 
              icon={User}
              title="Edit Profile"
              subtitle="Name, phone, email address"
              to="/customer/profile"
              iconColor="text-primary"
            />
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <Lock className="w-5 h-5 text-secondary" />
                  <div className="flex-1">
                    <p className="font-medium">Change Password</p>
                    <p className="text-xs text-muted-foreground">Update your login password</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </DialogTrigger>
              <DialogContent className="rounded-[2rem]">
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Enter your current password and choose a new one
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="current">Current Password</Label>
                    <Input
                      id="current"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="rounded-[1.25rem]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new">New Password</Label>
                    <Input
                      id="new"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="rounded-[1.25rem]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm">Confirm New Password</Label>
                    <Input
                      id="confirm"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="rounded-[1.25rem]"
                    />
                  </div>
                  <Button onClick={handlePasswordChange} className="w-full rounded-[1.25rem]">
                    Update Password
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <SettingItem 
              icon={ImageIcon}
              title="Profile Picture"
              subtitle="Update your profile picture"
              iconColor="text-tertiary"
            />
          </Card>
        </div>

        {/* App Preferences */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            App Preferences
          </h3>
          <Card className="rounded-2xl overflow-hidden divide-y divide-border">
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <Languages className="w-5 h-5 text-secondary" />
                  <div className="flex-1">
                    <p className="font-medium">Language</p>
                    <p className="text-xs text-muted-foreground">Select your preferred language</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </DialogTrigger>
              <DialogContent className="rounded-[2rem]">
                <DialogHeader>
                  <DialogTitle>Select Language</DialogTitle>
                  <DialogDescription>
                    Choose your preferred language for the app
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="rounded-[1.25rem]">
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
                <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <Bell className="w-5 h-5 text-tertiary" />
                  <div className="flex-1">
                    <p className="font-medium">Notification Settings</p>
                    <p className="text-xs text-muted-foreground">Push, SMS, WhatsApp</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </DialogTrigger>
              <DialogContent className="rounded-[2rem]">
                <DialogHeader>
                  <DialogTitle>Notification Preferences</DialogTitle>
                  <DialogDescription>
                    Manage how you receive notifications
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-xs text-muted-foreground">In-app alerts</p>
                      </div>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={(v) => handleNotificationToggle('push', v)} disabled={toggleLoading === 'push'} data-testid="switch-push" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-xs text-muted-foreground">Order updates via email</p>
                      </div>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={(v) => handleNotificationToggle('email', v)} disabled={toggleLoading === 'email'} data-testid="switch-email" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-tertiary" />
                      <div>
                        <p className="font-medium">SMS</p>
                        <p className="text-xs text-muted-foreground">Text message alerts</p>
                      </div>
                    </div>
                    <Switch checked={smsNotifications} onCheckedChange={(v) => handleNotificationToggle('sms', v)} disabled={toggleLoading === 'sms'} data-testid="switch-sms" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-accent" />
                      <div>
                        <p className="font-medium">WhatsApp</p>
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
              iconColor="text-accent"
            />
          </Card>
        </div>

        {/* Orders */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Orders
          </h3>
          <Card className="rounded-2xl overflow-hidden divide-y divide-border">
            <SettingItem 
              icon={Clock}
              title="Order History"
              subtitle="View your past and current orders"
              to="/customer/orders"
              iconColor="text-secondary"
            />
            <div onClick={handleDownloadInvoices} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <Download className="w-5 h-5 text-tertiary" />
              <div className="flex-1">
                <p className="font-medium">Download Invoices</p>
                <p className="text-xs text-muted-foreground">Get GST compliant invoices</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>
        </div>

        {/* Privacy & Security */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Privacy & Security
          </h3>
          <Card className="rounded-2xl overflow-hidden divide-y divide-border">
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <Shield className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">Manage Permissions</p>
                    <p className="text-xs text-muted-foreground">Location, camera, gallery</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </DialogTrigger>
              <DialogContent className="rounded-[2rem]">
                <DialogHeader>
                  <DialogTitle>App Permissions</DialogTitle>
                  <DialogDescription>
                    Control what the app can access
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-xs text-muted-foreground">For delivery tracking</p>
                      </div>
                    </div>
                    <Switch checked={locationPermission} onCheckedChange={(v) => handlePermissionToggle('location', v)} disabled={toggleLoading === 'location'} data-testid="switch-location" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Camera className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="font-medium">Camera</p>
                        <p className="text-xs text-muted-foreground">Take photos of items</p>
                      </div>
                    </div>
                    <Switch checked={cameraPermission} onCheckedChange={(v) => handlePermissionToggle('camera', v)} disabled={toggleLoading === 'camera'} data-testid="switch-camera" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="w-5 h-5 text-tertiary" />
                      <div>
                        <p className="font-medium">Gallery</p>
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
                <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <Trash2 className="w-5 h-5 text-destructive" />
                  <div className="flex-1">
                    <p className="font-medium text-destructive">Delete Account</p>
                    <p className="text-xs text-muted-foreground">This action is permanent</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-3xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-2xl">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="rounded-2xl bg-destructive text-destructive-foreground">
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
          className="w-full justify-center gap-3 h-14 rounded-2xl border-destructive/30 text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold">Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Settings;
