import { useState } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Dideklarasikan di luar fungsi agar bisa dipakai oleh login dan register
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // --- FUNGSI LOGIN ---
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Login gagal. Silakan periksa kembali email dan password Anda."
        );
      }

      // TODO: Simpan token autentikasi (misal: localStorage atau Cookies) di sini

      // Redirect ke page dashboard kalau sukses
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- FUNGSI REGISTER ---
  const register = async (name, email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Sesuaikan payload body ini dengan kebutuhan API backend-mu
        body: JSON.stringify({ name, email, password }), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registrasi gagal. Silakan periksa kembali data Anda."
        );
      }

      // Umumnya setelah register sukses, user diarahkan ke halaman login
      // Atau bisa diubah ke "/dashboard" jika API-mu langsung memberikan token login setelah register
      router.push("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Kembalikan login dan register agar bisa dipakai di halaman UI
  return { login, register, isLoading, error };
};