"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Draggable from "react-draggable";
import { X, ArrowUpCircle } from "lucide-react";
// import Cookies from 'js-cookie'; 

export default function StockInModal({ isOpen, onClose }) {
    const nodeRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        product: '', qty: '', supplier: '', date: '2026-03-02T10:30', note: ''
    });

    // Dummy current stock untuk preview kalkulasi
    const currentStock = 4;

    useEffect(() => {
        if (isOpen) {
            setFormData({ product: '', qty: '', supplier: '', date: '2026-03-02T10:30', note: '' });
            setErrors({});
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors({});
    };

    const validateForm = () => {
        const requiredFields = ['product', 'qty', 'date'];
        for (let i = 0; i < requiredFields.length; i++) {
            if (!formData[requiredFields[i]]) {
                setErrors({ [requiredFields[i]]: "⚠️ Required" });
                return false;
            }
        }
        setErrors({});
        return true;
    };

    /* // ==========================================
       // KODE API PRODUCTION (STOCK IN)
       // ==========================================
    const handleSubmitAPI = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const token = Cookies.get("stockmate_token");
  
        const response = await fetch(`${API_URL}/transactions/in`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
          // Sesuaikan payload dengan yang dibutuhkan backend
          body: JSON.stringify({
            product_id: formData.product,
            quantity: parseInt(formData.qty),
            supplier_id: formData.supplier || null,
            transaction_date: formData.date,
            notes: formData.note
          })
        });
  
        if (!response.ok) throw new Error("Gagal menyimpan transaksi Stock In");
        
        // Jika butuh trigger refresh tabel di parent:
        // if (onSuccess) onSuccess(); 
        
        onClose();
      } catch (error) {
        alert(error.message);
      }
    };
    */

    const handleSubmitSlicing = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        console.log("[SLICING MODE] Save Stock IN:", formData);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-xl [&>button]:hidden">
                <Draggable handle=".drag-area" nodeRef={nodeRef}>
                    <div ref={nodeRef} className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden m-0 text-white flex flex-col">

                        <div className="p-4 bg-[#00E599]/10 border-b border-[#00E599]/20 drag-area cursor-move flex items-start gap-3">
                            <ArrowUpCircle className="text-[#00E599] shrink-0 mt-0.5" size={20} />
                            <div>
                                <DialogTitle className="text-[#00E599] font-bold text-sm">Stock In Transaction</DialogTitle>
                                <DialogDescription className="text-[#00E599]/70 text-xs mt-0.5">
                                    Recording incoming goods increases the product stock quantity
                                </DialogDescription>
                            </div>
                            <button type="button" onClick={onClose} className="ml-auto p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6">
                            <h2 className="text-lg font-bold text-white mb-1">Stock In Details</h2>
                            <p className="text-zinc-500 text-xs mb-5">Select product and enter the quantity received</p>

                            <form onSubmit={handleSubmitSlicing} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block">Product *</label>
                                    <select name="product" value={formData.product} onChange={handleChange}
                                        className={`w-full bg-zinc-900/50 rounded-lg px-3 py-2 text-sm focus:outline-none appearance-none transition-colors ${errors.product ? 'border-red-500 border text-red-500' : 'border border-zinc-800 text-zinc-300 focus:border-[#00E599]'}`}
                                    >
                                        <option value="" disabled hidden>{errors.product ? "⚠️ Select a product!" : "Search and select product..."}</option>
                                        <option value="1">Mie Instan Goreng</option>
                                        <option value="2">Aqua 600ml</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block">Quantity Received *</label>
                                    <input name="qty" type="number" value={formData.qty} onChange={handleChange}
                                        className={`w-full bg-zinc-900/50 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors ${errors.qty ? 'border-red-500 border placeholder:text-red-500/70' : 'border border-zinc-800 focus:border-[#00E599]'}`}
                                        placeholder={errors.qty || "Enter quantity..."}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block">Supplier (Optional)</label>
                                    <select name="supplier" value={formData.supplier} onChange={handleChange}
                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00E599] text-zinc-300 appearance-none"
                                    >
                                        <option value="" disabled hidden>Select supplier...</option>
                                        <option value="1">PT Indofood</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block">Date & Time *</label>
                                    <input name="date" type="datetime-local" value={formData.date} onChange={handleChange}
                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00E599] text-zinc-300"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest block">Note (Optional)</label>
                                    <textarea name="note" value={formData.note} onChange={handleChange}
                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00E599] min-h-[60px] resize-none"
                                        placeholder="e.g. Restock mingguan dari supplier..."
                                    />
                                </div>

                                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-lg p-4 mt-2 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Current Stock</p>
                                        <p className="text-red-500 text-lg font-bold mt-1">{currentStock}</p>
                                    </div>
                                    <div className="text-zinc-600 font-bold text-xl">+</div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Incoming</p>
                                        <p className="text-[#00E599] text-lg font-bold mt-1">{formData.qty || 0}</p>
                                    </div>
                                    <div className="text-zinc-600 font-bold text-xl">=</div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">New Stock</p>
                                        <p className="text-white text-lg font-bold mt-1">{currentStock + (Number(formData.qty) || 0)}</p>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-xs font-bold bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 transition-colors cursor-pointer">
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-5 py-2.5 rounded-lg text-xs font-bold bg-[#00E599] text-zinc-950 hover:bg-[#00c985] transition-colors cursor-pointer flex items-center gap-2">
                                        <ArrowUpCircle size={16} /> Confirm Stock In
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Draggable>
            </DialogContent>
        </Dialog>
    );
}