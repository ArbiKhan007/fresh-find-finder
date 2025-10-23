import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Store } from "lucide-react";

const ShopRegistration = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Shop details
    shopName: "",
    gstNumber: "",
    state: "",
    shopPincode: "",
    shopAddressLine1: "",
    shopAddressLine2: "",
    shopAddressLine3: "",
    shopPhoneNumber: "",
    // Shopkeeper details
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    pincode: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    gender: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (value: string) => {
    setFormData(prev => ({ ...prev, gender: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch("http://localhost:8080/api/v1/shop/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopName: formData.shopName,
          gstNumber: formData.gstNumber,
          state: formData.state,
          shopPincode: parseInt(formData.shopPincode),
          shopAddressLine1: formData.shopAddressLine1,
          shopAddressLine2: formData.shopAddressLine2 || "",
          shopAddressLine3: formData.shopAddressLine3 || "",
          shopPhoneNumber: parseInt(formData.shopPhoneNumber),

          name: formData.name,
          email: formData.email,
          password: formData.password,
          phoneNumber: parseInt(formData.phoneNumber),
          pincode: parseInt(formData.pincode),
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2 || "",
          addressLine3: formData.addressLine3 || "",
          userType: "SHOPKEEPER",
          gender: formData.gender,
          status: "ACTIVE",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to register shop");
      }

      toast({
        title: "Success",
        description: "Shop registered successfully!",
      });

      navigate("/login");
    } catch (error) {
      console.error("Error registering shop:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register shop. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-3xl">Shop Registration</CardTitle>
            <CardDescription>Register your shop and create a shopkeeper account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shop Information Section */}
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold">Shop Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shopName">Shop Name *</Label>
                    <Input
                      id="shopName"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gstNumber">GST Number *</Label>
                    <Input
                      id="gstNumber"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shopPhoneNumber">Shop Phone Number *</Label>
                    <Input
                      id="shopPhoneNumber"
                      name="shopPhoneNumber"
                      type="number"
                      value={formData.shopPhoneNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shopPincode">Pincode *</Label>
                    <Input
                      id="shopPincode"
                      name="shopPincode"
                      type="number"
                      value={formData.shopPincode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shopAddressLine1">Address Line 1 *</Label>
                    <Input
                      id="shopAddressLine1"
                      name="shopAddressLine1"
                      value={formData.shopAddressLine1}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shopAddressLine2">Address Line 2</Label>
                    <Input
                      id="shopAddressLine2"
                      name="shopAddressLine2"
                      value={formData.shopAddressLine2}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shopAddressLine3">Address Line 3</Label>
                    <Input
                      id="shopAddressLine3"
                      name="shopAddressLine3"
                      value={formData.shopAddressLine3}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Shopkeeper Information Section */}
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <h3 className="text-lg font-semibold">Shopkeeper Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="number"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      type="number"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input
                      id="addressLine1"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine3">Address Line 3</Label>
                    <Input
                      id="addressLine3"
                      name="addressLine3"
                      value={formData.addressLine3}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Gender *</Label>
                    <RadioGroup value={formData.gender} onValueChange={handleGenderChange} required>
                      <div className="flex gap-6">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Male" id="male" />
                          <Label htmlFor="male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Female" id="female" />
                          <Label htmlFor="female">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Other" id="other" />
                          <Label htmlFor="other">Other</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register Shop"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShopRegistration;
