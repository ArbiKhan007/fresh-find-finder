import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface Activity {
  id: number;
  text: string;
  user: {
    id: number;
    name: string;
  };
  createdAt: string;
}

interface Shop {
  id: number;
  shopName: string;
  gstNumber: string;
  state: string;
  pincode: number;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  phoneNumber: number;
}

interface RegistrationRequest {
  id: number;
  shop: Shop;
  shopDescription: string;
  activities: Activity[];
}

export default function RegistrationRequests() {
  const [requests, setRequests] = useState<RegistrationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegistrationRequests();
  }, []);

  const fetchRegistrationRequests = async () => {
    const userId = localStorage.getItem("userId");
    
    if (!userId) {
      toast({
        title: "Error",
        description: "User not logged in. Please login again.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/registration-requests?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch registration requests");
      }

      const data = await response.json();
      setRequests(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load registration requests. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Shop Registration Requests</h1>
          <p className="text-muted-foreground mt-2">
            Review and manage shop registration requests
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Requests</CardTitle>
            <CardDescription>
              {requests.length} registration request(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No registration requests found
              </p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Shop Name</TableHead>
                      <TableHead>GST Number</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Activities</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <>
                        <TableRow key={request.id}>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleRow(request.id)}
                            >
                              {expandedRows.has(request.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="font-medium">
                            {request.shop.shopName}
                          </TableCell>
                          <TableCell>{request.shop.gstNumber}</TableCell>
                          <TableCell>{request.shop.state}</TableCell>
                          <TableCell>{request.shop.phoneNumber}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {request.activities?.length || 0} activities
                            </Badge>
                          </TableCell>
                        </TableRow>
                        {expandedRows.has(request.id) && (
                          <TableRow>
                            <TableCell colSpan={6} className="bg-muted/50">
                              <div className="p-4 space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Shop Details</h4>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">Address:</span>
                                      <p>{request.shop.addressLine1}</p>
                                      {request.shop.addressLine2 && <p>{request.shop.addressLine2}</p>}
                                      {request.shop.addressLine3 && <p>{request.shop.addressLine3}</p>}
                                      <p>Pincode: {request.shop.pincode}</p>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Description:</span>
                                      <p>{request.shopDescription || "No description provided"}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                {request.activities && request.activities.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Activities</h4>
                                    <div className="space-y-2">
                                      {request.activities.map((activity) => (
                                        <div key={activity.id} className="border-l-2 border-primary pl-4 py-2">
                                          <p className="text-sm">{activity.text}</p>
                                          <p className="text-xs text-muted-foreground mt-1">
                                            By {activity.user.name} • {new Date(activity.createdAt).toLocaleString()}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
