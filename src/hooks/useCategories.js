import { useState, useCallback } from "react";
import Cookies from "js-cookie";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = Cookies.get("stockmate_token");
      if (!token) throw new Error("Token missing");

      const response = await fetch(`${API_URL}/api/category`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error("Gagal mengambil data kategori");

      const responseData = await response.json();
      setCategories(responseData.data || responseData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  const addCategory = async (categoryData) => {
    try {
      const token = Cookies.get("stockmate_token");
      const response = await fetch(`${API_URL}/api/category`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(categoryData)
      });
      if (!response.ok) throw new Error("Gagal menambah kategori");
      await fetchCategories();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const token = Cookies.get("stockmate_token");
      const response = await fetch(`${API_URL}/api/category/${id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(categoryData)
      });
      if (!response.ok) throw new Error("Gagal mengubah kategori");
      await fetchCategories();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const deleteCategory = async (id) => {
    try {
      const token = Cookies.get("stockmate_token");
      const response = await fetch(`${API_URL}/api/category/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      if (!response.ok) throw new Error("Gagal menghapus kategori");
      
      setCategories(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory
  };
};