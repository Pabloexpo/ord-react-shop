import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

interface Product {
  id: number;
  name: string;
  price: string;
  regular_price?: string;
  description: string;
  images: { src: string }[];
}

const DOMAIN = "https://test.ordev.es";
const CONSUMER_KEY = "ck_79194e7443a00cdaf65982759677e0db634ed5cb";
const CONSUMER_SECRET = "cs_61d7a708f4ef28f412f01d8b5e7241f9a27d151b";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `${DOMAIN}/wp-json/wc/v3/products/${id}?consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`
        );

        if (!response.ok) {
          throw new Error("No se pudo cargar el producto.");
        }

        const data = await response.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message || "Error al obtener el producto.");
        console.error("Error al obtener producto:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (isLoading)
    return (
      <div className="p-12 text-center text-lg text-muted-foreground">
        Cargando producto...
      </div>
    );

  if (error)
    return (
      <div className="p-12 text-center text-destructive font-medium">
        {error}
      </div>
    );

  if (!product)
    return (
      <div className="p-12 text-center text-muted-foreground">
        Producto no encontrado.
      </div>
    );

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.src || "",
    });
    toast({
      title: "Producto añadido",
      description: `${product.name} se ha añadido al carrito`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-12 px-4 flex flex-col md:flex-row gap-12">
        {/* Imagen del producto */}
        <div className="flex-1 flex justify-center">
          <img
            src={product.images?.[0]?.src || ""}
            alt={product.name}
            className="w-full max-w-md rounded-lg object-cover shadow-md"
          />
        </div>

        {/* Detalles */}
        <div className="flex-1 space-y-6">
          <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>

          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold text-primary">
              {product.price}€
            </span>
            {product.regular_price &&
              product.regular_price !== product.price && (
                <span className="text-muted-foreground line-through text-lg">
                  {product.regular_price}€
                </span>
              )}
          </div>

          {product.description && (
            <div
              className="prose prose-sm text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}

          <Button
            onClick={handleAddToCart}
            size="lg"
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Añadir al carrito
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
