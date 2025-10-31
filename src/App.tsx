import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/hooks/use-cart";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ShopRegistration from "./pages/ShopRegistration";
import CustomerDashboardLoader from "./pages/customer/DashboardLoader";
import ShopProducts from "./pages/customer/ShopProducts";
import CartPage from "./pages/customer/Cart";
import CheckoutPage from "./pages/customer/Checkout";
import ProfilePage from "./pages/customer/Profile";
import PurchasesPage from "./pages/customer/Purchases";
import ShopkeeperDashboardLoader from "./pages/shopkeeper/DashboardLoader";
import AddProduct from "./pages/shopkeeper/AddProduct";
import Products from "./pages/shopkeeper/Products";
import CoordinatorDashboard from "./pages/coordinator/Dashboard";
import CoordinatorRegistrationRequests from "./pages/coordinator/RegistrationRequests";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProfilePage from "./pages/admin/Profile";
import AdminInviteCoordinator from "./pages/admin/InviteCoordinator";
import AdminRegistrationRequests from "./pages/admin/RegistrationRequests";
import MaintDashboard from "./pages/maint/Dashboard";
import MaintProfilePage from "./pages/maint/Profile";
import MaintInviteAdmin from "./pages/maint/InviteAdmin";
import MaintInviteCoordinator from "./pages/maint/InviteCoordinator";
import MaintRegistrationRequests from "./pages/maint/RegistrationRequests";
import CoordinatorProfilePage from "./pages/coordinator/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/shop-registration" element={<ShopRegistration />} />
          
          {/* Customer Routes */}
          <Route path="/customer/dashboard" element={<CustomerDashboardLoader />} />
          <Route path="/customer/shops/:id/products" element={<ShopProducts />} />
          <Route path="/customer/cart" element={<CartPage />} />
          <Route path="/customer/checkout" element={<CheckoutPage />} />
          <Route path="/customer/profile" element={<ProfilePage />} />
          <Route path="/customer/purchases" element={<PurchasesPage />} />
          
          {/* Shopkeeper Routes */}
          <Route path="/shopkeeper/dashboard" element={<ShopkeeperDashboardLoader />} />
          <Route path="/shopkeeper/products" element={<Products />} />
          <Route path="/shopkeeper/products/add" element={<AddProduct />} />
          
          {/* Service Desk Coordinator Routes */}
          <Route path="/coordinator" element={<Navigate to="/coordinator/dashboard" replace />} />
          <Route path="/coordinator/dashboard" element={<CoordinatorDashboard />} />
          <Route path="/coordinator/approvals" element={<CoordinatorRegistrationRequests />} />
          <Route path="/coordinator/tickets" element={<CoordinatorDashboard />} />
          <Route path="/coordinator/registration-requests" element={<CoordinatorRegistrationRequests />} />
          <Route path="/coordinator/profile" element={<CoordinatorProfilePage />} />

          {/* Aliases for coordinator userType from backend */}
          <Route path="/service_coordinator" element={<Navigate to="/coordinator/dashboard" replace />} />
          <Route path="/service-coordinator" element={<Navigate to="/coordinator/dashboard" replace />} />
          <Route path="/service_desk_coordinator" element={<Navigate to="/coordinator/dashboard" replace />} />
          <Route path="/service-desk-coordinator" element={<Navigate to="/coordinator/dashboard" replace />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfilePage />} />
          <Route path="/admin/invite-coordinator" element={<AdminInviteCoordinator />} />
          <Route path="/admin/registration-requests" element={<AdminRegistrationRequests />} />
          
          {/* Maint (Superuser) Routes */}
          <Route path="/maint/dashboard" element={<MaintDashboard />} />
          <Route path="/maint/profile" element={<MaintProfilePage />} />
          <Route path="/maint/invite-admin" element={<MaintInviteAdmin />} />
          <Route path="/maint/invite-coordinator" element={<MaintInviteCoordinator />} />
          <Route path="/maint/registration-requests" element={<MaintRegistrationRequests />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
