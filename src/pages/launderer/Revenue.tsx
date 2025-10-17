import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, DollarSign, Calendar, Package, ShoppingBag, Loader2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useFirebaseOrders } from "@/hooks/useFirebaseOrders";
import { useMemo } from "react";

const Revenue = () => {
  const { orders, loading } = useFirebaseOrders();
  
  // Filter only completed orders
  const completedOrders = useMemo(() => 
    orders.filter(o => o.status === 'completed'), 
    [orders]
  );
  
  // Calculate revenue metrics
  const totalRevenue = useMemo(() => 
    completedOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    [completedOrders]
  );
  
  const thisMonth = useMemo(() => {
    const now = new Date();
    return completedOrders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    });
  }, [completedOrders]);
  
  const monthlyRevenue = useMemo(() => 
    thisMonth.reduce((sum, order) => sum + order.totalAmount, 0),
    [thisMonth]
  );
  
  const thisWeek = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return completedOrders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= weekAgo;
    });
  }, [completedOrders]);
  
  const weeklyRevenue = useMemo(() => 
    thisWeek.reduce((sum, order) => sum + order.totalAmount, 0),
    [thisWeek]
  );
  
  const today = useMemo(() => {
    const now = new Date();
    return completedOrders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate.toDateString() === now.toDateString();
    });
  }, [completedOrders]);
  
  const todayRevenue = useMemo(() => 
    today.reduce((sum, order) => sum + order.totalAmount, 0),
    [today]
  );
  
  // Generate monthly revenue data from actual orders
  const monthlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const currentYear = now.getFullYear();
    
    return months.slice(0, now.getMonth() + 1).map((month, index) => {
      const monthRevenue = completedOrders
        .filter(o => {
          const orderDate = new Date(o.createdAt);
          return orderDate.getMonth() === index && orderDate.getFullYear() === currentYear;
        })
        .reduce((sum, order) => sum + order.totalAmount, 0);
      
      return { month, revenue: monthRevenue };
    });
  }, [completedOrders]);
  
  // Generate weekly revenue data from actual orders
  const weeklyData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      const dayRevenue = completedOrders
        .filter(o => {
          const orderDate = new Date(o.createdAt);
          return orderDate.toDateString() === date.toDateString();
        })
        .reduce((sum, order) => sum + order.totalAmount, 0);
      
      return { day: days[date.getDay()], revenue: dayRevenue };
    });
  }, [completedOrders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-10">
        <div className="gradient-primary p-6 pb-8 rounded-b-[3rem] mb-6 shadow-medium">
          <div className="flex items-center justify-between mb-6">
            <Link to="/launderer">
              <Button variant="ghost" size="icon" className="text-white">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-white">Revenue Analytics</h1>
            <div className="w-10" />
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="gradient-primary p-6 pb-8 rounded-b-[3rem] mb-6 shadow-medium">
        <div className="flex items-center justify-between mb-6">
          <Link to="/launderer">
            <Button variant="ghost" size="icon" className="text-white">
              <ArrowLeft className="w-6 h-6" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-white">Revenue Analytics</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-6 space-y-4">
        {/* Total Revenue Card */}
        <Card className="rounded-[2rem] p-6 gradient-primary border-0 text-white shadow-glow">
          <h3 className="text-sm mb-2">Total Revenue</h3>
          <p className="text-4xl font-bold">₹{monthlyRevenue.toLocaleString()}</p>
          <p className="text-sm text-white/80 mt-2">This month</p>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="rounded-[2rem] p-5 border-border/30 shadow-soft hover-lift">
            <TrendingUp className="w-8 h-8 text-accent mb-2" />
            <p className="text-2xl font-bold">₹{weeklyRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">This week</p>
          </Card>
          <Card className="rounded-3xl p-5 border-none shadow-md">
            <DollarSign className="w-8 h-8 text-secondary mb-2" />
            <p className="text-2xl font-bold">₹{todayRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Today</p>
          </Card>
          <Card className="rounded-3xl p-5 border-none shadow-md">
            <Package className="w-8 h-8 text-primary mb-2" />
            <p className="text-2xl font-bold">{completedOrders.length}</p>
            <p className="text-xs text-muted-foreground">Total Orders</p>
          </Card>
          <Card className="rounded-3xl p-5 border-none shadow-md">
            <ShoppingBag className="w-8 h-8 text-tertiary mb-2" />
            <p className="text-2xl font-bold">{thisMonth.length}</p>
            <p className="text-xs text-muted-foreground">This Month</p>
          </Card>
        </div>

        {/* Monthly Revenue Chart */}
        <Card className="rounded-3xl border-none shadow-md">
          <CardHeader className="p-4">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Monthly Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Revenue Chart */}
        <Card className="rounded-3xl border-none shadow-md">
          <CardHeader className="p-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-secondary" />
              This Week's Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="hsl(var(--secondary))" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card className="rounded-3xl p-6 border-none shadow-md">
          <h3 className="font-semibold mb-4">Revenue Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Average Order Value</span>
              <span className="font-semibold">₹{completedOrders.length > 0 ? (totalRevenue / completedOrders.length).toFixed(0) : 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Orders</span>
              <span className="font-semibold">{completedOrders.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending Orders</span>
              <span className="font-semibold">{orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-sm font-semibold">Total Earnings</span>
              <span className="text-lg font-bold text-primary">₹{totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Revenue;
