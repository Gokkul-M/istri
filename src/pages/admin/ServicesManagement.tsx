import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Plus, Trash2, Edit2, Package, DollarSign, Loader2 } from "lucide-react";
import { useFirebaseUsers } from "@/hooks/useFirebaseUsers";
import { useFirebaseServices } from "@/hooks/useFirebaseServices";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const ServicesManagement = () => {
  const { users, loading: usersLoading } = useFirebaseUsers();
  const { services, loading: servicesLoading } = useFirebaseServices();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedLaunderer, setSelectedLaunderer] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  
  const loading = usersLoading || servicesLoading;
  const launderers = users.filter(u => u.role === 'launderer');

  const filteredLaunderers = launderers.filter(launderer =>
    launderer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    launderer.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddService = () => {
    if (!selectedLaunderer || !serviceName || !servicePrice) {
      toast.error("Please fill all required fields");
      return;
    }
    
    toast.success("Service assigned to launderer successfully");
    setIsAddDialogOpen(false);
    setSelectedLaunderer("");
    setServiceName("");
    setServicePrice("");
    setServiceDescription("");
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      <div>
        <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent tracking-tight">Services Management</h1>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Assign services to launderers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-none shadow-soft rounded-[1.5rem]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Package className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Services</p>
                <h3 className="text-xl font-bold">{services.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft rounded-[1.5rem]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/10 p-2 rounded-[1.25rem]">
                <DollarSign className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Launderers</p>
                <h3 className="text-xl font-bold">{launderers.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Add */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search launderers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Service to Launderer</DialogTitle>
              <DialogDescription>
                Add a new service offering to a launderer's profile
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
                        {launderer.businessName} - {launderer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Service Type</Label>
                <Select value={serviceName} onValueChange={setServiceName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.name}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Custom Price (₹)</Label>
                <Input
                  type="number"
                  placeholder="Enter custom price"
                  value={servicePrice}
                  onChange={(e) => setServicePrice(e.target.value)}
                />
              </div>
              <div>
                <Label>Description (Optional)</Label>
                <Input
                  placeholder="Additional details..."
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                />
              </div>
              <Button onClick={handleAddService} className="w-full">
                Assign Service
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Launderers List */}
      <div className="space-y-3">
        {filteredLaunderers.map((launderer) => (
          <Card key={launderer.id} className="border-none shadow-medium rounded-[1.5rem]">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">
                      {launderer.businessName?.charAt(0) || launderer.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{launderer.businessName}</p>
                    <p className="text-sm text-muted-foreground">{launderer.name}</p>
                  </div>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Base Price/Kg</span>
                  <span className="font-semibold text-primary">₹{launderer.pricePerKg}/kg</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Services Offered</span>
                  <Badge variant="outline">{services.length} services</Badge>
                </div>
              </div>

              {/* Services List */}
              <div className="space-y-2 pt-3 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Available Services:</p>
                <div className="grid grid-cols-2 gap-2">
                  {services.slice(0, 4).map((service) => (
                    <div key={service.id} className="flex items-center justify-between bg-muted/50 rounded-lg p-2">
                      <span className="text-xs">{service.name}</span>
                      <span className="text-xs font-semibold text-primary">₹{service.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit2 className="w-3 h-3 mr-1" />
                  Edit Services
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesManagement;
