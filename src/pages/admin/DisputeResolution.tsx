import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, AlertCircle, CheckCircle, XCircle, MessageSquare, Loader2 } from "lucide-react";
import { useFirebaseDisputes } from "@/hooks/useFirebaseDisputes";
import { useFirebaseOrders } from "@/hooks/useFirebaseOrders";
import { useFirebaseUsers } from "@/hooks/useFirebaseUsers";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const DisputeResolution = () => {
  const { disputes, loading: disputesLoading, updateDispute } = useFirebaseDisputes();
  const { orders, loading: ordersLoading } = useFirebaseOrders();
  const { users, loading: usersLoading } = useFirebaseUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [resolution, setResolution] = useState("");

  const loading = disputesLoading || ordersLoading || usersLoading;

  const getDisputeDetails = (disputeId: string) => {
    const dispute = disputes.find(d => d.id === disputeId);
    if (!dispute) return null;

    const order = orders.find(o => o.id === dispute.orderId);
    const customer = users.find(u => u.id === dispute.customerId);
    const launderer = users.find(u => u.id === dispute.laundererId);

    return { dispute, order, customer, launderer };
  };

  const filterDisputes = (status?: string) => {
    let filtered = disputes;
    
    if (status && status !== 'all') {
      filtered = filtered.filter(d => d.status === status);
    }

    if (searchQuery) {
      filtered = filtered.filter(d => 
        d.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.orderId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const handleUpdateStatus = (disputeId: string, status: 'in_progress' | 'resolved' | 'rejected') => {
    updateDispute(disputeId, {
      status,
      resolvedAt: status === 'resolved' ? new Date().toISOString() : undefined,
      adminNotes,
      resolution: status === 'resolved' ? resolution : undefined,
    });

    setSelectedDispute(null);
    setAdminNotes("");
    setResolution("");
    
    toast.success(`Dispute ${status === 'resolved' ? 'resolved' : status === 'rejected' ? 'rejected' : 'updated'} successfully`);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      open: { className: "bg-yellow-500/10 text-yellow-700", icon: AlertCircle },
      in_progress: { className: "bg-blue-500/10 text-blue-700", icon: MessageSquare },
      resolved: { className: "bg-green-500/10 text-green-700", icon: CheckCircle },
      rejected: { className: "bg-red-500/10 text-red-700", icon: XCircle },
    };
    const variant = variants[status as keyof typeof variants] || variants.open;
    const Icon = variant.icon;
    
    return (
      <Badge className={variant.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: "bg-gray-500/10 text-gray-700",
      medium: "bg-orange-500/10 text-orange-700",
      high: "bg-red-500/10 text-red-700",
    };
    return <Badge className={colors[priority as keyof typeof colors]}>{priority}</Badge>;
  };

  const openDisputes = filterDisputes('open');
  const inProgressDisputes = filterDisputes('in_progress');
  const resolvedDisputes = filterDisputes('resolved');

  return (
    <div className="p-4 space-y-4 pb-20">
      <div>
        <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent tracking-tight">Dispute Resolution</h1>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Mediate between customers and launderers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-none shadow-soft rounded-[1.5rem]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500/10 p-2 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Open</p>
                <h3 className="text-xl font-bold">{openDisputes.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft rounded-[1.5rem]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/10 p-2 rounded-[1.25rem]">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">In Progress</p>
                <h3 className="text-xl font-bold">{inProgressDisputes.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft rounded-[1.5rem]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/10 p-2 rounded-[1.25rem]">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Resolved</p>
                <h3 className="text-xl font-bold">{resolvedDisputes.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search disputes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Disputes Tabs */}
      <Tabs defaultValue="open" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="open">Open ({openDisputes.length})</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress ({inProgressDisputes.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedDisputes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="space-y-3">
          {openDisputes.map((dispute) => {
            const details = getDisputeDetails(dispute.id);
            if (!details) return null;
            const { order, customer, launderer } = details;

              return (
                <Card key={dispute.id} className="border-none shadow-medium rounded-[1.5rem]">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold mb-1">{dispute.subject}</h3>
                      <p className="text-sm text-muted-foreground">Order: {dispute.orderId}</p>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(dispute.status)}
                      {getPriorityBadge(dispute.priority)}
                    </div>
                  </div>

                  <p className="text-sm mb-3">{dispute.description}</p>

                  <div className="space-y-2 mb-3 p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Customer</span>
                      <span className="font-medium">{customer?.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Launderer</span>
                      <span className="font-medium">{launderer?.businessName || launderer?.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Order Amount</span>
                      <span className="font-semibold text-primary">₹{order?.totalAmount}</span>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full"
                        onClick={() => setSelectedDispute(dispute.id)}
                      >
                        Take Action
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Resolve Dispute</DialogTitle>
                        <DialogDescription>
                          Review and resolve this dispute between customer and launderer
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Admin Notes</Label>
                          <Textarea
                            placeholder="Internal notes about this dispute..."
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label>Resolution Details</Label>
                          <Textarea
                            placeholder="Resolution details to share with both parties..."
                            value={resolution}
                            onChange={(e) => setResolution(e.target.value)}
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleUpdateStatus(dispute.id, 'in_progress')}
                          >
                            Mark In Progress
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleUpdateStatus(dispute.id, 'rejected')}
                          >
                            Reject
                          </Button>
                          <Button
                            className="flex-1"
                            onClick={() => handleUpdateStatus(dispute.id, 'resolved')}
                          >
                            Resolve
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="in_progress" className="space-y-3">
          {inProgressDisputes.map((dispute) => {
            const details = getDisputeDetails(dispute.id);
            if (!details) return null;
            const { order, customer, launderer } = details;

              return (
                <Card key={dispute.id} className="border-none shadow-medium rounded-[1.5rem]">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold mb-1">{dispute.subject}</h3>
                      <p className="text-sm text-muted-foreground">Order: {dispute.orderId}</p>
                    </div>
                    {getStatusBadge(dispute.status)}
                  </div>

                  <p className="text-sm mb-3">{dispute.description}</p>

                  {dispute.adminNotes && (
                    <div className="mb-3 p-3 bg-blue-500/10 rounded-lg">
                      <p className="text-xs font-semibold text-blue-700 mb-1">Admin Notes:</p>
                      <p className="text-sm">{dispute.adminNotes}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline"
                          className="flex-1"
                          onClick={() => setSelectedDispute(dispute.id)}
                        >
                          Update
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Dispute</DialogTitle>
                          <DialogDescription>
                            Update the status of this dispute
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Resolution Details</Label>
                            <Textarea
                              placeholder="Resolution details..."
                              value={resolution}
                              onChange={(e) => setResolution(e.target.value)}
                              rows={3}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleUpdateStatus(dispute.id, 'rejected')}
                            >
                              Reject
                            </Button>
                            <Button
                              className="flex-1"
                              onClick={() => handleUpdateStatus(dispute.id, 'resolved')}
                            >
                              Resolve
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-3">
          {resolvedDisputes.map((dispute) => {
            const details = getDisputeDetails(dispute.id);
            if (!details) return null;

              return (
                <Card key={dispute.id} className="border-none shadow-medium rounded-[1.5rem]">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold mb-1">{dispute.subject}</h3>
                      <p className="text-sm text-muted-foreground">Order: {dispute.orderId}</p>
                    </div>
                    {getStatusBadge(dispute.status)}
                  </div>

                  <p className="text-sm mb-3">{dispute.description}</p>

                  {dispute.resolution && (
                    <div className="p-3 bg-green-500/10 rounded-lg mb-3">
                      <p className="text-xs font-semibold text-green-700 mb-1">Resolution:</p>
                      <p className="text-sm">{dispute.resolution}</p>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Resolved on: {dispute.resolvedAt ? new Date(dispute.resolvedAt).toLocaleDateString() : 'N/A'}
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

export default DisputeResolution;