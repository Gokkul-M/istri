import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, UserCheck, Star, Phone, MapPin, UserX, Building2, Ticket, Loader2 } from "lucide-react";
import { useFirebaseUsers } from "@/hooks/useFirebaseUsers";
import { useFirebaseOrders } from "@/hooks/useFirebaseOrders";
import { useFirebaseCoupons } from "@/hooks/useFirebaseCoupons";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const CustomersManagement = () => {
  const { users, loading: usersLoading, updateUser, assignLaundererToCustomer } = useFirebaseUsers();
  const { orders, loading: ordersLoading } = useFirebaseOrders();
  const { coupons, loading: couponsLoading, assignCouponToCustomer } = useFirebaseCoupons();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedLaunderer, setSelectedLaunderer] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState("");
  
  const loading = usersLoading || ordersLoading || couponsLoading;
  const customers = users.filter(u => u.role === 'customer');
  const launderers = users.filter(u => u.role === 'launderer');
  const activeCoupons = coupons.filter(c => c.isActive);

  const getCustomerOrders = (customerId: string) => {
    return orders.filter(o => o.customerId === customerId);
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone.includes(searchQuery);
    return matchesSearch;
  });

  const toggleCustomerStatus = (customerId: string, isActive: boolean) => {
    updateUser(customerId, { isActive: !isActive });
    toast.success("Customer status updated");
  };

  const handleAssignLaunderer = () => {
    if (!selectedCustomer || !selectedLaunderer) {
      toast.error("Please select a launderer");
      return;
    }
    assignLaundererToCustomer(selectedCustomer, selectedLaunderer);
    toast.success("Launderer assigned successfully");
    setSelectedCustomer(null);
    setSelectedLaunderer("");
  };

  const handleAssignCoupon = () => {
    if (!selectedCustomer || !selectedCoupon) {
      toast.error("Please select a coupon");
      return;
    }
    assignCouponToCustomer(selectedCoupon, selectedCustomer);
    toast.success("Coupon assigned successfully");
    setSelectedCustomer(null);
    setSelectedCoupon("");
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4 pb-20">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <Card key={i} className="border-none shadow-soft rounded-[1.5rem]">
              <CardContent className="p-4">
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-12 w-full rounded-[1.5rem]" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      <div>
        <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent tracking-tight">Customers</h1>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Manage customer accounts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-none shadow-soft rounded-[1.5rem]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/10 p-2 rounded-[1.25rem]">
                <UserCheck className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <h3 className="text-xl font-bold">{customers.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft rounded-[1.5rem]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-tertiary/10 p-2 rounded-lg">
                <UserCheck className="w-4 h-4 text-tertiary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <h3 className="text-xl font-bold">{customers.filter(c => c.isActive !== false).length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-none shadow-soft rounded-[1.5rem]">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-[1.25rem]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <div className="space-y-3">
        {filteredCustomers.map((customer) => {
          const customerOrders = getCustomerOrders(customer.id);
          const assignedLaunderer = customer.assignedLaundererId 
            ? launderers.find(l => l.id === customer.assignedLaundererId)
            : null;
          const customerCoupons = coupons.filter(c => 
            c.assignedTo?.includes(customer.id)
          );
          
          return (
            <Card key={customer.id} className="border-none shadow-medium rounded-[1.5rem]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">
                        {customer.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{customer.name}</p>
                      <Badge variant={customer.isActive !== false ? "default" : "secondary"} className="text-xs">
                        {customer.isActive !== false ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-accent text-accent" />
                    <span className="text-sm font-semibold">4.5</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{customer.address}</span>
                  </div>
                  {assignedLaunderer && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="w-3 h-3 text-primary" />
                      <span className="font-medium text-primary">
                        {assignedLaunderer.businessName}
                      </span>
                    </div>
                  )}
                  {customerCoupons.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Ticket className="w-3 h-3 text-tertiary" />
                      <span className="text-tertiary font-medium">
                        {customerCoupons.length} coupon(s)
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border mb-3">
                  <Badge variant="secondary">{customerOrders.length} orders</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedCustomer(customer.id)}
                      >
                        <Building2 className="w-3 h-3 mr-1" />
                        Assign Launderer
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Assign Launderer</DialogTitle>
                        <DialogDescription>
                          Select a launderer to assign to this customer for their orders
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Select Launderer</Label>
                          <Select value={selectedLaunderer} onValueChange={setSelectedLaunderer}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a launderer" />
                            </SelectTrigger>
                            <SelectContent>
                              {launderers.map((launderer) => (
                                <SelectItem key={launderer.id} value={launderer.id}>
                                  {launderer.businessName} - ₹{launderer.pricePerKg}/kg
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleAssignLaunderer} className="w-full">
                          Assign
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedCustomer(customer.id)}
                      >
                        <Ticket className="w-3 h-3 mr-1" />
                        Assign Coupon
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Assign Coupon</DialogTitle>
                        <DialogDescription>
                          Select a coupon to assign to this customer
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Select Coupon</Label>
                          <Select value={selectedCoupon} onValueChange={setSelectedCoupon}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a coupon" />
                            </SelectTrigger>
                            <SelectContent>
                              {activeCoupons.map((coupon) => (
                                <SelectItem key={coupon.id} value={coupon.id}>
                                  {coupon.code} - {coupon.discount}% OFF
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleAssignCoupon} className="w-full">
                          Assign
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CustomersManagement;
