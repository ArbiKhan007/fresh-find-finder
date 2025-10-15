import { ShoppingBag, Search, ShoppingCart, User, Home, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/customer/dashboard" className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary">
                <ShoppingBag className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">GroceryHub</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link to="/customer/dashboard" className="flex items-center gap-2 text-foreground hover:text-primary transition-smooth">
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link to="/customer/shops" className="flex items-center gap-2 text-foreground hover:text-primary transition-smooth">
                <Store className="h-4 w-4" />
                Shops
              </Link>
              <Link to="/customer/search" className="flex items-center gap-2 text-foreground hover:text-primary transition-smooth">
                <Search className="h-4 w-4" />
                Search
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
