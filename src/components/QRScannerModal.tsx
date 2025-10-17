import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera, Search } from "lucide-react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

interface QRScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QRScannerModal = ({ open, onOpenChange }: QRScannerModalProps) => {
  const [qrCode, setQrCode] = useState("");
  const { orders, assignLaunderer, currentUser, users } = useStore();

  const handleScan = () => {
    if (!qrCode.trim()) {
      toast.error("Please enter a QR code");
      return;
    }

    // Extract customer ID or order ID from QR code
    if (qrCode.startsWith("CUSTOMER-")) {
      const customerId = qrCode.replace("CUSTOMER-", "");
      const customer = users.find(u => u.id === customerId);
      
      if (customer) {
        toast.success(`Customer identified: ${customer.name}`);
        onOpenChange(false);
        setQrCode("");
      } else {
        toast.error("Customer not found");
      }
    } else if (qrCode.startsWith("LAUNDRY-")) {
      const orderId = qrCode.replace("LAUNDRY-", "");
      const order = orders.find(o => o.id === orderId);
      
      if (order && currentUser) {
        assignLaunderer(orderId, currentUser.id);
        toast.success(`Order ${orderId} assigned successfully!`);
        onOpenChange(false);
        setQrCode("");
      } else {
        toast.error("Order not found");
      }
    } else {
      toast.error("Invalid QR code format");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Scan Customer QR Code</DialogTitle>
          <DialogDescription>
            Scan a customer QR code or order QR code to identify and assign orders
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          {/* Mock camera view */}
          <div className="w-full aspect-square bg-muted rounded-2xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse" />
            <Camera className="w-20 h-20 text-muted-foreground/40" />
            <div className="absolute inset-8 border-4 border-primary/50 rounded-xl" />
          </div>
          
          <div className="w-full space-y-4">
            <div className="relative flex items-center">
              <div className="flex-1 h-px bg-border" />
              <span className="px-4 text-sm text-muted-foreground">or enter manually</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">QR Code / Order ID</label>
              <Input
                placeholder="Enter QR code or Order ID"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            
            <Button onClick={handleScan} className="w-full h-12 rounded-xl">
              <Search className="mr-2 h-4 w-4" />
              Verify & Assign Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
