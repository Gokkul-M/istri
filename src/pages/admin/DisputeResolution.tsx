import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, AlertCircle, CheckCircle, XCircle, MessageSquare, Loader2 } from "lucide-react";
import { useFirebaseDisputes } from "@/hooks/useFirebaseDisputes";
import { useFirebaseOrders } from "@/hooks/useFirebaseOrders";
import { useFirebaseUsers } from "@/hooks/useFirebaseUsers";
import { firestoreService } from "@/lib/firebase/firestore";
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

  const handleUpdateStatus = async (disputeId: string, status: 'in_progress' | 'resolved' | 'rejected') => {
    const dispute = disputes.find(d => d.id === disputeId);
    
    updateDispute(disputeId, {
      status,
      resolvedAt: status === 'resolved' ? new Date().toISOString() : undefined,
      adminNotes,
      resolution: status === 'resolved' ? resolution : undefined,
    });

    // Create notification for customer if dispute is resolved
    if (status === 'resolved' && dispute) {
      try {
        await firestoreService.createNotification({
          userId: dispute.customerId,
          title: 'Dispute Resolved',
          message: `Your dispute regarding order #${dispute.orderId.slice(-8).toUpperCase()} has been resolved.`,
          type: 'dispute_resolved',
          read: false,
          metadata: {
            disputeId: dispute.id,
            orderId: dispute.orderId,
            adminNotes,
            resolution,
          },
        });
      } catch (error) {
        console.error('Error creating notification:', error);
      }
    }

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
    <div className="p-6 space-y-6 pb-24">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent tracking-tight">Dispute Resolution</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">Mediate and resolve issues between customers and launderers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-soft hover:shadow-medium transition-all duration-300 rounded-[2rem] bg-gradient-to-br from-yellow-500/5 to-background backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500/15 p-3 rounded-[1.25rem] shadow-sm">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium mb-1">Open Disputes</p>
                <h3 className="text-2xl font-bold text-yellow-700">{openDisputes.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft hover:shadow-medium transition-all duration-300 rounded-[2rem] bg-gradient-to-br from-blue-500/5 to-background backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/15 p-3 rounded-[1.25rem] shadow-sm">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium mb-1">In Progress</p>
                <h3 className="text-2xl font-bold text-blue-700">{inProgressDisputes.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-soft hover:shadow-medium transition-all duration-300 rounded-[2rem] bg-gradient-to-br from-green-500/5 to-background backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="bg-green-500/15 p-3 rounded-[1.25rem] shadow-sm">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium mb-1">Resolved</p>
                <h3 className="text-2xl font-bold text-green-700">{resolvedDisputes.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search by subject, order ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 rounded-[1.5rem] border-border/50 bg-background/50 backdrop-blur-sm"
        />
      </div>

      {/* Disputes Tabs */}
      <Tabs defaultValue="open" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12 rounded-[1.5rem] p-1 bg-muted/50 backdrop-blur-sm">
          <TabsTrigger value="open" className="rounded-[1.25rem] data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Open ({openDisputes.length})
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="rounded-[1.25rem] data-[state=active]:bg-background data-[state=active]:shadow-sm">
            In Progress ({inProgressDisputes.length})
          </TabsTrigger>
          <TabsTrigger value="resolved" className="rounded-[1.25rem] data-[state=active]:bg-background data-[state=active]:shadow-sm">
            Resolved ({resolvedDisputes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="space-y-4 mt-6">
          {openDisputes.length === 0 ? (
            <Card className="rounded-[2rem] p-12 text-center shadow-soft border-border/30 bg-gradient-to-br from-background to-background/50">
              <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-semibold mb-2">No Open Disputes</h3>
              <p className="text-sm text-muted-foreground">All disputes have been addressed</p>
            </Card>
          ) : (
            openDisputes.map((dispute) => {
              const details = getDisputeDetails(dispute.id);
              if (!details) return null;
              const { order, customer, launderer } = details;

              return (
                <Card key={dispute.id} className="border-border/30 shadow-soft hover:shadow-medium transition-all duration-300 rounded-[2rem] bg-gradient-to-br from-background to-background/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1.5">{dispute.subject}</h3>
                      <p className="text-sm text-muted-foreground font-medium">Order #{dispute.orderId.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      {getStatusBadge(dispute.status)}
                      {getPriorityBadge(dispute.priority)}
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed mb-4 text-foreground/90">{dispute.description}</p>

                  <Separator className="my-4" />

                  <div className="space-y-3 mb-4 p-4 bg-muted/30 rounded-[1.25rem] backdrop-blur-sm">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Customer</span>
                      <span className="font-semibold">{customer?.name}</span>
                    </div>
                    <Separator className="opacity-50" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Launderer</span>
                      <span className="font-semibold">{launderer?.businessName || launderer?.name}</span>
                    </div>
                    <Separator className="opacity-50" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Order Amount</span>
                      <span className="font-bold text-primary text-base">₹{order?.totalAmount}</span>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full h-12 rounded-[1.5rem] shadow-md hover:shadow-lg transition-all"
                        variant="hero"
                        onClick={() => setSelectedDispute(dispute.id)}
                      >
                        Take Action
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px] rounded-[2rem]">
                      <DialogHeader>
                        <DialogTitle className="text-xl">Resolve Dispute</DialogTitle>
                        <DialogDescription>
                          Review and resolve this dispute between customer and launderer
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-5 mt-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Admin Notes</Label>
                          <Textarea
                            placeholder="Internal notes about this dispute..."
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            rows={3}
                            className="rounded-[1.25rem] resize-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Resolution Details</Label>
                          <Textarea
                            placeholder="Resolution details to share with both parties..."
                            value={resolution}
                            onChange={(e) => setResolution(e.target.value)}
                            rows={3}
                            className="rounded-[1.25rem] resize-none"
                          />
                        </div>
                        <Separator />
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1 h-11 rounded-[1.25rem]"
                              onClick={() => handleUpdateStatus(dispute.id, 'in_progress')}
                            >
                              Mark In Progress
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 h-11 rounded-[1.25rem] text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleUpdateStatus(dispute.id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </div>
                          <Button
                            variant="hero"
                            className="w-full h-11 rounded-[1.25rem]"
                            onClick={() => handleUpdateStatus(dispute.id, 'resolved')}
                          >
                            Resolve Dispute
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="in_progress" className="space-y-4 mt-6">
          {inProgressDisputes.length === 0 ? (
            <Card className="rounded-[2rem] p-12 text-center shadow-soft border-border/30 bg-gradient-to-br from-background to-background/50">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-semibold mb-2">No Disputes In Progress</h3>
              <p className="text-sm text-muted-foreground">No disputes are currently being worked on</p>
            </Card>
          ) : (
            inProgressDisputes.map((dispute) => {
              const details = getDisputeDetails(dispute.id);
              if (!details) return null;
              const { order, customer, launderer } = details;

              return (
                <Card key={dispute.id} className="border-border/30 shadow-soft hover:shadow-medium transition-all duration-300 rounded-[2rem] bg-gradient-to-br from-blue-500/5 to-background/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1.5">{dispute.subject}</h3>
                      <p className="text-sm text-muted-foreground font-medium">Order #{dispute.orderId.slice(-8).toUpperCase()}</p>
                    </div>
                    {getStatusBadge(dispute.status)}
                  </div>

                  <p className="text-sm leading-relaxed mb-4 text-foreground/90">{dispute.description}</p>

                  {dispute.adminNotes && (
                    <>
                      <Separator className="my-4" />
                      <div className="mb-4 p-4 bg-blue-500/10 rounded-[1.25rem] border border-blue-200/50">
                        <p className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wide">Admin Notes</p>
                        <p className="text-sm text-blue-900/90 leading-relaxed">{dispute.adminNotes}</p>
                      </div>
                    </>
                  )}

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline"
                          className="flex-1 h-11 rounded-[1.25rem] border-border/50"
                          onClick={() => setSelectedDispute(dispute.id)}
                        >
                          Update Status
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[550px] rounded-[2rem]">
                        <DialogHeader>
                          <DialogTitle className="text-xl">Update Dispute</DialogTitle>
                          <DialogDescription>
                            Update the status of this dispute
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-5 mt-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold">Resolution Details</Label>
                            <Textarea
                              placeholder="Resolution details to share with both parties..."
                              value={resolution}
                              onChange={(e) => setResolution(e.target.value)}
                              rows={4}
                              className="rounded-[1.25rem] resize-none"
                            />
                          </div>
                          <Separator />
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1 h-11 rounded-[1.25rem] text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleUpdateStatus(dispute.id, 'rejected')}
                            >
                              Reject Dispute
                            </Button>
                            <Button
                              variant="hero"
                              className="flex-1 h-11 rounded-[1.25rem]"
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
            })
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4 mt-6">
          {resolvedDisputes.length === 0 ? (
            <Card className="rounded-[2rem] p-12 text-center shadow-soft border-border/30 bg-gradient-to-br from-background to-background/50">
              <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-semibold mb-2">No Resolved Disputes</h3>
              <p className="text-sm text-muted-foreground">Resolved disputes will appear here</p>
            </Card>
          ) : (
            resolvedDisputes.map((dispute) => {
              const details = getDisputeDetails(dispute.id);
              if (!details) return null;

              return (
                <Card key={dispute.id} className="border-border/30 shadow-soft hover:shadow-medium transition-all duration-300 rounded-[2rem] bg-gradient-to-br from-green-500/5 to-background/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1.5">{dispute.subject}</h3>
                      <p className="text-sm text-muted-foreground font-medium">Order #{dispute.orderId.slice(-8).toUpperCase()}</p>
                    </div>
                    {getStatusBadge(dispute.status)}
                  </div>

                  <p className="text-sm leading-relaxed mb-4 text-foreground/90">{dispute.description}</p>

                  {dispute.resolution && (
                    <>
                      <Separator className="my-4" />
                      <div className="p-4 bg-green-500/10 rounded-[1.25rem] mb-4 border border-green-200/50">
                        <p className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wide">Resolution</p>
                        <p className="text-sm text-green-900/90 leading-relaxed">{dispute.resolution}</p>
                      </div>
                    </>
                  )}

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium">Resolved Date</span>
                    <span className="text-sm font-semibold text-green-700">
                      {dispute.resolvedAt ? new Date(dispute.resolvedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      }) : 'N/A'}
                    </span>
                  </div>
                </CardContent>
              </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DisputeResolution;