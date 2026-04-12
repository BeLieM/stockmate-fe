"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Draggable from "react-draggable";
import { X, Info } from "lucide-react";
// import Cookies from 'js-cookie'; 

export default function StaffFormModal({ isOpen, onClose }) {
  const nodeRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', confirmPassword: '', phone: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({ fullName: '', email: '', password: '', confirmPassword: '', phone: '' });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors({});
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Required";
    if (!formData.email) newErrors.email = "Required";
    if (!formData.password) newErrors.password = "Required";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  /* // ==========================================
     // KODE API PRODUCTION (ADD STAFF)
     // ==========================================
  const handleSubmitAPI = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = Cookies.get("stockmate_token");

      const response = await fetch(`${API_URL}/staff`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || null,
          role: "Staff" // Hardcoded role based on design
        })
      });

      if (!response.ok) throw new Error("Gagal mendaftarkan staff");
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };
  */

  const handleSubmitSlicing = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log("[SLICING MODE] Add New Staff:", formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-xl [&>button]:hidden">
        <Draggable handle=".drag-area" nodeRef={nodeRef}>
          <div ref={nodeRef} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden m-0 transition-colors flex flex-col">

            <DialogHeader className="p-5 pb-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 drag-area cursor-move flex flex-row items-start justify-between select-none transition-colors">
              <div className="text-left mt-0">
                <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white transition-colors">Add New Staff</DialogTitle>
                <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 transition-colors">Create a staff account</DialogDescription>
              </div>
              <button type="button" onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </DialogHeader>

            <div className="p-6">
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 mb-2 transition-colors">
                <h3 className="text-zinc-900 dark:text-white font-bold text-base mb-1 transition-colors">Staff Account</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-5 transition-colors">Staff accounts are used to access the StockMate mobile app</p>

                <form onSubmit={handleSubmitSlicing} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest flex justify-between transition-colors">
                        <span>Full Name *</span> {errors.fullName && <span className="text-red-500 normal-case tracking-normal">{errors.fullName}</span>}
                      </label>
                      <input name="fullName" value={formData.fullName} onChange={handleChange}
                        className={`w-full bg-white dark:bg-zinc-950 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none transition-colors ${errors.fullName ? 'border-red-500 border focus:border-red-500 placeholder:text-red-500/70' : 'border border-zinc-200 dark:border-zinc-800 focus:border-[#00E599]'}`}
                        placeholder="e.g. Andi Saputra"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest flex justify-between transition-colors">
                        <span>Email Address *</span> {errors.email && <span className="text-red-500 normal-case tracking-normal">{errors.email}</span>}
                      </label>
                      <input name="email" type="email" value={formData.email} onChange={handleChange}
                        className={`w-full bg-white dark:bg-zinc-950 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none transition-colors ${errors.email ? 'border-red-500 border focus:border-red-500 placeholder:text-red-500/70' : 'border border-zinc-200 dark:border-zinc-800 focus:border-[#00E599]'}`}
                        placeholder="staff@toko.id"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest flex justify-between transition-colors">
                        <span>Password *</span> {errors.password && <span className="text-red-500 normal-case tracking-normal">{errors.password}</span>}
                      </label>
                      <input name="password" type="password" value={formData.password} onChange={handleChange}
                        className={`w-full bg-white dark:bg-zinc-950 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none transition-colors ${errors.password ? 'border-red-500 border focus:border-red-500 placeholder:text-red-500/70' : 'border border-zinc-200 dark:border-zinc-800 focus:border-[#00E599]'}`}
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest flex justify-between transition-colors">
                        <span>Confirm Password *</span> {errors.confirmPassword && <span className="text-red-500 normal-case tracking-normal">{errors.confirmPassword}</span>}
                      </label>
                      <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange}
                        className={`w-full bg-white dark:bg-zinc-950 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none transition-colors ${errors.confirmPassword ? 'border-red-500 border focus:border-red-500 placeholder:text-red-500/70' : 'border border-zinc-200 dark:border-zinc-800 focus:border-[#00E599]'}`}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Phone Number (Optional)</label>
                    <input name="phone" value={formData.phone} onChange={handleChange}
                      className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#00E599] transition-colors"
                      placeholder="08xx-xxxx-xxxx"
                    />
                  </div>

                  {/* Info Box */}
                  <div className="bg-[#00c985]/10 dark:bg-[#00E599]/10 border border-[#00c985]/20 dark:border-[#00E599]/20 rounded-lg p-3 mt-4 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-[#00c985]/20 dark:bg-[#00E599]/20 p-0.5 rounded text-[#00c985] dark:text-[#00E599] transition-colors"><Info size={12} strokeWidth={3} /></div>
                      <p className="text-[#00c985] dark:text-[#00E599] text-xs font-bold transition-colors">Staff Role</p>
                    </div>
                    <p className="text-zinc-600 dark:text-[#00E599]/70 text-xs leading-relaxed transition-colors">
                      Staff accounts have mobile-only access. They can record stock in/out and view notifications but cannot manage products, suppliers, or reports.
                    </p>
                  </div>

                  <div className="flex justify-center gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                      Cancel
                    </button>
                    <button type="submit" className="px-6 py-2.5 rounded-lg text-sm font-bold bg-[#00E599] text-zinc-950 hover:bg-[#00c985] transition-colors cursor-pointer shadow-sm">
                      Create Staff Account
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