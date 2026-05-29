import { useState, useCallback } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export const useStaff = () => {
  const [staffList, setStaffList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = Cookies.get("stockmate_token");
      if (!token) throw new Error("Token missing");

      const response = await fetch(`${API_URL}/api/user/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) throw new Error("Gagal mengambil data staff");

      const responseData = await response.json();
      const rawUsers = responseData.data || responseData;

      const formattedStaff = rawUsers
        .filter(user => user.role?.toLowerCase() === 'staff' || user.role?.toLowerCase() === 'user')
        .map((user) => {
          const name = user.name || user.full_name || "Unknown Staff";
          const initial = name.charAt(0).toUpperCase();
          const colors = ["bg-red-500", "bg-blue-500", "bg-[#00E599]", "bg-purple-500", "bg-orange-500"];
          const badgeColor = colors[initial.charCodeAt(0) % colors.length];

          return {
            id: user.id,
            name: name,
            init: initial,
            color: badgeColor,
            email: user.email || "-",
            role: user.role || "Staff",
          };
        });

      setStaffList(formattedStaff);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  const addStaff = async (staffData) => {
    const toastId = toast.loading("Menambahkan staff baru...");
    try {
      const token = Cookies.get("stockmate_token");
      if (!token) throw new Error("Token missing");

      let loggedInUserId = null;
      try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));

          const decodedToken = JSON.parse(jsonPayload);
          loggedInUserId = decodedToken.id || decodedToken.userId || decodedToken.user_id || decodedToken.sub;
      } catch (e) {
          console.error("Gagal mengekstrak ID dari Token:", e);
      }

      const storeResponse = await fetch(`${API_URL}/api/store`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      let storeId = null;
      if (storeResponse.ok) {
        const storeData = await storeResponse.json();
        const stores = storeData.data || storeData;
        
        if (Array.isArray(stores) && stores.length > 0) {
          const myStore = stores.find(s => s.owner_id === loggedInUserId);
          storeId = myStore ? myStore.id : stores[0].id; 
        } else if (stores.id) {
          storeId = stores.id;
        }
      }

      const finalPayload = {
        ...staffData,
        store_id: storeId
      };

      const response = await fetch(`${API_URL}/api/user/register/`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(finalPayload)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || "Gagal menambah staff");
      }
      
      await fetchStaff();
      toast.success("Staff berhasil ditambahkan!", { id: toastId });
      return true;
    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error(err.message || "Gagal menambah staff", { id: toastId });
      return false;
    }
  };

  const updateStaff = async (id, staffData) => {
    const toastId = toast.loading("Menyimpan data staff...");
    try {
      const token = Cookies.get("stockmate_token");
      const response = await fetch(`${API_URL}/api/user/${id}`, {
        method: "PATCH", 
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(staffData)
      });
      if (!response.ok) throw new Error("Gagal mengubah data staff");
      await fetchStaff();
      toast.success("Data staff diperbarui!", { id: toastId });
      return true;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Gagal memperbarui staff", { id: toastId });
      return false;
    }
  };

  const updateStaffStatus = async (id, statusData) => {
    const toastId = toast.loading("Memperbarui status...");
    try {
      const token = Cookies.get("stockmate_token");
      const response = await fetch(`${API_URL}/api/user/${id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(statusData)
      });
      if (!response.ok) throw new Error("Gagal mengubah status staff");
      await fetchStaff();
      toast.success("Status staff diperbarui!", { id: toastId });
      return true;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Gagal memperbarui status", { id: toastId });
      return false;
    }
  };

  const deleteStaff = async (id) => {
    const toastId = toast.loading("Menghapus staff...");
    try {
      const token = Cookies.get("stockmate_token");
      const response = await fetch(`${API_URL}/api/user/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      if (!response.ok) throw new Error("Gagal menghapus staff");
      
      setStaffList(prev => prev.filter(s => s.id !== id));
      toast.success("Staff berhasil dihapus!", { id: toastId });
      return true;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Gagal menghapus staff", { id: toastId });
      return false;
    }
  };

  return {
    staffList,
    isLoading,
    error,
    fetchStaff,
    addStaff,
    updateStaff,
    updateStaffStatus,
    deleteStaff
  };
};