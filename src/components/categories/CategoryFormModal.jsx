"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Draggable from "react-draggable";
import { X } from "lucide-react";
// import Cookies from 'js-cookie'; 

export default function CategoryFormModal({ isOpen, onClose, mode = "add", initialData = null }) {
  const nodeRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '', description: ''
  });

  // Reset/Isi form saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setFormData(mode === "edit" && initialData ? initialData : { name: '', description: '' });
      setErrors({});
    }
  }, [isOpen, mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors({});
  };

  const validateForm = () => {
    // Hanya nama kategori yang wajib diisi
    if (!formData.name || String(formData.name).trim() === '') {
      setErrors({ name: "⚠️ Category name is required" });
      return false;
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
      const url = mode === "edit" ? `${API_URL}/categories/${initialData.id}` : `${API_URL}/categories`;
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Gagal menyimpan kategori");
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };
  */

  const handleSubmitSlicing = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log(`[SLICING MODE] Save clicked for ${mode} category:`, formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-lg [&>button]:hidden">
        <Draggable handle=".drag-area" nodeRef={nodeRef}>
          <div ref={nodeRef} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden m-0 transition-colors">

            <DialogHeader className="p-5 pb-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 drag-area cursor-move flex flex-row items-start justify-between select-none transition-colors">
              <div className="text-left mt-0">
                <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white transition-colors">
                  {mode === "edit" ? "Edit Category" : "New Category"}
                </DialogTitle>
                <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 transition-colors">
                  {mode === "edit" ? "Update category details" : "Categories help organize your products for easier management"}
                </DialogDescription>
              </div>
              <button type="button" onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer mt-0.5">
                <X size={18} />
              </button>
            </DialogHeader>

            <form onSubmit={handleSubmitSlicing} className="p-5 space-y-5">

              <div className="space-y-1.5">
                <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Category Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full bg-zinc-50 dark:bg-zinc-900/50 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-none transition-colors ${errors.name ? 'border-red-500 border focus:border-red-500 placeholder:text-red-500/70' : 'border border-zinc-200 dark:border-zinc-800 focus:border-[#00E599]'}`}
                  placeholder={errors.name || "e.g. Minuman, Sembako, Elektronik..."}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Description (Optional)</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#00E599] min-h-[100px] resize-none transition-colors"
                  placeholder="Brief description of this category..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 mt-2">
                <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shadow-sm">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#00E599] text-zinc-950 hover:bg-[#00c985] transition-colors cursor-pointer shadow-sm">
                  {mode === "edit" ? "Save Changes" : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </Draggable>
      </DialogContent>
    </Dialog>
  );
}