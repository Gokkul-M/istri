import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, AlertCircle, MessageSquare, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DisputeResolution = () => {
  const { toast } = useToast();
  const [disputes, setDisputes] = useState([
    {
      id: "DIS-001",
      orderId: "ORD-045",
      customer: "John Smith",
      issue: "Item damaged",
      description: "One of my shirts has a stain that wasn't there before",
      status: "open",
      createdAt: "2 hours ago",
      priority: "high"
    },
    {
      id: "DIS-002",
      orderId: "ORD-038",
      customer: "Sarah Johnson",
      issue: "Missing item",
      description: "I'm missing 2 towels from my order",
      status: "open",
      createdAt: "1 day ago",
      priority: "medium"
    },
    {
      id: "DIS-003",
      orderId: "ORD-032",
      customer: "Mike Wilson",
      issue: "Late delivery",
      description: "Order was delivered 3 hours late",
      status: "resolved",
      createdAt: "3 days ago",
      priority: "low"
    },
  ]);

  const [response, setResponse] = useState("");

  const handleResolve = (disputeId: string) => {
    setDisputes(disputes.map(d => 
      d.id === disputeId ? { ...d, status: "resolved" } : d
    ));
    toast({
      title: "Dispute Resolved",
      description: "The dispute has been marked as resolved.",
    });
    setResponse("");
  };

  const handleReject = (disputeId: string) => {
    setDisputes(disputes.map(d => 
      d.id === disputeId ? { ...d, status: "rejected" } : d
    ));
    toast({
      title: "Dispute Rejected",
      description: "The dispute has been rejected.",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      open: "bg-accent/20 text-accent",
      resolved: "bg-green-500/20 text-green-700",
      rejected: "bg-destructive/20 text-destructive"
    };
    return <Badge className={styles[status as keyof typeof styles]}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: "bg-destructive/20 text-destructive",
      medium: "bg-secondary/20 text-secondary",
      low: "bg-muted text-muted-foreground"
    };
    return <Badge variant="outline" className={styles[priority as keyof typeof styles]}>{priority}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <div className="gradient-primary p-6 pb-8 rounded-b-[3rem] mb-6 shadow-medium">
        <div className="flex items-center justify-between">
          <Link to="/launderer">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">Dispute Resolution</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-6">
        <Tabs defaultValue="open" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value="open" className="space-y-3">
            {disputes.filter(d => d.status === "open").map((dispute) => (
              <Card key={dispute.id} className="rounded-[2rem] p-5 border-border/30 shadow-soft hover-lift">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs text-muted-foreground">{dispute.id}</p>
                      {getPriorityBadge(dispute.priority)}
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{dispute.customer}</h3>
                    <p className="text-sm text-muted-foreground">Order: {dispute.orderId}</p>
                  </div>
                  {getStatusBadge(dispute.status)}
                </div>

                <div className="bg-muted/50 rounded-2xl p-4 mb-3">
                  <div className="flex items-start gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
                    <p className="font-semibold text-sm">{dispute.issue}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{dispute.description}</p>
                </div>

                <p className="text-xs text-muted-foreground mb-3">{dispute.createdAt}</p>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="hero" size="sm" className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Respond to Dispute
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-3xl">
                    <DialogHeader>
                      <DialogTitle>Respond to Dispute</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="bg-muted/50 rounded-2xl p-4">
                        <p className="text-sm font-semibold mb-1">{dispute.issue}</p>
                        <p className="text-sm text-muted-foreground">{dispute.description}</p>
                      </div>
                      <Textarea
                        placeholder="Write your response..."
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        className="rounded-2xl min-h-32"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          onClick={() => handleReject(dispute.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        <Button
                          variant="hero"
                          onClick={() => handleResolve(dispute.id)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </Card>
            ))}
            {disputes.filter(d => d.status === "open").length === 0 && (
              <Card className="rounded-3xl p-12 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Open Disputes</h3>
                <p className="text-sm text-muted-foreground">All disputes have been resolved</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="resolved" className="space-y-3">
            {disputes.filter(d => d.status === "resolved").map((dispute) => (
              <Card key={dispute.id} className="rounded-3xl p-5 border-border/50 opacity-75">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">{dispute.id}</p>
                    <h3 className="font-semibold text-lg">{dispute.customer}</h3>
                    <p className="text-sm text-muted-foreground">{dispute.issue}</p>
                  </div>
                  {getStatusBadge(dispute.status)}
                </div>
                <p className="text-xs text-muted-foreground">{dispute.createdAt}</p>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="all" className="space-y-3">
            {disputes.map((dispute) => (
              <Card key={dispute.id} className="rounded-3xl p-5 border-border/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs text-muted-foreground">{dispute.id}</p>
                      {getPriorityBadge(dispute.priority)}
                    </div>
                    <h3 className="font-semibold text-lg">{dispute.customer}</h3>
                    <p className="text-sm text-muted-foreground">{dispute.issue}</p>
                  </div>
                  {getStatusBadge(dispute.status)}
                </div>
                <p className="text-xs text-muted-foreground">{dispute.createdAt}</p>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DisputeResolution;
