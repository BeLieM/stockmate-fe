"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Draggable from "react-draggable";
import { X } from "lucide-react";
import { useSuppliers } from "@/hooks/useSuppliers";

export default function SupplierFormModal({ isOpen, onClose, mode = "add", initialData = null, onSuccess }) {
  const nodeRef = useRef(null);
  const { addSupplier, updateSupplier } = useSuppliers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '', phone: '', address: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(mode === "edit" && initialData ? initialData : {
        name: '', phone: '', address: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address
    };

    let success = false;
    if (mode === "edit") {
        success = await updateSupplier(initialData.id, payload);
    } else {
        success = await addSupplier(payload);
    }

    setIsSubmitting(false);

    if (success) {
        if (onSuccess) onSuccess();
        onClose();
    } else {
        alert("Gagal menyimpan data supplier. Silakan coba lagi.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={!isSubmitting ? onClose : undefined}>
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
              <button type="button" onClick={onClose} disabled={isSubmitting} className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50">
                <X size={18} />
              </button>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Supplier Name *</label>
                  <input name="name" value={formData.name} onChange={handleChange} disabled={isSubmitting}
                    className={`w-full bg-zinc-50 dark:bg-zinc-900/50 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none transition-colors disabled:opacity-50 ${errors.name ? 'border-red-500 border focus:border-red-500 placeholder:text-red-500/70' : 'border border-zinc-200 dark:border-zinc-800 focus:border-[#00E599]'}`}
                    placeholder={errors.name || "e.g. PT Indofood Sukses"}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Phone Number *</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} disabled={isSubmitting}
                    className={`w-full bg-zinc-50 dark:bg-zinc-900/50 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none transition-colors disabled:opacity-50 ${errors.phone ? 'border-red-500 border focus:border-red-500 placeholder:text-red-500/70' : 'border border-zinc-200 dark:border-zinc-800 focus:border-[#00E599]'}`}
                    placeholder={errors.phone || "021-xxxx-xxxx"}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Address *</label>
                <input name="address" value={formData.address} onChange={handleChange} disabled={isSubmitting}
                  className={`w-full bg-zinc-50 dark:bg-zinc-900/50 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none transition-colors disabled:opacity-50 ${errors.address ? 'border-red-500 border focus:border-red-500 placeholder:text-red-500/70' : 'border border-zinc-200 dark:border-zinc-800 focus:border-[#00E599]'}`}
                  placeholder={errors.address || "Full address..."}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800/50 mt-2 transition-colors">
                <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2 rounded-lg text-xs font-bold bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shadow-sm disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 rounded-lg text-xs font-bold bg-[#00E599] text-zinc-950 hover:bg-[#00c985] transition-colors cursor-pointer shadow-sm flex items-center gap-2 disabled:opacity-70">
                  {isSubmitting ? <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span> : null}
                  {isSubmitting ? "Saving..." : (mode === "edit" ? "Save Changes" : "Save Supplier")}
                </button>
              </div>
            </form>
          </div>
        </Draggable>
      </DialogContent>
    </Dialog>
  );
}