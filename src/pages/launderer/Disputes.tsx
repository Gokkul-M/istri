import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, AlertCircle, Package, Calendar, User } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useFirebaseOrders } from "@/hooks/useFirebaseOrders";
import { useFirebaseDisputes } from "@/hooks/useFirebaseDisputes";
import { format } from "date-fns";

const Disputes = () => {
  const { currentUser } = useStore();
  const { orders } = useFirebaseOrders();
  const { disputes, loading } = useFirebaseDisputes();

  // Disputes are already filtered by laundererId in the hook
  const myDisputes = useMemo(() => {
    return disputes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [disputes]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { bg: string; text: string; label: string }> = {
      open: { bg: "bg-yellow-500/10", text: "text-yellow-600", label: "Open" },
      in_progress: { bg: "bg-blue-500/10", text: "text-blue-600", label: "In Progress" },
      resolved: { bg: "bg-green-500/10", text: "text-green-600", label: "Resolved" },
      rejected: { bg: "bg-red-500/10", text: "text-red-600", label: "Rejected" },
    };
    
    const variant = variants[status] || variants.open;
    return (
      <Badge className={`${variant.bg} ${variant.text} rounded-full px-3 py-1`}>
        {variant.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { bg: string; text: string }> = {
      low: { bg: "bg-gray-500/10", text: "text-gray-600" },
      medium: { bg: "bg-orange-500/10", text: "text-orange-600" },
      high: { bg: "bg-red-500/10", text: "text-red-600" },
    };
    
    const variant = variants[priority] || variants.medium;
    return (
      <Badge className={`${variant.bg} ${variant.text} rounded-full px-2 py-0.5 text-xs`}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-6">
        <div className="gradient-primary p-6 pb-8 rounded-b-[3rem] mb-6">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-32 h-6" />
            <div className="w-10" />
          </div>
        </div>
        <div className="px-6 space-y-4">
          <Skeleton className="w-full h-40 rounded-[2rem]" />
          <Skeleton className="w-full h-40 rounded-[2rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="gradient-primary p-6 pb-8 rounded-b-[3rem] mb-6">
        <div className="flex items-center justify-between mb-6">
          <Link to="/launderer">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">Disputes</h1>
          <div className="w-10" />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white/80 text-sm">Total Disputes</p>
            <p className="text-white text-2xl font-bold">{myDisputes.length}</p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-4">
        {myDisputes.length === 0 ? (
          <Card className="rounded-[2rem] p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">No Disputes</h3>
            <p className="text-muted-foreground text-sm">
              You have no customer disputes at the moment
            </p>
          </Card>
        ) : (
          myDisputes.map((dispute) => {
            const order = orders.find(o => o.id === dispute.orderId);
            
            return (
              <Card key={dispute.id} className="rounded-[2rem] p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-base">{dispute.subject}</h3>
                      {getPriorityBadge(dispute.priority)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        <span>Order #{dispute.orderId.slice(0, 8)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(dispute.createdAt), 'MMM dd, yyyy')}</span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(dispute.status)}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Customer ID:</span>
                    <span className="text-muted-foreground">{dispute.customerId}</span>
                  </div>

                  <div className="bg-muted/30 rounded-2xl p-4">
                    <p className="text-sm text-foreground/90 leading-relaxed">{dispute.description}</p>
                  </div>

                  {dispute.status === 'resolved' && dispute.resolution && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
                      <p className="text-xs font-semibold text-green-600 mb-2">Resolution</p>
                      <p className="text-sm text-foreground/90">{dispute.resolution}</p>
                      {dispute.resolvedAt && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Resolved on {format(new Date(dispute.resolvedAt), 'MMM dd, yyyy')}
                        </p>
                      )}
                    </div>
                  )}

                  {dispute.adminNotes && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                      <p className="text-xs font-semibold text-blue-600 mb-2">Admin Notes</p>
                      <p className="text-sm text-foreground/90">{dispute.adminNotes}</p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Disputes;
