import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Phone, User as UserIcon, Navigation, Loader2, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useOrder } from "@/hooks/useFirestoreOrders";
import type { Order } from "@/store/useStore";

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { order, loading } = useOrder(orderId || "");

  const getStatusSteps = (currentStatus: Order["status"]) => {
    const allSteps = [
      { label: "Order Placed", status: "pending", time: order?.createdAt },
      { label: "Confirmed", status: "confirmed", time: order?.updatedAt },
      { label: "Picked Up", status: "picked_up", time: order?.pickupTime },
      { label: "In Progress", status: "in_progress", time: "Processing" },
      { label: "Ready", status: "ready", time: "Ready for delivery" },
      { label: "Out for Delivery", status: "out_for_delivery", time: order?.deliveryTime },
      { label: "Completed", status: "completed", time: "Delivered" },
    ];

    const statusOrder = ["pending", "confirmed", "picked_up", "in_progress", "ready", "out_for_delivery", "completed"];
    const currentIndex = statusOrder.indexOf(currentStatus);

    return allSteps.map((step, idx) => {
      const completed = idx <= currentIndex;
      return {
        ...step,
        completed,
        time: completed && step.time ? (typeof step.time === 'string' && step.time.includes('T') ? new Date(step.time).toLocaleString() : step.time) : step.time,
      };
    });
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" data-testid="loader-tracking" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold mb-2" data-testid="text-not-found">Order Not Found</h2>
          <p className="text-muted-foreground mb-4">The order you're looking for doesn't exist</p>
          <Link to="/customer/orders">
            <Button data-testid="button-view-orders">View All Orders</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-primary p-6 pb-8 shadow-medium">
        <div className="flex items-center justify-between mb-4">
          <Link to="/customer/orders">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">Track Order</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="relative h-[400px] bg-muted">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-primary mx-auto mb-2" />
            <p className="text-muted-foreground">Map integration</p>
            <p className="text-sm text-muted-foreground">Live tracking will appear here</p>
          </div>
        </div>
        
        {/* Location Marker Animation */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-12 h-12 bg-primary rounded-full animate-pulse flex items-center justify-center">
            <Navigation className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Order Info */}
      <div className="p-6 space-y-4 -mt-8 relative z-10">
        <Card className="rounded-[2rem] p-6 shadow-glow border-border/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-bold text-lg" data-testid="text-order-id">{order.id}</p>
            </div>
            <Badge className={getStatusColor(order.status)} data-testid="badge-order-status">
              {order.status.replace(/_/g, " ")}
            </Badge>
          </div>

          <div className="space-y-4">
            {order.laundererName && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold" data-testid="text-launderer-name">{order.laundererName}</p>
                  <p className="text-sm text-muted-foreground">{order.laundererPhone}</p>
                </div>
                <Button size="icon" variant="outline" className="rounded-full" data-testid="button-call-launderer">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-accent/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Delivery Time</span>
                <span className="font-bold text-accent" data-testid="text-delivery-time">
                  {new Date(order.deliveryTime).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Order Items:</h4>
              <div className="space-y-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm" data-testid={`item-${idx}`}>
                    <span>{item.serviceName} x {item.quantity}</span>
                    <span className="font-medium">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 pt-2 border-t font-bold">
                <span>Total</span>
                <span data-testid="text-total-amount">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* QR Code for Verification */}
        {order.status !== "completed" && order.status !== "cancelled" && (
          <Card className="rounded-3xl p-6 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="flex items-center gap-2 mb-4">
              <QrCode className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Order Verification QR</h3>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg" data-testid="qr-code-container">
                <QRCodeSVG
                  value={`LAUNDRY-${order.id}`}
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium mb-1">Show this to your launderer</p>
                <p className="text-xs text-muted-foreground">
                  Scan this QR code to verify pickup and delivery
                </p>
              </div>
              <div className="px-4 py-2 bg-muted rounded-lg">
                <p className="text-xs font-mono text-muted-foreground" data-testid="text-qr-order-id">
                  LAUNDRY-{order.id}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Timeline */}
        <Card className="rounded-3xl p-6">
          <h3 className="font-bold mb-4">Order Timeline</h3>
          <div className="space-y-4">
            {getStatusSteps(order.status).map((step, idx) => (
              <div key={idx} className="flex items-start gap-3" data-testid={`timeline-step-${idx}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed ? 'bg-primary' : 'bg-muted'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    step.completed ? 'bg-white' : 'bg-muted-foreground'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </p>
                  <p className="text-sm text-muted-foreground">{step.time || "Pending"}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrderTracking;
