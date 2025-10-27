import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShopkeeperLayout from "@/components/layouts/ShopkeeperLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Package, Plus, Tag, TrendingDown } from "lucide-react";

interface ProductImageLink {
  id?: number;
  imageLink?: string;
}

interface Product {
  id: number;
  productName: string;
  productSpecification: string;
  manufacturer: string;
  price: string;
  discount: number;
  category: string;
  productImageLinks: ProductImageLink[];
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const shopRaw = localStorage.getItem("shop");
        if (!shopRaw) {
          throw new Error("Shop not found. Please log in again.");
        }
        const shop = JSON.parse(shopRaw);
        if (!shop?.id) {
          throw new Error("Invalid shop data.");
        }

        const response = await fetch(`http://localhost:8080/api/v1/shop/${shop.id}/products`);
        if (!response.ok) {
          const errorText = await response.text().catch(() => "Failed to fetch products");
          throw new Error(errorText);
        }

        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
        toast({
          title: "Error Loading Products",
          description: error instanceof Error ? error.message : "Unable to load products",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [toast]);

  const getProductImage = (product: Product): string => {
    const validLinks = product.productImageLinks?.filter(img => img.imageLink?.trim());
    return validLinks?.[0]?.imageLink || "/placeholder.svg";
  };

  const calculateDiscountedPrice = (price: string, discount: number): string => {
    const originalPrice = parseFloat(price);
    const discountedPrice = originalPrice - (originalPrice * discount / 100);
    return discountedPrice.toFixed(2);
  };

  return (
    <ShopkeeperLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Products</h1>
            <p className="text-muted-foreground mt-2">Manage your product inventory</p>
          </div>
          <Button onClick={() => navigate("/shopkeeper/products/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-48 w-full" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 rounded-full bg-muted">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">No Products Yet</h3>
                <p className="text-muted-foreground mb-4">Start building your inventory by adding your first product</p>
                <Button onClick={() => navigate("/shopkeeper/products/add")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="aspect-square w-full overflow-hidden bg-muted">
                    <img
                      src={getProductImage(product)}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-1">{product.productName}</CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      <Tag className="h-3 w-3 mr-1" />
                      {product.category}
                    </Badge>
                  </div>
                  
                  <CardDescription className="line-clamp-2">
                    {product.productSpecification}
                  </CardDescription>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    {product.manufacturer}
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">
                        ₹{calculateDiscountedPrice(product.price, product.discount)}
                      </span>
                      {product.discount > 0 && (
                        <>
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{parseFloat(product.price).toFixed(2)}
                          </span>
                          <Badge variant="destructive" className="ml-auto">
                            <TrendingDown className="h-3 w-3 mr-1" />
                            {product.discount}% OFF
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 gap-2">
                  <Button variant="outline" className="flex-1">Edit</Button>
                  <Button variant="outline" className="flex-1">Delete</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ShopkeeperLayout>
  );
}
