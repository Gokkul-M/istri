import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import AppSelection from "./pages/AppSelection";
import Welcome from "./pages/Welcome";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import CustomerSetup from "./pages/auth/CustomerSetup";
import LaundererSetup from "./pages/auth/LaundererSetup";
import AdminLogin from "./pages/auth/AdminLogin";
import CustomerDashboard from "./pages/CustomerDashboard";
import LaundererDashboard from "./pages/LaundererDashboard";
import NewOrder from "./pages/NewOrder";
import NotFound from "./pages/NotFound";
import OrderTracking from "./pages/customer/OrderTracking";
import OrderHistory from "./pages/customer/OrderHistory";
import OrderDetails from "./pages/customer/OrderDetails";
import Profile from "./pages/customer/Profile";
import AddressManagement from "./pages/customer/AddressManagement";
import PaymentManagement from "./pages/customer/PaymentManagement";
import Settings from "./pages/customer/Settings";
import RatingFeedback from "./pages/customer/RatingFeedback";
import Offers from "./pages/customer/Offers";
import Notifications from "./pages/customer/Notifications";
import OrderManagement from "./pages/launderer/OrderManagement";
import LaundererOrderDetails from "./pages/launderer/OrderDetails";
import LaundererDisputeResolution from "./pages/launderer/DisputeResolution";
import BusinessProfile from "./pages/launderer/BusinessProfile";
import LaundererProfile from "./pages/launderer/Profile";
import ServicesManagement from "./pages/launderer/ServicesManagement";
import Revenue from "./pages/launderer/Revenue";
import LaundererSettings from "./pages/launderer/Settings";
import QRScanner from "./pages/launderer/QRScanner";
import AdminDashboard from "./pages/admin/Dashboard";
import CustomersManagement from "./pages/admin/CustomersManagement";
import LaunderersManagement from "./pages/admin/LaunderersManagement";
import OrdersManagement from "./pages/admin/OrdersManagement";
import AdminOrderManagement from "./pages/admin/OrderManagement";
import LocationTracking from "./pages/admin/LocationTracking";
import PaymentsRevenue from "./pages/admin/PaymentsRevenue";
import ComplaintsFeedback from "./pages/admin/ComplaintsFeedback";
import SystemSettings from "./pages/admin/SystemSettings";
import AdminProfile from "./pages/admin/AdminProfile";
import CouponsManagement from "./pages/admin/CouponsManagement";
import AdminServicesManagement from "./pages/admin/ServicesManagement";
import AdminDisputeResolution from "./pages/admin/DisputeResolution";
import Migration from "./pages/admin/Migration";
import { AdminLayout } from "./components/AdminLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/" element={<AppSelection />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/customer-setup" element={<CustomerSetup />} />
          <Route path="/launderer-setup" element={<LaundererSetup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/customer/new-order" element={<NewOrder />} />
          <Route path="/customer/tracking/:orderId" element={<OrderTracking />} />
          <Route path="/customer/orders" element={<OrderHistory />} />
          <Route path="/customer/order/:orderId" element={<OrderDetails />} />
          <Route path="/customer/profile" element={<Profile />} />
          <Route path="/customer/addresses" element={<AddressManagement />} />
          <Route path="/customer/payments" element={<PaymentManagement />} />
          <Route path="/customer/settings" element={<Settings />} />
          <Route path="/customer/rate/:orderId" element={<RatingFeedback />} />
          <Route path="/customer/offers" element={<Offers />} />
          <Route path="/customer/notifications" element={<Notifications />} />
          <Route path="/launderer" element={<LaundererDashboard />} />
          <Route path="/launderer/scan" element={<QRScanner />} />
          <Route path="/launderer/orders" element={<OrderManagement />} />
          <Route path="/launderer/order/:orderId" element={<LaundererOrderDetails />} />
          <Route path="/launderer/disputes" element={<LaundererDisputeResolution />} />
          <Route path="/launderer/profile" element={<LaundererProfile />} />
          <Route path="/launderer/business-profile" element={<BusinessProfile />} />
          <Route path="/launderer/services" element={<ServicesManagement />} />
          <Route path="/launderer/revenue" element={<Revenue />} />
          <Route path="/launderer/settings" element={<LaundererSettings />} />
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/customers" element={<ProtectedRoute requiredRole="admin"><AdminLayout><CustomersManagement /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/launderers" element={<ProtectedRoute requiredRole="admin"><AdminLayout><LaunderersManagement /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute requiredRole="admin"><AdminLayout><AdminOrderManagement /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/location" element={<ProtectedRoute requiredRole="admin"><AdminLayout><LocationTracking /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/payments" element={<ProtectedRoute requiredRole="admin"><AdminLayout><PaymentsRevenue /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/complaints" element={<ProtectedRoute requiredRole="admin"><AdminLayout><ComplaintsFeedback /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/disputes" element={<ProtectedRoute requiredRole="admin"><AdminLayout><AdminDisputeResolution /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><AdminLayout><SystemSettings /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute requiredRole="admin"><AdminLayout><AdminProfile /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/coupons" element={<ProtectedRoute requiredRole="admin"><AdminLayout><CouponsManagement /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/services" element={<ProtectedRoute requiredRole="admin"><AdminLayout><AdminServicesManagement /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/migration" element={<ProtectedRoute requiredRole="admin"><AdminLayout><Migration /></AdminLayout></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
