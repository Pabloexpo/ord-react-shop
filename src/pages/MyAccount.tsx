import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWordPressAuth } from "@/hooks/useWordPressAuth";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const MyAccount = () => {
  const { user, isLoading, logout, fetchUserData } = useWordPressAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [isLoading, user, navigate]);

  useEffect(() => {
    const loadUserData = async () => {
      if (user && user.id && user.id !== 0) {
        setIsFetching(true);
        const result = await fetchUserData(user.id, user.token);
        if (result.success) {
          setUserData(result.data);
        }
        setIsFetching(false);
      }
    };

    loadUserData();
  }, [user, fetchUserData]);

  const handleLogout = () => {
    logout();
    navigate("/");
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
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold text-foreground">Mi Cuenta</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Información de la cuenta</CardTitle>
              <CardDescription>Detalles de tu perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isFetching ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">ID de usuario</p>
                    <p className="font-medium">{user.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nombre</p>
                    <p className="font-medium">{userData?.name || user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Usuario</p>
                    <p className="font-medium">{user.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{userData?.email || user.email}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Button onClick={handleLogout} variant="destructive" className="w-full">
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </>
  );
};

export default MyAccount;
