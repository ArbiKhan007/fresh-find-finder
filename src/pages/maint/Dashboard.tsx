import { Shield, Users, Store, Activity, UserPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MaintLayout from "@/components/layouts/MaintLayout";

export default function MaintDashboard() {
  const stats = [
    { title: "Total Users", value: "1,234", icon: Users },
    { title: "Total Shops", value: "156", icon: Store },
    { title: "Admins", value: "5", icon: Shield },
    { title: "Platform Health", value: "99.9%", icon: Activity },
  ];

  return (
    <MaintLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Superuser Dashboard</h1>
            <p className="text-muted-foreground">Complete platform control and monitoring</p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Admin
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

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>Platform health and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">API Response Time</span>
                  <span className="text-sm text-primary">125ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Active Sessions</span>
                  <span className="text-sm text-primary">432</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Database Size</span>
                  <span className="text-sm text-primary">2.4 GB</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Administrative tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">View All Users</Button>
              <Button className="w-full" variant="outline">Manage Shops</Button>
              <Button className="w-full" variant="outline">System Settings</Button>
              <Button className="w-full" variant="outline">View Logs</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MaintLayout>
  );
}
