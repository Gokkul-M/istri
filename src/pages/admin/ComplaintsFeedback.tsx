import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle, Clock, MessageSquare, Send, ChevronDown, Inbox } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { collection, onSnapshot, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Skeleton } from "@/components/ui/skeleton";

interface Complaint {
  id: string;
  ticketId: string;
  userName: string;
  userType: 'customer' | 'launderer';
  category: string;
  subject: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  replies: { sender: string; message: string; timestamp: string; }[];
}

const ComplaintsFeedback = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [openTickets, setOpenTickets] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'disputes'),
      (snapshot) => {
        const complaintsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Complaint[];
        setComplaints(complaintsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching complaints:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { color: "bg-accent text-accent-foreground", icon: Clock },
      in_progress: { color: "bg-secondary text-secondary-foreground", icon: AlertCircle },
      resolved: { color: "bg-tertiary text-tertiary-foreground", icon: CheckCircle },
    };
    const { color, icon: Icon } = config[status as keyof typeof config];
    return (
      <Badge className={color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: "bg-muted text-muted-foreground",
      medium: "bg-secondary/20 text-secondary",
      high: "bg-destructive/20 text-destructive",
    };
    return <Badge className={colors[priority as keyof typeof colors]}>{priority}</Badge>;
  };

  const handleSendReply = async (complaintId: string, ticketId: string) => {
    const message = replyText[complaintId];
    if (!message?.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    try {
      const complaintRef = doc(db, 'disputes', complaintId);
      const complaint = complaints.find(c => c.id === complaintId);
      const newReply = {
        sender: 'Admin',
        message,
        timestamp: new Date().toISOString()
      };

      await updateDoc(complaintRef, {
        replies: [...(complaint?.replies || []), newReply],
        status: 'in_progress'
      });

      toast.success("Reply sent successfully");
      setReplyText({ ...replyText, [complaintId]: "" });
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    }
  };

  const handleResolve = async (complaintId: string) => {
    try {
      await updateDoc(doc(db, 'disputes', complaintId), {
        status: 'resolved'
      });
      toast.success("Marked as resolved");
    } catch (error) {
      console.error("Error resolving complaint:", error);
      toast.error("Failed to resolve complaint");
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4 pb-20">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20 rounded-[1.5rem]" />
          <Skeleton className="h-20 rounded-[1.5rem]" />
          <Skeleton className="h-20 rounded-[1.5rem]" />
          <Skeleton className="h-20 rounded-[1.5rem]" />
        </div>
        <Skeleton className="h-32 rounded-[1.5rem]" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      <div>
        <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent tracking-tight">Complaints & Feedback</h1>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Manage support tickets and disputes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-none shadow-soft rounded-[1.5rem]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <h3 className="text-xl font-bold">{stats.total}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-soft rounded-[1.5rem]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-2 rounded-[1.25rem]">
                <Clock className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <h3 className="text-xl font-bold">{stats.pending}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-soft rounded-[1.5rem]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/10 p-2 rounded-[1.25rem]">
                <AlertCircle className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Active</p>
                <h3 className="text-xl font-bold">{stats.inProgress}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-soft rounded-[1.5rem]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-tertiary/10 p-2 rounded-[1.25rem]">
                <CheckCircle className="w-4 h-4 text-tertiary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Resolved</p>
                <h3 className="text-xl font-bold">{stats.resolved}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Complaints List */}
      {complaints.length === 0 ? (
        <Card className="border-none shadow-medium rounded-[1.5rem] p-12 text-center">
          <Inbox className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Complaints Yet</h3>
          <p className="text-muted-foreground">All support tickets will appear here</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {complaints.map((complaint) => (
            <Collapsible
              key={complaint.id}
              open={openTickets[complaint.id]}
              onOpenChange={(open) => setOpenTickets({ ...openTickets, [complaint.id]: open })}
            >
              <Card className="border-none shadow-medium rounded-[1.5rem]">
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-muted-foreground">{complaint.ticketId}</span>
                          {getPriorityBadge(complaint.priority)}
                        </div>
                        <CardTitle className="text-sm font-semibold">{complaint.subject}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">{complaint.userName} • {complaint.category}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(complaint.status)}
                        <ChevronDown className={`w-4 h-4 transition-transform ${openTickets[complaint.id] ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="p-4 pt-0 space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Description</p>
                      <p className="text-sm bg-muted/50 p-3 rounded-lg">{complaint.description}</p>
                    </div>

                    {complaint.replies && complaint.replies.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Replies</p>
                        <div className="space-y-2">
                          {complaint.replies.map((reply, idx) => (
                            <div key={idx} className="bg-primary/5 p-3 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold">{reply.sender}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(reply.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm">{reply.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {complaint.status !== 'resolved' && (
                      <div>
                        <Textarea
                          placeholder="Type your reply..."
                          value={replyText[complaint.id] || ""}
                          onChange={(e) => setReplyText({ ...replyText, [complaint.id]: e.target.value })}
                          className="mb-2"
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleSendReply(complaint.id, complaint.ticketId)}
                            className="flex-1"
                          >
                            <Send className="w-3 h-3 mr-2" />
                            Send Reply
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleResolve(complaint.id)}
                          >
                            <CheckCircle className="w-3 h-3 mr-2" />
                            Resolve
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintsFeedback;
