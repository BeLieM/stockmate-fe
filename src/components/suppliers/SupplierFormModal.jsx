"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Draggable from "react-draggable";
import { X, MapPin } from "lucide-react";

export default function SupplierFormModal({ isOpen, onClose, mode = "add", initialData = null }) {
  const nodeRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', lat: '', lng: '', category: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(mode === "edit" && initialData ? initialData : {
        name: '', phone: '', address: '', lat: '', lng: '', category: ''
      });
      setErrors({});
    }
  }, [isOpen, mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors({});
  };

  const validateForm = () => {
    // Lat dan Lng opsional, tapi nama, hp, dan alamat wajib
    const requiredFields = ['name', 'phone', 'address'];
    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!formData[field] || String(formData[field]).trim() === '') {
        setErrors({ [field]: "⚠️ Required field" });
        return false;
      }
    }
    setErrors({});
    return true;
  };

  /* // ==========================================
     // KODE API PRODUCTION
     // ==========================================
  const handleSubmitAPI = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = Cookies.get("stockmate_token");
      const url = mode === "edit" ? `${API_URL}/suppliers/${initialData.id}` : `${API_URL}/suppliers`;
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Gagal menyimpan supplier");
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };
  */

  const handleSubmitSlicing = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log(`[SLICING MODE] Save clicked for ${mode} supplier:`, formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-xl [&>button]:hidden">
        <Draggable handle=".drag-area" nodeRef={nodeRef}>
          <div ref={nodeRef} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden m-0 transition-colors">

            <DialogHeader className="p-5 pb-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 drag-area cursor-move flex flex-row items-start justify-between select-none transition-colors">
              <div className="text-left mt-0">
                <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white transition-colors">
                  {mode === "edit" ? "Edit Supplier" : "Add New Supplier"}
                </DialogTitle>
                <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 transition-colors">
                  {mode === "edit" ? "Update supplier details" : "Register a new supplier"}
                </DialogDescription>
              </div>
              <button type="button" onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </DialogHeader>

            <form onSubmit={handleSubmitSlicing} className="p-5 space-y-5">

              {/* Baris 1: Name & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Supplier Name *</label>
                  <input name="name" value={formData.name} onChange={handleChange}
                    className={`w-full bg-zinc-50 dark:bg-zinc-900/50 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none transition-colors ${errors.name ? 'border-red-500 border focus:border-red-500 placeholder:text-red-500/70' : 'border border-zinc-200 dark:border-zinc-800 focus:border-[#00E599]'}`}
                    placeholder={errors.name || "e.g. PT Indofood Sukses"}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Phone Number *</label>
                  <input name="phone" value={formData.phone} onChange={handleChange}
                    className={`w-full bg-zinc-50 dark:bg-zinc-900/50 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none transition-colors ${errors.phone ? 'border-red-500 border focus:border-red-500 placeholder:text-red-500/70' : 'border border-zinc-200 dark:border-zinc-800 focus:border-[#00E599]'}`}
                    placeholder={errors.phone || "021-xxxx-xxxx"}
                  />
                </div>
              </div>

              {/* Baris 2: Address (Full Width) */}
              <div className="space-y-1.5">
                <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Address *</label>
                <input name="address" value={formData.address} onChange={handleChange}
                  className={`w-full bg-zinc-50 dark:bg-zinc-900/50 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none transition-colors ${errors.address ? 'border-red-500 border focus:border-red-500 placeholder:text-red-500/70' : 'border border-zinc-200 dark:border-zinc-800 focus:border-[#00E599]'}`}
                  placeholder={errors.address || "Full address..."}
                />
              </div>

              {/* Baris 3: Lat & Lng */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Latitude</label>
                  <input name="lat" value={formData.lat} onChange={handleChange}
                    className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#00E599] transition-colors"
                    placeholder="-6.200000"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Longitude</label>
                  <input name="lng" value={formData.lng} onChange={handleChange}
                    className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#00E599] transition-colors"
                    placeholder="106.800000"
                  />
                </div>
              </div>

              {/* Baris 4: Category */}
              <div className="space-y-1.5">
                <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Category / Products Supplied</label>
                <input name="category" value={formData.category} onChange={handleChange}
                  className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#00E599] transition-colors"
                  placeholder="e.g. Makanan & Minuman"
                />
              </div>

              {/* Coordinates Tip Box */}
              <div className="bg-blue-50 dark:bg-zinc-900/30 border border-blue-100 dark:border-zinc-800/80 rounded-lg p-3 mt-2 flex gap-2 transition-colors">
                <div className="text-blue-500 dark:text-blue-400 mt-0.5"><MapPin size={14} /></div>
                <div>
                  <p className="text-[11px] font-bold text-blue-900 dark:text-zinc-300 transition-colors">Coordinates tip</p>
                  <p className="text-[10px] text-blue-800/70 dark:text-zinc-500 leading-relaxed mt-0.5 transition-colors">
                    Get coordinates from Google Maps by right-clicking a location → "What's here?" → copy the lat/long values shown.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800/50 mt-2 transition-colors">
                <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg text-xs font-bold bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shadow-sm">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-lg text-xs font-bold bg-[#00E599] text-zinc-950 hover:bg-[#00c985] transition-colors cursor-pointer shadow-sm">
                  {mode === "edit" ? "Save Changes" : "Save Supplier"}
                </button>
              </div>
            </form>
          </div>
        </Draggable>
      </DialogContent>
    </Dialog>
  );
}