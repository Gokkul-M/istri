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

  const pendingOrders = orders.filter(o => o.status === "confirmed");
  const completedOrders = orders.filter(o => o.status === "completed");
  const totalRevenue = orders
    .filter(o => o.status === "completed")
    .reduce((acc, order) => acc + order.totalAmount, 0);

  const weeklyOrders = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return orders.filter(order => {
      if (!order.createdAt) return false;
      try {
        const orderDate = new Date(order.createdAt as any);
        return !isNaN(orderDate.getTime()) && orderDate >= oneWeekAgo;
      } catch {
        return false;
      }
    }).length;
  }, [orders]);

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
    { label: "Total Orders", value: orders.length.toString(), icon: Package, color: "text-tertiary" },
    { label: "Revenue", value: `₹${(totalRevenue / 1000).toFixed(1)}K`, icon: TrendingUp, color: "text-accent" },
    { label: "Pending", value: pendingOrders.length.toString(), icon: Clock, color: "text-secondary" },
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
            <SheetContent side="left" className="w-[300px] p-0">
              <div className="flex flex-col h-full bg-background">
                {/* Profile Section */}
                <div className="gradient-primary p-6 rounded-br-3xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Briefcase className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-lg">
                        {profile?.businessName || profile?.name || 'My Business'}
                      </h2>
                      <p className="text-white/80 text-sm">Laundry Service</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                      <p className="text-white/70 text-xs">This Week</p>
                      <p className="text-white font-bold text-lg">{weeklyOrders} Orders</p>
                    </div>
                    <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                      <p className="text-white/70 text-xs">Rating</p>
                      <p className="text-white font-bold text-lg">
                        {averageRating !== '0' ? `${averageRating} ⭐` : 'No ratings'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                  <div className="space-y-1">
                    <Link
                      to="/launderer"
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-primary/10 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Home className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-semibold text-foreground">Dashboard</span>
                    </Link>

                    <Link
                      to="/launderer/orders"
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-secondary/10 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                        <Package className="w-5 h-5 text-secondary" />
                      </div>
                      <span className="font-semibold text-foreground">Order Management</span>
                    </Link>

                    <Link
                      to="/launderer/revenue"
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-accent/10 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <TrendingUp className="w-5 h-5 text-accent" />
                      </div>
                      <span className="font-semibold text-foreground">Revenue & Earnings</span>
                    </Link>

                    <Link
                      to="/launderer/services"
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-tertiary/10 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center group-hover:bg-tertiary/20 transition-colors">
                        <Settings className="w-5 h-5 text-tertiary" />
                      </div>
                      <span className="font-semibold text-foreground">Services Setup</span>
                    </Link>

                    <Link
                      to="/launderer/profile"
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-muted transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                        <User className="w-5 h-5 text-foreground" />
                      </div>
                      <span className="font-semibold text-foreground">Business Profile</span>
                    </Link>

                    <Link
                      to="/launderer/settings"
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-muted transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                        <Settings className="w-5 h-5 text-foreground" />
                      </div>
                      <span className="font-semibold text-foreground">Settings</span>
                    </Link>
                  </div>
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-border">
                  <button 
                    onClick={async () => {
                      await signOut();
                      navigate('/login');
                    }}
                    className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-red-500/10 transition-all w-full group"
                    data-testid="button-logout"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                      <LogOut className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="font-semibold text-red-500">Logout</span>
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

        {/* Pending Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Assigned Orders</h2>
            <Badge className="bg-accent/20 text-accent" data-testid="badge-pending-count">
              {pendingOrders.length} Active
            </Badge>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : pendingOrders.length === 0 ? (
            <Card className="rounded-3xl p-8 text-center border-border/50">
              <Package className="w-12 h-12 mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground" data-testid="text-no-orders">No pending orders</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <Card key={order.id} className="rounded-3xl p-5 border-border/50" data-testid={`card-order-${order.id}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1" data-testid={`text-order-id-${order.id}`}>
                        {order.id}
                      </p>
                      <h3 className="font-semibold text-lg" data-testid={`text-customer-${order.id}`}>
                        {order.customerName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {order.items.map(i => i.serviceName).join(", ")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary text-lg" data-testid={`text-amount-${order.id}`}>
                        ₹{order.totalAmount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <Badge className="bg-blue-500/20 text-blue-700 dark:text-blue-400">
                      {order.status.replace(/_/g, " ")}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => handleRejectOrder(order.id)}
                        disabled={processingOrders.has(order.id)}
                        data-testid={`button-reject-${order.id}`}
                      >
                        {processingOrders.has(order.id) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        className="rounded-xl bg-green-600 hover:bg-green-700"
                        onClick={() => handleAcceptOrder(order.id)}
                        disabled={processingOrders.has(order.id)}
                        data-testid={`button-accept-${order.id}`}
                      >
                        {processingOrders.has(order.id) ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Completions */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recently Completed</h2>
          {completedOrders.length === 0 ? (
            <Card className="rounded-3xl p-5 border-border/50 text-center">
              <p className="text-muted-foreground">No completed orders yet</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {completedOrders.slice(0, 3).map((order) => (
                <Card key={order.id} className="rounded-3xl p-5 border-border/50" data-testid={`card-completed-${order.id}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{order.customerName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.items.map(i => i.serviceName).join(", ")} • {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                      </p>
                    </div>
                    <p className="font-bold">₹{order.totalAmount}</p>
                  </div>
                </Card>
              ))}
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
