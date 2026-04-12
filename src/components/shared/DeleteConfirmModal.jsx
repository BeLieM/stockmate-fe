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
    const [errorMsg, setErrorMsg] = useState(null);

    const handleConfirmClick = async () => {
        setIsLoading(true);
        setErrorMsg(null); 

        try {
            if (onConfirm) {
                await onConfirm();
            }
            onClose();
        } catch (error) {
            console.error("Failed to delete:", error);
            setErrorMsg(error.message || "Terjadi kesalahan pada server. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setErrorMsg(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={!isLoading ? handleClose : undefined}>
            <DialogContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl max-w-sm p-0 overflow-hidden [&>button]:hidden transition-colors">

                <DialogHeader className="p-5 pb-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-row items-start justify-between transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 rounded-lg transition-colors">
                            <AlertTriangle size={20} />
                        </div>
                        <div className="text-left mt-0">
                            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white transition-colors">
                                Delete {entityName}
                            </DialogTitle>
                        </div>
                    </div>
                    <button type="button" onClick={handleClose} disabled={isLoading} className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer mt-0.5 disabled:opacity-50">
                        <X size={18} />
                    </button>
                </DialogHeader>

                <div className="p-6 pb-2">
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed transition-colors">
                        Are you sure you want to delete <span className="text-zinc-900 dark:text-white font-bold">{itemName}</span>?
                        This action cannot be undone and will permanently remove this {entityName.toLowerCase()} from your system.
                    </p>

                    {/* Kotak Peringatan Error */}
                    {errorMsg && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-500 text-xs font-medium transition-colors">
                            {errorMsg}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 p-5 border-t border-zinc-200 dark:border-transparent mt-2">
                    <button onClick={handleClose} disabled={isLoading} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50 shadow-sm">
                        Cancel
                    </button>

                    <button onClick={handleConfirmClick} disabled={isLoading} className="px-5 py-2.5 rounded-lg text-sm font-bold bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600 transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-70 shadow-sm">
                        {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
                        {isLoading ? "Deleting..." : "Yes, Delete"}
                    </button>
                </div>

            </DialogContent>
        </Dialog>
    );
}