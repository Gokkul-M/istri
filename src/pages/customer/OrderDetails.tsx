import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Calendar, Star, MessageSquare, QrCode, Download } from "lucide-react";
import { QRCodeModal } from "@/components/QRCodeModal";
import { generateInvoicePDF } from "@/components/InvoiceGenerator";
import { firestoreService } from "@/lib/firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();
  const [order] = useState({
    id: orderId || "ORD-001",
    service: "Wash & Fold",
    launderer: "Fresh Laundry Co.",
    status: "Completed",
    date: "May 05, 2025",
    pickupTime: "10:00 AM",
    deliveryTime: "5:00 PM",
    address: "123 Main Street, Apt 4B, New York, NY 10001",
    qrCode: `LAUNDRY-${orderId || "ORD-001"}`,
    items: [
      { name: "Shirts", quantity: 3, price: "₹162" },
      { name: "Pants", quantity: 2, price: "₹144" },
      { name: "Bedsheets", quantity: 2, price: "₹216" },
      { name: "Towels", quantity: 1, price: "₹108" },
    ],
    subtotal: "₹630",
    tax: "₹63",
    total: "₹693",
    timeline: [
      { status: "Order Placed", time: "May 05, 10:00 AM", completed: true },
      { status: "Confirmed", time: "May 05, 10:05 AM", completed: true },
      { status: "Picked Up", time: "May 05, 10:30 AM", completed: true },
      { status: "In Progress", time: "May 05, 2:00 PM", completed: true },
      { status: "Ready for Delivery", time: "May 05, 4:30 PM", completed: true },
      { status: "Delivered", time: "May 05, 5:00 PM", completed: true },
    ]
  });

  const handleDownloadInvoice = async () => {
    try {
      // Convert mock order data to match Order interface
      const invoiceOrder = {
        id: order.id,
        customerId: "mock-customer-id",
        customerName: "Valued Customer",
        customerPhone: "+91 98765 43210",
        customerAddress: order.address,
        items: order.items.map(item => ({
          serviceId: `service-${item.name}`,
          serviceName: item.name,
          quantity: item.quantity,
          price: parseInt(item.price.replace('₹', ''))
        })),
        totalAmount: parseInt(order.subtotal.replace('₹', '')),
        finalAmount: parseInt(order.total.replace('₹', '')),
        status: order.status.toLowerCase() as any,
        pickupTime: order.pickupTime,
        deliveryTime: order.deliveryTime,
        qrCode: order.qrCode,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Generate the PDF
      const filename = generateInvoicePDF({ order: invoiceOrder });

      // Track invoice download in Firestore (if using real data)
      try {
        await firestoreService.trackInvoiceGeneration(order.id);
      } catch (error) {
        console.log('Could not track invoice generation (mock data)');
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
            <Badge className="bg-green-500/20 text-green-700 text-sm px-4 py-1">
              {order.status}
            </Badge>
          </div>
          <div className="space-y-3">
            {order.timeline.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  step.completed ? 'bg-primary' : 'bg-muted'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    step.completed ? 'bg-white' : 'bg-muted-foreground'
                  }`} />
                </div>
                <div className="flex-1 pt-1">
                  <p className={`font-medium text-sm ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.status}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Service Details */}
        <Card className="rounded-3xl p-6">
          <h3 className="font-bold mb-4">Service Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl gradient-secondary flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Launderer</p>
                <p className="font-semibold">{order.launderer}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl gradient-accent flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-semibold">{order.date}</p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pickup Address</p>
              <p className="font-medium">{order.address}</p>
            </div>
          </div>
        </Card>

        {/* Items */}
        <Card className="rounded-3xl p-6">
          <h3 className="font-bold mb-4">Items</h3>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">{item.price}</p>
              </div>
            ))}
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">Subtotal</p>
                <p className="font-medium">{order.subtotal}</p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <p className="text-muted-foreground">Tax</p>
                <p className="font-medium">{order.tax}</p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <p className="font-bold">Total</p>
                <p className="font-bold text-primary text-lg">{order.total}</p>
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

        {/* Actions */}
        {order.status === "Completed" && (
          <>
            <Button 
              onClick={handleDownloadInvoice}
              variant="hero" 
              className="w-full"
              data-testid="button-download-invoice"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Link to={`/customer/rate/${order.id}`}>
                <Button variant="outline" className="w-full">
                  <Star className="w-4 h-4 mr-2" />
                  Rate Service
                </Button>
              </Link>
              <Button variant="outline" className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Support
              </Button>
            </div>
          </>
        )}

        <Link to="/customer/new-order">
          <Button variant="outline" className="w-full rounded-2xl">
            Reorder
          </Button>
        </Link>
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
