import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Descubre productos increíbles
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Explora nuestra colección de productos seleccionados especialmente para ti.
              Calidad garantizada y envíos rápidos.
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent blur-3xl"></div>
      </section>

      {/* Products Section */}
      <section id="products" className="container mx-auto px-4 py-16 md:py-24">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nuestros Productos
          </h2>
          <p className="text-muted-foreground text-lg">
            Encuentra exactamente lo que necesitas
          </p>
        </div>
        
        <ProductGrid />
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-20">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground text-sm">
            © 2025 OrDev Store. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
