import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Bell, CheckCircle2, AlertCircle, Info, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const Notifications = () => {
  const navigate = useNavigate();

  // Placeholder for future notifications - currently empty
  const notifications: any[] = [];

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
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="rounded-[2rem] p-12 text-center border-border/30">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <Bell className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Notifications Yet</h3>
              <p className="text-sm text-muted-foreground">
                You're all caught up! We'll notify you about order updates, promotions, and more.
              </p>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification: any, index: number) => {
              const Icon = 
                notification.type === "success" ? CheckCircle2 :
                notification.type === "warning" ? AlertCircle :
                Info;
              
              const iconColor = 
                notification.type === "success" ? "text-green-500" :
                notification.type === "warning" ? "text-orange-500" :
                "text-blue-500";
              
              const bgColor = 
                notification.type === "success" ? "bg-green-500/10" :
                notification.type === "warning" ? "bg-orange-500/10" :
                "bg-blue-500/10";

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="rounded-[2rem] p-5 border-border/30 shadow-soft hover:shadow-medium transition-all">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-6 h-6 ${iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{notification.title}</h3>
                          {!notification.read && (
                            <Badge className="bg-primary/15 text-primary hover:bg-primary/20 border-0 text-xs shrink-0">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10">
                            <Trash2 className="w-3 h-3 mr-1" />
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
