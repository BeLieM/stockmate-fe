"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Draggable from "react-draggable";
import { X, Target } from "lucide-react";
// import Cookies from 'js-cookie'; 

export default function RuleFormModal({ isOpen, onClose, mode = "add", initialData = null }) {
  const nodeRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    product: '', min: '', suggestion: '', alertType: 'Push Notification + Dashboard'
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setFormData({
          product: initialData.product,
          min: parseInt(initialData.min) || '',
          suggestion: parseInt(initialData.suggestion) || '',
          alertType: 'Push Notification + Dashboard'
        });
      } else {
        setFormData({ product: '', min: '', suggestion: '', alertType: 'Push Notification + Dashboard' });
      }
      setErrors({});
    }
  }, [isOpen, mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors({});
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.product) newErrors.product = "Required";
    if (!formData.min) newErrors.min = "Required";
    if (!formData.suggestion) newErrors.suggestion = "Required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  /* // ==========================================
     // KODE API PRODUCTION (SAVE RULE)
     // ==========================================
  const handleSubmitAPI = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = Cookies.get("stockmate_token");
      const url = mode === "edit" ? `${API_URL}/rules/${initialData.id}` : `${API_URL}/rules`;
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: formData.product,
          min_threshold: parseInt(formData.min),
          restock_suggestion: parseInt(formData.suggestion),
          alert_type: formData.alertType
        })
      });

      if (!response.ok) throw new Error("Gagal menyimpan aturan stok");
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };
  */

  const handleSubmitSlicing = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log(`[SLICING MODE] Save Rule (${mode}):`, formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-xl [&>button]:hidden">
        <Draggable handle=".drag-area" nodeRef={nodeRef}>
          <div ref={nodeRef} className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden m-0 transition-colors">
            
            <DialogHeader className="p-5 pb-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 drag-area cursor-move flex flex-row items-start justify-between select-none transition-colors">
              <div className="text-left mt-0">
                <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white transition-colors">
                  {mode === "edit" ? "Edit Stock Rule" : "Add Stock Rule"}
                </DialogTitle>
                <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-xs mt-1 transition-colors">
                  Configure alert threshold for a product
                </DialogDescription>
              </div>
              <button type="button" onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </DialogHeader>

            <div className="p-6">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 mb-2 transition-colors shadow-sm">
                <h3 className="text-zinc-900 dark:text-white font-bold text-base mb-1 transition-colors">Stock Rule Configuration</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-5 transition-colors">Set minimum threshold and restock suggestion for automatic alerts</p>

                <form onSubmit={handleSubmitSlicing} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest flex justify-between transition-colors">
                      Product * {errors.product && <span className="text-red-500 normal-case tracking-normal">{errors.product}</span>}
                    </label>
                    <select name="product" value={formData.product} onChange={handleChange} 
                      className={`w-full bg-zinc-50 dark:bg-zinc-950 rounded-lg px-3 py-2 text-sm focus:outline-none appearance-none transition-colors ${errors.product ? 'border-red-500 border focus:border-red-500 text-red-500' : 'border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-300 focus:border-[#00E599] dark:focus:border-[#00E599]'}`}
                    >
                      <option value="" disabled hidden>Select product...</option>
                      <option value="Mie Instan Goreng">Mie Instan Goreng</option>
                      <option value="Aqua 600ml">Aqua 600ml</option>
                      <option value="Deterjen Rinso">Deterjen Rinso</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest flex justify-between transition-colors">
                      Minimum Stock Threshold * {errors.min && <span className="text-red-500 normal-case tracking-normal">{errors.min}</span>}
                    </label>
                    <input name="min" type="number" value={formData.min} onChange={handleChange} 
                      className={`w-full bg-zinc-50 dark:bg-zinc-950 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors ${errors.min ? 'border-red-500 border focus:border-red-500 placeholder:text-red-500/70' : 'border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-300 focus:border-[#00E599]'}`} 
                      placeholder="e.g. 20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest flex justify-between transition-colors">
                      Restock Suggestion Quantity * {errors.suggestion && <span className="text-red-500 normal-case tracking-normal">{errors.suggestion}</span>}
                    </label>
                    <input name="suggestion" type="number" value={formData.suggestion} onChange={handleChange} 
                      className={`w-full bg-zinc-50 dark:bg-zinc-950 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors ${errors.suggestion ? 'border-red-500 border focus:border-red-500 placeholder:text-red-500/70' : 'border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-300 focus:border-[#00E599]'}`} 
                      placeholder="e.g. 50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Alert Type</label>
                    <select name="alertType" value={formData.alertType} onChange={handleChange} 
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00E599] text-zinc-900 dark:text-zinc-300 appearance-none transition-colors"
                    >
                      <option value="Push Notification + Dashboard">Push Notification + Dashboard</option>
                      <option value="Dashboard Only">Dashboard Only</option>
                    </select>
                  </div>

                  {/* Dynamic Rule Preview Box */}
                  <div className="bg-[#00E599]/10 border border-[#00E599]/30 rounded-lg p-3 mt-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="bg-[#00c985] dark:bg-[#00E599]/20 p-0.5 rounded text-white dark:text-[#00E599]"><Target size={12} strokeWidth={3} /></div>
                      <p className="text-[#00c985] dark:text-[#00E599] text-xs font-bold">Rule Preview</p>
                    </div>
                    <p className="text-zinc-600 dark:text-[#00E599]/70 text-xs leading-relaxed transition-colors">
                      When stock of <strong className="text-zinc-900 dark:text-white">[{formData.product || 'Product'}]</strong> drops below <strong className="text-[#00c985] dark:text-[#00E599]">[{formData.min || 'Threshold'}]</strong> units, the system will alert all staff via push notification and recommend restocking <strong className="text-[#00c985] dark:text-[#00E599]">[{formData.suggestion || 'Suggestion'}]</strong> units.
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                      Cancel
                    </button>
                    <button type="submit" className="px-5 py-2.5 rounded-lg text-sm font-bold bg-[#00E599] text-zinc-950 hover:bg-[#00c985] transition-colors cursor-pointer shadow-sm">
                      Save Rule
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