import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock, CheckCircle2, XCircle, Package, Download } from "lucide-react";
import { generateInvoicePDF } from "@/components/InvoiceGenerator";
import { firestoreService } from "@/lib/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useFirebaseOrders } from "@/hooks/useFirebaseOrders";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { IndexMissingError } from "@/components/IndexMissingError";

const OrderHistory = () => {
  const { toast } = useToast();
  const { orders: allOrders, loading, error } = useFirebaseOrders();

  const completedOrders = allOrders.filter(order => order.status === "completed" || order.status === "cancelled");
  const activeOrders = allOrders.filter(order => 
    order.status !== "completed" && order.status !== "cancelled"
  );

  const handleDownloadInvoice = async (e: React.MouseEvent, order: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const filename = generateInvoicePDF({ order });

      try {
        await firestoreService.trackInvoiceGeneration(order.id);
      } catch (error) {
        console.log('Could not track invoice generation');
      }

      toast({
        title: "Invoice Downloaded",
        description: `${filename} has been saved to your device.`,
      });
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to generate invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-700"><CheckCircle2 className="w-3 h-3 mr-1" />Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-destructive/20 text-destructive"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      case "in-progress":
        return <Badge className="bg-secondary/20 text-secondary"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">{/* Added pb for bottom spacing */}
      {/* Header */}
      <div className="gradient-primary p-6 pb-12 rounded-b-[3rem] mb-6 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <Link to="/customer">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 transition-all">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white tracking-tight">Order History</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-6 pb-6">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12 rounded-[1.5rem] p-1 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger value="active" className="rounded-[1.25rem] data-[state=active]:bg-background data-[state=active]:shadow-sm">Active</TabsTrigger>
            <TabsTrigger value="history" className="rounded-[1.25rem] data-[state=active]:bg-background data-[state=active]:shadow-sm">History</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-3">
            {error && (error as any).code === 'failed-precondition' ? (
              <IndexMissingError message="Your orders require a database index to be created. Please create the required index for the 'orders' collection." />
            ) : loading ? (
              <>
                <Skeleton className="h-32 rounded-[2rem]" />
                <Skeleton className="h-32 rounded-[2rem]" />
              </>
            ) : activeOrders.length > 0 ? (
              activeOrders.map((order) => (
                <Link key={order.id} to={`/customer/order/${order.id}`}>
                  <Card className="rounded-[2rem] p-6 hover-lift cursor-pointer border-border/30 shadow-soft hover:shadow-medium transition-all duration-300 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1.5 font-medium">Order #{order.qrCode || order.id.slice(-6)}</p>
                        <h3 className="font-semibold text-lg mb-1">{order.items.map(i => i.serviceName).join(', ')}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                          {order.laundererName || 'Pending assignment'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary text-xl mb-1">₹{order.finalAmount || order.totalAmount}</p>
                        <p className="text-xs text-muted-foreground font-medium">{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex items-center justify-between">
                      {getStatusBadge(order.status)}
                      <span className="text-xs text-muted-foreground font-medium">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="rounded-[2rem] p-12 text-center shadow-soft border-border/30">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Active Orders</h3>
                <p className="text-sm text-muted-foreground mb-4">You don't have any active orders at the moment</p>
                <Link to="/customer/new-order">
                  <Button variant="hero">Create New Order</Button>
                </Link>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-3">
            {error && (error as any).code === 'failed-precondition' ? (
              <IndexMissingError message="Your orders require a database index to be created. Please create the required index for the 'orders' collection." />
            ) : loading ? (
              <>
                <Skeleton className="h-32 rounded-[2rem]" />
                <Skeleton className="h-32 rounded-[2rem]" />
              </>
            ) : completedOrders.length > 0 ? (
              completedOrders.map((order) => (
                <div key={order.id} className="relative">
                  <Link to={`/customer/order/${order.id}`}>
                    <Card className="rounded-[2rem] p-6 hover-lift cursor-pointer border-border/30 shadow-soft hover:shadow-medium transition-all duration-300 bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1.5 font-medium">Order #{order.qrCode || order.id.slice(-6)}</p>
                          <h3 className="font-semibold text-lg mb-1">{order.items.map(i => i.serviceName).join(', ')}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></span>
                            {order.laundererName || 'Assigned'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground text-xl mb-1">₹{order.finalAmount || order.totalAmount}</p>
                          <p className="text-xs text-muted-foreground font-medium">{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                        </div>
                      </div>
                      <Separator className="my-3" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(order.status)}
                          {order.status === "completed" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-xl hover:bg-primary/10"
                              onClick={(e) => handleDownloadInvoice(e, order)}
                              data-testid={`button-download-invoice-${order.id}`}
                            >
                              <Download className="w-4 h-4 text-primary" />
                            </Button>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</span>
                      </div>
                    </Card>
                  </Link>
                </div>
              ))
            ) : (
              <Card className="rounded-[2rem] p-12 text-center shadow-soft border-border/30">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Order History</h3>
                <p className="text-sm text-muted-foreground">Your completed orders will appear here</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrderHistory;
