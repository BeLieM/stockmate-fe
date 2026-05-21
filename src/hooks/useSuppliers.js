import { useState, useCallback } from "react";
import Cookies from "js-cookie";

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
        fetch(`${API_URL}/api/suppliers`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => null),
        fetch(`${API_URL}/api/review`, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => null)
      ]);

      let fetchedSuppliers = [];
      let fetchedReviews = [];

      if (supplierRes && supplierRes.ok) {
        const supData = await supplierRes.json();
        fetchedSuppliers = supData.data || supData || [];
      }

      if (reviewRes && reviewRes.ok) {
        const revData = await reviewRes.json();
        fetchedReviews = revData.data || revData || [];
      }

      const mergedSuppliers = fetchedSuppliers.map(sup => {
        const supReviews = fetchedReviews.filter(r => r.supplier_id === sup.id);
        const totalRating = supReviews.reduce((acc, r) => acc + (Number(r.star || r.rating) || 0), 0);
        const avgRating = supReviews.length > 0 ? (totalRating / supReviews.length).toFixed(1) : 0;

        return {
          ...sup,
          category: sup.category || "General",
          averageRating: Number(avgRating),
          reviewCount: supReviews.length
        };
      });

      setSuppliers(mergedSuppliers);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  const addSupplier = async (payload) => {
    try {
      const token = Cookies.get("stockmate_token");
      const res = await fetch(`${API_URL}/api/suppliers`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Error");
      await fetchSuppliers();
      return true;
    } catch (e) {
      return false;
    }
  };

  const updateSupplier = async (id, payload) => {
    try {
      const token = Cookies.get("stockmate_token");
      const res = await fetch(`${API_URL}/api/suppliers/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Error");
      await fetchSuppliers();
      return true;
    } catch (e) {
      return false;
    }
  };

  const deleteSupplier = async (id) => {
    try {
      const token = Cookies.get("stockmate_token");
      const res = await fetch(`${API_URL}/api/suppliers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error");
      setSuppliers(prev => prev.filter(s => s.id !== id));
      return true;
    } catch (e) {
      return false;
    }
  };

  const addReview = async (payload) => {
    try {
      const token = Cookies.get("stockmate_token");
      const res = await fetch(`${API_URL}/api/review`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Error");
      await fetchSuppliers();
      return true;
    } catch (e) {
      return false;
    }
  };

  return {
    suppliers,
    isLoading,
    error,
    fetchSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addReview
  };
};