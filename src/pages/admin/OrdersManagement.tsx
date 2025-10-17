import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Package, Clock, CheckCircle, XCircle, Eye, UserCheck, Loader2 } from "lucide-react";
import { useFirebaseOrders } from "@/hooks/useFirebaseOrders";
import { useFirebaseUsers } from "@/hooks/useFirebaseUsers";
import { OrderStatus } from "@/store/useStore";
import { OrderStatusTimeline } from "@/components/OrderStatusTimeline";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const OrdersManagement = () => {
  const { orders, loading: ordersLoading, updateOrder } = useFirebaseOrders();
  const { users, loading: usersLoading } = useFirebaseUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedLaundererId, setSelectedLaundererId] = useState<string>("");
  
  const loading = ordersLoading || usersLoading;
  // Get all verified launderers
  const launderers = users.filter(u => u.role === 'launderer' && u.verified);
  
  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      pending: { color: "bg-accent text-accent-foreground", label: "Pending" },
      confirmed: { color: "bg-secondary text-secondary-foreground", label: "Confirmed" },
      picked_up: { color: "bg-secondary text-secondary-foreground", label: "Picked Up" },
      in_progress: { color: "bg-secondary text-secondary-foreground", label: "In Progress" },
      ready: { color: "bg-tertiary text-tertiary-foreground", label: "Ready" },
      out_for_delivery: { color: "bg-primary text-primary-foreground", label: "Delivering" },
      completed: { color: "bg-tertiary text-tertiary-foreground", label: "Completed" },
      cancelled: { color: "bg-destructive text-destructive-foreground", label: "Cancelled" },
    };

    const config = statusConfig[status];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => ['confirmed', 'picked_up', 'in_progress', 'ready', 'out_for_delivery'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  const selectedOrderData = orders.find(o => o.id === selectedOrder);
  
  const handleAssignLaunderer = async () => {
    if (!selectedLaundererId || !selectedOrder) {
      toast({
        title: "Error",
        description: "Please select a launderer",
        variant: "destructive",
      });
      return;
    }
    
    const launderer = launderers.find(l => l.id === selectedLaundererId);
    if (!launderer) return;

    try {
      await updateOrder(selectedOrder, {
        laundererId: selectedLaundererId,
        laundererName: launderer.businessName || launderer.name,
        laundererPhone: launderer.phone,
        status: "confirmed" as OrderStatus,
      });

      toast({
        title: "Success",
        description: "Launderer assigned successfully",
      });
      setSelectedLaundererId("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign launderer",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20 p-4 space-y-6 pb-24">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent tracking-tight">Orders Management</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">Track and manage all customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-none shadow-soft hover-lift bg-gradient-to-br from-primary/5 to-primary/10 rounded-[1.5rem]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-primary p-3 rounded-2xl shadow-md">
                <Package className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Total Orders</p>
                <h3 className="text-2xl font-bold text-primary">{stats.total}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft hover-lift bg-gradient-to-br from-accent/5 to-accent/10 rounded-[1.5rem]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-accent p-3 rounded-[1.25rem] shadow-medium">
                <Clock className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Pending</p>
                <h3 className="text-2xl font-bold text-accent">{stats.pending}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft hover-lift bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-[1.5rem]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-secondary p-3 rounded-[1.25rem] shadow-medium">
                <Package className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Active</p>
                <h3 className="text-2xl font-bold text-secondary">{stats.inProgress}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft hover-lift bg-gradient-to-br from-tertiary/5 to-tertiary/10 rounded-[1.5rem]">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="bg-tertiary p-3 rounded-2xl shadow-md">
                <CheckCircle className="w-5 h-5 text-tertiary-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Completed</p>
                <h3 className="text-2xl font-bold text-tertiary">{stats.completed}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-medium card-glass rounded-[1.5rem]">
        <CardContent className="p-5 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by order ID or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-[1.25rem] border-2 focus:border-primary"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-12 rounded-[1.25rem] border-2">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="rounded-[1.25rem]">
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card className="border-none shadow-medium rounded-[1.5rem]">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2 tracking-tight">No orders found</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="border-none shadow-medium hover-lift overflow-hidden rounded-[1.5rem]">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-lg">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground font-mono">#{order.id.slice(0, 8)}</p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
                
                <div className="space-y-3 mb-4 bg-muted/30 rounded-xl p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Amount</span>
                    <span className="font-bold text-primary">₹{order.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Items</span>
                    <span className="font-semibold">{order.items.length} services</span>
                  </div>
                  {order.laundererName ? (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Launderer</span>
                      <span className="font-semibold text-secondary">{order.laundererName}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center text-sm py-2 bg-accent/10 rounded-lg">
                      <span className="text-accent font-medium">⚠ No launderer assigned</span>
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full rounded-[1.25rem] h-11 font-semibold" 
                  onClick={() => setSelectedOrder(order.id)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-primary bg-clip-text text-transparent">Order Details</DialogTitle>
            <DialogDescription>
              Complete information about order #{selectedOrderData?.id.slice(0, 8)}
            </DialogDescription>
          </DialogHeader>
          {selectedOrderData && (
            <div className="space-y-6 pt-2">
              {/* Assign Launderer Section - Only show for pending orders */}
              {selectedOrderData.status === 'pending' && !selectedOrderData.laundererId && (
                <div className="bg-gradient-to-r from-accent/10 to-accent/5 p-5 rounded-2xl border-2 border-accent/20">
                  <h4 className="font-bold mb-3 flex items-center gap-2 text-accent">
                    <UserCheck className="w-5 h-5" />
                    Assign Launderer
                  </h4>
                  <div className="flex gap-3">
                    <Select value={selectedLaundererId} onValueChange={setSelectedLaundererId}>
                      <SelectTrigger className="flex-1 h-11 rounded-xl">
                        <SelectValue placeholder="Select a launderer" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {launderers.length === 0 ? (
                          <div className="p-4 text-center text-sm text-muted-foreground">
                            No verified launderers available
                          </div>
                        ) : (
                          launderers.map((launderer) => (
                            <SelectItem key={launderer.id} value={launderer.id}>
                              {launderer.businessName || launderer.name} - {launderer.rating ? `⭐ ${launderer.rating}` : 'New'}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={handleAssignLaunderer}
                      disabled={!selectedLaundererId}
                      className="rounded-xl px-6 h-11 font-semibold glow-button"
                    >
                      Assign
                    </Button>
                  </div>
                </div>
              )}

              <div className="bg-muted/30 p-5 rounded-2xl">
                <h4 className="font-bold mb-3 text-lg">Order Status</h4>
                <OrderStatusTimeline currentStatus={selectedOrderData.status} />
              </div>

              <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-5 rounded-2xl">
                <h4 className="font-bold mb-3 text-lg text-primary">Customer Info</h4>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="text-muted-foreground font-medium">Name:</span> 
                    <span className="font-semibold">{selectedOrderData.customerName}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-muted-foreground font-medium">Phone:</span> 
                    <span className="font-semibold">{selectedOrderData.customerPhone}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-muted-foreground font-medium">Address:</span> 
                    <span className="font-semibold text-right max-w-[60%]">{selectedOrderData.customerAddress}</span>
                  </p>
                </div>
              </div>

              {selectedOrderData.laundererName && (
                <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 p-5 rounded-2xl">
                  <h4 className="font-bold mb-3 text-lg text-secondary">Launderer Info</h4>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-muted-foreground font-medium">Name:</span> 
                      <span className="font-semibold">{selectedOrderData.laundererName}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-muted-foreground font-medium">Phone:</span> 
                      <span className="font-semibold">{selectedOrderData.laundererPhone}</span>
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-muted/30 p-5 rounded-2xl">
                <h4 className="font-bold mb-3 text-lg">Services</h4>
                <div className="space-y-3">
                  {selectedOrderData.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm bg-background p-3 rounded-xl shadow-sm">
                      <span className="font-medium">{item.serviceName} <span className="text-muted-foreground">x{item.quantity}</span></span>
                      <span className="font-bold text-primary">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-lg pt-3 border-t-2">
                    <span>Total Amount</span>
                    <span className="text-primary">₹{selectedOrderData.totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-tertiary/5 to-tertiary/10 p-5 rounded-2xl">
                <h4 className="font-bold mb-3 text-lg text-tertiary">Timeline</h4>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="text-muted-foreground font-medium">Pickup:</span> 
                    <span className="font-semibold">{new Date(selectedOrderData.pickupTime).toLocaleString()}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-muted-foreground font-medium">Delivery:</span> 
                    <span className="font-semibold">{new Date(selectedOrderData.deliveryTime).toLocaleString()}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersManagement;
