import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { QRScannerModal } from "@/components/QRScannerModal";
import { useFirebaseOrders } from "@/hooks/useFirebaseOrders";
import { useAuth } from "@/hooks/useFirebaseAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  User,
  QrCode,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  Settings,
  Menu,
  Home,
  Briefcase,
  LogOut,
  Loader2,
  Check,
  X,
} from "lucide-react";

const LaundererDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { orders, loading, updateOrder } = useFirebaseOrders();
  const { profile } = useProfile(user?.id || null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [processingOrders, setProcessingOrders] = useState<Set<string>>(new Set());

  // Filter orders assigned to this launderer
  const myOrders = orders.filter(o => o.laundererId === user?.id);
  
  const pendingOrders = myOrders.filter(o => o.status === "confirmed");
  const activeOrders = myOrders.filter(o => 
    o.status === "picked_up" || o.status === "in_progress" || o.status === "ready"
  );
  const completedOrders = myOrders.filter(o => o.status === "completed");
  const totalRevenue = completedOrders.reduce((acc, order) => acc + order.totalAmount, 0);

  const weeklyOrders = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return myOrders.filter(order => {
      if (!order.createdAt) return false;
      try {
        const orderDate = new Date(order.createdAt as any);
        return !isNaN(orderDate.getTime()) && orderDate >= oneWeekAgo;
      } catch {
        return false;
      }
    }).length;
  }, [myOrders]);

  const averageRating = useMemo(() => {
    const ordersWithRatings = completedOrders.filter(order => order.rating && order.rating > 0);
    if (ordersWithRatings.length === 0) return '0';
    
    const totalRating = ordersWithRatings.reduce((acc, order) => acc + (order.rating || 0), 0);
    return (totalRating / ordersWithRatings.length).toFixed(1);
  }, [completedOrders]);

  const handleAcceptOrder = async (orderId: string) => {
    setProcessingOrders(prev => new Set(prev).add(orderId));
    try {
      await updateOrder(orderId, {
        status: "picked_up",
      });
      toast({
        title: "Order Accepted",
        description: "Order has been accepted and marked as picked up",
      });
    } catch (error) {
      console.error("Error accepting order:", error);
      toast({
        title: "Error",
        description: "Failed to accept order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    setProcessingOrders(prev => new Set(prev).add(orderId));
    try {
      await updateOrder(orderId, {
        status: "pending",
        laundererId: undefined,
        laundererName: undefined,
        laundererPhone: undefined,
      });
      toast({
        title: "Order Rejected",
        description: "Order has been returned to pending queue",
      });
    } catch (error) {
      console.error("Error rejecting order:", error);
      toast({
        title: "Error",
        description: "Failed to reject order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const stats = [
    { label: "Total Orders", value: myOrders.length.toString(), icon: Package, color: "text-tertiary" },
    { label: "Revenue", value: totalRevenue >= 1000 ? `₹${(totalRevenue / 1000).toFixed(1)}K` : `₹${totalRevenue}`, icon: TrendingUp, color: "text-accent" },
    { label: "Active", value: (pendingOrders.length + activeOrders.length).toString(), icon: Clock, color: "text-secondary" },
  ];

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
            <SheetContent side="left" className="w-[300px] p-0 border-r border-border/50">
              <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/95">
                {/* Profile Section */}
                <div className="gradient-primary rounded-br-[2rem] p-6 pb-8 shadow-soft">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-medium border border-white/30">
                        <Briefcase className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-white font-bold text-lg leading-tight mb-1 truncate">
                        {profile?.businessName || profile?.name || 'My Business'}
                      </h2>
                      <p className="text-white/80 text-xs truncate">Laundry Service Provider</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/15 backdrop-blur-sm rounded-[1.25rem] p-3.5 border border-white/20 shadow-sm">
                      <p className="text-white/70 text-xs font-medium mb-1">This Week</p>
                      <p className="text-white font-bold text-xl">{weeklyOrders}</p>
                    </div>
                    <div className="bg-white/15 backdrop-blur-sm rounded-[1.25rem] p-3.5 border border-white/20 shadow-sm">
                      <p className="text-white/70 text-xs font-medium mb-1">Rating</p>
                      <p className="text-white font-bold text-xl">
                        {averageRating !== '0' ? `${averageRating} ⭐` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-5 overflow-y-auto">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">Main Menu</p>
                    
                    <Link
                      to="/launderer"
                      className="flex items-center gap-4 px-3 py-3.5 rounded-[1.25rem] hover:bg-primary/10 active:bg-primary/15 transition-all group"
                    >
                      <div className="w-11 h-11 rounded-[1rem] bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-all shadow-sm">
                        <Home className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-semibold text-foreground tracking-tight">Dashboard</span>
                    </Link>

                    <Link
                      to="/launderer/orders"
                      className="flex items-center gap-4 px-3 py-3.5 rounded-[1.25rem] hover:bg-secondary/10 active:bg-secondary/15 transition-all group"
                    >
                      <div className="w-11 h-11 rounded-[1rem] bg-gradient-to-br from-secondary/15 to-secondary/5 flex items-center justify-center group-hover:from-secondary/20 group-hover:to-secondary/10 transition-all shadow-sm">
                        <Package className="w-5 h-5 text-secondary" />
                      </div>
                      <span className="font-semibold text-foreground tracking-tight">Order Management</span>
                    </Link>

                    <Link
                      to="/launderer/revenue"
                      className="flex items-center gap-4 px-3 py-3.5 rounded-[1.25rem] hover:bg-accent/10 active:bg-accent/15 transition-all group"
                    >
                      <div className="w-11 h-11 rounded-[1rem] bg-gradient-to-br from-accent/15 to-accent/5 flex items-center justify-center group-hover:from-accent/20 group-hover:to-accent/10 transition-all shadow-sm">
                        <TrendingUp className="w-5 h-5 text-accent" />
                      </div>
                      <span className="font-semibold text-foreground tracking-tight">Revenue & Earnings</span>
                    </Link>

                    <div className="h-px bg-border/50 my-4"></div>
                    
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3 mt-4">More</p>

                    <Link
                      to="/launderer/services"
                      className="flex items-center gap-4 px-3 py-3.5 rounded-[1.25rem] hover:bg-tertiary/10 active:bg-tertiary/15 transition-all group"
                    >
                      <div className="w-11 h-11 rounded-[1rem] bg-gradient-to-br from-tertiary/15 to-tertiary/5 flex items-center justify-center group-hover:from-tertiary/20 group-hover:to-tertiary/10 transition-all shadow-sm">
                        <Settings className="w-5 h-5 text-tertiary" />
                      </div>
                      <span className="font-semibold text-foreground tracking-tight">Services Setup</span>
                    </Link>

                    <Link
                      to="/launderer/profile"
                      className="flex items-center gap-4 px-3 py-3.5 rounded-[1.25rem] hover:bg-muted active:bg-muted/80 transition-all group"
                    >
                      <div className="w-11 h-11 rounded-[1rem] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center group-hover:from-muted group-hover:to-muted/70 transition-all shadow-sm">
                        <User className="w-5 h-5 text-foreground" />
                      </div>
                      <span className="font-semibold text-foreground tracking-tight">Business Profile</span>
                    </Link>

                    <Link
                      to="/launderer/settings"
                      className="flex items-center gap-4 px-3 py-3.5 rounded-[1.25rem] hover:bg-muted active:bg-muted/80 transition-all group"
                    >
                      <div className="w-11 h-11 rounded-[1rem] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center group-hover:from-muted group-hover:to-muted/70 transition-all shadow-sm">
                        <Settings className="w-5 h-5 text-foreground" />
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
          <Link to="/launderer/profile">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
              <User className="w-5 h-5 text-white" />
            </div>
          </Link>
        </div>

        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-white">Business Dashboard</h1>
          <p className="text-white/80 text-sm">Manage orders and grow your business</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <Card key={stat.label} className="card-glass rounded-3xl p-4 border-white/10">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold text-black">{stat.value}</p>
              <p className="text-black/70 text-xs">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/launderer/scan" data-testid="button-scan-qr">
            <Button variant="hero" className="h-auto py-6 flex-col gap-2 w-full">
              <QrCode className="w-8 h-8" />
              <span>Scan QR Code</span>
            </Button>
          </Link>
          <Link to="/launderer/services">
            <Button variant="secondary" className="h-auto py-6 flex-col gap-2 w-full">
              <Settings className="w-8 h-8" />
              <span>Services</span>
            </Button>
          </Link>
        </div>

        {/* Assigned Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">Assigned Orders</h2>
            <Link to="/launderer/orders">
              <Badge className="bg-accent/15 text-accent hover:bg-accent/20 transition-colors cursor-pointer" data-testid="badge-pending-count">
                {pendingOrders.length} Pending
              </Badge>
            </Link>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : pendingOrders.length === 0 ? (
            <Card className="rounded-[2rem] p-12 text-center border-border/30 bg-gradient-to-br from-background to-background/50 shadow-soft">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Pending Orders</h3>
              <p className="text-sm text-muted-foreground" data-testid="text-no-orders">Orders assigned by admin will appear here</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingOrders.slice(0, 3).map((order) => (
                <Link key={order.id} to={`/launderer/order/${order.id}`}>
                  <Card className="rounded-[2rem] p-5 border-border/30 shadow-soft hover:shadow-medium hover-lift transition-all cursor-pointer bg-gradient-to-br from-background to-background/50" data-testid={`card-order-${order.id}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-xs text-muted-foreground font-medium" data-testid={`text-order-id-${order.id}`}>
                            #{order.id.slice(-8).toUpperCase()}
                          </p>
                          <Badge className="bg-blue-500/15 text-blue-700 border-0 font-medium">
                            {order.status.replace(/_/g, " ")}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-base mb-1" data-testid={`text-customer-${order.id}`}>
                          {order.customerName}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {order.items.map(i => i.serviceName).join(", ")}
                        </p>
                      </div>
                      <div className="text-right ml-3">
                        <p className="font-bold text-primary text-lg" data-testid={`text-amount-${order.id}`}>
                          ₹{order.totalAmount}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/30">
                      <p className="text-xs text-muted-foreground">Pickup: {order.pickupTime}</p>
                      <div className="flex gap-2" onClick={(e) => e.preventDefault()}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl h-8"
                          onClick={(e) => {
                            e.preventDefault();
                            handleRejectOrder(order.id);
                          }}
                          disabled={processingOrders.has(order.id)}
                          data-testid={`button-reject-${order.id}`}
                        >
                          {processingOrders.has(order.id) ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <X className="w-3.5 h-3.5 mr-1" />
                              Reject
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          className="rounded-xl h-8 bg-green-600 hover:bg-green-700"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAcceptOrder(order.id);
                          }}
                          disabled={processingOrders.has(order.id)}
                          data-testid={`button-accept-${order.id}`}
                        >
                          {processingOrders.has(order.id) ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5 mr-1" />
                              Accept
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
              {pendingOrders.length > 3 && (
                <Link to="/launderer/orders">
                  <Button variant="outline" className="w-full rounded-[1.5rem] h-12">
                    View All {pendingOrders.length} Orders
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Recent Completions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">Recently Completed</h2>
            {completedOrders.length > 0 && (
              <Link to="/launderer/orders">
                <Badge className="bg-green-500/15 text-green-700 hover:bg-green-500/20 transition-colors cursor-pointer">
                  {completedOrders.length} Total
                </Badge>
              </Link>
            )}
          </div>
          {completedOrders.length === 0 ? (
            <Card className="rounded-[2rem] p-12 text-center border-border/30 bg-gradient-to-br from-background to-background/50 shadow-soft">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Completed Orders</h3>
              <p className="text-sm text-muted-foreground">Completed orders will appear here</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {completedOrders.slice(0, 3).map((order) => (
                <Link key={order.id} to={`/launderer/order/${order.id}`}>
                  <Card className="rounded-[2rem] p-5 border-border/30 shadow-soft hover:shadow-medium hover-lift transition-all cursor-pointer bg-gradient-to-br from-background to-background/50" data-testid={`card-completed-${order.id}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-[1.25rem] bg-green-500/15 flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="w-7 h-7 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-base">{order.customerName}</h3>
                          {order.rating && order.rating > 0 && (
                            <Badge className="bg-accent/15 text-accent border-0 text-xs">
                              {order.rating} ⭐
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {order.items.map(i => i.serviceName).join(", ")} • {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                        </p>
                      </div>
                      <p className="font-bold text-primary text-lg shrink-0">₹{order.totalAmount}</p>
                    </div>
                  </Card>
                </Link>
              ))}
              {completedOrders.length > 3 && (
                <Link to="/launderer/orders">
                  <Button variant="outline" className="w-full rounded-[1.5rem] h-12">
                    View All {completedOrders.length} Completed Orders
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Business Settings */}
        <Card className="rounded-3xl p-6 gradient-secondary border-0">
          <h3 className="text-white font-semibold mb-2">Upgrade Your Plan</h3>
          <p className="text-white/80 text-sm mb-4">Get more features and grow your business faster</p>
          <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white">
            Learn More
          </Button>
        </Card>
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal open={scannerOpen} onOpenChange={setScannerOpen} />
    </div>
  );
};

export default LaundererDashboard;
