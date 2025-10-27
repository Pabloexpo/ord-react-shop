import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const DOMAIN = "https://test.ordev.es";

interface JWTPayload {
  data: {
    user: {
      id: string;
    };
  };
}

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  token: string;
}

export const useWordPressAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const storedUser = localStorage.getItem("wp_user");
    const storedToken = localStorage.getItem("wp_token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({ ...parsedUser, token: storedToken });
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("wp_user");
        localStorage.removeItem("wp_token");
      }
    }
    setIsLoading(false);
  }, []);

  //LOGIN

  const login = async (username: string, password: string) => {
    try {
      // Usar el endpoint JWT de WordPress
      const response = await fetch(`${DOMAIN}/wp-json/jwt-auth/v1/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al iniciar sesión");
      }

      const data = await response.json();

      // Decodificar el token JWT para obtener el user_id
      const decoded = jwtDecode<JWTPayload>(data.token);
      const userId = parseInt(decoded.data.user.id);

      const userData: User = {
        id: userId,
        username: data.user_nicename || data.user_display_name,
        email: data.user_email,
        name: data.user_display_name,
        token: data.token,
      };

      // Guardar en localStorage
      localStorage.setItem(
        "wp_user",
        JSON.stringify({
          id: userData.id,
          username: userData.username,
          email: userData.email,
          name: userData.name,
        })
      );
      localStorage.setItem("wp_token", userData.token);

      setUser(userData);
      return { success: true, user: userData };
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  //REGISTRO

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await fetch(`${DOMAIN}/wp-json/custom/v1/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al registrar usuario");
      }

      console.log("Usuario creado:", data);
      return { success: true, ...data };
    } catch (error: any) {
      console.error("Register error:", error);
      return { success: false, error: error.message };
    }
  };

  //CERRAR SESIÓN

  const logout = () => {
    localStorage.removeItem("wp_user");
    localStorage.removeItem("wp_token");
    setUser(null);
  };

  //OBTENER DATOS DEL USUARIO
  const fetchUserData = async (userId: number, token: string) => {
    try {
      // Usar el ID del usuario directamente en lugar de /me
      const response = await fetch(`${DOMAIN}/wp-json/wp/v2/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener datos del usuario");
      }

      const userData = await response.json();
      return { success: true, data: userData };
    } catch (error: any) {
      console.error("Fetch user data error:", error);
      return { success: false, error: error.message };
    }
  };

  //ACTUALIZAR DATOS DEL USUARIO
  const updateUser = async (updates: {
    name?: string;
    email?: string;
    password?: string;
  }) => {
    if (!user || !user.token)
      return { success: false, error: "Usuario no autenticado" };

    try {
      const response = await fetch(`${DOMAIN}/wp-json/custom/v1/update-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar los datos");
      }

      // Actualizar user localmente si se cambió el nombre o email
      const updatedUser = { ...user, ...data.user };
      setUser(updatedUser);
      localStorage.setItem("wp_user", JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error: any) {
      console.error("Update user error:", error);
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    fetchUserData,
    updateUser, // 👈 exporta esta
    isAuthenticated: !!user,
  };
};
