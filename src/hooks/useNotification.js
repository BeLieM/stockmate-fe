import { useState, useCallback } from "react";
import Cookies from "js-cookie";

export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchNotifications = useCallback(async () => {
    // Hindari loading state yang berkedip saat polling berjalan di background
    if (notifications.length === 0) setIsLoading(true); 
    setError(null);
    try {
      const token = Cookies.get("stockmate_token");
      if (!token) throw new Error("Token missing");

      // TRIK ANTI-CACHE: Tambahkan timestamp agar URL selalu unik tiap detik
      const timestamp = new Date().getTime();
      
      const response = await fetch(`${API_URL}/api/notif?t=${timestamp}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        cache: "no-store" // PERINTAH TEGAS ke Next.js untuk tidak melakukan cache
      });

      if (!response.ok) throw new Error("Gagal mengambil data notifikasi");

      const responseData = await response.json();
      const rawNotifs = responseData.data || responseData || [];
      
      // Urutkan dari yang terbaru
      const sortedNotifs = rawNotifs.sort((a, b) => new Date(b.created_at || b.created) - new Date(a.created_at || a.created));
      
      // Filter: HANYA simpan notifikasi yang belum dibaca ke dalam UI
      const unreadNotifs = sortedNotifs.filter(n => !(n.is_read || n.isRead));
      
      setNotifications(unreadNotifs);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, notifications.length]);

  const markAsRead = async (id) => {
    try {
      const token = Cookies.get("stockmate_token");
      
      const response = await fetch(`${API_URL}/api/notif/${id}/read`, {
        method: "PUT", 
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) throw new Error("Gagal menandai notifikasi");
      
      // 1. Ubah state jadi read agar UI terupdate (animasi meredup)
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, is_read: true, isRead: true } : n
      ));
      
      // 2. Hapus secara otomatis dari tampilan layar setelah 2.5 detik
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 2500);

      return true;
    } catch (err) {
      console.error(err.message);
      return false;
    }
  };

  return {
    notifications,
    isLoading,
    error,
    fetchNotifications,
    markAsRead
  };
};