import { useEffect, useState } from "react";
import ShopkeeperDashboard from "./Dashboard";
import { useToast } from "@/hooks/use-toast";

export default function ShopkeeperDashboardLoader() {
  const { toast } = useToast();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadShop = async () => {
      try {
        const raw = localStorage.getItem("user");
        if (!raw) throw new Error("User not found. Please log in again.");
        const user = JSON.parse(raw);
        if (!user?.id) throw new Error("Invalid user session. Missing user id.");

        const res = await fetch(`http://localhost:8080/api/v1/shop/get/shopkeeper/${user.id}`);
        if (!res.ok) {
          const msg = await res.text().catch(() => "Failed to fetch shop details");
          throw new Error(msg || "Failed to fetch shop details");
        }
        const shop = await res.json();
        // Persist for downstream pages (e.g., AddProduct could use shop.id)
        localStorage.setItem("shop", JSON.stringify(shop));
      } catch (err) {
        console.error("Failed to preload shop:", err);
        toast({
          title: "Shop Load Failed",
          description: err instanceof Error ? err.message : "Unable to load shop details",
          variant: "destructive",
        });
      } finally {
        setReady(true);
      }
    };

    loadShop();
  }, [toast]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading your shop...</div>
      </div>
    );
  }

  return <ShopkeeperDashboard />;
}
