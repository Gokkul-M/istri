import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, User, Loader2 } from "lucide-react";
import { useFirebaseUsers } from "@/hooks/useFirebaseUsers";
import { useFirebaseOrders } from "@/hooks/useFirebaseOrders";
import { Skeleton } from "@/components/ui/skeleton";

const LocationTracking = () => {
  const { users, loading: usersLoading } = useFirebaseUsers();
  const { orders, loading: ordersLoading } = useFirebaseOrders();
  
  const loading = usersLoading || ordersLoading;
  const activeLaunderers = users.filter(u => u.role === 'launderer');
  const activeOrders = orders.filter(o => 
    ['picked_up', 'in_progress', 'out_for_delivery'].includes(o.status)
  );

  if (loading) {
    return (
      <div className="p-4 space-y-4 pb-20">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Card className="border-none shadow-medium rounded-[1.5rem]">
          <CardContent className="p-4">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      <div>
        <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent tracking-tight">Location Tracking</h1>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Real-time tracking</p>
      </div>

      <div className="space-y-4">
        {/* Map Placeholder */}
        <Card className="border-none shadow-medium rounded-[1.5rem]">
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="w-4 h-4 text-primary" />
              Live Map View
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
              <div className="text-center z-10">
                <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                <p className="text-base font-semibold">Interactive Map</p>
                <p className="text-xs text-muted-foreground mt-1">Real-time locations</p>
              </div>
              
              {/* Mock markers */}
              <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-tertiary rounded-full animate-pulse shadow-lg" />
              <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-accent rounded-full animate-pulse shadow-lg" />
              <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-secondary rounded-full animate-pulse shadow-lg" />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-tertiary rounded-full flex-shrink-0" />
                <span className="text-xs">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-accent rounded-full flex-shrink-0" />
                <span className="text-xs">Pickup</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 bg-secondary rounded-full flex-shrink-0" />
                <span className="text-xs">Delivery</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Launderers List */}
        <Card className="border-none shadow-medium rounded-[1.5rem]">
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-4 h-4 text-secondary" />
              Active Launderers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {activeLaunderers.map((launderer) => {
                const activeOrder = activeOrders.find(o => o.laundererId === launderer.id);
                
                return (
                  <div key={launderer.id} className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-semibold text-sm">
                            {launderer.name.charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{launderer.businessName}</p>
                          <p className="text-xs text-muted-foreground truncate">{launderer.name}</p>
                        </div>
                      </div>
                      <Badge className={activeOrder ? "bg-secondary text-secondary-foreground text-xs" : "bg-muted text-xs"}>
                        {activeOrder ? 'Active' : 'Free'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{launderer.pinCode} • {launderer.distance}km</span>
                    </div>
                    
                    {activeOrder && (
                      <div className="mt-2 pt-2 border-t border-border">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Navigation className="w-3 h-3 text-accent flex-shrink-0" />
                          <span className="text-accent font-medium truncate">
                            {activeOrder.status === 'picked_up' ? 'Returning' : 
                             activeOrder.status === 'out_for_delivery' ? 'Delivering' : 
                             'Processing'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">#{activeOrder.id}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Deliveries */}
      <Card className="border-none shadow-medium rounded-[1.5rem]">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Navigation className="w-4 h-4 text-accent" />
            Active Deliveries
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            {activeOrders.map((order) => (
              <Card key={order.id} className="border-none shadow-soft rounded-[1.25rem]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-secondary text-secondary-foreground text-xs">
                      {order.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">#{order.id}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="text-xs text-muted-foreground">Customer</p>
                      <p className="font-semibold text-sm text-right">{order.customerName}</p>
                    </div>
                    
                    <div className="flex justify-between items-start">
                      <p className="text-xs text-muted-foreground">Launderer</p>
                      <p className="font-medium text-sm text-right">{order.laundererName}</p>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-xs flex-1">{order.customerAddress}</p>
                    </div>
                    
                    <div className="pt-2 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Est. Time</span>
                      <span className="font-semibold text-sm text-primary">25 mins</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationTracking;
