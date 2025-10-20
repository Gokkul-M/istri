import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Plus,
  Sparkles,
  WashingMachine,
  Wind,
  Clock,
  ChevronRight,
  Menu,
  Home,
  Tag,
  Receipt,
  Settings as SettingsIcon,
  Bell,
  Calendar,
  LogOut,
} from "lucide-react";
import { useFirebaseOrders } from "@/hooks/useFirebaseOrders";
import { useAuth } from "@/hooks/useFirebaseAuth";
import { useFirebaseCoupons } from "@/hooks/useFirebaseCoupons";
import { useNotifications } from "@/hooks/useNotifications";
import { useStore } from "@/store/useStore";
import { useNavigate } from "react-router-dom";
import { IndexMissingError } from "@/components/IndexMissingError";

const CustomerDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { currentUser } = useStore();
  const { orders, loading: ordersLoading, error: ordersError } = useFirebaseOrders();
  const { coupons, loading: couponsLoading } = useFirebaseCoupons();
  const { notifications } = useNotifications(currentUser?.id || null);
  
  const services = [
    { name: "Dry Clean", icon: Sparkles, color: "bg-primary" },
    { name: "Laundry", icon: WashingMachine, color: "bg-secondary" },
    { name: "Iron", icon: Wind, color: "bg-accent" },
  ];

  const activeOrders = orders.filter(order => 
    order.status === "pending" || 
    order.status === "confirmed" || 
    order.status === "in_progress"
  ).slice(0, 3);

  // Calculate total spent from completed orders
  const totalSpent = orders
    .filter(order => order.status === "completed")
    .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  
  // Get unread notification count
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header with gradient */}
      <div className="gradient-primary rounded-b-[3rem] p-6 pb-10 mb-6 shadow-soft">
        <div className="flex items-center justify-between mb-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
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
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-white font-bold text-lg leading-tight mb-1 truncate">{user?.name || "Guest"}</h2>
                      <p className="text-white/80 text-xs truncate">{user?.email || user?.phone || "Welcome back"}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/15 backdrop-blur-sm rounded-[1.25rem] p-3.5 border border-white/20 shadow-sm">
                      <p className="text-white/70 text-xs font-medium mb-1">Total Orders</p>
                      <p className="text-white font-bold text-xl">{ordersLoading ? "..." : orders.length}</p>
                    </div>
                    <div className="bg-white/15 backdrop-blur-sm rounded-[1.25rem] p-3.5 border border-white/20 shadow-sm">
                      <p className="text-white/70 text-xs font-medium mb-1">Total Spent</p>
                      <p className="text-white font-bold text-xl">₹{ordersLoading ? "..." : totalSpent}</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-5 overflow-y-auto">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">Main Menu</p>
                    
                    <Link
                      to="/customer"
                      className="flex items-center gap-4 px-3 py-3.5 rounded-[1.25rem] hover:bg-primary/10 active:bg-primary/15 transition-all group"
                    >
                      <div className="w-11 h-11 rounded-[1rem] bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-all shadow-sm">
                        <Home className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-semibold text-foreground tracking-tight">Home</span>
                    </Link>

                    <Link
                      to="/customer/new-order"
                      className="flex items-center gap-4 px-3 py-3.5 rounded-[1.25rem] hover:bg-secondary/10 active:bg-secondary/15 transition-all group"
                    >
                      <div className="w-11 h-11 rounded-[1rem] bg-gradient-to-br from-secondary/15 to-secondary/5 flex items-center justify-center group-hover:from-secondary/20 group-hover:to-secondary/10 transition-all shadow-sm">
                        <Plus className="w-5 h-5 text-secondary" />
                      </div>
                      <span className="font-semibold text-foreground tracking-tight">New Order</span>
                    </Link>

                    <Link
                      to="/customer/orders"
                      className="flex items-center gap-4 px-3 py-3.5 rounded-[1.25rem] hover:bg-accent/10 active:bg-accent/15 transition-all group"
                    >
                      <div className="w-11 h-11 rounded-[1rem] bg-gradient-to-br from-accent/15 to-accent/5 flex items-center justify-center group-hover:from-accent/20 group-hover:to-accent/10 transition-all shadow-sm">
                        <Clock className="w-5 h-5 text-accent" />
                      </div>
                      <span className="font-semibold text-foreground tracking-tight">Order History</span>
                    </Link>

                    <Link
                      to="/customer/notifications"
                      className="flex items-center gap-4 px-3 py-3.5 rounded-[1.25rem] hover:bg-orange-500/10 active:bg-orange-500/15 transition-all group relative"
                    >
                      <div className="w-11 h-11 rounded-[1rem] bg-gradient-to-br from-orange-500/15 to-orange-500/5 flex items-center justify-center group-hover:from-orange-500/20 group-hover:to-orange-500/10 transition-all shadow-sm">
                        <Bell className="w-5 h-5 text-orange-600" />
                        {unreadNotifications > 0 && (
                          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                            {unreadNotifications > 9 ? '9+' : unreadNotifications}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between flex-1">
                        <span className="font-semibold text-foreground tracking-tight">Notifications</span>
                        {unreadNotifications > 0 && (
                          <Badge className="bg-red-500/15 text-red-700 border-0 text-xs px-2">
                            {unreadNotifications}
                          </Badge>
                        )}
                      </div>
                    </Link>

                    <div className="h-px bg-border/50 my-4"></div>
                    
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3 mt-4">More</p>

                    <Link
                      to="/customer/offers"
                      className="flex items-center gap-4 px-3 py-3.5 rounded-[1.25rem] hover:bg-tertiary/10 active:bg-tertiary/15 transition-all group"
                    >
                      <div className="w-11 h-11 rounded-[1rem] bg-gradient-to-br from-tertiary/15 to-tertiary/5 flex items-center justify-center group-hover:from-tertiary/20 group-hover:to-tertiary/10 transition-all shadow-sm">
                        <Tag className="w-5 h-5 text-tertiary" />
                      </div>
                      <span className="font-semibold text-foreground tracking-tight">Offers & Deals</span>
                    </Link>

                    <Link
                      to="/customer/settings"
                      className="flex items-center gap-4 px-3 py-3.5 rounded-[1.25rem] hover:bg-muted active:bg-muted/80 transition-all group"
                    >
                      <div className="w-11 h-11 rounded-[1rem] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center group-hover:from-muted group-hover:to-muted/70 transition-all shadow-sm">
                        <SettingsIcon className="w-5 h-5 text-foreground" />
                      </div>
                      <span className="font-semibold text-foreground tracking-tight">Settings</span>
                    </Link>
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
          <Link to="/customer/profile">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
              <User className="w-5 h-5 text-white" />
            </div>
          </Link>
        </div>

        <div className="space-y-3 mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Welcome back,
            <br />
            {user?.name || "Guest"}!
          </h1>
          <p className="text-white/90 text-sm leading-relaxed">
            Choose the laundry service you need today
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-3 gap-3">
          {services.map((service) => (
            <button
              key={service.name}
              className="bg-white/95 backdrop-blur-sm rounded-[1.5rem] p-4 hover-lift flex flex-col items-center gap-3 transition-all border border-white/20"
            >
              <div className={`${service.color} rounded-2xl p-3.5 w-14 h-14 flex items-center justify-center shadow-soft`}>
                <service.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-foreground">{service.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 space-y-6">
        {/* Promotions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">Special Promotions</h2>
            <Link to="/customer/offers">
              <Button variant="ghost" size="sm" className="text-primary" data-testid="button-view-more-offers">
                View More <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          {couponsLoading ? (
            <Skeleton className="h-24 rounded-[2rem]" />
          ) : coupons.length > 0 ? (
            <Link to={`/customer/new-order?coupon=${coupons[0].code}`} data-testid="link-promotion-card">
              <Card className="gradient-accent rounded-[2rem] p-5 border-0 relative overflow-hidden shadow-medium hover-lift cursor-pointer transition-all">
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-soft">
                      <Tag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-base mb-0.5">{coupons[0].description}</p>
                      <p className="text-white/95 text-sm font-medium">CODE: {coupons[0].code}</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-white/95 text-accent hover:bg-white font-semibold shadow-soft" data-testid="button-book-now-promo">
                    Book Now
                  </Button>
                </div>
              </Card>
            </Link>
          ) : (
            <Card className="gradient-accent rounded-[2rem] p-5 border-0 relative overflow-hidden shadow-medium">
              <div className="flex items-center justify-center relative z-10">
                <p className="text-white text-sm">No active promotions at the moment</p>
              </div>
            </Card>
          )}
        </div>

        {/* Active Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">Order Again</h2>
            <Link to="/customer/orders">
              <Button variant="ghost" size="sm" className="text-primary" data-testid="button-view-more-order-again">
                View More <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          {ordersError && (ordersError as any).code === 'failed-precondition' ? (
            <IndexMissingError message="Your orders require a database index to be created. Please create the required index for the 'orders' collection." />
          ) : ordersLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 rounded-[2rem]" />
              <Skeleton className="h-24 rounded-[2rem]" />
            </div>
          ) : activeOrders.length > 0 ? (
            activeOrders.map((order) => {
              const serviceName = order.items?.[0]?.serviceName || "Laundry Service";
              const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
              const statusText = order.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              
              return (
                <Link key={order.id} to={`/customer/order/${order.id}`} data-testid={`card-order-again-${order.id}`} className="block mb-3">
                  <Card className="rounded-[2rem] p-5 hover-lift cursor-pointer border-border/30 shadow-soft">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
                        <WashingMachine className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-base">{serviceName}</h3>
                          <Badge className="bg-secondary/15 text-secondary hover:bg-secondary/20 border-0 font-medium">{statusText}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{order.laundererName || "Pending Assignment"}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {totalItems} items
                          </span>
                          <span>₹{order.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })
          ) : (
            <Card className="rounded-[2rem] p-8 text-center border-border/30">
              <WashingMachine className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No active orders yet. Start your first order!</p>
            </Card>
          )}
        </div>

        {/* Quick Stats */}
        <div>
          <h2 className="text-xl font-bold mb-4 tracking-tight">Your Activity</h2>
          <div className="grid grid-cols-2 gap-3">
            <Card className="rounded-[2rem] p-5 border-border/30 shadow-soft hover:shadow-medium transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Receipt className="w-6 h-6 text-primary" />
              </div>
              {ordersLoading ? (
                <Skeleton className="h-8 w-20 mb-1" />
              ) : (
                <p className="text-2xl font-bold tracking-tight">₹{totalSpent}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">Total Spent</p>
            </Card>
            <Link to="/customer/notifications">
              <Card className="rounded-[2rem] p-5 border-border/30 shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer hover-lift relative">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-3 relative">
                  <Bell className="w-6 h-6 text-accent" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold tracking-tight">{unreadNotifications}</p>
                <p className="text-sm text-muted-foreground mt-1">Notifications</p>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link to="/customer/new-order">
          <Button size="icon" variant="hero" className="w-16 h-16 rounded-full shadow-glow pulse-glow">
            <Plus className="w-8 h-8" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CustomerDashboard;
