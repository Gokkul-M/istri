import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
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
import { Package, User, MapPin, Clock, Loader2 } from "lucide-react";
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
      pending: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
      confirmed: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
      picked_up: "bg-purple-500/20 text-purple-700 dark:text-purple-400",
      in_progress: "bg-orange-500/20 text-orange-700 dark:text-orange-400",
      ready: "bg-cyan-500/20 text-cyan-700 dark:text-cyan-400",
      out_for_delivery: "bg-indigo-500/20 text-indigo-700 dark:text-indigo-400",
      completed: "bg-green-500/20 text-green-700 dark:text-green-400",
      cancelled: "bg-red-500/20 text-red-700 dark:text-red-400",
    };
    return colors[status] || colors.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Order Management</h1>
          <p className="text-muted-foreground" data-testid="text-page-description">
            Assign launderers to pending orders
          </p>
        </div>
        <div className="flex gap-2">
          <Card className="px-4 py-2">
            <div className="text-sm text-muted-foreground">Pending Orders</div>
            <div className="text-2xl font-bold" data-testid="text-pending-count">{pendingOrders.length}</div>
          </Card>
          <Card className="px-4 py-2">
            <div className="text-sm text-muted-foreground">Total Orders</div>
            <div className="text-2xl font-bold" data-testid="text-total-count">{orders.length}</div>
          </Card>
        </div>
      </div>

      {pendingOrders.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2" data-testid="text-no-pending">No Pending Orders</h3>
          <p className="text-muted-foreground" data-testid="text-no-pending-description">
            All orders have been assigned to launderers
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingOrders.map((order) => (
            <Card key={order.id} className="p-6" data-testid={`card-order-${order.id}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold" data-testid={`text-order-id-${order.id}`}>
                      Order #{order.id}
                    </h3>
                    <Badge className={getStatusColor(order.status)} data-testid={`badge-status-${order.id}`}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span data-testid={`text-customer-${order.id}`}>{order.customerName}</span>
                      <span>•</span>
                      <span>{order.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span data-testid={`text-address-${order.id}`}>{order.customerAddress}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span data-testid={`text-pickup-${order.id}`}>
                        Pickup: {new Date(order.pickupTime).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary" data-testid={`text-amount-${order.id}`}>
                    ₹{order.totalAmount}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Assign Launderer:</label>
                  <Select
                    onValueChange={(value) => handleAssignLaunderer(order.id, value)}
                    disabled={assigningOrders.has(order.id)}
                    data-testid={`select-launderer-${order.id}`}
                  >
                    <SelectTrigger className="w-[300px]">
                      <SelectValue placeholder="Select a launderer" />
                    </SelectTrigger>
                    <SelectContent>
                      {launderers.map((launderer) => (
                        <SelectItem
                          key={launderer.id}
                          value={launderer.id}
                          data-testid={`option-launderer-${launderer.id}`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <span>{launderer.businessName || launderer.name}</span>
                            {launderer.rating && (
                              <span className="text-xs text-muted-foreground">
                                ⭐ {launderer.rating}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {assigningOrders.has(order.id) && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                </div>
              </div>

              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Order Items:</h4>
                <div className="space-y-1">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm"
                      data-testid={`item-${order.id}-${idx}`}
                    >
                      <span>
                        {item.serviceName} x {item.quantity}
                      </span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">All Orders</h2>
        <div className="space-y-4">
          {orders.filter(o => o.status !== "pending" || o.laundererId).map((order) => (
            <Card key={order.id} className="p-6" data-testid={`card-assigned-${order.id}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{order.customerName}</span>
                    </div>
                    {order.laundererName && (
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>Launderer: {order.laundererName}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">₹{order.totalAmount}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderManagement;
