import { Link } from "react-router-dom";
import { Sparkles, Droplet, Zap, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AppLauncher = () => {
  const apps = [
    {
      id: "istri",
      name: "Istri",
      icon: Sparkles,
      description: "Laundry Service",
      link: "/welcome",
      available: true,
      gradient: "gradient-primary",
    },
    {
      id: "plumb",
      name: "Plumb",
      icon: Droplet,
      description: "Plumbing Service",
      link: null,
      available: false,
      gradient: "gradient-secondary",
    },
    {
      id: "tricks",
      name: "Tricks",
      icon: Zap,
      description: "Electrician Service",
      link: null,
      available: false,
      gradient: "gradient-accent",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-safe">
      {/* Header with gradient */}
      <div className="gradient-primary rounded-b-[3rem] px-6 pt-12 pb-20 mb-8 shadow-soft relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10">
          <div className="flex justify-center mb-6 animate-scale-in">
            <div className="w-20 h-20 rounded-[1.75rem] bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-glow">
              <Home className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="text-center space-y-3 animate-fade-in">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              My Apt Partner
            </h1>
            <p className="text-white/90 text-sm max-w-xs mx-auto leading-relaxed">
              Your all-in-one apartment services platform
            </p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="px-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold tracking-tight mb-2">
            Select a Service
          </h2>
          <p className="text-sm text-muted-foreground">
            Choose from our available services
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          {apps.map((app, index) => {
            const AppCard = (
              <Card
                className={`rounded-[2rem] p-5 border-border/30 hover-lift shadow-soft cursor-pointer group relative overflow-hidden transition-all duration-300 animate-fade-in ${
                  !app.available
                    ? "opacity-60"
                    : "hover:border-primary/30 hover:shadow-glow"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Hover gradient overlay */}
                <div
                  className={`absolute inset-0 ${app.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />

                <div className="relative flex flex-col items-center gap-3">
                  <div
                    className={`w-14 h-14 rounded-2xl ${app.gradient} flex items-center justify-center shadow-medium group-hover:scale-110 transition-all duration-300`}
                  >
                    <app.icon className="w-7 h-7 text-white" />
                  </div>

                  <div className="text-center space-y-1">
                    <h3 className="text-sm font-bold tracking-tight">
                      {app.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-tight">
                      {app.description}
                    </p>
                  </div>

                  {app.available ? (
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs font-medium text-primary">
                        Available
                      </span>
                    </div>
                  ) : (
                    <div className="px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground mt-1">
                      Soon
                    </div>
                  )}
                </div>
              </Card>
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
                <DialogContent className="rounded-[2.5rem] max-w-sm mx-4">
                  <DialogHeader>
                    <div className="mx-auto mb-4">
                      <div
                        className={`w-20 h-20 rounded-[1.75rem] ${app.gradient} flex items-center justify-center shadow-glow`}
                      >
                        <app.icon className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <DialogTitle className="text-xl text-center tracking-tight">
                      {app.name}
                    </DialogTitle>
                    <DialogDescription className="text-center pt-4">
                      <div className="space-y-4">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted">
                          <span className="text-2xl">🚀</span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-base font-semibold text-foreground">
                            Coming Soon!
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            The {app.name} app is currently under development.
                            We're working hard to bring you the best{" "}
                            {app.description.toLowerCase()} experience.
                          </p>
                        </div>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full rounded-2xl"
                      onClick={() => {}}
                    >
                      Notify Me When Ready
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center space-y-2 animate-fade-in">
          <p className="text-sm text-muted-foreground">
            Professional services at your doorstep
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            <span>Available 24/7</span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
            <span>Trusted by thousands</span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLauncher;
