import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CustomerDashboard from "./pages/customer/Dashboard";
import ShopkeeperDashboard from "./pages/shopkeeper/Dashboard";
import CoordinatorDashboard from "./pages/coordinator/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminInviteCoordinator from "./pages/admin/InviteCoordinator";
import AdminInviteExecutive from "./pages/admin/InviteExecutive";
import MaintDashboard from "./pages/maint/Dashboard";
import MaintInviteAdmin from "./pages/maint/InviteAdmin";
import MaintInviteCoordinator from "./pages/maint/InviteCoordinator";
import MaintInviteExecutive from "./pages/maint/InviteExecutive";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Customer Routes */}
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          
          {/* Shopkeeper Routes */}
          <Route path="/shopkeeper/dashboard" element={<ShopkeeperDashboard />} />
          
          {/* Service Desk Coordinator Routes */}
          <Route path="/coordinator/dashboard" element={<CoordinatorDashboard />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/invite-coordinator" element={<AdminInviteCoordinator />} />
          <Route path="/admin/invite-executive" element={<AdminInviteExecutive />} />
          
          {/* Maint (Superuser) Routes */}
          <Route path="/maint/dashboard" element={<MaintDashboard />} />
          <Route path="/maint/invite-admin" element={<MaintInviteAdmin />} />
          <Route path="/maint/invite-coordinator" element={<MaintInviteCoordinator />} />
          <Route path="/maint/invite-executive" element={<MaintInviteExecutive />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
