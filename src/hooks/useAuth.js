import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuthContext } from "@/context/AuthContext";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Mengambil fungsi logout dari Context (menggunakan fallback agar tidak error jika di luar context)
  const authContext = useAuthContext();
  const performLogout = authContext?.performLogout;

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const sanitizeInput = (str) => (typeof str === "string" ? str.trim() : str);

  const login = useCallback(
    async (email, password) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_URL}/api/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: sanitizeInput(email), password }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Login gagal.");

        Cookies.set("stockmate_token", data.token, { expires: 7 });
        Cookies.set("stockmate_user_id", data.id || (data.user && data.user.id), { expires: 7 });

        router.push("/home");
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [API_URL, router],
  );

  const register = useCallback(
    async (userData) => {
      setIsLoading(true);
      setError(null);

      try {
        const userRes = await fetch(`${API_URL}/api/user/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: sanitizeInput(userData.fullName),
            email: sanitizeInput(userData.email),
            password: userData.password,
            role: "admin",
          }),
        });

        const userDataRes = await userRes.json();
        if (!userRes.ok) throw new Error(userDataRes.error || "Registrasi gagal.");

        const loginRes = await fetch(`${API_URL}/api/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userData.email, password: userData.password }),
        });

        const loginData = await loginRes.json();
        const token = loginData.token;
        const ownerId = userDataRes.id;

        await fetch(`${API_URL}/api/store`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: sanitizeInput(userData.storeName),
            address: sanitizeInput(userData.storeAddress),
            owner_id: ownerId
          }),
        });

        router.push("/");
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [API_URL, router],
  );

  // Logout kini diurus sepenuhnya oleh AuthContext secara tersentralisasi
  const logout = useCallback(() => {
    if (performLogout) {
      performLogout();
    } else {
      Cookies.remove("stockmate_token");
      Cookies.remove("stockmate_user_id");
      router.replace("/");
    }
  }, [performLogout, router]);

  return {
    login,
    register,
    logout,
    isLoading,
    error,
    setError,
  };
};