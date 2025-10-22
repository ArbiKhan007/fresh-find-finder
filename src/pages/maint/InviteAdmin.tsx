import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import MaintLayout from "@/components/layouts/MaintLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const inviteAdminSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  addressLine1: z.string().min(1, "Address Line 1 is required"),
  addressLine2: z.string().optional(),
  addressLine3: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"], { required_error: "Please select a gender" }),
});

type InviteAdminForm = z.infer<typeof inviteAdminSchema>;

export default function InviteAdmin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InviteAdminForm>({
    resolver: zodResolver(inviteAdminSchema),
  });

  const onSubmit = async (data: InviteAdminForm) => {
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual userId from authentication context
      const userId = localStorage.getItem("id") || "current-maint-user-id";
      
      const response = await fetch(`http://localhost:8080/admin/invite?userId=${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phoneNumber: parseInt(data.phoneNumber),
          pincode: parseInt(data.pincode),
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2 || "",
          addressLine3: data.addressLine3 || "",
          gender: data.gender,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to invite admin");
      }
      
      toast({
        title: "Success",
        description: "Admin invitation sent successfully!",
      });
      
      navigate("/maint/dashboard");
    } catch (error) {
      console.error("Error inviting admin:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to invite admin",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MaintLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/maint/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Invite Admin</h1>
            <p className="text-muted-foreground">Add a new administrator to the platform</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Details</CardTitle>
            <CardDescription>Fill in the information for the new admin user</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="9876543210"
                    maxLength={10}
                    {...register("phoneNumber")}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select onValueChange={(value) => setValue("gender", value as "Male" | "Female" | "Other")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-sm text-destructive">{errors.gender.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    placeholder="560001"
                    maxLength={6}
                    {...register("pincode")}
                  />
                  {errors.pincode && (
                    <p className="text-sm text-destructive">{errors.pincode.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    placeholder="Street address"
                    {...register("addressLine1")}
                  />
                  {errors.addressLine1 && (
                    <p className="text-sm text-destructive">{errors.addressLine1.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    placeholder="Apartment, suite, etc. (optional)"
                    {...register("addressLine2")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine3">Address Line 3</Label>
                  <Input
                    id="addressLine3"
                    placeholder="City, State (optional)"
                    {...register("addressLine3")}
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/maint/dashboard")}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Sending Invitation..." : "Invite Admin"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MaintLayout>
  );
}
