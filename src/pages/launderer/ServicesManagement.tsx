import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Package, DollarSign, Loader2 } from "lucide-react";
import { useFirebaseServices } from "@/hooks/useFirebaseServices";
import { useAuth } from "@/hooks/useFirebaseAuth";
import { Badge } from "@/components/ui/badge";

const ServicesManagement = () => {
  const { services, loading } = useFirebaseServices();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="gradient-primary p-6 pb-8 rounded-b-[3rem] mb-6 shadow-medium">
        <div className="flex items-center justify-between">
          <Link to="/launderer">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">Services & Pricing</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-6 space-y-4">
        <Card className="rounded-[2rem] p-6 bg-muted/30 border-border/30 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Note</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Services are managed by the admin. Contact support to update your service offerings.
          </p>
        </Card>

        <div>
          <h2 className="text-lg font-semibold mb-3">Your Services</h2>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : services.length === 0 ? (
            <Card className="rounded-[2rem] p-8 text-center border-border/30">
              <Package className="w-12 h-12 mx-auto mb-2 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No services available</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {services.map((service) => (
                <Card key={service.id} className="rounded-[2rem] p-5 border-border/30 shadow-soft hover-lift">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{service.name}</h3>
                        <Badge variant="secondary" className="text-xs">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="text-lg font-bold text-primary">₹{service.price}</span>
                        <span className="text-xs text-muted-foreground">base price</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Card className="rounded-3xl p-6 gradient-primary text-white">
          <h3 className="font-semibold mb-2">Your Base Rate</h3>
          <p className="text-3xl font-bold mb-1">₹{user?.pricePerKg || 50}/kg</p>
          <p className="text-sm text-white/80">Applied to all wash & fold services</p>
        </Card>
      </div>
    </div>
  );
};

export default ServicesManagement;
