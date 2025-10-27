import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWordPressAuth } from "@/hooks/useWordPressAuth";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const MyAccount = () => {
  const { user, isLoading, logout, fetchUserData, updateUser } =
    useWordPressAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const DOMAIN = "https://test.ordev.es";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  // variables para los pedidos del usuario
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Redirigir si no hay usuario logeado
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [isLoading, user, navigate]);

  // Cargar datos del usuario desde WP
  useEffect(() => {
    const loadUserData = async () => {
      if (user && user.id && user.id !== 0) {
        setIsFetching(true);
        const result = await fetchUserData(user.id, user.token);
        if (result.success) {
          setUserData(result.data);
          setName(result.data.name || user.name);
          setEmail(result.data.email || user.email);
          console.log("User data fetched:", result.data);
        }
        setIsFetching(false);
      }
    };

    loadUserData();
  }, []);

  // UseEffect para cargar los pedidos del usuario
  useEffect(() => {
    const loadOrders = async () => {
      if (user?.token) {
        setIsLoadingOrders(true);
        try {
          const response = await fetch(`${DOMAIN}/wp-json/custom/v1/orders`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Error al cargar pedidos");
          }

          const data = await response.json();
          setOrders(data);
          console.log("Orders fetched:", data);
        } catch (error) {
          console.error("Fetch orders error:", error);
        } finally {
          setIsLoadingOrders(false);
        }
      }
    };

    loadOrders();
  }, [user]);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdating(true);
    setMessage(null);

    const updates: any = {};
    if (name !== user.name) updates.name = name;
    if (email !== user.email) updates.email = email;
    if (password) updates.password = password;

    const result = await updateUser(updates);
    if (result.success) {
      setMessage({
        type: "success",
        text: "Datos actualizados correctamente ✅",
      });
      setPassword("");
      setUserData(result.user);
    } else {
      setMessage({
        type: "error",
        text: result.error || "Error al actualizar los datos",
      });
    }

    setIsUpdating(false);
  };

  if (isLoading || !user) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  if (!user.id || user.id === 0) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
              <CardDescription>
                ID de usuario no encontrado. Por favor, vuelva a iniciar sesión.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/")} className="w-full">
                Volver al inicio
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Título principal */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Mi Cuenta
            </h1>
            <p className="text-muted-foreground">
              Gestiona tu perfil, actualiza tus datos o cierra sesión.
            </p>
          </div>

          {/* Grid principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Información de la cuenta */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Información de la cuenta</CardTitle>
                <CardDescription>
                  Detalles actuales de tu usuario
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isFetching ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        ID de usuario
                      </p>
                      <p className="font-medium">{user.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Usuario</p>
                      <p className="font-medium">{user.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre</p>
                      <p className="font-medium">
                        {userData?.name || user.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">
                        {userData?.email || user.email}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Formulario de edición */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Editar perfil</CardTitle>
                <CardDescription>
                  Actualiza tus datos personales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">
                        Nombre
                      </label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Tu correo electrónico"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">
                        Contraseña (opcional)
                      </label>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nueva contraseña"
                      />
                    </div>
                  </div>

                  {message && (
                    <p
                      className={`text-sm ${
                        message.type === "success"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {message.text}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isUpdating}
                  >
                    {isUpdating && (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    )}
                    Guardar cambios
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          {/* Historial de pedidos */}
          <Card className="shadow-sm hover:shadow-md transition-shadow md:col-span-2">
            <CardHeader>
              <CardTitle>Mis Pedidos</CardTitle>
              <CardDescription>Historial de tus compras</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingOrders ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="font-semibold">Pedido #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.date} — {order.status}
                        </p>
                      </div>
                      <p
                        className="font-medium text-right"
                        dangerouslySetInnerHTML={{ __html: order.total }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-6">
                  No tienes pedidos todavía.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Botón de cerrar sesión */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full md:w-1/3"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAccount;
