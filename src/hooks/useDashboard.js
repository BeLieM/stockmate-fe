import { useState, useCallback } from "react";
import Cookies from "js-cookie";

export const useDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    transactionsToday: 0,
    transactionDiff: "",
    criticalStock: 0,
    activeSuppliers: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [criticalStocks, setCriticalStocks] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = Cookies.get("stockmate_token");
      if (!token) throw new Error("Token missing");

      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      // PERHATIKAN: Coba pastikan apakah API transaksi Anda /api/transaction atau /api/transactions
      // Disini saya ubah menjadi plural /api/transactions sesuai standar REST API
      const [resDash, resProd, resRule, resTx] = await Promise.all([
        fetch(`${API_URL}/api/dashboard`, { headers }).catch(() => null),
        fetch(`${API_URL}/api/product`, { headers }).catch(() => null),
        fetch(`${API_URL}/api/rule`, { headers }).catch(() => null),
        fetch(`${API_URL}/api/transactions`, { headers }).catch(() => null) // <-- Cek endpoint ini
      ]);

      let tempStats = { 
        totalProducts: 0, transactionsToday: 0, transactionDiff: "", criticalStock: 0, activeSuppliers: 0 
      };

      // --- 1. SET CHART & STATS ---
      if (resDash && resDash.ok) {
        const dashJson = await resDash.json();
        const dashData = dashJson.data || dashJson;
        
        console.log("📥 Data API Dashboard:", dashData); // <-- Cek inspect element (F12) untuk melihat datanya

        tempStats.totalProducts = dashData.totalProducts || 0;
        tempStats.transactionsToday = dashData.totalTransaction || 0;
        tempStats.transactionDiff = dashData.transactionDiff || "";
        tempStats.activeSuppliers = dashData.totalSuppliers || 0;

        const rawChart = dashData.chartData;
        if (rawChart && typeof rawChart === 'object' && !Array.isArray(rawChart)) {
          const formattedChart = Object.keys(rawChart).map(dayKey => {
            const capitalizedDay = dayKey.charAt(0).toUpperCase() + dayKey.slice(1);
            return {
              day: capitalizedDay,
              in: rawChart[dayKey].in || 0,
              out: rawChart[dayKey].out || 0
            };
          });
          setChartData(formattedChart);
        } else {
          setChartData(Array.isArray(rawChart) ? rawChart : []);
        }
      }

      // --- 2. SET CRITICAL STOCK ---
      if (resProd && resProd.ok) {
        const prodJson = await resProd.json();
        const rawProducts = prodJson.data || prodJson || [];
        
        let rulesData = [];
        if (resRule && resRule.ok) {
          const ruleJson = await resRule.json();
          rulesData = ruleJson.data?.rules || ruleJson.data || ruleJson || [];
        }

        const calculatedStocks = rawProducts.map(item => {
          const productRule = rulesData.find(r => r.product_id === item.id);
          const stock = parseInt(item.stock_qty || item.stock || 0);
          const threshold = productRule ? parseInt(productRule.min_threshold || 0) : parseInt(item.min_stock || 0);
          
          let status = "Normal";
          if (stock <= threshold) status = "Critical";
          else if (stock <= threshold + 5) status = "Low";

          return { product: item.name, stock, min: threshold, status };
        });

        tempStats.criticalStock = calculatedStocks.filter(p => p.status === "Critical").length;

        const criticalAndLow = calculatedStocks
          .filter(p => p.status !== "Normal")
          .sort((a, b) => {
            if (a.status === "Critical" && b.status !== "Critical") return -1;
            if (a.status !== "Critical" && b.status === "Critical") return 1;
            return a.stock - b.stock;
          })
          .slice(0, 5);

        setCriticalStocks(criticalAndLow);
      }

      // --- 3. SET RECENT TRANSACTIONS ---
      if (resTx && resTx.ok) {
        const txJson = await resTx.json();
        const rawTx = txJson.data || txJson || [];
        
        console.log("📥 Data API Transactions:", rawTx); // <-- Cek isi dari data transaksi di console browser

        const sortedTx = rawTx
          // Sortir berdasarkan tanggal terbaru
          .sort((a, b) => new Date(b.created_at || b.date || b.createdAt) - new Date(a.created_at || a.date || a.createdAt))
          .slice(0, 5) // Ambil 5 data teratas
          .map(tx => {
            // Ambil tipe IN / OUT dengan aman
            const type = (tx.type || tx.transaction_type || tx.status || "IN").toUpperCase();
            
            // Ambil format waktu yang tepat
            const dateString = tx.created_at || tx.date || tx.createdAt;
            const dateObj = dateString ? new Date(dateString) : new Date();
            const formattedTime = `${dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} • ${dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;
            
            // Cari nama produk di berbagai kemungkinan key JSON Backend
            let prodName = "Unknown Product";
            if (tx.product && tx.product.name) prodName = tx.product.name;
            else if (tx.product_name) prodName = tx.product_name;
            else if (tx.name) prodName = tx.name;

            // Ambil kuantitas
            const quantity = tx.quantity || tx.qty || 0;

            // Ambil nama staff
            let staffName = "System";
            if (tx.user && tx.user.name) staffName = tx.user.name;
            else if (tx.staff_name) staffName = tx.staff_name;
            else if (tx.user_name) staffName = tx.user_name;

            return {
              product: prodName,
              type: type,
              qty: type === "IN" ? `+${quantity}` : `-${quantity}`,
              staff: staffName,
              time: formattedTime
            };
          });
        
        setRecentTransactions(sortedTx);
      } else {
        console.warn("⚠️ API Transactions gagal diambil atau endpoint salah (404).");
      }

      setStats(tempStats);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  return {
    stats, chartData, criticalStocks, recentTransactions, isLoading, error, fetchDashboardData
  };
};