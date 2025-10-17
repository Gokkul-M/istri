import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CreditCard, Plus, Trash2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PaymentManagement = () => {
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "1",
      type: "Visa",
      last4: "4242",
      expiry: "12/25",
      isDefault: true
    },
    {
      id: "2",
      type: "Mastercard",
      last4: "5555",
      expiry: "09/26",
      isDefault: false
    }
  ]);

  const handleDelete = (id: string) => {
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
    toast({
      title: "Payment Method Removed",
      description: "The payment method has been deleted.",
    });
  };

  const setDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })));
    toast({
      title: "Default Payment Updated",
      description: "Your default payment method has been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Header */}
      <div className="gradient-primary p-6 pb-8 rounded-b-[3rem] mb-6 shadow-medium">
        <div className="flex items-center justify-between">
          <Link to="/customer/settings">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">Payment Methods</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Plus className="w-6 h-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl">
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="rounded-2xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      className="rounded-2xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      className="rounded-2xl"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="name">Cardholder Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="rounded-2xl"
                  />
                </div>
                <Button variant="hero" className="w-full">
                  Add Card
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="px-6 space-y-3">
        {paymentMethods.map((method) => (
          <Card key={method.id} className="rounded-[2rem] p-5 border-border/30 shadow-soft hover-lift">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl ${method.isDefault ? 'gradient-primary' : 'bg-muted'} flex items-center justify-center flex-shrink-0`}>
                <CreditCard className={`w-6 h-6 ${method.isDefault ? 'text-white' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{method.type}</h3>
                  {method.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      <Check className="w-3 h-3 mr-1" />
                      Default
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">•••• {method.last4}</p>
                <p className="text-xs text-muted-foreground">Expires {method.expiry}</p>
              </div>
              {!method.isDefault && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleDelete(method.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            {!method.isDefault && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3"
                onClick={() => setDefault(method.id)}
              >
                Set as Default
              </Button>
            )}
          </Card>
        ))}

        <Card className="rounded-3xl p-6 gradient-secondary border-0 text-white">
          <h3 className="font-semibold mb-2">Secure Payments</h3>
          <p className="text-white/90 text-sm">
            Your payment information is encrypted and secure. We never store your CVV.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default PaymentManagement;
