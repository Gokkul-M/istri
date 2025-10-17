import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Percent,
  Sparkles,
  Calendar,
  Copy,
  Check,
  Ticket,
  ArrowLeft
} from "lucide-react";
import { useState } from "react";
import { useFirebaseCoupons } from "@/hooks/useFirebaseCoupons";
import { toast } from "sonner";

const Offers = () => {
  const navigate = useNavigate();
  const { coupons, loading } = useFirebaseCoupons();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const availableCoupons = coupons;

  const gradients = ["gradient-accent", "gradient-primary", "gradient-secondary", "gradient-tertiary"];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`${code} copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-primary rounded-b-[3rem] p-6 pb-8 mb-6 shadow-medium">
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/customer")}
            className="rounded-full bg-white/20 hover:bg-white/30 text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <Percent className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Special Offers</h1>
          <p className="text-white/90 text-sm leading-relaxed">
            Save more on every order with our exclusive deals
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 space-y-4">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
        ) : availableCoupons.length === 0 ? (
          <Card className="rounded-3xl p-8 text-center">
            <Ticket className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold text-lg mb-2">No Offers Available</h3>
            <p className="text-sm text-muted-foreground">
              Check back later for exciting offers and discounts!
            </p>
          </Card>
        ) : (
          availableCoupons.map((coupon, index) => (
            <Card 
              key={coupon.id} 
              className={`${gradients[index % gradients.length]} rounded-3xl p-6 border-0 relative overflow-hidden`}
            >
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Badge className="bg-white/90 text-foreground hover:bg-white mb-2">
                      Special Offer
                    </Badge>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {coupon.code}
                    </h3>
                    <p className="text-white/90 text-sm mb-3">
                      {coupon.description}
                    </p>
                    <div className="flex items-center gap-2 text-white/80 text-xs">
                      <Calendar className="w-4 h-4" />
                      <span>Valid till {new Date(coupon.validUntil).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                      <p className="text-2xl font-bold text-white">{coupon.discount}% OFF</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3">
                    <p className="text-xs text-white/70 mb-1">Promo Code</p>
                    <p className="text-lg font-bold text-white tracking-wider">
                      {coupon.code}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    className="bg-white/90 text-primary hover:bg-white rounded-xl h-12 w-12"
                    onClick={() => handleCopyCode(coupon.code)}
                  >
                    {copiedCode === coupon.code ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </Button>
                </div>

                <div className="mt-3 text-xs text-white/80">
                  {coupon.usageLimit - coupon.usedCount} uses remaining
                </div>

                <Button 
                  className="w-full mt-4 bg-white/90 text-primary hover:bg-white rounded-xl font-semibold"
                  asChild
                  data-testid={`button-book-now-${coupon.code}`}
                >
                  <Link to={`/customer/new-order?coupon=${coupon.code}`}>
                    Book Now
                  </Link>
                </Button>
              </div>

              {/* Decorative elements */}
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
              <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full" />
            </Card>
          ))
        )}

        {/* How to Use */}
        <Card className="rounded-3xl p-6 mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold text-lg">How to Use Offers</h3>
          </div>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="font-semibold text-primary">1.</span>
              <span>Select your preferred offer and copy the promo code</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-primary">2.</span>
              <span>Create a new order or select a service</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-primary">3.</span>
              <span>Apply the promo code at checkout to get the discount</span>
            </li>
          </ol>
        </Card>
      </div>
    </div>
  );
};

export default Offers;
