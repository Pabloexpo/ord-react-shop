import { ShoppingCart, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface MenuItem {
  id: number;
  title: string;
  url: string;
  child_items?: MenuItem[];
}

const DOMAIN = "https://test.ordev.es";

const Navbar = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // Intentar obtener el menú principal de WordPress
        const response = await fetch(`${DOMAIN}/wp-json/wp-api-menus/v2/menus/2`);
        
        if (response.ok) {
          const data = await response.json();
          setMenuItems(data.items || []);
        } else {
          // Fallback: intentar con el endpoint estándar
          const fallbackResponse = await fetch(`${DOMAIN}/wp-json/wp/v2/menu-items`);
          if (fallbackResponse.ok) {
            const items = await fallbackResponse.json();
            setMenuItems(items);
          }
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <a href="/" className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
            OrDev Store
          </a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Cargando menú...</div>
            ) : menuItems.length > 0 ? (
              menuItems.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.title}
                </a>
              ))
            ) : (
              <>
                <a href="#products" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Productos
                </a>
                <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Nosotros
                </a>
                <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Contacto
                </a>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
              0
            </span>
          </Button>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
