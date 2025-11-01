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
  productName?: string;
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
  deliveryStatus?: string;
  deliveredDateTime?: string;
}

interface ProductDetails {
  id: number;
  productName?: string;
  productSpecification?: string;
  manufacturer?: string;
  price?: number | string;
  discount?: number;
  category?: string;
  productImageLinks?: Array<{ id?: number; url?: string } | string>;
}

export default function CustomerOrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [products, setProducts] = useState<Record<number, ProductDetails>>({});

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
        const data = (await res.json()) as any;
        setOrder(normalizeOrder(data));
      } catch (e) {
        toast({ title: "Unable to load order", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId, toast]);

  function normalizeOrder(raw: any): Order {
    const list = raw?.orderProductList ?? raw?.orderProducts ?? [];
    const orderProductList: OrderProduct[] = Array.isArray(list)
      ? list.map((op: any) => ({
          id: op?.id ?? 0,
          pid: op?.pid ?? op?.productId ?? op?.product?.id ?? 0,
          quantity: op?.quantity ?? op?.qty ?? 0,
          price: Number(op?.price ?? op?.unitPrice ?? op?.amount ?? 0),
          productName: op?.productName ?? op?.product?.productName,
        }))
      : [];

    return {
      id: raw?.id,
      totalPrice: Number(raw?.totalPrice ?? 0),
      paymentMode: raw?.paymentMode,
      paymentState: raw?.paymentState,
      placedDateTime: raw?.placedDateTime,
      recieverName: raw?.recieverName,
      phoneNumber: raw?.phoneNumber,
      pincode: raw?.pincode,
      addressLine1: raw?.addressLine1,
      addressLine2: raw?.addressLine2,
      addressLine3: raw?.addressLine3,
      orderProductList,
      shop: raw?.shop,
      customer: raw?.customer,
      deliveryStatus: raw?.state,
      deliveredDateTime: raw?.deliveredDateTime,
    } as Order;
  }

  function normalizeImageUrl(u?: string): string | undefined {
    if (!u) return undefined;
    if (u.startsWith("http://") || u.startsWith("https://") || u.startsWith("data:")) return u;
    // Treat as relative path coming from backend
    return `http://localhost:8080${u.startsWith("/") ? "" : "/"}${u}`;
  }

  function firstImageUrl(pid: number): string | undefined {
    const p = products[pid] as any;
    if (!p) return undefined;
    console.log(JSON.stringify(p.productImageLinks[0]));
    return p.productImageLinks[0].imageLink;
  }

  async function toggleItem(pid: number) {
    setExpanded((prev) => ({ ...prev, [pid]: !prev[pid] }));
    if (!products[pid]) {
      try {
        const res = await fetch(`http://localhost:8080/api/v1/shop/product/${pid}`);
        if (!res.ok) return;
        const p = (await res.json()) as ProductDetails;
        setProducts((m) => ({ ...m, [pid]: p }));
      } catch {}
    }
  }

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
                    <div key={op.id} className="border rounded">
                      <button
                        type="button"
                        onClick={() => toggleItem(Number(op.pid))}
                        className="w-full flex items-center justify-between p-3 hover:bg-muted/40"
                      >
                        <div className="flex items-center gap-2 text-left">
                          <span className="text-muted-foreground">
                            {products[Number(op.pid)]?.productName || op.productName || `PID: ${op.pid}`}
                          </span>
                          <span className="text-xs text-muted-foreground">Qty: {op.quantity}</span>
                        </div>
                        <div className="font-medium">₹{Number(op.price).toFixed(2)}</div>
                      </button>
                      {expanded[Number(op.pid)] && (
                        <div className="px-4 pb-4">
                          <div className="flex gap-4">
                            <div className="w-20 h-20 rounded border bg-white overflow-hidden flex items-center justify-center">
                              {firstImageUrl(Number(op.pid)) ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={firstImageUrl(Number(op.pid))} alt={products[Number(op.pid)]?.productName || op.productName || `PID: ${op.pid}`} className="w-full h-full object-contain" />
                              ) : (
                                <div className="text-xs text-muted-foreground">No image</div>
                              )}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-start gap-2">
                                <span className="font-medium text-foreground leading-snug">
                                  {products[Number(op.pid)]?.productName || op.productName || `PID: ${op.pid}`}
                                </span>
                                <Badge variant="secondary" className="ml-2">x{op.quantity}</Badge>
                              </div>
                              {products[Number(op.pid)]?.productSpecification && (
                                <div className="text-sm text-muted-foreground line-clamp-2">
                                  {products[Number(op.pid)]?.productSpecification}
                                </div>
                              )}
                              <div className="text-sm text-foreground font-medium">
                                {(() => {
                                  const status = order.deliveryStatus || order.paymentState || "Delivered";
                                  const onDate = order.deliveredDateTime ? new Date(order.deliveredDateTime).toLocaleDateString() : null;
                                  return onDate ? `${status} on ${onDate}` : status;
                                })()}
                              </div>
                              <div className="text-xs text-muted-foreground">{order.deliveryStatus ? "Return window closes soon" : ""}</div>

                              <div className="mt-3 flex flex-wrap gap-2">
                                <Button className="bg-yellow-400 text-black hover:bg-yellow-500">Buy it again</Button>
                                <Button variant="outline">View your item</Button>
                              </div>
                            </div>
                            <div className="hidden md:flex flex-col gap-2 w-56">
                              <Button className="bg-yellow-400 text-black hover:bg-yellow-500">Get product support</Button>
                              <Button variant="outline">Track package</Button>
                              <Button variant="outline">Leave seller feedback</Button>
                              <Button variant="outline">Leave delivery feedback</Button>
                              <Button variant="outline">Write a product review</Button>
                            </div>
                          </div>
                          <div className="mt-3 grid md:hidden gap-2">
                            <Button className="bg-yellow-400 text-black hover:bg-yellow-500">Get product support</Button>
                            <Button variant="outline">Track package</Button>
                            <Button variant="outline">Leave seller feedback</Button>
                            <Button variant="outline">Leave delivery feedback</Button>
                            <Button variant="outline">Write a product review</Button>
                          </div>
                          <div className="mt-3 grid md:grid-cols-3 gap-2 text-muted-foreground text-sm">
                            <div>
                              <span className="font-medium text-foreground">MRP: </span>
                              {products[Number(op.pid)]?.price ?? "—"}
                            </div>
                            <div>
                              <span className="font-medium text-foreground">Discount: </span>
                              {products[Number(op.pid)]?.discount ?? 0}%
                            </div>
                            <div>
                              <span className="font-medium text-foreground">Subtotal: </span>
                              ₹{(Number(op.price) * Number(op.quantity)).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      )}
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
