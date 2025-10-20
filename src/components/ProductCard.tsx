import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  regularPrice?: string;
  image: string;
  onSale?: boolean;
}

const ProductCard = ({ name, price, regularPrice, image, onSale }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden border-border transition-all duration-300 hover:shadow-[var(--shadow-hover)]">
      <div className="relative aspect-square overflow-hidden bg-secondary">
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
      
      <div className="p-5">
        <h3 className="font-semibold text-lg mb-2 text-foreground line-clamp-2 min-h-[56px]">
          {name}
        </h3>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-primary">
            {price}€
          </span>
          {regularPrice && regularPrice !== price && (
            <span className="text-sm text-muted-foreground line-through">
              {regularPrice}€
            </span>
          )}
        </div>
        
        <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
          <ShoppingCart className="h-4 w-4" />
          Añadir al carrito
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
