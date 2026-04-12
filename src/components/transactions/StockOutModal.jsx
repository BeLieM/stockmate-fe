"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Draggable from "react-draggable";
import { X, ArrowDownCircle, AlertTriangle } from "lucide-react";
// import Cookies from 'js-cookie'; 

export default function StockOutModal({ isOpen, onClose }) {
    const nodeRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        product: '', qty: '', reason: 'Sales / Penjualan', date: '2026-03-02T10:30', note: ''
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({ product: '', qty: '', reason: 'Sales / Penjualan', date: '2026-03-02T10:30', note: '' });
            setErrors({});
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors({});
    };

    const validateForm = () => {
        const requiredFields = ['product', 'qty', 'reason', 'date'];
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
       // KODE API PRODUCTION (STOCK OUT)
       // ==========================================
    const handleSubmitAPI = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const token = Cookies.get("stockmate_token");
  
        const response = await fetch(`${API_URL}/transactions/out`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: formData.product,
            quantity: parseInt(formData.qty),
            reason: formData.reason,
            transaction_date: formData.date,
            notes: formData.note
          })
        });
  
        if (!response.ok) throw new Error("Gagal menyimpan transaksi Stock Out");
        onClose();
      } catch (error) {
        alert(error.message);
      }
    };
    */

    const handleSubmitSlicing = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        console.log("[SLICING MODE] Save Stock OUT:", formData);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-xl [&>button]:hidden">
                <Draggable handle=".drag-area" nodeRef={nodeRef}>
                    <div ref={nodeRef} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden m-0 transition-colors flex flex-col">

                        <div className="p-4 bg-[#4DA6FF]/10 border-b border-[#4DA6FF]/20 drag-area cursor-move flex items-start gap-3 transition-colors">
                            <ArrowDownCircle className="text-[#2b8eea] dark:text-[#4DA6FF] shrink-0 mt-0.5" size={20} />
                            <div>
                                <DialogTitle className="text-[#2b8eea] dark:text-[#4DA6FF] font-bold text-sm">Stock Out Transaction</DialogTitle>
                                <DialogDescription className="text-[#2b8eea]/80 dark:text-[#4DA6FF]/70 text-xs mt-0.5">
                                    Recording outgoing goods decreases the product stock quantity
                                </DialogDescription>
                            </div>
                            <button type="button" onClick={onClose} className="ml-auto p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-1 transition-colors">Stock Out Details</h2>
                            <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-5 transition-colors">Select product and enter the quantity sold or used</p>

                            <form onSubmit={handleSubmitSlicing} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Product *</label>
                                    <select name="product" value={formData.product} onChange={handleChange}
                                        className={`w-full bg-zinc-50 dark:bg-zinc-900/50 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-300 focus:outline-none appearance-none transition-colors ${errors.product ? 'border-red-500 border text-red-500' : 'border border-zinc-200 dark:border-zinc-800 focus:border-[#00E599] dark:focus:border-[#00E599]'}`}
                                    >
                                        <option value="" disabled hidden>{errors.product ? "⚠️ Select a product!" : "Search and select product..."}</option>
                                        <option value="1">Mie Instan Goreng</option>
                                        <option value="2">Deterjen Rinso</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Quantity Out *</label>
                                    <input name="qty" type="number" value={formData.qty} onChange={handleChange}
                                        className={`w-full bg-zinc-50 dark:bg-zinc-900/50 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none transition-colors ${errors.qty ? 'border-red-500 border placeholder:text-red-500/70' : 'border border-zinc-200 dark:border-zinc-800 focus:border-[#00E599]'}`}
                                        placeholder={errors.qty || "Enter quantity..."}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Reason *</label>
                                    <input name="reason" value={formData.reason} onChange={handleChange}
                                        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#00E599] transition-colors"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Date & Time *</label>
                                    <input name="date" type="datetime-local" value={formData.date} onChange={handleChange}
                                        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#00E599] transition-colors"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Note (Optional)</label>
                                    <textarea name="note" value={formData.note} onChange={handleChange}
                                        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#00E599] min-h-[60px] resize-none transition-colors"
                                        placeholder="e.g. Penjualan shift pagi..."
                                    />
                                </div>

                                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3 mt-2 flex gap-2 items-center transition-colors">
                                    <AlertTriangle className="text-red-600 dark:text-red-500 shrink-0" size={14} />
                                    <p className="text-[11px] font-bold text-red-600 dark:text-red-500">Warning: Stock is already critical (4 pcs). Make sure quantity out does not exceed current stock.</p>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-xs font-bold bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shadow-sm">
                                        Cancel
                                    </button>
                                    <button type="submit" className="px-5 py-2.5 rounded-lg text-xs font-bold bg-[#4DA6FF] text-zinc-950 hover:bg-[#3b93eb] transition-colors cursor-pointer flex items-center gap-2 shadow-sm">
                                        <ArrowDownCircle size={16} /> Confirm Stock Out
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