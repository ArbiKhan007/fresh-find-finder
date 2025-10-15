import { Users, AlertTriangle, Activity, UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/layouts/AdminLayout";

export default function AdminDashboard() {
  const stats = [
    { title: "Service Desk Coordinators", value: "15", icon: Users },
    { title: "P1 Escalations", value: "3", icon: AlertTriangle },
    { title: "P2 Escalations", value: "7", icon: Activity },
    { title: "Invitations Sent", value: "5", icon: UserPlus },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage coordinators and escalations</p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Coordinator
          </Button>
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
            <CardTitle>P1 Escalations</CardTitle>
            <CardDescription>Critical issues requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/50 bg-destructive/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">System Outage - Payment Gateway</p>
                    <Badge variant="destructive">P1</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Escalated: 2 hours ago</p>
                </div>
                <Button variant="destructive">Take Action</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Desk Coordinators</CardTitle>
            <CardDescription>Active coordinators on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">Emma Wilson</p>
                  <p className="text-sm text-muted-foreground">emma.wilson@example.com</p>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <Button size="sm" variant="outline">View Details</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
