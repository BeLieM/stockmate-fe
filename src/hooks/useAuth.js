import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

/*
   // Pastikan kamu sudah menginstal js-cookie di terminal: npm install js-cookie
   // import Cookies from 'js-cookie';
*/

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Security Helper: Membersihkan input dari spasi berlebih di awal/akhir string
  const sanitizeInput = (str) => (typeof str === 'string' ? str.trim() : str);

  // --- FUNGSI LOGIN ---
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: sanitizeInput(email), 
          password // Jangan di-trim, karena spasi bisa jadi bagian sah dari password
        }),
      });

      // Mengantisipasi server mengembalikan HTML (misal: 502 Bad Gateway)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
         throw new TypeError("Terjadi kesalahan jaringan. Silakan coba lagi nanti.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login gagal. Silakan periksa kembali email dan password Anda.");
      }

      /* // Simpan token ke dalam Cookies (Disarankan agar terbaca oleh Middleware Next.js)
         // Cookies.set("stockmate_token", data.token, { expires: 7 }); // Berlaku 7 hari
         
         // ATAU Opsi B (Hanya di LocalStorage, tidak bisa dibaca Middleware Server):
         // localStorage.setItem("stockmate_token", data.token);
     */

      router.push("/home");
    } catch (err) {
      setError(err.message || "Terjadi kesalahan pada server.");
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, router]);

  // --- FUNGSI REGISTER ---
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: sanitizeInput(userData.fullName),
          storeName: sanitizeInput(userData.storeName),
          email: sanitizeInput(userData.email),
          storeAddress: sanitizeInput(userData.storeAddress),
          password: userData.password,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
         throw new TypeError("Terjadi kesalahan jaringan. Silakan coba lagi nanti.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registrasi gagal. Silakan periksa kembali data Anda.");
      }

      router.push("/login");
      return true; // Mengembalikan true jika sukses agar UI bisa memproses
    } catch (err) {
      setError(err.message || "Terjadi kesalahan pada server.");
      return false; 
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, router]);

  // --- FUNGSI FORGOT PASSWORD ---
  const forgotPassword = useCallback(async (email) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: sanitizeInput(email) 
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
         throw new TypeError("Terjadi kesalahan jaringan. Silakan coba lagi nanti.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal memproses permintaan reset password.");
      }

      return true; 
    } catch (err) {
      setError(err.message || "Terjadi kesalahan pada server.");
      return false; 
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  /* // --- FUNGSI LOGOUT ---
     const logout = useCallback(() => {
       // Hapus token dari Cookies
       // Cookies.remove("stockmate_token");
       
       // Atau hapus dari LocalStorage jika pakai Opsi B
       // localStorage.removeItem("stockmate_token");
       
       // Tendang user kembali ke halaman login
       router.push("/login");
     }, [router]);
  */

  return { 
    login, 
    register, 
    forgotPassword, 
    // logout, // Uncomment ini juga nanti
    isLoading, 
    error, 
    setError 
  };
};