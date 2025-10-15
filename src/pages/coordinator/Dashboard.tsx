import { UserCheck, Ticket, Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CoordinatorLayout from "@/components/layouts/CoordinatorLayout";

export default function CoordinatorDashboard() {
  const stats = [
    { title: "Pending Approvals", value: "12", icon: Clock },
    { title: "Approved Today", value: "8", icon: CheckCircle },
    { title: "Open Tickets", value: "15", icon: Ticket },
    { title: "Resolved Tickets", value: "43", icon: UserCheck },
  ];

  const pendingApprovals = [
    { id: 1, shopName: "Green Valley Mart", owner: "John Smith", date: "2024-01-15" },
    { id: 2, shopName: "Fresh Corner", owner: "Sarah Johnson", date: "2024-01-14" },
  ];

  return (
    <CoordinatorLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Service Desk</h1>
          <p className="text-muted-foreground">Review registrations and manage support tickets</p>
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
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Shop Approvals</CardTitle>
            <CardDescription>Review and approve shopkeeper registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((shop) => (
                <div key={shop.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{shop.shopName}</p>
                    <p className="text-sm text-muted-foreground">Owner: {shop.owner}</p>
                    <p className="text-xs text-muted-foreground">Submitted: {shop.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm">Approve</Button>
                    <Button size="sm" variant="destructive">Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Support Tickets</CardTitle>
            <CardDescription>Open tickets requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Payment Issue</p>
                    <Badge variant="secondary">Medium</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Customer: Mike Brown</p>
                </div>
                <Button size="sm">Respond</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CoordinatorLayout>
  );
}
