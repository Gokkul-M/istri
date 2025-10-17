import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFirebaseOrders } from "@/hooks/useFirebaseOrders";
import { useFirebaseUsers } from "@/hooks/useFirebaseUsers";
import { toast } from "@/hooks/use-toast";
import { Package, User, MapPin, Clock, Loader2, Star, Phone, Calendar, ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Order } from "@/store/useStore";

const AdminOrderManagement = () => {
  const { users, loading: usersLoading } = useFirebaseUsers();
  const { orders, loading: ordersLoading, updateOrder } = useFirebaseOrders();
  const [assigningOrders, setAssigningOrders] = useState<Set<string>>(new Set());

  const loading = usersLoading || ordersLoading;
  const launderers = users.filter((u) => u.role === "launderer");
  const pendingOrders = orders.filter((o) => o.status === "pending" && !o.laundererId);

  const handleAssignLaunderer = async (orderId: string, laundererId: string) => {
    const launderer = launderers.find((l) => l.id === laundererId);
    if (!launderer) return;

    setAssigningOrders((prev) => new Set(prev).add(orderId));

    try {
      await updateOrder(orderId, {
        laundererId,
        laundererName: launderer.businessName || launderer.name,
        laundererPhone: launderer.phone,
        status: "confirmed",
      });

      toast({
        title: "Order Assigned",
        description: `Order assigned to ${launderer.businessName || launderer.name}`,
      });
    } catch (error) {
      console.error("Error assigning launderer:", error);
      toast({
        title: "Error",
        description: "Failed to assign launderer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAssigningOrders((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    const colors = {
      pending: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
      confirmed: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
      picked_up: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
      in_progress: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
      ready: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
      out_for_delivery: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
      completed: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
      cancelled: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
    };
    return colors[status] || colors.pending;
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4 pb-20">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-24 rounded-[1.5rem]" />
          <Skeleton className="h-24 rounded-[1.5rem]" />
        </div>
        <Skeleton className="h-48 rounded-[1.5rem]" />
        <Skeleton className="h-48 rounded-[1.5rem]" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent tracking-tight">
          Order Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
          Assign launderers to pending orders
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-none shadow-soft rounded-[1.5rem]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-2 rounded-lg">
                <Clock className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending Orders</p>
                <h3 className="text-xl font-bold">{pendingOrders.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft rounded-[1.5rem]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Package className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Orders</p>
                <h3 className="text-xl font-bold">{orders.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Orders Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3 tracking-tight">Pending Orders</h2>
        {pendingOrders.length === 0 ? (
          <Card className="border-none shadow-medium rounded-[1.5rem] p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Pending Orders</h3>
            <p className="text-muted-foreground">All orders have been assigned to launderers</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingOrders.map((order) => (
              <Card key={order.id} className="border-none shadow-medium rounded-[1.5rem]" data-testid={`card-order-${order.id}`}>
                <CardContent className="p-4">
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-base font-bold" data-testid={`text-order-id-${order.id}`}>
                          Order #{order.id.slice(-6)}
                        </h3>
                        <Badge className={getStatusColor(order.status)} data-testid={`badge-status-${order.id}`}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary" data-testid={`text-amount-${order.id}`}>
                        ₹{order.totalAmount}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                      </p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="bg-muted/30 rounded-xl p-3 mb-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-primary" />
                      <span className="font-medium" data-testid={`text-customer-${order.id}`}>{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{order.customerPhone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                      <span className="line-clamp-2" data-testid={`text-address-${order.id}`}>{order.customerAddress}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span data-testid={`text-pickup-${order.id}`}>
                        {new Date(order.pickupTime).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3" />
                      Order Items:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-muted/50 rounded-lg p-2"
                          data-testid={`item-${order.id}-${idx}`}
                        >
                          <span className="text-xs">{item.serviceName} x{item.quantity}</span>
                          <span className="text-xs font-semibold text-primary">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assign Launderer */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium shrink-0">Assign to:</label>
                    <Select
                      onValueChange={(value) => handleAssignLaunderer(order.id, value)}
                      disabled={assigningOrders.has(order.id)}
                      data-testid={`select-launderer-${order.id}`}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select launderer" />
                      </SelectTrigger>
                      <SelectContent>
                        {launderers.map((launderer) => (
                          <SelectItem
                            key={launderer.id}
                            value={launderer.id}
                            data-testid={`option-launderer-${launderer.id}`}
                          >
                            <div className="flex items-center justify-between gap-3 w-full">
                              <span>{launderer.businessName || launderer.name}</span>
                              {launderer.rating && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  {launderer.rating}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {assigningOrders.has(order.id) && (
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* All Orders Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3 tracking-tight">All Orders</h2>
        <div className="space-y-3">
          {orders.filter(o => o.status !== "pending" || o.laundererId).map((order) => (
            <Card key={order.id} className="border-none shadow-medium rounded-[1.5rem]" data-testid={`card-assigned-${order.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-bold">Order #{order.id.slice(-6)}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-3.5 h-3.5" />
                        <span>{order.customerName}</span>
                      </div>
                      {order.laundererName && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Package className="w-3.5 h-3.5" />
                          <span>{order.laundererName}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">₹{order.totalAmount}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderManagement;
