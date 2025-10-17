import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home,
  Tag,
  Clock,
  Receipt,
  UserCircle2,
  Package,
  TrendingUp,
  Settings,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  role: "customer" | "launderer";
}

export const BottomNav = ({ role }: BottomNavProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  if (role === "customer") {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 backdrop-blur-lg z-40">
        <div className="flex items-center justify-around px-4 py-2 max-w-md mx-auto relative">
          <Link to="/customer">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "flex flex-col gap-0.5 h-auto py-2 transition-colors",
                isActive("/customer") ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Home className="w-5 h-5" />
              <span className={cn("text-[10px]", isActive("/customer") && "font-semibold")}>Home</span>
            </Button>
          </Link>
          
          <Link to="/customer/offers">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "flex flex-col gap-0.5 h-auto py-2 transition-colors",
                isActive("/customer/offers") ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Tag className="w-5 h-5" />
              <span className={cn("text-[10px]", isActive("/customer/offers") && "font-semibold")}>Offers</span>
            </Button>
          </Link>
          
          <Link to="/customer/orders" className="relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                <Clock className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <div className="w-14 h-14" /> {/* Spacer */}
          </Link>
          
          <Link to="/customer/new-order">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "flex flex-col gap-0.5 h-auto py-2 transition-colors",
                isActive("/customer/new-order") ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Receipt className="w-5 h-5" />
              <span className={cn("text-[10px]", isActive("/customer/new-order") && "font-semibold")}>Book</span>
            </Button>
          </Link>
          
          <Link to="/customer/settings">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "flex flex-col gap-0.5 h-auto py-2 transition-colors",
                isActive("/customer/settings") ? "text-primary" : "text-muted-foreground"
              )}
            >
              <UserCircle2 className="w-5 h-5" />
              <span className={cn("text-[10px]", isActive("/customer/settings") && "font-semibold")}>Profile</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Launderer navigation
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 backdrop-blur-lg z-40">
      <div className="flex items-center justify-around px-4 py-2 max-w-md mx-auto relative">
        <Link to="/launderer">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "flex flex-col gap-0.5 h-auto py-2 transition-colors",
              isActive("/launderer") ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Home className="w-5 h-5" />
            <span className={cn("text-[10px]", isActive("/launderer") && "font-semibold")}>Home</span>
          </Button>
        </Link>
        
        <Link to="/launderer/orders">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "flex flex-col gap-0.5 h-auto py-2 transition-colors",
              isActive("/launderer/orders") ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Package className="w-5 h-5" />
            <span className={cn("text-[10px]", isActive("/launderer/orders") && "font-semibold")}>Orders</span>
          </Button>
        </Link>
        
        <Link to="/launderer/revenue" className="relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <div className="w-14 h-14" /> {/* Spacer */}
        </Link>
        
        <Link to="/launderer/services">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "flex flex-col gap-0.5 h-auto py-2 transition-colors",
              isActive("/launderer/services") ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Settings className="w-5 h-5" />
            <span className={cn("text-[10px]", isActive("/launderer/services") && "font-semibold")}>Services</span>
          </Button>
        </Link>
        
        <Link to="/launderer/profile">
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "flex flex-col gap-0.5 h-auto py-2 transition-colors",
              isActive("/launderer/profile") ? "text-primary" : "text-muted-foreground"
            )}
          >
            <User className="w-5 h-5" />
            <span className={cn("text-[10px]", isActive("/launderer/profile") && "font-semibold")}>Profile</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
