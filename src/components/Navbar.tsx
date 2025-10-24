import { Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useWordPressAuth } from "@/hooks/useWordPressAuth";
import LoginPopup from "./LoginPopup";
import { useNavigate, Link } from "react-router-dom";
import { CartSheet } from "./CartSheet";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
 const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { totalItems } = useCart();

  //Renderizamos el componente cuando hay login
  useEffect(()=>{}, [isAuthenticated]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="text-2xl font-bold text-foreground hover:text-primary transition-colors"
          >
            OrDev Store
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/products"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Productos
            </Link>
            <a
              href="#about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Nosotros
            </a>
            <a
              href="#contact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contacto
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
          </Button>

          {/* 🛒 Carrito */}
          <CartSheet />

          {/* 👤 Usuario */}
          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/account")}
              title="Mi cuenta"
            >
              <User className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLoginOpen(true)}
              title="Iniciar sesión"
            >
              <User className="h-5 w-5" />
            </Button>
          )}

          {/* ☰ Menú móvil */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <LoginPopup isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </nav>
  );
};

export default Navbar;
