import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, Loader2, CheckCircle2, XCircle, Scan } from "lucide-react";
import { useStore } from "@/store/useStore";
import { firestoreService } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";

const QRScanner = () => {
  const navigate = useNavigate();
  const { currentUser } = useStore();
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [processing, setProcessing] = useState(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setScanning(true);
      setScanResult(null);
      
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      };

      await scannerRef.current.start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
          // Process the scanned QR code
          await handleQRCodeScanned(decodedText);
          // Stop scanning after successful scan
          if (scannerRef.current) {
            await scannerRef.current.stop();
            setScanning(false);
          }
        },
        (errorMessage) => {
          // Handle scan errors silently (too many false positives)
          console.log("Scan error:", errorMessage);
        }
      );
    } catch (err) {
      console.error("Error starting scanner:", err);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      });
      setScanning(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        setScanning(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  const handleQRCodeScanned = async (qrCode: string) => {
    setProcessing(true);
    
    try {
      // Extract order ID from QR code (format: LAUNDRY-{orderId})
      let orderId = qrCode;
      if (qrCode.startsWith("LAUNDRY-")) {
        orderId = qrCode.replace("LAUNDRY-", "");
      }

      // Fetch the order
      const order = await firestoreService.getOrder(orderId);

      if (!order) {
        setScanResult({
          success: false,
          message: "Order not found. Please verify the QR code.",
        });
        toast({
          title: "Order Not Found",
          description: "The scanned QR code doesn't match any order.",
          variant: "destructive",
        });
        return;
      }

      // Verify order belongs to current launderer
      if (order.laundererId !== currentUser?.id) {
        setScanResult({
          success: false,
          message: "This order is not assigned to you.",
        });
        toast({
          title: "Verification Failed",
          description: "This order is assigned to another launderer.",
          variant: "destructive",
        });
        return;
      }

      // Update order status based on current status
      let newStatus = order.status;
      let statusMessage = "";

      if (order.status === "confirmed" || order.status === "pending") {
        newStatus = "picked_up";
        statusMessage = "Order marked as picked up";
      } else if (order.status === "picked_up") {
        newStatus = "in_progress";
        statusMessage = "Order marked as in progress";
      } else if (order.status === "in_progress") {
        newStatus = "ready";
        statusMessage = "Order marked as ready";
      } else if (order.status === "ready") {
        newStatus = "out_for_delivery";
        statusMessage = "Order marked as out for delivery";
      } else if (order.status === "out_for_delivery") {
        newStatus = "completed";
        statusMessage = "Order marked as completed";
      } else {
        setScanResult({
          success: false,
          message: `Order is already ${order.status}`,
        });
        return;
      }

      // Update the order status
      await firestoreService.updateOrder(orderId, { status: newStatus });

      setScanResult({
        success: true,
        message: statusMessage,
      });

      toast({
        title: "Success",
        description: statusMessage,
      });

      // Navigate back after 2 seconds
      setTimeout(() => {
        navigate("/launderer");
      }, 2000);
    } catch (error) {
      console.error("Error processing QR code:", error);
      setScanResult({
        success: false,
        message: "Failed to process order. Please try again.",
      });
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleManualVerify = async () => {
    if (!manualCode.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter an order ID or QR code.",
        variant: "destructive",
      });
      return;
    }

    await handleQRCodeScanned(manualCode);
    setManualCode("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-primary p-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <Link to="/launderer">
            <Button variant="ghost" size="icon" className="text-white" data-testid="button-back">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">Scan QR Code</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-6 space-y-6 -mt-4">
        {/* Scanner Card */}
        <Card className="rounded-3xl p-6 shadow-glow">
          <div className="space-y-4">
            {/* Camera View */}
            <div className="relative">
              <div
                id="qr-reader"
                ref={scannerElementRef}
                className={`w-full rounded-2xl overflow-hidden ${scanning ? 'block' : 'hidden'}`}
                data-testid="qr-reader"
              />
              
              {!scanning && !scanResult && (
                <div className="aspect-square bg-muted rounded-2xl flex flex-col items-center justify-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold mb-1">Ready to Scan</p>
                    <p className="text-sm text-muted-foreground">
                      Position the QR code within the frame
                    </p>
                  </div>
                </div>
              )}

              {scanResult && (
                <div className="aspect-square bg-muted rounded-2xl flex flex-col items-center justify-center gap-4">
                  <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center ${
                      scanResult.success ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}
                  >
                    {scanResult.success ? (
                      <CheckCircle2 className="w-12 h-12 text-green-500" data-testid="icon-success" />
                    ) : (
                      <XCircle className="w-12 h-12 text-red-500" data-testid="icon-error" />
                    )}
                  </div>
                  <div className="text-center px-4">
                    <p
                      className={`font-semibold mb-1 ${
                        scanResult.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}
                      data-testid="text-result-message"
                    >
                      {scanResult.message}
                    </p>
                  </div>
                </div>
              )}

              {processing && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" data-testid="loader-processing" />
                </div>
              )}
            </div>

            {/* Scan Button */}
            {!scanning ? (
              <Button
                onClick={startScanning}
                className="w-full h-12 rounded-xl"
                disabled={processing}
                data-testid="button-start-scan"
              >
                <Scan className="mr-2 h-5 w-5" />
                Start Scanning
              </Button>
            ) : (
              <Button
                onClick={stopScanning}
                variant="destructive"
                className="w-full h-12 rounded-xl"
                data-testid="button-stop-scan"
              >
                Stop Scanning
              </Button>
            )}
          </div>
        </Card>

        {/* Manual Entry Card */}
        <Card className="rounded-3xl p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="h-px bg-border flex-1" />
              <span className="text-sm text-muted-foreground">or enter manually</span>
              <div className="h-px bg-border flex-1" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Order ID / QR Code</label>
              <Input
                placeholder="Enter order ID or scanned code"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="h-12 rounded-xl"
                data-testid="input-manual-code"
              />
            </div>

            <Button
              onClick={handleManualVerify}
              variant="outline"
              className="w-full h-12 rounded-xl"
              disabled={processing}
              data-testid="button-manual-verify"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Verify Order
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="rounded-3xl p-6 bg-primary/5 border-primary/20">
          <h3 className="font-semibold mb-3">How to use:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                1
              </Badge>
              <span>Ask customer to show their order QR code</span>
            </li>
            <li className="flex gap-2">
              <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                2
              </Badge>
              <span>Tap "Start Scanning" and point camera at QR code</span>
            </li>
            <li className="flex gap-2">
              <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                3
              </Badge>
              <span>Order status will update automatically after verification</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default QRScanner;
