import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock, MapPin, Shield } from "lucide-react";

const Welcome = () => {
  const features = [
    {
      icon: Clock,
      title: "Same Day Service",
      description: "Get your clothes cleaned and returned the same day",
    },
    {
      icon: MapPin,
      title: "Doorstep Pickup",
      description: "We collect and deliver right to your door",
    },
    {
      icon: Shield,
      title: "Premium Care",
      description: "Professional cleaning with fabric protection",
    },
    {
      icon: Sparkles,
      title: "Quality Guaranteed",
      description: "100% satisfaction guaranteed or your money back",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-safe overflow-y-auto">
      {/* Hero Header with gradient */}
      <div className="gradient-primary rounded-b-[3rem] px-6 pt-12 pb-16 mb-6 shadow-soft relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 space-y-6">
          {/* Logo */}
          <div className="flex justify-center animate-scale-in">
            <div className="w-20 h-20 rounded-[1.75rem] bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-glow">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Branding */}
          <div className="text-center space-y-3 animate-fade-in">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              LaundryHub
            </h1>
            <p className="text-white/90 text-sm leading-relaxed">
              Premium Laundry Service
            </p>
            <p className="text-white/80 text-xs max-w-xs mx-auto leading-relaxed">
              Experience the convenience of professional laundry services with
              pickup and delivery right to your doorstep.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6 pb-6">
        {/* Feature Cards */}
        <div>
          <h2 className="text-lg font-bold tracking-tight mb-4 text-center">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-card rounded-[2rem] p-5 border border-border/30 hover-lift text-center space-y-3 shadow-soft group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-[1.5rem] gradient-secondary mx-auto flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm mb-1 tracking-tight">
                    {feature.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="space-y-4 pt-2">
          <Link to="/signup" className="block">
            <Button
              variant="hero"
              size="lg"
              className="w-full rounded-2xl shadow-glow"
            >
              Get Started
            </Button>
          </Link>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-secondary font-semibold hover:underline transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>

        {/* Admin Access */}
        <div className="pt-4 border-t border-border/30">
          <Link to="/admin/login" className="block">
            <Button variant="outline" size="sm" className="w-full rounded-2xl">
              <Shield className="w-4 h-4 mr-2" />
              Admin Access
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
