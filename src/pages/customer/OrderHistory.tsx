import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Clock, CheckCircle2, XCircle, Package, Download } from "lucide-react";
import { generateInvoicePDF } from "@/components/InvoiceGenerator";
import { firestoreService } from "@/lib/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useFirebaseOrders } from "@/hooks/useFirebaseOrders";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const OrderHistory = () => {
  const { toast } = useToast();
  const { orders: allOrders, loading } = useFirebaseOrders();

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
    <div className="min-h-screen bg-background">{/* Removed pb for bottom nav */}
      {/* Header */}
      <div className="gradient-primary p-6 pb-10 rounded-b-[3rem] mb-6 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <Link to="/customer">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">Order History</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-6">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-3">
            {loading ? (
              <>
                <Skeleton className="h-32 rounded-[2rem]" />
                <Skeleton className="h-32 rounded-[2rem]" />
              </>
            ) : activeOrders.length > 0 ? (
              activeOrders.map((order) => (
                <Link key={order.id} to={`/customer/order/${order.id}`}>
                  <Card className="rounded-[2rem] p-5 hover-lift cursor-pointer border-border/30 shadow-soft">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">{order.qrCode || order.id}</p>
                        <h3 className="font-semibold text-lg">{order.items.map(i => i.serviceName).join(', ')}</h3>
                        <p className="text-sm text-muted-foreground">{order.laundererName || 'Pending assignment'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary text-lg">₹{order.finalAmount || order.totalAmount}</p>
                        <p className="text-xs text-muted-foreground">{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      {getStatusBadge(order.status)}
                      <span className="text-xs text-muted-foreground">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</span>
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
            {loading ? (
              <>
                <Skeleton className="h-32 rounded-[2rem]" />
                <Skeleton className="h-32 rounded-[2rem]" />
              </>
            ) : completedOrders.length > 0 ? (
              completedOrders.map((order) => (
                <div key={order.id} className="relative">
                  <Link to={`/customer/order/${order.id}`}>
                    <Card className="rounded-[2rem] p-5 hover-lift cursor-pointer border-border/30 shadow-soft">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground mb-1">{order.qrCode || order.id}</p>
                          <h3 className="font-semibold text-lg">{order.items.map(i => i.serviceName).join(', ')}</h3>
                          <p className="text-sm text-muted-foreground">{order.laundererName || 'Assigned'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground text-lg">₹{order.finalAmount || order.totalAmount}</p>
                          <p className="text-xs text-muted-foreground">{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(order.status)}
                          {order.status === "completed" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => handleDownloadInvoice(e, order)}
                              data-testid={`button-download-invoice-${order.id}`}
                            >
                              <Download className="w-4 h-4 text-primary" />
                            </Button>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</span>
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
