import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CoordinatorLayout from "@/components/layouts/CoordinatorLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Activity {
  id: number;
  text: string;
  user: {
    id: number;
    name: string;
  };
  createdAt: string;
}

interface Shopkeeper {
  id: number;
  name: string;
  email: string;
  password: string;
  phoneNumber: number;
  pincode: number;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  userType: string;
  gender: string;
  status: string;
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
  shopkeeper: Shopkeeper;
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
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newActivity, setNewActivity] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegistrationRequests();
  }, []);

  const fetchRegistrationRequests = async () => {
    const userStr = localStorage.getItem("user");
    
    if (!userStr) {
      toast({
        title: "Error",
        description: "User not logged in. Please login again.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    const user = JSON.parse(userStr);
    const userId = user.id;

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/registration-request/all?userId=${userId}`,
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

  const openRequestForm = (request: RegistrationRequest) => {
    setSelectedRequest(request);
    setSelectedStatus(request.shop.shopkeeper.status);
    setNewActivity("");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedRequest) return;

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      toast({
        title: "Error",
        description: "User not logged in.",
        variant: "destructive",
      });
      return;
    }

    const user = JSON.parse(userStr);

    setIsSaving(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/registration-request/${selectedRequest.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            status: selectedStatus,
            activityText: newActivity.trim() || undefined,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update registration request");
      }

      toast({
        title: "Success",
        description: "Registration request updated successfully",
      });

      setDialogOpen(false);
      fetchRegistrationRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update registration request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <CoordinatorLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </CoordinatorLayout>
    );
  }

  return (
    <CoordinatorLayout>
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
                        <TableRow 
                          key={request.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => openRequestForm(request)}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registration Request Details</DialogTitle>
            <DialogDescription>
              View complete details of the shop registration request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Shop Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Shop Name</Label>
                    <Input value={selectedRequest.shop.shopName} readOnly />
                  </div>
                  <div>
                    <Label>GST Number</Label>
                    <Input value={selectedRequest.shop.gstNumber} readOnly />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input value={selectedRequest.shop.state} readOnly />
                  </div>
                  <div>
                    <Label>Pincode</Label>
                    <Input value={selectedRequest.shop.pincode} readOnly />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input value={selectedRequest.shop.phoneNumber} readOnly />
                  </div>
                  <div className="col-span-2">
                    <Label>Address Line 1</Label>
                    <Input value={selectedRequest.shop.addressLine1} readOnly />
                  </div>
                  <div>
                    <Label>Address Line 2</Label>
                    <Input value={selectedRequest.shop.addressLine2 || ""} readOnly />
                  </div>
                  <div>
                    <Label>Address Line 3</Label>
                    <Input value={selectedRequest.shop.addressLine3 || ""} readOnly />
                  </div>
                  <div className="col-span-2">
                    <Label>Shop Description</Label>
                    <Textarea value={selectedRequest.shopDescription || ""} readOnly rows={3} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Shopkeeper Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input value={selectedRequest.shop.shopkeeper.name} readOnly />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={selectedRequest.shop.shopkeeper.email} readOnly />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input value={selectedRequest.shop.shopkeeper.phoneNumber} readOnly />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Input value={selectedRequest.shop.shopkeeper.gender} readOnly />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge variant={selectedRequest.shop.shopkeeper.status === "PENDING_REVIEW" ? "secondary" : "default"}>
                      {selectedRequest.shop.shopkeeper.status}
                    </Badge>
                  </div>
                  <div>
                    <Label>Pincode</Label>
                    <Input value={selectedRequest.shop.shopkeeper.pincode} readOnly />
                  </div>
                  <div className="col-span-2">
                    <Label>Address Line 1</Label>
                    <Input value={selectedRequest.shop.shopkeeper.addressLine1} readOnly />
                  </div>
                  <div>
                    <Label>Address Line 2</Label>
                    <Input value={selectedRequest.shop.shopkeeper.addressLine2 || ""} readOnly />
                  </div>
                  <div>
                    <Label>Address Line 3</Label>
                    <Input value={selectedRequest.shop.shopkeeper.addressLine3 || ""} readOnly />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Status</h3>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="PENDING_REVIEW">Pending Review</SelectItem>
                    <SelectItem value="DELETED">Deleted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Activity History</h3>
                <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                  {selectedRequest.activities && selectedRequest.activities.length > 0 ? (
                    selectedRequest.activities.map((activity) => (
                      <div key={activity.id} className="border-l-2 border-primary pl-4 py-2 bg-muted/50 rounded">
                        <p className="text-sm">{activity.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          By {activity.user.name} • {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No activities yet</p>
                  )}
                </div>
                <div>
                  <Label>Add New Comment</Label>
                  <Textarea 
                    value={newActivity}
                    onChange={(e) => setNewActivity(e.target.value)}
                    placeholder="Enter your comment or activity..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CoordinatorLayout>
  );
}
