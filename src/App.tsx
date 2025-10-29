import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/hooks/use-cart";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ShopRegistration from "./pages/ShopRegistration";
import CustomerDashboardLoader from "./pages/customer/DashboardLoader";
import ShopProducts from "./pages/customer/ShopProducts";
import ProfilePage from "./pages/customer/Profile";
import PurchasesPage from "./pages/customer/Purchases";
import CartPage from "./pages/customer/Cart";
import CheckoutPage from "./pages/customer/Checkout";
import ShopkeeperDashboardLoader from "./pages/shopkeeper/DashboardLoader";
import AddProduct from "./pages/shopkeeper/AddProduct";
import Products from "./pages/shopkeeper/Products";
import CoordinatorDashboard from "./pages/coordinator/Dashboard";
import CoordinatorRegistrationRequests from "./pages/coordinator/RegistrationRequests";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminInviteCoordinator from "./pages/admin/InviteCoordinator";
import AdminRegistrationRequests from "./pages/admin/RegistrationRequests";
import MaintDashboard from "./pages/maint/Dashboard";
import MaintInviteAdmin from "./pages/maint/InviteAdmin";
import MaintInviteCoordinator from "./pages/maint/InviteCoordinator";
import MaintRegistrationRequests from "./pages/maint/RegistrationRequests";
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
          <Route path="/customer/profile" element={<ProfilePage />} />
          <Route path="/customer/purchases" element={<PurchasesPage />} />
          <Route path="/customer/cart" element={<CartPage />} />
          <Route path="/customer/checkout" element={<CheckoutPage />} />
          
          {/* Shopkeeper Routes */}
          <Route path="/shopkeeper/dashboard" element={<ShopkeeperDashboardLoader />} />
          <Route path="/shopkeeper/products" element={<Products />} />
          <Route path="/shopkeeper/products/add" element={<AddProduct />} />
          
          {/* Service Desk Coordinator Routes */}
          <Route path="/coordinator/dashboard" element={<CoordinatorDashboard />} />
          <Route path="/coordinator/registration-requests" element={<CoordinatorRegistrationRequests />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/invite-coordinator" element={<AdminInviteCoordinator />} />
          <Route path="/admin/registration-requests" element={<AdminRegistrationRequests />} />
          
          {/* Maint (Superuser) Routes */}
          <Route path="/maint/dashboard" element={<MaintDashboard />} />
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
