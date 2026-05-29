import { useState, useCallback } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export const useTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = Cookies.get("stockmate_token");
      if (!token) throw new Error("Token missing");

      const response = await fetch(`${API_URL}/api/transactions/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error("Gagal mengambil data transaksi");

      const responseData = await response.json();
      const rawTransactions = responseData.data || responseData;

      setTransactions(rawTransactions);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  const addTransaction = async (transactionData) => {
    const toastId = toast.loading("Mencatat transaksi...");
    try {
      const token = Cookies.get("stockmate_token");
      const response = await fetch(`${API_URL}/api/transactions/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(transactionData)
      });

      if (!response.ok) throw new Error("Gagal mencatat transaksi");

      await fetchTransactions();
      toast.success("Transaksi berhasil dicatat!", { id: toastId });
      return true;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Gagal mencatat transaksi", { id: toastId });
      return false;
    }
  };

  const exportTransactions = async (startDate, endDate) => {
    const toastId = toast.loading("Menyiapkan dokumen...");
    try {
      const token = Cookies.get("stockmate_token");
      if (!token) throw new Error("Token missing");

      const queryParams = new URLSearchParams({ startDate, endDate }).toString();
      
      const response = await fetch(`${API_URL}/api/transactions/report?${queryParams}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      if (!response.ok) throw new Error("Gagal membuat laporan transaksi.");

      const data = await response.json();
      let rawDownloadUrl = data.downloadUrl || data.data?.downloadUrl || data.url;

      if (rawDownloadUrl) {
        rawDownloadUrl = rawDownloadUrl.replace("http:/l", "http://l").replace("https:/l", "https://l");

        const link = document.createElement('a');
        link.href = rawDownloadUrl;
        link.setAttribute('download', ''); 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success("Dokumen berhasil diunduh!", { id: toastId });
        return true;
      } else {
        throw new Error("URL unduhan tidak ditemukan di dalam respons server.");
      }

    } catch (err) {
      console.error("Export Error Detail:", err);
      toast.error(err.message || "Gagal mengunduh dokumen", { id: toastId });
      return false;
    }
  };

  return {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    addTransaction,
    exportTransactions
  };
};