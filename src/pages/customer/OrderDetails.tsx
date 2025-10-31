import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CustomerLayout from "@/components/layouts/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, User, MapPin, IndianRupee, Package, ArrowLeft } from "lucide-react";

interface OrderProduct {
  id: number;
  pid: number;
  quantity: number;
  price: number; // unit price
}

interface ShopLite { id?: number; name?: string }
interface UserLite { id?: number; name?: string }

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
  shop?: ShopLite;
  customer?: UserLite;
}

export default function CustomerOrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (!orderId) throw new Error("Missing order id");
        const res = await fetch(`http://localhost:8080/api/v1/order/${orderId}`);
        if (!res.ok) {
          const msg = await res.text().catch(() => "Failed to load order");
          throw new Error(msg || "Failed to load order");
        }
        const data = (await res.json()) as Order;
        setOrder(data);
      } catch (e) {
        toast({ title: "Unable to load order", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId, toast]);

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Order Details</h1>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </div>

        {loading ? (
          <Card className="py-12"><CardContent className="text-center text-muted-foreground">Loading...</CardContent></Card>
        ) : !order ? (
          <Card className="py-12"><CardContent className="text-center text-muted-foreground">Order not found.</CardContent></Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
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
                  <IndianRupee className="h-4 w-4" />
                  <span className="font-medium">₹{Number(order.totalPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{order.recieverName || order.customer?.name || "Customer"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {order.addressLine1}
                    {order.addressLine2 ? `, ${order.addressLine2}` : ""}
                    {order.addressLine3 ? `, ${order.addressLine3}` : ""}
                    {order.pincode ? ` - ${order.pincode}` : ""}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {order.orderProductList?.length ? (
                  order.orderProductList.map((op) => (
                    <div key={op.id} className="flex items-center justify-between border rounded p-3">
                      <div className="text-muted-foreground">PID: {op.pid}</div>
                      <div className="text-muted-foreground">Qty: {op.quantity}</div>
                      <div className="font-medium">₹{Number(op.price).toFixed(2)}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">No items</div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
