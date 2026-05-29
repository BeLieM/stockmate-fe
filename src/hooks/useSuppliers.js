import { useState, useCallback } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchSuppliers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = Cookies.get("stockmate_token");
      if (!token) throw new Error("Token missing");

      const [supplierRes, reviewRes] = await Promise.all([
        fetch(`${API_URL}/api/suppliers`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
        fetch(`${API_URL}/api/review`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => null)
      ]);

      let fetchedSuppliers = [];
      let fetchedReviews = [];

      if (supplierRes && supplierRes.ok) fetchedSuppliers = await supplierRes.json().then(d => d.data || d || []);
      if (reviewRes && reviewRes.ok) fetchedReviews = await reviewRes.json().then(d => d.data || d || []);

      const mergedSuppliers = fetchedSuppliers.map(sup => {
        const supReviews = fetchedReviews.filter(r => r.supplier_id === sup.id);
        const totalRating = supReviews.reduce((acc, r) => acc + (Number(r.star || r.rating) || 0), 0);
        const avgRating = supReviews.length > 0 ? (totalRating / supReviews.length).toFixed(1) : 0;

        return { ...sup, averageRating: Number(avgRating), reviewCount: supReviews.length };
      });

      setSuppliers(mergedSuppliers);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  const addSupplier = async (payload) => {
    const toastId = toast.loading("Menambahkan supplier...");
    try {
      const token = Cookies.get("stockmate_token");
      const res = await fetch(`${API_URL}/api/suppliers`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Gagal menambah data supplier.");
      
      await fetchSuppliers();
      toast.success("Supplier berhasil ditambahkan!", { id: toastId });
      return true;
    } catch (e) {
      toast.error(e.message || "Terjadi kesalahan sistem", { id: toastId });
      return false;
    }
  };

  const updateSupplier = async (id, payload) => {
    if (!id) return false;
    const toastId = toast.loading("Menyimpan perubahan...");
    try {
      const token = Cookies.get("stockmate_token");
      const res = await fetch(`${API_URL}/api/suppliers/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Gagal mengupdate data.");
      
      await fetchSuppliers();
      toast.success("Data supplier diperbarui!", { id: toastId });
      return true;
    } catch (e) {
      toast.error(e.message || "Terjadi kesalahan sistem", { id: toastId });
      return false;
    }
  };

  const deleteSupplier = async (id) => {
    const toastId = toast.loading("Menghapus supplier...");
    try {
      const token = Cookies.get("stockmate_token");
      const res = await fetch(`${API_URL}/api/suppliers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Gagal menghapus data.");
      
      setSuppliers(prev => prev.filter(s => s.id !== id));
      toast.success("Supplier berhasil dihapus!", { id: toastId });
      return true;
    } catch (e) {
      toast.error(e.message || "Gagal menghapus supplier", { id: toastId });
      return false;
    }
  };

  const addReview = async (payload) => {
    const toastId = toast.loading("Mengirim ulasan...");
    try {
      const token = Cookies.get("stockmate_token");
      const res = await fetch(`${API_URL}/api/review`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Gagal mengirim ulasan.");
      
      await fetchSuppliers();
      toast.success("Ulasan berhasil dipublikasikan!", { id: toastId });
      return true;
    } catch (e) {
      toast.error(e.message || "Gagal mengirim ulasan", { id: toastId });
      return false;
    }
  };

  const getReview = useCallback(async (supplierId) => {
    try {
      const token = Cookies.get("stockmate_token");
      const res = await fetch(`${API_URL}/api/review`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error fetching reviews");
      const revData = await res.json();
      const allReviews = revData.data || revData || [];
      return allReviews.filter(r => r.supplier_id === supplierId);
    } catch (e) {
      return [];
    }
  }, [API_URL]);

  return { suppliers, isLoading, error, fetchSuppliers, addSupplier, updateSupplier, deleteSupplier, addReview, getReview };
};