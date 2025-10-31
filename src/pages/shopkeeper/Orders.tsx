import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShopkeeperLayout from "@/components/layouts/ShopkeeperLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Package, User, Calendar, IndianRupee, RefreshCcw } from "lucide-react";

// Backend-aligned typings
interface OrderProduct {
  id: number;
  pid: number;
  quantity: number;
  price: number; // unit price
}

interface CustomerLite {
  id?: number;
  name?: string;
}

interface Order {
  id: number | string;
  totalPrice: number;
  paymentMode?: string;
  paymentState?: string;
  placedDateTime?: string;
  recieverName?: string;
  orderProductList?: OrderProduct[];
  customer?: CustomerLite;
  status?: string; // Optional local/UI status
}

const STATUS_OPTIONS = [
  { value: "Pending", label: "Pending", variant: "secondary" as const },
  { value: "Accepted", label: "Accepted", variant: "default" as const },
  { value: "Out for Delivery", label: "Out for Delivery", variant: "outline" as const },
  { value: "Completed", label: "Completed", variant: "success" as const },
];

export default function OrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const navigate = useNavigate();

  const shopId = useMemo(() => {
    try {
      const raw = localStorage.getItem("shop");
      if (!raw) return undefined;
      const shop = JSON.parse(raw);
      return shop?.id as number | undefined;
    } catch {
      return undefined;
    }
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      if (!shopId) throw new Error("Shop not found. Please log in again.");

      const res = await fetch(`http://localhost:8080/api/v1/order/shop/${shopId}`);
      if (!res.ok) {
        const msg = await res.text().catch(() => "Failed to load orders");
        throw new Error(msg || "Failed to load orders");
      }
      const data: Order[] | null = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      toast({ title: "Failed to load orders", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopId]);

  const saveLocal = (next: Order[]) => {
    setOrders(next);
    try { localStorage.setItem("shopOrders", JSON.stringify(next)); } catch {}
  };

  const updateStatus = async (orderId: string | number, status: string) => {
    setUpdatingId(orderId);
    try {
      // Try backend PATCH/PUT
      try {
        const res = await fetch(`http://localhost:8080/api/v1/orders/${orderId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        if (res.ok) {
          toast({ title: "Status updated" });
        } else {
          throw new Error(await res.text());
        }
      } catch {
        // Fallback: update locally
        const next = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
        saveLocal(next);
        toast({ title: "Status updated (local)" });
      }

      // Refresh from source
      loadOrders();
    } catch (e) {
      toast({ title: "Failed to update status", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <ShopkeeperLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Orders</h1>
          </div>
          <Button variant="outline" onClick={loadOrders}>
            <RefreshCcw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>

        {loading ? (
          <Card className="py-12">
            <CardContent className="text-center text-muted-foreground">Loading orders...</CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="py-12">
            <CardContent className="text-center text-muted-foreground">No orders yet.</CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow cursor-pointer" onClick={() => navigate(`/shopkeeper/orders/${order.id}`)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <Badge variant="secondary">{(order.paymentMode || order.paymentState || "").toString()}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="grid md:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{order.placedDateTime ? new Date(order.placedDateTime).toLocaleString() : ""}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <IndianRupee className="h-4 w-4" />
                      <span className="font-medium">₹{Number(order.totalPrice || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{order.recieverName || order.customer?.name || "Customer"}</span>
                    </div>
                    <div className="text-muted-foreground">{order.orderProductList?.length || 0} items</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">Status:</span>
                    <Select
                      value={order.status || "Pending"}
                      onValueChange={(v) => updateStatus(order.id, v)}
                      disabled={updatingId === order.id}
                    >
                      <SelectTrigger className="w-56">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={(e) => { e.stopPropagation(); navigate(`/shopkeeper/orders/${order.id}`); }}>View</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ShopkeeperLayout>
  );
}
