import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Bell, CheckCircle2, AlertCircle, Info, Trash2, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useNotifications } from "@/hooks/useNotifications";
import { useStore } from "@/store/useStore";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

const Notifications = () => {
  const navigate = useNavigate();
  const { currentUser } = useStore();
  const { notifications, loading, markAsRead, deleteNotification } = useNotifications(currentUser?.id || null);

  const handleNotificationClick = async (notificationId: string, read: boolean) => {
    if (!read) {
      await markAsRead(notificationId);
    }
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-primary rounded-b-[3rem] p-6 pb-8 mb-6 shadow-soft">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 space-y-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-32 rounded-[2rem]" />
            <Skeleton className="h-32 rounded-[2rem]" />
            <Skeleton className="h-32 rounded-[2rem]" />
          </div>
        ) : notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="rounded-[2rem] p-12 text-center border-border/30 bg-gradient-to-br from-background to-background/50 shadow-soft">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-10 h-10 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Notifications Yet</h3>
              <p className="text-sm text-muted-foreground">
                You're all caught up! We'll notify you about order updates, promotions, and more.
              </p>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification, index: number) => {
              const Icon = 
                notification.type === "success" ? CheckCircle2 :
                notification.type === "warning" ? AlertCircle :
                notification.type === "dispute_resolved" ? Shield :
                Info;
              
              const iconColor = 
                notification.type === "success" ? "text-green-600" :
                notification.type === "warning" ? "text-orange-600" :
                notification.type === "dispute_resolved" ? "text-blue-600" :
                "text-blue-600";
              
              const bgColor = 
                notification.type === "success" ? "bg-green-500/15" :
                notification.type === "warning" ? "bg-orange-500/15" :
                notification.type === "dispute_resolved" ? "bg-blue-500/15" :
                "bg-blue-500/15";

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => handleNotificationClick(notification.id, notification.read)}
                >
                  <Card className={`rounded-[2rem] p-6 border-border/30 shadow-soft hover:shadow-medium transition-all cursor-pointer ${!notification.read ? 'bg-gradient-to-br from-primary/5 to-background' : 'bg-gradient-to-br from-background to-background/50'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-[1.25rem] ${bgColor} flex items-center justify-center shrink-0 shadow-sm`}>
                        <Icon className={`w-7 h-7 ${iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-bold text-base">{notification.title}</h3>
                          {!notification.read && (
                            <Badge className="bg-primary text-white border-0 text-xs shrink-0 shadow-sm">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-foreground/90 mb-3 leading-relaxed">{notification.message}</p>
                        
                        {/* Dispute Resolution Details */}
                        {notification.type === 'dispute_resolved' && notification.metadata && (
                          <>
                            <Separator className="my-3" />
                            {notification.metadata.resolution && (
                              <div className="mb-3 p-3 bg-green-500/10 rounded-[1.25rem] border border-green-200/50">
                                <p className="text-xs font-bold text-green-700 mb-1.5 uppercase tracking-wide">Resolution</p>
                                <p className="text-sm text-green-900/90 leading-relaxed">{notification.metadata.resolution}</p>
                              </div>
                            )}
                            {notification.metadata.adminNotes && (
                              <div className="p-3 bg-blue-500/10 rounded-[1.25rem] border border-blue-200/50">
                                <p className="text-xs font-bold text-blue-700 mb-1.5 uppercase tracking-wide">Admin Notes</p>
                                <p className="text-sm text-blue-900/90 leading-relaxed">{notification.metadata.adminNotes}</p>
                              </div>
                            )}
                            <Separator className="my-3" />
                          </>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground font-medium">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-3 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl"
                            onClick={(e) => handleDelete(e, notification.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
