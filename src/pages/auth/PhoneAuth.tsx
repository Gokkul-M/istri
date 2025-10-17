import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Phone } from "lucide-react";
import { authService } from "@/lib/firebase/auth";

const PhoneAuth = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize reCAPTCHA container
    const container = document.getElementById('recaptcha-container');
    if (container) {
      container.innerHTML = ''; // Clear any existing reCAPTCHA
    }
  }, []);

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Format phone number with country code
      const formattedPhone = `+91${phoneNumber}`;
      
      // Send OTP via Firebase
      const confirmationResult = await authService.sendOTP(formattedPhone, 'recaptcha-container');
      
      toast({
        title: "OTP Sent!",
        description: `Verification code sent to ${phoneNumber}`,
      });

      // Navigate to OTP verification with confirmation result
      navigate("/auth/verify-otp", { 
        state: { 
          phoneNumber: formattedPhone, 
          confirmationResult 
        } 
      });
    } catch (error: any) {
      console.error("OTP send error:", error);
      toast({
        title: "Failed to Send OTP",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Sign In / Sign Up</h1>
        </div>

        {/* Phone Auth Card */}
        <Card className="border-0 shadow-lg rounded-3xl card-glass">
          <CardHeader className="space-y-4 text-center pb-6">
            <div className="mx-auto w-20 h-20 rounded-full gradient-primary flex items-center justify-center">
              <Phone className="h-10 w-10 text-white" />
            </div>
            
            <div>
              <CardTitle className="text-xl font-semibold mb-2">
                Enter Your Phone Number
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                We'll send you a verification code
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Phone Input */}
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <div className="px-4 h-12 bg-muted rounded-xl flex items-center text-sm font-medium">
                  +91
                </div>
                <Input
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  className="flex-1 h-12 rounded-xl text-lg"
                  maxLength={10}
                  data-testid="input-phone"
                />
              </div>
            </div>

            {/* reCAPTCHA container */}
            <div id="recaptcha-container"></div>

            {/* Send OTP Button */}
            <Button
              onClick={handleSendOTP}
              className="w-full h-12 rounded-xl glow-button"
              variant="hero"
              disabled={loading || phoneNumber.length !== 10}
              data-testid="button-send-otp"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>

        {/* Admin Login Link */}
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/auth/admin")}
            className="text-sm"
          >
            Admin Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhoneAuth;
