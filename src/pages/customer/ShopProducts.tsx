import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CustomerLayout from "@/components/layouts/CustomerLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Package, Tag, TrendingDown, Store } from "lucide-react";

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

export default function ShopProducts() {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        if (!id) throw new Error("Shop id missing in route.");
        const res = await fetch(`http://localhost:8080/api/v1/shop/${id}/products`);
        if (!res.ok) {
          const msg = await res.text().catch(() => "Failed to fetch products");
          throw new Error(msg || "Failed to fetch products");
        }
        const data: Product[] = await res.json();
        setProducts(data || []);
      } catch (err) {
        console.error("Shop products load failed:", err);
        toast({
          title: "Unable to load products",
          description: err instanceof Error ? err.message : "Error fetching shop products",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [id, toast]);

  const getProductImages = (product: Product): string[] => {
    const validLinks = product.productImageLinks
      ?.filter(img => img.imageLink?.trim())
      ?.map(img => img.imageLink as string) || [];
    return validLinks.length > 0 ? validLinks : ["/placeholder.svg"];
  };

  const discounted = (price: string, discount: number): string => {
    const p = parseFloat(price);
    const d = isNaN(p) ? 0 : p - (p * discount) / 100;
    return d.toFixed(2);
  };

  return (
    <CustomerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Shop Products</h1>
          </div>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
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
            <CardContent className="text-center text-muted-foreground">
              No products found for this shop.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const images = getProductImages(product);
              return (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="aspect-square w-full overflow-hidden bg-muted relative">
                      <img
                        src={images[0]}
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
                          ₹{discounted(product.price, product.discount)}
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
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full">Add to Cart</Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
