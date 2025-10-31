import CustomerLayout from "@/components/layouts/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Calendar, CreditCard, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Minimal typings aligned to backend Order/OrderProduct
interface OrderProduct {
  id: number;
  pid: number;
  quantity: number;
  price: number; // unit price
}

interface Order {
  id: number;
  totalPrice: number;
  paymentMode?: string;
  paymentState?: string;
  placedDateTime?: string;
  recieverName?: string;
  phoneNumber?: number;
  pincode?: number;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  orderProductList?: OrderProduct[];
}

export default function PurchasesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const raw = localStorage.getItem("user");
        if (!raw) {
          setOrders([]);
          return;
        }
        const user = JSON.parse(raw) as { id?: number; customerId?: number };
        const userId = user?.id ?? user?.customerId;
        if (!userId) {
          setOrders([]);
          return;
        }

        const res = await fetch(`http://localhost:8080/api/v1/order/user/${userId}`);
        if (!res.ok) {
          const msg = await res.text().catch(() => "Failed to load orders");
          throw new Error(msg || "Failed to load orders");
        }
        const data = (await res.json()) as Order[] | null;
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        toast({ title: "Unable to load orders", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold">My Purchases</h1>
        </div>

        {loading ? (
          <Card className="py-12">
            <CardContent className="text-center text-muted-foreground">Loading orders…</CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="py-12">
            <CardContent className="text-center text-muted-foreground">
              No purchases yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow cursor-pointer" onClick={() => navigate(`/customer/orders/${order.id}`)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <Badge variant="secondary">{(order.paymentMode || order.paymentState || "").toString()}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{order.placedDateTime ? new Date(order.placedDateTime).toLocaleString() : ""}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>{order.orderProductList?.length || 0} items</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    <span>{(order.paymentMode || "").toString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold">₹{Number(order.totalPrice ?? 0).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
