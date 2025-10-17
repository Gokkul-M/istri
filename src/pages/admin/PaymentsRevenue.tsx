import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, CreditCard, Wallet, Loader2 } from "lucide-react";
import { useFirebaseOrders } from "@/hooks/useFirebaseOrders";
import { Line, LineChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const PaymentsRevenue = () => {
  const { orders, loading } = useFirebaseOrders();
  
  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

  // Calculate real revenue data from last 6 months
  const getMonthlyRevenue = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    const revenueMap = new Map();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = months[date.getMonth()];
      revenueMap.set(monthName, 0);
    }
    
    completedOrders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const monthsDiff = (today.getFullYear() - orderDate.getFullYear()) * 12 + (today.getMonth() - orderDate.getMonth());
      
      if (monthsDiff < 6 && monthsDiff >= 0) {
        const monthName = months[orderDate.getMonth()];
        revenueMap.set(monthName, (revenueMap.get(monthName) || 0) + order.totalAmount);
      }
    });
    
    return Array.from(revenueMap.entries()).map(([month, revenue]) => ({ month, revenue }));
  };

  const revenueData = getMonthlyRevenue();

  // Calculate payment methods distribution from real orders
  const getPaymentMethodsData = () => {
    const paymentCounts = { UPI: 0, Card: 0, Cash: 0 };
    
    completedOrders.forEach(order => {
      const method = order.paymentMethod || 'Cash';
      if (paymentCounts.hasOwnProperty(method)) {
        paymentCounts[method]++;
      }
    });
    
    return Object.entries(paymentCounts).map(([method, amount]) => ({ method, amount }));
  };

  const paymentMethodsData = getPaymentMethodsData();

  return (
    <div className="p-4 space-y-4 pb-20">
      <div>
        <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent tracking-tight">Payments & Revenue</h1>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Financial overview and analytics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-none shadow-soft rounded-[1.5rem]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Revenue</p>
                <h3 className="text-xl font-bold">₹{(totalRevenue/1000).toFixed(0)}k</h3>
                <p className="text-xs text-tertiary">+18.7% ↑</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-soft rounded-[1.5rem]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/10 p-2 rounded-[1.25rem]">
                <CreditCard className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Orders</p>
                <h3 className="text-xl font-bold">{completedOrders.length}</h3>
                <p className="text-xs text-tertiary">+23.1% ↑</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-soft rounded-[1.5rem]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-tertiary/10 p-2 rounded-[1.25rem]">
                <TrendingUp className="w-4 h-4 text-tertiary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Value</p>
                <h3 className="text-xl font-bold">₹{Math.round(avgOrderValue)}</h3>
                <p className="text-xs text-tertiary">+5.2% ↑</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-soft rounded-[1.5rem]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-accent/10 p-2 rounded-[1.25rem]">
                <Wallet className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <h3 className="text-xl font-bold">₹8.4k</h3>
                <p className="text-xs text-destructive">-12% ↓</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="border-none shadow-medium rounded-[1.5rem]">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2 text-base tracking-tight">
            <TrendingUp className="w-4 h-4" />
            Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="month" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="border-none shadow-medium rounded-[1.5rem]">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2 text-base tracking-tight">
            <CreditCard className="w-4 h-4" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={paymentMethodsData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="method" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
              <Bar dataKey="amount" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="border-none shadow-medium rounded-[1.5rem]">
        <CardHeader className="p-4">
          <CardTitle className="text-base tracking-tight">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            {completedOrders.slice(0, 10).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-[1.25rem]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-tertiary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">₹{order.totalAmount}</p>
                  <Badge variant="secondary" className="text-xs">UPI</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsRevenue;
