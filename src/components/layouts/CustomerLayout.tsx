import { ShoppingBag, Search, ShoppingCart, User, Home, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { count } = useCart();
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/customer/dashboard" className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary">
                <ShoppingBag className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">Near Buy</span>
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
              <Link to="/customer/cart" className="relative">
                <Button asChild variant="ghost" size="icon">
                  <span>
                    <ShoppingCart className="h-5 w-5" />
                  </span>
                </Button>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 min-w-[1.25rem] px-1 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Link>
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
