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

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { orders, loading: ordersLoading } = useFirebaseOrders();
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
            <SheetContent side="left" className="w-[300px] p-0">
              <div className="flex flex-col h-full bg-background">
                {/* Profile Section */}
                <div className="gradient-primary p-6 rounded-br-3xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-lg">{user?.name || "Guest"}</h2>
                      <p className="text-white/80 text-sm">{user?.email || user?.phone || ""}</p>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                    <p className="text-white/70 text-xs">Total Orders</p>
                    <p className="text-white font-bold text-lg">{ordersLoading ? "..." : orders.length}</p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                  <div className="space-y-1">
                    <Link
                      to="/customer"
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-primary/10 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Home className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-semibold text-foreground">Home</span>
                    </Link>

                    <Link
                      to="/customer/new-order"
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-secondary/10 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                        <Plus className="w-5 h-5 text-secondary" />
                      </div>
                      <span className="font-semibold text-foreground">New Order</span>
                    </Link>

                    <Link
                      to="/customer/orders"
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-accent/10 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <Clock className="w-5 h-5 text-accent" />
                      </div>
                      <span className="font-semibold text-foreground">Order History</span>
                    </Link>

                    <Link
                      to="/customer/offers"
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-tertiary/10 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center group-hover:bg-tertiary/20 transition-colors">
                        <Tag className="w-5 h-5 text-tertiary" />
                      </div>
                      <span className="font-semibold text-foreground">Offers & Deals</span>
                    </Link>

                    <Link
                      to="/customer/payments"
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-muted transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                        <Receipt className="w-5 h-5 text-foreground" />
                      </div>
                      <span className="font-semibold text-foreground">Payment Methods</span>
                    </Link>

                    <Link
                      to="/customer/settings"
                      className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-muted transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                        <SettingsIcon className="w-5 h-5 text-foreground" />
                      </div>
                      <span className="font-semibold text-foreground">Settings</span>
                    </Link>
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
          <Link to="/customer/new-order?coupon=IRON40" data-testid="link-promotion-card">
            <Card className="gradient-accent rounded-[2rem] p-5 border-0 relative overflow-hidden shadow-medium hover-lift cursor-pointer transition-all">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-soft">
                    <Tag className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-base mb-0.5">Get 40% off Ironing</p>
                    <p className="text-white/95 text-sm font-medium">CODE: IRON40</p>
                  </div>
                </div>
                <Button size="sm" className="bg-white/95 text-accent hover:bg-white font-semibold shadow-soft" data-testid="button-book-now-promo">
                  Book Now
                </Button>
              </div>
            </Card>
          </Link>
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
          {ordersLoading ? (
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
                <Link key={order.id} to={`/customer/orders/${order.id}`} data-testid={`card-order-again-${order.id}`} className="block mb-3">
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

        {/* Scheduled Pickups */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">Scheduled Pickups</h2>
            <Link to="/customer/new-order">
              <Button variant="ghost" size="sm" className="text-primary" data-testid="button-view-more-scheduled-pickup">
                View More <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            <Link to="/customer/new-order" data-testid="card-scheduled-pickup-1">
              <Card className="rounded-[2rem] p-5 hover-lift cursor-pointer gradient-accent border-0 shadow-medium">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">Tomorrow, 10:00 AM</h3>
                    <p className="text-white/80 text-sm">Pickup at Home</p>
                    <p className="text-white/70 text-xs mt-1">Wash & Fold • 5 items</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div>
          <h2 className="text-xl font-bold mb-4 tracking-tight">Your Activity</h2>
          <div className="grid grid-cols-2 gap-3">
            <Card className="rounded-[2rem] p-5 border-border/30 shadow-soft hover:shadow-medium transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Receipt className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold tracking-tight">₹24,500</p>
              <p className="text-sm text-muted-foreground mt-1">Total Spent</p>
            </Card>
            <Card className="rounded-[2rem] p-5 border-border/30 shadow-soft hover:shadow-medium transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                <Bell className="w-6 h-6 text-accent" />
              </div>
              <p className="text-2xl font-bold tracking-tight">3</p>
              <p className="text-sm text-muted-foreground mt-1">Notifications</p>
            </Card>
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
