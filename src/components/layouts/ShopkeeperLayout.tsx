import { ShoppingBag, Package, PackagePlus, ShoppingCart as Orders, Users, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ShopkeeperLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  const navItems = [
    { path: "/shopkeeper/dashboard", label: "Dashboard", icon: ShoppingBag },
    { path: "/shopkeeper/products", label: "Products", icon: Package },
    { path: "/shopkeeper/products/add", label: "Add Product", icon: PackagePlus },
    { path: "/shopkeeper/orders", label: "Orders", icon: Orders },
    { path: "/shopkeeper/delivery", label: "Delivery Staff", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/shopkeeper/dashboard" className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary">
                <ShoppingBag className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">Shopkeeper Portal</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 transition-smooth ${
                    location.pathname === item.path
                      ? "text-primary font-medium"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>

            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
