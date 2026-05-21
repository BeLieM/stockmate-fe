import { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";

export const useStore = () => {
    const [storeData, setStoreData] = useState({ id: null, name: "Loading...", address: "-", created_at: null });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStoreData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = Cookies.get("stockmate_token");
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

            if (!token) {
                setStoreData({ id: null, name: "No Store Found", address: "-", created_at: null });
                setIsLoading(false);
                return;
            }

            let userId = null;
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const decodedToken = JSON.parse(jsonPayload);
                userId = decodedToken.id || decodedToken.userId || decodedToken.user_id || decodedToken.sub;
            } catch (e) {
                console.error("Gagal mengekstrak ID dari Token:", e);
            }

            const response = await fetch(`${API_URL}/api/store`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Gagal mengambil data toko");
            }

            let targetStore = null;
            if (Array.isArray(data)) {
                targetStore = data.find(s => s.owner_id === userId) || data[0];
            } else if (data.data) {
                targetStore = Array.isArray(data.data) ? data.data[0] : data.data;
            } else {
                targetStore = data;
            }

            if (targetStore && targetStore.name) {
                setStoreData({
                    id: targetStore.id,
                    name: targetStore.name,
                    address: targetStore.address || "-",
                    created_at: targetStore.created_at || null
                });
            } else {
                setStoreData({ id: null, name: "Toko Belum Dibuat", address: "-", created_at: null });
            }

        } catch (err) {
            setStoreData(prev => ({ ...prev, name: "Error Fetching" }));
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStoreData();
    }, [fetchStoreData]);

    const updateStore = async (storeId, payload) => {
        if (!storeId) return false;
        try {
            const token = Cookies.get("stockmate_token");
            const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
            const response = await fetch(`${API_URL}/api/store/${storeId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Gagal mengubah data toko");
            await fetchStoreData();
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        }
    };

    return { 
        storeData, 
        storeName: storeData.name, 
        isLoading, 
        error, 
        fetchStoreData, 
        updateStore 
    };
};