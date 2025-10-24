import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  regularPrice?: string;
  image: string;
  onSale?: boolean;
}

const ProductCard = ({ id, name, price, regularPrice, image, onSale }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart({ id, name, price, image });
    toast({
      title: "Producto añadido",
      description: `${name} se ha añadido al carrito`,
    });
  };

  return (
    <Card className="group overflow-hidden border-border transition-all duration-300 hover:shadow-[var(--shadow-hover)]">
      <Link to={`/products/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-secondary cursor-pointer">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {onSale && (
            <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-bold">
              OFERTA
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link to={`/products/${id}`}>
          <h3 className="font-semibold text-lg mb-2 text-foreground line-clamp-2 min-h-[56px] hover:text-primary">
            {name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-primary">{price}€</span>
          {regularPrice && regularPrice !== price && (
            <span className="text-sm text-muted-foreground line-through">{regularPrice}€</span>
          )}
        </div>

        <Button
          className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4" />
          Añadir al carrito
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
