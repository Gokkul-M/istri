import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Package, 
  Clock, 
  Search, 
  User,
  MapPin,
  ChevronRight,
  Calendar
} from "lucide-react";
import { useFirebaseOrders } from "@/hooks/useFirebaseOrders";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import type { Order } from "@/store/useStore";

const OrderManagement = () => {
  const navigate = useNavigate();
  const { currentUser } = useStore();
  const { orders, loading } = useFirebaseOrders();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter orders assigned to this launderer
  const laundererOrders = orders.filter(order => order.laundererId === currentUser?.id);

  // Filter by search query
  const filteredOrders = laundererOrders.filter(order => 
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group orders by status
  const pendingOrders = filteredOrders.filter(o => o.status === "pending" || o.status === "confirmed");
  const activeOrders = filteredOrders.filter(o => 
    o.status === "picked_up" || o.status === "in_progress"
  );
  const readyOrders = filteredOrders.filter(o => 
    o.status === "ready" || o.status === "out_for_delivery"
  );
  const completedOrders = filteredOrders.filter(o => o.status === "completed");

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: "bg-yellow-500/15", text: "text-yellow-700", label: "Pending" },
      confirmed: { bg: "bg-blue-500/15", text: "text-blue-700", label: "Confirmed" },
      picked_up: { bg: "bg-purple-500/15", text: "text-purple-700", label: "Picked Up" },
      in_progress: { bg: "bg-orange-500/15", text: "text-orange-700", label: "In Progress" },
      ready: { bg: "bg-cyan-500/15", text: "text-cyan-700", label: "Ready" },
      out_for_delivery: { bg: "bg-indigo-500/15", text: "text-indigo-700", label: "Out for Delivery" },
      completed: { bg: "bg-green-500/15", text: "text-green-700", label: "Completed" },
      cancelled: { bg: "bg-red-500/15", text: "text-red-700", label: "Cancelled" },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    return (
      <Badge className={`${badge.bg} ${badge.text} border-0 font-medium`}>
        {badge.label}
      </Badge>
    );
  };

  const OrderCard = ({ order }: { order: Order }) => {
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => navigate(`/launderer/order/${order.id}`)}
      >
        <Card className="rounded-[2rem] p-5 hover-lift cursor-pointer border-border/30 shadow-soft hover:shadow-medium transition-all bg-gradient-to-br from-background to-background/50">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs text-muted-foreground font-medium">#{order.id.slice(-8).toUpperCase()}</p>
                {getStatusBadge(order.status)}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-base">{order.customerName}</h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <p className="line-clamp-1">{order.customerAddress}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 ml-2" />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/30">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Package className="w-4 h-4" />
                <span className="font-medium">{totalItems} items</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
            <p className="font-bold text-primary text-lg">₹{order.finalAmount || order.totalAmount}</p>
          </div>

          {/* Pickup/Delivery Info */}
          <div className="mt-3 pt-3 border-t border-border/30 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-accent" />
              <span>Pickup: {order.pickupTime}</span>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  const EmptyState = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <Card className="rounded-[2rem] p-12 text-center border-border/30 bg-gradient-to-br from-background to-background/50 shadow-soft">
      <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-10 h-10 text-muted-foreground opacity-50" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-primary rounded-b-[3rem] p-6 pb-10 mb-6 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <Link to="/launderer">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">My Orders</h1>
          <div className="w-10" />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
          <Input
            placeholder="Search by customer or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-[1.5rem] bg-white/15 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40 transition-all"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-[1.25rem] p-3 text-center">
            <p className="text-2xl font-bold text-white">{pendingOrders.length}</p>
            <p className="text-xs text-white/80 mt-1">Pending</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-[1.25rem] p-3 text-center">
            <p className="text-2xl font-bold text-white">{activeOrders.length}</p>
            <p className="text-xs text-white/80 mt-1">Active</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-[1.25rem] p-3 text-center">
            <p className="text-2xl font-bold text-white">{readyOrders.length}</p>
            <p className="text-xs text-white/80 mt-1">Ready</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-[1.25rem] p-3 text-center">
            <p className="text-2xl font-bold text-white">{completedOrders.length}</p>
            <p className="text-xs text-white/80 mt-1">Done</p>
          </div>
        </div>
      </div>

      <div className="px-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 rounded-[1.5rem] bg-muted p-1">
            <TabsTrigger value="all" className="rounded-xl">All</TabsTrigger>
            <TabsTrigger value="pending" className="rounded-xl">Pending</TabsTrigger>
            <TabsTrigger value="active" className="rounded-xl">Active</TabsTrigger>
            <TabsTrigger value="ready" className="rounded-xl">Ready</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-40 rounded-[2rem]" />
                <Skeleton className="h-40 rounded-[2rem]" />
                <Skeleton className="h-40 rounded-[2rem]" />
              </div>
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : laundererOrders.length === 0 ? (
              <EmptyState 
                icon={Package}
                title="No Orders Yet"
                description="Orders assigned to you by the admin will appear here."
              />
            ) : (
              <EmptyState 
                icon={Search}
                title="No Results Found"
                description="Try searching with a different customer name or order ID."
              />
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-40 rounded-[2rem]" />
                <Skeleton className="h-40 rounded-[2rem]" />
              </div>
            ) : pendingOrders.length > 0 ? (
              pendingOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <EmptyState 
                icon={Clock}
                title="No Pending Orders"
                description="New orders waiting for action will appear here."
              />
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-40 rounded-[2rem]" />
                <Skeleton className="h-40 rounded-[2rem]" />
              </div>
            ) : activeOrders.length > 0 ? (
              activeOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <EmptyState 
                icon={Package}
                title="No Active Orders"
                description="Orders currently being processed will appear here."
              />
            )}
          </TabsContent>

          <TabsContent value="ready" className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-40 rounded-[2rem]" />
                <Skeleton className="h-40 rounded-[2rem]" />
              </div>
            ) : readyOrders.length > 0 ? (
              readyOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <EmptyState 
                icon={Package}
                title="No Ready Orders"
                description="Orders ready for delivery will appear here."
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrderManagement;
