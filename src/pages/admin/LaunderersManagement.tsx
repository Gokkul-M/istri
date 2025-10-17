import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, CheckCircle, XCircle, Star, TrendingUp, DollarSign, MessageSquare, BarChart3, Loader2 } from "lucide-react";
import { useFirebaseUsers } from "@/hooks/useFirebaseUsers";
import { useFirebaseOrders } from "@/hooks/useFirebaseOrders";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const LaunderersManagement = () => {
  const { users, loading: usersLoading, verifyLaunderer } = useFirebaseUsers();
  const { orders, loading: ordersLoading } = useFirebaseOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLaunderer, setSelectedLaunderer] = useState<string | null>(null);
  const [messageContent, setMessageContent] = useState("");
  
  const loading = usersLoading || ordersLoading;
  const launderers = users.filter(u => u.role === 'launderer');
  const pendingLaunderers = launderers.filter(l => !l.verified);
  const verifiedLaunderers = launderers.filter(l => l.verified);

  const getLaundererOrders = (laundererId: string) => {
    return orders.filter(o => o.laundererId === laundererId);
  };

  const getLaundererStats = (laundererId: string) => {
    const laundererOrders = getLaundererOrders(laundererId);
    const completed = laundererOrders.filter(o => o.status === 'completed').length;
    const totalRevenue = laundererOrders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    const ratings = laundererOrders.filter(o => o.rating).map(o => o.rating!);
    const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
    
    return { completed, totalRevenue, avgRating };
  };

  const filterLaunderers = (list: typeof launderers) => {
    return list.filter(launderer => {
      const matchesSearch = launderer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           launderer.businessName?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  };

  const approveLaunderer = (id: string) => {
    verifyLaunderer(id, true);
    toast.success("Launderer approved successfully");
  };

  const rejectLaunderer = (id: string) => {
    verifyLaunderer(id, false);
    toast.error("Launderer rejected");
  };

  const handleSendMessage = () => {
    if (!selectedLaunderer || !messageContent.trim()) {
      toast.error("Please enter a message");
      return;
    }
    
    setMessageContent("");
    setSelectedLaunderer(null);
    toast.success("Message sent successfully");
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4 pb-20">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-none shadow-soft rounded-[1.5rem]">
              <CardContent className="p-4">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      <div>
        <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent tracking-tight">Launderers</h1>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Manage service providers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-none shadow-soft rounded-[1.5rem]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <h3 className="text-xl font-bold">{launderers.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft rounded-[1.5rem]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/10 p-2 rounded-[1.25rem]">
                <Star className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <h3 className="text-xl font-bold">{pendingLaunderers.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft rounded-[1.5rem]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-2 rounded-[1.25rem]">
                <CheckCircle className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Verified</p>
                <h3 className="text-xl font-bold">{verifiedLaunderers.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft rounded-[1.5rem]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-tertiary/10 p-2 rounded-[1.25rem]">
                <TrendingUp className="w-5 h-5 text-tertiary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Rating</p>
                <h3 className="text-xl font-bold">
                  {verifiedLaunderers.length > 0 
                    ? (verifiedLaunderers.reduce((sum, l) => {
                        const stats = getLaundererStats(l.id);
                        return sum + stats.avgRating;
                      }, 0) / verifiedLaunderers.length).toFixed(1)
                    : '0.0'}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search launderers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 rounded-[1.25rem]"
        />
      </div>

      {/* Launderers Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
        </TabsList>
        
        {/* Pending Launderers */}
        <TabsContent value="pending" className="space-y-3">
          {filterLaunderers(pendingLaunderers).length === 0 ? (
            <Card className="border-none shadow-medium rounded-[1.5rem]">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No pending approvals</p>
              </CardContent>
            </Card>
          ) : (
            filterLaunderers(pendingLaunderers).map((launderer) => {
              const laundererOrders = getLaundererOrders(launderer.id);
              const stats = getLaundererStats(launderer.id);
              
              return (
                <Card key={launderer.id} className="border-none shadow-medium rounded-[1.5rem]">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-semibold text-lg">
                          {launderer.businessName?.charAt(0) || launderer.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold truncate">{launderer.businessName}</h3>
                          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 flex-shrink-0">
                            Pending
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{launderer.name}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="font-medium">{launderer.phone}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium truncate ml-2">{launderer.email}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Price/Kg</span>
                        <span className="font-semibold text-primary">₹{launderer.pricePerKg}/kg</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => rejectLaunderer(launderer.id)}
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        className="flex-1"
                        onClick={() => approveLaunderer(launderer.id)}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* Verified Launderers */}
        <TabsContent value="verified" className="space-y-3">
          {filterLaunderers(verifiedLaunderers).map((launderer) => {
            const laundererOrders = getLaundererOrders(launderer.id);
            const stats = getLaundererStats(launderer.id);
            
            return (
            <Card key={launderer.id} className="border-none shadow-medium rounded-[1.5rem]">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold text-lg">
                      {launderer.businessName?.charAt(0) || launderer.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold truncate">{launderer.businessName}</h3>
                      <Badge className="bg-secondary text-secondary-foreground flex-shrink-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{launderer.name}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">{launderer.phone}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium truncate ml-2">{launderer.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Price/Kg</span>
                    <span className="font-semibold text-primary">₹{launderer.pricePerKg}/kg</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Orders</span>
                    <Badge variant="outline">{laundererOrders.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avg Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="font-semibold">{stats.avgRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-3 pt-3 border-t">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Orders</p>
                    <p className="font-semibold text-sm">{laundererOrders.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Completed</p>
                    <p className="font-semibold text-sm text-green-600">{stats.completed}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Revenue</p>
                    <p className="font-semibold text-sm text-primary">₹{stats.totalRevenue}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedLaunderer(launderer.id)}
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Message
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Message to {launderer.businessName}</DialogTitle>
                        <DialogDescription>
                          Send a direct message to this launderer
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Type your message..."
                          value={selectedLaunderer === launderer.id ? messageContent : ""}
                          onChange={(e) => setMessageContent(e.target.value)}
                          rows={4}
                        />
                        <Button onClick={handleSendMessage} className="w-full">
                          Send Message
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" className="flex-1">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LaunderersManagement;
