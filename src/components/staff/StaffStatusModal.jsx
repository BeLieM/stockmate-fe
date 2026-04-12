"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Draggable from "react-draggable";
import { Circle, Dot } from "lucide-react"; // Ikon untuk radio button custom
// import Cookies from 'js-cookie'; 

export default function StaffStatusModal({ isOpen, onClose, staffData }) {
  const nodeRef = useRef(null);
  const [selectedStatus, setSelectedStatus] = useState("Active");

  useEffect(() => {
    if (isOpen && staffData) {
      setSelectedStatus(staffData.status);
    }
  }, [isOpen, staffData]);

  /* // ==========================================
     // KODE API PRODUCTION (UPDATE STATUS)
     // ==========================================
  const handleSubmitAPI = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const token = Cookies.get("stockmate_token");

      const response = await fetch(`${API_URL}/staff/${staffData.id}/status`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus })
      });

      if (!response.ok) throw new Error("Gagal mengubah status staff");
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };
  */

  const handleSubmitSlicing = () => {
    console.log(`[SLICING MODE] Ubah status ${staffData?.name} menjadi:`, selectedStatus);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-sm [&>button]:hidden">
        <Draggable handle=".drag-area" nodeRef={nodeRef}>
          <div ref={nodeRef} className="bg-white dark:bg-[#12141A] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden m-0 transition-colors flex flex-col">

            <DialogHeader className="p-6 pb-4 border-b border-zinc-200 dark:border-zinc-800/50 drag-area cursor-move select-none transition-colors">
              <div className="text-left mt-0">
                <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white transition-colors">Edit Status Staff</DialogTitle>
                <DialogDescription className="text-zinc-500 dark:text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1 transition-colors">
                  {staffData?.name || "STAFF NAME"}
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="p-6">

              {/* Profile Card Preview */}
              <div className="bg-zinc-50 dark:bg-[#1C1F26] border border-zinc-200 dark:border-transparent rounded-xl p-4 flex items-center gap-4 mb-6 transition-colors shadow-sm">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${staffData?.color || 'bg-zinc-400 dark:bg-zinc-600'}`}>
                  {staffData?.init || 'XX'}
                </div>
                <div>
                  <p className="text-zinc-900 dark:text-white font-bold text-sm transition-colors">{staffData?.name || 'Staff Name'}</p>
                  <p className="text-zinc-500 dark:text-zinc-500 text-xs transition-colors">{staffData?.email || 'email@toko.id'}</p>
                </div>
              </div>

              <p className="text-zinc-500 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-3 transition-colors">Select Status</p>

              {/* Status Option: ACTIVE */}
              <div
                onClick={() => setSelectedStatus("Active")}
                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors mb-3 border shadow-sm ${selectedStatus === "Active"
                    ? "bg-[#00c985]/10 dark:bg-[#00E599]/10 border-[#00c985] dark:border-[#00E599]"
                    : "bg-zinc-50 dark:bg-[#1C1F26] border-zinc-200 dark:border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 transition-colors ${selectedStatus === "Active" ? "text-[#00c985] dark:text-[#00E599]" : "text-zinc-400 dark:text-zinc-600"}`}>
                    {selectedStatus === "Active" ? <Dot size={28} className="-m-1" strokeWidth={5} /> : <Circle size={20} />}
                  </div>
                  <div>
                    <p className={`font-bold text-sm transition-colors ${selectedStatus === "Active" ? "text-zinc-900 dark:text-white" : "text-zinc-600 dark:text-zinc-300"}`}>Active</p>
                    <p className="text-zinc-500 dark:text-zinc-500 font-mono text-[10px] mt-1 transition-colors">Staff bisa mengakses sistem</p>
                  </div>
                </div>
                <div className={`border text-[10px] font-bold px-3 py-1 rounded-md transition-colors ${selectedStatus === "Active" ? "border-[#00c985] text-[#00c985] dark:border-[#00E599] dark:text-[#00E599]" : "border-zinc-300 text-zinc-500 dark:border-zinc-700 dark:text-zinc-500"}`}>
                  Active
                </div>
              </div>

              {/* Status Option: SUSPENDED */}
              <div
                onClick={() => setSelectedStatus("Suspended")}
                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors mb-6 border shadow-sm ${selectedStatus === "Suspended"
                    ? "bg-red-500/10 dark:bg-red-500/10 border-red-600 dark:border-red-500"
                    : "bg-zinc-50 dark:bg-[#1C1F26] border-zinc-200 dark:border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 transition-colors ${selectedStatus === "Suspended" ? "text-red-600 dark:text-red-500" : "text-zinc-400 dark:text-zinc-600"}`}>
                    {selectedStatus === "Suspended" ? <Dot size={28} className="-m-1" strokeWidth={5} /> : <Circle size={20} />}
                  </div>
                  <div>
                    <p className={`font-bold text-sm transition-colors ${selectedStatus === "Suspended" ? "text-zinc-900 dark:text-white" : "text-zinc-600 dark:text-zinc-300"}`}>Suspended</p>
                    <p className="text-zinc-500 dark:text-zinc-500 font-mono text-[10px] mt-1 transition-colors">Staff tidak bisa mengakses sistem</p>
                  </div>
                </div>
                <div className={`border text-[10px] font-bold px-3 py-1 rounded-md transition-colors ${selectedStatus === "Suspended" ? "border-red-600 text-red-600 dark:border-red-500 dark:text-red-500" : "border-zinc-300 text-zinc-500 dark:border-zinc-700 dark:text-zinc-500"}`}>
                  Suspended
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-3 rounded-lg text-sm font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors shadow-sm">
                  Batal
                </button>
                <button onClick={handleSubmitSlicing} className="flex-1 py-3 rounded-lg text-sm font-bold bg-[#00E599] text-zinc-950 hover:bg-[#00c985] transition-colors shadow-sm">
                  Simpan
                </button>
              </div>

            </div>
          </div>
        </Draggable>
      </DialogContent>
    </Dialog>
  );
}