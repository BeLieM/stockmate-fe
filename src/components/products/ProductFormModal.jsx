"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Draggable from "react-draggable";
import { X } from "lucide-react";
import Cookies from 'js-cookie';
import { useProduct } from "@/hooks/useProduct";
// 🌟 IMPORT useSuppliers UNTUK MENGAMBIL DATA SUPPLIER
import { useSuppliers } from "@/hooks/useSuppliers";

export default function ProductFormModal({ isOpen, onClose, mode = "add", initialData = null, onSuccess }) {
  const nodeRef = useRef(null);
  const { addProduct, updateProduct } = useProduct();
  const { suppliers, fetchSuppliers } = useSuppliers();
  
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '', category_id: '', supplier_id: '', stock_qty: '', min_stock: '', buy_price: '', sell_price: '', unit: 'pcs'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("stockmate_token");
        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        
        const resCat = await fetch(`${API_URL}/api/category/`, { 
            headers: { "Authorization": `Bearer ${token}` } 
        });

        const dataCat = await resCat.json();
        setCategories(dataCat.data || dataCat);

        await fetchSuppliers();
      } catch (error) {
        console.error(error);
      }
    };

    if (isOpen) {
      fetchData();
      if (mode === "edit" && initialData) {
        setFormData({
          name: initialData.name,
          category_id: initialData.category_id || "",
          supplier_id: initialData.supplier_id || "",
          stock_qty: initialData.stock,
          min_stock: initialData.min,
          buy_price: initialData.buy,
          sell_price: initialData.sell,
          unit: initialData.unit
        });
      } else {
        setFormData({ name: '', category_id: '', supplier_id: '', stock_qty: '', min_stock: '', buy_price: '', sell_price: '', unit: 'pcs' });
      }
      setErrors({});
    }
  }, [isOpen, mode, initialData, fetchSuppliers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      stock_qty: parseInt(formData.stock_qty),
      min_stock: parseInt(formData.min_stock),
      buy_price: parseFloat(formData.buy_price),
      sell_price: parseFloat(formData.sell_price)
    };

    let success = false;
    if (mode === "edit") {
      success = await updateProduct(initialData.id, payload);
    } else {
      success = await addProduct(payload);
    }

    setIsSubmitting(false);
    if (success) {
      if (onSuccess) onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={!isSubmitting ? onClose : undefined}>
      <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-xl [&>button]:hidden">
        <Draggable handle=".drag-area" nodeRef={nodeRef}>
          <div ref={nodeRef} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden m-0 transition-colors flex flex-col">
            
            <DialogHeader className="p-5 pb-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 drag-area cursor-move flex flex-row items-start justify-between select-none transition-colors">
              <div className="text-left mt-0">
                <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white transition-colors">
                  {mode === "edit" ? "Edit Product" : "New Product"}
                </DialogTitle>
                <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 transition-colors">
                  {mode === "edit" ? "Update product information" : "Add a new item to your inventory"}
                </DialogDescription>
              </div>
              <button type="button" onClick={onClose} disabled={isSubmitting} className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50">
                <X size={18} />
              </button>
            </DialogHeader>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Product Name *</label>
                    <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#00E599] transition-colors" placeholder="e.g. Ayam Goreng" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Unit *</label>
                    <input name="unit" value={formData.unit} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#00E599] transition-colors" placeholder="pcs, kg, btl" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Category *</label>
                    <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#00E599] transition-colors appearance-none" required>
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Supplier *</label>
                    <select name="supplier_id" value={formData.supplier_id} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#00E599] transition-colors appearance-none" required>
                      <option value="">Select Supplier</option>
                      {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Buy Price *</label>
                    <input name="buy_price" type="number" value={formData.buy_price} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#00E599] transition-colors" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Sell Price *</label>
                    <input name="sell_price" type="number" value={formData.sell_price} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#00E599] transition-colors" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Current Stock *</label>
                    <input name="stock_qty" type="number" value={formData.stock_qty} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#00E599] transition-colors" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Min. Stock Alert *</label>
                    <input name="min_stock" type="number" value={formData.min_stock} onChange={handleChange} className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#00E599] transition-colors" required />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shadow-sm disabled:opacity-50">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#00E599] text-zinc-950 hover:bg-[#00c985] transition-colors cursor-pointer shadow-sm flex items-center gap-2">
                    {isSubmitting ? <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span> : null}
                    {isSubmitting ? "Saving..." : "Save Product"}
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