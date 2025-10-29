import CustomerLayout from "@/components/layouts/CustomerLayout";
import { useCart } from "@/hooks/use-cart";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQty, clear, subtotal } = useCart();

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Your Cart</h1>
          </div>
          {items.length > 0 && (
            <Button variant="outline" onClick={clear}>
              <Trash2 className="h-4 w-4 mr-2" /> Clear Cart
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <Card className="py-12">
            <CardContent className="text-center text-muted-foreground">
              Your cart is empty.
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-24 h-24 bg-muted rounded-md overflow-hidden flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate">
                          <div className="font-medium truncate">{item.productName}</div>
                          <div className="text-sm text-muted-foreground truncate">{item.manufacturer}</div>
                        </div>
                        {item.category && (
                          <Badge variant="secondary" className="shrink-0">{item.category}</Badge>
                        )}
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" onClick={() => updateQty(item.id, item.quantity - 1)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <div className="w-10 text-center select-none">{item.quantity}</div>
                          <Button size="icon" variant="outline" onClick={() => updateQty(item.id, item.quantity + 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-lg font-semibold">
                            {(() => {
                              const p = parseFloat(item.price);
                              const d = isNaN(p) ? 0 : p - (p * (item.discount || 0)) / 100;
                              return `₹${(d * item.quantity).toFixed(2)}`;
                            })()}
                          </div>
                          <Button variant="destructive" size="icon" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Delivery</span>
                    <span>Calculated at checkout</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Proceed to Checkout</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
