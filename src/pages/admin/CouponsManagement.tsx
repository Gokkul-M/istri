import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Ticket, Trash2, Users, Calendar, Loader2, Edit2 } from "lucide-react";
import { useFirebaseCoupons } from "@/hooks/useFirebaseCoupons";
import { useFirebaseUsers } from "@/hooks/useFirebaseUsers";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CouponsManagement = () => {
  const { coupons, loading: couponsLoading, addCoupon, updateCoupon, deleteCoupon } = useFirebaseCoupons();
  const { users, loading: usersLoading } = useFirebaseUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: 10,
    description: "",
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: 100,
  });

  const loading = couponsLoading || usersLoading;
  const customers = users.filter(u => u.role === 'customer');
  const activeCoupons = coupons.filter(c => c.isActive);

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coupon.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCoupon = () => {
    if (!newCoupon.code || !newCoupon.description) {
      toast.error("Please fill all required fields");
      return;
    }

    const coupon = {
      id: `CPN${Date.now()}`,
      ...newCoupon,
      usedCount: 0,
      isActive: true,
      createdBy: "ADMIN",
    };

    addCoupon(coupon);
    toast.success("Coupon created successfully");
    setIsAddDialogOpen(false);
    setNewCoupon({
      code: "",
      discount: 10,
      description: "",
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      usageLimit: 100,
    });
  };

  const handleDeleteCoupon = async () => {
    if (!deleteConfirmId) return;
    
    setIsDeleting(true);
    try {
      await deleteCoupon(deleteConfirmId);
      toast.success("Coupon deleted successfully");
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error("Failed to delete coupon");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleCouponStatus = async (id: string, isActive: boolean) => {
    try {
      await updateCoupon(id, { isActive: !isActive });
      toast.success(`Coupon ${!isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error("Failed to update coupon status");
      console.error("Toggle status error:", error);
    }
  };

  const openEditDialog = (coupon: any) => {
    setEditingCoupon({
      id: coupon.id,
      code: coupon.code,
      discount: coupon.discount,
      description: coupon.description,
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      usageLimit: coupon.usageLimit,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCoupon = async () => {
    if (!editingCoupon || !editingCoupon.code || !editingCoupon.description) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsUpdating(true);
    try {
      const { id, ...updates } = editingCoupon;
      await updateCoupon(id, updates);
      toast.success("Coupon updated successfully");
      setIsEditDialogOpen(false);
      setEditingCoupon(null);
    } catch (error) {
      toast.error("Failed to update coupon");
      console.error("Update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      <div>
        <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent tracking-tight">Coupons</h1>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Manage discount coupons</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-none shadow-soft rounded-[1.5rem]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Ticket className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <h3 className="text-xl font-bold">{coupons.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft rounded-[1.5rem]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-tertiary/10 p-2 rounded-[1.25rem]">
                <Ticket className="w-4 h-4 text-tertiary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <h3 className="text-xl font-bold">{activeCoupons.length}</h3>
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
            placeholder="Search coupons..."
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
              <DialogTitle>Create New Coupon</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Coupon Code</Label>
                <Input
                  placeholder="e.g., SAVE20"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                />
              </div>
              <div>
                <Label>Discount (%)</Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={newCoupon.discount}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discount: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe the offer..."
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Valid From</Label>
                  <Input
                    type="date"
                    value={newCoupon.validFrom}
                    onChange={(e) => setNewCoupon({ ...newCoupon, validFrom: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Valid Until</Label>
                  <Input
                    type="date"
                    value={newCoupon.validUntil}
                    onChange={(e) => setNewCoupon({ ...newCoupon, validUntil: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Usage Limit</Label>
                <Input
                  type="number"
                  min="1"
                  value={newCoupon.usageLimit}
                  onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: parseInt(e.target.value) })}
                />
              </div>
              <Button onClick={handleAddCoupon} className="w-full">
                Create Coupon
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Coupons List */}
      <div className="space-y-3">
        {filteredCoupons.map((coupon) => (
          <Card key={coupon.id} className="border-none shadow-medium rounded-[1.5rem]">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{coupon.code}</p>
                    <Badge variant={coupon.isActive ? "default" : "secondary"}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{coupon.discount}%</p>
                  <p className="text-xs text-muted-foreground">OFF</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3">{coupon.description}</p>

              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>Until: {new Date(coupon.validUntil).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-3 h-3" />
                  <span>Used: {coupon.usedCount}/{coupon.usageLimit}</span>
                </div>
              </div>

              {coupon.assignedTo && coupon.assignedTo.length > 0 && (
                <Badge variant="outline" className="mb-3">
                  Assigned to {coupon.assignedTo.length} customer(s)
                </Badge>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => toggleCouponStatus(coupon.id, coupon.isActive)}
                >
                  {coupon.isActive ? "Deactivate" : "Activate"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(coupon)}
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteConfirmId(coupon.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Coupon Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Coupon</DialogTitle>
            <DialogDescription>Update coupon details</DialogDescription>
          </DialogHeader>
          {editingCoupon && (
            <div className="space-y-4">
              <div>
                <Label>Coupon Code</Label>
                <Input
                  placeholder="e.g., SAVE20"
                  value={editingCoupon.code}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                />
              </div>
              <div>
                <Label>Discount (%)</Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={editingCoupon.discount}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, discount: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe the offer..."
                  value={editingCoupon.description}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Valid From</Label>
                  <Input
                    type="date"
                    value={editingCoupon.validFrom}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, validFrom: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Valid Until</Label>
                  <Input
                    type="date"
                    value={editingCoupon.validUntil}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, validUntil: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Usage Limit</Label>
                <Input
                  type="number"
                  min="1"
                  value={editingCoupon.usageLimit}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, usageLimit: parseInt(e.target.value) })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateCoupon}
              disabled={isUpdating}
            >
              {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Coupon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Coupon?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the coupon and remove it from all customer accounts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCoupon}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CouponsManagement;
