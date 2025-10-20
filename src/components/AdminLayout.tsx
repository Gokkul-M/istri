import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useFirebaseAuth";
import {
  LayoutDashboard,
  Users,
  Package,
  MapPin,
  DollarSign,
  MessageSquare,
  Settings,
  BarChart3,
  User,
  Menu,
  LogOut,
  Shield,
  UserCheck,
  Ticket,
  Wrench,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard", color: "text-primary", section: "main" },
  { path: "/admin/customers", icon: Users, label: "Customers", color: "text-secondary", section: "main" },
  { path: "/admin/launderers", icon: UserCheck, label: "Launderers", color: "text-tertiary", section: "main" },
  { path: "/admin/orders", icon: Package, label: "Orders", color: "text-accent", section: "main" },
  { path: "/admin/services", icon: Wrench, label: "Services", color: "text-secondary", section: "more" },
  { path: "/admin/coupons", icon: Ticket, label: "Coupons", color: "text-primary", section: "more" },
  { path: "/admin/disputes", icon: Shield, label: "Disputes", color: "text-tertiary", section: "more" },
  { path: "/admin/location", icon: MapPin, label: "Location Tracking", color: "text-tertiary", section: "more" },
  { path: "/admin/payments", icon: DollarSign, label: "Payments", color: "text-accent", section: "more" },
  { path: "/admin/complaints", icon: MessageSquare, label: "Complaints", color: "text-primary", section: "more" },
  { path: "/admin/settings", icon: Settings, label: "Settings", color: "text-foreground", section: "more" },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const isActivePath = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  const mainItems = navItems.filter(item => item.section === "main");
  const moreItems = navItems.filter(item => item.section === "more");

  return (
    <div className="min-h-screen bg-background">
      {/* Header with gradient */}
      <div className="gradient-primary rounded-b-[3rem] p-6 pb-8 mb-6 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0 border-r border-border/50">
              <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/95">
                {/* Profile Section */}
                <div className="gradient-primary rounded-br-[2rem] p-6 pb-8 shadow-soft">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-medium border border-white/30">
                        <Shield className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-white font-bold text-lg leading-tight mb-1 truncate">Admin Panel</h2>
                      <p className="text-white/80 text-xs truncate">System Administrator</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/15 backdrop-blur-sm rounded-[1.25rem] p-3.5 border border-white/20 shadow-sm">
                      <p className="text-white/70 text-xs font-medium mb-1">Total Users</p>
                      <p className="text-white font-bold text-xl">1.2K</p>
                    </div>
                    <div className="bg-white/15 backdrop-blur-sm rounded-[1.25rem] p-3.5 border border-white/20 shadow-sm">
                      <p className="text-white/70 text-xs font-medium mb-1">Revenue</p>
                      <p className="text-white font-bold text-xl">₹8.1L</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-5 overflow-y-auto">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">Main Menu</p>
                    
                    {mainItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = isActivePath(item.path);
                      return (
                        <Link 
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-4 px-3 py-3.5 rounded-[1.25rem] transition-all group ${
                            isActive ? 'bg-primary/15' : 'hover:bg-primary/10 active:bg-primary/15'
                          }`}
                        >
                          <div className={`w-11 h-11 rounded-[1rem] bg-gradient-to-br flex items-center justify-center transition-all shadow-sm ${
                            isActive 
                              ? 'from-primary/25 to-primary/15 shadow' 
                              : `${item.color === 'text-primary' ? 'from-primary/15 to-primary/5' : item.color === 'text-secondary' ? 'from-secondary/15 to-secondary/5' : item.color === 'text-tertiary' ? 'from-tertiary/15 to-tertiary/5' : 'from-accent/15 to-accent/5'} group-hover:from-primary/20 group-hover:to-primary/10`
                          }`}>
                            <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : item.color}`} />
                          </div>
                          <span className={`font-semibold tracking-tight ${isActive ? 'text-primary' : 'text-foreground'}`}>
                            {item.label}
                          </span>
                        </Link>
                      );
                    })}

                    <div className="h-px bg-border/50 my-4"></div>
                    
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3 mt-4">More</p>

                    {moreItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = isActivePath(item.path);
                      return (
                        <Link 
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-4 px-3 py-3.5 rounded-[1.25rem] transition-all group ${
                            isActive ? 'bg-primary/15' : 'hover:bg-muted active:bg-muted/80'
                          }`}
                        >
                          <div className={`w-11 h-11 rounded-[1rem] bg-gradient-to-br flex items-center justify-center transition-all shadow-sm ${
                            isActive 
                              ? 'from-primary/25 to-primary/15 shadow' 
                              : `${item.color === 'text-primary' ? 'from-primary/15 to-primary/5' : item.color === 'text-secondary' ? 'from-secondary/15 to-secondary/5' : item.color === 'text-tertiary' ? 'from-tertiary/15 to-tertiary/5' : item.color === 'text-accent' ? 'from-accent/15 to-accent/5' : 'from-muted to-muted/50'} group-hover:from-muted group-hover:to-muted/70`
                          }`}>
                            <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : item.color}`} />
                          </div>
                          <span className={`font-semibold tracking-tight ${isActive ? 'text-primary' : 'text-foreground'}`}>
                            {item.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </nav>

                {/* Logout Button */}
                <div className="p-5 border-t border-border/50 bg-background/50 backdrop-blur-sm">
                  <button 
                    onClick={async () => {
                      await signOut();
                      navigate('/login');
                    }}
                    className="flex items-center gap-4 px-3 py-3.5 rounded-[1.25rem] hover:bg-red-500/10 active:bg-red-500/15 transition-all w-full group"
                    data-testid="button-logout"
                  >
                    <div className="w-11 h-11 rounded-[1rem] bg-gradient-to-br from-red-500/15 to-red-500/5 flex items-center justify-center group-hover:from-red-500/20 group-hover:to-red-500/10 transition-all shadow-sm">
                      <LogOut className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="font-bold text-red-500 tracking-tight">Logout</span>
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/admin/profile">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
              <User className="w-5 h-5 text-white" />
            </div>
          </Link>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-white/80 text-sm">
            Manage and monitor your platform
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full">{children}</main>
    </div>
  );
}
