import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Star,
  MessageSquare,
  QrCode,
  Phone,
  Package,
  Clock,
  AlertCircle,
  User,
  CheckCircle2,
} from "lucide-react";
import { QRCodeModal } from "@/components/QRCodeModal";
import { useToast } from "@/hooks/use-toast";
import { useFirebaseOrder } from "@/hooks/useFirebaseOrder";
import { useFirebaseDisputes } from "@/hooks/useFirebaseDisputes";
import { firestoreService } from "@/lib/firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import type { OrderStatus } from "@/store/useStore";

const LaundererOrderDetails = () => {
  const { orderId } = useParams();
  const { toast } = useToast();
  const { order, loading, error } = useFirebaseOrder(orderId);
  const { disputes } = useFirebaseDisputes();

  const [showQR, setShowQR] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const orderDisputes = disputes.filter((d) => d.orderId === orderId);

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    if (!order || !orderId) return;

    setUpdatingStatus(true);
    try {
      await firestoreService.updateOrder(orderId, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: "Status Updated",
        description: `Order status updated to ${newStatus.replace("_", " ")}`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
      confirmed: "bg-blue-500/20 text-blue-700 border-blue-500/30",
      picked_up: "bg-purple-500/20 text-purple-700 border-purple-500/30",
      in_progress: "bg-orange-500/20 text-orange-700 border-orange-500/30",
      ready: "bg-cyan-500/20 text-cyan-700 border-cyan-500/30",
      out_for_delivery: "bg-indigo-500/20 text-indigo-700 border-indigo-500/30",
      completed: "bg-green-500/20 text-green-700 border-green-500/30",
      cancelled: "bg-red-500/20 text-red-700 border-red-500/30",
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const getNextStatus = (): OrderStatus | null => {
    if (!order) return null;

    const statusFlow: Record<OrderStatus, OrderStatus | null> = {
      pending: "confirmed",
      confirmed: "picked_up",
      picked_up: "in_progress",
      in_progress: "ready",
      ready: "out_for_delivery",
      out_for_delivery: "completed",
      completed: null,
      cancelled: null,
    };

    return statusFlow[order.status];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="gradient-primary p-6 pb-8 rounded-b-[3rem] mb-6 shadow-medium">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-32 h-6" />
            <div className="w-10" />
          </div>
          <Skeleton className="w-40 h-8 mx-auto mt-4" />
        </div>
        <div className="px-6 space-y-4">
          <Skeleton className="h-48 rounded-[2rem]" />
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="gradient-primary p-6 pb-8 rounded-b-[3rem] mb-6 shadow-medium">
          <div className="flex items-center justify-between mb-4">
            <Link to="/launderer/orders">
              <Button variant="ghost" size="icon" className="text-white">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-white">Order Details</h1>
            <div className="w-10" />
          </div>
        </div>
        <div className="px-6">
          <Card className="rounded-[2rem] p-8 text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Order Not Found</h3>
            <p className="text-muted-foreground mb-6">
              {error || "This order could not be found."}
            </p>
            <Link to="/launderer/orders">
              <Button variant="hero">Go to Orders</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const nextStatus = getNextStatus();
  const hasRating = order.rating !== undefined && order.rating > 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-primary p-6 pb-8 rounded-b-[3rem] mb-6 shadow-medium">
        <div className="flex items-center justify-between mb-4">
          <Link to="/launderer/orders">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">Order Details</h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => setShowQR(true)}
          >
            <QrCode className="w-6 h-6" />
          </Button>
        </div>

        <div className="text-center mt-4">
          <p className="text-white/80 text-sm mb-2">Order ID</p>
          <p className="text-white text-2xl font-bold">{order.id}</p>
        </div>
      </div>

      <div className="px-6 space-y-4">
        {/* Status Card */}
        <Card className="rounded-[2rem] p-6 shadow-soft border-border/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Current Status</h3>
            <Badge className={`${getStatusBadge(order.status)} text-sm px-4 py-1 border`}>
              {order.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>

          {nextStatus && order.status !== "completed" && order.status !== "cancelled" && (
            <div className="mt-4">
              <Select
                value={order.status}
                onValueChange={(value) => handleUpdateStatus(value as OrderStatus)}
                disabled={updatingStatus}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Update status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="picked_up">Picked Up</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="ready">Ready for Delivery</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {order.status === "completed" && (
            <div className="mt-4 flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-5 h-5" />
              <p className="font-medium">Order Completed</p>
            </div>
          )}
        </Card>

        {/* Customer Information */}
        <Card className="rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h3 className="font-bold">Customer Information</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-semibold">{order.customerName}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-semibold">{order.customerPhone}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Pickup Address</p>
              <p className="font-medium">{order.customerAddress}</p>
            </div>
          </div>
        </Card>

        {/* Order Details */}
        <Card className="rounded-3xl p-6">
          <h3 className="font-bold mb-4">Order Schedule</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl gradient-accent flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pickup Time</p>
                <p className="font-semibold">{order.pickupTime}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivery Time</p>
                <p className="font-semibold">{order.deliveryTime}</p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Order Date</p>
              <p className="font-medium">
                {format(new Date(order.createdAt), "MMM dd, yyyy 'at' hh:mm a")}
              </p>
            </div>
          </div>
        </Card>

        {/* Items */}
        <Card className="rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-primary" />
            <h3 className="font-bold">Items ({order.items.length})</h3>
          </div>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.serviceName}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">₹{item.price}</p>
              </div>
            ))}
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">Subtotal</p>
                <p className="font-medium">₹{order.totalAmount}</p>
              </div>
              {order.discount && order.couponCode && (
                <div className="flex items-center justify-between text-sm">
                  <p className="text-muted-foreground">Discount ({order.couponCode})</p>
                  <p className="font-medium text-green-600">-₹{order.discount}</p>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <p className="font-bold">Total</p>
                <p className="font-bold text-primary text-lg">
                  ₹{order.finalAmount || order.totalAmount}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Customer Rating (if available) */}
        {hasRating && (
          <Card className="rounded-[2rem] p-6 border-2 border-accent/20">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-accent fill-accent" />
              <h3 className="font-bold">Customer Rating</h3>
            </div>

            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 ${
                    star <= (order.rating || 0)
                      ? "fill-accent text-accent"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>

            {order.feedback && (
              <div className="p-4 bg-muted/50 rounded-2xl">
                <p className="text-sm text-muted-foreground mb-1">Customer Feedback:</p>
                <p className="text-sm italic">"{order.feedback}"</p>
              </div>
            )}
          </Card>
        )}

        {/* Disputes (if any) */}
        {orderDisputes.length > 0 && (
          <Card className="rounded-[2rem] p-6 border-2 border-orange-500/20">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h3 className="font-bold">Reported Issues ({orderDisputes.length})</h3>
            </div>

            <div className="space-y-3">
              {orderDisputes.map((dispute) => (
                <div
                  key={dispute.id}
                  className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm">{dispute.subject}</p>
                    <Badge
                      variant="outline"
                      className={
                        dispute.status === "open"
                          ? "border-orange-500 text-orange-700"
                          : dispute.status === "resolved"
                          ? "border-green-500 text-green-700"
                          : "border-blue-500 text-blue-700"
                      }
                    >
                      {dispute.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {dispute.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Priority: <span className="font-medium">{dispute.priority}</span> •{" "}
                    {format(new Date(dispute.createdAt), "MMM dd, yyyy")}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Notes */}
        {order.notes && (
          <Card className="rounded-3xl p-6 bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Order Notes</h3>
            </div>
            <p className="text-sm text-muted-foreground">{order.notes}</p>
          </Card>
        )}
      </div>

      {/* QR Code Modal */}
      <QRCodeModal
        open={showQR}
        onOpenChange={setShowQR}
        qrData={order.qrCode}
        orderId={order.id}
      />
    </div>
  );
};

export default LaundererOrderDetails;
