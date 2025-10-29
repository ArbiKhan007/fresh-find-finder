import CustomerLayout from "@/components/layouts/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { ShoppingBag, Calendar, CreditCard, Package } from "lucide-react";

interface PurchaseItem {
  productId: number;
  quantity: number;
}

interface ShippingAddress {
  name: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  pincode: string;
}

interface PurchaseOrder {
  id?: string; // generated client-side for demo
  shopId?: number;
  items: PurchaseItem[];
  amount: number;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  createdAt: string;
}

export default function PurchasesPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);

  useEffect(() => {
    // Demo: read from localStorage. Backend integration can replace this easily.
    try {
      const saved = localStorage.getItem("purchases");
      let arr: PurchaseOrder[] = [];
      if (saved) {
        arr = JSON.parse(saved);
      } else {
        const last = localStorage.getItem("lastOrder");
        if (last) arr = [JSON.parse(last) as PurchaseOrder];
      }
      // Ensure each has an id
      arr = arr.map((o) => ({ ...o, id: o.id || o.createdAt }));
      setOrders(arr);
    } catch {}
  }, []);

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold">My Purchases</h1>
        </div>

        {orders.length === 0 ? (
          <Card className="py-12">
            <CardContent className="text-center text-muted-foreground">
              No purchases yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Order</CardTitle>
                    <Badge variant="secondary">{order.paymentMethod.toUpperCase()}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>{order.items?.length || 0} items</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    <span>Paid on delivery</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold">₹{order.amount.toFixed(2)}</span>
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
