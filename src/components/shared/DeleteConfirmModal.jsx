"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, X } from "lucide-react";

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    entityName = "Item"
}) {
    const [isLoading, setIsLoading] = useState(false);

    //State untuk menyimpan pesan error dari API
    const [errorMsg, setErrorMsg] = useState(null);

    const handleConfirmClick = async () => {
        setIsLoading(true);
        setErrorMsg(null); // Reset error setiap kali tombol diklik ulang

        try {
            if (onConfirm) {
                // Menunggu proses API dari komponen Parent selesai
                await onConfirm();
            }
            // Hanya tutup modal jika proses di atas SUKSES (tidak masuk ke blok catch)
            onClose();
        } catch (error) {
            console.error("Failed to delete:", error);
            // 👇 Tangkap pesan error dari Parent dan tampilkan di Modal
            setErrorMsg(error.message || "Terjadi kesalahan pada server. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    // Reset error jika modal ditutup (misal user klik Cancel)
    const handleClose = () => {
        setErrorMsg(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={!isLoading ? handleClose : undefined}>
            <DialogContent className="bg-zinc-50 dark:bg-zinc-950 border-zinc-800 text-white max-w-sm p-0 overflow-hidden [&>button]:hidden">

                <DialogHeader className="p-5 pb-4 border-b border-zinc-800 bg-zinc-900/50 flex flex-row items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/20 dark:bg-red-500/10 text-red-500 rounded-lg">
                            <AlertTriangle size={20} />
                        </div>
                        <div className="text-left mt-0">
                            <DialogTitle className="text-lg font-bold text-white">Delete {entityName}</DialogTitle>
                        </div>
                    </div>
                    <button type="button" onClick={handleClose} disabled={isLoading} className="p-1 text-zinc-500 hover:text-white transition-colors cursor-pointer mt-0.5 disabled:opacity-50">
                        <X size={18} />
                    </button>
                </DialogHeader>

                <div className="p-6 pb-2">
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                        Are you sure you want to delete <span className="text-black dark:text-white font-bold">{itemName}</span>?
                        This action cannot be undone and will permanently remove this {entityName.toLowerCase()} from your system.
                    </p>

                    {/*Kotak Peringatan Error (Muncul jika API gagal)*/}
                    {errorMsg && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs font-medium">
                            {errorMsg}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 p-5">
                    <button onClick={handleClose} disabled={isLoading} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50">
                        Cancel
                    </button>

                    <button onClick={handleConfirmClick} disabled={isLoading} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-70">
                        {isLoading && <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>}
                        {isLoading ? "Deleting..." : "Yes, Delete"}
                    </button>
                </div>

            </DialogContent>
        </Dialog>
    );
}