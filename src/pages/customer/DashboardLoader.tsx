import { useEffect, useState } from "react";
import CustomerDashboard from "./Dashboard";
import { useToast } from "@/hooks/use-toast";

export default function CustomerDashboardLoader() {
  const { toast } = useToast();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadShopsForPincode = async () => {
      try {
        const raw = localStorage.getItem("user");
        if (!raw) throw new Error("User not found. Please log in again.");
        const user = JSON.parse(raw);
        const pincode = user?.pincode ?? user?.pincode?.value;
        if (!pincode) throw new Error("Missing pincode in user profile.");

        const res = await fetch(`http://localhost:8080/api/v1/shop/pincode/${pincode}`);
        if (!res.ok) {
          const msg = await res.text().catch(() => "Failed to fetch shops for your pincode");
          throw new Error(msg || "Failed to fetch shops");
        }
        const shops = await res.json();
        // Save for customer pages to use (e.g., list of shops)
        localStorage.setItem("shops", JSON.stringify(shops));
      } catch (err) {
        console.error("Failed to preload shops by pincode:", err);
        toast({
          title: "Unable to load shops",
          description: err instanceof Error ? err.message : "Error fetching shops for your pincode",
          variant: "destructive",
        });
      } finally {
        setReady(true);
      }
    };

    loadShopsForPincode();
  }, [toast]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading nearby shops...</div>
      </div>
    );
  }

  return <CustomerDashboard />;
}
