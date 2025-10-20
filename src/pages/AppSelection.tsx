import { Link } from "react-router-dom";
import { Sparkles, Droplet, Zap, Home, ArrowRight, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

const AppLauncher = () => {
  const apps = [
    {
      id: "istri",
      name: "ShineCycle",
      tagline: "Laundry Made Easy",
      icon: Sparkles,
      description: "Premium laundry service with doorstep pickup and delivery",
      features: ["Same Day Service", "Quality Assured", "Eco-Friendly"],
      link: "/welcome",
      available: true,
      gradient: "gradient-primary",
      accentColor: "from-primary/20 to-primary/5",
    },
    {
      id: "plumb",
      name: "AquaFix",
      tagline: "Plumbing Experts",
      icon: Droplet,
      description: "Professional plumbing services for all your home needs",
      features: ["Emergency Service", "Licensed Pros", "Fair Pricing"],
      link: null,
      available: false,
      gradient: "gradient-secondary",
      accentColor: "from-blue-500/20 to-blue-500/5",
    },
    {
      id: "tricks",
      name: "VoltCare",
      tagline: "Electrical Solutions",
      icon: Zap,
      description: "Certified electricians for safe and reliable service",
      features: ["24/7 Available", "Safety First", "Quick Response"],
      link: null,
      available: false,
      gradient: "gradient-accent",
      accentColor: "from-amber-500/20 to-amber-500/5",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 pb-safe">
      {/* Enhanced Header with gradient */}
      <div className="gradient-primary rounded-b-[3rem] px-6 pt-16 pb-24 mb-8 shadow-xl relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative z-10">
          {/* Logo with enhanced animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex justify-center mb-8"
          >
            <div className="w-24 h-24 rounded-[2rem] bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl border border-white/30">
              <Home className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          {/* Branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center space-y-4"
          >
            <h1 className="text-5xl font-bold text-white tracking-tight">
              My Apt Partner
            </h1>
            <p className="text-white/90 text-base max-w-sm mx-auto leading-relaxed">
              Your all-in-one apartment services platform
            </p>
            <div className="flex items-center justify-center gap-6 text-white/80 text-sm pt-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>24/7 Service</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-white/50" />
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Trusted & Safe</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Services Section */}
      <div className="px-6 space-y-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center space-y-2"
        >
          <h2 className="text-2xl font-bold tracking-tight">
            Choose Your Service
          </h2>
          <p className="text-muted-foreground">
            Select from our premium service offerings
          </p>
        </motion.div>

        {/* Service Cards - Vertical Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-5"
        >
          {apps.map((app) => {
            const AppCard = (
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`rounded-[2rem] p-6 border-2 transition-all duration-300 relative overflow-hidden group ${
                    !app.available
                      ? "opacity-70 border-border/30"
                      : "hover:border-primary/40 hover:shadow-2xl cursor-pointer border-border/30"
                  }`}
                >
                  {/* Background gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${app.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Content */}
                  <div className="relative flex items-center gap-5">
                    {/* Icon */}
                    <div
                      className={`w-20 h-20 rounded-[1.5rem] ${app.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}
                    >
                      <app.icon className="w-10 h-10 text-white" />
                    </div>

                    {/* Text Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-bold tracking-tight mb-1">
                            {app.name}
                          </h3>
                          <p className="text-sm text-muted-foreground font-medium">
                            {app.tagline}
                          </p>
                        </div>
                        
                        {/* Status Badge */}
                        {app.available ? (
                          <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 px-3 py-1 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1.5" />
                            Available
                          </Badge>
                        ) : (
                          <Badge className="bg-muted/50 text-muted-foreground px-3 py-1 rounded-full">
                            Coming Soon
                          </Badge>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {app.description}
                      </p>

                      {/* Features */}
                      <div className="flex items-center gap-3 flex-wrap pt-1">
                        {app.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground"
                          >
                            <div className="w-1 h-1 rounded-full bg-primary" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    {app.available && (
                      <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    )}
                  </div>
                </Card>
              </motion.div>
            );

            if (app.available && app.link) {
              return (
                <Link key={app.id} to={app.link}>
                  {AppCard}
                </Link>
              );
            }

            return (
              <Dialog key={app.id}>
                <DialogTrigger asChild>{AppCard}</DialogTrigger>
                <DialogContent className="rounded-[2.5rem] max-w-md mx-4 border-2">
                  <DialogHeader>
                    <div className="mx-auto mb-6">
                      <div
                        className={`w-24 h-24 rounded-[2rem] ${app.gradient} flex items-center justify-center shadow-2xl`}
                      >
                        <app.icon className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <DialogTitle className="text-2xl text-center tracking-tight">
                      {app.name}
                    </DialogTitle>
                    <DialogDescription className="text-center pt-6">
                      <div className="space-y-5">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-primary/5">
                          <span className="text-3xl">🚀</span>
                        </div>
                        <div className="space-y-3">
                          <p className="text-lg font-semibold text-foreground">
                            Launching Soon!
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                            We're putting the finishing touches on {app.name}.
                            Get ready for the best {app.description.toLowerCase()} experience!
                          </p>
                        </div>
                        
                        {/* Features Preview */}
                        <div className="bg-muted/30 rounded-2xl p-4 space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Coming Features
                          </p>
                          <div className="space-y-2">
                            {app.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <div className={`w-1.5 h-1.5 rounded-full ${app.gradient}`} />
                                <span className="text-foreground/80">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-6 space-y-3">
                    <Button
                      size="lg"
                      className={`w-full rounded-2xl ${app.gradient} text-white shadow-lg hover:shadow-xl`}
                      onClick={() => {}}
                    >
                      Notify Me When Ready
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      We'll send you an update when we launch
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            );
          })}
        </motion.div>

        {/* Enhanced Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center space-y-4 pt-8 pb-4"
        >
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground/80">
              Professional Services at Your Doorstep
            </p>
            <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                Trusted by 10,000+ customers
              </span>
              <div className="w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                Available 24/7
              </span>
              <div className="w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                100% Satisfaction
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AppLauncher;
