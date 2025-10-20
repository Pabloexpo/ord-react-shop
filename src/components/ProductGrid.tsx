import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Loader2 } from "lucide-react";

const DOMAIN = "https://test.ordev.es";
const CONSUMER_KEY = "ck_79194e7443a00cdaf65982759677e0db634ed5cb";
const CONSUMER_SECRET = "cs_61d7a708f4ef28f412f01d8b5e7241f9a27d151b";

interface WooCommerceProduct {
  id: number;
  name: string;
  price: string;
  regular_price: string;
  sale_price: string;
  images: Array<{ src: string; alt: string }>;
  on_sale: boolean;
}

const ProductGrid = () => {
  const [products, setProducts] = useState<WooCommerceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${DOMAIN}/wp-json/wc/v3/products?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}&per_page=12`
        );
        
        if (!response.ok) {
          throw new Error("Error al cargar los productos");
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive font-semibold mb-2">Error al cargar productos</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          regularPrice={product.regular_price}
          image={product.images[0]?.src || "/placeholder.svg"}
          onSale={product.on_sale}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
