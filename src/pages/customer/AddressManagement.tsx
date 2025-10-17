import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, MapPin, Plus, Edit2, Trash2, Home, Briefcase, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAddresses } from "@/hooks/useAddresses";
import { Skeleton } from "@/components/ui/skeleton";

const AddressManagement = () => {
  const { toast } = useToast();
  const { addresses, loading, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddresses();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [newAddress, setNewAddress] = useState({
    label: "Home",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: false
  });

  const [editAddressData, setEditAddressData] = useState({
    label: "Home",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    isDefault: false
  });

  const getIconForLabel = (label: string) => {
    const lowercaseLabel = label.toLowerCase();
    if (lowercaseLabel === 'home') return Home;
    if (lowercaseLabel === 'work') return Briefcase;
    return Building;
  };

  const handleAddAddress = async () => {
    if (!newAddress.addressLine1 || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addAddress(newAddress);
      toast({
        title: "Address Added",
        description: "New address has been added successfully.",
      });
      setNewAddress({ 
        label: "Home", 
        addressLine1: "", 
        addressLine2: "", 
        city: "", 
        state: "", 
        zipCode: "", 
        isDefault: false 
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditAddress = async () => {
    if (!editingAddress) return;
    
    if (!editAddressData.addressLine1 || !editAddressData.city || !editAddressData.state || !editAddressData.zipCode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateAddress(editingAddress, editAddressData);
      toast({
        title: "Address Updated",
        description: "Address has been updated successfully.",
      });
      setEditingAddress(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    const address = addresses.find(a => a.id === id);
    if (address?.isDefault) {
      toast({
        title: "Cannot Delete",
        description: "You cannot delete your default address. Set another address as default first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await deleteAddress(id);
      toast({
        title: "Address Deleted",
        description: "Address has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      toast({
        title: "Default Address Updated",
        description: "Default address has been changed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set default address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (address: any) => {
    setEditingAddress(address.id);
    setEditAddressData({
      label: address.label,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      isDefault: address.isDefault,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <div className="gradient-primary p-6 pb-8 rounded-b-[3rem] mb-6 shadow-medium">
        <div className="flex items-center justify-between">
          <Link to="/customer/settings">
            <Button variant="ghost" size="icon" className="text-white" data-testid="button-back">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">Addresses</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white" data-testid="button-add-address">
                <Plus className="w-6 h-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl">
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="label">Label</Label>
                  <Select 
                    value={newAddress.label} 
                    onValueChange={(value) => setNewAddress({ ...newAddress, label: value })}
                  >
                    <SelectTrigger className="rounded-2xl" data-testid="select-label">
                      <SelectValue placeholder="Select label" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Home">Home</SelectItem>
                      <SelectItem value="Work">Work</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    placeholder="123 Main Street, Apt 4B"
                    value={newAddress.addressLine1}
                    onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                    className="rounded-2xl"
                    data-testid="input-address-line1"
                  />
                </div>
                <div>
                  <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                  <Input
                    id="addressLine2"
                    placeholder="Building, Floor, etc."
                    value={newAddress.addressLine2}
                    onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                    className="rounded-2xl"
                    data-testid="input-address-line2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="rounded-2xl"
                      data-testid="input-city"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="NY"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="rounded-2xl"
                      data-testid="input-state"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    placeholder="10001"
                    value={newAddress.zipCode}
                    onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                    className="rounded-2xl"
                    data-testid="input-zipcode"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isDefault" 
                    checked={newAddress.isDefault}
                    onCheckedChange={(checked) => setNewAddress({ ...newAddress, isDefault: checked as boolean })}
                    data-testid="checkbox-default"
                  />
                  <Label htmlFor="isDefault" className="cursor-pointer">Set as default address</Label>
                </div>
                <Button onClick={handleAddAddress} variant="hero" className="w-full" data-testid="button-save-address">
                  Add Address
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="px-6 space-y-3">
        {loading ? (
          <>
            <Skeleton className="h-32 rounded-[2rem]" />
            <Skeleton className="h-32 rounded-[2rem]" />
          </>
        ) : addresses.length > 0 ? (
          addresses.map((addr) => {
            const IconComponent = getIconForLabel(addr.label);
            return (
              <Card key={addr.id} className="rounded-[2rem] p-5 border-border/30 shadow-soft hover-lift" data-testid={`card-address-${addr.id}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${addr.isDefault ? 'gradient-primary' : 'bg-muted'} flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className={`w-6 h-6 ${addr.isDefault ? 'text-white' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{addr.label}</h3>
                      {addr.isDefault && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{addr.addressLine1}</p>
                    {addr.addressLine2 && (
                      <p className="text-sm text-muted-foreground">{addr.addressLine2}</p>
                    )}
                    <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.zipCode}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8"
                      onClick={() => openEditDialog(addr)}
                      data-testid={`button-edit-${addr.id}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    {!addr.isDefault && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(addr.id)}
                        data-testid={`button-delete-${addr.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {!addr.isDefault && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={() => handleSetDefault(addr.id)}
                    data-testid={`button-set-default-${addr.id}`}
                  >
                    Set as Default
                  </Button>
                )}
              </Card>
            );
          })
        ) : (
          <Card className="rounded-3xl p-12 text-center">
            <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Addresses</h3>
            <p className="text-sm text-muted-foreground">Add your first address to get started</p>
          </Card>
        )}
      </div>

      {/* Edit Address Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="edit-label">Label</Label>
              <Select 
                value={editAddressData.label} 
                onValueChange={(value) => setEditAddressData({ ...editAddressData, label: value })}
              >
                <SelectTrigger className="rounded-2xl">
                  <SelectValue placeholder="Select label" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-addressLine1">Address Line 1 *</Label>
              <Input
                id="edit-addressLine1"
                placeholder="123 Main Street, Apt 4B"
                value={editAddressData.addressLine1}
                onChange={(e) => setEditAddressData({ ...editAddressData, addressLine1: e.target.value })}
                className="rounded-2xl"
              />
            </div>
            <div>
              <Label htmlFor="edit-addressLine2">Address Line 2 (Optional)</Label>
              <Input
                id="edit-addressLine2"
                placeholder="Building, Floor, etc."
                value={editAddressData.addressLine2}
                onChange={(e) => setEditAddressData({ ...editAddressData, addressLine2: e.target.value })}
                className="rounded-2xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-city">City *</Label>
                <Input
                  id="edit-city"
                  placeholder="New York"
                  value={editAddressData.city}
                  onChange={(e) => setEditAddressData({ ...editAddressData, city: e.target.value })}
                  className="rounded-2xl"
                />
              </div>
              <div>
                <Label htmlFor="edit-state">State *</Label>
                <Input
                  id="edit-state"
                  placeholder="NY"
                  value={editAddressData.state}
                  onChange={(e) => setEditAddressData({ ...editAddressData, state: e.target.value })}
                  className="rounded-2xl"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-zipCode">ZIP Code *</Label>
              <Input
                id="edit-zipCode"
                placeholder="10001"
                value={editAddressData.zipCode}
                onChange={(e) => setEditAddressData({ ...editAddressData, zipCode: e.target.value })}
                className="rounded-2xl"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="edit-isDefault" 
                checked={editAddressData.isDefault}
                onCheckedChange={(checked) => setEditAddressData({ ...editAddressData, isDefault: checked as boolean })}
              />
              <Label htmlFor="edit-isDefault" className="cursor-pointer">Set as default address</Label>
            </div>
            <Button onClick={handleEditAddress} variant="hero" className="w-full">
              Update Address
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressManagement;
