import { useState, useCallback } from "react";
import Cookies from "js-cookie";

export const useProduct = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = Cookies.get("stockmate_token");
      if (!token) throw new Error("Token missing");

      const [responseProduct, responseRule] = await Promise.all([
        fetch(`${API_URL}/api/product/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }),
        fetch(`${API_URL}/api/rule/`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })
      ]);

      if (!responseProduct.ok) throw new Error("Gagal mengambil data produk");

      const responseProductData = await responseProduct.json();
      const rawProducts = responseProductData.data || responseProductData;

      let rulesData = [];
      if (responseRule.ok) {
         const responseRuleJson = await responseRule.json();
         rulesData = responseRuleJson.data?.rules || responseRuleJson.data || responseRuleJson || [];
      }

      const formattedProducts = rawProducts.map((item) => {
        const productRule = rulesData.find(r => r.product_id === item.id);
        
        const stock = parseInt(item.stock_qty || item.stock || 0);
        const threshold = productRule ? parseInt(productRule.min_threshold || 0) : parseInt(item.min_stock || 0);
        
        let currentStatus = "Normal";
        if (stock <= threshold) {
          currentStatus = "Critical";
        } else if (stock <= threshold + 5) {
          currentStatus = "Low";
        }

        return {
          id: item.id,
          name: item.name,
          category: item.category?.name || item.category || "Kategori",
          category_id: item.category_id,
          stock: stock,
          unit: item.unit || "pcs",
          min_threshold: threshold,
          min: threshold,
          buy: parseFloat(item.buy_price || item.buy || 0),
          sell: parseFloat(item.sell_price || item.sell || 0),
          status: currentStatus,
          predicted_stockout: item.predicted_stockout || item.predictedStockout || item.predict_stockout || null
        };
      });

      setProducts(formattedProducts);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  const addProduct = async (productData) => {
    try {
      const token = Cookies.get("stockmate_token");
      const response = await fetch(`${API_URL}/api/product/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(productData)
      });
      if (!response.ok) throw new Error("Gagal menambah produk");
      await fetchProducts();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const token = Cookies.get("stockmate_token");
      const response = await fetch(`${API_URL}/api/product/${id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(productData)
      });
      if (!response.ok) throw new Error("Gagal mengubah produk");
      await fetchProducts();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const token = Cookies.get("stockmate_token");
      const response = await fetch(`${API_URL}/api/product/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      if (!response.ok) throw new Error("Gagal menghapus produk");
      await fetchProducts();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };
};