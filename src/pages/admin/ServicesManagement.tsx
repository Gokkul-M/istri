import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Trash2, Edit2, Package, DollarSign, Loader2 } from "lucide-react";
import { useFirebaseServices } from "@/hooks/useFirebaseServices";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const ServicesManagement = () => {
  const { services, loading, addService, updateService, deleteService } = useFirebaseServices();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  
  // Form states
  const [serviceName, setServiceName] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceIcon, setServiceIcon] = useState("");

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddService = async () => {
    if (!serviceName || !servicePrice) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      await addService({
        name: serviceName,
        price: Number(servicePrice),
        description: serviceDescription,
        icon: serviceIcon || 'package',
      });
      
      toast.success("Service added successfully");
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error("Failed to add service");
    }
  };

  const handleEditService = async () => {
    if (!editingService || !serviceName || !servicePrice) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      await updateService(editingService.id, {
        name: serviceName,
        price: Number(servicePrice),
        description: serviceDescription,
        icon: serviceIcon || 'package',
      });
      
      toast.success("Service updated successfully");
      setIsEditDialogOpen(false);
      setEditingService(null);
      resetForm();
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error("Failed to update service");
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    try {
      await deleteService(serviceId);
      toast.success("Service deleted successfully");
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Failed to delete service");
    }
  };

  const openEditDialog = (service: any) => {
    setEditingService(service);
    setServiceName(service.name);
    setServicePrice(service.price.toString());
    setServiceDescription(service.description || "");
    setServiceIcon(service.icon || "");
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setServiceName("");
    setServicePrice("");
    setServiceDescription("");
    setServiceIcon("");
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4 pb-20">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20 rounded-[1.5rem]" />
          <Skeleton className="h-20 rounded-[1.5rem]" />
        </div>
        <Skeleton className="h-12 rounded-lg" />
        <Skeleton className="h-32 rounded-[1.5rem]" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      <div>
        <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent tracking-tight">Services Management</h1>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Manage global laundry services</p>
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
                <p className="text-xs text-muted-foreground">Avg Price</p>
                <h3 className="text-xl font-bold">
                  ₹{services.length > 0 ? Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length) : 0}
                </h3>
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
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Add Service Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button size="icon" className="shrink-0">
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>
                Create a new laundry service that will be available for all orders
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Service Name *</Label>
                <Input
                  placeholder="e.g., Dry Cleaning, Ironing"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                />
              </div>
              <div>
                <Label>Price (₹) *</Label>
                <Input
                  type="number"
                  placeholder="Enter price per piece"
                  value={servicePrice}
                  onChange={(e) => setServicePrice(e.target.value)}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Service description..."
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label>Icon Name (optional)</Label>
                <Input
                  placeholder="e.g., sparkles, washing-machine, iron"
                  value={serviceIcon}
                  onChange={(e) => setServiceIcon(e.target.value)}
                />
              </div>
              <Button onClick={handleAddService} className="w-full">
                Add Service
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Service Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setEditingService(null);
            resetForm();
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
              <DialogDescription>
                Update service details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Service Name *</Label>
                <Input
                  placeholder="e.g., Dry Cleaning, Ironing"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                />
              </div>
              <div>
                <Label>Price (₹) *</Label>
                <Input
                  type="number"
                  placeholder="Enter price per piece"
                  value={servicePrice}
                  onChange={(e) => setServicePrice(e.target.value)}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Service description..."
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label>Icon Name (optional)</Label>
                <Input
                  placeholder="e.g., sparkles, washing-machine, iron"
                  value={serviceIcon}
                  onChange={(e) => setServiceIcon(e.target.value)}
                />
              </div>
              <Button onClick={handleEditService} className="w-full">
                Update Service
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services List */}
      {filteredServices.length === 0 ? (
        <Card className="border-none shadow-medium rounded-[1.5rem] p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Services Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Try a different search term" : "Get started by adding your first service"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Service
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredServices.map((service) => (
            <Card key={service.id} className="border-none shadow-medium rounded-[1.5rem]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {service.description || "No description"}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-tertiary/10 text-tertiary hover:bg-tertiary/20">
                          ₹{service.price}/piece
                        </Badge>
                        {service.icon && (
                          <Badge variant="outline" className="text-xs">
                            {service.icon}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(service)}
                      className="h-9 w-9"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteService(service.id)}
                      className="h-9 w-9 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;
