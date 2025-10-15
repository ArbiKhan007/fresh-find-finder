import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Store, Search, ShoppingCart, MapPin } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Fresh Groceries Delivered to Your Doorstep
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Connect with local grocery shops in your area. Fresh products, fast delivery, best prices.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="text-lg">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Start Shopping
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg bg-white/10 hover:bg-white/20 text-white border-white/30">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Search Products</h3>
              <p className="text-muted-foreground">
                Find what you need across multiple local shops
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Store className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Choose Your Shop</h3>
              <p className="text-muted-foreground">
                Compare prices and ratings from nearby stores
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Get Delivered</h3>
              <p className="text-muted-foreground">
                Fast delivery from local shops to your door
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Shopkeepers */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Store className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Are You a Shopkeeper?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join our platform to reach more customers and grow your business. 
              Manage your inventory, track orders, and expand your reach.
            </p>
            <Link to="/signup">
              <Button size="lg" className="text-lg">
                Register Your Shop
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Near Buy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
