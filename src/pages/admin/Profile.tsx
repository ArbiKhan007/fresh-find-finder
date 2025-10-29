import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, LogOut, Mail, Phone, MapPin, ShieldCheck } from "lucide-react";

interface UserProfile {
  id?: number;
  name?: string;
  email?: string;
  phoneNumber?: string | number;
  pincode?: string | number;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  userType?: string;
}

export default function AdminProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Admin Profile</h1>
          </div>
          <Button variant="destructive" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{user?.name || "—"}</span>
              <Badge variant="secondary" className="ml-2">{user?.userType || "ADMIN"}</Badge>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{user?.email || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{user?.phoneNumber || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {user?.addressLine1 || "—"}
                {user?.addressLine2 ? `, ${user.addressLine2}` : ""}
                {user?.addressLine3 ? `, ${user.addressLine3}` : ""}
                {user?.pincode ? `, PIN ${user.pincode}` : ""}
              </span>
            </div>
          </CardContent>
          <CardFooter className="gap-2">
            <Button asChild variant="outline">
              <Link to="/admin/dashboard">Back to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  );
}
