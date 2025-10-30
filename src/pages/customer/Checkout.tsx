import { useEffect, useMemo, useState } from "react";
import CustomerLayout from "@/components/layouts/CustomerLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Backend DTO types for clarity
interface OrderProductDto {
  pid: number;
  quantity: number;
  price: number; // unit price to charge (post-discount)
}

type PaymentMode = "COD" | "CREDIT_CARD" | "DEBIT_CARD" | "UPI";

interface PlaceOrderDto {
  totalPrice: number;
  customerId: number;
  shopId: number;
  recieverName: string;
  phoneNumber: number;
  pincode: number;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  paymentMode: PaymentMode;
  orderProductList: OrderProductDto[];
}

// Safe JSON.parse helper
function safeJsonParse<T = unknown>(str: string): T | undefined {
  try {
    return JSON.parse(str) as T;
  } catch {
    return undefined;
  }
}

interface AddressForm {
  name: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  pincode: string;
}

interface LocalUser {
  id?: number;
  customerId?: number;
  name?: string;
  phoneNumber?: number | string;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  pincode?: number | string;
}

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  type PaymentSelection = "cod" | "credit_card" | "debit_card" | "upi";
  const [paymentMethod, setPaymentMethod] = useState<PaymentSelection>("cod");
  const [addr, setAddr] = useState<AddressForm>({
    name: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    pincode: "",
  });

  // Prefill from localStorage user
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return;
      const user = JSON.parse(raw);
      setAddr((prev) => ({
        ...prev,
        name: user?.name || prev.name,
        phoneNumber: user?.phoneNumber?.toString?.() || prev.phoneNumber,
        addressLine1: user?.addressLine1 || prev.addressLine1,
        addressLine2: user?.addressLine2 || prev.addressLine2,
        addressLine3: user?.addressLine3 || prev.addressLine3,
        pincode: user?.pincode?.toString?.() || prev.pincode,
      }));
    } catch {}
  }, []);

  // Group items by shopId so each shop creates a separate order
  const groupedByShop = useMemo(() => {
    const groups = new Map<number, typeof items>();
    for (const it of items) {
      if (typeof it.shopId !== "number") continue; // skip if no shopId
      const arr = groups.get(it.shopId) ?? [];
      arr.push(it);
      groups.set(it.shopId, arr);
    }
    return groups;
  }, [items]);

  const placeOrder = async () => {
    if (items.length === 0) {
      toast({ title: "Cart is empty", variant: "destructive" });
      return;
    }
    if (!addr.name || !addr.addressLine1 || !addr.pincode) {
      toast({ title: "Missing address details", description: "Please fill required fields." , variant: "destructive"});
      return;
    }
    // Resolve customerId from localStorage user
    const rawUser = localStorage.getItem("user");
    const parsedUser = rawUser ? safeJsonParse<LocalUser>(rawUser) : undefined;
    const customerId: number | undefined = parsedUser?.id ?? parsedUser?.customerId;

    if (!customerId) {
      toast({ title: "User not identified", description: "Missing customer id.", variant: "destructive" });
      return;
    }

    // Build payload: List<PlaceOrderDto>
    const payload: PlaceOrderDto[] = [];
    for (const [shopId, shopItems] of groupedByShop) {
      const orderProductList: OrderProductDto[] = shopItems.map((i) => {
        const base = parseFloat(i.price);
        const unit = isNaN(base) ? 0 : base - (base * (i.discount || 0)) / 100;
        return { pid: i.id, quantity: i.quantity, price: Number(unit.toFixed(2)) };
      });

      const totalPrice = orderProductList.reduce((sum, p) => sum + p.price * p.quantity, 0);
      payload.push({
        totalPrice: Number(totalPrice.toFixed(2)),
        customerId,
        shopId,
        recieverName: addr.name,
        phoneNumber: Number(addr.phoneNumber),
        pincode: Number(addr.pincode),
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2,
        addressLine3: addr.addressLine3,
        paymentMode: paymentModeFromSelection(paymentMethod),
        orderProductList,
      });
    }

    if (payload.length === 0) {
      toast({ title: "Missing shop information", description: "Items have no shopId.", variant: "destructive" });
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/v1/order/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "Failed to place order");
        throw new Error(msg || "Failed to place order");
      }
      // Attempt to read created orders list if provided
      const data = await res
        .json()
        .catch(() => undefined) as { id?: number }[] | undefined;
      clear();
      const count = Array.isArray(data) ? data.length : payload.length;
      toast({ title: "Order placed", description: `${count} order(s) created.` });
      navigate("/customer/dashboard");
    } catch (e) {
      toast({ title: "Failed to place order", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
    }
  };

  function paymentModeFromSelection(sel: PaymentSelection): PaymentMode {
    switch (sel) {
      case "cod":
        return "COD";
      case "credit_card":
        return "CREDIT_CARD";
      case "debit_card":
        return "DEBIT_CARD";
      case "upi":
        return "UPI";
      default:
        return "COD";
    }
  }

  return (
    <CustomerLayout>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Address */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Delivery Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={addr.name} onChange={(e) => setAddr({ ...addr, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={addr.phoneNumber} onChange={(e) => setAddr({ ...addr, phoneNumber: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="addr1">Address Line 1</Label>
              <Input id="addr1" value={addr.addressLine1} onChange={(e) => setAddr({ ...addr, addressLine1: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addr2">Address Line 2</Label>
              <Input id="addr2" value={addr.addressLine2} onChange={(e) => setAddr({ ...addr, addressLine2: e.target.value })} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="addr3">City/State</Label>
                <Input id="addr3" value={addr.addressLine3} onChange={(e) => setAddr({ ...addr, addressLine3: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input id="pincode" value={addr.pincode} onChange={(e) => setAddr({ ...addr, pincode: e.target.value })} required />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
                <div className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
                  <RadioGroupItem value="credit_card" id="credit_card" disabled />
                  <Label htmlFor="credit_card">Credit Card (coming soon)</Label>
                </div>
                <div className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
                  <RadioGroupItem value="debit_card" id="debit_card" disabled />
                  <Label htmlFor="debit_card">Debit Card (coming soon)</Label>
                </div>
                <div className="flex items-center space-x-2 opacity-50 cursor-not-allowed">
                  <RadioGroupItem value="upi" id="upi" disabled />
                  <Label htmlFor="upi">UPI (coming soon)</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Items</span>
                <span>{items.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Delivery</span>
                <span>Calculated at order confirmation</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={placeOrder} disabled={items.length === 0}>Place Order</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </CustomerLayout>
  );
}
