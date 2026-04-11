"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Draggable from "react-draggable";
import { X } from "lucide-react";
// import Cookies from 'js-cookie'; 

export default function ProductFormModal({ isOpen, onClose, mode = "add", initialData = null, onSuccess }) {
  const nodeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  // State error sekarang hanya akan berisi MAKSIMAL 1 properti pada satu waktu
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '', category: '', buy: '', sell: '', stock: '', unit: '', min: '', supplier: '', notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setFormData(initialData);
      } else {
        setFormData({ name: '', category: '', buy: '', sell: '', stock: '', unit: '', min: '', supplier: '', notes: '' });
      }
      setErrors({});
    }
  }, [isOpen, mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Hapus error saat user mulai mengetik
    if (errors[name]) setErrors({});
  };

  // --- LOGIKA VALIDASI 1 PER 1 (Sequential) ---
  const validateForm = () => {
    // Urutan field dari kiri atas ke kanan bawah
    const requiredFields = ['name', 'category', 'buy', 'sell', 'stock', 'unit', 'min'];

    for (let i = 0; i < requiredFields.length; i++) {
      const field = requiredFields[i];
      if (!formData[field] || String(formData[field]).trim() === '') {
        // Begitu menemukan yang kosong, set error dan LANGSUNG BERHENTI (return false)
        setErrors({ [field]: "⚠️ Required field" });
        return false;
      }
    }

    setErrors({});
    return true; // Jika loop selesai tanpa berhenti, berarti form valid
  };

  /* // CONTOH KODE API PRODUCTION
  const handleSubmitAPI = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = Cookies.get("stockmate_token");
      const url = mode === "edit" ? `${API_URL}/products/${initialData.id}` : `${API_URL}/products`;
      const method = mode === "edit" ? "PUT" : "POST";
      const response = await fetch(url, {
        method: method,
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error("Gagal menyimpan produk");
      if (onSuccess) onSuccess(); 
      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  */

  const handleSubmitDummy = (e) => {
    e.preventDefault();

    // Jika validasi gagal, hentikan fungsi save
    if (!validateForm()) return;

    setIsLoading(true);
    console.log(`Menyimpan Data (${mode}):`, formData);

    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? onClose : undefined}>
      <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-xl [&>button]:hidden">
        <Draggable handle=".drag-area" nodeRef={nodeRef}>
          <div ref={nodeRef} className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden m-0 text-white">

            <DialogHeader className="p-5 pb-4 border-b border-zinc-800 bg-zinc-900/50 drag-area cursor-move flex flex-row items-start justify-between select-none">
              <div className="text-left mt-0">
                <DialogTitle className="text-lg font-bold text-white">
                  {mode === "edit" ? "Edit Product" : "Add New Product"}
                </DialogTitle>
                <p className="text-zinc-500 text-xs mt-1">
                  {mode === "edit" ? "Update product details below" : "Enter required fields to add a new product"}
                </p>
              </div>
              <button type="button" onClick={onClose} disabled={isLoading} className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50">
                <X size={18} />
              </button>
            </DialogHeader>

            <form onSubmit={handleSubmitDummy} className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">

                {/* 1. PRODUCT NAME */}
                <div className="space-y-1.5">
                  <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block">Product Name *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    // Tambahan class placeholder:text-red-400 jika error
                    className={`w-full bg-zinc-900/50 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors disabled:opacity-50 ${errors.name ? 'border-red-500 border focus:border-red-500 placeholder:text-red-500/70' : 'border border-zinc-800 focus:border-[#00E599]'}`}
                    // Dynamic Placeholder
                    placeholder={errors.name ? errors.name : "e.g. Indomie Goreng"}
                  />
                </div>

                {/* 2. CATEGORY (Select khusus) */}
                <div className="space-y-1.5">
                  <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full bg-zinc-900/50 rounded-lg px-3 py-2 text-sm focus:outline-none appearance-none transition-colors disabled:opacity-50 ${errors.category ? 'border-red-500 border text-red-500 focus:border-red-500' : 'border border-zinc-800 text-zinc-300 focus:border-[#00E599]'}`}
                  >
                    {/* Jika error, ubah teks opsi defaultnya */}
                    <option value="" disabled hidden>{errors.category ? "⚠️ Select a category!" : "Select category..."}</option>
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Kebersihan">Kebersihan</option>
                    <option value="Sembako">Sembako</option>
                  </select>
                </div>

                {/* 3. BUY PRICE */}
                <div className="space-y-1.5">
                  <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block">Buy Price (Rp) *</label>
                  <input
                    name="buy" type="number"
                    value={formData.buy}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full bg-zinc-900/50 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors disabled:opacity-50 ${errors.buy ? 'border-red-500 border focus:border-red-500 placeholder:text-red-500/70' : 'border border-zinc-800 focus:border-[#00E599]'}`}
                    placeholder={errors.buy ? errors.buy : "0"}
                  />
                </div>

                {/* 4. SELL PRICE */}
                <div className="space-y-1.5">
                  <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block">Sell Price (Rp) *</label>
                  <input
                    name="sell" type="number"
                    value={formData.sell}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full bg-zinc-900/50 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors disabled:opacity-50 ${errors.sell ? 'border-red-500 border focus:border-red-500 placeholder:text-red-500/70' : 'border border-zinc-800 focus:border-[#00E599]'}`}
                    placeholder={errors.sell ? errors.sell : "0"}
                  />
                </div>

                {/* 5. INITIAL STOCK */}
                <div className="space-y-1.5">
                  <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block">Initial Stock *</label>
                  <input
                    name="stock" type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full bg-zinc-900/50 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors disabled:opacity-50 ${errors.stock ? 'border-red-500 border focus:border-red-500 placeholder:text-red-500/70' : 'border border-zinc-800 focus:border-[#00E599]'}`}
                    placeholder={errors.stock ? errors.stock : "0"}
                  />
                </div>

                {/* 6. UNIT */}
                <div className="space-y-1.5">
                  <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block">Unit *</label>
                  <input
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full bg-zinc-900/50 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors disabled:opacity-50 ${errors.unit ? 'border-red-500 border focus:border-red-500 placeholder:text-red-500/70' : 'border border-zinc-800 focus:border-[#00E599]'}`}
                    placeholder={errors.unit ? errors.unit : "e.g. pcs, btl, kg"}
                  />
                </div>

                {/* 7. MINIMUM STOCK */}
                <div className="space-y-1.5">
                  <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block">Min Stock Alert *</label>
                  <input
                    name="min" type="number"
                    value={formData.min}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full bg-zinc-900/50 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors disabled:opacity-50 ${errors.min ? 'border-red-500 border focus:border-red-500 placeholder:text-red-500/70' : 'border border-zinc-800 focus:border-[#00E599]'}`}
                    placeholder={errors.min ? errors.min : "0"}
                  />
                </div>

                {/* SUPPLIER (Optional) */}
                <div className="space-y-1.5">
                  <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block">Supplier (Optional)</label>
                  <select
                    name="supplier"
                    value={formData.supplier || ''}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00E599] text-zinc-300 appearance-none disabled:opacity-50"
                  >
                    <option value="" disabled hidden>Select supplier...</option>
                    <option value="PT Indofood">PT Indofood</option>
                    <option value="PT Wings">PT Wings</option>
                  </select>
                </div>
              </div>

              {/* NOTES (Optional) */}
              <div className="space-y-1.5">
                <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block">Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00E599] min-h-[60px] resize-none disabled:opacity-50"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/50 mt-2">
                <button type="button" onClick={onClose} disabled={isLoading} className="px-5 py-2 rounded-lg text-xs font-bold bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={isLoading} className="px-5 py-2 rounded-lg text-xs font-bold bg-[#00E599] text-zinc-950 hover:bg-[#00c985] transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-70">
                  {isLoading ? <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span> : null}
                  {isLoading ? "Saving..." : (mode === "edit" ? "Save Changes" : "Save Product")}
                </button>
              </div>
            </form>
          </div>
        </Draggable>
      </DialogContent>
    </Dialog>
  );
}