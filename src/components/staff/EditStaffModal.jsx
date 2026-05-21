"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Draggable from "react-draggable";
import { X, Info } from "lucide-react";
import { useStaff } from "@/hooks/useStaff";

export default function EditStaffModal({ isOpen, onClose, staffData, onSuccess }) {
  const nodeRef = useRef(null);
  const { updateStaff } = useStaff();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', confirmPassword: '', role: 'Staff'
  });

  useEffect(() => {
    if (isOpen && staffData) {
      setFormData({ 
        fullName: staffData.name || '', 
        email: staffData.email || '', 
        password: '', 
        confirmPassword: '',
        role: staffData.role || 'Staff'
      });
      setErrors({});
    }
  }, [isOpen, staffData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors({});
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Required";
    if (!formData.email) newErrors.email = "Required";
    if (!formData.role) newErrors.role = "Required";
    
    // Password opsional saat edit, tapi jika diisi harus cocok
    if (formData.password && formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !staffData) return;
    
    setIsSubmitting(true);
    
    const payload = {
        name: formData.fullName,
        email: formData.email,
        role: formData.role 
    };

    if (formData.password) {
        payload.password = formData.password;
    }

    const success = await updateStaff(staffData.id, payload);
    setIsSubmitting(false);

    if (success) {
        if (onSuccess) onSuccess();
        onClose();
    } else {
        alert("Gagal mengubah data staff. Periksa kembali koneksi atau data yang digunakan.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={!isSubmitting ? onClose : undefined}>
      <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-xl [&>button]:hidden">
        <Draggable handle=".drag-area" nodeRef={nodeRef}>
          <div ref={nodeRef} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden m-0 transition-colors flex flex-col">

            <DialogHeader className="p-5 pb-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 drag-area cursor-move flex flex-row items-start justify-between select-none transition-colors">
              <div className="text-left mt-0">
                <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white transition-colors">Edit Staff Account</DialogTitle>
                <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 transition-colors">Update staff account information</DialogDescription>
              </div>
              <button type="button" onClick={onClose} disabled={isSubmitting} className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50">
                <X size={18} />
              </button>
            </DialogHeader>

            <div className="p-6">
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 mb-2 transition-colors">
                <h3 className="text-zinc-900 dark:text-white font-bold text-base mb-1 transition-colors">Staff Account</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-5 transition-colors">Modify staff details and role</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest flex justify-between transition-colors">
                        <span>Full Name *</span> {errors.fullName && <span className="text-red-500 normal-case tracking-normal">{errors.fullName}</span>}
                      </label>
                      <input name="fullName" value={formData.fullName} onChange={handleChange} disabled={isSubmitting}
                        className={`w-full bg-white dark:bg-zinc-950 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none transition-colors disabled:opacity-50 ${errors.fullName ? 'border-red-500 border focus:border-red-500 placeholder:text-red-500/70' : 'border border-zinc-200 dark:border-zinc-800 focus:border-[#00E599]'}`}
                        placeholder="e.g. Andi Saputra"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest flex justify-between transition-colors">
                        <span>Email Address *</span> {errors.email && <span className="text-red-500 normal-case tracking-normal">{errors.email}</span>}
                      </label>
                      <input name="email" type="email" value={formData.email} onChange={handleChange} disabled={isSubmitting}
                        className={`w-full bg-white dark:bg-zinc-950 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none transition-colors disabled:opacity-50 ${errors.email ? 'border-red-500 border focus:border-red-500 placeholder:text-red-500/70' : 'border border-zinc-200 dark:border-zinc-800 focus:border-[#00E599]'}`}
                        placeholder="staff@toko.id"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest flex justify-between transition-colors">
                        <span>New Password</span> {errors.password && <span className="text-red-500 normal-case tracking-normal">{errors.password}</span>}
                      </label>
                      <input name="password" type="password" value={formData.password} onChange={handleChange} disabled={isSubmitting}
                        className={`w-full bg-white dark:bg-zinc-950 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none transition-colors disabled:opacity-50 ${errors.password ? 'border-red-500 border focus:border-red-500 placeholder:text-red-500/70' : 'border border-zinc-200 dark:border-zinc-800 focus:border-[#00E599]'}`}
                        placeholder="Kosongkan jika tetap"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest flex justify-between transition-colors">
                        <span>Confirm Password</span> {errors.confirmPassword && <span className="text-red-500 normal-case tracking-normal">{errors.confirmPassword}</span>}
                      </label>
                      <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} disabled={isSubmitting}
                        className={`w-full bg-white dark:bg-zinc-950 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none transition-colors disabled:opacity-50 ${errors.confirmPassword ? 'border-red-500 border focus:border-red-500 placeholder:text-red-500/70' : 'border border-zinc-200 dark:border-zinc-800 focus:border-[#00E599]'}`}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>                 
                  
                  <div className="flex justify-center gap-3 pt-4">
                    <button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 py-2.5 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50">
                      Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-lg text-sm font-bold bg-[#00E599] text-zinc-950 hover:bg-[#00c985] transition-colors cursor-pointer shadow-sm flex items-center gap-2 disabled:opacity-70">
                      {isSubmitting ? <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span> : null}
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Draggable>
      </DialogContent>
    </Dialog>
  );
}