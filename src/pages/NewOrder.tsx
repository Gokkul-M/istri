import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  Plus,
  Minus,
  MapPin,
  Clock,
  Calendar,
  ShoppingBag,
  Home,
  Briefcase,
  Building,
  Tag,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { OrderItem, Coupon } from "@/store/useStore";
import { QRCodeModal } from "@/components/QRCodeModal";
import { Badge } from "@/components/ui/badge";
import { firestoreService } from "@/lib/firebase";
import { useAddresses } from "@/hooks/useAddresses";
import { Skeleton } from "@/components/ui/skeleton";
import { useFirebaseServices } from "@/hooks/useFirebaseServices";
import { useFirebaseOrders } from "@/hooks/useFirebaseOrders";
import { useAuth } from "@/hooks/useFirebaseAuth";
import { useFirebaseCoupons } from "@/hooks/useFirebaseCoupons";
import { IndexMissingError } from "@/components/IndexMissingError";

// Cloth items for counting
const clothItems = [
  { id: "tshirt", name: "T-Shirt" },
  { id: "shirt", name: "Shirt" },
  { id: "pants", name: "Pants" },
  { id: "jeans", name: "Jeans" },
  { id: "bedsheet", name: "Bedsheet" },
  { id: "towel", name: "Towel" },
];

const NewOrder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { services, loading: servicesLoading } = useFirebaseServices();
  const { createOrder } = useFirebaseOrders();
  const { addresses, defaultAddress, loading: addressesLoading, error: addressError, addAddress } = useAddresses();
  const { coupons, incrementCouponUsage } = useFirebaseCoupons();

  const [step, setStep] = useState<"services" | "details" | "confirm">(
    "services",
  );
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [clothCounts, setClothCounts] = useState<Map<string, number>>(
    new Map(),
  );
  
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [newAddressData, setNewAddressData] = useState({
    label: "Home",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: false
  });

  const [pickupTime, setPickupTime] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [notes, setNotes] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [generatedOrder, setGeneratedOrder] = useState<string>("");
  
  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponValidating, setCouponValidating] = useState(false);

  // Auto-select default address ONLY on initial load
  useEffect(() => {
    if (!addressesLoading && addresses.length > 0 && !selectedAddressId && !useNewAddress) {
      // Initial auto-selection
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else {
        setSelectedAddressId(addresses[0].id);
      }
    } else if (!addressesLoading && selectedAddressId && !useNewAddress) {
      // Verify selected address still exists, if not, clear selection
      const addressExists = addresses.some(addr => addr.id === selectedAddressId);
      if (!addressExists) {
        // Selected address was deleted, auto-select default or first
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        } else if (addresses.length > 0) {
          setSelectedAddressId(addresses[0].id);
        } else {
          setSelectedAddressId("");
        }
      }
      // If address exists, preserve user's manual selection (do nothing)
    }
    // Only depend on addresses and loading state, NOT defaultAddress
    // This prevents re-running when default flag changes remotely
  }, [addresses, addressesLoading, selectedAddressId, useNewAddress]);

  const updateClothCount = (clothId: string, delta: number) => {
    const newCounts = new Map(clothCounts);
    const current = newCounts.get(clothId) || 0;
    const newValue = Math.max(0, current + delta);

    if (newValue === 0) {
      newCounts.delete(clothId);
    } else {
      newCounts.set(clothId, newValue);
    }

    setClothCounts(newCounts);
  };

  const getTotalItems = () => {
    let total = 0;
    clothCounts.forEach((count) => {
      total += count;
    });
    return total;
  };

  const toggleService = (serviceId: string) => {
    const newSelectedServices = new Set(selectedServices);
    if (newSelectedServices.has(serviceId)) {
      newSelectedServices.delete(serviceId);
    } else {
      newSelectedServices.add(serviceId);
    }
    setSelectedServices(newSelectedServices);
  };

  const calculateTotal = () => {
    let total = 0;
    const totalItems = getTotalItems();
    
    selectedServices.forEach(serviceId => {
      const service = services.find((s) => s.id === serviceId);
      if (service) {
        total += service.price * totalItems;
      }
    });
    
    return total;
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    const total = calculateTotal();
    return Math.round((total * appliedCoupon.discount) / 100);
  };

  const calculateFinalTotal = () => {
    return calculateTotal() - calculateDiscount();
  };

  const validateAndApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive",
      });
      return;
    }

    setCouponValidating(true);
    
    // Find the coupon
    const coupon = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
    
    if (!coupon) {
      setCouponValidating(false);
      toast({
        title: "Invalid Coupon",
        description: "This coupon code is not valid",
        variant: "destructive",
      });
      return;
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      setCouponValidating(false);
      toast({
        title: "Coupon Inactive",
        description: "This coupon is not currently active",
        variant: "destructive",
      });
      return;
    }

    // Check validity dates
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (now < validFrom) {
      setCouponValidating(false);
      toast({
        title: "Coupon Not Yet Valid",
        description: `This coupon will be valid from ${validFrom.toLocaleDateString()}`,
        variant: "destructive",
      });
      return;
    }

    if (now > validUntil) {
      setCouponValidating(false);
      toast({
        title: "Coupon Expired",
        description: `This coupon expired on ${validUntil.toLocaleDateString()}`,
        variant: "destructive",
      });
      return;
    }

    // Check usage limit
    if (coupon.usedCount >= coupon.usageLimit) {
      setCouponValidating(false);
      toast({
        title: "Coupon Limit Reached",
        description: "This coupon has reached its usage limit",
        variant: "destructive",
      });
      return;
    }

    // Check if coupon is assigned to specific customers
    if (coupon.assignedTo && coupon.assignedTo.length > 0) {
      if (!user || !coupon.assignedTo.includes(user.id)) {
        setCouponValidating(false);
        toast({
          title: "Coupon Not Available",
          description: "This coupon is not available for your account",
          variant: "destructive",
        });
        return;
      }
    }

    // Coupon is valid, apply it
    setAppliedCoupon(coupon);
    setCouponValidating(false);
    toast({
      title: "Coupon Applied!",
      description: `You saved ₹${Math.round((calculateTotal() * coupon.discount) / 100)} with code ${coupon.code}`,
    });
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast({
      title: "Coupon Removed",
      description: "The coupon has been removed from your order",
    });
  };

  const getIconForLabel = (label: string) => {
    const lowercaseLabel = label.toLowerCase();
    if (lowercaseLabel === 'home') return Home;
    if (lowercaseLabel === 'work') return Briefcase;
    return Building;
  };

  const getSelectedAddress = () => {
    if (useNewAddress) {
      return `${newAddressData.addressLine1}${newAddressData.addressLine2 ? ', ' + newAddressData.addressLine2 : ''}, ${newAddressData.city}, ${newAddressData.state} ${newAddressData.zipCode}`;
    }
    const addr = addresses.find(a => a.id === selectedAddressId);
    if (addr) {
      return `${addr.addressLine1}${addr.addressLine2 ? ', ' + addr.addressLine2 : ''}, ${addr.city}, ${addr.state} ${addr.zipCode}`;
    }
    return "";
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please login to place an order",
        variant: "destructive",
      });
      return;
    }

    let customerAddress = "";
    
    if (useNewAddress) {
      try {
        await addAddress(newAddressData);
        customerAddress = getSelectedAddress();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save new address. Please try again.",
          variant: "destructive",
        });
        return;
      }
    } else {
      const addr = addresses.find(a => a.id === selectedAddressId);
      if (!addr) {
        toast({
          title: "Error",
          description: "Please select a delivery address",
          variant: "destructive",
        });
        return;
      }
      customerAddress = `${addr.addressLine1}${addr.addressLine2 ? ', ' + addr.addressLine2 : ''}, ${addr.city}, ${addr.state} ${addr.zipCode}`;
    }

    if (selectedServices.size === 0) {
      toast({
        title: "Error",
        description: "Please select at least one service",
        variant: "destructive",
      });
      return;
    }

    const orderItems: OrderItem[] = [];
    const totalItems = getTotalItems();
    
    selectedServices.forEach(serviceId => {
      const service = services.find((s) => s.id === serviceId);
      if (service) {
        orderItems.push({
          serviceId: service.id,
          serviceName: service.name,
          quantity: totalItems,
          price: service.price,
        });
      }
    });

    try {
      // Use Firebase hook to create order
      const orderId = await createOrder({
        customerId: user.id,
        customerName: user.name,
        customerPhone: user.phone,
        customerAddress,
        items: orderItems,
        totalAmount: calculateTotal(),
        discount: appliedCoupon ? calculateDiscount() : 0,
        couponCode: appliedCoupon?.code,
        finalAmount: calculateFinalTotal(),
        status: "pending" as const,
        pickupTime,
        deliveryTime,
        qrCode: "", // Will be set after we get the ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes,
      });

      // Generate QR code with the unique Firestore ID
      const qrCode = `LAUNDRY-${orderId}`;
      
      // Update order with QR code
      await firestoreService.updateOrder(orderId, { qrCode });

      // Increment coupon usage if a coupon was applied
      if (appliedCoupon) {
        try {
          await incrementCouponUsage(appliedCoupon.id);
        } catch (error) {
          console.error('Error incrementing coupon usage:', error);
          // Don't fail the order if coupon increment fails
        }
      }

      setGeneratedOrder(orderId);
      setShowQR(true);

      toast({
        title: "Order Placed Successfully!",
        description: `Your order has been created`,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCloseQR = () => {
    setShowQR(false);
    navigate("/customer/orders");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-card/95 border-b border-border/30 p-6 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm shadow-soft">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            step === "services" ? navigate("/customer") : setStep("services")
          }
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold tracking-tight">New Order</h1>
        <div className="w-10 h-10 rounded-full gradient-secondary flex items-center justify-center shadow-soft">
          <ShoppingBag className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 space-y-6 w-full">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6 max-w-md mx-auto">
          {["Services", "Details", "Confirm"].map((label, index) => {
            const stepIndex = ["services", "details", "confirm"].indexOf(step);
            const isActive = index <= stepIndex;

            return (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all shadow-soft ${
                      isActive
                        ? "gradient-primary border-primary text-white"
                        : "bg-background border-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p
                    className={`text-xs mt-2 text-center whitespace-nowrap ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}
                  >
                    {label}
                  </p>
                </div>
                {index < 2 && (
                  <div
                    className={`h-0.5 w-16 mx-2 transition-all ${isActive ? "bg-primary" : "bg-muted"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Service Selection */}
          {step === "services" && selectedServices.size === 0 && (
            <motion.div
              key="services"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold mb-4">Select Services (Multiple)</h2>
              {servicesLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-28 rounded-3xl" />
                  <Skeleton className="h-28 rounded-3xl" />
                  <Skeleton className="h-28 rounded-3xl" />
                </div>
              ) : (
                <div className="space-y-3">
                  {services.length === 0 ? (
                    <Card className="rounded-3xl p-8 text-center">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No services available</p>
                    </Card>
                  ) : (
                    services.map((service) => (
                      <motion.div
                        key={service.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`rounded-3xl p-5 border-2 transition-all hover-lift cursor-pointer ${
                            selectedServices.has(service.id)
                              ? "border-primary bg-primary/5"
                              : "border-border/50 hover:border-primary"
                          }`}
                          onClick={() => toggleService(service.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                              selectedServices.has(service.id) ? "gradient-primary" : "gradient-secondary"
                            }`}>
                              <ShoppingBag className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-lg">
                                {service.name}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {service.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-primary">
                                ₹{service.price}
                              </p>
                              <p className="text-xs text-muted-foreground">per item</p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
              
              {selectedServices.size > 0 && (
                <Button
                  onClick={() => {}} 
                  className="w-full rounded-2xl h-14 text-lg glow-button"
                  variant="hero"
                  disabled
                >
                  Selected {selectedServices.size} Service{selectedServices.size > 1 ? 's' : ''} - Continue
                </Button>
              )}
            </motion.div>
          )}

          {/* Step 1.5: Cloth Count Selection */}
          {step === "services" && selectedServices.size > 0 && (
            <motion.div
              key="cloth-count"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedServices(new Set())}
                  className="rounded-full"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h2 className="text-xl font-semibold">Select Cloth Items</h2>
              </div>

              <Card className="rounded-3xl p-4 gradient-accent border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">
                      {Array.from(selectedServices).map(id => {
                        const service = services.find((s) => s.id === id);
                        return service?.name;
                      }).filter(Boolean).join(', ')}
                    </p>
                    <p className="text-white/80 text-sm">
                      Add items to your order
                    </p>
                  </div>
                  <ShoppingBag className="w-10 h-10 text-white/30" />
                </div>
              </Card>

              <div className="space-y-3">
                {clothItems.map((item) => {
                  const count = clothCounts.get(item.id) || 0;

                  return (
                    <Card
                      key={item.id}
                      className="rounded-2xl p-4 border-border/50"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{item.name}</p>
                        <div className="flex items-center gap-3">
                          {count > 0 ? (
                            <>
                              <div className="flex items-center gap-2 bg-muted rounded-xl p-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-lg"
                                  onClick={() => updateClothCount(item.id, -1)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="font-bold w-8 text-center">
                                  {count}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-lg"
                                  onClick={() => updateClothCount(item.id, 1)}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </>
                          ) : (
                            <Button
                              onClick={() => updateClothCount(item.id, 1)}
                              variant="outline"
                              size="sm"
                              className="rounded-xl"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {clothCounts.size > 0 && (
                <Card className="rounded-2xl p-4 gradient-primary text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">Total Items</p>
                      <p className="text-2xl font-bold">{getTotalItems()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/80 text-sm">Estimated Total</p>
                      <p className="text-2xl font-bold">₹{calculateTotal()}</p>
                    </div>
                  </div>
                </Card>
              )}

              <Button
                onClick={() => setStep("details")}
                disabled={clothCounts.size === 0}
                className="w-full rounded-2xl h-14 text-lg glow-button"
                variant="hero"
              >
                Continue to Details
              </Button>
            </motion.div>
          )}

          {/* Step 2: Order Details */}
          {step === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <h2 className="text-xl font-semibold">Order Details</h2>

              <Card className="rounded-3xl p-6 card-glass space-y-5">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="w-4 h-4 text-primary" />
                    Pickup Address
                  </Label>
                  
                  {addressError && (addressError as any).code === 'failed-precondition' ? (
                    <IndexMissingError 
                      message="Your addresses require a database index to be created. Please create the required index for the 'addresses' collection." 
                    />
                  ) : addressesLoading ? (
                    <Skeleton className="h-20 rounded-2xl" />
                  ) : addresses.length > 0 ? (
                    <>
                      <RadioGroup value={useNewAddress ? "new" : selectedAddressId} onValueChange={(value) => {
                        if (value === "new") {
                          setUseNewAddress(true);
                          setSelectedAddressId("");
                        } else {
                          setUseNewAddress(false);
                          setSelectedAddressId(value);
                        }
                      }}>
                        {addresses.map((addr) => {
                          const IconComponent = getIconForLabel(addr.label);
                          return (
                            <div key={addr.id} className="flex items-center space-x-3 p-3 rounded-2xl border border-border/50 hover:border-primary/50 transition-colors">
                              <RadioGroupItem value={addr.id} id={addr.id} data-testid={`radio-address-${addr.id}`} />
                              <Label htmlFor={addr.id} className="flex items-center gap-3 flex-1 cursor-pointer">
                                <div className={`w-10 h-10 rounded-xl ${addr.isDefault ? 'gradient-primary' : 'bg-muted'} flex items-center justify-center`}>
                                  <IconComponent className={`w-5 h-5 ${addr.isDefault ? 'text-white' : 'text-muted-foreground'}`} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm">{addr.label}</p>
                                    {addr.isDefault && <Badge variant="secondary" className="text-xs">Default</Badge>}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {addr.addressLine1}, {addr.city}, {addr.state} {addr.zipCode}
                                  </p>
                                </div>
                              </Label>
                            </div>
                          );
                        })}
                        <div className="flex items-center space-x-3 p-3 rounded-2xl border border-border/50 hover:border-primary/50 transition-colors">
                          <RadioGroupItem value="new" id="new-address" data-testid="radio-new-address" />
                          <Label htmlFor="new-address" className="flex items-center gap-3 flex-1 cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Plus className="w-5 h-5 text-primary" />
                            </div>
                            <p className="font-medium text-sm">Add New Address</p>
                          </Label>
                        </div>
                      </RadioGroup>

                      {useNewAddress && (
                        <Card className="p-4 space-y-4 mt-4 border-primary/20">
                          <div>
                            <Label>Label</Label>
                            <Select value={newAddressData.label} onValueChange={(value) => setNewAddressData({ ...newAddressData, label: value })}>
                              <SelectTrigger className="rounded-2xl" data-testid="select-new-label">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Home">Home</SelectItem>
                                <SelectItem value="Work">Work</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Address Line 1 *</Label>
                            <Input
                              placeholder="123 Main Street"
                              value={newAddressData.addressLine1}
                              onChange={(e) => setNewAddressData({ ...newAddressData, addressLine1: e.target.value })}
                              className="rounded-2xl"
                              data-testid="input-new-address-line1"
                            />
                          </div>
                          <div>
                            <Label>Address Line 2</Label>
                            <Input
                              placeholder="Apt, Suite, etc. (optional)"
                              value={newAddressData.addressLine2}
                              onChange={(e) => setNewAddressData({ ...newAddressData, addressLine2: e.target.value })}
                              className="rounded-2xl"
                              data-testid="input-new-address-line2"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>City *</Label>
                              <Input
                                placeholder="City"
                                value={newAddressData.city}
                                onChange={(e) => setNewAddressData({ ...newAddressData, city: e.target.value })}
                                className="rounded-2xl"
                                data-testid="input-new-city"
                              />
                            </div>
                            <div>
                              <Label>State *</Label>
                              <Input
                                placeholder="State"
                                value={newAddressData.state}
                                onChange={(e) => setNewAddressData({ ...newAddressData, state: e.target.value })}
                                className="rounded-2xl"
                                data-testid="input-new-state"
                              />
                            </div>
                          </div>
                          <div>
                            <Label>ZIP Code *</Label>
                            <Input
                              placeholder="ZIP Code"
                              value={newAddressData.zipCode}
                              onChange={(e) => setNewAddressData({ ...newAddressData, zipCode: e.target.value })}
                              className="rounded-2xl"
                              data-testid="input-new-zipcode"
                            />
                          </div>
                        </Card>
                      )}
                    </>
                  ) : (
                    <Card className="p-6 text-center space-y-3">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">No saved addresses</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" data-testid="button-add-first-address">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Address
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-3xl">
                          <DialogHeader>
                            <DialogTitle>Add New Address</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div>
                              <Label>Label</Label>
                              <Select value={newAddressData.label} onValueChange={(value) => setNewAddressData({ ...newAddressData, label: value })}>
                                <SelectTrigger className="rounded-2xl">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Home">Home</SelectItem>
                                  <SelectItem value="Work">Work</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Address Line 1 *</Label>
                              <Input
                                placeholder="123 Main Street"
                                value={newAddressData.addressLine1}
                                onChange={(e) => setNewAddressData({ ...newAddressData, addressLine1: e.target.value })}
                                className="rounded-2xl"
                              />
                            </div>
                            <div>
                              <Label>Address Line 2</Label>
                              <Input
                                placeholder="Apt, Suite, etc."
                                value={newAddressData.addressLine2}
                                onChange={(e) => setNewAddressData({ ...newAddressData, addressLine2: e.target.value })}
                                className="rounded-2xl"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label>City *</Label>
                                <Input
                                  placeholder="City"
                                  value={newAddressData.city}
                                  onChange={(e) => setNewAddressData({ ...newAddressData, city: e.target.value })}
                                  className="rounded-2xl"
                                />
                              </div>
                              <div>
                                <Label>State *</Label>
                                <Input
                                  placeholder="State"
                                  value={newAddressData.state}
                                  onChange={(e) => setNewAddressData({ ...newAddressData, state: e.target.value })}
                                  className="rounded-2xl"
                                />
                              </div>
                            </div>
                            <div>
                              <Label>ZIP Code *</Label>
                              <Input
                                placeholder="ZIP Code"
                                value={newAddressData.zipCode}
                                onChange={(e) => setNewAddressData({ ...newAddressData, zipCode: e.target.value })}
                                className="rounded-2xl"
                              />
                            </div>
                            <Button 
                              onClick={async () => {
                                try {
                                  await addAddress(newAddressData);
                                  toast({
                                    title: "Address Added",
                                    description: "Your address has been saved successfully.",
                                  });
                                } catch (error) {
                                  toast({
                                    title: "Error",
                                    description: "Failed to save address. Please try again.",
                                    variant: "destructive",
                                  });
                                }
                              }} 
                              variant="hero" 
                              className="w-full"
                            >
                              Save Address
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </Card>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="w-4 h-4 text-primary" />
                      Pickup Time
                    </Label>
                    <Input
                      type="datetime-local"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="rounded-2xl h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <Clock className="w-4 h-4 text-primary" />
                      Delivery Time
                    </Label>
                    <Input
                      type="datetime-local"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="rounded-2xl h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Special Instructions (Optional)
                  </Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests or instructions..."
                    className="rounded-2xl min-h-[90px]"
                    rows={3}
                  />
                </div>
              </Card>

              <Button
                onClick={() => setStep("confirm")}
                className="w-full rounded-2xl h-14 text-lg shadow-glow"
                variant="hero"
              >
                Review Order
              </Button>
            </motion.div>
          )}

          {/* Step 3: Confirm Order */}
          {step === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <h2 className="text-xl font-semibold">Confirm Your Order</h2>

              {/* Selected Services */}
              <Card className="rounded-3xl p-6 card-glass space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  Selected Services
                </h3>
                <div className="space-y-3">
                  {Array.from(selectedServices).map(serviceId => {
                    const service = services.find((s) => s.id === serviceId);
                    if (!service) return null;
                    
                    return (
                      <div key={serviceId} className="flex items-center justify-between pb-3 border-b border-border/50">
                        <span className="font-medium text-primary">
                          {service.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ₹{service.price} /item × {getTotalItems()} = ₹{service.price * getTotalItems()}
                        </span>
                      </div>
                    );
                  })}
                  <div className="space-y-2">
                    {Array.from(clothCounts.entries()).map(
                      ([clothId, count]) => {
                        const clothItem = clothItems.find(
                          (c) => c.id === clothId,
                        );
                        if (!clothItem) return null;

                        return (
                          <div
                            key={clothId}
                            className="flex items-center justify-between py-2"
                          >
                            <div className="flex items-center gap-3">
                              <Badge
                                variant="secondary"
                                className="min-w-[3rem] justify-center"
                              >
                                {count}×
                              </Badge>
                              <span className="font-medium">
                                {clothItem.name}
                              </span>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <span className="font-semibold">Total Items</span>
                    <span className="font-bold text-primary text-lg">
                      {getTotalItems()}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Address & Timing */}
              <Card className="rounded-3xl p-6 card-glass space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Pickup & Delivery
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-2xl">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm mb-1">Address</p>
                      <p className="text-muted-foreground text-sm break-words">
                        {getSelectedAddress() || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-2xl">
                      <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm mb-1">Pickup</p>
                        <p className="text-muted-foreground text-sm">
                          {pickupTime || "Not specified"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-2xl">
                      <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm mb-1">Delivery</p>
                        <p className="text-muted-foreground text-sm">
                          {deliveryTime || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {notes && (
                    <div className="p-4 bg-muted/30 rounded-2xl">
                      <p className="font-medium text-sm mb-2">
                        Special Instructions
                      </p>
                      <p className="text-muted-foreground text-sm break-words">
                        {notes}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Coupon Code Section */}
              <Card className="rounded-3xl p-6 card-glass space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" />
                  Apply Coupon Code
                </h3>
                {!appliedCoupon ? (
                  <div className="flex gap-3">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="rounded-2xl flex-1 uppercase"
                      disabled={couponValidating}
                    />
                    <Button
                      onClick={validateAndApplyCoupon}
                      disabled={couponValidating || !couponCode.trim()}
                      className="rounded-2xl"
                      variant="default"
                    >
                      {couponValidating ? "Validating..." : "Apply"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-primary/10 rounded-2xl border-2 border-primary">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="rounded-lg">
                          {appliedCoupon.code}
                        </Badge>
                        <span className="text-sm text-primary font-semibold">
                          {appliedCoupon.discount}% OFF
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {appliedCoupon.description}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={removeCoupon}
                      className="rounded-full h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </Card>

              {/* Total */}
              <Card className="rounded-3xl p-6 gradient-primary text-white shadow-glow">
                {appliedCoupon ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-white/70 text-sm">
                      <span>Subtotal</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                    <div className="flex items-center justify-between text-green-300 text-sm font-semibold">
                      <span>Discount ({appliedCoupon.discount}%)</span>
                      <span>- ₹{calculateDiscount()}</span>
                    </div>
                    <div className="border-t border-white/20 pt-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/80 text-sm font-medium">
                            Final Amount
                          </p>
                          <p className="text-4xl font-bold mt-1">
                            ₹{calculateFinalTotal()}
                          </p>
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm font-medium">
                        Total Amount
                      </p>
                      <p className="text-4xl font-bold mt-1">
                        ₹{calculateTotal()}
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
              </Card>

              <Button
                onClick={handlePlaceOrder}
                className="w-full rounded-2xl h-14 text-lg glow-button pulse-glow"
                variant="hero"
              >
                Place Order & Get QR Code
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* QR Code Modal */}
      {generatedOrder && (
        <QRCodeModal
          open={showQR}
          onOpenChange={handleCloseQR}
          qrData={`LAUNDRY-${generatedOrder}`}
          orderId={generatedOrder}
        />
      )}
    </div>
  );
};

export default NewOrder;
