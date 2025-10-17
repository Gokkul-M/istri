import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
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
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard", color: "text-primary" },
  { path: "/admin/customers", icon: Users, label: "Customers", color: "text-secondary" },
  { path: "/admin/launderers", icon: UserCheck, label: "Launderers", color: "text-tertiary" },
  { path: "/admin/orders", icon: Package, label: "Orders", color: "text-accent" },
  { path: "/admin/services", icon: Wrench, label: "Services", color: "text-secondary" },
  { path: "/admin/coupons", icon: Ticket, label: "Coupons", color: "text-primary" },
  { path: "/admin/disputes", icon: Shield, label: "Disputes", color: "text-tertiary" },
  { path: "/admin/location", icon: MapPin, label: "Location Tracking", color: "text-tertiary" },
  { path: "/admin/payments", icon: DollarSign, label: "Payments", color: "text-accent" },
  { path: "/admin/complaints", icon: MessageSquare, label: "Complaints", color: "text-primary" },
  { path: "/admin/settings", icon: Settings, label: "Settings", color: "text-foreground" },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();

  const isActivePath = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with gradient */}
      <div className="gradient-primary rounded-b-[3rem] p-6 pb-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              <div className="flex flex-col h-full bg-background">
                {/* Profile Section */}
                <div className="gradient-primary p-6 rounded-br-3xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-lg">Admin Panel</h2>
                      <p className="text-white/80 text-sm">System Administrator</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                      <p className="text-white/70 text-xs">Total Users</p>
                      <p className="text-white font-bold text-lg">1.2K</p>
                    </div>
                    <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                      <p className="text-white/70 text-xs">Revenue</p>
                      <p className="text-white font-bold text-lg">₹8.1L</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-1">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = isActivePath(item.path);
                      return (
                        <Link 
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${
                            isActive ? 'bg-primary/20' : 'hover:bg-muted'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl ${
                            isActive ? 'bg-primary/30' : 'bg-muted'
                          } flex items-center justify-center group-hover:bg-primary/20 transition-colors`}>
                            <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : item.color}`} />
                          </div>
                          <span className={`font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                            {item.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-border">
                  <button className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-red-500/10 transition-all w-full group">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                      <LogOut className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="font-semibold text-red-500">Logout</span>
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
          <h1 className="text-3xl font-bold text-white">
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
