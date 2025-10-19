import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Download,
  Phone,
  Package,
  Clock,
  AlertCircle,
} from "lucide-react";
import { QRCodeModal } from "@/components/QRCodeModal";
import { generateInvoicePDF } from "@/components/InvoiceGenerator";
import { firestoreService } from "@/lib/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useFirebaseOrder } from "@/hooks/useFirebaseOrder";
import { useFirebaseDisputes } from "@/hooks/useFirebaseDisputes";
import { useAuth } from "@/hooks/useFirebaseAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { order, loading, error } = useFirebaseOrder(orderId);
  const { addDispute } = useFirebaseDisputes();

  const [showQR, setShowQR] = useState(false);
  const [rating, setRating] = useState(order?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState(order?.feedback || "");
  const [submittingRating, setSubmittingRating] = useState(false);

  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeSubject, setDisputeSubject] = useState("");
  const [disputeDescription, setDisputeDescription] = useState("");
  const [disputePriority, setDisputePriority] = useState<"low" | "medium" | "high">("medium");
  const [submittingDispute, setSubmittingDispute] = useState(false);

  const handleDownloadInvoice = async () => {
    if (!order) return;

    try {
      const filename = generateInvoicePDF({ order });

      try {
        await firestoreService.trackInvoiceGeneration(order.id);
      } catch (error) {
        console.log("Could not track invoice generation");
      }

      toast({
        title: "Invoice Downloaded",
        description: `${filename} has been saved to your device.`,
      });
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast({
        title: "Error",
        description: "Failed to generate invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitRating = async () => {
    if (!order || !orderId) return;

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setSubmittingRating(true);
    try {
      await firestoreService.updateOrder(orderId, {
        rating,
        feedback: feedback.trim() || undefined,
      });

      toast({
        title: "Thank You!",
        description: "Your rating and feedback have been submitted successfully.",
      });
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleSubmitDispute = async () => {
    if (!order || !user) return;

    if (!disputeSubject.trim()) {
      toast({
        title: "Subject Required",
        description: "Please enter a subject for your dispute.",
        variant: "destructive",
      });
      return;
    }

    if (!disputeDescription.trim()) {
      toast({
        title: "Description Required",
        description: "Please describe your issue.",
        variant: "destructive",
      });
      return;
    }

    setSubmittingDispute(true);
    try {
      await addDispute({
        orderId: order.id,
        customerId: user.id,
        laundererId: order.laundererId || "",
        subject: disputeSubject,
        description: disputeDescription,
        priority: disputePriority,
      });

      toast({
        title: "Dispute Submitted",
        description: "Your dispute has been submitted. Our team will review it shortly.",
      });

      setDisputeOpen(false);
      setDisputeSubject("");
      setDisputeDescription("");
      setDisputePriority("medium");
    } catch (error) {
      console.error("Error submitting dispute:", error);
      toast({
        title: "Error",
        description: "Failed to submit dispute. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingDispute(false);
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

  const getStatusTimeline = () => {
    const statuses = [
      { key: "pending", label: "Order Placed" },
      { key: "confirmed", label: "Confirmed" },
      { key: "picked_up", label: "Picked Up" },
      { key: "in_progress", label: "In Progress" },
      { key: "ready", label: "Ready for Delivery" },
      { key: "out_for_delivery", label: "Out for Delivery" },
      { key: "completed", label: "Delivered" },
    ];

    const currentStatusIndex = statuses.findIndex((s) => s.key === order?.status);

    return statuses.map((status, idx) => ({
      ...status,
      completed: idx <= currentStatusIndex && order?.status !== "cancelled",
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-10">
        <div className="gradient-primary p-6 pb-8 rounded-b-[3rem] mb-6 shadow-medium">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-32 h-6" />
            <div className="w-10" />
          </div>
          <Skeleton className="w-40 h-8 mx-auto mt-4" />
        </div>
        <div className="px-6 space-y-4">
          <Skeleton className="h-64 rounded-[2rem]" />
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-56 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background pb-10">
        <div className="gradient-primary p-6 pb-8 rounded-b-[3rem] mb-6 shadow-medium">
          <div className="flex items-center justify-between mb-4">
            <Link to="/customer/orders">
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
            <Link to="/customer/orders">
              <Button variant="hero">Go to Order History</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const timeline = getStatusTimeline();
  const isCompleted = order.status === "completed";
  const hasRating = order.rating !== undefined && order.rating > 0;

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <div className="gradient-primary p-6 pb-8 rounded-b-[3rem] mb-6 shadow-medium">
        <div className="flex items-center justify-between mb-4">
          <Link to="/customer/orders">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">Order Details</h1>
          <div className="w-10" />
        </div>

        <div className="text-center mt-4">
          <p className="text-white/80 text-sm mb-2">Order ID</p>
          <p className="text-white text-2xl font-bold">{order.id}</p>
        </div>
      </div>

      <div className="px-6 space-y-4">
        {/* Status */}
        <Card className="rounded-[2rem] p-6 shadow-soft border-border/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Status</h3>
            <Badge className={`${getStatusBadge(order.status)} text-sm px-4 py-1 border`}>
              {order.status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
          <div className="space-y-3">
            {timeline.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.completed ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      step.completed ? "bg-white" : "bg-muted-foreground"
                    }`}
                  />
                </div>
                <div className="flex-1 pt-1">
                  <p
                    className={`font-medium text-sm ${
                      step.completed ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Service Details */}
        <Card className="rounded-3xl p-6">
          <h3 className="font-bold mb-4">Service Details</h3>
          <div className="space-y-3">
            {order.laundererName && (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl gradient-secondary flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Launderer</p>
                    <p className="font-semibold">{order.laundererName}</p>
                  </div>
                </div>
                <Separator />
              </>
            )}
            {order.laundererPhone && (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl gradient-accent flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="font-semibold">{order.laundererPhone}</p>
                  </div>
                </div>
                <Separator />
              </>
            )}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl gradient-tertiary flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pickup Time</p>
                <p className="font-semibold">{order.pickupTime}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivery Time</p>
                <p className="font-semibold">{order.deliveryTime}</p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pickup Address</p>
              <p className="font-medium">{order.customerAddress}</p>
            </div>
            {order.createdAt && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                  <p className="font-medium">
                    {format(new Date(order.createdAt), "MMM dd, yyyy 'at' hh:mm a")}
                  </p>
                </div>
              </>
            )}
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
                  <p className="text-muted-foreground">
                    Discount ({order.couponCode})
                  </p>
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

        {/* QR Code */}
        <Card className="rounded-3xl p-6 gradient-secondary text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Order QR Code</h3>
              <p className="text-white/80 text-sm">Show this to verify your order</p>
            </div>
            <Button
              onClick={() => setShowQR(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              variant="outline"
            >
              <QrCode className="w-5 h-5 mr-2" />
              View QR
            </Button>
          </div>
        </Card>

        {/* Rating & Feedback (for completed orders) */}
        {isCompleted && (
          <Card className="rounded-[2rem] p-6 border-border/30">
            <h3 className="font-bold mb-4">
              {hasRating ? "Your Rating" : "Rate Your Experience"}
            </h3>

            {/* Star Rating */}
            <div className="flex justify-center gap-3 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => !hasRating && setRating(star)}
                  onMouseEnter={() => !hasRating && setHoveredRating(star)}
                  onMouseLeave={() => !hasRating && setHoveredRating(0)}
                  className={`transition-transform ${
                    !hasRating ? "hover:scale-110 cursor-pointer" : "cursor-default"
                  }`}
                  disabled={hasRating}
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hasRating ? rating : hoveredRating || rating)
                        ? "fill-accent text-accent"
                        : "text-muted"
                    }`}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && !hasRating && (
              <div className="text-center mb-4">
                <p className="text-lg font-semibold">
                  {rating === 5 && "Excellent!"}
                  {rating === 4 && "Great!"}
                  {rating === 3 && "Good"}
                  {rating === 2 && "Fair"}
                  {rating === 1 && "Poor"}
                </p>
              </div>
            )}

            {/* Feedback */}
            {!hasRating && (
              <>
                <Textarea
                  placeholder="Share your feedback (optional)..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="rounded-2xl min-h-24 mb-4"
                />

                <Button
                  onClick={handleSubmitRating}
                  disabled={rating === 0 || submittingRating}
                  variant="hero"
                  className="w-full"
                >
                  Submit Rating
                </Button>
              </>
            )}

            {hasRating && order.feedback && (
              <div className="mt-4 p-4 bg-muted/50 rounded-2xl">
                <p className="text-sm text-muted-foreground mb-1">Your Feedback:</p>
                <p className="text-sm">{order.feedback}</p>
              </div>
            )}
          </Card>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {isCompleted && (
            <Button
              onClick={handleDownloadInvoice}
              variant="hero"
              className="w-full"
              data-testid="button-download-invoice"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
          )}

          {/* Support/Dispute Dialog */}
          <Dialog open={disputeOpen} onOpenChange={setDisputeOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Report an Issue
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Report an Issue</DialogTitle>
                <DialogDescription>
                  Let us know if you're experiencing any problems with this order.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="dispute-subject">Subject</Label>
                  <Input
                    id="dispute-subject"
                    placeholder="Brief description of the issue"
                    value={disputeSubject}
                    onChange={(e) => setDisputeSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dispute-priority">Priority</Label>
                  <Select
                    value={disputePriority}
                    onValueChange={(value: "low" | "medium" | "high") =>
                      setDisputePriority(value)
                    }
                  >
                    <SelectTrigger id="dispute-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dispute-description">Description</Label>
                  <Textarea
                    id="dispute-description"
                    placeholder="Please describe the issue in detail..."
                    value={disputeDescription}
                    onChange={(e) => setDisputeDescription(e.target.value)}
                    className="min-h-32"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDisputeOpen(false)}
                  disabled={submittingDispute}
                >
                  Cancel
                </Button>
                <Button
                  variant="hero"
                  className="flex-1"
                  onClick={handleSubmitDispute}
                  disabled={submittingDispute}
                >
                  {submittingDispute ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
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

export default OrderDetails;
