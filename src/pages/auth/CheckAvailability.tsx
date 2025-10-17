import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { useStore } from "@/store/useStore";

const CheckAvailability = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber || "";
  const firebaseUid = location.state?.firebaseUid || "";
  const { checkAvailability } = useStore();
  const [pinCode, setPinCode] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const handleCheck = async () => {
    if (!pinCode || pinCode.length < 5) {
      toast({
        title: "Invalid PIN Code",
        description: "Please enter a valid 6-digit PIN code",
        variant: "destructive",
      });
      return;
    }

    setChecking(true);
    
    // Simulate checking delay
    setTimeout(() => {
      const available = checkAvailability(pinCode);
      setIsAvailable(available);
      setChecking(false);

      if (available) {
        toast({
          title: "Great News!",
          description: "Service is available in your area",
        });
        setTimeout(() => {
          navigate("/auth/customer-setup", { state: { phoneNumber, pinCode, firebaseUid } });
        }, 2000);
      } else {
        toast({
          title: "Not Available Yet",
          description: "We'll notify you when we expand to your area",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/auth/select-role")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Check Service Availability</h1>
        </div>

        {/* Availability Card */}
        <Card className="border-0 shadow-lg rounded-3xl card-glass">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold mb-2">
              Where are you located?
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter your PIN code to check if we serve your area
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* PIN Code Input */}
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter PIN code"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ""))}
                className="flex-1 h-12 rounded-xl text-lg"
                maxLength={6}
              />
              <Button
                onClick={handleCheck}
                className="h-12 px-6 rounded-xl glow-button"
                variant="hero"
                disabled={checking || pinCode.length < 5}
              >
                {checking ? "Checking..." : "Check"}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Try: 560001, 560002, 560038, or 560095
            </p>

            {/* Availability Status */}
            <AnimatePresence>
              {isAvailable !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-6 rounded-2xl border-2 ${
                    isAvailable
                      ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                      : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {isAvailable ? (
                      <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-600 dark:text-red-400 flex-shrink-0" />
                    )}
                    <div>
                      <h3
                        className={`font-semibold text-lg mb-2 ${
                          isAvailable
                            ? "text-green-700 dark:text-green-400"
                            : "text-red-700 dark:text-red-400"
                        }`}
                      >
                        {isAvailable
                          ? "🎉 Great! Your area is serviceable"
                          : "😔 Sorry! We're not in your area yet"}
                      </h3>
                      <p
                        className={`text-sm ${
                          isAvailable
                            ? "text-green-600 dark:text-green-500"
                            : "text-red-600 dark:text-red-500"
                        }`}
                      >
                        {isAvailable
                          ? "Redirecting you to complete your profile..."
                          : "We're expanding soon. Check back later or try a different PIN code!"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckAvailability;
