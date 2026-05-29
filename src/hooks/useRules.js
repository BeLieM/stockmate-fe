import { useState, useCallback } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export const useRules = () => {
  const [rulesList, setRulesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const stats = {
    critical: rulesList.filter(r => r.status === "Critical").length,
    low: rulesList.filter(r => r.status === "Low").length,
    active: rulesList.length,
    total: rulesList.length 
  };

  const fetchRules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = Cookies.get("stockmate_token");
      if (!token) throw new Error("Token missing");

      const response = await fetch(`${API_URL}/api/rule`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error("Gagal mengambil data rules");

      const responseData = await response.json();
      
      const rawRules = responseData.data?.rules || responseData.data || responseData || [];
      const formattedRules = rawRules.map(rule => {
        const currentStock = rule.product?.stock_qty || rule.product?.stock || 0;
        const minStock = rule.min_threshold || 0;
        
        let status = "Normal";
        if (currentStock <= minStock) {
            status = "Critical";
        } else if (currentStock <= minStock + 5) {
            status = "Low";
        }

        return {
          id: rule.id,
          product: rule.product?.name || "Unknown Product",
          product_id: rule.product_id,
          min: minStock,
          current: currentStock,
          unit: rule.product?.unit || "pcs",
          suggest: rule.restock_suggestion || 0,
          status: status,
          predicted_stockout: rule.product?.predicted_stockout || rule.predicted_stockout || null
        };
      });

      setRulesList(formattedRules);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  const addRule = async (ruleData) => {
    const toastId = toast.loading("Menambahkan rule stok...");
    try {
      const token = Cookies.get("stockmate_token");
      const response = await fetch(`${API_URL}/api/rule`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(ruleData)
      });
      if (!response.ok) throw new Error("Gagal menambah rule");
      await fetchRules();
      toast.success("Aturan stok berhasil ditambahkan!", { id: toastId });
      return true;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Gagal menambah rule", { id: toastId });
      return false;
    }
  };

  const updateRule = async (id, ruleData) => {
    const toastId = toast.loading("Menyimpan perubahan...");
    try {
      const token = Cookies.get("stockmate_token");
      const response = await fetch(`${API_URL}/api/rule/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(ruleData)
      });
      if (!response.ok) throw new Error("Gagal mengubah rule");
      await fetchRules();
      toast.success("Aturan stok berhasil diperbarui!", { id: toastId });
      return true;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Gagal memperbarui rule", { id: toastId });
      return false;
    }
  };

  const deleteRule = async (id) => {
    const toastId = toast.loading("Menghapus rule stok...");
    try {
      const token = Cookies.get("stockmate_token");
      const response = await fetch(`${API_URL}/api/rule/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      if (!response.ok) throw new Error("Gagal menghapus rule");
      
      await fetchRules(); 
      toast.success("Aturan stok berhasil dihapus!", { id: toastId });
      return true;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Gagal menghapus rule", { id: toastId });
      return false;
    }
  };

  return {
    rulesList,
    stats,
    isLoading,
    error,
    fetchRules,
    addRule,
    updateRule,
    deleteRule
  };
};