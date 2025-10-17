import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Package, Clock, CheckCircle2, XCircle, Filter, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OrderManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      customer: "John Smith",
      service: "Wash & Fold",
      items: 8,
      status: "pending",
      time: "2 hours ago",
      amount: "₹625",
      priority: "normal"
    },
    {
      id: "ORD-002",
      customer: "Sarah Johnson",
      service: "Dry Clean",
      items: 4,
      status: "in-progress",
      time: "5 hours ago",
      amount: "₹1,080",
      priority: "high"
    },
    {
      id: "ORD-003",
      customer: "Mike Wilson",
      service: "Iron Service",
      items: 6,
      status: "ready",
      time: "1 day ago",
      amount: "₹450",
      priority: "normal"
    },
  ]);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast({
      title: "Status Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-accent/20 text-accent",
      "in-progress": "bg-secondary/20 text-secondary",
      ready: "bg-tertiary/20 text-tertiary",
      completed: "bg-green-500/20 text-green-700",
      cancelled: "bg-destructive/20 text-destructive"
    };
    return <Badge className={styles[status as keyof typeof styles] || ""}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background pb-24">{/* Added pb for bottom nav */}
      {/* Header */}
      <div className="gradient-primary p-6 pb-8 rounded-b-[3rem] mb-6 shadow-medium">
        <div className="flex items-center justify-between mb-6">
          <Link to="/launderer">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">Order Management</h1>
          <Button variant="ghost" size="icon" className="text-white">
            <Filter className="w-6 h-6" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 rounded-3xl bg-white/10 border-white/20 text-white placeholder:text-white/60"
          />
        </div>
      </div>

      <div className="px-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="ready">Ready</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {orders.map((order) => (
              <Card key={order.id} className="rounded-[2rem] p-5 hover-lift border-border/30 shadow-soft">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs text-muted-foreground">{order.id}</p>
                      {order.priority === "high" && (
                        <Badge variant="destructive" className="text-xs">High Priority</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg">{order.customer}</h3>
                    <p className="text-sm text-muted-foreground">{order.service}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary text-lg">{order.amount}</p>
                    <p className="text-xs text-muted-foreground">{order.items} items</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    {getStatusBadge(order.status)}
                    <span className="text-xs text-muted-foreground">{order.time}</span>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="rounded-2xl">
                        Update
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl">
                      <DialogHeader>
                        <DialogTitle>Update Order Status</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Order: {order.id}</p>
                          <p className="font-semibold mb-4">{order.customer}</p>
                          <Select onValueChange={(value) => updateOrderStatus(order.id, value)}>
                            <SelectTrigger className="rounded-2xl">
                              <SelectValue placeholder="Select new status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="ready">Ready for Delivery</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-3">
            {orders.filter(o => o.status === "pending").map((order) => (
              <Card key={order.id} className="rounded-3xl p-5 hover-lift border-border/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{order.id}</p>
                    <h3 className="font-semibold text-lg">{order.customer}</h3>
                    <p className="text-sm text-muted-foreground">{order.service}</p>
                  </div>
                  <p className="font-bold text-primary text-lg">{order.amount}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="hero" onClick={() => updateOrderStatus(order.id, "in-progress")}>
                    Accept
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, "cancelled")}>
                    Decline
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="active" className="space-y-3">
            {orders.filter(o => o.status === "in-progress").length > 0 ? (
              orders.filter(o => o.status === "in-progress").map((order) => (
                <Card key={order.id} className="rounded-3xl p-5 hover-lift border-border/50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{order.id}</p>
                      <h3 className="font-semibold text-lg">{order.customer}</h3>
                      <p className="text-sm text-muted-foreground">{order.service}</p>
                    </div>
                    <p className="font-bold text-primary text-lg">{order.amount}</p>
                  </div>
                  <Button size="sm" variant="hero" className="w-full" onClick={() => updateOrderStatus(order.id, "ready")}>
                    Mark as Ready
                  </Button>
                </Card>
              ))
            ) : (
              <Card className="rounded-3xl p-12 text-center">
                <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Active Orders</h3>
                <p className="text-sm text-muted-foreground">All orders are up to date</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="ready" className="space-y-3">
            {orders.filter(o => o.status === "ready").map((order) => (
              <Card key={order.id} className="rounded-3xl p-5 hover-lift border-border/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{order.id}</p>
                    <h3 className="font-semibold text-lg">{order.customer}</h3>
                    <p className="text-sm text-muted-foreground">{order.service}</p>
                  </div>
                  <p className="font-bold text-primary text-lg">{order.amount}</p>
                </div>
                <Button size="sm" variant="hero" className="w-full" onClick={() => updateOrderStatus(order.id, "completed")}>
                  Confirm Delivery
                </Button>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrderManagement;
