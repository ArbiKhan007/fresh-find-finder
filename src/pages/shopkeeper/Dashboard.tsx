import { Package, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ShopkeeperLayout from "@/components/layouts/ShopkeeperLayout";

export default function ShopkeeperDashboard() {
  const stats = [
    { title: "Total Products", value: "156", icon: Package, trend: "+12%" },
    { title: "Pending Orders", value: "23", icon: ShoppingBag, trend: "+5%" },
    { title: "Delivery Personnel", value: "8", icon: Users, trend: "+2" },
    { title: "Revenue (Today)", value: "$1,234", icon: TrendingUp, trend: "+18%" },
  ];

  return (
    <ShopkeeperLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your shop, products, and orders</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-primary mt-1">{stat.trend} from yesterday</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Orders awaiting processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Order #1234</p>
                    <p className="text-sm text-muted-foreground">2 items • $45.99</p>
                  </div>
                  <Button size="sm">View</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Order #1235</p>
                    <p className="text-sm text-muted-foreground">5 items • $89.50</p>
                  </div>
                  <Button size="sm">View</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alert</CardTitle>
              <CardDescription>Products running low</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Fresh Tomatoes</p>
                    <p className="text-sm text-destructive">Only 5 kg left</p>
                  </div>
                  <Button size="sm" variant="outline">Restock</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Organic Milk</p>
                    <p className="text-sm text-destructive">Only 8 units left</p>
                  </div>
                  <Button size="sm" variant="outline">Restock</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ShopkeeperLayout>
  );
}
