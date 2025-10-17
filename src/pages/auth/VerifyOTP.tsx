import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, MessageCircle } from "lucide-react";
import { useStore } from "@/store/useStore";
import { authService } from "@/lib/firebase/auth";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber || "";
  const confirmationResult = location.state?.confirmationResult;
  const mode = location.state?.mode || "signin";
  const { setCurrentUser } = useStore();
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(29);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter the complete 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Verify OTP with Firebase
      const userCredential = await confirmationResult.confirm(otp);
      const firebaseUser = userCredential.user;
      
      // Check if user profile exists in Firestore
      const userProfile = await authService.getUserProfile(firebaseUser.uid);
      
      if (userProfile) {
        // Existing user - login
        setCurrentUser(userProfile);
        toast({
          title: "Welcome back!",
          description: "Logged in successfully",
        });
        navigate(userProfile.role === 'customer' ? '/customer' : '/launderer');
      } else {
        // New user - go to role selection
        toast({
          title: "Verification Successful",
          description: "Let's set up your profile",
        });
        navigate("/auth/select-role", { state: { phoneNumber, firebaseUid: firebaseUser.uid } });
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    
    toast({
      title: "OTP Resent",
      description: `New verification code sent to ${phoneNumber}`,
    });
    setResendTimer(29);
  };

  const handleGoogleAuth = () => {
    toast({
      title: "Google Authentication",
      description: "Google sign-in will be implemented with backend",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/auth")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Welcome</h1>
        </div>

        {/* Verification Card */}
        <Card className="border-0 shadow-lg rounded-3xl card-glass">
          <CardHeader className="space-y-4 text-center pb-6">
            <div className="mx-auto w-20 h-20 rounded-full gradient-primary flex items-center justify-center">
              <MessageCircle className="h-10 w-10 text-white" />
            </div>
            
            <div>
              <CardTitle className="text-xl font-semibold mb-2">
                Enter Verification Code
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                We sent a code to {phoneNumber}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="w-12 h-12 text-lg rounded-xl" />
                  <InputOTPSlot index={1} className="w-12 h-12 text-lg rounded-xl" />
                  <InputOTPSlot index={2} className="w-12 h-12 text-lg rounded-xl" />
                  <InputOTPSlot index={3} className="w-12 h-12 text-lg rounded-xl" />
                  <InputOTPSlot index={4} className="w-12 h-12 text-lg rounded-xl" />
                  <InputOTPSlot index={5} className="w-12 h-12 text-lg rounded-xl" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerify}
              className="w-full h-12 rounded-xl glow-button"
              variant="hero"
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </Button>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?{" "}
                <button
                  onClick={handleResend}
                  className={`font-medium ${
                    resendTimer > 0
                      ? "text-muted-foreground cursor-not-allowed"
                      : "text-primary hover:underline"
                  }`}
                  disabled={resendTimer > 0}
                >
                  Resend {resendTimer > 0 && `in ${resendTimer}s`}
                </button>
              </p>
            </div>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">OR</span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              variant="outline"
              onClick={handleGoogleAuth}
              className="w-full h-12 rounded-xl border-muted"
            >
              <Mail className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyOTP;
