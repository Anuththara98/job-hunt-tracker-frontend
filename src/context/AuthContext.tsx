import { useEffect, useState, type ReactNode } from "react";
import { apiFetch, setToken, getToken } from "../api/client";
import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "../types/auth";
import { AuthContext } from "./auth-context";

const USER_KEY = "jobHuntTracker.user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const storedUser = localStorage.getItem(USER_KEY);
    if (token && storedUser) {
      setUser(JSON.parse(storedUser) as AuthUser);
    }
    setIsLoading(false);
  }, []);

  function persistSession(response: AuthResponse) {
    const { token, ...authUser } = response;
    setToken(token);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    setUser(authUser);
  }

  async function login(payload: LoginPayload) {
    const response = await apiFetch<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: payload,
      auth: false,
    });
    persistSession(response);
  }

  async function register(payload: RegisterPayload) {
    const response = await apiFetch<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: payload,
      auth: false,
    });
    persistSession(response);
  }

  function logout() {
    setToken(null);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
