import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";
import { OrderStatus } from "@/store/useStore";
import { cn } from "@/lib/utils";

interface TimelineStep {
  status: OrderStatus;
  label: string;
}

const timelineSteps: TimelineStep[] = [
  { status: 'pending', label: 'Order Placed' },
  { status: 'confirmed', label: 'Confirmed' },
  { status: 'picked_up', label: 'Picked Up' },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'ready', label: 'Ready' },
  { status: 'out_for_delivery', label: 'Out for Delivery' },
  { status: 'completed', label: 'Completed' },
];

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
  className?: string;
}

export const OrderStatusTimeline = ({ currentStatus, className }: OrderStatusTimelineProps) => {
  const currentStepIndex = timelineSteps.findIndex((step) => step.status === currentStatus);

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        {/* Progress line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-muted" />
        <motion.div
          className="absolute left-6 top-8 w-0.5 bg-gradient-to-b from-primary to-secondary"
          initial={{ height: 0 }}
          animate={{ 
            height: currentStepIndex >= 0 
              ? `${(currentStepIndex / (timelineSteps.length - 1)) * 100}%` 
              : 0 
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* Steps */}
        <div className="space-y-6">
          {timelineSteps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <motion.div
                key={step.status}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 relative"
              >
                {/* Icon */}
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all z-10",
                    isCompleted
                      ? "bg-gradient-to-br from-primary to-secondary border-primary text-white"
                      : "bg-background border-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>

                {/* Label */}
                <div className="flex-1">
                  <p
                    className={cn(
                      "font-medium transition-colors",
                      isCompleted ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-primary font-medium"
                    >
                      Current Status
                    </motion.p>
                  )}
                </div>

                {/* Pulse effect for current step */}
                {isCurrent && (
                  <motion.div
                    className="absolute left-6 w-12 h-12 rounded-full bg-primary/20"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
