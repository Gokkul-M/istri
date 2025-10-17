import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Tag, Bell, FileText, Plus, X } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SystemSettings = () => {
  const [categories, setCategories] = useState([
    "Wash & Fold",
    "Dry Cleaning",
    "Ironing",
    "Shoe Cleaning"
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [announcement, setAnnouncement] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
      toast.success("Category added successfully");
    }
  };

  const handleRemoveCategory = (index: number) => {
    const updated = categories.filter((_, i) => i !== index);
    setCategories(updated);
    toast.success("Category removed");
  };

  const handleSendAnnouncement = () => {
    if (announcement.trim()) {
      toast.success("Announcement sent to all users");
      setAnnouncement("");
    }
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      <div>
        <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">System configuration</p>
      </div>

      <Card className="border-none shadow-medium rounded-[1.5rem]">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2 text-base tracking-tight">
            <Tag className="w-4 h-4" />
            Service Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          <div className="space-y-2 mb-4">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-[1rem]">
                <span className="font-medium">{category}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveCategory(index)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full rounded-[1.25rem]">
                <Plus className="w-4 h-4 mr-2" />
                Add New Category
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2rem]">
              <DialogHeader>
                <DialogTitle>Add Service Category</DialogTitle>
                <DialogDescription>
                  Create a new service category for your laundry business
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="category">Category Name</Label>
                  <Input
                    id="category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="e.g., Leather Cleaning"
                    className="rounded-[1.25rem]"
                  />
                </div>
                <Button onClick={handleAddCategory} className="w-full rounded-[1.25rem]">
                  Add Category
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card className="border-none shadow-medium rounded-[1.5rem]">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2 text-base tracking-tight">
            <Bell className="w-4 h-4" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          <Label className="text-sm">App-wide Announcement</Label>
          <Textarea 
            placeholder="Enter announcement message" 
            className="min-h-[100px] rounded-[1.25rem]"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
          />
          <Button onClick={handleSendAnnouncement} className="w-full rounded-[1.25rem]">
            <Bell className="w-4 h-4 mr-2" />
            Send Notification
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;
