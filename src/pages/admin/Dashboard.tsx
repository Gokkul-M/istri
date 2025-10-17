import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, TrendingUp, Star, UserCheck, DollarSign, Loader2 } from "lucide-react";
import { Line, LineChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useFirebaseOrders } from "@/hooks/useFirebaseOrders";
import { useFirebaseUsers } from "@/hooks/useFirebaseUsers";
import { useFirebaseServices } from "@/hooks/useFirebaseServices";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { orders, loading: ordersLoading } = useFirebaseOrders();
  const { users, loading: usersLoading } = useFirebaseUsers();
  const { services, loading: servicesLoading } = useFirebaseServices();
  
  const loading = ordersLoading || usersLoading || servicesLoading;
  
  const customers = users.filter(u => u.role === 'customer');
  const launderers = users.filter(u => u.role === 'launderer');
  const completedOrders = orders.filter(o => o.status === 'completed');
  const pendingOrders = orders.filter(o => o.status === 'pending');
  
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const avgRating = launderers.reduce((sum, l) => sum + (l.rating || 0), 0) / (launderers.length || 1);

  // Calculate real revenue data from last 7 days
  const getLast7DaysRevenue = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const revenueMap = new Map();
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];
      revenueMap.set(dayName, 0);
    }
    
    // Calculate revenue for completed orders in last 7 days
    completedOrders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const diffTime = today.getTime() - orderDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 7) {
        const dayName = days[orderDate.getDay()];
        revenueMap.set(dayName, (revenueMap.get(dayName) || 0) + order.totalAmount);
      }
    });
    
    return Array.from(revenueMap.entries()).map(([day, revenue]) => ({ day, revenue }));
  };

  // Calculate weekly orders data
  const getWeeklyOrdersData = () => {
    const weeks = ['W1', 'W2', 'W3', 'W4'];
    const today = new Date();
    const ordersMap = new Map(weeks.map(w => [w, 0]));
    
    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const diffTime = today.getTime() - orderDate.getTime();
      const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
      
      if (diffWeeks < 4) {
        const weekKey = weeks[3 - diffWeeks];
        ordersMap.set(weekKey, (ordersMap.get(weekKey) || 0) + 1);
      }
    });
    
    return Array.from(ordersMap.entries()).map(([week, orders]) => ({ week, orders }));
  };

  const revenueData = getLast7DaysRevenue();
  const ordersData = getWeeklyOrdersData();

  if (loading) {
    return (
      <div className="px-6 pb-10 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="rounded-[1.5rem] border-border/30 shadow-soft">
              <CardContent className="p-5">
                <Skeleton className="w-12 h-12 rounded-[1.25rem] mb-3" />
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="rounded-[1.5rem] border-border/30 shadow-soft">
          <CardContent className="p-5">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-[220px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-6 pb-10 space-y-6">

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="rounded-[1.5rem] border-border/30 hover-lift transition-all shadow-soft">
          <CardContent className="p-5">
            <div className="w-12 h-12 rounded-[1.25rem] bg-secondary/20 flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-secondary" />
            </div>
            <p className="text-sm text-muted-foreground mb-1 tracking-tight">Customers</p>
            <h3 className="text-3xl font-bold mb-1">{customers.length}</h3>
            <p className="text-xs text-green-600 font-medium">+12.5% ↑</p>
          </CardContent>
        </Card>

        <Card className="rounded-[1.5rem] border-border/30 hover-lift transition-all shadow-soft">
          <CardContent className="p-5">
            <div className="w-12 h-12 rounded-[1.25rem] bg-tertiary/20 flex items-center justify-center mb-3">
              <UserCheck className="w-6 h-6 text-tertiary" />
            </div>
            <p className="text-sm text-muted-foreground mb-1 tracking-tight">Launderers</p>
            <h3 className="text-3xl font-bold mb-1">{launderers.length}</h3>
            <p className="text-xs text-green-600 font-medium">+8.2% ↑</p>
          </CardContent>
        </Card>

        <Card className="rounded-[1.5rem] border-border/30 hover-lift transition-all shadow-soft">
          <CardContent className="p-5">
            <div className="w-12 h-12 rounded-[1.25rem] bg-accent/20 flex items-center justify-center mb-3">
              <Package className="w-6 h-6 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground mb-1 tracking-tight">Total Orders</p>
            <h3 className="text-3xl font-bold mb-1">{orders.length}</h3>
            <p className="text-xs text-green-600 font-medium">+23.1% ↑</p>
          </CardContent>
        </Card>

        <Card className="rounded-[1.5rem] border-border/30 hover-lift transition-all shadow-soft">
          <CardContent className="p-5">
            <div className="w-12 h-12 rounded-[1.25rem] bg-primary/20 flex items-center justify-center mb-3">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground mb-1 tracking-tight">Revenue</p>
            <h3 className="text-3xl font-bold mb-1">₹{(totalRevenue/1000).toFixed(0)}k</h3>
            <p className="text-xs text-green-600 font-medium">+18.7% ↑</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card className="rounded-[1.5rem] border-border/30 shadow-soft">
        <CardHeader className="p-5">
          <CardTitle className="flex items-center gap-2 text-lg tracking-tight">
            <div className="w-8 h-8 rounded-[1.25rem] bg-accent/20 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-accent" />
            </div>
            Weekly Revenue
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="day" fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '1.25rem', 
                  border: '1px solid hsl(var(--border))' 
                }}
              />
              <Bar dataKey="revenue" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="rounded-[1.5rem] border-border/30 shadow-soft">
        <CardHeader className="p-5">
          <CardTitle className="flex items-center gap-2 text-lg tracking-tight">
            <div className="w-8 h-8 rounded-[1.25rem] bg-primary/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            Monthly Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="week" fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <YAxis fontSize={11} stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '1.25rem', 
                  border: '1px solid hsl(var(--border))' 
                }}
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="rounded-[1.5rem] border-border/30 shadow-soft">
        <CardHeader className="p-5">
          <CardTitle className="flex items-center gap-2 text-lg tracking-tight">
            <div className="w-8 h-8 rounded-[1.25rem] bg-secondary/20 flex items-center justify-center">
              <Package className="w-4 h-4 text-secondary" />
            </div>
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No orders yet</p>
              </div>
            ) : (
              orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-[1.25rem] hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      order.status === 'completed' ? 'bg-green-500/20' :
                      order.status === 'pending' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                    }`}>
                      <div className={`w-3 h-3 rounded-full ${
                        order.status === 'completed' ? 'bg-green-600' :
                        order.status === 'pending' ? 'bg-yellow-600' : 'bg-blue-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">₹{order.totalAmount}</p>
                    <p className="text-xs text-muted-foreground capitalize">{order.status.replace('_', ' ')}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
