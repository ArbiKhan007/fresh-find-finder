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

interface AddressForm {
  name: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  pincode: string;
}

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cod");
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

  // Ensure items are from a single shop (optional enforcement)
  const shopId = useMemo(() => {
    const ids = Array.from(new Set(items.map((i) => i.shopId).filter(Boolean)));
    return ids.length === 1 ? ids[0] : undefined;
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

    // Placeholder order creation. Replace with backend POST when available.
    const order = {
      shopId,
      items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
      amount: subtotal,
      paymentMethod,
      shippingAddress: addr,
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("lastOrder", JSON.stringify(order));
      clear();
      toast({ title: "Order placed", description: "Order saved locally (demo)." });
      navigate("/customer/dashboard");
    } catch (e) {
      toast({ title: "Failed to place order", variant: "destructive" });
    }
  };

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
                  <RadioGroupItem value="card" id="card" disabled />
                  <Label htmlFor="card">Card (coming soon)</Label>
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
