import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, PackagePlus } from "lucide-react";

interface ProductForm {
  productName: string;
  productSpecification: string;
  manufacturer: string;
  price: string;
  discount: string;
  category: string;
  shopId?: string;
  imageLinks: string[];
}

export default function AddProduct() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shops, setShops] = useState<Array<{ id: number; shopName: string }>>([]);
  const [form, setForm] = useState<ProductForm>({
    productName: "",
    productSpecification: "",
    manufacturer: "",
    price: "",
    discount: "0",
    category: "",
    shopId: "",
    imageLinks: [""]
  });

  // Load shop(s) from localStorage (set at login/dashboard loader)
  useEffect(() => {
    try {
      // Support both single shop under key 'shop' and multiple under 'shops'
      const rawSingle = localStorage.getItem("shop");
      const rawMany = localStorage.getItem("shops");
      let loaded: Array<{ id: number; shopName: string }> = [];

      if (rawMany) {
        const arr = JSON.parse(rawMany);
        if (Array.isArray(arr)) {
          loaded = arr.map((s: any) => ({ id: s.id, shopName: s.shopName }))
                      .filter((s: any) => s.id != null);
        }
      } else if (rawSingle) {
        const s = JSON.parse(rawSingle);
        if (s && typeof s === "object" && s.id != null) {
          loaded = [{ id: s.id, shopName: s.shopName || `Shop #${s.id}` }];
        }
      }

      setShops(loaded);
      if (loaded.length > 0) {
        setForm(prev => ({ ...prev, shopId: String(loaded[0].id) }));
      }
    } catch (e) {
      // ignore parsing errors, keep shops empty
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setForm(prev => ({ ...prev, category: value }));
  };

  const handleShopChange = (value: string) => {
    setForm(prev => ({ ...prev, shopId: value }));
  };

  const handleImageLinkChange = (index: number, value: string) => {
    const next = [...form.imageLinks];
    next[index] = value;
    setForm(prev => ({ ...prev, imageLinks: next }));
  };

  const addImageField = () => setForm(prev => ({ ...prev, imageLinks: [...prev.imageLinks, ""] }));
  const removeImageField = (index: number) => setForm(prev => ({ ...prev, imageLinks: prev.imageLinks.filter((_, i) => i !== index) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Require a selected shopId
      if (!form.shopId) {
        throw new Error("Please select your shop before adding a product.");
      }

      // Validate at least one image link
      const nonEmptyLinks = form.imageLinks.map(l => l.trim()).filter(Boolean);
      if (nonEmptyLinks.length === 0) {
        throw new Error("Please add at least one product image link.");
      }

      // Integrate provided endpoint
      const payload = {
        productName: form.productName,
        productSpecification: form.productSpecification,
        manufacturer: form.manufacturer,
        price: form.price,
        discount: parseFloat(form.discount || "0"),
        category: form.category,
        shopId: parseInt(form.shopId),
        // Some Spring binders ignore nested objects without an id; include id: 0 to be explicit
        productImageLinks: nonEmptyLinks.map(link => ({ id: 0, imageLink: link }))
      };

      // Debug: inspect the exact payload being sent
      console.debug("AddProduct payload:", payload);

      const response = await fetch("http://localhost:8080/api/v1/shop/product/add", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add product");
      }

      toast({ title: "Success", description: "Product added successfully." });
      // Optional: reset form
      setForm({
        productName: "",
        productSpecification: "",
        manufacturer: "",
        price: "",
        discount: "0",
        category: "",
        shopId: "",
        imageLinks: [""]
      });
      navigate("/shopkeeper/dashboard");
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to add product",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PackagePlus className="h-6 w-6 text-primary" />
              <CardTitle>Add Product</CardTitle>
            </div>
            <CardDescription>Create a new product for your shop</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input id="productName" name="productName" value={form.productName} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer *</Label>
                  <Input id="manufacturer" name="manufacturer" value={form.manufacturer} onChange={handleChange} required />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="productSpecification">Specification *</Label>
                  <Textarea id="productSpecification" name="productSpecification" value={form.productSpecification} onChange={handleChange} required rows={4} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (e.g. 199.99) *</Label>
                  <Input id="price" name="price" value={form.price} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input id="discount" name="discount" type="number" step="0.01" value={form.discount} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={form.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Grocery">Grocery</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Clothing">Clothing</SelectItem>
                      <SelectItem value="Home">Home</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Shop selection (from data loaded at login) */}
                <div className="space-y-2">
                  <Label>Shop</Label>
                  <Select value={form.shopId} onValueChange={handleShopChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={shops.length ? "Select your shop" : "No shop found"} />
                    </SelectTrigger>
                    <SelectContent>
                      {shops.map(s => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.shopName || `Shop #${s.id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!shops.length && (
                    <p className="text-sm text-muted-foreground">Shop not loaded. Please revisit dashboard after login.</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Image Links</Label>
                <div className="space-y-3">
                  {form.imageLinks.map((link, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        placeholder={`https://... (image ${idx + 1})`}
                        value={link}
                        onChange={(e) => handleImageLinkChange(idx, e.target.value)}
                      />
                      {form.imageLinks.length > 1 && (
                        <Button type="button" variant="secondary" onClick={() => removeImageField(idx)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addImageField}>+ Add another image</Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Add Product"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
