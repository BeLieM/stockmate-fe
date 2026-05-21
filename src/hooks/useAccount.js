import { useState, useCallback } from "react";
import Cookies from "js-cookie";

export const useAccount = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const getUserIdFromToken = () => {
    try {
      const token = Cookies.get("stockmate_token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || payload.sub || payload.userId;
    } catch (e) {
      return null;
    }
  };

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = Cookies.get("stockmate_token");
      const userId = getUserIdFromToken();
      
      if (!token || !userId) throw new Error("Sesi tidak valid");

      const response = await fetch(`${API_URL}/api/user/${userId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error("Gagal mengambil data profil");

      const responseData = await response.json();
      setProfile(responseData.data || responseData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  const updateProfile = async (profileData) => {
    try {
      const token = Cookies.get("stockmate_token");
      const userId = getUserIdFromToken();

      const response = await fetch(`${API_URL}/api/user/${userId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(profileData)
      });
      
      if (!response.ok) throw new Error("Gagal mengubah profil");
      await fetchProfile();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const updatePassword = async (passwordData) => {
    try {
      const token = Cookies.get("stockmate_token");
      const userId = getUserIdFromToken();

      const response = await fetch(`${API_URL}/api/user/${userId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(passwordData)
      });
      
      if (!response.ok) throw new Error("Gagal mengubah password");
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    updatePassword
  };
};