import { useState, useCallback } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

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
    const toastId = toast.loading("Menambahkan kategori...");
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
      toast.success("Kategori berhasil ditambahkan!", { id: toastId });
      return true;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Gagal menambah kategori", { id: toastId });
      return false;
    }
  };

  const updateCategory = async (id, categoryData) => {
    const toastId = toast.loading("Menyimpan perubahan...");
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
      toast.success("Kategori berhasil diperbarui!", { id: toastId });
      return true;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Gagal memperbarui kategori", { id: toastId });
      return false;
    }
  };

  const deleteCategory = async (id) => {
    const toastId = toast.loading("Menghapus kategori...");
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
      toast.success("Kategori berhasil dihapus!", { id: toastId });
      return true;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Gagal menghapus kategori", { id: toastId });
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