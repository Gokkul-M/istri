import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, User, Store } from "lucide-react";
import { motion } from "framer-motion";

const SelectRole = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber || "";
  const firebaseUid = location.state?.firebaseUid || "";

  const handleRoleSelect = (role: "customer" | "launderer") => {
    if (role === "customer") {
      navigate("/auth/check-availability", { state: { phoneNumber, firebaseUid } });
    } else {
      navigate("/auth/launderer-setup", { state: { phoneNumber, firebaseUid } });
    }
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
          <h1 className="text-2xl font-semibold">Select Your Role</h1>
        </div>

        {/* Role Selection */}
        <div className="space-y-4">
          <p className="text-center text-muted-foreground mb-6">
            Choose how you want to use our platform
          </p>

          {/* Customer Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="p-6 cursor-pointer hover:border-primary transition-all rounded-2xl border-2 hover-lift"
              onClick={() => handleRoleSelect("customer")}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">I'm a Customer</h3>
                  <p className="text-sm text-muted-foreground">
                    Get your laundry done with ease
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Launderer Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="p-6 cursor-pointer hover:border-secondary transition-all rounded-2xl border-2 hover-lift"
              onClick={() => handleRoleSelect("launderer")}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl gradient-secondary flex items-center justify-center">
                  <Store className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">I'm a Launderer</h3>
                  <p className="text-sm text-muted-foreground">
                    Provide laundry services and grow your business
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
