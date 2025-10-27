import { useEffect, useState } from "react";
import { Search, MapPin, Store, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CustomerLayout from "@/components/layouts/CustomerLayout";

export default function CustomerDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [nearbyShops, setNearbyShops] = useState<Array<{ id: number; name: string; distance?: string; rating?: number }>>([]);

  // Load shops saved by CustomerDashboardLoader and be resilient to different response shapes
  useEffect(() => {
    const readShops = () => {
      try {
        const raw = localStorage.getItem("shops");
        if (!raw) return;
        const parsed = JSON.parse(raw);

        // Support different shapes: array directly, or {data: []}, {content: []}, {items: []}
        const arr = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed?.data)
          ? parsed.data
          : Array.isArray(parsed?.content)
          ? parsed.content
          : Array.isArray(parsed?.items)
          ? parsed.items
          : [];

        if (arr.length) {
          setNearbyShops(
            arr
              .filter((s: any) => s && s.id != null)
              .map((s: any) => ({
                id: s.id,
                name: s.shopName || s.name || `Shop #${s.id}`,
                // Use whichever pincode field exists
                distance: (s.pincode ?? s.shopPincode) ? `PIN ${s.pincode ?? s.shopPincode}` : undefined,
                rating: 4.5,
              }))
          );
        }
      } catch {}
    };

    readShops();

    // Re-read if another tab updates localStorage
    const onStorage = (e: StorageEvent) => {
      if (e.key === "shops") readShops();
    };
    window.addEventListener("storage", onStorage);

    // Re-read when returning to tab (in case loader ran just before)
    const onFocus = () => readShops();
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const filteredShops = nearbyShops.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CustomerLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="gradient-hero rounded-2xl p-8 text-white shadow-elegant">
          <h1 className="text-4xl font-bold mb-2">Find Fresh Groceries</h1>
          <p className="text-lg opacity-90 mb-6">Delivered from local shops to your doorstep</p>
          
          <div className="flex gap-2 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for products..."
                className="pl-10 bg-white text-foreground border-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="secondary" size="lg">Search</Button>
          </div>
        </div>

        {/* Nearby Shops */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Shops Near You</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => (
              <Card key={shop.id} className="hover:shadow-elegant transition-smooth cursor-pointer">
                <CardHeader>
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <Store className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <CardTitle>{shop.name}</CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    {shop.distance && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {shop.distance}
                      </span>
                    )}
                    {shop.rating != null && (
                      <Badge variant="secondary">⭐ {shop.rating}</Badge>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Shop Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
