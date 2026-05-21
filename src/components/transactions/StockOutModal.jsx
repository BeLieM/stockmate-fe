"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Draggable from "react-draggable";
import { X, ArrowDownCircle, AlertTriangle } from "lucide-react";
import Cookies from 'js-cookie';
import { useTransaction } from "@/hooks/useTransaction";
import { useProduct } from "@/hooks/useProduct";

export default function StockOutModal({ isOpen, onClose, onSuccess }) {
    const nodeRef = useRef(null);
    const { addTransaction } = useTransaction();
    const { products, fetchProducts } = useProduct();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        product: '', qty: '', note: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchProducts();
            setFormData({ product: '', qty: '', note: '' });
            setErrors({});
        }
    }, [isOpen, fetchProducts]);

    const selectedProduct = products.find(p => p.id === formData.product);
    const currentStock = selectedProduct ? selectedProduct.stock_qty || selectedProduct.stock || 0 : 0;
    const isCritical = selectedProduct?.status === 'Critical';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors({});
    };

    const validateForm = () => {
        const requiredFields = ['product', 'qty'];
        for (let i = 0; i < requiredFields.length; i++) {
            if (!formData[requiredFields[i]]) {
                setErrors({ [requiredFields[i]]: "⚠️ Required" });
                return false;
            }
        }
        if (parseInt(formData.qty) <= 0) {
            setErrors({ qty: "⚠️ Must be greater than 0" });
            return false;
        }
        if (parseInt(formData.qty) > currentStock) {
            setErrors({ qty: "⚠️ Quantity exceeds current stock" });
            return false;
        }
        setErrors({});
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);

        const payloadTransaction = {
            product_id: formData.product,
            qty: parseInt(formData.qty),
            type: "OUT",
            note: formData.note || "Stock Out"
        };

        const successTransaction = await addTransaction(payloadTransaction);

        if (successTransaction) {
            try {
                const token = Cookies.get("stockmate_token");
                const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
                const newStock = currentStock - parseInt(formData.qty); 

                await fetch(`${API_URL}/api/product/${formData.product}/stock`, {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ stock_qty: newStock }) 
                });

                window.dispatchEvent(new Event('stockmate-update'));

            } catch (err) {
                console.error(err);
            }

            if (onSuccess) onSuccess();
            onClose();
        } else {
            alert("Gagal memproses Stock Out.");
        }

        setIsLoading(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={!isLoading ? onClose : undefined}>
            <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-xl [&>button]:hidden">
                <Draggable handle=".drag-area" nodeRef={nodeRef}>
                    <div ref={nodeRef} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden m-0 transition-colors flex flex-col">

                        <div className="p-4 bg-red-500/10 border-b border-red-500/20 drag-area cursor-move flex items-start gap-3 transition-colors">
                            <ArrowDownCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                            <div>
                                <DialogTitle className="text-red-500 font-bold text-sm">Stock Out Transaction</DialogTitle>
                                <DialogDescription className="text-red-500/80 text-xs mt-0.5">
                                    Recording outgoing goods decreases the product stock quantity
                                </DialogDescription>
                            </div>
                            <button type="button" onClick={onClose} disabled={isLoading} className="ml-auto p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-50">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-1 transition-colors">Stock Out Details</h2>
                            <p className="text-zinc-500 dark:text-zinc-400 text-xs mb-5 transition-colors">Select product and enter the quantity sold or used</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Product *</label>
                                    <select name="product" value={formData.product} onChange={handleChange} disabled={isLoading}
                                        className={`w-full bg-zinc-50 dark:bg-zinc-900/50 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-300 focus:outline-none appearance-none transition-colors disabled:opacity-50 ${errors.product ? 'border-red-500 border text-red-500' : 'border border-zinc-200 dark:border-zinc-800 focus:border-[#00E599]'}`}
                                    >
                                        <option value="" disabled hidden>{errors.product ? "⚠️ Select a product!" : "Search and select product..."}</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock_qty || p.stock || 0})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Quantity Out *</label>
                                    <input name="qty" type="number" value={formData.qty} onChange={handleChange} disabled={isLoading}
                                        className={`w-full bg-zinc-50 dark:bg-zinc-900/50 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none transition-colors disabled:opacity-50 ${errors.qty ? 'border-red-500 border placeholder:text-red-500/70' : 'border border-zinc-200 dark:border-zinc-800 focus:border-[#00E599]'}`}
                                        placeholder={errors.qty || "Enter quantity..."}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-widest block transition-colors">Note (Optional)</label>
                                    <textarea name="note" value={formData.note} onChange={handleChange} disabled={isLoading}
                                        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-[#00E599] min-h-[60px] resize-none transition-colors disabled:opacity-50"
                                        placeholder="e.g. Penjualan shift pagi..."
                                    />
                                </div>

                                {isCritical && (
                                    <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3 mt-2 flex gap-2 items-center transition-colors">
                                        <AlertTriangle className="text-red-600 dark:text-red-500 shrink-0" size={14} />
                                        <p className="text-[11px] font-bold text-red-600 dark:text-red-500">Warning: Stock is critical ({currentStock} pcs). Make sure quantity out does not exceed current stock.</p>
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={onClose} disabled={isLoading} className="px-5 py-2.5 rounded-lg text-xs font-bold bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shadow-sm disabled:opacity-50">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={isLoading} className="px-5 py-2.5 rounded-lg text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer flex items-center gap-2 shadow-sm disabled:opacity-70">
                                        {isLoading ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : <ArrowDownCircle size={16} />}
                                        {isLoading ? "Saving..." : "Confirm Stock Out"}
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