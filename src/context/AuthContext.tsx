import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const DOMAIN = "https://test.ordev.es";

interface JWTPayload {
  data: { user: { id: string } };
}

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("wp_user");
    const storedToken = localStorage.getItem("wp_token");

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({ ...parsedUser, token: storedToken });
      } catch {
        localStorage.removeItem("wp_user");
        localStorage.removeItem("wp_token");
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${DOMAIN}/wp-json/jwt-auth/v1/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al iniciar sesión");
      }

      const data = await response.json();
      const decoded = jwtDecode<JWTPayload>(data.token);
      const userId = parseInt(decoded.data.user.id);

      const newUser: User = {
        id: userId,
        username: data.user_nicename || data.user_display_name,
        email: data.user_email,
        name: data.user_display_name,
        token: data.token,
      };

      localStorage.setItem(
        "wp_user",
        JSON.stringify({
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          name: newUser.name,
        })
      );
      localStorage.setItem("wp_token", newUser.token);

      setUser(newUser);
      return { success: true };
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await fetch(`${DOMAIN}/wp-json/custom/v1/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Error al registrar usuario");

      // ✅ Auto-login después de registrar
      const loginResult = await login(username, password);
      if (!loginResult.success) {
        throw new Error(
          loginResult.error || "No se pudo iniciar sesión tras el registro"
        );
      }

      return { success: true };
    } catch (error: any) {
      console.error("Register error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("wp_user");
    localStorage.removeItem("wp_token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return ctx;
};
